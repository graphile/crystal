const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const DataLoader = require("dataloader");

exports.makeDataLoaders = () => ({
  userLoader: new DataLoader((ids) => getUsersByIds(ids)),
  friendshipsByUserIdLoader: new DataLoader((userIds) =>
    getFriendshipsByUserIds(userIds),
  ),
});
