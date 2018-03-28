var express = require("express");
var app = express();
var request = require("request");
var Twitter = require('twitter');
var bodyParser = require("body-parser");
var texts = [];

app.use(bodyParser.urlencoded({extended: true}));

var client = new Twitter({
  consumer_key: '...',
  consumer_secret: '...',
  access_token_key: '...',
  access_token_secret: '...'
});

//define routes
app.get("/", function(req, res){
    res.render("search.ejs");
});

app.get("/results", function(req, res){
    texts = [];
    var query = req.query.search;
    var params = {
        q : query, 
        result_type: "recent",
        lang: "en",
        count: 11
    };
    client.get('search/tweets', params, function(error, tweets, response) {
        console.log(tweets);
        for (var i = 0; i < 10; i++){
            texts.push(tweets.statuses[i].text);
        }
        res.render("results.ejs", {texts: texts});
    });
});


app.listen(3000);
