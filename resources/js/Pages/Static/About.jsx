import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function About() {
    return (
        <PublicLayout>
            <Head title="Tentang Kami - PojokTV" />
            
            <div className="max-w-4xl mx-auto px-6 py-12 bg-white my-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 border-b-4 border-red-600 pb-2 mb-6 uppercase tracking-tight">
                    Tentang Kami
                </h1>
                
                <div className="prose prose-red max-w-none text-gray-700 leading-relaxed space-y-6">
                    <p className="text-lg font-medium text-gray-900">
                        Selamat datang di <span className="font-bold text-red-600">PojokTV.com</span> – Portal Berita Digital Terdepan dan Terpercaya di Sidoarjo.
                    </p>
                    
                    <p>
                        PojokTV.com berkomitmen untuk menyajikan informasi yang tajam, terpercaya, dan terkini mengenai dinamika pemerintahan, politik, hukum, sosial budaya, pendidikan, ekonomi, olahraga, serta kesehatan khususnya di wilayah Kabupaten Sidoarjo dan sekitarnya. Kami memadukan kecepatan laporan dengan akurasi fakta demi menjaga kualitas jurnalisme yang berintegritas.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Visi & Misi</h2>
                    <div className="space-y-4 pl-4 border-l-4 border-red-600">
                        <div>
                            <span className="font-bold block text-gray-900">Visi:</span>
                            <p>Menjadi portal berita digital regional utama di Jawa Timur yang mendidik, mencerahkan, dan menjadi rujukan tepercaya bagi masyarakat.</p>
                        </div>
                        <div>
                            <span className="font-bold block text-gray-900">Misi:</span>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Menyajikan berita secara cepat, akurat, dan berimbang.</li>
                                <li>Mengawal transparansi pemerintahan dan pembangunan publik.</li>
                                <li>Menjadi jembatan aspirasi warga dengan pemangku kebijakan.</li>
                                <li>Menerapkan standar jurnalisme tinggi sesuai kode etik pers Indonesia.</li>
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Struktur Redaksi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-lg">
                        <div>
                            <p className="font-bold text-gray-900">Pemimpin Redaksi / Penanggung Jawab:</p>
                            <p className="text-gray-600">Ahmad Fauzi, S.I.Kom</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Redaktur Pelaksana:</p>
                            <p className="text-gray-600">Budi Setiawan</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Dewan Redaksi:</p>
                            <p className="text-gray-600">Tim Pojok Media Sidoarjo</p>
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Alamat Redaksi:</p>
                            <p className="text-gray-600">Jl. Pahlawan No.123, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Fokus Liputan</h2>
                    <p>
                        Fokus liputan kami mencakup perkembangan perkotaan, ekonomi kreatif, dinamika politik daerah, pelayanan administrasi publik, hingga potret kehidupan sosial warga Sidoarjo. Kami berupaya keras memberikan ulasan yang mendalam dan mudah dipahami oleh pembaca lintas generasi.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
