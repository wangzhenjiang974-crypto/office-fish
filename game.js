((function() {
  const ICONS = ['📌',"★ 📅,',"📡�', '👶👶', '🌕👮', '🎧的的'';
  let state = { slots: Array(7).fill(null), items: [], timer: 180, playing: false, bossActive: false };
  let timerInterval = null;
  let bossInterval = null;
  const startScreen = document.getElementById('start');
  const gameScreen = document.getElementById('game-screen');
  const board = document.getElementById('board');
  const slotsContainer = document.getElementById('slots');
  const timerDisplay = document.getElementById('timer');
  const bossAlert = document.getElementById('boss-alert');
  const gameOverScreen = document.getElementById('game-over');
  const failReason = document.getElementById('fail-reason');
  document.getElementById('start-btn').addEventListener('click', function() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    startGame();
  });
  document.getElementById('restart-btn').addEventListener('click', function() {
    gameOverScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    startGame();
  });
  document.getElementById('work-btn').addEventListener('click', function() {
    if (state.bossActive) {
      bossAlert.style.display = 'none';
      state.bossActive = false;
    }
  });
  function startGame() {
    state = { slots: Array(7).fill(null), items: [], timer: 180, playing: true, bossActive: false };
    if (timerInterval) clearInterval(timerInterval);
    if (bossInterval) clearInterval(bossInterval);
    spawnItems(20);
    timerInterval = setInterval(updateTimer, 1000);
    bossInterval = setInterval(checkBoss, 30000);
    updateTimer();
    renderSlots();
  }
  function spawnItems(count) {
    board.innerHTML = '';
    state.items = [];
    for (let i = 0; i < count; i++) {
      const type = Math.floor(Math.random() * 6);
      const item = document.createElement('div');
      item.className = 'item t' + type;
      item.textContent = ICONS[type];
      let x, y, overlap;
      do {
        x = Math.random() * (board.offsetWidth - 50);
        y = Math.random() * (board.offsetHeight - 50);
        overlap = state.items.some(function(it) {
          const dx = x - it.x;
          const dy = y - it.y;
          return Math.sqrt(dx * dx + dy * dy) < 50;
        });
      } while (overlap);
      item.style.left = x + 'px';
      item.style.top = y + 'px';
      item.onclick = (function(t, el) {
        return function() { onItemClick(t, el); };
      })(type, item);
      board.appendChild(item);
      state.items.push({ type: type, element: item, x: x, y: y });
    }
  }
  function onItemClick(type, element) {
    if (!state.playing || state.bossActive) return;
    const emptyIndex = state.slots.indexOf(null);
    if (emptyIndex === -1) return;
    state.slots[emptyIndex] = type;
    element.style.display = 'none';
    renderSlots();
    checkMatch();
    checkGameOver();
    checkWin();
  }
  function renderSlots() {
    const slots = slotsContainer.querySelectorAll('.slot');
    for (let i = 0; i < slots.length; i++) {
      slots[i].textContent = state.slots[i] !== null ? ICONS[state.slots[i]] : '';
    }
  }
  function checkMatch() {
    const counts = {};
    for (let i = 0; i < state.slots.length; i++) {
      const t = state.slots[i];
      if (t !== null) {
        counts[t] = (counts[t] || 0) + 1;
      }
    }
    for (const type in counts) {
      if (counts[type] >= 3) {
        removeItems(parseInt(type));
        break;
      }
    }
  }
  function removeItems(type) {
    const newSlots = [];
    let removed = 0;
    for (let i = 0; i < state.slots.length; i++) {
      if (state.slots[i] === type && removed < 3) {
        removed++;
      } else {
        newSlots.push(state.slots[i]);
      }
    }
    state.slots = newSlots;
    renderSlots();
  }
  function checkGameOver() {
    const isFull = state.slots.every(function(s) { return s !== null; });
    if (isFull) {
      endGame('来戶工下统');
    }
  }
  function checkWin() {
    const remain = state.items.filter(function(it) {
      return it.element.style.display !== 'none';
    }).length;
    if (remain === 0) {
      endGame('戶产络我工质', true);
    }
  }
  function updateTimer() {
    state.timer--;
    const m = Math.floor(state.timer / 60);
    const s = state.timer % 60;
    timerDisplay.textContent = '⏣⑰ ' + m + ':' + (s < 10 ? '0' : '') + s;
    if (state.timer <= 0) {
      endGame('人人加分');
    }
  }
  function checkBoss() {
    if (!state.playing || state.bossActive) return;
    if (Math.random() > 0.5) {
      state.bossActive = true;
      bossAlert.style.display = 'block';
      setTimeout(function() {
        if (state.bossActive) {
          endGame('为亦创緥下统');
        }
      }, 3000);
    }
  }
  function endGame(reason, win) {
    state.playing = false;
    if (timerInterval) clearInterval(timerInterval);
    if (bossInterval) clearInterval(bossInterval);
    failReason.textContent = reason;
    failReason.style.color = win ? '#2ecc71' : '#e74c3c';
    gameOverSCreen.style.display = 'block';
  }
})();