# Shadow Dojo

Learn. Fight. Master. A 4-level 2D fighting game that teaches 11 moves through drills.

## Run locally
Double-click `index.html`. No install, no server, no backend.
Or serve the folder: `python3 -m http.server 8000` then open http://localhost:8000

## Host it free
- Netlify: drag the `shadow-dojo` folder onto https://app.netlify.com/drop
- GitHub Pages: push the folder to a repo, then Settings > Pages > deploy from main branch
- Vercel: `npx vercel` inside the folder

## Controls
A/D move, J jab, U cross, I low kick, Y uppercut, H heavy kick, C double punch combo, W jumping roundhouse kick (Y right after a combo = uppercut finisher), K block (hold), L dodge, O counter (right after a block), Esc pause.

## Files
- index.html: page and canvas
- style.css: page and menu styling
- game.js: game logic (levels, training system, combat, enemy AI, drawing, audio)

## Progress, score and screen shake
- **Saved progress.** The highest unlocked level and your best score and stars per level are saved in the browser (localStorage). The menu shows Continue and a Levels screen; "Reset progress" there erases it. Saves are per browser and per address, so a copy of the game hosted somewhere else starts fresh.
- **Score and combos (fights only).** Every landed hit scores points. Hits chained within about two seconds build a combo and raise the multiplier (up to x5). Blocks, dodges, jump-clears, counters, interrupts and the uppercut finisher give bonus points. Getting hit breaks the combo. Each win shows stars (by health left), a speed bonus, your best combo and your total.
- **Screen shake.** Hits, heavy moves, finishers, knockouts and taking damage shake the screen. Turn it off with the "Screen shake" button on the Controls or Pause card. It starts off if your system asks for reduced motion.

## Training Academy
Menu > Academy opens a move-training mode that sits beside the campaign. It reuses the game engine: the same poses and `swing()` animation for demos, the same keys, `tryAtk()` and `resolveAtk()` for practice.
- **Move select.** Lists each lesson with difficulty, locked or unlocked state and completion (stars, best score). A lesson unlocks when the one before it is passed.
- **Lesson.** A demo with Play/Pause, Replay and Speed (normal, 0.5x, 0.25x), split into five stages: starting stance, preparation, execution, recovery, complete move practice. The demo shows the real distance, reach and recovery time of the move.
- **Practice.** Use the normal controls against a dummy. The game records the key pressed, the distance at the strike frame and any inputs made during recovery, and gives feedback only from those measurements.
- **Score (out of 100).** Execution 40 (correct key and the hit lands), distance 30 (struck from the target zone, 60 to 100 percent of the reach of the move), recovery 30 (no inputs while the move is recovering). A lesson is passed with 3 attempts scoring 70 or more. Progress is saved in the browser.
- **Lessons.** Basic Punch (the jab), Jumping Roundhouse Kick (the existing W kick) and Flying Front Kick (F). The flying front kick is new: one pose and one `MV` entry, used only in the academy. It cannot be used in the campaign.
- **Adding a lesson.** Add a move to `MV`/`POSE`/`NM`, then add one line to the `ACD` list in `game.js`.

## Tutorial clips
Before each move's drill, a short animated tutorial plays (move into range, press the key, see the hit) with the key prompts highlighted. Players can replay it or press Enter to start the drill.

To use your own recorded videos instead, create a `videos` folder next to `index.html` and add MP4 files named after the move:
`jab.mp4, block.mp4, cross.mp4, low.mp4, dodge.mp4, upper.mp4, heavy.mp4, counter.mp4, combo.mp4, jkick.mp4, finisher.mp4`
If a file exists it replaces the animated clip for that move; if not, the animation is used automatically. Keep clips short (5 to 10 seconds) and upload the `videos` folder to GitHub with the other files.

