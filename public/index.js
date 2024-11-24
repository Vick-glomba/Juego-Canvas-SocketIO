const mapImage = new Image();
mapImage.src = "/snowy-sheet.png";

let pjImage
const santaImage = new Image();
santaImage.src = "/santa.png";

const speakerImage = new Image();
speakerImage.src = "/speaker.png";

const walkSnow = new Audio("walk-snow.mp3");

const canvasEl = document.getElementById("canvas");
canvasEl.width = window.innerWidth * 0.5;
canvasEl.height = window.innerHeight * 0.6;
const canvas = canvasEl.getContext("2d");




let adjust = {
  link: {
    w: 40,
    h: 50,
    stand:{
      rowUp:6,
      up: [0],
      rowDown:0,
      down: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      rowLeft:1,
      left: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
      rowRight:3,
      right: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    },
    walk:{
      rowUp:6,
      up: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rowDown:4,
      down: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rowLeft:5,
      left: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rowRight:7,
      right: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    },
  },
  barca: {
     w: 100,
     h: 100,
     stand:{
      rowUp:3,
      up: [1, 2, 3],
      rowDown:2,
      down: [1, 2, 3],
      rowLeft:0,
      left: [1, 2, 3],
      rowRight:1,
      right: [1, 2, 3],
    },
     walk:{
       rowUp:3,
       up: [1, 2, 3],
       rowDown:2,
       down: [1, 2, 3],
       rowLeft:0,
       left: [1, 2, 3],
       rowRight:1,
       right: [1,2,3],
     }
     },

}



const socket = io();

// const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const localTracks = {
  audioTrack: null,
};

let isPlaying = true;

const remoteUsers = {};
window.remoteUsers = remoteUsers;

const muteButton = document.getElementById("mute");
const uid = Math.floor(Math.random() * 1000000);

muteButton.addEventListener("click", () => {
  if (isPlaying) {
    //localTracks.audioTrack.setEnabled(false);
    pj = personajes.find(pj => pj.skin === "link")
    pjImage.src = "/" + pj.info.name + ".png";
    muteButton.innerText = "Barca";
    socket.emit("mute", true);
  } else {
    // localTracks.audioTrack.setEnabled(true);
    pj = personajes.find(pj => pj.skin === "barca")
    pjImage.src = "/" + pj.info.name + ".png";
    muteButton.innerText = "Link";
    socket.emit("mute", false);
  }
  isPlaying = !isPlaying;
});

const options = {
  appid: "eee1672fa7ef4b83bc7810da003a07bb",
  channel: "game",
  uid,
  token: null,
};

async function subscribe(user, mediaType) {
  await client.subscribe(user, mediaType);
  if (mediaType === "audio") {
    user.audioTrack.play();
  }
}

function handleUserPublished(user, mediaType) {
  const id = user.uid;
  remoteUsers[id] = user;
  subscribe(user, mediaType);
}

function handleUserUnpublished(user) {
  const id = user.uid;
  delete remoteUsers[id];
}

// async function join() {
//   socket.emit("voiceId", uid);

//   client.on("user-published", handleUserPublished);
//   client.on("user-unpublished", handleUserUnpublished);

//   await client.join(options.appid, options.channel, options.token || null, uid);
//   localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

//   await client.publish(Object.values(localTracks));
// }

// join();

let groundMap = [[]];
let decalMap = [[]];
let pj
let dataTile
let players = [];
let snowballs = [];
let ultimoFrame = 0
let personajes

let TILES_IN_ROW_PJ
let TILES_IN_COL_PJ
let PJ_SIZE_W
let PJ_SIZE_H

const TILE_SIZE = 32;

const SNOWBALL_RADIUS = 5;

socket.on("connect", () => {
  console.log("connected");
});

socket.on("map", (loadedMap) => {
  groundMap = loadedMap.ground;
  decalMap = loadedMap.decal;
});
socket.on("pj", (pjs) => {
  personajes = pjs
  pj = personajes.find(pj => pj.skin === "barca")
  pjImage = new Image();
  pjImage.src = "/" + pj.info.name + ".png";
});

socket.on("players", (serverPlayers) => {
  players = serverPlayers;
});

socket.on("snowballs", (serverSnowballs) => {
  snowballs = serverSnowballs;
});

const inputs = {
  up: false,
  down: false,
  left: false,
  right: false,
};

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      inputs["up"] = true;
      inputs["down"] = false;
      inputs["right"] = false;
      inputs["left"] = false;
      break;
    case "s":
      inputs["up"] = false;
      inputs["down"] = true;
      inputs["right"] = false;
      inputs["left"] = false;

      break;
    case "d":
      inputs["up"] = false;
      inputs["down"] = false;
      inputs["right"] = true;
      inputs["left"] = false;

      break;
    case "a":
      inputs["up"] = false;
      inputs["down"] = false;
      inputs["right"] = false;
      inputs["left"] = true;

      break;

  }

  if (["a", "s", "w", "d"].includes(e.key) && walkSnow.paused) {
    inputs["quieto"] = false
    inputs["ultimoFrame"] = ultimoFrame
    inputs["w"] = adjust[pj.skin].w
    inputs["h"] = adjust[pj.skin].h
    // walkSnow.play();
  }
  socket.emit("inputs", inputs);
});

window.addEventListener("keyup", (e) => {
  if (e.key === "w") {
    inputs["up"] = false;
  } else if (e.key === "s") {
    inputs["down"] = false;
  } else if (e.key === "d") {
    inputs["right"] = false;
  } else if (e.key === "a") {
    inputs["left"] = false;
  }
  if (["a", "s", "w", "d"].includes(e.key)) {
    inputs["quieto"] = true
    inputs["w"] = adjust[pj.skin].w
    inputs["h"] = adjust[pj.skin].h
    walkSnow.pause();
    walkSnow.currentTime = 0;
  }
  socket.emit("inputs", inputs);
});

canvasEl.addEventListener("click", (e) => {
  const angle = Math.atan2(
    e.clientY - (canvasEl.height + PJ_SIZE_H) / 2,
    e.clientX - (canvasEl.width + PJ_SIZE_W + 108) / 2
  );
  socket.emit("snowball", angle);
});

function loop() {
  canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);

  const myPlayer = players.find((player) => player.id === socket.id);
  let cameraX = 0;
  let cameraY = 0;
  if (myPlayer) {
    cameraX = parseInt(myPlayer.x - canvasEl.width / 2) //+ (resize[pj.skin].w / 2);
    cameraY = parseInt(myPlayer.y - canvasEl.height / 2) //+ (resize[pj.skin].h / 2);
  }

  const TILES_IN_ROW = 8;

  // ground
  for (let row = 0; row < groundMap.length; row++) {
    for (let col = 0; col < groundMap[0].length; col++) {
      let { id } = groundMap[row][col];
      const imageRow = parseInt(id / TILES_IN_ROW);
      const imageCol = id % TILES_IN_ROW;
      canvas.drawImage(
        mapImage,
        imageCol * TILE_SIZE,
        imageRow * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        col * TILE_SIZE - cameraX,
        row * TILE_SIZE - cameraY,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }

  // decals
  for (let row = 0; row < decalMap.length; row++) {
    for (let col = 0; col < decalMap[0].length; col++) {
      let { id } = decalMap[row][col] ?? { id: undefined };
      const imageRow = parseInt(id / TILES_IN_ROW);
      const imageCol = id % TILES_IN_ROW;

      canvas.drawImage(
        mapImage,
        imageCol * TILE_SIZE,
        imageRow * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        col * TILE_SIZE - cameraX,
        row * TILE_SIZE - cameraY,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }
  //Personaje
  for (const player of players) {
    let row = 0
    let col = 0

    if (player.quieto) {

      switch (player.mirando) {
        case "up":
          const walkUp =adjust[pj.skin].stand.up
          row = adjust[pj.skin].stand.rowUp
          col = walkUp[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkUp.length ? ultimoFrame + 1 : 0
          break;

        case "down":
          //animacion abajo  
          const walkDown = adjust[pj.skin].stand.down
          row = adjust[pj.skin].stand.rowDown
          col = walkDown[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkDown.length ? ultimoFrame + 1 : 0
          break;

        case "left":
          //animacion izquierda
          const walkLeft = adjust[pj.skin].stand.left
          row = adjust[pj.skin].stand.rowLeft
          col = walkLeft[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkLeft.length ? ultimoFrame + 1 : 0
          break;

        case "right":
          //animacion derecha
          const walkRight = adjust[pj.skin].stand.right
          row =  adjust[pj.skin].stand.rowRight
          col = walkRight[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkRight.length ? ultimoFrame + 1 : 0
          break;
      }

    } else {

      switch (player.mirando) {
        case "up":
          const walkUp =adjust[pj.skin].walk.up
          row = adjust[pj.skin].walk.rowUp
          col = walkUp[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkUp.length ? ultimoFrame + 1 : 0
          break;

        case "down":
          //animacion abajo  
          const walkDown = adjust[pj.skin].walk.down
          row = adjust[pj.skin].walk.rowDown
          col = walkDown[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkDown.length ? ultimoFrame + 1 : 0
          break;

        case "left":
          //animacion izquierda
          const walkLeft = adjust[pj.skin].walk.left
          row = adjust[pj.skin].walk.rowLeft
          col = walkLeft[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkLeft.length ? ultimoFrame + 1 : 0
          break;

        case "right":
          //animacion derecha
          const walkRight = adjust[pj.skin].walk.right
          row =  adjust[pj.skin].walk.rowRight
          col = walkRight[ultimoFrame] || 0
          ultimoFrame = ultimoFrame < walkRight.length ? ultimoFrame + 1 : 0
          break;
      }
    }
    // console.log( pj.info)
    TILES_IN_ROW_PJ = pj.info.rows
    TILES_IN_COL_PJ = pj.info.cols
    PJ_SIZE_W = pj.info.tileWidth
    PJ_SIZE_H = pj.info.tileHeight

    let { id } = pj.pj2D[row][col] ?? { id: undefined };

    const imageRow = parseInt(id / TILES_IN_ROW_PJ);
    const imageCol = id % TILES_IN_ROW_PJ;

    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    canvas.drawImage(
      pjImage,
      imageCol * PJ_SIZE_W,
      imageRow * PJ_SIZE_H,
      PJ_SIZE_W,
      PJ_SIZE_H,
      player.x - cameraX - adjust[pj.skin].w / 2,
      player.y - cameraY - adjust[pj.skin].h / 2,
      adjust[pj.skin].w,
      adjust[pj.skin].h
    );
    //canvas.drawImage(santaImage, player.x - cameraX, player.y - cameraY);
    canvas.fillStyle = 'black'
    canvas.fillStyle = "#FF0000";
    canvas.font = "bold 12px arial";
    canvas.textAlign = "center"
  
    canvas.fillText(player.nombre, player.x - cameraX, (player.y - cameraY - adjust[pj.skin].h / 2) + adjust[pj.skin].h + 15)

    if (!player.isMuted) {
      //   canvas.drawImage(
      //     speakerImage,
      //     player.x - cameraX + 5,
      //     player.y - cameraY - 28
      //   );
    }

    if (player !== myPlayer) {
      if (
        remoteUsers[player.voiceId] &&
        remoteUsers[player.voiceId].audioTrack
      ) {
        const distance = Math.sqrt(
          (player.x - myPlayer.x) ** 2 + (player.y - myPlayer.y) ** 2
        );
        const ratio = 1.0 - Math.min(distance / 700, 1);
        remoteUsers[player.voiceId].audioTrack.setVolume(
          Math.floor(ratio * 100)
        );
      }
    }
  }

  for (const snowball of snowballs) {
    canvas.fillStyle = "#FFFFFF";
    canvas.beginPath();
    canvas.arc(
      snowball.x - cameraX + 20,
      snowball.y - cameraY + 25,
      SNOWBALL_RADIUS,
      0,
      2 * Math.PI
    );
    canvas.fill();
  }


}
setInterval(() => {
  loop();
}, 80);
