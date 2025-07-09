type PgOid = string;
type PgName = string;
type PgAclItem = string;
type PgXid = string;
type TimestampTZ = string;
/**
 * The catalog pg_database stores information about the available databases. Databases are created with the CREATE
 * DATABASE command. Consult [managing-databases] for details about the meaning of some of the parameters.
 */
export interface PgDatabase {
    /** Row identifier */
    _id: PgOid;
    /** Database name */
    datname: PgName;
    /** Owner of the database, usually the user who created it */
    datdba: PgOid;
    /** Character encoding for this database (pg_encoding_to_char() can translate this number to the encoding name) */
    encoding: number | null;
    /**
     * If true, then this database can be cloned by any user with CREATEDB privileges; if false, then only superusers or
     * the owner of the database can clone it.
     */
    datistemplate: boolean | null;
    /**
     * If false then no one can connect to this database. This is used to protect the template0 database from being
     * altered.
     */
    datallowconn: boolean | null;
    /**
     * Sets maximum number of concurrent connections that can be made to this database. -1 means no limit, -2 indicates the
     * database is invalid.
     */
    datconnlimit: number | null;
    /**
     * All transaction IDs before this one have been replaced with a permanent (frozen) transaction ID in this database.
     * This is used to track whether the database needs to be vacuumed in order to prevent transaction ID wraparound or to
     * allow pg_xact to be shrunk. It is the minimum of the per-table pg_class.relfrozenxid values.
     */
    datfrozenxid: PgXid | null;
    /**
     * All multixact IDs before this one have been replaced with a transaction ID in this database. This is used to track
     * whether the database needs to be vacuumed in order to prevent multixact ID wraparound or to allow pg_multixact to be
     * shrunk. It is the minimum of the per-table pg_class.relminmxid values.
     */
    datminmxid: PgXid | null;
    /**
     * The default tablespace for the database. Within this database, all tables for which pg_class.reltablespace is zero
     * will be stored in this tablespace; in particular, all the non-shared system catalogs will be there.
     */
    dattablespace: PgOid | null;
    /** LC_COLLATE for this database */
    datcollate: string | null;
    /** LC_CTYPE for this database */
    datctype: string | null;
    /** Access privileges; see [ddl-priv] for details */
    datacl: ReadonlyArray<PgAclItem> | null;
    /**
     * Locale provider for this database:
     * - b = builtin,
     * - c = libc,
     * - i = icu
     *
     *
     * @remarks Only in 17.x, 16.x, 15.x
     */
    datlocprovider?: string | null | undefined;
    /**
     * Indicates that there are login event triggers defined for this database. This flag is used to avoid extra lookups on
     * the pg_event_trigger table during each backend startup. This flag is used internally by PostgreSQL and should not be
     * manually altered or read for monitoring purposes.
     *
     * @remarks Only in 17.x
     */
    dathasloginevt?: boolean | null | undefined;
    /**
     * Collation provider locale name for this database. If the provider is libc, datlocale is NULL; datcollate and
     * datctype are used instead.
     *
     * @remarks Only in 17.x
     */
    datlocale?: string | null | undefined;
    /**
     * ICU collation rules for this database
     *
     * @remarks Only in 17.x, 16.x
     */
    daticurules?: string | null | undefined;
    /**
     * Provider-specific version of the collation. This is recorded when the database is created and then checked when it
     * is used, to detect changes in the collation definition that could lead to data corruption.
     *
     * @remarks Only in 17.x, 16.x, 15.x
     */
    datcollversion?: string | null | undefined;
    /**
     * ICU locale ID for this database
     *
     * @remarks Only in 16.x, 15.x
     */
    daticulocale?: string | null | undefined;
    /**
     * Last system OID in the database; useful particularly to pg_dump
     *
     * @remarks Only in 14.x, 13.x, 12.x, 11.x, 10.x
     */
    datlastsysoid?: PgOid | null | undefined;
}
/**
 * The catalog pg_namespace stores namespaces. A namespace is the structure underlying SQL schemas: each namespace can
 * have a separate collection of relations, types, etc. without name conflicts.
 */
export interface PgNamespace {
    /** Row identifier */
    _id: PgOid;
    /** Name of the namespace */
    nspname: PgName;
    /** Owner of the namespace */
    nspowner: PgOid;
    /** Access privileges; see [ddl-priv] for details */
    nspacl: ReadonlyArray<PgAclItem> | null;
}
/**
 * The catalog pg_class describes tables and other objects that have columns or are otherwise similar to a table. This
 * includes indexes (but see also pg_index), sequences (but see also pg_sequence), views, materialized views, composite
 * types, and TOAST tables; see relkind. Below, when we mean all of these kinds of objects we speak of relations. Not
 * all of pg_class's columns are meaningful for all relation kinds.
 */
export interface PgClass {
    /** Row identifier */
    _id: PgOid;
    /** Name of the table, index, view, etc. */
    relname: PgName;
    /** The OID of the namespace that contains this relation */
    relnamespace: PgOid;
    /**
     * The OID of the data type that corresponds to this table's row type, if any; zero for indexes, sequences, and toast
     * tables, which have no pg_type entry
     */
    reltype: PgOid;
    /** For typed tables, the OID of the underlying composite type; zero for all other relations */
    reloftype: PgOid | null;
    /** Owner of the relation */
    relowner: PgOid;
    /**
     * The access method used to access this table or index. Not meaningful if the relation is a sequence or has no on-disk
     * file, except for partitioned tables, where, if set, it takes precedence over default_table_access_method when
     * determining the access method to use for partitions created when one is not specified in the creation command.
     */
    relam: PgOid | null;
    /**
     * Name of the on-disk file of this relation; zero means this is a mapped relation whose disk file name is determined
     * by low-level state
     */
    relfilenode: PgOid | null;
    /**
     * The tablespace in which this relation is stored. If zero, the database's default tablespace is implied. Not
     * meaningful if the relation has no on-disk file, except for partitioned tables, where this is the tablespace in which
     * partitions will be created when one is not specified in the creation command.
     */
    reltablespace: PgOid | null;
    /**
     * Size of the on-disk representation of this table in pages (of size BLCKSZ). This is only an estimate used by the
     * planner. It is updated by VACUUM, ANALYZE, and a few DDL commands such as CREATE INDEX.
     */
    relpages: number | null;
    /**
     * Number of live rows in the table. This is only an estimate used by the planner. It is updated by VACUUM, ANALYZE,
     * and a few DDL commands such as CREATE INDEX. If the table has never yet been vacuumed or analyzed, reltuples
     * contains -1 indicating that the row count is unknown.
     */
    reltuples: number | null;
    /**
     * Number of pages that are marked all-visible in the table's visibility map. This is only an estimate used by the
     * planner. It is updated by VACUUM, ANALYZE, and a few DDL commands such as CREATE INDEX.
     */
    relallvisible: number | null;
    /**
     * OID of the TOAST table associated with this table, zero if none. The TOAST table stores large attributes out of line
     * in a secondary table.
     */
    reltoastrelid: PgOid | null;
    /** True if this is a table and it has (or recently had) any indexes */
    relhasindex: boolean | null;
    /**
     * True if this table is shared across all databases in the cluster. Only certain system catalogs (such as pg_database)
     * are shared.
     */
    relisshared: boolean | null;
    /** p = permanent table/sequence, u = unlogged table/sequence, t = temporary table/sequence */
    relpersistence: string | null;
    /**
     * - r = ordinary table,
     * - i = index,
     * - S = sequence,
     * - t = TOAST table,
     * - v = view,
     * - m = materialized view,
     * - c = composite type,
     * - f = foreign table,
     * - p = partitioned table,
     * - I = partitioned index
     */
    relkind: string;
    /**
     * Number of user columns in the relation (system columns not counted). There must be this many corresponding entries
     * in pg_attribute. See also pg_attribute.attnum.
     */
    relnatts: number | null;
    /** Number of CHECK constraints on the table; see pg_constraint catalog */
    relchecks: number | null;
    /** True if table has (or once had) rules; see pg_rewrite catalog */
    relhasrules: boolean | null;
    /** True if table has (or once had) triggers; see pg_trigger catalog */
    relhastriggers: boolean | null;
    /** True if table or index has (or once had) any inheritance children or partitions */
    relhassubclass: boolean | null;
    /** True if table has row-level security enabled; see pg_policy catalog */
    relrowsecurity: boolean | null;
    /** True if row-level security (when enabled) will also apply to table owner; see pg_policy catalog */
    relforcerowsecurity: boolean | null;
    /** True if relation is populated (this is true for all relations other than some materialized views) */
    relispopulated: boolean | null;
    /**
     * Columns used to form replica identity for rows:
     * - d = default (primary key, if any),
     * - n = nothing,
     * - f = all columns,
     * - i = index with indisreplident set
     * (same as nothing if the index used has been dropped)
     */
    relreplident: string | null;
    /** True if table or index is a partition */
    relispartition: boolean | null;
    /**
     * All transaction IDs before this one have been replaced with a permanent (frozen) transaction ID in this table. This
     * is used to track whether the table needs to be vacuumed in order to prevent transaction ID wraparound or to allow
     * pg_xact to be shrunk. Zero (InvalidTransactionId) if the relation is not a table.
     */
    relfrozenxid: PgXid | null;
    /**
     * All multixact IDs before this one have been replaced by a transaction ID in this table. This is used to track
     * whether the table needs to be vacuumed in order to prevent multixact ID wraparound or to allow pg_multixact to be
     * shrunk. Zero (InvalidMultiXactId) if the relation is not a table.
     */
    relminmxid: PgXid | null;
    /** Access privileges; see [ddl-priv] for details */
    relacl: ReadonlyArray<PgAclItem> | null;
    /** Access-method-specific options, as keyword=value strings */
    reloptions: ReadonlyArray<string> | null;
    /** If table is a partition (see relispartition), internal representation of the partition bound */
    relpartbound: string | null;
    /**
     * For new relations being written during a DDL operation that requires a table rewrite, this contains the OID of the
     * original relation; otherwise zero. That state is only visible internally; this field should never contain anything
     * other than zero for a user-visible relation.
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x, 12.x, 11.x
     */
    relrewrite?: PgOid | null | undefined;
    /**
     * True if we generate an OID for each row of the relation
     *
     * @remarks Only in 11.x, 10.x
     */
    relhasoids?: boolean | null | undefined;
    /**
     * True if the table has (or once had) a primary key
     *
     * @remarks Only in 10.x
     */
    relhaspkey?: boolean | null | undefined;
    updatable_mask?: number | null;
}
/**
 * The catalog pg_attribute stores information about table columns. There will be exactly one pg_attribute row for
 * every column in every table in the database. (There will also be attribute entries for indexes, and indeed all
 * objects that have pg_class entries.)
 */
export interface PgAttribute {
    /** The table this column belongs to */
    attrelid: PgOid;
    /** The column name */
    attname: PgName;
    /** The data type of this column (zero for a dropped column) */
    atttypid: PgOid;
    /** A copy of pg_type.typlen of this column's type */
    attlen: number | null;
    /**
     * The number of the column. Ordinary columns are numbered from 1 up. System columns, such as ctid, have (arbitrary)
     * negative numbers.
     */
    attnum: number;
    /**
     * Always -1 in storage, but when loaded into a row descriptor in memory this might be updated to cache the offset of
     * the attribute within the row
     */
    attcacheoff: number | null;
    /**
     * atttypmod records type-specific data supplied at table creation time (for example, the maximum length of a varchar
     * column). It is passed to type-specific input functions and length coercion functions. The value will generally be -1
     * for types that do not need atttypmod.
     */
    atttypmod: number | null;
    /**
     * Number of dimensions, if the column is an array type; otherwise 0. (Presently, the number of dimensions of an array
     * is not enforced, so any nonzero value effectively means it's an array.)
     */
    attndims: number | null;
    /** A copy of pg_type.typbyval of this column's type */
    attbyval: boolean | null;
    /** A copy of pg_type.typalign of this column's type */
    attalign: string | null;
    /**
     * Normally a copy of pg_type.typstorage of this column's type. For TOAST-able data types, this can be altered after
     * column creation to control storage policy.
     */
    attstorage: string | null;
    /** This represents a not-null constraint. */
    attnotnull: boolean | null;
    /**
     * This column has a default expression or generation expression, in which case there will be a corresponding entry in
     * the pg_attrdef catalog that actually defines the expression. (Check attgenerated to determine whether this is a
     * default or a generation expression.)
     */
    atthasdef: boolean | null;
    /** If a zero byte (''), then not an identity column. Otherwise, a = generated always, d = generated by default. */
    attidentity: string | null;
    /**
     * This column has been dropped and is no longer valid. A dropped column is still physically present in the table, but
     * is ignored by the parser and so cannot be accessed via SQL.
     */
    attisdropped: boolean | null;
    /**
     * This column is defined locally in the relation. Note that a column can be locally defined and inherited
     * simultaneously.
     */
    attislocal: boolean | null;
    /**
     * The number of direct ancestors this column has. A column with a nonzero number of ancestors cannot be dropped nor
     * renamed.
     */
    attinhcount: number | null;
    /** The defined collation of the column, or zero if the column is not of a collatable data type */
    attcollation: PgOid | null;
    /**
     * attstattarget controls the level of detail of statistics accumulated for this column by ANALYZE. A zero value
     * indicates that no statistics should be collected. A null value says to use the system default statistics target. The
     * exact meaning of positive values is data type-dependent. For scalar data types, attstattarget is both the target
     * number of most common values to collect, and the target number of histogram bins to create.
     */
    attstattarget: number | null;
    /** Column-level access privileges, if any have been granted specifically on this column */
    attacl: ReadonlyArray<PgAclItem> | null;
    /** Attribute-level options, as keyword=value strings */
    attoptions: ReadonlyArray<string> | null;
    /** Attribute-level foreign data wrapper options, as keyword=value strings */
    attfdwoptions: ReadonlyArray<string> | null;
    /**
     * The current compression method of the column. Typically this is `\0` to specify use of the current default setting
     * (see [guc-default-toast-compression]). Otherwise, 'p' selects pglz compression, while 'l' selects LZ4 compression.
     * However, this field is ignored whenever attstorage does not allow compression.
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x
     */
    attcompression?: string | null | undefined;
    /**
     * This column has a value which is used where the column is entirely missing from the row, as happens when a column is
     * added with a non-volatile DEFAULT value after the row is created. The actual value used is stored in the
     * attmissingval column.
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x, 12.x, 11.x
     */
    atthasmissing?: boolean | null | undefined;
    /**
     * If a zero byte (''), then not a generated column. Otherwise, s = stored. (Other values might be added in the
     * future.)
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x, 12.x
     */
    attgenerated?: string | null | undefined;
}
/**
 * The catalog pg_constraint stores check, primary key, unique, foreign key, and exclusion constraints on tables, as
 * well as not-null constraints on domains. (Column constraints are not treated specially. Every column constraint is
 * equivalent to some table constraint.) Not-null constraints on relations are represented in the pg_attribute catalog,
 * not here.
 */
export interface PgConstraint {
    /** Row identifier */
    _id: PgOid;
    /** Constraint name (not necessarily unique!) */
    conname: PgName;
    /** The OID of the namespace that contains this constraint */
    connamespace: PgOid;
    /**
     * - c = check constraint,
     * - f = foreign key constraint,
     * - n = not-null constraint (domains only),
     * - p = primary key constraint,
     * - u = unique constraint,
     * - t = constraint trigger,
     * - x = exclusion constraint
     */
    contype: string;
    /** Is the constraint deferrable? */
    condeferrable: boolean | null;
    /** Is the constraint deferred by default? */
    condeferred: boolean | null;
    /** Has the constraint been validated? Currently, can be false only for foreign keys and CHECK constraints */
    convalidated: boolean | null;
    /** The table this constraint is on; zero if not a table constraint */
    conrelid: PgOid;
    /** The domain this constraint is on; zero if not a domain constraint */
    contypid: PgOid;
    /**
     * The index supporting this constraint, if it's a unique, primary key, foreign key, or exclusion constraint; else
     * zero
     */
    conindid: PgOid;
    /** If a foreign key, the referenced table; else zero */
    confrelid: PgOid;
    /**
     * Foreign key update action code:
     * - a = no action,
     * - r = restrict,
     * - c = cascade,
     * - n = set null,
     * - d = set default
     */
    confupdtype: string | null;
    /**
     * Foreign key deletion action code:
     * - a = no action,
     * - r = restrict,
     * - c = cascade,
     * - n = set null,
     * - d = set default
     */
    confdeltype: string | null;
    /**
     * Foreign key match type:
     * - f = full,
     * - p = partial,
     * - s = simple
     */
    confmatchtype: string | null;
    /**
     * This constraint is defined locally for the relation. Note that a constraint can be locally defined and inherited
     * simultaneously.
     */
    conislocal: boolean | null;
    /**
     * The number of direct inheritance ancestors this constraint has. A constraint with a nonzero number of ancestors
     * cannot be dropped nor renamed.
     */
    coninhcount: number | null;
    /** This constraint is defined locally for the relation. It is a non-inheritable constraint. */
    connoinherit: boolean | null;
    /** If a table constraint (including foreign keys, but not constraint triggers), list of the constrained columns */
    conkey: ReadonlyArray<number> | null;
    /** If a foreign key, list of the referenced columns */
    confkey: ReadonlyArray<number> | null;
    /** If a foreign key, list of the equality operators for PK = FK comparisons */
    conpfeqop: ReadonlyArray<PgOid> | null;
    /** If a foreign key, list of the equality operators for PK = PK comparisons */
    conppeqop: ReadonlyArray<PgOid> | null;
    /** If a foreign key, list of the equality operators for FK = FK comparisons */
    conffeqop: ReadonlyArray<PgOid> | null;
    /** If an exclusion constraint, list of the per-column exclusion operators */
    conexclop: ReadonlyArray<PgOid> | null;
    /**
     * If a check constraint, an internal representation of the expression. (It's recommended to use pg_get_constraintdef()
     * to extract the definition of a check constraint.)
     */
    conbin: string | null;
    /**
     * The corresponding constraint of the parent partitioned table, if this is a constraint on a partition; else zero
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x, 12.x, 11.x
     */
    conparentid?: PgOid | null | undefined;
    /**
     * If a foreign key with a SET NULL or SET DEFAULT delete action, the columns that will be updated. If null, all of the
     * referencing columns will be updated.
     *
     * @remarks Only in 17.x, 16.x, 15.x
     */
    confdelsetcols?: ReadonlyArray<number> | null | undefined;
    /**
     * If a check constraint, a human-readable representation of the expression
     *
     * @remarks Only in 11.x, 10.x
     */
    consrc?: string | null | undefined;
}
/**
 * The catalog pg_proc stores information about functions, procedures, aggregate functions, and window functions
 * (collectively also known as routines). See [sql-createfunction], [sql-createprocedure], and [xfunc] for more
 * information.
 */
export interface PgProc {
    /** Row identifier */
    _id: PgOid;
    /** Name of the function */
    proname: PgName;
    /** The OID of the namespace that contains this function */
    pronamespace: PgOid;
    /** Owner of the function */
    proowner: PgOid;
    /** Implementation language or call interface of this function */
    prolang: PgOid | null;
    /** Estimated execution cost (in units of [guc-cpu-operator-cost]); if proretset, this is cost per row returned */
    procost: number | null;
    /** Estimated number of result rows (zero if not proretset) */
    prorows: number | null;
    /** Data type of the variadic array parameter's elements, or zero if the function does not have a variadic parameter */
    provariadic: PgOid | null;
    /** Function is a security definer (i.e., a setuid function) */
    prosecdef: boolean | null;
    /**
     * The function has no side effects. No information about the arguments is conveyed except via the return value. Any
     * function that might throw an error depending on the values of its arguments is not leak-proof.
     */
    proleakproof: boolean | null;
    /**
     * Function returns null if any call argument is null. In that case the function won't actually be called at all.
     * Functions that are not strict must be prepared to handle null inputs.
     */
    proisstrict: boolean | null;
    /** Function returns a set (i.e., multiple values of the specified data type) */
    proretset: boolean;
    /**
     * provolatile tells whether the function's result depends only on its input arguments, or is affected by outside
     * factors. It is i for immutable functions, which always deliver the same result for the same inputs. It is s for
     * stable functions, whose results (for fixed inputs) do not change within a scan. It is v for volatile functions,
     * whose results might change at any time. (Use v also for functions with side-effects, so that calls to them cannot
     * get optimized away.)
     */
    provolatile: string | null;
    /**
     * proparallel tells whether the function can be safely run in parallel mode. It is s for functions which are safe to
     * run in parallel mode without restriction. It is r for functions which can be run in parallel mode, but their
     * execution is restricted to the parallel group leader; parallel worker processes cannot invoke these functions. It is
     * u for functions which are unsafe in parallel mode; the presence of such a function forces a serial execution plan.
     */
    proparallel: string | null;
    /** Number of input arguments */
    pronargs: number | null;
    /** Number of arguments that have defaults */
    pronargdefaults: number | null;
    /** Data type of the return value */
    prorettype: PgOid;
    /**
     * An array of the data types of the function arguments. This includes only input arguments (including INOUT and
     * VARIADIC arguments), and thus represents the call signature of the function.
     */
    proargtypes: ReadonlyArray<PgOid> | null;
    /**
     * An array of the data types of the function arguments. This includes all arguments (including OUT and INOUT
     * arguments); however, if all the arguments are IN arguments, this field will be null. Note that subscripting is
     * 1-based, whereas for historical reasons proargtypes is subscripted from 0.
     */
    proallargtypes: ReadonlyArray<PgOid> | null;
    /**
     * An array of the modes of the function arguments, encoded as i for IN arguments, o for OUT arguments, b for INOUT
     * arguments, v for VARIADIC arguments, t for TABLE arguments. If all the arguments are IN arguments, this field will
     * be null. Note that subscripts correspond to positions of proallargtypes not proargtypes.
     */
    proargmodes: ReadonlyArray<string> | null;
    /**
     * An array of the names of the function arguments. Arguments without a name are set to empty strings in the array. If
     * none of the arguments have a name, this field will be null. Note that subscripts correspond to positions of
     * proallargtypes not proargtypes.
     */
    proargnames: ReadonlyArray<string> | null;
    /**
     * Expression trees (in nodeToString() representation) for default values. This is a list with pronargdefaults
     * elements, corresponding to the last N input arguments (i.e., the last N proargtypes positions). If none of the
     * arguments have defaults, this field will be null.
     */
    proargdefaults: string | null;
    /**
     * An array of the argument/result data type(s) for which to apply transforms (from the function's TRANSFORM clause).
     * Null if none.
     */
    protrftypes: ReadonlyArray<PgOid> | null;
    /**
     * This tells the function handler how to invoke the function. It might be the actual source code of the function for
     * interpreted languages, a link symbol, a file name, or just about anything else, depending on the implementation
     * language/call convention.
     */
    prosrc: string | null;
    /** Additional information about how to invoke the function. Again, the interpretation is language-specific. */
    probin: string | null;
    /** Function's local settings for run-time configuration variables */
    proconfig: ReadonlyArray<string> | null;
    /** Access privileges; see [ddl-priv] for details */
    proacl: ReadonlyArray<PgAclItem> | null;
    /**
     * Planner support function for this function (see [xfunc-optimization]), or zero if none
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x, 12.x
     */
    prosupport?: PgOid | null | undefined;
    /**
     * f for a normal function, p for a procedure, a for an aggregate function, or w for a window function
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x, 12.x, 11.x
     */
    prokind?: string | null | undefined;
    /**
     * Pre-parsed SQL function body. This is used for SQL-language functions when the body is given in SQL-standard
     * notation rather than as a string literal. It's null in other cases.
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x
     */
    prosqlbody?: string | null | undefined;
    /**
     * Calls to this function can be simplified by this other function (see [xfunc-transform-functions])
     *
     * @remarks Only in 11.x, 10.x
     */
    protransform?: PgOid | null | undefined;
    /**
     * Function is an aggregate function
     *
     * @remarks Only in 10.x
     */
    proisagg?: boolean | null | undefined;
    /**
     * Function is a window function
     *
     * @remarks Only in 10.x
     */
    proiswindow?: boolean | null | undefined;
}
/**
 * The view pg_roles provides access to information about database roles. This is simply a publicly readable view of
 * pg_authid that blanks out the password field.
 */
export interface PgRoles {
    /** Role name */
    rolname: PgName;
    /** Role has superuser privileges */
    rolsuper: boolean | null;
    /** Role automatically inherits privileges of roles it is a member of */
    rolinherit: boolean | null;
    /** Role can create more roles */
    rolcreaterole: boolean | null;
    /** Role can create databases */
    rolcreatedb: boolean | null;
    /** Role can log in. That is, this role can be given as the initial session authorization identifier */
    rolcanlogin: boolean | null;
    /**
     * Role is a replication role. A replication role can initiate replication connections and create and drop replication
     * slots.
     */
    rolreplication: boolean | null;
    /**
     * For roles that can log in, this sets maximum number of concurrent connections this role can make. -1 means no
     * limit.
     */
    rolconnlimit: number | null;
    /** Not the password (always reads as ********) */
    rolpassword: string | null;
    /** Password expiry time (only used for password authentication); null if no expiration */
    rolvaliduntil: TimestampTZ | null;
    /** Role bypasses every row-level security policy, see [ddl-rowsecurity] for more information. */
    rolbypassrls: boolean | null;
    /** Role-specific defaults for run-time configuration variables */
    rolconfig: ReadonlyArray<string> | null;
    /** ID of role */
    _id: PgOid;
}
/**
 * The catalog pg_auth_members shows the membership relations between roles. Any non-circular set of relationships is
 * allowed.
 */
export interface PgAuthMembers {
    /** ID of a role that has a member */
    roleid: PgOid;
    /** ID of a role that is a member of roleid */
    member: PgOid;
    /** ID of the role that granted this membership */
    grantor: PgOid | null;
    /** True if member can grant membership in roleid to others */
    admin_option: boolean | null;
    /**
     * Row identifier
     *
     * @remarks Only in 17.x, 16.x
     */
    _id?: PgOid | undefined;
    /**
     * True if the member automatically inherits the privileges of the granted role
     *
     * @remarks Only in 17.x, 16.x
     */
    inherit_option?: boolean | null | undefined;
    /**
     * True if the member can SET ROLE to the granted role
     *
     * @remarks Only in 17.x, 16.x
     */
    set_option?: boolean | null | undefined;
}
/**
 * The catalog pg_type stores information about data types. Base types and enum types (scalar types) are created with
 * CREATE TYPE, and domains with CREATE DOMAIN. A composite type is automatically created for each table in the
 * database, to represent the row structure of the table. It is also possible to create composite types with CREATE
 * TYPE AS.
 */
export interface PgType {
    /** Row identifier */
    _id: PgOid;
    /** Data type name */
    typname: PgName;
    /** The OID of the namespace that contains this type */
    typnamespace: PgOid;
    /** Owner of the type */
    typowner: PgOid | null;
    /**
     * For a fixed-size type, typlen is the number of bytes in the internal representation of the type. But for a
     * variable-length type, typlen is negative. -1 indicates a varlena type (one that has a length word), -2 indicates a
     * null-terminated C string.
     */
    typlen: number | null;
    /**
     * typbyval determines whether internal routines pass a value of this type by value or by reference. typbyval had
     * better be false if typlen is not 1, 2, or 4 (or 8 on machines where Datum is 8 bytes). Variable-length types are
     * always passed by reference. Note that typbyval can be false even if the length would allow pass-by-value.
     */
    typbyval: boolean | null;
    /**
     * typtype is b for a base type, c for a composite type (e.g., a table's row type), d for a domain, e for an enum type,
     * p for a pseudo-type, r for a range type, or m for a multirange type. See also typrelid and typbasetype.
     */
    typtype: string | null;
    /**
     * typcategory is an arbitrary classification of data types that is used by the parser to determine which implicit
     * casts should be preferred. See [catalog-typcategory-table].
     */
    typcategory: string | null;
    /** True if the type is a preferred cast target within its typcategory */
    typispreferred: boolean | null;
    /**
     * True if the type is defined, false if this is a placeholder entry for a not-yet-defined type. When typisdefined is
     * false, nothing except the type name, namespace, and OID can be relied on.
     */
    typisdefined: boolean | null;
    /**
     * Character that separates two values of this type when parsing array input. Note that the delimiter is associated
     * with the array element data type, not the array data type.
     */
    typdelim: string | null;
    /**
     * If this is a composite type (see typtype), then this column points to the pg_class entry that defines the
     * corresponding table. (For a free-standing composite type, the pg_class entry doesn't really represent a table, but
     * it is needed anyway for the type's pg_attribute entries to link to.) Zero for non-composite types.
     */
    typrelid: PgOid | null;
    /**
     * If typelem is not zero then it identifies another row in pg_type, defining the type yielded by subscripting. This
     * should be zero if typsubscript is zero. However, it can be zero when typsubscript isn't zero, if the handler doesn't
     * need typelem to determine the subscripting result type. Note that a typelem dependency is considered to imply
     * physical containment of the element type in this type; so DDL changes on the element type might be restricted by the
     * presence of this type.
     */
    typelem: PgOid | null;
    /**
     * If typarray is not zero then it identifies another row in pg_type, which is the true array type having this type as
     * element
     */
    typarray: PgOid | null;
    /** Input conversion function (text format) */
    typinput: PgOid | null;
    /** Output conversion function (text format) */
    typoutput: PgOid | null;
    /** Input conversion function (binary format), or zero if none */
    typreceive: PgOid | null;
    /** Output conversion function (binary format), or zero if none */
    typsend: PgOid | null;
    /** Type modifier input function, or zero if type does not support modifiers */
    typmodin: PgOid | null;
    /** Type modifier output function, or zero to use the standard format */
    typmodout: PgOid | null;
    /** Custom [sql-analyze] function, or zero to use the standard function */
    typanalyze: PgOid | null;
    /**
     * typalign is the alignment required when storing a value of this type. It applies to storage on disk as well as most
     * representations of the value inside PostgreSQL. When multiple values are stored consecutively, such as in the
     * representation of a complete row on disk, padding is inserted before a datum of this type so that it begins on the
     * specified boundary. The alignment reference is the beginning of the first datum in the sequence. Possible values
     * are: c = char alignment, i.e., no alignment needed. s = short alignment (2 bytes on most machines). i = int
     * alignment (4 bytes on most machines). d = double alignment (8 bytes on many machines, but by no means all).
     */
    typalign: string | null;
    /**
     * typstorage tells for varlena types (those with typlen = -1) if the type is prepared for toasting and what the
     * default strategy for attributes of this type should be. Possible values are: p (plain): Values must always be stored
     * plain (non-varlena types always use this value). e (external): Values can be stored in a secondary TOAST relation
     * (if relation has one, see pg_class.reltoastrelid). m (main): Values can be compressed and stored inline. x
     * (extended): Values can be compressed and/or moved to a secondary relation. x is the usual choice for toast-able
     * types. Note that m values can also be moved out to secondary storage, but only as a last resort (e and x values are
     * moved first).
     */
    typstorage: string | null;
    /** typnotnull represents a not-null constraint on a type. Used for domains only. */
    typnotnull: boolean | null;
    /**
     * If this is a domain (see typtype), then typbasetype identifies the type that this one is based on. Zero if this type
     * is not a domain.
     */
    typbasetype: PgOid | null;
    /**
     * Domains use typtypmod to record the typmod to be applied to their base type (-1 if base type does not use a typmod).
     * -1 if this type is not a domain.
     */
    typtypmod: number | null;
    /**
     * typndims is the number of array dimensions for a domain over an array (that is, typbasetype is an array type). Zero
     * for types other than domains over array types.
     */
    typndims: number | null;
    /**
     * typcollation specifies the collation of the type. If the type does not support collations, this will be zero. A base
     * type that supports collations will have a nonzero value here, typically DEFAULT_COLLATION_OID. A domain over a
     * collatable type can have a collation OID different from its base type's, if one was specified for the domain.
     */
    typcollation: PgOid | null;
    /**
     * If typdefaultbin is not null, it is the nodeToString() representation of a default expression for the type. This is
     * only used for domains.
     */
    typdefaultbin: string | null;
    /**
     * typdefault is null if the type has no associated default value. If typdefaultbin is not null, typdefault must
     * contain a human-readable version of the default expression represented by typdefaultbin. If typdefaultbin is null
     * and typdefault is not, then typdefault is the external representation of the type's default value, which can be fed
     * to the type's input converter to produce a constant.
     */
    typdefault: string | null;
    /** Access privileges; see [ddl-priv] for details */
    typacl: ReadonlyArray<PgAclItem> | null;
    /**
     * Subscripting handler function's OID, or zero if this type doesn't support subscripting. Types that are true array
     * types have typsubscript = array_subscript_handler, but other types may have other handler functions to implement
     * specialized subscripting behavior.
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x
     */
    typsubscript?: PgOid | null | undefined;
}
/**
 * The pg_enum catalog contains entries showing the values and labels for each enum type. The internal representation
 * of a given enum value is actually the OID of its associated row in pg_enum.
 */
export interface PgEnum {
    /** Row identifier */
    _id: PgOid;
    /** The OID of the pg_type entry owning this enum value */
    enumtypid: PgOid;
    /** The sort position of this enum value within its enum type */
    enumsortorder: number;
    /** The textual label for this enum value */
    enumlabel: PgName;
}
/**
 * The catalog pg_extension stores information about the installed extensions. See [extend-extensions] for details
 * about extensions.
 */
export interface PgExtension {
    /** Row identifier */
    _id: PgOid;
    /** Name of the extension */
    extname: PgName;
    /** Owner of the extension */
    extowner: PgOid;
    /** Schema containing the extension's exported objects */
    extnamespace: PgOid | null;
    /** True if extension can be relocated to another schema */
    extrelocatable: boolean | null;
    /** Version name for the extension */
    extversion: string | null;
    /** Array of regclass OIDs for the extension's configuration table(s), or NULL if none */
    extconfig: ReadonlyArray<PgOid> | null;
    /** Array of WHERE-clause filter conditions for the extension's configuration table(s), or NULL if none */
    extcondition: ReadonlyArray<string> | null;
}
/** The catalog pg_index contains part of the information about indexes. The rest is mostly in pg_class. */
export interface PgIndex {
    /** The OID of the pg_class entry for this index */
    indexrelid: PgOid;
    /** The OID of the pg_class entry for the table this index is for */
    indrelid: PgOid;
    /**
     * The total number of columns in the index (duplicates pg_class.relnatts); this number includes both key and included
     * attributes
     */
    indnatts: number | null;
    /** If true, this is a unique index */
    indisunique: boolean | null;
    /** If true, this index represents the primary key of the table (indisunique should always be true when this is true) */
    indisprimary: boolean | null;
    /** If true, this index supports an exclusion constraint */
    indisexclusion: boolean | null;
    /** If true, the uniqueness check is enforced immediately on insertion (irrelevant if indisunique is not true) */
    indimmediate: boolean | null;
    /** If true, the table was last clustered on this index */
    indisclustered: boolean | null;
    /**
     * If true, the index is currently valid for queries. False means the index is possibly incomplete: it must still be
     * modified by INSERT/UPDATE operations, but it cannot safely be used for queries. If it is unique, the uniqueness
     * property is not guaranteed true either.
     */
    indisvalid: boolean | null;
    /**
     * If true, queries must not use the index until the xmin of this pg_index row is below their TransactionXmin event
     * horizon, because the table may contain broken HOT chains with incompatible rows that they can see
     */
    indcheckxmin: boolean | null;
    /**
     * If true, the index is currently ready for inserts. False means the index must be ignored by INSERT/UPDATE
     * operations.
     */
    indisready: boolean | null;
    /**
     * If false, the index is in process of being dropped, and should be ignored for all purposes (including HOT-safety
     * decisions)
     */
    indislive: boolean | null;
    /** If true this index has been chosen as replica identity using ALTER TABLE ... REPLICA IDENTITY USING INDEX ... */
    indisreplident: boolean | null;
    /**
     * This is an array of indnatts values that indicate which table columns this index indexes. For example, a value of 1
     * 3 would mean that the first and the third table columns make up the index entries. Key columns come before non-key
     * (included) columns. A zero in this array indicates that the corresponding index attribute is an expression over the
     * table columns, rather than a simple column reference.
     */
    indkey: ReadonlyArray<number>;
    /**
     * For each column in the index key (indnkeyatts values), this contains the OID of the collation to use for the index,
     * or zero if the column is not of a collatable data type.
     */
    indcollation: ReadonlyArray<PgOid> | null;
    /**
     * For each column in the index key (indnkeyatts values), this contains the OID of the operator class to use. See
     * pg_opclass for details.
     */
    indclass: ReadonlyArray<PgOid> | null;
    /**
     * This is an array of indnkeyatts values that store per-column flag bits. The meaning of the bits is defined by the
     * index's access method.
     */
    indoption: ReadonlyArray<number> | null;
    /**
     * Expression trees (in nodeToString() representation) for index attributes that are not simple column references. This
     * is a list with one element for each zero entry in indkey. Null if all index attributes are simple references.
     */
    indexprs: string | null;
    /** Expression tree (in nodeToString() representation) for partial index predicate. Null if not a partial index. */
    indpred: string | null;
    /**
     * The number of key columns in the index, not counting any included columns, which are merely stored and do not
     * participate in the index semantics
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x, 12.x, 11.x
     */
    indnkeyatts?: number | null | undefined;
    /**
     * This value is only used for unique indexes. If false, this unique index will consider null values distinct (so the
     * index can contain multiple null values in a column, the default PostgreSQL behavior). If it is true, it will
     * consider null values to be equal (so the index can only contain one null value in a column).
     *
     * @remarks Only in 17.x, 16.x, 15.x
     */
    indnullsnotdistinct?: boolean | null | undefined;
}
/**
 * The catalog pg_inherits records information about table and index inheritance hierarchies. There is one entry for
 * each direct parent-child table or index relationship in the database. (Indirect inheritance can be determined by
 * following chains of entries.)
 */
export interface PgInherits {
    /** The OID of the child table or index */
    inhrelid: PgOid;
    /** The OID of the parent table or index */
    inhparent: PgOid;
    /**
     * If there is more than one direct parent for a child table (multiple inheritance), this number tells the order in
     * which the inherited columns are to be arranged. The count starts at 1.
     */
    inhseqno: number | null;
    /**
     * true for a partition that is in the process of being detached; false otherwise.
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x
     */
    inhdetachpending?: boolean | null | undefined;
}
/**
 * The catalog pg_language registers languages in which you can write functions or stored procedures. See
 * [sql-createlanguage] and [xplang] for more information about language handlers.
 */
export interface PgLanguage {
    /** Row identifier */
    _id: PgOid;
    /** Name of the language */
    lanname: PgName | null;
    /** Owner of the language */
    lanowner: PgOid | null;
    /**
     * This is false for internal languages (such as SQL) and true for user-defined languages. Currently, pg_dump still
     * uses this to determine which languages need to be dumped, but this might be replaced by a different mechanism in the
     * future.
     */
    lanispl: boolean | null;
    /**
     * True if this is a trusted language, which means that it is believed not to grant access to anything outside the
     * normal SQL execution environment. Only superusers can create functions in untrusted languages.
     */
    lanpltrusted: boolean | null;
    /**
     * For noninternal languages this references the language handler, which is a special function that is responsible for
     * executing all functions that are written in the particular language. Zero for internal languages.
     */
    lanplcallfoid: PgOid | null;
    /**
     * This references a function that is responsible for executing inline anonymous code blocks ([sql-do] blocks). Zero if
     * inline blocks are not supported.
     */
    laninline: PgOid | null;
    /**
     * This references a language validator function that is responsible for checking the syntax and validity of new
     * functions when they are created. Zero if no validator is provided.
     */
    lanvalidator: PgOid | null;
    /** Access privileges; see [ddl-priv] for details */
    lanacl: ReadonlyArray<PgAclItem> | null;
}
/**
 * The catalog pg_policy stores row-level security policies for tables. A policy includes the kind of command that it
 * applies to (possibly all commands), the roles that it applies to, the expression to be added as a security-barrier
 * qualification to queries that include the table, and the expression to be added as a WITH CHECK option for queries
 * that attempt to add new records to the table.
 */
export interface PgPolicy {
    /** The name of the policy */
    polname: PgName;
    /** The table to which the policy applies */
    polrelid: PgOid;
    /**
     * The command type to which the policy is applied: r for [sql-select], a for [sql-insert], w for [sql-update], d for
     * [sql-delete], or * for all
     */
    polcmd: string | null;
    /** Is the policy permissive or restrictive? */
    polpermissive: boolean | null;
    /** The roles to which the policy is applied; zero means PUBLIC (and normally appears alone in the array) */
    polroles: ReadonlyArray<PgOid> | null;
    /** The expression tree to be added to the security barrier qualifications for queries that use the table */
    polqual: string | null;
    /** The expression tree to be added to the WITH CHECK qualifications for queries that attempt to add rows to the table */
    polwithcheck: string | null;
    /**
     * Row identifier
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x, 13.x
     */
    _id?: PgOid | undefined;
}
/** The catalog pg_range stores information about range types. This is in addition to the types' entries in pg_type. */
export interface PgRange {
    /** OID of the range type */
    rngtypid: PgOid | null;
    /** OID of the element type (subtype) of this range type */
    rngsubtype: PgOid | null;
    /** OID of the collation used for range comparisons, or zero if none */
    rngcollation: PgOid | null;
    /** OID of the subtype's operator class used for range comparisons */
    rngsubopc: PgOid | null;
    /** OID of the function to convert a range value into canonical form, or zero if none */
    rngcanonical: PgOid | null;
    /** OID of the function to return the difference between two element values as double precision, or zero if none */
    rngsubdiff: PgOid | null;
    /**
     * OID of the multirange type for this range type
     *
     * @remarks Only in 17.x, 16.x, 15.x, 14.x
     */
    rngmultitypid?: PgOid | null | undefined;
}
/**
 * The catalog pg_depend records the dependency relationships between database objects. This information allows DROP
 * commands to find which other objects must be dropped by DROP CASCADE or prevent dropping in the DROP RESTRICT case.
 */
export interface PgDepend {
    /** The OID of the system catalog the dependent object is in */
    classid: PgOid;
    /** The OID of the specific dependent object */
    objid: PgOid;
    /**
     * For a table column, this is the column number (the objid and classid refer to the table itself). For all other
     * object types, this column is zero.
     */
    objsubid: number | null;
    /** The OID of the system catalog the referenced object is in */
    refclassid: PgOid;
    /** The OID of the specific referenced object */
    refobjid: PgOid;
    /**
     * For a table column, this is the column number (the refobjid and refclassid refer to the table itself). For all other
     * object types, this column is zero.
     */
    refobjsubid: number | null;
    /** A code defining the specific semantics of this dependency relationship; see text */
    deptype: string;
}
/**
 * The catalog pg_description stores optional descriptions (comments) for each database object. Descriptions can be
 * manipulated with the COMMENT command and viewed with psql's `\d` commands. Descriptions of many built-in system
 * objects are provided in the initial contents of pg_description.
 */
export interface PgDescription {
    /** The OID of the object this description pertains to */
    objoid: PgOid;
    /** The OID of the system catalog this object appears in */
    classoid: PgOid;
    /**
     * For a comment on a table column, this is the column number (the objoid and classoid refer to the table itself). For
     * all other object types, this column is zero.
     */
    objsubid: number;
    /** Arbitrary text that serves as the description of this object */
    description: string;
}
/**
 * The catalog pg_am stores information about relation access methods. There is one row for each access method
 * supported by the system. Currently, only tables and indexes have access methods. The requirements for table and
 * index access methods are discussed in detail in [tableam] and [indexam] respectively.
 */
export interface PgAm {
    /** Row identifier */
    _id: PgOid;
    /** Name of the access method */
    amname: PgName | null;
    /** OID of a handler function that is responsible for supplying information about the access method */
    amhandler: PgOid | null;
    /** t = table (including materialized views), i = index. */
    amtype: string | null;
}
/**
 * This type contains a description of everything we care about in the database.
 */
export interface Introspection {
    database: PgDatabase;
    namespaces: Array<PgNamespace>;
    classes: Array<PgClass>;
    attributes: Array<PgAttribute>;
    constraints: Array<PgConstraint>;
    procs: Array<PgProc>;
    roles: Array<PgRoles>;
    auth_members: Array<PgAuthMembers>;
    types: Array<PgType>;
    enums: Array<PgEnum>;
    extensions: Array<PgExtension>;
    indexes: Array<PgIndex>;
    inherits: Array<PgInherits>;
    languages: Array<PgLanguage>;
    policies: Array<PgPolicy>;
    ranges: Array<PgRange>;
    depends: Array<PgDepend>;
    descriptions: Array<PgDescription>;
    am: Array<PgAm>;
    /**
     * Catalogs such as pg_class, pg_attribute, etc have oids; this loopup lets us
     * turn the OID back into the name of the underlying catalog.
     */
    catalog_by_oid: {
        [oid: string]: string;
    };
    /** The user who performed the introspection */
    current_user: string;
    /**
     * The full PostgreSQL version string, e.g.:
     * 'PostgreSQL 13.4 (Ubuntu 13.4-0ubuntu0.21.04.1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 10.3.0-1ubuntu1) 10.3.0, 64-bit'
     */
    pg_version: string;
    /** In future we might use different introspection queries; we'll bump this whenever an incompatible change takes place. */
    introspection_version: 1;
}
/**
 * A PG entity can be any entity represented in a system catalog: a table, view,
 * column, function, index, etc.
 */
export type PgEntity = PgDatabase | PgNamespace | PgClass | PgAttribute | PgConstraint | PgProc | PgRoles | PgAuthMembers | PgType | PgEnum | PgExtension | PgIndex | PgInherits | PgLanguage | PgPolicy | PgRange | PgDepend | PgDescription | PgAm;
/**
 * Builds a PostgreSQL introspection SQL query to return an object with the same shape as `Introspection` above.
 */
export declare const makeIntrospectionQuery: () => string;
export {};
//# sourceMappingURL=introspection.d.ts.map