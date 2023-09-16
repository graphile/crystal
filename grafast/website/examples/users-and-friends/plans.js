const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const { loadOne, loadMany } = require("grafast");

const userByIdCallback = (ids, { attributes }) =>
  getUsersByIds(ids, { columns: attributes });
userByIdCallback.displayName = "userById";
exports.userById = ($id) => loadOne($id, "id", userByIdCallback);

const friendshipsByUserIdCallback = (ids, { attributes }) =>
  getFriendshipsByUserIds(ids, { columns: attributes });
friendshipsByUserIdCallback.displayName = "friendshipsByUserId";
exports.friendshipsByUserId = ($id) =>
  loadMany($id, "user_id", friendshipsByUserIdCallback);
