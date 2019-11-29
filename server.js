const fs = require('fs');
const express = require('express');
const app = express();
const ytdl = require('ytdl-core');

const BACKGROUND_VIDEO_ID = './json/bcgID.json';

app.use(express.static('public'));
app.listen(8080);

app.get('/bcg', (req, res) => {
    let jsonArray = fs.readFileSync(BACKGROUND_VIDEO_ID);
    let bcgID = JSON.parse(jsonArray);
    console.log(bcgID);
    let item = bcgID[Math.floor(Math.random()*bcgID.length)];
    console.log(item);

    ytdl.getInfo(item, (err, info) => {
        if (err) throw err;
        let format = ytdl.chooseFormat(info.formats, { quality: "highest" , filter: format => format.container === 'mp4'});
        if (format) {
            console.log('Format found!');
        }
    });

    res.writeHead(200, {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename=' + item
    });

    ytdl('http://www.youtube.com/watch?v=' + item, { filter: (format) => format.container === 'mp4' })
        .pipe(res)
});

app.get('/dl', (req, res) => {
    let videoId = req.query.v;
    let type = req.query.t;
    console.log(videoId);
    console.log(type);

    if (!ytdl.validateID(videoId)) {
        res.sendStatus(404);
    }

    ytdl.getInfo(videoId, (err, info) => {
        if (err) throw err;
        let format = ytdl.chooseFormat(info.formats, { quality: "highest" , filter: format => format.container === type});
        if (format) {
            console.log('Format found!');
        }
    });

    let contentType = '';
    if (type === 'mp4') {
        contentType = 'video/' + type;
    } else {
        contentType = 'audio/' + type;
    }

    res.writeHead(200, {
       'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename=' + videoId
    });
    ytdl('http://www.youtube.com/watch?v=' + videoId)
        .pipe(res)
});