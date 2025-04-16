"use client"

import { authFormSchema } from '@/lib/utils';
import React, { useState } from 'react'
import { Control, Controller, Path,FieldValues } from 'react-hook-form'
import { z } from 'zod';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from './ui/form';
import { Input } from './ui/input';



interface FormFieldProps<T extends FieldValues>{
    control:Control<T> ,
    name: Path<T>,
    label: string,
    placeHolder: string,
    inputType:string,
}

const AuthFormInput = ({control,name,label,placeHolder,inputType }: FormFieldProps<T>) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    return (
         <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='label'>{label}</FormLabel>
                            <FormControl>
                                <Input
                                    className='input'
                                    placeholder={placeHolder}
                                    type={inputType}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>    
                    )}
              />
    )
}

export default AuthFormInput