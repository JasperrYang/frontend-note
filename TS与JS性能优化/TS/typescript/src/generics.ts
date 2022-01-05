export {}

function createNumberArray(length: number, value: number) {
  return Array<number>(length).fill(value)
}

function createStringArray(length: number, value: string) {
  return Array<string>(length).fill(value)
}

createNumberArray(3, 100) //[100, 100, 100]

function createArray<T>(length: number, value: T) {
  return Array<T>(length).fill(value)
}

createArray<number>(3, 100) //[100, 100, 100]
