"use client";

import { createPaymentSession } from "@/actions/paymentActions"
import { useState } from "react"


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
            const url = await createPaymentSession(payAmount , subsinterval)
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