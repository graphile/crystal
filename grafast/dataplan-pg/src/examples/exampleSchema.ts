/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

/*
 * This is a hand-rolled GraphQL schema that we used throughout the development
 * of Grafast; it's used for the @dataplan/pg tests and demonstrates common
 * patterns as well as edge cases. This is NOT meant to be an example of how
 * _you_ should write a schema, in particular it's (deliberately) quite
 * inconsistent and has many ways of achieving the same goals. I would not
 * recommend reading it in full, but dipping in to particular places you're
 * interested in might be useful.
 */

import { jsonParse, JSONParseStep } from "@dataplan/json";
import * as crypto from "crypto";
import { writeFileSync } from "fs";
import type {
  AccessStep,
  BaseGraphQLRootValue,
  GrafastArgumentConfig,
  GrafastFieldConfig,
  GrafastSubscriber,
  Maybe,
} from "grafast";
import {
  __InputObjectStep,
  __InputObjectStepWithDollars,
  __InputStaticLeafStep,
  __ListTransformStep,
  __TrackedValueStep,
  __TrackedValueStepWithDollars,
  __ValueStep,
  bakedInput,
  connection,
  ConnectionStep,
  constant,
  context,
  each,
  EdgeStep,
  error,
  ExecutableStep,
  filter,
  get,
  getNullableInputTypeAtPath,
  GraphQLDeferDirective,
  graphqlHasStreamDefer,
  GraphQLStreamDirective,
  groupBy,
  inhibitOnNull,
  lambda,
  listen,
  newGrafastFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  object,
  rootValue,
  Step,
} from "grafast";
import type { GraphQLOutputType } from "grafast/graphql";
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
  printSchema,
} from "grafast/graphql";
import { specifiedDirectives } from "graphql";
import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

//import prettier from "prettier";
import type {
  GetPgResourceRelations,
  PgCodecAttribute,
  PgCodecAttributeVia,
  PgCondition,
  PgExecutorContext,
  PgInsertSingleStep,
  PgSelectStep,
  WithPgClient,
} from "../";
import type { NodePostgresPgClient, PgSubscriber } from "../adaptors/pg";
import { listOfCodec, sqlValueWithCodec } from "../codecs.js";
import {
  makeRegistry,
  makeRegistryBuilder,
  pgResourceOptions,
} from "../datasource.js";
import {
  enumCodec,
  PgBooleanFilter,
  pgClassExpression,
  PgClassExpressionStep,
  PgClassFilter,
  pgDeleteSingle,
  PgDeleteSingleStep,
  PgExecutor,
  pgInsertSingle,
  PgManyFilter,
  PgResource,
  pgSelect,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  pgUpdateSingle,
  PgUpdateSingleStep,
  recordCodec,
  TYPES,
} from "../index.js";
import type {
  GetPgResourceAttributes,
  PgCodec,
  PgSelectQueryBuilderCallback,
} from "../interfaces";
import type { PgSelectQueryBuilder } from "../steps/pgSelect.js";
import { sqlFromArgDigests } from "../steps/pgSelect.js";
import type {
  PgUnionAllQueryBuilder,
  PgUnionAllSingleStep,
  PgUnionAllStep,
} from "../steps/pgUnionAll.js";
import { pgUnionAll } from "../steps/pgUnionAll.js";
import {
  SideEffectWithPgClientStep,
  sideEffectWithPgClientTransaction,
} from "../steps/withPgClient.js";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
  nameHint?: string,
): T {
  const forbiddenIndex = args.findIndex(isForbidden);
  if (forbiddenIndex >= 0) {
    throw new Error(
      `${nameHint ?? "Anonymous"} EXPORTABLE call's args[${forbiddenIndex}] is not allowed to be exported.`,
    );
  }
  const fn: T = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
      $exporter$name: { writable: true, value: nameHint },
    });
  }
  return fn;
}

export function isForbidden(thing: unknown): thing is { $$export: false } {
  return (
    (typeof thing === "object" || typeof thing === "function") &&
    thing !== null &&
    "$$export" in thing &&
    thing.$$export === false
  );
}

// These are what the generics extend from

declare global {
  namespace Grafast {
    interface Context {
      pgSettings: Record<string, string | undefined> | null;
      withPgClient: WithPgClient<NodePostgresPgClient>;
      pgSubscriber: PgSubscriber | null;
    }
  }
}

/*+--------------------------------------------------------------------------+
  |                               DATA SOURCES                               |
  +--------------------------------------------------------------------------+*/

export function makeExampleSchema(
  options: { deoptimize?: boolean } = Object.create(null),
): GraphQLSchema {
  const executor = EXPORTABLE(
    (PgExecutor, context, object) =>
      new PgExecutor({
        name: "main",
        context: () => {
          const $context = context();
          return object({
            pgSettings: $context.get("pgSettings"),
            withPgClient: $context.get("withPgClient"),
          }) as Step<PgExecutorContext<Grafast.Context["pgSettings"]>>;
        },
      }),
    [PgExecutor, context, object],
    "defaultPgExecutor",
  );

  /**
   * Applies auth checks to the plan; we are using a placeholder here for now.
   */
  const selectAuth = EXPORTABLE(
    (sql) => ($step: PgSelectStep<any>) => {
      $step.where(sql`true /* authorization checks */`);
    },
    [sql],
    "selectAuth",
  );

  const registryConfig = EXPORTABLE(
    (
      PgResource,
      TYPES,
      enumCodec,
      executor,
      listOfCodec,
      makeRegistryBuilder,
      pgResourceOptions,
      recordCodec,
      selectAuth,
      sql,
      sqlFromArgDigests,
    ) => {
      const col = <
        TOptions extends {
          codec: PgCodec;
          notNull?: boolean;
          expression?: PgCodecAttribute<any>["expression"];
          via?: PgCodecAttributeVia;
          identicalVia?: PgCodecAttributeVia;
        },
      >(
        options: TOptions,
      ): PgCodecAttribute<TOptions extends { codec: infer U } ? U : never> => {
        const { notNull, codec, expression, via, identicalVia } = options;
        return {
          codec: codec as TOptions extends { codec: infer U } ? U : never,
          notNull: !!notNull,
          expression,
          via,
          identicalVia,
        };
      };

      const forumCodec = recordCodec({
        executor,
        name: "forums",
        identifier: sql`app_public.forums`,
        attributes: {
          id: col({ notNull: true, codec: TYPES.uuid }),
          name: col({ notNull: true, codec: TYPES.citext }),
          archived_at: col({ codec: TYPES.timestamptz }),
          is_archived: col({
            codec: TYPES.boolean,
            expression: (alias) => sql`${alias}.archived_at is not null`,
          }),
        },
      });

      const userCodec = recordCodec({
        executor,
        name: "users",
        identifier: sql`app_public.users`,
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
        identifier: sql`app_public.messages`,
        attributes: {
          id: col({ notNull: true, codec: TYPES.uuid }),
          body: col({ notNull: true, codec: TYPES.text }),
          author_id: col({
            notNull: true,
            codec: TYPES.uuid,
            identicalVia: { relation: "author", attribute: "id" },
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
            expression: (alias) => sql`${alias}.archived_at is not null`,
          }),
        },
      });

      const uniqueAuthorCountResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: TYPES.int,
        from: (...args) =>
          sql`app_public.unique_author_count(${sqlFromArgDigests(args)})`,
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

      const forumNamesArrayResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: listOfCodec(TYPES.text),
        from: (...args) =>
          sql`app_public.forum_names_array(${sqlFromArgDigests(args)})`,
        name: "forum_names_array",
        parameters: [],
        isUnique: true, // No setof
      });

      const forumNamesCasesResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: listOfCodec(TYPES.text),
        from: (...args) =>
          sql`app_public.forum_names_cases(${sqlFromArgDigests(args)})`,
        name: "forum_names_cases",
        parameters: [],
      });

      const forumsUniqueAuthorCountResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: TYPES.int,
        from: (...args) =>
          sql`app_public.forums_unique_author_count(${sqlFromArgDigests(
            args,
          )})`,
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

      const scalarTextResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: TYPES.text,
        from: sql`(select '')`,
        name: "text",
      });

      const messageResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: messagesCodec,
        from: sql`app_public.messages`,
        name: "messages",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const userResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: userCodec,
        from: sql`app_public.users`,
        name: "users",
        uniques: [
          { attributes: ["id"], isPrimary: true },
          { attributes: ["username"] },
        ],
      });

      const forumResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: forumCodec,
        from: sql`app_public.forums`,
        name: "forums",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const usersMostRecentForumResourceOptions =
        PgResource.functionResourceOptions(forumResourceOptions, {
          name: "users_most_recent_forum",
          from: (...args) =>
            sql`app_public.users_most_recent_forum(${sqlFromArgDigests(args)})`,
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

      const featuredMessagesResourceOptions =
        PgResource.functionResourceOptions(messageResourceOptions, {
          name: "featured_messages",
          from: (...args) =>
            sql`app_public.featured_messages(${sqlFromArgDigests(args)})`,
          returnsSetof: true,
          returnsArray: false,
          parameters: [],
        });

      const forumsFeaturedMessagesResourceOptions =
        PgResource.functionResourceOptions(messageResourceOptions, {
          name: "forums_featured_messages",
          from: (...args) =>
            sql`app_public.forums_featured_messages(${sqlFromArgDigests(
              args,
            )})`,
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

      const randomUserArrayResourceOptions = PgResource.functionResourceOptions(
        userResourceOptions,
        {
          name: "random_user_array",
          from: (...args) =>
            sql`app_public.random_user_array(${sqlFromArgDigests(args)})`,
          returnsArray: true,
          returnsSetof: false,
          parameters: [],
        },
      );

      const randomUserArraySetResourceOptions =
        PgResource.functionResourceOptions(userResourceOptions, {
          name: "random_user_array_set",
          from: (...args) =>
            sql`app_public.random_user_array_set(${sqlFromArgDigests(args)})`,
          returnsSetof: true,
          returnsArray: true,
          parameters: [],
        });

      const forumsMessagesListSetResourceOptions =
        PgResource.functionResourceOptions(messageResourceOptions, {
          name: "forums_messages_list_set",
          from: (...args) =>
            sql`app_public.forums_messages_list_set(${sqlFromArgDigests(
              args,
            )})`,
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
        identifier: sql`interfaces_and_unions.union__entity`,
        attributes: {
          person_id: col({ codec: TYPES.int, notNull: false }),
          post_id: col({ codec: TYPES.int, notNull: false }),
          comment_id: col({ codec: TYPES.int, notNull: false }),
        },
      });

      const personBookmarksCodec = recordCodec({
        executor,
        name: "person_bookmarks",
        identifier: sql`interfaces_and_unions.person_bookmarks`,
        attributes: {
          id: col({ codec: TYPES.int, notNull: true }),
          person_id: col({
            codec: TYPES.int,
            notNull: true,
            identicalVia: { relation: "person", attribute: "person_id" },
          }),
          bookmarked_entity: col({
            codec: unionEntityCodec,
            notNull: true,
          }),
        },
      });

      const personBookmarksResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: personBookmarksCodec,
        from: sql`interfaces_and_unions.person_bookmarks`,
        name: "person_bookmarks",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const personCodec = recordCodec({
        executor,
        name: "people",
        identifier: sql`interfaces_and_unions.people`,
        attributes: {
          person_id: col({ codec: TYPES.int, notNull: true }),
          username: col({ codec: TYPES.text, notNull: true }),
        },
      });

      const personResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: personCodec,
        from: sql`interfaces_and_unions.people`,
        name: "people",
        uniques: [
          { attributes: ["person_id"], isPrimary: true },
          { attributes: ["username"] },
        ],
      });

      const postCodec = recordCodec({
        executor,
        name: "posts",
        identifier: sql`interfaces_and_unions.posts`,
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

      const postResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: postCodec,
        from: sql`interfaces_and_unions.posts`,
        name: "posts",
        uniques: [{ attributes: ["post_id"], isPrimary: true }],
      });

      const commentCodec = recordCodec({
        executor,
        name: "comments",
        identifier: sql`interfaces_and_unions.comments`,
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
            identicalVia: { relation: "post", attribute: "post_id" },
          }),
          body: col({ codec: TYPES.text, notNull: true }),
        },
      });

      const commentResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: commentCodec,
        from: sql`interfaces_and_unions.comments`,
        name: "comments",
        uniques: [{ attributes: ["comment_id"], isPrimary: true }],
      });

      const itemTypeEnumCodec = enumCodec({
        name: "item_type",
        identifier: sql`interfaces_and_unions.item_type`,
        values: ["TOPIC", "POST", "DIVIDER", "CHECKLIST", "CHECKLIST_ITEM"],
      });

      const enumTableItemTypeCodec = recordCodec({
        executor,
        name: "enum_table_item_type",
        identifier: sql`interfaces_and_unions.enum_table_item_type`,
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

      const enumTableItemTypeResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: enumTableItemTypeCodec,
        from: sql`interfaces_and_unions.enum_table_item_type`,
        name: "enum_table_item_type",
        uniques: [{ attributes: ["type"], isPrimary: true }],
      });

      const enumTableItemTypeEnumCodec = enumCodec({
        name: "enum_table_item_type_enum",
        identifier: sql`text`,
        values: ["TOPIC", "POST", "DIVIDER", "CHECKLIST", "CHECKLIST_ITEM"],
      });

      const singleTableItemsCodec = recordCodec({
        executor,
        name: "single_table_items",
        identifier: sql`interfaces_and_unions.single_table_items`,
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

      const singleTableItemsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: singleTableItemsCodec,
        from: sql`interfaces_and_unions.single_table_items`,
        name: "single_table_items",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const relationalItemsCodec = recordCodec({
        executor,
        name: "relational_items",
        identifier: sql`interfaces_and_unions.relational_items`,
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

      const relationalItemsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: relationalItemsCodec,
        from: sql`interfaces_and_unions.relational_items`,
        name: "relational_items",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const relationalCommentableCodec = recordCodec({
        executor,
        name: "relational_commentables",
        identifier: sql`interfaces_and_unions.relational_commentables`,
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

      const relationalCommentableResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: relationalCommentableCodec,
        from: sql`interfaces_and_unions.relational_commentables`,
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
      } as const;

      const relationalTopicsCodec = recordCodec({
        executor,
        name: "relational_topics",
        identifier: sql`interfaces_and_unions.relational_topics`,
        attributes: {
          ...itemAttributes,
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalTopicsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: relationalTopicsCodec,
        from: sql`interfaces_and_unions.relational_topics`,
        name: "relational_topics",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const relationalPostsCodec = recordCodec({
        executor,
        name: "relational_posts",
        identifier: sql`interfaces_and_unions.relational_posts`,
        attributes: {
          ...itemAttributes,
          title: col({ codec: TYPES.text, notNull: false }),
          description: col({ codec: TYPES.text, notNull: false }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalPostsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: relationalPostsCodec,
        from: sql`interfaces_and_unions.relational_posts`,
        name: "relational_posts",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const relationalDividersCodec = recordCodec({
        executor,
        name: "relational_dividers",
        identifier: sql`interfaces_and_unions.relational_dividers`,
        attributes: {
          ...itemAttributes,
          title: col({ codec: TYPES.text, notNull: false }),
          color: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalDividersResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: relationalDividersCodec,
        from: sql`interfaces_and_unions.relational_dividers`,
        name: "relational_dividers",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const relationalChecklistsCodec = recordCodec({
        executor,
        name: "relational_checklists",
        identifier: sql`interfaces_and_unions.relational_checklists`,
        attributes: {
          ...itemAttributes,
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalChecklistsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: relationalChecklistsCodec,
        from: sql`interfaces_and_unions.relational_checklists`,
        name: "relational_checklists",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const relationalChecklistItemsCodec = recordCodec({
        executor,
        name: "relational_checklist_items",
        identifier: sql`interfaces_and_unions.relational_checklist_items`,
        attributes: {
          ...itemAttributes,
          description: col({ codec: TYPES.text, notNull: true }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalChecklistItemsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: relationalChecklistItemsCodec,
        from: sql`interfaces_and_unions.relational_checklist_items`,
        name: "relational_checklist_items",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      ////////////////////////////////////////

      const unionItemsCodec = recordCodec({
        executor,
        name: "union_items",
        identifier: sql`interfaces_and_unions.union_items`,
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

      const unionItemsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: unionItemsCodec,
        from: sql`interfaces_and_unions.union_items`,
        name: "union_items",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const unionTopicsCodec = recordCodec({
        executor,
        name: "union_topics",
        identifier: sql`interfaces_and_unions.union_topics`,
        attributes: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionTopicsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: unionTopicsCodec,
        from: sql`interfaces_and_unions.union_topics`,
        name: "union_topics",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const unionPostsCodec = recordCodec({
        executor,
        name: "union_posts",
        identifier: sql`interfaces_and_unions.union_posts`,
        attributes: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
          description: col({ codec: TYPES.text, notNull: false }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionPostsResource = pgResourceOptions({
        executor,
        selectAuth,
        codec: unionPostsCodec,
        from: sql`interfaces_and_unions.union_posts`,
        name: "union_posts",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const unionDividersCodec = recordCodec({
        executor,
        name: "union_dividers",
        identifier: sql`interfaces_and_unions.union_dividers`,
        attributes: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
          color: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionDividersResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: unionDividersCodec,
        from: sql`interfaces_and_unions.union_dividers`,
        name: "union_dividers",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const unionChecklistsCodec = recordCodec({
        executor,
        name: "union_checklists",
        identifier: sql`interfaces_and_unions.union_checklists`,
        attributes: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionChecklistsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: unionChecklistsCodec,
        from: sql`interfaces_and_unions.union_checklists`,
        name: "union_checklists",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const unionChecklistItemsCodec = recordCodec({
        executor,
        name: "union_checklist_items",
        identifier: sql`interfaces_and_unions.union_checklist_items`,
        attributes: {
          id: col({ codec: TYPES.int, notNull: true }),
          description: col({ codec: TYPES.text, notNull: true }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionChecklistItemsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: unionChecklistItemsCodec,
        from: sql`interfaces_and_unions.union_checklist_items`,
        name: "union_checklist_items",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const unionEntityResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: unionEntityCodec,
        from: sql`(select null::interfaces_and_unions.union__entity)`,
        name: "union__entity",
      });

      const entitySearchResourceOptions = PgResource.functionResourceOptions(
        unionEntityResourceOptions,
        {
          from: (...args) =>
            sql`interfaces_and_unions.search(${sqlFromArgDigests(args)})`,
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
        },
      );

      ////////////////////////////////////////

      const awsApplicationsCodec = recordCodec({
        executor,
        name: "aws_applications",
        identifier: sql`interfaces_and_unions.aws_applications`,
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

      const awsApplicationsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: awsApplicationsCodec,
        from: sql`interfaces_and_unions.aws_applications`,
        name: "aws_applications",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const gcpApplicationsCodec = recordCodec({
        executor,
        name: "gcp_applications",
        identifier: sql`interfaces_and_unions.gcp_applications`,
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

      const gcpApplicationsResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: gcpApplicationsCodec,
        from: sql`interfaces_and_unions.gcp_applications`,
        name: "gcp_applications",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const firstPartyVulnerabilitiesCodec = recordCodec({
        executor,
        name: "first_party_vulnerabilities",
        identifier: sql`interfaces_and_unions.first_party_vulnerabilities`,
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

      const firstPartyVulnerabilitiesResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: firstPartyVulnerabilitiesCodec,
        from: sql`interfaces_and_unions.first_party_vulnerabilities`,
        name: "first_party_vulnerabilities",
        uniques: [{ attributes: ["id"], isPrimary: true }],
      });

      const thirdPartyVulnerabilitiesCodec = recordCodec({
        executor,
        name: "third_party_vulnerabilities",
        identifier: sql`interfaces_and_unions.third_party_vulnerabilities`,
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

      const thirdPartyVulnerabilitiesResourceOptions = pgResourceOptions({
        executor,
        selectAuth,
        codec: thirdPartyVulnerabilitiesCodec,
        from: sql`interfaces_and_unions.third_party_vulnerabilities`,
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
        .addRelation(
          personBookmarksResourceOptions.codec,
          "person",
          personResourceOptions,
          {
            isUnique: true,
            localAttributes: ["person_id"],
            remoteAttributes: ["person_id"],
          },
        )
        .addRelation(
          personCodec,
          "singleTableItems",
          singleTableItemsResourceOptions,
          {
            isUnique: false,
            localAttributes: ["person_id"],
            remoteAttributes: ["author_id"],
          },
        )
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
        .addRelation(
          personCodec,
          "personBookmarks",
          personBookmarksResourceOptions,
          {
            isUnique: false,
            localAttributes: ["person_id"],
            remoteAttributes: ["person_id"],
          },
        )
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
        .addRelation(
          singleTableItemsCodec,
          "parent",
          singleTableItemsResourceOptions,
          {
            isUnique: true,
            localAttributes: ["parent_id"],
            remoteAttributes: ["id"],
          },
        )
        .addRelation(
          singleTableItemsCodec,
          "children",
          singleTableItemsResourceOptions,
          {
            isUnique: false,
            localAttributes: ["id"],
            remoteAttributes: ["parent_id"],
          },
        )
        .addRelation(singleTableItemsCodec, "author", personResourceOptions, {
          isUnique: true,
          localAttributes: ["author_id"],
          remoteAttributes: ["person_id"],
        })

        .addRelation(
          relationalTopicsCodec,
          "item",
          relationalItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalTopicsCodec,
          "parent",
          relationalItemsResourceOptions,
          {
            localAttributes: [`parent_id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(relationalTopicsCodec, "author", personResourceOptions, {
          localAttributes: [`author_id`] as const,
          remoteAttributes: [`person_id`] as const,
          isUnique: true,
        })

        .addRelation(
          relationalPostsCodec,
          "item",
          relationalItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalPostsCodec,
          "parent",
          relationalItemsResourceOptions,
          {
            localAttributes: [`parent_id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(relationalPostsCodec, "author", personResourceOptions, {
          localAttributes: [`author_id`] as const,
          remoteAttributes: [`person_id`] as const,
          isUnique: true,
        })
        .addRelation(
          relationalPostsCodec,
          "commentable",
          relationalCommentableResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )

        .addRelation(
          relationalDividersCodec,
          "item",
          relationalItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalDividersCodec,
          "parent",
          relationalItemsResourceOptions,
          {
            localAttributes: [`parent_id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(relationalDividersCodec, "author", personResourceOptions, {
          localAttributes: [`author_id`] as const,
          remoteAttributes: [`person_id`] as const,
          isUnique: true,
        })
        .addRelation(
          relationalChecklistsCodec,
          "item",
          relationalItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistsCodec,
          "parent",
          relationalItemsResourceOptions,
          {
            localAttributes: [`parent_id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistsCodec,
          "author",
          personResourceOptions,
          {
            localAttributes: [`author_id`] as const,
            remoteAttributes: [`person_id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistsCodec,
          "commentable",
          relationalCommentableResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "item",
          relationalItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "parent",
          relationalItemsResourceOptions,
          {
            localAttributes: [`parent_id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "author",
          personResourceOptions,
          {
            localAttributes: [`author_id`] as const,
            remoteAttributes: [`person_id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "commentable",
          relationalCommentableResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )

        .addRelation(
          relationalItemsCodec,
          "parent",
          relationalItemsResourceOptions,
          {
            isUnique: true,
            localAttributes: ["parent_id"] as const,
            remoteAttributes: ["id"] as const,
          },
        )
        .addRelation(
          relationalItemsCodec,
          "children",
          relationalItemsResourceOptions,
          {
            isUnique: false,
            localAttributes: ["id"] as const,
            remoteAttributes: ["parent_id"] as const,
          },
        )
        .addRelation(relationalItemsCodec, "author", personResourceOptions, {
          isUnique: true,
          localAttributes: ["author_id"] as const,
          remoteAttributes: ["person_id"] as const,
        })
        .addRelation(
          relationalItemsCodec,
          "topic",
          relationalTopicsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "post",
          relationalPostsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "divider",
          relationalDividersResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "checklist",
          relationalChecklistsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "checklistItem",
          relationalChecklistItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )

        .addRelation(
          relationalCommentableCodec,
          "post",
          relationalPostsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalCommentableCodec,
          "checklist",
          relationalChecklistsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalCommentableCodec,
          "checklistItem",
          relationalChecklistItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )

        .addRelation(unionItemsCodec, "topic", unionTopicsResourceOptions, {
          localAttributes: [`id`] as const,
          remoteAttributes: [`id`] as const,
          isUnique: true,
        })
        .addRelation(unionItemsCodec, "post", unionPostsResource, {
          localAttributes: [`id`] as const,
          remoteAttributes: [`id`] as const,
          isUnique: true,
        })
        .addRelation(unionItemsCodec, "divider", unionDividersResourceOptions, {
          localAttributes: [`id`] as const,
          remoteAttributes: [`id`] as const,
          isUnique: true,
        })
        .addRelation(
          unionItemsCodec,
          "checklist",
          unionChecklistsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          unionItemsCodec,
          "checklistItem",
          unionChecklistItemsResourceOptions,
          {
            localAttributes: [`id`] as const,
            remoteAttributes: [`id`] as const,
            isUnique: true,
          },
        )
        .getRegistryConfig();
    },
    [
      PgResource,
      TYPES,
      enumCodec,
      executor,
      listOfCodec,
      makeRegistryBuilder,
      pgResourceOptions,
      recordCodec,
      selectAuth,
      sql,
      sqlFromArgDigests,
    ],
    "registryConfig",
  );

  const registry = EXPORTABLE(
    (makeRegistry, registryConfig) => makeRegistry(registryConfig),
    [makeRegistry, registryConfig],
    "registry",
  );

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
      person_id: constant(1, false),
    });
    const $posts = $person.manyRelation("posts");
    const $post = $posts.single();
    const $id = $post.get("post_id");
    const _testGood: "int4" = $id.pgCodec.name;
    // @ts-expect-error
    const _testBad: "text" = $id.pgCodec.name;
  }

  const deoptimizeIfAppropriate = EXPORTABLE(
    (__ListTransformStep, options) =>
      <
        TStep extends
          | PgSelectStep<any>
          | PgSelectSingleStep<any>
          | PgClassExpressionStep<any, any>
          | __ListTransformStep<PgSelectStep<any>, any, any, any>
          | ExecutableStep,
      >(
        step: TStep,
      ): TStep => {
        if (options.deoptimize) {
          const innerPlan =
            step instanceof __ListTransformStep
              ? step.getListStep()
              : (step as PgSelectStep | PgSelectSingleStep);
          if ("getClassStep" in innerPlan) {
            innerPlan.getClassStep().setInliningForbidden();
          } else if ("setInliningForbidden" in innerPlan) {
            innerPlan.setInliningForbidden();
          }
        }
        return step;
      },
    [__ListTransformStep, options],
  );

  type ResourceConnectionPlan<
    TResource extends PgResource<any, any, any, any, any>,
  > = ConnectionStep<
    any,
    PgSelectSingleStep<TResource>,
    any,
    any,
    null | readonly any[],
    PgSelectStep<TResource>
  >;

  const {
    pgCodecs: { union__entity: _unionEntityCodec },
    pgResources: {
      messages: messageResource,
      users: userResource,
      forums: forumResource,
      people: personResource,
      person_bookmarks: personBookmarksResource,
      posts: postResource,
      comments: commentResource,
      single_table_items: singleTableItemsResource,
      relational_items: relationalItemsResource,
      relational_topics: relationalTopicsResource,
      relational_posts: relationalPostsResource,
      relational_dividers: relationalDividersResource,
      relational_checklists: relationalChecklistsResource,
      relational_checklist_items: relationalChecklistItemsResource,
      union_items: unionItemsResource,
      union_topics: unionTopicsResource,
      union_posts: unionPostsResource,
      union_dividers: unionDividersResource,
      union_checklists: unionChecklistsResource,
      union_checklist_items: unionChecklistItemsResource,
      relational_commentables: relationalCommentableResource,
      users_most_recent_forum: usersMostRecentForumResource,
      forums_unique_author_count: forumsUniqueAuthorCountResource,
      forums_featured_messages: forumsFeaturedMessagesResource,
      forums_messages_list_set: forumsMessagesListSetResource,
      text: scalarTextResource,
      unique_author_count: uniqueAuthorCountResource,
      forum_names_array: forumNamesArrayResource,
      forum_names_cases: forumNamesCasesResource,
      random_user_array: randomUserArrayResource,
      random_user_array_set: randomUserArraySetResource,
      featured_messages: featuredMessagesResource,
      entity_search: entitySearchResource,
      first_party_vulnerabilities: firstPartyVulnerabilitiesResource,
      third_party_vulnerabilities: thirdPartyVulnerabilitiesResource,
    },
  } = registry;

  type MessageConnectionStep = ResourceConnectionPlan<typeof messageResource>;
  type MessageStep = PgSelectSingleStep<typeof messageResource>;
  type UserStep = PgSelectSingleStep<typeof userResource>;
  type ForumStep = PgSelectSingleStep<typeof forumResource>;
  type PersonStep = PgSelectSingleStep<typeof personResource>;
  type PersonBookmarkStep = PgSelectSingleStep<typeof personBookmarksResource>;
  type PostStep = PgSelectSingleStep<typeof postResource>;
  type CommentStep = PgSelectSingleStep<typeof commentResource>;
  type SingleTableItemsStep = PgSelectStep<typeof singleTableItemsResource>;
  type SingleTableItemStep = PgSelectSingleStep<
    typeof singleTableItemsResource
  >;
  type RelationalItemsStep = PgSelectStep<typeof relationalItemsResource>;
  type RelationalItemStep = PgSelectSingleStep<typeof relationalItemsResource>;
  type RelationalTopicStep = PgSelectSingleStep<
    typeof relationalTopicsResource
  >;
  type RelationalPostStep = PgSelectSingleStep<typeof relationalPostsResource>;
  type RelationalDividerStep = PgSelectSingleStep<
    typeof relationalDividersResource
  >;
  type RelationalChecklistStep = PgSelectSingleStep<
    typeof relationalChecklistsResource
  >;
  type RelationalChecklistItemStep = PgSelectSingleStep<
    typeof relationalChecklistItemsResource
  >;
  type UnionItemsStep = PgSelectStep<typeof unionItemsResource>;
  type UnionItemStep = PgSelectSingleStep<typeof unionItemsResource>;
  type UnionTopicStep = PgSelectSingleStep<typeof unionTopicsResource>;
  type UnionPostStep = PgSelectSingleStep<typeof unionPostsResource>;
  type UnionDividerStep = PgSelectSingleStep<typeof unionDividersResource>;
  type UnionChecklistStep = PgSelectSingleStep<typeof unionChecklistsResource>;
  type UnionChecklistItemStep = PgSelectSingleStep<
    typeof unionChecklistItemsResource
  >;
  type RelationalCommentablesStep = PgSelectStep<
    typeof relationalCommentableResource
  >;
  type RelationalCommentableStep = PgSelectSingleStep<
    typeof relationalCommentableResource
  >;

  ////////////////////////////////////////

  const EnumTableItemType = new GraphQLEnumType({
    name: "EnumTableItemType",
    values: {
      TOPIC: { value: "TOPIC" },
      POST: { value: "POST" },
      DIVIDER: { value: "DIVIDER" },
      CHECKLIST: { value: "CHECKLIST" },
      CHECKLIST_ITEM: { value: "CHECKLIST_ITEM" },
    },
  });

  function attrField<
    TMyResource extends PgResource<any, any, any, any, any>,
    TAttrName extends keyof GetPgResourceAttributes<TMyResource>,
  >(attrName: TAttrName, type: GraphQLOutputType) {
    return {
      type,
      plan: EXPORTABLE(
        (attrName) =>
          function plan($entity: PgSelectSingleStep<TMyResource>) {
            return $entity.get(attrName);
          },
        [attrName],
      ),
    };
  }

  function singleRelationField<
    TMyResource extends PgResource<any, any, any, any, any>,
    TRelationName extends keyof GetPgResourceRelations<TMyResource>,
  >(relation: TRelationName, type: GraphQLOutputType) {
    return {
      type,
      plan: EXPORTABLE(
        (deoptimizeIfAppropriate, relation) =>
          function plan($entity: PgSelectSingleStep<TMyResource>) {
            const $plan = $entity.singleRelation(relation);
            deoptimizeIfAppropriate($plan);
            return $plan;
          },
        [deoptimizeIfAppropriate, relation],
      ),
    };
  }

  const HashType = new GraphQLEnumType({
    name: "HashType",
    values: {
      MD5: { value: "md5" },
      SHA1: { value: "sha1" },
      SHA256: { value: "sha256" },
    },
  });

  const Hashes: GraphQLObjectType = new GraphQLObjectType({
    name: "Hashes",
    fields: () => ({
      md5: {
        type: GraphQLString,
        resolve: EXPORTABLE(
          (crypto) =>
            function resolve(parent) {
              return crypto.createHash("md5").update(parent.text).digest("hex");
            },
          [crypto],
        ),
      },
      sha1: {
        type: GraphQLString,
        resolve: EXPORTABLE(
          (crypto) =>
            function resolve(parent) {
              return crypto
                .createHash("sha1")
                .update(parent.text)
                .digest("hex");
            },
          [crypto],
        ),
      },
      throwNonNullError: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: EXPORTABLE(
          () =>
            function resolve() {
              return null;
            },
          [],
        ),
      },
      throwTestError: {
        type: GraphQLString,
        resolve: EXPORTABLE(
          () =>
            function resolve() {
              throw new Error("Test");
            },
          [],
        ),
      },
      sha256: {
        type: GraphQLString,
        resolve: EXPORTABLE(
          (crypto) =>
            function resolve(parent) {
              return crypto
                .createHash("sha256")
                .update(parent.text)
                .digest("hex");
            },
          [crypto],
        ),
      },
      self: {
        type: Hashes,
        resolve: EXPORTABLE(
          () =>
            function resolve(parent) {
              return parent;
            },
          [],
        ),
      },
    }),
  });

  const User = newObjectTypeBuilder<UserStep>(PgSelectSingleStep)({
    name: "User",
    planType: EXPORTABLE(
      (get, userResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<string>;
          return userResource.get({ id: $id });
        },
      [get, userResource],
    ),
    fields: () => ({
      // Here we don't use `attrField` because we want to explicitly test the default plan resolver
      // username: attrField("username", GraphQLString),
      username: {
        type: GraphQLString,
      },
      gravatarUrl: attrField("gravatar_url", GraphQLString),
      mostRecentForum: {
        type: Forum,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, usersMostRecentForumResource) =>
            ($user) => {
              const $forum = usersMostRecentForumResource.execute([
                { step: $user.record() },
              ]) as PgSelectStep<typeof forumResource>;
              deoptimizeIfAppropriate($forum);
              return $forum;
            },
          [deoptimizeIfAppropriate, usersMostRecentForumResource],
        ),
      },

      // This field is to test standard resolvers work on planned types
      usernameHash: {
        type: GraphQLString,
        args: {
          hashType: {
            type: new GraphQLNonNull(HashType),
          },
        },
        plan: EXPORTABLE(
          (object) =>
            function plan($user) {
              return object({ username: $user.get("username") });
            },
          [object],
        ),
        resolve: EXPORTABLE(
          (crypto) =>
            function resolve(user, args) {
              return crypto
                .createHash(args.hashType)
                .update(user.username)
                .digest("hex");
            },
          [crypto],
        ),
      },
      // This field is to test standard resolvers work when returning non-scalars on planned types
      usernameHashes: {
        type: Hashes,
        plan: EXPORTABLE(
          () =>
            function plan($user) {
              return $user.get("username");
            },
          [],
        ),
        resolve: EXPORTABLE(
          () =>
            function resolve(username) {
              return { text: username };
            },
          [],
        ),
      },
    }),
  });

  const MessagesOrderBy = new GraphQLEnumType({
    name: "MessagesOrderBy",
    values: {
      BODY_ASC: {
        extensions: {
          grafast: {
            apply: EXPORTABLE(
              (TYPES, sql) => (qb: PgSelectQueryBuilder) => {
                qb.orderBy({
                  codec: TYPES.text,
                  fragment: sql`${qb}.body`,
                  direction: "ASC",
                });
              },
              [TYPES, sql],
            ),
          },
        },
      },
      BODY_DESC: {
        extensions: {
          grafast: {
            apply: EXPORTABLE(
              (TYPES, sql) => (qb: PgSelectQueryBuilder) => {
                qb.orderBy({
                  codec: TYPES.text,
                  fragment: sql`${qb}.body`,
                  direction: "DESC",
                });
              },
              [TYPES, sql],
            ),
          },
        },
      },
      AUTHOR_USERNAME_ASC: {
        extensions: {
          grafast: {
            apply: EXPORTABLE(
              (TYPES, sql) => (qb: PgSelectQueryBuilder) => {
                const authorAlias = qb.singleRelation("author");
                qb.orderBy({
                  codec: TYPES.text,
                  fragment: sql`${authorAlias}.username`,
                  direction: "ASC",
                });
              },
              [TYPES, sql],
            ),
          },
        },
      },
      AUTHOR_USERNAME_DESC: {
        extensions: {
          grafast: {
            apply: EXPORTABLE(
              (TYPES, sql) => (qb: PgSelectQueryBuilder) => {
                const authorAlias = qb.singleRelation("author");
                qb.orderBy({
                  codec: TYPES.text,
                  fragment: sql`${authorAlias}.username`,
                  direction: "DESC",
                });
              },
              [TYPES, sql],
            ),
          },
        },
      },
    },
  });
  const Message = newObjectTypeBuilder<MessageStep>(PgSelectSingleStep)({
    name: "Message",
    planType: EXPORTABLE(
      (get, messageResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<string>;
          return messageResource.get({ id: $id });
        },
      [get, messageResource],
    ),
    fields: () => ({
      id: attrField("id", GraphQLString),
      featured: attrField("featured", GraphQLBoolean),
      body: attrField("body", GraphQLString),
      forum: singleRelationField("forum", Forum),
      author: {
        type: User,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate) =>
            function plan($message) {
              const $user = $message.singleRelation("author");
              deoptimizeIfAppropriate($user);

              return $user;
            },
          [deoptimizeIfAppropriate],
        ),
      },
      isArchived: attrField("is_archived", GraphQLBoolean),
    }),
  });

  const MessageEdge = newObjectTypeBuilder<Step>(Step)({
    name: "MessageEdge",
    fields: {
      cursor: {
        type: GraphQLString,
      },
      node: {
        type: Message,
      },
    },
  });

  const PageInfo = newObjectTypeBuilder(Step)({
    name: "PageInfo",
    fields: {
      hasNextPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      hasPreviousPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
      },
      startCursor: {
        type: GraphQLString,
      },
      endCursor: {
        type: GraphQLString,
      },
    },
  });

  const MessagesConnection = newObjectTypeBuilder<MessageConnectionStep>(
    ConnectionStep,
  )({
    name: "MessagesConnection",
    fields: {
      edges: {
        type: new GraphQLList(MessageEdge),
        plan: EXPORTABLE(
          () =>
            function plan($connection) {
              return $connection.edges();
            },
          [],
        ),
      },
      nodes: newGrafastFieldConfigBuilder<MessageConnectionStep>()({
        type: new GraphQLList(Message),
        plan: EXPORTABLE(
          () =>
            function plan($connection) {
              return $connection.nodes() as any;
            },
          [],
        ),
      }),
      pageInfo: newGrafastFieldConfigBuilder<MessageConnectionStep>()({
        type: new GraphQLNonNull(PageInfo),
        plan: EXPORTABLE(
          () =>
            function plan($connection) {
              // return context();
              return $connection.pageInfo() as any;
            },
          [],
        ),
      }),
      totalCount: {
        type: new GraphQLNonNull(GraphQLInt),
        plan: EXPORTABLE(
          (TYPES, sql) => ($connection) =>
            $connection
              .cloneSubplanWithoutPagination("aggregate")
              .single()
              .select(sql`count(*)`, TYPES.bigint, false),
          [TYPES, sql],
        ),
      },
    },
  });

  const IncludeArchived = new GraphQLEnumType({
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

  function makeIncludeArchivedArg<TFieldStep>(
    getClassStep: ($fieldPlan: TFieldStep) => PgSelectStep<any>,
  ): GrafastArgumentConfig {
    return {
      type: IncludeArchived,
      applyPlan: EXPORTABLE(
        (
          PgSelectSingleStep,
          constant,
          getClassStep,
          includeArchivedCondition,
          lambda,
        ) =>
          function plan($parent: ExecutableStep, $field: TFieldStep, val) {
            const $messages = getClassStep($field);
            const $value = val.getRaw();
            const $parentPgSelectSingle =
              $parent instanceof PgSelectSingleStep
                ? ($parent as PgSelectSingleStep)
                : null;
            const sqlParentArchivedAt = $parentPgSelectSingle?.resource?.codec
              .attributes?.archived_at
              ? $messages.placeholder($parentPgSelectSingle.get("archived_at"))
              : undefined;
            const $condition = lambda(
              [constant(sqlParentArchivedAt), $value],
              includeArchivedCondition,
              true,
            );
            $messages.apply($condition);
          },
        [
          PgSelectSingleStep,
          constant,
          getClassStep,
          includeArchivedCondition,
          lambda,
        ],
      ),
      defaultValue: "INHERIT",
    };
  }

  const MessageCondition = newInputObjectTypeBuilder<PgCondition>()({
    name: "MessageCondition",
    fields: {
      featured: {
        type: GraphQLBoolean,
        apply: EXPORTABLE(
          (TYPES, sql, sqlValueWithCodec) =>
            function plan($condition, arg) {
              if (arg === null) {
                $condition.where(sql`${$condition}.featured is null`);
              } else {
                $condition.where(
                  sql`${$condition}.featured = ${sqlValueWithCodec(
                    arg,
                    TYPES.boolean,
                  )}`,
                );
              }
            },
          [TYPES, sql, sqlValueWithCodec],
        ),
      },
    },
  });

  const BooleanFilter = newInputObjectTypeBuilder<PgBooleanFilter>()({
    name: "BooleanFilter",
    fields: {
      equalTo: {
        type: GraphQLBoolean,
        apply: EXPORTABLE(
          (TYPES, sql, sqlValueWithCodec) =>
            function plan($parent, arg) {
              if (arg === null) {
                // Ignore
              } else {
                $parent.where(
                  sql`${$parent.expression} = ${sqlValueWithCodec(
                    arg,
                    TYPES.boolean,
                  )}`,
                );
              }
            },
          [TYPES, sql, sqlValueWithCodec],
        ),
      },
      notEqualTo: {
        type: GraphQLBoolean,
        apply: EXPORTABLE(
          (TYPES, sql, sqlValueWithCodec) =>
            function plan($parent: PgBooleanFilter, arg) {
              if (arg === null) {
                // Ignore
              } else {
                $parent.where(
                  sql`${$parent.expression} <> ${sqlValueWithCodec(
                    arg,
                    TYPES.boolean,
                  )}`,
                );
              }
            },
          [TYPES, sql, sqlValueWithCodec],
        ),
      },
    },
  });

  const MessageFilter = newInputObjectTypeBuilder<PgClassFilter>()({
    name: "MessageFilter",
    fields: {
      featured: {
        type: BooleanFilter,
        apply: EXPORTABLE(
          (PgBooleanFilter, sql) =>
            function plan($messageFilter, arg) {
              if (arg === null) {
                // Ignore
              } else {
                return new PgBooleanFilter(
                  $messageFilter,
                  sql`${$messageFilter}.featured`,
                );
              }
            },
          [PgBooleanFilter, sql],
        ),
      },
      isArchived: {
        type: BooleanFilter,
        apply: EXPORTABLE(
          (PgBooleanFilter, sql) =>
            function plan($messageFilter, arg) {
              if (arg === null) {
                // Ignore
              } else {
                return new PgBooleanFilter(
                  $messageFilter,
                  sql`${$messageFilter}.is_archived`,
                );
              }
            },
          [PgBooleanFilter, sql],
        ),
      },
    },
  });

  const ForumCondition = newInputObjectTypeBuilder<PgCondition>()({
    name: "ForumCondition",
    fields: {
      name: {
        type: GraphQLString,
        apply: EXPORTABLE(
          (TYPES, sql, sqlValueWithCodec) =>
            function plan($condition, arg) {
              if (arg === null) {
                $condition.where(sql`${$condition}.name is null`);
              } else {
                $condition.where(
                  sql`${$condition}.name = ${sqlValueWithCodec(
                    arg,
                    TYPES.text,
                  )}`,
                );
              }
            },
          [TYPES, sql, sqlValueWithCodec],
        ),
      },
    },
  });

  const ForumToManyMessageFilter = newInputObjectTypeBuilder<
    PgManyFilter<typeof messageResource>
  >()({
    name: "ForumToManyMessageFilter",
    fields: {
      some: {
        type: MessageFilter,
        apply: EXPORTABLE(
          () =>
            function plan($manyFilter, arg) {
              if (arg !== null) {
                return $manyFilter.some();
              }
            },
          [],
        ),
      },
    },
  });

  const ForumFilter = newInputObjectTypeBuilder<PgClassFilter>()({
    name: "ForumFilter",
    fields: {
      messages: {
        type: ForumToManyMessageFilter,
        apply: EXPORTABLE(
          (PgManyFilter, messageResource) =>
            function plan($condition, arg) {
              if (arg !== null) {
                return new PgManyFilter(
                  $condition,
                  messageResource,
                  ["id"],
                  ["forum_id"],
                );
              }
            },
          [PgManyFilter, messageResource],
        ),
      },
    },
  });

  type GQLObj = GraphQLObjectType<any, any>;
  const Forum: GQLObj = newObjectTypeBuilder<ForumStep>(PgSelectSingleStep)({
    name: "Forum",
    planType: EXPORTABLE(
      (forumResource, get) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<string>;
          return forumResource.get({ id: $id });
        },
      [forumResource, get],
    ),
    fields: () => ({
      id: attrField("id", GraphQLString),
      name: attrField("name", GraphQLString),

      // Expression attribute
      isArchived: attrField("is_archived", GraphQLBoolean),

      // Custom expression; actual attribute select shouldn't make it through to the generated query.
      archivedAtIsNotNull: {
        type: GraphQLBoolean,
        plan: EXPORTABLE(
          (TYPES, pgClassExpression) =>
            function plan($forum) {
              const $archivedAt = $forum.get("archived_at");
              const $expr1 = pgClassExpression(
                $forum,
                TYPES.boolean,
                true,
              )`${$archivedAt} is not null`;
              const $expr2 = pgClassExpression(
                $forum,
                TYPES.boolean,
                true,
              )`${$expr1} is true`;
              return $expr2;
            },
          [TYPES, pgClassExpression],
        ),
      },
      self: {
        type: Forum,
        plan: EXPORTABLE(
          () =>
            function plan($forum) {
              return $forum;
            },
          [],
        ),
      },
      message: {
        type: Message,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, messageResource) =>
            function plan($forum, { $id }) {
              const $forumId = $forum.get("id");
              const $message = messageResource.get({
                forum_id: $forumId,
                id: $id as ExecutableStep<string>,
              });
              deoptimizeIfAppropriate($message);
              return $message;
            },
          [deoptimizeIfAppropriate, messageResource],
        ),
      },
      messagesList: {
        type: new GraphQLList(Message),
        args: {
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$forum: ForumStep,
                  $messages: PgSelectStep<typeof messageResource>,
                  arg,
                ) {
                  $messages.setFirst(arg.getRaw());
                },
              [],
            ),
          },
          condition: {
            type: MessageCondition,
            applyPlan: EXPORTABLE(
              (pgWhere) =>
                function plan(
                  _$forum: ForumStep,
                  $messages: PgSelectStep<typeof messageResource>,
                  arg,
                ) {
                  arg.apply($messages, pgWhere);
                },
              [pgWhere],
            ),
          },
          filter: {
            type: MessageFilter,
            applyPlan: EXPORTABLE(
              (pgClassFilterWhere) =>
                function plan(
                  _$forum: ForumStep,
                  $messages: PgSelectStep<typeof messageResource>,
                  arg,
                ) {
                  arg.apply($messages, pgClassFilterWhere);
                },
              [pgClassFilterWhere],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            PgSelectStep<typeof messageResource>
          >(($messages) => $messages),
        },
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, messageResource) =>
            function plan($forum) {
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
            },
          [deoptimizeIfAppropriate, messageResource],
        ),
      },
      messagesConnection: {
        type: MessagesConnection,
        args: {
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$forum: ForumStep,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setFirst(arg.getRaw());
                },
              [],
            ),
          },
          last: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setLast(arg.getRaw());
                },
              [],
            ),
          },
          condition: {
            type: MessageCondition,
            applyPlan: EXPORTABLE(
              (pgWhere) =>
                function plan(
                  _$forum,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  const $messages = $connection.getSubplan();
                  arg.apply($messages, pgWhere);
                },
              [pgWhere],
            ),
          },
          filter: {
            type: MessageFilter,
            applyPlan: EXPORTABLE(
              (pgClassFilterWhere) =>
                function plan(
                  _$forum,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  const $messages = $connection.getSubplan();
                  arg.apply($messages, pgClassFilterWhere);
                },
              [pgClassFilterWhere],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            ResourceConnectionPlan<typeof messageResource>
          >(($connection) => $connection.getSubplan()),
        },
        plan: EXPORTABLE(
          (connection, deoptimizeIfAppropriate, messageResource) =>
            function plan($forum) {
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
            },
          [connection, deoptimizeIfAppropriate, messageResource],
        ),
      },
      uniqueAuthorCount: {
        type: GraphQLInt,
        args: {
          featured: {
            type: GraphQLBoolean,
          },
        },
        plan: EXPORTABLE(
          (TYPES, forumsUniqueAuthorCountResource) =>
            function plan($forum, { $featured }) {
              return forumsUniqueAuthorCountResource.execute([
                {
                  step: $forum.record(),
                },
                {
                  step: $featured,
                  pgCodec: TYPES.boolean,
                },
              ]);
            },
          [TYPES, forumsUniqueAuthorCountResource],
        ),
      },

      randomUser: {
        type: User,
        plan: EXPORTABLE(
          (
            deoptimizeIfAppropriate,
            pgSelect,
            sql,
            sqlFromArgDigests,
            userResource,
          ) =>
            function plan($forum) {
              const $user = pgSelect({
                resource: userResource,
                identifiers: [],
                args: [
                  {
                    step: $forum.record(),
                  },
                ],
                from: (...args) =>
                  sql`app_public.forums_random_user(${sqlFromArgDigests(
                    args,
                  )})`,
                name: "forums_random_user",
              }).single();
              deoptimizeIfAppropriate($user);
              return $user;
            },
          [
            deoptimizeIfAppropriate,
            pgSelect,
            sql,
            sqlFromArgDigests,
            userResource,
          ],
        ),
      },

      featuredMessages: {
        type: new GraphQLList(Message),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumsFeaturedMessagesResource) =>
            function plan($forum) {
              const $messages = forumsFeaturedMessagesResource.execute([
                {
                  step: $forum.record(),
                },
              ]);
              deoptimizeIfAppropriate($messages);
              return $messages;
            },
          [deoptimizeIfAppropriate, forumsFeaturedMessagesResource],
        ),
      },

      messagesListSet: {
        type: new GraphQLList(new GraphQLList(Message)),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumsMessagesListSetResource) =>
            function plan($forum) {
              const $partitionedMessages =
                forumsMessagesListSetResource.execute([
                  {
                    step: $forum.record(),
                  },
                ]);
              deoptimizeIfAppropriate($partitionedMessages);
              return $partitionedMessages;
            },
          [deoptimizeIfAppropriate, forumsMessagesListSetResource],
        ),
      },

      messagesWithManyTransforms: {
        type: new GraphQLList(new GraphQLList(Message)),
        plan: EXPORTABLE(
          (
            deoptimizeIfAppropriate,
            each,
            filter,
            groupBy,
            lambda,
            messageResource,
          ) =>
            function plan($forum) {
              // This is a deliberately convoluted plan to ensure that multiple
              // filter plans work well together.

              // Load _all_ the messages from the DB.
              const $messages = messageResource.find();
              deoptimizeIfAppropriate($messages);

              // Filter messages to those _not_ in this forum
              const $messagesFromOtherForums = filter($messages, ($message) =>
                lambda(
                  [$message.get("forum_id"), $forum.get("id")],
                  ([messageForumId, forumId]) => messageForumId !== forumId,
                  true,
                ),
              );

              // Group messages by the "featured" property
              const $grouped = groupBy($messagesFromOtherForums, ($message) =>
                ($message as unknown as MessageStep).get("featured"),
              );

              // Since `groupBy` results in a `Map`, turn it into an array by just getting the values
              const $entries = lambda(
                $grouped,
                (map) => [...map.values()],
                true,
              );

              // Now map over the resulting list of list of values and wrap with the message list item plan.
              return each($entries, ($group) =>
                each($group, ($item) => $messages.listItem($item)),
              );
            },
          [
            deoptimizeIfAppropriate,
            each,
            filter,
            groupBy,
            lambda,
            messageResource,
          ],
        ),
      },
    }),
  });

  const singleTableTypeNameCallback = EXPORTABLE(
    () => (v: string) =>
      ({
        TOPIC: "SingleTableTopic",
        POST: "SingleTablePost",
        DIVIDER: "SingleTableDivider",
        CHECKLIST: "SingleTableChecklist",
        CHECKLIST_ITEM: "SingleTableChecklistItem",
      })[v] ?? null,
    [],
  );

  const relationalItemTypeNameFromType = (type: string) =>
    ({
      TOPIC: "RelationalTopic",
      POST: "RelationalPost",
      DIVIDER: "RelationalDivider",
      CHECKLIST: "RelationalChecklist",
      CHECKLIST_ITEM: "RelationalChecklistItem",
    })[type] ?? null;

  const unionItemTypeNameFromType = (type: string) =>
    ({
      TOPIC: "UnionTopic",
      POST: "UnionPost",
      DIVIDER: "UnionDivider",
      CHECKLIST: "UnionChecklist",
      CHECKLIST_ITEM: "UnionChecklistItem",
    })[type] ?? null;

  const relationalCommentableInterface = EXPORTABLE(
    (inhibitOnNull, lambda, object, relationalItemTypeNameFromType) =>
      ($item: RelationalCommentableStep) => {
        const $id = inhibitOnNull($item.get("id"));
        const $type = inhibitOnNull($item.get("type"));
        const $__typename = lambda($type, relationalItemTypeNameFromType, true);
        return object({ __typename: $__typename, id: $id });
      },
    [inhibitOnNull, lambda, object, relationalItemTypeNameFromType],
  );

  const entityUnion = EXPORTABLE(
    (lambda) =>
      <TCodec extends typeof _unionEntityCodec>(
        $item:
          | PgSelectSingleStep<PgResource<any, TCodec, any, any, any>>
          | PgClassExpressionStep<TCodec, PgResource<any, any, any, any, any>>,
      ) => {
        return lambda(
          [
            $item.get("person_id"),
            $item.get("post_id"),
            $item.get("comment_id"),
          ],
          ([person_id, post_id, comment_id]) => {
            if (person_id != null) {
              return { __typename: "Person", person_id };
            } else if (post_id != null) {
              return { __typename: "Post", post_id };
            } else if (comment_id != null) {
              return { __typename: "Comment", comment_id };
            } else {
              return null;
            }
          },
        );
      },
    [lambda],
  );

  const PersonBookmark: GraphQLObjectType<any, any> =
    newObjectTypeBuilder<PersonBookmarkStep>(PgSelectSingleStep)({
      name: "PersonBookmark",
      planType: EXPORTABLE(
        (get, personBookmarksResource) =>
          function planType($specifier) {
            const $id = get($specifier, "id") as Step<number>;
            return personBookmarksResource.get({ id: $id });
          },
        [get, personBookmarksResource],
      ),
      fields: () => ({
        id: attrField("id", GraphQLInt),
        person: singleRelationField("person", Person),
        bookmarkedEntity: {
          type: Entity,
          plan: EXPORTABLE(
            (entityUnion) =>
              function plan($personBookmark) {
                const $entity = $personBookmark.get("bookmarked_entity");
                return entityUnion($entity);
              },
            [entityUnion],
          ),
        },
      }),
    });

  const Person: GraphQLObjectType<any, any> = newObjectTypeBuilder<PersonStep>(
    PgSelectSingleStep,
  )({
    name: "Person",
    planType: EXPORTABLE(
      (get, personResource) =>
        function planType($specifier) {
          const $personId = get($specifier, "person_id") as Step<number>;
          return personResource.get({ person_id: $personId });
        },
      [get, personResource],
    ),
    fields: () => ({
      personId: attrField("person_id", GraphQLInt),
      username: attrField("username", GraphQLString),
      singleTableItemsList: {
        type: new GraphQLList(SingleTableItem),
        args: { first: { type: GraphQLInt }, offset: { type: GraphQLInt } },
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, singleTableItemsResource) =>
            function plan($person, { $first, $offset }) {
              const $personId = $person.get("person_id");
              const $items: SingleTableItemsStep =
                singleTableItemsResource.find({
                  author_id: $personId,
                });
              $items.setFirst($first);
              $items.setOffset($offset);
              deoptimizeIfAppropriate($items);
              return $items;
            },
          [deoptimizeIfAppropriate, singleTableItemsResource],
        ),
      },

      relationalItemsList: {
        type: new GraphQLList(RelationalItem),
        args: { first: { type: GraphQLInt }, offset: { type: GraphQLInt } },
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, relationalItemsResource) =>
            function plan($person, { $first, $offset }) {
              const $personId = $person.get("person_id");
              const $items: RelationalItemsStep = relationalItemsResource.find({
                author_id: $personId,
              });
              $items.setFirst($first);
              $items.setOffset($offset);
              deoptimizeIfAppropriate($items);
              return $items;
            },
          [deoptimizeIfAppropriate, relationalItemsResource],
        ),
      },

      personBookmarksList: {
        type: new GraphQLList(PersonBookmark),
        plan: EXPORTABLE(
          () =>
            function plan($person) {
              return $person.manyRelation("personBookmarks");
            },
          [],
        ),
      },
    }),
  });

  const Post: GQLObj = newObjectTypeBuilder<PostStep>(PgSelectSingleStep)({
    name: "Post",
    planType: EXPORTABLE(
      (get, postResource) =>
        function planType($specifier) {
          const $postId = get($specifier, "post_id") as Step<number>;
          return postResource.get({ post_id: $postId });
        },
      [get, postResource],
    ),
    fields: () => ({
      postId: attrField("post_id", GraphQLInt),
      body: attrField("body", GraphQLString),
      author: singleRelationField("author", Person),
    }),
  });

  const Comment: GraphQLObjectType<any, any> =
    newObjectTypeBuilder<CommentStep>(PgSelectSingleStep)({
      name: "Comment",
      planType: EXPORTABLE(
        (commentResource, get) =>
          function planType($specifier) {
            const $commentId = get($specifier, "comment_id") as Step<number>;
            return commentResource.get({ comment_id: $commentId });
          },
        [commentResource, get],
      ),
      fields: () => ({
        commentId: attrField("comment_id", GraphQLInt),
        author: singleRelationField("author", Person),
        post: singleRelationField("post", Post),
        body: attrField("body", GraphQLString),
      }),
    });

  ////////////////////////////////////////

  const SingleTableItem: GraphQLInterfaceType = new GraphQLInterfaceType({
    name: "SingleTableItem",
    fields: () => ({
      id: { type: GraphQLInt },
      type: { type: GraphQLString },
      type2: { type: EnumTableItemType },
      parent: { type: SingleTableItem },
      author: { type: Person },
      position: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
      isExplicitlyArchived: { type: GraphQLBoolean },
      archivedAt: { type: GraphQLString },
    }),
    extensions: {
      grafast: {
        toSpecifier: EXPORTABLE(
          (get, object) => ($step) => object({ id: get($step, "id") }),
          [get, object],
        ),
        planType: EXPORTABLE(
          (
            PgSelectSingleStep,
            get,
            lambda,
            singleTableItemsResource,
            singleTableTypeNameCallback,
          ) =>
            function planType($stepOrSpecifier, { $original }) {
              const $inStep = $original ?? $stepOrSpecifier;
              const $record =
                $inStep instanceof PgSelectSingleStep &&
                ($inStep.resource as PgResource).codec ===
                  singleTableItemsResource.codec
                  ? $inStep
                  : singleTableItemsResource.get({
                      id: get($inStep, "id"),
                    });
              const $type = get($record, "type") as Step<string>;
              const $__typename = lambda(
                $type,
                singleTableTypeNameCallback,
                true,
              );
              return {
                $__typename,
                planForType() {
                  return $record;
                },
              };
            },
          [
            PgSelectSingleStep,
            get,
            lambda,
            singleTableItemsResource,
            singleTableTypeNameCallback,
          ],
        ),
      },
    },
  });

  const commonSingleTableItemFields = {
    id: attrField("id", GraphQLInt),
    type: attrField("type", GraphQLString),
    type2: attrField("type2", EnumTableItemType),
    parent: {
      type: SingleTableItem,
      plan: EXPORTABLE(
        (deoptimizeIfAppropriate) =>
          function plan($entity) {
            const $plan = $entity.singleRelation("parent");
            deoptimizeIfAppropriate($plan);
            return $plan;
          },
        [deoptimizeIfAppropriate],
      ),
    },
    author: singleRelationField("author", Person),
    position: attrField("position", GraphQLString),
    createdAt: attrField("created_at", GraphQLString),
    updatedAt: attrField("updated_at", GraphQLString),
    isExplicitlyArchived: attrField("is_explicitly_archived", GraphQLBoolean),
    archivedAt: attrField("archived_at", GraphQLString),
  } satisfies {
    [fieldName: string]: GrafastFieldConfig<
      PgSelectSingleStep<
        PgResource<any, typeof singleTableItemsResource.codec, any, any, any>
      >
    >;
  };

  const SingleTableTopic = newObjectTypeBuilder<SingleTableItemStep>(
    PgSelectSingleStep,
  )({
    name: "SingleTableTopic",
    planType: EXPORTABLE(
      (get, singleTableItemsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return singleTableItemsResource.get({ id: $id });
        },
      [get, singleTableItemsResource],
    ),
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
    }),
  });

  const SingleTablePost = newObjectTypeBuilder<SingleTableItemStep>(
    PgSelectSingleStep,
  )({
    name: "SingleTablePost",
    planType: EXPORTABLE(
      (get, singleTableItemsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return singleTableItemsResource.get({ id: $id });
        },
      [get, singleTableItemsResource],
    ),
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  const SingleTableDivider = newObjectTypeBuilder<SingleTableItemStep>(
    PgSelectSingleStep,
  )({
    name: "SingleTableDivider",
    planType: EXPORTABLE(
      (get, singleTableItemsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return singleTableItemsResource.get({ id: $id });
        },
      [get, singleTableItemsResource],
    ),
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
      color: attrField("color", GraphQLString),
    }),
  });

  const SingleTableChecklist = newObjectTypeBuilder<SingleTableItemStep>(
    PgSelectSingleStep,
  )({
    name: "SingleTableChecklist",
    planType: EXPORTABLE(
      (get, singleTableItemsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return singleTableItemsResource.get({ id: $id });
        },
      [get, singleTableItemsResource],
    ),
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
    }),
  });

  const SingleTableChecklistItem = newObjectTypeBuilder<SingleTableItemStep>(
    PgSelectSingleStep,
  )({
    name: "SingleTableChecklistItem",
    planType: EXPORTABLE(
      (get, singleTableItemsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return singleTableItemsResource.get({ id: $id });
        },
      [get, singleTableItemsResource],
    ),
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  ////////////////////////////////////////
  const RELATIONAL_LOOKUP = EXPORTABLE(
    (
      relationalChecklistItemsResource,
      relationalChecklistsResource,
      relationalDividersResource,
      relationalPostsResource,
      relationalTopicsResource,
    ) =>
      ({
        RelationalTopic: ["topic", relationalTopicsResource],
        RelationalPost: ["post", relationalPostsResource],
        RelationalDivider: ["divider", relationalDividersResource],
        RelationalChecklist: ["checklist", relationalChecklistsResource],
        RelationalChecklistItem: [
          "checklistItem",
          relationalChecklistItemsResource,
        ],
      }) as const,
    [
      relationalChecklistItemsResource,
      relationalChecklistsResource,
      relationalDividersResource,
      relationalPostsResource,
      relationalTopicsResource,
    ],
  );

  const RelationalItem: GraphQLInterfaceType = new GraphQLInterfaceType({
    name: "RelationalItem",
    fields: () => ({
      id: { type: GraphQLInt },
      type: { type: GraphQLString },
      type2: { type: EnumTableItemType },
      parent: { type: RelationalItem },
      author: { type: Person },
      position: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
      isExplicitlyArchived: { type: GraphQLBoolean },
      archivedAt: { type: GraphQLString },
    }),
    extensions: {
      grafast: {
        toSpecifier: EXPORTABLE(
          (get, object) =>
            function toSpecifier($step) {
              return object({ id: get($step, "id") });
            },
          [get, object],
        ),
        planType: EXPORTABLE(
          (
            PgSelectSingleStep,
            RELATIONAL_LOOKUP,
            deoptimizeIfAppropriate,
            get,
            lambda,
            relationalItemTypeNameFromType,
            relationalItemsResource,
          ) =>
            function planType($stepOrSpecifier, { $original }) {
              const $inStep = $original ?? $stepOrSpecifier;
              const $base =
                $inStep instanceof PgSelectSingleStep &&
                $inStep.resource.codec === relationalItemsResource.codec
                  ? $inStep
                  : relationalItemsResource.get({
                      id: get($inStep, "id"),
                    });
              const $type = get($base, "type") as Step<string>;
              const $__typename = lambda(
                $type,
                relationalItemTypeNameFromType,
                true,
              );
              return {
                $__typename,
                planForType(t) {
                  const deets =
                    RELATIONAL_LOOKUP[t.name as keyof typeof RELATIONAL_LOOKUP];
                  if (!deets) {
                    throw new Error(`Unexpected type ${t}`);
                  }
                  const [relation] = deets;
                  const $relation = (
                    $base as PgSelectSingleStep
                  ).singleRelation(relation);
                  return deoptimizeIfAppropriate($relation);
                },
              };
            },
          [
            PgSelectSingleStep,
            RELATIONAL_LOOKUP,
            deoptimizeIfAppropriate,
            get,
            lambda,
            relationalItemTypeNameFromType,
            relationalItemsResource,
          ],
        ),
      },
    },
  });

  const RelationalCommentable: GraphQLInterfaceType = new GraphQLInterfaceType({
    name: "RelationalCommentable",
    fields: () => ({
      id: { type: GraphQLInt },
      type: { type: GraphQLString },
      type2: { type: EnumTableItemType },
    }),
  });

  const commonRelationalItemFields = <
    TStep extends PgSelectSingleStep<any>,
  >() =>
    ({
      id: attrField("id", GraphQLInt),
      type: attrField("type", GraphQLString),
      type2: attrField("type2", EnumTableItemType),
      parent: {
        type: RelationalItem,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate) =>
            function plan($entity) {
              const $plan = $entity.singleRelation("parent");
              deoptimizeIfAppropriate($plan);
              return $plan;
            },
          [deoptimizeIfAppropriate],
        ),
      },
      author: singleRelationField("author", Person),
      position: attrField("position", GraphQLString),
      createdAt: attrField("created_at", GraphQLString),
      updatedAt: attrField("updated_at", GraphQLString),
      isExplicitlyArchived: attrField("is_explicitly_archived", GraphQLBoolean),
      archivedAt: attrField("archived_at", GraphQLString),
    }) satisfies {
      [fieldName: string]: GrafastFieldConfig<TStep>;
    };

  const RelationalTopic = newObjectTypeBuilder<RelationalTopicStep>(
    PgSelectSingleStep,
  )({
    name: "RelationalTopic",
    planType: EXPORTABLE(
      (get, relationalTopicsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return relationalTopicsResource.get({ id: $id });
        },
      [get, relationalTopicsResource],
    ),
    interfaces: [RelationalItem],
    fields: () => ({
      ...commonRelationalItemFields(),
      title: attrField("title", GraphQLString),
    }),
  });

  const RelationalPost = newObjectTypeBuilder<RelationalPostStep>(
    PgSelectSingleStep,
  )({
    name: "RelationalPost",
    planType: EXPORTABLE(
      (get, relationalPostsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return relationalPostsResource.get({ id: $id });
        },
      [get, relationalPostsResource],
    ),
    interfaces: [RelationalItem, RelationalCommentable],
    fields: () => ({
      ...commonRelationalItemFields(),
      title: attrField("title", GraphQLString),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),

      titleLower: {
        type: GraphQLString,
        plan: EXPORTABLE(
          (pgSelect, scalarTextResource, sql, sqlFromArgDigests) =>
            function plan($entity) {
              return pgSelect({
                resource: scalarTextResource,
                identifiers: [],
                args: [
                  {
                    step: $entity.record(),
                  },
                ],
                from: (...args) =>
                  sql`interfaces_and_unions.relational_posts_title_lower(${sqlFromArgDigests(
                    args,
                  )})`,
                name: "relational_posts_title_lower",
              }).single();
            },
          [pgSelect, scalarTextResource, sql, sqlFromArgDigests],
        ),
      },
    }),
  });

  const RelationalDivider = newObjectTypeBuilder<RelationalDividerStep>(
    PgSelectSingleStep,
  )({
    name: "RelationalDivider",
    planType: EXPORTABLE(
      (get, relationalDividersResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return relationalDividersResource.get({ id: $id });
        },
      [get, relationalDividersResource],
    ),
    interfaces: [RelationalItem],
    fields: () => ({
      ...commonRelationalItemFields(),
      title: attrField("title", GraphQLString),
      color: attrField("color", GraphQLString),
    }),
  });

  const RelationalChecklist = newObjectTypeBuilder<RelationalChecklistStep>(
    PgSelectSingleStep,
  )({
    name: "RelationalChecklist",
    planType: EXPORTABLE(
      (get, relationalChecklistsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return relationalChecklistsResource.get({ id: $id });
        },
      [get, relationalChecklistsResource],
    ),
    interfaces: [RelationalItem, RelationalCommentable],
    fields: () => ({
      ...commonRelationalItemFields(),
      title: attrField("title", GraphQLString),
    }),
  });

  // To preserve formatting, we use a short alias
  type RC = RelationalChecklistItemStep;
  const RelationalChecklistItem = newObjectTypeBuilder<RC>(PgSelectSingleStep)({
    name: "RelationalChecklistItem",
    planType: EXPORTABLE(
      (get, relationalChecklistItemsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return relationalChecklistItemsResource.get({ id: $id });
        },
      [get, relationalChecklistItemsResource],
    ),
    interfaces: [RelationalItem, RelationalCommentable],
    fields: () => ({
      ...commonRelationalItemFields(),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  ////////////////////////////////////////

  const UnionItem: GraphQLUnionType = new GraphQLUnionType({
    name: "UnionItem",
    types: () => [
      UnionTopic,
      UnionPost,
      UnionDivider,
      UnionChecklist,
      UnionChecklistItem,
    ],
    extensions: {
      grafast: {
        planType: EXPORTABLE(
          (get) =>
            function planType($stepOrSpecifier) {
              const $specifier =
                $stepOrSpecifier.toSpecifier?.() ?? $stepOrSpecifier;
              const $__typename = get($specifier, "__typename");
              return {
                $__typename,
                planForType(t) {
                  return (
                    t.extensions?.grafast?.planType?.($specifier) ?? $specifier
                  );
                },
              };
            },
          [get],
        ),
      },
    },
  });

  const UnionTopic = newObjectTypeBuilder<UnionTopicStep>(PgSelectSingleStep)({
    name: "UnionTopic",
    planType: EXPORTABLE(
      (get, unionTopicsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return unionTopicsResource.get({ id: $id });
        },
      [get, unionTopicsResource],
    ),
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
    }),
  });

  const UnionPost = newObjectTypeBuilder<UnionPostStep>(PgSelectSingleStep)({
    name: "UnionPost",
    planType: EXPORTABLE(
      (get, unionPostsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return unionPostsResource.get({ id: $id });
        },
      [get, unionPostsResource],
    ),
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  const UnionDivider = newObjectTypeBuilder<UnionDividerStep>(
    PgSelectSingleStep,
  )({
    name: "UnionDivider",
    planType: EXPORTABLE(
      (get, unionDividersResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return unionDividersResource.get({ id: $id });
        },
      [get, unionDividersResource],
    ),
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
      color: attrField("color", GraphQLString),
    }),
  });

  const UnionChecklist = newObjectTypeBuilder<UnionChecklistStep>(
    PgSelectSingleStep,
  )({
    name: "UnionChecklist",
    planType: EXPORTABLE(
      (get, unionChecklistsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return unionChecklistsResource.get({ id: $id });
        },
      [get, unionChecklistsResource],
    ),
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
    }),
  });

  const UnionChecklistItem = newObjectTypeBuilder<UnionChecklistItemStep>(
    PgSelectSingleStep,
  )({
    name: "UnionChecklistItem",
    planType: EXPORTABLE(
      (get, unionChecklistItemsResource) =>
        function planType($specifier) {
          const $id = get($specifier, "id") as Step<number>;
          return unionChecklistItemsResource.get({ id: $id });
        },
      [get, unionChecklistItemsResource],
    ),
    fields: () => ({
      id: attrField("id", GraphQLInt),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  ////////////////////////////////////////

  const Entity: GraphQLUnionType = new GraphQLUnionType({
    name: "Entity",
    types: () => [Person, Post, Comment],
  });

  ////////////////////////////////////////

  const Vulnerability = new GraphQLInterfaceType({
    name: "Vulnerability",
    fields: {
      cvssScore: {
        type: GraphQLFloat,
      },
    },
  });

  const FirstPartyVulnerability = newObjectTypeBuilder(ExecutableStep)({
    name: "FirstPartyVulnerability",
    planType: EXPORTABLE(
      (firstPartyVulnerabilitiesResource, get) =>
        function planType($stepOrSpecifier) {
          const $specifier =
            $stepOrSpecifier.toSpecifier?.() ?? $stepOrSpecifier;
          const $id = get($specifier, "id") as Step<number>;
          return firstPartyVulnerabilitiesResource.get({ id: $id });
        },
      [firstPartyVulnerabilitiesResource, get],
    ),
    interfaces: [Vulnerability],
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("id");
            },
          [],
        ),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("name");
            },
          [],
        ),
      },
      cvssScore: {
        type: GraphQLFloat,
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("cvss_score");
            },
          [],
        ),
      },
      teamName: {
        type: GraphQLString,
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("team_name");
            },
          [],
        ),
      },
    },
  });

  const ThirdPartyVulnerability = newObjectTypeBuilder(ExecutableStep)({
    name: "ThirdPartyVulnerability",
    planType: EXPORTABLE(
      (get, thirdPartyVulnerabilitiesResource) =>
        function planType($stepOrSpecifier) {
          const $specifier =
            $stepOrSpecifier.toSpecifier?.() ?? $stepOrSpecifier;
          const $id = get($specifier, "id") as Step<number>;
          return thirdPartyVulnerabilitiesResource.get({ id: $id });
        },
      [get, thirdPartyVulnerabilitiesResource],
    ),
    interfaces: [Vulnerability],
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("id");
            },
          [],
        ),
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("name");
            },
          [],
        ),
      },
      cvssScore: {
        type: GraphQLFloat,
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("cvss_score");
            },
          [],
        ),
      },
      vendorName: {
        type: GraphQLString,
        plan: EXPORTABLE(
          () =>
            function plan($v: any) {
              return $v.get("vendor_name");
            },
          [],
        ),
      },
    },
  });

  type VulnerabilityConnectionStep = ConnectionStep<
    any,
    PgUnionAllSingleStep,
    any,
    any,
    null | readonly any[],
    PgUnionAllStep<any, any>
  >;

  const VulnerabilityEdge = newObjectTypeBuilder<EdgeStep<any, any, any>>(
    EdgeStep,
  )({
    name: "VulnerabilityEdge",
    fields: {
      cursor: {
        type: GraphQLString,
      },
      node: {
        type: Vulnerability,
      },
    },
  });

  // To preserve formatting, we use a short alias
  type VCS = VulnerabilityConnectionStep;
  const VulnerabilitiesConnection = newObjectTypeBuilder<VCS>(ConnectionStep)({
    name: "VulnerabilitiesConnection",
    fields: {
      edges: {
        type: new GraphQLList(VulnerabilityEdge),
        plan: EXPORTABLE(
          () =>
            function plan($connection) {
              return $connection.edges();
            },
          [],
        ),
      },
      pageInfo: newGrafastFieldConfigBuilder<VulnerabilityConnectionStep>()({
        type: new GraphQLNonNull(PageInfo),
        plan: EXPORTABLE(
          () =>
            function plan($connection) {
              return $connection.pageInfo() as any;
            },
          [],
        ),
      }),
    },
  });

  const VulnerabilityCondition = newInputObjectTypeBuilder()({
    name: "VulnerabilityCondition",
    fields: {
      todo: {
        type: GraphQLString,
      },
    },
  });

  const VulnerabilitiesOrderBy = new GraphQLEnumType({
    name: "VulnerabilitiesOrderBy",
    values: {
      CVSS_SCORE_ASC: {
        extensions: {
          grafast: {
            apply: EXPORTABLE(
              () => (qb: PgUnionAllQueryBuilder) => {
                qb.orderBy({
                  attribute: "cvss_score",
                  direction: "ASC",
                });
              },
              [],
            ),
          },
        },
      },
      CVSS_SCORE_DESC: {
        extensions: {
          grafast: {
            apply: EXPORTABLE(
              () => (qb: PgUnionAllQueryBuilder) => {
                qb.orderBy({
                  attribute: "cvss_score",
                  direction: "DESC",
                });
              },
              [],
            ),
          },
        },
      },
    },
  });

  ////////////////////////////////////////

  const Query = newObjectTypeBuilder<__ValueStep<BaseGraphQLRootValue>>(
    __ValueStep,
  )({
    name: "Query",
    fields: {
      forums: {
        type: new GraphQLList(Forum),
        args: {
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: __ValueStep<BaseGraphQLRootValue>,
                  $forums: PgSelectStep<typeof forumResource>,
                  arg,
                ) {
                  $forums.setFirst(arg.getRaw());
                },
              [],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            PgSelectStep<typeof forumResource>
          >(($forums) => $forums),
          condition: {
            type: ForumCondition,
            applyPlan: EXPORTABLE(
              (pgWhere) =>
                function plan(
                  _$root,
                  $forums: PgSelectStep<typeof forumResource>,
                  arg,
                ) {
                  arg.apply($forums, pgWhere);
                },
              [pgWhere],
            ),
          },
          filter: {
            type: ForumFilter,
            applyPlan: EXPORTABLE(
              (pgClassFilterWhere) =>
                function plan(
                  _$root,
                  $forums: PgSelectStep<typeof forumResource>,
                  arg,
                ) {
                  arg.apply($forums, pgClassFilterWhere);
                },
              [pgClassFilterWhere],
            ),
          },
        },
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumResource) =>
            function plan(_$root) {
              const $forums = forumResource.find();
              deoptimizeIfAppropriate($forums);
              return $forums;
            },
          [deoptimizeIfAppropriate, forumResource],
        ),
      },
      forum: {
        type: Forum,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumResource) =>
            function plan(_$root, { $id }) {
              const $forum = forumResource.get({
                id: $id as ExecutableStep<string>,
              });
              deoptimizeIfAppropriate($forum);
              return $forum;
            },
          [deoptimizeIfAppropriate, forumResource],
        ),
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
      },
      message: {
        type: Message,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, messageResource) =>
            function plan(_$root, { $id }) {
              const $message = messageResource.get({
                id: $id as ExecutableStep<string>,
              });
              deoptimizeIfAppropriate($message);
              return $message;
            },
          [deoptimizeIfAppropriate, messageResource],
        ),
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
      },
      allMessagesConnection: {
        type: MessagesConnection,
        args: {
          condition: {
            type: MessageCondition,
            applyPlan: EXPORTABLE(
              (pgWhere) =>
                function plan(
                  _$root: any,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  const $messages = $connection.getSubplan();
                  arg.apply($messages, pgWhere);
                },
              [pgWhere],
            ),
          },
          filter: {
            type: MessageFilter,
            applyPlan: EXPORTABLE(
              (pgClassFilterWhere) =>
                function plan(
                  _$root: any,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  const $messages = $connection.getSubplan();
                  arg.apply($messages, pgClassFilterWhere);
                },
              [pgClassFilterWhere],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            ResourceConnectionPlan<typeof messageResource>
          >(($connection) => $connection.getSubplan()),
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: any,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  val,
                ) {
                  $connection.setFirst(val.getRaw());
                },
              [],
            ),
          },
          last: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setLast(arg.getRaw());
                },
              [],
            ),
          },
          after: {
            type: GraphQLString,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setAfter(arg.getRaw());
                },
              [],
            ),
          },
          before: {
            type: GraphQLString,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setBefore(arg.getRaw());
                },
              [],
            ),
          },
          orderBy: {
            type: new GraphQLList(new GraphQLNonNull(MessagesOrderBy)),
          },
        },
        plan: EXPORTABLE(
          (connection, deoptimizeIfAppropriate, messageResource) =>
            function plan(_, fieldArgs) {
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
            },
          [connection, deoptimizeIfAppropriate, messageResource],
        ),
      },

      uniqueAuthorCount: {
        type: GraphQLInt,
        args: {
          featured: {
            type: GraphQLBoolean,
          },
        },
        plan: EXPORTABLE(
          (TYPES, deoptimizeIfAppropriate, uniqueAuthorCountResource) =>
            function plan(_$root, { $featured }) {
              const $plan = uniqueAuthorCountResource.execute([
                {
                  step: $featured,
                  pgCodec: TYPES.boolean,
                  name: "featured",
                },
              ]);
              deoptimizeIfAppropriate($plan);
              return $plan;
            },
          [TYPES, deoptimizeIfAppropriate, uniqueAuthorCountResource],
        ),
      },

      forumNames: {
        type: new GraphQLList(GraphQLString),
        plan: EXPORTABLE(
          (pgSelect, scalarTextResource, sql) =>
            function plan(_$root) {
              const $plan = pgSelect({
                resource: scalarTextResource,
                identifiers: [],
                from: sql`app_public.forum_names()`,
                name: "forum_names",
              });
              return $plan;
            },
          [pgSelect, scalarTextResource, sql],
        ),
      },

      forumNamesArray: {
        type: new GraphQLList(GraphQLString),
        plan: EXPORTABLE(
          (forumNamesArrayResource) =>
            function plan(_$root) {
              return forumNamesArrayResource.execute();
            },
          [forumNamesArrayResource],
        ),
      },

      forumNamesCasesList: {
        type: new GraphQLList(new GraphQLList(GraphQLString)),
        plan: EXPORTABLE(
          (forumNamesCasesResource) =>
            function plan(_$root) {
              const $plan = forumNamesCasesResource.execute();
              return $plan;
            },
          [forumNamesCasesResource],
        ),
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
        type: new GraphQLList(GraphQLString),
        description: "Like forumNames, only we convert them all to upper case",
        plan: EXPORTABLE(
          (each, lambda, pgSelect, scalarTextResource, sql) =>
            function plan(_$root) {
              const $names = pgSelect({
                resource: scalarTextResource,
                identifiers: [],
                from: sql`app_public.forum_names()`,
                name: "forum_names",
              });
              // return lambda($names, (names: string[]) => names.map(name => name.toUpperCase())),
              return each($names, ($name) =>
                lambda($name, (name) => name.toUpperCase(), true),
              );
            },
          [each, lambda, pgSelect, scalarTextResource, sql],
        ),
      },

      randomUser: {
        type: User,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, pgSelect, sql, userResource) =>
            function plan() {
              const $users = pgSelect({
                resource: userResource,
                identifiers: [],
                from: sql`app_public.random_user()`,
                name: "random_user",
              });
              deoptimizeIfAppropriate($users);
              return $users.single();
            },
          [deoptimizeIfAppropriate, pgSelect, sql, userResource],
        ),
      },

      randomUserArray: {
        type: new GraphQLList(User),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, randomUserArrayResource) =>
            function plan() {
              const $select = randomUserArrayResource.execute();
              deoptimizeIfAppropriate($select);
              return $select;
            },
          [deoptimizeIfAppropriate, randomUserArrayResource],
        ),
      },

      randomUserArraySet: {
        type: new GraphQLList(new GraphQLList(User)),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, randomUserArraySetResource) =>
            function plan() {
              const $selectPartitioned = randomUserArraySetResource.execute();
              deoptimizeIfAppropriate($selectPartitioned);
              return $selectPartitioned;
            },
          [deoptimizeIfAppropriate, randomUserArraySetResource],
        ),
      },

      featuredMessages: {
        type: new GraphQLList(Message),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, featuredMessagesResource, pgSelect) =>
            function plan() {
              const $messages = pgSelect({
                resource: featuredMessagesResource,
                identifiers: [],
              });
              deoptimizeIfAppropriate($messages);
              return $messages;
            },
          [deoptimizeIfAppropriate, featuredMessagesResource, pgSelect],
        ),
      },

      people: {
        type: new GraphQLList(Person),
        args: { first: { type: GraphQLInt } },
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, personResource) =>
            function plan(_, { $first }) {
              const $people = personResource.find();
              $people.setFirst($first);
              deoptimizeIfAppropriate($people);
              return $people;
            },
          [deoptimizeIfAppropriate, personResource],
        ),
      },

      singleTableItemById: {
        type: SingleTableItem,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (singleTableItemsResource) =>
            function plan(_$root, { $id }) {
              const $item: SingleTableItemStep = singleTableItemsResource.get({
                id: $id as ExecutableStep<number>,
              });
              return $item;
            },
          [singleTableItemsResource],
        ),
      },

      singleTableTopicById: {
        type: SingleTableTopic,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (constant, singleTableItemsResource) =>
            function plan(_$root, { $id }) {
              const $item: SingleTableItemStep = singleTableItemsResource.get({
                id: $id as ExecutableStep<number>,
                type: constant("TOPIC", false),
              });
              return $item;
            },
          [constant, singleTableItemsResource],
        ),
      },

      relationalItemById: {
        type: RelationalItem,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (relationalItemsResource) =>
            function plan(_$root, { $id }) {
              const $item: RelationalItemStep = relationalItemsResource.get({
                id: $id as ExecutableStep<number>,
              });
              return $item;
            },
          [relationalItemsResource],
        ),
      },

      relationalTopicById: {
        type: RelationalTopic,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (relationalTopicsResource) =>
            function plan(_$root, { $id }) {
              return relationalTopicsResource.get({
                id: $id as ExecutableStep<number>,
              });
            },
          [relationalTopicsResource],
        ),
      },

      allRelationalCommentablesList: {
        type: new GraphQLList(new GraphQLNonNull(RelationalCommentable)),
        args: {
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(_$root: any, $each: __ListTransformStep, val) {
                  const $commentables =
                    $each.getListStep() as RelationalCommentablesStep;
                  $commentables.setFirst(val.getRaw());
                },
              [],
            ),
          },
        },
        plan: EXPORTABLE(
          (
            TYPES,
            each,
            relationalCommentableInterface,
            relationalCommentableResource,
            sql,
          ) =>
            function plan() {
              const $commentables: RelationalCommentablesStep =
                relationalCommentableResource.find();
              $commentables.orderBy({
                codec: TYPES.int,
                fragment: sql`${$commentables.alias}.id`,
                direction: "ASC",
              });
              return each($commentables, ($commentable) =>
                relationalCommentableInterface($commentable),
              );
            },
          [
            TYPES,
            each,
            relationalCommentableInterface,
            relationalCommentableResource,
            sql,
          ],
        ),
      },

      unionItemById: {
        type: UnionItem,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (
            inhibitOnNull,
            lambda,
            object,
            unionItemTypeNameFromType,
            unionItemsResource,
          ) =>
            function plan(_$root, { $id }) {
              const $item: UnionItemStep = unionItemsResource.get({
                id: $id as ExecutableStep<number>,
              });
              const $type = inhibitOnNull($item.get("type"));
              const $__typename = lambda(
                $type,
                unionItemTypeNameFromType,
                true,
              );
              return object({
                __typename: $__typename,
                id: $item.get("id"),
              });
            },
          [
            inhibitOnNull,
            lambda,
            object,
            unionItemTypeNameFromType,
            unionItemsResource,
          ],
        ),
      },

      unionItemByIdViaUnionAll: {
        type: UnionItem,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (
            TYPES,
            pgUnionAll,
            sql,
            unionChecklistItemsResource,
            unionChecklistsResource,
            unionDividersResource,
            unionPostsResource,
            unionTopicsResource,
          ) =>
            function plan(_$root, { $id }) {
              const $items = pgUnionAll({
                resourceByTypeName: {
                  UnionTopic: unionTopicsResource,
                  UnionPost: unionPostsResource,
                  UnionDivider: unionDividersResource,
                  UnionChecklist: unionChecklistsResource,
                  UnionChecklistItem: unionChecklistItemsResource,
                },
              });
              $items.where(
                sql`${$items}.id = ${$items.placeholder($id, TYPES.int)}`,
              );
              return $items.single();
            },
          [
            TYPES,
            pgUnionAll,
            sql,
            unionChecklistItemsResource,
            unionChecklistsResource,
            unionDividersResource,
            unionPostsResource,
            unionTopicsResource,
          ],
        ),
      },

      unionTopicById: {
        type: UnionTopic,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (unionTopicsResource) =>
            function plan(_$root, { $id }) {
              return unionTopicsResource.get({
                id: $id as ExecutableStep<number>,
              });
            },
          [unionTopicsResource],
        ),
      },

      allUnionItemsList: {
        type: new GraphQLList(new GraphQLNonNull(UnionItem)),
        plan: EXPORTABLE(
          (TYPES, sql, unionItemsResource) =>
            function plan() {
              const $items: UnionItemsStep = unionItemsResource.find();
              $items.orderBy({
                codec: TYPES.int,
                fragment: sql`${$items.alias}.id`,
                direction: "ASC",
              });
              return $items;
            },
          [TYPES, sql, unionItemsResource],
        ),
      },

      searchEntities: {
        type: new GraphQLList(new GraphQLNonNull(Entity)),
        args: {
          query: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        plan: EXPORTABLE(
          (
            TYPES,
            deoptimizeIfAppropriate,
            each,
            entitySearchResource,
            entityUnion,
          ) =>
            function plan(_$root, { $query }) {
              const $step = entitySearchResource.execute([
                {
                  step: $query,
                  pgCodec: TYPES.text,
                  name: "query",
                },
              ]) as PgSelectStep;
              deoptimizeIfAppropriate($step);
              return each($step, ($item) => entityUnion($item as any));
            },
          [
            TYPES,
            deoptimizeIfAppropriate,
            each,
            entitySearchResource,
            entityUnion,
          ],
        ),
      },

      personByPersonId: {
        type: Person,
        args: {
          personId: {
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        plan: EXPORTABLE(
          (personResource) =>
            function plan(_$root, { $personId }) {
              return personResource.get({
                person_id: $personId as ExecutableStep<number>,
              });
            },
          [personResource],
        ),
      },

      nonNullableNull: {
        type: new GraphQLNonNull(GraphQLInt),
        description:
          "Claims to be non-nullable, but always returns null. Used to test root-level null handling.",
        plan: EXPORTABLE(
          (constant) =>
            function plan() {
              return constant(null);
            },
          [constant],
        ),
      },

      nonNullableError: {
        type: new GraphQLNonNull(GraphQLInt),
        description:
          "Non-nullable, always throws. Used to test root-level null handling.",
        plan: EXPORTABLE(
          (error) =>
            function plan() {
              return error(
                new Error(
                  "Generic error from nonNullableError field in example schema",
                ),
              );
            },
          [error],
        ),
      },

      deepObject: {
        type: new GraphQLObjectType({
          name: "DeepObject",
          fields: {
            number: {
              type: GraphQLInt,
            },
            numbers: {
              type: new GraphQLList(GraphQLInt),
            },
            friend: {
              type: new GraphQLObjectType({
                name: "DeepObjectFriend",
                fields: {
                  name: { type: GraphQLString },
                  occupation: { type: GraphQLString },
                  status: { type: GraphQLString },
                },
              }),
            },
          },
        }),
        resolve: EXPORTABLE(
          () =>
            function resolve() {
              return {
                number: 42,
                numbers: [1, 1, 2, 3, 5, 8, 13],
                friend: {
                  name: "Marvin",
                  occupation: "Android",
                  status: "paranoid",
                },
              };
            },
          [],
        ),
      },

      vulnerabilities: {
        type: new GraphQLList(Vulnerability),
        args: {
          first: {
            type: GraphQLInt,
          },
          offset: {
            type: GraphQLInt,
          },
        },
        plan: EXPORTABLE(
          (
            TYPES,
            constant,
            firstPartyVulnerabilitiesResource,
            pgUnionAll,
            sql,
            thirdPartyVulnerabilitiesResource,
          ) =>
            function plan(_, { $first, $offset }) {
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
                callback: (alias) =>
                  sql`${alias} > ${$vulnerabilities.placeholder(
                    constant(6, false),
                    TYPES.float,
                  )}`,
              });
              $vulnerabilities.setFirst($first);
              $vulnerabilities.setOffset($offset);
              return $vulnerabilities;
            },
          [
            TYPES,
            constant,
            firstPartyVulnerabilitiesResource,
            pgUnionAll,
            sql,
            thirdPartyVulnerabilitiesResource,
          ],
        ),
      },
      vulnerabilitiesConnection: {
        type: VulnerabilitiesConnection,
        args: {
          condition: {
            type: VulnerabilityCondition,
            applyPlan: EXPORTABLE(
              (pgWhere) =>
                function plan(
                  _$root: any,
                  $connection: VulnerabilityConnectionStep,
                  arg,
                ) {
                  const $collection = $connection.getSubplan();
                  arg.apply($collection, pgWhere);
                },
              [pgWhere],
            ),
          },
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: any,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  val,
                ) {
                  $connection.setFirst(val.getRaw());
                },
              [],
            ),
          },
          last: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setLast(arg.getRaw());
                },
              [],
            ),
          },
          offset: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setOffset(arg.getRaw());
                },
              [],
            ),
          },
          after: {
            type: GraphQLString,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setAfter(arg.getRaw());
                },
              [],
            ),
          },
          before: {
            type: GraphQLString,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $connection: ResourceConnectionPlan<typeof messageResource>,
                  arg,
                ) {
                  $connection.setBefore(arg.getRaw());
                },
              [],
            ),
          },
          orderBy: {
            type: new GraphQLList(new GraphQLNonNull(VulnerabilitiesOrderBy)),
          },
        },
        plan: EXPORTABLE(
          (
            TYPES,
            connection,
            firstPartyVulnerabilitiesResource,
            pgUnionAll,
            thirdPartyVulnerabilitiesResource,
          ) =>
            function plan(_, fieldArgs) {
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
            },
          [
            TYPES,
            connection,
            firstPartyVulnerabilitiesResource,
            pgUnionAll,
            thirdPartyVulnerabilitiesResource,
          ],
        ),
      },
    },
  });

  const CreateRelationalPostInput = newInputObjectTypeBuilder()({
    name: "CreateRelationalPostInput",
    fields: {
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      description: {
        type: GraphQLString,
      },
      note: {
        type: GraphQLString,
      },
    },
  });

  const RelationalPostPatch = newInputObjectTypeBuilder()({
    name: "RelationalPostPatch",
    fields: {
      // All nullable, since it's a patch.
      title: {
        type: GraphQLString,
      },
      description: {
        type: GraphQLString,
      },
      note: {
        type: GraphQLString,
      },
    },
  });

  const UpdateRelationalPostByIdInput = newInputObjectTypeBuilder()({
    name: "UpdateRelationalPostByIdInput",
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      patch: {
        type: new GraphQLNonNull(RelationalPostPatch),
      },
    },
  });

  const DeleteRelationalPostByIdInput = newInputObjectTypeBuilder()({
    name: "DeleteRelationalPostByIdInput",
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
  });

  type PgRecord<TResource extends PgResource<any, any, any, any, any>> =
    PgClassExpressionStep<
      PgCodec<any, GetPgResourceAttributes<TResource>, any, any, any, any, any>,
      TResource
    >;

  const CreateRelationalPostPayload = newObjectTypeBuilder<
    PgRecord<typeof relationalPostsResource>
  >(PgClassExpressionStep)({
    name: "CreateRelationalPostPayload",
    fields: {
      post: {
        type: RelationalPost,
        plan: EXPORTABLE(
          (relationalPostsResource) =>
            function plan($post) {
              return relationalPostsResource.get({ id: $post.get("id") });
            },
          [relationalPostsResource],
        ),
      },
      id: {
        type: GraphQLInt,
        plan: EXPORTABLE(
          () =>
            function plan($post) {
              return $post.get("id");
            },
          [],
        ),
      },
      query: {
        type: Query,
        plan: EXPORTABLE(
          (rootValue) =>
            function plan() {
              return rootValue();
            },
          [rootValue],
        ),
      },
    },
  });

  const UpdateRelationalPostByIdPayload = newObjectTypeBuilder<
    PgUpdateSingleStep<typeof relationalPostsResource>
  >(PgUpdateSingleStep)({
    name: "UpdateRelationalPostByIdPayload",
    fields: {
      post: {
        type: RelationalPost,
        plan: EXPORTABLE(
          (relationalPostsResource) =>
            function plan($post) {
              return relationalPostsResource.get({ id: $post.get("id") });
            },
          [relationalPostsResource],
        ),
      },
      id: {
        type: GraphQLInt,
        plan: EXPORTABLE(
          () =>
            function plan($post) {
              return $post.get("id");
            },
          [],
        ),
      },
      query: {
        type: Query,
        plan: EXPORTABLE(
          (rootValue) =>
            function plan() {
              return rootValue();
            },
          [rootValue],
        ),
      },
    },
  });

  const DeleteRelationalPostByIdPayload = newObjectTypeBuilder<
    PgDeleteSingleStep<typeof relationalPostsResource>
  >(PgDeleteSingleStep)({
    name: "DeleteRelationalPostByIdPayload",
    fields: {
      // Since we've deleted the post we cannot go and fetch it; so we must
      // return the record from the mutation RETURNING clause
      post: {
        type: RelationalPost,
        plan: EXPORTABLE(
          (pgSelectSingleFromRecord, relationalPostsResource) =>
            function plan($post) {
              return pgSelectSingleFromRecord(
                relationalPostsResource,
                $post.record(),
              );
            },
          [pgSelectSingleFromRecord, relationalPostsResource],
        ),
      },

      id: {
        type: GraphQLInt,
        plan: EXPORTABLE(
          () =>
            function plan($post) {
              return $post.get("id");
            },
          [],
        ),
      },
      query: {
        type: Query,
        plan: EXPORTABLE(
          (rootValue) =>
            function plan() {
              return rootValue();
            },
          [rootValue],
        ),
      },
    },
  });

  const MultipleActionsInput = newInputObjectTypeBuilder()({
    name: "MultipleActionsInput",
    fields: {
      a: {
        type: GraphQLInt,
      },
    },
  });

  const MultipleActionsPayload =
    newObjectTypeBuilder<SideEffectWithPgClientStep>(
      SideEffectWithPgClientStep,
    )({
      name: "MultipleActionsPayload",
      fields: {
        i: {
          type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
          plan: EXPORTABLE(
            () =>
              function plan($parent) {
                return $parent;
              },
            [],
          ),
        },
      },
    });

  const Mutation = newObjectTypeBuilder<__ValueStep<BaseGraphQLRootValue>>(
    __ValueStep,
  )({
    name: "Mutation",
    fields: {
      createRelationalPost: {
        args: {
          input: {
            type: new GraphQLNonNull(CreateRelationalPostInput),
          },
        },
        type: CreateRelationalPostPayload,
        plan: EXPORTABLE(
          (
            bakedInput,
            constant,
            getNullableInputTypeAtPath,
            pgInsertSingle,
            relationalItemsResource,
            relationalPostsResource,
          ) =>
            function plan(_$root, fieldArgs) {
              const $item = pgInsertSingle(relationalItemsResource, {
                type: constant`POST`,
                author_id: constant(2, false),
              });
              const $itemId = $item.get("id");
              const $post = pgInsertSingle(relationalPostsResource, {
                id: $itemId,
              });
              const inputArgType = fieldArgs.typeAt("input");
              for (const key of ["title", "description", "note"] as Array<
                keyof typeof relationalPostsResource.codec.attributes
              >) {
                const $rawValue = fieldArgs.getRaw(["input", key]);
                const $value = bakedInput(
                  getNullableInputTypeAtPath(inputArgType, [key]),
                  $rawValue,
                );

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
            },
          [
            bakedInput,
            constant,
            getNullableInputTypeAtPath,
            pgInsertSingle,
            relationalItemsResource,
            relationalPostsResource,
          ],
        ),
      },

      createThreeRelationalPosts: {
        description:
          "This silly mutation is specifically to ensure that mutation plans are not tree-shaken - we never want to throw away mutation side effects.",
        type: CreateRelationalPostPayload,
        plan: EXPORTABLE(
          (
            constant,
            pgInsertSingle,
            relationalItemsResource,
            relationalPostsResource,
          ) =>
            function plan() {
              // Only the _last_ post plan is returned; there's no dependency on
              // the first two posts, and yet they should not be tree-shaken
              // because they're mutations.
              let $post: PgInsertSingleStep<typeof relationalPostsResource>;
              for (let i = 0; i < 3; i++) {
                const $item = pgInsertSingle(relationalItemsResource, {
                  type: constant`POST`,
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
              return $post!.record();
            },
          [
            constant,
            pgInsertSingle,
            relationalItemsResource,
            relationalPostsResource,
          ],
        ),
      },

      createThreeRelationalPostsComputed: {
        description:
          "This silly mutation is specifically to ensure that mutation plans are not tree-shaken even if they use plans that are normally side-effect free - we never want to throw away mutation side effects.",
        type: CreateRelationalPostPayload,
        plan: EXPORTABLE(
          (TYPES, constant, pgSelect, relationalPostsResource, sql) =>
            function plan() {
              // Only the _last_ post plan is returned; there's no dependency on
              // the first two posts, and yet they should not be tree-shaken
              // because they're mutations.
              let $post: PgSelectStep<typeof relationalPostsResource>;
              for (let i = 0; i < 3; i++) {
                $post = pgSelect({
                  resource: relationalPostsResource,
                  identifiers: [],
                  from: (authorId, title) =>
                    sql`interfaces_and_unions.insert_post(${authorId.placeholder}, ${title.placeholder})`,
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
              return $post!.single().record();
            },
          [TYPES, constant, pgSelect, relationalPostsResource, sql],
        ),
      },

      updateRelationalPostById: {
        args: {
          input: {
            type: new GraphQLNonNull(UpdateRelationalPostByIdInput),
          },
        },
        type: UpdateRelationalPostByIdPayload,
        plan: EXPORTABLE(
          (
            bakedInput,
            getNullableInputTypeAtPath,
            pgUpdateSingle,
            relationalPostsResource,
          ) =>
            function plan(_$root, fieldArgs) {
              const $post = pgUpdateSingle(relationalPostsResource, {
                id: fieldArgs.$input.$id as ExecutableStep<number>,
              });
              const inputArgType = fieldArgs.typeAt("input");
              for (const key of ["title", "description", "note"] as Array<
                keyof typeof relationalPostsResource.codec.attributes
              >) {
                const $rawValue = fieldArgs.getRaw(["input", "patch", key]);
                const $value = bakedInput(
                  getNullableInputTypeAtPath(inputArgType, ["patch", key]),
                  $rawValue,
                );

                // TODO: pgUpdateSingle needs to ignore values set to undefined
                $post.set(key, $value);
              }
              return $post;
            },
          [
            bakedInput,
            getNullableInputTypeAtPath,
            pgUpdateSingle,
            relationalPostsResource,
          ],
        ),
      },

      deleteRelationalPostById: {
        args: {
          input: {
            type: new GraphQLNonNull(DeleteRelationalPostByIdInput),
          },
        },
        type: DeleteRelationalPostByIdPayload,
        plan: EXPORTABLE(
          (pgDeleteSingle, relationalPostsResource) =>
            function plan(_$root, { $input: { $id } }) {
              const $post = pgDeleteSingle(relationalPostsResource, {
                id: $id as ExecutableStep<number>,
              });
              return $post;
            },
          [pgDeleteSingle, relationalPostsResource],
        ),
      },

      multipleActions: {
        args: {
          input: {
            type: new GraphQLNonNull(MultipleActionsInput),
          },
        },
        type: MultipleActionsPayload,
        plan: EXPORTABLE(
          (executor, object, sideEffectWithPgClientTransaction, sleep, sql) =>
            function plan(_$root, { $input: { $a } }) {
              const $transactionResult = sideEffectWithPgClientTransaction(
                executor,
                object({
                  a: $a as ExecutableStep<number | null | undefined>,
                }),
                async (client, { a }) => {
                  // Set a transaction variable to reference later
                  await client.query(
                    sql.compile(
                      sql`select set_config('my_app.a', ${sql.value(
                        a ?? 1,
                      )}, true);`,
                    ),
                  );

                  // Run some SQL
                  const { rows } = await client.query<{ i: number }>(
                    sql.compile(
                      sql`select * from generate_series(1, ${sql.value(
                        a ?? 1,
                      )}) as i;`,
                    ),
                  );

                  // Do some asynchronous work (e.g. talk to Stripe or whatever)
                  await sleep(2);

                  // Use the transaction variable to ensure we're still in the transaction
                  const { rows: rows2 } = await client.query<{ i: number }>(
                    sql.compile(
                      sql`select i + current_setting('my_app.a', true)::int as i from generate_series(${sql.value(
                        rows[rows.length - 1].i,
                      )}, 10) as i;`,
                    ),
                  );

                  // Return the data
                  return rows2.map((row) => row.i);
                },
              );

              // This line is critical to test setting hasSideEffects on a withPgClient call
              $transactionResult.hasSideEffects = true;

              return $transactionResult;
            },
          [executor, object, sideEffectWithPgClientTransaction, sleep, sql],
        ),
      },
    },
  });

  const ForumMessageSubscriptionPayload = newObjectTypeBuilder<
    JSONParseStep<{ id: string; op: string }>
  >(JSONParseStep)({
    name: "ForumMessageSubscriptionPayload",
    fields: {
      operationType: {
        type: GraphQLString,
        plan: EXPORTABLE(
          (lambda) =>
            function plan($event) {
              return lambda(
                $event.get("op"),
                (txt) => String(txt).toLowerCase(),
                true,
              );
            },
          [lambda],
        ),
      },
      message: {
        type: Message,
        plan: EXPORTABLE(
          (messageResource) =>
            function plan($event) {
              return messageResource.get({ id: $event.get("id") });
            },
          [messageResource],
        ),
      },
    },
  });

  const Subscription = newObjectTypeBuilder<__ValueStep<BaseGraphQLRootValue>>(
    __ValueStep,
  )({
    name: "Subscription",
    fields: {
      forumMessage: {
        args: {
          forumId: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        type: ForumMessageSubscriptionPayload,
        subscribePlan: EXPORTABLE(
          (context, jsonParse, lambda, listen) =>
            function subscribePlan(_$root, args) {
              const $forumId = args.getRaw("forumId");
              const $topic = lambda(
                $forumId,
                (id) => `forum:${id}:message`,
                true,
              );
              const $pgSubscriber = context().get(
                "pgSubscriber",
              ) as unknown as AccessStep<GrafastSubscriber>;

              return listen($pgSubscriber, $topic, { itemPlan: jsonParse });
            },
          [context, jsonParse, lambda, listen],
        ),
        plan: EXPORTABLE(
          () =>
            function plan($event) {
              return $event;
            },
          [],
        ),
      },
    },
  });

  return new GraphQLSchema({
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
    // @ts-ignore
    ...(graphqlHasStreamDefer
      ? { enableDeferStream: true }
      : {
          directives: [
            ...specifiedDirectives,
            GraphQLStreamDirective,
            GraphQLDeferDirective,
          ],
        }),
  });
}

async function main() {
  const filePath = `${__dirname}/../../__tests__/schema.graphql`;
  const schema = makeExampleSchema();
  writeFileSync(
    filePath,
    //prettier.format(
    printSchema(schema),
    //{
    //  ...(await prettier.resolveConfig(filePath)),
    //  parser: "graphql",
    //}),
  );
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
const pgClassFilterWhere = EXPORTABLE(
  (PgClassFilter) =>
    function pgClassFilterWhere(qb: PgSelectQueryBuilder) {
      return new PgClassFilter(qb.whereBuilder(), qb.alias);
    },
  [PgClassFilter],
);
function pgWhere(qb: PgSelectQueryBuilder | PgUnionAllQueryBuilder) {
  return qb.whereBuilder();
}
const includeArchivedCondition = EXPORTABLE(
  (sql) =>
    function includeArchivedCondition([sqlParentArchivedAt, value]: readonly [
      SQL | undefined,
      Maybe<string>,
    ]): PgSelectQueryBuilderCallback {
      return (queryBuilder) => {
        if (value === "YES") {
          // No restriction
        } else if (value === "EXCLUSIVELY") {
          queryBuilder.where(sql`${queryBuilder}.archived_at is not null`);
        } else if (
          value === "INHERIT" &&
          // INHERIT only works if the parent has an archived_at attribute.
          sqlParentArchivedAt !== undefined
        ) {
          queryBuilder.where(
            sql`(${queryBuilder.alias}.archived_at is null) = (${sqlParentArchivedAt} is null)`,
          );
        } else {
          queryBuilder.where(sql`${queryBuilder}.archived_at is null`);
        }
      };
    },
  [sql],
);
