import * as utils from "@dcl/ecs-scene-utils";
import { CryptoBox } from "src/modules/CryptoBox";
import { BoxUpdating } from "src/modules/BoxUpdating";

const scene = new Entity('scene')
engine.addEntity(scene)
scene.addComponentOrReplace(new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
}))

const floor = new Entity('floor')
floor.setParent(scene)
const gltfShape = new GLTFShape("models/FloorBaseGrass_01/FloorBaseGrass_01.glb")
floor.addComponentOrReplace(gltfShape)
floor.addComponentOrReplace(new Transform({
  position: new Vector3(16, 0, 16),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(2, 2, 2)
}))

// let gameArrayOfBox = []

for (let i = 0; i < 150; i++) {

  let x = Math.floor(Math.random() * 10)
  let y = Math.floor(Math.random() * 10)
  let z = Math.floor(Math.random() * 10)

  let steps = Math.floor(Math.random() * 25) + 1
  let step_duration = Math.floor(Math.random() * 7) + 3
  const type = Math.floor(Math.random() * 100)

  const pos = new Vector3(1.5 + (3 * x), 5 + (3 * y), 1.5 + (3 * z))

  if (type >= 40) {
    const ExpEth = new CryptoBox(scene, "ETH_anim", pos, step_duration, steps)
    // gameArrayOfBox.push(ExpEth)
  } else {
    const ExpBtc = new CryptoBox(scene, "BTC_anim", pos, step_duration * 4, steps * 4)
    // gameArrayOfBox.push(ExpBtc)
  }
}

// const boxController = new BoxUpdating(gameArrayOfBox)