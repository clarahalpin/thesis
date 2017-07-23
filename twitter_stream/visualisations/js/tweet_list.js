var tweets = [];

function timeStamp(dateTime) {

    //credit to https://gist.github.com/hurjas/2660489

    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tues";
    weekday[3] = "Wed";
    weekday[4] = "Thurs";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var month = new Array(12);
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";

    // Create an array with the current month, day and time
    var date = [weekday[dateTime.getDay()], dateTime.getDate(), month[dateTime.getMonth()]];

    // Create an array with the current hour, minute and second
    var time = [dateTime.getHours(), dateTime.getMinutes(), dateTime.getSeconds()];

    // Determine AM or PM suffix based on the hour
    var suffix = (time[0] < 12) ? "AM" : "PM";

    // Convert hour from military time
    time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

    // If hour is 0, set it to 12
    time[0] = time[0] || 12;

    // If seconds and minutes are less than 10, add a zero
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }

    // Return the formatted string
    return date.join(" ") + " " + time.join(":") + " " + suffix;
}

function draw_list(resp) {
    $("#tweet_list").html('');
    console.log(resp);
    var response = resp.hits.hits;
    tweets = [];
    for (i = 0; i < response.length; i++) {
        //        console.log(response[i]);
        var text = response[i]["_source"]["text"];
        //console.log(text);
        var username = response[i]["_source"]["user"]["screen_name"];
        //console.log(username);
        //tweets[text] = username;
        var time = new Date(response[i]["_source"]["created_at"]);
        tweets.push({
            "text": text,
            "username": username,
            "time": time
        });
    }

    tweets.forEach(function (i) {
        //console.log(i.username);
        //console.log(i);

        var user = "@" + i.username;

        $('#tweet_list').prepend('<li>' + i.text + "<br>" + "<a href='http://www.twitter.com/" + i.username + "'>" + user + "</a>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + timeStamp(i.time) + '</li>');
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
