# Mixins

[![version](https://img.shields.io/badge/release-v0.7.0-success)](https://github.com/udibo/mixins/tree/v0.7.0)
[![deno doc](https://img.shields.io/badge/deno-doc-success?logo=deno)](https://doc.deno.land/https/deno.land/x/mixins@v0.7.0/mod.ts)
[![deno version](https://img.shields.io/badge/deno-v1.5.1-success?logo=deno)](https://github.com/denoland/deno/tree/v1.5.1)
[![CI](https://github.com/udibo/mixins/workflows/CI/badge.svg)](https://github.com/udibo/mixins/actions?query=workflow%3ACI)
[![license](https://img.shields.io/github/license/udibo/mixins)](https://github.com/udibo/mixins/blob/master/LICENSE)

This module provides a few basic functions to help combine objects or build up classes from partial classes.

## Features

- Apply mixins to objects, functions, or classes.

## Installation

This is an ES Module written in TypeScript and can be used in Deno projects. ES Modules are the official standard format to package JavaScript code for reuse. A JavaScript bundle is provided with each release so that it can be used in Node.js packages or web browsers.

### Deno

To include it in a Deno project, you can import directly from the TS files.
This module is available in Deno's third part module registry
but can also be imported directly from GitHub using raw content URLs.

```ts
// Import from Deno's third party module registry
import { applyMixins } from "https://deno.land/x/mixins@v0.7.0/mod.ts";
// Import from GitHub
import { applyMixins } "https://raw.githubusercontent.com/udibo/mixins/v0.7.0/mod.ts";
```

### Node.js

Node.js fully supports ES Modules.

If a Node.js package has the type "module" specified in its package.json file, the JavaScript bundle can be imported as a `.js` file.

```js
import { applyMixins } from "./mixins_v0.7.0.js";
```

The default type for Node.js packages is "commonjs".
To import the bundle into a commonjs package, the file extension of the JavaScript bundle must be changed from `.js` to `.mjs`.

```js
import { applyMixins } from "./mixins_v0.7.0.mjs";
```

See [Node.js Documentation](https://nodejs.org/api/esm.html) for more information.

### Browser

Most modern browsers support ES Modules.

The JavaScript bundle can be imported into ES modules.
Script tags for ES modules must have the type attribute set to "module".

```html
<script type="module" src="main.js"></script>
```

```js
// main.js
import { applyMixins } from "./mixins_v0.7.0.js";
```

You can also embed a module script directly into an HTML file by placing the JavaScript code
within the body of the script tag.

```html
<script type="module">
  import { applyMixins } from "./mixins_v0.7.0.js";
</script>
```

See [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) for more information.

## Usage

Below are some examples of how to use each of the functions provided by the mixins module.

### applyMixins

Applies properties of mixins to instance.

Using `applyMixins` to add properties to an object:

```ts
import { applyMixins } from "https://deno.land/x/mixins@v0.7.0/mod.ts";
interface Point {
  x: number;
  y: number;
}
interface TimePoint {
  time: number;
}
interface Point4D extends Point, TimePoint {
  z: number;
}
const point1: Point = { x: 2, y: 3 };
const point2: TimePoint = { time: 5 };
const point3: Point4D = { z: 7 } as Point4D;
applyMixins(point3, [point1, point2]);

point3; // { time: 5, x: 2, y: 3, z: 7 }
```

Using `applyMixins` to add properties to a function:

```ts
import { applyMixins } from "https://deno.land/x/mixins@v0.7.0/mod.ts";
interface Point {
  x: number;
  y: number;
}
interface TimePoint {
  time: number;
}
interface Point4D extends Point, TimePoint {
  (x: number, y: number, z: number, time: number): string;
  z: number;
  toString(): string;
}
const point1: Point = { x: 2, y: 3 };
const point2: TimePoint = { time: 5 };
const point3: Point4D = function (
  x: number,
  y: number,
  z: number,
  time: number,
): string {
  return [x, y, z, time].join(", ");
} as Point4D;
applyMixins(
  point3,
  [point1, point2, { z: 7, toString: function (this: Point4D) {
    return [this.x, this.y, this.z, this.time].join(", ");
  } }],
);

point3(1, 2, 3, 4); // "1, 2, 3, 4"
point3.toString(); // "2, 3, 7, 5"
```

Using `applyMixins` to add properties to a class:

```ts
import { applyMixins } from "https://deno.land/x/mixins@v0.7.0/mod.ts";
interface Point {
  x: number;
  y: number;
}
interface TimePoint {
  time: number;
}
interface Point4D extends Point, TimePoint {
  new (x: number, y: number, z: number, time: number): Point4D;
  z: number;
  toArray(): [number, number, number, number];
  toString(): string;
}
class Point4D {
  static x: number;
  static y: number;
  static z: number;
  static time: number;

  constructor(
    public x: number,
    public y: number,
    public z: number,
    public time: number,
  ) {}

  static example(): string {
    return Point4D.prototype.toArray.call(Point4D).join(", ");
  }

  toString() {
    return this.toArray().join(", ");
  }
}
const point1: Point = { x: 2, y: 3 };
const point2: TimePoint = { time: 5 };
applyMixins(Point4D, [point1, point2, { z: 7 }]);
applyMixins(Point4D.prototype, [{ toArray: function () {
  return [this.x, this.y, this.z, this.time];
} }]);
const point3: Point4D = new Point4D(1, 2, 3, 4);

Point4D.example(); // "2, 3, 7, 5"
point3.toString(); // "1, 2, 3, 4"
```

### applyInstanceMixins

Applies properties of base class prototypes to instance.

```ts
import { applyMixins, applyInstanceMixins } from "https://deno.land/x/mixins@v0.7.0/mod.ts";
class Point {
  constructor(public x: number, public y: number) {}

  getPosition(): string {
    return [this.x, this.y].join(", ");
  }
}
class TimePoint {
  constructor(public time: number) {}

  getTime(): number {
    return this.time;
  }
}
interface Point4D extends Point, TimePoint {
  (x: number, y: number, z: number, time: number): string;
  z: number;
  toString(): string;
}
class Point4DPartial {
  constructor(public z: number) {}

  toString(this: Point4D): string {
    return [this.getPosition(), this.z, this.getTime()].join(", ");
  }
}
const point: Point4D = function (
  x: number,
  y: number,
  z: number,
  time: number,
): string {
  return [x, y, z, time].join(", ");
} as Point4D;
applyInstanceMixins(point, [Point, TimePoint, Point4DPartial]);
applyMixins(point, [{ time: 5, x: 2, y: 3, z: 7 }]);

point(1, 2, 3, 4); // "1, 2, 3, 4"
point.toString(); // "2, 3, 7, 5"
```

### applyClassMixins

Applies properties of base class prototypes to class prototype.

```ts
import { applyMixins, applyClassMixins } from "https://deno.land/x/mixins@v0.7.0/mod.ts";
class Point {
  constructor(public x: number, public y: number) {}

  getPosition(): string {
    return [this.x, this.y].join(", ");
  }
}
class TimePoint {
  constructor(public time: number) {}

  getTime(): number {
    return this.time;
  }
}
interface Point4D extends Point, TimePoint {
  (x: number, y: number, z: number, time: number): string;
  z: number;
  toArray(): [number, number, number, number];
  toString(): string;
}
class Point4D {
  static x: number;
  static y: number;
  static z: number;
  static time: number;

  constructor(
    public x: number,
    public y: number,
    public z: number,
    public time: number,
  ) {}

  static example(): string {
    return Point4D.prototype.toArray.call(Point4D).join(", ");
  }

  toString() {
    return this.toArray().join(", ");
  }
}
class Point4DPartial {
  toArray(this: Point4D): [number, number, number, number] {
    return [this.x, this.y, this.z, this.time];
  }
}
applyClassMixins(Point4D, [Point, TimePoint, Point4DPartial]);
applyMixins(Point4D, [{ time: 5, x: 2, y: 3, z: 7 }]);

Point4D.example(); // "2, 3, 7, 5"

const point: Point4D = new Point4D(1, 2, 3, 4);

point.toArray(); // [1, 2, 3, 4]
point.toString(); // "1, 2, 3, 4"
point.getPosition(); // "1, 2"
point.getTime(); // 4
```

## License

[MIT](LICENSE)
