import {CryptoBox} from "src/modules/CryptoBox";
import blockchain_data from "../blockchain_data";

export class BoxUpdating extends Entity implements ISystem {
    private liveBoxes: CryptoBox[];

    private pendingBoxes: CryptoBox[] = [];
    private diedBoxes: CryptoBox[] = [];

    block_stats = {
        block_index: 0,
        tx_cost_div: 1,
        tx_count_div: 1,
        tx_cost_scale_div: 1,
    }

    update(dt: number) {
        for (let i = 0; i < this.liveBoxes.length; i++) {
            const box = this.liveBoxes[i];
            if (box.isLive()) {
                box.update(dt);
            }
            if (box.isDied()) {
                log("Push in emptyArrays.");
                this.diedBoxes.push(box);
            }
        }

        this.liveBoxes = this.liveBoxes.filter(box => {
            return box.isLive()
        })

        for (let i = 0; i < this.pendingBoxes.length; i++) {
            const box = this.pendingBoxes[i];
            if (box.isLive()) {
                log("box living.")
                this.setupBox(box)
                box.makeLive()
                this.liveBoxes.push(box)
            } else {
                // box.update(dt)
            }
        }

        this.pendingBoxes = this.pendingBoxes.filter(box => {
            return !box.isLive() && !box.isDied()
        })

        if (this.pendingBoxes.length < 2 && this.diedBoxes.length > 0) {
            let type = 'BTC'
            for (let i = 0; i < this.pendingBoxes.length; i++) {
                const box = this.pendingBoxes[i];
                if (type === box.getType()) {
                    type = 'ETH'
                    break
                }
            }

            const box = this.diedBoxes.shift()
            log('new pending', type)
            box.setType(type)
            box.creation()
            this.pendingBoxes.push(box);
        }

        this.diedBoxes = this.diedBoxes.filter(box => {
            return box.isDied()
        })
        log(this.liveBoxes.length, this.pendingBoxes.length, this.diedBoxes.length)
    }

    setupBox(box:CryptoBox, randomFraction= false) {
        const block = blockchain_data[this.block_stats.block_index]

        let block_mining_time = 15
        if (this.block_stats.block_index > 0) {
            const prev_block_time = blockchain_data[this.block_stats.block_index - 1][3]
            block_mining_time = (new Date(prev_block_time).getTime() - new Date(block[3]).getTime()) / 1000
            // log('block_mining_time', block_mining_time)
        }

        this.block_stats.block_index++
        if (this.block_stats.block_index >= blockchain_data.length) {
            this.block_stats.block_index = 0
        }
        const tx_count = parseInt(block[1])
        const tx_cost = parseFloat(block[2])

        let steps = Math.floor(tx_count / this.block_stats.tx_count_div)
        let step_duration = tx_cost / this.block_stats.tx_cost_div

        if(box.getType() === 'BTC') {
            steps *= 8
            step_duration *= 6
        }
        let fraction = 0
        if (randomFraction) {
            fraction = Math.random() * 0.5
        }

        let initScale = tx_cost / this.block_stats.tx_cost_scale_div

        if (initScale > 3) {
            initScale = 3
        }
        if (initScale < 0.1) {
            initScale = 0.1
        }

        box.setup(steps, step_duration, block_mining_time, initScale, fraction)
    }


    constructor(parent: IEntity, boxCount:number, reservedBoxCount:number) {
        super('box_parent')
        this.setParent(parent)

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

        this.block_stats.tx_count_div = tx_count_sum / block_count / 750
        this.block_stats.tx_cost_div = tx_cost_sum / block_count / 0.7
        this.block_stats.tx_cost_scale_div = tx_cost_sum / block_count

        this.block_stats.block_index = 0

        for (let i = 0; i<boxCount;i++) {
            let type = 'BTC'
            const typeRand = Math.floor(Math.random() * 100)
            if (typeRand >= 42) {
                type = 'ETH'
            }

            const box = new CryptoBox(this, type, false,this.liveBoxes)
            this.setupBox(box, true)
            this.liveBoxes.push(box)
        }

        for (let i = 0; i<reservedBoxCount;i++) {
            const box = new CryptoBox(this, "ETH", true)
            this.setupBox(box)
            this.diedBoxes.push(box)
        }

        engine.addSystem(this)
    }

    turnOn(parent: IEntity) {
        engine.addSystem(this)
        this.addComponentOrReplace(new Transform({scale: Vector3.One()}))
        this.setParent(parent)
    }

    turnOff() {
        engine.removeSystem(this)
        this.addComponentOrReplace(new Transform({scale: Vector3.Zero()}))
        this.setParent(null)
    }
}