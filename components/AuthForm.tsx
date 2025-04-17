"use client"

import { authFormSchema } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form} from './ui/form'
import { Button } from './ui/button'
import AuthFormInput from './AuthFormInput'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { auth } from '@/firebase/client'
import { signIn, signUp } from '@/lib/actions/auth.actions'







const AuthForm = ({ type }: {type:FormType}) => {
    
    const router = useRouter()
    const formSchema = authFormSchema(type)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username:"",
            // profileImage:undefined,
            // resumeFile:undefined,
            email:"",
            password:"",

        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>)  {
        try {
            if (type === "sign-in") {
                const { email, password } = values
                const userCredentials = await signInWithEmailAndPassword(auth,email,password)
                const idToken = await userCredentials.user.getIdToken();

                if (!idToken) {
                    toast.error("Sign in failed !")
                    return;
                }

                await signIn({
                    email, idToken
                })
                
                toast.success("Signed in successfully.")
                router.push("/")
            }
            if (type === "sign-up") {
                const { username, email, password } = values
                const userCredentials = await createUserWithEmailAndPassword(auth,email,password)
                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name:username!,
                    email,
                    password
                })
                if (!result?.success) {
                    toast.error(result?.message)
                    return
                }
                toast.success("Account created successfully. Please sign in.")
                router.push("/sign-in")
            }
        } catch (error) {
            console.log(error)
            toast.error(`There was an error:${error}`)
        }
    }
    
    return (
        <div className='card-border lg:min-w-[556px]'>
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className='flex flex-row gap-2 justify-center'>
                    <Image
                        src="/logo.svg"
                        width={38}
                        height={32}
                        alt='Logo'
                    />
                    <h2 className='text-primary-100'>
                        Stack Prep
                    </h2>
                </div>
                <h3>
                    Practice Job Interviews With AI
                </h3>



            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6 mt-4 form'>
                    {type === "sign-up" && (<AuthFormInput
                        control={form.control}
                        name="username"
                        label='Full name'
                        placeHolder='Enter your username'
                        inputType='text'
                    />
                    )}
                    <AuthFormInput
                        control={form.control}
                        name="email"
                        label='Email'
                        placeHolder='Enter your email'
                        inputType='email'
                    />
                    <AuthFormInput
                        control={form.control}
                        name="password"
                        label='Password'
                        placeHolder='Enter your password'
                        inputType='password'
                    />
                    {/* <AuthFormInput
                        control={form.control}
                        name="profileImage"
                        label='Profile Picture'
                        placeHolder='Upload an image'
                        inputType='file'
                    />
                    <AuthFormInput
                        control={form.control}
                        name="resumeFile"
                        label='Resume'
                        placeHolder='Upload your resume (.pdf)'
                        inputType='file'
                    /> */}
                    <Button className="btn" type="submit">
                            {type === "sign-in"? "Sign In" :"Create An Account"}
                    </Button>
                </form>
            </Form>
            <p className='text-center'>
                    {type === "sign-in" ? "No account yet ?" : "Have an account already?"}
                    <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className='font-bold text-user-primary ml-1'>
                        {type==="sign-in"? "Sign up" : "Sign in"}
                    </Link>
            </p>    
        </div>
    </div>
  )
}

export default AuthForm