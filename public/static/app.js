axios.get('/background')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log('ERROR --> Cannot get /background');
    console.error(error);
  })
