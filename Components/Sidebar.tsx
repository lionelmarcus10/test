import React, { useRef } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z, ZodType } from "zod";
import { InfoType, firstAtom, selectedAtom } from '@/Store/Store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from "jotai";

function Sidebar() {
  
  const [ display, setDisplay ] = useAtom(firstAtom);
  const [ selected, setSelected ] = useAtom(selectedAtom);

  const nameSchema: ZodType<{name: string}> = z.object({ 
    name:   z.string().min(3).refine((data) =>  !data.includes(" "), {
    message: 'not match',
    path: ['name'], 
  })});



  const { register, handleSubmit, getValues, formState: {errors} } = useForm<{ name: string}>({ resolver : zodResolver(nameSchema)});

    const onSubmit = () => {
        const newInfo = {
            id: (parseInt(display[display.length - 1].id) + 1).toString(),
            name: getValues('name') ,
            color: '#000',
            permissions: [true, false, false, false, false, false],
            type: null
        } as InfoType;
        console.log(getValues('name'));
        setDisplay([...display, newInfo]);
    };


  return (
    <aside className="flex flex-col py-12 lg:w-3/12 2xl:w-2/12 w-2/12 fixed px-4 border-r-2 space-y-6 id top-0 left-0 z-40 h-screen transition-transform -translate-x-full sm:translate-x-0 mr-24" aria-label="Sidebar">
        <div className="flex justify-between">
            <div className="flex text-gray-500 items-center space-x-2">
                <Image src="/back.svg" alt="back icon" width={25} height={15} priority={true}/>
                <p className='font-bold '>RETOUR</p>
            </div>
            <button onClick={() => { document.getElementById('roleAddInput')?.classList.toggle('hidden')}}>
                <Image src="/add.svg" alt="add icon" width={25} height={25} priority={true}/>
            </button>
        </div>

        <div className="flex flex-col pl-4 space-y-2">
            {
                /* map firstatom to display name and put color */
                display.map((element: InfoType): JSX.Element  => (
                    <div className={`flex font-bold space-x-2 items-center p-1 rounded hover:cursor-pointer ${selected === element.id ? 'bg-[#e1e1e4]' : ''}`} key={element.id} onClick={()=> setSelected(element.id)}>
                        <div style={{ backgroundColor: element.color }} className={` p-2 ml-3 rounded-full`}></div>
                        <p>{element.name}</p>
                    </div>
                ))
            }
        <div className={`flex font-bold space-x-2 items-center p-1 rounded `}>
           
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name")}  id="roleAddInput" type="text" placeholder='Nom du nouveau rôle' className=' hidden text-sm border-2 border-black font-semibold pl-2 p-1 rounded w-full'/>
                { errors.name && <span className='text-red-500'>{errors.name.message}</span> }
            </form>
              
        </div>

        </div>
    </aside>
  )
}

export default Sidebar