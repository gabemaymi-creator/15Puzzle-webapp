// app.js - 15 Puzzle (vanilla JS)

(() => {
  // ---------- State ----------
  let tiles = [];           // length 16, 1..15 and 0 as blank
  let moves = 0;
  let startTime = null;
  let timerId = null;
  let isRunning = false;

  // ---------- DOM ----------
  let boardEl, movesEl, timeEl, shuffleBtn, resetBtn, statusEl;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    boardEl = document.getElementById("board");
    if (boardEl) {
      boardEl.setAttribute("tabindex", "0");
    }
    movesEl = document.getElementById("moves");
    timeEl = document.getElementById("time");
    shuffleBtn = document.getElementById("shuffle");
    resetBtn = document.getElementById("reset");
    statusEl = document.getElementById("status");

    // Theme menu logic
    const themeSelect = document.getElementById("theme-select");
    if (themeSelect) {
      themeSelect.addEventListener("change", function() {
        setTheme(themeSelect.value);
      });
      themeSelect.addEventListener("keydown", onThemeSelectKeyDown);
      // Set initial theme
      setTheme(themeSelect.value);
    }

    document.addEventListener("keydown", onKeyDown);
    shuffleBtn.addEventListener("click", newGame);
    resetBtn.addEventListener("click", reset);

    newGame();
  }

  function onThemeSelectKeyDown(e) {
    if (!isArrowKey(e.key)) return;
    e.preventDefault();
    if (boardEl && typeof boardEl.focus === "function") {
      boardEl.focus({ preventScroll: true });
    }
  }

  function isArrowKey(key) {
    return key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight";
  }

  function setTheme(theme) {
    document.body.classList.remove(
      "theme-default",
      "theme-dark",
      "theme-pastel",
      "theme-high-contrast",
      "theme-modern-blue",
      "theme-classic-plastic",
      "theme-wood"
    );
    switch (theme) {
      case "dark":
        document.body.classList.add("theme-dark");
        break;
      case "pastel":
        document.body.classList.add("theme-pastel");
        break;
      case "high-contrast":
        document.body.classList.add("theme-high-contrast");
        break;
      case "modern-blue":
        document.body.classList.add("theme-modern-blue");
        break;
      case "classic-plastic":
        document.body.classList.add("theme-classic-plastic");
        break;
      case "wood":
        document.body.classList.add("theme-wood");
        break;
      default:
        document.body.classList.add("theme-default");
    }
  }

  // ---------- Game lifecycle ----------
  function newGame() {
    tiles = solvableShuffle();
    while (isSolvedState(tiles)) tiles = solvableShuffle(); // avoid starting solved
    moves = 0;
    startTime = Date.now();
    isRunning = true;
    startTimer();
    setStatus("");
    render();
  }

  function reset() {
    tiles = solvedBoard();
    moves = 0;
    isRunning = false;
    stopTimer();
    startTime = null;
    setStatus("Ready. Press Shuffle to play.");
    render();
  }

  function endGame() {
    isRunning = false;
    stopTimer();
    setStatus(`Solved in ${moves} moves, time ${timeEl.textContent}.`);
  }

  // ---------- Events ----------

  function onTileClick(e) {
    const tileEl = e.currentTarget;
    if (tileEl.classList.contains("empty")) return;
    // Find the tile's current index in the board
    const tileNum = Number(tileEl.dataset.tile);
    const idx = tiles.indexOf(tileNum);
    if (idx !== -1) tryMove(idx);
  }

  function onKeyDown(e) {
    if (!isRunning) return;
    const blank = tiles.indexOf(0);
    const r = Math.floor(blank / 4);
    const c = blank % 4;
    let target = -1;
    if (e.shiftKey) {
      // Shift+Arrow: slide whole row/col toward blank if possible
      if (e.key === "ArrowUp" && r < 3) {
        // Find the farthest tile below blank in the same column
        for (let row = 3; row > r; row--) {
          const idx = row * 4 + c;
          if (tiles[idx] !== 0) {
            target = idx;
            break;
          }
        }
      }
      if (e.key === "ArrowDown" && r > 0) {
        for (let row = 0; row < r; row++) {
          const idx = row * 4 + c;
          if (tiles[idx] !== 0) {
            target = idx;
            break;
          }
        }
      }
      if (e.key === "ArrowLeft" && c < 3) {
        for (let col = 3; col > c; col--) {
          const idx = r * 4 + col;
          if (tiles[idx] !== 0) {
            target = idx;
            break;
          }
        }
      }
      if (e.key === "ArrowRight" && c > 0) {
        for (let col = 0; col < c; col++) {
          const idx = r * 4 + col;
          if (tiles[idx] !== 0) {
            target = idx;
            break;
          }
        }
      }
    } else {
      // Normal arrow: only move adjacent
      if (e.key === "ArrowUp" && r < 3) target = blank + 4;
      if (e.key === "ArrowDown" && r > 0) target = blank - 4;
      if (e.key === "ArrowLeft" && c < 3) target = blank + 1;
      if (e.key === "ArrowRight" && c > 0) target = blank - 1;
    }
    if (target !== -1) tryMove(target);
  }

  function tryMove(i) {
    const blank = tiles.indexOf(0);
    // If adjacent, do normal move
    if (isAdjacent(i, blank)) {
      swap(i, blank);
      moves++;
    } else {
      // Check if in same row or column and can slide
      const rowI = Math.floor(i / 4), colI = i % 4;
      const rowB = Math.floor(blank / 4), colB = blank % 4;
      if (rowI === rowB) {
        // Same row, slide horizontally
        const dir = colB > colI ? 1 : -1;
        let canSlide = true;
        for (let c = colI + dir; c !== colB; c += dir) {
          if (tiles[rowI * 4 + c] === 0) {
            canSlide = false;
            break;
          }
        }
        if (canSlide) {
          for (let c = colB; c !== colI; c -= dir) {
            tiles[rowI * 4 + c] = tiles[rowI * 4 + c - dir];
          }
          tiles[rowI * 4 + colI] = 0;
          moves++;
        } else {
          return;
        }
      } else if (colI === colB) {
        // Same column, slide vertically
        const dir = rowB > rowI ? 1 : -1;
        let canSlide = true;
        for (let r = rowI + dir; r !== rowB; r += dir) {
          if (tiles[r * 4 + colI] === 0) {
            canSlide = false;
            break;
          }
        }
        if (canSlide) {
          for (let r = rowB; r !== rowI; r -= dir) {
            tiles[r * 4 + colI] = tiles[(r - dir) * 4 + colI];
          }
          tiles[rowI * 4 + colI] = 0;
          moves++;
        } else {
          return;
        }
      } else {
        return;
      }
    }
    if (!isRunning) {
      isRunning = true;
      if (!timerId) startTimer();
    }
    render();
    if (isSolvedState(tiles)) endGame();
  }

  // ---------- Render ----------
  function render() {
    renderBoard();
    renderHUD();
  }

  function renderBoard() {
  boardEl.setAttribute("aria-rowcount", "4");
  boardEl.setAttribute("aria-colcount", "4");
  boardEl.style.position = "relative";
  // Remove inline width/height/padding so CSS takes effect
  boardEl.style.width = "";
  boardEl.style.height = "";
  boardEl.style.paddingBottom = "";

    // On first render, create persistent tile elements
    if (!boardEl._tiles) {
      boardEl.innerHTML = "";
      boardEl._tiles = [];
      for (let n = 1; n <= 15; n++) {
        const btn = document.createElement("button");
        btn.className = "tile";
        btn.textContent = n;
        btn.setAttribute("role", "gridcell");
        btn.setAttribute("aria-label", `Move tile ${n}`);
        btn.tabIndex = 0;
        btn.dataset.tile = n;
        btn.addEventListener("click", onTileClick);
        boardEl.appendChild(btn);
        boardEl._tiles.push(btn);
      }
      // Add a single empty tile for accessibility/focus
      const emptyBtn = document.createElement("button");
      emptyBtn.className = "tile empty";
      emptyBtn.setAttribute("aria-hidden", "true");
      emptyBtn.tabIndex = -1;
      emptyBtn.dataset.tile = "0";
      boardEl.appendChild(emptyBtn);
      boardEl._empty = emptyBtn;
    }

    // Map tile values to positions
    const solved = isSolvedState(tiles);
    // Hide all tiles initially
    for (const btn of boardEl._tiles) {
      btn.style.display = "none";
    }
    boardEl._empty.style.display = "none";

    for (let i = 0; i < 16; i++) {
      const val = tiles[i];
      const row = Math.floor(i / 4);
      const col = i % 4;
      if (val === 0) {
        // Position the empty tile
        const btn = boardEl._empty;
        btn.style.transform = `translate(${col * 100}%, ${row * 100}%)`;
        btn.style.position = "absolute";
        btn.style.width = "";
        btn.style.height = "";
        btn.style.display = "block";
        btn.className = "tile empty";
      } else {
        const btn = boardEl._tiles[val - 1];
        btn.style.transform = `translate(${col * 100}%, ${row * 100}%)`;
        btn.style.position = "absolute";
        btn.style.width = "";
        btn.style.height = "";
        btn.style.display = "block";
        btn.className = "tile" + (solved ? " win" : "");
        btn.setAttribute("aria-rowindex", row + 1);
        btn.setAttribute("aria-colindex", col + 1);
      }
    }
  }

  function renderHUD() {
    movesEl.textContent = String(moves);
    timeEl.textContent = formatTime(elapsedMs());
  }

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  // ---------- Timer ----------
  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      if (isRunning) timeEl.textContent = formatTime(elapsedMs());
    }, 250);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function elapsedMs() {
    if (!startTime) return 0;
    return Date.now() - startTime;
  }

  function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const mm = Math.floor(total / 60);
    const ss = total % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }

  // ---------- Board helpers ----------
  function solvedBoard() {
    // [1..15, 0]
    const arr = Array.from({ length: 15 }, (_, i) => i + 1);
    arr.push(0);
    return arr;
  }

  function isSolvedState(arr) {
    for (let i = 0; i < 15; i++) if (arr[i] !== i + 1) return false;
    return arr[15] === 0;
  }

  function isAdjacent(i, j) {
    const r1 = Math.floor(i / 4), c1 = i % 4;
    const r2 = Math.floor(j / 4), c2 = j % 4;
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  }

  function swap(i, j) {
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // ---------- Shuffle with solvability ----------
  function solvableShuffle() {
    const arr = solvedBoard();
    // Fisher–Yates
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (!isSolvable(arr)) {
      // swap any two non-zero tiles to flip parity
      const a = arr.findIndex(v => v !== 0);
      let b = arr.findIndex((v, idx) => v !== 0 && idx !== a);
      if (a !== -1 && b !== -1) [arr[a], arr[b]] = [arr[b], arr[a]];
    }
    return arr;
  }

  // 4x4 solvability:
  // If grid width is even (4), puzzle is solvable iff:
  //  - blank row from bottom is odd and inversions are even, OR
  //  - blank row from bottom is even and inversions are odd.
  function isSolvable(arr) {
    const inv = countInversions(arr);
    const blankFromBottom = blankRowFromBottom(arr);
    const solvable =
      (blankFromBottom % 2 === 1 && inv % 2 === 0) ||
      (blankFromBottom % 2 === 0 && inv % 2 === 1);
    return solvable;
  }

  function countInversions(arr) {
    const a = arr.filter(v => v !== 0);
    let inv = 0;
    for (let i = 0; i < a.length; i++) {
      for (let j = i + 1; j < a.length; j++) {
        if (a[i] > a[j]) inv++;
      }
    }
    return inv;
  }

  // Returns the row of the blank (0) counting from the bottom (1-based)
  function blankRowFromBottom(arr) {
    const idx = arr.indexOf(0);
    const rowFromTop = Math.floor(idx / 4);
    return 4 - rowFromTop;
  }

})();
