This application uses MongoDB.

- Data model for tweet analysis: this is the model for each keyword that has been searched by a user. 
  - It works as a cache for as well. When a user makes a request on a hashtag, if the results of that hashtag is in the cache and the lastest update is within an hour, the application displays the results in the cache. Otherwise, it makes API calls, saves the results and display them.
  - This is already implemented.

```json
//tweet analysis schema
"hashtags":[
    {
        "_id": String,
        //the keyword searched by a user
    	"hashtag": String,
        //tone analysis result
    	"anger_score": Number,
		"disgust_score": Number,
		"fear_score": Number,
		"joy_score": Number,
		"sadness_score": Number,
        //time of the latest update
		"date": {type: Date, default: Date.now()},
        "__v": 0
    } 
]
```
