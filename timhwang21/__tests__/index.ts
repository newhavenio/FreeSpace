import {
  EMPTY_LIST,
  fromArray,
  toArray,
  cons,
  isEmpty,
  isNotEmpty,
  head,
  tail,
  last,
  foldL,
  foldR,
  map,
  length,
  reverse,
  id,
  compose
} from "../src";

describe("fromArray()", () => {
  it("transforms an array into a list", () => {
    expect(fromArray([1, 2, 3, 4, 5])).toEqual(
      cons(1, cons(2, cons(3, cons(4, cons(5, EMPTY_LIST)))))
    );
  });

  it("transforms an empty array into an empty list", () => {
    expect(fromArray([])).toBe(EMPTY_LIST);
  });
});

describe("toArray()", () => {
  it("transforms a list into an array", () => {
    expect(
      toArray(cons(1, cons(2, cons(3, cons(4, cons(5, EMPTY_LIST))))))
    ).toEqual([1, 2, 3, 4, 5]);
  });

  it("transforms an empty list into an empty array", () => {
    expect(toArray(EMPTY_LIST)).toEqual([]);
  });
});

describe("cons()", () => {
  it("constructs a list", () => {
    expect(cons(3, cons(2, cons(1, EMPTY_LIST)))).toEqual({
      head: 3,
      tail: { head: 2, tail: { head: 1, tail: EMPTY_LIST } }
    });
  });
});

describe("isEmpty()", () => {
  it("returns true for empty lists", () => {
    expect(isEmpty(EMPTY_LIST)).toBe(true);
    expect(isEmpty(cons(1, EMPTY_LIST))).toBe(false);
  });
});

describe("isNotEmpty()", () => {
  it("returns false for empty lists", () => {
    expect(isNotEmpty(EMPTY_LIST)).toBe(false);
    expect(isNotEmpty(cons(1, EMPTY_LIST))).toBe(true);
  });
});

describe("head()", () => {
  it("returns the head of a list", () => {
    expect(head(cons(1, EMPTY_LIST))).toBe(1);
  });
});

describe("tail()", () => {
  it("returns the tail of a list", () => {
    expect(tail(cons(1, cons(2, cons(3, EMPTY_LIST))))).toEqual(
      cons(2, cons(3, EMPTY_LIST))
    );
  });
});

describe("last()", () => {
  it("returns the last element of a list", () => {
    expect(last(cons(1, cons(2, cons(3, EMPTY_LIST))))).toEqual(3);
  });
});

describe("foldL()", () => {
  it("returns the accumulator for empty lists", () => {
    const folder = (_1: unknown, _2: unknown) => "lol";
    const acc = "accumulator";
    expect(foldL(folder, acc, EMPTY_LIST)).toBe(acc);
  });

  it("folds lists into the accumulator using the folding function", () => {
    const multiply = (a: number, b: number) => a * b;
    expect(foldL(multiply, 1, fromArray([1, 2, 3, 4, 5]))).toBe(
      1 * 2 * 3 * 4 * 5
    );
  });

  it("is left-associative", () => {
    const subtract = (a: number, b: number) => a - b;
    expect(foldL(subtract, 0, fromArray([1, 2, 3, 4, 5]))).toBe(
      0 - 1 - 2 - 3 - 4 - 5
    );
  });
});

describe("foldR()", () => {
  it("returns the accumulator for empty lists", () => {
    const folder = (_1: unknown, _2: unknown) => "lol";
    const acc = "accumulator";
    expect(foldR(folder, acc, EMPTY_LIST)).toBe(acc);
  });

  it("folds lists into the accumulator using the folding function", () => {
    const multiply = (a: number, b: number) => a * b;
    expect(foldR(multiply, 1, fromArray([1, 2, 3, 4, 5]))).toBe(
      1 * 2 * 3 * 4 * 5
    );
  });

  it("is right-associative", () => {
    const subtract = (a: number, b: number) => a - b;
    expect(foldR(subtract, 0, fromArray([1, 2, 3, 4, 5]))).toBe(
      1 - (2 - (3 - (4 - (5 - 0))))
    );
  });
});

describe("map()", () => {
  it("maps the mapper function over the list", () => {
    const square = (n: number) => n ** 2;
    expect(map(square, fromArray([1, 2, 3, 4, 5]))).toEqual(
      fromArray([1, 4, 9, 16, 25])
    );
  });

  describe("obeys functor laws", () => {
    const list = fromArray([1, 2, 3, 4, 5]);

    it("Law #1: identity functions are preserved", () => {
      expect(map(id, list)).toEqual(id(list));
    });

    it("Law #2: composition of functions are preserved", () => {
      const f1 = (x: number) => (x - 2) * 3;
      const f2 = (x: number) => x ** 4 + 1;
      expect(
        map(
          compose(
            f1,
            f2
          ),
          list
        )
      ).toEqual(map(f1, map(f2, list)));
    });
  });
});

describe("length()", () => {
  it("returns the length of a list", () => {
    const array = [1, 2, 3, 4, 5];

    expect(length(fromArray(array))).toEqual(array.length);
  });
});

describe("reverse()", () => {
  it("reverses a list", () => {
    const array = [1, 2, 3, 4, 5];

    expect(reverse(fromArray(array))).toEqual(
      fromArray(array.slice().reverse())
    );
  });
});
