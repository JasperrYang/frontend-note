function add(data, index) {
  return new Promise((resolve, reject) => {
    try {
      resolve(data * index);
    } catch (error) {
      reject(new Error(error));
    }
  });
}
add(10, 1)
  .then(
    (value) => {
      console.log(value);
      return value;
    },
    (error) => {
      console.log(error);
    }
  )
  .then((value) => {
    console.log(value + 1);
  });
