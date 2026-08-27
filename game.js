(() => {
  "use strict";

  // =========================================================
  // PRIYANKA ♥ DEBASHIS — MARIO-STYLE PLATFORM VERSION
  // Replace ONLY game.js. Existing HTML/CSS/audio/assets stay.
  // =========================================================

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

  const CONFIG = {
    startDistance: 1120,
    reunionDistance: 78,
    minDistance: 68,
    maxDistance: 1900,

    priyankaMaxHealth: 100,
    debashisMaxHearts: 3,

    // Slower movement so the feet visually match the ground.
    walkSpeed: 132,
    runSpeed: 238,

    jumpPower: 590,
    gravity: 1550,

    heartSpeed: 600,
    heartCooldown: 0.30,

    priyankaHitPenalty: 68,
    debashisHitPenalty: 42,

    maxEnemies: 4,

    waveMin: 2,
    waveMax: 5,

    waveSpawnMin: 0.65,
    waveSpawnMax: 1.10,

    waveRestMin: 1.5,
    waveRestMax: 2.5,

    enemyAttackChance: 0.40,
    enemyAttackTravelTime: 1.15,

    chunkWidth: 900,

    chunksAhead: 5,
    chunksBehind: 2,

    characterScale: 0.91,

    // Camera dead-zone.
    // Priyanka moves normally inside this area.
    cameraLeftZone: 0.20,
    cameraRightZone: 0.46,

    // Keep some view ahead of Debashis.
    cameraDebashisMax: 0.86
  };

  const PRIYANKA_CELL = {
    width: 200,
    height: 220
  };

  const DEBASHIS_CELL = {
    width: 200,
    height: 220
  };

  // =========================================================
  // CHARACTER ANIMATION
  //
  // IMPORTANT:
  //
  // We now use only ONE trusted source direction.
  //
  // walk row 1 = source facing right
  // run row 4  = source facing right
  //
  // When moving LEFT we mirror the sprite.
  //
  // This prevents wrong-facing / backward animation.
  // =========================================================

  const PRIYANKA_ANIMS = {
    idle: {
      row: 0,
      frames: 1,
      fps: 1
    },

    walk: {
      row: 1,
      frames: 7,
      fps: 8
    },

    run: {
      row: 4,
      frames: 7,
      fps: 11
    },

    jump: {
      row: 5,
      frames: 4,
      fps: 8
    },

    emote: {
      row: 6,
      frames: 8,
      fps: 6
    },

    attack: {
      row: 7,
      frames: 3,
      fps: 11
    }
  };

  const DEBASHIS_ANIMS = {
    idle: {
      row: 0,
      frames: 1,
      fps: 1
    },

    walk: {
      row: 1,
      frames: 7,
      fps: 8
    },

    run: {
      row: 4,
      frames: 7,
      fps: 11
    },

    jump: {
      row: 5,
      frames: 4,
      fps: 8
    },

    emote: {
      row: 6,
      frames: 8,
      fps: 6
    },

    attack: {
      row: 7,
      frames: 4,
      fps: 11
    }
  };

  // =========================================================
  // IMAGES
  // =========================================================

  const priyankaAtlas = new Image();

  priyankaAtlas.src =
    "assets/priyanka_atlas.png";


  const debashisAtlas = new Image();

  debashisAtlas.src =
    "assets/debashis_atlas.png";


  const environmentAtlas = new Image();

  environmentAtlas.src =
    "assets/environment_atlas.png";


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

    DPR =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    W =
      window.innerWidth;


    H =
      window.innerHeight;


    canvas.width =
      Math.round(
        W *
        DPR
      );


    canvas.height =
      Math.round(
        H *
        DPR
      );


    canvas.style.width =
      W +
      "px";


    canvas.style.height =
      H +
      "px";


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

    return (
      a +
      (
        b -
        a
      ) *
      t
    );
  }


  function randomRange(
    min,
    max
  ) {

    return (
      min +
      Math.random() *
      (
        max -
        min
      )
    );
  }


  function baseGroundY() {

    return (
      H *
      0.80
    );
  }


  function playSound(
    name,
    volume = 1
  ) {

    if (
      window.gameAudio
    ) {

      gameAudio.play(
        name,
        volume
      );
    }
  }


  // =========================================================
  // CAMERA
  //
  // CHARACTER IS NOT LOCKED TO CENTER.
  //
  // Priyanka moves naturally across the screen.
  //
  // Camera starts scrolling only when she moves outside
  // a safe horizontal region.
  // =========================================================

  let cameraX =
    0;


  let targetCameraX =
    0;


  function worldToScreenX(
    worldX
  ) {

    return (
      worldX -
      cameraX
    );
  }


  function updateCamera(
    dt
  ) {

    if (
      mode !== MODE.CHASE &&
      mode !== MODE.TOGETHER &&
      mode !== MODE.GAME_OVER &&
      mode !== MODE.CELEBRATION
    ) {

      return;
    }


    const playerScreen =
      player.x -
      targetCameraX;


    const leftLimit =
      W *
      CONFIG.cameraLeftZone;


    const rightLimit =
      W *
      CONFIG.cameraRightZone;


    const debashisMax =
      W *
      CONFIG.cameraDebashisMax;


    // Priyanka can move freely here.
    if (
      playerScreen >
      rightLimit
    ) {

      targetCameraX +=
        playerScreen -
        rightLimit;
    }


    else if (
      playerScreen <
      leftLimit
    ) {

      targetCameraX +=
        playerScreen -
        leftLimit;
    }


    // Make sure Debashis and danger ahead remain visible.
    const debScreen =
      debashis.x -
      targetCameraX;


    if (
      debScreen >
      debashisMax
    ) {

      targetCameraX +=
        debScreen -
        debashisMax;
    }


    targetCameraX =
      Math.max(
        0,
        targetCameraX
      );


    cameraX =
      lerp(
        cameraX,
        targetCameraX,
        clamp(
          dt *
          5,
          0,
          1
        )
      );
  }


  // =========================================================
  // MARIO STYLE PROCEDURAL PLATFORMS
  // =========================================================

  const chunks =
    new Map();


  function platformY(
    offset
  ) {

    return (
      baseGroundY() +
      offset
    );
  }


  function seededRandom(
    seed
  ) {

    const value =
      Math.sin(
        seed *
        982.137
      ) *
      43758.5453;


    return (
      value -
      Math.floor(
        value
      )
    );
  }


  function createChunk(
    index
  ) {

    const x0 =
      index *
      CONFIG.chunkWidth;


    const seed =
      seededRandom(
        index +
        11
      );


    let baseOffset =
      Math.round(
        Math.sin(
          index *
          0.72
        ) *
        55 /
        10
      ) *
      10;


    baseOffset =
      clamp(
        baseOffset,
        -80,
        65
      );


    // ---------------------------------------------------------
    // FIRST AREA IS SAFE
    // ---------------------------------------------------------

    if (
      index ===
      0
    ) {

      return {

        index,

        platforms: [

          {
            x:
              x0,

            w:
              CONFIG.chunkWidth,

            offset:
              0
          }

        ],

        decorations: [

          {
            type:
              "pinkTree",

            x:
              x0 +
              690,

            offset:
              0,

            scale:
              0.72
          }

        ]
      };
    }


    const template =
      Math.floor(
        seed *
        6
      );


    let platforms;


    // ========================================================
    // TEMPLATE 1
    //
    // -----------      -------------------------
    // ========================================================

    if (
      template ===
      0
    ) {

      platforms = [

        {
          x:
            x0,

          w:
            330,

          offset:
            baseOffset
        },


        {
          x:
            x0 +
            410,

          w:
            490,

          offset:
            baseOffset
        }

      ];
    }


    // ========================================================
    // TEMPLATE 2 — GOING UP
    //
    // _____
    //
    //          _____
    //
    //                    _______
    // ========================================================

    else if (
      template ===
      1
    ) {

      platforms = [

        {
          x:
            x0,

          w:
            250,

          offset:
            baseOffset +
            30
        },


        {
          x:
            x0 +
            315,

          w:
            245,

          offset:
            baseOffset -
            15
        },


        {
          x:
            x0 +
            625,

          w:
            275,

          offset:
            baseOffset -
            65
        }

      ];
    }


    // ========================================================
    // TEMPLATE 3 — GOING DOWN
    // ========================================================

    else if (
      template ===
      2
    ) {

      platforms = [

        {
          x:
            x0,

          w:
            260,

          offset:
            baseOffset -
            60
        },


        {
          x:
            x0 +
            330,

          w:
            250,

          offset:
            baseOffset -
            15
        },


        {
          x:
            x0 +
            650,

          w:
            250,

          offset:
            baseOffset +
            35
        }

      ];
    }


    // ========================================================
    // TEMPLATE 4 — SMALL ISLANDS
    // ========================================================

    else if (
      template ===
      3
    ) {

      platforms = [

        {
          x:
            x0,

          w:
            210,

          offset:
            baseOffset +
            10
        },


        {
          x:
            x0 +
            270,

          w:
            170,

          offset:
            baseOffset -
            65
        },


        {
          x:
            x0 +
            510,

          w:
            150,

          offset:
            baseOffset -
            20
        },


        {
          x:
            x0 +
            725,

          w:
            175,

          offset:
            baseOffset -
            75
        }

      ];
    }


    // ========================================================
    // TEMPLATE 5 — RAISED CENTER
    // ========================================================

    else if (
      template ===
      4
    ) {

      platforms = [

        {
          x:
            x0,

          w:
            290,

          offset:
            baseOffset
        },


        {
          x:
            x0 +
            350,

          w:
            210,

          offset:
            baseOffset -
            70
        },


        {
          x:
            x0 +
            625,

          w:
            275,

          offset:
            baseOffset
        }

      ];
    }


    // ========================================================
    // TEMPLATE 6 — STAIRS
    // ========================================================

    else {

      platforms = [

        {
          x:
            x0,

          w:
            190,

          offset:
            baseOffset +
            35
        },


        {
          x:
            x0 +
            230,

          w:
            190,

          offset:
            baseOffset
        },


        {
          x:
            x0 +
            460,

          w:
            190,

          offset:
            baseOffset -
            40
        },


        {
          x:
            x0 +
            690,

          w:
            210,

          offset:
            baseOffset -
            5
        }

      ];
    }


    const decorationTypes = [

      "pinkTree",

      "purpleTree",

      "goldTree",

      "flowerPatch",

      "fountain",

      "gazebo"

    ];


    const decorations =
      [];


    for (
      let i =
        0;

      i <
        platforms.length;

      i++
    ) {

      const p =
        platforms[
          i
        ];


      if (
        p.w <
        180
      ) {

        continue;
      }


      if (
        seededRandom(
          index *
          17 +
          i *
          9
        ) <
        0.56
      ) {

        decorations.push({

          type:
            decorationTypes[
              Math.floor(
                seededRandom(
                  index *
                  31 +
                  i *
                  7
                ) *
                decorationTypes.length
              )
            ],

          x:
            p.x +
            p.w *
            randomRange(
              0.28,
              0.72
            ),

          offset:
            p.offset,

          scale:
            randomRange(
              0.55,
              0.78
            )
        });
      }
    }


    return {

      index,

      platforms,

      decorations
    };
  }


  function maintainChunks() {

    const focusX =
      Math.max(
        player.x,
        debashis.x,
        cameraX +
        W
      );


    const center =
      Math.floor(
        focusX /
        CONFIG.chunkWidth
      );


    for (
      let i =
        Math.max(
          0,
          center -
          CONFIG.chunksBehind
        );

      i <=
        center +
        CONFIG.chunksAhead;

      i++
    ) {

      if (
        !chunks.has(
          i
        )
      ) {

        chunks.set(
          i,
          createChunk(
            i
          )
        );
      }
    }


    for (
      const index
      of [
        ...chunks.keys()
      ]
    ) {

      if (
        index <
        center -
        CONFIG.chunksBehind -
        3
      ) {

        chunks.delete(
          index
        );
      }
    }
  }


  function allActivePlatforms() {

    const result =
      [];


    for (
      const chunk
      of chunks.values()
    ) {

      result.push(
        ...chunk.platforms
      );
    }


    return result;
  }


  function findPlatformAtX(
    x
  ) {

    let best =
      null;


    for (
      const p
      of allActivePlatforms()
    ) {

      if (
        x >=
        p.x &&

        x <=
        p.x +
        p.w
      ) {

        if (
          !best ||

          platformY(
            p.offset
          ) <
          platformY(
            best.offset
          )
        ) {

          best =
            p;
        }
      }
    }


    return best;
  }


  function findLandingPlatform(
    x,
    previousY,
    newY
  ) {

    let best =
      null;


    let bestY =
      Infinity;


    for (
      const p
      of allActivePlatforms()
    ) {

      if (
        x <
        p.x ||

        x >
        p.x +
        p.w
      ) {

        continue;
      }


      const y =
        platformY(
          p.offset
        );


      if (
        previousY <=
        y +
        2 &&

        newY >=
        y
      ) {

        if (
          y <
          bestY
        ) {

          bestY =
            y;


          best =
            p;
        }
      }
    }


    return best;
  }


  function nearestPlatform(
    x,
    maximumDistance = 220
  ) {

    let best =
      null;


    let bestDistance =
      Infinity;


    for (
      const p
      of allActivePlatforms()
    ) {

      const candidateX =
        clamp(
          x,
          p.x +
          28,
          p.x +
          p.w -
          28
        );


      const distance =
        Math.abs(
          candidateX -
          x
        );


      if (
        distance <
        bestDistance &&

        distance <=
        maximumDistance
      ) {

        bestDistance =
          distance;


        best = {

          platform:
            p,

          x:
            candidateX
        };
      }
    }


    return best;
  }


  // =========================================================
  // CHARACTER DATA
  // =========================================================

  function createCharacter() {

    return {

      x:
        0,

      y:
        baseGroundY(),

      previousY:
        baseGroundY(),

      vy:
        0,

      grounded:
        true,

      facing:
        1,

      state:
        "idle",

      animTime:
        0,

      // IMPORTANT:
      // animation is linked to distance moved.
      animDistance:
        0,

      attacking:
        0,

      attackCooldown:
        0,

      invulnerable:
        0
    };
  }


  const player =
    createCharacter();


  player.health =
    CONFIG.priyankaMaxHealth;


  const debashis =
    createCharacter();


  debashis.hearts =
    CONFIG.debashisMaxHearts;


  let relationshipDistance =
    CONFIG.startDistance;


  function desiredPhysicalGap() {

    const far =
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

      Math.max(
        150,
        W *
        0.20
      ),

      Math.max(
        360,
        W *
        0.48
      ),

      far
    );
  }


  // =========================================================
  // STORY
  // =========================================================

  const meeting = {

    priyankaX:
      0,

    debashisX:
      0,

    targetDebashisX:
      0,

    phaseTime:
      0
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


  let dialogueIndex =
    -1;


  let dialogueTimer =
    0;


  // =========================================================
  // WORLD OBJECTS
  // =========================================================

  const enemies =
    [];


  const heartShots =
    [];


  const incomingAttacks =
    [];


  const hazards =
    [];


  const particles =
    [];


  let waveRemaining =
    0;


  let waveSpawnTimer =
    0;


  let waveRestTimer =
    0.8;


  let hazardTimer =
    4.0;


  let messageTimer =
    0;


  let gameTime =
    0;


  const keys = {

    left:
      false,

    right:
      false,

    run:
      false
  };


  // =========================================================
  // ENEMIES
  // =========================================================

  const ENEMY_TYPES = {

    shadow: {

      crop:
        ENV.enemyShadow,

      hp:
        1,

      speed:
        85,

      reward:
        27,

      scale:
        0.82,

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
        112,

      reward:
        31,

      scale:
        0.84,

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
        72,

      reward:
        42,

      scale:
        0.85,

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
        62,

      reward:
        55,

      scale:
        0.88,

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
        78,

      reward:
        72,

      scale:
        0.90,

      flying:
        true,

      ranged:
        true
    }
  };


  // =========================================================
  // UI
  // =========================================================

  function showMessage(
    text,
    duration = 1.4
  ) {

    gameMessage.textContent =
      text;


    gameMessage.classList.add(
      "show"
    );


    messageTimer =
      duration;
  }


  function hideMessage() {

    gameMessage.classList.remove(
      "show"
    );
  }


  function updateHud() {

    healthElement.style.width =
      clamp(
        player.health /
        CONFIG.priyankaMaxHealth,
        0,
        1
      ) *
      100 +
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
      progress *
      100 +
      "%";
  }


  function updateSpeechBubblePosition() {

    if (
      !speechBubble ||

      speechBubble.classList.contains(
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
      x +
      "px";


    speechBubble.style.top =
      (
        baseGroundY() -
        158
      ) +
      "px";
  }


  function setSpeechOpacity(
    value,
    seconds = 0
  ) {

    speechBubble.style.transition =
      seconds >
      0
        ?
        `opacity ${seconds}s ease`
        :
        "none";


    speechBubble.style.opacity =
      String(
        value
      );
  }


  // =========================================================
  // STORY CONTROL
  // =========================================================

  function startStory() {

    startOverlay.classList.add(
      "hidden"
    );


    mode =
      MODE.MEETING;


    meeting.priyankaX =
      W *
      0.30;


    meeting.debashisX =
      W *
      0.79;


    meeting.targetDebashisX =
      W *
      0.60;


    meeting.phaseTime =
      0;


    player.state =
      "idle";


    player.facing =
      1;


    debashis.state =
      "walk";


    debashis.facing =
      -1;


    if (
      window.gameAudio
    ) {

      gameAudio.start();


      playSound(
        "ui",
        0.5
      );
    }
  }


  function startDialogue() {

    mode =
      MODE.DIALOGUE;


    player.state =
      "idle";


    player.facing =
      1;


    debashis.state =
      "idle";


    debashis.facing =
      -1;


    speechBubble.classList.remove(
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

      speechBubble.classList.add(
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


      player.state =
        "run";


      // PRIYANKA FACES LEFT.
      player.facing =
        -1;


      debashis.state =
        "idle";


      debashis.facing =
        -1;


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


    playSound(
      item.sound,
      0.62
    );
  }


  function beginChase() {

    mode =
      MODE.CHASE;


    relationshipDistance =
      CONFIG.startDistance;


    maintainChunks();


    const startPlatform =
      findPlatformAtX(
        170
      ) ||
      createChunk(
        0
      ).platforms[
        0
      ];


    player.x =
      170;


    player.y =
      platformY(
        startPlatform.offset
      );


    player.previousY =
      player.y;


    player.vy =
      0;


    player.grounded =
      true;


    player.state =
      "idle";


    player.facing =
      1;


    player.health =
      CONFIG.priyankaMaxHealth;


    player.animDistance =
      0;


    debashis.x =
      player.x +
      desiredPhysicalGap();


    const safeDebashis =
      nearestPlatform(
        debashis.x,
        250
      );


    if (
      safeDebashis
    ) {

      debashis.x =
        safeDebashis.x;


      debashis.y =
        platformY(
          safeDebashis
            .platform
            .offset
        );
    }

    else {

      debashis.y =
        player.y;
    }


    debashis.previousY =
      debashis.y;


    debashis.vy =
      0;


    debashis.grounded =
      true;


    debashis.state =
      "idle";


    debashis.facing =
      1;


    debashis.hearts =
      CONFIG.debashisMaxHearts;


    debashis.animDistance =
      0;


    cameraX =
      0;


    targetCameraX =
      0;


    hud.classList.remove(
      "hidden"
    );


    mobileControls.classList.remove(
      "hidden"
    );


    waveRemaining =
      0;


    waveRestTimer =
      0.35;


    hazardTimer =
      3.2;


    updateHud();


    showMessage(
      "Enemies are coming — protect Debashis ♥",
      2.0
    );
  }


  function updateStory(
    dt
  ) {

    player.animTime +=
      dt;


    debashis.animTime +=
      dt;


    // ========================================================
    // DEBASHIS APPROACHES PRIYANKA
    // ========================================================

    if (
      mode ===
      MODE.MEETING
    ) {

      meeting.phaseTime +=
        dt;


      meeting.debashisX -=
        84 *
        dt;


      debashis.animDistance +=
        84 *
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


    // ========================================================
    // DIALOGUE
    // ========================================================

    if (
      mode ===
      MODE.DIALOGUE
    ) {

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


      const item =
        dialogueSequence[
          dialogueIndex
        ];


      // Final two dialogue lines fade slowly.
      if (
        item &&
        item.fade &&
        dialogueTimer <=
        1.0
      ) {

        setSpeechOpacity(
          0,
          0.95
        );
      }


      updateSpeechBubblePosition();


      if (
        dialogueTimer <=
        0
      ) {

        nextDialogue();
      }


      return;
    }


    // ========================================================
    // PRIYANKA RUNS LEFT
    // ========================================================

    if (
      mode ===
      MODE.RUNAWAY
    ) {

      meeting.phaseTime +=
        dt;


      const dx =
        -195 *
        dt;


      meeting.priyankaX =
        Math.max(
          W *
          0.09,

          meeting.priyankaX +
          dx
        );


      player.animDistance +=
        Math.abs(
          dx
        );


      player.state =
        "run";


      player.facing =
        -1;


      debashis.state =
        "idle";


      debashis.facing =
        -1;


      if (
        meeting.phaseTime >
        3.7
      ) {

        beginChase();
      }
    }
  }


  // =========================================================
  // PLATFORM PHYSICS
  // =========================================================

  function updateCharacterVertical(
    character,
    dt,
    isPriyanka
  ) {

    character.previousY =
      character.y;


    // ========================================================
    // CHECK IF STILL STANDING ON PLATFORM
    // ========================================================

    if (
      character.grounded
    ) {

      const p =
        findPlatformAtX(
          character.x
        );


      if (
        !p ||

        Math.abs(
          character.y -
          platformY(
            p.offset
          )
        ) >
        5
      ) {

        character.grounded =
          false;
      }

      else {

        character.y =
          platformY(
            p.offset
          );


        character.vy =
          0;
      }
    }


    // ========================================================
    // FALL / JUMP
    // ========================================================

    if (
      !character.grounded
    ) {

      const oldY =
        character.y;


      character.vy +=
        CONFIG.gravity *
        dt;


      character.y +=
        character.vy *
        dt;


      // Landing only while moving downward.
      if (
        character.vy >=
        0
      ) {

        const landed =
          findLandingPlatform(
            character.x,
            oldY,
            character.y
          );


        if (
          landed
        ) {

          character.y =
            platformY(
              landed.offset
            );


          character.vy =
            0;


          character.grounded =
            true;
        }
      }
    }


    // ========================================================
    // FALLEN INTO A GAP
    // ========================================================

    if (
      character.y >
      H +
      180
    ) {

      if (
        isPriyanka
      ) {

        hurtPriyanka(
          18,
          true
        );
      }

      else {

        hurtDebashis(
          true
        );
      }


      recoverCharacter(
        character,
        isPriyanka
      );
    }
  }


  function recoverCharacter(
    character,
    isPriyanka
  ) {

    const safe =
      nearestPlatform(
        character.x -
        30,
        400
      ) ||

      nearestPlatform(
        player.x,
        500
      );


    if (
      safe
    ) {

      character.x =
        safe.x;


      character.y =
        platformY(
          safe
            .platform
            .offset
        );


      character.previousY =
        character.y;


      character.vy =
        0;


      character.grounded =
        true;
    }

    else {

      character.x =
        isPriyanka
          ?
          170
          :
          player.x +
          250;


      character.y =
        baseGroundY();


      character.previousY =
        character.y;


      character.vy =
        0;


      character.grounded =
        true;
    }
  }


  // =========================================================
  // JUMP
  // =========================================================

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
      -CONFIG.jumpPower;


    debashis.vy =
      -CONFIG.jumpPower;


    player.grounded =
      false;


    debashis.grounded =
      false;


    player.state =
      "jump";


    debashis.state =
      "jump";


    playSound(
      "jump",
      0.72
    );
  }


  // =========================================================
  // MOVEMENT
  //
  // THIS FIXES THE SKATING EFFECT.
  //
  // Animation is advanced by DISTANCE TRAVELLED.
  // =========================================================

  function updateMovement(
    dt
  ) {

    let direction =
      0;


    if (
      keys.left
    ) {

      direction--;
    }


    if (
      keys.right
    ) {

      direction++;
    }


    const speed =
      keys.run
        ?
        CONFIG.runSpeed
        :
        CONFIG.walkSpeed;


    const dx =
      direction *
      speed *
      dt;


    if (
      direction !==
      0
    ) {

      player.facing =
        direction;


      debashis.facing =
        direction;


      player.x =
        Math.max(
          18,
          player.x +
          dx
        );


      debashis.x =
        Math.max(
          player.x +
          80,
          debashis.x +
          dx
        );


      // ======================================================
      // FOOTSTEP SYNCHRONIZATION
      // ======================================================

      player.animDistance +=
        Math.abs(
          dx
        );


      debashis.animDistance +=
        Math.abs(
          dx
        );


      if (
        player.grounded &&
        player.attacking <=
        0
      ) {

        player.state =
          keys.run
            ?
            "run"
            :
            "walk";
      }


      if (
        debashis.grounded &&
        debashis.attacking <=
        0
      ) {

        debashis.state =
          keys.run
            ?
            "run"
            :
            "walk";
      }
    }

    else {

      if (
        player.grounded &&
        player.attacking <=
        0
      ) {

        player.state =
          "idle";
      }


      if (
        debashis.grounded &&
        debashis.attacking <=
        0
      ) {

        debashis.state =
          "idle";
      }
    }


    if (
      !player.grounded &&
      player.attacking <=
      0
    ) {

      player.state =
        "jump";
    }


    if (
      !debashis.grounded &&
      debashis.attacking <=
      0
    ) {

      debashis.state =
        "jump";
    }


    // ========================================================
    // RELATIONSHIP DISTANCE CORRECTION
    //
    // Slow instead of teleporting.
    // ========================================================

    const desiredX =
      player.x +
      desiredPhysicalGap();


    const correction =
      clamp(
        desiredX -
        debashis.x,

        -42 *
        dt,

        42 *
        dt
      );


    if (
      debashis.grounded &&
      Math.abs(
        correction
      ) >
      0.01
    ) {

      const candidate =
        debashis.x +
        correction;


      const platform =
        findPlatformAtX(
          candidate
        );


      if (
        platform
      ) {

        debashis.x =
          candidate;


        debashis.y =
          platformY(
            platform.offset
          );
      }
    }

    else if (
      !debashis.grounded
    ) {

      debashis.x +=
        correction;
    }
  }


  // =========================================================
  // HEART FIRE
  // =========================================================

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


    player.state =
      "attack";


    debashis.state =
      "attack";


    heartShots.push({

      owner:
        "priyanka",

      x:
        player.x +
        28 *
        player.facing,

      y:
        player.y -
        68,

      vx:
        CONFIG.heartSpeed *
        player.facing,

      life:
        1.5
    });


    heartShots.push({

      owner:
        "debashis",

      x:
        debashis.x +
        28 *
        debashis.facing,

      y:
        debashis.y -
        68,

      vx:
        CONFIG.heartSpeed *
        debashis.facing,

      life:
        1.5
    });


    spawnSparkles(
      debashis.x,

      debashis.y -
      65,

      "#ff72b1",

      9
    );


    playSound(
      "heart",
      0.72
    );
  }


  // =========================================================
  // ENEMY SYSTEM
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
      0.70 &&
      roll <
      0.14
    ) {

      return "dragon";
    }


    if (
      progress >
      0.44 &&
      roll <
      0.34
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


  function spawnEnemy() {

    if (
      enemies.length >=
      CONFIG.maxEnemies
    ) {

      return false;
    }


    const type =
      chooseEnemyType();


    const def =
      ENEMY_TYPES[
        type
      ];


    let x =
      debashis.x +
      randomRange(
        240,
        430
      );


    if (
      !def.flying
    ) {

      const safe =
        nearestPlatform(
          x,
          180
        );


      if (
        !safe
      ) {

        return false;
      }


      x =
        safe.x;
    }


    const p =
      findPlatformAtX(
        x
      );


    const y =
      def.flying
        ?
        (
          p
            ?
            platformY(
              p.offset
            )
            :
            baseGroundY()
        ) -
        100
        :
        platformY(
          p.offset
        );


    enemies.push({

      type,

      x,

      y,

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
          1,
          2
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


  function startNewWave() {

    const extra =
      currentProgress() >
      0.72
        ?
        1
        :
        0;


    waveRemaining =
      Math.floor(
        randomRange(
          CONFIG.waveMin,
          CONFIG.waveMax +
          1 +
          extra
        )
      );


    waveSpawnTimer =
      0.15;
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
        }

        else {

          waveSpawnTimer =
            0.28;
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


  function getEnemyGround(
    enemy
  ) {

    const platform =
      findPlatformAtX(
        enemy.x
      );


    return platform
      ?
      platformY(
        platform.offset
      )
      :
      baseGroundY();
  }


  function updateEnemies(
    dt
  ) {

    for (
      let i =
        enemies.length -
        1;

      i >=
        0;

      i--
    ) {

      const enemy =
        enemies[
          i
        ];


      const def =
        ENEMY_TYPES[
          enemy.type
        ];


      enemy.flash =
        Math.max(
          0,
          enemy.flash -
          dt
        );


      enemy.attackTimer -=
        dt;


      enemy.x -=
        enemy.speed *
        dt;


      if (
        def.flying
      ) {

        enemy.y =
          getEnemyGround(
            enemy
          ) -
          95 +
          Math.sin(
            gameTime *
            4 +
            enemy.bob
          ) *
          12;
      }

      else {

        const p =
          findPlatformAtX(
            enemy.x
          );


        if (
          p
        ) {

          enemy.y =
            platformY(
              p.offset
            );
        }
      }


      if (
        def.ranged &&

        !enemy.attacked &&

        enemy.attackTimer <=
        0 &&

        enemy.x -
        debashis.x <
        260 &&

        Math.random() <
        CONFIG.enemyAttackChance
      ) {

        enemy.attacked =
          true;


        incomingAttacks.push({

          startX:
            enemy.x,

          startY:
            enemy.y -
            55,

          endX:
            player.x,

          endY:
            player.y -
            55,

          life:
            CONFIG.enemyAttackTravelTime,

          duration:
            CONFIG.enemyAttackTravelTime,

          checked:
            false
        });


        showMessage(
          "Jump!",
          0.55
        );
      }


      if (
        Math.abs(
          enemy.x -
          debashis.x
        ) <
        34 &&

        Math.abs(
          enemy.y -
          debashis.y
        ) <
        90
      ) {

        enemies.splice(
          i,
          1
        );


        hurtDebashis(
          false
        );
      }
    }
  }


  function updateHeartShots(
    dt
  ) {

    for (
      let i =
        heartShots.length -
        1;

      i >=
        0;

      i--
    ) {

      const shot =
        heartShots[
          i
        ];


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
          enemies[
            e
          ];


        if (
          Math.abs(
            shot.x -
            enemy.x
          ) <
          44 &&

          Math.abs(
            shot.y -
            (
              enemy.y -
              45
            )
          ) <
          55
        ) {

          enemy.hp--;


          enemy.flash =
            0.12;


          spawnSparkles(
            enemy.x,
            enemy.y -
            45,
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
        CONFIG.minDistance,
        CONFIG.maxDistance
      );


    spawnSparkles(
      enemy.x,
      enemy.y -
      45,
      "#ffd08c",
      17
    );


    enemies.splice(
      index,
      1
    );


    playSound(
      "enemyDefeat",
      0.60
    );


    showMessage(
      "♥ Closer",
      0.65
    );


    updateHud();


    if (
      mode ===
      MODE.CHASE &&

      relationshipDistance <=
      CONFIG.reunionDistance
    ) {

      beginReunion();
    }
  }


  // =========================================================
  // ATTACKS
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
        incomingAttacks[
          i
        ];


      attack.life -=
        dt;


      if (
        attack.life <=
        0 &&

        !attack.checked
      ) {

        attack.checked =
          true;


        const currentPlatform =
          findPlatformAtX(
            player.x
          );


        const platformHeight =
          currentPlatform
            ?
            platformY(
              currentPlatform.offset
            )
            :
            baseGroundY();


        const avoided =
          !player.grounded &&
          player.y <
          platformHeight -
          35;


        if (
          !avoided
        ) {

          hurtPriyanka(
            14,
            false
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
  // HAZARDS
  // =========================================================

  function spawnHazard() {

    let x =
      debashis.x +
      randomRange(
        190,
        340
      );


    const safe =
      nearestPlatform(
        x,
        160
      );


    if (
      !safe
    ) {

      return;
    }


    x =
      safe.x;


    hazards.push({

      x,

      y:
        platformY(
          safe
            .platform
            .offset
        ),

      warning:
        false
    });
  }


  function updateHazards(
    dt
  ) {

    for (
      let i =
        hazards.length -
        1;

      i >=
        0;

      i--
    ) {

      const hazard =
        hazards[
          i
        ];


      if (
        !hazard.warning &&

        hazard.x -
        debashis.x <
        135
      ) {

        hazard.warning =
          true;


        showMessage(
          "Jump!",
          0.60
        );
      }


      if (
        Math.abs(
          hazard.x -
          debashis.x
        ) <
        28
      ) {

        if (
          debashis.grounded
        ) {

          hurtDebashis(
            false
          );
        }

        else {

          showMessage(
            "Saved ♥",
            0.58
          );
        }


        hazards.splice(
          i,
          1
        );
      }
    }
  }


  // =========================================================
  // DAMAGE
  // =========================================================

  function hurtPriyanka(
    damage,
    fell
  ) {

    if (
      player.invulnerable >
      0 &&

      !fell
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
      0.85;


    relationshipDistance =
      clamp(
        relationshipDistance +
        CONFIG.priyankaHitPenalty,
        CONFIG.minDistance,
        CONFIG.maxDistance
      );


    playSound(
      "playerHit",
      0.75
    );


    showMessage(
      fell
        ?
        "Priyanka fell — distance increased"
        :
        "Priyanka was hurt — distance increased",
      1.35
    );


    updateHud();


    if (
      player.health <=
      0
    ) {

      triggerGameOver();
    }
  }


  function hurtDebashis(
    fell
  ) {

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
        CONFIG.minDistance,
        CONFIG.maxDistance
      );


    playSound(
      "debashisHit",
      0.75
    );


    showMessage(
      fell
        ?
        "Debashis fell!"
        :
        "Debashis was hit!",
      1.15
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
  // PARTICLES
  // =========================================================

  function spawnSparkles(
    x,
    y,
    color,
    count
  ) {

    for (
      let i =
        0;

      i <
        count;

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
            0.85
          ),

        maxLife:
          0.85,

        size:
          randomRange(
            2,
            5
          ),

        color
      });
    }
  }


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
        particles[
          i
        ];


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
  // GAMEPLAY UPDATE
  // =========================================================

  function updateGameplay(
    dt
  ) {

    maintainChunks();


    updateMovement(
      dt
    );


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


    updateCharacterVertical(
      player,
      dt,
      true
    );


    updateCharacterVertical(
      debashis,
      dt,
      false
    );


    player.animTime +=
      dt;


    debashis.animTime +=
      dt;


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


    updateHazards(
      dt
    );


    updateParticles(
      dt
    );


    hazardTimer -=
      dt;


    if (
      mode === MODE.CHASE &&

      hazardTimer <=
      0
    ) {

      spawnHazard();


      hazardTimer =
        randomRange(
          5.2,
          8.4
        );
    }


    updateCamera(
      dt
    );
  }


  // =========================================================
  // GAME OVER
  // =========================================================

  function triggerGameOver() {

    mode =
      MODE.GAME_OVER;


    mobileControls.classList.add(
      "hidden"
    );


    gameOverOverlay.classList.remove(
      "hidden"
    );
  }


  function restartGameplay() {

    enemies.length =
      0;


    heartShots.length =
      0;


    incomingAttacks.length =
      0;


    hazards.length =
      0;


    particles.length =
      0;


    gameOverOverlay.classList.add(
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


    hazards.length =
      0;


    mobileControls.classList.add(
      "hidden"
    );


    gameHint.textContent =
      "Together ♥";


    player.state =
      "emote";


    debashis.state =
      "emote";


    playSound(
      "celebration",
      0.78
    );


    for (
      let i =
        0;

      i <
        90;

      i++
    ) {

      particles.push({

        x:
          cameraX +
          randomRange(
            0,
            W
          ),

        y:
          randomRange(
            H *
            0.06,
            H *
            0.58
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

          celebrationOverlay.classList.remove(
            "hidden"
          );
        }

      },
      1100
    );
  }


  function continueTogether() {

    celebrationOverlay.classList.add(
      "hidden"
    );


    mode =
      MODE.TOGETHER;


    relationshipDistance =
      CONFIG.minDistance;


    player.health =
      CONFIG.priyankaMaxHealth;


    debashis.hearts =
      CONFIG.debashisMaxHearts;


    player.state =
      "idle";


    debashis.state =
      "idle";


    hud.classList.remove(
      "hidden"
    );


    mobileControls.classList.remove(
      "hidden"
    );


    gameHint.textContent =
      "Together Forever ♥";


    waveRemaining =
      0;


    waveRestTimer =
      0.7;


    updateHud();


    showMessage(
      "Now they continue together ♥",
      2.0
    );
  }


  function closeStory() {

    fadeScreen.classList.add(
      "on"
    );


    setTimeout(
      () => {

        celebrationOverlay.classList.add(
          "hidden"
        );


        closedOverlay.classList.remove(
          "hidden"
        );


        fadeScreen.classList.remove(
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
        catch (
          error
        ) {
        }

      },
      1500
    );
  }


  // =========================================================
  // MAIN UPDATE
  // =========================================================

  function update(
    dt
  ) {

    gameTime +=
      dt;


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

      player.animTime +=
        dt;


      debashis.animTime +=
        dt;


      updateParticles(
        dt
      );


      updateCamera(
        dt
      );
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
          cameraX *
          parallax
        ) %
        width
      );


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
        width +
        1,
        height
      );
    }
  }


  function drawBackground() {

    const sky =
      ctx.createLinearGradient(
        0,
        0,
        0,
        H
      );


    sky.addColorStop(
      0,
      "#24114b"
    );


    sky.addColorStop(
      0.42,
      "#6a4e88"
    );


    sky.addColorStop(
      0.72,
      "#d78ca2"
    );


    sky.addColorStop(
      1,
      "#f0c29f"
    );


    ctx.fillStyle =
      sky;


    ctx.fillRect(
      0,
      0,
      W,
      H
    );


    drawHorizontalScene(
      ENV.sky,
      0,
      H *
      0.63,
      0.05
    );


    const haze =
      ctx.createLinearGradient(
        0,
        H *
        0.40,
        0,
        H *
        0.75
      );


    haze.addColorStop(
      0,
      "rgba(116,94,142,0)"
    );


    haze.addColorStop(
      1,
      "rgba(93,79,88,.34)"
    );


    ctx.fillStyle =
      haze;


    ctx.fillRect(
      0,
      H *
      0.40,
      W,
      H *
      0.35
    );


    drawHorizontalScene(
      ENV.forest,
      H *
      0.48,
      H *
      0.26,
      0.16
    );
  }


  // =========================================================
  // MARIO PLATFORM DRAW
  // =========================================================

  function drawPlatform(
    platform
  ) {

    const screenX =
      worldToScreenX(
        platform.x
      );


    const y =
      platformY(
        platform.offset
      );


    const width =
      platform.w;


    if (
      screenX +
      width <
      -80 ||

      screenX >
      W +
      80
    ) {

      return;
    }


    // ========================================================
    // DIRT BODY
    // ========================================================

    const dirt =
      ctx.createLinearGradient(
        0,
        y,
        0,
        y +
        90
      );


    dirt.addColorStop(
      0,
      "#8d6240"
    );


    dirt.addColorStop(
      0.35,
      "#6f492f"
    );


    dirt.addColorStop(
      1,
      "#3f2c22"
    );


    ctx.fillStyle =
      dirt;


    ctx.fillRect(
      screenX,
      y +
      9,
      width,
      H -
      y +
      120
    );


    // ========================================================
    // TOP SOIL
    // ========================================================

    ctx.fillStyle =
      "#b58a63";


    ctx.fillRect(
      screenX,
      y +
      5,
      width,
      22
    );


    // ========================================================
    // GRASS
    // ========================================================

    ctx.fillStyle =
      "#4d913e";


    ctx.fillRect(
      screenX,
      y,
      width,
      12
    );


    ctx.fillStyle =
      "#78c856";


    ctx.fillRect(
      screenX,
      y,
      width,
      4
    );


    // ========================================================
    // TILE LINES
    // ========================================================

    ctx.strokeStyle =
      "rgba(63,38,27,.35)";


    ctx.lineWidth =
      1;


    for (
      let tileX =
        screenX +
        46;

      tileX <
        screenX +
        width;

      tileX +=
        46
    ) {

      ctx.beginPath();


      ctx.moveTo(
        tileX,
        y +
        10
      );


      ctx.lineTo(
        tileX,
        y +
        38
      );


      ctx.stroke();
    }


    // ========================================================
    // GRASS TUFTS
    // ========================================================

    ctx.strokeStyle =
      "#87d764";


    ctx.lineWidth =
      2;


    for (
      let grassX =
        screenX +
        24;

      grassX <
        screenX +
        width;

      grassX +=
        80
    ) {

      ctx.beginPath();


      ctx.moveTo(
        grassX,
        y +
        1
      );


      ctx.lineTo(
        grassX -
        4,
        y -
        7
      );


      ctx.moveTo(
        grassX,
        y +
        1
      );


      ctx.lineTo(
        grassX +
        4,
        y -
        8
      );


      ctx.stroke();
    }
  }


  function drawPlatforms() {

    for (
      const platform
      of allActivePlatforms()
    ) {

      drawPlatform(
        platform
      );
    }
  }


  // =========================================================
  // DECORATIONS
  // =========================================================

  function drawDecorations() {

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
        const decoration
        of chunk.decorations
      ) {

        const sx =
          worldToScreenX(
            decoration.x
          );


        if (
          sx <
          -200 ||

          sx >
          W +
          200
        ) {

          continue;
        }


        const crop =
          ENV[
            decoration.type
          ];


        if (
          !crop
        ) {

          continue;
        }


        let baseW =
          110;


        let baseH =
          100;


        if (
          decoration.type ===
          "pinkTree"
        ) {

          baseW =
            145;


          baseH =
            130;
        }


        if (
          decoration.type ===
          "fountain" ||

          decoration.type ===
          "bridge"
        ) {

          baseW =
            140;


          baseH =
            100;
        }


        const width =
          baseW *
          decoration.scale;


        const height =
          baseH *
          decoration.scale;


        const y =
          platformY(
            decoration.offset
          );


        drawCrop(
          crop,
          sx -
          width /
          2,
          y -
          height -
          5,
          width,
          height
        );
      }
    }
  }


  // =========================================================
  // ANIMATION FRAME
  //
  // THIS IS THE MAIN SKATING FIX.
  // =========================================================

  function animationFrame(
    character,
    anim,
    state
  ) {

    if (
      state ===
      "walk"
    ) {

      /*
      One animation frame for approximately
      every 16 pixels travelled.
      */

      return (
        Math.floor(
          character.animDistance /
          16
        ) %
        anim.frames
      );
    }


    if (
      state ===
      "run"
    ) {

      return (
        Math.floor(
          character.animDistance /
          23
        ) %
        anim.frames
      );
    }


    return (
      Math.floor(
        character.animTime *
        anim.fps
      ) %
      anim.frames
    );
  }


  // =========================================================
  // CHARACTER DRAW
  // =========================================================

  function drawCharacter(
    image,
    animations,
    cell,
    character,
    screenX,
    scale,
    options = {}
  ) {

    if (
      !image.complete ||
      !image.naturalWidth
    ) {

      return;
    }


    const state =
      options.state ||
      character.state ||
      "idle";


    const anim =
      animations[
        state
      ] ||
      animations.idle;


    let frame =
      animationFrame(
        character,
        anim,
        state
      );


    if (
      Number.isInteger(
        options.fixedFrame
      )
    ) {

      frame =
        options.fixedFrame;
    }


    const sourceX =
      frame *
      cell.width;


    const sourceY =
      anim.row *
      cell.height;


    const height =
      166 *
      scale;


    const width =
      148 *
      scale;


    const screenY =
      options.screenY !==
      undefined
        ?
        options.screenY
        :
        character.y;


    let facing =
      options.facing !==
      undefined
        ?
        options.facing
        :
        character.facing;


    if (
      options.forceFacing ===
      "left"
    ) {

      facing =
        -1;
    }


    if (
      options.forceFacing ===
      "right"
    ) {

      facing =
        1;
    }


    ctx.save();


    ctx.translate(
      screenX,
      screenY
    );


    // ========================================================
    // LEFT = ALWAYS MIRROR RIGHT SOURCE
    // ========================================================

    if (
      facing <
      0
    ) {

      ctx.scale(
        -1,
        1
      );
    }


    ctx.drawImage(

      image,

      sourceX,
      sourceY,

      cell.width,
      cell.height,

      -width /
      2,

      -height +
      8,

      width,
      height
    );


    ctx.restore();
  }


  // =========================================================
  // OPENING CHARACTER DRAW
  // =========================================================

  function drawOpeningCharacters() {

    const ground =
      baseGroundY();


    if (
      mode ===
      MODE.DIALOGUE
    ) {

      drawCharacter(
        priyankaAtlas,
        PRIYANKA_ANIMS,
        PRIYANKA_CELL,
        player,
        meeting.priyankaX,
        0.96,
        {
          state:
            "idle",

          fixedFrame:
            0,

          forceFacing:
            "right",

          screenY:
            ground
        }
      );


      drawCharacter(
        debashisAtlas,
        DEBASHIS_ANIMS,
        DEBASHIS_CELL,
        debashis,
        meeting.debashisX,
        0.96,
        {
          state:
            "idle",

          fixedFrame:
            0,

          forceFacing:
            "left",

          screenY:
            ground
        }
      );


      return;
    }


    if (
      mode ===
      MODE.RUNAWAY
    ) {

      drawCharacter(
        priyankaAtlas,
        PRIYANKA_ANIMS,
        PRIYANKA_CELL,
        player,
        meeting.priyankaX,
        0.96,
        {
          state:
            "run",

          forceFacing:
            "left",

          screenY:
            ground
        }
      );


      drawCharacter(
        debashisAtlas,
        DEBASHIS_ANIMS,
        DEBASHIS_CELL,
        debashis,
        meeting.debashisX,
        0.96,
        {
          state:
            "idle",

          fixedFrame:
            0,

          forceFacing:
            "left",

          screenY:
            ground
        }
      );


      if (
        meeting.phaseTime <
        1.25
      ) {

        ctx.save();


        ctx.font =
          "bold 25px sans-serif";


        ctx.fillStyle =
          "#ff4267";


        ctx.textAlign =
          "center";


        ctx.fillText(
          "!",
          meeting.priyankaX,
          ground -
          150
        );


        ctx.restore();
      }


      return;
    }


    drawCharacter(
      priyankaAtlas,
      PRIYANKA_ANIMS,
      PRIYANKA_CELL,
      player,
      meeting.priyankaX,
      0.96,
      {
        state:
          "idle",

        fixedFrame:
          0,

        forceFacing:
          "right",

        screenY:
          ground
      }
    );


    drawCharacter(
      debashisAtlas,
      DEBASHIS_ANIMS,
      DEBASHIS_CELL,
      debashis,
      meeting.debashisX,
      0.96,
      {
        state:
          debashis.state,

        forceFacing:
          "left",

        screenY:
          ground
      }
    );
  }


  // =========================================================
  // GAMEPLAY CHARACTERS
  // =========================================================

  function drawGameplayCharacters() {

    drawCharacter(
      priyankaAtlas,
      PRIYANKA_ANIMS,
      PRIYANKA_CELL,
      player,
      worldToScreenX(
        player.x
      ),
      CONFIG.characterScale
    );


    drawCharacter(
      debashisAtlas,
      DEBASHIS_ANIMS,
      DEBASHIS_CELL,
      debashis,
      worldToScreenX(
        debashis.x
      ),
      CONFIG.characterScale *
      0.98
    );
  }


  // =========================================================
  // ENEMY DRAW
  // =========================================================

  function drawEnemy(
    enemy
  ) {

    const def =
      ENEMY_TYPES[
        enemy.type
      ];


    const screenX =
      worldToScreenX(
        enemy.x
      );


    if (
      screenX <
      -100 ||

      screenX >
      W +
      100
    ) {

      return;
    }


    const crop =
      def.crop;


    const height =
      (
        def.flying
          ?
          72
          :
          83
      ) *
      def.scale;


    const width =
      height *
      crop.w /
      crop.h;


    const screenY =
      def.flying
        ?
        enemy.y
        :
        enemy.y -
        height /
        2;


    ctx.save();


    if (
      enemy.flash >
      0
    ) {

      ctx.globalAlpha =
        0.55;
    }


    ctx.translate(
      screenX,
      screenY
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

      -width /
      2,

      -height /
      2,

      width,
      height
    );


    ctx.restore();


    // HP bar.
    if (
      enemy.maxHp >
      1
    ) {

      const barY =
        (
          def.flying
            ?
            screenY
            :
            enemy.y -
            height
        ) -
        8;


      ctx.fillStyle =
        "rgba(25,8,22,.65)";


      ctx.fillRect(
        screenX -
        22,
        barY,
        44,
        5
      );


      ctx.fillStyle =
        "#ff7ca8";


      ctx.fillRect(
        screenX -
        22,
        barY,
        44 *
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


  // =========================================================
  // HEART DRAW
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
      size /
      32,
      size /
      32
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

      const screenX =
        worldToScreenX(
          shot.x
        );


      ctx.save();


      ctx.shadowColor =
        "#ff5fa9";


      ctx.shadowBlur =
        16;


      drawHeartShape(
        screenX,
        shot.y,
        16,
        "#ff5fa9"
      );


      ctx.shadowBlur =
        0;


      drawHeartShape(
        screenX,
        shot.y,
        8,
        "#fff2f8"
      );


      ctx.restore();
    }
  }


  // =========================================================
  // ENEMY ATTACK DRAW
  // =========================================================

  function drawIncomingAttacks() {

    for (
      const attack
      of incomingAttacks
    ) {

      const t =
        1 -
        attack.life /
        attack.duration;


      const worldX =
        lerp(
          attack.startX,
          attack.endX,
          t
        );


      const y =
        lerp(
          attack.startY,
          attack.endY,
          t
        ) -
        Math.sin(
          t *
          Math.PI
        ) *
        44;


      const screenX =
        worldToScreenX(
          worldX
        );


      ctx.save();


      ctx.shadowColor =
        "#7338cf";


      ctx.shadowBlur =
        18;


      ctx.fillStyle =
        "#7d45d8";


      ctx.beginPath();


      ctx.arc(
        screenX,
        y,
        9,
        0,
        Math.PI *
        2
      );


      ctx.fill();


      ctx.restore();
    }
  }


  // =========================================================
  // HAZARD DRAW
  // =========================================================

  function drawHazards() {

    for (
      const hazard
      of hazards
    ) {

      const screenX =
        worldToScreenX(
          hazard.x
        );


      const y =
        hazard.y;


      ctx.fillStyle =
        "#315830";


      ctx.strokeStyle =
        "#203c26";


      ctx.lineWidth =
        2;


      ctx.beginPath();


      ctx.moveTo(
        screenX -
        25,
        y
      );


      ctx.lineTo(
        screenX -
        14,
        y -
        35
      );


      ctx.lineTo(
        screenX -
        4,
        y
      );


      ctx.lineTo(
        screenX +
        7,
        y -
        45
      );


      ctx.lineTo(
        screenX +
        18,
        y
      );


      ctx.lineTo(
        screenX +
        28,
        y -
        30
      );


      ctx.lineTo(
        screenX +
        37,
        y
      );


      ctx.closePath();


      ctx.fill();


      ctx.stroke();
    }
  }


  // =========================================================
  // PARTICLES DRAW
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
        worldToScreenX(
          p.x
        ),
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
  // CELEBRATION
  // =========================================================

  function drawCelebrationText() {

    ctx.textAlign =
      "center";


    ctx.shadowColor =
      "#ffd391";


    ctx.shadowBlur =
      22;


    ctx.fillStyle =
      "#fff1c2";


    ctx.font =
      `italic ${
        Math.max(
          30,
          Math.min(
            58,
            W *
            0.06
          )
        )
      }px Georgia`;


    ctx.fillText(
      "Happy Halfway Anniversary",
      W /
      2,
      H *
      0.20
    );


    ctx.shadowBlur =
      10;


    ctx.fillStyle =
      "#ffd8e3";


    ctx.font =
      `italic ${
        Math.max(
          22,
          Math.min(
            38,
            W *
            0.04
          )
        )
      }px Georgia`;


    ctx.fillText(
      "Priyanka ♥ Debashis",
      W /
      2,
      H *
      0.27
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


    drawBackground();


    // ========================================================
    // OPENING SCENE
    // ========================================================

    if (
      mode === MODE.WAIT ||
      mode === MODE.MEETING ||
      mode === MODE.DIALOGUE ||
      mode === MODE.RUNAWAY
    ) {

      // Simple clean opening platform.
      ctx.fillStyle =
        "#6f492f";


      ctx.fillRect(
        0,
        baseGroundY() +
        10,
        W,
        H -
        baseGroundY()
      );


      ctx.fillStyle =
        "#4d913e";


      ctx.fillRect(
        0,
        baseGroundY(),
        W,
        14
      );


      ctx.fillStyle =
        "#78c856";


      ctx.fillRect(
        0,
        baseGroundY(),
        W,
        4
      );


      drawOpeningCharacters();


      return;
    }


    // ========================================================
    // GAME
    // ========================================================

    drawDecorations();


    drawPlatforms();


    drawHazards();


    for (
      const enemy
      of enemies
    ) {

      drawEnemy(
        enemy
      );
    }


    drawIncomingAttacks();


    drawGameplayCharacters();


    drawHeartShots();


    drawParticles();


    if (
      mode ===
      MODE.CELEBRATION
    ) {

      drawCelebrationText();
    }
  }


  // =========================================================
  // MOBILE CONTROLS
  // =========================================================

  function bindHold(
    id,
    key
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


    const down =
      event => {

        event.preventDefault();


        keys[
          key
        ] =
          true;


        button.classList.add(
          "active"
        );
      };


    const up =
      event => {

        event.preventDefault();


        keys[
          key
        ] =
          false;


        button.classList.remove(
          "active"
        );
      };


    button.addEventListener(
      "pointerdown",
      down
    );


    button.addEventListener(
      "pointerup",
      up
    );


    button.addEventListener(
      "pointercancel",
      up
    );


    button.addEventListener(
      "pointerleave",
      up
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


  document
    .getElementById(
      "jumpButton"
    )
    .addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();


        jump();
      }
    );


  document
    .getElementById(
      "attackButton"
    )
    .addEventListener(
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
    startStory
  );


  restartButton.addEventListener(
    "click",
    () => {

      playSound(
        "ui",
        0.55
      );


      restartGameplay();
    }
  );


  continueButton.addEventListener(
    "click",
    () => {

      playSound(
        "ui",
        0.55
      );


      continueTogether();
    }
  );


  closeButton.addEventListener(
    "click",
    () => {

      playSound(
        "ui",
        0.48
      );


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
