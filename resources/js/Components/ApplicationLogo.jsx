export default function ApplicationLogo({ className = "" }) {
    return (
        <div className={`flex flex-col items-center leading-none ${className}`}>
            <div className="flex items-center font-black tracking-tighter">
                <span className="text-[#0a192f] text-5xl">Pojok</span>
                <span className="text-[#e53e3e] text-4xl">TV.com</span>
            </div>
            <span className="text-gray-800 font-semibold text-[11px] uppercase tracking-[0.2em] mt-1.5 border-t border-gray-300 pt-0.5">
                Portal Berita Terkini & Terpercaya
            </span>
        </div>
    );
}
