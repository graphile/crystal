jest.mock("graphile-build");
jest.setTimeout(20000);

import mockFs from "mock-fs";
import fs from "fs";
import graphileBuild from "graphile-build";
import { getPostGraphileBuilder } from "../..";

type MockHack<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>>;
const mockedGetBuilder = graphileBuild.getBuilder as MockHack<
  typeof graphileBuild.getBuilder
>;

beforeEach(() => {
  // required for mocks assertions
  jest.resetAllMocks();
  mockFs.restore();
});

afterEach(() => {
  mockFs.restore();
});

/*
Current behaviour of getPostGraphileBuilder and readCache option:

If readCache is String: 
1. cacheString is loaded by reading the file defined by readCache
2. memoizeCache is set by JSON.parse(cacheString)

If readCache is Object:
1. memoizeCache is set as readCache directly

Then
3. persistentMemoizeWithKey is a function created dynamically that will use memoizeCache
4. getBuilder(imported from graphile-build) is called, passing persistentMemoizeWithKey as one of the arguments

Test strategy for readCache

1. Mock fs.readFile to control input
2. Mock getBuilder to control output
3. Test different inputs and validate that getBuilder is called with expected output
*/
test("when no readCache flag, persistentMemoizeWithKey should be undefined", async () => {
  // mock getBuilder to fake output
  const expectedOutput = {};
  mockedGetBuilder.mockResolvedValueOnce(expectedOutput as any);
  // call our method and test output
  const output = await getPostGraphileBuilder({} as any, [], {});
  expect(output).toBe(expectedOutput);
  expect(graphileBuild.getBuilder).toHaveBeenCalledTimes(1);
  // check persistentMemoizeWithKey, the actual "result" of readCache flag
  const { persistentMemoizeWithKey } = mockedGetBuilder.mock.calls[0][1];
  expect(persistentMemoizeWithKey).toBeUndefined();
});

describe("When readCache is String", () => {
  test("if cache file has content, persistentMemoizeWithKey should be a valid function", async () => {
    mockFs({
      "path/to/cache": '{ "__test": true }',
    });

    // mock getBuilder to fake output
    const expectedOutput = {};
    mockedGetBuilder.mockResolvedValueOnce(expectedOutput as any);
    // call our method and test output
    const output = await getPostGraphileBuilder({} as any, [], {
      readCache: "path/to/cache",
    });
    mockFs.restore();
    expect(output).toBe(expectedOutput);
    expect(mockedGetBuilder).toHaveBeenCalledTimes(1);
    // check persistentMemoizeWithKey, the actual "result" of readCache flag
    const { persistentMemoizeWithKey } = mockedGetBuilder.mock.calls[0][1];
    expect(typeof persistentMemoizeWithKey).toBe("function");
    expect(persistentMemoizeWithKey("__test")).toEqual(true);
    expect(() => persistentMemoizeWithKey("unknown_key")).toThrow();
  });

  test("if cache file has invalid content, getPostGraphileBuilder should error", async () => {
    mockFs({
      "path/to/cache": "thisisnotjson",
    });

    // call our method and check error

    let error;
    try {
      await getPostGraphileBuilder({} as any, [], {
        readCache: "path/to/cache",
      });
    } catch (e) {
      error = e;
    }
    mockFs.restore();
    expect(error).toBeDefined();
    expect(error).toMatchSnapshot();
  });
});

describe("When readCache is Object", () => {
  test("persistentMemoizeWithKey should be a valid function", async () => {
    // mock getBuilder to fake output
    const expectedOutput = {};
    mockedGetBuilder.mockResolvedValueOnce(expectedOutput as any);
    // call our method and test output
    const output = await getPostGraphileBuilder({} as any, [], {
      readCache: { __test: true },
    });
    expect(output).toBe(expectedOutput);
    expect(mockedGetBuilder).toHaveBeenCalledTimes(1);
    // check persistentMemoizeWithKey, the actual "result" of readCache flag
    const { persistentMemoizeWithKey } = mockedGetBuilder.mock.calls[0][1];
    expect(typeof persistentMemoizeWithKey).toBe("function");
    expect(persistentMemoizeWithKey("__test")).toEqual(true);
    expect(() => persistentMemoizeWithKey("unknown_key")).toThrow();
  });
});

describe("when readCache is not String or Object, getPostGraphileBuilder should error", () => {
  test("when its Boolean", async () => {
    // call our method with invalid readCache value and check error
    let error;
    try {
      await getPostGraphileBuilder({} as any, [], {
        readCache: true as any,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    mockFs.restore();
    expect(error).toMatchSnapshot();
  });
  test("when its Array", async () => {
    // call our method with invalid readCache value and check error
    let error;
    try {
      await getPostGraphileBuilder({} as any, [], {
        readCache: [],
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    mockFs.restore();
    expect(error).toMatchSnapshot();
  });
  test("when its Number", async () => {
    // call our method with invalid readCache value and check error
    let error;
    try {
      await getPostGraphileBuilder({} as any, [], {
        readCache: 3 as any,
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    mockFs.restore();
    expect(error).toMatchSnapshot();
  });
});
