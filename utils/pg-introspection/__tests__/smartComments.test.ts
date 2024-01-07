import { parseSmartComment } from "../src/smartComments.js";

describe("parseSmartComment", () => {
  it("should return an empty object when input is undefined", () => {
    const result = parseSmartComment();
    expect(result).toEqual({
      tags: {},
    });
  });

  it("should parse smart comment with description and tags", () => {
    const input = `
      This is a description.
      @tag1 value1
      @tag2 value2
      @tag3
      This is also a description.
    `;
    const result = parseSmartComment(input);
    expect(result).toEqual({
      tags: {
        tag1: "value1",
        tag2: "value2",
        tag3: true,
      },
      description: "This is a description.\nThis is also a description.",
    });
  });

  it("should parse smart comment with multiple values for a tag", () => {
    const input = `
      @tag1 value1
      @tag1 value2
      @tag1 value3
    `;
    const result = parseSmartComment(input);
    expect(result).toEqual({
      tags: {
        tag1: ["value1", "value2", "value3"],
      },
    });
  });

  it("should ignore empty lines", () => {
    const input = `

      @tag1 value1

      @tag2 value2


      @tag3
    `;
    const result = parseSmartComment(input);
    expect(result).toEqual({
      tags: {
        tag1: "value1",
        tag2: "value2",
        tag3: true,
      },
    });
  });
});
