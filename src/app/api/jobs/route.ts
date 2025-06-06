import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const keywords = searchParams.get('keywords');
    const jobType = searchParams.get("jobType")
    const datePosted = searchParams.get("datePosted")
    const experienceLevel = searchParams.get("experienceLevel")
    const url = `https://linkedin-data-api.p.rapidapi.com/search-jobs-v2?keywords=${keywords}&jobType=${jobType}&datePosted=${datePosted}&experienceLevel${experienceLevel}&sort=mostRelevant`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'bba5ea3048msh941e5c1ec96b252p150af2jsn4b480532234a',
            'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
    }

}