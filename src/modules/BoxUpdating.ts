import {CryptoBox} from "src/modules/CryptoBox";

export class BoxUpdating implements ISystem {
    private liveBoxes: CryptoBox[];

    private pendingBoxes: CryptoBox[] = [];
    private diedBoxes: CryptoBox[] = [];

    update(dt: number) {
        for (let i = 0; i < this.liveBoxes.length; i++) {
            const box = this.liveBoxes[i];
            if (box.isDied()) {
                log("Push in emptyArrays.")
                this.diedBoxes.push(box)
            } else {
                box.update(dt);
            }
        }

        this.liveBoxes = this.liveBoxes.filter(box => {
            return !box.isDied()
        })

        for (let i = 0; i < this.pendingBoxes.length; i++) {
            const box = this.pendingBoxes[i];
            if (box.isLive()) {
                log("Push in emptyArrays.")
                this.liveBoxes.push(box)
            } else {
                // box.update(dt)
            }
        }

        this.pendingBoxes = this.pendingBoxes.filter(box => {
            return !box.isLive() && !box.isDied()
        })

        for (let i = 0; i < this.diedBoxes.length; i++) {
            const box = this.diedBoxes[i];
            this.pendingBoxes.push(box);
            box.creation()
        }

        this.diedBoxes = this.diedBoxes.filter(box => {
            return box.isDied()
        })
    }
    constructor(parent: IEntity, boxCount) {
        this.liveBoxes = []

        for (let i = 0; i < boxCount; i++) {
            let steps = Math.floor(Math.random() * 25) + 1
            let step_duration = Math.floor(Math.random() * 7) + 3
            let type = 'ETH'
            const typeRand = Math.floor(Math.random() * 100)

            if (typeRand >= 40) {
                type = 'BTC'
            }
            const box = new CryptoBox(parent, type, step_duration, steps,false)
            this.liveBoxes.push(box)
        }

        let steps = Math.floor(Math.random() * 25) + 1
        let step_duration = Math.floor(Math.random() * 7) + 3

        const ETH1 = new CryptoBox(parent, "ETH", step_duration, steps, true)
        this.diedBoxes.push(ETH1)

        // const ETH2 = new CryptoBox(parent, "ETH", step_duration, steps, true)
        // this.diedBoxes.push(ETH2)

        const BTC1 = new CryptoBox(parent, "BTC", step_duration * 4, steps * 4, true)
        this.diedBoxes.push(BTC1)

        engine.addSystem(this)
    }

}