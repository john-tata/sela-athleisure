import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('submitting');
    // TODO: Wire up to newsletter API when ready
    // await api.subscribeNewsletter(email);
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="w-full py-20 md:py-28 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl lg:text-6xl text-white mb-6"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Join The Movement
        </h2>
        <p className="text-neutral-400 text-base md:text-lg mb-10 max-w-md mx-auto">
          Subscribe for early access to new collections, exclusive offers, and
          wellness inspiration delivered to your inbox.
        </p>

        {/* Form */}
        {status === 'success' ? (
          <div className="flex items-center justify-center gap-3 text-emerald-400 py-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Thank you for subscribing!</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full sm:flex-1 px-5 py-3.5 bg-white/10 border border-white/20 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/50 transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold text-sm tracking-wider uppercase hover:bg-neutral-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {/* Fine print */}
        <p className="text-neutral-600 text-xs mt-6">
          By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
