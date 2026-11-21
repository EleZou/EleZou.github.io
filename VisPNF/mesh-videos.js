(() => {
  'use strict';
  const {datasets, methods} = window.PNFSURF_DATA;
  const section = document.querySelector('#videos');
  const tabs = [...section.querySelectorAll('[data-mesh-dataset]')];
  const grid = section.querySelector('#mesh-video-grid');
  const template = grid.querySelector('#mesh-video-tile');
  const tiles = Object.entries(methods).map(([method, label]) => {
    const tile = template.content.cloneNode(true);
    const video = tile.querySelector('video');
    const link = tile.querySelector('.scene-video-open');
    tile.querySelector('figcaption span').textContent = label;
    link.setAttribute('aria-label', 'Open ' + label + ' video');
    video.id = 'mesh-video-' + method;
    video.dataset.method = method;
    video.muted = true;
    grid.append(tile);
    return {method, label, video, link};
  });
  const videos = tiles.map(tile => tile.video);
  const master = videos[0];
  const toolbar = section.querySelector('.scene-playback');
  const toggle = section.querySelector('#mesh-play-toggle');
  const speed = section.querySelector('#mesh-video-speed');
  const scrub = section.querySelector('#mesh-video-time');
  const clock = section.querySelector('#mesh-video-clock');
  const note = section.querySelector('#mesh-video-note');
  const status = section.querySelector('#mesh-video-status');
  let scene = datasets[0];
  let phase = 0;
  let running = null;
  let starting = false;

  function formatTime(value) {
    const seconds = Math.floor(value);
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  }

  function updateToggle() {
    toggle.querySelector('span').textContent = running ? 'Pause all' : 'Play all';
    toggle.querySelector('path').setAttribute('d', running ? 'M8 5v14M16 5v14' : 'm8 5 11 7-11 7Z');
  }

  function updateProgress() {
    const total = master.duration;
    scrub.disabled = starting || !Number.isFinite(total) || total <= 0;
    scrub.value = scrub.disabled ? 0 : Math.round(phase / total * 1000);
    const time = scrub.disabled ? '0:00' : formatTime(phase) + ' / ' + formatTime(total);
    if (clock.textContent !== time) clock.textContent = time;
    const spoken = scrub.disabled ? 'Video progress unavailable' : formatTime(phase) + ' of ' + formatTime(total);
    if (scrub.getAttribute('aria-valuetext') !== spoken) scrub.setAttribute('aria-valuetext', spoken);
  }

  function pause() {
    running?.abort();
    running = null;
    starting = false;
    videos.forEach(video => video.pause());
    status.textContent = '';
    updateToggle();
    updateProgress();
  }

  function playbackFailed() {
    pause();
    status.textContent = 'A video could not load. Try again or open a clip.';
  }

  function waitForFrame(video, signal) {
    return new Promise((resolve, reject) => {
      const events = ['canplay', 'seeked', 'error'];
      function finish(error) {
        events.forEach(event => video.removeEventListener(event, check));
        signal.removeEventListener('abort', check);
        if (error) reject(error);
        else resolve();
      }
      function check() {
        if (signal.aborted) finish(signal.reason);
        else if (video.error) finish(video.error);
        else if (!video.seeking && video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) finish();
      }
      events.forEach(event => video.addEventListener(event, check));
      signal.addEventListener('abort', check, {once: true});
      check();
    });
  }

  function synchronize(ticket) {
    if (ticket !== running) return;
    if (!videos.some(video => video.seeking)) {
      phase = master.currentTime;
      for (const video of videos.slice(1)) {
        const drift = Math.abs(video.currentTime - phase);
        if (drift > 0.09 && master.duration - drift > 0.09) video.currentTime = phase;
      }
      updateProgress();
    }
    requestAnimationFrame(() => synchronize(ticket));
  }

  async function play() {
    pause();
    const ticket = new AbortController();
    running = ticket;
    starting = true;
    status.textContent = 'Loading videos…';
    updateToggle();
    updateProgress();
    const timeout = setTimeout(() => {
      if (ticket === running) playbackFailed();
    }, 30000);
    try {
      for (const video of videos) {
        if (video.preload === 'none' || video.error) {
          video.preload = 'auto';
          video.load();
        }
        if (Math.abs(video.currentTime - phase) > 0.02) video.currentTime = phase;
      }
      await Promise.all(videos.map(video => waitForFrame(video, ticket.signal)));
      if (ticket !== running) return;
      await Promise.all(videos.map(video => video.play()));
      if (ticket !== running) return;
      starting = false;
      status.textContent = '';
      synchronize(ticket);
    } catch {
      if (ticket === running) playbackFailed();
    } finally {
      clearTimeout(timeout);
    }
  }

  function loadScene() {
    const resume = Boolean(running);
    pause();
    phase = 0;
    section.querySelector('#mesh-video-scene').textContent = scene.scene;
    note.hidden = !scene.videoNote;
    note.textContent = scene.videoNote ?? '';
    if (scene.videoWidth && scene.videoHeight) {
      grid.style.setProperty('--mesh-video-ratio', scene.videoWidth + ' / ' + scene.videoHeight);
    } else {
      grid.style.removeProperty('--mesh-video-ratio');
    }
    toolbar.hidden = tiles.some(({method}) => !scene.videos?.[method]);
    for (const {method, label, video, link} of tiles) {
      const source = scene.videos?.[method];
      const poster = scene.posters?.[method] || scene.images?.[label];
      video.preload = 'none';
      if (poster) video.poster = poster;
      else video.removeAttribute('poster');
      if (source) {
        video.src = source;
        link.href = source;
      } else {
        video.removeAttribute('src');
        link.removeAttribute('href');
      }
      link.hidden = !source;
      video.setAttribute('aria-label', [scene.name, scene.scene, label + ' mesh'].join(', '));
      video.load();
    }
    updateProgress();
    if (resume && !toolbar.hidden) play();
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => {
      if (scene.id === tab.dataset.meshDataset) return;
      scene = datasets.find(item => item.id === tab.dataset.meshDataset);
      for (const button of tabs) {
        button.setAttribute('aria-selected', String(button === tab));
        button.tabIndex = button === tab ? 0 : -1;
      }
      section.querySelector('#mesh-video-panel').setAttribute('aria-labelledby', tab.id);
      loadScene();
    });
    tab.addEventListener('keydown', event => {
      const targets = {
        ArrowLeft: (index - 1 + tabs.length) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1
      };
      const target = tabs[targets[event.key]];
      if (!target) return;
      event.preventDefault();
      target.click();
      target.focus();
    });
  }
  toggle.addEventListener('click', () => running ? pause() : play());
  speed.addEventListener('change', () => {
    const rate = Number(speed.value);
    for (const video of videos) {
      video.defaultPlaybackRate = rate;
      video.playbackRate = rate;
    }
  });
  scrub.addEventListener('input', () => {
    phase = Math.min(master.duration * Number(scrub.value) / 1000, master.duration - 0.04);
    videos.forEach(video => { video.currentTime = phase; });
    updateProgress();
  });
  for (const video of videos) {
    video.addEventListener('waiting', () => {
      if (running && !starting && !video.seeking && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) play();
    });
    video.addEventListener('error', () => {
      if (running && !starting && video.error) playbackFailed();
    });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) pause(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting && running) pause();
    }).observe(section.querySelector('#mesh-video-panel'));
  }
  loadScene();
})();
