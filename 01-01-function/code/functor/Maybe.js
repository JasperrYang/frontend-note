class Maybe {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return this.isNull() ? Maybe.of(null) : Maybe.of(fn(this._value));
  }

  isNull() {
    return this._value === null || this._value === undefined;
  }

  static of(value) {
    return new Maybe(value);
  }
}

// let result = Maybe.of(null).map((x) => x + 1);
// console.log(result);

let result = Maybe.of(10).map((x) => x + 1);
console.log(result._value);
