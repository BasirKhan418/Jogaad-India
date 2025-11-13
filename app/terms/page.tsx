import React from 'react';
import { Scale, FileText, Users, Shield, AlertTriangle, CheckCircle, XCircle, Phone } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A3D62] to-[#2B9EB3] py-20">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#F9A825]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Scale className="w-5 h-5 text-[#F9A825]" />
            <span className="text-white/90 font-medium">Legal Terms & Conditions</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Please read these terms carefully before using Jogaad India's doorstep services platform.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F9A825] animate-pulse"></span>
              Effective date: November 13, 2025
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Agreement Overview */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#2B9EB3]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#2B9EB3]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Agreement Overview</h2>
            </div>
            
            <div className="bg-gradient-to-r from-[#2B9EB3]/5 to-[#F9A825]/5 rounded-2xl p-8 border border-[#2B9EB3]/20">
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using Jogaad India's platform, mobile application, and services, you agree to be bound by these Terms of Service. 
                These terms govern your relationship with Jogaad India and the use of our comprehensive doorstep service platform across Odisha.
              </p>
              <div className="flex items-center gap-2 text-sm text-[#0A3D62] font-medium">
                <AlertTriangle className="w-4 h-4" />
                <span>Please read these terms carefully before proceeding</span>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F9A825]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#F9A825]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Our Services</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-[#0A3D62] mb-4">Platform Services</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2B9EB3] flex-shrink-0 mt-0.5" />
                    <span>Connecting customers with verified service professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2B9EB3] flex-shrink-0 mt-0.5" />
                    <span>Doorstep service booking and scheduling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2B9EB3] flex-shrink-0 mt-0.5" />
                    <span>Payment processing and transaction management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2B9EB3] flex-shrink-0 mt-0.5" />
                    <span>Customer support and service quality assurance</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold text-[#0A3D62] mb-4">Service Categories</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2B9EB3]"></span>
                    Home maintenance and repairs
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2B9EB3]"></span>
                    Cleaning and housekeeping services
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2B9EB3]"></span>
                    Beauty and wellness services
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2B9EB3]"></span>
                    Appliance installation and repair
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#2B9EB3]"></span>
                    Personal and professional services
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0A3D62]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#0A3D62]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">User Responsibilities</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-[#0A3D62] mb-4">Account Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Provide accurate personal information",
                    "Maintain account security and confidentiality",
                    "Use services only for lawful purposes",
                    "Respect service professionals and their time"
                  ].map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#2B9EB3]">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Prohibited Activities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Fraudulent or deceptive practices",
                    "Harassment of service professionals",
                    "Violation of local laws and regulations",
                    "Misuse of platform features or systems"
                  ].map((prohibition, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700 text-sm">{prohibition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#2B9EB3]/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#2B9EB3]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Payment & Billing</h2>
            </div>
            
            <div className="bg-gradient-to-r from-[#0A3D62]/5 to-[#2B9EB3]/5 rounded-2xl p-8 border border-[#2B9EB3]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#0A3D62] mb-4">Payment Processing</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3] mt-2 flex-shrink-0"></span>
                      <span>Secure payment processing through verified gateways</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3] mt-2 flex-shrink-0"></span>
                      <span>Multiple payment options including digital wallets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3] mt-2 flex-shrink-0"></span>
                      <span>Transparent pricing with no hidden charges</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#0A3D62] mb-4">Refund Policy</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F9A825] mt-2 flex-shrink-0"></span>
                      <span>Service quality guarantee with satisfaction assurance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F9A825] mt-2 flex-shrink-0"></span>
                      <span>Cancellation policy varies by service type</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F9A825] mt-2 flex-shrink-0"></span>
                      <span>Dispute resolution through customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F9A825]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#F9A825]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Limitation of Liability</h2>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
              <p className="text-gray-700 leading-relaxed mb-4">
                Jogaad India acts as an intermediary platform connecting customers with independent service professionals. 
                While we strive to ensure quality service delivery, we cannot guarantee the performance of individual service providers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#0A3D62] mb-3">Our Commitment</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Verify service provider credentials</li>
                    <li>• Provide customer support</li>
                    <li>• Facilitate dispute resolution</li>
                    <li>• Maintain platform security</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0A3D62] mb-3">User Acknowledgment</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Services provided by third-party professionals</li>
                    <li>• Quality may vary between providers</li>
                    <li>• Platform facilitates but doesn't perform services</li>
                    <li>• Users assume service-related risks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0A3D62]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0A3D62]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Changes to Terms</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to update these Terms of Service at any time. We will notify users of significant changes 
                through email notifications or prominent notices on our platform. Continued use of our services after such 
                modifications constitutes acceptance of the updated terms.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] rounded-2xl p-8 text-white text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need clarification on any policies, 
              our legal and customer support teams are here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:legal@jogaadindia.com" 
                className="bg-white text-[#0A3D62] px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Contact Legal Team
              </a>
              <span className="text-white/60">Available 24/7 for your assistance</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;