const api = new Api({
  scheme: 'http',
  baseUrl: 'google.fr/api/v1',
  afterEach: [() => {}],
  timeout: 5000,
  retriesCount: 0,
  headers: {
    'content-type': 'Application/JSON',
    'X-Auth-Token': () => {}
  },
  token: () => {}
});


api.get('posts', options)
api.post('posts', body, options)
api.put('posts', body, options)
api.patch('posts', body, options)
api.delete('posts', options)


api.get('posts')
  .then(res => {
    console.log(res);
    /*
      { status: 200, body: {} }
    */
  })
  .catch(err => {});