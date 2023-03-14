import { IStep, istep } from "./step";
import { Serializer as s } from './serializer';

export class Text {
    // 99 is just an identifier that doesn't start with 0/1/2
    // By default we assume that equipment is reused throughout the recipe

    public static readonly set = (texts: any[]): IStep => {
        const textArray: any[] = []
        const ingredientsArray: any[] = []

        texts.forEach(text => {
            if (typeof text === 'object') {
                textArray.push(s.turnIngObjIntoStr(text, true))
                ingredientsArray.push(text)

            } else {
                textArray.push(text)
            }
        })

        const step = istep()

        step.text = textArray.join(' ')
        step.disappearWhen = 'clicked'
        step.ingredients = ingredientsArray

        return step
    }
}
