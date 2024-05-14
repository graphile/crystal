import DataLoader from "dataloader";

import {
  getFriendshipsByUserIds,
  getPostsByAuthorIds,
  getUsersByIds,
} from "./businessLogic.mjs";

export function makeDataLoaders() {
  return {
    userLoader: new DataLoader((ids) => getUsersByIds(ids)),
    friendshipsByUserIdLoader: new DataLoader((userIds) =>
      getFriendshipsByUserIds(userIds),
    ),
    postsByAuthorIdLoader: new DataLoader((authorIds) =>
      getPostsByAuthorIds(authorIds),
    ),
  };
}
