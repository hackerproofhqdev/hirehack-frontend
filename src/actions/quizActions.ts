"use server";

import { cookies } from "next/headers";


export const generateQuiz = async (jobTitle:string, jobDescription:string , numQuiz:number) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/quiz/generate` , {
        method:"POST",
        body:JSON.stringify({job_title:jobTitle , num_quiz:numQuiz , job_description:jobDescription}),
        headers:{
            "Authorization":`Bearer ${accessToken?.value}`,
            "Content-Type":"application/json"
        }
    })
    const response = await fetcher.json()
    console.log(response)
    return response
}
