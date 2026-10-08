import DiggablePromise from "../lib/DiggablePromise.js";

describe('DiggablePromise', () => {

  test("Correct object structure: ", () => {
    expect(typeof DiggablePromise).toBe("function");

    expect(Object.getOwnPropertyDescriptor(DiggablePromise, "length")).toEqual({
      value: 1,
      writable: false,
      enumerable: false,
      configurable: true
    });

    expect(Object.getOwnPropertyDescriptor(DiggablePromise, "name")).toEqual({
      value: "DiggablePromise",
      writable: false,
      enumerable: false,
      configurable: true
    });

    var propNames = Object.getOwnPropertyNames(DiggablePromise);
    var lengthIndex = propNames.indexOf("length");
    var nameIndex = propNames.indexOf("name");

    //"The `length` property comes before the `name` property on built-in functions"
    expect(lengthIndex >= 0 && nameIndex === lengthIndex + 1).toBe(true);

  });
});