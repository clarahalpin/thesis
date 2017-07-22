var tweets = [];

function draw_list(resp) {
    console.log(resp);
    var response = resp.hits.hits;
    
    $("#tweet_list").empty();
    for (i = 0; i < response.length; i++) {
        var text = response[i]["_source"]["text"];
    //console.log(text);
    var username = response[i]["_source"]["user"]["screen_name"];
        //console.log(username);
        //tweets[text] = username;
        tweets.push({
            "text": text,
            "username": username
        });
    }

    tweets.forEach(function (i) {
        //console.log(i.username);
        $('#tweet_list').prepend('<li>' + i.text + "<br>" + i.username + '</li>');
    });

};

function start_tweet_list() {
    
    
    var query = {
        "query": {
            "match_all": {}
        },
        "sort": [
            {
                "created_at": {
                    "order": "desc"
                }
            }
        ],
        "size": 10
    };

    client.search({
        index: 'user_live_updated',
        type: 'tweet',
        body: query
    }).then(draw_list, function (err) {
        console.trace(err.message);
    });

};
