(() => {
  'use strict';
  const section = document.querySelector('#mesh-videos');
  const video = section.querySelector('video');
  const toggle = section.querySelector('#mesh-play-toggle');
  const speed = section.querySelector('#mesh-video-speed');
  const quality = section.querySelector('#mesh-video-quality');
  const status = section.querySelector('#mesh-video-status');
  const scenes = {
    replica: {name: 'Replica', scene: 'office0', regime: 'Rendered views of a real scanned interior', detail: 'Inspect the wall–furniture boundaries and surface continuity as the camera moves.'},
    scannetpp: {name: 'ScanNet++', scene: '88cf747085', regime: 'Real scanned interior', detail: 'Inspect the tiled wall, sink outline, and small surface structures from changing angles.'},
    mushroom: {name: 'MuSHRoom', scene: 'coffee_room', regime: 'Challenging smartphone capture', detail: 'Inspect the sofa contours, curtains, and gaps between reconstructed surfaces.'}
  };
  const methods = {pgsr: 'PGSR', '2dgs': '2DGS', ambisur: 'AmbiSuR', gt: 'Ground truth'};
  const portraitScreen = window.matchMedia('(max-width: 600px) and (orientation: portrait)');
  let currentDataset = 'replica';
  let currentMethod = 'pgsr';
  let desiredTime = 0;
  let pendingLoad = null;
  let ready = false;
  let shouldPlay = false;
  let playRequest = 0;
  const preparedVideos = new Map();
  const failedPreloads = new Set();
  let preloader = null;

  function stopPreloading() {
    preloader?.abort();
    preloader = null;
  }

  function preloadComparisons() {
    if (preloader) return;
    const lastRange = video.buffered.length - 1;
    if (lastRange < 0 || video.buffered.end(lastRange) < video.duration - 0.1) return;
    const controller = new AbortController();
    preloader = controller;
    // Fetch one small clip at a time. Cached object URLs make later switches
    // independent of the server's handling of range-request caching.
    (async () => {
      try {
        while (!controller.signal.aborted) {
          const datasets = [currentDataset, ...Object.keys(scenes).filter(key => key !== currentDataset)];
          const layouts = portraitScreen.matches ? ['-portrait', ''] : ['', '-portrait'];
          const sources = layouts.flatMap(layout => datasets.flatMap(dataset => Object.keys(methods).map(method =>
            `assets/videos/mesh-comparisons/${dataset}-${method}${layout}-fast.mp4`)));
          const next = sources.find(source => source !== video.dataset.source && !preparedVideos.has(source) && !failedPreloads.has(source));
          if (!next) break;
          try {
            const response = await fetch(next, {signal: controller.signal, cache: 'force-cache', priority: 'low'});
            if (!response.ok) throw new Error('Video unavailable');
            const blob = await response.blob();
            if (controller.signal.aborted) break;
            preparedVideos.set(next, URL.createObjectURL(blob));
          } catch (error) {
            if (controller.signal.aborted) break;
            failedPreloads.add(next);
          }
        }
      } finally {
        if (preloader === controller) preloader = null;
      }
    })();
  }

  function selectTab(button) {
    button.parentElement.querySelectorAll('[role="tab"]').forEach(tab => {
      const selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }

  function updateButton() {
    toggle.querySelector('span').textContent = shouldPlay ? 'Pause comparison' : 'Play comparison';
    toggle.querySelector('path').setAttribute('d', shouldPlay ? 'M8 5v14M16 5v14' : 'm8 5 11 7-11 7Z');
  }

  async function play() {
    const request = ++playRequest;
    shouldPlay = true;
    updateButton();
    status.textContent = '';
    try {
      await video.play();
    } catch (error) {
      // A method change or a pause can cancel a previous play request normally.
      if (request !== playRequest || error.name === 'AbortError') return;
      shouldPlay = false;
      updateButton();
      status.textContent = 'Playback could not start. Try Play comparison again, or open the video.';
    }
  }

  function pause() {
    ++playRequest;
    shouldPlay = false;
    if (!video.paused) video.pause();
    updateButton();
  }

  function changeVideo(dataset, method, force = false) {
    if (!force && dataset === currentDataset && method === currentMethod) return;
    desiredTime = dataset === currentDataset ? (ready ? video.currentTime : desiredTime) : 0;
    const resume = shouldPlay;
    ++playRequest;
    pendingLoad?.abort();
    pendingLoad = new AbortController();
    ready = false;
    if (!video.paused) video.pause();
    shouldPlay = resume;
    currentDataset = dataset;
    currentMethod = method;
    const scene = scenes[dataset];
    const portrait = portraitScreen.matches;
    const path = `assets/videos/mesh-comparisons/${dataset}-${method}${portrait ? '-portrait' : ''}`;
    const source = `${path}${quality.value === 'fast' ? '-fast' : ''}.mp4`;
    if (!preparedVideos.has(source)) stopPreloading();
    video.poster = `${path}.webp`;
    video.dataset.source = source;
    video.src = preparedVideos.get(source) || source;
    video.setAttribute('aria-label', `${scene.name} ${scene.scene}: ${methods[method]} ${portrait ? 'above' : 'on the left'} and VisPNF ${portrait ? 'below' : 'on the right'}, synchronized mesh comparison`);
    section.querySelector('#mesh-video-scene').textContent = scene.scene;
    section.querySelector('#mesh-video-regime').textContent = `${scene.name} · ${scene.regime}`;
    section.querySelector('#mesh-video-caption').textContent = `${scene.detail} VisPNF stays ${portrait ? 'below' : 'on the right'}; both views play and seek together.`;
    section.querySelector('#mesh-video-open').href = source;
    video.querySelector('a').href = source;
    section.querySelector('#mesh-video-panel').setAttribute('aria-labelledby', `mesh-dataset-${dataset}`);
    section.querySelector('#mesh-video-content').setAttribute('aria-labelledby', `mesh-method-${method}`);
    status.textContent = '';
    updateButton();
    video.addEventListener('loadedmetadata', () => {
      ready = true;
      if (desiredTime > 0) video.currentTime = Math.min(desiredTime, Math.max(0, video.duration - 0.05));
      video.playbackRate = Number(speed.value);
      if (shouldPlay) play();
    }, {once: true, signal: pendingLoad.signal});
    if (video.preload !== 'none' || shouldPlay) video.load();
  }

  section.querySelectorAll('[data-mesh-dataset]').forEach(button => button.addEventListener('click', () => {
    selectTab(button);
    changeVideo(button.dataset.meshDataset, currentMethod);
  }));
  section.querySelectorAll('[data-mesh-method]').forEach(button => button.addEventListener('click', () => {
    selectTab(button);
    changeVideo(currentDataset, button.dataset.meshMethod);
  }));
  toggle.addEventListener('click', () => shouldPlay ? pause() : play());
  speed.addEventListener('change', () => { video.playbackRate = Number(speed.value); });
  quality.addEventListener('change', () => changeVideo(currentDataset, currentMethod, true));
  video.addEventListener('loadedmetadata', () => { ready = true; });
  video.addEventListener('play', () => { shouldPlay = true; updateButton(); });
  video.addEventListener('pause', () => {
    if (ready) { shouldPlay = false; updateButton(); }
  });
  video.addEventListener('waiting', () => { if (shouldPlay) status.textContent = 'Loading comparison…'; });
  video.addEventListener('playing', () => { status.textContent = ''; });
  video.addEventListener('canplay', () => { status.textContent = ''; preloadComparisons(); });
  video.addEventListener('progress', preloadComparisons);
  video.addEventListener('suspend', preloadComparisons);
  video.addEventListener('error', () => {
    pause();
    status.textContent = 'The video could not load. Try another comparison, or open the video directly.';
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  portraitScreen.addEventListener('change', () => changeVideo(currentDataset, currentMethod, true));
  video.preload = 'auto';
  changeVideo(currentDataset, currentMethod, true);

  // Loading continues in the background; only playback pauses offscreen.
  if ('IntersectionObserver' in window) {
    const pauser = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting && !document.fullscreenElement && !video.webkitDisplayingFullscreen) pause();
    }, {threshold: 0});
    pauser.observe(video);
  }
})();
