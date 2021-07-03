const person = {
  name: "李四",
  sex: "男",
  age: 18,
};

// console.log("name" in person);
// console.log(delete person["age"]);
// console.log(Object.keys(person));

Reflect.has(person, "name");
Reflect.defineProperty(person, "age");
Reflect.ownKeys(person);
