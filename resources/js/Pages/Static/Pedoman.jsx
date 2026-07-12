import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Pedoman() {
    return (
        <PublicLayout>
            <Head title="Pedoman Pemberitaan Media Siber - PojokTV" />
            
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 border-b-4 border-red-600 pb-2 mb-6 uppercase tracking-tight">
                    Pedoman Pemberitaan Media Siber
                </h1>
                
                <div className="prose prose-red max-w-none text-gray-700 leading-relaxed space-y-6">
                    <p className="text-lg font-medium text-gray-900">
                        Kemerdekaan berpendapat, kemerdekaan berekspresi, dan kemerdekaan pers adalah hak asasi manusia yang dilindungi Pancasila, Undang-Undang Dasar 1945, dan Deklarasi Universal Hak Asasi Manusia PBB.
                    </p>
                    
                    <p>
                        Kehadiran media siber di Indonesia juga merupakan bagian dari kemerdekaan berpendapat dan kemerdekaan pers tersebut. Guna menjamin profesionalisme dan kredibilitas, <span className="font-bold text-red-600">PojokTV.com</span> menetapkan pedoman pemberitaan siber berikut:
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Verifikasi dan Keberimbangan Berita</h2>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Setiap berita yang dipublikasikan di PojokTV.com wajib melalui proses verifikasi fakta dan konfirmasi dari pihak terkait.</li>
                        <li>Berita harus disajikan secara berimbang, adil, serta mengedepankan asas praduga tak bersalah.</li>
                        <li>Berita yang dapat merugikan nama baik seseorang atau lembaga harus memuat konfirmasi dari pihak yang dirugikan (hak jawab).</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Isi Buatan Pengguna (User Generated Content)</h2>
                    <p>
                        PojokTV.com tidak bertanggung jawab atas komentar atau tulisan kiriman dari pengguna. Namun, kami berhak menyunting, menghapus, atau memoderasi konten pengguna yang mengandung unsur SARA, ujaran kebencian, fitnah, pornografi, atau yang melanggar hukum positif di Indonesia.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Koreksi, Ralat, dan Hak Jawab</h2>
                    <ul className="list-decimal list-inside space-y-2">
                        <li>Ralat, koreksi, maupun keluhan pembaca terkait kesalahan penulisan fakta akan segera ditindaklanjuti secara cepat dan transparan pada berita bersangkutan.</li>
                        <li>Hak jawab pembaca atau narasumber yang keberatan terhadap isi berita akan diakomodasi sepenuhnya sesuai dengan Undang-Undang Pers No. 40 Tahun 1999.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Hak Cipta dan Hak Kekayaan Intelektual</h2>
                    <p>
                        Seluruh materi berita (teks, gambar, video, ilustrasi) di PojokTV.com dilindungi undang-undang hak cipta. Pengambilan atau pemanfaatan materi oleh pihak luar wajib mencantumkan kredit secara jelas, yaitu "Sumber: PojokTV.com".
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
