import { atom } from 'jotai';
import { z, ZodType } from "zod";

type InfoType = {
    id: string;
    name: string;
    permissions: boolean[];
    color: string;
    type: string | null;
}

export let pick = atom(false);

export const formSchema : ZodType<InfoType> = z.object({

    id : z.string(),
    name : z.string(),
    permissions : z.array(z.boolean()),
    color : z.string(),
    type : z.string().nullable()
  })  

const firstAtom = atom<InfoType[]>([
    {
        id: '1',
        name: 'Président',
        permissions: [true,true,true,true,true,true],
        color: '#55c69b',
        type: 'President'
    },
    {
        id: '2',
        name: 'Secrétaire',
        permissions: [false,true,false,true,false],
        color: '#d7114a',
        type: 'Secretary'
    },
    {
        id: '3',
        name: 'Trésorier',
        permissions: [false,false,true,false,false, false],
        color: '#e9ce16',
        type: 'Treasurer'
    },
    {
        id: '4',
        name: '@everyone',
        permissions: [true, false, false, false, false, false],
        color: '#586d7b', 
        type: null
    }
]);



const selectedAtom = atom<string>('1');



export { firstAtom, selectedAtom };
export type { InfoType };

