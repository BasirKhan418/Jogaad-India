import React from 'react';
import { Cookie, Settings, Eye, Shield, ToggleLeft, ToggleRight, Info, Mail } from 'lucide-react';

const CookiePolicyPage = () => {
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
            <Cookie className="w-5 h-5 text-[#F9A825]" />
            <span className="text-white/90 font-medium">Data & Cookie Management</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Cookie Policy
          </h1>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Learn how Jogaad India uses cookies and similar technologies to enhance your experience on our platform.
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
          
          {/* What Are Cookies */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#2B9EB3]/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-[#2B9EB3]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">What Are Cookies?</h2>
            </div>
            
            <div className="bg-gradient-to-r from-[#2B9EB3]/5 to-[#F9A825]/5 rounded-2xl p-8 border border-[#2B9EB3]/20">
              <p className="text-gray-700 leading-relaxed mb-6">
                Cookies are small text files that are stored on your device when you visit our website or use our mobile application. 
                They help us provide you with a better, more personalized experience by remembering your preferences and improving our services.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-[#2B9EB3]" />
                  </div>
                  <h4 className="font-semibold text-[#0A3D62] mb-2">Functionality</h4>
                  <p className="text-gray-600 text-sm">Remember your preferences and settings for a seamless experience</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F9A825]/10 flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-[#F9A825]" />
                  </div>
                  <h4 className="font-semibold text-[#0A3D62] mb-2">Analytics</h4>
                  <p className="text-gray-600 text-sm">Help us understand how you use our platform to improve our services</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#0A3D62]/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-[#0A3D62]" />
                  </div>
                  <h4 className="font-semibold text-[#0A3D62] mb-2">Security</h4>
                  <p className="text-gray-600 text-sm">Keep your account secure and prevent unauthorized access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Types of Cookies */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F9A825]/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-[#F9A825]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Types of Cookies We Use</h2>
            </div>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="bg-white rounded-2xl p-6 border-2 border-[#2B9EB3]/20 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2B9EB3]/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[#2B9EB3]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0A3D62]">Essential Cookies</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Always Active</span>
                    <ToggleRight className="w-5 h-5 text-[#2B9EB3]" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for the website to function properly and cannot be disabled. 
                  They enable core functionality such as security, network management, and accessibility.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Authentication', 'Security', 'Load Balancing', 'Form Submissions'].map((tag) => (
                    <span key={tag} className="bg-[#2B9EB3]/10 text-[#2B9EB3] px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F9A825]/10 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-[#F9A825]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0A3D62]">Analytics Cookies</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Optional</span>
                    <ToggleRight className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies help us understand how visitors interact with our website by collecting and 
                  reporting information anonymously to improve our services.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Google Analytics', 'Page Views', 'User Behavior', 'Performance Metrics'].map((tag) => (
                    <span key={tag} className="bg-[#F9A825]/10 text-[#F9A825] px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0A3D62]/10 flex items-center justify-center">
                      <Settings className="w-4 h-4 text-[#0A3D62]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0A3D62]">Functional Cookies</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Optional</span>
                    <ToggleRight className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences, 
                  location settings, and previously entered information.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['User Preferences', 'Location Settings', 'Language Choice', 'Theme Selection'].map((tag) => (
                    <span key={tag} className="bg-[#0A3D62]/10 text-[#0A3D62] px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0A3D62]">Marketing Cookies</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Optional</span>
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  These cookies are used to deliver relevant advertisements and marketing communications. 
                  They also help us measure the effectiveness of our marketing campaigns.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Targeted Ads', 'Campaign Tracking', 'Social Media', 'Third-party Partners'].map((tag) => (
                    <span key={tag} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Managing Your Preferences */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0A3D62]/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#0A3D62]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Managing Your Cookie Preferences</h2>
            </div>
            
            <div className="bg-gradient-to-r from-[#0A3D62]/5 to-[#2B9EB3]/5 rounded-2xl p-8 border border-[#2B9EB3]/20">
              <p className="text-gray-700 leading-relaxed mb-8">
                You have full control over your cookie preferences. You can manage your settings through our cookie consent banner, 
                browser settings, or by contacting our support team.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-[#0A3D62] mb-4">Browser Settings</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#2B9EB3]">1</span>
                      </div>
                      <span className="text-gray-700 text-sm">Access your browser's privacy/security settings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#2B9EB3]">2</span>
                      </div>
                      <span className="text-gray-700 text-sm">Navigate to the cookies or site data section</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#2B9EB3]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#2B9EB3]">3</span>
                      </div>
                      <span className="text-gray-700 text-sm">Block or allow cookies based on your preferences</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#0A3D62] mb-4">Platform Settings</h3>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-800">Cookie Consent Manager</span>
                      <button className="bg-[#2B9EB3] text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-[#2B9EB3]/90 transition-colors">
                        Manage
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Update your cookie preferences anytime through our consent manager.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Cookie className="w-3 h-3" />
                      <span>Changes take effect immediately</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F9A825]/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-[#F9A825]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Third-Party Services</h2>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
              <p className="text-gray-700 leading-relaxed mb-6">
                We integrate with trusted third-party services to enhance our platform functionality. 
                These services may set their own cookies, which are governed by their respective privacy policies.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Google Analytics', purpose: 'Website analytics and insights', policy: 'Google Privacy Policy' },
                  { name: 'Payment Gateways', purpose: 'Secure payment processing', policy: 'Razorpay Privacy Policy' },
                  { name: 'Customer Support', purpose: 'Live chat and help desk', policy: 'Support Platform Policy' }
                ].map((service, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                    <h4 className="font-semibold text-[#0A3D62] mb-2">{service.name}</h4>
                    <p className="text-gray-600 text-sm mb-3">{service.purpose}</p>
                    <a href="#" className="text-[#2B9EB3] hover:text-[#0A3D62] text-xs font-medium">
                      {service.policy} →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Updates to This Policy */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#2B9EB3]/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#2B9EB3]" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A3D62]">Updates to This Policy</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices, technology, 
                or legal requirements. When we make significant changes, we will notify you through email or by displaying 
                a prominent notice on our website. We encourage you to review this policy periodically to stay informed 
                about how we use cookies.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-[#0A3D62] to-[#2B9EB3] rounded-2xl p-8 text-white text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Questions About Cookies?</h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              If you have any questions about our Cookie Policy or how we use cookies, 
              please don't hesitate to reach out to our privacy team.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:privacy@jogaadindia.com" 
                className="bg-white text-[#0A3D62] px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Contact Privacy Team
              </a>
              <button className="bg-[#F9A825] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#F9A825]/90 transition-colors">
                Manage Cookie Settings
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicyPage;