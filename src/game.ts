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

const boxController = new BoxUpdating(scene, 150)