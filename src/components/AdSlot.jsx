export default function AdSlot({ size = "728x90", className = "" }) {
  return (
    <div className={`bg-slate-200 border border-slate-300 rounded-lg flex flex-col justify-center items-center text-center p-4 shadow-inner text-slate-500 font-sans select-none ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
        Advertisement
      </span>
      <span className="text-xs font-bold uppercase text-slate-500">
        PojokTV Ad Network
      </span>
      <span className="text-[10px] text-slate-400 mt-1">
        Slot Iklan ({size})
      </span>
    </div>
  );
}
