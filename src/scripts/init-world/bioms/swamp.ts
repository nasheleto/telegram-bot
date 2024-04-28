import { BiomModel } from "../../../models/bioms";

export default new BiomModel({ 
    name: 'Swamp',
    color: '#4F7942',
    origins: [
        { location: { x: -145, y: -14 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: -1 }, weight: 0.15 }] },
        { location: { x: 154, y: 30 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: -1 }, weight: 0.15 }] },
    ]
})