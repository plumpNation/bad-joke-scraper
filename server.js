'use strict';

let fetch = require('node-fetch');

fetch('http://www.rinkworks.com/jokes/').then(function (response) {
  return response.text();
})
.then(function (text) {
  console.log(text);
});
