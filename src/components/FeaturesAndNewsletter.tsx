import React, { useState } from 'react';
import { Truck, CreditCard, Headphones, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FeaturesAndNewsletter: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <section className="bg-[#f7f4ee] py-12 border-t border-[#e6dec8]/60 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-b border-[#e6dec8]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8dfcb] text-[#2d4a3e] flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1f2923]">{t('features.shipping')}</div>
              <div className="text-[11px] text-[#736860]">{t('features.shipping.sub')}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8dfcb] text-[#2d4a3e] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1f2923]">{t('features.payment')}</div>
              <div className="text-[11px] text-[#736860]">{t('features.payment.sub')}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8dfcb] text-[#2d4a3e] flex items-center justify-center flex-shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1f2923]">{t('features.support')}</div>
              <div className="text-[11px] text-[#736860]">{t('features.support.sub')}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8dfcb] text-[#2d4a3e] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1f2923]">{t('features.quality')}</div>
              <div className="text-[11px] text-[#736860]">{t('features.quality.sub')}</div>
            </div>
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="relative rounded-3xl bg-[#1b3b2b] text-white p-8 sm:p-12 shadow-xl border border-[#12281d] overflow-hidden text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-3.5 py-1 bg-[#2d4a3e] text-[#e6d3ad] text-xs font-bold uppercase tracking-widest rounded-full border border-[#e6d3ad]/30">
            {t('newsletter.tag')}
          </div>

          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white max-w-2xl mx-auto leading-tight">
            {t('newsletter.title')}
          </h3>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 text-xs font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('newsletter.subscribed')}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={t('newsletter.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white text-gray-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#e6d3ad]"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#e6d3ad] hover:bg-white text-[#1b3b2b] text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
              >
                {t('newsletter.subscribe')}
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};
