const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const {
  __ItemStep,
  __ListTransformStep,
  loadOneCallback,
  loadOne,
  loadManyCallback,
  loadMany,
} = require("grafast");

const userByIdCallback = loadOneCallback((ids, { attributes }) =>
  getUsersByIds(ids, { columns: attributes }),
);
exports.userById = ($id) => loadOne($id, userByIdCallback);

const friendshipsByUserIdCallback = loadManyCallback((ids, { attributes }) =>
  getFriendshipsByUserIds(ids, { columns: attributes }),
);
exports.friendshipsByUserId = ($id) =>
  loadMany($id, friendshipsByUserIdCallback);
