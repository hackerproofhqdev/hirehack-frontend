"use server";

import { IUser } from "@/types";
import { cookies } from "next/headers";


export async function getUserProfile() {
    const token = cookies().get("accessToken")
    const response = await fetch(`${process.env.BACKEND_URL}/api/users/profile`, {
        headers:{
            "Authorization":`Bearer ${token?.value}`
        }
    })
    const data = await response.json()
    console.log(data);
    return data as IUser
}