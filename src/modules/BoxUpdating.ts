import { CryptoBox } from "src/modules/CryptoBox";

export class BoxUpdating implements ISystem {
    private boxArray: CryptoBox[];

    private emptyETH: CryptoBox[] = [];
    private emptyBTC: CryptoBox[] = [];

    private creatingETH1: CryptoBox;
    private creatingETH2: CryptoBox;
    private creatingBTC: CryptoBox;

    update(dt: number) {
        for (let i = 0; i < this.boxArray.length; i++) {
            // log("Box are Formed:"+this.boxArray[i].getFormed())
            if (this.boxArray[i].getFormed() == false) {
                log("Push in emptyArrays.")
                let wichType = this.boxArray[i].getType()
                switch (wichType) {
                    case 'ETH': {
                        this.emptyETH.push(this.boxArray[i])
                    }
                    case 'BTC': {
                        this.emptyBTC.push(this.boxArray[i])
                    }
                }
            }

            this.boxArray[i].update(dt);
        }

        this.boxArray = this.boxArray.filter(this.checkFormed)


        this.startCreating(this.creatingETH1, this.emptyETH)
        this.startCreating(this.creatingETH2, this.emptyETH)
        this.startCreating(this.creatingBTC, this.emptyBTC)
    }



    //Filter for array
    checkFormed(box: CryptoBox): boolean { 
        if (box.getFormed() == true) {
            return true
        }
        else {
            return false
        }
    }


    startCreating(creating: CryptoBox, array: CryptoBox[]) {
        
        if (creating == null && array.length != 0) {
            log("New coming up!")
            creating = array.shift()
            creating.creation()
        }
        log("Created: "+creating.getFormed())
        if (creating != null && creating.getFormed() == true) {
            creating.changeFormedTrue()
            this.boxArray.push(creating)
            log("Pushed!")
            creating = null
        }

    }



    constructor(parent: IEntity, _boxArray: CryptoBox[]) {

        this.boxArray = _boxArray

        this.creatingETH1 = null
        this.creatingETH2 = null
        this.creatingBTC = null

        let steps = Math.floor(Math.random() * 25) + 1
        let step_duration = Math.floor(Math.random() * 7) + 3

        const creationPoint1 = new Vector3(4.5, 5, 4.5)
        const creationPoint2 = new Vector3(27.5, 5, 4.5)
        const creationPoint3 = new Vector3(4.5, 5, 27.5)

        const createdFalse = false
        const ETH1 = new CryptoBox(parent, "ETH", creationPoint1, step_duration, steps, createdFalse)
        this.emptyETH.push(ETH1)

        const ETH2 = new CryptoBox(parent, "ETH", creationPoint2, step_duration, steps, createdFalse)
        this.emptyETH.push(ETH2)

        const BTC1 = new CryptoBox(parent, "BTC", creationPoint3, step_duration * 4, steps * 4, createdFalse)
        this.emptyBTC.push(BTC1)

        engine.addSystem(this)
    }

}