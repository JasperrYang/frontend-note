export {}
class person {
  // 类型属性必须赋值
  public name: string
  private age: number
  protected readonly gender: string

  constructor(name: string, age: number, gender: string) {
    this.name = name
    this.age = age
    this.gender = gender
  }

  sayHi(msg: string) {
    console.log(`I am ${this.name}, ${msg}`);
  }
}
