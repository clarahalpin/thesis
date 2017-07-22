function draw_counter(resp) {
    //console.log(resp);
    var count = resp.aggregations.count_by_type.value;
    $("#counter").html(count.toFixed(0));
};

function start_counter() {
    var query = {
        "aggs": {
            "count_by_type": {
                "value_count": {
                    "field": "id"
                }
            }
        },
        "size": 0
    };

    client.search({
        index: 'user_live_updated',
        type: 'tweet',
        body: query
    }).then(draw_counter, function (err) {
        console.trace(err.message);
    });
};



