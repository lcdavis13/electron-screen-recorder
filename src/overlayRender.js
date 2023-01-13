const { desktopCapturer, remote, ipcRenderer } = require('electron');

const { writeFile } = require('fs');

const { dialog, Menu } = remote;

  const videoElement = document.querySelector('video');
  
// launch
//async function selectSource(source) {
  const stream = window.webContents.stream;

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Create the Media Recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;

  // Updates the UI
//}

