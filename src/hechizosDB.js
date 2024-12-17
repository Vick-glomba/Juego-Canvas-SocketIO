const tmx = require("tmx-parser");


let db = {}

db.items = [
  {},
  {
    nombre: "Pocion roja",
    stat: "salud",
    modifica: 10,
    imagen: 1,
    usable: true,
    equipable: false,
    clase: "pocion",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pocion azul",
    stat: "mana",
    modifica: 10,
    imagen: 2,
    usable: true,
    equipable: false,
    clase: "pocion",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pocion amarilla",
    stat: "agilidad",
    modifica: 10,
    imagen: 3,
    usable: true,
    equipable: false,
    clase: "pocion",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pocion verde",
    stat: "fuerza",
    modifica: 10,
    imagen: 4,
    usable: true,
    equipable: false,
    clase: "pocion",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pocion rosa",
    stat: "salud",
    modifica: 30,
    imagen: 5,
    usable: true,
    equipable: false,
    clase: "pocion",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pollo",
    stat: "hambre",
    modifica: 10,
    imagen: 6,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Manzana",
    stat: "hambre",
    modifica: 10,
    imagen: 7,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Frutas",
    stat: "hambre",
    modifica: 10,
    imagen: 8,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Sandia",
    stat: "hambre",
    modifica: 10,
    imagen: 9,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pan",
    stat: "hambre",
    modifica: 10,
    imagen: 10,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Panes",
    stat: "hambre",
    modifica: 20,
    imagen: 11,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Chuleta",
    stat: "hambre",
    modifica: 25,
    imagen: 12,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Porcion de Queso",
    stat: "hambre",
    modifica: 15,
    imagen: 13,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Queso",
    stat: "hambre",
    modifica: 30,
    imagen: 14,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pastel",
    stat: "hambre",
    modifica: 20,
    imagen: 15,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Bananas",
    stat: "hambre",
    modifica: 20,
    imagen: 16,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pez Naranja",
    stat: "hambre",
    modifica: 20,
    imagen: 17,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Anchoa",
    stat: "hambre",
    modifica: 15,
    imagen: 18,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Pez Espada",
    stat: "hambre",
    modifica: 25,
    imagen: 19,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Atun",
    stat: "hambre",
    modifica: 35,
    imagen: 20,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Caballito de Mar",
    stat: "hambre",
    modifica: 45,
    imagen: 21,
    usable: true,
    equipable: false,
    clase: "comida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Agua",
    stat: "sed",
    modifica: 10,
    imagen: 22,
    usable: true,
    equipable: false,
    clase: "bebida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Vino",
    stat: "sed",
    modifica: 15,
    imagen: 23,
    usable: true,
    equipable: false,
    clase: "bebida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Cerveza",
    stat: "sed",
    modifica: 25,
    imagen: 24,
    usable: true,
    equipable: false,
    clase: "bebida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Botella Vacia",
    stat: "sed",
    modifica: 0,
    imagen: 25,
    usable: true,
    equipable: false,
    clase: "bebida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Botella de Agua",
    stat: "sed",
    modifica: 15,
    imagen: 26,
    usable: true,
    equipable: false,
    clase: "bebida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Jugo de Frutas",
    stat: "sed",
    modifica: 20,
    imagen: 27,
    usable: true,
    equipable: false,
    clase: "bebida",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Caña de Pescar",
    stat: "",
    modifica: 0,
    imagen: 28,
    usable: false,
    equipable: true,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false,
    hechizo: 1
  },
  {
    nombre: "Pico de Minero",
    stat: "",
    modifica: 0,
    imagen: 29,
    usable: false,
    equipable: true,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false,
    hechizo: 1
  },
  {
    nombre: "Serrucho",
    stat: "",
    modifica: 0,
    imagen: 30,
    usable: false,
    equipable: true,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false
  },
  {
    nombre: "Martillo de Herrero",
    stat: "",
    modifica: 0,
    imagen: 31,
    usable: false,
    equipable: true,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false,
    hechizo: 1
  },
  {
    nombre: "Hacha de Leñador",
    stat: "",
    modifica: 0,
    imagen: 32,
    usable: false,
    equipable: true,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false,
    hechizo: 1
  },
  {
    nombre: "Red de Pesca",
    stat: "",
    modifica: 0,
    imagen: 33,
    usable: false,
    equipable: true,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false,
    hechizo: 1
  },
  {
    nombre: "Fragua",
    stat: "",
    modifica: 0,
    imagen: 34,
    usable: true,
    equipable: false,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false,
    hechizo: 1
  },
  {
    nombre: "Yunque",
    stat: "",
    modifica: 0,
    imagen: 35,
    usable: true,
    equipable: false,
    clase: "herramienta",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: false,
    hechizo: 1
  },
  {
    nombre: "Madera",
    stat: "",
    modifica: 0,
    imagen: 36,
    usable: false,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Mena de Cobre",
    stat: "",
    modifica: 0,
    imagen: 37,
    usable: true,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true,
    hechizo: 1
  },
  {
    nombre: "Mena de Plata",
    stat: "",
    modifica: 0,
    imagen: 38,
    usable: true,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true,
    hechizo: 1
  },
  {
    nombre: "Mena de Oro",
    stat: "",
    modifica: 0,
    imagen: 39,
    usable: true,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true,
    hechizo: 1
  },
  {
    nombre: "Lingote de Cobre",
    stat: "",
    modifica: 0,
    imagen: 40,
    usable: false,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Lingote de Plata",
    stat: "",
    modifica: 0,
    imagen: 41,
    usable: false,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Lingote de Oro",
    stat: "",
    modifica: 0,
    imagen: 42,
    usable: false,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Piel de Lobo",
    stat: "",
    modifica: 0,
    imagen: 43,
    usable: false,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Piel de Oso",
    stat: "",
    modifica: 0,
    imagen: 44,
    usable: false,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Piel de Oso Polar",
    stat: "",
    modifica: 0,
    imagen: 45,
    usable: false,
    equipable: false,
    clase: "recurso",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Monedas de Oro",
    stat: "",
    modifica: 0,
    imagen: 46,
    usable: true,
    equipable: false,
    clase: "moneda",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Monedas de Plata",
    stat: "",
    modifica: 0,
    imagen: 47,
    usable: true,
    equipable: false,
    clase: "moneda",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
  {
    nombre: "Monedas de Cobre",
    stat: "",
    modifica: 0,
    imagen: 48,
    usable: true,
    equipable: false,
    clase: "moneda",
    compra: [2, 3, 4],
    venta: [1, 2, 3],
    apilable: true
  },
]

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


