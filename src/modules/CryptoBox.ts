import * as utils from "@dcl/ecs-scene-utils";
export class CryptoBox extends Entity implements ISystem {

  public static shapes = {
    'BTC': new GLTFShape("models/BTC.glb"),
    'ETH': new GLTFShape("models/ETH.glb")
  }
  //Variables
  private pointA: Vector3;
  private pointB: Vector3;

  private timer: number;
  private duration: number;
  private fraction: number;
  private steps: number;


  //Update
  private currentStep: number;
  update(dt: number) {

    try {
      let transform = this.getComponent(Transform)

      if (this.currentStep <= 0) {
        this.pointA = this.getNewPoint(this.pointA)
        this.pointB = this.getNewPoint(this.pointA)
        this.timer = 0;
        this.duration = Math.floor(Math.random() * 7) + 3
        this.fraction = 0;
        this.steps = Math.floor(Math.random() * 25) + 1
        this.currentStep = this.steps

        // engine.removeSystem(this)
        // // engine.removeEntity(this)

        return
      }
      if (this.fraction < 1) {
        this.timer += dt

        let normalizedtime = this.timer / this.duration
        // log("normalizedtime is: " + normalizedtime)
        // log("X of pointA is "+ this.pointA.x)

        this.fraction = this.easeInQuart(normalizedtime)
        // log("fraction is: " + this.fraction)
        let smoothscale = (this.currentStep - this.fraction) / this.steps
        // log("smoothscale is " + smoothscale)
        transform.position = Vector3.Lerp(this.pointA, this.pointB, this.fraction)
        transform.scale = new Vector3(smoothscale, smoothscale, smoothscale)
      } else {
        this.currentStep--
        // log("Number of steps left "+this.currentStep)
        if (this.currentStep <= 0) {
          return;
        }
        this.pointA = this.pointB
        this.pointB = this.getNewPoint(this.pointA)
        this.timer = 0;
        this.fraction = 0;
      }
    }catch (e) {
      log('err', e, this.pointA, this.pointB)
    }
  }

  // Progression
  easeInQuart(x: number): number {
    return x * x * x * x;
  }

  //Check possibilities
  getNewPoint(check: Vector3): Vector3 {
    let possarray = [
      new Vector3(check.x + 3, check.y, check.z),
      new Vector3(check.x - 3, check.y, check.z),
      new Vector3(check.x, check.y + 3, check.z),
      new Vector3(check.x, check.y - 3, check.z),
      new Vector3(check.x, check.y, check.z + 3),
      new Vector3(check.x, check.y, check.z - 3),
    ].filter(this.inScene)
    const ind = Math.floor(Math.random() * possarray.length)
    if (ind < 0 || ind >= possarray.length) {
      log('ERROR', ind)
    }
    if (possarray.length == 0 || possarray[ind] == undefined) {
      log('err', possarray, ind)
      return new Vector3(16,16,16)
    }
    return possarray[ind]
  }

  //Filter for array
  inScene(item: Vector3): boolean {
    let validX = item.x < 30.5 && item.x > 1.5;
    let validY = item.y < 30.5 && item.y > 1.5;
    let validZ = item.z < 30.5 && item.z > 1.5;
    if (validX && validY && validZ) {
      return true
    // } else {
    //   log('skiped', item.x,item.y,item.z)
    }
    return false
  }


  //Constructor
  constructor(parent: IEntity, type: string, _pointA: Vector3, _duration: number, _steps: number) {
    super("box")

    this.setParent(parent)
    this.addComponentOrReplace(CryptoBox.shapes[type])

    this.addComponentOrReplace(new Transform({
      position: _pointA,
    }))


    this.timer = 0;
    this.duration = _duration
    this.fraction = 0;
    this.currentStep = _steps
    this.steps = _steps

    this.pointA = _pointA
    this.pointB = this.getNewPoint(this.pointA)

    engine.addSystem(this)
  }
}