/** This module is browser compatible. */

/** Applies properties of mixins to instance. */
// deno-lint-ignore no-explicit-any
export function applyMixins<T>(instance: T, mixins: any[]) {
  mixins.forEach((mixin) => {
    Object.getOwnPropertyNames(mixin).forEach((name) => {
      Object.defineProperty(
        instance,
        name,
        Object.getOwnPropertyDescriptor(
          mixin,
          name,
        ) as PropertyDescriptor,
      );
    });
  });
}

/** Applies properties of base class prototypes to instance. */
// deno-lint-ignore no-explicit-any
export function applyInstanceMixins<T>(instance: T, baseCtors: any[]) {
  applyMixins(
    instance,
    baseCtors.map((baseCtor) => baseCtor.prototype ?? baseCtor),
  );
}

/** Applies properties of base class prototypes to class prototype. */
// deno-lint-ignore no-explicit-any
export function applyClassMixins(ctor: Function, baseCtors: any[]) {
  applyInstanceMixins(ctor.prototype, baseCtors);
}
