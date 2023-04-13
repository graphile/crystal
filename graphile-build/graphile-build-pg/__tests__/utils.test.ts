import { parseSmartTagsOptsString } from "../src/utils.js";

const EXPECTED_VALUE_1 = {
  args: ["TOPIC"],
  params: {
    name: "SingleTableTopic",
    attributes: "title>subject!",
  },
};

test.each([
  ["TOPIC name:SingleTableTopic attributes:title>subject!", EXPECTED_VALUE_1],
  ["TOPIC name:SingleTableTopic attributes:title>subject!", EXPECTED_VALUE_1],
  [" TOPIC name:SingleTableTopic attributes:title>subject!", EXPECTED_VALUE_1],
  [" TOPIC name: SingleTableTopic attributes: title>subject!", EXPECTED_VALUE_1],
  [
    ' TOPIC name: "SingleTableTopic" attributes: "title>subject!"',
    EXPECTED_VALUE_1,
  ],
  [
    ' \t   TOPIC name:\t"SingleTableTopic" attributes:t"i""tle>subj"ect!',
    EXPECTED_VALUE_1,
  ],
])("%s", (str, expected) => {
  const result = parseSmartTagsOptsString(str, 1);
  expect(result).toEqual(expected);
});

test.each([
  [
    "name:SingleTableItem mode:single type:type",
    0,
    {
      args: [],
      params: { name: "SingleTableItem", mode: "single", type: "type" },
    },
  ],
])("%s", (str, nargs, expected) => {
  const result = parseSmartTagsOptsString(str, nargs);
  expect(result).toEqual(expected);
});
