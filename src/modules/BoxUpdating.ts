import {CryptoBox} from "src/modules/CryptoBox";
import blockchain_data from "../blockchain_data";

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

        if (this.pendingBoxes.length <= 2) {
            for (let i = 0; i < this.diedBoxes.length; i++) {
                const box = this.diedBoxes[i];
                this.pendingBoxes.push(box);
                box.creation()
            }
        }

        this.diedBoxes = this.diedBoxes.filter(box => {
            return box.isDied()
        })
    }
    constructor(parent: IEntity, boxCount) {
        this.liveBoxes = []

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

        for (let i = 0; i<block_count*0.66;i++){
            const block = blockchain_data[i]
            const tx_count = parseInt(block[1])
            const tx_cost = parseFloat(block[2])


            // let steps = Math.floor(Math.random() * 25) + 1
            // let step_duration = Math.floor(Math.random() * 7) + 3
            let steps = Math.floor(tx_count / tx_count_div)
            let step_duration = Math.floor(tx_cost / tx_cost_div)
            log('steps',steps, 'step duration', step_duration)

            const box = new CryptoBox(parent, 'ETH', step_duration, steps,false)
            this.liveBoxes.push(box)
        }

        for (let i = 0; i<block_count;i++){
            const block = blockchain_data[i]
            const tx_count = parseInt(block[1])
            const tx_cost = parseFloat(block[2])

            let steps = Math.floor(tx_count / tx_count_div)
            let step_duration = Math.floor(tx_cost / tx_cost_div)

            const box = new CryptoBox(parent, 'BTC', step_duration, steps,false)
            this.liveBoxes.push(box)
        }


        let steps = Math.floor(Math.random() * 25) + 1
        let step_duration = Math.floor(Math.random() * 7) + 3

        const ETH1 = new CryptoBox(parent, "ETH", step_duration, steps, true)
        this.diedBoxes.push(ETH1)

        const BTC1 = new CryptoBox(parent, "BTC", step_duration * 8, steps * 8, true)
        this.diedBoxes.push(BTC1)

        engine.addSystem(this)
    }
}