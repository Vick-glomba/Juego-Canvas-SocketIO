const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.static('public'))
const httpServer = createServer(app);

const io = new Server(httpServer);

const PORT = process.env.PORT || 5000;

const loadMap = require("./mapLoader");
const loadPj = require("./pjLoader");
const db = require("./hechizosDB");

const SPEED = 8;
const TICK_RATE = 16;

const PLAYER_SIZE = 120;
const TILE_SIZE = 32;

let players = [];
let snowballs = [];
const inputsMap = {};
let ground2D, decal2D;

let pj2D
let pjDB = ["link", "barca"]


let adjust = {
  link: {
    w: 40,
    h: 50,
    stand: {
      rowUp: 6,
      up: [0],
      rowDown: 0,
      down: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
      rowLeft: 1,
      left: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
      rowRight: 3,
      right: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
    },
    walk: {
      rowUp: 6,
      up: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rowDown: 4,
      down: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rowLeft: 5,
      left: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      rowRight: 7,
      right: [9, 8, 7, 6, 5, 4, 3, 2, 1],
    },
  },
  barca: {
    w: 100,
    h: 100,
    stand: {
      rowUp: 3,
      up: [0, 1, 2, 3],
      rowDown: 2,
      down: [0, 1, 2, 3],
      rowLeft: 0,
      left: [0, 1, 2, 3],
      rowRight: 1,
      right: [0, 1, 2, 3],
    },
    walk: {
      rowUp: 3,
      up: [0, 1, 2, 3],
      rowDown: 2,
      down: [0, 1, 2, 3],
      rowLeft: 0,
      left: [0, 1, 2, 3],
      rowRight: 1,
      right: [0, 1, 2, 3],
    }
  },

}






let personajes = []
//aca tengo que cargar todos los pjs que existen hacer un loop y mandar un array.
const loadPersonajes = async () => {

  for (let i = 0; i < pjDB.length; i++) {

    pj2D = await loadPj(pjDB[i])
    pj2D.skin = pjDB[i]
    personajes.push(pjDB[i] = pj2D)
  }
}

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  );
}

function isCollidingWithMap(player) {
  for (let row = 0; row < mundo[player.mapa].decal2D.length; row++) {
    for (let col = 0; col < mundo[player.mapa].decal2D[0].length; col++) {
      const tile = mundo[player.mapa].decal2D[row][col];

      if (
        tile &&
        isColliding(
          {
            x: player.x,
            y: player.y,
            w: 0,
            h: 0,
          },
          {
            x: col * TILE_SIZE - TILE_SIZE / 2,
            y: row * TILE_SIZE - TILE_SIZE,
            w: TILE_SIZE * 2,
            h: TILE_SIZE * 2,
          }
        )
      ) {
        return true;
      }
    }
  }
  return false;
}
function isCollidingWithPlayer(player) {
  const playerEnMapa = players.filter(p => p.mapa === player.mapa && p.id !== player.id)
  for (let i = 0; i < playerEnMapa.length; i++) {
    const otroPlayer= playerEnMapa[i] 
    if ( isColliding(
        {
          x: player.x,
          y: player.y,
          w: 0,
          h: 0,
        },
        {
          x: otroPlayer.x-otroPlayer.w/2,
          y: otroPlayer.y-otroPlayer.h/2,
          w: otroPlayer.w,
          h: otroPlayer.h,
        }
      )
    ) {
      return otroPlayer.id;
    }

  }
  return false;
}

function tick(delta) {
  for (const player of players) {
    const inputs = inputsMap[player.id];
    const previousY = player.y;
    const previousX = player.x;
    let row = 0
    let col = 0

    player.w = adjust[player.skin].w
    player.h = adjust[player.skin].h
    const standUp = adjust[player.skin].stand.up
    const standDown = adjust[player.skin].stand.down

    const standLeft = adjust[player.skin].stand.left
    const standRight = adjust[player.skin].stand.right
    const walkUp = adjust[player.skin].walk.up
    const walkDown = adjust[player.skin].walk.down
    const walkLeft = adjust[player.skin].walk.left
    const walkRight = adjust[player.skin].walk.right



    if (inputs.up) {
      player.y -= SPEED;
      player.mirando = "up"
    } else if (inputs.down) {
      player.y += SPEED;
      player.mirando = "down"
    }

    if (isCollidingWithMap(player) || isCollidingWithPlayer(player) ) {
      player.y = previousY;
    }

    if (inputs.left) {
      player.x -= SPEED;
      player.mirando = "left"
    } else if (inputs.right) {
      player.x += SPEED;
      player.mirando = "right"
    }



    if (inputs.up || inputs.down || inputs.left || inputs.right) {
      player.quieto = false

    } else {
      player.quieto = true
    }


    if (player.quieto) {

      switch (player.mirando) {
        case "up":

          row = adjust[player.skin].stand.rowUp
          col = standUp[player.ultimoFrame] || standUp[0]
          player.ultimoFrame = player.ultimoFrame < standUp.length - 1 ? player.ultimoFrame + 1 : standUp[0]
          break;

        case "down":

          //animacion abajo  
          row = adjust[player.skin].stand.rowDown
          col = standDown[player.ultimoFrame] || standDown[0]
          player.ultimoFrame = player.ultimoFrame < standDown.length - 1 ? player.ultimoFrame + 1 : standDown[0]
          break;

        case "left":
          //animacion izquierda

          row = adjust[player.skin].stand.rowLeft
          col = standLeft[player.ultimoFrame] || standLeft[0]
          player.ultimoFrame = player.ultimoFrame < standLeft.length - 1 ? player.ultimoFrame + 1 : standLeft[0]
          break;

        case "right":
          //animacion derecha

          row = adjust[player.skin].stand.rowRight
          col = standRight[player.ultimoFrame] || standRight[0]
          player.ultimoFrame = player.ultimoFrame < standRight.length - 1 ? player.ultimoFrame + 1 : standRight[0]
          break;
      }

    } else {

      switch (player.mirando) {
        case "up":

          row = adjust[player.skin].walk.rowUp
          col = walkUp[player.ultimoFrame] || walkUp[0]
          player.ultimoFrame = player.ultimoFrame < walkUp.length - 1 ? player.ultimoFrame + 1 : walkUp[0]
          break;

        case "down":
          //animacion abajo  

          row = adjust[player.skin].walk.rowDown
          col = walkDown[player.ultimoFrame] || walkDown[0]
          player.ultimoFrame = player.ultimoFrame < walkDown.length - 1 ? player.ultimoFrame + 1 : walkDown[0]
          break;

        case "left":
          //animacion izquierda

          row = adjust[player.skin].walk.rowLeft
          col = walkLeft[player.ultimoFrame] || walkLeft[0]
          player.ultimoFrame = player.ultimoFrame < walkLeft.length - 1 ? player.ultimoFrame + 1 : walkLeft[0]
          break;

        case "right":
          //animacion derecha

          row = adjust[player.skin].walk.rowRight
          col = walkRight[player.ultimoFrame] || 0
          player.ultimoFrame = player.ultimoFrame < walkRight.length - 1 ? player.ultimoFrame + 1 : 0
          break;
      }

    }
    player.row = row
    player.col = col



    if (isCollidingWithMap(player) || isCollidingWithPlayer(player) ) {
      player.x = previousX;
    }
  }

  for (const snowball of snowballs) {
    // snowball.x
    // snowball.y 
    snowball.timeLeft -= delta;

    for (const player of players) {
      if (snowball.mapa === player.mapa) {

        //esto es de la bola original //if (player.id === snowball.playerId) continue;
        const distance = Math.sqrt(
          (player.x - snowball.x) ** 2 +
          (player.y - snowball.y) ** 2
        );
        if (distance <= player.w / 2) {
          const pj = players.find((player) => player.id === snowball.playerId);
          if (snowball.cast) {
            //ACA CONFIGRAR TODOS LOS QUE PASA AL CASTEAR HECHIZOS SOBRE ALGO O ALGUIEN
            if (snowball.cast.cast && snowball.cast.hechizoSelect.clase && snowball.cast.hechizoSelect.clase === "curacion") {
              console.log("toco la bola y es : ", snowball.cast)
              if (pj.mana >= snowball.cast.hechizoSelect["mana necesario"]) {
                pj.mana = pj.mana - snowball.cast.hechizoSelect["mana necesario"]
                player.salud = player.salud + snowball.cast.hechizoSelect["max"]
                player.salud > player.saludTotal ? player.salud = player.saludTotal : player.salud
                const destino = {
                  tipo: "daño",
                  msg: `Has lanzado ${snowball.cast.hechizoSelect["nombre"]} `,
                  playerDestino: player,
                  playerOrigen: pj
                }
                io.to(pj.id).emit('privado', destino);
                const origen = {
                  tipo: "daño",
                  msg: pj.id === player.id ? "Te has curado " + snowball.cast.hechizoSelect["max"] + " puntos de vida." : "te ha curado " + snowball.cast.hechizoSelect["max"] + " puntos de vida.",
                  playerDestino: player,
                  playerOrigen: pj
                }
                io.to(player.id).emit('privado', origen);
                if (player.id !== pj.id) {
                  const destino = {
                    tipo: "daño",
                    msg: "Has curado a " + player.nombre + " por " + snowball.cast.hechizoSelect["max"] + " puntos.",
                    playerDestino: player,
                    playerOrigen: pj
                  }
                  io.to(pj.id).emit('privado', destino);
                }
              } else {
                const destino = {
                  tipo: "daño",
                  msg: "No tienes suficiente mana. NO DEBERIA PODER LANZARLO",
                  playerDestino: player,
                  playerOrigen: pj
                }
                io.to(pj.id).emit('privado', destino);
              }
            }
            player.y = player.y - 1
          }

          const obj = {
            cast: snowball.cast,
            player: pj,
            tipo: "click",
            msg: player
          }
          io.emit("recibirMensaje", obj)
          snowball.timeLeft = -1;
          break;
        }
      }
    }
  }
  snowballs = snowballs.filter((snowball) => snowball.timeLeft > 0);

  // io.emit("players", players);
  // io.emit("snowballs", snowballs);
}
const mundo = []
async function main() {
  mundo[1] = await loadMap(1);
  mundo[2] = await loadMap(2);
  mundo[3] = await loadMap(3);
  mundo[21] = await loadMap(21);
  mundo[22] = await loadMap(22);
  mundo[23] = await loadMap(23);
  await loadPersonajes()


  io.on("connect", (socket) => {
    console.log("user connected", socket.id);

    socket.on("nombre", (nombre) => {
      const player = players.find((player) => player.id === socket.id);
      player.nombre = nombre
    })

    inputsMap[socket.id] = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    players.push({
      id: socket.id,
      hechizos: [2, 6, 2, 0, 4, 5, 0, 3],
      mapa: 1,
      x: 800,
      y: 800,
      mirando: "down",
      quieto: true,
      skin: "link",
      w: 0,
      h: 0,
      quieto: true,
      mirando: "down",
      row: 0,
      col: 0,
      ultimoMensaje: "",
      nombre: "El Vittor",
      nivel: 1,
      energiaTotal: 400,
      saludTotal: 300,
      manaTotal: 200,
      hambreTotal: 100,
      sedTotal: 100,
      energia: 300,
      salud: 100,
      mana: 100,
      hambre: 20,
      sed: 15,
      reputacion: 1000,
      estado: "ciudadano",
      ciudad: "Nix",
      descripcion: "Morgolock, me duras un click"
    });

    const player = players.find((player) => player.id === socket.id);
    const otroPlayer = isCollidingWithPlayer(player)
    if(otroPlayer){
     
      io.sockets.sockets.forEach((socket) => {
        // If given socket id is exist in list of all sockets, kill it
        if(socket.id === otroPlayer)
            socket.disconnect(true);
    });
    
      
    }
    socket.emit("map", {
      mundo,
      player,
      db
    });

    socket.emit("pjs", personajes);
    // pj: pj2D,
    // dataTiles: dataTiles
    socket.on("enMapa", (mapa, callback) => {
      const playersEnMapa = players.filter(p => p.mapa === mapa)
      const snowballsEnMapa = snowballs.filter(s => s.mapa === mapa)
      const data = {
        playersEnMapa,
        snowballsEnMapa,
        playersOnlines: players.length
      }
      return callback(data)
    })


    socket.on("enviarMensaje", (obj) => {
      const player = players.find((player) => player.id === socket.id);

      let msg = obj.msg
      if (msg.trim() !== "") {
        msg = msg.trim()
        player.ultimoMensaje = msg
        msg = player.nombre + ": " + obj.msg
        obj.player = player
        const playersMapa = players.filter(p => p.mapa === player.mapa)
        for (let i = 0; i < playersMapa.length; i++) {
          socket.broadcast.to(playersMapa[i].id).emit("recibirMensaje", obj);

        }
        socket.emit("recibirMensaje", obj)

      } else {
        player.ultimoMensaje = msg
      }
    })

    socket.on("inputs", (inputs) => {
      inputsMap[socket.id] = inputs;
    });
    socket.on("cambiarMapa", (mapa) => {
      const player = players.find((player) => player.id === socket.id);
      if (mundo[mapa]) {
        player.mapa = mapa
        switch (player.mirando) {
          case "up":
            player.y = 1490
            break;
          case "down":
            player.y = 20
            break;
          case "left":
            player.x = 1490
            break;
          case "right":
            player.x = 20
            break;

          default:
            break;
        }
      } else {
        switch (player.mirando) {
          case "up":
            player.y = player.y + 10
            break;
          case "down":
            player.y = player.y - 10
            break;
          case "left":
            player.x = player.x + 10
            break;
          case "right":
            player.x = player.x - 10
            break;

          default:
            break;
        }
      }
    })


    socket.on("mute", (isMuted) => {
      const player = players.find((player) => player.id === socket.id);
      player.isMuted = isMuted;
    });
    socket.on("cambiarSkin", (nuevoSkin) => {
      const player = players.find((player) => player.id === socket.id);
      player.skin = nuevoSkin
    });
    socket.on("voiceId", (voiceId) => {
      const player = players.find((player) => player.id === socket.id);
      player.voiceId = voiceId;
    });
    socket.on("myPlayer", (callback) => {
      const player = players.find((player) => player.id === socket.id);
      return callback(player)
    })

    socket.on("point", (obj) => {
      const player = players.find((player) => player.id === socket.id);

      snowballs.push({
        cast: obj.cast,
        mapa: player.mapa,
        x: obj.x,
        y: obj.y,
        timeLeft: 10000,
        playerId: socket.id,
      });

    });

    socket.on("disconnect", () => {
      players = players.filter((player) => player.id !== socket.id);
    });
  });

  app.use(express.static("public"));

  httpServer.listen(PORT, () => {
    console.log("Escuchando desde puerto:", PORT)
  });

  let lastUpdate = Date.now();
  setInterval(() => {
    const now = Date.now();
    const delta = now - lastUpdate;
    tick(delta);
    lastUpdate = now;
  }, 1000 / TICK_RATE);
}

main();
