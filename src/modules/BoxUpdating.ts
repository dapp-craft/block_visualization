import { CryptoBox } from "src/modules/CryptoBox";

export class BoxUpdating implements ISystem {
    private boxArray: CryptoBox[]
    update(dt:number) {
        for (let i = 0; i < this.boxArray.length; i++) {
            this.boxArray[i].update(dt);
        }
    }


    constructor(_boxArray: CryptoBox[]) {

        this.boxArray = _boxArray
        engine.addSystem(this)
    }

}