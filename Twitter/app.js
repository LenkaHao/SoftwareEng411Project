var express = require("express");
var app = express();
var request = require("request");
var twit = require("twit");
var config = require("./config.js");
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

var Twitter = new twit(config);
var tweets = [];

app.get("/", function(req, res){
    res.render("search.ejs");
});

app.get("/results", function(req, res){
    var query = "#" + req.query.search;
    console.log(query);
    var params = {
        q : query, 
        result_type: "recent",
        lang: "en",
        count: 11
    };
    Twitter.get('search/tweets', params, function(err, data, response) {
        if (!err){
            for (var i = 0; i < 10; i++){
                tweets.push(data.statuses[i].text);
            }
            res.render("results.ejs", {tweets: tweets});
        }
    });
});


app.listen(3000);
