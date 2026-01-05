"use client"
import { useEffect,useState } from 'react'
import { useSearchParams } from "next/navigation";
import { toast } from 'sonner';
const page = () => {
    //maken an api call
    const [data ,setData] = useState<any>(null);
    const [loading,setLoading] = useState<boolean>(false);
    const [paymentStatus,setPaymentStatus] = useState<string>("pending");

    const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const fetchPaymentStatus = async () => {
    try{
        const response = await fetch(`/api/v1//emp-payment?id=${id}`);
        const data = await response.json();
        console.log("Payment status response",data);
        setPaymentStatus(data.status);
        if(data.success){
            setData(data.data);
            console.log("Payment status fetched",data);  
        }
        else{
            toast.error(data.message);
        }
    }
    catch(error){
        toast.error("Error fetching payment status");
    }
  }
    
    useEffect(() => {
        // Any client-side logic can go here
        fetchPaymentStatus();
        const interval = setInterval(() => {
            fetchPaymentStatus();
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);
  return (
    <>
    <div>hello payment page {id} paymentStatus  {data?.isPaid ? "Paid" : "Pending"}</div>
    <div className='flex justify-center items-center'>
        <img src={data?.qrcodeimg} alt="UPI QR Code" className='h-[50vh]'/>
    </div>
    </>
    
  )
}

export default page