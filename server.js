'use strict';

let cheerio = require('cheerio');

let fetch = require('node-fetch');

fetch('http://www.rinkworks.com/jokes/').then(function (response) {
  return response.text();
})
.then(function (text) {
  let parsedText = cheerio.load(text);

  getJokes(parsedText);
})
.catch(function (err) {
    console.error(err);
})


function getJokes(DOM) {
    let jokes = DOM('.no ul').map(function (i, joke) {

        return joke.children.filter(function (jokeInner) {
            return jokeInner.type === 'tag' && jokeInner.name === 'li';
        })
        .map(function (jokeInner) {
            return jokeInner.children;
        });
    });

    let response = [];

    for (let i = 0; i < jokes.length; i += 2) {
        response = response.concat({
            'question': jokes[i][0].data,
            'answer': jokes[i + 1][0].data
        });
    }

    console.log(JSON.stringify(response, null, 4))
}
