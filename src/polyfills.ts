/**
 * ES2022+ Polyfills for older browser engines / WebViews / Hermes
 * Ensures @react-navigation v7 works across all environments.
 */

if (typeof (Object as any).hasOwn !== 'function') {
  Object.defineProperty(Object, 'hasOwn', {
    value: function (obj: object, prop: PropertyKey): boolean {
      if (obj == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      return Object.prototype.hasOwnProperty.call(Object(obj), prop);
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

if (typeof (Array.prototype as any).findLast !== 'function') {
  Object.defineProperty(Array.prototype, 'findLast', {
    value: function <T>(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): T | undefined {
      for (let i = this.length - 1; i >= 0; i--) {
        const value = this[i];
        if (predicate.call(thisArg, value, i, this)) {
          return value;
        }
      }
      return undefined;
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

if (typeof (Array.prototype as any).findLastIndex !== 'function') {
  Object.defineProperty(Array.prototype, 'findLastIndex', {
    value: function <T>(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number {
      for (let i = this.length - 1; i >= 0; i--) {
        const value = this[i];
        if (predicate.call(thisArg, value, i, this)) {
          return i;
        }
      }
      return -1;
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

if (typeof (Array.prototype as any).at !== 'function') {
  Object.defineProperty(Array.prototype, 'at', {
    value: function (index: number) {
      const len = this.length;
      const relIndex = Math.trunc(index) || 0;
      const k = relIndex >= 0 ? relIndex : len + relIndex;
      if (k < 0 || k >= len) return undefined;
      return this[k];
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
}
