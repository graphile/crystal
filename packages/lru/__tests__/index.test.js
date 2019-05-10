import LRU from "..";

function testLinkedList(cache, expectedList = null) {
  if (expectedList) {
    expect(cache.length).toEqual(expectedList.length);
  }
  let previous = null;
  let current = cache._head;
  // eslint-disable-next-line no-constant-condition
  for (let index = 0; index < cache.length; index++) {
    expect(current).toBeTruthy();
    expect(current.prev).toBe(previous);
    if (expectedList) {
      expect(current.key).toEqual(expectedList[index]);
    }
    previous = current;
    current = current.next;
  }
  expect(current).toBe(null);
  expect(cache._tail).toBe(previous);
}

it("set 1", () => {
  const cache = new LRU({ maxLength: 3 });
  expect(cache.get("foo")).toBe(undefined);
  cache.set("foo", 27);
  expect(cache.get("foo")).toEqual(27);
  expect(cache.length).toEqual(1);
});

it("change value", () => {
  const cache = new LRU({ maxLength: 3 });
  testLinkedList(cache, []);
  cache.set("foo", 27);
  testLinkedList(cache, ["foo"]);
  expect(cache.length).toEqual(1);
  cache.set("foo", 28);
  expect(cache.length).toEqual(1);
  expect(cache.get("foo")).toEqual(28);
  testLinkedList(cache, ["foo"]);
});

it("least recent 'get'", () => {
  const cache = new LRU({ maxLength: 3 });
  cache.set("foo", 28);
  cache.set("baz", 30);
  cache.set("bar", 29);
  expect(cache.length).toEqual(3);
  testLinkedList(cache, ["bar", "baz", "foo"]);
  expect(cache.get("foo")).toEqual(28);
  expect(cache.get("bar")).toEqual(29);
  expect(cache.get("baz")).toEqual(30);
  // foo is now the least recently used
  testLinkedList(cache, ["baz", "bar", "foo"]);
  cache.set("qux", 31);
  testLinkedList(cache, ["qux", "baz", "bar"]);
  expect(cache.length).toEqual(3);
  expect(cache.get("foo")).toBe(undefined);
  expect(cache.get("bar")).toEqual(29);
  expect(cache.get("baz")).toEqual(30);
  expect(cache.get("qux")).toEqual(31);
  testLinkedList(cache, ["qux", "baz", "bar"]);
  // bar is now the least recently fetched (but not the least recently set)
  cache.set("quux", 32);
  testLinkedList(cache, ["quux", "qux", "baz"]);
  expect(cache.length).toEqual(3);
  expect(cache.get("bar")).toBe(undefined);
  expect(cache.get("qux")).toEqual(31);
  expect(cache.get("baz")).toEqual(30);
  expect(cache.get("quux")).toEqual(32);
  testLinkedList(cache, ["quux", "baz", "qux"]);
});

it("least recent 'set'", () => {
  const cache = new LRU({ maxLength: 3 });
  cache.set("foo", 28);
  cache.set("bar", 29);
  cache.set("baz", 30);
  cache.set("qux", 31);
  cache.set("quux", 32);
  testLinkedList(cache, ["quux", "qux", "baz"]);
  expect(cache.length).toEqual(3);
  expect(cache.get("foo")).toBe(undefined);
  expect(cache.get("bar")).toBe(undefined);
  expect(cache.get("baz")).toEqual(30);
  expect(cache.get("qux")).toEqual(31);
  expect(cache.get("quux")).toEqual(32);
  testLinkedList(cache, ["quux", "qux", "baz"]);
});

it("reset", () => {
  const cache = new LRU({ maxLength: 3 });
  cache.set("foo", 28);
  cache.set("baz", 30);
  cache.set("bar", 29);
  cache.set("qux", 31);
  cache.set("quux", 32);
  testLinkedList(cache, ["quux", "qux", "bar"]);
  expect(cache.length).toEqual(3);
  cache.reset();
  testLinkedList(cache, []);
  expect(cache.length).toEqual(0);
  expect(cache.get("foo")).toBe(undefined);
  expect(cache.get("bar")).toBe(undefined);
  expect(cache.get("baz")).toBe(undefined);
  expect(cache.get("qux")).toBe(undefined);
  expect(cache.get("quux")).toBe(undefined);
  testLinkedList(cache, []);
});
