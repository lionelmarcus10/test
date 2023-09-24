import React, { useState } from "react";
import "../Style/Stepper.css";
import { TiTick } from "react-icons/ti";
import { Controller, useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';


const multiStepSchema: ZodType<{ promo: string, validationForte: string, numeroTelephone: string, commentaire: string, nomTitulaire: string, numeroCompte: string, banque: string, iban: string, bic: string, interets: string[], roleAssociation: string }> = z.object({ 
 
  promo: z.string(),
  validationForte: z.string(),
  numeroTelephone: z.string().optional(),
  commentaire: z.string(),
  nomTitulaire: z.string(),
  numeroCompte: z.string(),
  banque: z.string(),
  iban: z.string(),
  bic: z.string(),
  interets: z.array(z.string()),
  roleAssociation: z.string(),
});

{ /* secre +  */ }




const Stepper = () => {
  const steps = ["Vos informations", "Okampus et vous", "Vos associations"];
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  const { register, handleSubmit, getValues, reset, control, formState: {errors}, watch } = useForm<{ promo: string, validationForte: string, numeroTelephone: string, commentaire: string, nomTitulaire: string, numeroCompte: string, banque: string, iban: string, bic: string, interets: string[], roleAssociation: string }>({
    resolver: zodResolver(multiStepSchema)
  })
  
  
  const [etape, setEtape] = useState(1);
  const [currentStage, setCurrentStage] = useState(1);

  const handleClickEtapeSuivante = () => {
    // Votre logique de validation avant de passer à l'étape suivante
    if (currentStage === 1) {
      // Par exemple, vérifiez si les champs de l'étape 1 sont valides avant de passer à l'étape 2
      // Ici, vous pouvez ajouter votre propre logique de validation
      setCurrentStage(2);
    } else if (currentStage === 2) {
      // Par exemple, vérifiez si les champs de l'étape 2 sont valides avant de soumettre le formulaire
      // Ici, vous pouvez ajouter votre propre logique de validation
    }
  };

  const onNextStep = () => {
    if (etape === 1) {
      // Vous pouvez ajouter des validations ici avant de passer à l'étape suivante
      const validationForte = watch('validationForte');
      if (validationForte === 'oui') {
        // Validez le numéro de téléphone français ici si nécessaire
        if (!/^(0|\+33)[1-9][0-9]{8}$/.test(watch('numeroTelephone'))) {
          alert('Veuillez entrer un numéro de téléphone français valide.');
          return;
        }
      }
    }

    setEtape(etape + 1);
  };

  const MutipleSubmit = () => {
    console.log(getValues());
  }

  return (
    <>
      <button className="bg-white px-2 shadow" onClick={()=> console.log(getValues())}>OK</button>
      <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step">
              {i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>

      <div className="">
      <form action="" className="bg-white rounded-lg p-4" onSubmit={handleSubmit(MutipleSubmit)}>
            <div className="STEP_1">
                { /* Partie 1 */ }
                {
                  currentStep === 1 && (
                    <div className="max-w-md mx-auto p-4">
                  {etape === 1 && (
                    <div className="">
                      <h2 className="text-2xl font-semibold mb-4">Étape 1 - Informations générales</h2>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Votre promo</label>
                        <select className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('promo')}>
                          <option value={2023}>2023</option>
                          <option value={2024}>2024</option>
                          <option value={2025}>2025</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Validation forte ?</label>
                        <div>
                          <label className="inline-flex items-center">
                            <input type="radio" value="oui" className="form-radio" {...register('validationForte')} /> Oui
                          </label>
                          <label className="inline-flex items-center ml-4">
                            <input type="radio" value="non" className="form-radio" {...register('validationForte')} /> Non
                          </label>
                        </div>
                      </div>
                      {watch('validationForte') === 'oui' && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Numéro de téléphone</label>
                          <input type="text" className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('numeroTelephone')}  />
                        </div>
                      )}
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Que pensez-vous d'okampus</label>
                        <textarea className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('commentaire')} ></textarea>
                      </div>
                      <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={onNextStep}>Étape suivante</button>
                    </div>
                  )}

                  {etape === 2 && (
                    <div className="">
                      <h2 className="text-2xl font-semibold mb-4">Étape 2 - Informations bancaires</h2>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Nom du titulaire du compte</label>
                        <input type="text" className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('nomTitulaire')} />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Numéro de compte</label>
                        <input type="text" className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('numeroCompte')} />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Banque</label>
                        <input type="text" className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('banque')} />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Code IBAN</label>
                        <input type="text" className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('iban')} />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Code BIC</label>
                        <input type="text" className="block w-full px-4 py-2 border rounded-lg bg-gray-100" {...register('bic')} />
                      </div>
                    </div>
                  )}
                </div>
                  )
                }
                        
            </div>

            { /* Partie 2 */ }

            { currentStep === 2 && ( 
              <div className="">
                <div className="max-w-md mx-auto p-4">
                  <h2 className="text-2xl font-semibold mb-4">Étape 1 - Avatar</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Votre avatar (laisser vide pour l'instant)</label>
                    <input type="file" className="block w-full px-4 py-2 border rounded-lg bg-gray-100" />
                    {/*...register('avatar')*/}
                  </div>

                  <h2 className="text-2xl font-semibold mb-4">Étape 2 - Centre d'intérêts</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Plusieurs choix sélectionnables</label>
                    <div className="space-y-2 space-x-4">
                      <label className="inline-flex items-center">
                        <input type="checkbox" value="Sports" className="form-checkbox" {...register('interets')} /> Sports
                      </label>
                      <label className="inline-flex items-center">
                        <input type="checkbox" value="Jeux vidéos" className="form-checkbox" {...register('interets')} /> Jeux vidéos
                      </label>
                      <label className="inline-flex items-center">
                        <input type="checkbox" value="International" className="form-checkbox" {...register('interets')} /> International
                      </label>
                      <label className="inline-flex items-center">
                        <input type="checkbox" value="Musique" className="form-checkbox" {...register('interets')} /> Musique
                      </label>
                    </div>
                  </div>
                  { /* bouton je ne suis pas président d'association */}
                  <button type="button" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Soumettre</button>
                </div>
              </div>
            ) }  


            { /* Partie 3 */ }
            {
              currentStep === 3 && (
                <div className="max-w-md mx-auto p-4">
                  <div>
                    {currentStage === 1 && (
                      <>
                        <h2 className="text-2xl font-semibold mb-4">Étape 1 - Association</h2>
                        {/* Vos champs de l'étape 1 */}
                        {/* ... */}
                        <label className="block text-sm font-medium mb-2">Votre rôle</label>
                        <Controller
                          name="roleAssociation"
                          control={control}
                          defaultValue="president"
                          render={({ field }) => (
                            <select
                              {...field}
                              className="block w-full px-4 py-2 border rounded-lg bg-gray-100"
                            >
                              <option value="president">Président</option>
                              <option value="secretaire">Secrétaire</option>
                              <option value="tresorier">Trésorier</option>
                            </select>
                          )}
                        />
                      </>
                    )}
                    {currentStage === 2 && (
                      <>
                        {/* Vos champs de l'étape 2 */}
                        {/* ... */}
                        <div>
                        <h2 className="text-2xl font-semibold mb-4">Étape 2 - Votre bureau</h2>
                        <label className="block text-sm font-medium mb-2">Secrétaire</label>
                        <Controller
                          name="secretaireAssociation"
                          control={control}
                          defaultValue="Lionel"
                          render={({ field }) => (
                            <select
                              {...field}
                              className="block w-full px-4 py-2 border rounded-lg bg-gray-100"
                            >
                              <option value="Ivan">Ivan</option>
                              <option value="Lionel">Lionel</option>
                              <option value="Bereket">Bereket</option>
                            </select>
                          )}
                        />
                        <label className="block text-sm font-medium mb-2">Trésorier</label>
                        <Controller
                          name="tresorierAssociation"
                          control={control}
                          defaultValue="Bereket"
                          render={({ field }) => (
                            <select
                              {...field}
                              className="block w-full px-4 py-2 border rounded-lg bg-gray-100"
                            >
                              <option value="Ivan">Ivan</option>
                              <option value="Lionel">Lionel</option>
                              <option value="Bereket">Bereket</option>
                            </select>
                          )}
                        />
                      </div>
                              </>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={handleClickEtapeSuivante}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 my-5"
                          >
                            {currentStage === 1 ? 'Étape suivante' : "End"}
                          </button>
                    </div>
              )
            }
            

            { etape === 2   &&  !complete && (
        <button
          className="btn mx-auto "
          type='submit'
          onClick={() => {
            currentStep === steps.length
              ? setComplete(true)
              : setCurrentStep((prev) => prev + 1);
          }}
        >
          {currentStep === steps.length ? "Terminé" : "Prochaine étape"}
        </button>
      )}

        </form>
        
      </div>


      

      
    </>
  );
};

export default Stepper;