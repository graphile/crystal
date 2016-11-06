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
const DataLoader = require('dataloader');
const utils_1 = require('../../utils');
const pgClientFromContext_1 = require('../pgClientFromContext');
const transformPgValueIntoValue_1 = require('../transformPgValueIntoValue');
const transformValueIntoPgValue_1 = require('../transformValueIntoPgValue');
const PgObjectType_1 = require('../type/PgObjectType');
/**
 * Creates a key from some types of Postgres constraints including primary key
 * constraints and unique constraints.
 */
class PgCollectionKey {
    constructor(collection, pgConstraint) {
        this.collection = collection;
        this.pgConstraint = pgConstraint;
        // Steal the options and catalog reference from our collection ;)
        this._options = this.collection._options;
        this._pgCatalog = this.collection._pgCatalog;
        this._pgClass = this._pgCatalog.assertGetClass(this.pgConstraint.classId);
        this._pgNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId);
        this._pgKeyAttributes = this._pgCatalog.getClassAttributes(this.pgConstraint.classId, this.pgConstraint.keyAttributeNums);
        /**
         * A type used to represent a key value. Consumers can then use this
         * information to construct intelligent inputs.
         *
         * We can assume that the fields of `keyType` have the same number and order
         * as our Postgres key attributes.
         */
        this.keyType = new PgObjectType_1.default({
            // We prefix the name with an underscore because we consider this type to
            // be private. The name could change at any time.
            name: `_${this.pgConstraint.name}`,
            pgCatalog: this._pgCatalog,
            pgAttributes: new Map(this._pgKeyAttributes.map(pgAttribute => [this._options.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name, pgAttribute])),
        });
        /**
         * Creates a name based on combining all of the key attribute names seperated
         * by the word “and”.
         */
        // Note that we define `name` under `keyType`. This is so that we can use the
        // `keyType` field names when making our name instead of the plain Postgres
        // attribute names.
        this.name = Array.from(this.keyType.fields.keys()).join('_and_');
        /**
         * We don’t have a great way to get the description for a key at the moment…
         */
        this.description = undefined;
        /**
         * Because `Array.from` may potentially be an extra operation we really don’t
         * want to run in hot code paths, we cache its result here.
         *
         * @private
         */
        // TODO: Remove all references to `Array.from` from the codebase. Iterables
        // forever!
        this._keyTypeFields = Array.from(this.keyType.fields);
        /**
         * Reads a value if a user can select from this class. Batches requests to
         * the same client in the background.
         */
        this.read = (!this._pgClass.isSelectable
            ? null
            : (context, key) => this._getSelectLoader(pgClientFromContext_1.default(context)).load(key));
        /**
         * Updates a value in our Postgres database using a patch object. If no
         * value could be updated we should throw an error to let the user know.
         *
         * This method, unlike many of the other asynchronous actions in Postgres
         * collections, is not batched.
         */
        this.update = (!this._pgClass.isUpdatable
            ? null
            : (context, key, patch) => __awaiter(this, void 0, void 0, function* () {
                const client = pgClientFromContext_1.default(context);
                const updatedIdentifier = Symbol();
                const query = utils_1.sql.compile(utils_1.sql.query `
          -- Put our updated rows in a with statement so that we can select
          -- our result as JSON rows before returning it.
          with ${utils_1.sql.identifier(updatedIdentifier)} as (
            update ${utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name)}

            -- Using our patch object we construct the fields we want to set and
            -- the values we want to set them to.
            set ${utils_1.sql.join(Array.from(patch).map(([fieldName, value]) => {
                    const field = this.collection.type.fields.get(fieldName);
                    const pgAttributeName = this.collection.type.getPgAttributeNameFromFieldName(fieldName);
                    if (pgAttributeName == null)
                        throw new Error(`Cannot update field named '${fieldName}' because it does not exist in collection '${this.collection.name}'.`);
                    // Use the actual name of the Postgres attribute when
                    // comparing, not the field name which may be different.
                    return utils_1.sql.query `${utils_1.sql.identifier(pgAttributeName)} = ${transformValueIntoPgValue_1.default(field.type, value)}`;
                }), ', ')}

            where ${this._getSqlSingleKeyCondition(key)}
            returning *
          )
          select row_to_json(${utils_1.sql.identifier(updatedIdentifier)}) as object from ${utils_1.sql.identifier(updatedIdentifier)}
        `);
                const result = yield client.query(query);
                if (result.rowCount < 1)
                    throw new Error(`No values were updated in collection '${this.collection.name}' using key '${this.name}' because no values were found.`);
                // tslint:disable-next-line no-any
                return transformPgValueIntoValue_1.default(this.collection.type, result.rows[0]['object']);
            }));
        /**
         * Deletes a value in our Postgres database using a given key. If no value
         * could be deleted, an error will be thrown.
         *
         * This method, unlike many others in Postgres collections, is not batched.
         */
        this.delete = (!this._pgClass.isDeletable
            ? null
            : (context, key) => __awaiter(this, void 0, void 0, function* () {
                const client = pgClientFromContext_1.default(context);
                const deletedIdentifier = Symbol();
                // This is a pretty simple query. Delete the row that matches our key
                // and return the deleted row.
                const query = utils_1.sql.compile(utils_1.sql.query `
          with ${utils_1.sql.identifier(deletedIdentifier)} as (
            delete from ${utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name)}
            where ${this._getSqlSingleKeyCondition(key)}
            returning *
          )
          select row_to_json(${utils_1.sql.identifier(deletedIdentifier)}) as object from ${utils_1.sql.identifier(deletedIdentifier)}
        `);
                const result = yield client.query(query);
                if (result.rowCount < 1)
                    throw new Error(`No values were deleted in collection '${this.collection.name}' because no values were found.`);
                // tslint:disable-next-line no-any
                return transformPgValueIntoValue_1.default(this.collection.type, result.rows[0]['object']);
            }));
    }
    /**
     * Extracts the key value from an object. In the case of this key, we are
     * just extracting a subset of the value.
     */
    getKeyFromValue(value) {
        return new Map(this._keyTypeFields
            .map(([fieldName]) => [fieldName, value.get(fieldName)]));
    }
    /**
     * Takes a key value and transforms it into a Sql condition which can be used
     * in the `where` clause of `select`s, `update`s, and `delete`s.
     *
     * @private
     */
    _getSqlSingleKeyCondition(key) {
        return utils_1.sql.join(this._keyTypeFields.map(([fieldName, field]) => utils_1.sql.query `${utils_1.sql.identifier(field.pgAttribute.name)} = ${transformValueIntoPgValue_1.default(field.type, key.get(fieldName))}`), ' and ');
    }
    /**
     * Gets a loader for the client which will load single values using some
     * keys.
     *
     * @private
     */
    _getSelectLoader(client) {
        return new DataLoader((keys) => __awaiter(this, void 0, void 0, function* () {
            const aliasIdentifier = Symbol();
            // For every key we have, generate a select statement then combine
            // those select statements with `union all`. This approach has a
            // number of advantages:
            //
            // 1. We get our rows back in the same order as our keys.
            // 2. We can take advantage of Postgres index scans.
            //
            // The disadvantage of this approach is that when we get a lot of
            // keys, we’ll be generating and sending a fairly large query. Not
            // only will our query minimization step have more work, but it may
            // take longer for Postgres to parse. However, at this point in time
            // the tradeoffs seem good.
            // TODO: There are many ways to write this query. `union all` seems
            // like the best method at the moment of writing without data.
            // *Test this assumption*.
            // TODO: If query minimization turns out to be expensive, refactor this
            // query to remove whitespace and disable query minimization when
            // compiling.
            const query = utils_1.sql.compile(utils_1.sql.query `
          -- Select our rows as JSON objects.
          select row_to_json(${utils_1.sql.identifier(aliasIdentifier)}) as object
          from ${utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name)} as ${utils_1.sql.identifier(aliasIdentifier)}

          -- For all of our key attributes we need to test equality with a
          -- key value. If we only have one key type field, we make anoptimization.
          where ${this._keyTypeFields.length === 1
                ? utils_1.sql.query `${utils_1.sql.identifier(this._keyTypeFields[0][1].pgAttribute.name)} = any(${utils_1.sql.value(keys.map(key => key.get(this._keyTypeFields[0][0])))})`
                : utils_1.sql.query `
              (${utils_1.sql.join(this._keyTypeFields.map(([, field]) => utils_1.sql.identifier(field.pgAttribute.name)), ', ')})
              in (${utils_1.sql.join(keys.map(key => utils_1.sql.query `(${utils_1.sql.join(this._keyTypeFields.map(([fieldName, field]) => transformValueIntoPgValue_1.default(field.type, key.get(fieldName))), ', ')})`), ', ')})
            `}

          -- Throw in a limit for good measure.
          limit ${utils_1.sql.value(keys.length)}
        `);
            const { rows } = yield client.query(query);
            const values = new Map(rows.map(({ object }) => {
                const value = transformPgValueIntoValue_1.default(this.collection.type, object);
                const keyString = this._keyTypeFields.map(([fieldName]) => value.get(fieldName)).join('-');
                return [keyString, value];
            }));
            return keys.map(key => {
                const keyString = this._keyTypeFields.map(([fieldName]) => key.get(fieldName)).join('-');
                return values.get(keyString) || null;
            });
            // tslint:disable-next-line no-any
            // return rows.map(({ object }) => object == null ? null : transformPgValueIntoValue(this.collection.type, object) as any)
        }));
    }
}
__decorate([
    utils_1.memoizeMethod
], PgCollectionKey.prototype, "_getSelectLoader", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCollectionKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uS2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9jb2xsZWN0aW9uL1BnQ29sbGVjdGlvbktleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFPLFVBQVUsV0FBVyxZQUFZLENBQUMsQ0FBQTtBQUd6Qyx3QkFBbUMsYUFDbkMsQ0FBQyxDQUQrQztBQUdoRCxzQ0FBZ0Msd0JBQ2hDLENBQUMsQ0FEdUQ7QUFDeEQsNENBQXNDLDhCQUN0QyxDQUFDLENBRG1FO0FBQ3BFLDRDQUFzQyw4QkFDdEMsQ0FBQyxDQURtRTtBQUNwRSwrQkFBeUIsc0JBQ3pCLENBQUMsQ0FEOEM7QUFHL0M7OztHQUdHO0FBQ0g7SUFDRSxZQUNTLFVBQXdCLEVBQ3hCLFlBQXVFO1FBRHZFLGVBQVUsR0FBVixVQUFVLENBQWM7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQTJEO1FBR2hGLGlFQUFpRTtRQUN6RCxhQUFRLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUE7UUFDNUMsZUFBVSxHQUFjLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFBO1FBQ2xELGFBQVEsR0FBbUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNwRixpQkFBWSxHQUF1QixJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDaEcscUJBQWdCLEdBQThCLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBRXZKOzs7Ozs7V0FNRztRQUNJLFlBQU8sR0FBaUIsSUFBSSxzQkFBWSxDQUFD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