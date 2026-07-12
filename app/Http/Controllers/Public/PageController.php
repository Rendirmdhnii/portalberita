<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('Public/Page', [
            'pageTitle' => 'Tentang Kami',
            'sections' => [
                [
                    'heading' => 'Selamat Datang di PojokTV.com',
                    'body' => 'PojokTV.com adalah portal berita digital yang hadir untuk menyajikan informasi terkini bagi masyarakat luas. Kami berkomitmen untuk menyajikan jurnalisme yang akurat, cepat, berimbang, dan bertanggung jawab. Dengan semangat "Tajam, Terpercaya, Terkini," kami menjadi jendela informasi nasional yang relevan bagi seluruh lapisan masyarakat.',
                ],
                [
                    'heading' => 'Visi Kami',
                    'body' => 'Menjadi media digital terdepan di Indonesia yang dipercaya masyarakat sebagai sumber informasi independen, akurat, dan bermanfaat bagi pembangunan bangsa.',
                ],
                [
                    'heading' => 'Misi Kami',
                    'list' => [
                        'Menyajikan berita yang cepat, akurat, dan berimbang.',
                        'Mengangkat suara dan aspirasi masyarakat dari berbagai penjuru negeri.',
                        'Mendorong transparansi informasi dan pemberdayaan warga melalui edukasi digital.',
                        'Membangun ekosistem media digital yang sehat, profesional, dan beretika.',
                    ],
                ],
                [
                    'heading' => 'Kontak Redaksi',
                    'body' => "Email: redaksi@pojoktv.com\nWhatsApp: 0813-3116-0799\nAlamat Kantor: Jl. Pahlawan No.123, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61213",
                ],
            ],
        ]);
    }

    public function pedoman()
    {
        return Inertia::render('Public/Page', [
            'pageTitle' => 'Pedoman Media Siber',
            'sections' => [
                [
                    'heading' => 'Pedoman Media Siber PojokTV.com',
                    'body' => 'PojokTV.com sepenuhnya tunduk pada Pedoman Pemberitaan Media Siber yang ditetapkan oleh Dewan Pers Indonesia. Pedoman ini merupakan panduan etis dan operasional bagi seluruh insan redaksi dalam memproduksi, menyunting, dan mendistribusikan konten jurnalistik digital.',
                ],
                [
                    'heading' => '1. Verifikasi dan Keberimbangan Berita',
                    'body' => 'Setiap berita yang diterbitkan wajib melalui proses verifikasi fakta yang ketat. Kami berkomitmen untuk memberikan kesempatan yang sama kepada semua pihak yang disebut dalam berita (cover both sides) sebelum berita dipublikasikan.',
                ],
                [
                    'heading' => '2. Hak Jawab dan Hak Koreksi',
                    'body' => 'PojokTV.com menghormati sepenuhnya hak jawab dan hak koreksi setiap individu atau lembaga yang merasa dirugikan oleh pemberitaan kami. Permintaan hak jawab dapat disampaikan melalui email redaksi@pojoktv.com dan akan diproses dalam waktu 1×24 jam.',
                ],
                [
                    'heading' => '3. Konten Iklan dan Editorial',
                    'body' => 'Terdapat pemisahan yang tegas antara konten editorial (berita) dan konten iklan/advertorial. Setiap konten berbayar akan diberi label yang jelas agar pembaca tidak terkecoh.',
                ],
                [
                    'heading' => '4. Perlindungan Identitas Narasumber',
                    'body' => 'Identitas narasumber yang meminta perlindungan (off the record) akan dijaga kerahasiaannya sesuai dengan etika jurnalistik yang berlaku.',
                ],
                [
                    'heading' => '5. Pelaporan Pelanggaran Pedoman',
                    'body' => 'Jika Anda menemukan konten yang melanggar pedoman ini, mohon segera laporkan kepada redaksi kami melalui email redaksi@pojoktv.com. Setiap laporan akan ditindaklanjuti secara serius.',
                ],
            ],
        ]);
    }

    public function privacy()
    {
        return Inertia::render('Public/Page', [
            'pageTitle' => 'Kebijakan Privasi',
            'sections' => [
                [
                    'heading' => 'Kebijakan Privasi PojokTV.com',
                    'body' => 'PojokTV.com menghargai dan berkomitmen untuk melindungi privasi setiap pengunjung dan pengguna platform kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
                ],
                [
                    'heading' => 'Informasi yang Kami Kumpulkan',
                    'body' => 'Kami mengumpulkan informasi yang Anda berikan secara sukarela, seperti nama dan alamat email saat mendaftar. Kami juga mengumpulkan data teknis secara otomatis seperti alamat IP, jenis peramban, dan halaman yang Anda kunjungi untuk keperluan analisis dan peningkatan layanan.',
                ],
                [
                    'heading' => 'Penggunaan Informasi',
                    'body' => 'Informasi yang dikumpulkan digunakan untuk: menyediakan layanan yang Anda minta, mengirimkan newsletter atau pembaruan berita (jika Anda mendaftar), menganalisis pola penggunaan untuk meningkatkan kualitas platform, dan memenuhi kewajiban hukum yang berlaku.',
                ],
                [
                    'heading' => 'Cookies',
                    'body' => 'Kami menggunakan cookies untuk meningkatkan pengalaman berselancar Anda. Anda dapat menonaktifkan cookies melalui pengaturan peramban Anda, namun beberapa fitur situs mungkin tidak berfungsi optimal.',
                ],
                [
                    'heading' => 'Keamanan Data',
                    'body' => 'Kami menerapkan langkah-langkah keamanan teknis yang wajar untuk melindungi data Anda dari akses, pengungkapan, perubahan, atau penghancuran yang tidak sah.',
                ],
                [
                    'heading' => 'Hubungi Kami',
                    'body' => 'Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, hubungi kami di redaksi@pojoktv.com.',
                ],
            ],
        ]);
    }

    public function terms()
    {
        return Inertia::render('Public/Page', [
            'pageTitle' => 'Ketentuan Layanan',
            'sections' => [
                [
                    'heading' => 'Ketentuan Penggunaan PojokTV.com',
                    'body' => 'Dengan mengakses dan menggunakan situs web PojokTV.com, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan yang berlaku berikut ini.',
                ],
                [
                    'heading' => '1. Penggunaan Konten',
                    'body' => 'Seluruh konten yang diterbitkan di PojokTV.com — termasuk teks, foto, video, dan grafis — dilindungi oleh hak cipta. Dilarang keras menyalin, mendistribusikan, atau memodifikasi konten kami tanpa izin tertulis dari redaksi.',
                ],
                [
                    'heading' => '2. Akun Pengguna',
                    'body' => 'Anda bertanggung jawab penuh atas kerahasiaan informasi akun Anda. Jangan pernah membagikan kata sandi kepada siapapun. PojokTV.com tidak akan pernah meminta kata sandi Anda melalui email atau pesan.',
                ],
                [
                    'heading' => '3. Larangan Penggunaan',
                    'body' => 'Dilarang menggunakan platform ini untuk: menyebarkan informasi palsu (hoaks), konten yang bersifat SARA, ujaran kebencian, atau konten pornografi. Pelanggaran akan mengakibatkan penghentian akses secara permanen.',
                ],
                [
                    'heading' => '4. Perubahan Ketentuan',
                    'body' => 'PojokTV.com berhak mengubah ketentuan layanan ini sewaktu-waktu. Perubahan akan diberitahukan melalui situs web kami. Penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan terhadap ketentuan baru.',
                ],
                [
                    'heading' => '5. Hukum yang Berlaku',
                    'body' => 'Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Negara Republik Indonesia, termasuk Undang-Undang Nomor 40 Tahun 1999 tentang Pers dan Undang-Undang Nomor 19 Tahun 2016 tentang Informasi dan Transaksi Elektronik (ITE).',
                ],
            ],
        ]);
    }

    public function redaksi()
    {
        return Inertia::render('Public/Page', [
            'pageTitle' => 'Struktur Redaksi',
            'sections' => [
                [
                    'heading' => 'Struktur Organisasi Redaksi PojokTV.com',
                    'body' => 'Berikut adalah susunan organisasi redaksi PojokTV.com yang bertanggung jawab atas seluruh proses produksi dan penerbitan berita.',
                ],
                [
                    'heading' => 'Pimpinan Redaksi',
                    'list' => [
                        'Pemimpin Redaksi / Penanggung Jawab: Mujianto Primadi',
                        'Dewan Redaksi: Tim Pojok Media Sidoarjo',
                    ],
                ],
                [
                    'heading' => 'Alamat Redaksi',
                    'body' => "Perum Citra Oma Pesona Blok E3/25, RT 37/RW 07,\nDesa Sidokepung, Kecamatan Buduran,\nSidoarjo, Jawa Timur.",
                ],
                [
                    'heading' => 'Kontak Redaksi',
                    'list' => [
                        'Email: redaksi@pojoktv.com',
                        'WhatsApp: 0813-3116-0799',
                    ],
                ],
            ],
        ]);
    }
}
