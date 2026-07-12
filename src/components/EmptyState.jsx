/**
 * EmptyState - Komponen pesan kosong yang ramah pengguna
 * Digunakan di seluruh halaman publik dan admin PojokTV
 *
 * Props:
 *  - icon: string (FontAwesome class, default "fa-solid fa-newspaper")
 *  - title: string (judul pesan kosong)
 *  - message: string (keterangan tambahan, opsional)
 *  - dark: boolean (mode gelap, untuk section video)
 *  - compact: boolean (versi kecil untuk widget sidebar)
 *  - colSpan: number (untuk dipakai di dalam <td colSpan={n}> tabel admin)
 */
export default function EmptyState({
  icon = 'fa-solid fa-newspaper',
  title = 'Belum ada data',
  message = '',
  dark = false,
  compact = false,
}) {
  if (compact) {
    return (
      <div className={`flex flex-col items-center justify-center py-6 text-center gap-1 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
        <i className={`${icon} text-xl mb-1 opacity-40`}></i>
        <p className="text-xs font-bold">{title}</p>
        {message && <p className="text-[10px] opacity-70">{message}</p>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-14 px-6 text-center rounded-xl border-2 border-dashed gap-3 ${
      dark
        ? 'border-slate-700 text-slate-500 bg-slate-900/40'
        : 'border-gray-200 text-gray-400 bg-white'
    }`}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${dark ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <i className={`${icon} text-2xl opacity-50`}></i>
      </div>
      <div>
        <p className={`font-bold text-base ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{title}</p>
        {message && (
          <p className={`text-sm mt-1 ${dark ? 'text-slate-600' : 'text-gray-400'}`}>{message}</p>
        )}
      </div>
    </div>
  );
}
