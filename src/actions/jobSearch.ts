"use server";
import { cookies } from "next/headers"

export const jobSearch = async (jobTitle: string, skillsDes:string) => {
    const accessToken = cookies().get("accessToken")
    const fetcher = await fetch(`${process.env.BACKEND_URL}/api/ai/agent/job/search-agent`, {
        method: "POST",
        body: JSON.stringify({ job_title: jobTitle, skills_desc: skillsDes }),
        headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${accessToken?.value}`
        }
    })
    const response = await fetcher.json()
}