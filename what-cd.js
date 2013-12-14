var WhatCD = require("whatcd");
var PutIO = require('put.io-v2');
var sleep = require('sleep');
var http = require('http');

var api = new PutIO("TOKEN-HERE");
var client = new WhatCD("https://what.cd", "USERNAME", "PASSWORD");



client.top10_torrents(function(err, data) {
    if(err) {
        return console.log(err);
    }

    for(var i = 0; i < data.length; i++) {
        for(var j = 0; j < data[i].results.length; j++) {
            timeout(client, data[i].results[j]);
        }
    }
});

function timeout(client, data) {
    client.torrent({id: data.torrentId}, function(err,data){
        if(err) {
            return console.log(err);
        }
        console.log(data.torrent.id);



        api.transfers.add('https://what.cd/torrents.php?action=download&id='+ data.torrent.id+'&authkey=6463b1c5ee3ae28c9851e9889c128336&torrent_pass=zuleuwqrjeadavd29a3n0vif5v3i4d47', function(res) {
            console.log(res);
        });
        sleep.sleep(2);
    });


    var options = {
        host: 'what.cd',
        port: 80,
        path: '/torrents.php?action=download&id='+data.torrentId
    };

    http.get(options, function(resp){
        resp.on('data', function(chunk){
            console.log(resp);
        });
    }).on("error", function(e){
            console.log("Got error: " + e.message);
        });
}

api.files.list(0, function(data) {
    for(var i in data.files) {
        //console.log(data.files[i].name);
    }
});
