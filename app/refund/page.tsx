import React from "react";
import { RotateCcw, AlertTriangle, CheckCircle, Clock, Scale } from "lucide-react";

const RefundPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 mt-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#2B9EB3]/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-[#F9A825]/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#2B9EB3]/10 px-4 py-2 rounded-full backdrop-blur-sm mb-6">
            <RotateCcw className="w-5 h-5 text-[#2B9EB3]" />
            <span className="text-[#0A3D62] font-medium">Refund & Cancellation Policy</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-[#0A3D62] to-[#2B9EB3] bg-clip-text text-transparent">
            Refund Policy
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
            Our refund policy is designed to be simple, transparent, and customer-friendly.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-16">

          {/* 10-Minute Full Refund */}
          <div className="bg-white rounded-2xl p-8 border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-[#2B9EB3]" />
              <h2 className="text-2xl font-bold text-[#0A3D62]">10-Minute No-Questions-Asked Refund</h2>
            </div>

            <p className="text-gray-700 leading-relaxed">
              If you cancel any service within the first 
              <span className="font-semibold text-[#0A3D62]"> 10 minutes </span>
              of booking, you are eligible for a 
              <span className="font-semibold text-[#0A3D62]"> 100% full refund </span> instantly.
            </p>
          </div>

          {/* After 10 Minutes - 24 Hours */}
          <div className="bg-[#F9A825]/5 rounded-2xl p-8 border border-[#F9A825]/30 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-[#F9A825]" />
              <h2 className="text-2xl font-bold text-[#0A3D62]">
                After 10 Minutes But Within 24 Hours
              </h2>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              If you cancel the service after the 10-minute window but within
              <span className="font-semibold text-[#0A3D62]"> 24 hours </span>:
            </p>

            <ul className="space-y-3 text-gray-800">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                You will still receive a <span className="font-semibold text-[#0A3D62]">100% full refund</span>.
              </li>

              <li className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-[#F9A825] flex-shrink-0" />
                A <span className="font-semibold text-[#F9A825]">penalty will be applied to your next booking</span> 
                as per our cancellation rules.
              </li>
            </ul>
          </div>

          {/* Special Services Note */}
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0A3D62] mb-3">
              Special or Fixed-Time Services
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Some services—such as scheduled electrical work, specialized repair jobs,
              or services requiring advance materials—may follow a different cancellation
              structure. These details will be clearly shown during booking.
            </p>
          </div>

          {/* How Refunds Are Initiated */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-300 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0A3D62] mb-4">
              How Refunds Are Processed
            </h2>

            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#2B9EB3]" />
                Refunds are processed to the original payment method.
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#2B9EB3]" />
                Refunds may take 2–5 business days depending on your bank/wallet.
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-[#2B9EB3]" />
                You will receive an SMS/email notification once processed.
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] text-white p-8 rounded-2xl text-center">
            <RotateCcw className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Need Help With a Refund?</h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              If you believe a refund was not processed correctly, or you need help with a
              cancellation, our support team is available 24/7.
            </p>

            <a
              href="mailto:support@jogaadindia.com"
              className="bg-white text-[#0A3D62] font-semibold px-6 py-3 rounded-lg hover:bg-white/90"
            >
              Contact Support
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};

export default RefundPolicyPage;
