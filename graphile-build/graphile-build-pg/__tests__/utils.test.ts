import { parseSmartTagsOptsString } from "../src/utils.js";

const EXPECTED_VALUE_1 = {
  args: ["TOPIC"],
  params: {
    name: "SingleTableTopic",
    columns: "title>subject!",
  },
};

test.each([
  ["TOPIC name:SingleTableTopic columns:title>subject!", EXPECTED_VALUE_1],
  ["TOPIC name:SingleTableTopic columns:title>subject!", EXPECTED_VALUE_1],
  [" TOPIC name:SingleTableTopic columns:title>subject!", EXPECTED_VALUE_1],
  [" TOPIC name: SingleTableTopic columns: title>subject!", EXPECTED_VALUE_1],
  [
    ' TOPIC name: "SingleTableTopic" columns: "title>subject!"',
    EXPECTED_VALUE_1,
  ],
  [
    ' \t   TOPIC name:\t"SingleTableTopic" columns:t"i""tle>subj"ect!',
    EXPECTED_VALUE_1,
  ],
])("%s", (str, expected) => {
  const result = parseSmartTagsOptsString(str, 1);
  expect(result).toEqual(expected);
});
