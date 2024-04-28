import { BiomModel } from "../../../models/bioms";

export default new BiomModel({ 
    name: 'Forest',
    color: '#5FA777',
    origins: [
        { location: { x: -150, y: 50 }, generationRules: [{ sort: { rand: 1 }, weight: 0.4 }, { sort: { _id: 1 }, weight: 0.6 }] },
        { location: { x: -130, y: 40 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
        { location: { x: 150, y: 75 }, generationRules: [{ sort: { rand: 1 }, weight: 0.4 }, { sort: { _id: 1 }, weight: 0.6 }] },
        { location: { x: 160, y: 60 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
    ]
})