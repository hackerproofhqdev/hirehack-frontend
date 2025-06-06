"use server"
import { cookies } from "next/headers";

const setCookie = async (name: string, value: string, options: Record<string, any> = {}) => {
    const cookieStore = await cookies();
    cookieStore.set(name, value, options);
  };

  const getCookie = async (name: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  };

  const deleteCookie = async (name: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  };


export {getCookie , deleteCookie , setCookie}