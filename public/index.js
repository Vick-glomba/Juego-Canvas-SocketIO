
const resolucionX = 1025
const resolucionY = 550
let zoom = 1
let distanciaRender = 32
// document.body.style.width = window.innerWidth
// document.body.style.height= window.innerHeight

const nombre = "BetaTester"//prompt("elije tu nombre")
const mapImage = new Image();
mapImage.src = "mapas/dungeon-newbie.png";

const imagenes = {}

imagenes.link = new Image();
imagenes.link.src = "personajes/sprite.png"

imagenes.barca = new Image();
imagenes.barca.src = "personajes/barcanueva.png"



const speakerImage = new Image();
speakerImage.src = "personajes/speaker.png";


//AUDIOS

const walkSnow = new Audio("./audio/walk-snow.mp3");

const clcik1 = new Audio("./audio/click1.WAV");
const clcik2 = new Audio("./audio/click2.WAV");
//mis sonidos
const misPasos = new Audio("./audio/caminar.WAV");
misPasos.preload = "auto"

misPasos.playbackRate = 1
misPasos.volume = 0.1
const miAgua = new Audio("./audio/agua.wav");
miAgua.volume = 0.1
// onidos de otros personajes
const otrosPasos = new Audio("./audio/caminar.WAV");
otrosPasos.preload = "auto"

otrosPasos.playbackRate = 1
otrosPasos.volume = 0.1
const otrosAgua = new Audio("./audio/agua.wav");
otrosAgua.volume = 0.1
//agua.playbackRate = 0.5;

const HUD = document.getElementById("HUD");
const canvasEl = document.getElementById("canvas");
const principal = document.getElementById("principal");


//BOTONES
const btnOpciones = document.getElementById("btnOpciones")
const btnEstadisticas = document.getElementById("btnEstadisticas")
const btnClanes = document.getElementById("btnClanes")

const oro = document.getElementById("oro")
const plata = document.getElementById("plata")
const bronce = document.getElementById("bronce")

const btnHechizos = document.getElementById("btnHechizos")
const btnInventario = document.getElementById("btnInventario")
const flechaArriba = document.getElementById("flechaArriba")
const flechaAbajo = document.getElementById("flechaAbajo")
const lanzar = document.getElementById("lanzar")
const info = document.getElementById("info")

const cajaMensajes = document.getElementById("cajaMensajes")
const mensaje = document.getElementById("mensaje")
const online = document.getElementById("online")
//AJUSTE DE TAMAÑO PARA TENER COORDENADAS CORRECTAS

canvasEl.width = resolucionX * 0.75  // el primer valor son los pixeles del HUD cambiar si cambia la resolucion
canvasEl.height = resolucionY * 0.75

canvasEl.focus()


const canvas = canvasEl.getContext("2d");



const socket = io();

// const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const localTracks = {
  audioTrack: null,
};
let isPlaying = true;


// COLORES MENSAJES CONSOLA
const colorChat = "#c2bd58"
const colorCiuda = "#023bf7"
const colorCrimi = "#ea0c05"
const colorNeutral = "#bfc1c1"
const colorConsola = "#95b38b"


const remoteUsers = {};
window.remoteUsers = remoteUsers;

//Barras
const energia = document.getElementById("energia")
const mana = document.getElementById("mana")
const salud = document.getElementById("salud")
const hambre = document.getElementById("hambre")
const sed = document.getElementById("sed")


const boxHechizos = document.getElementById("boxHechizos")
const hechizos = document.getElementById("hechizos")
const inventario = document.getElementById("inventario")
const muteButton = document.getElementById("mute");
const uid = Math.floor(Math.random() * 1000000);

btnInventario.addEventListener("click", () => {
  inventario.style.visibility = "visible"
  hechizos.style.visibility = "hidden"
  hechizos.style.display = "none"
  inventario.style.display = "block"
})
btnHechizos.addEventListener("click", () => {
  inventario.style.display = "none"
  hechizos.style.display = "block"
  hechizos.style.visibility = "visible"
  inventario.style.visibility = "hidden"
  actualizarHechizos()

})



mensaje.addEventListener("click", () => {
  escribiendo = true
  console.log("toco el input", escribiendo)
})

btnOpciones.addEventListener("click", () => {
  console.log("opciones")
})
btnEstadisticas.addEventListener("click", () => {
  console.log("estadisticas")
})
btnClanes.addEventListener("click", () => {
  console.log("clanes")
})
oro.addEventListener("click", () => {
  console.log("oro")
})
plata.addEventListener("click", () => {
  console.log("plata")
})
bronce.addEventListener("click", () => {
  console.log("bronce")
})
btnHechizos.addEventListener("click", () => {
  console.log("btnHechizos")
})
btnInventario.addEventListener("click", () => {
  console.log("btnInventario")
})
flechaArriba.addEventListener("click", () => {
  console.log("flechaArriba")
})
flechaAbajo.addEventListener("click", () => {
  console.log("flechaAbajo")
})

boxHechizos.addEventListener("click", (e) => {
  if (e.target.id !== "boxHechizos") {

    hechizoSelect = Number(e.target.id)
    actualizarHechizos()
  }


})




HUD.addEventListener("click", (e) => {
  if (cast && e.target !== lanzar) {
    boxHechizos.style.cursor = "default"
    HUD.style.cursor = "default"
    cast = false
    accion = ""
    // console.log("saca lanzar")
  }
})

lanzar.addEventListener("click", () => {


  console.log("lanzo", myPlayer.mana, hechizoSelect, hechizosData[myPlayer["hechizos"][hechizoSelect]])
  const nombre = document.getElementById(hechizoSelect).innerText

  if (nombre !== hechizosData[0]["nombre"]) {
    if (myPlayer.mana >= hechizosData[myPlayer["hechizos"][hechizoSelect]]["mana necesario"]) {
      accion = acciones[0]
      hechizoTemp = hechizoSelect
      //  console.log("lanzar ", nombre)
      boxHechizos.style.cursor = "crosshair"
      HUD.style.cursor = "crosshair"
      cast = true
    } else {
      const msg = {
        msg: "No tienes suficiente mana.",
        tipo: "consola"
      }
      mensajesConsola.push(msg)
      actualizarMensajes()
    }
  } else {
    accion = ""
  }

})
info.addEventListener("click", () => {
  console.log("info")
})

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
let myPlayer
let cameraX = 0;
let cameraY = 0;

let hechizoSelect
let hechizoTemp


let escribiendo = false

let cast = false
let mensajesConsola = []
let mapaActual
let mundoMaps = [];

let groundMap = [[]];
let decalMap = [[]];
let db = []
let pj
let dataTile
let players = [];
// const hechizosData = ["--------------Vacio--------------" ,"Dardo magico", "Flecha Magica", "Curar Heridas Leves", "Inmovilizar", "Rayo Peronizador", "Misil Magico", "Tormenta Electrica","Talar"]
let hechizosData = []

const acciones = ["hechizo", "trabajo"]
let accion
let snowballs = [];
let ultimoFrame = 0
let personajes
let playersOnline
let TILES_IN_ROW_PJ
let TILES_IN_COL_PJ
let PJ_SIZE_W
let PJ_SIZE_H

const TILE_SIZE = 32;

const SNOWBALL_RADIUS = 4;

// setInterval(() => {
//   groundMap = []

//   const tileY = parseInt(myPlayer.y / TILE_SIZE)
//   const tileX = parseInt(myPlayer.x / TILE_SIZE)


//   for (let row = 0; row < MundoGround.length; row++) {
//     //console.log(tileX, tileY, MundoGround[row])
//     if (row === tileY){
//       console.log("si")
//       groundMap[row] = MundoGround[row]
//     } else{
//       groundMap[row] ={id: undefined}
//     }
//   }
// }, 5000);

const actualizarHechizos = (hechizo) => {
  if (hechizo) {
    console.log("carga un hechizo nuevo")
  } else {
    boxHechizos.innerHTML = ""
    let html = ""
    for (let i = 0; i < 20; i++) {
      const texto = myPlayer.hechizos[i] || hechizosData[myPlayer.hechizos[i]] ? hechizosData[myPlayer.hechizos[i]]["nombre"] : hechizosData[0]["nombre"]
      const id = i
      const color = hechizoSelect === id ? "#f9e79f50" : "#00000000"
      html += `
       <div id="${id}" style="border: 1px; border-style:solid;font-size:12px;padding-top:2px; border-color: aliceblue;color: #ffffff; width: 99%%;text-align: center; height: 20px; background-color:${color};">${texto}</div>
       `
    }

    boxHechizos.innerHTML = html
  }
}

socket.on("connect", () => {
  console.log("connected");
});

socket.emit("nombre", nombre)

socket.on("map", ({ mundo, player, db }) => {

  myPlayer = player
  mundoMaps = mundo
  groundMap = mundoMaps[myPlayer.mapa].ground2D;

  decalMap = mundoMaps[myPlayer.mapa].decal2D;



  hechizosData = db.hechizos

});



socket.on("pjs", (pjs) => {
  personajes = pjs

  // pj = personajes.find(pj => pj.skin === "barca")
});




// socket.on("players", (serverPlayers) => {
//   players = serverPlayers;
//   myPlayer = players.find((player) => player.id === socket.id);
//   players = players.filter((player) => player.id !== socket.id)
//   players.push(myPlayer)
//   if (myPlayer) {
//     cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
//     cameraY = parseInt(myPlayer.y - canvasEl.height / 2)
//   }

// });




// socket.on("snowballs", (serverSnowballs) => {
//   snowballs = serverSnowballs;
// });


socket.on("recibirMensaje", (obj) => {

  if (obj.tipo === "click" && obj.player.id === myPlayer.id) {

    if (obj.cast.cast) {
      let hechizo
      if (obj.cast.accion === "hechizo") {

        hechizo = hechizosData[myPlayer.hechizos[obj.cast.hechizoSelect]] ?? "no existe el hechizo en DB"
      }
      if (obj.cast.accion === "trabajo") {

        hechizo = hechizosData[obj.cast.hechizoSelect]["nombre"] ?? "no existe el hechizo en DB"
      }
      console.log("Es un cast ", obj)
    } else {
      console.log("No es ", obj.cast)
    }
    mensajesConsola.push(obj)
    actualizarMensajes()
  }
  if (obj.tipo === "chat") {
    mensajesConsola.push(obj)
    actualizarMensajes()
  }
})


const inputs = {
  up: false,
  down: false,
  left: false,
  right: false,
};



//CONSOLA MENSAJES
const actualizarMensajes = () => {

  cajaMensajes.innerHTML = ""
  let html = ""
  if (mensajesConsola.length > 15) mensajesConsola.shift()
  for (let i = 0; i < mensajesConsola.length; i++) {
    let msg

    if (mensajesConsola[i] && mensajesConsola[i].msg) {
      switch (mensajesConsola[i].tipo) {
        case "chat":
          msg = mensajesConsola[i].player.nombre ? mensajesConsola[i].player.nombre + ": " + mensajesConsola[i].msg : mensajesConsola[i].msg
          html += `
         <p style="color:${colorChat};margin:0px; padding:0px; margin-left: 15px; font-size:14px">${msg}</p>
         `
          break;
        case "click":
          const estado = mensajesConsola[i].player.estado === "criminal" || mensajesConsola[i].player.estado === "ciudadano" ? mensajesConsola[i].player.estado.toUpperCase() : "NEUTRAL"
          msg = `< ${mensajesConsola[i].msg.nombre} > ${mensajesConsola[i].player.descripcion} < ${estado} > < ${mensajesConsola[i].player.ciudad} >`
          const color = mensajesConsola[i].player.estado === "criminal" ? colorCrimi : mensajesConsola[i].player.estado === "ciudadano" ? colorCiuda : colorNeutral
          html += `
         <p style="color:${color};margin:0px; padding:0px; margin-left: 15px; font-size:13px">${msg}</p>
         `
          break;
        case "info":

          break;
        case "daño":
          msg = mensajesConsola[i].playerOrigen.id !== myPlayer.id ? mensajesConsola[i].playerOrigen.nombre + " " + mensajesConsola[i].msg : mensajesConsola[i].msg
          html += `
       <p style="color:${colorCrimi};margin:0px; padding:0px; margin-left: 15px; font-size:14px">${msg}</p>
       `
          break;
        case "consola":
          msg = mensajesConsola[i].msg
          html += `
       <p style="color:${colorConsola};margin:0px; padding:0px; margin-left: 15px; font-size:14px">${msg}</p>
       `
          break;
      }

    } else break;

  }

  cajaMensajes.innerHTML = html

  cajaMensajes.scrollTop = cajaMensajes.scrollHeight;

}

socket.on("privado", (mensaje) => {

  mensajesConsola.push(mensaje)
  actualizarMensajes()
})


window.addEventListener("keydown", (e) => {

  if (e.key === "Enter") {

    if (escribiendo) {
      const msg = {
        tipo: "chat",
        msg: mensaje.value
      }
      socket.emit("enviarMensaje", msg)
      //mensajesConsola.push(mensaje.value)
      mensaje.value = ""
      mensaje.blur()
      escribiendo = false
      actualizarMensajes()
      setTimeout(() => {
        if (myPlayer.ultimoMensaje === msg.msg) socket.emit("enviarMensaje", { tipo: "chat", msg: "" })
      }, 5000);

    } else {
      mensaje.focus()
      escribiendo = true
    }
  }

  if (!escribiendo) {


    switch (e.key) {
      case "u":
        accion = acciones[1]
        //console.log("lanzar ", hechizosData[8])
        boxHechizos.style.cursor = "crosshair"
        HUD.style.cursor = "crosshair"
        cast = true
        hechizoTemp = hechizoSelect
        hechizoSelect = 8
        actualizarHechizos()
        break
      case "+":
        zoom = zoom + 0.02
        document.body.style.zoom = zoom
        break
      case "-":
        zoom = zoom - 0.02
        document.body.style.zoom = zoom
        break
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
  }

  if (["a", "s", "w", "d"].includes(e.key)) {
    //inputs["quieto"] = false
    // inputs["ultimoFrame"] = ultimoFrame

    // inputs["w"] = adjust[pj.skin].w
    // inputs["h"] = adjust[pj.skin].h
    //walkSnow.play();
    // pasos.play();

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
    // inputs["quieto"] = true
    // inputs["w"] = adjust[pj.skin].w
    // inputs["h"] = adjust[pj.skin].h
    //  walkSnow.pause();
    //  walkSnow.currentTime = 0;
    // pasos.pause();
    //pasos.currentTime = 0;
  }

  socket.emit("inputs", inputs);
});

//EVENTO DE CLICK EN CANVAS
canvasEl.addEventListener("click", (e) => {

  const point = { x: myPlayer.x + e.clientX - canvasEl.width / 2 + window.scrollX, y: myPlayer.y + e.clientY - canvasEl.height + window.scrollY + myPlayer.h };
  point.cast = {
    cast,
    accion,
    hechizoSelect: hechizosData[myPlayer["hechizos"][hechizoSelect]]
  }
  boxHechizos.style.cursor = "default"
  HUD.style.cursor = "default"
  cast = false
  //accion = ""
  hechizoSelect = hechizoTemp
  actualizarHechizos()
  socket.emit("point", point);

});


// setInterval(() => {


//     socket.emit("enMapa", myPlayer.mapa, ({playersEnMapa, snowballsEnMapa}) =>{

//       players = playersEnMapa
//       myPlayer = players.find((player) => player.id === socket.id);
//       //  players = players.filter((player) => player.id !== socket.id)
//       //  players.push(myPlayer)
//       if (myPlayer) {
//         cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
//         cameraY = parseInt(myPlayer.y - canvasEl.height / 2)
//       }

//       snowballs = snowballsEnMapa

//     })


// }, 40);


function loop() {


  canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);
  if (myPlayer) {

    energia.style.width = `${(myPlayer.energia / myPlayer.energiaTotal) * 100}%`
    mana.style.width = `${(myPlayer.mana / myPlayer.manaTotal) * 100}%`
    salud.style.width = `${(myPlayer.salud / myPlayer.saludTotal) * 100}%`
    hambre.style.width = `${(myPlayer.hambre / myPlayer.hambreTotal) * 100}%`
    sed.style.width = `${(myPlayer.sed / myPlayer.sedTotal) * 100}%`



    const TILES_IN_ROW = 20;

    // ground
    for (let row = 0; row < groundMap.length; row++) {
      for (let col = 0; col < groundMap[0].length; col++) {
        let { id } = groundMap[row][col] ?? { id: undefined };
        const imageRow = parseInt(id / TILES_IN_ROW);
        const imageCol = id % TILES_IN_ROW;
        const decalX = col * TILE_SIZE// - cameraX
        const decalY = row * TILE_SIZE //- cameraY
        const distance = Math.sqrt((decalX - myPlayer.x) ** 2 + (decalY - myPlayer.y) ** 2);
        const ratio = 1.0 - Math.min(distance / 700, 1);

        const proximidad = Math.floor(ratio * 100)

        if (proximidad > distanciaRender) {



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
    }

    // decals
    for (let row = 0; row < decalMap.length; row++) {
      for (let col = 0; col < decalMap[0].length; col++) {
        let { id } = decalMap[row][col] ?? { id: undefined };
        const imageRow = parseInt(id / TILES_IN_ROW);
        const imageCol = id % TILES_IN_ROW;

        const decalX = col * TILE_SIZE// - cameraX
        const decalY = row * TILE_SIZE //- cameraY
        const distance = Math.sqrt((decalX - myPlayer.x) ** 2 + (decalY - myPlayer.y) ** 2);
        const ratio = 1.0 - Math.min(distance / 700, 1);

        const proximidad = Math.floor(ratio * 100)

        if (proximidad > distanciaRender) {

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
    }
    //Personaje
    for (const player of players) {

      const pjrender = personajes.find(pj => pj.skin === player.skin)

      // id: socket.id,
      // hechizos: [0, 6, 2, 0, 4, 5, 0, 3],
      // x: 800,
      // y: 800,
      // mirando: "down",
      // quieto: true,
      // skin: "link",
      // w: 0,
      // h: 0,
      // quieto: true,
      // mirando: "down",
      // row: 0,
      // col: 0,
      // ultimoMensaje: "",
      // nombre: "El Vittor",
      // nivel: 1,
      // energiaTotal:400,
      // saludTotal: 300,
      // manaTotal:200,
      // hambreTotal:100,
      // sedTotal:100,
      // energia:300,
      // salud: 100,
      // mana:100,
      // hambre:20,
      // sed:15,
      // reputacion: 1000,
      // estado: "ciudadano",
      // ciudad: "Nix",
      // descripcion: "Morgolock, me duras un click"





      const distance = Math.sqrt((player.x - myPlayer.x) ** 2 + (player.y - myPlayer.y) ** 2);
      const ratio = 1.0 - Math.min(distance / 700, 1);

      const proximidad = Math.floor(ratio * 100)

      if (proximidad > 50) {
        if (player === myPlayer) {
          if (!player.quieto) player.skin === "barca" ? miAgua.play() : !otrosPasos.isPlaying ? misPasos.play() : misPasos.currentTime = 0
        } else {
          if (!player.quieto) player.skin === "barca" ? otrosAgua.play() : !misPasos.isPlaying ? otrosPasos.play() : otrosPasos.currentTime = 0
        }


        // player.skin === "barca" ? !player.quieto ? agua.play() : agua.pause() : !player.quieto ? pasos.play() : pasos.pause()


        if (proximidad > distanciaRender) {

          TILES_IN_ROW_PJ = pjrender.info.rows
          TILES_IN_COL_PJ = pjrender.info.cols
          PJ_SIZE_W = pjrender.info.tileWidth
          PJ_SIZE_H = pjrender.info.tileHeight
          let { id } = pjrender.pj2D[player.row][player.col] ?? { id: 0 };
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




          //NOMBRE PERSONAJE
          //canvas.drawImage(santaImage, player.x - cameraX, player.y - cameraY);
          const color = player.estado === "criminal" ? colorCrimi : player.estado === "ciudadano" ? colorCiuda : colorNeutral
          canvas.fillStyle = 'black'
          canvas.fillStyle = color;
          canvas.font = "bold 12px";
          canvas.textAlign = "center"
          canvas.fillText(player.nombre, player.x - cameraX, (player.y - cameraY - player.h / 2) + player.h + 15)

        }

        //dibujar Click
        //console.log(clickPoint)
        // canvas.strokeStyle = "rgb(0,255,0)";
        // canvas.beginPath();
        // canvas.arc(clickPoint[0], clickPoint[1], 2, 0, 100, false);
        // canvas.stroke();


      }
      //ULTIMO MENSAJE PERSONAJE
      canvas.fillStyle = 'black'
      canvas.fillStyle = "#f0f3f4";
      canvas.font = "bold 12px arial";
      canvas.textAlign = "center"
      canvas.fillText(player.ultimoMensaje, player.x - cameraX, (player.y - cameraY - player.h / 2) + player.h - PJ_SIZE_H / 2.5)

      // PLAYERS ONLINE  
      // mapaActual = ((parseInt(parseInt(myPlayer.y / TILE_SIZE) / 48) * 10) + ((parseInt(parseInt(myPlayer.x / TILE_SIZE) / 48)) + 1))
      const onlines = `Mapa: ${myPlayer.mapa} - x:  ${myPlayer.x} -  y:  ${myPlayer.y}  -  Online: ${playersOnline} `
      online.innerText = onlines
      const anchoMundo = 20
      if (myPlayer) {

        let nuevoMapa
        if (myPlayer.y < 10) {
          nuevoMapa = (myPlayer.mapa - anchoMundo)
          //myPlayer.mapa = nuevoMapa
          socket.emit("cambiarMapa", nuevoMapa)
          console.log("cambio a mapa: ", nuevoMapa)

        }
        if (myPlayer.y > 1500) {
          nuevoMapa = (myPlayer.mapa + anchoMundo)
        //  myPlayer.mapa = nuevoMapa
          socket.emit("cambiarMapa", nuevoMapa)
          console.log("cambio a mapa: ", nuevoMapa)

        }
        if (myPlayer.x < 10) {
          nuevoMapa = (myPlayer.mapa - 1)
       //   myPlayer.mapa = nuevoMapa
          socket.emit("cambiarMapa", nuevoMapa)
          console.log("cambio a mapa: ", nuevoMapa)

        }
        if (myPlayer.x > 1500) {
          nuevoMapa = (myPlayer.mapa + 1)
       //   myPlayer.mapa = nuevoMapa
          socket.emit("cambiarMapa", nuevoMapa)
          console.log("cambio a mapa: ", nuevoMapa)

        }


      }



      if (!player.isMuted) {
        //   canvas.drawImage(
        //     speakerImage,
        //     player.x - cameraX + 5,
        //     player.y - cameraY - 28
        //   );
      }


      if (player !== myPlayer) {
        if (remoteUsers[player.voiceId] && remoteUsers[player.voiceId].audioTrack) {
          const distance = Math.sqrt((player.x - myPlayer.x) ** 2 + (player.y - myPlayer.y) ** 2);
          const ratio = 1.0 - Math.min(distance / 700, 1);
          remoteUsers[player.voiceId].audioTrack.setVolume(Math.floor(ratio * 100));
        }
      }
    }

    for (const snowball of snowballs) {
      canvas.fillStyle = "#d1d107";
      canvas.beginPath();
      canvas.arc(
        snowball.x - cameraX,
        snowball.y - cameraY + 10,
        SNOWBALL_RADIUS,
        0,
        2 * Math.PI
      );
      canvas.fill();
    }
  }
  socket.emit("myPlayer", player => {
    myPlayer = player
    socket.emit("enMapa", myPlayer.mapa, ({ playersEnMapa, snowballsEnMapa, playersOnlines }) => {
      
      players = playersEnMapa
      myPlayer = players.find((player) => player.id === socket.id);
      players = players.filter((player) => player.id !== socket.id)
      players.push(myPlayer)
      if (mundoMaps[myPlayer.mapa]) {
        groundMap = mundoMaps[myPlayer.mapa].ground2D;
        decalMap = mundoMaps[myPlayer.mapa].decal2D;
      }
      
      if (myPlayer) {
        cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
        cameraY = parseInt(myPlayer.y - canvasEl.height / 2)
      }
      playersOnline = playersOnlines
      snowballs = snowballsEnMapa
      
    })
  })
    
}
setInterval(() => {

  loop();

}, 30);
