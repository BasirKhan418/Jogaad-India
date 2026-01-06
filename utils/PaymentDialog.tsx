"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2, CheckCircle, Download } from "lucide-react"
import { useRouter } from "next/navigation"
type Props = {
  paymentId: string
}

const PaymentDialog = ({ paymentId }: Props) => {
  const [open, setOpen] = useState(true)
  const [phase, setPhase] = useState<"qr" | "success">("qr")
  const [status, setStatus] = useState<"pending" | "paid" | "errored">("pending")
  const router = useRouter()
  const [data, setData] = useState<{
    orderid: string
    qrimg: string
    isPaid: boolean
  } | null>(null)

  /** 🔊 Audio refs */
  const processingAudioRef = useRef<HTMLAudioElement | null>(null)
  const successAudioRef = useRef<HTMLAudioElement | null>(null)

  /** 🔓 Unlock audio (browser policy) */
  useEffect(() => {
    const unlock = () => {
      if (!processingAudioRef.current) {
        processingAudioRef.current = new Audio("/coindrop.mp3")
        processingAudioRef.current.muted = true
        processingAudioRef.current.play().then(() => {
          processingAudioRef.current?.pause()
          processingAudioRef.current!.muted = false
          processingAudioRef.current!.currentTime = 0
        })
      }

      if (!successAudioRef.current) {
        successAudioRef.current = new Audio("/gpay.mp3")
        successAudioRef.current.muted = true
        successAudioRef.current.play().then(() => {
          successAudioRef.current?.pause()
          successAudioRef.current!.muted = false
          successAudioRef.current!.currentTime = 0
        })
      }

      document.removeEventListener("click", unlock)
      document.removeEventListener("keydown", unlock)
    }

    document.addEventListener("click", unlock)
    document.addEventListener("keydown", unlock)

    return () => {
      document.removeEventListener("click", unlock)
      document.removeEventListener("keydown", unlock)
    }
  }, [])

  /** 🔁 Poll payment status */
  const fetchStatus = async () => {
    try {
      const res = await fetch(
        `/api/v1/sp-payment?id=${paymentId}`
      )
      const json = await res.json()

      if (!json.success) return

      setStatus(json.data.paymentStatus)

      setData({
        orderid: json.data.orderid,
        qrimg: json.data.qrimg,
        isPaid: json.data.isPaid,
      })

      if (json.data.isPaid) {
        processingAudioRef.current?.play().catch(() => {})
        setTimeout(() => {
          successAudioRef.current?.play().catch(() => {})
          setPhase("success")
          setTimeout(() => {
            setOpen(false);
            router.push("/field-executive/employees")
          }, 1500)
          
        }, 1200)
      }
      
    } catch {
      setStatus("errored")
    }
  }

  useEffect(() => {
    fetchStatus()
    if (status === "pending") {
      const i = setInterval(fetchStatus, 5000)
      return () => clearInterval(i)
    }
  }, [status])

  if (!data) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl overflow-scroll">

        {/* ---------- QR STATE ---------- */}
        {phase === "qr" && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Complete Payment</h2>

            <div className="bg-gray-100 rounded-xl p-4">
              <img
                src={data.qrimg}
                alt="UPI QR"
                className="mx-auto h-[50vh]  w-[50vh] object-cover"
              />
            </div>

            <p className="text-xs text-gray-500">
              Order ID: <span className="font-mono">{data.orderid}</span>
            </p>

            <button
              onClick={() => window.open(data.qrimg)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download QR
            </button>

            <div className="flex justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Waiting for payment…
            </div>
          </div>
        )}

        {/* ---------- SUCCESS STATE ---------- */}
        {phase === "success" && (
          <div className="text-center space-y-5">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-3xl font-bold">Payment Successful</h2>

            <p className="text-green-600 font-semibold">
              Account Activated
            </p>

            <p className="text-xs text-gray-500">
              Order ID: <span className="font-mono">{data.orderid}</span>
            </p>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/field-executive/employees")
              }}  
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold"
            >
              Continue
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PaymentDialog
