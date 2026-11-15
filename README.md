# Nature Quest 3D

Nature Quest is a small browser-based educational adventure prototype. Explore a handcrafted 3D island, collect glowing nature clues, and complete quizzes in the Forest, Ocean, and Wildlife Haven.

## Play locally

Requirements: a modern browser with WebGL support, Python 3 (or another static HTTP server), and internet access to load Three.js from jsDelivr.

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## How to play

- Select **Start exploring**.
- Move with **WASD** or the arrow keys. On touch devices, use the on-screen arrows.
- Gather six glowing seeds for nature clues.
- Stand near a glowing habitat and press **E** to answer its challenge.
- Complete all three challenges and collect at least six clues to finish the quest.
- Optional sound effects can be enabled with the **Sound** button.

Correct habitat answers earn 25 points; collected clues earn 5 points each. Your best score is saved in browser local storage when the quest is completed. No account or server-side data is used.

## Project files

- `index.html` — game interface, accessible dialogs, HUD, and touch controls
- `style.css` — responsive UI and reduced-motion styling
- `game.js` — Three.js world, movement, collectibles, quizzes, score, and game loop

## Release note

This is a self-contained prototype, not yet a production-certified release. It loads Three.js from a CDN, so it requires network access. Before a public release, test target browsers/devices and accessibility, decide a hosting setup, and pin or self-host the runtime dependency.
