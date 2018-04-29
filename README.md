# SoftwareEng411Project

Watson Part Description:

IBM Watson offers two empathy analyzing services: “Personality Insights” and “Tone Analyzer”. 
The reason we choose the latter instead of the “Personality Insights” is that “Personality Insights” is more focused on personal 
characteristics and offers personalized recommendations and targeted messaging. But “Tone Analyzer” is more focused on the emotional 
analyzing, which is more suitable to our web application.

To integrate this function in our application, we first use Twitter API to extract the twitters that related to the hashtag we entered.
Then we use IBM Watson “Tone Analyzer” service to analyze these twitters. We choose the “general purpose endpoint” to approach our goal. 
This service allows up to 128KB of total input content or 1000 individual sentences in English or French. We can choose to analyze either
sentence by sentence or all the twitters as a whole document. In either way, we can get the tone and score results. 
The score is between 0.5 to 1. A score below 0.5 will be omitted, and a score greater than 0.75 indicates a high likelihood that the 
tone is perceived in the content. 


Why use Node.JS + Express?

One of the reasons we decided to use Node.JS is its ease of use. Some of our group was already familiar with using it, and it proved 
simple enough to learn for the rest. Node.JS is known for being a top tool for multi-user and real time web applications which is perfect
for what we are trying to accomplish. With its helpful built in tools and packages, along with the fact that it utilizes javascript which 
is becoming more popular, Node.JS seemed to be the perfect choice for us. 

Using Express was a given after we chose to use Node.JS as it helps cut down on a lot of work with its helpful packages. 
It also is the most popular framework for Node.JS. 

We hope you enjoy using our Application!
