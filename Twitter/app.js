var express = require("express");
var app = express();
var request = require("request");
var Twitter = require('twitter');
var bodyParser = require("body-parser");
var texts = [];

app.use(bodyParser.urlencoded({extended: true}));

var client = new Twitter({
  consumer_key: 'TJivXZ42NGVlJHf849HevLUQo',
  consumer_secret: 'PoDfeMTnRTFhnQQsSiYLP9FekwTKsxvZquXCDEGqLMT7OntE6T',
  access_token_key: '3412426126-xHm8s2y8KjVtV3FTP9ngGQFc3cBKdTjh4vhU73H',
  access_token_secret: 'Oa0n1bGsymxZpcyQudX5z7VwDyiLgbSv9IHZxhyGPhz33'
});

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
    
    //Twitter.get('search/tweets', params, function(err, data, response) {
        //var parsedData = JSON.parse(data);
        //if (!err){
            //for (var i = 0; i < 10; i++){
                //console.log(parsedData);
                //tweets.push(data.statuses[i].text);
            //}
            //res.render("results.ejs", {tweets: tweets});
        //}
    //});
});


app.listen(3000);
