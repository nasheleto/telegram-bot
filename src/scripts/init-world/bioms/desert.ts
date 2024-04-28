import { BiomModel } from "../../../models/bioms";

export default new BiomModel({ 
    name: 'Desert',
    color: '#DEB887',
    origins: [
        { location: { x: -5, y: 10 }, generationRules: [{ sort: { rand: 1 }, weight: 0.2 }, { sort: { _id: 1 }, weight: 0.8 }], boundaries: { top: { mode: 'soft', value: 19 }, bottom: { mode: 'soft', value: -22 }, left: { mode: 'soft', value: -40 }, right: { mode: 'soft', value: 40 } } },
        { location: { x: 5, y: -4 }, generationRules: [{ sort: { rand: 1 }, weight: 0.2 }, { sort: { _id: 1 }, weight: 0.8 }], boundaries: { top: { mode: 'soft', value: 19 }, bottom: { mode: 'soft', value: -24 }, left: { mode: 'soft', value: -50 }, right: { mode: 'soft', value: 50 } } },
    ]
})