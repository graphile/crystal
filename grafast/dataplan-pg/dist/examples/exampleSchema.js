"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPORTABLE = EXPORTABLE;
exports.makeExampleSchema = makeExampleSchema;
const tslib_1 = require("tslib");
/*
 * This is a hand-rolled GraphQL schema that we used throughout the development
 * of Grafast; it's used for the @dataplan/pg tests and demonstrates common
 * patterns as well as edge cases. This is NOT meant to be an example of how
 * _you_ should write a schema, in particular it's (deliberately) quite
 * inconsistent and has many ways of achieving the same goals. I would not
 * recommend reading it in full, but dipping in to particular places you're
 * interested in might be useful.
 */
const json_1 = require("@dataplan/json");
const crypto = tslib_1.__importStar(require("crypto"));
const fs_1 = require("fs");
const grafast_1 = require("grafast");
const graphql_1 = require("grafast/graphql");
const pg_sql2_1 = tslib_1.__importDefault(require("pg-sql2"));
const codecs_js_1 = require("../codecs.js");
const datasource_js_1 = require("../datasource.js");
const index_js_1 = require("../index.js");
const pgPageInfo_js_1 = require("../steps/pgPageInfo.js");
const pgSelect_js_1 = require("../steps/pgSelect.js");
const pgUnionAll_js_1 = require("../steps/pgUnionAll.js");
const withPgClient_js_1 = require("../steps/withPgClient.js");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function EXPORTABLE(factory, args, nameHint) {
    const fn = factory(...args);
    if ((typeof fn === "function" || (typeof fn === "object" && fn !== null)) &&
        !("$exporter$factory" in fn)) {
        Object.defineProperties(fn, {
            $exporter$args: { value: args },
            $exporter$factory: { value: factory },
            $exporter$name: { writable: true, value: nameHint },
        });
    }
    return fn;
}
/*+--------------------------------------------------------------------------+
  |                               DATA SOURCES                               |
  +--------------------------------------------------------------------------+*/
function makeExampleSchema(options = Object.create(null)) {
    const executor = EXPORTABLE((PgExecutor, context, object) => new PgExecutor({
        name: "main",
        context: () => {
            const $context = context();
            return object({
                pgSettings: $context.get("pgSettings"),
                withPgClient: $context.get("withPgClient"),
            });
        },
    }), [index_js_1.PgExecutor, grafast_1.context, grafast_1.object], "defaultPgExecutor");
    /**
     * Applies auth checks to the plan; we are using a placeholder here for now.
     */
    const selectAuth = EXPORTABLE((sql) => ($step) => {
        $step.where(sql `true /* authorization checks */`);
    }, [pg_sql2_1.default], "selectAuth");
    const registryConfig = EXPORTABLE((PgResource, TYPES, enumCodec, executor, listOfCodec, makePgResourceOptions, makeRegistryBuilder, recordCodec, selectAuth, sql, sqlFromArgDigests) => {
        const col = (options) => {
            const { notNull, codec, expression, via, identicalVia } = options;
            return {
                codec: codec,
                notNull: !!notNull,
                expression,
                via,
                identicalVia,
            };
        };
        const forumCodec = recordCodec({
            executor,
            name: "forums",
            identifier: sql `app_public.forums`,
            attributes: {
                id: col({ notNull: true, codec: TYPES.uuid }),
                name: col({ notNull: true, codec: TYPES.citext }),
                archived_at: col({ codec: TYPES.timestamptz }),
                is_archived: col({
                    codec: TYPES.boolean,
                    expression: (alias) => sql `${alias}.archived_at is not null`,
                }),
            },
        });
        const userCodec = recordCodec({
            executor,
            name: "users",
            identifier: sql `app_public.users`,
            attributes: {
                id: col({ notNull: true, codec: TYPES.uuid }),
                username: col({ notNull: true, codec: TYPES.citext }),
                gravatar_url: col({ codec: TYPES.text }),
                created_at: col({ notNull: true, codec: TYPES.timestamptz }),
            },
        });
        const messagesCodec = recordCodec({
            executor,
            name: "messages",
            identifier: sql `app_public.messages`,
            attributes: {
                id: col({ notNull: true, codec: TYPES.uuid }),
                body: col({ notNull: true, codec: TYPES.text }),
                author_id: col({
                    notNull: true,
                    codec: TYPES.uuid,
                    identicalVia: { relation: "author", attribute: "person_id" },
                }),
                forum_id: col({
                    notNull: true,
                    codec: TYPES.uuid,
                    identicalVia: { relation: "forum", attribute: "id" },
                }),
                created_at: col({ notNull: true, codec: TYPES.timestamptz }),
                archived_at: col({ codec: TYPES.timestamptz }),
                featured: col({ codec: TYPES.boolean }),
                is_archived: col({
                    codec: TYPES.boolean,
                    expression: (alias) => sql `${alias}.archived_at is not null`,
                }),
            },
        });
        const uniqueAuthorCountResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: TYPES.int,
            from: (...args) => sql `app_public.unique_author_count(${sqlFromArgDigests(args)})`,
            name: "unique_author_count",
            parameters: [
                {
                    name: "featured",
                    required: false,
                    codec: TYPES.boolean,
                },
            ],
            isUnique: true,
        });
        const forumNamesArrayResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: listOfCodec(TYPES.text),
            from: (...args) => sql `app_public.forum_names_array(${sqlFromArgDigests(args)})`,
            name: "forum_names_array",
            parameters: [],
            isUnique: true, // No setof
        });
        const forumNamesCasesResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: listOfCodec(TYPES.text),
            from: (...args) => sql `app_public.forum_names_cases(${sqlFromArgDigests(args)})`,
            name: "forum_names_cases",
            parameters: [],
        });
        const forumsUniqueAuthorCountResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: TYPES.int,
            from: (...args) => sql `app_public.forums_unique_author_count(${sqlFromArgDigests(args)})`,
            name: "forums_unique_author_count",
            parameters: [
                {
                    name: "forums",
                    required: true,
                    codec: forumCodec,
                },
                {
                    name: "featured",
                    required: false,
                    codec: TYPES.boolean,
                },
            ],
            isUnique: true,
        });
        const scalarTextResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: TYPES.text,
            from: sql `(select '')`,
            name: "text",
        });
        const messageResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: messagesCodec,
            from: sql `app_public.messages`,
            name: "messages",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const userResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: userCodec,
            from: sql `app_public.users`,
            name: "users",
            uniques: [
                { attributes: ["id"], isPrimary: true },
                { attributes: ["username"] },
            ],
        });
        const forumResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: forumCodec,
            from: sql `app_public.forums`,
            name: "forums",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const usersMostRecentForumResourceOptions = PgResource.functionResourceOptions(forumResourceOptions, {
            name: "users_most_recent_forum",
            from: (...args) => sql `app_public.users_most_recent_forum(${sqlFromArgDigests(args)})`,
            returnsArray: false,
            returnsSetof: false,
            parameters: [
                {
                    name: "u",
                    codec: userResourceOptions.codec,
                    required: true,
                    notNull: true,
                },
            ],
            selectAuth: null,
        });
        const featuredMessagesResourceOptions = PgResource.functionResourceOptions(messageResourceOptions, {
            name: "featured_messages",
            from: (...args) => sql `app_public.featured_messages(${sqlFromArgDigests(args)})`,
            returnsSetof: true,
            returnsArray: false,
            parameters: [],
        });
        const forumsFeaturedMessagesResourceOptions = PgResource.functionResourceOptions(messageResourceOptions, {
            name: "forums_featured_messages",
            from: (...args) => sql `app_public.forums_featured_messages(${sqlFromArgDigests(args)})`,
            returnsSetof: true,
            returnsArray: false,
            parameters: [
                {
                    name: "forum",
                    required: true,
                    codec: forumCodec,
                },
            ],
        });
        const randomUserArrayResourceOptions = PgResource.functionResourceOptions(userResourceOptions, {
            name: "random_user_array",
            from: (...args) => sql `app_public.random_user_array(${sqlFromArgDigests(args)})`,
            returnsArray: true,
            returnsSetof: false,
            parameters: [],
        });
        const randomUserArraySetResourceOptions = PgResource.functionResourceOptions(userResourceOptions, {
            name: "random_user_array_set",
            from: (...args) => sql `app_public.random_user_array_set(${sqlFromArgDigests(args)})`,
            returnsSetof: true,
            returnsArray: true,
            parameters: [],
        });
        const forumsMessagesListSetResourceOptions = PgResource.functionResourceOptions(messageResourceOptions, {
            name: "forums_messages_list_set",
            from: (...args) => sql `app_public.forums_messages_list_set(${sqlFromArgDigests(args)})`,
            parameters: [
                {
                    codec: forumCodec,
                    name: null,
                    required: true,
                },
            ],
            returnsArray: true,
            returnsSetof: true,
            extensions: {
                tags: {
                    name: "messagesListSet",
                },
            },
        });
        const unionEntityCodec = recordCodec({
            executor,
            name: "union__entity",
            identifier: sql `interfaces_and_unions.union__entity`,
            attributes: {
                person_id: col({ codec: TYPES.int, notNull: false }),
                post_id: col({ codec: TYPES.int, notNull: false }),
                comment_id: col({ codec: TYPES.int, notNull: false }),
            },
        });
        const personBookmarksCodec = recordCodec({
            executor,
            name: "person_bookmarks",
            identifier: sql `interfaces_and_unions.person_bookmarks`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                person_id: col({
                    codec: TYPES.int,
                    notNull: true,
                    identicalVia: { relation: "person", attribute: "id" },
                }),
                bookmarked_entity: col({
                    codec: unionEntityCodec,
                    notNull: true,
                }),
            },
        });
        const personBookmarksResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: personBookmarksCodec,
            from: sql `interfaces_and_unions.person_bookmarks`,
            name: "person_bookmarks",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const personCodec = recordCodec({
            executor,
            name: "people",
            identifier: sql `interfaces_and_unions.people`,
            attributes: {
                person_id: col({ codec: TYPES.int, notNull: true }),
                username: col({ codec: TYPES.text, notNull: true }),
            },
        });
        const personResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: personCodec,
            from: sql `interfaces_and_unions.people`,
            name: "people",
            uniques: [
                { attributes: ["person_id"], isPrimary: true },
                { attributes: ["username"] },
            ],
        });
        const postCodec = recordCodec({
            executor,
            name: "posts",
            identifier: sql `interfaces_and_unions.posts`,
            attributes: {
                post_id: col({ codec: TYPES.int, notNull: true }),
                author_id: col({
                    codec: TYPES.int,
                    notNull: true,
                    identicalVia: { relation: "author", attribute: "person_id" },
                }),
                body: col({ codec: TYPES.text, notNull: true }),
            },
        });
        const postResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: postCodec,
            from: sql `interfaces_and_unions.posts`,
            name: "posts",
            uniques: [{ attributes: ["post_id"], isPrimary: true }],
        });
        const commentCodec = recordCodec({
            executor,
            name: "comments",
            identifier: sql `interfaces_and_unions.comments`,
            attributes: {
                comment_id: col({ codec: TYPES.int, notNull: true }),
                author_id: col({
                    codec: TYPES.int,
                    notNull: true,
                    identicalVia: { relation: "author", attribute: "person_id" },
                }),
                post_id: col({
                    codec: TYPES.int,
                    notNull: true,
                    identicalVia: { relation: "post", attribute: "id" },
                }),
                body: col({ codec: TYPES.text, notNull: true }),
            },
        });
        const commentResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: commentCodec,
            from: sql `interfaces_and_unions.comments`,
            name: "comments",
            uniques: [{ attributes: ["comment_id"], isPrimary: true }],
        });
        const itemTypeEnumCodec = enumCodec({
            name: "item_type",
            identifier: sql `interfaces_and_unions.item_type`,
            values: ["TOPIC", "POST", "DIVIDER", "CHECKLIST", "CHECKLIST_ITEM"],
        });
        const enumTableItemTypeCodec = recordCodec({
            executor,
            name: "enum_table_item_type",
            identifier: sql `interfaces_and_unions.enum_table_item_type`,
            attributes: {
                type: {
                    codec: TYPES.text,
                    notNull: true,
                },
                description: {
                    codec: TYPES.text,
                    notNull: false,
                },
            },
        });
        const enumTableItemTypeResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: enumTableItemTypeCodec,
            from: sql `interfaces_and_unions.enum_table_item_type`,
            name: "enum_table_item_type",
            uniques: [{ attributes: ["type"], isPrimary: true }],
        });
        const enumTableItemTypeEnumCodec = enumCodec({
            name: "enum_table_item_type_enum",
            identifier: sql `text`,
            values: ["TOPIC", "POST", "DIVIDER", "CHECKLIST", "CHECKLIST_ITEM"],
        });
        const singleTableItemsCodec = recordCodec({
            executor,
            name: "single_table_items",
            identifier: sql `interfaces_and_unions.single_table_items`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                type: col({
                    codec: itemTypeEnumCodec,
                    notNull: true,
                }),
                type2: col({
                    codec: enumTableItemTypeEnumCodec,
                    notNull: true,
                }),
                parent_id: col({
                    codec: TYPES.int,
                    notNull: false,
                    identicalVia: { relation: "parent", attribute: "id" },
                }),
                author_id: col({
                    codec: TYPES.int,
                    notNull: true,
                    identicalVia: { relation: "author", attribute: "person_id" },
                }),
                position: col({ codec: TYPES.bigint, notNull: true }),
                created_at: col({ codec: TYPES.timestamptz, notNull: true }),
                updated_at: col({ codec: TYPES.timestamptz, notNull: true }),
                is_explicitly_archived: col({
                    codec: TYPES.boolean,
                    notNull: true,
                }),
                archived_at: col({ codec: TYPES.timestamptz, notNull: false }),
                title: col({ codec: TYPES.text, notNull: false }),
                description: col({ codec: TYPES.text, notNull: false }),
                note: col({ codec: TYPES.text, notNull: false }),
                color: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const singleTableItemsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: singleTableItemsCodec,
            from: sql `interfaces_and_unions.single_table_items`,
            name: "single_table_items",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const relationalItemsCodec = recordCodec({
            executor,
            name: "relational_items",
            identifier: sql `interfaces_and_unions.relational_items`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                type: col({
                    codec: itemTypeEnumCodec,
                    notNull: true,
                }),
                type2: col({
                    codec: enumTableItemTypeEnumCodec,
                    notNull: true,
                }),
                parent_id: col({
                    codec: TYPES.int,
                    notNull: false,
                    identicalVia: { relation: "parent", attribute: "id" },
                }),
                author_id: col({
                    codec: TYPES.int,
                    notNull: true,
                    identicalVia: { relation: "author", attribute: "person_id" },
                }),
                position: col({ codec: TYPES.bigint, notNull: true }),
                created_at: col({ codec: TYPES.timestamptz, notNull: true }),
                updated_at: col({ codec: TYPES.timestamptz, notNull: true }),
                is_explicitly_archived: col({
                    codec: TYPES.boolean,
                    notNull: true,
                }),
                archived_at: col({ codec: TYPES.timestamptz, notNull: false }),
            },
        });
        const relationalItemsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: relationalItemsCodec,
            from: sql `interfaces_and_unions.relational_items`,
            name: "relational_items",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const relationalCommentableCodec = recordCodec({
            executor,
            name: "relational_commentables",
            identifier: sql `interfaces_and_unions.relational_commentables`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                type: col({
                    codec: itemTypeEnumCodec,
                    notNull: true,
                }),
                type2: col({
                    codec: enumTableItemTypeEnumCodec,
                    notNull: true,
                }),
            },
        });
        const relationalCommentableResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: relationalCommentableCodec,
            from: sql `interfaces_and_unions.relational_commentables`,
            name: "relational_commentables",
        });
        const itemAttributes = {
            id: col({ codec: TYPES.int, notNull: true, identicalVia: "item" }),
            type: col({ codec: TYPES.text, notNull: true, via: "item" }),
            type2: col({
                codec: enumTableItemTypeEnumCodec,
                notNull: true,
                via: "item",
            }),
            parent_id: col({
                codec: TYPES.int,
                notNull: false,
                via: "item",
            }),
            author_id: col({
                codec: TYPES.int,
                notNull: true,
                via: "item",
            }),
            position: col({ codec: TYPES.bigint, notNull: true, via: "item" }),
            created_at: col({
                codec: TYPES.timestamptz,
                notNull: true,
                via: "item",
            }),
            updated_at: col({
                codec: TYPES.timestamptz,
                notNull: true,
                via: "item",
            }),
            is_explicitly_archived: col({
                codec: TYPES.boolean,
                notNull: true,
                via: "item",
            }),
            archived_at: col({
                codec: TYPES.timestamptz,
                notNull: false,
                via: "item",
            }),
        };
        const relationalTopicsCodec = recordCodec({
            executor,
            name: "relational_topics",
            identifier: sql `interfaces_and_unions.relational_topics`,
            attributes: {
                ...itemAttributes,
                title: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const relationalTopicsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: relationalTopicsCodec,
            from: sql `interfaces_and_unions.relational_topics`,
            name: "relational_topics",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const relationalPostsCodec = recordCodec({
            executor,
            name: "relational_posts",
            identifier: sql `interfaces_and_unions.relational_posts`,
            attributes: {
                ...itemAttributes,
                title: col({ codec: TYPES.text, notNull: false }),
                description: col({ codec: TYPES.text, notNull: false }),
                note: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const relationalPostsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: relationalPostsCodec,
            from: sql `interfaces_and_unions.relational_posts`,
            name: "relational_posts",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const relationalDividersCodec = recordCodec({
            executor,
            name: "relational_dividers",
            identifier: sql `interfaces_and_unions.relational_dividers`,
            attributes: {
                ...itemAttributes,
                title: col({ codec: TYPES.text, notNull: false }),
                color: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const relationalDividersResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: relationalDividersCodec,
            from: sql `interfaces_and_unions.relational_dividers`,
            name: "relational_dividers",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const relationalChecklistsCodec = recordCodec({
            executor,
            name: "relational_checklists",
            identifier: sql `interfaces_and_unions.relational_checklists`,
            attributes: {
                ...itemAttributes,
                title: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const relationalChecklistsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: relationalChecklistsCodec,
            from: sql `interfaces_and_unions.relational_checklists`,
            name: "relational_checklists",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const relationalChecklistItemsCodec = recordCodec({
            executor,
            name: "relational_checklist_items",
            identifier: sql `interfaces_and_unions.relational_checklist_items`,
            attributes: {
                ...itemAttributes,
                description: col({ codec: TYPES.text, notNull: true }),
                note: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const relationalChecklistItemsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: relationalChecklistItemsCodec,
            from: sql `interfaces_and_unions.relational_checklist_items`,
            name: "relational_checklist_items",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        ////////////////////////////////////////
        const unionItemsCodec = recordCodec({
            executor,
            name: "union_items",
            identifier: sql `interfaces_and_unions.union_items`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                type: col({
                    codec: itemTypeEnumCodec,
                    notNull: true,
                }),
                type2: col({
                    codec: enumTableItemTypeEnumCodec,
                    notNull: true,
                }),
            },
        });
        const unionItemsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: unionItemsCodec,
            from: sql `interfaces_and_unions.union_items`,
            name: "union_items",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const unionTopicsCodec = recordCodec({
            executor,
            name: "union_topics",
            identifier: sql `interfaces_and_unions.union_topics`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                title: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const unionTopicsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: unionTopicsCodec,
            from: sql `interfaces_and_unions.union_topics`,
            name: "union_topics",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const unionPostsCodec = recordCodec({
            executor,
            name: "union_posts",
            identifier: sql `interfaces_and_unions.union_posts`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                title: col({ codec: TYPES.text, notNull: false }),
                description: col({ codec: TYPES.text, notNull: false }),
                note: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const unionPostsResource = makePgResourceOptions({
            executor,
            selectAuth,
            codec: unionPostsCodec,
            from: sql `interfaces_and_unions.union_posts`,
            name: "union_posts",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const unionDividersCodec = recordCodec({
            executor,
            name: "union_dividers",
            identifier: sql `interfaces_and_unions.union_dividers`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                title: col({ codec: TYPES.text, notNull: false }),
                color: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const unionDividersResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: unionDividersCodec,
            from: sql `interfaces_and_unions.union_dividers`,
            name: "union_dividers",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const unionChecklistsCodec = recordCodec({
            executor,
            name: "union_checklists",
            identifier: sql `interfaces_and_unions.union_checklists`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                title: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const unionChecklistsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: unionChecklistsCodec,
            from: sql `interfaces_and_unions.union_checklists`,
            name: "union_checklists",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const unionChecklistItemsCodec = recordCodec({
            executor,
            name: "union_checklist_items",
            identifier: sql `interfaces_and_unions.union_checklist_items`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                description: col({ codec: TYPES.text, notNull: true }),
                note: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const unionChecklistItemsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: unionChecklistItemsCodec,
            from: sql `interfaces_and_unions.union_checklist_items`,
            name: "union_checklist_items",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const unionEntityResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: unionEntityCodec,
            from: sql `(select null::interfaces_and_unions.union__entity)`,
            name: "union__entity",
        });
        const entitySearchResourceOptions = PgResource.functionResourceOptions(unionEntityResourceOptions, {
            from: (...args) => sql `interfaces_and_unions.search(${sqlFromArgDigests(args)})`,
            returnsSetof: true,
            returnsArray: false,
            name: "entity_search",
            parameters: [
                {
                    name: "query",
                    required: true,
                    codec: TYPES.text,
                },
            ],
        });
        ////////////////////////////////////////
        const awsApplicationsCodec = recordCodec({
            executor,
            name: "aws_applications",
            identifier: sql `interfaces_and_unions.aws_applications`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                name: col({
                    codec: TYPES.text,
                    notNull: true,
                }),
                last_deployed: col({
                    codec: TYPES.timestamptz,
                    notNull: false,
                }),
                aws_id: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const awsApplicationsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: awsApplicationsCodec,
            from: sql `interfaces_and_unions.aws_applications`,
            name: "aws_applications",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const gcpApplicationsCodec = recordCodec({
            executor,
            name: "gcp_applications",
            identifier: sql `interfaces_and_unions.gcp_applications`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                name: col({
                    codec: TYPES.text,
                    notNull: true,
                }),
                last_deployed: col({
                    codec: TYPES.timestamptz,
                    notNull: false,
                }),
                gcp_id: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const gcpApplicationsResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: gcpApplicationsCodec,
            from: sql `interfaces_and_unions.gcp_applications`,
            name: "gcp_applications",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const firstPartyVulnerabilitiesCodec = recordCodec({
            executor,
            name: "first_party_vulnerabilities",
            identifier: sql `interfaces_and_unions.first_party_vulnerabilities`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                name: col({
                    codec: TYPES.text,
                    notNull: true,
                }),
                cvss_score: col({ codec: TYPES.float, notNull: true }),
                team_name: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const firstPartyVulnerabilitiesResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: firstPartyVulnerabilitiesCodec,
            from: sql `interfaces_and_unions.first_party_vulnerabilities`,
            name: "first_party_vulnerabilities",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        const thirdPartyVulnerabilitiesCodec = recordCodec({
            executor,
            name: "third_party_vulnerabilities",
            identifier: sql `interfaces_and_unions.third_party_vulnerabilities`,
            attributes: {
                id: col({ codec: TYPES.int, notNull: true }),
                name: col({
                    codec: TYPES.text,
                    notNull: true,
                }),
                cvss_score: col({ codec: TYPES.float, notNull: true }),
                vendor_name: col({ codec: TYPES.text, notNull: false }),
            },
        });
        const thirdPartyVulnerabilitiesResourceOptions = makePgResourceOptions({
            executor,
            selectAuth,
            codec: thirdPartyVulnerabilitiesCodec,
            from: sql `interfaces_and_unions.third_party_vulnerabilities`,
            name: "third_party_vulnerabilities",
            uniques: [{ attributes: ["id"], isPrimary: true }],
        });
        return makeRegistryBuilder()
            .addExecutor(executor)
            .addCodec(forumCodec)
            .addCodec(userCodec)
            .addCodec(messagesCodec)
            .addResource(uniqueAuthorCountResourceOptions)
            .addResource(forumNamesArrayResourceOptions)
            .addResource(forumNamesCasesResourceOptions)
            .addResource(forumsUniqueAuthorCountResourceOptions)
            .addResource(scalarTextResourceOptions)
            .addResource(messageResourceOptions)
            .addResource(userResourceOptions)
            .addResource(forumResourceOptions)
            .addResource(usersMostRecentForumResourceOptions)
            .addResource(featuredMessagesResourceOptions)
            .addResource(forumsFeaturedMessagesResourceOptions)
            .addResource(randomUserArrayResourceOptions)
            .addResource(randomUserArraySetResourceOptions)
            .addResource(forumsMessagesListSetResourceOptions)
            .addCodec(unionEntityCodec)
            .addCodec(personBookmarksCodec)
            .addResource(personBookmarksResourceOptions)
            .addCodec(personCodec)
            .addResource(personResourceOptions)
            .addCodec(postCodec)
            .addResource(postResourceOptions)
            .addCodec(commentCodec)
            .addResource(commentResourceOptions)
            .addCodec(itemTypeEnumCodec)
            .addCodec(enumTableItemTypeCodec)
            .addResource(enumTableItemTypeResourceOptions)
            .addCodec(enumTableItemTypeEnumCodec)
            .addCodec(singleTableItemsCodec)
            .addResource(singleTableItemsResourceOptions)
            .addCodec(relationalItemsCodec)
            .addResource(relationalItemsResourceOptions)
            .addCodec(relationalCommentableCodec)
            .addResource(relationalCommentableResourceOptions)
            .addCodec(relationalTopicsCodec)
            .addResource(relationalTopicsResourceOptions)
            .addCodec(relationalPostsCodec)
            .addResource(relationalPostsResourceOptions)
            .addCodec(relationalDividersCodec)
            .addResource(relationalDividersResourceOptions)
            .addCodec(relationalChecklistsCodec)
            .addResource(relationalChecklistsResourceOptions)
            .addCodec(relationalChecklistItemsCodec)
            .addResource(relationalChecklistItemsResourceOptions)
            .addCodec(unionItemsCodec)
            .addResource(unionItemsResourceOptions)
            .addCodec(unionTopicsCodec)
            .addResource(unionTopicsResourceOptions)
            .addCodec(unionPostsCodec)
            .addResource(unionPostsResource)
            .addCodec(unionDividersCodec)
            .addResource(unionDividersResourceOptions)
            .addCodec(unionChecklistsCodec)
            .addResource(unionChecklistsResourceOptions)
            .addCodec(unionChecklistItemsCodec)
            .addResource(unionChecklistItemsResourceOptions)
            .addResource(unionEntityResourceOptions)
            .addResource(entitySearchResourceOptions)
            .addCodec(awsApplicationsCodec)
            .addResource(awsApplicationsResourceOptions)
            .addCodec(gcpApplicationsCodec)
            .addResource(gcpApplicationsResourceOptions)
            .addCodec(firstPartyVulnerabilitiesCodec)
            .addResource(firstPartyVulnerabilitiesResourceOptions)
            .addCodec(thirdPartyVulnerabilitiesCodec)
            .addResource(thirdPartyVulnerabilitiesResourceOptions)
            .addRelation(messagesCodec, "author", userResourceOptions, {
            localAttributes: [`author_id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(messagesCodec, "forum", forumResourceOptions, {
            localAttributes: ["forum_id"],
            remoteAttributes: ["id"],
            isUnique: true,
        })
            .addRelation(personBookmarksResourceOptions.codec, "person", personResourceOptions, {
            isUnique: true,
            localAttributes: ["person_id"],
            remoteAttributes: ["person_id"],
        })
            .addRelation(personCodec, "singleTableItems", singleTableItemsResourceOptions, {
            isUnique: false,
            localAttributes: ["person_id"],
            remoteAttributes: ["author_id"],
        })
            .addRelation(personCodec, "posts", postResourceOptions, {
            isUnique: false,
            localAttributes: ["person_id"],
            remoteAttributes: ["author_id"],
        })
            .addRelation(personCodec, "comments", postResourceOptions, {
            isUnique: false,
            localAttributes: ["person_id"],
            remoteAttributes: ["author_id"],
        })
            .addRelation(personCodec, "personBookmarks", personBookmarksResourceOptions, {
            isUnique: false,
            localAttributes: ["person_id"],
            remoteAttributes: ["person_id"],
        })
            .addRelation(postCodec, "author", personResourceOptions, {
            isUnique: true,
            localAttributes: ["author_id"],
            remoteAttributes: ["person_id"],
        })
            .addRelation(postCodec, "comments", commentResourceOptions, {
            isUnique: false,
            localAttributes: ["post_id"],
            remoteAttributes: ["post_id"],
        })
            .addRelation(commentCodec, "author", personResourceOptions, {
            isUnique: true,
            localAttributes: ["author_id"],
            remoteAttributes: ["person_id"],
        })
            .addRelation(commentCodec, "post", postResourceOptions, {
            isUnique: true,
            localAttributes: ["post_id"],
            remoteAttributes: ["post_id"],
        })
            .addRelation(singleTableItemsCodec, "parent", singleTableItemsResourceOptions, {
            isUnique: true,
            localAttributes: ["parent_id"],
            remoteAttributes: ["id"],
        })
            .addRelation(singleTableItemsCodec, "children", singleTableItemsResourceOptions, {
            isUnique: false,
            localAttributes: ["id"],
            remoteAttributes: ["parent_id"],
        })
            .addRelation(singleTableItemsCodec, "author", personResourceOptions, {
            isUnique: true,
            localAttributes: ["author_id"],
            remoteAttributes: ["person_id"],
        })
            .addRelation(relationalTopicsCodec, "item", relationalItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalTopicsCodec, "parent", relationalItemsResourceOptions, {
            localAttributes: [`parent_id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalTopicsCodec, "author", personResourceOptions, {
            localAttributes: [`author_id`],
            remoteAttributes: [`person_id`],
            isUnique: true,
        })
            .addRelation(relationalPostsCodec, "item", relationalItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalPostsCodec, "parent", relationalItemsResourceOptions, {
            localAttributes: [`parent_id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalPostsCodec, "author", personResourceOptions, {
            localAttributes: [`author_id`],
            remoteAttributes: [`person_id`],
            isUnique: true,
        })
            .addRelation(relationalPostsCodec, "commentable", relationalCommentableResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalDividersCodec, "item", relationalItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalDividersCodec, "parent", relationalItemsResourceOptions, {
            localAttributes: [`parent_id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalDividersCodec, "author", personResourceOptions, {
            localAttributes: [`author_id`],
            remoteAttributes: [`person_id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistsCodec, "item", relationalItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistsCodec, "parent", relationalItemsResourceOptions, {
            localAttributes: [`parent_id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistsCodec, "author", personResourceOptions, {
            localAttributes: [`author_id`],
            remoteAttributes: [`person_id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistsCodec, "commentable", relationalCommentableResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistItemsCodec, "item", relationalItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistItemsCodec, "parent", relationalItemsResourceOptions, {
            localAttributes: [`parent_id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistItemsCodec, "author", personResourceOptions, {
            localAttributes: [`author_id`],
            remoteAttributes: [`person_id`],
            isUnique: true,
        })
            .addRelation(relationalChecklistItemsCodec, "commentable", relationalCommentableResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(relationalItemsCodec, "parent", relationalItemsResourceOptions, {
            isUnique: true,
            localAttributes: ["parent_id"],
            remoteAttributes: ["id"],
        })
            .addRelation(relationalItemsCodec, "children", relationalItemsResourceOptions, {
            isUnique: false,
            localAttributes: ["id"],
            remoteAttributes: ["parent_id"],
        })
            .addRelation(relationalItemsCodec, "author", personResourceOptions, {
            isUnique: true,
            localAttributes: ["author_id"],
            remoteAttributes: ["person_id"],
        })
            .addRelation(relationalItemsCodec, "topic", relationalTopicsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(relationalItemsCodec, "post", relationalPostsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(relationalItemsCodec, "divider", relationalDividersResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(relationalItemsCodec, "checklist", relationalChecklistsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(relationalItemsCodec, "checklistItem", relationalChecklistItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(relationalCommentableCodec, "post", relationalPostsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(relationalCommentableCodec, "checklist", relationalChecklistsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(relationalCommentableCodec, "checklistItem", relationalChecklistItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
            // reciprocal: 'item',
        })
            .addRelation(unionItemsCodec, "topic", unionTopicsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(unionItemsCodec, "post", unionPostsResource, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(unionItemsCodec, "divider", unionDividersResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(unionItemsCodec, "checklist", unionChecklistsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .addRelation(unionItemsCodec, "checklistItem", unionChecklistItemsResourceOptions, {
            localAttributes: [`id`],
            remoteAttributes: [`id`],
            isUnique: true,
        })
            .getRegistryConfig();
    }, [
        index_js_1.PgResource,
        index_js_1.TYPES,
        index_js_1.enumCodec,
        executor,
        codecs_js_1.listOfCodec,
        datasource_js_1.makePgResourceOptions,
        datasource_js_1.makeRegistryBuilder,
        index_js_1.recordCodec,
        selectAuth,
        pg_sql2_1.default,
        pgSelect_js_1.sqlFromArgDigests,
    ], "registryConfig");
    const registry = EXPORTABLE((makeRegistry, registryConfig) => makeRegistry(registryConfig), [datasource_js_1.makeRegistry, registryConfig], "registry");
    if (Math.random() > 2) {
        /*
         * This block includes a rudimentary TypeScript types test - we get a
         * person by id, follow the relationship to their posts, grab one of these,
         * then grab its id. This id should be an int4, we want to ensure that it's
         * assignable to 'int4' and NOT assignable to 'text' (i.e. not `string` or
         * `any`).
         *
         * NOTE: this code would throw errors if you actually try and run it
         * because it's not being ran as part of a Grafast planning context - hence
         * the `if`.
         */
        const $person = registry.pgResources.people.get({
            person_id: (0, grafast_1.constant)(1, false),
        });
        const $posts = $person.manyRelation("posts");
        const $post = $posts.single();
        const $id = $post.get("post_id");
        const _testGood = $id.pgCodec.name;
        // @ts-expect-error
        const _testBad = $id.pgCodec.name;
    }
    const deoptimizeIfAppropriate = EXPORTABLE((__ListTransformStep, options) => (step) => {
        if (options.deoptimize) {
            const innerPlan = step instanceof __ListTransformStep
                ? step.getListStep()
                : step;
            if ("getClassStep" in innerPlan) {
                innerPlan.getClassStep().setInliningForbidden();
            }
            else if ("setInliningForbidden" in innerPlan) {
                innerPlan.setInliningForbidden();
            }
        }
        return step;
    }, [grafast_1.__ListTransformStep, options]);
    const { pgCodecs: { union__entity: unionEntityCodec }, pgResources: { messages: messageResource, users: userResource, forums: forumResource, people: personResource, person_bookmarks: personBookmarksResource, posts: postResource, comments: commentResource, single_table_items: singleTableItemsResource, relational_items: relationalItemsResource, relational_topics: relationalTopicsResource, relational_posts: relationalPostsResource, relational_dividers: relationalDividersResource, relational_checklists: relationalChecklistsResource, relational_checklist_items: relationalChecklistItemsResource, union_items: unionItemsResource, union_topics: unionTopicsResource, union_posts: unionPostsResource, union_dividers: unionDividersResource, union_checklists: unionChecklistsResource, union_checklist_items: unionChecklistItemsResource, relational_commentables: relationalCommentableResource, users_most_recent_forum: usersMostRecentForumResource, forums_unique_author_count: forumsUniqueAuthorCountResource, forums_featured_messages: forumsFeaturedMessagesResource, forums_messages_list_set: forumsMessagesListSetResource, text: scalarTextResource, unique_author_count: uniqueAuthorCountResource, forum_names_array: forumNamesArrayResource, forum_names_cases: forumNamesCasesResource, random_user_array: randomUserArrayResource, random_user_array_set: randomUserArraySetResource, featured_messages: featuredMessagesResource, entity_search: entitySearchResource, first_party_vulnerabilities: firstPartyVulnerabilitiesResource, third_party_vulnerabilities: thirdPartyVulnerabilitiesResource, }, } = registry;
    ////////////////////////////////////////
    const EnumTableItemType = new graphql_1.GraphQLEnumType({
        name: "EnumTableItemType",
        values: {
            TOPIC: { value: "TOPIC" },
            POST: { value: "POST" },
            DIVIDER: { value: "DIVIDER" },
            CHECKLIST: { value: "CHECKLIST" },
            CHECKLIST_ITEM: { value: "CHECKLIST_ITEM" },
        },
    });
    function attrField(attrName, type) {
        return {
            type,
            plan: EXPORTABLE((attrName) => function plan($entity) {
                return $entity.get(attrName);
            }, [attrName]),
        };
    }
    function singleRelationField(relation, type) {
        return {
            type,
            plan: EXPORTABLE((deoptimizeIfAppropriate, relation) => function plan($entity) {
                const $plan = $entity.singleRelation(relation);
                deoptimizeIfAppropriate($plan);
                return $plan;
            }, [deoptimizeIfAppropriate, relation]),
        };
    }
    const HashType = new graphql_1.GraphQLEnumType({
        name: "HashType",
        values: {
            MD5: { value: "md5" },
            SHA1: { value: "sha1" },
            SHA256: { value: "sha256" },
        },
    });
    const Hashes = new graphql_1.GraphQLObjectType({
        name: "Hashes",
        fields: () => ({
            md5: {
                type: graphql_1.GraphQLString,
                resolve: EXPORTABLE((crypto) => function resolve(parent) {
                    return crypto.createHash("md5").update(parent.text).digest("hex");
                }, [crypto]),
            },
            sha1: {
                type: graphql_1.GraphQLString,
                resolve: EXPORTABLE((crypto) => function resolve(parent) {
                    return crypto
                        .createHash("sha1")
                        .update(parent.text)
                        .digest("hex");
                }, [crypto]),
            },
            throwNonNullError: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                resolve: EXPORTABLE(() => function resolve() {
                    return null;
                }, []),
            },
            throwTestError: {
                type: graphql_1.GraphQLString,
                resolve: EXPORTABLE(() => function resolve() {
                    throw new Error("Test");
                }, []),
            },
            sha256: {
                type: graphql_1.GraphQLString,
                resolve: EXPORTABLE((crypto) => function resolve(parent) {
                    return crypto
                        .createHash("sha256")
                        .update(parent.text)
                        .digest("hex");
                }, [crypto]),
            },
            self: {
                type: Hashes,
                resolve: EXPORTABLE(() => function resolve(parent) {
                    return parent;
                }, []),
            },
        }),
    });
    const User = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "User",
        fields: () => ({
            // Here we don't use `attrField` because we want to explicitly test the default plan resolver
            // username: attrField("username", GraphQLString),
            username: {
                type: graphql_1.GraphQLString,
            },
            gravatarUrl: attrField("gravatar_url", graphql_1.GraphQLString),
            mostRecentForum: {
                type: Forum,
                plan: EXPORTABLE((deoptimizeIfAppropriate, usersMostRecentForumResource) => ($user) => {
                    const $forum = usersMostRecentForumResource.execute([
                        { step: $user.record() },
                    ]);
                    deoptimizeIfAppropriate($forum);
                    return $forum;
                }, [deoptimizeIfAppropriate, usersMostRecentForumResource]),
            },
            // This field is to test standard resolvers work on planned types
            usernameHash: {
                type: graphql_1.GraphQLString,
                args: {
                    hashType: {
                        type: new graphql_1.GraphQLNonNull(HashType),
                    },
                },
                plan: EXPORTABLE((object) => function plan($user) {
                    return object({ username: $user.get("username") });
                }, [grafast_1.object]),
                resolve: EXPORTABLE((crypto) => function resolve(user, args) {
                    return crypto
                        .createHash(args.hashType)
                        .update(user.username)
                        .digest("hex");
                }, [crypto]),
            },
            // This field is to test standard resolvers work when returning non-scalars on planned types
            usernameHashes: {
                type: Hashes,
                plan: EXPORTABLE(() => function plan($user) {
                    return $user.get("username");
                }, []),
                resolve: EXPORTABLE(() => function resolve(username) {
                    return { text: username };
                }, []),
            },
        }),
    });
    const MessagesOrderBy = new graphql_1.GraphQLEnumType({
        name: "MessagesOrderBy",
        values: {
            BODY_ASC: {
                extensions: {
                    grafast: {
                        apply: EXPORTABLE((TYPES, sql) => (qb) => {
                            qb.orderBy({
                                codec: TYPES.text,
                                fragment: sql `${qb}.body`,
                                direction: "ASC",
                            });
                        }, [index_js_1.TYPES, pg_sql2_1.default]),
                    },
                },
            },
            BODY_DESC: {
                extensions: {
                    grafast: {
                        apply: EXPORTABLE((TYPES, sql) => (qb) => {
                            qb.orderBy({
                                codec: TYPES.text,
                                fragment: sql `${qb}.body`,
                                direction: "DESC",
                            });
                        }, [index_js_1.TYPES, pg_sql2_1.default]),
                    },
                },
            },
            AUTHOR_USERNAME_ASC: {
                extensions: {
                    grafast: {
                        apply: EXPORTABLE((TYPES, sql) => (qb) => {
                            const authorAlias = qb.singleRelation("author");
                            qb.orderBy({
                                codec: TYPES.text,
                                fragment: sql `${authorAlias}.username`,
                                direction: "ASC",
                            });
                        }, [index_js_1.TYPES, pg_sql2_1.default]),
                    },
                },
            },
            AUTHOR_USERNAME_DESC: {
                extensions: {
                    grafast: {
                        apply: EXPORTABLE((TYPES, sql) => (qb) => {
                            const authorAlias = qb.singleRelation("author");
                            qb.orderBy({
                                codec: TYPES.text,
                                fragment: sql `${authorAlias}.username`,
                                direction: "DESC",
                            });
                        }, [index_js_1.TYPES, pg_sql2_1.default]),
                    },
                },
            },
        },
    });
    const Message = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "Message",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLString),
            featured: attrField("featured", graphql_1.GraphQLBoolean),
            body: attrField("body", graphql_1.GraphQLString),
            forum: singleRelationField("forum", Forum),
            author: {
                type: User,
                plan: EXPORTABLE((deoptimizeIfAppropriate) => function plan($message) {
                    const $user = $message.singleRelation("author");
                    deoptimizeIfAppropriate($user);
                    return $user;
                }, [deoptimizeIfAppropriate]),
            },
            isArchived: attrField("is_archived", graphql_1.GraphQLBoolean),
        }),
    });
    const MessageEdge = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "MessageEdge",
        fields: {
            cursor: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE(() => function plan($node) {
                    return $node.cursor();
                }, []),
            },
            node: {
                type: Message,
                plan: EXPORTABLE(() => function plan($node) {
                    return $node;
                }, []),
            },
        },
    });
    const PageInfo = (0, grafast_1.newObjectTypeBuilder)(pgPageInfo_js_1.PgPageInfoStep)({
        name: "PageInfo",
        fields: {
            hasNextPage: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
                plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.hasNextPage(), []),
            },
            hasPreviousPage: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLBoolean),
                plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.hasPreviousPage(), []),
            },
            startCursor: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.startCursor(), []),
            },
            endCursor: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.endCursor(), []),
            },
        },
    });
    const MessagesConnection = (0, grafast_1.newObjectTypeBuilder)(grafast_1.ConnectionStep)({
        name: "MessagesConnection",
        fields: {
            edges: {
                type: new graphql_1.GraphQLList(MessageEdge),
                plan: EXPORTABLE(() => function plan($connection) {
                    return $connection.edges();
                }, []),
            },
            nodes: (0, grafast_1.newGrafastFieldConfigBuilder)()({
                type: new graphql_1.GraphQLList(Message),
                plan: EXPORTABLE(() => function plan($connection) {
                    return $connection.nodes();
                }, []),
            }),
            pageInfo: (0, grafast_1.newGrafastFieldConfigBuilder)()({
                type: new graphql_1.GraphQLNonNull(PageInfo),
                plan: EXPORTABLE(() => function plan($connection) {
                    // return context();
                    return $connection.pageInfo();
                }, []),
            }),
            totalCount: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                plan: EXPORTABLE((TYPES, sql) => ($connection) => $connection
                    .cloneSubplanWithoutPagination("aggregate")
                    .single()
                    .select(sql `count(*)`, TYPES.bigint, false), [index_js_1.TYPES, pg_sql2_1.default]),
            },
        },
    });
    const IncludeArchived = new graphql_1.GraphQLEnumType({
        name: "IncludeArchived",
        values: {
            INHERIT: {
                value: "INHERIT",
            },
            YES: {
                value: "YES",
            },
            NO: {
                value: "NO",
            },
            EXCLUSIVELY: {
                value: "EXCLUSIVELY",
            },
        },
    });
    function makeIncludeArchivedArg(getClassStep) {
        return {
            type: IncludeArchived,
            applyPlan: EXPORTABLE((PgSelectSingleStep, constant, getClassStep, includeArchivedCondition, lambda) => function plan($parent, $field, val) {
                const $messages = getClassStep($field);
                const $value = val.getRaw();
                const $parentPgSelectSingle = $parent instanceof PgSelectSingleStep
                    ? $parent
                    : null;
                const sqlParentArchivedAt = $parentPgSelectSingle?.resource?.codec
                    .attributes?.archived_at
                    ? $messages.placeholder($parentPgSelectSingle.get("archived_at"))
                    : undefined;
                const $condition = lambda([constant(sqlParentArchivedAt), $value], includeArchivedCondition, true);
                $messages.apply($condition);
            }, [
                index_js_1.PgSelectSingleStep,
                grafast_1.constant,
                getClassStep,
                includeArchivedCondition,
                grafast_1.lambda,
            ]),
            defaultValue: "INHERIT",
        };
    }
    const MessageCondition = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "MessageCondition",
        fields: {
            featured: {
                type: graphql_1.GraphQLBoolean,
                apply: EXPORTABLE((TYPES, sql, sqlValueWithCodec) => function plan($condition, arg) {
                    if (arg === null) {
                        $condition.where(sql `${$condition}.featured is null`);
                    }
                    else {
                        $condition.where(sql `${$condition}.featured = ${sqlValueWithCodec(arg, TYPES.boolean)}`);
                    }
                }, [index_js_1.TYPES, pg_sql2_1.default, codecs_js_1.sqlValueWithCodec]),
            },
        },
    });
    const BooleanFilter = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "BooleanFilter",
        fields: {
            equalTo: {
                type: graphql_1.GraphQLBoolean,
                apply: EXPORTABLE((TYPES, sql, sqlValueWithCodec) => function plan($parent, arg) {
                    if (arg === null) {
                        // Ignore
                    }
                    else {
                        $parent.where(sql `${$parent.expression} = ${sqlValueWithCodec(arg, TYPES.boolean)}`);
                    }
                }, [index_js_1.TYPES, pg_sql2_1.default, codecs_js_1.sqlValueWithCodec]),
            },
            notEqualTo: {
                type: graphql_1.GraphQLBoolean,
                apply: EXPORTABLE((TYPES, sql, sqlValueWithCodec) => function plan($parent, arg) {
                    if (arg === null) {
                        // Ignore
                    }
                    else {
                        $parent.where(sql `${$parent.expression} <> ${sqlValueWithCodec(arg, TYPES.boolean)}`);
                    }
                }, [index_js_1.TYPES, pg_sql2_1.default, codecs_js_1.sqlValueWithCodec]),
            },
        },
    });
    const MessageFilter = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "MessageFilter",
        fields: {
            featured: {
                type: BooleanFilter,
                apply: EXPORTABLE((PgBooleanFilter, sql) => function plan($messageFilter, arg) {
                    if (arg === null) {
                        // Ignore
                    }
                    else {
                        return new PgBooleanFilter($messageFilter, sql `${$messageFilter}.featured`);
                    }
                }, [index_js_1.PgBooleanFilter, pg_sql2_1.default]),
            },
            isArchived: {
                type: BooleanFilter,
                apply: EXPORTABLE((PgBooleanFilter, sql) => function plan($messageFilter, arg) {
                    if (arg === null) {
                        // Ignore
                    }
                    else {
                        return new PgBooleanFilter($messageFilter, sql `${$messageFilter}.is_archived`);
                    }
                }, [index_js_1.PgBooleanFilter, pg_sql2_1.default]),
            },
        },
    });
    const ForumCondition = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "ForumCondition",
        fields: {
            name: {
                type: graphql_1.GraphQLString,
                apply: EXPORTABLE((TYPES, sql, sqlValueWithCodec) => function plan($condition, arg) {
                    if (arg === null) {
                        $condition.where(sql `${$condition}.name is null`);
                    }
                    else {
                        $condition.where(sql `${$condition}.name = ${sqlValueWithCodec(arg, TYPES.text)}`);
                    }
                }, [index_js_1.TYPES, pg_sql2_1.default, codecs_js_1.sqlValueWithCodec]),
            },
        },
    });
    const ForumToManyMessageFilter = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "ForumToManyMessageFilter",
        fields: {
            some: {
                type: MessageFilter,
                apply: EXPORTABLE(() => function plan($manyFilter, arg) {
                    if (arg !== null) {
                        return $manyFilter.some();
                    }
                }, []),
            },
        },
    });
    const ForumFilter = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "ForumFilter",
        fields: {
            messages: {
                type: ForumToManyMessageFilter,
                apply: EXPORTABLE((PgManyFilter, messageResource) => function plan($condition, arg) {
                    if (arg !== null) {
                        return new PgManyFilter($condition, messageResource, ["id"], ["forum_id"]);
                    }
                }, [index_js_1.PgManyFilter, messageResource]),
            },
        },
    });
    const Forum = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "Forum",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLString),
            name: attrField("name", graphql_1.GraphQLString),
            // Expression attribute
            isArchived: attrField("is_archived", graphql_1.GraphQLBoolean),
            // Custom expression; actual attribute select shouldn't make it through to the generated query.
            archivedAtIsNotNull: {
                type: graphql_1.GraphQLBoolean,
                plan: EXPORTABLE((TYPES, pgClassExpression) => function plan($forum) {
                    const $archivedAt = $forum.get("archived_at");
                    const $expr1 = pgClassExpression($forum, TYPES.boolean, true) `${$archivedAt} is not null`;
                    const $expr2 = pgClassExpression($forum, TYPES.boolean, true) `${$expr1} is true`;
                    return $expr2;
                }, [index_js_1.TYPES, index_js_1.pgClassExpression]),
            },
            self: {
                type: Forum,
                plan: EXPORTABLE(() => function plan($forum) {
                    return $forum;
                }, []),
            },
            message: {
                type: Message,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    },
                },
                plan: EXPORTABLE((deoptimizeIfAppropriate, messageResource) => function plan($forum, { $id }) {
                    const $forumId = $forum.get("id");
                    const $message = messageResource.get({
                        forum_id: $forumId,
                        id: $id,
                    });
                    deoptimizeIfAppropriate($message);
                    return $message;
                }, [deoptimizeIfAppropriate, messageResource]),
            },
            messagesList: {
                type: new graphql_1.GraphQLList(Message),
                args: {
                    first: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$forum, $messages, arg) {
                            $messages.setFirst(arg.getRaw());
                        }, []),
                    },
                    condition: {
                        type: MessageCondition,
                        applyPlan: EXPORTABLE((pgWhere) => function plan(_$forum, $messages, arg) {
                            arg.apply($messages, pgWhere);
                        }, [pgWhere]),
                    },
                    filter: {
                        type: MessageFilter,
                        applyPlan: EXPORTABLE((pgClassFilterWhere) => function plan(_$forum, $messages, arg) {
                            arg.apply($messages, pgClassFilterWhere);
                        }, [pgClassFilterWhere]),
                    },
                    includeArchived: makeIncludeArchivedArg(($messages) => $messages),
                },
                plan: EXPORTABLE((deoptimizeIfAppropriate, messageResource) => function plan($forum) {
                    const $forumId = $forum.get("id");
                    const $messages = messageResource.find({ forum_id: $forumId });
                    deoptimizeIfAppropriate($messages);
                    $messages.setTrusted();
                    // $messages.leftJoin(...);
                    // $messages.innerJoin(...);
                    // $messages.relation('fk_messages_author_id')
                    // $messages.where(...);
                    // $messages.orderBy(...);
                    return $messages;
                }, [deoptimizeIfAppropriate, messageResource]),
            },
            messagesConnection: {
                type: MessagesConnection,
                args: {
                    first: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$forum, $connection, arg) {
                            $connection.setFirst(arg.getRaw());
                        }, []),
                    },
                    last: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setLast(arg.getRaw());
                        }, []),
                    },
                    condition: {
                        type: MessageCondition,
                        applyPlan: EXPORTABLE((pgWhere) => function plan(_$forum, $connection, arg) {
                            const $messages = $connection.getSubplan();
                            arg.apply($messages, pgWhere);
                        }, [pgWhere]),
                    },
                    filter: {
                        type: MessageFilter,
                        applyPlan: EXPORTABLE((pgClassFilterWhere) => function plan(_$forum, $connection, arg) {
                            const $messages = $connection.getSubplan();
                            arg.apply($messages, pgClassFilterWhere);
                        }, [pgClassFilterWhere]),
                    },
                    includeArchived: makeIncludeArchivedArg(($connection) => $connection.getSubplan()),
                },
                plan: EXPORTABLE((connection, deoptimizeIfAppropriate, messageResource) => function plan($forum) {
                    const $messages = messageResource.find({
                        forum_id: $forum.get("id"),
                    });
                    $messages.setTrusted();
                    deoptimizeIfAppropriate($messages);
                    // $messages.leftJoin(...);
                    // $messages.innerJoin(...);
                    // $messages.relation('fk_messages_author_id')
                    // $messages.where(...);
                    const $connectionPlan = connection($messages);
                    // $connectionPlan.orderBy... ?
                    // DEFINITELY NOT $messages.orderBy BECAUSE we don't want that applied to aggregates.
                    // DEFINITELY NOT $messages.limit BECAUSE we don't want those limits applied to aggregates or page info.
                    return $connectionPlan;
                }, [grafast_1.connection, deoptimizeIfAppropriate, messageResource]),
            },
            uniqueAuthorCount: {
                type: graphql_1.GraphQLInt,
                args: {
                    featured: {
                        type: graphql_1.GraphQLBoolean,
                    },
                },
                plan: EXPORTABLE((TYPES, forumsUniqueAuthorCountResource) => function plan($forum, { $featured }) {
                    return forumsUniqueAuthorCountResource.execute([
                        {
                            step: $forum.record(),
                        },
                        {
                            step: $featured,
                            pgCodec: TYPES.boolean,
                        },
                    ]);
                }, [index_js_1.TYPES, forumsUniqueAuthorCountResource]),
            },
            randomUser: {
                type: User,
                plan: EXPORTABLE((deoptimizeIfAppropriate, pgSelect, sql, sqlFromArgDigests, userResource) => function plan($forum) {
                    const $user = pgSelect({
                        resource: userResource,
                        identifiers: [],
                        args: [
                            {
                                step: $forum.record(),
                            },
                        ],
                        from: (...args) => sql `app_public.forums_random_user(${sqlFromArgDigests(args)})`,
                        name: "forums_random_user",
                    }).single();
                    deoptimizeIfAppropriate($user);
                    return $user;
                }, [
                    deoptimizeIfAppropriate,
                    index_js_1.pgSelect,
                    pg_sql2_1.default,
                    pgSelect_js_1.sqlFromArgDigests,
                    userResource,
                ]),
            },
            featuredMessages: {
                type: new graphql_1.GraphQLList(Message),
                plan: EXPORTABLE((deoptimizeIfAppropriate, forumsFeaturedMessagesResource) => function plan($forum) {
                    const $messages = forumsFeaturedMessagesResource.execute([
                        {
                            step: $forum.record(),
                        },
                    ]);
                    deoptimizeIfAppropriate($messages);
                    return $messages;
                }, [deoptimizeIfAppropriate, forumsFeaturedMessagesResource]),
            },
            messagesListSet: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLList(Message)),
                plan: EXPORTABLE((deoptimizeIfAppropriate, forumsMessagesListSetResource) => function plan($forum) {
                    const $partitionedMessages = forumsMessagesListSetResource.execute([
                        {
                            step: $forum.record(),
                        },
                    ]);
                    deoptimizeIfAppropriate($partitionedMessages);
                    return $partitionedMessages;
                }, [deoptimizeIfAppropriate, forumsMessagesListSetResource]),
            },
            messagesWithManyTransforms: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLList(Message)),
                plan: EXPORTABLE((deoptimizeIfAppropriate, each, filter, groupBy, lambda, messageResource) => function plan($forum) {
                    // This is a deliberately convoluted plan to ensure that multiple
                    // filter plans work well together.
                    // Load _all_ the messages from the DB.
                    const $messages = messageResource.find();
                    deoptimizeIfAppropriate($messages);
                    // Filter messages to those _not_ in this forum
                    const $messagesFromOtherForums = filter($messages, ($message) => lambda([$message.get("forum_id"), $forum.get("id")], ([messageForumId, forumId]) => messageForumId !== forumId, true));
                    // Group messages by the "featured" property
                    const $grouped = groupBy($messagesFromOtherForums, ($message) => $message.get("featured"));
                    // Since `groupBy` results in a `Map`, turn it into an array by just getting the values
                    const $entries = lambda($grouped, (map) => [...map.values()], true);
                    // Now map over the resulting list of list of values and wrap with the message list item plan.
                    return each($entries, ($group) => each($group, ($item) => $messages.listItem($item)));
                }, [
                    deoptimizeIfAppropriate,
                    grafast_1.each,
                    grafast_1.filter,
                    grafast_1.groupBy,
                    grafast_1.lambda,
                    messageResource,
                ]),
            },
        }),
    });
    const singleTableTypeNameCallback = EXPORTABLE(() => (v) => {
        if (v == null) {
            return v;
        }
        const type = {
            TOPIC: "SingleTableTopic",
            POST: "SingleTablePost",
            DIVIDER: "SingleTableDivider",
            CHECKLIST: "SingleTableChecklist",
            CHECKLIST_ITEM: "SingleTableChecklistItem",
        }[v];
        if (!type) {
            throw new Error(`Could not determine type for '${v}'`);
        }
        return type;
    }, []);
    const singleTableTypeName = EXPORTABLE((lambda, singleTableTypeNameCallback) => ($entity) => {
        const $type = $entity.get("type");
        const $typeName = lambda($type, singleTableTypeNameCallback, true);
        return $typeName;
    }, [grafast_1.lambda, singleTableTypeNameCallback]);
    const singleTableItemInterface = EXPORTABLE((pgSingleTablePolymorphic, singleTableTypeName) => ($item) => pgSingleTablePolymorphic(singleTableTypeName($item), $item), [index_js_1.pgSingleTablePolymorphic, singleTableTypeName]);
    const relationalItemPolymorphicTypeMap = EXPORTABLE((deoptimizeIfAppropriate) => ({
        RelationalTopic: {
            match: (t) => t === "TOPIC",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("topic")),
        },
        RelationalPost: {
            match: (t) => t === "POST",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("post")),
        },
        RelationalDivider: {
            match: (t) => t === "DIVIDER",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("divider")),
        },
        RelationalChecklist: {
            match: (t) => t === "CHECKLIST",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("checklist")),
        },
        RelationalChecklistItem: {
            match: (t) => t === "CHECKLIST_ITEM",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("checklistItem")),
        },
    }), [deoptimizeIfAppropriate]);
    const relationalItemInterface = EXPORTABLE((pgPolymorphic, relationalItemPolymorphicTypeMap) => ($item) => pgPolymorphic($item, $item.get("type"), relationalItemPolymorphicTypeMap), [index_js_1.pgPolymorphic, relationalItemPolymorphicTypeMap]);
    const unionItemPolymorphicTypeMap = EXPORTABLE((deoptimizeIfAppropriate) => ({
        UnionTopic: {
            match: (t) => t === "TOPIC",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("topic")),
        },
        UnionPost: {
            match: (t) => t === "POST",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("post")),
        },
        UnionDivider: {
            match: (t) => t === "DIVIDER",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("divider")),
        },
        UnionChecklist: {
            match: (t) => t === "CHECKLIST",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("checklist")),
        },
        UnionChecklistItem: {
            match: (t) => t === "CHECKLIST_ITEM",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("checklistItem")),
        },
    }), [deoptimizeIfAppropriate]);
    const unionItemUnion = EXPORTABLE((pgPolymorphic, unionItemPolymorphicTypeMap) => ($item) => pgPolymorphic($item, $item.get("type"), unionItemPolymorphicTypeMap), [index_js_1.pgPolymorphic, unionItemPolymorphicTypeMap]);
    const relationalCommentablePolymorphicTypeMap = EXPORTABLE((deoptimizeIfAppropriate) => ({
        RelationalPost: {
            match: (t) => t === "POST",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("post")),
        },
        RelationalChecklist: {
            match: (t) => t === "CHECKLIST",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("checklist")),
        },
        RelationalChecklistItem: {
            match: (t) => t === "CHECKLIST_ITEM",
            plan: (_, $item) => deoptimizeIfAppropriate($item.singleRelation("checklistItem")),
        },
    }), [deoptimizeIfAppropriate]);
    const relationalCommentableInterface = EXPORTABLE((pgPolymorphic, relationalCommentablePolymorphicTypeMap) => ($item) => pgPolymorphic($item, $item.get("type"), relationalCommentablePolymorphicTypeMap), [index_js_1.pgPolymorphic, relationalCommentablePolymorphicTypeMap]);
    const entityPolymorphicTypeMap = EXPORTABLE((commentResource, personResource, postResource) => ({
        Person: {
            match: (v) => v[0] != null,
            plan: ($list) => personResource.get({ person_id: $list.at(0) }),
        },
        Post: {
            match: (v) => v[1] != null,
            plan: ($list) => postResource.get({ post_id: $list.at(1) }),
        },
        Comment: {
            match: (v) => v[2] != null,
            plan: ($list) => commentResource.get({ comment_id: $list.at(2) }),
        },
    }), [commentResource, personResource, postResource]);
    /**
     * This makes a polymorphic plan that returns the "entity" represented by the
     * "interfaces_and_unions.union__entity" type in the database (a composite
     * type with an attribute that's a "foreign key" to each table that's
     * included in the union).
     *
     * i.e. if `$item.get('person_id')` is set, then it's a Person and we should
     * grab that person from the `personResource`. If `post_id` is set it's a Post,
     * and so on.
     */
    const entityUnion = EXPORTABLE((entityPolymorphicTypeMap, list, pgPolymorphic) => ($item) => pgPolymorphic($item, list([
        $item.get("person_id"),
        $item.get("post_id"),
        $item.get("comment_id"),
    ]), entityPolymorphicTypeMap), [entityPolymorphicTypeMap, grafast_1.list, index_js_1.pgPolymorphic]);
    const PersonBookmark = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "PersonBookmark",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLInt),
            person: singleRelationField("person", Person),
            bookmarkedEntity: {
                type: Entity,
                plan: EXPORTABLE((entityUnion) => function plan($personBookmark) {
                    const $entity = $personBookmark.get("bookmarked_entity");
                    return entityUnion($entity);
                }, [entityUnion]),
            },
        }),
    });
    const Person = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "Person",
        fields: () => ({
            personId: attrField("person_id", graphql_1.GraphQLInt),
            username: attrField("username", graphql_1.GraphQLString),
            singleTableItemsList: {
                type: new graphql_1.GraphQLList(SingleTableItem),
                plan: EXPORTABLE((deoptimizeIfAppropriate, each, singleTableItemInterface, singleTableItemsResource) => function plan($person) {
                    const $personId = $person.get("person_id");
                    const $items = singleTableItemsResource.find({
                        author_id: $personId,
                    });
                    deoptimizeIfAppropriate($items);
                    return each($items, singleTableItemInterface);
                }, [
                    deoptimizeIfAppropriate,
                    grafast_1.each,
                    singleTableItemInterface,
                    singleTableItemsResource,
                ]),
            },
            relationalItemsList: {
                type: new graphql_1.GraphQLList(RelationalItem),
                plan: EXPORTABLE((deoptimizeIfAppropriate, each, relationalItemInterface, relationalItemsResource) => function plan($person) {
                    const $personId = $person.get("person_id");
                    const $items = relationalItemsResource.find({
                        author_id: $personId,
                    });
                    deoptimizeIfAppropriate($items);
                    return each($items, ($item) => relationalItemInterface($item));
                }, [
                    deoptimizeIfAppropriate,
                    grafast_1.each,
                    relationalItemInterface,
                    relationalItemsResource,
                ]),
            },
            personBookmarksList: {
                type: new graphql_1.GraphQLList(PersonBookmark),
                plan: EXPORTABLE(() => function plan($person) {
                    return $person.manyRelation("personBookmarks");
                }, []),
            },
        }),
    });
    const Post = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "Post",
        fields: () => ({
            postId: attrField("post_id", graphql_1.GraphQLInt),
            body: attrField("body", graphql_1.GraphQLString),
            author: singleRelationField("author", Person),
        }),
    });
    const Comment = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "Comment",
        fields: () => ({
            commentId: attrField("comment_id", graphql_1.GraphQLInt),
            author: singleRelationField("author", Person),
            post: singleRelationField("post", Post),
            body: attrField("body", graphql_1.GraphQLString),
        }),
    });
    ////////////////////////////////////////
    const SingleTableItem = new graphql_1.GraphQLInterfaceType({
        name: "SingleTableItem",
        fields: () => ({
            id: { type: graphql_1.GraphQLInt },
            type: { type: graphql_1.GraphQLString },
            type2: { type: EnumTableItemType },
            parent: { type: SingleTableItem },
            author: { type: Person },
            position: { type: graphql_1.GraphQLString },
            createdAt: { type: graphql_1.GraphQLString },
            updatedAt: { type: graphql_1.GraphQLString },
            isExplicitlyArchived: { type: graphql_1.GraphQLBoolean },
            archivedAt: { type: graphql_1.GraphQLString },
        }),
    });
    const commonSingleTableItemFields = {
        id: attrField("id", graphql_1.GraphQLInt),
        type: attrField("type", graphql_1.GraphQLString),
        type2: attrField("type2", EnumTableItemType),
        parent: {
            type: SingleTableItem,
            plan: EXPORTABLE((deoptimizeIfAppropriate, singleTableItemInterface) => function plan($entity) {
                const $plan = $entity.singleRelation("parent");
                deoptimizeIfAppropriate($plan);
                return singleTableItemInterface($plan);
            }, [deoptimizeIfAppropriate, singleTableItemInterface]),
        },
        author: singleRelationField("author", Person),
        position: attrField("position", graphql_1.GraphQLString),
        createdAt: attrField("created_at", graphql_1.GraphQLString),
        updatedAt: attrField("updated_at", graphql_1.GraphQLString),
        isExplicitlyArchived: attrField("is_explicitly_archived", graphql_1.GraphQLBoolean),
        archivedAt: attrField("archived_at", graphql_1.GraphQLString),
    };
    const SingleTableTopic = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "SingleTableTopic",
        interfaces: [SingleTableItem],
        fields: () => ({
            ...commonSingleTableItemFields,
            title: attrField("title", graphql_1.GraphQLString),
        }),
    });
    const SingleTablePost = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "SingleTablePost",
        interfaces: [SingleTableItem],
        fields: () => ({
            ...commonSingleTableItemFields,
            title: attrField("title", graphql_1.GraphQLString),
            description: attrField("description", graphql_1.GraphQLString),
            note: attrField("note", graphql_1.GraphQLString),
        }),
    });
    const SingleTableDivider = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "SingleTableDivider",
        interfaces: [SingleTableItem],
        fields: () => ({
            ...commonSingleTableItemFields,
            title: attrField("title", graphql_1.GraphQLString),
            color: attrField("color", graphql_1.GraphQLString),
        }),
    });
    const SingleTableChecklist = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "SingleTableChecklist",
        interfaces: [SingleTableItem],
        fields: () => ({
            ...commonSingleTableItemFields,
            title: attrField("title", graphql_1.GraphQLString),
        }),
    });
    const SingleTableChecklistItem = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "SingleTableChecklistItem",
        interfaces: [SingleTableItem],
        fields: () => ({
            ...commonSingleTableItemFields,
            description: attrField("description", graphql_1.GraphQLString),
            note: attrField("note", graphql_1.GraphQLString),
        }),
    });
    ////////////////////////////////////////
    const RelationalItem = new graphql_1.GraphQLInterfaceType({
        name: "RelationalItem",
        fields: () => ({
            id: { type: graphql_1.GraphQLInt },
            type: { type: graphql_1.GraphQLString },
            type2: { type: EnumTableItemType },
            parent: { type: RelationalItem },
            author: { type: Person },
            position: { type: graphql_1.GraphQLString },
            createdAt: { type: graphql_1.GraphQLString },
            updatedAt: { type: graphql_1.GraphQLString },
            isExplicitlyArchived: { type: graphql_1.GraphQLBoolean },
            archivedAt: { type: graphql_1.GraphQLString },
        }),
    });
    const RelationalCommentable = new graphql_1.GraphQLInterfaceType({
        name: "RelationalCommentable",
        fields: () => ({
            id: { type: graphql_1.GraphQLInt },
            type: { type: graphql_1.GraphQLString },
            type2: { type: EnumTableItemType },
        }),
    });
    const commonRelationalItemFields = () => ({
        id: attrField("id", graphql_1.GraphQLInt),
        type: attrField("type", graphql_1.GraphQLString),
        type2: attrField("type2", EnumTableItemType),
        parent: {
            type: RelationalItem,
            plan: EXPORTABLE((deoptimizeIfAppropriate, relationalItemInterface) => function plan($entity) {
                const $plan = $entity.singleRelation("parent");
                deoptimizeIfAppropriate($plan);
                return relationalItemInterface($plan);
            }, [deoptimizeIfAppropriate, relationalItemInterface]),
        },
        author: singleRelationField("author", Person),
        position: attrField("position", graphql_1.GraphQLString),
        createdAt: attrField("created_at", graphql_1.GraphQLString),
        updatedAt: attrField("updated_at", graphql_1.GraphQLString),
        isExplicitlyArchived: attrField("is_explicitly_archived", graphql_1.GraphQLBoolean),
        archivedAt: attrField("archived_at", graphql_1.GraphQLString),
    });
    const RelationalTopic = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "RelationalTopic",
        interfaces: [RelationalItem],
        fields: () => ({
            ...commonRelationalItemFields(),
            title: attrField("title", graphql_1.GraphQLString),
        }),
    });
    const RelationalPost = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "RelationalPost",
        interfaces: [RelationalItem, RelationalCommentable],
        fields: () => ({
            ...commonRelationalItemFields(),
            title: attrField("title", graphql_1.GraphQLString),
            description: attrField("description", graphql_1.GraphQLString),
            note: attrField("note", graphql_1.GraphQLString),
            titleLower: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE((pgSelect, scalarTextResource, sql, sqlFromArgDigests) => function plan($entity) {
                    return pgSelect({
                        resource: scalarTextResource,
                        identifiers: [],
                        args: [
                            {
                                step: $entity.record(),
                            },
                        ],
                        from: (...args) => sql `interfaces_and_unions.relational_posts_title_lower(${sqlFromArgDigests(args)})`,
                        name: "relational_posts_title_lower",
                    }).single();
                }, [index_js_1.pgSelect, scalarTextResource, pg_sql2_1.default, pgSelect_js_1.sqlFromArgDigests]),
            },
        }),
    });
    const RelationalDivider = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "RelationalDivider",
        interfaces: [RelationalItem],
        fields: () => ({
            ...commonRelationalItemFields(),
            title: attrField("title", graphql_1.GraphQLString),
            color: attrField("color", graphql_1.GraphQLString),
        }),
    });
    const RelationalChecklist = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "RelationalChecklist",
        interfaces: [RelationalItem, RelationalCommentable],
        fields: () => ({
            ...commonRelationalItemFields(),
            title: attrField("title", graphql_1.GraphQLString),
        }),
    });
    const RelationalChecklistItem = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "RelationalChecklistItem",
        interfaces: [RelationalItem, RelationalCommentable],
        fields: () => ({
            ...commonRelationalItemFields(),
            description: attrField("description", graphql_1.GraphQLString),
            note: attrField("note", graphql_1.GraphQLString),
        }),
    });
    ////////////////////////////////////////
    const UnionItem = new graphql_1.GraphQLUnionType({
        name: "UnionItem",
        types: () => [
            UnionTopic,
            UnionPost,
            UnionDivider,
            UnionChecklist,
            UnionChecklistItem,
        ],
    });
    const UnionTopic = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "UnionTopic",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLInt),
            title: attrField("title", graphql_1.GraphQLString),
        }),
    });
    const UnionPost = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "UnionPost",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLInt),
            title: attrField("title", graphql_1.GraphQLString),
            description: attrField("description", graphql_1.GraphQLString),
            note: attrField("note", graphql_1.GraphQLString),
        }),
    });
    const UnionDivider = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "UnionDivider",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLInt),
            title: attrField("title", graphql_1.GraphQLString),
            color: attrField("color", graphql_1.GraphQLString),
        }),
    });
    const UnionChecklist = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "UnionChecklist",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLInt),
            title: attrField("title", graphql_1.GraphQLString),
        }),
    });
    const UnionChecklistItem = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgSelectSingleStep)({
        name: "UnionChecklistItem",
        fields: () => ({
            id: attrField("id", graphql_1.GraphQLInt),
            description: attrField("description", graphql_1.GraphQLString),
            note: attrField("note", graphql_1.GraphQLString),
        }),
    });
    ////////////////////////////////////////
    const Entity = new graphql_1.GraphQLUnionType({
        name: "Entity",
        types: () => [Person, Post, Comment],
    });
    ////////////////////////////////////////
    const Vulnerability = new graphql_1.GraphQLInterfaceType({
        name: "Vulnerability",
        fields: {
            cvssScore: {
                type: graphql_1.GraphQLFloat,
            },
        },
    });
    const FirstPartyVulnerability = (0, grafast_1.newObjectTypeBuilder)(grafast_1.ExecutableStep)({
        name: "FirstPartyVulnerability",
        interfaces: [Vulnerability],
        fields: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("id");
                }, []),
            },
            name: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("name");
                }, []),
            },
            cvssScore: {
                type: graphql_1.GraphQLFloat,
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("cvss_score");
                }, []),
            },
            teamName: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("team_name");
                }, []),
            },
        },
    });
    const ThirdPartyVulnerability = (0, grafast_1.newObjectTypeBuilder)(grafast_1.ExecutableStep)({
        name: "ThirdPartyVulnerability",
        interfaces: [Vulnerability],
        fields: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("id");
                }, []),
            },
            name: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("name");
                }, []),
            },
            cvssScore: {
                type: graphql_1.GraphQLFloat,
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("cvss_score");
                }, []),
            },
            vendorName: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE(() => function plan($v) {
                    return $v.get("vendor_name");
                }, []),
            },
        },
    });
    const VulnerabilityEdge = (0, grafast_1.newObjectTypeBuilder)(pgUnionAll_js_1.PgUnionAllSingleStep)({
        name: "VulnerabilityEdge",
        fields: {
            cursor: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE(() => function plan($node) {
                    return $node.cursor();
                }, []),
            },
            node: {
                type: Vulnerability,
                plan: EXPORTABLE(() => function plan($node) {
                    return $node;
                }, []),
            },
        },
    });
    const VulnerabilitiesConnection = (0, grafast_1.newObjectTypeBuilder)(grafast_1.ConnectionStep)({
        name: "VulnerabilitiesConnection",
        fields: {
            edges: {
                type: new graphql_1.GraphQLList(VulnerabilityEdge),
                plan: EXPORTABLE(() => function plan($connection) {
                    return $connection.edges();
                }, []),
            },
            pageInfo: (0, grafast_1.newGrafastFieldConfigBuilder)()({
                type: new graphql_1.GraphQLNonNull(PageInfo),
                plan: EXPORTABLE(() => function plan($connection) {
                    return $connection.pageInfo();
                }, []),
            }),
        },
    });
    const VulnerabilityCondition = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "VulnerabilityCondition",
        fields: {
            todo: {
                type: graphql_1.GraphQLString,
            },
        },
    });
    const VulnerabilitiesOrderBy = new graphql_1.GraphQLEnumType({
        name: "VulnerabilitiesOrderBy",
        values: {
            CVSS_SCORE_ASC: {
                extensions: {
                    grafast: {
                        apply: EXPORTABLE(() => (qb) => {
                            qb.orderBy({
                                attribute: "cvss_score",
                                direction: "ASC",
                            });
                        }, []),
                    },
                },
            },
            CVSS_SCORE_DESC: {
                extensions: {
                    grafast: {
                        apply: EXPORTABLE(() => (qb) => {
                            qb.orderBy({
                                attribute: "cvss_score",
                                direction: "DESC",
                            });
                        }, []),
                    },
                },
            },
        },
    });
    ////////////////////////////////////////
    const Query = (0, grafast_1.newObjectTypeBuilder)(grafast_1.__ValueStep)({
        name: "Query",
        fields: {
            forums: {
                type: new graphql_1.GraphQLList(Forum),
                args: {
                    first: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $forums, arg) {
                            $forums.setFirst(arg.getRaw());
                        }, []),
                    },
                    includeArchived: makeIncludeArchivedArg(($forums) => $forums),
                    condition: {
                        type: ForumCondition,
                        applyPlan: EXPORTABLE((pgWhere) => function plan(_$root, $forums, arg) {
                            arg.apply($forums, pgWhere);
                        }, [pgWhere]),
                    },
                    filter: {
                        type: ForumFilter,
                        applyPlan: EXPORTABLE((pgClassFilterWhere) => function plan(_$root, $forums, arg) {
                            arg.apply($forums, pgClassFilterWhere);
                        }, [pgClassFilterWhere]),
                    },
                },
                plan: EXPORTABLE((deoptimizeIfAppropriate, forumResource) => function plan(_$root) {
                    const $forums = forumResource.find();
                    deoptimizeIfAppropriate($forums);
                    return $forums;
                }, [deoptimizeIfAppropriate, forumResource]),
            },
            forum: {
                type: Forum,
                plan: EXPORTABLE((deoptimizeIfAppropriate, forumResource) => function plan(_$root, { $id }) {
                    const $forum = forumResource.get({
                        id: $id,
                    });
                    deoptimizeIfAppropriate($forum);
                    return $forum;
                }, [deoptimizeIfAppropriate, forumResource]),
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    },
                },
            },
            message: {
                type: Message,
                plan: EXPORTABLE((deoptimizeIfAppropriate, messageResource) => function plan(_$root, { $id }) {
                    const $message = messageResource.get({
                        id: $id,
                    });
                    deoptimizeIfAppropriate($message);
                    return $message;
                }, [deoptimizeIfAppropriate, messageResource]),
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    },
                },
            },
            allMessagesConnection: {
                type: MessagesConnection,
                args: {
                    condition: {
                        type: MessageCondition,
                        applyPlan: EXPORTABLE((pgWhere) => function plan(_$root, $connection, arg) {
                            const $messages = $connection.getSubplan();
                            arg.apply($messages, pgWhere);
                        }, [pgWhere]),
                    },
                    filter: {
                        type: MessageFilter,
                        applyPlan: EXPORTABLE((pgClassFilterWhere) => function plan(_$root, $connection, arg) {
                            const $messages = $connection.getSubplan();
                            arg.apply($messages, pgClassFilterWhere);
                        }, [pgClassFilterWhere]),
                    },
                    includeArchived: makeIncludeArchivedArg(($connection) => $connection.getSubplan()),
                    first: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, val) {
                            $connection.setFirst(val.getRaw());
                        }, []),
                    },
                    last: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setLast(arg.getRaw());
                        }, []),
                    },
                    after: {
                        type: graphql_1.GraphQLString,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setAfter(arg.getRaw());
                        }, []),
                    },
                    before: {
                        type: graphql_1.GraphQLString,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setBefore(arg.getRaw());
                        }, []),
                    },
                    orderBy: {
                        type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(MessagesOrderBy)),
                    },
                },
                plan: EXPORTABLE((connection, deoptimizeIfAppropriate, messageResource) => function plan(_, fieldArgs) {
                    const $messages = messageResource.find();
                    deoptimizeIfAppropriate($messages);
                    // $messages.leftJoin(...);
                    // $messages.innerJoin(...);
                    // $messages.relation('fk_messages_author_id')
                    // $messages.where(...);
                    const $connectionPlan = connection($messages);
                    fieldArgs.apply($messages, "orderBy");
                    // DEFINITELY NOT $messages.orderBy BECAUSE we don't want that applied to aggregates.
                    // DEFINITELY NOT $messages.limit BECAUSE we don't want those limits applied to aggregates or page info.
                    return $connectionPlan;
                }, [grafast_1.connection, deoptimizeIfAppropriate, messageResource]),
            },
            uniqueAuthorCount: {
                type: graphql_1.GraphQLInt,
                args: {
                    featured: {
                        type: graphql_1.GraphQLBoolean,
                    },
                },
                plan: EXPORTABLE((TYPES, deoptimizeIfAppropriate, uniqueAuthorCountResource) => function plan(_$root, { $featured }) {
                    const $plan = uniqueAuthorCountResource.execute([
                        {
                            step: $featured,
                            pgCodec: TYPES.boolean,
                            name: "featured",
                        },
                    ]);
                    deoptimizeIfAppropriate($plan);
                    return $plan;
                }, [index_js_1.TYPES, deoptimizeIfAppropriate, uniqueAuthorCountResource]),
            },
            forumNames: {
                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                plan: EXPORTABLE((pgSelect, scalarTextResource, sql) => function plan(_$root) {
                    const $plan = pgSelect({
                        resource: scalarTextResource,
                        identifiers: [],
                        from: sql `app_public.forum_names()`,
                        name: "forum_names",
                    });
                    return $plan;
                }, [index_js_1.pgSelect, scalarTextResource, pg_sql2_1.default]),
            },
            forumNamesArray: {
                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                plan: EXPORTABLE((forumNamesArrayResource) => function plan(_$root) {
                    return forumNamesArrayResource.execute();
                }, [forumNamesArrayResource]),
            },
            forumNamesCasesList: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLList(graphql_1.GraphQLString)),
                plan: EXPORTABLE((forumNamesCasesResource) => function plan(_$root) {
                    const $plan = forumNamesCasesResource.execute();
                    return $plan;
                }, [forumNamesCasesResource]),
            },
            // TODO
            /*
            forumNamesCasesConnection: {
              type: new GraphQLList(GraphQLString),
              plan: EXPORTABLE(
                (forumNamesArrayResource, connection) =>
                  function plan(_$root) {
                    const $plan = forumNamesArrayResource.execute();
                    return connection($plan);
                  },
                [forumNamesArrayResource, connection],
              ),
            },
            */
            FORUM_NAMES: {
                type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                description: "Like forumNames, only we convert them all to upper case",
                plan: EXPORTABLE((each, lambda, pgSelect, scalarTextResource, sql) => function plan(_$root) {
                    const $names = pgSelect({
                        resource: scalarTextResource,
                        identifiers: [],
                        from: sql `app_public.forum_names()`,
                        name: "forum_names",
                    });
                    // return lambda($names, (names: string[]) => names.map(name => name.toUpperCase())),
                    return each($names, ($name) => lambda($name, (name) => name.toUpperCase(), true));
                }, [grafast_1.each, grafast_1.lambda, index_js_1.pgSelect, scalarTextResource, pg_sql2_1.default]),
            },
            randomUser: {
                type: User,
                plan: EXPORTABLE((deoptimizeIfAppropriate, pgSelect, sql, userResource) => function plan() {
                    const $users = pgSelect({
                        resource: userResource,
                        identifiers: [],
                        from: sql `app_public.random_user()`,
                        name: "random_user",
                    });
                    deoptimizeIfAppropriate($users);
                    return $users.single();
                }, [deoptimizeIfAppropriate, index_js_1.pgSelect, pg_sql2_1.default, userResource]),
            },
            randomUserArray: {
                type: new graphql_1.GraphQLList(User),
                plan: EXPORTABLE((deoptimizeIfAppropriate, randomUserArrayResource) => function plan() {
                    const $select = randomUserArrayResource.execute();
                    deoptimizeIfAppropriate($select);
                    return $select;
                }, [deoptimizeIfAppropriate, randomUserArrayResource]),
            },
            randomUserArraySet: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLList(User)),
                plan: EXPORTABLE((deoptimizeIfAppropriate, randomUserArraySetResource) => function plan() {
                    const $selectPartitioned = randomUserArraySetResource.execute();
                    deoptimizeIfAppropriate($selectPartitioned);
                    return $selectPartitioned;
                }, [deoptimizeIfAppropriate, randomUserArraySetResource]),
            },
            featuredMessages: {
                type: new graphql_1.GraphQLList(Message),
                plan: EXPORTABLE((deoptimizeIfAppropriate, featuredMessagesResource, pgSelect) => function plan() {
                    const $messages = pgSelect({
                        resource: featuredMessagesResource,
                        identifiers: [],
                    });
                    deoptimizeIfAppropriate($messages);
                    return $messages;
                }, [deoptimizeIfAppropriate, featuredMessagesResource, index_js_1.pgSelect]),
            },
            people: {
                type: new graphql_1.GraphQLList(Person),
                plan: EXPORTABLE((deoptimizeIfAppropriate, personResource) => function plan() {
                    const $people = personResource.find();
                    deoptimizeIfAppropriate($people);
                    return $people;
                }, [deoptimizeIfAppropriate, personResource]),
            },
            singleTableItemById: {
                type: SingleTableItem,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((singleTableItemInterface, singleTableItemsResource) => function plan(_$root, { $id }) {
                    const $item = singleTableItemsResource.get({
                        id: $id,
                    });
                    return singleTableItemInterface($item);
                }, [singleTableItemInterface, singleTableItemsResource]),
            },
            singleTableTopicById: {
                type: SingleTableTopic,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((constant, singleTableItemsResource) => function plan(_$root, { $id }) {
                    const $item = singleTableItemsResource.get({
                        id: $id,
                        type: constant("TOPIC", false),
                    });
                    return $item;
                }, [grafast_1.constant, singleTableItemsResource]),
            },
            relationalItemById: {
                type: RelationalItem,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((relationalItemInterface, relationalItemsResource) => function plan(_$root, { $id }) {
                    const $item = relationalItemsResource.get({
                        id: $id,
                    });
                    return relationalItemInterface($item);
                }, [relationalItemInterface, relationalItemsResource]),
            },
            relationalTopicById: {
                type: RelationalTopic,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((relationalTopicsResource) => function plan(_$root, { $id }) {
                    return relationalTopicsResource.get({
                        id: $id,
                    });
                }, [relationalTopicsResource]),
            },
            allRelationalCommentablesList: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(RelationalCommentable)),
                args: {
                    first: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $each, val) {
                            const $commentables = $each.getListStep();
                            $commentables.setFirst(val.getRaw());
                        }, []),
                    },
                },
                plan: EXPORTABLE((TYPES, each, relationalCommentableInterface, relationalCommentableResource, sql) => function plan() {
                    const $commentables = relationalCommentableResource.find();
                    $commentables.orderBy({
                        codec: TYPES.int,
                        fragment: sql `${$commentables.alias}.id`,
                        direction: "ASC",
                    });
                    return each($commentables, ($commentable) => relationalCommentableInterface($commentable));
                }, [
                    index_js_1.TYPES,
                    grafast_1.each,
                    relationalCommentableInterface,
                    relationalCommentableResource,
                    pg_sql2_1.default,
                ]),
            },
            unionItemById: {
                type: UnionItem,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((unionItemUnion, unionItemsResource) => function plan(_$root, { $id }) {
                    const $item = unionItemsResource.get({
                        id: $id,
                    });
                    return unionItemUnion($item);
                }, [unionItemUnion, unionItemsResource]),
            },
            unionItemByIdViaUnionAll: {
                type: UnionItem,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((TYPES, pgUnionAll, sql, unionChecklistItemsResource, unionChecklistsResource, unionDividersResource, unionPostsResource, unionTopicsResource) => function plan(_$root, { $id }) {
                    const $items = pgUnionAll({
                        resourceByTypeName: {
                            UnionTopic: unionTopicsResource,
                            UnionPost: unionPostsResource,
                            UnionDivider: unionDividersResource,
                            UnionChecklist: unionChecklistsResource,
                            UnionChecklistItem: unionChecklistItemsResource,
                        },
                    });
                    $items.where(sql `${$items}.id = ${$items.placeholder($id, TYPES.int)}`);
                    return $items.single();
                }, [
                    index_js_1.TYPES,
                    pgUnionAll_js_1.pgUnionAll,
                    pg_sql2_1.default,
                    unionChecklistItemsResource,
                    unionChecklistsResource,
                    unionDividersResource,
                    unionPostsResource,
                    unionTopicsResource,
                ]),
            },
            unionTopicById: {
                type: UnionTopic,
                args: {
                    id: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((unionTopicsResource) => function plan(_$root, { $id }) {
                    return unionTopicsResource.get({
                        id: $id,
                    });
                }, [unionTopicsResource]),
            },
            allUnionItemsList: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(UnionItem)),
                plan: EXPORTABLE((TYPES, each, sql, unionItemUnion, unionItemsResource) => function plan() {
                    const $items = unionItemsResource.find();
                    $items.orderBy({
                        codec: TYPES.int,
                        fragment: sql `${$items.alias}.id`,
                        direction: "ASC",
                    });
                    return each($items, ($item) => unionItemUnion($item));
                }, [index_js_1.TYPES, grafast_1.each, pg_sql2_1.default, unionItemUnion, unionItemsResource]),
            },
            searchEntities: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(Entity)),
                args: {
                    query: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    },
                },
                plan: EXPORTABLE((TYPES, deoptimizeIfAppropriate, each, entitySearchResource, entityUnion) => function plan(_$root, { $query }) {
                    const $step = entitySearchResource.execute([
                        {
                            step: $query,
                            pgCodec: TYPES.text,
                            name: "query",
                        },
                    ]);
                    deoptimizeIfAppropriate($step);
                    return each($step, ($item) => entityUnion($item));
                }, [
                    index_js_1.TYPES,
                    deoptimizeIfAppropriate,
                    grafast_1.each,
                    entitySearchResource,
                    entityUnion,
                ]),
            },
            personByPersonId: {
                type: Person,
                args: {
                    personId: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                    },
                },
                plan: EXPORTABLE((personResource) => function plan(_$root, { $personId }) {
                    return personResource.get({
                        person_id: $personId,
                    });
                }, [personResource]),
            },
            nonNullableNull: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                description: "Claims to be non-nullable, but always returns null. Used to test root-level null handling.",
                plan: EXPORTABLE((constant) => function plan() {
                    return constant(null);
                }, [grafast_1.constant]),
            },
            nonNullableError: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
                description: "Non-nullable, always throws. Used to test root-level null handling.",
                plan: EXPORTABLE((error) => function plan() {
                    return error(new Error("Generic error from nonNullableError field in example schema"));
                }, [grafast_1.error]),
            },
            deepObject: {
                type: new graphql_1.GraphQLObjectType({
                    name: "DeepObject",
                    fields: {
                        number: {
                            type: graphql_1.GraphQLInt,
                        },
                        numbers: {
                            type: new graphql_1.GraphQLList(graphql_1.GraphQLInt),
                        },
                        friend: {
                            type: new graphql_1.GraphQLObjectType({
                                name: "DeepObjectFriend",
                                fields: {
                                    name: { type: graphql_1.GraphQLString },
                                    occupation: { type: graphql_1.GraphQLString },
                                    status: { type: graphql_1.GraphQLString },
                                },
                            }),
                        },
                    },
                }),
                resolve: EXPORTABLE(() => function resolve() {
                    return {
                        number: 42,
                        numbers: [1, 1, 2, 3, 5, 8, 13],
                        friend: {
                            name: "Marvin",
                            occupation: "Android",
                            status: "paranoid",
                        },
                    };
                }, []),
            },
            vulnerabilities: {
                type: new graphql_1.GraphQLList(Vulnerability),
                args: {
                    first: {
                        type: graphql_1.GraphQLInt,
                    },
                    offset: {
                        type: graphql_1.GraphQLInt,
                    },
                },
                plan: EXPORTABLE((TYPES, constant, firstPartyVulnerabilitiesResource, pgUnionAll, sql, thirdPartyVulnerabilitiesResource) => function plan(_, { $first, $offset }) {
                    // IMPORTANT: for cursor pagination, type must be part of cursor condition
                    const $vulnerabilities = pgUnionAll({
                        name: "vulnerabilities",
                        attributes: {
                            cvss_score: {
                                codec: TYPES.float,
                                notNull: false,
                            },
                        },
                        resourceByTypeName: {
                            FirstPartyVulnerability: firstPartyVulnerabilitiesResource,
                            ThirdPartyVulnerability: thirdPartyVulnerabilitiesResource,
                        },
                    });
                    $vulnerabilities.orderBy({
                        attribute: "cvss_score",
                        direction: "DESC",
                    });
                    $vulnerabilities.where({
                        type: "attribute",
                        attribute: "cvss_score",
                        callback: (alias) => sql `${alias} > ${$vulnerabilities.placeholder(constant(6, false), TYPES.float)}`,
                    });
                    $vulnerabilities.setFirst($first);
                    $vulnerabilities.setOffset($offset);
                    return $vulnerabilities;
                }, [
                    index_js_1.TYPES,
                    grafast_1.constant,
                    firstPartyVulnerabilitiesResource,
                    pgUnionAll_js_1.pgUnionAll,
                    pg_sql2_1.default,
                    thirdPartyVulnerabilitiesResource,
                ]),
            },
            vulnerabilitiesConnection: {
                type: VulnerabilitiesConnection,
                args: {
                    condition: {
                        type: VulnerabilityCondition,
                        applyPlan: EXPORTABLE((pgWhere) => function plan(_$root, $connection, arg) {
                            const $collection = $connection.getSubplan();
                            arg.apply($collection, pgWhere);
                        }, [pgWhere]),
                    },
                    first: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, val) {
                            $connection.setFirst(val.getRaw());
                        }, []),
                    },
                    last: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setLast(arg.getRaw());
                        }, []),
                    },
                    offset: {
                        type: graphql_1.GraphQLInt,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setOffset(arg.getRaw());
                        }, []),
                    },
                    after: {
                        type: graphql_1.GraphQLString,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setAfter(arg.getRaw());
                        }, []),
                    },
                    before: {
                        type: graphql_1.GraphQLString,
                        applyPlan: EXPORTABLE(() => function plan(_$root, $connection, arg) {
                            $connection.setBefore(arg.getRaw());
                        }, []),
                    },
                    orderBy: {
                        type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(VulnerabilitiesOrderBy)),
                    },
                },
                plan: EXPORTABLE((TYPES, connection, firstPartyVulnerabilitiesResource, pgUnionAll, thirdPartyVulnerabilitiesResource) => function plan(_, fieldArgs) {
                    // IMPORTANT: for cursor pagination, type must be part of cursor condition
                    const $vulnerabilities = pgUnionAll({
                        name: "vulnerabilities",
                        attributes: {
                            cvss_score: {
                                codec: TYPES.float,
                                notNull: false,
                            },
                        },
                        resourceByTypeName: {
                            FirstPartyVulnerability: firstPartyVulnerabilitiesResource,
                            ThirdPartyVulnerability: thirdPartyVulnerabilitiesResource,
                        },
                    });
                    fieldArgs.apply($vulnerabilities, "orderBy");
                    return connection($vulnerabilities);
                }, [
                    index_js_1.TYPES,
                    grafast_1.connection,
                    firstPartyVulnerabilitiesResource,
                    pgUnionAll_js_1.pgUnionAll,
                    thirdPartyVulnerabilitiesResource,
                ]),
            },
        },
    });
    const CreateRelationalPostInput = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "CreateRelationalPostInput",
        fields: {
            title: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            },
            description: {
                type: graphql_1.GraphQLString,
            },
            note: {
                type: graphql_1.GraphQLString,
            },
        },
    });
    const RelationalPostPatch = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "RelationalPostPatch",
        fields: {
            // All nullable, since it's a patch.
            title: {
                type: graphql_1.GraphQLString,
            },
            description: {
                type: graphql_1.GraphQLString,
            },
            note: {
                type: graphql_1.GraphQLString,
            },
        },
    });
    const UpdateRelationalPostByIdInput = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "UpdateRelationalPostByIdInput",
        fields: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
            },
            patch: {
                type: new graphql_1.GraphQLNonNull(RelationalPostPatch),
            },
        },
    });
    const DeleteRelationalPostByIdInput = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "DeleteRelationalPostByIdInput",
        fields: {
            id: {
                type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt),
            },
        },
    });
    const CreateRelationalPostPayload = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgClassExpressionStep)({
        name: "CreateRelationalPostPayload",
        fields: {
            post: {
                type: RelationalPost,
                plan: EXPORTABLE((relationalPostsResource) => function plan($post) {
                    return relationalPostsResource.get({ id: $post.get("id") });
                }, [relationalPostsResource]),
            },
            id: {
                type: graphql_1.GraphQLInt,
                plan: EXPORTABLE(() => function plan($post) {
                    return $post.get("id");
                }, []),
            },
            query: {
                type: Query,
                plan: EXPORTABLE((rootValue) => function plan() {
                    return rootValue();
                }, [grafast_1.rootValue]),
            },
        },
    });
    const UpdateRelationalPostByIdPayload = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgUpdateSingleStep)({
        name: "UpdateRelationalPostByIdPayload",
        fields: {
            post: {
                type: RelationalPost,
                plan: EXPORTABLE((relationalPostsResource) => function plan($post) {
                    return relationalPostsResource.get({ id: $post.get("id") });
                }, [relationalPostsResource]),
            },
            id: {
                type: graphql_1.GraphQLInt,
                plan: EXPORTABLE(() => function plan($post) {
                    return $post.get("id");
                }, []),
            },
            query: {
                type: Query,
                plan: EXPORTABLE((rootValue) => function plan() {
                    return rootValue();
                }, [grafast_1.rootValue]),
            },
        },
    });
    const DeleteRelationalPostByIdPayload = (0, grafast_1.newObjectTypeBuilder)(index_js_1.PgDeleteSingleStep)({
        name: "DeleteRelationalPostByIdPayload",
        fields: {
            // Since we've deleted the post we cannot go and fetch it; so we must
            // return the record from the mutation RETURNING clause
            post: {
                type: RelationalPost,
                plan: EXPORTABLE((pgSelectSingleFromRecord, relationalPostsResource) => function plan($post) {
                    return pgSelectSingleFromRecord(relationalPostsResource, $post.record());
                }, [index_js_1.pgSelectSingleFromRecord, relationalPostsResource]),
            },
            id: {
                type: graphql_1.GraphQLInt,
                plan: EXPORTABLE(() => function plan($post) {
                    return $post.get("id");
                }, []),
            },
            query: {
                type: Query,
                plan: EXPORTABLE((rootValue) => function plan() {
                    return rootValue();
                }, [grafast_1.rootValue]),
            },
        },
    });
    const MultipleActionsInput = (0, grafast_1.newInputObjectTypeBuilder)()({
        name: "MultipleActionsInput",
        fields: {
            a: {
                type: graphql_1.GraphQLInt,
            },
        },
    });
    const MultipleActionsPayload = (0, grafast_1.newObjectTypeBuilder)(withPgClient_js_1.WithPgClientStep)({
        name: "MultipleActionsPayload",
        fields: {
            i: {
                type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt)),
                plan: EXPORTABLE(() => function plan($parent) {
                    return $parent;
                }, []),
            },
        },
    });
    const Mutation = (0, grafast_1.newObjectTypeBuilder)(grafast_1.__ValueStep)({
        name: "Mutation",
        fields: {
            createRelationalPost: {
                args: {
                    input: {
                        type: new graphql_1.GraphQLNonNull(CreateRelationalPostInput),
                    },
                },
                type: CreateRelationalPostPayload,
                plan: EXPORTABLE((bakedInput, constant, getNullableInputTypeAtPath, pgInsertSingle, relationalItemsResource, relationalPostsResource) => function plan(_$root, fieldArgs) {
                    const $item = pgInsertSingle(relationalItemsResource, {
                        type: constant `POST`,
                        author_id: constant(2, false),
                    });
                    const $itemId = $item.get("id");
                    const $post = pgInsertSingle(relationalPostsResource, {
                        id: $itemId,
                    });
                    const inputArgType = fieldArgs.typeAt("input");
                    for (const key of ["title", "description", "note"]) {
                        const $rawValue = fieldArgs.getRaw(["input", key]);
                        const $value = bakedInput(getNullableInputTypeAtPath(inputArgType, [key]), $rawValue);
                        // TODO: pgInsertSingle needs to attributes with undefined values at runtime
                        $post.set(key, $value);
                    }
                    // NOTE: returning a record() here is unnecessary and requires
                    // `select *` privileges. In a normal schema we'd just return the
                    // mutation plan directly. Even if we're sharing types it would
                    // generally be better to return the identifier and then look up the
                    // record using the identifier. Nonetheless, this is useful for tests.
                    // Since our field type, `CreateRelationalPostPayload`, is shared between
                    // `createRelationalPost`, `createThreeRelationalPosts` and
                    // `createThreeRelationalPostsComputed` must return a common plan
                    // type that `CreateRelationalPostPayload` can use; in this case a
                    // `PgClassExpressionStep`
                    return $post.record();
                }, [
                    grafast_1.bakedInput,
                    grafast_1.constant,
                    grafast_1.getNullableInputTypeAtPath,
                    index_js_1.pgInsertSingle,
                    relationalItemsResource,
                    relationalPostsResource,
                ]),
            },
            createThreeRelationalPosts: {
                description: "This silly mutation is specifically to ensure that mutation plans are not tree-shaken - we never want to throw away mutation side effects.",
                type: CreateRelationalPostPayload,
                plan: EXPORTABLE((constant, pgInsertSingle, relationalItemsResource, relationalPostsResource) => function plan() {
                    // Only the _last_ post plan is returned; there's no dependency on
                    // the first two posts, and yet they should not be tree-shaken
                    // because they're mutations.
                    let $post;
                    for (let i = 0; i < 3; i++) {
                        const $item = pgInsertSingle(relationalItemsResource, {
                            type: constant `POST`,
                            author_id: constant(2, false),
                        });
                        const $itemId = $item.get("id");
                        $post = pgInsertSingle(relationalPostsResource, {
                            id: $itemId,
                            title: constant(`Post #${i + 1}`, false),
                            description: constant(`Desc ${i + 1}`, false),
                            note: constant(null),
                        });
                    }
                    // See NOTE in createRelationalPost plan.
                    return $post.record();
                }, [
                    grafast_1.constant,
                    index_js_1.pgInsertSingle,
                    relationalItemsResource,
                    relationalPostsResource,
                ]),
            },
            createThreeRelationalPostsComputed: {
                description: "This silly mutation is specifically to ensure that mutation plans are not tree-shaken even if they use plans that are normally side-effect free - we never want to throw away mutation side effects.",
                type: CreateRelationalPostPayload,
                plan: EXPORTABLE((TYPES, constant, pgSelect, relationalPostsResource, sql) => function plan() {
                    // Only the _last_ post plan is returned; there's no dependency on
                    // the first two posts, and yet they should not be tree-shaken
                    // because they're mutations.
                    let $post;
                    for (let i = 0; i < 3; i++) {
                        $post = pgSelect({
                            resource: relationalPostsResource,
                            identifiers: [],
                            from: (authorId, title) => sql `interfaces_and_unions.insert_post(${authorId.placeholder}, ${title.placeholder})`,
                            args: [
                                {
                                    step: constant(2, false),
                                    pgCodec: TYPES.int,
                                },
                                {
                                    step: constant(`Computed post #${i + 1}`, false),
                                    pgCodec: TYPES.text,
                                },
                            ],
                            mode: "mutation",
                        });
                    }
                    // See NOTE in createRelationalPost plan.
                    return $post.single().record();
                }, [index_js_1.TYPES, grafast_1.constant, index_js_1.pgSelect, relationalPostsResource, pg_sql2_1.default]),
            },
            updateRelationalPostById: {
                args: {
                    input: {
                        type: new graphql_1.GraphQLNonNull(UpdateRelationalPostByIdInput),
                    },
                },
                type: UpdateRelationalPostByIdPayload,
                plan: EXPORTABLE((bakedInput, getNullableInputTypeAtPath, pgUpdateSingle, relationalPostsResource) => function plan(_$root, fieldArgs) {
                    const $post = pgUpdateSingle(relationalPostsResource, {
                        id: fieldArgs.$input.$id,
                    });
                    const inputArgType = fieldArgs.typeAt("input");
                    for (const key of ["title", "description", "note"]) {
                        const $rawValue = fieldArgs.getRaw(["input", "patch", key]);
                        const $value = bakedInput(getNullableInputTypeAtPath(inputArgType, ["patch", key]), $rawValue);
                        // TODO: pgUpdateSingle needs to ignore values set to undefined
                        $post.set(key, $value);
                    }
                    return $post;
                }, [
                    grafast_1.bakedInput,
                    grafast_1.getNullableInputTypeAtPath,
                    index_js_1.pgUpdateSingle,
                    relationalPostsResource,
                ]),
            },
            deleteRelationalPostById: {
                args: {
                    input: {
                        type: new graphql_1.GraphQLNonNull(DeleteRelationalPostByIdInput),
                    },
                },
                type: DeleteRelationalPostByIdPayload,
                plan: EXPORTABLE((pgDeleteSingle, relationalPostsResource) => function plan(_$root, { $input: { $id } }) {
                    const $post = pgDeleteSingle(relationalPostsResource, {
                        id: $id,
                    });
                    return $post;
                }, [index_js_1.pgDeleteSingle, relationalPostsResource]),
            },
            multipleActions: {
                args: {
                    input: {
                        type: new graphql_1.GraphQLNonNull(MultipleActionsInput),
                    },
                },
                type: MultipleActionsPayload,
                plan: EXPORTABLE((executor, object, sleep, sql, withPgClientTransaction) => function plan(_$root, { $input: { $a } }) {
                    const $transactionResult = withPgClientTransaction(executor, object({
                        a: $a,
                    }), async (client, { a }) => {
                        // Set a transaction variable to reference later
                        await client.query(sql.compile(sql `select set_config('my_app.a', ${sql.value(a ?? 1)}, true);`));
                        // Run some SQL
                        const { rows } = await client.query(sql.compile(sql `select * from generate_series(1, ${sql.value(a ?? 1)}) as i;`));
                        // Do some asynchronous work (e.g. talk to Stripe or whatever)
                        await sleep(2);
                        // Use the transaction variable to ensure we're still in the transaction
                        const { rows: rows2 } = await client.query(sql.compile(sql `select i + current_setting('my_app.a', true)::int as i from generate_series(${sql.value(rows[rows.length - 1].i)}, 10) as i;`));
                        // Return the data
                        return rows2.map((row) => row.i);
                    });
                    // This line is critical to test setting hasSideEffects on a withPgClient call
                    $transactionResult.hasSideEffects = true;
                    return $transactionResult;
                }, [executor, grafast_1.object, sleep, pg_sql2_1.default, withPgClient_js_1.withPgClientTransaction]),
            },
        },
    });
    const ForumMessageSubscriptionPayload = (0, grafast_1.newObjectTypeBuilder)(json_1.JSONParseStep)({
        name: "ForumMessageSubscriptionPayload",
        fields: {
            operationType: {
                type: graphql_1.GraphQLString,
                plan: EXPORTABLE((lambda) => function plan($event) {
                    return lambda($event.get("op"), (txt) => String(txt).toLowerCase(), true);
                }, [grafast_1.lambda]),
            },
            message: {
                type: Message,
                plan: EXPORTABLE((messageResource) => function plan($event) {
                    return messageResource.get({ id: $event.get("id") });
                }, [messageResource]),
            },
        },
    });
    const Subscription = (0, grafast_1.newObjectTypeBuilder)(grafast_1.__ValueStep)({
        name: "Subscription",
        fields: {
            forumMessage: {
                args: {
                    forumId: {
                        type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                    },
                },
                type: ForumMessageSubscriptionPayload,
                subscribePlan: EXPORTABLE((context, jsonParse, lambda, listen) => function subscribePlan(_$root, args) {
                    const $forumId = args.getRaw("forumId");
                    const $topic = lambda($forumId, (id) => `forum:${id}:message`, true);
                    const $pgSubscriber = context().get("pgSubscriber");
                    return listen($pgSubscriber, $topic, jsonParse);
                }, [grafast_1.context, json_1.jsonParse, grafast_1.lambda, grafast_1.listen]),
                plan: EXPORTABLE(() => function plan($event) {
                    return $event;
                }, []),
            },
        },
    });
    return new graphql_1.GraphQLSchema({
        query: Query,
        mutation: Mutation,
        subscription: Subscription,
        types: [
            // Don't forget to add all types that implement interfaces here
            // otherwise they _might_ not show up in the schema.
            SingleTableTopic,
            SingleTablePost,
            SingleTableDivider,
            SingleTableChecklist,
            SingleTableChecklistItem,
            RelationalTopic,
            RelationalPost,
            RelationalDivider,
            RelationalChecklist,
            RelationalChecklistItem,
            FirstPartyVulnerability,
            ThirdPartyVulnerability,
        ],
        extensions: {
            graphileExporter: {
                deps: [
                    relationalDividersResource,
                    relationalChecklistsResource,
                    relationalChecklistItemsResource,
                ],
            },
        },
        enableDeferStream: true,
    });
}
async function main() {
    const filePath = `${__dirname}/../../__tests__/schema.graphql`;
    const schema = makeExampleSchema();
    (0, fs_1.writeFileSync)(filePath, 
    //prettier.format(
    (0, graphql_1.printSchema)(schema));
}
if (require.main === module) {
    main().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}
const pgClassFilterWhere = EXPORTABLE((PgClassFilter) => function pgClassFilterWhere(qb) {
    return new PgClassFilter(qb.whereBuilder(), qb.alias);
}, [index_js_1.PgClassFilter]);
function pgWhere(qb) {
    return qb.whereBuilder();
}
const includeArchivedCondition = EXPORTABLE((sql) => function includeArchivedCondition([sqlParentArchivedAt, value]) {
    return (queryBuilder) => {
        if (value === "YES") {
            // No restriction
        }
        else if (value === "EXCLUSIVELY") {
            queryBuilder.where(sql `${queryBuilder}.archived_at is not null`);
        }
        else if (value === "INHERIT" &&
            // INHERIT only works if the parent has an archived_at attribute.
            sqlParentArchivedAt !== undefined) {
            queryBuilder.where(sql `(${queryBuilder.alias}.archived_at is null) = (${sqlParentArchivedAt} is null)`);
        }
        else {
            queryBuilder.where(sql `${queryBuilder}.archived_at is null`);
        }
    };
}, [pg_sql2_1.default]);
//# sourceMappingURL=exampleSchema.js.map