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

let gameArrayOfBox = []
import blockchain_data from "./blockchain_data";

let tx_count_sum = 0
let tx_cost_sum = 0

const block_count = blockchain_data.length

for (let i = 0; i<block_count;i++) {
  const block = blockchain_data[i]

  const tx_count = parseInt(block[1])
  const tx_cost = parseFloat(block[2])

  tx_count_sum += tx_count
  tx_cost_sum += tx_cost
}

const tx_count_div = tx_count_sum / block_count / 10
const tx_cost_div = tx_cost_sum / block_count / 4

function get_random_pos() {
  let x = Math.floor(Math.random() * 29)
  let y = Math.floor(Math.random() * 29)
  let z = Math.floor(Math.random() * 29)
  const pos = new Vector3(1.5 + x, 3.5 + y, 1.5 + z)

  return pos
}

for (let i = 0; i<block_count*0.66;i++){
  const block = blockchain_data[i]
  const tx_count = parseInt(block[1])
  const tx_cost = parseFloat(block[2])


  // let steps = Math.floor(Math.random() * 25) + 1
  // let step_duration = Math.floor(Math.random() * 7) + 3
  let steps = Math.floor(tx_count / tx_count_div)
  let step_duration = Math.floor(tx_cost / tx_cost_div)
  log('steps',steps, 'step duration', step_duration)
  const type = Math.floor(Math.random() * 100)
    const ExpEth = new CryptoBox(scene, "ETH_anim", get_random_pos(), step_duration, steps)
  gameArrayOfBox.push(ExpEth)

}

for (let i = 0; i<block_count;i++){
  const block = blockchain_data[i]
  const tx_count = parseInt(block[1])
  const tx_cost = parseFloat(block[2])

  let steps = Math.floor(tx_count / tx_count_div)
  let step_duration = Math.floor(tx_cost / tx_cost_div)

  const ExpBtc = new CryptoBox(scene, "BTC_anim", get_random_pos(), step_duration * 4, steps * 4)
  gameArrayOfBox.push(ExpBtc)

}

const boxController = new BoxUpdating(gameArrayOfBox)









