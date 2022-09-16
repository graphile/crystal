const {
  getUsersByIds,
  getFriendshipsByUserIds,
} = require("./businessLogic.js");

const {
  ExecutableStep,
  access,
  __ItemStep,
  __ListTransformStep,
} = require("grafast");

class GetOne extends ExecutableStep {
  columns = new Set();
  constructor($id, getter) {
    super();
    this.addDependency($id);
    this.getter = getter;
  }
  toStringMeta() {
    return this.getter.displayName || this.getter.name;
  }
  finalize() {
    this.getterOptions = {
      columns: this.columns.size ? [...this.columns] : null,
    };
  }
  async execute([ids]) {
    return this.getter(ids, this.getterOptions);
  }
  addColumns(columns) {
    for (const column of columns) this.columns.add(column);
  }
}

class GetMany extends ExecutableStep {
  columns = new Set();
  constructor($id, getter, type) {
    super();
    this.addDependency($id);
    this.getter = getter;
    this.type = type;
  }
  toStringMeta() {
    return this.getter.displayName || this.getter.name;
  }
  finalize() {
    this.getterOptions = {
      columns: this.columns.size ? [...this.columns] : null,
    };
  }
  async execute([ids]) {
    return this.getter(ids, this.getterOptions);
  }
  listItem($item) {
    return new Record($item, this.type);
  }
  addColumns(columns) {
    for (const column of columns) this.columns.add(column);
  }
}

exports.userById = ($id) => new Record(new GetOne($id, getUsersByIds), "user");

class Record extends ExecutableStep {
  isSyncAndSafe = true;
  columns = new Set();
  constructor($data, type) {
    super();
    this.type = type;
    this.addDependency($data);
  }
  toStringMeta() {
    return this.type;
  }
  execute([records]) {
    return records;
  }
  get(attr) {
    this.columns.add(attr);
    return access(this, attr);
  }
  optimize() {
    const $source = this.getDepDeep(0);
    if ($source instanceof GetMany || $source instanceof GetOne) {
      // Tell our parent we only need certain columns
      $source.addColumns([...this.columns]);
    } else {
      // This should never happen
      console.warn(
        `RecordStep could not find the parent GetOne/GetMany; instead found ${$source}`,
      );
    }

    // Record has no run-time behaviour (it's just a plan-time helper), so we
    // can replace ourself with our dependency:
    return this.getDep(0);
  }
}

exports.friendshipsByUserId = ($id) =>
  new GetMany($id, getFriendshipsByUserIds, "friendship");
