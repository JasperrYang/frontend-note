class Left {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return this;
  }

  static of(value) {
    return new Left(value);
  }
}

class Right {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return Right.of(fn(this._value));
  }

  static of(value) {
    return new Right(value);
  }
}

function parseJson(value) {
  try {
    return Right.of(JSON.parse(value));
  } catch (e) {
    return Left.of({ error: e.message });
  }
}

let result = parseJson('{ "key": "value" }').map((x) => x.key.toUpperCase());
console.log(result);
