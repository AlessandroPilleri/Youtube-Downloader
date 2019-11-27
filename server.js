const fs = require('fs');
const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

app.use(express.static('public'));
app.listen(8080);

app.get('/dl', (req, res) => {
    let videoId = req.query.v;
    console.log(videoId);
    res.writeHead(200, {
       'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename=' + videoId
    });
    ytdl('http://www.youtube.com/watch?v=' + videoId, { filter: (format) => format.container === 'mp4'})
        .pipe(res)
});