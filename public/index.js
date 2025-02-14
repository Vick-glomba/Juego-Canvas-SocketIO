
const resolucionX = 1025
const resolucionY = 550
let zoom = 1
let distanciaRender = 22
const FPS = 20
const MOV = 20
const pixels = 5
// document.body.style.width = window.innerWidth
// document.body.style.height= window.innerHeight


const mapImage = new Image();
mapImage.src = "mapas/dungeon-newbie.png";

const imagenes = {}

imagenes.items = new Image();
imagenes.items.src = "personajes/items.png"

imagenes.link = new Image();
imagenes.link.src = "personajes/sprite.png"

imagenes.barca = new Image();
imagenes.barca.src = "personajes/barcanueva.png"

imagenes.arboles = new Image();
imagenes.arboles.src = "personajes/arboles.png"


const speakerImage = new Image();
speakerImage.src = "personajes/speaker.png";



//AUDIOS
let meditar = false
const walkSnow = new Audio("./audio/walk-snow.mp3");

const clcik1 = new Audio("./audio/click1.WAV");
const clcik2 = new Audio("./audio/click2.WAV");
//mis sonidos
const equipar = new Audio("./audio/equipar.WAV");
equipar.volume = 0.1
const talar = new Audio("./audio/talar.WAV");
talar.volume = 0.1
const minar = new Audio("./audio/minar.WAV");
minar.volume = 0.1
const pescar = new Audio("./audio/pescar.WAV");
pescar.volume = 0.1
const tomar = new Audio("./audio/tomar.wav");
tomar.volume = 0.1
const comer = new Audio("./audio/comer.WAV");
comer.volume = 0.1


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
const tirar = document.getElementById("tirar")
const cuantoTirar = document.getElementById("cuantoTirar")
const aceptarTirar = document.getElementById("aceptarTirar")
const tirarTodo = document.getElementById("tirarTodo")

const listaCraftNecesita = document.getElementById("listaCraftNecesita")
const listaCraftItem = document.getElementById("listaCraftItem")
const craft = document.getElementById("craft")
const cantidadCraft = document.getElementById("cantidadCraft")
let costoElegido = [0, 0, 0]
let point

const actualizarCraftItem = () => {
  let html = ""
  for (let i = 0; i < 10; i++) {
    html += `
    <div style="font-size: 20px; text-align: center; border: 1px, solid;border-color: black ; height: 100%; height: 25px;">Objeto de prueba</div>`
  }

  listaCraftItem.innerHTML = html
}

const actualizarCraftNecesita = () => {
  let html = ""
  for (let i = 0; i < 10; i++) {
    html += `
    <div style="font-size: 20px; text-align: center; border: 1px, solid;border-color: black ; height: 100%; height: 25px;">${i + 1} Objeto de prueba</div>`
  }

  listaCraftNecesita.innerHTML = html
}


function numeroRandom(min, max) {
  return parseInt(Math.random() * (max - 1 - min) + min);
}


const soltarCreable = () => {
  const slot = Number(itemSelect.split("slot")[1])
  // socket.emit("gastarEnergia", 15)
  const coord = {
    x: point.x,
    y: point.y,
  }
  const costo = costoElegido
  socket.emit("soltar", slot, coord, 1, costo, false, (mensaje) => {
    const msg = {
      msg: mensaje,
      tipo: "consola"
    }
    mensajesConsola.push(msg)
    actualizarMensajes()
    setTimeout(() => {

      actualizarInventario()
    }, 200);

    console.log("esta pasando")

  })
  accion = ""
  descansar = false
}



function tirarObjeto() {

  let cantidadTirar = Number(cuantoTirar.value)
  const slot = Number(itemSelect.split("slot")[1])
  const cantidadTiene = myPlayer.inventario[slot][1]
  if (cantidadTirar > cantidadTiene) {
    console.log("cambia la cantidad")
    cantidadTirar = cantidadTiene
  }
  if (cantidadTirar > 0) {

    const coord = {
      x: myPlayer.x,
      y: myPlayer.y,
    }
    const costo = [0, 0, 0]
    socket.emit("soltar", slot, coord, cantidadTirar, costo, true, (mensaje, slotReturn, index) => {
      const msg = {
        msg: mensaje,
        tipo: "consola"
      }
      mensajesConsola.push(msg)
      actualizarMensajes()
      console.log(myPlayer.inventario[slot], slotReturn, cantidadTirar)

      myPlayer.inventario[index] = slotReturn
      console.log(myPlayer.inventario[slot])
      actualizarInventario()


    })
  }
  tirar.style.visibility = "hidden"
  menuAbierto = false
}



//BOTONES
const btnOpciones = document.getElementById("btnOpciones")
const btnEstadisticas = document.getElementById("btnEstadisticas")
const btnClanes = document.getElementById("btnClanes")

const oro = document.getElementById("oro")
const plata = document.getElementById("plata")
const cobre = document.getElementById("cobre")

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
const cantidadOro = document.getElementById("cantidadOro")
const cantidadPlata = document.getElementById("cantidadPlata")
const cantidadCobre = document.getElementById("cantidadCobre")
const colocarPrecio = document.getElementById("colocarPrecio")
const aceptarColocarPrecio = document.getElementById("aceptarColocarPrecio")

const cajaInventario = document.getElementById("cajaInventario")
let itemSelect




let menuAbierto = false


const boxHechizos = document.getElementById("boxHechizos")
const hechizos = document.getElementById("hechizos")
const inventario = document.getElementById("inventario")
const muteButton = document.getElementById("mute");
const uid = Math.floor(Math.random() * 1000000);

const colocarPrecioOro = document.getElementById("colocarPrecioOro")
const colocarPrecioPlata = document.getElementById("colocarPrecioPlata")
const colocarPrecioCobre = document.getElementById("colocarPrecioCobre")

aceptarColocarPrecio.addEventListener("click", () => {

  costoElegido = [Number(colocarPrecioOro.value), Number(colocarPrecioPlata.value), Number(colocarPrecioCobre.value)]
  colocarPrecio.style.visibility = "hidden"
  soltarCreable()
  colocarPrecioOro.value = "0"
  colocarPrecioPlata.value = "0"
  colocarPrecioCobre.value = "0"
})




colocarPrecioPlata.addEventListener("keydown", (e) => {
  e.preventDefault()
  if (Number(e.key) || e.key === "Backspace") {
    if (e.key !== "e" && e.key !== "Backspace") {
      if (colocarPrecioPlata.value === "0") {
        colocarPrecioPlata.value = e.key
      } else {

        colocarPrecioPlata.value += e.key
      }
    }
  }
  if (colocarPrecioPlata.value.length >= 1 && colocarPrecioPlata.value !== "0" && (e.key === "0" || e.key === 0)) {
    colocarPrecioPlata.value += e.key
  }
  if (e.key === "Backspace" || colocarPrecioPlata.value.length > 4) {
    colocarPrecioPlata.value = colocarPrecioPlata.value.substring(0, colocarPrecioPlata.value.length - 1)
  }
  if (colocarPrecioPlata.value === "" || colocarPrecioPlata.value.length === 0) {
    colocarPrecioPlata.value = "0"
  }
})


colocarPrecioCobre.addEventListener("keydown", (e) => {
  e.preventDefault()
  if (Number(e.key) || e.key === "Backspace") {
    if (e.key !== "e" && e.key !== "Backspace") {
      if (colocarPrecioCobre.value === "0") {
        colocarPrecioCobre.value = e.key
      } else {

        colocarPrecioCobre.value += e.key
      }
    }
  }
  if (colocarPrecioCobre.value.length >= 1 && colocarPrecioCobre.value !== "0" && (e.key === "0" || e.key === 0)) {
    colocarPrecioCobre.value += e.key
  }
  if (e.key === "Backspace" || colocarPrecioCobre.value.length > 4) {
    colocarPrecioCobre.value = colocarPrecioCobre.value.substring(0, colocarPrecioCobre.value.length - 1)
  }
  if (colocarPrecioCobre.value === "" || colocarPrecioCobre.value.length === 0) {
    colocarPrecioCobre.value = "0"
  }
})


colocarPrecioOro.addEventListener("keydown", (e) => {
  e.preventDefault()
  if (Number(e.key) || e.key === "Backspace") {
    if (e.key !== "e" && e.key !== "Backspace") {
      if (colocarPrecioOro.value === "0") {
        colocarPrecioOro.value = e.key
      } else {

        colocarPrecioOro.value += e.key
      }
    }
  }
  if (colocarPrecioOro.value.length >= 1 && colocarPrecioOro.value !== "0" && (e.key === "0" || e.key === 0)) {
    colocarPrecioOro.value += e.key
  }
  if (e.key === "Backspace" || colocarPrecioOro.value.length > 4) {
    colocarPrecioOro.value = colocarPrecioOro.value.substring(0, colocarPrecioOro.value.length - 1)
  }
  if (colocarPrecioOro.value === "" || colocarPrecioOro.value.length === 0) {
    colocarPrecioOro.value = "0"
  }
})

cuantoTirar.addEventListener("keydown", (e) => {
  e.preventDefault()
  if (Number(e.key) || e.key === "Backspace") {
    if (e.key !== "e" && e.key !== "Backspace") {
      if (cuantoTirar.value === "0") {
        cuantoTirar.value = e.key
      } else {

        cuantoTirar.value += e.key
      }
    }
    if (e.key === "Backspace" || cuantoTirar.value.length > 4) {
      cuantoTirar.value = cuantoTirar.value.substring(0, cuantoTirar.value.length - 1)
    }
    if (cuantoTirar.value === "" || cuantoTirar.value.length === 0) {
      cuantoTirar.value = "0"
    }
  }
})
cantidadCraft.addEventListener("keydown", (e) => {
  e.preventDefault()
  if (Number(e.key) || e.key === "Backspace") {
    if (e.key !== "e" && e.key !== "Backspace") {
      if (cantidadCraft.value === "0") {
        cantidadCraft.value = e.key
      } else {

        cantidadCraft.value += e.key
      }
    }
    if (e.key === "Backspace" || cantidadCraft.value.length > 4) {
      cantidadCraft.value = cantidadCraft.value.substring(0, cantidadCraft.value.length - 1)
    }
    if (cantidadCraft.value === "" || cantidadCraft.value.length === 0) {
      cantidadCraft.value = "0"
    }
  }
})

aceptarTirar.addEventListener("click", () => {
  tirarObjeto()
  document.querySelector('#tirar').style.visibility = 'hidden'
  menuAbierto = false
})
tirarTodo.addEventListener("click", () => {
  const slot = Number(itemSelect.split("slot")[1])
  cuantoTirar.value = myPlayer.inventario[slot][1]


})

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
let selecciono = false
cajaInventario.addEventListener("click", (e) => {
  cajaInventario.blur()
  e.target.blur()
  if (e.target.id !== "cajaInventario" && !menuAbierto) {

    cajaInventario.blur()
    e.target.blur()
    if (itemSelect === e.target.id && selecciono) {
      //console.log("dobleclick")
      const slot = Number(itemSelect.split("slot")[1])
      const item = myPlayer.inventario[slot][0]


      if (item && dbItems[item].nombre) {



        socket.emit("usar", slot, (objeto, hechizo, clase) => {
          switch (clase) {
            case "bebida":
              tomar.play()
              break;
            case "comida":
              comer.play()
              break;
            case "pocion":
              tomar.play()
              break;
            default:
              break;
          }
          if (!hechizo) {
            const msg = {
              msg: ` ${objeto}`,
              tipo: "consola"
            }
            mensajesConsola.push(msg)
            actualizarMensajes()
          } else {
            if (myPlayer.energia > 3) {
              switch (dbItems[item].clase) {
                case "herramienta":
                  accion = acciones[1]
                  break;
                case "creable":
                  accion = acciones[2]
                  break;
                case "refinable":
                  accion = acciones[1]
                  break;
                default:
                  accion = acciones[0]
                  break;
              }

              boxHechizos.style.cursor = "crosshair"
              HUD.style.cursor = "crosshair"
              cast = true
              hechizoTemp = hechizoSelect
              hechizoSelect = dbItems[item].hechizo - 1
              setTimeout(() => {

                actualizarHechizos()
              }, 200);
            } else {
              const msg = {
                tipo: "consola",
                msg: `No tienes suficiente energia`
              }
              mensajesConsola.push(msg)
              actualizarMensajes()
            }

            console.log("lanza el hechizo: ", hechizo)
          }
        })

      }
    }
    itemSelect = e.target.id
    cajaInventario.blur()
    e.target.blur()
    selecciono = true
    actualizarInventario()


    setTimeout(() => {
      cajaInventario.blur()
      e.target.blur()
      selecciono = 0
      actualizarInventario()
    }, 300);
    cajaInventario.blur()
  }
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
cobre.addEventListener("click", () => {
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

  cast = false
  const nombre = document.getElementById(hechizoSelect) ? document.getElementById(hechizoSelect).innerText : hechizosData[0]["nombre"]

  if (nombre !== hechizosData[0]["nombre"]) {
    if (myPlayer.energia > 0) {

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
      const msg = {
        msg: "No tienes suficiente energia.",
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
let mundoDibujables = []
mundoDibujables[1] = [
  {
    mapa: 1,
    id: 1,
    x: 845,
    y: 1080,
    skin: "arboles",
    w: 256,
    h: 320,
    row: 0,
    col: 0,
    clase: "arbol",
    nombre: "Yacimiento de Cobre",
    quieto: true,
    estado: "criminal",
    recurso: 37,
    requerido: "minar"
  },
  {
    mapa: 1,
    id: 1,
    x: 1015,
    y: 1080,
    skin: "arboles",
    w: 256,
    h: 320,
    row: 0,
    col: 1,
    clase: "arbol",
    nombre: "cipress",
    quieto: true,
    estado: "criminal",
    recurso: 29,
    requerido: "talar"
  },
  {
    mapa: 1,
    id: 1,
    x: 1215,
    y: 1180,
    skin: "arboles",
    w: 256,
    h: 320,
    row: 0,
    col: 2,
    clase: "arbol",
    nombre: "sauce",
    quieto: true,
    estado: "criminal",
    recurso: 38,
    requerido: "talar"
  },
  {
    mapa: 1,
    id: 1,
    x: 615,
    y: 1180,
    skin: "arboles",
    w: 256,
    h: 320,
    row: 1,
    col: 3,
    clase: "arbol",
    nombre: "sauce naranja",
    quieto: true,
    estado: "criminal",
    recurso: 39,
    requerido: "talar"
  },
]


let dbItems = []
let groundMap = [[]];
let decalMap = [[]];
let db = []
let pj
let dataTile
let players = [];
let itemsEnMapa = [];
// const hechizosData = ["--------------Vacio--------------" ,"Dardo magico", "Flecha Magica", "Curar Heridas Leves", "Inmovilizar", "Rayo Peronizador", "Misil Magico", "Tormenta Electrica","Talar"]
let hechizosData = []

const acciones = ["hechizo", "trabajo", "crear"]
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

const actualizarInventario = async () => {
  if (myPlayer) {
    let contador = 0
    let html = ""
    for (let i = 0; i < 5; i++) {
      html += `<div style="display: flex; width: 220px; height: 46px; color: aliceblue;">`
      for (let a = 0; a < 5; a++) {
        let imagen
        let cantidad = ""
        let borde
        let equipado = ""
        if (myPlayer.inventario[contador][1]) {
          if (myPlayer.equipado.includes(contador)) {

            equipado = `<p style="margin:0;margin-top:10px;margin-left:30px;color:yellow;font-weight: 900;">+</p>`
          }
          cantidad = myPlayer.inventario[contador][1]
          const item = myPlayer.inventario[contador][0]
          const url = "./items/" + dbItems[item].imagen + ".bmp"
          imagen = `background-image: url(${url});`
          if (itemSelect === "slot" + contador) {
            borde = "border-color: rgb(253, 232, 0);"
          } else {
            borde = "border-color: black;"
          }
        }
        html += `
           <div id="${"slot" + contador}" style="width: 42px; height: 44px; color: aliceblue;border: 1px; ${borde}border-style: solid; ${imagen} background-size:100% 100%;')">${cantidad}${equipado}</div>`
        contador += 1
        if (a === 4) {
          html += `
             </div>`
        }
      }
    }
    cajaInventario.innerHTML = html
  }

}



const actualizarHechizos = (hechizo) => {
  if (hechizo) {
    console.log("carga un hechizo nuevo")
  } else {
    boxHechizos.innerHTML = ""
    let html = ""
    for (let i = 9; i < 30; i++) {


      const texto = myPlayer.hechizos[i] && hechizosData[myPlayer.hechizos[i]] ? hechizosData[myPlayer.hechizos[i]]["nombre"] : hechizosData[0]["nombre"]
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
socket.on("disconnect", () => {
  window.location = "error.html"
})

socket.on("agregarPlayer", (player) => {
  players.push(player)
})

socket.on("agregarItem", (player) => {
  itemsEnMapa.push(player)
  players.push(player)
})
socket.on("quitarPlayer", (id) => {
  players = players.filter(p => p.id !== id)
})

socket.on("updatePlayer", (id, x, y, quieto, mirando, col, row) => {
  const player = players.find(p => p.id === id)
  if (player) {

    if (myPlayer.id !== id) {
      player.x = x
      player.y = y
      player.quieto = quieto
      player.mirando = mirando
      player.col = col
      player.row = row
    } else {
      
        myPlayer.col = col
        myPlayer.row = row
     
    }
  }

})

socket.on("map", ({ mundo, player, db }) => {
  myPlayer = player

  socket.emit("enMapa", player.mapa, ({ playersEnMapa, snowballsEnMapa, playersOnlines }) => {

    players = playersEnMapa
    players = players.filter(p => p.id !== socket.id)
    players.push(myPlayer)
    itemsEnMapa = players.filter(p => p.skin === "items")
    players = players.concat(mundoDibujables[myPlayer.mapa])
    playersOnline = playersOnlines
    while (isCollidingWithPlayer(myPlayer) || isCollidingWithMap(myPlayer)) {
      myPlayer.x += pixels
      socket.emit("movimiento", myPlayer.x, myPlayer.y);
    }
  })


  mundoMaps = mundo
  groundMap = mundoMaps[myPlayer.mapa].ground2D;

  decalMap = mundoMaps[myPlayer.mapa].decal2D;

  dbItems = db.items
  hechizosData = db.hechizos
  actualizarInventario()

});




socket.on("pjs", (pjs) => {
  personajes = pjs
});

socket.on("recibirMensaje", (obj) => {

  if (obj.tipo === "click" && obj.player.id === myPlayer.id) {

    if (obj.cast.cast) {
      let hechizo
      if (obj.cast.accion === "hechizo") {

        hechizo = hechizosData[myPlayer.hechizos[obj.cast.hechizoSelect]] ?? "no existe el hechizo en DB"
      }
      if (obj.cast.accion === "trabajo") {
        const msg = {
          tipo: "consola",
          msg: `No puedes ${obj.cast.hechizoSelect.nombre} a ${obj.msg.nombre}`
        }
        mensajesConsola.push(msg)
        actualizarMensajes()
      }
      console.log("Es un cast ", obj)
    } else {
      console.log("No es ", obj.cast)
    }
  }
  // if (obj.tipo === "chat") {
  //   mensajesConsola.push(obj)
  //   actualizarMensajes()
  // }
  if (obj.tipo === "consola") {
    if (obj.cast.cast) {

      if (obj.cast.accion === "trabajo") {

        if (obj.objetivo.requerido === obj.cast.hechizoSelect.nombre) {

          const cantidad = numeroRandom(0, obj.cast.hechizoSelect.cantidad)
          let item = [obj.objetivo.recurso, cantidad]
          const slot = Number(itemSelect.split("slot")[1])
          let necesita = dbItems[myPlayer.inventario[slot][0]].consume
          let objetoNecesita = myPlayer.inventario[slot][0]
          let tiene = myPlayer.inventario[slot][1]
          let nombre = dbItems[obj.objetivo.recurso].nombre
          let borro = false
          let tieneLugar = myPlayer.inventario.find(slot => slot[0] === 0 && slot[1] === 0 || slot[0] === objetoNecesita)
          let tieneSaldo = false
          const usosPagos = ["refinar", "forjar"]

          if (usosPagos.includes(obj.objetivo.requerido)) {

            if (myPlayer.billetera[0] >= obj.objetivo.costo[0] && myPlayer.billetera[1] >= obj.objetivo.costo[1] && myPlayer.billetera[2] >= obj.objetivo.costo[2]) {
              tieneSaldo = true
            }
          }

          if (obj.objetivo.recurso === 0 && usosPagos.includes(obj.objetivo.requerido) && tieneLugar && tieneSaldo) {
            if (tiene >= necesita) {

              const objeto = dbItems[myPlayer.inventario[slot][0]].drop
              nombre = dbItems[objeto].nombre || "no encuentra el nombre"
              item = [objeto, cantidad]
              socket.emit("borrar", slot, (bool) => {
                if (bool) {
                  borro = true
                } else {
                  borro = false
                }
              })
            }
          }
          if (tiene < necesita) {
            const msg = {
              tipo: "consola",
              msg: `No tienes suficiente cantidad.`
            }
            mensajesConsola.push(msg)
            actualizarMensajes()
          }

          // console.log("se cumple ", usosPagos.includes(obj.objetivo.requerido))
          if (usosPagos.includes(obj.objetivo.requerido) && tieneSaldo === false) {
            const msg = {
              tipo: "consola",
              msg: `No tienes suficiente dinero para usarlo.`
            }
            mensajesConsola.push(msg)
            actualizarMensajes()
          }
          const abrenMenu = ["forjar", "aserrar"]
          if (abrenMenu.includes(obj.objetivo.requerido) && tieneSaldo === true) {
            const msg = {
              tipo: "consola",
              msg: `Aca tengo que abrir el menu.`
            }
            socket.emit("descontarMonedas", obj.objetivo.costo)
            mensajesConsola.push(msg)
            actualizarMensajes()
            craft.style.visibility = "visible"
            actualizarCraftItem()
            actualizarCraftNecesita()
          }

          console.log("tiene saldo: ", tieneSaldo)
          if (!usosPagos.includes(obj.objetivo.requerido) || (usosPagos.includes(obj.objetivo.requerido) && tiene >= necesita && tieneSaldo)) {
            console.log(obj.objetivo.costo)
            socket.emit("agarrar", item, (mensaje, bool) => {
              if (bool) {
                let msg
                if (cantidad > 0) {
                  msg = {
                    tipo: "consola",
                    msg: `Has conseguido ${cantidad} de ${nombre}.`
                  }
                  //reproducir sonido exito segun profesion
                  switch (obj.objetivo.requerido) {
                    case "talar":
                      talar.play()
                      break;
                    case "minar":
                      minar.play()
                      break;
                    case "pescar":
                      pescar.play()
                      break;

                    default:
                      break;
                  }
                } else {
                  if (obj.objetivo.requerido === "forjar") {
                    msg = {
                      tipo: "consola",
                      msg: `Abrir el menu de Herreria`
                    }
                  } else {

                    msg = {
                      tipo: "consola",
                      msg: obj.objetivo.requerido === "refinar" ? "Fallo." : `Has errado el golpe.`
                    }
                  }

                }
                mensajesConsola.push(msg)
                actualizarMensajes()
              } else {
                tieneLugar = false
              }
              if (!tieneLugar) {

                const msg = {
                  tipo: "consola",
                  msg: mensaje
                }
                mensajesConsola.push(msg)
                actualizarMensajes()
              }

              setTimeout(() => {

                actualizarInventario()
              }, 300);
            })
          }

        } else {
          const msg = {
            tipo: "consola",
            msg: `No puedes ${obj.cast.hechizoSelect.nombre}  ${obj.objetivo.nombre}.`
          }
          mensajesConsola.push(msg)
          actualizarMensajes()
        }
      }
    }
  }
  mensajesConsola.push(obj)
  actualizarMensajes()
}
)


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
          const estado = mensajesConsola[i].msg.estado === "criminal" || mensajesConsola[i].msg.estado === "ciudadano" ? mensajesConsola[i].msg.estado.toUpperCase() : "NEUTRAL"
          msg = `< ${mensajesConsola[i].msg.nombre} > ${mensajesConsola[i].msg.descripcion || ""} < ${estado} > < ${mensajesConsola[i].msg.ciudad} >`
          const color = mensajesConsola[i].msg.estado === "criminal" ? colorCrimi : mensajesConsola[i].msg.estado === "ciudadano" ? colorCiuda : colorNeutral
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
       <p style="color:${colorConsola};margin:0px; padding:0px; margin-left: 15px; font-size:12px">${msg}</p>
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


socket.on("borrarItem", (id) => {
  players = players.filter(p => p.id !== id)
  itemsEnMapa = itemsEnMapa.filter(p => p.id !== id)
})


socket.on("update", (playersTotal, clicks) => {

  players = playersTotal
  snowballs = clicks
  itemsEnMapa = players.filter(p => p.skin === "items")

  players = players.concat(mundoDibujables[myPlayer.mapa])
  if (players.length < 0) {

    const onlines = players.filter((player) => player.clase === "player");
    playersOnline = onlines.length
  }

  //  if (myPlayer) {
  //    players.sort(((a, b) => a.y - b.y))
  //    cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
  //    cameraY = parseInt(myPlayer.y - canvasEl.height / 2)
  //  }

});

setInterval(() => {
  if (meditar) {
    if (myPlayer.mana < myPlayer.manaTotal) {

      socket.emit("meditar", (texto) => {
        const msg = {
          msg: texto,
          tipo: "consola"
        }
        mensajesConsola.push(msg)
        actualizarMensajes()
      })
    } else {
      const msg = {
        msg: "Dejas de meditar.",
        tipo: "consola"
      }
      mensajesConsola.push(msg)
      actualizarMensajes()
      meditar = false
      setInterval(() => {

        socket.emit("cambiarSkin", "link")
      }, 500);
    }
  }
}, 2000);
let descansar = false
setInterval(() => {
  if (myPlayer && myPlayer.sed > 0 && myPlayer.hambre > 0) {
    if (myPlayer.energia < myPlayer.energiaTotal && descansar) {
      socket.emit("descansar", parseInt(myPlayer.energiaTotal * 0.1), (texto, bool) => {
        if (!bool) {
          descansar = false
        }
        const msg = {
          msg: texto,
          tipo: "consola"
        }
        mensajesConsola.push(msg)
        actualizarMensajes()
      })
    } else if (!descansar) {
      socket.emit("descansar", parseInt(myPlayer.energiaTotal * 0.05), (texto) => {
      })
    }
  }

}, 500);
setInterval(() => {
  socket.emit("gastarSed", 5)
  setTimeout(() => {
    socket.emit("gastarHambre", 5)
    if (myPlayer && myPlayer.sed <= 0 && myPlayer.energia === 0) {
      const msg = {
        msg: "Estas Sediento.",
        tipo: "consola"
      }
      descansar = false
      mensajesConsola.push(msg)
      actualizarMensajes()
    }
    if (myPlayer.hambre <= 0 && myPlayer.energia === 0) {
      const msg = {
        msg: "Estas Hambiento.",
        tipo: "consola"
      }
      descansar = false
      mensajesConsola.push(msg)
      actualizarMensajes()
    }
  }, 10000);
}, 20000);

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y
  );
}

function isCollidingWithMap(player) {
  for (let row = 0; row < decalMap.length; row++) {
    for (let col = 0; col < decalMap[0].length; col++) {
      const tile = decalMap[row][col];

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
        // console.log("choca con mapa")
        return true;
      }
    }
  }
  return false;
}
function isCollidingWithPlayer(player) {
  let playerEnMapa = players.filter(p => p.mapa === player.mapa && p.id !== player.id)
  playerEnMapa = playerEnMapa.filter(p => !p.sinColision || p.sinColision === false)
  for (let i = 0; i < playerEnMapa.length; i++) {
    const otroPlayer = playerEnMapa[i]
    let valorX
    let valorY
    let valorW
    let valorH
    switch (otroPlayer.skin) {
      case "arboles":
        valorX = otroPlayer.x - 30
        valorY = otroPlayer.y - 10
        valorW = 50
        valorH = 50
        break;
      case "items":
        valorX = otroPlayer.x - otroPlayer.w + 5
        valorY = otroPlayer.y - otroPlayer.h + 15
        valorW = otroPlayer.w + 20
        valorH = otroPlayer.h - 5
        break;

      default:
        valorX = otroPlayer.x - 35
        valorY = otroPlayer.y - 30
        valorW = otroPlayer.w + 30
        valorH = otroPlayer.h + 10

        break;
    }

    if (isColliding(
      {
        x: valorX,
        y: valorY,
        w: valorW,
        h: valorH,
      },
      {
        x: player.x,
        y: player.y,
        w: 0,
        h: 0,
      },
    )
    ) {
      // console.log("choca con alguien")
      return otroPlayer.id;
    }
  }
  return false;
}



setInterval(() => {

  let p = { ...myPlayer }


  if (inputs.up) {
    p.y -= pixels
    p.mirando = "up"
  }
  if (inputs.down) {
    p.y += pixels
    p.mirando = "down"
  }
  if (inputs.left) {
    p.x -= pixels
    p.mirando = "left"
  }
  if (inputs.right) {
    p.x += pixels
    p.mirando = "right"
  }



  let colision = false

  if ((isCollidingWithMap(p) || isCollidingWithPlayer(p))) {
    if (inputs.up) {
      p.y += pixels

    }
    if (inputs.down) {
      p.y -= pixels
  
    }
    if (inputs.left) {
      p.x += pixels
  
    }
    if (inputs.right) {
      p.x -= pixels
 
    }
    colision = true

    
    if (myPlayer.mirando !== p.mirando) {

      console.log("emite cambio", myPlayer.mirando, p.mirando)
      socket.emit("movimiento", p.x, p.y, p.mirando, p.quieto);
    }
  } else {

    if (inputs && (inputs.right || inputs.left || inputs.up || inputs.down)) {
      if (!colision) {
        p.quieto = false
        socket.emit("movimiento", p.x, p.y, p.mirando, p.quieto);
      }
    } 
    
  }
  myPlayer.mirando = p.mirando
  myPlayer.quieto = p.quieto
  myPlayer.x = p.x
  myPlayer.y = p.y







}, 1000 / MOV);
window.addEventListener("keydown", (e) => {
  if (["a", "s", "w", "d"].includes(e.key) && !escribiendo) {


    if (descansar) {
      const msg = {
        msg: "Dejas de descansar.",
        tipo: "consola"
      }
      mensajesConsola.push(msg)
      actualizarMensajes()
      descansar = false
    }
    if (myPlayer.skin === "barca") {
      socket.emit("cambiarSkin", "link")
      meditar = false
      const msg = {
        msg: "Dejas de meditar.",
        tipo: "consola"
      }
      mensajesConsola.push(msg)
      actualizarMensajes()
    }
    //  }, 10);
    const anchoMundo = 20



    let nuevoMapa = 0
    if (myPlayer.y < 10) {
      nuevoMapa = (myPlayer.mapa - anchoMundo)
      socket.emit("cambiarMapa", nuevoMapa, (mapa, x, y) => {
        myPlayer.x = x
        myPlayer.y = y
        if (myPlayer.mapa !== mapa) {
          myPlayer.mapa = mapa
          groundMap = mundoMaps[myPlayer.mapa].ground2D;
          decalMap = mundoMaps[myPlayer.mapa].decal2D;
        }
      })
      console.log("cambio a mapa: ", nuevoMapa)

    }
    if (myPlayer.y > 1500) {
      nuevoMapa = (myPlayer.mapa + anchoMundo)
      socket.emit("cambiarMapa", nuevoMapa, (mapa, x, y) => {
        // myPlayer.x= x
        // myPlayer.y=y
        if (myPlayer.mapa !== mapa) {
          myPlayer.mapa = mapa
          groundMap = mundoMaps[mapa].ground2D;
          decalMap = mundoMaps[mapa].decal2D;
          console.log("cambio a mapa: ", mapa, myPlayer.mapa)
        }
      })

    }
    if (myPlayer.x < 10) {
      nuevoMapa = (myPlayer.mapa - 1)
      socket.emit("cambiarMapa", nuevoMapa, (mapa, x, y) => {
        myPlayer.x = x
        myPlayer.y = y
        if (myPlayer.mapa !== mapa) {
          myPlayer.mapa = mapa
          groundMap = mundoMaps[myPlayer.mapa].ground2D;
          decalMap = mundoMaps[myPlayer.mapa].decal2D;
        }
      })
      console.log("cambio a mapa: ", nuevoMapa)

    }
    if (myPlayer.x > 1500) {
      nuevoMapa = (myPlayer.mapa + 1)
      socket.emit("cambiarMapa", nuevoMapa, (mapa, x, y) => {
        myPlayer.x = x
        myPlayer.y = y
        if (myPlayer.mapa !== mapa) {
          myPlayer.mapa = mapa
          groundMap = mundoMaps[myPlayer.mapa].ground2D;
          decalMap = mundoMaps[myPlayer.mapa].decal2D;
        }
      })
      console.log("cambio a mapa: ", nuevoMapa)

    }
    if (nuevoMapa) {

      socket.on("update", (playersTotal, clicks) => {

        players = playersTotal
        snowballs = clicks
        itemsEnMapa = players.filter(p => p.skin === "items")

        players = players.concat(mundoDibujables[myPlayer.mapa])
        if (players.length < 0) {

          const onlines = players.filter((player) => player.clase === "player");
          playersOnline = onlines.length
        }

      });

    }

  }
  if (e.key === "Enter" && !menuAbierto) {

    if (escribiendo) {
      const comandos = ["/meditar", "/descansar", "/comerciar", "/nombre", "/desc"]


      if (!comandos.includes(mensaje.value.split(" ")[0])) {

        const msg = {
          tipo: "chat",
          msg: mensaje.value
        }
        socket.emit("enviarMensaje", msg)
        mensaje.value = ""
        mensaje.blur()
        escribiendo = false
        actualizarMensajes()
        setTimeout(() => {
          if (myPlayer.ultimoMensaje === msg.msg) socket.emit("enviarMensaje", { tipo: "chat", msg: "" })
        }, 5000);
      } else {
        switch (mensaje.value.split(" ")[0]) {
          case "/meditar":
            const msg = {
              msg: "Comienzas a meditar.",
              tipo: "consola"
            }
            mensajesConsola.push(msg)
            actualizarMensajes()
            if (myPlayer.skin !== "barca" && myPlayer.mana < myPlayer.manaTotal) {
              socket.emit("cambiarSkin", "barca")
              meditar = true

            } else {
              meditar = false
              socket.emit("cambiarSkin", "link")
              const msg = {
                msg: "Dejas de meditar.",
                tipo: "consola"
              }
              mensajesConsola.push(msg)
              actualizarMensajes()
            }
            break;
          case "/descansar":
            if (!descansar) {
              if (myPlayer.hambre > 0 && myPlayer.sed > 0) {
                const msg = {
                  msg: "Comienzas a descansar.",
                  tipo: "consola"
                }
                mensajesConsola.push(msg)
                actualizarMensajes()
                descansar = true
              } else {
                descansar = false
                const msg = {
                  msg: "Tienes demasiada hambre o sed.",
                  tipo: "consola"
                }
                mensajesConsola.push(msg)
                actualizarMensajes()
              }

            } else {
              descansar = false
              const msg = {
                msg: "Dejas de descansar.",
                tipo: "consola"
              }
              mensajesConsola.push(msg)
              actualizarMensajes()
            }
            break;
          case "/nombre":
            const nombre = mensaje.value.split(" ")[1]
            if (nombre !== "") {
              socket.emit("nombre", nombre)
            }
            break
          case "/desc":
            const comando = mensaje.value.split(" ")[0].trim()
            const desc = mensaje.value.substr(comando.length)
            if (desc !== "") {
              socket.emit("desc", desc)
            }
            break
          default:
            break;
        }

        mensaje.value = ""
        mensaje.blur()
        escribiendo = false

      }

    } else {
      mensaje.focus()
      escribiendo = true
    }
  }
  if (!escribiendo && !menuAbierto) {

    switch (e.key) {
      case "m":
        console.log(players, itemsEnMapa)
        break
      case "q":
        itemsEnMapa.forEach(player => {
          const distance = Math.sqrt(((player.x - cameraX) - (myPlayer.x - cameraX)) ** 2 + ((player.y - cameraY - 2) - (myPlayer.y - cameraY)) ** 2);
          const ratio = 1.0 - Math.min(distance / 700, 1);

          const proximidad = Math.floor(ratio * 100)
          //console.log(proximidad)
          if (proximidad > 97 && player.skin === "items" && player.clase !== "creable") {
            //busco si hay algun slot con ese item ya en el inventario
            let item = player.objeto
            let slotMismoItem = myPlayer.inventario.find(slot => slot[0] === item[0])
            const index = myPlayer.inventario.indexOf(slotMismoItem)
            if (slotMismoItem && dbItems[item[0]].apilable) {

              player.objeto[1] = myPlayer.inventario[index][1] += item[1]
              socket.emit("agarrar", index, player.objeto, player.id, (slotReturn) => {

                myPlayer.inventario[index][1] = slotReturn[1]

                actualizarInventario()


              })
            } else {
              //busca espacio vacio en inventario
              let slotDisponible = myPlayer.inventario.find(slot => slot[0] === 0 && slot[1] === 0)
              const index = myPlayer.inventario.indexOf(slotDisponible)
              if (slotDisponible) {
                slotDisponible[0] = item[0]
                slotDisponible[1] = item[1]

                socket.emit("agarrar", index, player.objeto, player.id, (slotReturn) => {

                  console.log("slot disponible ", slotReturn)

                  myPlayer.inventario[slotDisponible] = slotReturn
                  actualizarInventario()

                })
              } else {

                const msg = {
                  msg: "No tienes suficiente espacio.",
                  tipo: "consola"
                }
                mensajesConsola.push(msg)
                actualizarMensajes()
              }
              actualizarInventario()
            }

          }

        })
        break
      case "c":
        craft.style.visibility = "visible"
        actualizarCraftItem()
        actualizarCraftNecesita()

        break
      case "t":

        if (!itemSelect) {
          break;
        }
        let puede = true
        itemsEnMapa.forEach(player => {
          const distance = Math.sqrt(((player.x - cameraX) - (myPlayer.x - cameraX)) ** 2 + ((player.y - cameraY - 10) - (myPlayer.y - cameraY)) ** 2);
          const ratio = 1.0 - Math.min(distance / 700, 1);

          const proximidad = Math.floor(ratio * 100)
          console.log(player.clase)
          if (proximidad > 94) {
            puede = false
          }
        })
        const numero = Number(itemSelect.split("slot")[1])
        if (dbItems[myPlayer.inventario[numero][0]].clase === "creable") {
          puede = false
        }
        if (itemSelect && puede) {
          tirar.style.visibility = "visible"
          cuantoTirar.focus()
          cuantoTirar.value = "1"
          menuAbierto = true
        } else {
          let msg
          if (dbItems[myPlayer.inventario[numero][0]].clase === "creable") {

            msg = {
              msg: "No puedes tirar este item.",
              tipo: "consola"
            }
          } else {
            msg = {
              msg: "No hay espacio en el suelo",
              tipo: "consola"
            }

          }
          mensajesConsola.push(msg)
          actualizarMensajes()
          actualizarInventario()
        }

        break
      case "i":
        actualizarInventario()
        break
      case "e":
        const slot = Number(itemSelect.split("slot")[1])
        socket.emit("equipar", slot, (equipoItem, sonido) => {
          if (!equipoItem) {
            const msg = {
              msg: `No puedes equipar ${dbItems[myPlayer.inventario[slot][0]].nombre}.`,
              tipo: "consola"
            }
            mensajesConsola.push(msg)
            actualizarMensajes()
          }
          if (sonido) {
            equipar.play()
          }

          setTimeout(() => {
            actualizarInventario()
          }, 300);
        })
        break
      case "u":
        if (itemSelect) {


          if (!selecciono) {
            selecciono = true
            //console.log("dobleclick")
            const slot = Number(itemSelect.split("slot")[1])
            const item = myPlayer.inventario[slot][0]

            if (item && dbItems[item].nombre) {


              socket.emit("usar", slot, (objeto, hechizo, clase) => {
                switch (clase) {
                  case "bebida":
                    tomar.play()
                    break;
                  case "comida":
                    comer.play()
                    break;
                  case "pocion":
                    tomar.play()
                    break;

                  default:
                    break;
                }

                if (!hechizo) {
                  const msg = {
                    msg: ` ${objeto}`,
                    tipo: "consola"
                  }
                  mensajesConsola.push(msg)
                  actualizarMensajes()
                } else {
                  if (myPlayer.energia > 3) {
                    switch (dbItems[item].clase) {
                      case "herramienta":
                        accion = acciones[1]
                        break;
                      case "creable":
                        accion = acciones[2]
                        break;
                      case "refinable":
                        accion = acciones[1]
                        break;
                      default:
                        accion = acciones[0]
                        break;
                    }
                    boxHechizos.style.cursor = "crosshair"
                    HUD.style.cursor = "crosshair"
                    cast = true
                    hechizoTemp = hechizoSelect
                    hechizoSelect = dbItems[item].hechizo - 1
                    actualizarHechizos()
                  } else {
                    const msg = {
                      tipo: "consola",
                      msg: `No tienes suficiente energia`
                    }
                    mensajesConsola.push(msg)
                    actualizarMensajes()
                  }
                  // accion = acciones[1]
                  console.log("lanza el hechizo: ", hechizosData[hechizo].nombre)
                }
              })

              actualizarInventario()
              setTimeout(() => {
                cajaInventario.blur()
                selecciono = false
                actualizarInventario()
              }, 600);
            }
          }

          actualizarInventario()
        } else {
          const msg = {
            tipo: "consola",
            msg: `Selecciona un objeto primero.`
          }
          mensajesConsola.push(msg)
          actualizarMensajes()
        }

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

  if (menuAbierto && e.key === "Enter") {
    tirarObjeto()
  }



});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      inputs["up"] = false;
      break;
    case "s":
      inputs["down"] = false;
      break;
    case "d":
      inputs["right"] = false;
      break;
    case "a":
      inputs["left"] = false;
      break;

    default:
      break;
  }
  // if (e.key === "w") {
  //   inputs["up"] = false;
  // } else if (e.key === "s") {
  //   inputs["down"] = false;
  // } else if (e.key === "d") {
  //   inputs["right"] = false;
  // } else if (e.key === "a") {
  //   inputs["left"] = false;
  // }
  if (["a", "s", "w", "d"].includes(e.key)) {


  }


});

//EVENTO DE CLICK EN CANVAS
canvasEl.addEventListener("click", (e) => {
  if (tirar.style.visibility === "visible") {
    tirar.style.visibility = "hidden"
    menuAbierto = false
  }
  point = { x: myPlayer.x + e.clientX - canvasEl.width / 2 + window.scrollX, y: myPlayer.y + e.clientY - canvasEl.height + window.scrollY + myPlayer.h };
  point.cast = {
    cast,
    accion,
    hechizoSelect: hechizosData[myPlayer["hechizos"][hechizoSelect]]
  }
  boxHechizos.style.cursor = "default"
  HUD.style.cursor = "default"
  hechizoSelect = hechizoTemp
  actualizarHechizos()
  //socket.emit("point", point);

  //traigo lo que hacia el server para hacerlo local

  const player = myPlayer
  const objeto = point
  const snowball = {
    cast: objeto.cast,
    mapa: player.mapa,
    x: objeto.x,
    y: objeto.y,
    //  timeLeft: 10000, en deshuso por el momento
    playerId: socket.id,
  }
  for (const player of players) {

    const pj = player

    let tamaño = player.w / 2
    let posicionx = player.x
    let posiciony = player.y
    switch (player.skin) {
      case "arboles":
        tamaño = 20
        posiciony = posiciony + 10
        posicionx = posicionx + 5
        break;
      case "items":
        tamaño = 12
        posiciony = posiciony
        posicionx = posicionx - 3
        break;

      default:
        //Players
        tamaño = 20
        posiciony = posiciony
        posicionx = posicionx

        break;
    }

    let distance = Math.sqrt(
      (posicionx - snowball.x) ** 2 +
      (posiciony - snowball.y) ** 2
    );

    if (distance <= tamaño) {

      let obj
      if (player.clase === "player") {
        obj = {
          cast: snowball.cast,
          player: pj,
          tipo: "click",
          msg: player
        }
      } else {
        let infoClick = `${player.nombre}`
        infoClick += player.timeLeft ? (player.timeLeft / 60) > 1 ? ` < ${Math.ceil(player.timeLeft / 60)} min >` : ` < ${player.timeLeft} seg >` : ""
        if (player.dueño) {

          infoClick += player.dueño && player.sinColision === false ? ` < Dueño: ${player.dueño} >` : ""
          if (player.costo) {
          }

          infoClick += player.costo && (player.costo[0] || player.costo[1] || player.costo[2]) ? ` < Costo: ` : ""
          infoClick += player.costo[0] ? `  ${player.costo[0]} oro` : ""
          infoClick += player.costo[0] && player.costo[1] ? `, ` : ""
          infoClick += player.costo[1] ? `  ${player.costo[1]} plata` : ""
          infoClick += player.costo[0] && player.costo[2] || player.costo[1] && player.costo[2] ? `, ` : ""
          infoClick += player.costo[2] ? `  ${player.costo[2]} cobre` : ""
          infoClick += player.costo && (player.costo[0] || player.costo[1] || player.costo[2]) ? ` >` : ""
        }
        if (player.objeto) {

          infoClick += player.objeto[1] && player.sinColision === true ? ` < Cantidad: ${player.objeto[1]} >` : ""
        }

        obj = {
          cast: snowball.cast,
          tipo: "consola",
          msg: infoClick,
          objetivo: player

        }
      }
      socket.emit("point", pj.id, obj);
      mensajesConsola.push(obj)
      actualizarMensajes()


      if (snowball.cast) {
        //ACA CONFIGRAR TODOS LOS QUE PASA AL CASTEAR HECHIZOS SOBRE ALGO O ALGUIEN
        if (snowball.cast.cast && snowball.cast.hechizoSelect.clase && snowball.cast.hechizoSelect.clase === "curacion" && player.clase === "player") {
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
            // io.to(pj.id).emit('privado', destino);
            mensajesConsola.push(destino)
            actualizarMensajes()
            const origen = {
              tipo: "daño",
              msg: pj.id === player.id ? "Te has curado " + snowball.cast.hechizoSelect["max"] + " puntos de vida." : "te ha curado " + snowball.cast.hechizoSelect["max"] + " puntos de vida.",
              playerDestino: player,
              playerOrigen: pj
            }
            // io.to(player.id).emit('privado', origen);
            mensajesConsola.push(origen)
            actualizarMensajes()
            if (player.id !== pj.id) {
              const destino = {
                tipo: "daño",
                msg: "Has curado a " + player.nombre + " por " + snowball.cast.hechizoSelect["max"] + " puntos.",
                playerDestino: player,
                playerOrigen: pj
              }
              // io.to(pj.id).emit('privado', destino);
              mensajesConsola.push(destino)
              actualizarMensajes()
              //socket.emit("point", pj.id, destino);
            }
          } else {
            const destino = {
              tipo: "daño",
              msg: "No tienes suficiente mana. NO DEBERIA PODER LANZARLO",
              playerDestino: player,
              playerOrigen: pj
            }
            mensajesConsola.push(destino)
            actualizarMensajes()
            //io.to(pj.id).emit('privado', destino);
          }
        }

      }


    }

    // snowball.timeLeft = -1;


  }

  //cierro lo que hacia el server


  if (accion === "trabajo" && cast) {
    if (descansar) {
      const msg = {
        msg: "Dejas de descansar.",
        tipo: "consola"
      }
      mensajesConsola.push(msg)
      actualizarMensajes()
    }

    socket.emit("gastarEnergia", 3)
    accion = ""
    descansar = false

  }
  if (accion === "hechizo" && cast) {
    socket.emit("gastarEnergia", 1)
    accion = ""
    descansar = false
  }
  if (accion === "crear" && cast) {
    colocarPrecio.style.visibility = "visible"
    //sacar esto cuando acepte en el menu
    //soltarCreable()
  }
  cast = false
});

setInterval(() => {
  if (myPlayer) {

    actualizarHUD()
  }
}, 100);




const actualizarHUD = () => {

  energia.style.width = `${(myPlayer.energia / myPlayer.energiaTotal) * 100}%`
  mana.style.width = `${(myPlayer.mana / myPlayer.manaTotal) * 100}%`
  salud.style.width = `${(myPlayer.salud / myPlayer.saludTotal) * 100}%`
  hambre.style.width = `${(myPlayer.hambre / myPlayer.hambreTotal) * 100}%`
  sed.style.width = `${(myPlayer.sed / myPlayer.sedTotal) * 100}%`
  cantidadOro.innerText = myPlayer.billetera[0]
  cantidadPlata.innerText = myPlayer.billetera[1]
  cantidadCobre.innerText = myPlayer.billetera[2]

  const onlines = `Mapa: ${myPlayer.mapa} - x:  ${parseInt(myPlayer.x / 10)} -  y:  ${parseInt(myPlayer.y / 10)}  -  Online: ${playersOnline} `
  online.innerText = onlines
}

function loop() {

  if (myPlayer) {
    players.sort(((a, b) => a.y - b.y))
    cameraX = parseInt(myPlayer.x - canvasEl.width / 2);
    cameraY = parseInt(myPlayer.y - canvasEl.height / 2)
  }


  canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);


  const TILES_IN_ROW = 100; //numero de tiles en imagen /public/mapas/dungeon-newbie.jpg

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

  //objetos
  for (const player of itemsEnMapa) {
    const pjrender = personajes.find(pj => pj.skin === player.skin)

    const distance = Math.sqrt((player.x - myPlayer.x) ** 2 + (player.y - myPlayer.y) ** 2);
    const ratio = 1.0 - Math.min(distance / 700, 1);

    const proximidad = Math.floor(ratio * 100)



    if (proximidad > distanciaRender) {



      TILES_IN_ROW_PJ = pjrender.info.rows
      TILES_IN_COL_PJ = pjrender.info.cols
      PJ_SIZE_W = pjrender.info.tileWidth
      PJ_SIZE_H = pjrender.info.tileHeight
      let { id } = pjrender.pj2D[player.row][player.col] ?? { id: undefined };
      if (id !== undefined) {

        const imageRow = parseInt(id / TILES_IN_ROW_PJ);
        const imageCol = id % TILES_IN_ROW_PJ;
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        let x
        let y


        switch (player.skin) {
          case "items":
            x = player.x - cameraX - player.w / 2 - 3
            y = player.y - cameraY - player.h / 2 + 10
            break;
          case "arboles":
            x = player.x - cameraX - player.w / 2 - player.w / 20
            y = player.y - cameraY - player.h + 40
            break;

          default:
            x = player.x - cameraX - player.w / 2
            y = player.y - cameraY - player.h / 2
            break;
        }

        canvas.drawImage(
          imagenes[player.skin],
          imageCol * PJ_SIZE_W,
          imageRow * PJ_SIZE_H,
          PJ_SIZE_W,
          PJ_SIZE_H,
          x,
          y,
          player.w,
          player.h
        );

      }

    }
  }

  //Personajes y arboles
  for (const player of players) {
    if (player.skin === "items") {
      continue;
    }
    const pjrender = personajes.find(pj => pj.skin === player.skin)



    const distance = Math.sqrt(((player.x - cameraX) - (myPlayer.x - cameraX)) ** 2 + ((player.y - cameraY - 2) - (myPlayer.y - cameraY)) ** 2);
    const ratio = 1.0 - Math.min(distance / 700, 1);

    const proximidad = Math.floor(ratio * 100)


    // if (player === myPlayer) {
    //   if (!player.quieto) player.skin === "barca" ? miAgua.play() : !otrosPasos.isPlaying ? misPasos.play() : misPasos.currentTime = 0
    // } else {
    //   if (!player.quieto) player.skin === "barca" ? otrosAgua.play() : !misPasos.isPlaying ? otrosPasos.play() : otrosPasos.currentTime = 0
    // }


    // player.skin === "barca" ? !player.quieto ? agua.play() : agua.pause() : !player.quieto ? pasos.play() : pasos.pause()
    if (proximidad > distanciaRender) {


      TILES_IN_ROW_PJ = pjrender.info.rows
      TILES_IN_COL_PJ = pjrender.info.cols
      PJ_SIZE_W = pjrender.info.tileWidth
      PJ_SIZE_H = pjrender.info.tileHeight
      let { id } = pjrender.pj2D[player.row][player.col] ?? { id: undefined };
      if (id !== undefined) {

        const imageRow = parseInt(id / TILES_IN_ROW_PJ);
        const imageCol = id % TILES_IN_ROW_PJ;
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        let x
        let y

        switch (player.skin) {
          case "items":
            x = player.x - cameraX - player.w / 2
            y = player.y - cameraY - player.h / 2
            break;
          case "arboles":
            x = player.x - cameraX - player.w / 2 - player.w / 20
            y = player.y - cameraY - player.h + 40
            break;

          default:
            x = player.x - cameraX - player.w / 2
            y = player.y - cameraY - player.h / 2
            break;
        }



        canvas.drawImage(
          imagenes[player.skin],
          imageCol * PJ_SIZE_W,
          imageRow * PJ_SIZE_H,
          PJ_SIZE_W,
          PJ_SIZE_H,
          x,
          y,
          player.w,
          player.h
        );

      }



      //NOMBRE PERSONAJE
      //canvas.drawImage(santaImage, player.x - cameraX, player.y - cameraY);
      if (player.clase === "player") {
        const color = player.estado === "criminal" ? colorCrimi : player.estado === "ciudadano" ? colorCiuda : colorNeutral
        canvas.fillStyle = 'black'
        canvas.fillStyle = color;
        canvas.font = "bold 12px";
        canvas.textAlign = "center"
        canvas.fillText(player.nombre, player.x - cameraX, (player.y - cameraY - player.h / 2) + player.h + 15)
      }
    }


    //ULTIMO MENSAJE PERSONAJE
    if (player.ultimoMensaje) {
      canvas.fillStyle = 'black'
      canvas.fillStyle = "#f0f3f4";
      canvas.font = "bold 12px arial";
      canvas.textAlign = "center"
      canvas.fillText(player.ultimoMensaje, player.x - cameraX, (player.y - cameraY - player.h / 2) + player.h - PJ_SIZE_H / 2.5)
    }

    // PLAYERS ONLINE  
    // mapaActual = ((parseInt(parseInt(myPlayer.y / TILE_SIZE) / 48) * 10) + ((parseInt(parseInt(myPlayer.x / TILE_SIZE) / 48)) + 1))



  }

  //dibujar CLicks en desuhuso
  // for (const snowball of snowballs) {
  //   canvas.fillStyle = "#d1d107";
  //   canvas.beginPath();
  //   canvas.arc(
  //     snowball.x - cameraX,
  //     snowball.y - cameraY + 10,
  //     SNOWBALL_RADIUS,
  //     0,
  //     2 * Math.PI
  //   );
  //   canvas.fill();
  // }



}



setInterval(() => {

  loop();
}, 1000 / FPS);


