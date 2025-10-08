/*
 * This test suite originally based on https://github.com/bendrucker/postgres-array/blob/d29dbdfe86404be7592688b8968906d366f0efd8/test.js
 *
 * License follows:

The MIT License (MIT)

Copyright (c) Ben Drucker <bvdrucker@gmail.com> (bendrucker.me)
Copyright (c) Benjie Gillam <code@benjiegillam.com> (benjie.dev)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
import { parseBox } from "../dist/codecUtils/box.js";
import { makeParseArrayWithTransform, parseArray } from "../dist/parseArray.js";

test("empty", () => expect(parseArray("{}")).toEqual([]));
test("empty string", () => expect(parseArray('{""}')).toEqual([""]));
test("numerics", () => expect(parseArray("{1,2,3}")).toEqual(["1", "2", "3"]));
test("strings", () => expect(parseArray("{a,b,c}")).toEqual(["a", "b", "c"]));
test("escaped", () =>
  expect(parseArray('{"\\"\\"\\"","\\\\\\\\\\\\"}')).toEqual([
    '"""',
    "\\\\\\",
  ]));
test("mixed", () =>
  expect(
    parseArray(
      '{{3021,663,"PATIENT SISTER",2013},{9876,336,"IMPATIENT SISTER",2014}}',
    ),
  ).toEqual([
    ["3021", "663", "PATIENT SISTER", "2013"],
    ["9876", "336", "IMPATIENT SISTER", "2014"],
  ]));
test("null", () => expect(parseArray("{NULL,NULL}")).toEqual([null, null]));

test("numerics parsed", () => expect(intArray("{1,2,3}")).toEqual([1, 2, 3]));
test("numerics parsed with indicies", () =>
  expect(intArray("[0:2]={1,2,3}")).toEqual([1, 2, 3]));

test("parses box array using ; delimeter", () => {
  const boxArrayParser = makeParseArrayWithTransform(parseBox, ";");
  expect(boxArrayParser("{(13,17),(7,11);(17,13),(11,7)}")).toEqual([
    { a: { x: 13, y: 17 }, b: { x: 7, y: 11 } },
    { a: { x: 17, y: 13 }, b: { x: 11, y: 7 } },
  ]);
});

function intArray(string: string) {
  return parseArray(string).map((value) => parseInt(value, 10));
}
