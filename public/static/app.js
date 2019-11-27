let url = document.querySelector('#url');

document.querySelector('#submit').addEventListener('click', () => {

  let params = url.value.split("?");
  console.log(params);
  let videoId = params[1];
  console.log(videoId);

  const fileStream = streamSaver.createWriteStream( 'video.mp4');

  fetch('/dl?' + videoId).then(res => {
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