export type EmptyList = {};
export const EMPTY_LIST: EmptyList = {};
export type NonEmptyList<T> = { head: T; tail: List<T> };
export type List<T> = NonEmptyList<T> | EmptyList;

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
export function head<T>(l: NonEmptyList<T>): T {
  return l.head;
}

/**
 * Retrieves the tail of a list. Must operate on a non-empty list.
 *
 * tail :: [t] -> t
 */
export function tail<T>(l: NonEmptyList<T>): List<T> {
  return l.tail;
}

/**
 * Retrieves the last element of a list. Must operate on a non-empty list.
 *
 * last :: [t] : t
 */
export function last<T>(l: NonEmptyList<T>): List<T> {
  return isNotEmpty(l.tail) ? last(l.tail) : l.head;
}

/**
 * Right fold. Folds a list into an accumulator.
 *
 * fold :: (a -> b -> b) -> b -> [a] -> b
 */
export function fold<A, B>(fn: (a: A, b: B) => B, acc: B, l: List<A>): B {
  return isNotEmpty(l) ? fold(fn, fn(head(l), acc), tail(l)) : acc;
}

/**
 * Maps a function over the list.
 *
 * map :: (a -> b) -> [a] -> [b]
 */
export function map<A, B>(fn: (a: A) => B, l: List<A>): List<B> {
  return fold((head: A, acc: List<B>) => cons(fn(head), acc), EMPTY_LIST, l);
}

/**
 * Retrieves the length of a list.
 *
 * list :: [t] -> Int
 */
export function length(l: List<any>): number {
  return fold((_: unknown, b: number) => b + 1, 0, l);
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
  return fold(flip(cons), EMPTY_LIST, l);
}
