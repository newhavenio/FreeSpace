export type EmptyList = {};
export const EMPTY_LIST: EmptyList = {};
export type NonEmptyList<T> = { head: T; tail: List<T> };
export type List<T> = NonEmptyList<T> | EmptyList;

class EmptyListError extends Error {
  constructor() {
    super("Cannot be called on an empty list");
  }
}

/**
 * Array to list transformer.
 */
export function fromArray<T>(a: T[]): List<T> {
  if (a.length === 0) {
    return EMPTY_LIST;
  } else {
    const [head, ...tail] = a;
    return cons(head, tail.length > 0 ? fromArray(tail) : EMPTY_LIST);
  }
}

/**
 * List to array transformer.
 */
export function toArray<T>(l: List<T>): T[] {
  return isNotEmpty(l) ? [l.head, ...toArray(l.tail)] : [];
}

/**
 * List constructor.
 *
 * cons :: t -> [t] -> [t]
 */
export function cons<T>(head: T, tail: List<T>): List<T> {
  return { head, tail };
}

/**
 * Type narrower.
 *
 * isEmpty :: [t] -> Bool
 * @TODO Typescript bug?
 *
 * `isEmpty` cannot be used to type narrow, whereas `isNotEmpty` works fine.
 * They are conceptually identical, just flipped, so it's unclear why this
 * occurs. Should file an issue.
 */
export function isEmpty<T>(l: List<T>): l is EmptyList {
  return Object.keys(l).length === 0;
}

/**
 * Type narrower.
 *
 * isNotEmpty :: [t] -> Bool
 */
export function isNotEmpty<T>(l: List<T>): l is NonEmptyList<T> {
  return !isEmpty(l);
}

/**
 * Retrieves the head of a list. Must operate on a non-empty list.
 *
 * head :: [t] -> t
 */
export function head<T>(l: List<T>): T {
  if (isNotEmpty(l)) {
    return l.head;
  }
  throw new EmptyListError();
}

/**
 * Retrieves the tail of a list. Must operate on a non-empty list.
 *
 * tail :: [t] -> t
 */
export function tail<T>(l: List<T>): List<T> {
  if (isNotEmpty(l)) {
    return l.tail;
  }
  throw new EmptyListError();
}

/**
 * Retrieves the last element of a list. Must operate on a non-empty list.
 *
 * last :: [t] : t
 */
export function last<T>(l: List<T>): List<T> {
  if (isNotEmpty(l)) {
    return isNotEmpty(l.tail) ? last(l.tail) : l.head;
  }
  throw new EmptyListError();
}

/**
 * Left fold. Folds a list into an accumulator.
 *
 * Starts from the left side of the list and is left-associative.
 *
 * foldL :: (a -> b -> b) -> b -> [a] -> b
 */
export function foldL<A, B>(fn: (b: B, a: A) => B, acc: B, l: List<A>): B {
  return isNotEmpty(l) ? foldL(fn, fn(acc, head(l)), tail(l)) : acc;
}

/**
 * Right fold. Folds a list into an accumulator.
 *
 * Starts from the right side of the list and is right-associative.
 */
export function foldR<A, B>(fn: (a: A, b: B) => B, acc: B, l: List<A>): B {
  return isNotEmpty(l) ? fn(head(l), foldR(fn, acc, tail(l))) : acc;
}
/**
 * Maps a function over the list.
 *
 * map :: (a -> b) -> [a] -> [b]
 */
export function map<A, B>(fn: (a: A) => B, l: List<A>): List<B> {
  return foldR((head: A, acc: List<B>) => cons(fn(head), acc), EMPTY_LIST, l);
}

/**
 * Retrieves the length of a list.
 *
 * list :: [t] -> Int
 */
export function length(l: List<any>): number {
  return foldR((_: unknown, b: number) => b + 1, 0, l);
}

/**
 * Flips a binary function.
 *
 * flip :: (a -> b -> c) -> b -> a -> c
 */
export function flip<A, B, C>(fn: (a: A, b: B) => C): (b: B, a: A) => C {
  return (b, a) => fn(a, b);
}

/**
 * Reverses a list.
 *
 * reverse :: [t] -> [t]
 */
export function reverse<T>(l: List<T>): List<T> {
  return foldL(flip(cons), EMPTY_LIST, l);
}

/**
 * Identity function.
 *
 * id :: t -> t
 */
export function id<T>(x: T) {
  return x;
}

/**
 * Composition of unary functions.
 *
 * compose :: (b -> c) -> (a -> b) -> a -> c
 */
type Fn<A, B> = (a: A) => B;
export function compose<A, B, C>(f: Fn<B, C>, g: Fn<A, B>): Fn<A, C> {
  return (x: A) => f(g(x));
}
