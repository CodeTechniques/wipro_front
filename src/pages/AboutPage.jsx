import React from "react";
import { 
  Target, 
  Users, 
  ShieldCheck, 
  Buildings,
  ArrowRight 
} from "phosphor-react";

const AboutWipo = () => {
  return (
    <>
      {/* Main Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <div className="animate-fade-up">
            <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-5 animate-fade-up" style={{animationDelay: '0.1s'}}>
              LEADING PROP-TECH ECOSYSTEM
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up" style={{animationDelay: '0.2s'}}>
              Invest in <br />
              <span className="text-emerald-600">Real Assets.</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-lg animate-fade-up" style={{animationDelay: '0.3s'}}>
              <strong>WIPO Group makes real estate investing as simple as buying a stock.</strong>
              Experience the power of fractional ownership. We bring you premium, high-yield assets 
              that were previously reserved for institutional giants.
            </p>

            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700 transition-colors duration-300 animate-fade-up" 
              style={{animationDelay: '0.4s'}}
            >
              Contact Now <ArrowRight size={20} />
            </a>
          </div>

          {/* Right Card */}
          <div className="animate-slide-in" style={{animationDelay: '0.5s'}}>
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 relative pb-3">
                Why WIPO?
                <span className="absolute bottom-0 left-0 w-10 h-1 bg-emerald-500 rounded-full"></span>
              </h2>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-900 font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-gray-100">Fractional ownership in Grade-A properties.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-900 font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-gray-100">Transparent legal and RERA documentation.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-900 font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-gray-100">Monthly rental yields and appreciation.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-emerald-900 font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-gray-100">End-to-end asset management.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Transparency Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:-translate-y-4 transition-transform duration-300 hover:border-2 hover:border-emerald-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                <Target size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">TRANSPARENCY</p>
              <span className="inline-block w-12 h-1 bg-emerald-200 rounded-full mt-6"></span>
            </div>

            {/* Community Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:-translate-y-4 transition-transform duration-300 hover:border-2 hover:border-emerald-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                <Users size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">12K+</h3>
              <p className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">ACTIVE COMMUNITY</p>
              <span className="inline-block w-12 h-1 bg-emerald-200 rounded-full mt-6"></span>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border-2 border-emerald-500 -translate-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                <ShieldCheck size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">BANK-GRADE</p>
              <span className="inline-block w-12 h-1 bg-emerald-200 rounded-full mt-6"></span>
            </div>

            {/* Assets Card */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:-translate-y-4 transition-transform duration-300 hover:border-2 hover:border-emerald-500">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                <Buildings size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">MANAGED ASSETS</p>
              <span className="inline-block w-12 h-1 bg-emerald-200 rounded-full mt-6"></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutWipo;