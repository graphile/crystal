/* eslint-disable graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses */
import {
  makePgResourceOptions,
  makeRegistryBuilder,
  PgExecutor,
  recordCodec,
  TYPES,
} from "@dataplan/pg";
import { context, object } from "grafast";
import { sql } from "pg-sql2";

const executor = new PgExecutor({
  name: "main",
  context: () =>
    object({
      withPgClient: context().get("withPgClient"),
      pgSettings: context().get("pgSettings"),
    }),
});

const usersCodec = recordCodec({
  executor,
  name: "users",
  identifier: sql`users`,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
    },
    username: {
      codec: TYPES.citext,
      notNull: true,
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
    },
  },
});

const postsCodec = recordCodec({
  executor,
  name: "posts",
  identifier: sql`posts`,
  attributes: {
    id: {
      codec: TYPES.int,
      notNull: true,
    },
    author_id: {
      codec: TYPES.int,
      notNull: true,
    },
    body: {
      codec: TYPES.text,
      notNull: true,
    },
    created_at: {
      codec: TYPES.timestamptz,
      notNull: true,
    },
  },
});

const usersResourceOptions = makePgResourceOptions({
  executor,
  name: "users",
  from: sql`users`,
  codec: usersCodec,
  uniques: [
    {
      isPrimary: true,
      attributes: ["id"],
    },
    {
      attributes: ["username"],
    },
  ],
});

const postsResourceOptions = makePgResourceOptions({
  executor,
  name: "posts",
  from: sql`posts`,
  codec: postsCodec,
  uniques: [
    {
      isPrimary: true,
      attributes: ["id"],
    },
  ],
});

export const pgRegistry = makeRegistryBuilder()
  .addExecutor(executor)
  .addCodec(usersCodec)
  .addCodec(postsCodec)
  .addResource(usersResourceOptions)
  .addResource(postsResourceOptions)
  .addRelation(postsCodec, "author", usersResourceOptions, {
    isReferencee: false,
    isUnique: true,
    localAttributes: ["author_id"],
    remoteAttributes: ["id"],
  })
  .addRelation(usersCodec, "posts", postsResourceOptions, {
    isReferencee: true,
    isUnique: false,
    localAttributes: ["id"],
    remoteAttributes: ["author_id"],
  })
  .build();

export const pgCodecs = pgRegistry.pgCodecs;
export const pgResources = pgRegistry.pgResources;
