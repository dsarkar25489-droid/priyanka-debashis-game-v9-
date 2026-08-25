PRIYANKA ♥ DEBASHIS — STORY GAME V6
====================================

MAIN CHANGES FROM V5
--------------------
1. Opening conversation is now staged correctly.
   - Priyanka stays facing Debashis.
   - Debashis stays facing Priyanka.
   - Their idle sprites do not rotate through front/back views.
   - Each line appears as a speech bubble above the person speaking.

2. Dodge is completely removed.
   - No dodge button.
   - No S key.
   - No dodge code.
   - No dodge sound.
   - Jump is now the defensive action.

3. Camera/view is more distant.
   - Characters are smaller.
   - Priyanka sits farther left.
   - Debashis is visibly farther ahead.
   - More of the environment and incoming danger are visible.

4. Environment rendering changed.
   - V5 stacked several scenic parallax strips vertically.
   - V6 uses one large distant scenic layer plus one forest layer.
   - This reduces the "background repeating vertically" appearance.
   - Procedural props are less dense and more varied.

5. Better enemies.
   V6 uses the illustrated enemy artwork already contained inside
   assets/environment_atlas.png:

   - Shadow creature
   - Flying bat
   - Thorn/tree creature
   - Dark knight
   - Purple dragon

   Stronger enemies have HP bars.

6. Moderate/harder enemy pacing.
   - Enemies now arrive in waves.
   - 2–5 enemies per wave.
   - Up to 4 active enemies.
   - Short rest periods between waves.
   - Strong enemy frequency rises as Priyanka gets closer.

CONTROLS
--------
Android:
LEFT
RIGHT
RUN
JUMP
HEART FIRE

Desktop:
A / Left Arrow     Move left
D / Right Arrow    Move right
Shift              Run
Space / Up / W     Jump
J / F              Fire heart

FILES TO REPLACE ON GITHUB
--------------------------
For an existing GitHub Pages repository, replace:

index.html
style.css
audio.js
game.js

Also remove:
assets/audio/dodge.mp3

All other V5 assets continue to work.

GITHUB CACHE
------------
After uploading new files, GitHub Pages may need a short time to deploy.
If the phone still shows the old version, reload the page or use:
Chrome menu -> Reload.

BACKGROUND MUSIC
----------------
The included magical_story_loop.mp3 is the original fantasy loop from V5.


V7 UPDATE
---------
This version replaces both playable characters with the new anime-style atlases derived from the approved reference art.
- Priyanka now uses a pink dress / long-hair anime sprite set.
- Debashis now uses a blue-jacket anime sprite set.
- Character scale was increased slightly to show the new designs better.


V8 DIALOGUE + CAMERA UPDATE
---------------------------
Opening dialogue now continues with:
- Debashis: dao na haat ta please
- Priyanka: Ami thakboi na tomar sathe
Both new lines stay for 3 seconds and fade during their final 1.2 seconds.

Runaway cinematic:
- Priyanka explicitly turns to the left and runs left.
- The source running animation is mirrored to guarantee correct facing.
- Priyanka moves toward the left edge while Debashis becomes farther to the right.
- Camera zoom smoothly decreases while they separate.

Main gameplay camera:
- Far apart: zoomed out.
- Every successful approach gradually zooms the game back in.
- Near reunion: camera is closest.


RUN DIRECTION FIX
-----------------
Priyanka runaway after the opening dialogue now uses the true left-facing run animation.
The run animation row mapping was corrected for both Priyanka and Debashis so left/right run directions display properly.
