import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#gameCanvas');

try {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#a9d8d0');
  scene.fog = new THREE.Fog('#a9d8d0', 24, 54);
  const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.add(new THREE.HemisphereLight(0xe4f8ff, 0x405c35, 2));
  const sun = new THREE.DirectionalLight(0xffedc4, 2.1);
  sun.position.set(-8, 18, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const world = new THREE.Group();
  scene.add(world);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(20, 72), new THREE.MeshStandardMaterial({ color: 0x79ad69, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  world.add(ground);

  const player = new THREE.Group();
  world.add(player);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.85, 5, 10), new THREE.MeshStandardMaterial({ color: 0x3e9860 }));
  body.position.y = 0.95;
  body.castShadow = true;
  player.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf2d6b3 }));
  head.position.set(0, 1.77, 0.12);
  head.castShadow = true;
  player.add(head);
  const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.12, 16), new THREE.MeshStandardMaterial({ color: 0xe6a946 }));
  hat.position.set(0, 2.02, 0.1);
  hat.castShadow = true;
  player.add(hat);

  function addTree(x, z, scale = 1) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * scale, 0.2 * scale, 1.4 * scale, 9), new THREE.MeshStandardMaterial({ color: 0x79502d }));
    trunk.position.set(x, 0.7 * scale, z);
    trunk.castShadow = true;
    world.add(trunk);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.72 * scale, 12, 10), new THREE.MeshStandardMaterial({ color: 0x34744b }));
    crown.position.set(x, 1.65 * scale, z);
    crown.castShadow = true;
    world.add(crown);
  }
  for (let i = 0; i < 30; i += 1) {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 11 + Math.random() * 6;
    addTree(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.7 + Math.random() * 0.7);
  }
  for (let i = 0; i < 18; i += 1) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28 + Math.random() * 0.35), new THREE.MeshStandardMaterial({ color: 0x89918a, roughness: 1 }));
    rock.position.set((Math.random() - 0.5) * 29, 0.25, (Math.random() - 0.5) * 29);
    rock.castShadow = true;
    world.add(rock);
  }

  const habitats = [
    { name: 'Forest', x: -8, z: -5, color: 0x3e9b55, fact: 'Forests provide homes and food for a huge variety of plants and animals.', questions: [
      { q: 'What do forests provide for wildlife?', choices: ['Shelter and food', 'Only hot sand', 'Plastic and metal'], answer: 0 },
      { q: 'What helps a forest grow back after a tree drops its seeds?', choices: ['Seeds finding soil, water, and light', 'Concrete covering the ground', 'Removing every plant'], answer: 0 },
    ] },
    { name: 'Ocean', x: 0, z: 9, color: 0x328cce, fact: 'Oceans help regulate Earth’s climate and support countless marine species.', questions: [
      { q: 'How do oceans help our planet?', choices: ['They help regulate climate', 'They stop all rainfall', 'They make land animals fly'], answer: 0 },
      { q: 'Which action helps protect ocean wildlife?', choices: ['Reducing plastic waste', 'Leaving litter on beaches', 'Pouring waste into drains'], answer: 0 },
    ] },
    { name: 'Wildlife Haven', x: 8, z: -3, color: 0xe0a63c, fact: 'A healthy habitat gives animals access to food, water, shelter, and space.', questions: [
      { q: 'What does a healthy habitat offer animals?', choices: ['Food, water, shelter, and space', 'Only roads', 'Loud noises'], answer: 0 },
      { q: 'Why do animals need connected habitats?', choices: ['To find food, mates, and safe places', 'To avoid all plants', 'To make rivers disappear'], answer: 0 },
    ] },
  ];

  const water = new THREE.Mesh(new THREE.CircleGeometry(6.6, 48), new THREE.MeshStandardMaterial({ color: 0x429ed0, roughness: 0.35, transparent: true, opacity: 0.88 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.06, 9);
  world.add(water);
  const markers = [];
  for (const habitat of habitats) {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.24, 24), new THREE.MeshStandardMaterial({ color: habitat.color, emissive: habitat.color, emissiveIntensity: 0.3 }));
    pad.position.set(habitat.x, 0.15, habitat.z);
    pad.castShadow = true;
    world.add(pad);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.055, 8, 48), new THREE.MeshBasicMaterial({ color: habitat.color }));
    halo.rotation.x = Math.PI / 2;
    halo.position.set(habitat.x, 0.3, habitat.z);
    world.add(halo);
    markers.push({ pad, halo, habitat });
  }

  const seedLocations = [
    [-4, -1], [-12, 2], [-5, -12], [4, 1], [4, 13], [-5, 13], [11, -7], [12, 3], [3, -9], [-12, -9],
  ];
  const seeds = seedLocations.map(([x, z], index) => {
    const group = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.38, 7), new THREE.MeshStandardMaterial({ color: 0x4c8c42 }));
    stem.position.y = 0.2;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.2), new THREE.MeshStandardMaterial({ color: 0xf5c84a, emissive: 0xc98b1c, emissiveIntensity: 0.5, roughness: 0.3 }));
    gem.position.y = 0.47;
    gem.castShadow = true;
    group.add(stem, gem);
    group.position.set(x, 0.05, z);
    group.userData.index = index;
    world.add(group);
    return group;
  });

  const scoreEl = $('#score');
  const biomeEl = $('#biome');
  const objectiveEl = $('#objective');
  const countEl = $('#clue-count');
  const progress = $('.progress-track');
  const progressFill = $('#progress-fill');
  const toast = $('#toast');
  const quiz = $('#quiz');
  const answers = $('#answers');
  const feedback = $('#feedback');
  const startScreen = $('#start-screen');
  const finishScreen = $('#finish-screen');
  const keys = new Set();
  const collected = new Set();
  const completed = new Set();
  let score = 0;
  let running = false;
  let quizOpen = false;
  let toastTimer;
  let audioOn = false;
  let audioContext;
  const soundToggle = $('#sound-toggle');
  const highScoreKey = 'nature-quest-high-score';
  const totalClues = 6;

  function say(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
  }
  function playTone(frequency = 660, duration = 0.12) {
    if (!audioOn) return;
    try {
      audioContext ??= new AudioContext();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Sound could not be started:', error);
    }
  }
  function nearest() {
    return habitats.map((habitat) => ({ habitat, distance: Math.hypot(player.position.x - habitat.x, player.position.z - habitat.z) })).sort((a, b) => a.distance - b.distance)[0];
  }
  function updateProgress() {
    countEl.textContent = `${collected.size} / ${totalClues}`;
    progress.setAttribute('aria-valuenow', String(collected.size));
    progressFill.style.width = `${(collected.size / totalClues) * 100}%`;
  }
  function refreshStatus() {
    const { habitat, distance } = nearest();
    biomeEl.textContent = distance < 4 ? habitat.name : 'Meadow';
    objectiveEl.textContent = distance < 4
      ? `${completed.has(habitat.name) ? 'Challenge complete.' : 'Press E to take the challenge.'} ${habitat.fact}`
      : `Collect nature clues (${collected.size}/${totalClues}) and visit every glowing habitat.`;
  }
  function updateScore() {
    scoreEl.innerHTML = `${score} <small>PTS</small>`;
  }
  function maybeFinish() {
    if (completed.size !== habitats.length || collected.size < totalClues) return;
    running = false;
    const savedHighScore = Number(localStorage.getItem(highScoreKey) || 0);
    const highScore = Math.max(savedHighScore, score);
    try { localStorage.setItem(highScoreKey, String(highScore)); } catch { /* Storage is optional. */ }
    $('#finish-message').textContent = `You completed all three habitat challenges and found ${collected.size} nature clues. Your answers help protect the places wildlife calls home.`;
    $('#finish-score').textContent = `Final score: ${score} points · Best: ${highScore} points`;
    finishScreen.hidden = false;
    $('#play-again').focus();
  }
  function closeQuiz() {
    quiz.hidden = true;
    quizOpen = false;
    if (running) canvas.focus?.();
  }
  function startQuiz(habitat) {
    if (quizOpen || completed.has(habitat.name)) {
      if (completed.has(habitat.name)) say(`${habitat.name} challenge already complete!`);
      return;
    }
    quizOpen = true;
    quiz.hidden = false;
    $('#quiz-title').textContent = `${habitat.name.toUpperCase()} CHALLENGE`;
    const question = habitat.questions.find((item) => !habitat.seenQuestions?.has(item.q)) ?? habitat.questions[0];
    habitat.seenQuestions ??= new Set();
    habitat.seenQuestions.add(question.q);
    $('#question').textContent = question.q;
    feedback.textContent = '';
    answers.replaceChildren();
    question.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'answer';
      button.type = 'button';
      button.textContent = choice;
      button.addEventListener('click', () => {
        answers.querySelectorAll('button').forEach((answer) => { answer.disabled = true; });
        if (index === question.answer) {
          feedback.textContent = `Correct! ${habitat.fact}`;
          if (!completed.has(habitat.name)) {
            completed.add(habitat.name);
            score += 25;
            updateScore();
            playTone(880, 0.2);
          }
        } else {
          feedback.textContent = `Not quite. ${habitat.fact}`;
          playTone(260, 0.18);
        }
        setTimeout(() => {
          closeQuiz();
          maybeFinish();
        }, 1900);
      });
      answers.append(button);
    });
    answers.querySelector('button')?.focus();
  }
  function interact() {
    const { habitat, distance } = nearest();
    if (distance < 4.2) startQuiz(habitat);
    else say('Get closer to a glowing habitat to begin its challenge.');
  }
  function resetGame() {
    score = 0;
    player.position.set(0, 0, 0);
    collected.clear();
    completed.clear();
    for (const seed of seeds) seed.visible = true;
    for (const habitat of habitats) habitat.seenQuestions = new Set();
    updateScore();
    updateProgress();
    finishScreen.hidden = true;
    startScreen.hidden = true;
    running = true;
    refreshStatus();
    say('Welcome, explorer! Find a glowing habitat.');
    canvas.focus?.();
  }

  $('#play').addEventListener('click', resetGame);
  $('#play-again').addEventListener('click', resetGame);
  $('#close').addEventListener('click', closeQuiz);
  quiz.addEventListener('click', (event) => { if (event.target === quiz) closeQuiz(); });
  soundToggle.addEventListener('click', () => {
    audioOn = !audioOn;
    soundToggle.textContent = `Sound: ${audioOn ? 'On' : 'Off'}`;
    soundToggle.setAttribute('aria-pressed', String(audioOn));
    if (audioOn) playTone(660, 0.1);
  });
  const keyMap = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right' };
  addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && quizOpen) { closeQuiz(); return; }
    if (event.code === 'KeyE' && running && !quizOpen) { interact(); return; }
    if (keyMap[event.code] && running && !quizOpen) { keys.add(keyMap[event.code]); event.preventDefault(); }
  });
  addEventListener('keyup', (event) => { if (keyMap[event.code]) keys.delete(keyMap[event.code]); });
  addEventListener('blur', () => keys.clear());
  for (const button of document.querySelectorAll('[data-move]')) {
    const direction = button.dataset.move;
    button.addEventListener('pointerdown', (event) => { event.preventDefault(); if (running && !quizOpen) keys.add(direction); button.setPointerCapture(event.pointerId); });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(type, () => keys.delete(direction));
  }

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    const delta = Math.min(clock.getDelta(), 0.04);
    if (running && !quizOpen) {
      const x = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
      const z = (keys.has('down') ? 1 : 0) - (keys.has('up') ? 1 : 0);
      if (x || z) {
        const length = Math.hypot(x, z);
        player.position.x += (x / length) * 5.5 * delta;
        player.position.z += (z / length) * 5.5 * delta;
        player.position.x = THREE.MathUtils.clamp(player.position.x, -17, 17);
        player.position.z = THREE.MathUtils.clamp(player.position.z, -17, 17);
        player.rotation.y = Math.atan2(x, z);
      }
      for (const seed of seeds) {
        if (!seed.visible) continue;
        seed.rotation.y += delta * 1.3;
        seed.position.y = 0.05 + Math.sin(clock.elapsedTime * 2.5 + seed.userData.index) * 0.12;
        if (Math.hypot(player.position.x - seed.position.x, player.position.z - seed.position.z) < 0.9) {
          seed.visible = false;
          collected.add(seed.userData.index);
          score += 5;
          updateScore();
          updateProgress();
          playTone(740, 0.1);
          say(`Nature clue collected! ${collected.size} of ${totalClues}`);
        }
      }
      refreshStatus();
      maybeFinish();
    }
    for (const { pad, halo, habitat } of markers) {
      const bob = Math.sin(clock.elapsedTime * 2 + habitat.x) * 0.1;
      pad.position.y = 0.15 + bob;
      halo.position.y = 0.3 + bob;
    }
    const target = new THREE.Vector3(player.position.x, 6.6, player.position.z + 8);
    camera.position.lerp(target, 0.09);
    camera.lookAt(player.position.x, 1, player.position.z);
    renderer.render(scene, camera);
  }
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  updateProgress();
  refreshStatus();
  tick();
} catch (error) {
  console.error(error);
  const message = document.createElement('p');
  message.className = 'error-message';
  message.textContent = 'Nature Quest could not start. Please use a modern browser with WebGL enabled and an internet connection to load the 3D engine.';
  document.querySelector('#game').replaceChildren(message);
}
