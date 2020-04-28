const controlls = document.querySelector('.controls');
let fullscreen;
function openFullScreen(e) {
  e.preventDefault();
  const video = fullscreen = e.target
  video.classList.add('fullscreen');
  controlls.classList.add('open');
  addFilter(video);
  drawG();
}

function allCameras(e, input) {
  const video = document.querySelectorAll('.video');
  video.forEach((v) => {
    v.classList.remove('fullscreen');
    v.muted = true;
    v.volume = 0;
  });

  controlls.classList.remove('open');
  input.value = 0;
}

function setVolume(event) {
  const video = document.querySelector('.fullscreen');
  const volume = event.target.value;
  if (volume > 0) {
    video.muted = false
    video.volume = volume;
  } else {
    video.muted = true
    video.volume = volume;
  }
}

function addFilter(target) {
  const brightness = target.getAttribute(`data-brightness`);
  const contrast = target.getAttribute(`data-contrast`);
  target.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
}

function updateFilter(target) {
  const brightness = document.querySelector(`.controls__brightness`);
  const contrast = document.querySelector(`.controls__contrast`);
  if (brightness)
    target.dataset.brightness = brightness.value;
  if (contrast)
    target.dataset.contrast = contrast.value;
  addFilter(target);
}

function drawG() {
  const volume = document.querySelectorAll(`.volume`);
  const context = new (window.AudioContext || window.webkitAudioContext)();

  const transfer = context.createChannelMerger(1);
  transfer.connect(context.destination);

  document.querySelectorAll('.video').forEach((videoSource) => {
    const source = context.createMediaElementSource(videoSource);
    source.connect(transfer);
  });

  const analyser = context.createAnalyser();
  analyser.fftSize = 32;
  transfer.connect(analyser);

  const streamData = new Uint8Array(analyser.frequencyBinCount);

  function update() {

    requestAnimationFrame(update);

    analyser.getByteFrequencyData(streamData);

    volume.forEach((vol, i) => {
      vol.style.height = streamData[i] + 'px';
    });
  };
  update();
}


document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');

  const button = document.querySelector('.controls__button');
  const inputVolume = document.querySelector('.controls__volume');
  grid.addEventListener('click', openFullScreen);

  button.addEventListener('click', e => {
    allCameras(e, inputVolume);
  });

  controlls.addEventListener('change', e => {
    if (e.target.classList.contains('controls__volume')) {
      setVolume(e);
    } else if (e.target.classList.contains('controls__brightness') || e.target.classList.contains('controls__contrast')) {
      updateFilter(fullscreen)
    }
  });
});
