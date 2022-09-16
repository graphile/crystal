/*
 * Business logic is the same for Grafast and GraphQL
 */

const { db } = require("./database");

exports.getUsersByIds = async function getUsersByIds(ids) {
  const users = await new Promise((resolve, reject) =>
    db.all(
      `select * from users where id in (${ids.map(() => `?`).join(", ")})`,
      ids,
      (err, result) => (err ? reject(err) : resolve(result)),
    ),
  );
  return ids.map((id) => users.find((u) => u.id === id));
};

exports.getFriendshipsByUserIds = async function getFriendshipsByUserIds(
  userIds,
) {
  const friendships = await new Promise((resolve, reject) =>
    db.all(
      `select * from friendships where user_id in (${userIds
        .map(() => `?`)
        .join(", ")})`,
      userIds,
      (err, result) => (err ? reject(err) : resolve(result)),
    ),
  );
  return userIds.map((userId) =>
    friendships.filter((f) => f.user_id === userId),
  );
};
