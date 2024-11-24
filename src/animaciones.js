const loadPj = require("./pjLoader")

class Animacion {
    constructor(col, { up = [], down = [], left = [], right = [] }) {

        this.col = col,
            this.up = up,
            this.down = down,
            this.left = left,
            this.right = right
    }

}

class Personaje {
    constructor(skin) {
        this.skin = skin
        this.pj2D = {}
        this.anims = []



        this.load(skin)
    }
    async load(skin) {
        this.pj2D = await loadPj(skin)
        const stand = new Animacion(4, {
            up: [],
            down: [],
            right: [],
            left: [],
        })
        const caminar = new Animacion(4, {
            up: [],
            down: [],
            right: [],
            left: [],
        })
        const attack = new Animacion(4, {
            up: [],
            down: [],
            right: [],
            left: [],
        })
        this.anims.push(stand)
        this.anims.push(caminar)
        this.anims.push(attack)

    }
}

module.exports = Animacion;