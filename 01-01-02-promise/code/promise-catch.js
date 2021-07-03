// then
promise.then(
  function (data) {
    // success
  },
  function (err) {
    // error
  }
);

// catch
promise
  .then(function (data) {
    // success
  })
  .catch(function (err) {
    // error
  });
