(() => {
  'use strict';
  const {datasets, methods} = window.PNFSURF_DATA;
  const section = document.querySelector('#videos');
  const tabs = [...section.querySelectorAll('[data-mesh-dataset]')];
  const videos = [...section.querySelectorAll('.scene-video-pair video')];
  const selectors = [...section.querySelectorAll('.scene-video-pair select')];
  const toggle = section.querySelector('#mesh-play-toggle');
  const speed = section.querySelector('#mesh-video-speed');
  const scrub = section.querySelector('#mesh-video-time');
  const clock = section.querySelector('#mesh-video-clock');
  const note = section.querySelector('#mesh-video-note');
  const status = section.querySelector('#mesh-video-status');
  let scene = datasets[0];
  let phase = 0;
  let playing = false;
  let loaded = false;
  let request = 0;

  const duration = () => videos[0].duration || 0;
  const format = value => {
    const seconds = Math.floor(value);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  };
  const updateControls = () => {
    toggle.querySelector('span').textContent = playing ? 'Pause comparison' : 'Play comparison';
    toggle.querySelector('path').setAttribute('d', playing ? 'M8 5v14M16 5v14' : 'm8 5 11 7-11 7Z');
    const total = duration();
    scrub.disabled = !loaded || !Number.isFinite(total) || total <= 0;
    scrub.value = scrub.disabled ? 0 : Math.round(phase / total * 1000);
    const time = scrub.disabled ? '0:00' : format(phase) + ' / ' + format(total);
    if (clock.textContent !== time) clock.textContent = time;
    const spoken = scrub.disabled ? 'Video progress unavailable' : format(phase) + ' of ' + format(total);
    if (scrub.getAttribute('aria-valuetext') !== spoken) scrub.setAttribute('aria-valuetext', spoken);
  };

  function seek(time) {
    phase = Math.max(0, time);
    for (const video of videos) {
      if (video.readyState >= 1) video.currentTime = Math.min(phase, Math.max(0, video.duration - 0.01));
    }
    updateControls();
  }

  function pause() {
    if (loaded) phase = videos[0].currentTime;
    ++request;
    playing = false;
    videos.forEach(video => video.pause());
    status.textContent = '';
    updateControls();
  }

  function synchronize(ticket) {
    if (!playing || ticket !== request) return;
    const [left, right] = videos;
    if (loaded && !left.seeking && !right.seeking) {
      phase = left.currentTime;
      if (right.readyState >= 2 && Math.abs(right.currentTime - phase) > 0.09) right.currentTime = phase;
      updateControls();
    }
    requestAnimationFrame(() => synchronize(ticket));
  }

  async function play() {
    const ticket = ++request;
    const start = phase;
    playing = true;
    status.textContent = 'Loading video…';
    updateControls();
    try {
      await Promise.all(videos.map(video => video.play()));
      if (ticket !== request) return;
      loaded = true;
      seek(start);
      status.textContent = '';
      synchronize(ticket);
    } catch {
      if (ticket !== request) return;
      pause();
      status.textContent = 'Playback could not start. Try playing again or open a clip.';
    }
  }

  function loadScene() {
    const resume = playing;
    ++request;
    loaded = false;
    status.textContent = '';
    for (const [index, video] of videos.entries()) {
      const method = selectors[index].value;
      const label = methods[method];
      video.pause();
      video.poster = scene.posters[method];
      const source = scene.videos[method];
      video.src = source;
      video.load();
      video.playbackRate = Number(speed.value);
      video.setAttribute('aria-label', scene.name + ' ' + scene.scene + ', ' + label + ' mesh orbit');
      const link = section.querySelector('#' + video.id + '-open');
      link.href = source;
      link.setAttribute('aria-label', 'Open ' + label + ' video');
    }
    section.querySelector('#mesh-video-scene').textContent = scene.scene;
    note.hidden = !scene.videoNote;
    note.textContent = scene.videoNote;
    updateControls();
    if (resume) play();
  }

  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      if (scene.id === tab.dataset.meshDataset) return;
      scene = datasets.find(item => item.id === tab.dataset.meshDataset);
      phase = 0;
      for (const button of tabs) {
        button.setAttribute('aria-selected', String(button === tab));
        button.tabIndex = button === tab ? 0 : -1;
      }
      section.querySelector('#mesh-video-panel').setAttribute('aria-labelledby', tab.id);
      loadScene();
    });
  }
  selectors.forEach(select => select.addEventListener('change', loadScene));
  toggle.addEventListener('click', () => playing ? pause() : play());
  speed.addEventListener('change', () => {
    videos.forEach(video => { video.playbackRate = Number(speed.value); });
  });
  scrub.addEventListener('input', () => seek(duration() * Number(scrub.value) / 1000));
  for (const video of videos) {
    video.addEventListener('loadedmetadata', () => {
      loaded = videos.every(item => item.readyState >= 1);
      if (loaded && !playing) seek(phase);
    });
    video.addEventListener('error', () => {
      pause();
      status.textContent = 'A video could not load. Select another method or open the clip.';
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) pause(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting && playing) pause();
    }).observe(section.querySelector('.scene-video-pair'));
  }
  loadScene();
})();
