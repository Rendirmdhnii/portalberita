import { useState, useEffect, useRef } from 'react';

export default function PinAuthModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [authStatus, setAuthStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setAuthStatus('idle');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (authStatus !== 'idle') return;

    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';
    if (pin === correctPin) {
      setAuthStatus('success');
      setTimeout(() => {
        setAuthStatus('idle');
        setPin('');
        onSuccess();
      }, 1000);
    } else {
      setAuthStatus('error');
      setTimeout(() => {
        setPin('');
        setAuthStatus('idle');
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 50);
      }, 650);
    }
  };

  const handleInputChange = (e) => {
    if (authStatus !== 'idle') return;
    const val = e.target.value.replace(/[^0-9]/g, '');
    setPin(val);

    if (val.length === 4) {
      const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';
      if (val === correctPin) {
        setAuthStatus('success');
        setTimeout(() => {
          setAuthStatus('idle');
          setPin('');
          onSuccess();
        }, 1000);
      } else {
        setAuthStatus('error');
        setTimeout(() => {
          setPin('');
          setAuthStatus('idle');
          setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
          }, 50);
        }, 650);
      }
    }
  };

  const getHeaderTitle = () => {
    if (authStatus === 'success') return 'OTORISASI BERHASIL';
    if (authStatus === 'error') return 'OTORISASI DITOLAK';
    return 'OTORISASI KEAMANAN';
  };

  const getDescription = () => {
    if (authStatus === 'success') return 'Sistem memverifikasi identitas Anda dan melanjutkan tindakan...';
    if (authStatus === 'error') return 'PIN Keamanan Salah! Mengosongkan data otorisasi...';
    return 'PIN Otorisasi Redaksi diperlukan untuk memodifikasi database.';
  };

  const isTransitioning = authStatus !== 'idle';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
      {/* CSS Keyframes Injection */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out 3;
        }
      `}</style>

      <div className={`bg-[#1e293b] border rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4 shadow-2xl text-center text-white transform scale-100 transition-all duration-300 ${
        authStatus === 'error' 
          ? 'border-red-500 animate-shake shadow-red-500/5' 
          : authStatus === 'success' 
            ? 'border-green-500 shadow-green-500/10' 
            : 'border-slate-700/60'
      }`}>
        {/* Dynamic Header Icons */}
        {authStatus === 'success' ? (
          <div className="h-16 w-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : authStatus === 'error' ? (
          <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        ) : (
          <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        <h3 className={`text-xl font-extrabold tracking-wide transition-colors duration-300 ${
          authStatus === 'success' ? 'text-green-450 font-black' : authStatus === 'error' ? 'text-red-500 font-bold' : 'text-slate-100'
        }`}>
          {getHeaderTitle()}
        </h3>
        
        <p className="text-sm text-slate-400 mt-2 min-h-[40px] flex items-center justify-center px-2">
          {getDescription()}
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
              disabled={isTransitioning}
              onChange={handleInputChange}
              className={`w-40 text-center tracking-[1.5em] text-3xl font-black bg-[#0f172a] border rounded-xl px-4 py-3 text-white transition-all font-mono ${
                authStatus === 'error' 
                  ? 'border-red-500 text-red-500 shadow-inner' 
                  : authStatus === 'success' 
                    ? 'border-green-500 text-green-500 bg-green-950/20' 
                    : 'border-slate-700 focus:border-red-500'
              }`}
              placeholder="••••"
              required
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isTransitioning}
              className="w-1/2 px-4 py-3 bg-[#334155] hover:bg-[#475569] text-slate-200 font-bold rounded-xl transition-all cursor-pointer border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isTransitioning}
              className="w-1/2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Konfirmasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
