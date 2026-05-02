import {
  groupBy,
  maskCardNumber,
  range,
  validatePassword,
  add,
  isPrime,
  reverseString,
  getCharactersCount,
  formatDate,
  deepEqual,
} from "./utils";

describe("validatePassword", () => {
  test("should return true for a valid password", () => {
    expect(validatePassword("Password1!")).toBe(true);
  });

  test("should return false for a password without uppercase letters", () => {
    expect(validatePassword("password1!")).toBe(false);
  });

  test("should return false for a password without lowercase letters", () => {
    expect(validatePassword("PASSWORD1!")).toBe(false);
  });

  test("should return false for a password without digits", () => {
    expect(validatePassword("Password!")).toBe(false);
  });

  test("should return false for a password without special characters", () => {
    expect(validatePassword("Password1")).toBe(false);
  });

  test("should return false for a password shorter than 8 characters", () => {
    expect(validatePassword("Pass1!")).toBe(false);
  });
});

describe("maskCardNumber", () => {
  test("should mask all but the last four digits of the card number", () => {
    expect(maskCardNumber("1234567812345678")).toBe("**** **** **** 5678");
  });
});

describe("range", () => {
  test("should generate a range of numbers with the specified step", () => {
    expect(Array.from(range(0, 10, 2))).toEqual([0, 2, 4, 6, 8]);
  });

  test("should generate a range of numbers with the default step of 1", () => {
    expect(Array.from(range(0, 10))).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("should generate an empty range if start is greater than or equal to end", () => {
    expect(Array.from(range(10, 0))).toEqual([]);
  });
});

describe("groupBy", () => {
  type Person = { name: string; city: string };

  test("should group an array of objects by a specified key", () => {
    const people: Person[] = [
      { name: "Alice", city: "Cairo" },
      { name: "Bob", city: "Paris" },
      { name: "Carol", city: "Cairo" },
    ];
    expect(groupBy(people, "city")).toEqual({
      Cairo: [
        { name: "Alice", city: "Cairo" },
        { name: "Carol", city: "Cairo" },
      ],
      Paris: [{ name: "Bob", city: "Paris" }],
    });
  });

  test("should return an empty object when given an empty array", () => {
    expect(groupBy([], "city")).toEqual({});
  });
});

describe("add", () => {
  test("should return the sum of two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("should handle negative numbers", () => {
    expect(add(-5, 3)).toBe(-2);
  });

  test("should handle zero", () => {
    expect(add(0, 5)).toBe(5);
  });

  test("should handle decimal numbers", () => {
    expect(add(1.5, 2.5)).toBeCloseTo(4);
  });
});

describe("isPrime", () => {
  test("should return true for prime numbers", () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(17)).toBe(true);
  });

  test("should return false for non-prime numbers", () => {
    expect(isPrime(0)).toBe(false);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(15)).toBe(false);
  });

  test("should return false for negative numbers", () => {
    expect(isPrime(-5)).toBe(false);
  });
});

describe("reverseString", () => {
  test("should reverse a string", () => {
    expect(reverseString("hello")).toBe("olleh");
  });

  test("should return an empty string when given an empty string", () => {
    expect(reverseString("")).toBe("");
  });

  test("should handle single character", () => {
    expect(reverseString("a")).toBe("a");
  });

  test("should handle strings with spaces", () => {
    expect(reverseString("hello world")).toBe("dlrow olleh");
  });
});

describe("getCharactersCount", () => {
  test("should count character occurrences in a string", () => {
    expect(getCharactersCount("hello")).toEqual({
      h: 1,
      e: 1,
      l: 2,
      o: 1,
    });
  });

  test("should return an empty object for an empty string", () => {
    expect(getCharactersCount("")).toEqual({});
  });

  test("should handle repeated characters", () => {
    expect(getCharactersCount("aaa")).toEqual({ a: 3 });
  });

  test("should handle mixed case", () => {
    expect(getCharactersCount("AaBbAa")).toEqual({ A: 2, a: 2, B: 1, b: 1 });
  });
});

describe("formatDate", () => {
  test("should format date as YYYY-MM-DD", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("2024-01-15");
  });

  test("should pad single digit months and days", () => {
    const date = new Date("2024-01-05");
    expect(formatDate(date)).toBe("2024-01-05");
  });

  test("should handle leap year dates", () => {
    const date = new Date("2024-02-29");
    expect(formatDate(date)).toBe("2024-02-29");
  });

  test("should handle end of year dates", () => {
    const date = new Date("2024-12-31");
    expect(formatDate(date)).toBe("2024-12-31");
  });
});

describe("deepEqual", () => {
  test("should return true for equal primitives", () => {
    expect(deepEqual(5, 5)).toBe(true);
    expect(deepEqual("test", "test")).toBe(true);
    expect(deepEqual(true, true)).toBe(true);
  });

  test("should return false for different primitives", () => {
    expect(deepEqual(5, 10)).toBe(false);
    expect(deepEqual("test", "test2")).toBe(false);
  });

  test("should return true for equal objects", () => {
    expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  test("should return false for objects with different properties", () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  test("should handle nested objects", () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  test("should return true for equal arrays", () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  test("should return false for arrays with different lengths", () => {
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  test("should handle null values", () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
  });
});
