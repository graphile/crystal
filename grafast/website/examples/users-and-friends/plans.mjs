import { loadMany, loadManyLoader, loadOne, loadOneLoader } from "grafast";

import {
  getFriendshipsByUserIds,
  getPostsByAuthorIds,
  getPostsByIds,
  getUsersByIds,
} from "./businessLogic.mjs";

// Reusable loaders:

const userByIdLoader = loadOneLoader({
  load: (ids, { attributes: columns }) => getUsersByIds(ids, { columns }),
  name: "userById",
  ioEquivalence: "id",
});

const friendshipsByUserIdsLoader = loadManyLoader({
  load: (ids, { attributes: columns }) =>
    getFriendshipsByUserIds(ids, { columns }),
  name: "friendshipsByUserId",
  ioEquivalence: "user_id",
});

const postByIdLoader = loadOneLoader({
  load: (ids, { attributes: columns }) => getPostsByIds(ids, { columns }),
  name: "postById",
  ioEquivalence: "id",
});

const postsByAuthorIdsCallback = loadManyLoader({
  load: (ids, { attributes: columns }) => getPostsByAuthorIds(ids, { columns }),
  name: "postsByAuthorId",
  ioEquivalence: "user_id",
});

// Plans

export function userById($id) {
  return loadOne($id, userByIdLoader);
}

export function friendshipsByUserId($id) {
  return loadMany($id, friendshipsByUserIdsLoader);
}

export function postById($id) {
  return loadOne($id, postByIdLoader);
}

export function postsByAuthorId($id) {
  return loadMany($id, postsByAuthorIdsCallback);
}
