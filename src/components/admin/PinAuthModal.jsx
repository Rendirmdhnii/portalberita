import { useState, useEffect, useRef } from 'react';

export default function PinAuthModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      // Auto-focus input when modal opens
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';
    
    if (pin === correctPin) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('PIN Keamanan Salah! Otorisasi ditolak.');
      setPin('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, ''); // Numeric only
    setPin(val);
    if (error) setError('');
    
    // Automatically submit if 4 digits are completed
    if (val.length === 4) {
      // Small timeout to let state update
      setTimeout(() => {
        const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';
        if (val === correctPin) {
          setError('');
          setPin('');
          onSuccess();
        } else {
          setError('PIN Keamanan Salah! Otorisasi ditolak.');
          setPin('');
          if (inputRef.current) inputRef.current.focus();
        }
      }, 50);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
      <div className="bg-[#1e293b] border border-slate-700/60 rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4 shadow-2xl text-center text-white transform scale-100 transition-transform">
        {/* Shield Icon Header */}
        <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 className="text-xl font-extrabold tracking-wide text-slate-100">OTORISASI KEAMANAN</h3>
        <p className="text-sm text-slate-400 mt-2">
          Mutasi data sensitif terdeteksi. Silakan masukkan PIN 4 digit untuk melanjutkan tindakan.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex justify-center">
            <input
              ref={inputRef}
              type="password"
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={handleInputChange}
              className="w-40 text-center tracking-[1.5em] text-3xl font-black bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all font-mono"
              placeholder="••••"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 font-bold bg-red-500/10 border border-red-500/20 py-2.5 px-3 rounded-lg flex items-center gap-1.5 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </p>
          )}

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-4 py-3 bg-[#334155] hover:bg-[#475569] text-slate-200 font-bold rounded-xl transition-all cursor-pointer border border-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-1/2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Konfirmasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
