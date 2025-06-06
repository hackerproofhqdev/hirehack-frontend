"use server";

import { cookies } from "next/headers";


const buildResume = async (role: string, job_description: string) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/resume/create-resume`, {
        method: "POST",
        body: JSON.stringify({ role, job_description }),
        headers: {
            "Authorization": `Bearer ${accessToken?.value}`,
            "Content-Type": "application/json"
        }
    })
    const response = await fetcher.json()
    return response
}


const generateResume = async (name: string, email: string, phoneNum: string, profileDesc: string, educDesc: string, skillsDesc: string, expDesc: string) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/generate/resume`, {
        method: "POST",
        body: JSON.stringify(
            {
                name: name,
                email: email,
                phone_num: phoneNum,
                profile_desc: profileDesc,
                education_desc: educDesc,
                experience_desc: expDesc,
                skills_description: skillsDesc
            }

        ),
        headers: {
            "Authorization": `Bearer ${accessToken?.value}`,
            "Content-Type": "application/json"
        }
    })
    const response = await fetcher.json()
    return response
}


const readFile = async (formData: FormData) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/resume/read`, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${accessToken?.value}`,
        }
    })
    const response = await fetcher.json()
    console.log(response);

    return response
}


const saveResume = async (userID:number,title:string , resumeData:string  ,formatID:number | null) => {
    const accessToken = cookies().get("accessToken")
     const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/save/resume`, {
        method: "POST",
        body: JSON.stringify({user_id:userID , resume_data:resumeData , format_id:formatID , title}),
        headers: {
            "Authorization": `Bearer ${accessToken?.value}`,
            "Content-Type" : "application/json"
        }
    })
    const response = await fetcher.json()
    console.log(response);

    return response
}


const getUserResumes = async (userID:number) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/get/user/resumes/${userID}`, {
        headers: {
            "Authorization": `Bearer ${accessToken?.value}`,
            "Content-Type" : "application/json"
        }
    })
    const response = await fetcher.json()
    console.log(response);

    return response
}

const renameTitle = async (resumeId:number , updatedTitle:string) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/rename/resume/${resumeId}?updated_title=${updatedTitle}`, {
        method:"PATCH",
        headers: {
            "Authorization": `Bearer ${accessToken?.value}`,
            "Content-Type" : "application/json"
        }
    })
    const response = await fetcher.json()
    console.log(response);

    return response
}


const deleteResume = async (resumeId:number) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/delete/resume/${resumeId}`, {
        method:"DELETE",
        headers: {
            "Authorization": `Bearer ${accessToken?.value}`,
            "Content-Type" : "application/json"
        }
    })
    const response = await fetcher.json()
    console.log(response);

    return response
}


export {
    buildResume,
    readFile,
    generateResume,
    saveResume,
    getUserResumes,
    renameTitle,
    deleteResume
}