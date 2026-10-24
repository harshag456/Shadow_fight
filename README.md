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
