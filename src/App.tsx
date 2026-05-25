import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { 
  TrendingUp, 
  BarChart2, 
  Bell, 
  Settings, 
  Plus, 
  RefreshCw, 
  Moon, 
  Sun, 
  Zap,
  Github,
  Linkedin
} from "lucide-react";

import { MarketTable } from "./components/MarketTable";
import { PortfolioSummary } from "./components/PortfolioSummary";
import { PositionCard } from "./components/PositionCard";
import { AddPositionModal } from "./components/AddPositionModal";
import { PriceAlertManager } from "./components/PriceAlertManager";
import { PortfolioHistoryChart } from "./components/PortfolioHistoryChart";
import { SimulationControls } from "./components/SimulationControls";
import { useCryptoPrices } from "./hooks/useCryptoPrices";
import { usePriceAlerts } from "./hooks/usePriceAlerts";
import { parseApiError } from "./lib/api";
import { TickerBar } from "./components/TickerBar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,
    },
  },
});

type Tab = "market" | "portfolio" | "alerts" | "settings";

function Dashboard() {
  const [tab, setTab] = useState<Tab>("market");
  const [addOpen, setAddOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const { data: assets, isLoading, isError, error, dataUpdatedAt, refetch, isFetching } =
    useCryptoPrices();

  usePriceAlerts(assets);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "market", label: "Marché", icon: <TrendingUp size={16} /> },
    { id: "portfolio", label: "Portefeuille", icon: <BarChart2 size={16} /> },
    { id: "alerts", label: "Alertes", icon: <Bell size={16} /> },
    { id: "settings", label: "Simulation", icon: <Settings size={16} /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-950 text-gray-100'}`}>
      
      <header className="border-b border-gray-800 bg-gray-900 backdrop-blur-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Zap size={18} className="text-gray-900 fill-current" />
            </div>
            <span className="font-bold tracking-tight text-xl">CryptoLens</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-gray-800 text-gray-500 hover:text-yellow-500 transition-all border border-gray-800"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {lastUpdated && (
              <span className="text-gray-500 text-xs hidden md:block font-medium">
                Mis à jour {lastUpdated}
              </span>
            )}
            
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="text-gray-500 hover:text-yellow-400 transition-colors disabled:opacity-40"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-lg"
            >
              <Plus size={16} /> Position
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors
                ${tab === t.id
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      <TickerBar assets={assets ?? []} />
      
      <main className="max-w-7xl w-full mx-auto px-4 py-8 flex-grow">
        {isError && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-red-600 font-bold text-sm">
            ⚠️ {parseApiError(error)}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {tab === "market" && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <MarketTable assets={assets ?? []} />
                </div>
                <div className="space-y-6">
                  <PortfolioSummary />
                  <PortfolioHistoryChart />
                </div>
              </div>
            )}

            {tab === "portfolio" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <PortfolioSummary />
                  <PortfolioHistoryChart />
                </div>
                <PositionCard />
              </div>
            )}

            {tab === "alerts" && (
              <div className="max-w-xl">
                <PriceAlertManager />
              </div>
            )}

            {tab === "settings" && (
              <div className="max-w-md">
                <SimulationControls />
              </div>
            )}
          </div>
        )}
      </main>

      <AddPositionModal open={addOpen} onClose={() => setAddOpen(false)} />

      <footer className="border-t border-gray-800 bg-gray-900 transition-colors duration-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></span>
            <p className="text-gray-500 text-sm font-bold">
              CryptoLens © {new Date().getFullYear()} — Créé par
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-800 rounded-2xl p-2 shadow-sm">
              <span className="text-sm font-black text-gray-100 pl-2">Younes B'zize</span>
              <div className="flex gap-1 border-l border-gray-800 pl-2">
                <a href="https://github.com/younesbzize0-cloud" target="_blank" className="p-2 text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
                <a href="#" className="p-2 text-gray-500 hover:text-blue-500 transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-800 rounded-2xl p-2 shadow-sm">
              <span className="text-sm font-black text-gray-100 pl-2">Mohammed</span>
              <div className="flex gap-1 border-l border-gray-800 pl-2">
                <a href="#" className="p-2 text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
                <a href="#" className="p-2 text-gray-500 hover:text-blue-500 transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}