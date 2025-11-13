import React from 'react';
import { Shield, Lock, Database, Eye, UserCheck, FileText, AlertTriangle, Mail } from 'lucide-react';

const PrivacyPolicyPage = () => {
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
            <Shield className="w-5 h-5 text-[#F9A825]" />
            <span className="text-white/90 font-medium">Privacy & Data Protection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Your privacy matters to us. Learn how Jogaad India protects, collects, and uses your personal information.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F9A825] animate-pulse"></span>
              Last updated: November 13, 2025
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Overview */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#2B9EB3]/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#2B9EB3]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Overview</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                At Jogaad India, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                doorstep service platform, mobile application, and website.
              </p>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F9A825]/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-[#F9A825]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Information We Collect</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-[#0A3D62] mb-4">Personal Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Name and contact details
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Address and location information
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Phone number and email address
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Payment and billing information
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-[#0A3D62] mb-4">Service Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Service requests and preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Communication with service providers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Feedback and ratings
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9EB3]"></span>
                    Usage patterns and analytics
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0A3D62]/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-[#0A3D62]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">How We Use Your Information</h2>
            </div>
            
            <div className="bg-gradient-to-r from-[#2B9EB3]/5 to-[#F9A825]/5 rounded-2xl p-8 border border-[#2B9EB3]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-[#2B9EB3]" />
                  </div>
                  <h4 className="font-semibold text-[#0A3D62] mb-2">Service Delivery</h4>
                  <p className="text-gray-600 text-sm">To provide and improve our doorstep services across Odisha</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F9A825]/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-[#F9A825]" />
                  </div>
                  <h4 className="font-semibold text-[#0A3D62] mb-2">Communication</h4>
                  <p className="text-gray-600 text-sm">To send service updates, notifications, and support messages</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0A3D62]/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-[#0A3D62]" />
                  </div>
                  <h4 className="font-semibold text-[#0A3D62] mb-2">Security</h4>
                  <p className="text-gray-600 text-sm">To maintain platform security and prevent fraudulent activities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#2B9EB3]/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#2B9EB3]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Data Protection & Security</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                We implement industry-standard security measures to protect your personal information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-[#2B9EB3]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0A3D62] mb-2">Encryption</h4>
                    <p className="text-gray-600 text-sm">All sensitive data is encrypted in transit and at rest using advanced security protocols.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#F9A825]/10 flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-[#F9A825]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0A3D62] mb-2">Secure Storage</h4>
                    <p className="text-gray-600 text-sm">Your data is stored on secure servers with regular backups and monitoring.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F9A825]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#F9A825]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Your Rights</h2>
            </div>
            
            <div className="bg-white rounded-2xl border-2 border-[#2B9EB3]/20 p-8">
              <p className="text-gray-700 mb-6">You have the right to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Access your personal information",
                  "Correct inaccurate data",
                  "Delete your account and data",
                  "Opt-out of marketing communications",
                  "Data portability",
                  "Lodge a complaint with authorities"
                ].map((right, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#2B9EB3]">✓</span>
                    </div>
                    <span className="text-gray-700">{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] rounded-2xl p-8 text-white text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              If you have any questions about this Privacy Policy or how we handle your data, 
              please don't hesitate to contact our privacy team.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:privacy@jogaadindia.com" 
                className="bg-white text-[#0A3D62] px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Contact Privacy Team
              </a>
              <span className="text-white/60">or call us at +91-XXXX-XXXX</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;