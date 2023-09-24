'use client'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import Stepper from '../../Components/Stepper'

function Page() {

    return( 
        <div className="bg-gray-900 flex flex-col gap-6 h-screen items-center pt-16">
            <Stepper />
        </div>
    )
}

export default Page