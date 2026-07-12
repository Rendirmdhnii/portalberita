import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Terms() {
    return (
        <PublicLayout>
            <Head title="Ketentuan Layanan - PojokTV" />
            
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 border-b-4 border-red-600 pb-2 mb-6 uppercase tracking-tight">
                    Ketentuan Layanan
                </h1>
                
                <div className="prose prose-red max-w-none text-gray-700 leading-relaxed space-y-6">
                    <p className="text-lg font-medium text-gray-900">
                        Selamat datang di <span className="font-bold text-red-600">PojokTV.com</span>. Dengan mengakses dan menggunakan situs web ini, Anda dianggap telah memahami dan menyetujui seluruh ketentuan layanan berikut:
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Penggunaan Konten</h2>
                    <p>
                        Seluruh konten berupa teks, gambar, video, logo, dan suara yang disajikan di PojokTV.com hanya diperkenankan untuk penggunaan pribadi, edukasi, dan non-komersial. Dilarang keras menyalin, mempublikasikan ulang, memodifikasi, atau mendistribusikan ulang konten kami untuk tujuan komersial tanpa izin tertulis dari manajemen redaksi PojokTV.com.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Hak Cipta dan Atribusi</h2>
                    <p>
                        Semua tulisan dan materi yang diterbitkan adalah milik eksklusif PojokTV.com atau pemegang lisensi terkait. Jika Anda ingin mengutip sebagian kecil dari berita kami, Anda diwajibkan mencantumkan tautan aktif (backlink) yang mengarah langsung ke halaman artikel PojokTV.com yang dikutip.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Tanggung Jawab Kolom Komentar</h2>
                    <p>
                        Pembaca bertanggung jawab penuh atas komentar atau pendapat yang dituliskan di kolom interaksi publik PojokTV.com. Manajemen kami tidak bertanggung jawab atas kerugian atau masalah hukum yang ditimbulkan dari komentar pihak ketiga. Kami berhak melakukan tindakan tegas berupa moderasi, penghapusan komentar, hingga pemblokiran akun pengguna yang melanggar ketentuan.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Batasan Tanggung Jawab</h2>
                    <p>
                        PojokTV.com berupaya memberikan informasi seakurat mungkin, namun kami tidak memberikan jaminan mutlak bahwa semua data bebas dari kesalahan manusiawi. Kami tidak bertanggung jawab atas dampak langsung maupun tidak langsung dari penggunaan informasi yang disajikan di situs ini.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
