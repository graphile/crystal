const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const { ExecutableStep } = require("grafast");

class UserByIdStep extends ExecutableStep {
  constructor($id) {
    super();
    this.addDependency($id);
  }
  async execute([ids]) {
    return getUsersByIds(ids);
  }
}

exports.userById = ($id) => new UserByIdStep($id);

class FriendshipsByUserIdStep extends ExecutableStep {
  constructor($userId) {
    super();
    this.addDependency($userId);
  }
  async execute([userIds]) {
    return getFriendshipsByUserIds(userIds);
  }
}

exports.friendshipsByUserId = ($id) => new FriendshipsByUserIdStep($id);
