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
  getUsersByIds(ids, { attributes: attributes }),
);
userByIdCallback.displayName = "userById";
exports.userById = ($id) => loadOne($id, userByIdCallback);

const friendshipsByUserIdCallback = loadManyCallback((ids, { attributes }) =>
  getFriendshipsByUserIds(ids, { attributes: attributes }),
);
friendshipsByUserIdCallback.displayName = "friendshipsByUserId";
exports.friendshipsByUserId = ($id) =>
  loadMany($id, friendshipsByUserIdCallback);
