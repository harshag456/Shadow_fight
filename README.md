# Shadow Dojo

Learn. Fight. Master. A 3-level 2D fighting game that teaches 8 moves through drills.

## Run locally
Double-click `index.html`. No install, no server, no backend.
Or serve the folder: `python3 -m http.server 8000` then open http://localhost:8000

## Host it free
- Netlify: drag the `shadow-dojo` folder onto https://app.netlify.com/drop
- GitHub Pages: push the folder to a repo, then Settings > Pages > deploy from main branch
- Vercel: `npx vercel` inside the folder

## Controls
A/D move, J jab, U cross, I low kick, Y uppercut, H heavy kick, K block (hold), L dodge, O counter (right after a block), Esc pause.

## Files
- index.html: page and canvas
- style.css: page and menu styling
- game.js: game logic (levels, training system, combat, enemy AI, drawing, audio)

## Tutorial clips
Before each move's drill, a short animated tutorial plays (move into range, press the key, see the hit) with the key prompts highlighted. Players can replay it or press Enter to start the drill.

To use your own recorded videos instead, create a `videos` folder next to `index.html` and add MP4 files named after the move:
`jab.mp4, block.mp4, cross.mp4, low.mp4, dodge.mp4, upper.mp4, heavy.mp4, counter.mp4`
If a file exists it replaces the animated clip for that move; if not, the animation is used automatically. Keep clips short (5 to 10 seconds) and upload the `videos` folder to GitHub with the other files.
