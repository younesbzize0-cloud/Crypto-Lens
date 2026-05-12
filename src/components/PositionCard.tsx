import { Banknote, Trash2 } from "lucide-react"; // Ajout de Banknote
import { usePortfolioStore } from "../store/portfolioStore";
import { usePnlCalculator } from "../hooks/usePnlCalculator";
import { formatUSD, formatPct } from "../utils/pnl";

export function PositionCard() {
  const removePosition = usePortfolioStore((s) => s.removePosition);
  const sellPosition = usePortfolioStore((s) => s.sellPosition); // Récupération de l'action
  const summary = usePnlCalculator();

  if (summary.positions.length === 0) {
    return null;
  }

  const sorted = [...summary.positions].sort(
    (a, b) => b.absolutePnL - a.absolutePnL
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Positions ({sorted.length})
      </h3>
      {sorted.map((pos) => {
        const isPnlPositive = pos.absolutePnL >= 0;
        
        // On récupère le prix actuel via le summary (currentValue / quantity)
        const currentPrice = pos.currentValue / pos.quantity;

        return (
          <div
            key={pos.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4 group hover:border-gray-700 transition-colors"
          >
            <img
              src={pos.image}
              alt={pos.name}
              className="w-10 h-10 rounded-full shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="font-bold text-gray-100">{pos.symbol.toUpperCase()}</span>
                  <span className="text-gray-500 text-xs ml-2">{pos.quantity} unités</span>
                </div>
                <span className="text-gray-100 font-mono font-semibold text-sm">
                  {formatUSD(pos.currentValue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  Achat moy. {formatUSD(pos.avgBuyPrice)} · {pos.allocationPercent.toFixed(1)}% alloc.
                </span>
                <span className={`text-xs font-semibold font-mono ${isPnlPositive ? "text-emerald-400" : "text-red-400"}`}>
                  {isPnlPositive ? "▲" : "▼"} {formatUSD(Math.abs(pos.absolutePnL))} ({formatPct(pos.percentagePnL)})
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
              {/* Nouveau Bouton Vendre */}
              <button
                onClick={() => sellPosition(pos.id, currentPrice)}
                title="Vendre au prix du marché"
                className="flex items-center justify-center p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition-colors"
              >
                <Banknote size={16} />
              </button>
              
              {/* Bouton Supprimer (gardé pour correction d'erreur) */}
              <button
                onClick={() => removePosition(pos.id)}
                title="Supprimer sans vendre (annulation)"
                className="flex items-center justify-center p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-400 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}