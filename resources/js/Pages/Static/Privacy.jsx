import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Privacy() {
    return (
        <PublicLayout>
            <Head title="Kebijakan Privasi - PojokTV" />
            
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 border-b-4 border-red-600 pb-2 mb-6 uppercase tracking-tight">
                    Kebijakan Privasi
                </h1>
                
                <div className="prose prose-red max-w-none text-gray-700 leading-relaxed space-y-6">
                    <p className="text-lg font-medium text-gray-900">
                        Di <span className="font-bold text-red-600">PojokTV.com</span>, privasi pengunjung kami adalah hal yang sangat penting bagi kami. Dokumen kebijakan privasi ini menguraikan jenis informasi pribadi yang diterima dan dikumpulkan oleh kami serta bagaimana informasi tersebut digunakan.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Informasi yang Kami Kumpulkan</h2>
                    <p>
                        Kami dapat mengumpulkan informasi pribadi seperti alamat email ketika Anda mendaftar buletin, berinteraksi dengan kami melalui formulir kontak, atau masuk sebagai administrator. Selain itu, sistem kami dapat merekam informasi non-pribadi seperti alamat IP, tipe browser, dan riwayat kunjungan demi keperluan analisis lalu lintas situs (Google Analytics).
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Cookies dan Web Beacon</h2>
                    <p>
                        PojokTV.com menggunakan cookies untuk menyimpan informasi tentang preferensi pengunjung, merekam informasi spesifik pengguna tentang halaman mana yang diakses atau dikunjungi pengguna, dan menyesuaikan konten halaman web berdasarkan tipe browser pengunjung atau informasi lain yang dikirimkan pengunjung melalui browser mereka.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Keamanan Data</h2>
                    <p>
                        Kami berkomitmen untuk menjaga keamanan data Anda. Kami tidak akan pernah menjual, menyewakan, atau menyebarluaskan informasi pribadi pengunjung kami kepada pihak ketiga tanpa persetujuan eksplisit Anda, kecuali jika diharuskan oleh hukum dan peraturan yang berlaku di Republik Indonesia.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Perubahan Kebijakan Privasi</h2>
                    <p>
                        PojokTV.com berhak memperbarui Kebijakan Privasi ini kapan saja. Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk melihat perubahan. Perubahan atas kebijakan privasi ini efektif segera setelah diposting di halaman ini.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
