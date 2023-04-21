const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const {
  loadOneCallback,
  loadOne,
  loadManyCallback,
  loadMany,
} = require("grafast");

const userByIdCallback = loadOneCallback((ids, { attributes }) =>
  getUsersByIds(ids, { columns: attributes }),
);
userByIdCallback.displayName = "userById";
exports.userById = ($id) => loadOne($id, userByIdCallback);

const friendshipsByUserIdCallback = loadManyCallback((ids, { attributes }) =>
  getFriendshipsByUserIds(ids, { columns: attributes }),
);
friendshipsByUserIdCallback.displayName = "friendshipsByUserId";
exports.friendshipsByUserId = ($id) =>
  loadMany($id, friendshipsByUserIdCallback);
