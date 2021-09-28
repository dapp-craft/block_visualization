import * as utils from "@dcl/ecs-scene-utils";
export class CryptoBox extends Entity {

  public static shapes = {
    'BTC': new GLTFShape("models/BTC.glb"),
    'ETH': new GLTFShape("models/ETH.glb"),
    'BTC_anim': new GLTFShape("models/BTC_anim.glb"),
    'ETH_anim': new GLTFShape("models/ETH_anim.glb")
  }
  //Variables
  private pointA: Vector3;
  private pointB: Vector3;

  private timer: number;
  private duration: number;
  private fraction: number;
  private steps: number;
  private currentStep: number;

  private died: boolean;
  private live: boolean;
  private type: string;
  private readonly stepLen = 9
  private readonly sceneBoundary = {
    min: new Vector3(1.5,1.5,1.5),
    max: new Vector3(30.5,30.5,30.5)
  }

  getRandomPosition() {
    let x = Math.floor(Math.random() * (this.sceneBoundary.max.x - this.sceneBoundary.min.x))
    let y = Math.floor(Math.random() * (this.sceneBoundary.max.y - this.sceneBoundary.min.y))
    let z = Math.floor(Math.random() * (this.sceneBoundary.max.z - this.sceneBoundary.min.z))
    const pos = new Vector3(this.sceneBoundary.min.x + x, this.sceneBoundary.min.y + y, this.sceneBoundary.min.z + z)

    return pos
  }


  //Update

  update(dt: number) {
    if (this.live) {
      let transform = this.getComponent(Transform)

      if (this.currentStep <= 0) {
        this.died = true;
        this.live = false;
        transform.scale = new Vector3(0, 0, 0)

        // engine.removeSystem(this)
        // engine.removeEntity(this)
        return;
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
      }
      else {
        this.currentStep--
        // log("Number of steps left " + this.currentStep)
        if (this.currentStep < 0) {
          this.died = true;
          this.live = false;
          log("This one is died:",this.died,"live:",this.live)
          return;
        }
        this.pointA = this.pointB
        this.pointB = this.getNewPoint(this.pointA)
        this.timer = 0;
        this.fraction = 0;
      }
    }
  }

  // Progression
  easeInQuart(x: number): number {
    return x * x * x * x;
  }

  //Check possibilities
  getNewPoint(check: Vector3): Vector3 {
    const self = this
    let possarray = [
      new Vector3(check.x + this.stepLen, check.y, check.z),
      new Vector3(check.x - this.stepLen, check.y, check.z),
      new Vector3(check.x, check.y + this.stepLen, check.z),
      new Vector3(check.x, check.y - this.stepLen, check.z),
      new Vector3(check.x, check.y, check.z + this.stepLen),
      new Vector3(check.x, check.y, check.z - this.stepLen),
    ].filter(x => self.inScene(x))
    if (possarray.length == 0) {
      let x = Math.floor((this.sceneBoundary.max.x - this.sceneBoundary.min.x) / 2)
      let y = Math.floor((this.sceneBoundary.max.y - this.sceneBoundary.min.y) / 2)
      let z = Math.floor((this.sceneBoundary.max.z - this.sceneBoundary.min.z) / 2)

      return new Vector3(x,y,z)
    }
    return possarray[Math.floor(Math.random() * possarray.length)]
  }

  //Filter for array
  inScene(item: Vector3): boolean {
    let validX = item.x <= this.sceneBoundary.max.x && item.x >= this.sceneBoundary.min.x;
    let validY = item.y <= this.sceneBoundary.max.y && item.y >= this.sceneBoundary.min.y;
    let validZ = item.z <= this.sceneBoundary.max.z && item.z >= this.sceneBoundary.min.z;
    if (validX && validY && validZ) {
      return true
    } else {
      // log('skiped', item.x, item.y, item.z)
    }
    return false
  }

  //Animation of creation
  creation() {
    this.pointA = this.getRandomPosition();
    this.pointB = this.getNewPoint(this.pointA);

    this.addComponentOrReplace(new Transform({
      position: this.pointA,
      scale:new Vector3(1, 1, 1)
    }))

    this.timer = 0;
    this.fraction = 0;

    this.steps = Math.floor(Math.random() * 25) + 1 // 25
    this.duration = Math.floor(Math.random() * 7) + 3

    this.currentStep = this.steps

    this.died=false
    this.live=false

    this.pendingModel()
  }



  //Constructor
  constructor(parent: IEntity, _type: string, _duration: number, _steps: number, pending: boolean) {
    super("box")

    this.type = _type;

    this.pointA = this.getRandomPosition();
    this.pointB = this.getNewPoint(this.pointA);

    this.addComponentOrReplace(new Transform({
      position: this.pointA,
    }))

    this.setParent(parent)

    this.timer = 0;
    this.duration = _duration;
    this.fraction = 0;
    this.currentStep = _steps;
    this.steps = _steps;

    if (pending) {
      this.live = false
      this.died = false
      this.pendingModel()
    } else {
      this.live = true
      this.died = false
      this.addComponentOrReplace(CryptoBox.shapes[this.type])
    }
  }

  isLive():boolean{
    return this.live
  }

  isDied():boolean{
    return this.died
  }
  kill(){
    this.died = true
  }

  getType(){
    return this.type
  }

  private pendingModel() {
    this.addComponentOrReplace(CryptoBox.shapes[this.type+ "_anim"])
    let clip_name = 'anim_random01'
    if (this.type === 'ETH') {
      clip_name = 'anim_random01'
    }
    const animState = new AnimationState(clip_name)
    const animator = new Animator()
    animator.addClip(animState)
    animState.looping = true
    animState.reset()
    animState.stop()
    animState.play()
    const boxType = this.type
    this.addComponent(animator)
    let pendingTimeout = 900000
    if (this.type === 'ETH') {
      pendingTimeout = 15000
    }
    utils.setTimeout(pendingTimeout, () => {
      this.removeComponent(Animator)
      this.addComponentOrReplace(CryptoBox.shapes[boxType])
      log('live',boxType,'box!')
      this.live = true
    })

  }
}