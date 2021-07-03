class Container {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return Container.of(fn(this._value));
  }

  static of(value) {
    return new Container(value);
  }
}

let result = Container.of(5)
  .map((x) => x + 1)
  .map((x) => x * x);

console.log(result._value);
