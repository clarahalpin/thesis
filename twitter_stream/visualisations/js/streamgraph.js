$(document).ready(function () {
        var client = new $.es.Client({
            hosts: 'localhost:9212',
            log: 'trace'
        });

        client.ping({
            // ping usually has a 3000ms timeout
            requestTimeout: 1000
        }, function (error) {
            if (error) {
              console.trace('elasticsearch cluster is down!');
            } else {
              console.log("elasticsearch is running");
            }
        });
});