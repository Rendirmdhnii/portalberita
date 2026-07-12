import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Article({ post }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    
    // Asumsikan data bookmark dilempar dari controller, tapi untuk sementara 
    // kita asumsikan isBookmarked berdasarkan state yang dilempar, atau hanya action saja.
    // Untuk ini, asumsikan tombol toggle saja.
    const [isBookmarked, setIsBookmarked] = useState(
        user ? post.bookmarked_by?.some(u => u.id === user.id) : false
    );

    const { post: submitBookmark, processing } = useForm();

    const handleBookmark = () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        submitBookmark(route('bookmark.toggle', post.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsBookmarked(!isBookmarked);
            }
        });
    };

    // Logic Paywall
    const isPremium = post.is_premium;
    const canReadPremium = user && (user.role === 'subscriber' || user.role === 'super_admin' || user.role === 'superadmin' || user.role === 'admin');
    const showPaywall = isPremium && !canReadPremium;

    // Memotong konten jika terkena paywall
    let displayContent = post.content;
    if (showPaywall) {
        // Ambil hanya 2 paragraf pertama (sekitar 300 karakter)
        const stripped = post.content.replace(/(<([^>]+)>)/gi, "");
        displayContent = `<p>${stripped.substring(0, 300)}...</p>`;
    }

    return (
        <PublicLayout user={user}>
            <Head title={`${post.title} - PojokTV`} />

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kolom Kiri (70%) - Konten Berita */}
                <div className="lg:col-span-2">
                    {/* Breadcrumb & Kategori */}
                    <div className="flex justify-between items-center mb-2">
                        {post.category ? (
                            <Link 
                                href={route('category.show', post.category.slug)} 
                                className="text-red-600 font-bold uppercase tracking-wider text-sm hover:underline block"
                            >
                                {post.category.name}
                            </Link>
                        ) : (
                            <span className="text-red-600 font-bold uppercase tracking-wider text-sm block">Berita</span>
                        )}
                        <button 
                            onClick={handleBookmark}
                            disabled={processing}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition ${
                                isBookmarked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span>{isBookmarked ? 'Tersimpan' : 'Simpan Artikel'}</span>
                        </button>
                    </div>

                    {/* Judul Raksasa */}
                    <h1 className="text-3xl md:text-5xl font-black leading-tight text-gray-900 mb-4">
                        {post.title}
                    </h1>

                    {/* Meta Data */}
                    <div className="flex items-center text-gray-500 text-sm mb-6 pb-4 border-b border-gray-200 flex-wrap gap-y-2">
                        <span className="font-bold text-gray-800 mr-4">Oleh: {post.author?.name || 'Redaksi PojokTV'}</span>
                        <span>{new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB</span>
                        {isPremium && <span className="ml-4 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded align-middle">PREMIUM</span>}
                    </div>

                    {/* Foto Utama */}
                    {post.thumbnail && (
                        <div className="w-full mb-6">
                            <img src={post.thumbnail} alt={post.title} className="w-full h-auto max-h-[600px] rounded-lg object-cover" />
                            <span className="text-xs text-gray-500 italic mt-2 block">Ilustrasi: {post.title}</span>
                        </div>
                    )}
                    
                    {/* Wrapper Text & Share Button */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Share Buttons - Sticky di Desktop, Top di Mobile */}
                        <div className="md:w-12 flex md:flex-col gap-4 sticky top-24 h-max py-2">
                            <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"><i className="fa-brands fa-whatsapp"></i></button>
                            <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"><i className="fa-brands fa-facebook"></i></button>
                            <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"><i className="fa-brands fa-x-twitter"></i></button>
                        </div>
                        
                        {/* Teks Berita */}
                        <div className="flex-1 relative">
                            <div 
                                className={`prose prose-lg max-w-none text-gray-800 text-lg leading-relaxed ${showPaywall ? 'mb-20' : ''}`}
                                dangerouslySetInnerHTML={{ __html: displayContent }}
                            ></div>

                            {/* Paywall Overlay */}
                            {showPaywall && (
                                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white to-transparent flex flex-col justify-end items-center pb-8">
                                    <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 text-center max-w-lg mx-auto transform translate-y-12 w-[90%] md:w-full">
                                        <h3 className="text-2xl font-black mb-2 text-gray-900">Artikel Premium Eksklusif</h3>
                                        <p className="text-gray-600 mb-6 text-sm">Anda telah mencapai batas baca gratis. Berlangganan sekarang untuk membaca artikel ini selengkapnya tanpa batas.</p>
                                        <Link 
                                            href={route('subscription.index')}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-200 inline-block"
                                        >
                                            Lihat Penawaran Premium
                                        </Link>
                                        <p className="text-xs text-gray-400 mt-4">Sudah berlangganan? <Link href="/login" className="text-red-600 hover:underline">Masuk</Link></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan (30%) - Sidebar */}
                <div className="lg:col-span-1 border-l border-gray-200 pl-0 lg:pl-8 mt-8 lg:mt-0">
                    <div className="mb-8">
                        <h3 className="text-xl font-black border-l-4 border-red-600 pl-3 mb-6">BERITA TERPOPULER</h3>
                        {/* Looping list berita terpopuler di sini */}
                        <div className="flex gap-4 mb-4 border-b border-gray-100 pb-4">
                            <span className="text-4xl font-black text-gray-200">1</span>
                            <h4 className="font-bold text-sm hover:text-red-600 cursor-pointer">Harga Kebutuhan Pokok Mulai Merangkak Naik Jelang Akhir Tahun...</h4>
                        </div>
                        <div className="flex gap-4 mb-4 border-b border-gray-100 pb-4">
                            <span className="text-4xl font-black text-gray-200">2</span>
                            <h4 className="font-bold text-sm hover:text-red-600 cursor-pointer">Timnas Indonesia Optimis Tembus Final Setelah Mengalahkan...</h4>
                        </div>
                        <div className="flex gap-4 mb-4 border-b border-gray-100 pb-4">
                            <span className="text-4xl font-black text-gray-200">3</span>
                            <h4 className="font-bold text-sm hover:text-red-600 cursor-pointer">KPK Kembali Tetapkan Status Tersangka Kepada Pejabat Daerah...</h4>
                        </div>
                    </div>
                    {/* Slot Iklan Kotak (300x250) */}
                    <div className="w-full h-[250px] bg-gray-200 flex items-center justify-center text-gray-500 text-sm border border-gray-300">
                        [ Iklan 300x250 ]
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
