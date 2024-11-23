const tmx = require("tmx-parser");

async function loadPj(archivo) {
  const path = "./src/images/"+archivo+".tmx"
  const tsx = await new Promise((resolve, reject) => {
    tmx.parseFile(path, function (err, loadedMap) {
      if (err) return reject(err);
      console.log(loadedMap)
      resolve(loadedMap);
    });
  });

  const pjTiles = tsx.layers[0].tiles;
  const pj2D = [];
  for (let row = 0; row < tsx.height; row++) {
    const pjRow = [];
    for (let col = 0; col < tsx.width; col++) {
      const pjTile = pjTiles[row * tsx.height + col];
      if (pjTile) {
        pjRow.push({
          id: pjTile.id,
          gid: pjTile.gid,
        });
      } else {
        pjRow.push(undefined);
      }
    }
    pj2D.push(pjRow);
  }

  return pj2D
}

module.exports = loadPj;
