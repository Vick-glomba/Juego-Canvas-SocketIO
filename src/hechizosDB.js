const tmx = require("tmx-parser");


let db = {}

db.hechizos = [

  {
    "nombre": "--------------Vacio--------------",
  },
  {
    "nombre": "talar",
    "mana necesario": 0,
    "min": 0,
    "max": 1,
    "nivel": 1,
    "texto": "",
    "clase": "talar",
    "recurso": "madera",
    "cantidad": 5
  },
  {
    "nombre": "Dardo magico",
    "mana necesario": 5,
    "min": 1,
    "max": 3,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "daño"
  },
  {
    "nombre": "Flecha Magica",
    "mana necesario": 5,
    "min": 1,
    "max": 3,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "daño"
  },
  {
    "nombre": "Misil magico",
    "mana necesario": 5,
    "min": 1,
    "max": 3,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "daño"
  },
  {
    "nombre": "Curar Heridas Leves",
    "mana necesario": 5,
    "min": 1,
    "max": 3,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "curacion"
  },
  {
    "nombre": "Curar Heridas Graves",
    "mana necesario": 25,
    "min": 10,
    "max": 50,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "curacion"
  },
  {
    "nombre": "Rayo Peronizador",
    "mana necesario": 5,
    "min": 1,
    "max": 3,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "daño"
  },
  {
    "nombre": "Inmovilizar",
    "mana necesario": 5,
    "min": 1,
    "max": 3,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "movimiento"
  },
  {
    "nombre": "Paralizar",
    "mana necesario": 5,
    "min": 1,
    "max": 3,
    "nivel": 1,
    "texto": "VAX IN TAR",
    "clase": "movimiento"
  },
]

module.exports = db


