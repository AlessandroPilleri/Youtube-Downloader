const fs = require('fs');
const express = require('express');
const app = express();
const youtube = require('youtube-dl');

app.use(express.static('public'));
app.listen(8080);

app.get('/background', function (req, res) {

})

app.get('/video', function (req, res) {
  // var url = req.body; // FIXME: video id from get params
  var videoId = req.query.id;

  var video = youtube('https://www.youtube.com/watch?v=' + videoId,
    ['--format=18'],
    { cwd: __dirname });

  video.on('info', function (info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
  });

  video.on('end', function (info) {
    console.log('Download ended');
  })

  video.pipe(fs.createWriteStream('video.mp4'));
  res.send("OK");
})
