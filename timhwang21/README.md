# Typescript Lists

Implements Lisp-like lists in Typescript. Also acts as a sample Typescript project scaffold with basic unit tests.

Specifically, we use the following type constructor to create recursive lists. Note that the type constructor `List` has a data constructor `NonEmptyList` which recursively references `List`.

```typescript
type EmptyList = {};
const EMPTY_LIST: EmptyList = {};
type NonEmptyList<T> = { head: T; tail: List<T> };

type List<T> = NonEmptyList<T> | EmptyList;
```

## Getting started

```sh
git clone git@github.com:newhavenio/FreeSpace.git
cd timhwang21
yarn
yarn ts-node
```

```typescript
import * as L from './src'
// play with list functions
```
