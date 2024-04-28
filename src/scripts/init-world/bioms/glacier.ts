import { BiomModel } from "../../../models/bioms";

export default new BiomModel({ 
    name: 'Glacier',
    color: '#C4D8E2',
    origins: [
        { location: { x: -10, y: 201 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
        { location: { x: 15, y: -166 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
        { location: { x: 25, y: -163 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
        { location: { x: 5, y: -158 }, generationRules: [{ sort: { rand: 1 }, weight: 0.7 }, { sort: { _id: 1 }, weight: 0.3 }] },
    ]
})