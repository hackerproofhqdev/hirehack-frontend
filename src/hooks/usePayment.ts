"use client";

import { createPaymentSession } from "@/actions/paymentActions"
import { useState } from "react"
import { getUserProfile } from "@/actions/getUserProfile"


type Interval = "DAY" | "WEEK" | "MONTH" | "YEAR"



export function usePayment() {
    const [amount, setAmount] = useState<number>()
    const [interval, setInterval] = useState<Interval>()
    const [paymentUrl, setPaymentUrl] = useState<string>("")
    function setPaymentValues(payAmount: number, subsinterval: Interval) {
        setAmount(payAmount)
        setInterval(subsinterval)
        async function getPaymentUrl() {
            // @ts-ignore
            const userProfile = await getUserProfile()
            const url = await createPaymentSession(payAmount , subsinterval , userProfile.email)
            setPaymentUrl(url)
        }
        getPaymentUrl()
    }
    return {
        amount,
        interval,
        paymentUrl,
        setPaymentValues,
    }
}