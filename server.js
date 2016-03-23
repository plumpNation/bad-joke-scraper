'use strict';

let cheerio   = require('cheerio'),
    fetch     = require('node-fetch'),
    restify   = require('restify'),

    BAD_JOKES = {'jokes': []},

    server    = restify.createServer();

getRinkworksJokes();

server.use(restify.CORS());

server.get('/jokes', respond);
server.head('/jokes', respond);

server.listen(1234, function() {
    console.log('%s listening at %s', server.name, server.url);
});

function getRinkworksJokes() {
    fetch('http://www.rinkworks.com/jokes/').then(function (response) {
        return response.text();
    })
    .then(function (text) {
        let parsedText = cheerio.load(text);

        BAD_JOKES.jokes = BAD_JOKES.jokes.concat(parseJokes(parsedText));
    })
    .catch(function (err) {
        console.error(err);
    });
}

function respond(req, res, next) {
    res.json(BAD_JOKES);
    next();
}

function parseJokes(DOM) {
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

    return response;
}
