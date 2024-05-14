import { loadMany, loadOne } from "grafast";

import { getFriendshipsByUserIds, getUsersByIds } from "./businessLogic.mjs";

const userByIdCallback = (ids, { attributes }) =>
  getUsersByIds(ids, { columns: attributes });
userByIdCallback.displayName = "userById";
export function userById($id) {
  return loadOne($id, "id", userByIdCallback);
}

const friendshipsByUserIdCallback = (ids, { attributes }) =>
  getFriendshipsByUserIds(ids, { columns: attributes });
friendshipsByUserIdCallback.displayName = "friendshipsByUserId";
export function friendshipsByUserId($id) {
  return loadMany($id, "user_id", friendshipsByUserIdCallback);
}
