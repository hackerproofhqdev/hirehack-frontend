"use server";

import { cookies } from "next/headers";

export async function login(username:string , password:string) {
    const formdata = new FormData()
    formdata.append("username" , username)
    formdata.append("password" , password)
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/users/login` , {
        method:"POST",
        body:formdata
    })
    const response = await fetcher.json()
    if (response.detail) {
        return {
            status:401,
            error:response.detail
        }
    }
    const {access_token , refresh_token , expire_in} = response
    cookies().set("accessToken" , access_token ,  {
        maxAge:expire_in , httpOnly:true , path:"/"
    })
    cookies().set("refreshToken" , refresh_token , {
        httpOnly:true , path:'/'
    })
    return {
        message:"User Login Sucess",
        status:200
    }
}