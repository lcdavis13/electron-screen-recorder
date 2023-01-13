const { desktopCapturer, remote, ipcRenderer } = require('electron');

const { writeFile } = require('fs');

const { dialog, Menu } = remote;

// Buttons

const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  // mediaRecorder.start();
  // startBtn.classList.add('is-danger');
  // startBtn.innerText = 'Recording';
};

const stopBtn = document.getElementById('stopBtn');

stopBtn.onclick = e => {
  //mediaRecorder.stop();
  //startBtn.classList.remove('is-danger');
  //startBtn.innerText = 'Start';
};

const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

// Get the available video sources
async function getVideoSources() {
  const inputSources = await desktopCapturer.getSources({
    types: ['window', 'screen']
  });

  const videoOptionsMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      };
    })
  );
  
  videoOptionsMenu.popup();
}

// Change the videoSource window to record
async function selectSource(source) {

  videoSelectBtn.innerText = source.name;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id
      }
    }
  };

  // Create a Stream
  const stream = await navigator.mediaDevices
    .getUserMedia(constraints);

	//spawn overlay to play stream. 
  ipcRenderer.send('spawn-overlay', {stream});
}

