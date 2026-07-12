import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Page({ pageTitle, sections = [] }) {
    return (
        <PublicLayout>
            <Head title={`${pageTitle} - PojokTV`} />

            <div className="max-w-4xl mx-auto py-10 px-4">
                {/* Page Header */}
                <div className="mb-10 pb-6 border-b-2 border-red-600">
                    <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded mb-3">
                        PojokTV.com
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                        {pageTitle}
                    </h1>
                </div>

                {/* Page Sections */}
                <div className="space-y-8">
                    {sections.map((section, i) => (
                        <div key={i} className="prose-section">
                            {section.heading && (
                                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-red-600 rounded-full inline-block flex-shrink-0"></span>
                                    {section.heading}
                                </h2>
                            )}

                            {/* Paragraph body */}
                            {section.body && (
                                <div className="text-gray-700 text-base leading-relaxed pl-3 whitespace-pre-line">
                                    {section.body}
                                </div>
                            )}

                            {/* List items (for Struktur Redaksi etc.) */}
                            {section.list && section.list.length > 0 && (
                                <ul className="pl-6 space-y-2 text-gray-700 text-base leading-relaxed">
                                    {section.list.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <span className="mt-2 w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
                Halaman ini merupakan bagian dari portal berita digital PojokTV.com.
                </div>
            </div>
        </PublicLayout>
    );
}
