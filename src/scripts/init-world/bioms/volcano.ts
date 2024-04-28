import { BiomModel } from "../../../models/bioms";

export default new BiomModel({ 
    name: 'Volcano',
    color: '#AE0C00',
    origins: [
        { location: { x: 267, y: 153 }, generationRules: [{ sort: { rand: 1 }, weight: 0.25 }, { sort: { _id: 1 }, weight: 0.75 }], boundaries: { top: { value: 160, mode: 'soft' }, bottom: { value: 148, mode: 'soft' }, left: { value: 258, mode: 'soft' }, right: { value: 275, mode: 'soft' } } },
        { location: { x: 247, y: 143 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { right: { value: 249, mode: 'soft' } } }, 
        { location: { x: 264, y: 173 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { bottom: { value: 170, mode: 'soft' } } },
        { location: { x: 287, y: 148 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { left: { value: 280, mode: 'soft' } } },
        { location: { x: 265, y: 133 }, generationRules: [{ sort: { rand: 1 }, weight: 0.85 }, { sort: { _id: 1 }, weight: 0.25 }], boundaries: { top: { value: 142, mode: 'soft' } } },
    ]
})