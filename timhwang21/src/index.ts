export type EmptyList = {};
export const EMPTY_LIST: EmptyList = {};
export type NonEmptyList<T> = { head: T; tail: List<T> };
export type List<T> = NonEmptyList<T> | EmptyList;

export function unit<T>(head: T, tail: List<T>): List<T> {
  return { head, tail };
}
export function cons<T>(a: T, l: List<T>): List<T> {
  return unit(a, l);
}
export function isEmpty<T>(l: List<T>): l is EmptyList {
  return Object.keys(l).length === 0;
}
export function isNotEmpty<T>(l: List<T>): l is NonEmptyList<T> {
  return !isEmpty(l);
}
export function head<T>(l: NonEmptyList<T>): T {
  return l.head;
}
export function tail<T>(l: NonEmptyList<T>): List<T> {
  return l.tail;
}
export function last<T>(l: List<T>): List<T> | never {
  return isNotEmpty(l)
    ? isNotEmpty(l.tail)
      ? last(l.tail)
      : l.head
    : Error("Empty list");
}
export function fold<A, B>(fn: (a: A, b: B) => B, acc: B, l: List<A>): B {
  return isNotEmpty(l) ? fold(fn, fn(head(l), acc), tail(l)) : acc;
}
export function map<A, B>(fn: (a: A) => B, l: List<A>): List<B> {
  return fold((head: A, acc: List<B>) => cons(fn(head), acc), EMPTY_LIST, l);
}
export function length(l: List<any>): number {
  return fold((_: unknown, b: number) => b + 1, 0, l);
}
export function flip<A, B, C>(fn: (a: A, b: B) => C): (b: B, a: A) => C {
  return (b, a) => fn(a, b);
}
export function reverse<T>(l: List<T>): List<T> {
  return fold(flip(cons), EMPTY_LIST, l);
}
