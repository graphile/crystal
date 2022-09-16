const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const { ExecutableStep, access } = require("grafast");

class GetOne extends ExecutableStep {
  constructor($id, getter) {
    super();
    this.addDependency($id);
    this.getter = getter;
  }
  async execute([ids]) {
    return this.getter(ids);
  }
}

class GetMany extends ExecutableStep {
  constructor($id, getter) {
    super();
    this.addDependency($id);
    this.getter = getter;
  }
  async execute([ids]) {
    return this.getter(ids);
  }
  listItem($item) {
    return new Record($item);
  }
}

exports.userById = ($id) => new Record(new GetOne($id, getUsersByIds));

class Record extends ExecutableStep {
  isSyncAndSafe = true;
  constructor($data) {
    super();
    this.addDependency($data);
  }
  execute([records]) {
    return records;
  }
  get(attr) {
    return access(this, attr);
  }
}

exports.friendshipsByUserId = ($id) =>
  new GetMany($id, getFriendshipsByUserIds);
