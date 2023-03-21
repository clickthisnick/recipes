import { Ingredient } from './ingredients/ingredient';

export interface IStep {
    id: number;
    time: number; // In seconds
    text: string;
    ingredients: Ingredient[]
    equipment: any[]
    children: IStep[]
    style: string;
    disappearWhen: string
    showTimer: boolean
}

let id = 0

function getIStepId() {
    id += 1
    return id
}

export function istep(): IStep {
    return {
        id: getIStepId(),
        time: 0,
        text: '',
        ingredients: [],
        equipment: [],
        children: [],
        style: '',
        disappearWhen: 'clicked',
        showTimer: false,
    }
}
