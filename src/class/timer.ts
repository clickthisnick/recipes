import { IStep, istep } from "./step";
import { Time } from "./time";

// Start at some number that is much higher than all recipes... for now at least
// TODO think of something better
let id = 1000000
const ids: number[] = []

function getITimerId() {
    ids.push(id)
    id += 1
    return ids[ids.length - 1]
}

export class Timer {
    public static set(duration: number, type: string, text = '', equipment = [''], disappearWhen: string = 'timerIsUp'): IStep {
        const step = istep()
        step.id = getITimerId()
        step.time = Time.convert(duration, type),
        step.showTimer = true
        step.text = text + ` for ${duration} ${type}`
        step.disappearWhen = disappearWhen

        // get rid of [""]
        equipment = equipment.filter(n => n)
        if (equipment) {
            step.equipment = equipment
        }

        return step
    }

    public static end(equipment = ['']): IStep {
        const step = istep()
        const endId = ids.pop()

        if (endId) {
            step.id = endId * 2
        }

        step.style = 'background-color:#8B0000;'
        step.text = ''
        // TODO this is not implemented, we need this to turn green for a few seconds and then disappear when the timer is up
        step.disappearWhen = 'timerIsUp'

        // get rid of [""]
        equipment = equipment.filter(n => n)

        if (equipment) {
            step.equipment = equipment
        }

        return step
    }
}
