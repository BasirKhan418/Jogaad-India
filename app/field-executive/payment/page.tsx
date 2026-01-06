"use client"
import { useEffect, useState,useRef } from 'react'
import { CheckCircle, Download, Loader2, XCircle, CreditCard, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
const PaymentStatusPage = () => {
const [audioUnlocked, setAudioUnlocked] = useState(false)
  const processingAudioRef = useRef<HTMLAudioElement | null>(null)
const successAudioRef = useRef<HTMLAudioElement | null>(null)
useEffect(() => {
  const unlock = () => {
    if (!processingAudioRef.current) {
      processingAudioRef.current = new Audio('/coindrop.mp3')
      processingAudioRef.current.volume = 1
      processingAudioRef.current.muted = true
      processingAudioRef.current.play().then(() => {
        processingAudioRef.current!.pause()
        processingAudioRef.current!.muted = false
        processingAudioRef.current!.currentTime = 0
      })
    }

    if (!successAudioRef.current) {
      successAudioRef.current = new Audio('/gpay.mp3')
      successAudioRef.current.volume = 1
      successAudioRef.current.muted = true
      successAudioRef.current.play().then(() => {
        successAudioRef.current!.pause()
        successAudioRef.current!.muted = false
        successAudioRef.current!.currentTime = 0
      })
    }

    setAudioUnlocked(true)
    document.removeEventListener('click', unlock)
    document.removeEventListener('keydown', unlock)
  }

  document.addEventListener('click', unlock)
  document.addEventListener('keydown', unlock)

  return () => {
    document.removeEventListener('click', unlock)
    document.removeEventListener('keydown', unlock)
  }
}, [])


  const [data, setData] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")
  const [showSuccess, setShowSuccess] = useState(false)
  const [animationStage, setAnimationStage] = useState<'processing' | 'success' | 'complete'>('processing')
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || ''
  const playProcessingSound = () => {
  processingAudioRef.current?.play().catch(() => {})
}

const playSuccessSound = () => {
  successAudioRef.current?.play().catch(() => {})
}


  

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/v1/emp-payment?id=${id}`)
      const data = await response.json()
      setPaymentStatus(data.status)
      if (data.success) {
        setData(data.data)
        if (data.data.isPaid && !showSuccess) {
          setShowSuccess(true)
          setAnimationStage('processing')
         playProcessingSound()
          setTimeout(() => {setAnimationStage('success'); playSuccessSound()}, 1500)
          setTimeout(() => setAnimationStage('complete'), 3000)
        }
      }
    
    } catch (error) {
      setPaymentStatus("errored")
      console.error("Error fetching payment status:", error)
    }
  }

  const downloadQRCode = async () => {
    try {
      router.push(data.qrcodeimg)
    } catch (error) {
      console.error("Error downloading QR code:", error)
    }
  }

  useEffect(() => {
    fetchPaymentStatus()
    
    if (paymentStatus === "pending") {
      const interval = setInterval(() => {
        fetchPaymentStatus()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [paymentStatus])

  // Enhanced Success Animation Component
  const SuccessAnimation = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-md bg-red-50">
      <div className="relative">
        {/* Confetti/Particles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden">
          {/* Background gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Processing Stage */}
            {animationStage === 'processing' && (
              <div className="animate-fadeIn bg-amber-50">
                <div className="relative mb-6">
                  {/* Outer rotating ring */}
                  <div className="absolute inset-0 w-32 h-32 border-4 border-blue-200 rounded-full animate-spin-slow" />
                  <div className="absolute inset-2 w-28 h-28 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
                  
                  {/* Center icon */}
                  <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse-scale">
                    <CreditCard className="w-16 h-16 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            {/* Success Stage */}
            {animationStage === 'success' && (
              <div className="animate-zoomIn">
                <div className="relative mb-6">
                  {/* Multiple expanding rings */}
                  <div className="absolute inset-0 w-32 h-32 bg-green-500 rounded-full animate-ping opacity-20" />
                  <div className="absolute inset-0 w-32 h-32 bg-green-500 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.3s' }} />
                  
                  {/* Main checkmark circle */}
                  <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-successPop">
                    {/* Checkmark with draw animation */}
                    <svg className="w-20 h-20" viewBox="0 0 52 52">
                      <circle
                        className="animate-checkmarkCircle"
                        cx="26"
                        cy="26"
                        r="25"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      />
                      <path
                        className="animate-checkmark"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        d="M14 27l7 7 16-16"
                      />
                    </svg>
                  </div>
                  
                  {/* Sparkles */}
                  <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-sparkle" />
                  <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-yellow-400 animate-sparkle" style={{ animationDelay: '0.3s' }} />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-slideUp">Payment Successful!</h2>
                <div className="flex items-center gap-2 mb-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-lg text-green-600 font-semibold">Verified & Confirmed</p>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            )}

            {/* Complete Stage */}
            {animationStage === 'complete' && (
              <div className="animate-fadeIn w-full">
                <div className="relative mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl mx-auto">
                    <CheckCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Complete!</h2>
                <p className="text-xl text-green-600 font-bold mb-6">✓ Account Activated</p>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 w-full mb-6 border-2 border-green-200">
                  <div className="text-center mb-4">
                    <p className="text-gray-800 font-bold text-xl mb-1">{data?.name}</p>
                    <p className="text-gray-600 text-sm">{data?.email}</p>
                  </div>
                  
                  <div className="border-t border-green-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-gray-800 text-xs">{data?.orderid}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Block:</span>
                      <span className="font-semibold text-gray-800">{data?.block}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-blue-800 text-center font-medium">
                    🎉 Registration completed successfully! Welcome to the team!
                  </p>
                </div>

                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes successPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes checkmarkCircle {
          0% {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
          }
          100% {
            stroke-dasharray: 166;
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes checkmark {
          0% {
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dasharray: 48;
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        
        .animate-zoomIn {
          animation: zoomIn 0.5s ease-out;
        }
        
        .animate-successPop {
          animation: successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-checkmarkCircle {
          animation: checkmarkCircle 0.6s ease-out 0.3s forwards;
        }
        
        .animate-checkmark {
          animation: checkmark 0.4s ease-out 0.6s forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (paymentStatus === "errored") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 rounded-full p-6 mb-6 animate-shake">
              <XCircle className="w-20 h-20 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Error</h2>
            <p className="text-gray-600 text-center mb-6">
              Something went wrong while processing your payment. Please try again or contact support.
            </p>
            <button
              onClick={fetchPaymentStatus}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Retry Payment
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (data.isPaid) {
    return (
      <>
        {showSuccess && <SuccessAnimation />}
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 mb-6 shadow-xl">
                <CheckCircle className="w-20 h-20 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Complete!</h2>
              <p className="text-xl text-green-600 font-bold mb-6">✓ Account Activated</p>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 w-full mb-6 border-2 border-green-200">
                <div className="text-center mb-4">
                  <p className="text-gray-800 font-bold text-xl mb-1">{data.name}</p>
                  <p className="text-gray-600 text-sm">{data.email}</p>
                </div>
                
                <div className="border-t border-green-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono text-gray-800 text-xs">{data.orderid}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Customer ID:</span>
                    <span className="font-mono text-gray-800 text-xs">{data.customerid}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Block:</span>
                    <span className="font-semibold text-gray-800">{data.block}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 w-full">
                <p className="text-sm text-blue-800 text-center font-medium">
                  🎉 Employee registration completed successfully! Welcome to the team!
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            Employee Registration
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Scan QR code to activate your account</p>
        </div>

        {/* Employee Details */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{data.name}</h3>
              <p className="text-gray-600">{data.email}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75" />
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                Pending
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">📱 Phone</p>
              <p className="font-semibold text-gray-800">{data.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">🏢 Block</p>
              <p className="font-semibold text-gray-800">{data.block}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 mb-1">📍 Address</p>
              <p className="font-semibold text-gray-800">{data.address}, {data.pincode}</p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Scan QR Code to Pay</h3>
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl border-4 border-indigo-100">
                <img 
                  src={data.qrcodeimg} 
                  alt="UPI QR Code" 
                  className="h-[50vh] w-[50vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          <button
            onClick={downloadQRCode}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Download className="w-6 h-6" />
            Download QR Code
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-3 text-gray-600 mb-6">
          <div className="relative">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
          <p className="font-medium">Waiting for payment confirmation...</p>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 text-center font-medium">
            💡 Payment status updates automatically every 5 seconds. Complete payment using any UPI app.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentStatusPage