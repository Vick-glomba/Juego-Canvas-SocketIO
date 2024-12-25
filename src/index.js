const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.static('public'))
const httpServer = createServer(app);

const io = new Server(httpServer);

const PORT = process.env.PORT || 8080;

const loadMap = require("./mapLoader");
const loadPj = require("./pjLoader");
const db = require("./hechizosDB");
const dbItems = db.items
const SPEED = 6
const FPS = 10;

const PLAYER_SIZE = 120;
const TILE_SIZE = 32;




let players = [];
let snowballs = [];
const inputsMap = {};
let ground2D, decal2D;

let pj2D
let pjDB = ["link", "barca", "arboles", "items"]



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
  arboles: {
    w: 256,
    h: 320,
    stand: {
      rowUp: 0,
      up: [0, 1, 2, 3, 4],
      rowDown: 1,
      down: [0, 1, 2, 3, 4],
      rowLeft: 0,
      left: [0, 1, 2, 3, 4],
      rowRight: 1,
      right: [0, 1, 2, 3, 4],
    },
    walk: {
      rowUp: 0,
      up: [0, 1, 2, 3, 4],
      rowDown: 1,
      down: [0, 1, 2, 3, 4],
      rowLeft: 0,
      left: [0, 1, 2, 3, 4],
      rowRight: 1,
      right: [0, 1, 2, 3, 4],
    }
  },
  items: {
    w: 32,
    h: 32,
    stand: {
      rowUp: 0,
      up: [0, 1, 2, 3, 4],
      rowDown: 1,
      down: [0, 1, 2, 3, 4],
      rowLeft: 0,
      left: [0, 1, 2, 3, 4],
      rowRight: 1,
      right: [0, 1, 2, 3, 4],
    },
    walk: {
      rowUp: 0,
      up: [0, 1, 2, 3, 4],
      rowDown: 1,
      down: [0, 1, 2, 3, 4],
      rowLeft: 0,
      left: [0, 1, 2, 3, 4],
      rowRight: 1,
      right: [0, 1, 2, 3, 4],
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



function tick() {
  const playersFilter = players.filter(p => p.clase === "player")
  for (const player of playersFilter) {
    if (player.clase === "player") {


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



    }
  }



  // snowballs = snowballs.filter((snowball) => snowball.timeLeft > 0);

  // players.forEach(player => {
  //   let playersEnMapa = players.filter(p => p.mapa === player.mapa)
  //   const clicksEnMapa = []//aca tengo que mandar mi click solamente o nada //snowballs.filter(c=>c.mapa === player.mapa)
  //  playersEnMapa= playersEnMapa.filter(p => p.id === player.id)
  //   io.to(player.id).emit("update", playersEnMapa, clicksEnMapa)
  // })

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



    inputsMap[socket.id] = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    //armado
    players.push({
      id: socket.id,
      hechizos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      mapa: 1,
      x: 800,
      y: 800,
      meditar: false,
      mirando: "down",
      quieto: true,
      skin: "link",
      clase: "player",
      w: adjust["link"].w,
      h: adjust["link"].h,
      quieto: true,
      mirando: "down",
      row: 0,
      col: 0,
      ultimoMensaje: "",
      nombre: "El Vittor",
      nivel: 1,
      energiaTotal: 50,
      saludTotal: 300,
      manaTotal: 200,
      hambreTotal: 100,
      sedTotal: 100,
      energia: 10,
      salud: 100,
      mana: 100,
      hambre: 20,
      sed: 15,
      reputacion: 1000,
      estado: "ciudadano",
      ciudad: "Nix",
      descripcion: "Morgolock, me duras un click",
      billetera: [0, 0, 0],
      inventario: [
        [35, 1],
        [1, 100],
        [37, 3],
        [32, 1],
        [38, 5],
        [39, 600],
        [33, 7],
        [32, 8],
        [31, 9],
        [30, 1],
        [29, 11],
        [28, 12],
        [0, 0],
        [34, 14],
        [13, 15],
        [14, 16],
        [15, 17],
        [47, 45],
        [47, 19],
        [46, 20],
        [48, 12],
        [46, 5],
        [48, 93],
        [23, 24],
        [6, 25]
      ],
      equipado: []
    });

    const player = players.find((player) => player.id === socket.id);
    // const otroPlayer = isCollidingWithPlayer(player)
    // if (otroPlayer) {
    //   //PISAR PERSONAJE Y DESCONECTARLO
    //   io.sockets.sockets.forEach((socket) => {
    //     if (socket.id === otroPlayer)
    //       socket.disconnect(true);
    //   });

    // }

    socket.join(player.mapa)
    socket.broadcast.to(player.mapa).emit("agregarPlayer", player)

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
      const playersOnlines = playersEnMapa.filter(p => p.clase === "player")
      const snowballsEnMapa = snowballs.filter(s => s.mapa === mapa)
      const data = {
        playersEnMapa,
        snowballsEnMapa,
        playersOnlines: playersOnlines.length
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

    socket.on("meditar", (callback) => {
      const player = players.find((player) => player.id === socket.id);
      if (player.mana < player.manaTotal) {
        player.mana += 25
        callback("Has recuperado 25 de mana")
        if (player.mana > player.manaTotal) {
          player.mana = player.manaTotal
        }
      }

    })
    socket.on("descansar", (cantidad, callback) => {
      const player = players.find((player) => player.id === socket.id);
      if (player.energia < player.energiaTotal) {
        player.energia += cantidad
        if (player.energia >= player.energiaTotal) {
          player.energia = player.energiaTotal
          callback("Dejas de descansar.", false)
        } else {

          callback("Te sientes menos cansado.", true)
        }
      }

    })

    socket.on("descontarMonedas", (monedas = [0, 0, 0]) => {
      const player = players.find((player) => player.id === socket.id);
      player.billetera[0] -= monedas[0]
      player.billetera[1] -= monedas[1]
      player.billetera[2] -= monedas[2]


    })


    socket.on("usar", (slot, callback) => {
      const player = players.find((player) => player.id === socket.id);
      if (!dbItems[player.inventario[slot][0]].equipable && dbItems[player.inventario[slot][0]].clase !== "creable" && dbItems[player.inventario[slot][0]].clase !== "refinable") {

        if (player.inventario[slot][1] > 0 && dbItems[player.inventario[slot][0]].usable) {

          player[dbItems[player.inventario[slot][0]].stat] += dbItems[player.inventario[slot][0]].modifica
          const total = dbItems[player.inventario[slot][0]].stat + "Total"
          console.log(total)
          if (player[dbItems[player.inventario[slot][0]].stat] > player[total]) {
            player[dbItems[player.inventario[slot][0]].stat] = player[total]
          }


          if (dbItems[player.inventario[slot][0]].clase === "moneda") {
            switch (dbItems[player.inventario[slot][0]].imagen) {
              case 46:
                player.billetera[0] += player.inventario[slot][1]
                break;
              case 47:
                player.billetera[1] += player.inventario[slot][1]
                break;
              case 48:
                player.billetera[2] += player.inventario[slot][1]
                break;

              default:
                break;
            }
            player.inventario[slot][1] = 0
          } else {

            player.inventario[slot][1] -= 1
          }
          if (player.inventario[slot][1] === 0) {
            player.inventario[slot][0] = 0
            player.inventario[slot][1] = 0
          }
          callback("", "", dbItems[player.inventario[slot][0]].clase)
        } else {

          callback("No puedes usar  " + dbItems[player.inventario[slot][0]].nombre)

        }
        if (player.inventario[slot][1] === 0) {
          player.inventario[slot][0] = 0
        }
      }
      if (dbItems[player.inventario[slot][0]].equipable) {

        if (player.equipado.includes(slot)) {
          callback("", dbItems[player.inventario[slot][0]].hechizo)
        } else {

          callback("Primero debes equiparlo.")
        }
      }

      if (dbItems[player.inventario[slot][0]].clase === "creable" || dbItems[player.inventario[slot][0]].clase === "refinable") {
        callback("", dbItems[player.inventario[slot][0]].hechizo)
      }
      // console.log(dbItems[player.inventario[slot][0]].usable, "usas el item: ", dbItems[player.inventario[slot][0]].nombre, " en el slot: ", slot, " Tiene aun: ", player.inventario[slot][1])

    })

    socket.on("borrar", (slot, callback) => {
      const player = players.find((player) => player.id === socket.id);
      const item = player.inventario[slot][0]
      const cantidad = player.inventario[slot][1]
      if (dbItems[item].consume <= cantidad) {
        player.inventario[slot][1] -= dbItems[item].consume
        if (player.inventario[slot][1] <= 0) {
          player.inventario[slot][0] = 0
          player.inventario[slot][1] = 0
        }
      } else {

        callback(false)
      }
      callback(true)
    })
    socket.on("borrarDelSuelo", (item) => {
      console.log("aca", item.id)
      players = players.filter(p => p.id !== item.id)

    })



    socket.on("equipar", (slot, callback) => {
      const player = players.find((player) => player.id === socket.id);
      if (dbItems[player.inventario[slot][0]].equipable) {

        if (!player.equipado.includes(slot)) {

          player.equipado = player.equipado.filter(s => dbItems[player.inventario[s][0]].clase !== dbItems[player.inventario[slot][0]].clase)
          player.equipado.push(slot)
          callback(true, true)
        } else {
          player.equipado = player.equipado.filter(item => item !== slot)
          callback(true, false)
        }
      } else {

        callback(false)
      }
    })

    socket.on("agarrar", (index,slot,id, callback) => {
      const player = players.find((player) => player.id === socket.id);
      io.to(player.mapa).emit("borrarItem", id)
      console.error({slotinv: player.inventario[index], slot })
      player.inventario[index]= slot 
      players= players.filter(p=>p.id !== id)
      callback(player.inventario[index])
    
    })

    socket.on("soltar", (slot, { x, y }, cantidad = 1, costo, colision, callback) => {
      const player = players.find((player) => player.id === socket.id);
      if (dbItems[player.inventario[slot][0]]) {
        if (player.equipado.includes(slot)) {
          player.equipado = player.equipado.filter(item => item !== slot)

        }
        const item = player.inventario[slot]
        player.inventario[slot][1] -= cantidad
        if (player.inventario[slot][1] === 0) {
          player.inventario[slot] = [0, 0]
        }

        let nuevoId = x.toString() + y.toString()

     
        const fisico = {
          objeto: [item[0], cantidad],
          mapa: 1,
          id: nuevoId,
          x: x,
          y: y,
          skin: "items",
          w: 32,
          h: 32,
          row: Math.floor(item[0] / 20),
          col: item[0] - (Math.floor(item[0] / 20) * 20) - 1,
          clase: dbItems[item[0]].clase,
          nombre: dbItems[item[0]].nombre,
          quieto: true,
          estado: "neutral",
          recurso: 0,
          requerido: dbItems[item[0]].requerido,
          "dueño": player.nombre,
          timeLeft: dbItems[item[0]].duracion ? dbItems[item[0]].duracion : 120, // 1 = 1 segundo
          costo: costo ? costo : "",
          sinColision: colision
          //  drop: item,
        }
      
        players.push(fisico)

        
        io.to(player.mapa).emit("agregarItem", fisico)
        const index = player.inventario.indexOf(player.inventario[slot])
        callback("tiro el objeto",player.inventario[slot],index)
      } else {
        callback("no hay nada que tirar")
      }
    })

    socket.on("beber", (cantidad) => {
      const player = players.find((player) => player.id === socket.id);
      if (player.sed < player.sedTotal) {
        player.sed += cantidad
      }
      if (player.sed > player.sedTotal) {
        player.sed = player.sedTotal
      }
    })
    socket.on("comer", (cantidad) => {
      const player = players.find((player) => player.id === socket.id);
      if (player.hambre < player.hambreTotal) {
        player.hambre += cantidad
      }
      if (player.hambre > player.hambreTotal) {
        player.hambre = player.hambreTotal
      }
    })
    socket.on("gastarSed", (cantidad) => {
      const player = players.find((player) => player.id === socket.id);
      if (player.sed > 0)
        player.sed -= cantidad
      if (player.sed < 0) {
        player.sed = 0
      }
    })
    socket.on("gastarHambre", (cantidad) => {
      const player = players.find((player) => player.id === socket.id);
      if (player.hambre > 0)
        player.hambre -= cantidad
      if (player.hambre < 0) {
        player.hambre = 0
      }
    })
    socket.on("gastarEnergia", (cantidad) => {
      const player = players.find((player) => player.id === socket.id);
      player.energia -= cantidad
    })
    socket.on("nombre", (nombre) => {
      const player = players.find((player) => player.id === socket.id);
      player.nombre = nombre
    })
    socket.on("desc", (desc) => {
      const player = players.find((player) => player.id === socket.id);
      player.descripcion = desc
    })

    socket.on("movimiento", (x, y, mirando, quieto) => {
      const player = players.find((player) => player.id === socket.id);
      if (Math.abs(player.x - x) <= SPEED && Math.abs(player.y - y) <= SPEED ) {
        player.x=x
        player.y=y
        player.mirando= mirando
        player.quieto= quieto
      } else{
        console.log( player.nombre,  "se mueve mas rapido que la velocidad")
      }
 

     
   
        io.to(player.mapa).emit("updatePlayer", player.id,player.x, player.y, player.quieto, player.mirando, player.col, player.row)
    

      

    });


    socket.on("cambiarMapa", (mapa, callback) => {
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
      callback(mapa, player.x, player.y)
    })


    socket.on("mute", (isMuted) => {
      const player = players.find((player) => player.id === socket.id);
      player.isMuted = isMuted;
    });
    socket.on("cambiarSkin", (nuevoSkin) => {
      const player = players.find((player) => player.id === socket.id);
      player.skin = nuevoSkin
    });

    socket.on("point", (pjID, obj) => {
      socket.to(pjID).emit("recibirMensaje", obj)
      console.log("llega este mensaje al sv: ", obj)
    });

    socket.on("disconnect", () => {
     const player = players.find((player) => player.id === socket.id);
      socket.broadcast.to(player.mapa).emit("quitarPlayer", player.id)
      socket.leave(player.mapa)
      players = players.filter((player) => player.id !== socket.id);
    });
  });

  app.use(express.static("public"));

  httpServer.listen(PORT, () => {
    console.log("Escuchando desde puerto:", PORT)
  });


  setInterval(() => {
    tick();
  }, 1000 / FPS);

  //OBJETOS CON DURACION

  setInterval(() => {
    const conTimer = players.filter(p => p.timeLeft)

    for (const player of conTimer) {
      player.timeLeft -= 1
      if (player.timeLeft < 1) {
        players = players.filter(p => p !== player)

      }
    }

  }, 1000);


}

main();
