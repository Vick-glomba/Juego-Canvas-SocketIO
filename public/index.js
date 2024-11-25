
const nombre = prompt("elije tu nombre")
const mapImage = new Image();
mapImage.src = "/snowy-sheet.png";

const imagenes = {}

imagenes.link = new Image();
imagenes.link.src= "/sprite.png"

imagenes.barca = new Image();
imagenes.barca.src ="/barcanueva.png"

const santaImage = new Image();
santaImage.src = "/santa.png";

const speakerImage = new Image();
speakerImage.src = "/speaker.png";

const walkSnow = new Audio("walk-snow.mp3");

const canvasEl = document.getElementById("canvas");
canvasEl.width = window.innerWidth * 0.5;
canvasEl.height = window.innerHeight * 0.6;
const canvas = canvasEl.getContext("2d");



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
    socket.emit("mute", true);
    muteButton.innerText = "Link";
    const skin = "barca"
    socket.emit("cambiarSkin", skin);


  } else {
    // localTracks.audioTrack.setEnabled(true);
    socket.emit("mute", false);
    muteButton.innerText = "Barca";
    const skin = "link"
    socket.emit("cambiarSkin", skin);

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

socket.emit("nombre", nombre)

socket.on("map", (loadedMap) => {
  groundMap = loadedMap.ground;
  decalMap = loadedMap.decal;
});



socket.on("pjs", (pjs) => {
  personajes = pjs
 
 // pj = personajes.find(pj => pj.skin === "barca")
});

socket.on("players", (serverPlayers) => {
  players = serverPlayers;
  const myPlayer = players.find((player) => player.id === socket.id);
  players =players.filter((player) => player.id !== socket.id)
  players.push(myPlayer)
  //console.log(players[0].skin, players[0].skin, players[0].skin)
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
    //inputs["quieto"] = false
   // inputs["ultimoFrame"] = ultimoFrame
    
    // inputs["w"] = adjust[pj.skin].w
    // inputs["h"] = adjust[pj.skin].h
    // walkSnow.play();
  }

  socket.emit("inputs", inputs);
});

window.addEventListener("keyup", (e) => {
  if (e.key === "w" ) {
    inputs["up"] = false;
  } else if (e.key === "s" ) {
    inputs["down"] = false;
  } else if (e.key === "d" ) {
    inputs["right"] = false;
  } else if (e.key === "a" ) {
    inputs["left"] = false;
  }
  if (["a", "s", "w", "d"].includes(e.key)) {
   // inputs["quieto"] = true
    // inputs["w"] = adjust[pj.skin].w
    // inputs["h"] = adjust[pj.skin].h
    // walkSnow.pause();
    // walkSnow.currentTime = 0;
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
    cameraX = parseInt(myPlayer.x - canvasEl.width / 2) ;
    cameraY = parseInt(myPlayer.y - canvasEl.height / 2) 
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
    // console.log(player.skin)
    
   const pjrender = personajes.find(pj => pj.skin === player.skin)
   //linkImage.src = "/" + pjrender.info.name + ".png"

   
  
    
    TILES_IN_ROW_PJ = pjrender.info.rows
    TILES_IN_COL_PJ = pjrender.info.cols
    PJ_SIZE_W = pjrender.info.tileWidth
    PJ_SIZE_H = pjrender.info.tileHeight
    console.log("aca" , pjrender.pj2D[player.row][player.col])
    let { id } = pjrender.pj2D[player.row][player.col] ?? { id:0 };
   
    
    const imageRow = parseInt(id / TILES_IN_ROW_PJ);
    const imageCol = id % TILES_IN_ROW_PJ;
    
   

    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    canvas.drawImage(
      imagenes[player.skin],
      imageCol * PJ_SIZE_W,
      imageRow * PJ_SIZE_H,
      PJ_SIZE_W,
      PJ_SIZE_H,
      player.x - cameraX - player.w / 2,
      player.y - cameraY - player.h / 2,
      player.w,
      player.h
    );
    //canvas.drawImage(santaImage, player.x - cameraX, player.y - cameraY);
    canvas.fillStyle = 'black'
    canvas.fillStyle = "#FF0000";
    canvas.font = "bold 12px arial";
    canvas.textAlign = "center"

    canvas.fillText(player.nombre, player.x - cameraX, (player.y - cameraY - player.h / 2) + player.h + 15)

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
}, 10);
