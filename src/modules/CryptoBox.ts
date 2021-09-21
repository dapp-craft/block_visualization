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

  private Created: boolean;
  private type: string;


  //Update

  update(dt: number) {

    if (this.Created == true) {
      let transform = this.getComponent(Transform)

      if (this.currentStep <= 0) {
        this.pointA = this.getNewPoint(this.pointA)
        this.pointB = this.getNewPoint(this.pointA)
        this.timer = 0;
        this.duration = Math.floor(Math.random() * 7) + 3
        this.fraction = 0;
        this.steps = Math.floor(Math.random() * 25) + 1
        this.currentStep = this.steps
        
      
        this.creation()
  
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
      }
      else {
        this.currentStep--
        log("Number of steps left "+this.currentStep)
        if (this.currentStep < 0) {
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
    let possarray = [
      new Vector3(check.x + 3, check.y, check.z),
      new Vector3(check.x - 3, check.y, check.z),
      new Vector3(check.x, check.y + 3, check.z),
      new Vector3(check.x, check.y - 3, check.z),
      new Vector3(check.x, check.y, check.z + 3),
      new Vector3(check.x, check.y, check.z - 3),
    ].filter(this.inScene)
    return possarray[Math.floor(Math.random() * possarray.length)]
  }

  //Filter for array
  inScene(item: Vector3): boolean {
    let validX = item.x <= 30.5 && item.x >= 1.5;
    let validY = item.y <= 30.5 && item.y >= 3.5;
    let validZ = item.z <= 30.5 && item.z >= 1.5;
    if (validX && validY && validZ) {
      return true
    } else {
      log('skiped', item.x, item.y, item.z)
    }
    return false
  }

  //Animation of creation
  creation() {
    this.Created = false;

    this.getComponent(Transform).scale = new Vector3(1,1,1)
    this.addComponent(new Animator())
    this.addComponentOrReplace(CryptoBox.shapes[this.type])
    log("type is "+this.type)

    switch (this.type) {
      case 'BTS_anim': {
        const anim_random01_BTS_little = new AnimationState("anim_random01_BTS_little")
        this.getComponent(Animator).addClip(anim_random01_BTS_little)
        anim_random01_BTS_little.play()
        anim_random01_BTS_little.looping = true
        utils.setTimeout(900000, () => {
          this.addComponentOrReplace(CryptoBox.shapes["BTC"])
           this.removeComponent(Animator)
          this.Created = true
        })
        break;
      }

      case 'ETH_anim': {
         const anim_random01_ETH_little = new AnimationState("anim_random01_ETH_little")
        this.getComponent(Animator).addClip(anim_random01_ETH_little)
         anim_random01_ETH_little.play()
         anim_random01_ETH_little.looping = true
        utils.setTimeout(15000, () => {
          this.addComponentOrReplace(CryptoBox.shapes["ETH"])
           this.removeComponent(Animator)
          this.Created = true
        })
        break;
      }

    }
  }



  //Constructor
  constructor(parent: IEntity, _type: string, _pointA: Vector3, _duration: number, _steps: number) {
    super("box")

    this.setParent(parent)
    this.addComponentOrReplace(new Transform({
      position: _pointA,
    }))


    this.timer = 0;
    this.duration = _duration;
    this.fraction = 0;
    this.currentStep = _steps;
    this.steps = _steps;

    this.pointA = _pointA;
    this.pointB = this.getNewPoint(this.pointA);

    this.type = _type;

    this.creation()
  }
}