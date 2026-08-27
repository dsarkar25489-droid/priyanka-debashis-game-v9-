(() => {
  "use strict";

  // =========================================================
  // PRIYANKA ♥ DEBASHIS
  // FULL SINGLE-FILE GAME ENGINE
  // Compatible with your existing index.html, style.css,
  // audio.js and assets folder.
  // =========================================================

  // -----------------------------
  // DOM
  // -----------------------------
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const startOverlay = document.getElementById("startOverlay");
  const startButton = document.getElementById("startButton");
  const speechBubble = document.getElementById("speechBubble");
  const speechName = document.getElementById("speechName");
  const speechText = document.getElementById("speechText");
  const hud = document.getElementById("hud");
  const mobileControls = document.getElementById("mobileControls");
  const healthElement = document.getElementById("priyankaHealth");
  const heartsElement = document.getElementById("debashisHearts");
  const progressFill = document.getElementById("heartProgressFill");
  const gameHint = document.getElementById("gameHint");
  const gameMessage = document.getElementById("gameMessage");
  const celebrationOverlay = document.getElementById("celebrationOverlay");
  const continueButton = document.getElementById("continueButton");
  const closeButton = document.getElementById("closeButton");
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  const restartButton = document.getElementById("restartButton");
  const closedOverlay = document.getElementById("closedOverlay");
  const fadeScreen = document.getElementById("fadeScreen");
  const soundButton = document.getElementById("soundButton");

  // -----------------------------
  // GAME STATE
  // -----------------------------
  const MODE = {
    WAIT: "WAIT",
    MEETING: "MEETING",
    DIALOGUE: "DIALOGUE",
    RUNAWAY: "RUNAWAY",
    CHASE: "CHASE",
    CELEBRATION: "CELEBRATION",
    TOGETHER: "TOGETHER",
    GAME_OVER: "GAME_OVER",
    CLOSED: "CLOSED"
  };

  let mode = MODE.WAIT;

  // -----------------------------
  // CONFIG
  // -----------------------------
  const CONFIG = {
    startDistance: 1120,
    reunionDistance: 78,
    minimumDistance: 68,
    maximumDistance: 1900,

    priyankaMaxHealth: 100,
    debashisMaxHearts: 3,

    walkSpeed: 190,
    runSpeed: 345,
    jumpPower: 600,
    gravity: 1580,

    heartSpeed: 620,
    heartCooldown: 0.30,

    priyankaHitPenalty: 68,
    debashisHitPenalty: 42,

    maxActiveEnemies: 4,
    waveMinEnemies: 2,
    waveMaxEnemies: 5,
    waveSpawnMin: 0.58,
    waveSpawnMax: 1.05,
    waveRestMin: 1.35,
    waveRestMax: 2.45,

    enemyAttackChance: 0.42,
    enemyAttackTravelTime: 1.15,

    chunkWidth: 940,
    chunksAhead: 5,
    chunksBehind: 2,

    characterScale: 0.88
  };

  // -----------------------------
  // SPRITE ATLAS SETTINGS
  // -----------------------------
  const PRIYANKA_CELL = {
    width: 200,
    height: 220
  };

  const DEBASHIS_CELL = {
    width: 200,
    height: 220
  };

  /*
  ============================================================
  IMPORTANT

  Your current character atlas uses:

  row 0 = idle
  row 1 = walk right
  row 2 = walk left
  row 3 = run LEFT
  row 4 = run RIGHT
  row 5 = jump
  row 6 = celebration / emotion
  row 7 = heart attack
  ============================================================
  */

  const PRIYANKA_ANIMS = {
    idle:   { row: 0, frames: 1, fps: 1 },
    walkR:  { row: 1, frames: 7, fps: 8 },
    walkL:  { row: 2, frames: 7, fps: 8 },
    runR:   { row: 4, frames: 7, fps: 11 },
    runL:   { row: 3, frames: 7, fps: 11 },
    jump:   { row: 5, frames: 4, fps: 8 },
    emote:  { row: 6, frames: 8, fps: 6 },
    attack: { row: 7, frames: 3, fps: 11 }
  };

  const DEBASHIS_ANIMS = {
    idle:   { row: 0, frames: 1, fps: 1 },
    walkR:  { row: 1, frames: 7, fps: 8 },
    walkL:  { row: 2, frames: 7, fps: 8 },
    runR:   { row: 4, frames: 7, fps: 11 },
    runL:   { row: 3, frames: 7, fps: 11 },
    jump:   { row: 5, frames: 4, fps: 8 },
    emote:  { row: 6, frames: 8, fps: 6 },
    attack: { row: 7, frames: 4, fps: 11 }
  };

  // -----------------------------
  // IMAGES
  // -----------------------------
  const priyankaAtlas = new Image();
  priyankaAtlas.src = "assets/priyanka_atlas.png";

  const debashisAtlas = new Image();
  debashisAtlas.src = "assets/debashis_atlas.png";

  const environmentAtlas = new Image();
  environmentAtlas.src = "assets/environment_atlas.png";

  // -----------------------------
  // ENVIRONMENT CROPS
  // -----------------------------
  const ENV = {
    sky: {
      x: 10,
      y: 18,
      w: 1028,
      h: 95
    },

    forest: {
      x: 10,
      y: 252,
      w: 1028,
      h: 95
    },

    foreground: {
      x: 10,
      y: 373,
      w: 1028,
      h: 52
    },

    fountain: {
      x: 132,
      y: 446,
      w: 150,
      h: 128
    },

    pinkTree: {
      x: 283,
      y: 440,
      w: 165,
      h: 140
    },

    windmill: {
      x: 452,
      y: 448,
      w: 160,
      h: 132
    },

    bridge: {
      x: 610,
      y: 448,
      w: 180,
      h: 128
    },

    portal: {
      x: 810,
      y: 438,
      w: 150,
      h: 150
    },

    gazebo: {
      x: 982,
      y: 446,
      w: 150,
      h: 140
    },

    purpleTree: {
      x: 172,
      y: 720,
      w: 120,
      h: 130
    },

    goldTree: {
      x: 295,
      y: 718,
      w: 120,
      h: 130
    },

    flowerPatch: {
      x: 612,
      y: 726,
      w: 120,
      h: 70
    },

    enemyShadow: {
      x: 18,
      y: 803,
      w: 68,
      h: 72
    },

    enemyBat: {
      x: 180,
      y: 798,
      w: 87,
      h: 73
    },

    enemyThorn: {
      x: 308,
      y: 779,
      w: 92,
      h: 103
    },

    enemyKnight: {
      x: 519,
      y: 775,
      w: 105,
      h: 112
    },

    enemyDragon: {
      x: 625,
      y: 777,
      w: 137,
      h: 118
    }
  };

  // =========================================================
  // CANVAS
  // =========================================================

  let W = 0;
  let H = 0;
  let DPR = 1;

  function resize() {
    DPR = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.round(
      W * DPR
    );

    canvas.height = Math.round(
      H * DPR
    );

    canvas.style.width =
      W + "px";

    canvas.style.height =
      H + "px";

    ctx.setTransform(
      DPR,
      0,
      0,
      DPR,
      0,
      0
    );

    updateSpeechBubblePosition();
  }

  window.addEventListener(
    "resize",
    resize
  );

  resize();

  // =========================================================
  // HELPERS
  // =========================================================

  function clamp(
    value,
    min,
    max
  ) {
    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );
  }

  function lerp(
    a,
    b,
    t
  ) {
    return a + (b - a) * t;
  }

  function randomRange(
    min,
    max
  ) {
    return min +
      Math.random() *
      (max - min);
  }

  function baseGroundY() {
    return H * 0.80;
  }

  // =========================================================
  // UNEVEN HILL / SLOPE TERRAIN
  // =========================================================

  const TERRAIN = {
    longWave: 52,
    midWave: 26,
    shortWave: 9,

    longFreq: 0.0027,
    midFreq: 0.0066,
    shortFreq: 0.0135
  };

  function terrainOffsetAtWorld(
    worldX
  ) {
    /*
    ----------------------------------------------------------
    THREE TERRAIN WAVES

    LONG WAVE
    = big hills

    MID WAVE
    = normal slope changes

    SHORT WAVE
    = small uneven natural variation
    ----------------------------------------------------------
    */

    return (
      Math.sin(
        worldX *
        TERRAIN.longFreq
      ) *
      TERRAIN.longWave +

      Math.sin(
        worldX *
        TERRAIN.midFreq +
        1.35
      ) *
      TERRAIN.midWave +

      Math.sin(
        worldX *
        TERRAIN.shortFreq +
        2.25
      ) *
      TERRAIN.shortWave
    );
  }

  function groundYAtWorld(
    worldX
  ) {
    /*
    Opening scene remains mostly flat.

    When gameplay starts,
    the real hill terrain begins.
    */

    if (
      mode === MODE.WAIT ||
      mode === MODE.MEETING ||
      mode === MODE.DIALOGUE ||
      mode === MODE.RUNAWAY
    ) {
      return baseGroundY();
    }

    return (
      baseGroundY() -
      terrainOffsetAtWorld(
        worldX
      )
    );
  }

  function groundYAtScreenX(
    screenX
  ) {
    return groundYAtWorld(
      worldScroll +
      screenX
    );
  }

  // =========================================================
  // CHARACTERS
  // =========================================================

  const player = {
    worldX: 0,

    // Jump height above local hill.
    y: 0,

    vy: 0,

    health:
      CONFIG.priyankaMaxHealth,

    grounded: true,

    facing: 1,

    state: "idle",

    animTime: 0,

    attacking: 0,

    attackCooldown: 0,

    invulnerable: 0
  };

  const debashis = {
    y: 0,

    vy: 0,

    hearts:
      CONFIG.debashisMaxHearts,

    grounded: true,

    facing: 1,

    state: "idle",

    animTime: 0,

    attacking: 0
  };

  let relationshipDistance =
    CONFIG.startDistance;

  let worldScroll = 0;

  let time = 0;

  let celebrationTime = 0;

  let messageTimer = 0;

  // =========================================================
  // CAMERA ZOOM
  // =========================================================

  let cameraZoom = 1.0;

  function getTargetCameraZoom() {
    /*
    When Priyanka runs away:
    camera zooms OUT.

    During gameplay:
    farther apart = zoomed out
    closer together = zoomed in
    */

    if (
      mode === MODE.RUNAWAY
    ) {
      const t = clamp(
        meeting.phaseTime / 3.8,
        0,
        1
      );

      return lerp(
        1.0,
        0.70,
        t
      );
    }

    if (
      mode === MODE.CHASE
    ) {
      const closeness = clamp(
        (
          CONFIG.startDistance -
          relationshipDistance
        ) /
        (
          CONFIG.startDistance -
          CONFIG.reunionDistance
        ),
        0,
        1
      );

      return lerp(
        0.70,
        1.06,
        closeness
      );
    }

    if (
      mode === MODE.TOGETHER ||
      mode === MODE.CELEBRATION
    ) {
      return 1.04;
    }

    return 1.0;
  }

  function updateCameraZoom(
    dt
  ) {
    cameraZoom = lerp(
      cameraZoom,
      getTargetCameraZoom(),
      clamp(
        dt * 2.6,
        0,
        1
      )
    );
  }

  // =========================================================
  // INPUT
  // =========================================================

  const keys = {
    left: false,
    right: false,
    run: false
  };

  // =========================================================
  // WORLD OBJECTS
  // =========================================================

  const enemies = [];

  const heartShots = [];

  const incomingAttacks = [];

  const groundHazards = [];

  const particles = [];

  const chunks =
    new Map();

  let waveRemaining = 0;

  let waveSpawnTimer = 0;

  let waveRestTimer = 0.8;

  let groundHazardTimer = 4.4;

  // =========================================================
  // OPENING STORY DATA
  // =========================================================

  const meeting = {
    priyankaX: 0,

    debashisX: 0,

    targetDebashisX: 0,

    phaseTime: 0
  };

  const dialogueSequence = [
    {
      speaker:
        "DEBASHIS",

      text:
        "Bengali?",

      duration:
        1.7,

      fade:
        false,

      sound:
        "dialogueDebashis"
    },

    {
      speaker:
        "PRIYANKA",

      text:
        "YES",

      duration:
        1.35,

      fade:
        false,

      sound:
        "dialoguePriyanka"
    },

    {
      speaker:
        "DEBASHIS",

      text:
        "Haat ta Dao",

      duration:
        1.8,

      fade:
        false,

      sound:
        "dialogueDebashis"
    },

    {
      speaker:
        "PRIYANKA",

      text:
        "Yarki Hoche naki, haat dhorbe!",

      duration:
        2.75,

      fade:
        false,

      sound:
        "dialoguePriyanka"
    },

    {
      speaker:
        "DEBASHIS",

      text:
        "dao na haat ta please",

      duration:
        3.0,

      fade:
        true,

      sound:
        "dialogueDebashis"
    },

    {
      speaker:
        "PRIYANKA",

      text:
        "Ami thakboi na tomar sathe",

      duration:
        3.0,

      fade:
        true,

      sound:
        "dialoguePriyanka"
    }
  ];

  let dialogueIndex = -1;

  let dialogueTimer = 0;

  // =========================================================
  // ENEMY DEFINITIONS
  // =========================================================

  const ENEMY_TYPES = {
    shadow: {
      crop:
        ENV.enemyShadow,

      hp:
        1,

      speed:
        98,

      reward:
        27,

      scale:
        0.78,

      flying:
        false,

      ranged:
        false
    },

    bat: {
      crop:
        ENV.enemyBat,

      hp:
        1,

      speed:
        128,

      reward:
        31,

      scale:
        0.82,

      flying:
        true,

      ranged:
        false
    },

    thorn: {
      crop:
        ENV.enemyThorn,

      hp:
        2,

      speed:
        82,

      reward:
        42,

      scale:
        0.82,

      flying:
        false,

      ranged:
        false
    },

    knight: {
      crop:
        ENV.enemyKnight,

      hp:
        3,

      speed:
        69,

      reward:
        55,

      scale:
        0.86,

      flying:
        false,

      ranged:
        true
    },

    dragon: {
      crop:
        ENV.enemyDragon,

      hp:
        4,

      speed:
        86,

      reward:
        72,

      scale:
        0.88,

      flying:
        true,

      ranged:
        true
    }
  };

  // =========================================================
  // PROCEDURAL WORLD
  // =========================================================

  function seededRandom(
    seed
  ) {
    const x =
      Math.sin(
        seed * 999.91
      ) *
      43758.5453;

    return (
      x -
      Math.floor(x)
    );
  }

  function createChunk(
    index
  ) {
    const types = [
      "pinkTree",
      "fountain",
      "purpleTree",
      "goldTree",
      "flowerPatch",
      "windmill",
      "bridge",
      "gazebo"
    ];

    const objects = [];

    const count =
      2 +
      Math.floor(
        seededRandom(
          index + 2
        ) *
        3
      );

    for (
      let i = 0;
      i < count;
      i++
    ) {
      const r =
        seededRandom(
          index * 20 +
          i * 7.37
        );

      const type =
        types[
          Math.floor(
            r *
            types.length
          )
        ];

      objects.push({
        type,

        x:
          index *
          CONFIG.chunkWidth +
          120 +
          seededRandom(
            index * 40 +
            i * 5.9
          ) *
          (
            CONFIG.chunkWidth -
            240
          ),

        scale:
          0.54 +
          seededRandom(
            index * 70 +
            i
          ) *
          0.48
      });
    }

    return {
      index,
      objects
    };
  }

  function maintainChunks() {
    const center =
      Math.floor(
        worldScroll /
        CONFIG.chunkWidth
      );

    for (
      let i =
        center -
        CONFIG.chunksBehind;

      i <=
        center +
        CONFIG.chunksAhead;

      i++
    ) {
      if (
        i < 0
      ) {
        continue;
      }

      if (
        !chunks.has(i)
      ) {
        chunks.set(
          i,
          createChunk(i)
        );
      }
    }

    for (
      const index
      of chunks.keys()
    ) {
      if (
        index <
        center -
        CONFIG.chunksBehind -
        1
      ) {
        chunks.delete(
          index
        );
      }
    }
  }

  // =========================================================
  // UI
  // =========================================================

  function showMessage(
    text,
    duration = 1.4
  ) {
    gameMessage.textContent =
      text;

    gameMessage
      .classList
      .add(
        "show"
      );

    messageTimer =
      duration;
  }

  function hideMessage() {
    gameMessage
      .classList
      .remove(
        "show"
      );
  }

  function updateHud() {
    const hp =
      clamp(
        player.health /
        CONFIG.priyankaMaxHealth,
        0,
        1
      );

    healthElement.style.width =
      hp * 100 +
      "%";

    heartsElement
      .querySelectorAll(
        "span"
      )
      .forEach(
        (
          node,
          index
        ) => {
          node.classList.toggle(
            "lost",
            index >=
            debashis.hearts
          );
        }
      );

    const progress =
      clamp(
        (
          CONFIG.startDistance -
          relationshipDistance
        ) /
        (
          CONFIG.startDistance -
          CONFIG.reunionDistance
        ),
        0,
        1
      );

    progressFill.style.width =
      progress * 100 +
      "%";
  }

  // =========================================================
  // CHARACTER SCREEN POSITIONS
  // =========================================================

  function chaseSeparation() {
    const t =
      clamp(
        (
          relationshipDistance -
          CONFIG.reunionDistance
        ) /
        (
          CONFIG.startDistance -
          CONFIG.reunionDistance
        ),
        0,
        1
      );

    return lerp(
      W * 0.12,
      W * 0.50,
      t
    );
  }

  function getCharacterScreenPositions() {
    /*
    TOGETHER MODE

    Debashis behind
    Priyanka in front
    */

    if (
      mode === MODE.TOGETHER
    ) {
      return {
        priyanka:
          W * 0.60,

        debashis:
          W * 0.43
      };
    }

    return {
      priyanka:
        W * 0.14,

      debashis:
        W * 0.14 +
        chaseSeparation()
    };
  }

  // =========================================================
  // SPEECH BUBBLE
  // =========================================================

  function updateSpeechBubblePosition() {
    if (
      !speechBubble ||
      speechBubble
        .classList
        .contains(
          "hidden"
        )
    ) {
      return;
    }

    const item =
      dialogueSequence[
        dialogueIndex
      ];

    if (
      !item
    ) {
      return;
    }

    const x =
      item.speaker ===
      "PRIYANKA"
        ?
        meeting.priyankaX
        :
        meeting.debashisX;

    speechBubble.style.left =
      x + "px";

    speechBubble.style.top =
      (
        baseGroundY() -
        155
      ) +
      "px";
  }

  function setSpeechOpacity(
    value,
    seconds = 0
  ) {
    speechBubble.style.transition =
      seconds > 0
        ?
        `opacity ${seconds}s ease`
        :
        "none";

    speechBubble.style.opacity =
      String(value);
  }

  // =========================================================
  // ACTIONS
  // =========================================================

  function setMirroredState(
    state
  ) {
    player.state =
      state;

    debashis.state =
      state;
  }

  function jump() {
    if (
      mode !== MODE.CHASE &&
      mode !== MODE.TOGETHER
    ) {
      return;
    }

    if (
      !player.grounded
    ) {
      return;
    }

    player.vy =
      CONFIG.jumpPower;

    debashis.vy =
      CONFIG.jumpPower;

    player.grounded =
      false;

    debashis.grounded =
      false;

    if (
      window.gameAudio
    ) {
      gameAudio.play(
        "jump",
        0.72
      );
    }
  }

  function fireHeart() {
    if (
      mode !== MODE.CHASE &&
      mode !== MODE.TOGETHER
    ) {
      return;
    }

    if (
      player.attackCooldown >
      0
    ) {
      return;
    }

    player.attackCooldown =
      CONFIG.heartCooldown;

    player.attacking =
      0.26;

    debashis.attacking =
      0.26;

    const positions =
      getCharacterScreenPositions();

    const pg =
      groundYAtScreenX(
        positions.priyanka
      );

    const dg =
      groundYAtScreenX(
        positions.debashis
      );

    heartShots.push({
      owner:
        "priyanka",

      x:
        positions.priyanka +
        28,

      y:
        pg -
        player.y -
        67 *
        cameraZoom,

      vx:
        CONFIG.heartSpeed,

      life:
        1.45
    });

    heartShots.push({
      owner:
        "debashis",

      x:
        positions.debashis +
        28,

      y:
        dg -
        debashis.y -
        67 *
        cameraZoom,

      vx:
        CONFIG.heartSpeed,

      life:
        1.45
    });

    spawnSparkles(
      positions.debashis +
      30,

      dg -
      68 *
      cameraZoom,

      "#ff72b1",

      10
    );

    if (
      window.gameAudio
    ) {
      gameAudio.play(
        "heart",
        0.72
      );
    }
  }

  // =========================================================
  // DAMAGE
  // =========================================================

  function hurtPriyanka(
    damage
  ) {
    if (
      player.invulnerable >
      0
    ) {
      return;
    }

    player.health =
      Math.max(
        0,
        player.health -
        damage
      );

    player.invulnerable =
      0.86;

    relationshipDistance =
      clamp(
        relationshipDistance +
        CONFIG.priyankaHitPenalty,
        CONFIG.minimumDistance,
        CONFIG.maximumDistance
      );

    if (
      window.gameAudio
    ) {
      gameAudio.play(
        "playerHit",
        0.76
      );
    }

    showMessage(
      "Priyanka was hurt — Debashis moved farther away",
      1.5
    );

    updateHud();

    if (
      player.health <=
      0
    ) {
      triggerGameOver();
    }
  }

  function hurtDebashis() {
    debashis.hearts =
      Math.max(
        0,
        debashis.hearts -
        1
      );

    relationshipDistance =
      clamp(
        relationshipDistance +
        CONFIG.debashisHitPenalty,
        CONFIG.minimumDistance,
        CONFIG.maximumDistance
      );

    if (
      window.gameAudio
    ) {
      gameAudio.play(
        "debashisHit",
        0.75
      );
    }

    showMessage(
      "Debashis was hit! Protect him!",
      1.2
    );

    updateHud();

    if (
      debashis.hearts <=
      0
    ) {
      triggerGameOver();
    }
  }

  // =========================================================
  // ENEMY DIRECTOR
  // =========================================================

  function currentProgress() {
    return clamp(
      (
        CONFIG.startDistance -
        relationshipDistance
      ) /
      (
        CONFIG.startDistance -
        CONFIG.reunionDistance
      ),
      0,
      1
    );
  }

  function chooseEnemyType() {
    const progress =
      currentProgress();

    const roll =
      Math.random();

    if (
      progress >
      0.68 &&
      roll <
      0.14
    ) {
      return "dragon";
    }

    if (
      progress >
      0.42 &&
      roll <
      0.35
    ) {
      return "knight";
    }

    if (
      progress >
      0.22 &&
      roll <
      0.56
    ) {
      return "thorn";
    }

    if (
      roll <
      0.38
    ) {
      return "bat";
    }

    return "shadow";
  }

  function startNewWave() {
    const progress =
      currentProgress();

    const extra =
      progress >
      0.72
        ?
        1
        :
        0;

    waveRemaining =
      Math.floor(
        randomRange(
          CONFIG.waveMinEnemies,
          CONFIG.waveMaxEnemies +
          1 +
          extra
        )
      );

    waveSpawnTimer =
      0.15;
  }

  function spawnEnemy() {
    if (
      mode !== MODE.CHASE &&
      mode !== MODE.TOGETHER
    ) {
      return false;
    }

    if (
      enemies.length >=
      CONFIG.maxActiveEnemies
    ) {
      return false;
    }

    const type =
      chooseEnemyType();

    const def =
      ENEMY_TYPES[
        type
      ];

    enemies.push({
      type,

      relX:
        W * 0.37 +
        randomRange(
          90,
          190
        ),

      hp:
        def.hp,

      maxHp:
        def.hp,

      speed:
        def.speed,

      reward:
        def.reward,

      attackTimer:
        randomRange(
          1.0,
          2.0
        ),

      attacked:
        false,

      bob:
        Math.random() *
        Math.PI *
        2,

      flash:
        0
    });

    return true;
  }

  function updateEnemyDirector(
    dt
  ) {
    if (
      waveRemaining >
      0
    ) {
      waveSpawnTimer -=
        dt;

      if (
        waveSpawnTimer <=
        0
      ) {
        if (
          spawnEnemy()
        ) {
          waveRemaining--;

          waveSpawnTimer =
            randomRange(
              CONFIG.waveSpawnMin,
              CONFIG.waveSpawnMax
            );
        } else {
          waveSpawnTimer =
            0.25;
        }
      }

      return;
    }

    waveRestTimer -=
      dt;

    if (
      waveRestTimer <=
      0 &&
      enemies.length <=
      1
    ) {
      startNewWave();

      waveRestTimer =
        randomRange(
          CONFIG.waveRestMin,
          CONFIG.waveRestMax
        );
    }
  }

  // =========================================================
  // GROUND HAZARD
  // =========================================================

  function spawnGroundHazard() {
    if (
      mode !==
      MODE.CHASE
    ) {
      return;
    }

    groundHazards.push({
      relX:
        W * 0.53 +
        randomRange(
          70,
          150
        ),

      speed:
        randomRange(
          105,
          135
        ),

      warning:
        false
    });
  }

  // =========================================================
  // ENEMY DEFEAT
  // =========================================================

  function defeatEnemy(
    index
  ) {
    const enemy =
      enemies[
        index
      ];

    if (
      !enemy
    ) {
      return;
    }

    relationshipDistance =
      clamp(
        relationshipDistance -
        enemy.reward,
        CONFIG.minimumDistance,
        CONFIG.maximumDistance
      );

    const positions =
      getCharacterScreenPositions();

    const x =
      positions.debashis +
      enemy.relX;

    const def =
      ENEMY_TYPES[
        enemy.type
      ];

    const y =
      getEnemyY(
        enemy,
        def,
        x
      );

    spawnSparkles(
      x,
      y,
      "#ffd08c",
      18
    );

    enemies.splice(
      index,
      1
    );

    if (
      window.gameAudio
    ) {
      gameAudio.play(
        "enemyDefeat",
        0.60
      );
    }

    showMessage(
      "♥ Closer",
      0.65
    );

    updateHud();

    if (
      mode === MODE.CHASE &&
      relationshipDistance <=
      CONFIG.reunionDistance
    ) {
      beginReunion();
    }
  }

  function spawnIncomingAttack(
    enemy
  ) {
    incomingAttacks.push({
      life:
        CONFIG.enemyAttackTravelTime,

      duration:
        CONFIG.enemyAttackTravelTime,

      sourceOffset:
        enemy.relX,

      checked:
        false
    });

    showMessage(
      "Jump!",
      0.6
    );
  }

  // =========================================================
  // PARTICLES
  // =========================================================

  function spawnSparkles(
    x,
    y,
    color,
    count
  ) {
    for (
      let i = 0;
      i < count;
      i++
    ) {
      particles.push({
        x,
        y,

        vx:
          randomRange(
            -90,
            90
          ),

        vy:
          randomRange(
            -120,
            30
          ),

        life:
          randomRange(
            0.35,
            0.8
          ),

        maxLife:
          0.8,

        size:
          randomRange(
            2,
            5
          ),

        color
      });
    }
  }

  // =========================================================
  // STORY
  // =========================================================

  function startStory() {
    startOverlay
      .classList
      .add(
        "hidden"
      );

    mode =
      MODE.MEETING;

    meeting.priyankaX =
      W * 0.30;

    meeting.debashisX =
      W * 0.79;

    meeting.targetDebashisX =
      W * 0.61;

    meeting.phaseTime =
      0;

    player.state =
      "idle";

    player.facing =
      1;

    debashis.state =
      "walkL";

    debashis.facing =
      -1;

    if (
      window.gameAudio
    ) {
      gameAudio.start();

      gameAudio.play(
        "ui",
        0.5
      );
    }
  }

  function startDialogue() {
    mode =
      MODE.DIALOGUE;

    /*
    Both characters are locked
    facing each other.
    */

    player.state =
      "idle";

    player.facing =
      1;

    debashis.state =
      "idle";

    debashis.facing =
      -1;

    speechBubble
      .classList
      .remove(
        "hidden"
      );

    dialogueIndex =
      -1;

    nextDialogue();
  }

  function nextDialogue() {
    dialogueIndex++;

    if (
      dialogueIndex >=
      dialogueSequence.length
    ) {
      speechBubble
        .classList
        .add(
          "hidden"
        );

      setSpeechOpacity(
        1,
        0
      );

      mode =
        MODE.RUNAWAY;

      meeting.phaseTime =
        0;

      /*
      --------------------------------------------------------
      IMPORTANT

      Priyanka turns LEFT
      and uses true LEFT-RUN animation.

      No mirror is used here.
      --------------------------------------------------------
      */

      player.facing =
        -1;

      player.state =
        "runL";

      debashis.facing =
        -1;

      debashis.state =
        "idle";

      return;
    }

    const item =
      dialogueSequence[
        dialogueIndex
      ];

    speechName.textContent =
      item.speaker;

    speechText.textContent =
      item.text;

    dialogueTimer =
      item.duration;

    setSpeechOpacity(
      1,
      0
    );

    updateSpeechBubblePosition();

    if (
      window.gameAudio
    ) {
      gameAudio.play(
        item.sound,
        0.62
      );
    }
  }

  function updateDialogueFade() {
    const item =
      dialogueSequence[
        dialogueIndex
      ];

    if (
      !item ||
      !item.fade
    ) {
      return;
    }

    /*
    The final two dialogue lines
    stay for 3 seconds.

    They remain fully visible first,
    then fade slowly during final second.
    */

    if (
      dialogueTimer <=
      1.0 &&
      speechBubble.style.opacity !==
      "0"
    ) {
      setSpeechOpacity(
        0,
        0.95
      );
    }
  }

  function beginChase() {
    mode =
      MODE.CHASE;

    relationshipDistance =
      CONFIG.startDistance;

    player.worldX =
      0;

    worldScroll =
      0;

    player.state =
      "idle";

    player.facing =
      1;

    player.y =
      0;

    player.vy =
      0;

    player.grounded =
      true;

    debashis.state =
      "idle";

    debashis.facing =
      1;

    debashis.y =
      0;

    debashis.vy =
      0;

    debashis.grounded =
      true;

    hud
      .classList
      .remove(
        "hidden"
      );

    mobileControls
      .classList
      .remove(
        "hidden"
      );

    waveRemaining =
      0;

    waveRestTimer =
      0.30;

    waveSpawnTimer =
      0;

    groundHazardTimer =
      3.3;

    updateHud();

    showMessage(
      "Priyanka sees danger near Debashis — protect him ♥",
      2.1
    );
  }

  // =========================================================
  // GAME OVER
  // =========================================================

  function triggerGameOver() {
    mode =
      MODE.GAME_OVER;

    mobileControls
      .classList
      .add(
        "hidden"
      );

    gameOverOverlay
      .classList
      .remove(
        "hidden"
      );
  }

  function restartGameplay() {
    enemies.length = 0;

    heartShots.length = 0;

    incomingAttacks.length = 0;

    groundHazards.length = 0;

    particles.length = 0;

    player.health =
      CONFIG.priyankaMaxHealth;

    player.y =
      0;

    player.vy =
      0;

    player.grounded =
      true;

    player.invulnerable =
      0;

    debashis.hearts =
      CONFIG.debashisMaxHearts;

    debashis.y =
      0;

    debashis.vy =
      0;

    debashis.grounded =
      true;

    relationshipDistance =
      CONFIG.startDistance;

    gameOverOverlay
      .classList
      .add(
        "hidden"
      );

    beginChase();
  }

  // =========================================================
  // REUNION
  // =========================================================

  function beginReunion() {
    if (
      mode !==
      MODE.CHASE
    ) {
      return;
    }

    mode =
      MODE.CELEBRATION;

    enemies.length =
      0;

    incomingAttacks.length =
      0;

    groundHazards.length =
      0;

    mobileControls
      .classList
      .add(
        "hidden"
      );

    gameHint.textContent =
      "Together ♥";

    celebrationTime =
      0;

    player.state =
      "emote";

    debashis.state =
      "emote";

    if (
      window.gameAudio
    ) {
      gameAudio.play(
        "celebration",
        0.78
      );
    }

    for (
      let i = 0;
      i < 90;
      i++
    ) {
      particles.push({
        x:
          randomRange(
            0,
            W
          ),

        y:
          randomRange(
            H * 0.06,
            H * 0.58
          ),

        vx:
          randomRange(
            -55,
            55
          ),

        vy:
          randomRange(
            -45,
            45
          ),

        life:
          randomRange(
            1.2,
            3.2
          ),

        maxLife:
          3.2,

        size:
          randomRange(
            2,
            7
          ),

        color:
          Math.random() >
          0.5
            ?
            "#ffd574"
            :
            "#ff7eb4"
      });
    }

    setTimeout(
      () => {
        if (
          mode ===
          MODE.CELEBRATION
        ) {
          celebrationOverlay
            .classList
            .remove(
              "hidden"
            );
        }
      },
      1100
    );
  }

  function continueTogether() {
    celebrationOverlay
      .classList
      .add(
        "hidden"
      );

    mode =
      MODE.TOGETHER;

    relationshipDistance =
      CONFIG.minimumDistance;

    player.health =
      CONFIG.priyankaMaxHealth;

    debashis.hearts =
      CONFIG.debashisMaxHearts;

    player.state =
      "idle";

    debashis.state =
      "idle";

    hud
      .classList
      .remove(
        "hidden"
      );

    mobileControls
      .classList
      .remove(
        "hidden"
      );

    gameHint.textContent =
      "Together Forever ♥";

    waveRemaining =
      0;

    waveRestTimer =
      0.6;

    updateHud();

    showMessage(
      "Now Priyanka leads and they fight together ♥",
      2.2
    );
  }

  function closeStory() {
    fadeScreen
      .classList
      .add(
        "on"
      );

    setTimeout(
      () => {
        celebrationOverlay
          .classList
          .add(
            "hidden"
          );

        closedOverlay
          .classList
          .remove(
            "hidden"
          );

        fadeScreen
          .classList
          .remove(
            "on"
          );

        mode =
          MODE.CLOSED;

        if (
          window.gameAudio &&
          gameAudio.music
        ) {
          gameAudio.music.pause();
        }

        try {
          window.close();
        }
        catch (_) {
          /*
          Browser may block
          window.close().
          */
        }
      },
      1500
    );
  }

  // =========================================================
  // VERTICAL PHYSICS
  // =========================================================

  function updateVertical(
    character,
    dt
  ) {
    if (
      !character.grounded
    ) {
      character.vy -=
        CONFIG.gravity *
        dt;

      character.y +=
        character.vy *
        dt;

      if (
        character.y <=
        0
      ) {
        character.y =
          0;

        character.vy =
          0;

        character.grounded =
          true;
      }
    }
  }

  // =========================================================
  // GAMEPLAY UPDATE
  // =========================================================

  function updateGameplay(
    dt
  ) {
    let movement =
      0;

    if (
      keys.left
    ) {
      movement--;
    }

    if (
      keys.right
    ) {
      movement++;
    }

    const speed =
      keys.run
        ?
        CONFIG.runSpeed
        :
        CONFIG.walkSpeed;

    if (
      movement !==
      0
    ) {
      const facing =
        movement >
        0
          ?
          1
          :
          -1;

      player.facing =
        facing;

      debashis.facing =
        facing;

      player.worldX =
        Math.max(
          0,
          player.worldX +
          movement *
          speed *
          dt
        );

      worldScroll =
        Math.max(
          0,
          worldScroll +
          movement *
          speed *
          dt
        );

      if (
        player.grounded &&
        player.attacking <=
        0
      ) {
        if (
          keys.run
        ) {
          setMirroredState(
            facing >
            0
              ?
              "runR"
              :
              "runL"
          );
        }
        else {
          setMirroredState(
            facing >
            0
              ?
              "walkR"
              :
              "walkL"
          );
        }
      }
    }
    else if (
      player.grounded &&
      player.attacking <=
      0
    ) {
      setMirroredState(
        "idle"
      );
    }

    if (
      !player.grounded
    ) {
      setMirroredState(
        "jump"
      );
    }

    if (
      player.attacking >
      0
    ) {
      setMirroredState(
        "attack"
      );
    }

    player.attackCooldown =
      Math.max(
        0,
        player.attackCooldown -
        dt
      );

    player.attacking =
      Math.max(
        0,
        player.attacking -
        dt
      );

    debashis.attacking =
      Math.max(
        0,
        debashis.attacking -
        dt
      );

    player.invulnerable =
      Math.max(
        0,
        player.invulnerable -
        dt
      );

    updateVertical(
      player,
      dt
    );

    updateVertical(
      debashis,
      dt
    );

    player.animTime +=
      dt;

    debashis.animTime +=
      dt;

    maintainChunks();

    updateEnemyDirector(
      dt
    );

    updateEnemies(
      dt
    );

    updateHeartShots(
      dt
    );

    updateIncomingAttacks(
      dt
    );

    updateGroundHazards(
      dt
    );

    updateParticles(
      dt
    );

    if (
      mode ===
      MODE.CHASE
    ) {
      groundHazardTimer -=
        dt;

      if (
        groundHazardTimer <=
        0
      ) {
        spawnGroundHazard();

        groundHazardTimer =
          randomRange(
            5.0,
            8.2
          );
      }
    }
  }

  // =========================================================
  // ENEMY UPDATE
  // =========================================================

  function updateEnemies(
    dt
  ) {
    for (
      let i =
        enemies.length -
        1;

      i >= 0;

      i--
    ) {
      const enemy =
        enemies[i];

      const def =
        ENEMY_TYPES[
          enemy.type
        ];

      enemy.relX -=
        enemy.speed *
        dt;

      enemy.attackTimer -=
        dt;

      enemy.flash =
        Math.max(
          0,
          enemy.flash -
          dt
        );

      if (
        def.ranged &&
        !enemy.attacked &&
        enemy.attackTimer <=
        0 &&
        enemy.relX <
        W * 0.34 &&
        Math.random() <
        CONFIG.enemyAttackChance
      ) {
        enemy.attacked =
          true;

        spawnIncomingAttack(
          enemy
        );
      }

      if (
        enemy.relX <=
        2
      ) {
        enemies.splice(
          i,
          1
        );

        hurtDebashis();
      }
    }
  }

  // =========================================================
  // HEART SHOT UPDATE
  // =========================================================

  function updateHeartShots(
    dt
  ) {
    const positions =
      getCharacterScreenPositions();

    for (
      let i =
        heartShots.length -
        1;

      i >=
        0;

      i--
    ) {
      const shot =
        heartShots[i];

      shot.x +=
        shot.vx *
        dt;

      shot.life -=
        dt;

      let hit =
        false;

      for (
        let e =
          enemies.length -
          1;

        e >=
          0;

        e--
      ) {
        const enemy =
          enemies[e];

        const def =
          ENEMY_TYPES[
            enemy.type
          ];

        const ex =
          positions.debashis +
          enemy.relX;

        const ey =
          getEnemyY(
            enemy,
            def,
            ex
          );

        const hitRadius =
          def.flying
            ?
            44
            :
            49;

        if (
          Math.abs(
            shot.x -
            ex
          ) <
          hitRadius &&

          Math.abs(
            shot.y -
            ey
          ) <
          52
        ) {
          enemy.hp--;

          enemy.flash =
            0.12;

          spawnSparkles(
            ex,
            ey,
            "#ff86b6",
            8
          );

          heartShots.splice(
            i,
            1
          );

          hit =
            true;

          if (
            enemy.hp <=
            0
          ) {
            defeatEnemy(
              e
            );
          }

          break;
        }
      }

      if (
        !hit &&
        shot.life <=
        0
      ) {
        heartShots.splice(
          i,
          1
        );
      }
    }
  }

  // =========================================================
  // INCOMING ATTACK UPDATE
  // =========================================================

  function updateIncomingAttacks(
    dt
  ) {
    for (
      let i =
        incomingAttacks.length -
        1;

      i >=
        0;

      i--
    ) {
      const attack =
        incomingAttacks[i];

      attack.life -=
        dt;

      if (
        attack.life <=
        0 &&
        !attack.checked
      ) {
        attack.checked =
          true;

        const avoided =
          !player.grounded &&
          player.y >
          38;

        if (
          !avoided
        ) {
          hurtPriyanka(
            14
          );
        }
        else {
          showMessage(
            "Nice jump ♥",
            0.62
          );
        }

        incomingAttacks.splice(
          i,
          1
        );
      }
    }
  }

  // =========================================================
  // HAZARD UPDATE
  // =========================================================

  function updateGroundHazards(
    dt
  ) {
    for (
      let i =
        groundHazards.length -
        1;

      i >=
        0;

      i--
    ) {
      const hazard =
        groundHazards[i];

      hazard.relX -=
        hazard.speed *
        dt;

      if (
        hazard.relX <
        115 &&
        !hazard.warning
      ) {
        hazard.warning =
          true;

        showMessage(
          "Jump!",
          0.62
        );
      }

      if (
        hazard.relX <=
        0
      ) {
        const safe =
          !debashis.grounded &&
          debashis.y >
          34;

        if (
          !safe
        ) {
          hurtDebashis();
        }
        else {
          showMessage(
            "Saved ♥",
            0.58
          );
        }

        groundHazards.splice(
          i,
          1
        );
      }
    }
  }

  // =========================================================
  // PARTICLES UPDATE
  // =========================================================

  function updateParticles(
    dt
  ) {
    for (
      let i =
        particles.length -
        1;

      i >=
        0;

      i--
    ) {
      const p =
        particles[i];

      p.x +=
        p.vx *
        dt;

      p.y +=
        p.vy *
        dt;

      p.vy +=
        45 *
        dt;

      p.life -=
        dt;

      if (
        p.life <=
        0
      ) {
        particles.splice(
          i,
          1
        );
      }
    }
  }

  // =========================================================
  // STORY UPDATE
  // =========================================================

  function updateStory(
    dt
  ) {
    player.animTime +=
      dt;

    debashis.animTime +=
      dt;

    // --------------------------
    // DEBASHIS WALKS TO PRIYANKA
    // --------------------------
    if (
      mode ===
      MODE.MEETING
    ) {
      meeting.phaseTime +=
        dt;

      meeting.debashisX -=
        86 *
        dt;

      if (
        meeting.debashisX <=
        meeting.targetDebashisX
      ) {
        meeting.debashisX =
          meeting.targetDebashisX;

        debashis.state =
          "idle";

        debashis.facing =
          -1;

        startDialogue();
      }

      return;
    }

    // --------------------------
    // TALKING
    // --------------------------
    if (
      mode ===
      MODE.DIALOGUE
    ) {
      /*
      Keep both facing each other.
      Never rotate.
      */

      player.state =
        "idle";

      player.facing =
        1;

      debashis.state =
        "idle";

      debashis.facing =
        -1;

      dialogueTimer -=
        dt;

      updateDialogueFade();

      updateSpeechBubblePosition();

      if (
        dialogueTimer <=
        0
      ) {
        nextDialogue();
      }

      return;
    }

    // --------------------------
    // PRIYANKA RUNS AWAY LEFT
    // --------------------------
    if (
      mode ===
      MODE.RUNAWAY
    ) {
      meeting.phaseTime +=
        dt;

      meeting.priyankaX -=
        205 *
        dt;

      meeting.priyankaX =
        Math.max(
          W * 0.11,
          meeting.priyankaX
        );

      /*
      TRUE LEFT-FACING RUN.
      */

      player.state =
        "runL";

      player.facing =
        -1;

      debashis.state =
        "idle";

      debashis.facing =
        -1;

      if (
        meeting.phaseTime >
        3.8
      ) {
        beginChase();
      }
    }
  }

  // =========================================================
  // MAIN UPDATE
  // =========================================================

  function update(
    dt
  ) {
    time +=
      dt;

    updateCameraZoom(
      dt
    );

    if (
      messageTimer >
      0
    ) {
      messageTimer -=
        dt;

      if (
        messageTimer <=
        0
      ) {
        hideMessage();
      }
    }

    if (
      mode === MODE.MEETING ||
      mode === MODE.DIALOGUE ||
      mode === MODE.RUNAWAY
    ) {
      updateStory(
        dt
      );
    }
    else if (
      mode === MODE.CHASE ||
      mode === MODE.TOGETHER
    ) {
      updateGameplay(
        dt
      );
    }
    else if (
      mode === MODE.CELEBRATION
    ) {
      celebrationTime +=
        dt;

      updateParticles(
        dt
      );

      player.state =
        "emote";

      debashis.state =
        "emote";

      player.animTime +=
        dt;

      debashis.animTime +=
        dt;
    }
  }

  // =========================================================
  // DRAW HELPERS
  // =========================================================

  function drawCrop(
    crop,
    dx,
    dy,
    dw,
    dh
  ) {
    if (
      !environmentAtlas.complete ||
      !environmentAtlas.naturalWidth
    ) {
      return;
    }

    ctx.drawImage(
      environmentAtlas,

      crop.x,
      crop.y,
      crop.w,
      crop.h,

      dx,
      dy,
      dw,
      dh
    );
  }

  function drawHorizontalScene(
    crop,
    y,
    height,
    parallax
  ) {
    if (
      !environmentAtlas.complete ||
      !environmentAtlas.naturalWidth
    ) {
      return;
    }

    const width =
      crop.w *
      (
        height /
        crop.h
      );

    const offset =
      -(
        (
          worldScroll *
          parallax
        ) %
        width
      );

    /*
    Horizontal repetition only.
    Nothing repeats vertically.
    */

    for (
      let x =
        offset -
        width;

      x <
        W +
        width;

      x +=
        width
    ) {
      drawCrop(
        crop,

        x,
        y,

        width + 1,
        height
      );
    }
  }

  // =========================================================
  // BUILD HILL POINTS
  // =========================================================

  function buildTerrainPoints() {
    const points =
      [];

    const step =
      18;

    for (
      let x =
        -40;

      x <=
        W + 40;

      x +=
        step
    ) {
      points.push({
        x,

        y:
          groundYAtScreenX(
            x
          )
      });
    }

    return points;
  }

  // =========================================================
  // DRAW REAL UNEVEN HILL
  // =========================================================

  function drawTerrainSurface() {
    const points =
      buildTerrainPoints();

    if (
      points.length <
      2
    ) {
      return;
    }

    // -------------------------
    // SOIL UNDER HILL
    // -------------------------

    const soil =
      ctx.createLinearGradient(
        0,
        baseGroundY() -
        20,

        0,
        H
      );

    soil.addColorStop(
      0,
      "#71523a"
    );

    soil.addColorStop(
      0.38,
      "#553d2d"
    );

    soil.addColorStop(
      1,
      "#2c2019"
    );

    ctx.fillStyle =
      soil;

    ctx.beginPath();

    ctx.moveTo(
      points[0].x,
      points[0].y +
      22
    );

    for (
      const p
      of points
    ) {
      ctx.lineTo(
        p.x,
        p.y + 22
      );
    }

    ctx.lineTo(
      W + 50,
      H + 50
    );

    ctx.lineTo(
      -50,
      H + 50
    );

    ctx.closePath();

    ctx.fill();

    // -------------------------
    // WALKING PATH
    // -------------------------

    const path =
      ctx.createLinearGradient(
        0,
        baseGroundY() -
        30,

        0,
        baseGroundY() +
        30
      );

    path.addColorStop(
      0,
      "#d2c1a6"
    );

    path.addColorStop(
      0.48,
      "#a98d72"
    );

    path.addColorStop(
      1,
      "#766151"
    );

    ctx.fillStyle =
      path;

    ctx.beginPath();

    ctx.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      const p
      of points
    ) {
      ctx.lineTo(
        p.x,
        p.y
      );
    }

    for (
      let i =
        points.length -
        1;

      i >=
        0;

      i--
    ) {
      ctx.lineTo(
        points[i].x,
        points[i].y +
        25
      );
    }

    ctx.closePath();

    ctx.fill();

    // -------------------------
    // GRASS EDGE
    // -------------------------

    const grass =
      ctx.createLinearGradient(
        0,
        baseGroundY() -
        25,

        0,
        baseGroundY() +
        10
      );

    grass.addColorStop(
      0,
      "#71b658"
    );

    grass.addColorStop(
      1,
      "#35633d"
    );

    ctx.strokeStyle =
      grass;

    ctx.lineWidth =
      15;

    ctx.lineJoin =
      "round";

    ctx.lineCap =
      "round";

    ctx.beginPath();

    ctx.moveTo(
      points[0].x,
      points[0].y +
      2
    );

    for (
      const p
      of points
    ) {
      ctx.lineTo(
        p.x,
        p.y + 2
      );
    }

    ctx.stroke();

    // -------------------------
    // BRIGHT GRASS TOP
    // -------------------------

    ctx.strokeStyle =
      "rgba(225,255,195,.82)";

    ctx.lineWidth =
      2;

    ctx.beginPath();

    ctx.moveTo(
      points[0].x,
      points[0].y -
      3
    );

    for (
      const p
      of points
    ) {
      ctx.lineTo(
        p.x,
        p.y - 3
      );
    }

    ctx.stroke();

    // -------------------------
    // ROCKS + SMALL FLOWERS
    // -------------------------

    for (
      let x =
        -15;

      x <
        W + 40;

      x +=
        72
    ) {
      const gy =
        groundYAtScreenX(
          x
        );

      // stone
      ctx.fillStyle =
        "rgba(118,100,87,.70)";

      ctx.beginPath();

      ctx.ellipse(
        x + 30,
        gy + 18,

        7,
        3.4,

        0.2,

        0,
        Math.PI * 2
      );

      ctx.fill();

      // pink flower
      ctx.fillStyle =
        "rgba(255,211,226,.95)";

      ctx.beginPath();

      ctx.arc(
        x + 10,
        gy + 1,

        2.3,

        0,
        Math.PI * 2
      );

      ctx.fill();

      // yellow flower
      ctx.fillStyle =
        "rgba(255,245,161,.95)";

      ctx.beginPath();

      ctx.arc(
        x + 15,
        gy - 1,

        1.7,

        0,
        Math.PI * 2
      );

      ctx.fill();
    }
  }

  // =========================================================
  // ENVIRONMENT
  // =========================================================

  function drawEnvironment() {
    // -------------------------
    // SKY
    // -------------------------

    const skyGradient =
      ctx.createLinearGradient(
        0,
        0,

        0,
        H
      );

    skyGradient.addColorStop(
      0,
      "#24114b"
    );

    skyGradient.addColorStop(
      0.42,
      "#6a4e88"
    );

    skyGradient.addColorStop(
      0.72,
      "#d78ca2"
    );

    skyGradient.addColorStop(
      1,
      "#f0c29f"
    );

    ctx.fillStyle =
      skyGradient;

    ctx.fillRect(
      0,
      0,
      W,
      H
    );

    /*
    Background only repeats
    HORIZONTALLY.
    */

    drawHorizontalScene(
      ENV.sky,

      0,

      H * 0.63,

      0.055
    );

    // -------------------------
    // HAZE
    // -------------------------

    const haze =
      ctx.createLinearGradient(
        0,
        H * 0.42,

        0,
        H * 0.74
      );

    haze.addColorStop(
      0,
      "rgba(116,94,142,0)"
    );

    haze.addColorStop(
      1,
      "rgba(93,79,88,.38)"
    );

    ctx.fillStyle =
      haze;

    ctx.fillRect(
      0,
      H * 0.42,

      W,
      H * 0.32
    );

    // -------------------------
    // FOREST MIDGROUND
    // -------------------------

    drawHorizontalScene(
      ENV.forest,

      H * 0.50,

      H * 0.24,

      0.20
    );

    // -------------------------
    // WORLD OBJECTS
    // -------------------------

    drawWorldDecorations();

    // -------------------------
    // HILL / PATH
    // -------------------------

    drawTerrainSurface();

    // -------------------------
    // LOWER SHADE
    // -------------------------

    const shade =
      ctx.createLinearGradient(
        0,
        baseGroundY(),

        0,
        H
      );

    shade.addColorStop(
      0,
      "rgba(15,33,23,0)"
    );

    shade.addColorStop(
      1,
      "rgba(9,20,14,.45)"
    );

    ctx.fillStyle =
      shade;

    ctx.fillRect(
      0,
      baseGroundY() -
      20,

      W,

      H -
      baseGroundY() +
      20
    );
  }

  // =========================================================
  // WORLD DECORATIONS
  // =========================================================

  function drawWorldDecorations() {
    if (
      !environmentAtlas.complete ||
      !environmentAtlas.naturalWidth
    ) {
      return;
    }

    for (
      const chunk
      of chunks.values()
    ) {
      for (
        const object
        of chunk.objects
      ) {
        const sx =
          object.x -
          worldScroll;

        if (
          sx <
          -240 ||
          sx >
          W + 240
        ) {
          continue;
        }

        const crop =
          ENV[
            object.type
          ];

        if (
          !crop
        ) {
          continue;
        }

        let baseW =
          108;

        let baseH =
          100;

        if (
          object.type ===
          "pinkTree"
        ) {
          baseW =
            150;

          baseH =
            132;
        }

        if (
          object.type ===
          "fountain" ||
          object.type ===
          "bridge"
        ) {
          baseW =
            142;

          baseH =
            102;
        }

        const w =
          baseW *
          object.scale *
          cameraZoom;

        const h =
          baseH *
          object.scale *
          cameraZoom;

        /*
        Decoration is positioned
        according to actual hill height.
        */

        const gy =
          groundYAtWorld(
            object.x
          );

        drawCrop(
          crop,

          sx -
          w / 2,

          gy -
          h -
          3,

          w,
          h
        );
      }
    }
  }

  // =========================================================
  // CHARACTER SPRITE DRAWING
  // =========================================================

  function drawCharacter(
    image,
    animations,
    cell,
    state,
    animTime,
    x,
    y,
    facing,
    scale = 1,
    options = {}
  ) {
    if (
      !image.complete ||
      !image.naturalWidth
    ) {
      return;
    }

    const anim =
      animations[
        state
      ] ||
      animations.idle;

    let frame =
      Math.floor(
        animTime *
        anim.fps
      ) %
      anim.frames;

    if (
      Number.isInteger(
        options.fixedFrame
      )
    ) {
      frame =
        options.fixedFrame;
    }

    const sx =
      frame *
      cell.width;

    const sy =
      anim.row *
      cell.height;

    const h =
      166 *
      scale;

    const w =
      148 *
      scale;

    ctx.save();

    ctx.translate(
      x,
      y
    );

    let flip =
      false;

    /*
    Walk/run have dedicated
    left/right atlas rows.

    Jump/attack/emote only have one
    orientation, so they are mirrored
    when facing left.
    */

    if (
      options.forceFacing ===
      "left"
    ) {
      flip =
        true;
    }
    else if (
      options.forceFacing ===
      "right"
    ) {
      flip =
        false;
    }
    else if (
      (
        state === "jump" ||
        state === "attack" ||
        state === "emote"
      ) &&
      facing <
      0
    ) {
      flip =
        true;
    }

    if (
      flip
    ) {
      ctx.scale(
        -1,
        1
      );
    }

    ctx.drawImage(
      image,

      sx,
      sy,

      cell.width,
      cell.height,

      -w / 2,

      -h + 9,

      w,
      h
    );

    ctx.restore();
  }

  // =========================================================
  // OPENING CHARACTERS
  // =========================================================

  function drawOpeningCharacters() {
    const px =
      meeting.priyankaX ||
      W * 0.30;

    const dx =
      meeting.debashisX ||
      W * 0.79;

    const ground =
      baseGroundY();

    // -------------------------
    // DIALOGUE
    // -------------------------

    if (
      mode ===
      MODE.DIALOGUE
    ) {
      /*
      Fixed facing.

      PRIYANKA →
      ← DEBASHIS
      */

      drawCharacter(
        priyankaAtlas,

        PRIYANKA_ANIMS,

        PRIYANKA_CELL,

        "idle",

        0,

        px,

        ground,

        1,

        0.95 *
        cameraZoom,

        {
          fixedFrame:
            0,

          forceFacing:
            "right"
        }
      );

      drawCharacter(
        debashisAtlas,

        DEBASHIS_ANIMS,

        DEBASHIS_CELL,

        "idle",

        0,

        dx,

        ground,

        -1,

        0.95 *
        cameraZoom,

        {
          fixedFrame:
            0,

          forceFacing:
            "left"
        }
      );

      return;
    }

    // -------------------------
    // RUNAWAY
    // -------------------------

    if (
      mode ===
      MODE.RUNAWAY
    ) {
      /*
      TRUE LEFT-FACING RUN.

      No mirror.
      Uses row 3 directly.
      */

      drawCharacter(
        priyankaAtlas,

        PRIYANKA_ANIMS,

        PRIYANKA_CELL,

        "runL",

        player.animTime,

        px,

        ground,

        -1,

        0.95 *
        cameraZoom
      );

      drawCharacter(
        debashisAtlas,

        DEBASHIS_ANIMS,

        DEBASHIS_CELL,

        "idle",

        0,

        dx,

        ground,

        -1,

        0.95 *
        cameraZoom,

        {
          fixedFrame:
            0,

          forceFacing:
            "left"
        }
      );

      /*
      Small anger symbol.
      */

      if (
        meeting.phaseTime <
        1.25
      ) {
        ctx.save();

        ctx.font =
          `bold ${
            Math.round(
              25 *
              cameraZoom
            )
          }px sans-serif`;

        ctx.fillStyle =
          "#ff4267";

        ctx.textAlign =
          "center";

        ctx.fillText(
          "!",

          px,

          ground -
          150 *
          cameraZoom
        );

        ctx.restore();
      }

      return;
    }

    // -------------------------
    // FIRST MEETING
    // -------------------------

    drawCharacter(
      priyankaAtlas,

      PRIYANKA_ANIMS,

      PRIYANKA_CELL,

      "idle",

      0,

      px,

      ground,

      1,

      0.95 *
      cameraZoom,

      {
        fixedFrame:
          0,

        forceFacing:
          "right"
      }
    );

    drawCharacter(
      debashisAtlas,

      DEBASHIS_ANIMS,

      DEBASHIS_CELL,

      debashis.state,

      debashis.animTime,

      dx,

      ground,

      -1,

      0.95 *
      cameraZoom,

      debashis.state ===
      "idle"
        ?
        {
          fixedFrame:
            0,

          forceFacing:
            "left"
        }
        :
        {}
    );
  }

  // =========================================================
  // GAMEPLAY CHARACTERS ON HILL
  // =========================================================

  function drawGameplayCharacters() {
    const positions =
      getCharacterScreenPositions();

    const scale =
      CONFIG.characterScale *
      cameraZoom;

    /*
    IMPORTANT

    Each character gets a DIFFERENT
    ground height based on where they
    are positioned on the hill.
    */

    const pg =
      groundYAtScreenX(
        positions.priyanka
      );

    const dg =
      groundYAtScreenX(
        positions.debashis
      );

    drawCharacter(
      priyankaAtlas,

      PRIYANKA_ANIMS,

      PRIYANKA_CELL,

      player.state,

      player.animTime,

      positions.priyanka,

      pg -
      player.y,

      player.facing,

      scale
    );

    drawCharacter(
      debashisAtlas,

      DEBASHIS_ANIMS,

      DEBASHIS_CELL,

      debashis.state,

      debashis.animTime,

      positions.debashis,

      dg -
      debashis.y,

      debashis.facing,

      scale *
      0.98
    );
  }

  // =========================================================
  // ENEMIES ON HILL
  // =========================================================

  function getEnemyY(
    enemy,
    def,
    screenX
  ) {
    const ground =
      groundYAtScreenX(
        screenX
      );

    if (
      def.flying
    ) {
      return (
        ground -

        108 *
        cameraZoom +

        Math.sin(
          time * 4.2 +
          enemy.bob
        ) *
        13 *
        cameraZoom
      );
    }

    return (
      ground -

      47 *
      cameraZoom +

      Math.sin(
        time * 3.4 +
        enemy.bob
      ) *
      2 *
      cameraZoom
    );
  }

  function drawEnemySprite(
    enemy,
    x,
    y
  ) {
    const def =
      ENEMY_TYPES[
        enemy.type
      ];

    const crop =
      def.crop;

    if (
      !environmentAtlas.complete ||
      !environmentAtlas.naturalWidth
    ) {
      return;
    }

    const naturalRatio =
      crop.w /
      crop.h;

    const baseH =
      def.flying
        ?
        72
        :
        83;

    const h =
      baseH *
      def.scale *
      cameraZoom;

    const w =
      h *
      naturalRatio;

    ctx.save();

    if (
      enemy.flash >
      0
    ) {
      ctx.globalAlpha =
        0.58 +
        Math.sin(
          enemy.flash *
          90
        ) *
        0.30;
    }

    /*
    Enemy artwork faces toward
    Debashis.
    */

    ctx.translate(
      x,
      y
    );

    ctx.scale(
      -1,
      1
    );

    ctx.drawImage(
      environmentAtlas,

      crop.x,
      crop.y,
      crop.w,
      crop.h,

      -w / 2,
      -h / 2,

      w,
      h
    );

    ctx.restore();

    // -------------------------
    // HP BAR
    // -------------------------

    if (
      enemy.maxHp >
      1
    ) {
      const barW =
        42 *
        cameraZoom;

      ctx.fillStyle =
        "rgba(25,8,22,.62)";

      ctx.fillRect(
        x -
        barW / 2,

        y -
        h / 2 -
        11,

        barW,
        5
      );

      ctx.fillStyle =
        "#ff7ca8";

      ctx.fillRect(
        x -
        barW / 2,

        y -
        h / 2 -
        11,

        barW *
        clamp(
          enemy.hp /
          enemy.maxHp,
          0,
          1
        ),

        5
      );
    }
  }

  function drawEnemies() {
    const positions =
      getCharacterScreenPositions();

    for (
      const enemy
      of enemies
    ) {
      const def =
        ENEMY_TYPES[
          enemy.type
        ];

      const x =
        positions.debashis +
        enemy.relX;

      const y =
        getEnemyY(
          enemy,
          def,
          x
        );

      drawEnemySprite(
        enemy,
        x,
        y
      );
    }
  }

  // =========================================================
  // HEART PROJECTILES
  // =========================================================

  function drawHeartShape(
    x,
    y,
    size,
    color
  ) {
    ctx.save();

    ctx.translate(
      x,
      y
    );

    ctx.scale(
      size / 32,
      size / 32
    );

    ctx.beginPath();

    ctx.moveTo(
      0,
      8
    );

    ctx.bezierCurveTo(
      -20,
      -10,

      -38,
      8,

      -27,
      27
    );

    ctx.bezierCurveTo(
      -19,
      41,

      -7,
      49,

      0,
      56
    );

    ctx.bezierCurveTo(
      7,
      49,

      19,
      41,

      27,
      27
    );

    ctx.bezierCurveTo(
      38,
      8,

      20,
      -10,

      0,
      8
    );

    ctx.closePath();

    ctx.fillStyle =
      color;

    ctx.fill();

    ctx.restore();
  }

  function drawHeartShots() {
    for (
      const shot
      of heartShots
    ) {
      ctx.save();

      ctx.shadowColor =
        "#ff5fa9";

      ctx.shadowBlur =
        17;

      drawHeartShape(
        shot.x,

        shot.y,

        16 *
        cameraZoom,

        "#ff5fa9"
      );

      ctx.shadowBlur =
        0;

      drawHeartShape(
        shot.x,

        shot.y,

        8 *
        cameraZoom,

        "#fff2f8"
      );

      ctx.restore();
    }
  }

  // =========================================================
  // INCOMING MAGIC ATTACK
  // =========================================================

  function drawIncomingAttacks() {
    const positions =
      getCharacterScreenPositions();

    for (
      const attack
      of incomingAttacks
    ) {
      const t =
        1 -
        attack.life /
        attack.duration;

      const startX =
        positions.debashis +
        attack.sourceOffset;

      const endX =
        positions.priyanka;

      const x =
        lerp(
          startX,
          endX,
          t
        );

      /*
      Attack trajectory also follows
      different hill heights.
      */

      const startGround =
        groundYAtScreenX(
          startX
        );

      const endGround =
        groundYAtScreenX(
          endX
        );

      const y =
        lerp(
          startGround,
          endGround,
          t
        ) -

        72 *
        cameraZoom -

        Math.sin(
          t *
          Math.PI
        ) *
        44 *
        cameraZoom;

      ctx.save();

      ctx.shadowColor =
        "#7338cf";

      ctx.shadowBlur =
        18;

      ctx.fillStyle =
        "#7d45d8";

      ctx.beginPath();

      ctx.arc(
        x,
        y,

        9 *
        cameraZoom,

        0,
        Math.PI *
        2
      );

      ctx.fill();

      ctx.fillStyle =
        "#e5d7ff";

      ctx.beginPath();

      ctx.arc(
        x,
        y,

        3 *
        cameraZoom,

        0,
        Math.PI *
        2
      );

      ctx.fill();

      ctx.restore();
    }
  }

  // =========================================================
  // GROUND HAZARD ON HILL
  // =========================================================

  function drawGroundHazards() {
    const positions =
      getCharacterScreenPositions();

    for (
      const hazard
      of groundHazards
    ) {
      const x =
        positions.debashis +
        hazard.relX;

      const gy =
        groundYAtScreenX(
          x
        );

      const s =
        cameraZoom;

      ctx.save();

      ctx.fillStyle =
        "#315830";

      ctx.strokeStyle =
        "#203c26";

      ctx.lineWidth =
        2;

      ctx.beginPath();

      ctx.moveTo(
        x -
        27 *
        s,

        gy
      );

      ctx.lineTo(
        x -
        15 *
        s,

        gy -
        37 *
        s
      );

      ctx.lineTo(
        x -
        5 *
        s,

        gy
      );

      ctx.lineTo(
        x +
        7 *
        s,

        gy -
        46 *
        s
      );

      ctx.lineTo(
        x +
        18 *
        s,

        gy
      );

      ctx.lineTo(
        x +
        28 *
        s,

        gy -
        31 *
        s
      );

      ctx.lineTo(
        x +
        37 *
        s,

        gy
      );

      ctx.closePath();

      ctx.fill();

      ctx.stroke();

      ctx.restore();
    }
  }

  // =========================================================
  // PARTICLES
  // =========================================================

  function drawParticles() {
    for (
      const p
      of particles
    ) {
      ctx.globalAlpha =
        clamp(
          p.life /
          p.maxLife,
          0,
          1
        );

      ctx.fillStyle =
        p.color;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,

        p.size,

        0,
        Math.PI *
        2
      );

      ctx.fill();
    }

    ctx.globalAlpha =
      1;
  }

  // =========================================================
  // CELEBRATION SKY
  // =========================================================

  function drawCelebrationSky() {
    const gradient =
      ctx.createLinearGradient(
        0,
        0,

        0,
        H * 0.7
      );

    gradient.addColorStop(
      0,
      "rgba(76,25,104,.22)"
    );

    gradient.addColorStop(
      1,
      "rgba(255,145,181,.08)"
    );

    ctx.fillStyle =
      gradient;

    ctx.fillRect(
      0,
      0,
      W,
      H * 0.72
    );

    ctx.textAlign =
      "center";

    ctx.shadowColor =
      "#ffd391";

    ctx.shadowBlur =
      24;

    ctx.fillStyle =
      "#fff1c2";

    ctx.font =
      `italic ${
        Math.max(
          30,

          Math.min(
            58,

            W * 0.06
          )
        )
      }px Georgia`;

    ctx.fillText(
      "Happy Halfway Anniversary",

      W / 2,

      H * 0.20
    );

    ctx.shadowBlur =
      12;

    ctx.fillStyle =
      "#ffd8e3";

    ctx.font =
      `italic ${
        Math.max(
          22,

          Math.min(
            38,

            W * 0.04
          )
        )
      }px Georgia`;

    ctx.fillText(
      "Priyanka ♥ Debashis",

      W / 2,

      H * 0.27
    );

    ctx.shadowBlur =
      0;
  }

  // =========================================================
  // RENDER
  // =========================================================

  function render() {
    ctx.clearRect(
      0,
      0,
      W,
      H
    );

    drawEnvironment();

    // -------------------------
    // WAIT SCREEN
    // -------------------------

    if (
      mode ===
      MODE.WAIT
    ) {
      meeting.priyankaX =
        W * 0.30;

      meeting.debashisX =
        W * 0.79;

      drawCharacter(
        priyankaAtlas,

        PRIYANKA_ANIMS,

        PRIYANKA_CELL,

        "idle",

        0,

        meeting.priyankaX,

        baseGroundY(),

        1,

        0.95,

        {
          fixedFrame:
            0,

          forceFacing:
            "right"
        }
      );

      drawCharacter(
        debashisAtlas,

        DEBASHIS_ANIMS,

        DEBASHIS_CELL,

        "idle",

        0,

        meeting.debashisX,

        baseGroundY(),

        -1,

        0.95,

        {
          fixedFrame:
            0,

          forceFacing:
            "left"
        }
      );

      return;
    }

    // -------------------------
    // STORY
    // -------------------------

    if (
      mode === MODE.MEETING ||
      mode === MODE.DIALOGUE ||
      mode === MODE.RUNAWAY
    ) {
      drawOpeningCharacters();

      return;
    }

    // -------------------------
    // GAMEPLAY
    // -------------------------

    if (
      mode === MODE.CHASE ||
      mode === MODE.TOGETHER ||
      mode === MODE.GAME_OVER
    ) {
      drawGroundHazards();

      drawEnemies();

      drawIncomingAttacks();

      drawGameplayCharacters();

      drawHeartShots();

      drawParticles();

      return;
    }

    // -------------------------
    // CELEBRATION
    // -------------------------

    if (
      mode ===
      MODE.CELEBRATION
    ) {
      drawGameplayCharacters();

      drawParticles();

      drawCelebrationSky();
    }
  }

  // =========================================================
  // MOBILE HOLD BUTTONS
  // =========================================================

  function bindHold(
    id,
    property
  ) {
    const button =
      document.getElementById(
        id
      );

    if (
      !button
    ) {
      return;
    }

    const press =
      event => {
        event.preventDefault();

        keys[property] =
          true;

        button
          .classList
          .add(
            "active"
          );
      };

    const release =
      event => {
        event.preventDefault();

        keys[property] =
          false;

        button
          .classList
          .remove(
            "active"
          );
      };

    button.addEventListener(
      "pointerdown",
      press
    );

    button.addEventListener(
      "pointerup",
      release
    );

    button.addEventListener(
      "pointercancel",
      release
    );

    button.addEventListener(
      "pointerleave",
      release
    );
  }

  bindHold(
    "leftButton",
    "left"
  );

  bindHold(
    "rightButton",
    "right"
  );

  bindHold(
    "runButton",
    "run"
  );

  const jumpButton =
    document.getElementById(
      "jumpButton"
    );

  const attackButton =
    document.getElementById(
      "attackButton"
    );

  jumpButton.addEventListener(
    "pointerdown",
    event => {
      event.preventDefault();

      jump();
    }
  );

  attackButton.addEventListener(
    "pointerdown",
    event => {
      event.preventDefault();

      fireHeart();
    }
  );

  // =========================================================
  // KEYBOARD
  // =========================================================

  window.addEventListener(
    "keydown",
    event => {
      if (
        event.key ===
        "ArrowLeft" ||

        event.key ===
        "a" ||

        event.key ===
        "A"
      ) {
        keys.left =
          true;
      }

      if (
        event.key ===
        "ArrowRight" ||

        event.key ===
        "d" ||

        event.key ===
        "D"
      ) {
        keys.right =
          true;
      }

      if (
        event.key ===
        "Shift"
      ) {
        keys.run =
          true;
      }

      if (
        !event.repeat &&
        (
          event.key ===
          "ArrowUp" ||

          event.key ===
          " " ||

          event.key ===
          "w" ||

          event.key ===
          "W"
        )
      ) {
        event.preventDefault();

        jump();
      }

      if (
        !event.repeat &&
        (
          event.key ===
          "j" ||

          event.key ===
          "J" ||

          event.key ===
          "f" ||

          event.key ===
          "F"
        )
      ) {
        fireHeart();
      }
    }
  );

  window.addEventListener(
    "keyup",
    event => {
      if (
        event.key ===
        "ArrowLeft" ||

        event.key ===
        "a" ||

        event.key ===
        "A"
      ) {
        keys.left =
          false;
      }

      if (
        event.key ===
        "ArrowRight" ||

        event.key ===
        "d" ||

        event.key ===
        "D"
      ) {
        keys.right =
          false;
      }

      if (
        event.key ===
        "Shift"
      ) {
        keys.run =
          false;
      }
    }
  );

  // =========================================================
  // UI BUTTONS
  // =========================================================

  startButton.addEventListener(
    "click",
    () => {
      startStory();
    }
  );

  restartButton.addEventListener(
    "click",
    () => {
      if (
        window.gameAudio
      ) {
        gameAudio.play(
          "ui",
          0.55
        );
      }

      restartGameplay();
    }
  );

  continueButton.addEventListener(
    "click",
    () => {
      if (
        window.gameAudio
      ) {
        gameAudio.play(
          "ui",
          0.55
        );
      }

      continueTogether();
    }
  );

  closeButton.addEventListener(
    "click",
    () => {
      if (
        window.gameAudio
      ) {
        gameAudio.play(
          "ui",
          0.48
        );
      }

      closeStory();
    }
  );

  soundButton.addEventListener(
    "click",
    () => {
      if (
        !window.gameAudio
      ) {
        return;
      }

      const enabled =
        gameAudio.toggle();

      soundButton.textContent =
        enabled
          ?
          "♪"
          :
          "×";
    }
  );

  // =========================================================
  // MAIN LOOP
  // =========================================================

  let previous =
    performance.now();

  function loop(
    now
  ) {
    const dt =
      Math.min(
        0.033,

        (
          now -
          previous
        ) /
        1000
      );

    previous =
      now;

    update(
      dt
    );

    render();

    requestAnimationFrame(
      loop
    );
  }

  maintainChunks();

  requestAnimationFrame(
    loop
  );

})();
