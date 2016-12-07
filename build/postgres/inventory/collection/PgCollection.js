"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pluralize = require('pluralize');
const DataLoader = require('dataloader');
const utils_1 = require('../../utils');
const PgClassObjectType_1 = require('../type/PgClassObjectType');
const pgClientFromContext_1 = require('../pgClientFromContext');
const transformPgValueIntoValue_1 = require('../transformPgValueIntoValue');
const transformValueIntoPgValue_1 = require('../transformValueIntoPgValue');
const PgCollectionPaginator_1 = require('../paginator/PgCollectionPaginator');
const PgCollectionKey_1 = require('./PgCollectionKey');
/**
 * Creates a collection object for Postgres that can be used to access the
 * data. A collection aligns fairly well with a Postgres “class” that is
 * selectable. Non-selectable classes are generally compound types.
 */
class PgCollection {
    constructor(_options, _pgCatalog, pgClass) {
        this._options = _options;
        this._pgCatalog = _pgCatalog;
        this.pgClass = pgClass;
        /**
         * Instantiate some private dependencies of our collection using our instance
         * of `PgCatalog`.
         */
        this._pgNamespace = this._pgCatalog.assertGetNamespace(this.pgClass.namespaceId);
        this._pgAttributes = this._pgCatalog.getClassAttributes(this.pgClass.id);
        /**
         * The name of this collection. A pluralized version of the class name. We
         * expect class names to be singular.
         *
         * If a class with the pluralized version of the name exists, we won’t
         * pluralize the class name.
         */
        this.name = (() => {
            const pluralName = pluralize(this.pgClass.name);
            let pluralNameExists = false;
            for (const pgNamespace of this._pgCatalog.getNamespaces())
                if (this._pgCatalog.getClassByName(pgNamespace.name, pluralName))
                    pluralNameExists = true;
            return pluralNameExists ? this.pgClass.name : pluralName;
        })();
        /**
         * The description of this collection taken from the Postgres class’s
         * comment.
         */
        this.description = this.pgClass.description;
        /**
         * Gets the type for our collection using the composite type for this class.
         * We can depend on this type having the exact same number of fields as there
         * are Postgres attributes and in the exact same order.
         */
        this.type = new PgClassObjectType_1.default(this._pgCatalog, this.pgClass, {
            // Singularize the name of our type, *unless* a class already exists in our
            // catalog with that name. If a class already has the name we will just
            // cause a conflict.
            name: (() => {
                const singularName = pluralize(this.pgClass.name, 1);
                let singularNameExists = false;
                for (const pgNamespace of this._pgCatalog.getNamespaces())
                    if (this._pgCatalog.getClassByName(pgNamespace.name, singularName))
                        singularNameExists = true;
                return singularNameExists ? this.pgClass.name : singularName;
            })(),
            renameIdToRowId: this._options.renameIdToRowId,
        });
        /**
         * An array of all the keys which can be used to uniquely identify a value
         * in our collection.
         *
         * The keys are a representation of the primary key constraints and unique
         * constraints in Postgres on the table.
         */
        this.keys = (this._pgCatalog.getConstraints()
            .filter(pgConstraint => pgConstraint.classId === this.pgClass.id)
            .map(pgConstraint => 
        // We also only want primary key constraints and unique constraints.
        pgConstraint.type === 'p' || pgConstraint.type === 'u'
            ? new PgCollectionKey_1.default(this, pgConstraint)
            : null)
            .filter(Boolean));
        /**
         * The primary key for our collection is just an instance of `CollectionKey`
         * representing the single primary key constraint in Postgres. We choose one
         * key to be our primary key so that consumers have a clear choice in what id
         * should be used.
         */
        this.primaryKey = this.keys.find(key => key.pgConstraint.type === 'p');
        this.paginator = new PgCollectionPaginator_1.default(this);
        // If we can’t insert into this class, there should be no `create`
        // function. Otherwise our `create` method is pretty basic.
        this.create = (!this.pgClass.isInsertable
            ? null
            : (context, value) => this._getInsertLoader(pgClientFromContext_1.default(context)).load(value));
    }
    /**
     * Gets a loader for inserting rows into the database. We create a
     * memoized version of this function to ensure we get consistent data
     * loaders.
     *
     * @private
     */
    _getInsertLoader(client) {
        return new DataLoader((values) => __awaiter(this, void 0, void 0, function* () {
            const insertionIdentifier = Symbol();
            // Create our insert query.
            const query = utils_1.sql.compile(utils_1.sql.query `
          with ${utils_1.sql.identifier(insertionIdentifier)} as (
            -- Start by defining our header which will be the class we are
            -- inserting into (prefixed by namespace of course).
            insert into ${utils_1.sql.identifier(this._pgNamespace.name, this.pgClass.name)}

            -- Add all of our attributes as columns to be inserted into. This is
            -- helpful in case the columns differ from what we expect.
            (${utils_1.sql.join(this._pgAttributes.map(({ name }) => utils_1.sql.identifier(name)), ', ')})

            -- Next, add all of our value tuples.
            values ${utils_1.sql.join(values.map(value => 
            // Make sure we have one value for every attribute in the class,
            // if there was no such value defined, we should just use
            // `default` and use the user’s default value.
            utils_1.sql.query `(${utils_1.sql.join(Array.from(this.type.fields).map(([fieldName, field]) => value.has(fieldName) ? transformValueIntoPgValue_1.default(field.type, value.get(fieldName)) : utils_1.sql.query `default`), ', ')})`), ', ')}

            -- Finally, return everything.
            returning *
          )
          -- We use a subquery with our insert so we can turn the result into JSON.
          select row_to_json(${utils_1.sql.identifier(insertionIdentifier)}) as object from ${utils_1.sql.identifier(insertionIdentifier)}
        `);
            const { rows } = yield client.query(query);
            // tslint:disable-next-line no-any
            return rows.map(({ object }) => transformPgValueIntoValue_1.default(this.type, object));
        }));
    }
}
__decorate([
    utils_1.memoizeMethod
], PgCollection.prototype, "_getInsertLoader", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9jb2xsZWN0aW9uL1BnQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFPLFNBQVMsV0FBVyxXQUFXLENBQUMsQ0FBQTtBQUN2QyxNQUFPLFVBQVUsV0FBVyxZQUFZLENBQUMsQ0FBQTtBQUd6Qyx3QkFBbUMsYUFDbkMsQ0FBQyxDQUQrQztBQUdoRCxvQ0FBOEIsMkJBQzlCLENBQUMsQ0FEd0Q7QUFFekQsc0NBQWdDLHdCQUNoQyxDQUFDLENBRHVEO0FBQ3hELDRDQUFzQyw4QkFDdEMsQ0FBQyxDQURtRTtBQUNwRSw0Q0FBc0MsOEJBQ3RDLENBQUMsQ0FEbUU7QUFDcEUsd0NBQWtDLG9DQUNsQyxDQUFDLENBRHFFO0FBQ3RFLGtDQUE0QixtQkFPNUIsQ0FBQyxDQVA4QztBQUUvQzs7OztHQUlHO0FBQ0g7SUFDRSxZQUNTLFFBQWlCLEVBQ2pCLFVBQXFCLEVBQ3JCLE9BQXVCO1FBRnZCLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUdoQzs7O1dBR0c7UUFDSyxpQkFBWSxHQUF1QixJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDL0Ysa0JBQWEsR0FBOEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRXRHOzs7Ozs7V0FNRztRQUNJLFNBQUksR0FBVyxDQUFDO1lBQ3JCLE1BQU0sVUFBVSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQy9DLElBQUksZ0JBQWdCLEdBQUcs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