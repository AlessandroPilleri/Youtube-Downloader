let url = document.querySelector('#url');
let type = document.querySelector('#type');

// Cache refresh on page reload
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);

document.querySelector('#submit').addEventListener('click', () => {

  let params = url.value.split("?");
  console.log(params);
  let videoId = params[1];
  console.log(videoId);
  console.log(type.value);

  const fileStream = streamSaver.createWriteStream( 'video.' + type.value);

  fetch('/dl?' + videoId + '&t=' + type.value).then(res => {
    const readableStream = res.body;

    // more optimized
    if (window.WritableStream && readableStream.pipeTo) {
      return readableStream.pipeTo(fileStream)
          .then(() => console.log('done writing'))
    }

    window.writer = fileStream.getWriter();

    const reader = res.body.getReader();
    const pump = () => reader.read()
        .then(res => res.done
            ? writer.close()
            : writer.write(res.value).then(pump));

    pump()
  })
});