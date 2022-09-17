/*
 * Business logic is the same for Grafast and GraphQL
 */

const { db } = require("./database");

const queryAll = (query, parameters) =>
  new Promise((resolve, reject) => {
    console.log({ query, parameters });
    return db.all(query, parameters, (err, result) =>
      err ? reject(err) : resolve(result),
    );
  });

exports.getUsersByIds = async function getUsersByIds(ids, options = {}) {
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
};

exports.getFriendshipsByUserIds = async function getFriendshipsByUserIds(
  userIds,
  options = {},
) {
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
};
