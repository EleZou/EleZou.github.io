(() => {
  'use strict';
  const {datasets, methods} = window.PNFSURF_DATA;
  const section = document.querySelector('#videos');
  const panel = section.querySelector('#mesh-video-panel');
  const grid = section.querySelector('#mesh-video-grid');
  const template = grid.querySelector('#mesh-video-tile');
  const track = section.querySelector('#mesh-video-track');
  const tabs = [...section.querySelectorAll('[data-mesh-dataset]')];
  const modeButtons = [...section.querySelectorAll('[data-video-mode]')];
  const depthKey = section.querySelector('#mesh-depth-key');
  const toggle = section.querySelector('#mesh-play-toggle');
  const speed = section.querySelector('#mesh-video-speed');
  const scrub = section.querySelector('#mesh-video-time');
  const clock = section.querySelector('#mesh-video-clock');
  const status = section.querySelector('#mesh-video-status');
  const tiles = Object.entries(methods).map(([method, label], index) => {
    const tile = template.content.cloneNode(true);
    const canvas = tile.querySelector('canvas');
    const poster = tile.querySelector('img');
    const link = tile.querySelector('.scene-video-open');
    tile.querySelector('figcaption span').textContent = label;
    link.setAttribute('aria-label', 'Open ' + label + ' full-resolution video');
    poster.dataset.method = method;
    canvas.dataset.method = method;
    grid.append(tile);
    return {method, label, index, canvas, poster, link, context: canvas.getContext('2d', {alpha: false})};
  });

  let scene = datasets[0];
  let mode = 'mesh';
  let phase = 0;
  let clip;
  let playing = false;
  let playback = 0;
  let callback;
  let drawnFrame = -1;

  function formatTime(value) {
    const seconds = Math.floor(value);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  }

  function updateControls() {
    toggle.querySelector('span').textContent = playing ? 'Pause all' : 'Play all';
    toggle.querySelector('path').setAttribute('d', playing ? 'M8 5v14M16 5v14' : 'm8 5 11 7-11 7Z');
    const duration = scene.videoDuration;
    scrub.disabled = !clip || !Number.isFinite(duration) || duration <= 0;
    scrub.value = scrub.disabled ? 0 : Math.round(phase / duration * 1000);
    clock.textContent = scrub.disabled ? '0:00' : formatTime(phase) + ' / ' + formatTime(duration);
    scrub.setAttribute('aria-valuetext', scrub.disabled ? 'Video progress unavailable'
      : formatTime(phase) + ' of ' + formatTime(duration));
  }

  function draw(force = false) {
    if (!clip || track.seeking || track.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    const frame = Math.floor(track.currentTime * 30);
    if (!force && frame === drawnFrame) return;
    drawnFrame = frame;
    const {tileWidth: width, tileHeight: height} = clip;
    // Each canvas shows one tile of the same decoded video frame.
    for (const {index, context} of tiles) {
      context.drawImage(track, (index % 3) * width, Math.floor(index / 3) * height, width, height,
        0, 0, width, height);
    }
    grid.classList.add('has-video-frame');
  }

  function updateFrame() {
    if (!playing) return;
    draw();
    callback = requestAnimationFrame(updateFrame);
  }

  function pause() {
    if (!track.seeking && track.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) phase = track.currentTime;
    playback++;
    playing = false;
    track.pause();
    cancelAnimationFrame(callback);
    status.textContent = '';
    updateControls();
  }

  function fail() {
    pause();
    status.textContent = 'Video could not load. Try again or open an individual clip.';
  }

  async function play() {
    if (!clip) return;
    const id = ++playback;
    if (track.error) {
      track.load();
      track.currentTime = phase;
    }
    playing = true;
    track.playbackRate = Number(speed.value);
    status.textContent = 'Loading video…';
    updateControls();
    try {
      await track.play();
      if (playback !== id) return;
      status.textContent = '';
      updateFrame();
    } catch {
      if (playback === id) fail();
    }
  }

  function loadScene(keepTime = false) {
    const resume = playing;
    pause();
    if (!keepTime) phase = 0;
    if (!scene.videoClips?.[mode]) mode = 'mesh';
    const media = mode === 'mesh' ? scene : scene.videoMaps?.[mode];
    clip = scene.videoClips?.[mode];
    for (const button of modeButtons) {
      const value = button.dataset.videoMode;
      button.hidden = !scene.videoClips?.[value];
      button.setAttribute('aria-pressed', String(value === mode));
    }
    depthKey.hidden = mode !== 'depth';
    section.querySelector('#mesh-video-scene').textContent = scene.scene;
    grid.classList.remove('has-video-frame');
    drawnFrame = -1;
    if (clip) grid.style.setProperty('--mesh-video-ratio', clip.tileWidth + ' / ' + clip.tileHeight);
    for (const {method, label, canvas, poster, link} of tiles) {
      const still = media?.posters?.[method] || scene.images?.[label];
      const source = media?.videos?.[method];
      if (still) poster.src = still;
      else poster.removeAttribute('src');
      if (source) link.href = source;
      else link.removeAttribute('href');
      link.hidden = !source;
      if (clip) {
        canvas.width = clip.tileWidth;
        canvas.height = clip.tileHeight;
      }
    }
    toggle.disabled = !clip;
    track.preload = phase > 0 || resume ? 'auto' : 'none';
    if (clip) track.src = clip.src;
    else track.removeAttribute('src');
    track.load();
    if (clip && phase > 0) track.currentTime = phase;
    updateControls();
    if (resume && clip) play();
  }

  for (const button of modeButtons) {
    button.addEventListener('click', () => {
      const value = button.dataset.videoMode;
      if (value === mode) return;
      mode = value;
      loadScene(true);
    });
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => {
      if (scene.id === tab.dataset.meshDataset) return;
      scene = datasets.find(item => item.id === tab.dataset.meshDataset);
      for (const button of tabs) {
        button.setAttribute('aria-selected', String(button === tab));
        button.tabIndex = button === tab ? 0 : -1;
      }
      panel.setAttribute('aria-labelledby', tab.id);
      loadScene();
    });
    tab.addEventListener('keydown', event => {
      const targets = {
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      const target = tabs[targets[event.key]];
      if (!target) return;
      event.preventDefault();
      target.click();
      target.focus();
    });
  }

  toggle.addEventListener('click', () => playing ? pause() : play());
  speed.addEventListener('change', () => {
    track.playbackRate = Number(speed.value);
  });
  scrub.addEventListener('input', () => {
    const duration = scene.videoDuration;
    phase = Math.min(duration * Number(scrub.value) / 1000, duration - 0.04);
    if (track.preload === 'none') track.preload = 'auto';
    track.currentTime = phase;
    updateControls();
  });

  track.addEventListener('loadeddata', () => draw(true));
  track.addEventListener('seeked', () => draw(true));
  track.addEventListener('timeupdate', () => {
    if (track.seeking || track.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    phase = track.currentTime;
    updateControls();
  });
  track.addEventListener('waiting', () => {
    if (playing) status.textContent = 'Buffering…';
  });
  track.addEventListener('playing', () => {
    if (playing) status.textContent = '';
  });
  track.addEventListener('error', () => {
    if (track.error) fail();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) pause();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting && playing) pause();
    }).observe(panel);
  }
  loadScene();
})();
