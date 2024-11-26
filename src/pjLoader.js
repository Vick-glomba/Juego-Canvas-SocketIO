const tmx = require("tmx-parser");

async function loadPj(archivo) {
  const path = "./src/render/" + archivo + ".tmx"
  const tsx = await new Promise((resolve, reject) => {
    tmx.parseFile(path, function (err, loadedMap) {
      if (err) return reject(err);
      resolve(loadedMap);
    });
  });


  const pjTiles = tsx.layers[0].tiles;
  const pj2D = [];
  
  for (let row = 0; row < tsx.height; row++) {
    const pjRow = [];
    for (let col = 0; col < tsx.width; col++) {
      const pjTile = pjTiles[row * tsx.width + col];
      if (pjTile) {
        pjRow.push({
          id: pjTile.id,
          // gid: pjTile.gid,
        });
      } else {
        pjRow.push(undefined);
      }
      
    }
    col = 0
    pj2D.push(pjRow);
  }
  const tile= tsx.tileSets["0"]
 
  const info = {
    rows: tsx.width,
    cols: tsx.height,
    name: tile.name,
    source: tile.source,
    name: tile.name,
    tileWidth: tile.tileWidth,
    tileHeight: tile.tileHeight,
    image: tile.image
  }


  return {
    pj2D,
    info
  }
}

module.exports = loadPj;
