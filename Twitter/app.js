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

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
    username: '76b58a34-d125-48f0-af28-ebd9a6299321',
    password: 'mTnlcEIn3KLa',
    version: '2016-05-19',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api/'
});



app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));

//define routes
// app.get("/", function(req, res){
//     res.render("search.ejs");
// });



app.get("/results", function(req, res){

    var query = req.query.search;
    var params = {
        q : query, 
        result_type: "recent",
        lang: "en",
        count: 11
    };
    texts = '';
    results = [];

    client.get('search/tweets', params, function(error, tweets, response) {
        //console.log(tweets);
        for (var i = 0; i < 10; i++){
            texts = texts +  (tweets.statuses[i].text) + '\n'
        }

        //res.render("results.ejs", {texts: texts});
        toneAnalyzer.tone(
            {
                tone_input: texts,
                content_type: 'text/plain'
            },
            function(err, tone) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log(JSON.stringify(tone, null, 2));
                    //console.log(tone);
                    results = JSON.stringify(tone, null, 2);
                    console.log(results)
                    //res.render("results.ejs", {results: results});

                }
            }
        );


    });
});


app.listen(3000);
