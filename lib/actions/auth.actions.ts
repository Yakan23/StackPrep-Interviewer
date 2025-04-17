"use server"

import { auth, db } from "@/firebase/admin"
import { cookies } from "next/headers"

const ONE_WEEK = 60 * 60 * 24 * 7

export async function signUp(params: SignUpParams) {
    const {uid,name,email}=params
    try {
        const userRecord = await db.collection('users').doc(uid).get()

        if (userRecord.exists) {
            return {
                success: false,
                message:"User already exists. Please Sign in instead."
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
            
        })
        return {
            success: true,
            message:"Account Created Successfully. Please    Sign in."
        }
    } catch (error:any) {
        console.log("Error creating the user", error)
        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: "Email Already registered."
            }
        }

        return {
            success: false,
            message: "Account Creation Failed !"
        }
    }
}


export async function setSessionCookies(idToken: string) {
    const cookieStore = await cookies()
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn:ONE_WEEK *1000
    })
    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite:"lax"
    })
}

export async function signIn(params: SignInParams) {
    
    const {email,idToken}=params
    try {
        const userRecord = await auth.getUserByEmail(email)
        if (!userRecord) {
            return {
                success: false,
                message: "User doesn't exist. Please Sign up instead."
            }
        }
        await setSessionCookies(idToken)
    } catch (error:any) {
        console.log("Error Signing in", error)
        return {
                success: false,
                message: "Failed to Sign in."
            }            
        }
}

export async function getCurrentUser(): Promise <User | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")?.value

    if (!sessionCookie) return null
    
    try {

        const decodedClaims= await auth.verifySessionCookie(sessionCookie,true)
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get()

        if(!userRecord.exists) return null

        return {
            ...userRecord.data,
            id:userRecord.id
        } as User
        
    } catch (error) {
        console.log(error)
        return null
    }


}

export async function isAuthenticated() {
    const user = await getCurrentUser()
    return !!user; //convert a truthy or falsy value to true and false boolean 
                   // truthy -> !truthy -> false -> !false -> true (boolean value)
}