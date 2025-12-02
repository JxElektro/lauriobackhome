'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { startTutorial } from '@/lib/tutorial';
import { 
    faHome, 
    faLayerGroup, 
    faWandMagicSparkles, 
    faChartPie,
    faGear,
    faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { label: 'Dashboard', path: '/', icon: faHome },
        { label: 'Backlog', path: '/backlog', icon: faLayerGroup },
        { label: 'Generar', path: '/generate', icon: faWandMagicSparkles },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white/80 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-8 flex items-center pl-2.5 pt-2">
                    <span className="mr-2 h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">L</span>
                    <span className="self-center whitespace-nowrap text-xl font-semibold text-ink-900 font-display">Laurio</span>
                </div>
                
                <ul className="space-y-2 font-medium">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.path}>
                                <button
                                    id={`nav-${item.label.toLowerCase()}`}
                                    onClick={() => router.push(item.path)}
                                    className={`group flex w-full items-center rounded-xl p-3 transition-all ${
                                        isActive 
                                            ? 'bg-brand-50 text-brand-700 shadow-sm' 
                                            : 'text-ink-600 hover:bg-slate-100 hover:text-ink-900'
                                    }`}
                                >
                                    <FontAwesomeIcon 
                                        icon={item.icon} 
                                        className={`h-5 w-5 transition-colors ${
                                            isActive ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600'
                                        }`} 
                                    />
                                    <span className="ml-3">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto">
                    <div className="mb-4 px-3 py-4 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 border border-brand-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-600">
                                <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
                            </div>
                            <p className="text-sm font-semibold text-brand-900">Plan Pro</p>
                        </div>
                        <p className="text-xs text-brand-700 mb-3">Tienes acceso total al motor de IA de Laurio.</p>
                        <button className="w-full rounded-lg bg-white py-1.5 text-xs font-semibold text-brand-700 shadow-sm hover:bg-brand-50 transition-colors">
                            Configuración
                        </button>
                    </div>
                    
                    <ul className="space-y-2 border-t border-slate-200 pt-4 font-medium">
                        <li>
                            <button 
                                onClick={() => startTutorial()}
                                className="group flex w-full items-center rounded-xl p-3 text-ink-600 transition-all hover:bg-slate-100 hover:text-ink-900"
                            >
                                <FontAwesomeIcon icon={faCircleQuestion} className="h-5 w-5 text-ink-400 group-hover:text-ink-600" />
                                <span className="ml-3">Tutorial</span>
                            </button>
                        </li>
                        <li>
                            <button className="group flex w-full items-center rounded-xl p-3 text-ink-600 transition-all hover:bg-slate-100 hover:text-ink-900">
                                <FontAwesomeIcon icon={faGear} className="h-5 w-5 text-ink-400 group-hover:text-ink-600" />
                                <span className="ml-3">Ajustes</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </aside>
    );
}
