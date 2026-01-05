"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock } from 'lucide-react';

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const endTime = new Date('2026-01-06T13:00:00').getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      
      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        
        {/* Logo */}
        <div className="mb-8 flex justify-center items-center bg-yellow-100 rounded-fullw-full p-4">
       
            <img src="/logo.png" alt="Logo" className='h-10'/>
         
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
          We're down today
        </h1>
        
        <p className="text-lg text-gray-600 mb-2">
          We're doing some amazing things.
        </p>
        
        <p className="text-base text-gray-500 mb-12">
          We'll be back within some time.
        </p>

        {/* Countdown */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>Expected return</span>
          </div>
          
          <div className="flex justify-center gap-4 mb-3">
            <div>
              <div className="text-5xl font-light text-gray-900 mb-1">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Hours</div>
            </div>
            <div className="text-5xl font-light text-gray-400 pt-1">:</div>
            <div>
              <div className="text-5xl font-light text-gray-900 mb-1">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Minutes</div>
            </div>
            <div className="text-5xl font-light text-gray-400 pt-1">:</div>
            <div>
              <div className="text-5xl font-light text-gray-900 mb-1">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Seconds</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-400">
            10:00 PM Jan 5 - 1:00 PM Jan 6, 2026
          </p>
        </div>

        {/* What we're doing */}
        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            What we're working on
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">UI Updates</h3>
              <p className="text-sm text-gray-600">Enhancing user interface</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Adding Servers</h3>
              <p className="text-sm text-gray-600">Improving performance</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Better Experience</h3>
              <p className="text-sm text-gray-600">Making everything better</p>
            </div>
          </div>
        </div>

        {/* Apology */}
        <p className="text-gray-600 mb-10">
          Sorry for the inconvenience. We're working hard to bring you an amazing experience.
        </p>

        {/* Contact */}
        <div className="border-t border-gray-200 pt-8 bg-yellow-100 p-4">
          <p className="text-sm text-gray-500 mb-4">Need to reach us?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="mailto:support@example.com"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">support@jogaadindia.com</span>
            </a>
            <a 
              href="tel:+1234567890"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91 7609031417</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}