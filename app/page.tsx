'use client'

import Sidebar from '@/Components/Sidebar'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'
import { z, ZodType } from "zod";
import { InfoType, firstAtom, selectedAtom, formSchema, pick } from '@/Store/Store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom } from "jotai";
import { SketchPicker, TwitterPicker } from 'react-color';
import { useEffect, useState, useRef } from 'react';

export default function Home() {

  // utiliser l'atome firstAtom défini dans Store.tsx
  const [ selected, setSelected ] = useAtom(selectedAtom);
  const [ display, setDisplay ] = useAtom(firstAtom);

  /* Supprimer */
  const initialDisplayCopy = JSON.parse(JSON.stringify(display));
  const [tempDisplay, setTempDisplay] = useState(initialDisplayCopy);
  /* Fin suppression */

  const [ modified , setModified ] = useState(false);
  const modificationListRef = useRef<InfoType[]>([]);



  const formSchem: ZodType<{name: string, color: string, permissions: boolean[] }> = z.object({ 
    name:   z.string().min(3).refine((data) =>  !data.includes(" "), {
    message: 'not match',
    path: ['name'], 
  }),
  color: z.string(),
  permissions: z.array(z.boolean())

  });


  const { register, handleSubmit, getValues, reset, control, formState: {errors} } = useForm<{name: string, color: string, permissions: boolean[] }>({ 
    resolver : zodResolver(formSchem),
    defaultValues: {
      name: modificationListRef.current.find((element : InfoType) => element.id === selected)?.name ?? display.find((element : InfoType) => element.id === selected)?.name,
      permissions: modificationListRef.current.find((element : InfoType) => element.id === selected)?.permissions ?? tempDisplay.find((element: InfoType) => element.id === selected)?.permissions,
      color: modificationListRef.current.find((element : InfoType) => element.id === selected)?.color ?? display.find((element: InfoType) => element.id === selected)?.color,
    }
  });
  
  const [ colorPalette, setColorPalette ] = useState<string>('');
  const [ view, setView ] = useState<string>('Affichage');
  
  let [ currentPick, setCurrentPick ] = useAtom(pick);
  
  useEffect(() => {
    reset({
      name: modificationListRef.current.find((element : InfoType) => element.id === selected)?.name ?? display.find((element : InfoType) => element.id === selected)?.name,
      permissions: modificationListRef.current.find((element : InfoType) => element.id === selected)?.permissions ?? tempDisplay.find((element: InfoType) => element.id === selected)?.permissions,
      color: modificationListRef.current.find((element : InfoType) => element.id === selected)?.color ?? display.find((element: InfoType) => element.id === selected)?.color,
    });
    // ajouter le nouvel element de display dans tempDisplay si il n'existe pas
    const selectedElement =   JSON.parse(JSON.stringify(display.find((element: InfoType) => element.id === selected)));
    if (selectedElement && !tempDisplay.find((element: InfoType) => element.id === selected)) {
      setTempDisplay([...tempDisplay, selectedElement]);
    }
  }, [selected]);

  const onSubmit = () => {
    console.log("submited");

    // modifier dans le global chaque élément de la liste des modifications
    modificationListRef.current.forEach((element: InfoType) => {
      const selectedElement = display.find((element2: InfoType) => element2.id === element.id);
      if (selectedElement) {
        selectedElement.name = element.name;
        selectedElement.color = element.color;
        selectedElement.permissions = element.permissions;
      }
    });
    modificationListRef.current = [];
    setModified(false);

  }


  const buttonClassName = view === 'Affichage' ? 'border-b-[#9443f9] border-b-2' : 'hover:border-gray-300 hover:border-b-2';
  const buttonClassName2 = view === 'Permissions' ? 'border-b-[#9443f9] border-b-2' : 'hover:border-gray-300 hover:border-b-2';

  function ok(e: React.ChangeEvent<HTMLInputElement>) {
    let modificationGlobalState = false;
    let modificationLocalRef = false;
    let notFoundInLst = false;
    
    // verifier si n'a pas été modifié par rapport au display
    const alteredElement = display.find((element: InfoType) => element.id === selected);
    if (alteredElement && alteredElement.hasOwnProperty(e.target.name) && alteredElement[e.target.name as keyof InfoType] !== e.target.value) {
      modificationGlobalState = true;
    }
    // verifier si n'a pas été modifié par rapport aux éléments de la liste des modifications
    if (modificationListRef.current.length > 0) {
      const alteredElementLocal = modificationListRef.current.find((element: InfoType) => element.id === selected);
      if (alteredElementLocal ){ 
       if (alteredElementLocal.hasOwnProperty(e.target.name) && alteredElementLocal[e.target.name as keyof InfoType] !== e.target.value) {
        modificationLocalRef = true;
       }
      }else{
        notFoundInLst = true;
      }
    }

    console.log("modificationGlobalState : ", modificationGlobalState)
    console.log("modificationLocalRef : ", modificationLocalRef)
    
    if( modificationGlobalState && !modificationLocalRef && modificationListRef.current.length === 0 ) {

      // copier l'élément dans la liste des modifications à partir de display et modifier juste la propriété modifiée
      const alteredElementLocal = JSON.parse(JSON.stringify(display.find((element: InfoType) => element.id === selected)));
      alteredElementLocal[e.target.name as keyof InfoType] = e.target.value;
      modificationListRef.current = [...modificationListRef.current, alteredElementLocal];
      console.log("ajouté car vide")
      console.log("après ajout : ", modificationListRef.current.length, modificationListRef.current)

    } else if ( modificationGlobalState && !modificationLocalRef && notFoundInLst  ){
      
      const alteredElementLocal = JSON.parse(JSON.stringify(display.find((element: InfoType) => element.id === selected)));
      alteredElementLocal[e.target.name as keyof InfoType] = e.target.value;
      console.log("avant ajout : ", modificationListRef.current.length)
      modificationListRef.current = [...modificationListRef.current, alteredElementLocal];
      console.log("ajouté avec push après selected non trouvé")
      console.log("après ajout : ", modificationListRef.current.length, modificationListRef.current)
      
    } else if( modificationGlobalState && modificationLocalRef ) {

     let alteredElementLocalTemp = modificationListRef.current.find((element: InfoType) => element.id === selected);

     if(alteredElementLocalTemp){
      alteredElementLocalTemp[e.target.name as keyof InfoType] = e.target.name === 'permissions' ? e.target.value.split(',') as any : e.target.value;
      console.log("avant ajout avec existance : ", modificationListRef.current.length)
      let elementToUpdate = modificationListRef.current.find((element: InfoType) => element.id === selected);
      if (elementToUpdate) {
        elementToUpdate = alteredElementLocalTemp;
      }
      console.log("ajouté avec exist trouvé")
      console.log("après ajout : ", modificationListRef.current.length, modificationListRef.current)
    } else{
     // copier l'élément dans la liste des modifications à partir de display et modifier juste la propriété modifiée
      const alteredElementLocal = JSON.parse(JSON.stringify(display.find((element: InfoType) => element.id === selected)));
      alteredElementLocal[e.target.name as keyof InfoType] = e.target.value;
      console.log("avant ajout : ", modificationListRef.current.length)
      modificationListRef.current = [...modificationListRef.current, alteredElementLocal];
      console.log("ajouté avec push")
      console.log("après ajout : ", modificationListRef.current.length, modificationListRef.current)
     }
    } else if ( !modificationGlobalState && modificationLocalRef ) {
     // supprimer l'élément de la liste des modifications
      console.log("avant suppression : ", modificationListRef.current.length)
      modificationListRef.current = modificationListRef.current.filter((element: InfoType) => element.id !== selected);
      console.log("supprimé car correspond à display")
      console.log("après suppression : ", modificationListRef.current.length)
    }



    // verifier si le name de l'event est permissions
    if (e.target.name === 'permissions') {
      // verifier si il est égale au display ou pas 
      const comparerListesPermissions = display.find((element: InfoType) => element.id === selected)?.permissions.toString() === modificationListRef.current.find((element: InfoType) => element.id === selected)?.permissions.toString();
      const comparerListesColor = display.find((element: InfoType) => element.id === selected)?.color === modificationListRef.current.find((element: InfoType) => element.id === selected)?.color;
      const comparerListesName = display.find((element: InfoType) => element.id === selected)?.name === modificationListRef.current.find((element: InfoType) => element.id === selected)?.name;
      if( comparerListesPermissions && comparerListesColor && comparerListesName ){
        // si oui supprimer l'élément de la liste des modifications
        console.log("avant suppression : ", modificationListRef.current.length)
        modificationListRef.current = modificationListRef.current.filter((element: InfoType) => element.id !== selected);
        console.log("supprimé car correspond à display")
        console.log("après suppression : ", modificationListRef.current.length)
      }
    }



    if (modificationListRef.current.length > 0 && !modified) {
      setModified(true);
    }else if(modificationListRef.current.length === 0 && modified){
      setModified(false);
    }
  }

  function reinit(){
    modificationListRef.current = [];
    reset({
      name:  display.find((element : InfoType) => element.id === selected)?.name,
      permissions: display.find((element: InfoType) => element.id === selected)?.permissions,
      color: display.find((element: InfoType) => element.id === selected)?.color,
    })
    setModified(false);
  }
  
  return (
    <>
      <Sidebar />
      <div className=" p-4 sm:ml-64 lg:ml-80 xl:ml-[390px] 2xl:ml-[300px] ">
        <div className="px-4 py-12 flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Modifier le Rôle - <span> </span> 
            {
              display.find((element: InfoType) => element.id === selected)?.name ?? ""
            }
            
           </h1>   
            <Image src="/more.svg" alt="more" width={40} height={40} priority={true}/>

          </div>

          <div className=" mb-4 border-b-2 border-gray-200 dark:border-gray-700">

            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center space-x-10" id="myTab" >
                <li className="" onClick={()=> setView("Affichage")}>
                    <button className={ `inline-block py-4   ${buttonClassName} rounded-t-lg font-semibold text-gray-500` } id="Affichage" type="button">Affichage</button>
                </li>
                <li className="" onClick={()=> setView("Permissions")} >
                    <button className={`inline-block py-4 ${buttonClassName2} border-transparent rounded-t-lg font-semibold text-gray-500`} id='Permissions'>Permissions</button>
                </li>
            </ul>


          </div>

 


          <form id="myTabContent" onSubmit={handleSubmit(onSubmit)} >



            <div className=" py-4 rounded-lg text-gray-500" id="profile">
              
                {
                  /* Affichage */
                  view === 'Affichage' &&
                  (<div className='space-y-6 w-1/3 ' >
                    <div className="space-y-3 border-b-2 border-gray-200 pb-6">
                        <h6 className='font-bold '>NOM DU RÔLE<span className='text-red-500 pl-1 text-sm'>*</span></h6>
                        <input {...register("name") } onChange={(e)=> { ok(e)}} type="text" placeholder='Role' className='bg-[#ebebeb] p-2 rounded w-full text-black placeholder:text-gray-500' />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        <p className='text-purple-500' onClick={()=> console.log(display,getValues(),modificationListRef.current)}>Supprimer les permissions</p>


                    </div>

                    <div className="flex flex-col space-y-2">

                      <div className="space-y-2">
                        <h6 className='font-bold '>COULEUR DU RÔLE<span className='text-red-500 pl-1 text-sm'>*</span></h6>
                        <p className='text-xs font-semibold '>Les membres utilisent la couleur du rôle le plus élevé qu'ils ont dans la liste des rôles</p>
                      </div>

                      <div className="flex space-x-2 w-full " >

                        <div className="bg-red-500 px-2 w-12 h-12 rounded" style={{ backgroundColor: display.find((element: InfoType) => element.id === selected)?.color }}>
                        
                        </div>
                        
                        <div style={{ display: currentPick === true ? "none" : undefined }} className="w-12 h-12 rounded shadow-sm border flex items-start justify-end" id="picker_button" onClick={()=> setCurrentPick(true)}>
                          <Image src="picker.svg" alt="color" width={15} height={15} priority={true}/>
                        </div>

                        

                        <div style={{ display: currentPick === false ? "none" : undefined }}>
                        <Controller
                          name="color"
                          control={control}
                          render={({ field }) => (
                                <SketchPicker color={colorPalette}
                                  onChangeComplete={(color) => {
                                    setColorPalette(color.hex);
                                    field.onChange(color.hex);
                                    const customEvent = new CustomEvent("input", {
                                      bubbles: true,
                                      detail: {
                                        target: {
                                          name: "color",
                                          value: color.hex,
                                        },
                                      },
                                    });
                                    ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                                  }} 
                                  />
                           
                          )}
                        />

                        </div>
                        <Controller
                          name="color"
                          control={control}
                          render={({ field }) => (
                            <TwitterPicker
                              color={colorPalette}
                              onChangeComplete={(color) => {
                                setColorPalette(color.hex);
                                field.onChange(color.hex);                                
                                const customEvent = new CustomEvent("input", {
                                  bubbles: true,
                                  detail: {
                                    target: {
                                      name: "color",
                                      value: color.hex,
                                    },
                                  },
                                });
                                ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)

                              }}
                              className="h-auto grow"
                            />
                          )}
                        />

                      </div>

                    </div>

                </div>)}
            </div>

            

            {
              /* Permissions */
              view === 'Permissions' && 
              <>

              <div className="flex justify-between font-bold w-full">
                <p className='text-gray-500'>PERMISSIONS GÉNÉRALES DE SERVEUR</p>
                <p className='text-purple-500' onClick={()=> console.log(display,getValues(),tempDisplay)}>Supprimer les permissions</p>
              </div>
              <div className="flex flex-col py-4 space-y-5">

                  <div className="space-y-2 border-b-2 pb-8">
                    <div className="flex justify-between items-center">
                      <h6 className='font-bold text-lg text-gray-700'>Voir les salons</h6>

                      <label className="">
                        <input
                          {...register("permissions.0")}
                          
                          type="checkbox"
                          className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                          checked={tempDisplay.find((element: InfoType) => element.id === selected)?.permissions[0] === true}
                          onClick={() => {
                            const selectedElement = tempDisplay.find((element: InfoType) => element.id === selected);
                            
                            if (selectedElement && !selectedElement.permissions[0]) {
                              selectedElement.permissions[0]  = true;
                              setTempDisplay([...tempDisplay]);
                              const customEvent = new CustomEvent("input", {
                                bubbles: true,
                                detail: {
                                  target: {
                                    name: "permissions",
                                    value: selectedElement.permissions,
                                  },
                                },
                              });
                              ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                            }else{
                              if (selectedElement && selectedElement.permissions[0] === true) {
                                selectedElement.permissions[0]  = false;
                                setTempDisplay([...tempDisplay]);
                                const customEvent = new CustomEvent("input", {
                                  bubbles: true,
                                  detail: {
                                    target: {
                                      name: "permissions",
                                      value: selectedElement.permissions,
                                    },
                                  },
                                });
                                ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                              }
                            }
                          }}
                        />
                        <span className="bg-[#81828f] w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1  rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                      </label>

                    </div>
                    <p className='text-sm text-gray-500 font-semibold'>Permet aux membres de voir les salons par défaut (à l'éxception des salons privés) </p>
                  </div>

                  <div className="space-y-2 border-b-2 pb-8">
                    <div className="flex justify-between items-center">
                      <h6 className='font-bold text-lg text-gray-700'>Gérer les salons</h6>

                      <label className="">
                        <input type="checkbox"
                               {...register("permissions.1")}
                               className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                               checked={tempDisplay.find((element: InfoType) => element.id === selected)?.permissions[1]}
                               onClick={() => {
                                  
                                  const selectedElement = tempDisplay.find((element: InfoType) => element.id === selected);
                                  if (selectedElement && !selectedElement.permissions[1]) {
                                    selectedElement.permissions[1] = true;
                                    setTempDisplay([...tempDisplay]);
                                    const customEvent = new CustomEvent("input", {
                                      bubbles: true,
                                      detail: {
                                        target: {
                                          name: "permissions",
                                          value: selectedElement.permissions,
                                        },
                                      },
                                    });
                                    ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                                  }else{
                                    if (selectedElement && selectedElement.permissions[1]) {
                                      selectedElement.permissions[1] = false;
                                      setTempDisplay([...tempDisplay]);
                                      const customEvent = new CustomEvent("input", {
                                        bubbles: true,
                                        detail: {
                                          target: {
                                            name: "permissions",
                                            value: selectedElement.permissions,
                                          },
                                        },
                                      });
                                      ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                                    }
                                  }
                                }}
                         />
                        <span className="bg-[#81828f] w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1  rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                      </label>

                    </div>
                    <p className='text-sm text-gray-500 font-semibold'>Permet aux membres de voir les salons par défaut (à l'éxception des salons privés) </p>
                  </div>

                  <div className="space-y-2 border-b-2 pb-8">
                    <div className="flex justify-between items-center">
                      <h6 className='font-bold text-lg text-gray-700'>Gérer les rôles</h6>

                      <label className="">
                        <input type="checkbox"
                         {...register("permissions.2")}
                         className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                         checked={tempDisplay.find((element: InfoType) => element.id === selected)?.permissions[2]}
                          onClick={() => {
                            
                            const selectedElement = tempDisplay.find((element: InfoType) => element.id === selected);
                            if (selectedElement && !selectedElement.permissions[2]) {
                              selectedElement.permissions[2] = true;
                              setTempDisplay([...tempDisplay]);
                              const customEvent = new CustomEvent("input", {
                                bubbles: true,
                                detail: {
                                  target: {
                                    name: "permissions",
                                    value: selectedElement.permissions,
                                  },
                                },
                              });
                              ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                            }else{
                              if (selectedElement && selectedElement.permissions[2]) {
                                selectedElement.permissions[2] = false;
                                setTempDisplay([...tempDisplay]);
                                const customEvent = new CustomEvent("input", {
                                  bubbles: true,
                                  detail: {
                                    target: {
                                      name: "permissions",
                                      value: selectedElement.permissions,
                                    },
                                  },
                                });
                                ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                              }
                            }
                          }} />
                        <span className="bg-[#81828f] w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                      </label>

                    </div>
                    <p className='text-sm text-gray-500 font-semibold'>Permet aux membres de voir les salons par défaut (à l'éxception des salons privés) </p>
                  </div>

                  <div className="space-y-2 border-b-2 pb-8">
                    <div className="flex justify-between items-center">
                      <h6 className='font-bold text-lg text-gray-700'>Créer des expressions</h6>

                      <label className="">

                        <input type="checkbox"
                          {...register("permissions.3")}
                         className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                         checked={tempDisplay.find((element: InfoType) => element.id === selected)?.permissions[3]}
                          onClick={() => {
                            
                            const selectedElement = tempDisplay.find((element: InfoType) => element.id === selected);
                            if (selectedElement && !selectedElement.permissions[3]) {
                              selectedElement.permissions[3] = true;
                              setTempDisplay([...tempDisplay]);
                              const customEvent = new CustomEvent("input", {
                                bubbles: true,
                                detail: {
                                  target: {
                                    name: "permissions",
                                    value: selectedElement.permissions,
                                  },
                                },
                              });
                              ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                            }else{
                              if (selectedElement && selectedElement.permissions[3]) {
                                selectedElement.permissions[3] = false;
                                setTempDisplay([...tempDisplay]);
                                const customEvent = new CustomEvent("input", {
                                  bubbles: true,
                                  detail: {
                                    target: {
                                      name: "permissions",
                                      value: selectedElement.permissions,
                                    },
                                  },
                                });
                                ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                              }
                            }
                          }} />
                        <span className="bg-[#81828f] w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1  rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                      </label>

                    </div>
                    <p className='text-sm text-gray-500 font-semibold'>Permet aux membres de voir les salons par défaut (à l'éxception des salons privés) </p>
                  </div>
                  
                  <div className="space-y-2 border-b-2 pb-8">
                    <div className="flex justify-between items-center">
                      <h6 className='font-bold text-lg text-gray-700'>Gérer les expressions</h6>

                      <label className="">
                        <input type="checkbox"
                          {...register("permissions.4")}
                         className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                         checked={tempDisplay.find((element: InfoType) => element.id === selected)?.permissions[4]}
                          onClick={() => {
                            
                            const selectedElement = tempDisplay.find((element: InfoType) => element.id === selected);
                            if (selectedElement && !selectedElement.permissions[4]) {
                              selectedElement.permissions[4] = true;
                              setTempDisplay([...tempDisplay]);
                              const customEvent = new CustomEvent("input", {
                                bubbles: true,
                                detail: {
                                  target: {
                                    name: "permissions",
                                    value: selectedElement.permissions,
                                  },
                                },
                              });
                              ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                            }else{
                              if (selectedElement && selectedElement.permissions[4]) {
                                selectedElement.permissions[4] = false;
                                setTempDisplay([...tempDisplay]);
                                const customEvent = new CustomEvent("input", {
                                  bubbles: true,
                                  detail: {
                                    target: {
                                      name: "permissions",
                                      value: selectedElement.permissions,
                                    },
                                  },
                                });
                                ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                              }
                            }
                          }} />
                        <span className="bg-[#81828f] w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1  rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                      </label>

                    </div>
                    <p className='text-sm text-gray-500 font-semibold'>Permet aux membres de voir les salons par défaut (à l'éxception des salons privés) </p>
                  </div>

                  <div className="space-y-2 border-b-2 pb-8">
                    <div className="flex justify-between items-center">
                      <h6 className='font-bold text-lg text-gray-700'>Voir les logs du serveur</h6>

                      <label className="">
                        <input type="checkbox"
                          {...register("permissions.5")}
                         className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
                         checked={ tempDisplay.find((element: InfoType) => element.id === selected)?.permissions[5]}
                          onClick={() => {
                            
                            const selectedElement = tempDisplay.find((element: InfoType) => element.id === selected);
                            if (selectedElement && !selectedElement.permissions[5]) {
                              selectedElement.permissions[5] = true;
                              setTempDisplay([...tempDisplay]);
                              const customEvent = new CustomEvent("input", {
                                bubbles: true,
                                detail: {
                                  target: {
                                    name: "permissions",
                                    value: selectedElement.permissions,
                                  },
                                },
                              });
                              ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                            }else{
                              if (selectedElement && selectedElement.permissions[5]) {
                                selectedElement.permissions[5] = false;
                                setTempDisplay([...tempDisplay]);
                                const customEvent = new CustomEvent("input", {
                                  bubbles: true,
                                  detail: {
                                    target: {
                                      name: "permissions",
                                      value: selectedElement.permissions,
                                    },
                                  },
                                });
                                ok(customEvent.detail as React.ChangeEvent<HTMLInputElement>)
                              }
                            }
                          }} />
                        <span className="bg-[#81828f] w-16 h-10 flex items-center flex-shrink-0 ml-4 p-1 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-8 after:h-8 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-6"></span>
                      </label>

                    </div>
                    <p className='text-sm text-gray-500 font-semibold'>Permet aux membres de voir les salons par défaut (à l'éxception des salons privés) </p>
                  </div>

              </div>
              </>

            }

            {
              modified && (
                <div className="flex items-center fixed animate-bounce space-x-6 left-[30%] py-2 px-3 rounded-md shadow bg-white drop-shadow-lg " id="monBouton">
                   <p>Attention, il reste des modifications non enregistrées !</p>
                   <button className='hover:underline underline-offset-2' onClick={()=> reinit()}>Reinitialiser</button>
                   <button type='submit' className="bg-green-500 p-2 rounded text-white shadow-lg" > Enregistrer les modifications </button>
            </div>
              )
            }
            
          </form>

      </div>



    </div>
        
    </>
  )
}

