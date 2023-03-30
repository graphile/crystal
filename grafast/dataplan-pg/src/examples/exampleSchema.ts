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
  __InputObjectStep,
  __InputStaticLeafStep,
  __TrackedObjectStep,
  AccessStep,
  BaseGraphQLRootValue,
  GrafastSubscriber,
  GraphileArgumentConfig,
  GraphileFieldConfig,
  ListStep,
} from "grafast";
import {
  __ListTransformStep,
  __ValueStep,
  connection,
  ConnectionStep,
  constant,
  context,
  each,
  error,
  ExecutableStep,
  filter,
  getEnumValueConfig,
  groupBy,
  lambda,
  list,
  listen,
  newGraphileFieldConfigBuilder,
  newInputObjectTypeBuilder,
  newObjectTypeBuilder,
  object,
  operationPlan,
} from "grafast";
import type { GraphQLOutputType } from "graphql";
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLError,
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
} from "graphql";
import sql from "pg-sql2";
//import prettier from "prettier";
import { inspect } from "util";

import type {
  PgCodec,
  PgConditionStep,
  PgExecutorContextPlans,
  PgInsertStep,
  PgSelectStep,
  PgTypeColumn,
  PgTypeColumnVia,
  WithPgClient,
} from "../";
import type { PgSubscriber } from "../adaptors/pg.js";
import { listOfCodec } from "../codecs.js";
import {
  makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
} from "../datasource.js";
import {
  BooleanFilterStep,
  ClassFilterStep,
  enumCodec,
  ManyFilterStep,
  pgClassExpression,
  PgClassExpressionStep,
  pgDelete,
  PgDeleteStep,
  PgExecutor,
  pgInsert,
  pgPolymorphic,
  PgResource,
  pgSelect,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  pgSingleTablePolymorphic,
  pgUpdate,
  PgUpdateStep,
  recordCodec,
  TYPES,
} from "../index.js";
import type { GetPgResourceColumns, PgCodecAny } from "../interfaces";
import { PgPageInfoStep } from "../steps/pgPageInfo.js";
import type { PgPolymorphicTypeMap } from "../steps/pgPolymorphic.js";
import type { PgSelectParsedCursorStep } from "../steps/pgSelect.js";
import { sqlFromArgDigests } from "../steps/pgSelect.js";
import type { PgUnionAllStep } from "../steps/pgUnionAll.js";
import { pgUnionAll, PgUnionAllSingleStep } from "../steps/pgUnionAll.js";
import {
  WithPgClientStep,
  withPgClientTransaction,
} from "../steps/withPgClient.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
): T {
  const fn: T = factory(...args);
  if (
    (typeof fn === "function" || (typeof fn === "object" && fn !== null)) &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
    });
  }
  return fn;
}

// These are what the generics extend from

// This is the actual runtime context; we should not use a global for this.
export interface OurGraphQLContext extends Grafast.Context {
  pgSettings: { [key: string]: string };
  withPgClient: WithPgClient;
  pgSubscriber: PgSubscriber;
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
        name: "default",
        context: () => {
          const $context = context<OurGraphQLContext>();
          return object<
            PgExecutorContextPlans<OurGraphQLContext["pgSettings"]>
          >({
            pgSettings: $context.get("pgSettings"),
            withPgClient: $context.get("withPgClient"),
          });
        },
      }),
    [PgExecutor, context, object],
  );

  /**
   * Applies auth checks to the plan; we are using a placeholder here for now.
   */
  const selectAuth = EXPORTABLE(
    (sql) => ($step: PgSelectStep<any>) => {
      $step.where(sql`true /* authorization checks */`);
    },
    [sql],
  );

  const registryConfig = EXPORTABLE(
    (
      PgResource,
      TYPES,
      enumCodec,
      executor,
      listOfCodec,
      makePgResourceOptions,
      makeRegistryBuilder,
      recordCodec,
      selectAuth,
      sql,
      sqlFromArgDigests,
    ) => {
      const col = <
        TOptions extends {
          codec: PgCodecAny;
          notNull?: boolean;
          expression?: PgTypeColumn<any>["expression"];
          // TODO: we could make TypeScript understand the relations on the object
          // rather than just being string.
          via?: PgTypeColumnVia;
          identicalVia?: PgTypeColumnVia;
        },
      >(
        options: TOptions,
      ): PgTypeColumn<TOptions extends { codec: infer U } ? U : never> => {
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
        name: "forums",
        identifier: sql`app_public.forums`,
        columns: {
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
        name: "users",
        identifier: sql`app_public.users`,
        columns: {
          id: col({ notNull: true, codec: TYPES.uuid }),
          username: col({ notNull: true, codec: TYPES.citext }),
          gravatar_url: col({ codec: TYPES.text }),
          created_at: col({ notNull: true, codec: TYPES.timestamptz }),
        },
      });

      const messagesCodec = recordCodec({
        name: "messages",
        identifier: sql`app_public.messages`,
        columns: {
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
            expression: (alias) => sql`${alias}.archived_at is not null`,
          }),
        },
      });

      const uniqueAuthorCountSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: TYPES.int,
        source: (...args) =>
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

      const forumNamesArraySourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: listOfCodec(TYPES.text),
        source: (...args) =>
          sql`app_public.forum_names_array(${sqlFromArgDigests(args)})`,
        name: "forum_names_array",
        parameters: [],
        isUnique: true, // No setof
      });

      const forumNamesCasesSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: listOfCodec(TYPES.text),
        source: (...args) =>
          sql`app_public.forum_names_cases(${sqlFromArgDigests(args)})`,
        name: "forum_names_cases",
        parameters: [],
      });

      const forumsUniqueAuthorCountSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: TYPES.int,
        source: (...args) =>
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

      const scalarTextSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: TYPES.text,
        source: sql`(select '')`,
        name: "text",
      });

      const messageSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: messagesCodec,
        source: sql`app_public.messages`,
        name: "messages",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const userSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: userCodec,
        source: sql`app_public.users`,
        name: "users",
        uniques: [
          { columns: ["id"], isPrimary: true },
          { columns: ["username"] },
        ],
      });

      const forumSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: forumCodec,
        source: sql`app_public.forums`,
        name: "forums",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const usersMostRecentForumSourceOptions =
        PgResource.functionSourceOptions(forumSourceOptions, {
          name: "users_most_recent_forum",
          source: (...args) =>
            sql`app_public.users_most_recent_forum(${sqlFromArgDigests(args)})`,
          returnsArray: false,
          returnsSetof: false,
          parameters: [
            {
              name: "u",
              codec: userSourceOptions.codec,
              required: true,
              notNull: true,
            },
          ],
        });

      const featuredMessagesSourceOptions = PgResource.functionSourceOptions(
        messageSourceOptions,
        {
          name: "featured_messages",
          source: (...args) =>
            sql`app_public.featured_messages(${sqlFromArgDigests(args)})`,
          returnsSetof: true,
          returnsArray: false,
          parameters: [],
        },
      );

      const forumsFeaturedMessagesSourceOptions =
        PgResource.functionSourceOptions(messageSourceOptions, {
          name: "forums_featured_messages",
          source: (...args) =>
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

      const randomUserArraySourceOptions = PgResource.functionSourceOptions(
        userSourceOptions,
        {
          name: "random_user_array",
          source: (...args) =>
            sql`app_public.random_user_array(${sqlFromArgDigests(args)})`,
          returnsArray: true,
          returnsSetof: false,
          parameters: [],
        },
      );

      const randomUserArraySetSourceOptions = PgResource.functionSourceOptions(
        userSourceOptions,
        {
          name: "random_user_array_set",
          source: (...args) =>
            sql`app_public.random_user_array_set(${sqlFromArgDigests(args)})`,
          returnsSetof: true,
          returnsArray: true,
          parameters: [],
        },
      );

      const forumsMessagesListSetSourceOptions =
        PgResource.functionSourceOptions(messageSourceOptions, {
          name: "forums_messages_list_set",
          source: (...args) =>
            sql`app_public.forums_messages_list_set(${sqlFromArgDigests(
              args,
            )})`,
          parameters: [],
          returnsArray: true,
          returnsSetof: true,
          extensions: {
            tags: {
              name: "messagesListSet",
            },
          },
        });

      const unionEntityCodec = recordCodec({
        name: "union__entity",
        identifier: sql`interfaces_and_unions.union__entity`,
        columns: {
          person_id: col({ codec: TYPES.int, notNull: false }),
          post_id: col({ codec: TYPES.int, notNull: false }),
          comment_id: col({ codec: TYPES.int, notNull: false }),
        },
      });

      const personBookmarksCodec = recordCodec({
        name: "person_bookmarks",
        identifier: sql`interfaces_and_unions.person_bookmarks`,
        columns: {
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

      const personBookmarksSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: personBookmarksCodec,
        source: sql`interfaces_and_unions.person_bookmarks`,
        name: "person_bookmarks",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const personCodec = recordCodec({
        name: "people",
        identifier: sql`interfaces_and_unions.people`,
        columns: {
          person_id: col({ codec: TYPES.int, notNull: true }),
          username: col({ codec: TYPES.text, notNull: true }),
        },
      });

      const personSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: personCodec,
        source: sql`interfaces_and_unions.people`,
        name: "people",
        uniques: [
          { columns: ["person_id"], isPrimary: true },
          { columns: ["username"] },
        ],
      });

      const postCodec = recordCodec({
        name: "posts",
        identifier: sql`interfaces_and_unions.posts`,
        columns: {
          post_id: col({ codec: TYPES.int, notNull: true }),
          author_id: col({
            codec: TYPES.int,
            notNull: true,
            identicalVia: { relation: "author", attribute: "person_id" },
          }),
          body: col({ codec: TYPES.text, notNull: true }),
        },
      });

      const postSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: postCodec,
        source: sql`interfaces_and_unions.posts`,
        name: "posts",
        uniques: [{ columns: ["post_id"], isPrimary: true }],
      });

      const commentCodec = recordCodec({
        name: "comments",
        identifier: sql`interfaces_and_unions.comments`,
        columns: {
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

      const commentSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: commentCodec,
        source: sql`interfaces_and_unions.comments`,
        name: "comments",
        uniques: [{ columns: ["comment_id"], isPrimary: true }],
      });

      const itemTypeEnumCodec = enumCodec({
        name: "item_type",
        identifier: sql`interfaces_and_unions.item_type`,
        values: ["TOPIC", "POST", "DIVIDER", "CHECKLIST", "CHECKLIST_ITEM"],
      });

      const enumTableItemTypeCodec = recordCodec({
        name: "enum_table_item_type",
        identifier: sql`interfaces_and_unions.enum_table_item_type`,
        columns: {
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

      const enumTableItemTypeSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: enumTableItemTypeCodec,
        source: sql`interfaces_and_unions.enum_table_item_type`,
        name: "enum_table_item_type",
        uniques: [{ columns: ["type"], isPrimary: true }],
      });

      const enumTableItemTypeEnumCodec = enumCodec({
        name: "text",
        identifier: sql`text`,
        values: ["TOPIC", "POST", "DIVIDER", "CHECKLIST", "CHECKLIST_ITEM"],
      });

      const singleTableItemsCodec = recordCodec({
        name: "single_table_items",
        identifier: sql`interfaces_and_unions.single_table_items`,
        columns: {
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

      const singleTableItemsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: singleTableItemsCodec,
        source: sql`interfaces_and_unions.single_table_items`,
        name: "single_table_items",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const relationalItemsCodec = recordCodec({
        name: "relational_items",
        identifier: sql`interfaces_and_unions.relational_items`,
        columns: {
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

      const relationalItemsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: relationalItemsCodec,
        source: sql`interfaces_and_unions.relational_items`,
        name: "relational_items",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const relationalCommentableCodec = recordCodec({
        name: "relational_commentables",
        identifier: sql`interfaces_and_unions.relational_commentables`,
        columns: {
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

      const relationalCommentableSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: relationalCommentableCodec,
        source: sql`interfaces_and_unions.relational_commentables`,
        name: "relational_commentables",
      });

      const itemColumns = {
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
        name: "relational_topics",
        identifier: sql`interfaces_and_unions.relational_topics`,
        columns: {
          ...itemColumns,
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalTopicsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: relationalTopicsCodec,
        source: sql`interfaces_and_unions.relational_topics`,
        name: "relational_topics",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const relationalPostsCodec = recordCodec({
        name: "relational_posts",
        identifier: sql`interfaces_and_unions.relational_posts`,
        columns: {
          ...itemColumns,
          title: col({ codec: TYPES.text, notNull: false }),
          description: col({ codec: TYPES.text, notNull: false }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalPostsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: relationalPostsCodec,
        source: sql`interfaces_and_unions.relational_posts`,
        name: "relational_posts",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const relationalDividersCodec = recordCodec({
        name: "relational_dividers",
        identifier: sql`interfaces_and_unions.relational_dividers`,
        columns: {
          ...itemColumns,
          title: col({ codec: TYPES.text, notNull: false }),
          color: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalDividersSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: relationalDividersCodec,
        source: sql`interfaces_and_unions.relational_dividers`,
        name: "relational_dividers",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const relationalChecklistsCodec = recordCodec({
        name: "relational_checklists",
        identifier: sql`interfaces_and_unions.relational_checklists`,
        columns: {
          ...itemColumns,
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalChecklistsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: relationalChecklistsCodec,
        source: sql`interfaces_and_unions.relational_checklists`,
        name: "relational_checklists",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const relationalChecklistItemsCodec = recordCodec({
        name: "relational_checklist_items",
        identifier: sql`interfaces_and_unions.relational_checklist_items`,
        columns: {
          ...itemColumns,
          description: col({ codec: TYPES.text, notNull: true }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const relationalChecklistItemsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: relationalChecklistItemsCodec,
        source: sql`interfaces_and_unions.relational_checklist_items`,
        name: "relational_checklist_items",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      ////////////////////////////////////////

      const unionItemsCodec = recordCodec({
        name: "union_items",
        identifier: sql`interfaces_and_unions.union_items`,
        columns: {
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

      const unionItemsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: unionItemsCodec,
        source: sql`interfaces_and_unions.union_items`,
        name: "union_items",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const unionTopicsCodec = recordCodec({
        name: "union_topics",
        identifier: sql`interfaces_and_unions.union_topics`,
        columns: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionTopicsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: unionTopicsCodec,
        source: sql`interfaces_and_unions.union_topics`,
        name: "union_topics",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const unionPostsCodec = recordCodec({
        name: "union_posts",
        identifier: sql`interfaces_and_unions.union_posts`,
        columns: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
          description: col({ codec: TYPES.text, notNull: false }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionPostsSource = makePgResourceOptions({
        executor,
        selectAuth,
        codec: unionPostsCodec,
        source: sql`interfaces_and_unions.union_posts`,
        name: "union_posts",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const unionDividersCodec = recordCodec({
        name: "union_dividers",
        identifier: sql`interfaces_and_unions.union_dividers`,
        columns: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
          color: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionDividersSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: unionDividersCodec,
        source: sql`interfaces_and_unions.union_dividers`,
        name: "union_dividers",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const unionChecklistsCodec = recordCodec({
        name: "union_checklists",
        identifier: sql`interfaces_and_unions.union_checklists`,
        columns: {
          id: col({ codec: TYPES.int, notNull: true }),
          title: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionChecklistsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: unionChecklistsCodec,
        source: sql`interfaces_and_unions.union_checklists`,
        name: "union_checklists",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const unionChecklistItemsCodec = recordCodec({
        name: "union_checklist_items",
        identifier: sql`interfaces_and_unions.union_checklist_items`,
        columns: {
          id: col({ codec: TYPES.int, notNull: true }),
          description: col({ codec: TYPES.text, notNull: true }),
          note: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const unionChecklistItemsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: unionChecklistItemsCodec,
        source: sql`interfaces_and_unions.union_checklist_items`,
        name: "union_checklist_items",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const unionEntitySourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: unionEntityCodec,
        source: sql`(select null::interfaces_and_unions.union__entity)`,
        name: "union__entity",
      });

      const entitySearchSourceOptions = PgResource.functionSourceOptions(
        unionEntitySourceOptions,
        {
          source: (...args) =>
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
        name: "aws_applications",
        identifier: sql`interfaces_and_unions.aws_applications`,
        columns: {
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

      const awsApplicationsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: awsApplicationsCodec,
        source: sql`interfaces_and_unions.aws_applications`,
        name: "aws_applications",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const gcpApplicationsCodec = recordCodec({
        name: "gcp_applications",
        identifier: sql`interfaces_and_unions.gcp_applications`,
        columns: {
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

      const gcpApplicationsSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: gcpApplicationsCodec,
        source: sql`interfaces_and_unions.gcp_applications`,
        name: "gcp_applications",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const firstPartyVulnerabilitiesCodec = recordCodec({
        name: "first_party_vulnerabilities",
        identifier: sql`interfaces_and_unions.first_party_vulnerabilities`,
        columns: {
          id: col({ codec: TYPES.int, notNull: true }),
          name: col({
            codec: TYPES.text,
            notNull: true,
          }),
          cvss_score: col({ codec: TYPES.float, notNull: true }),
          team_name: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const firstPartyVulnerabilitiesSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: firstPartyVulnerabilitiesCodec,
        source: sql`interfaces_and_unions.first_party_vulnerabilities`,
        name: "first_party_vulnerabilities",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      const thirdPartyVulnerabilitiesCodec = recordCodec({
        name: "third_party_vulnerabilities",
        identifier: sql`interfaces_and_unions.third_party_vulnerabilities`,
        columns: {
          id: col({ codec: TYPES.int, notNull: true }),
          name: col({
            codec: TYPES.text,
            notNull: true,
          }),
          cvss_score: col({ codec: TYPES.float, notNull: true }),
          vendor_name: col({ codec: TYPES.text, notNull: false }),
        },
      });

      const thirdPartyVulnerabilitiesSourceOptions = makePgResourceOptions({
        executor,
        selectAuth,
        codec: thirdPartyVulnerabilitiesCodec,
        source: sql`interfaces_and_unions.third_party_vulnerabilities`,
        name: "third_party_vulnerabilities",
        uniques: [{ columns: ["id"], isPrimary: true }],
      });

      return makeRegistryBuilder()
        .addCodec(forumCodec)
        .addCodec(userCodec)
        .addCodec(messagesCodec)
        .addSource(uniqueAuthorCountSourceOptions)
        .addSource(forumNamesArraySourceOptions)
        .addSource(forumNamesCasesSourceOptions)
        .addSource(forumsUniqueAuthorCountSourceOptions)
        .addSource(scalarTextSourceOptions)
        .addSource(messageSourceOptions)
        .addSource(userSourceOptions)
        .addSource(forumSourceOptions)
        .addSource(usersMostRecentForumSourceOptions)
        .addSource(featuredMessagesSourceOptions)
        .addSource(forumsFeaturedMessagesSourceOptions)
        .addSource(randomUserArraySourceOptions)
        .addSource(randomUserArraySetSourceOptions)
        .addSource(forumsMessagesListSetSourceOptions)
        .addCodec(unionEntityCodec)
        .addCodec(personBookmarksCodec)
        .addSource(personBookmarksSourceOptions)
        .addCodec(personCodec)
        .addSource(personSourceOptions)
        .addCodec(postCodec)
        .addSource(postSourceOptions)
        .addCodec(commentCodec)
        .addSource(commentSourceOptions)
        .addCodec(itemTypeEnumCodec)
        .addCodec(enumTableItemTypeCodec)
        .addSource(enumTableItemTypeSourceOptions)
        .addCodec(enumTableItemTypeEnumCodec)
        .addCodec(singleTableItemsCodec)
        .addSource(singleTableItemsSourceOptions)
        .addCodec(relationalItemsCodec)
        .addSource(relationalItemsSourceOptions)
        .addCodec(relationalCommentableCodec)
        .addSource(relationalCommentableSourceOptions)
        .addCodec(relationalTopicsCodec)
        .addSource(relationalTopicsSourceOptions)
        .addCodec(relationalPostsCodec)
        .addSource(relationalPostsSourceOptions)
        .addCodec(relationalDividersCodec)
        .addSource(relationalDividersSourceOptions)
        .addCodec(relationalChecklistsCodec)
        .addSource(relationalChecklistsSourceOptions)
        .addCodec(relationalChecklistItemsCodec)
        .addSource(relationalChecklistItemsSourceOptions)
        .addCodec(unionItemsCodec)
        .addSource(unionItemsSourceOptions)
        .addCodec(unionTopicsCodec)
        .addSource(unionTopicsSourceOptions)
        .addCodec(unionPostsCodec)
        .addSource(unionPostsSource)
        .addCodec(unionDividersCodec)
        .addSource(unionDividersSourceOptions)
        .addCodec(unionChecklistsCodec)
        .addSource(unionChecklistsSourceOptions)
        .addCodec(unionChecklistItemsCodec)
        .addSource(unionChecklistItemsSourceOptions)
        .addSource(unionEntitySourceOptions)
        .addSource(entitySearchSourceOptions)
        .addCodec(awsApplicationsCodec)
        .addSource(awsApplicationsSourceOptions)
        .addCodec(gcpApplicationsCodec)
        .addSource(gcpApplicationsSourceOptions)
        .addCodec(firstPartyVulnerabilitiesCodec)
        .addSource(firstPartyVulnerabilitiesSourceOptions)
        .addCodec(thirdPartyVulnerabilitiesCodec)
        .addSource(thirdPartyVulnerabilitiesSourceOptions)
        .addRelation(messagesCodec, "author", userSourceOptions, {
          localColumns: [`author_id`],
          remoteColumns: [`id`],
          isUnique: true,
        })
        .addRelation(messagesCodec, "forum", forumSourceOptions, {
          localColumns: ["forum_id"],
          remoteColumns: ["id"],
          isUnique: true,
        })
        .addRelation(
          personBookmarksSourceOptions.codec,
          "person",
          personSourceOptions,
          {
            isUnique: true,
            localColumns: ["person_id"],
            remoteColumns: ["person_id"],
          },
        )
        .addRelation(
          personCodec,
          "singleTableItems",
          singleTableItemsSourceOptions,
          {
            isUnique: false,
            localColumns: ["person_id"],
            remoteColumns: ["author_id"],
          },
        )
        .addRelation(personCodec, "posts", postSourceOptions, {
          isUnique: false,
          localColumns: ["person_id"],
          remoteColumns: ["author_id"],
        })
        .addRelation(personCodec, "comments", postSourceOptions, {
          isUnique: false,
          localColumns: ["person_id"],
          remoteColumns: ["author_id"],
        })
        .addRelation(
          personCodec,
          "personBookmarks",
          personBookmarksSourceOptions,
          {
            isUnique: false,
            localColumns: ["person_id"],
            remoteColumns: ["person_id"],
          },
        )
        .addRelation(postCodec, "author", personSourceOptions, {
          isUnique: true,
          localColumns: ["author_id"],
          remoteColumns: ["person_id"],
        })
        .addRelation(postCodec, "comments", commentSourceOptions, {
          isUnique: false,
          localColumns: ["post_id"],
          remoteColumns: ["post_id"],
        })
        .addRelation(commentCodec, "author", personSourceOptions, {
          isUnique: true,
          localColumns: ["author_id"],
          remoteColumns: ["person_id"],
        })
        .addRelation(commentCodec, "post", postSourceOptions, {
          isUnique: true,
          localColumns: ["post_id"],
          remoteColumns: ["post_id"],
        })
        .addRelation(
          singleTableItemsCodec,
          "parent",
          singleTableItemsSourceOptions,
          {
            isUnique: true,
            localColumns: ["parent_id"],
            remoteColumns: ["id"],
          },
        )
        .addRelation(
          singleTableItemsCodec,
          "children",
          singleTableItemsSourceOptions,
          {
            isUnique: false,
            localColumns: ["id"],
            remoteColumns: ["parent_id"],
          },
        )
        .addRelation(singleTableItemsCodec, "author", personSourceOptions, {
          isUnique: true,
          localColumns: ["author_id"],
          remoteColumns: ["person_id"],
        })

        .addRelation(
          relationalTopicsCodec,
          "item",
          relationalItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalTopicsCodec,
          "parent",
          relationalItemsSourceOptions,
          {
            localColumns: [`parent_id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(relationalTopicsCodec, "author", personSourceOptions, {
          localColumns: [`author_id`] as const,
          remoteColumns: [`person_id`] as const,
          isUnique: true,
        })

        .addRelation(
          relationalPostsCodec,
          "item",
          relationalItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalPostsCodec,
          "parent",
          relationalItemsSourceOptions,
          {
            localColumns: [`parent_id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(relationalPostsCodec, "author", personSourceOptions, {
          localColumns: [`author_id`] as const,
          remoteColumns: [`person_id`] as const,
          isUnique: true,
        })
        .addRelation(
          relationalPostsCodec,
          "commentable",
          relationalCommentableSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )

        .addRelation(
          relationalDividersCodec,
          "item",
          relationalItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalDividersCodec,
          "parent",
          relationalItemsSourceOptions,
          {
            localColumns: [`parent_id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(relationalDividersCodec, "author", personSourceOptions, {
          localColumns: [`author_id`] as const,
          remoteColumns: [`person_id`] as const,
          isUnique: true,
        })
        .addRelation(
          relationalChecklistsCodec,
          "item",
          relationalItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistsCodec,
          "parent",
          relationalItemsSourceOptions,
          {
            localColumns: [`parent_id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(relationalChecklistsCodec, "author", personSourceOptions, {
          localColumns: [`author_id`] as const,
          remoteColumns: [`person_id`] as const,
          isUnique: true,
        })
        .addRelation(
          relationalChecklistsCodec,
          "commentable",
          relationalCommentableSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "item",
          relationalItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "parent",
          relationalItemsSourceOptions,
          {
            localColumns: [`parent_id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "author",
          personSourceOptions,
          {
            localColumns: [`author_id`] as const,
            remoteColumns: [`person_id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          relationalChecklistItemsCodec,
          "commentable",
          relationalCommentableSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )

        .addRelation(
          relationalItemsCodec,
          "parent",
          relationalItemsSourceOptions,
          {
            isUnique: true,
            localColumns: ["parent_id"] as const,
            remoteColumns: ["id"] as const,
          },
        )
        .addRelation(
          relationalItemsCodec,
          "children",
          relationalItemsSourceOptions,
          {
            isUnique: false,
            localColumns: ["id"] as const,
            remoteColumns: ["parent_id"] as const,
          },
        )
        .addRelation(relationalItemsCodec, "author", personSourceOptions, {
          isUnique: true,
          localColumns: ["author_id"] as const,
          remoteColumns: ["person_id"] as const,
        })
        .addRelation(
          relationalItemsCodec,
          "topic",
          relationalTopicsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "post",
          relationalPostsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "divider",
          relationalDividersSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "checklist",
          relationalChecklistsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalItemsCodec,
          "checklistItem",
          relationalChecklistItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )

        .addRelation(
          relationalCommentableCodec,
          "post",
          relationalPostsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalCommentableCodec,
          "checklist",
          relationalChecklistsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )
        .addRelation(
          relationalCommentableCodec,
          "checklistItem",
          relationalChecklistItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
            // reciprocal: 'item',
          },
        )

        .addRelation(unionItemsCodec, "topic", unionTopicsSourceOptions, {
          localColumns: [`id`] as const,
          remoteColumns: [`id`] as const,
          isUnique: true,
        })
        .addRelation(unionItemsCodec, "post", unionPostsSource, {
          localColumns: [`id`] as const,
          remoteColumns: [`id`] as const,
          isUnique: true,
        })
        .addRelation(unionItemsCodec, "divider", unionDividersSourceOptions, {
          localColumns: [`id`] as const,
          remoteColumns: [`id`] as const,
          isUnique: true,
        })
        .addRelation(
          unionItemsCodec,
          "checklist",
          unionChecklistsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
            isUnique: true,
          },
        )
        .addRelation(
          unionItemsCodec,
          "checklistItem",
          unionChecklistItemsSourceOptions,
          {
            localColumns: [`id`] as const,
            remoteColumns: [`id`] as const,
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
      makePgResourceOptions,
      makeRegistryBuilder,
      recordCodec,
      selectAuth,
      sql,
      sqlFromArgDigests,
    ],
  );

  const registry = EXPORTABLE(
    (makeRegistry, registryConfig) => makeRegistry(registryConfig),
    [makeRegistry, registryConfig],
  );

  /*
  registry.pgCodecs.messages.columns.id;
  registry.pgCodecs.forums.columns;
  registry.pgSources.messages.getRelations();
  registry.pgSources.messages.getRelation("author").localColumns;
  registry.pgRelations.messages.author.localColumns;

  type Bar = GetPgRegistryCodecs<typeof registry>[keyof GetPgRegistryCodecs<
    typeof registry
  >];
  type Foo = GetPgRegistryCodecRelations<
    typeof registry,
    typeof registry.pgSources.messages.codec
  >;

  type BBB = typeof registry.pgSources.messages.codec;
  type Baz = BBB extends PgCodec<infer UName, any, any, any, any, any, any>
    ? typeof registry extends PgRegistry<any, any, infer URelations>
      ? URelations[UName]
      : never
    : never;
  type CCC = typeof registry extends PgRegistry<any, any, infer URelations>
    ? URelations
    : never;
  type DDD = typeof registry.pgRelations
*/

  const deoptimizeIfAppropriate = EXPORTABLE(
    (__ListTransformStep, options) =>
      <
        TStep extends
          | PgSelectStep<any>
          | PgSelectSingleStep<any>
          | PgClassExpressionStep<any, any>
          | __ListTransformStep<PgSelectStep<any>, any, any, any>
          | ExecutableStep<any>,
      >(
        step: TStep,
      ): TStep => {
        if (options.deoptimize) {
          const innerPlan =
            step instanceof __ListTransformStep
              ? step.getListStep()
              : (step as PgSelectStep<any> | PgSelectSingleStep<any>);
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
  type PgConnectionPlanFromSource<
    TSource extends PgResource<any, any, any, any, any>,
  > = ConnectionStep<
    PgSelectSingleStep<TSource>,
    PgSelectParsedCursorStep,
    PgSelectStep<TSource>,
    PgSelectSingleStep<TSource>
  >;

  const {
    pgCodecs: {
      union__entity: unionEntityCodec,
      relational_items: relationalItemsCodec,
    },
    pgSources: {
      messages: messageSource,
      users: userSource,
      forums: forumSource,
      people: personSource,
      person_bookmarks: personBookmarksSource,
      posts: postSource,
      comments: commentSource,
      single_table_items: singleTableItemsSource,
      relational_items: relationalItemsSource,
      relational_topics: relationalTopicsSource,
      relational_posts: relationalPostsSource,
      relational_dividers: relationalDividersSource,
      relational_checklists: relationalChecklistsSource,
      relational_checklist_items: relationalChecklistItemsSource,
      union_items: unionItemsSource,
      union_topics: unionTopicsSource,
      union_posts: unionPostsSource,
      union_dividers: unionDividersSource,
      union_checklists: unionChecklistsSource,
      union_checklist_items: unionChecklistItemsSource,
      relational_commentables: relationalCommentableSource,
      users_most_recent_forum: usersMostRecentForumSource,
      forums_unique_author_count: forumsUniqueAuthorCountSource,
      forums_featured_messages: forumsFeaturedMessagesSource,
      forums_messages_list_set: forumsMessagesListSetSource,
      text: scalarTextSource,
      unique_author_count: uniqueAuthorCountSource,
      forum_names_array: forumNamesArraySource,
      forum_names_cases: forumNamesCasesSource,
      random_user_array: randomUserArraySource,
      random_user_array_set: randomUserArraySetSource,
      featured_messages: featuredMessagesSource,
      entity_search: entitySearchSource,
      first_party_vulnerabilities: firstPartyVulnerabilitiesSource,
      third_party_vulnerabilities: thirdPartyVulnerabilitiesSource,
    },
  } = registry;

  // type MessagesStep = PgSelectStep<typeof messageSource>;
  type MessageConnectionStep = PgConnectionPlanFromSource<typeof messageSource>;
  type MessageStep = PgSelectSingleStep<typeof messageSource>;
  // type UsersStep = PgSelectStep<typeof userSource>;
  type UserStep = PgSelectSingleStep<typeof userSource>;
  // type ForumsStep = PgSelectStep<typeof forumSource>;
  type ForumStep = PgSelectSingleStep<typeof forumSource>;
  type PersonStep = PgSelectSingleStep<typeof personSource>;
  type PersonBookmarkStep = PgSelectSingleStep<typeof personBookmarksSource>;
  type PostStep = PgSelectSingleStep<typeof postSource>;
  type CommentStep = PgSelectSingleStep<typeof commentSource>;
  type SingleTableItemsStep = PgSelectStep<typeof singleTableItemsSource>;
  type SingleTableItemStep = PgSelectSingleStep<typeof singleTableItemsSource>;
  type RelationalItemsStep = PgSelectStep<typeof relationalItemsSource>;
  type RelationalItemStep = PgSelectSingleStep<typeof relationalItemsSource>;
  type RelationalTopicStep = PgSelectSingleStep<typeof relationalTopicsSource>;
  type RelationalPostStep = PgSelectSingleStep<typeof relationalPostsSource>;
  type RelationalDividerStep = PgSelectSingleStep<
    typeof relationalDividersSource
  >;
  type RelationalChecklistStep = PgSelectSingleStep<
    typeof relationalChecklistsSource
  >;
  type RelationalChecklistItemStep = PgSelectSingleStep<
    typeof relationalChecklistItemsSource
  >;
  type UnionItemsStep = PgSelectStep<typeof unionItemsSource>;
  type UnionItemStep = PgSelectSingleStep<typeof unionItemsSource>;
  type UnionTopicStep = PgSelectSingleStep<typeof unionTopicsSource>;
  type UnionPostStep = PgSelectSingleStep<typeof unionPostsSource>;
  type UnionDividerStep = PgSelectSingleStep<typeof unionDividersSource>;
  type UnionChecklistStep = PgSelectSingleStep<typeof unionChecklistsSource>;
  type UnionChecklistItemStep = PgSelectSingleStep<
    typeof unionChecklistItemsSource
  >;
  type RelationalCommentablesStep = PgSelectStep<
    typeof relationalCommentableSource
  >;
  type RelationalCommentableStep = PgSelectSingleStep<
    typeof relationalCommentableSource
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
    TMyDataSource extends PgResource<any, any, any, any, any>,
    TAttrName extends TMyDataSource extends PgResource<
      any,
      PgCodec<any, infer UColumns, any, any, any, any, any>,
      any,
      any,
      any
    >
      ? keyof UColumns
      : never,
  >(attrName: TAttrName, type: GraphQLOutputType) {
    return {
      type,
      plan: EXPORTABLE(
        (attrName) =>
          function plan($entity: PgSelectSingleStep<TMyDataSource>) {
            return $entity.get(attrName);
          },
        [attrName],
      ),
    };
  }

  function singleRelationField<
    TMyDataSource extends PgResource<any, any, any, any, any>,
    TRelationName extends TMyDataSource extends PgResource<
      any,
      PgCodec<infer UCodecName, any, any, any, any, any, any>,
      any,
      any,
      any
    >
      ? keyof (typeof registry.pgRelations)[UCodecName &
          keyof typeof registry.pgRelations]
      : never,
  >(relation: TRelationName, type: GraphQLOutputType) {
    return {
      type,
      plan: EXPORTABLE(
        (deoptimizeIfAppropriate, relation) =>
          function plan($entity: PgSelectSingleStep<TMyDataSource>) {
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

  const User = newObjectTypeBuilder<OurGraphQLContext, UserStep>(
    PgSelectSingleStep,
  )({
    name: "User",
    fields: () => ({
      username: attrField("username", GraphQLString),
      gravatarUrl: attrField("gravatar_url", GraphQLString),
      mostRecentForum: {
        type: Forum,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, usersMostRecentForumSource) => ($user) => {
            const $forum = usersMostRecentForumSource.execute([
              { step: $user.record() },
            ]) as PgSelectStep<typeof forumSource>;
            deoptimizeIfAppropriate($forum);
            return $forum;
          },
          [deoptimizeIfAppropriate, usersMostRecentForumSource],
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
          graphile: {
            applyPlan: EXPORTABLE(
              (TYPES, sql) => (step: PgSelectStep<typeof messageSource>) => {
                step.orderBy({
                  codec: TYPES.text,
                  fragment: sql`${step.alias}.body`,
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
          graphile: {
            applyPlan: EXPORTABLE(
              (TYPES, sql) => (step: PgSelectStep<typeof messageSource>) => {
                step.orderBy({
                  codec: TYPES.text,
                  fragment: sql`${step.alias}.body`,
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
          graphile: {
            applyPlan: EXPORTABLE(
              (TYPES, sql) => (step: PgSelectStep<typeof messageSource>) => {
                const authorAlias = step.singleRelation("author");
                step.orderBy({
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
          graphile: {
            applyPlan: EXPORTABLE(
              (TYPES, sql) => (step: PgSelectStep<typeof messageSource>) => {
                const authorAlias = step.singleRelation("author");
                step.orderBy({
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
  const Message = newObjectTypeBuilder<OurGraphQLContext, MessageStep>(
    PgSelectSingleStep,
  )({
    name: "Message",
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

  const MessageEdge = newObjectTypeBuilder<OurGraphQLContext, MessageStep>(
    PgSelectSingleStep,
  )({
    name: "MessageEdge",
    fields: {
      cursor: {
        type: GraphQLString,
        plan: EXPORTABLE(
          () =>
            function plan($node) {
              return $node.cursor();
            },
          [],
        ),
      },
      node: {
        type: Message,
        plan: EXPORTABLE(
          () =>
            function plan($node) {
              return $node;
            },
          [],
        ),
      },
    },
  });

  const PageInfo = newObjectTypeBuilder<OurGraphQLContext, PgPageInfoStep<any>>(
    PgPageInfoStep,
  )({
    name: "PageInfo",
    fields: {
      hasNextPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.hasNextPage(), []),
      },
      hasPreviousPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.hasPreviousPage(), []),
      },
      startCursor: {
        type: GraphQLString,
        plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.startCursor(), []),
      },
      endCursor: {
        type: GraphQLString,
        plan: EXPORTABLE(() => ($pageInfo) => $pageInfo.endCursor(), []),
      },
    },
  });

  const MessagesConnection = newObjectTypeBuilder<
    OurGraphQLContext,
    MessageConnectionStep
  >(ConnectionStep)({
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
      nodes: newGraphileFieldConfigBuilder<
        OurGraphQLContext,
        MessageConnectionStep
      >()({
        type: new GraphQLList(Message),
        plan: EXPORTABLE(
          () =>
            function plan($connection) {
              return $connection.nodes() as any;
            },
          [],
        ),
      }),
      pageInfo: newGraphileFieldConfigBuilder<
        OurGraphQLContext,
        MessageConnectionStep
      >()({
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
              .select(sql`count(*)`, TYPES.bigint),
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
  ): GraphileArgumentConfig<any, any, any, any, any, any> {
    return {
      type: IncludeArchived,
      applyPlan: EXPORTABLE(
        (PgSelectSingleStep, TYPES, getClassStep, sql) =>
          function plan($parent: ExecutableStep<any>, $field: TFieldStep, val) {
            const $messages = getClassStep($field);
            const $value = val.getRaw() as
              | __InputStaticLeafStep
              | __TrackedObjectStep;
            if ($value.evalIs("YES")) {
              // No restriction
            } else if ($value.evalIs("EXCLUSIVELY")) {
              $messages.where(sql`${$messages.alias}.archived_at is not null`);
            } else if (
              $value.evalIs("INHERIT") &&
              // INHERIT only works if the parent has an archived_at column.
              $parent instanceof PgSelectSingleStep &&
              !!$parent.source.codec.columns.archived_at
            ) {
              $messages.where(
                sql`(${
                  $messages.alias
                }.archived_at is null) = (${$messages.placeholder(
                  $parent.get("archived_at"),
                  TYPES.timestamptz,
                )} is null)`,
              );
            } else {
              $messages.where(sql`${$messages.alias}.archived_at is null`);
            }
          },
        [PgSelectSingleStep, TYPES, getClassStep, sql],
      ),
      defaultValue: "INHERIT",
    };
  }

  const MessageCondition = newInputObjectTypeBuilder<
    OurGraphQLContext,
    PgConditionStep<any>
  >()({
    name: "MessageCondition",
    fields: {
      featured: {
        type: GraphQLBoolean,
        applyPlan: EXPORTABLE(
          (TYPES, sql) =>
            function plan($condition: PgConditionStep<any>, val) {
              const $value = val.getRaw();
              if ($value.evalIs(null)) {
                $condition.where(sql`${$condition.alias}.featured is null`);
              } else {
                $condition.where(
                  sql`${$condition.alias}.featured = ${$condition.placeholder(
                    $value,
                    TYPES.boolean,
                  )}`,
                );
              }
            },
          [TYPES, sql],
        ),
      },
    },
  });

  const BooleanFilter = newInputObjectTypeBuilder<
    OurGraphQLContext,
    BooleanFilterStep
  >()({
    name: "BooleanFilter",
    fields: {
      equalTo: {
        type: GraphQLBoolean,
        applyPlan: EXPORTABLE(
          (TYPES, sql) =>
            function plan($parent, val) {
              const $value = val.getRaw();
              if ($value.evalIs(null)) {
                // Ignore
              } else {
                $parent.where(
                  sql`${$parent.expression} = ${$parent.placeholder(
                    $value,
                    TYPES.boolean,
                  )}`,
                );
              }
            },
          [TYPES, sql],
        ),
      },
      notEqualTo: {
        type: GraphQLBoolean,
        applyPlan: EXPORTABLE(
          (TYPES, sql) =>
            function plan($parent: BooleanFilterStep, val) {
              const $value = val.getRaw();
              if ($value.evalIs(null)) {
                // Ignore
              } else {
                $parent.where(
                  sql`${$parent.expression} <> ${$parent.placeholder(
                    $value,
                    TYPES.boolean,
                  )}`,
                );
              }
            },
          [TYPES, sql],
        ),
      },
    },
  });

  const MessageFilter = newInputObjectTypeBuilder<
    OurGraphQLContext,
    ClassFilterStep
  >()({
    name: "MessageFilter",
    fields: {
      featured: {
        type: BooleanFilter,
        applyPlan: EXPORTABLE(
          (BooleanFilterStep, sql) =>
            function plan($messageFilter, arg) {
              const $value = arg.getRaw();
              if ($value.evalIs(null)) {
                // Ignore
              } else {
                const plan = new BooleanFilterStep(
                  $messageFilter,
                  sql`${$messageFilter.alias}.featured`,
                );
                arg.apply(plan);
              }
            },
          [BooleanFilterStep, sql],
        ),
      },
    },
  });

  const ForumCondition = newInputObjectTypeBuilder<
    OurGraphQLContext,
    PgConditionStep<any>
  >()({
    name: "ForumCondition",
    fields: {
      name: {
        type: GraphQLString,
        applyPlan: EXPORTABLE(
          (TYPES, sql) =>
            function plan($condition: PgConditionStep<any>, arg) {
              const $value = arg.getRaw();
              if ($value.evalIs(null)) {
                $condition.where(sql`${$condition.alias}.name is null`);
              } else {
                $condition.where(
                  sql`${$condition.alias}.name = ${$condition.placeholder(
                    $value,
                    TYPES.text,
                  )}`,
                );
              }
            },
          [TYPES, sql],
        ),
      },
    },
  });

  const ForumToManyMessageFilter = newInputObjectTypeBuilder<
    OurGraphQLContext,
    ManyFilterStep<typeof messageSource>
  >()({
    name: "ForumToManyMessageFilter",
    fields: {
      some: {
        type: MessageFilter,
        applyPlan: EXPORTABLE(
          () =>
            function plan(
              $manyFilter: ManyFilterStep<typeof messageSource>,
              arg,
            ) {
              const $value = arg.getRaw();
              if (!$value.evalIs(null)) {
                const plan = $manyFilter.some();
                arg.apply(plan);
              }
            },
          [],
        ),
      },
    },
  });

  const ForumFilter = newInputObjectTypeBuilder<
    OurGraphQLContext,
    ClassFilterStep
  >()({
    name: "ForumFilter",
    fields: {
      messages: {
        type: ForumToManyMessageFilter,
        applyPlan: EXPORTABLE(
          (ManyFilterStep, messageSource) =>
            function plan($condition, arg) {
              const $value = arg.getRaw();
              if (!$value.evalIs(null)) {
                const plan = new ManyFilterStep(
                  $condition,
                  messageSource,
                  ["id"],
                  ["forum_id"],
                );
                arg.apply(plan);
              }
            },
          [ManyFilterStep, messageSource],
        ),
      },
    },
  });

  const Forum: GraphQLObjectType<any, OurGraphQLContext> = newObjectTypeBuilder<
    OurGraphQLContext,
    ForumStep
  >(PgSelectSingleStep)({
    name: "Forum",
    fields: () => ({
      id: attrField("id", GraphQLString),
      name: attrField("name", GraphQLString),

      // Expression column
      isArchived: attrField("is_archived", GraphQLBoolean),

      // Custom expression; actual column select shouldn't make it through to the generated query.
      archivedAtIsNotNull: {
        type: GraphQLBoolean,
        plan: EXPORTABLE(
          (TYPES, pgClassExpression) =>
            function plan($forum) {
              const $archivedAt = $forum.get("archived_at");
              const $expr1 = pgClassExpression(
                $forum,
                TYPES.boolean,
              )`${$archivedAt} is not null`;
              const $expr2 = pgClassExpression(
                $forum,
                TYPES.boolean,
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
      messagesList: {
        type: new GraphQLList(Message),
        args: {
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$forum: ForumStep,
                  $messages: PgSelectStep<typeof messageSource>,
                  arg,
                ) {
                  $messages.setFirst(arg.getRaw());
                  return null;
                },
              [],
            ),
          },
          condition: {
            type: MessageCondition,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$forum: ForumStep,
                  $messages: PgSelectStep<typeof messageSource>,
                ) {
                  return $messages.wherePlan();
                },
              [],
            ),
          },
          filter: {
            type: MessageFilter,
            applyPlan: EXPORTABLE(
              (ClassFilterStep) =>
                function plan(
                  _$forum: ForumStep,
                  $messages: PgSelectStep<typeof messageSource>,
                ) {
                  return new ClassFilterStep(
                    $messages.wherePlan(),
                    $messages.alias,
                  );
                },
              [ClassFilterStep],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            PgSelectStep<typeof messageSource>
          >(($messages) => $messages),
        },
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, messageSource) =>
            function plan($forum) {
              const $forumId = $forum.get("id");
              const $messages = messageSource.find({ forum_id: $forumId });
              deoptimizeIfAppropriate($messages);
              $messages.setTrusted();
              // $messages.leftJoin(...);
              // $messages.innerJoin(...);
              // $messages.relation('fk_messages_author_id')
              // $messages.where(...);
              // $messages.orderBy(...);
              return $messages;
            },
          [deoptimizeIfAppropriate, messageSource],
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setFirst(arg.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setLast(arg.getRaw());
                  return null;
                },
              [],
            ),
          },
          condition: {
            type: MessageCondition,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$forum,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                ) {
                  const $messages = $connection.getSubplan();
                  return $messages.wherePlan();
                },
              [],
            ),
          },
          filter: {
            type: MessageFilter,
            applyPlan: EXPORTABLE(
              (ClassFilterStep) =>
                function plan(
                  _$forum,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                ) {
                  const $messages = $connection.getSubplan();
                  return new ClassFilterStep(
                    $messages.wherePlan(),
                    $messages.alias,
                  );
                },
              [ClassFilterStep],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            PgConnectionPlanFromSource<typeof messageSource>
          >(($connection) => $connection.getSubplan()),
        },
        plan: EXPORTABLE(
          (connection, deoptimizeIfAppropriate, messageSource) =>
            function plan($forum) {
              const $messages = messageSource.find({
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
          [connection, deoptimizeIfAppropriate, messageSource],
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
          (TYPES, forumsUniqueAuthorCountSource) =>
            function plan($forum, args) {
              const $featured = args.get("featured");
              return forumsUniqueAuthorCountSource.execute([
                {
                  step: $forum.record(),
                },
                {
                  step: $featured,
                  pgCodec: TYPES.boolean,
                },
              ]);
            },
          [TYPES, forumsUniqueAuthorCountSource],
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
            userSource,
          ) =>
            function plan($forum) {
              const $user = pgSelect({
                source: userSource,
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
            userSource,
          ],
        ),
      },

      featuredMessages: {
        type: new GraphQLList(Message),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumsFeaturedMessagesSource) =>
            function plan($forum) {
              const $messages = forumsFeaturedMessagesSource.execute([
                {
                  step: $forum.record(),
                },
              ]);
              deoptimizeIfAppropriate($messages);
              return $messages;
            },
          [deoptimizeIfAppropriate, forumsFeaturedMessagesSource],
        ),
      },

      messagesListSet: {
        type: new GraphQLList(new GraphQLList(Message)),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumsMessagesListSetSource) =>
            function plan($forum) {
              const $partitionedMessages = forumsMessagesListSetSource.execute([
                {
                  step: $forum.record(),
                },
              ]);
              deoptimizeIfAppropriate($partitionedMessages);
              return $partitionedMessages;
            },
          [deoptimizeIfAppropriate, forumsMessagesListSetSource],
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
            list,
            messageSource,
          ) =>
            function plan($forum) {
              // This is a deliberately convoluted plan to ensure that multiple
              // filter plans work well together.

              // Load _all_ the messages from the DB.
              const $messages = messageSource.find();
              deoptimizeIfAppropriate($messages);

              // Filter messages to those _not_ in this forum
              const $messagesFromOtherForums = filter($messages, ($message) =>
                lambda(
                  list([$message.get("forum_id"), $forum.get("id")]),
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
            list,
            messageSource,
          ],
        ),
      },
    }),
  });

  const singleTableTypeNameCallback = EXPORTABLE(
    () => (v: string) => {
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
    },
    [],
  );

  const singleTableTypeName = EXPORTABLE(
    (lambda, singleTableTypeNameCallback) => ($entity: SingleTableItemStep) => {
      const $type = $entity.get("type");
      const $typeName = lambda($type, singleTableTypeNameCallback, true);
      return $typeName;
    },
    [lambda, singleTableTypeNameCallback],
  );

  const singleTableItemInterface = EXPORTABLE(
    (pgSingleTablePolymorphic, singleTableTypeName) =>
      ($item: SingleTableItemStep) =>
        pgSingleTablePolymorphic(singleTableTypeName($item), $item),
    [pgSingleTablePolymorphic, singleTableTypeName],
  );

  const relationalItemPolymorphicTypeMap = EXPORTABLE(
    (
      deoptimizeIfAppropriate,
    ): PgPolymorphicTypeMap<RelationalItemStep, string> => ({
      RelationalTopic: {
        match: (t) => t === "TOPIC",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("topic")),
      },
      RelationalPost: {
        match: (t) => t === "POST",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("post")),
      },
      RelationalDivider: {
        match: (t) => t === "DIVIDER",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("divider")),
      },
      RelationalChecklist: {
        match: (t) => t === "CHECKLIST",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("checklist")),
      },
      RelationalChecklistItem: {
        match: (t) => t === "CHECKLIST_ITEM",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("checklistItem")),
      },
    }),
    [deoptimizeIfAppropriate],
  );

  const relationalItemInterface = EXPORTABLE(
    (pgPolymorphic, relationalItemPolymorphicTypeMap) =>
      ($item: RelationalItemStep) =>
        pgPolymorphic(
          $item,
          $item.get("type"),
          relationalItemPolymorphicTypeMap,
        ),
    [pgPolymorphic, relationalItemPolymorphicTypeMap],
  );

  const unionItemPolymorphicTypeMap = EXPORTABLE(
    (deoptimizeIfAppropriate): PgPolymorphicTypeMap<UnionItemStep, string> => ({
      UnionTopic: {
        match: (t) => t === "TOPIC",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("topic")),
      },
      UnionPost: {
        match: (t) => t === "POST",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("post")),
      },
      UnionDivider: {
        match: (t) => t === "DIVIDER",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("divider")),
      },
      UnionChecklist: {
        match: (t) => t === "CHECKLIST",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("checklist")),
      },
      UnionChecklistItem: {
        match: (t) => t === "CHECKLIST_ITEM",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("checklistItem")),
      },
    }),
    [deoptimizeIfAppropriate],
  );

  const unionItemUnion = EXPORTABLE(
    (pgPolymorphic, unionItemPolymorphicTypeMap) => ($item: UnionItemStep) =>
      pgPolymorphic($item, $item.get("type"), unionItemPolymorphicTypeMap),
    [pgPolymorphic, unionItemPolymorphicTypeMap],
  );

  const relationalCommentablePolymorphicTypeMap = EXPORTABLE(
    (
      deoptimizeIfAppropriate,
    ): PgPolymorphicTypeMap<RelationalCommentableStep, string> => ({
      RelationalPost: {
        match: (t) => t === "POST",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("post")),
      },
      RelationalChecklist: {
        match: (t) => t === "CHECKLIST",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("checklist")),
      },
      RelationalChecklistItem: {
        match: (t) => t === "CHECKLIST_ITEM",
        plan: (_, $item) =>
          deoptimizeIfAppropriate($item.singleRelation("checklistItem")),
      },
    }),
    [deoptimizeIfAppropriate],
  );

  const relationalCommentableInterface = EXPORTABLE(
    (pgPolymorphic, relationalCommentablePolymorphicTypeMap) =>
      ($item: RelationalCommentableStep) =>
        pgPolymorphic(
          $item,
          $item.get("type"),
          relationalCommentablePolymorphicTypeMap,
        ),
    [pgPolymorphic, relationalCommentablePolymorphicTypeMap],
  );

  const entityPolymorphicTypeMap = EXPORTABLE(
    (
      commentSource,
      personSource,
      postSource,
    ): PgPolymorphicTypeMap<
      PgSelectSingleStep<any> | PgClassExpressionStep<PgCodecAny, any>,
      readonly number[],
      ListStep<readonly ExecutableStep<any>[]>
    > => ({
      Person: {
        match: (v) => v[0] != null,
        plan: ($list) => personSource.get({ person_id: $list.at(0) }),
      },
      Post: {
        match: (v) => v[1] != null,
        plan: ($list) => postSource.get({ post_id: $list.at(1) }),
      },
      Comment: {
        match: (v) => v[2] != null,
        plan: ($list) => commentSource.get({ comment_id: $list.at(2) }),
      },
    }),
    [commentSource, personSource, postSource],
  );

  /**
   * This makes a polymorphic plan that returns the "entity" represented by the
   * "interfaces_and_unions.union__entity" type in the database (a composite
   * type with an attribute that's a "foreign key" to each table that's
   * included in the union).
   *
   * i.e. if `$item.get('person_id')` is set, then it's a Person and we should
   * grab that person from the `personSource`. If `post_id` is set it's a Post,
   * and so on.
   */
  const entityUnion = EXPORTABLE(
    (PgSelectSingleStep, entityPolymorphicTypeMap, list, pgPolymorphic) =>
      <TCodec extends typeof unionEntityCodec>(
        $item:
          | PgSelectSingleStep<PgResource<any, TCodec, any, any, any>>
          | PgClassExpressionStep<TCodec, PgResource<any, any, any, any, any>>,
      ) =>
        pgPolymorphic(
          $item,
          list([
            // TODO: this ridiculous code is just to appease TypeScript; we should
            // be able to just `$item.get("person_id")`.
            $item instanceof PgSelectSingleStep
              ? $item.get("person_id")
              : $item.get("person_id"),
            $item instanceof PgSelectSingleStep
              ? $item.get("post_id")
              : $item.get("post_id"),
            $item instanceof PgSelectSingleStep
              ? $item.get("comment_id")
              : $item.get("comment_id"),
          ]),
          entityPolymorphicTypeMap,
        ),
    [PgSelectSingleStep, entityPolymorphicTypeMap, list, pgPolymorphic],
  );

  const PersonBookmark: GraphQLObjectType<any, OurGraphQLContext> =
    newObjectTypeBuilder<OurGraphQLContext, PersonBookmarkStep>(
      PgSelectSingleStep,
    )({
      name: "PersonBookmark",
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

  const Person: GraphQLObjectType<any, OurGraphQLContext> =
    newObjectTypeBuilder<OurGraphQLContext, PersonStep>(PgSelectSingleStep)({
      name: "Person",
      fields: () => ({
        personId: attrField("person_id", GraphQLInt),
        username: attrField("username", GraphQLString),
        singleTableItemsList: {
          type: new GraphQLList(SingleTableItem),
          plan: EXPORTABLE(
            (
              deoptimizeIfAppropriate,
              each,
              singleTableItemInterface,
              singleTableItemsSource,
            ) =>
              function plan($person) {
                const $personId = $person.get("person_id");
                const $items: SingleTableItemsStep =
                  singleTableItemsSource.find({
                    author_id: $personId,
                  });
                deoptimizeIfAppropriate($items);
                return each($items, singleTableItemInterface);
              },
            [
              deoptimizeIfAppropriate,
              each,
              singleTableItemInterface,
              singleTableItemsSource,
            ],
          ),
        },

        relationalItemsList: {
          type: new GraphQLList(RelationalItem),
          plan: EXPORTABLE(
            (
              deoptimizeIfAppropriate,
              each,
              relationalItemInterface,
              relationalItemsSource,
            ) =>
              function plan($person) {
                const $personId = $person.get("person_id");
                const $items: RelationalItemsStep = relationalItemsSource.find({
                  author_id: $personId,
                });
                deoptimizeIfAppropriate($items);
                return each($items, ($item) => relationalItemInterface($item));
              },
            [
              deoptimizeIfAppropriate,
              each,
              relationalItemInterface,
              relationalItemsSource,
            ],
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

  const Post: GraphQLObjectType<any, OurGraphQLContext> = newObjectTypeBuilder<
    OurGraphQLContext,
    PostStep
  >(PgSelectSingleStep)({
    name: "Post",
    fields: () => ({
      postId: attrField("post_id", GraphQLInt),
      body: attrField("body", GraphQLString),
      author: singleRelationField("author", Person),
    }),
  });

  const Comment: GraphQLObjectType<any, OurGraphQLContext> =
    newObjectTypeBuilder<OurGraphQLContext, CommentStep>(PgSelectSingleStep)({
      name: "Comment",
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
  });

  const commonSingleTableItemFields = {
    id: attrField("id", GraphQLInt),
    type: attrField("type", GraphQLString),
    type2: attrField("type2", EnumTableItemType),
    parent: {
      type: SingleTableItem,
      plan: EXPORTABLE(
        (deoptimizeIfAppropriate, singleTableItemInterface) =>
          function plan($entity) {
            const $plan = $entity.singleRelation("parent");
            deoptimizeIfAppropriate($plan);
            return singleTableItemInterface($plan);
          },
        [deoptimizeIfAppropriate, singleTableItemInterface],
      ),
    },
    author: singleRelationField("author", Person),
    position: attrField("position", GraphQLString),
    createdAt: attrField("created_at", GraphQLString),
    updatedAt: attrField("updated_at", GraphQLString),
    isExplicitlyArchived: attrField("is_explicitly_archived", GraphQLBoolean),
    archivedAt: attrField("archived_at", GraphQLString),
  } satisfies {
    [fieldName: string]: GraphileFieldConfig<
      any,
      any,
      PgSelectSingleStep<
        PgResource<
          any,
          PgCodec<
            any,
            typeof singleTableItemsSource.codec.columns,
            any,
            any,
            any,
            any,
            any
          >,
          any,
          any,
          any
        >
      >,
      any,
      any
    >;
  };

  const SingleTableTopic = newObjectTypeBuilder<
    OurGraphQLContext,
    SingleTableItemStep
  >(PgSelectSingleStep)({
    name: "SingleTableTopic",
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
    }),
  });

  const SingleTablePost = newObjectTypeBuilder<
    OurGraphQLContext,
    SingleTableItemStep
  >(PgSelectSingleStep)({
    name: "SingleTablePost",
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  const SingleTableDivider = newObjectTypeBuilder<
    OurGraphQLContext,
    SingleTableItemStep
  >(PgSelectSingleStep)({
    name: "SingleTableDivider",
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
      color: attrField("color", GraphQLString),
    }),
  });

  const SingleTableChecklist = newObjectTypeBuilder<
    OurGraphQLContext,
    SingleTableItemStep
  >(PgSelectSingleStep)({
    name: "SingleTableChecklist",
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      title: attrField("title", GraphQLString),
    }),
  });

  const SingleTableChecklistItem = newObjectTypeBuilder<
    OurGraphQLContext,
    SingleTableItemStep
  >(PgSelectSingleStep)({
    name: "SingleTableChecklistItem",
    interfaces: [SingleTableItem],
    fields: () => ({
      ...commonSingleTableItemFields,
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  ////////////////////////////////////////

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
    TColumns extends {
      [key in string]: key extends keyof typeof relationalItemsCodec.columns
        ? (typeof relationalItemsCodec.columns)[key]
        : any;
    },
  >() =>
    ({
      id: attrField("id", GraphQLInt),
      type: attrField("type", GraphQLString),
      type2: attrField("type2", EnumTableItemType),
      parent: {
        type: RelationalItem,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, relationalItemInterface) =>
            function plan($entity) {
              const $plan = $entity.singleRelation("parent");
              deoptimizeIfAppropriate($plan);
              return relationalItemInterface($plan);
            },
          [deoptimizeIfAppropriate, relationalItemInterface],
        ),
      },
      author: singleRelationField("author", Person),
      position: attrField("position", GraphQLString),
      createdAt: attrField("created_at", GraphQLString),
      updatedAt: attrField("updated_at", GraphQLString),
      isExplicitlyArchived: attrField("is_explicitly_archived", GraphQLBoolean),
      archivedAt: attrField("archived_at", GraphQLString),
    } satisfies {
      [fieldName: string]: GraphileFieldConfig<
        any,
        any,
        PgSelectSingleStep<
          PgResource<
            any,
            PgCodec<any, TColumns, any, any, any, any, any>,
            any,
            any,
            any
          >
        >,
        any,
        any
      >;
    });

  const RelationalTopic = newObjectTypeBuilder<
    OurGraphQLContext,
    RelationalTopicStep
  >(PgSelectSingleStep)({
    name: "RelationalTopic",
    interfaces: [RelationalItem],
    fields: () => ({
      ...commonRelationalItemFields<
        typeof relationalTopicsSource.codec.columns
      >(),
      title: attrField("title", GraphQLString),
    }),
  });

  const RelationalPost = newObjectTypeBuilder<
    OurGraphQLContext,
    RelationalPostStep
  >(PgSelectSingleStep)({
    name: "RelationalPost",
    interfaces: [RelationalItem, RelationalCommentable],
    fields: () => ({
      ...commonRelationalItemFields<
        typeof relationalPostsSource.codec.columns
      >(),
      title: attrField("title", GraphQLString),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),

      titleLower: {
        type: GraphQLString,
        plan: EXPORTABLE(
          (pgSelect, scalarTextSource, sql, sqlFromArgDigests) =>
            function plan($entity) {
              return pgSelect({
                source: scalarTextSource,
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
          [pgSelect, scalarTextSource, sql, sqlFromArgDigests],
        ),
      },
    }),
  });

  const RelationalDivider = newObjectTypeBuilder<
    OurGraphQLContext,
    RelationalDividerStep
  >(PgSelectSingleStep)({
    name: "RelationalDivider",
    interfaces: [RelationalItem],
    fields: () => ({
      ...commonRelationalItemFields<
        typeof relationalDividersSource.codec.columns
      >(),
      title: attrField("title", GraphQLString),
      color: attrField("color", GraphQLString),
    }),
  });

  const RelationalChecklist = newObjectTypeBuilder<
    OurGraphQLContext,
    RelationalChecklistStep
  >(PgSelectSingleStep)({
    name: "RelationalChecklist",
    interfaces: [RelationalItem, RelationalCommentable],
    fields: () => ({
      ...commonRelationalItemFields<
        typeof relationalChecklistsSource.codec.columns
      >(),
      title: attrField("title", GraphQLString),
    }),
  });

  const RelationalChecklistItem = newObjectTypeBuilder<
    OurGraphQLContext,
    RelationalChecklistItemStep
  >(PgSelectSingleStep)({
    name: "RelationalChecklistItem",
    interfaces: [RelationalItem, RelationalCommentable],
    fields: () => ({
      ...commonRelationalItemFields<
        typeof relationalChecklistItemsSource.codec.columns
      >(),
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
  });

  const UnionTopic = newObjectTypeBuilder<OurGraphQLContext, UnionTopicStep>(
    PgSelectSingleStep,
  )({
    name: "UnionTopic",
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
    }),
  });

  const UnionPost = newObjectTypeBuilder<OurGraphQLContext, UnionPostStep>(
    PgSelectSingleStep,
  )({
    name: "UnionPost",
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
      description: attrField("description", GraphQLString),
      note: attrField("note", GraphQLString),
    }),
  });

  const UnionDivider = newObjectTypeBuilder<
    OurGraphQLContext,
    UnionDividerStep
  >(PgSelectSingleStep)({
    name: "UnionDivider",
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
      color: attrField("color", GraphQLString),
    }),
  });

  const UnionChecklist = newObjectTypeBuilder<
    OurGraphQLContext,
    UnionChecklistStep
  >(PgSelectSingleStep)({
    name: "UnionChecklist",
    fields: () => ({
      id: attrField("id", GraphQLInt),
      title: attrField("title", GraphQLString),
    }),
  });

  const UnionChecklistItem = newObjectTypeBuilder<
    OurGraphQLContext,
    UnionChecklistItemStep
  >(PgSelectSingleStep)({
    name: "UnionChecklistItem",
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
    PgUnionAllSingleStep,
    PgSelectParsedCursorStep,
    PgUnionAllStep<any, any>,
    PgUnionAllSingleStep
  >;

  const VulnerabilityEdge = newObjectTypeBuilder<
    OurGraphQLContext,
    PgUnionAllSingleStep
  >(PgUnionAllSingleStep)({
    name: "VulnerabilityEdge",
    fields: {
      cursor: {
        type: GraphQLString,
        plan: EXPORTABLE(
          () =>
            function plan($node) {
              return $node.cursor();
            },
          [],
        ),
      },
      node: {
        type: Vulnerability,
        plan: EXPORTABLE(
          () =>
            function plan($node) {
              return $node;
            },
          [],
        ),
      },
    },
  });

  const VulnerabilitiesConnection = newObjectTypeBuilder<
    OurGraphQLContext,
    VulnerabilityConnectionStep
  >(ConnectionStep)({
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
      pageInfo: newGraphileFieldConfigBuilder<
        OurGraphQLContext,
        VulnerabilityConnectionStep
      >()({
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
          graphile: {
            applyPlan: EXPORTABLE(
              () => (step: PgUnionAllStep<any, any>) => {
                step.orderBy({
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
          graphile: {
            applyPlan: EXPORTABLE(
              () => (step: PgUnionAllStep<any, any>) => {
                step.orderBy({
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

  const Query = newObjectTypeBuilder<
    OurGraphQLContext,
    __ValueStep<BaseGraphQLRootValue>
  >(__ValueStep)({
    name: "Query",
    fields: {
      forums: {
        type: new GraphQLList(Forum),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumSource) =>
            function plan(_$root) {
              const $forums = forumSource.find();
              deoptimizeIfAppropriate($forums);
              return $forums;
            },
          [deoptimizeIfAppropriate, forumSource],
        ),
        args: {
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: __ValueStep<BaseGraphQLRootValue>,
                  $forums: PgSelectStep<typeof forumSource>,
                  arg,
                ) {
                  $forums.setFirst(arg.getRaw());
                  return null;
                },
              [],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            PgSelectStep<typeof forumSource>
          >(($forums) => $forums),
          condition: {
            type: ForumCondition,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root,
                  $forums: PgSelectStep<typeof forumSource>,
                ) {
                  return $forums.wherePlan();
                },
              [],
            ),
          },
          filter: {
            type: ForumFilter,
            applyPlan: EXPORTABLE(
              (ClassFilterStep) =>
                function plan(
                  _$root,
                  $forums: PgSelectStep<typeof forumSource>,
                ) {
                  return new ClassFilterStep(
                    $forums.wherePlan(),
                    $forums.alias,
                  );
                },
              [ClassFilterStep],
            ),
          },
        },
      },
      forum: {
        type: Forum,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, forumSource) =>
            function plan(_$root, args) {
              const $forum = forumSource.get({ id: args.get("id") });
              deoptimizeIfAppropriate($forum);
              return $forum;
            },
          [deoptimizeIfAppropriate, forumSource],
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
          (deoptimizeIfAppropriate, messageSource) =>
            function plan(_$root, args) {
              const $message = messageSource.get({ id: args.get("id") });
              deoptimizeIfAppropriate($message);
              return $message;
            },
          [deoptimizeIfAppropriate, messageSource],
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
              () =>
                function plan(
                  _$root: any,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                ) {
                  const $messages = $connection.getSubplan();
                  return $messages.wherePlan();
                },
              [],
            ),
          },
          filter: {
            type: MessageFilter,
            applyPlan: EXPORTABLE(
              (ClassFilterStep) =>
                function plan(
                  _$root: any,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                ) {
                  const $messages = $connection.getSubplan();
                  return new ClassFilterStep(
                    $messages.wherePlan(),
                    $messages.alias,
                  );
                },
              [ClassFilterStep],
            ),
          },
          includeArchived: makeIncludeArchivedArg<
            PgConnectionPlanFromSource<typeof messageSource>
          >(($connection) => $connection.getSubplan()),
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: any,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  val,
                ) {
                  $connection.setFirst(val.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setLast(arg.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setAfter(arg.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setBefore(arg.getRaw());
                  return null;
                },
              [],
            ),
          },
          orderBy: {
            type: new GraphQLList(new GraphQLNonNull(MessagesOrderBy)),
            applyPlan: EXPORTABLE(
              (GraphQLError, MessagesOrderBy, getEnumValueConfig, inspect) =>
                function plan(
                  _$root,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  const $messages = $connection.getSubplan();
                  const val = arg.getRaw().eval();
                  if (!Array.isArray(val)) {
                    throw new GraphQLError(
                      "Invalid valus supplied to 'orderBy'",
                    );
                  }
                  val.forEach((order) => {
                    const config = getEnumValueConfig(MessagesOrderBy, order);
                    const plan = config?.extensions?.graphile?.applyPlan;
                    if (typeof plan !== "function") {
                      console.error(
                        `Internal server error: invalid orderBy configuration: expected function, but received ${inspect(
                          plan,
                        )}`,
                      );
                      throw new GraphQLError(
                        "Internal server error: invalid orderBy configuration",
                      );
                    }
                    plan($messages);
                  });
                  return null;
                },
              [GraphQLError, MessagesOrderBy, getEnumValueConfig, inspect],
            ),
          },
        },
        plan: EXPORTABLE(
          (connection, deoptimizeIfAppropriate, messageSource) =>
            function plan() {
              const $messages = messageSource.find();
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
          [connection, deoptimizeIfAppropriate, messageSource],
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
          (TYPES, deoptimizeIfAppropriate, uniqueAuthorCountSource) =>
            function plan(_$root, args) {
              const $featured = args.get("featured");
              const $plan = uniqueAuthorCountSource.execute([
                {
                  step: $featured,
                  pgCodec: TYPES.boolean,
                  name: "featured",
                },
              ]);
              deoptimizeIfAppropriate($plan);
              return $plan;
            },
          [TYPES, deoptimizeIfAppropriate, uniqueAuthorCountSource],
        ),
      },

      forumNames: {
        type: new GraphQLList(GraphQLString),
        plan: EXPORTABLE(
          (pgSelect, scalarTextSource, sql) =>
            function plan(_$root) {
              const $plan = pgSelect({
                source: scalarTextSource,
                identifiers: [],
                from: sql`app_public.forum_names()`,
                name: "forum_names",
              });
              return $plan;
            },
          [pgSelect, scalarTextSource, sql],
        ),
      },

      forumNamesArray: {
        type: new GraphQLList(GraphQLString),
        plan: EXPORTABLE(
          (forumNamesArraySource) =>
            function plan(_$root) {
              return forumNamesArraySource.execute();
            },
          [forumNamesArraySource],
        ),
      },

      forumNamesCasesList: {
        type: new GraphQLList(new GraphQLList(GraphQLString)),
        plan: EXPORTABLE(
          (forumNamesCasesSource) =>
            function plan(_$root) {
              const $plan = forumNamesCasesSource.execute();
              return $plan;
            },
          [forumNamesCasesSource],
        ),
      },

      // TODO
      /*
      forumNamesCasesConnection: {
        type: new GraphQLList(GraphQLString),
        plan: EXPORTABLE(
          (forumNamesArraySource, connection) =>
            function plan(_$root) {
              const $plan = forumNamesArraySource.execute();
              return connection($plan);
            },
          [forumNamesArraySource, connection],
        ),
      },
      */

      FORUM_NAMES: {
        type: new GraphQLList(GraphQLString),
        description: "Like forumNames, only we convert them all to upper case",
        plan: EXPORTABLE(
          (each, lambda, pgSelect, scalarTextSource, sql) =>
            function plan(_$root) {
              const $names = pgSelect({
                source: scalarTextSource,
                identifiers: [],
                from: sql`app_public.forum_names()`,
                name: "forum_names",
              });
              // return lambda($names, (names: string[]) => names.map(name => name.toUpperCase())),
              return each($names, ($name) =>
                lambda($name, (name) => name.toUpperCase(), true),
              );
            },
          [each, lambda, pgSelect, scalarTextSource, sql],
        ),
      },

      randomUser: {
        type: User,
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, pgSelect, sql, userSource) =>
            function plan() {
              const $users = pgSelect({
                source: userSource,
                identifiers: [],
                from: sql`app_public.random_user()`,
                name: "random_user",
              });
              deoptimizeIfAppropriate($users);
              return $users.single();
            },
          [deoptimizeIfAppropriate, pgSelect, sql, userSource],
        ),
      },

      randomUserArray: {
        type: new GraphQLList(User),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, randomUserArraySource) =>
            function plan() {
              const $select = randomUserArraySource.execute();
              deoptimizeIfAppropriate($select);
              return $select;
            },
          [deoptimizeIfAppropriate, randomUserArraySource],
        ),
      },

      randomUserArraySet: {
        type: new GraphQLList(new GraphQLList(User)),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, randomUserArraySetSource) =>
            function plan() {
              const $selectPartitioned = randomUserArraySetSource.execute();
              deoptimizeIfAppropriate($selectPartitioned);
              return $selectPartitioned;
            },
          [deoptimizeIfAppropriate, randomUserArraySetSource],
        ),
      },

      featuredMessages: {
        type: new GraphQLList(Message),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, featuredMessagesSource, pgSelect) =>
            function plan() {
              const $messages = pgSelect({
                source: featuredMessagesSource,
                identifiers: [],
              });
              deoptimizeIfAppropriate($messages);
              return $messages;
            },
          [deoptimizeIfAppropriate, featuredMessagesSource, pgSelect],
        ),
      },

      people: {
        type: new GraphQLList(Person),
        plan: EXPORTABLE(
          (deoptimizeIfAppropriate, personSource) =>
            function plan() {
              const $people = personSource.find();
              deoptimizeIfAppropriate($people);
              return $people;
            },
          [deoptimizeIfAppropriate, personSource],
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
          (singleTableItemInterface, singleTableItemsSource) =>
            function plan(_$root, args) {
              const $item: SingleTableItemStep = singleTableItemsSource.get({
                id: args.get("id"),
              });
              return singleTableItemInterface($item);
            },
          [singleTableItemInterface, singleTableItemsSource],
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
          (constant, singleTableItemsSource) =>
            function plan(_$root, args) {
              const $item: SingleTableItemStep = singleTableItemsSource.get({
                id: args.get("id"),
                type: constant("TOPIC"),
              });
              return $item;
            },
          [constant, singleTableItemsSource],
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
          (relationalItemInterface, relationalItemsSource) =>
            function plan(_$root, args) {
              const $item: RelationalItemStep = relationalItemsSource.get({
                id: args.get("id"),
              });
              return relationalItemInterface($item);
            },
          [relationalItemInterface, relationalItemsSource],
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
          (relationalTopicsSource) =>
            function plan(_$root, args) {
              return relationalTopicsSource.get({
                id: args.get("id"),
              });
            },
          [relationalTopicsSource],
        ),
      },

      allRelationalCommentablesList: {
        type: new GraphQLList(new GraphQLNonNull(RelationalCommentable)),
        args: {
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: any,
                  $each: __ListTransformStep<any, any, any, any>,
                  val,
                ) {
                  const $commentables =
                    $each.getListStep() as RelationalCommentablesStep;
                  $commentables.setFirst(val.getRaw());
                  return null;
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
            relationalCommentableSource,
            sql,
          ) =>
            function plan() {
              const $commentables: RelationalCommentablesStep =
                relationalCommentableSource.find();
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
            relationalCommentableSource,
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
          (unionItemUnion, unionItemsSource) =>
            function plan(_$root, args) {
              const $item: UnionItemStep = unionItemsSource.get({
                id: args.get("id"),
              });
              return unionItemUnion($item);
            },
          [unionItemUnion, unionItemsSource],
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
          (unionTopicsSource) =>
            function plan(_$root, args) {
              return unionTopicsSource.get({
                id: args.get("id"),
              });
            },
          [unionTopicsSource],
        ),
      },

      allUnionItemsList: {
        type: new GraphQLList(new GraphQLNonNull(UnionItem)),
        plan: EXPORTABLE(
          (TYPES, each, sql, unionItemUnion, unionItemsSource) =>
            function plan() {
              const $items: UnionItemsStep = unionItemsSource.find();
              $items.orderBy({
                codec: TYPES.int,
                fragment: sql`${$items.alias}.id`,
                direction: "ASC",
              });
              return each($items, ($item) => unionItemUnion($item));
            },
          [TYPES, each, sql, unionItemUnion, unionItemsSource],
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
            entitySearchSource,
            entityUnion,
          ) =>
            function plan(_$root, args) {
              const $step = entitySearchSource.execute([
                {
                  step: args.get("query"),
                  pgCodec: TYPES.text,
                  name: "query",
                },
              ]) as PgSelectStep<any>;
              deoptimizeIfAppropriate($step);
              return each($step, ($item) => entityUnion($item as any));
            },
          [
            TYPES,
            deoptimizeIfAppropriate,
            each,
            entitySearchSource,
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
          (personSource) =>
            function plan(_$root, args) {
              return personSource.get({ person_id: args.get("personId") });
            },
          [personSource],
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
        // TODO: this should not be needed!
        plan: EXPORTABLE(
          (constant) =>
            function plan() {
              return constant(Object.create(null));
            },
          [constant],
        ),
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
            firstPartyVulnerabilitiesSource,
            pgUnionAll,
            sql,
            thirdPartyVulnerabilitiesSource,
          ) =>
            function plan(_, fieldArgs) {
              const $first = fieldArgs.getRaw("first");
              const $offset = fieldArgs.getRaw("offset");
              // IMPORTANT: for cursor pagination, type must be part of cursor condition
              const $vulnerabilities = pgUnionAll({
                attributes: {
                  cvss_score: {
                    codec: TYPES.float,
                  },
                },
                sourceByTypeName: {
                  FirstPartyVulnerability: firstPartyVulnerabilitiesSource,
                  ThirdPartyVulnerability: thirdPartyVulnerabilitiesSource,
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
                    constant(6),
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
            firstPartyVulnerabilitiesSource,
            pgUnionAll,
            sql,
            thirdPartyVulnerabilitiesSource,
          ],
        ),
      },
      vulnerabilitiesConnection: {
        type: VulnerabilitiesConnection,
        args: {
          condition: {
            type: VulnerabilityCondition,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: any,
                  $connection: VulnerabilityConnectionStep,
                ) {
                  const $collection = $connection.getSubplan();
                  return $collection.wherePlan();
                },
              [],
            ),
          },
          first: {
            type: GraphQLInt,
            applyPlan: EXPORTABLE(
              () =>
                function plan(
                  _$root: any,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  val,
                ) {
                  $connection.setFirst(val.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setLast(arg.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setOffset(arg.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setAfter(arg.getRaw());
                  return null;
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
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  $connection.setBefore(arg.getRaw());
                  return null;
                },
              [],
            ),
          },
          orderBy: {
            type: new GraphQLList(new GraphQLNonNull(VulnerabilitiesOrderBy)),
            applyPlan: EXPORTABLE(
              (
                GraphQLError,
                VulnerabilitiesOrderBy,
                getEnumValueConfig,
                inspect,
              ) =>
                function plan(
                  _$root,
                  $connection: PgConnectionPlanFromSource<typeof messageSource>,
                  arg,
                ) {
                  const $collection = $connection.getSubplan();
                  const val = arg.getRaw().eval();
                  if (!Array.isArray(val)) {
                    throw new Error("Invalid!");
                  }
                  val.forEach((order) => {
                    const config = getEnumValueConfig(
                      VulnerabilitiesOrderBy,
                      order,
                    );
                    const plan = config?.extensions?.graphile?.applyPlan;
                    if (typeof plan !== "function") {
                      console.error(
                        `Internal server error: invalid orderBy configuration: expected function, but received ${inspect(
                          plan,
                        )}`,
                      );
                      throw new GraphQLError(
                        "Internal server error: invalid orderBy configuration",
                      );
                    }
                    plan($collection);
                  });
                  return null;
                },
              [
                GraphQLError,
                VulnerabilitiesOrderBy,
                getEnumValueConfig,
                inspect,
              ],
            ),
          },
        },
        plan: EXPORTABLE(
          (
            TYPES,
            connection,
            firstPartyVulnerabilitiesSource,
            pgUnionAll,
            thirdPartyVulnerabilitiesSource,
          ) =>
            function plan() {
              // IMPORTANT: for cursor pagination, type must be part of cursor condition
              const $vulnerabilities = pgUnionAll({
                attributes: {
                  cvss_score: {
                    codec: TYPES.float,
                  },
                },
                sourceByTypeName: {
                  FirstPartyVulnerability: firstPartyVulnerabilitiesSource,
                  ThirdPartyVulnerability: thirdPartyVulnerabilitiesSource,
                },
              });
              return connection($vulnerabilities);
            },
          [
            TYPES,
            connection,
            firstPartyVulnerabilitiesSource,
            pgUnionAll,
            thirdPartyVulnerabilitiesSource,
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

  type PgRecord<TDataSource extends PgResource<any, any, any, any, any>> =
    PgClassExpressionStep<
      PgCodec<any, GetPgResourceColumns<TDataSource>, any, any, any, any, any>,
      TDataSource
    >;

  const CreateRelationalPostPayload = newObjectTypeBuilder<
    OurGraphQLContext,
    PgRecord<typeof relationalPostsSource>
  >(PgClassExpressionStep)({
    name: "CreateRelationalPostPayload",
    fields: {
      post: {
        type: RelationalPost,
        plan: EXPORTABLE(
          (relationalPostsSource) =>
            function plan($post) {
              return relationalPostsSource.get({ id: $post.get("id") });
            },
          [relationalPostsSource],
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
          (operationPlan) =>
            function plan() {
              return operationPlan().rootValueStep;
            },
          [operationPlan],
        ),
      },
    },
  });

  const UpdateRelationalPostByIdPayload = newObjectTypeBuilder<
    OurGraphQLContext,
    PgUpdateStep<typeof relationalPostsSource>
  >(PgUpdateStep)({
    name: "UpdateRelationalPostByIdPayload",
    fields: {
      post: {
        type: RelationalPost,
        plan: EXPORTABLE(
          (relationalPostsSource) =>
            function plan($post) {
              return relationalPostsSource.get({ id: $post.get("id") });
            },
          [relationalPostsSource],
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
          (operationPlan) =>
            function plan() {
              return operationPlan().rootValueStep;
            },
          [operationPlan],
        ),
      },
    },
  });

  const DeleteRelationalPostByIdPayload = newObjectTypeBuilder<
    OurGraphQLContext,
    PgDeleteStep<typeof relationalPostsSource>
  >(PgDeleteStep)({
    name: "DeleteRelationalPostByIdPayload",
    fields: {
      // Since we've deleted the post we cannot go and fetch it; so we must
      // return the record from the mutation RETURNING clause
      post: {
        type: RelationalPost,
        plan: EXPORTABLE(
          (pgSelectSingleFromRecord, relationalPostsSource) =>
            function plan($post) {
              return pgSelectSingleFromRecord(
                relationalPostsSource,
                $post.record(),
              );
            },
          [pgSelectSingleFromRecord, relationalPostsSource],
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
          (operationPlan) =>
            function plan() {
              return operationPlan().rootValueStep;
            },
          [operationPlan],
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

  const MultipleActionsPayload = newObjectTypeBuilder<
    OurGraphQLContext,
    WithPgClientStep<any, any>
  >(WithPgClientStep)({
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

  const Mutation = newObjectTypeBuilder<
    OurGraphQLContext,
    __ValueStep<BaseGraphQLRootValue>
  >(__ValueStep)({
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
          (constant, pgInsert, relationalItemsSource, relationalPostsSource) =>
            function plan(_$root, args) {
              const $item = pgInsert(relationalItemsSource, {
                type: constant`POST`,
                author_id: constant(2),
              });
              const $itemId = $item.get("id");
              // TODO: make this TypeScript stuff automatic
              const $post = pgInsert(relationalPostsSource, {
                id: $itemId,
              });
              for (const key of ["title", "description", "note"] as Array<
                keyof typeof relationalPostsSource.codec.columns
              >) {
                const $value = args.getRaw(["input", key]);
                if (!$value.evalIs(undefined)) {
                  const $value = args.get(["input", key]);
                  $post.set(key, $value);
                }
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
          [constant, pgInsert, relationalItemsSource, relationalPostsSource],
        ),
      },

      createThreeRelationalPosts: {
        description:
          "This silly mutation is specifically to ensure that mutation plans are not tree-shaken - we never want to throw away mutation side effects.",
        type: CreateRelationalPostPayload,
        plan: EXPORTABLE(
          (constant, pgInsert, relationalItemsSource, relationalPostsSource) =>
            function plan() {
              // Only the _last_ post plan is returned; there's no dependency on
              // the first two posts, and yet they should not be tree-shaken
              // because they're mutations.
              let $post: PgInsertStep<typeof relationalPostsSource>;
              for (let i = 0; i < 3; i++) {
                const $item = pgInsert(relationalItemsSource, {
                  type: constant`POST`,
                  author_id: constant(2),
                });
                const $itemId = $item.get("id");
                $post = pgInsert(relationalPostsSource, {
                  id: $itemId,
                  title: constant(`Post #${i + 1}`),
                  description: constant(`Desc ${i + 1}`),
                  note: constant(null),
                });
              }

              // See NOTE in createRelationalPost plan.
              return $post!.record();
            },
          [constant, pgInsert, relationalItemsSource, relationalPostsSource],
        ),
      },

      createThreeRelationalPostsComputed: {
        description:
          "This silly mutation is specifically to ensure that mutation plans are not tree-shaken even if they use plans that are normally side-effect free - we never want to throw away mutation side effects.",
        type: CreateRelationalPostPayload,
        plan: EXPORTABLE(
          (TYPES, constant, pgSelect, relationalPostsSource, sql) =>
            function plan() {
              // Only the _last_ post plan is returned; there's no dependency on
              // the first two posts, and yet they should not be tree-shaken
              // because they're mutations.
              let $post: PgSelectStep<typeof relationalPostsSource>;
              for (let i = 0; i < 3; i++) {
                $post = pgSelect({
                  source: relationalPostsSource,
                  identifiers: [],
                  from: (authorId, title) =>
                    sql`interfaces_and_unions.insert_post(${authorId.placeholder}, ${title.placeholder})`,
                  args: [
                    {
                      step: constant(2),
                      pgCodec: TYPES.int,
                    },
                    {
                      step: constant(`Computed post #${i + 1}`),
                      pgCodec: TYPES.text,
                    },
                  ],
                  mode: "mutation",
                });
              }

              // See NOTE in createRelationalPost plan.
              return $post!.single().record();
            },
          [TYPES, constant, pgSelect, relationalPostsSource, sql],
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
          (pgUpdate, relationalPostsSource) =>
            function plan(_$root, args) {
              const $post = pgUpdate(relationalPostsSource, {
                id: args.get(["input", "id"]),
              });
              for (const key of ["title", "description", "note"] as Array<
                keyof typeof relationalPostsSource.codec.columns
              >) {
                const $rawValue = args.getRaw(["input", "patch", key]);
                const $value = args.get(["input", "patch", key]);
                // TODO: test that we differentiate between value set to null and
                // value not being present
                if (!$rawValue.evalIs(undefined)) {
                  $post.set(key, $value);
                }
              }
              return $post;
            },
          [pgUpdate, relationalPostsSource],
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
          (pgDelete, relationalPostsSource) =>
            function plan(_$root, args) {
              const $post = pgDelete(relationalPostsSource, {
                id: args.get(["input", "id"]),
              });
              return $post;
            },
          [pgDelete, relationalPostsSource],
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
          (
            object,
            relationalPostsSource,
            sleep,
            sql,
            withPgClientTransaction,
          ) =>
            function plan(_$root, args) {
              const $transactionResult = withPgClientTransaction(
                relationalPostsSource.executor,
                object({
                  a: args.get(["input", "a"]) as ExecutableStep<
                    number | null | undefined
                  >,
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
              return $transactionResult;
            },
          [object, relationalPostsSource, sleep, sql, withPgClientTransaction],
        ),
      },
    },
  });

  const ForumMessageSubscriptionPayload = newObjectTypeBuilder<
    OurGraphQLContext,
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
          (messageSource) =>
            function plan($event) {
              return messageSource.get({ id: $event.get("id") });
            },
          [messageSource],
        ),
      },
    },
  });

  const Subscription = newObjectTypeBuilder<
    OurGraphQLContext,
    __ValueStep<BaseGraphQLRootValue>
  >(__ValueStep)({
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
              const $forumId = args.get("forumId");
              const $topic = lambda(
                $forumId,
                (id) => `forum:${id}:message`,
                true,
              );
              const $pgSubscriber = context<OurGraphQLContext>().get(
                "pgSubscriber",
              ) as unknown as AccessStep<GrafastSubscriber>;

              return listen($pgSubscriber, $topic, jsonParse);
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
          relationalDividersSource,
          relationalChecklistsSource,
          relationalChecklistItemsSource,
        ],
      },
    },
    enableDeferStream: true,
  });
}

async function main() {
  const filePath = `${__dirname}/schema.graphql`;
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
