var express = require("express");
var app = express();
var Twitter = require('twitter');
var bodyParser = require("body-parser");
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var mongoose = require("mongoose");
var texts = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

mongoose.connect("mongodb://localhost/tone_analysis");

var client = new Twitter({
  //please see google doc
});


var toneAnalyzer = new ToneAnalyzerV3({
    //please see google doc
});

//hashtag-tone analysis result schema
var toneSchema = new mongoose.Schema({
    hashtag: String,
    anger_score: Number,
	disgust_score: Number,
	fear_score: Number,
	joy_score: Number,
	sadness_score: Number,
	date: {type: Date, default: Date.now()}
});

var Hashtag = mongoose.model("Hashtag", toneSchema);

//define routes
app.get("/", function(req, res){
    res.render("index.html");
});


app.get("/results", function(req, res){
    var query = req.query.search;
    var params = {
        q : query, 
        result_type: "recent",
        lang: "en",
        count: 51
    };
    texts = '';
    
    //look at the database/cache first
    Hashtag.find({hashtag: query}, function(err, foundHashtag){
        if (err){
            console.log(err);
        } else {
            //when the hashtag is not in the database, or when the latest update is an hour ago, create new
            if (!foundHashtag.length){
                client.get('search/tweets', params, function(error, tweets, response) {
                    //get all tweets for tone analysis
                    for (var i = 0; i < 10; i++){
                        texts = texts +  (tweets.statuses[i].text) + '\n';
                    }
                    var toneQuery = {tone_input: texts, content_type:"text/plain", sentences: false};
                    //call tone analyzer api
                    toneAnalyzer.tone(toneQuery, function(err, results){
                        if (err) {
                            console.log(err);
                        } else {
                            //save the tone analysis to database
                            var toneResults = {
                                hashtag: query,
                                anger_score: results["document_tone"]["tone_categories"][0]["tones"][0]["score"],
                                disgust_score: results["document_tone"]["tone_categories"][0]["tones"][1]["score"],
                                fear_score: results["document_tone"]["tone_categories"][0]["tones"][2]["score"],
                                joy_score: results["document_tone"]["tone_categories"][0]["tones"][3]["score"],
                                sadness_score: results["document_tone"]["tone_categories"][0]["tones"][4]["score"]
                            };
                            Hashtag.create(toneResults, function(err, toneResult){
                                if (err){
                                    console.log(err);
                                } else {
                                    //render to the result page
                                    res.render("results.ejs", {toneResult: toneResult});
                                }
                            });
                        }
                    });
                });
            } else {
                //get the timestamp of the last update
                var timestamp = foundHashtag[0].date;
                var currentTime = new Date();
                timestamp = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate(), timestamp.getHours()+1);
                currentTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours());
                //compare to the current time
                if (currentTime.getTime() > timestamp.getTime()){
                    console.log("needs update");
                    //update the database with new results
                    client.get('search/tweets', params, function(error, tweets, response) {
                        //get all tweets for tone analysis
                        for (var i = 0; i < 10; i++){
                            texts = texts +  (tweets.statuses[i].text) + '\n';
                        }
                        var toneQuery = {tone_input: texts, content_type:"text/plain", sentences: false};
                        //call tone analyzer api
                        toneAnalyzer.tone(toneQuery, function(err, results){
                            if (err) {
                                console.log(err);
                            } else {
                                //save the tone analysis to database
                                var updatedResults = {
                                    hashtag: query,
                                    anger_score: results["document_tone"]["tone_categories"][0]["tones"][0]["score"],
                                    disgust_score: results["document_tone"]["tone_categories"][0]["tones"][1]["score"],
                                    fear_score: results["document_tone"]["tone_categories"][0]["tones"][2]["score"],
                                    joy_score: results["document_tone"]["tone_categories"][0]["tones"][3]["score"],
                                    sadness_score: results["document_tone"]["tone_categories"][0]["tones"][4]["score"],
                                    date: currentTime
                                };
                                Hashtag.findOneAndUpdate({hashtag: query}, updatedResults, function(err, updatedHashtag){
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.render("results.ejs", {toneResult: updatedHashtag});
                                    }
                                });
                            }
                        });
                    });
                } else {
                    console.log("no need to update");
                    res.render("results.ejs", {toneResult: foundHashtag[0]});
                }
            }
        }
    });

});


app.listen(3000, function(){
    console.log("Server started");
});
