import { BiomModel } from "../../../models/bioms";

export default new BiomModel({ 
    name: 'Mountain',
    color: '#996666',
    origins: [
        { location: { x: 93, y: 102 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
        { location: { x: -85, y: -126 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
    ]
})