import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        post('/login', {
            preserveScroll: true,
            resetOnSuccess: true,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <Head title="Log in - PojokTV"/>

            {/* Bagian Logo - Responsif (Mengecil di HP, Membesar di Desktop) */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-center">
                <Link className="flex flex-col items-center justify-center group" href="/">
                    <div className="font-black tracking-tighter leading-none mb-2 flex items-baseline justify-center">
                        <span className="text-gray-900 text-5xl sm:text-6xl group-hover:text-red-600 transition-colors">Pojok</span>
                        <span className="text-red-600 text-4xl sm:text-5xl ml-0.5">TV.com</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase text-center mt-1">
                        Portal Berita Terkini & Terpercaya
                    </span>
                </Link>
            </div>

            {/* Bagian Card Form - Melayang & Rounded di SEMUA Layar */}
            <div className="mt-8 mx-auto w-full max-w-md">
                <div className="bg-white py-8 px-6 shadow-2xl rounded-xl border-t-[5px] border-red-600 sm:px-10">
                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-6" noValidate>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email Address</label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                                    required
                                    autoComplete="username"
                                    placeholder="Masukkan email..."
                                />
                                {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email}</span>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-shadow"
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                {errors.password && <span className="text-red-600 text-sm mt-1">{errors.password}</span>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    name="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                {canResetPassword && (
                                    <Link className="font-bold text-red-600 hover:text-red-800 transition-colors" href="/forgot-password">
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-black tracking-wider text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-all cursor-pointer relative z-50"
                            >
                                LOG IN SEKARANG
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* Copyright Note */}
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} PojokTV.com - Hak Cipta Dilindungi.</p>
            </div>
        </div>
    );
}
