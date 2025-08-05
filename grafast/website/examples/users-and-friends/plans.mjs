import { loadMany, loadOne } from "grafast";

import {
  getFriendshipsByUserIds,
  getPostsByAuthorIds,
  getPostsByIds,
  getUsersByIds,
} from "./businessLogic.mjs";

const userByIdCallback = (ids, { attributes }) =>
  getUsersByIds(ids, { columns: attributes });
userByIdCallback.displayName = "userById";
export function userById($id) {
  return loadOne({ lookup: $id, ioEquivalence: "id", load: userByIdCallback });
}

const friendshipsByUserIdsCallback = (ids, { attributes }) =>
  getFriendshipsByUserIds(ids, { columns: attributes });
friendshipsByUserIdsCallback.displayName = "friendshipsByUserId";
export function friendshipsByUserId($id) {
  return loadMany({
    lookup: $id,
    ioEquivalence: "user_id",
    load: friendshipsByUserIdsCallback,
  });
}

const postByIdCallback = (ids, { attributes }) =>
  getPostsByIds(ids, { columns: attributes });
postByIdCallback.displayName = "postById";
export function postById($id) {
  return loadOne({ lookup: $id, ioEquivalence: "id", load: postByIdCallback });
}

const postsByAuthorIdsCallback = (ids, { attributes }) =>
  getPostsByAuthorIds(ids, { columns: attributes });
postsByAuthorIdsCallback.displayName = "postsByAuthorId";
export function postsByAuthorId($id) {
  return loadMany({
    lookup: $id,
    ioEquivalence: "user_id",
    load: postsByAuthorIdsCallback,
  });
}
