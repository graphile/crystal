const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const { loadOne, loadCallback, loadMany } = require("grafast");

const userByIdCallback = loadCallback((ids, { attributes }) =>
  getUsersByIds(ids, { columns: attributes }),
);
userByIdCallback.displayName = "userById";
exports.userById = ($id) => loadOne($id, userByIdCallback);

const friendshipsByUserIdCallback = loadCallback((ids, { attributes }) =>
  getFriendshipsByUserIds(ids, { columns: attributes }),
);
friendshipsByUserIdCallback.displayName = "friendshipsByUserId";
exports.friendshipsByUserId = ($id) =>
  loadMany($id, friendshipsByUserIdCallback);
