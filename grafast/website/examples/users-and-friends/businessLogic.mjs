/*
 * Business logic is the same for Grafast and GraphQL
 */

import { db } from "./database.mjs";

const logSql = process.env.LOG_SQL === "1";

const queryAll = (query, parameters) =>
  new Promise((resolve, reject) => {
    if (logSql) {
      console.log({ query, parameters });
    }
    return db.all(query, parameters, (err, result) =>
      err ? reject(err) : resolve(result),
    );
  });

export async function getUsersByIds(ids, options = {}) {
  const columns = options.columns
    ? [...new Set(["id", ...options.columns])]
    : ["*"];
  const users = await queryAll(
    `select ${columns.join(", ")} from users where id in (${ids
      .map(() => `?`)
      .join(", ")})`,
    ids,
  );
  return ids.map((id) => users.find((u) => u.id === id));
}

export async function getPostsByIds(ids, options = {}) {
  const columns = options.columns
    ? [...new Set(["id", ...options.columns])]
    : ["*"];
  const posts = await queryAll(
    `select ${columns.join(", ")} from posts where id in (${ids
      .map(() => `?`)
      .join(", ")})`,
    ids,
  );
  return ids.map((id) => posts.find((u) => u.id === id));
}

export async function getFriendshipsByUserIds(userIds, options = {}) {
  const columns = options.columns
    ? [...new Set(["user_id", ...options.columns])]
    : ["*"];
  const friendships = await queryAll(
    `select ${columns.join(", ")} from friendships where user_id in (${userIds
      .map(() => `?`)
      .join(", ")})`,
    userIds,
  );
  return userIds.map((userId) =>
    friendships.filter((f) => f.user_id === userId),
  );
}

export async function getPostsByAuthorIds(rawUserIds, options = {}) {
  const userIds = rawUserIds.filter((uid) => uid != null && uid >= 0);
  const columns = options.columns
    ? [...new Set(["author_id", ...options.columns])]
    : ["*"];
  const posts =
    userIds.length > 0
      ? await queryAll(
          `select ${columns.join(", ")} from posts where author_id in (${userIds
            .map(() => `?`)
            .join(", ")})`,
          userIds,
        )
      : [];
  const anonymousPosts =
    userIds.length !== rawUserIds.length
      ? await queryAll(
          `select ${columns.join(", ")} from posts where author_id is null`,
        )
      : [];
  return rawUserIds.map((userId) =>
    userId == null || userId < 0
      ? anonymousPosts
      : posts.filter((f) => f.author_id === userId),
  );
}
