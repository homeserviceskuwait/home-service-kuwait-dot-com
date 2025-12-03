import React, { useState, useEffect, useRef } from 'react';
import { Activity, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Zap, Gauge } from 'lucide-react';

interface SEOCheck {
    id: string;
    label: string;
    status: 'pass' | 'fail' | 'warning' | 'loading';
    message?: string;
}

const PerformanceView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [lastCheck, setLastCheck] = useState<Date | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [seoChecks, setSeoChecks] = useState<SEOCheck[]>([
        { id: 'title', label: 'Homepage Title', status: 'loading' },
        { id: 'description', label: 'Meta Description', status: 'loading' },
        { id: 'h1', label: 'H1 Heading', status: 'loading' },
        { id: 'sitemap', label: 'Sitemap.xml', status: 'loading' },
        { id: 'robots', label: 'Robots.txt', status: 'loading' },
    ]);

    // Simulated Performance Metrics
    const performanceMetrics = {
        score: 92,
        lcp: '1.2s', // Largest Contentful Paint
        fid: '12ms', // First Input Delay
        cls: '0.04', // Cumulative Layout Shift
        ttfb: '0.3s', // Time to First Byte
    };

    const runChecks = async () => {
        setLoading(true);
        const newChecks = [...seoChecks].map(c => ({ ...c, status: 'loading' as const, message: undefined }));
        setSeoChecks(newChecks);

        try {
            // Check Sitemap & Robots (Static files)
            const checkStaticFiles = async () => {
                try {
                    const sitemapRes = await fetch('/sitemap.xml');
                    updateCheck('sitemap', sitemapRes.ok ? 'pass' : 'fail', sitemapRes.ok ? 'Accessible' : 'Not found (404)');
                } catch {
                    updateCheck('sitemap', 'fail', 'Network error');
                }

                try {
                    const robotsRes = await fetch('/robots.txt');
                    updateCheck('robots', robotsRes.ok ? 'pass' : 'fail', robotsRes.ok ? 'Accessible' : 'Not found (404)');
                } catch {
                    updateCheck('robots', 'fail', 'Network error');
                }
            };

            await checkStaticFiles();

            // Check Homepage DOM via Iframe
            if (iframeRef.current) {
                // Reset iframe to trigger reload if needed
                iframeRef.current.src = 'about:blank';

                setTimeout(() => {
                    if (iframeRef.current) {
                        iframeRef.current.src = '/';
                    }
                }, 100);
            }

        } catch (error) {
            console.error('Error running checks:', error);
            setLoading(false);
        }
    };

    const handleIframeLoad = () => {
        if (!iframeRef.current || iframeRef.current.src === 'about:blank') return;

        let attempts = 0;
        const maxAttempts = 20; // 10 seconds total

        const checkInterval = setInterval(() => {
            attempts++;
            try {
                const doc = iframeRef.current?.contentDocument;
                if (!doc) {
                    if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        setLoading(false);
                    }
                    return;
                }

                // Check Title
                const title = doc.title;
                const titlePass = title && title !== 'Vite + React';

                // Check Description
                const descriptionMeta = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
                const description = descriptionMeta?.getAttribute('content');
                const descriptionPass = !!description;

                // Check H1
                const h1 = doc.querySelector('h1');
                const h1Pass = !!h1;

                // If all pass, or we reached max attempts, update and finish
                if ((titlePass && descriptionPass && h1Pass) || attempts >= maxAttempts) {
                    clearInterval(checkInterval);

                    updateCheck('title', titlePass ? 'pass' : 'fail', title ? `Found: "${title.substring(0, 30)}..."` : 'Missing title tag');

                    const metaCount = doc.querySelectorAll('meta').length;
                    updateCheck('description', descriptionPass ? 'pass' : 'fail', description ? `Found: ${description.length} chars` : `Missing (Found ${metaCount} meta tags)`);

                    updateCheck('h1', h1Pass ? 'pass' : 'fail', h1 ? `Found: "${h1.innerText.substring(0, 30)}..."` : 'Missing H1 tag');

                    setLastCheck(new Date());
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error inspecting iframe:', error);
                if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    setLoading(false);
                }
            }
        }, 500);
    };

    const updateCheck = (id: string, status: 'pass' | 'fail' | 'warning', message: string) => {
        setSeoChecks(prev => prev.map(c => c.id === id ? { ...c, status, message } : c));
    };

    useEffect(() => {
        runChecks();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'fail': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default: return <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />;
        }
    };

    return (
        <div className="space-y-8">
            {/* Hidden Iframe for SEO Checks */}
            {/* We use absolute positioning off-screen instead of display:none to ensure the browser renders the content */}
            <iframe
                ref={iframeRef}
                className="absolute top-0 left-[-9999px] w-[1024px] h-[768px] opacity-0 pointer-events-none"
                title="seo-check-frame"
                onLoad={handleIframeLoad}
            />

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Performance & SEO</h2>
                    <p className="text-slate-500 dark:text-slate-400">Monitor your site's health and performance metrics</p>
                </div>
                <button
                    onClick={runChecks}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Run Checks
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Score Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Performance Score
                    </h3>
                    <div className="flex flex-col items-center justify-center py-4">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-slate-100 dark:text-slate-700"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={351.86}
                                    strokeDashoffset={351.86 * (1 - performanceMetrics.score / 100)}
                                    className="text-green-500 transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute text-4xl font-bold text-slate-800 dark:text-white">
                                {performanceMetrics.score}
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">Good Performance</p>
                    </div>
                </div>

                {/* Core Web Vitals */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 lg:col-span-2">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
                        <Gauge className="w-5 h-5 text-blue-500" />
                        Core Web Vitals (Simulated)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">LCP</div>
                            <div className="text-2xl font-bold text-green-500">{performanceMetrics.lcp}</div>
                            <div className="text-xs text-slate-400">Largest Contentful Paint</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">FID</div>
                            <div className="text-2xl font-bold text-green-500">{performanceMetrics.fid}</div>
                            <div className="text-xs text-slate-400">First Input Delay</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">CLS</div>
                            <div className="text-2xl font-bold text-green-500">{performanceMetrics.cls}</div>
                            <div className="text-xs text-slate-400">Cumulative Layout Shift</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">TTFB</div>
                            <div className="text-2xl font-bold text-green-500">{performanceMetrics.ttfb}</div>
                            <div className="text-xs text-slate-400">Time to First Byte</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live SEO Checks */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-teal-500" />
                        Live SEO Health Checks
                    </h3>
                    {lastCheck && (
                        <span className="text-xs text-slate-400">
                            Last checked: {lastCheck.toLocaleTimeString()}
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    {seoChecks.map((check) => (
                        <div key={check.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-4">
                                {getStatusIcon(check.status)}
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white">{check.label}</div>
                                    {check.message && (
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            {check.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                ${check.status === 'pass' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    check.status === 'fail' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                {check.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PerformanceView;
