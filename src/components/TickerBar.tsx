import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Asset {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface TickerBarProps {
  assets: Asset[];
}

export function TickerBar({ assets }: TickerBarProps) {
  // Duplicate items so the scroll loop is seamless
  const items = useMemo(() => [...assets, ...assets], [assets]);

  if (!assets || assets.length === 0) return null;

  return (
    <div
      className="w-full overflow-hidden border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm"
      style={{ height: "36px" }}
    >
      <div
        className="flex items-center h-full whitespace-nowrap"
        style={{
          animation: "ticker-scroll 40s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((asset, i) => {
          const isPositive = asset.price_change_percentage_24h >= 0;
          return (
            <span
              key={`${asset.symbol}-${i}`}
              className="inline-flex items-center gap-2 px-5 text-xs font-bold tracking-wide border-r border-gray-800/60"
              style={{ height: "36px" }}
            >
              {/* Symbol */}
              <span className="text-gray-300 uppercase">{asset.symbol}</span>

              {/* Price */}
              <span className="text-white font-mono">
                $
                {asset.current_price.toLocaleString("en-US", {
                  minimumFractionDigits: asset.current_price < 1 ? 4 : 2,
                  maximumFractionDigits: asset.current_price < 1 ? 4 : 2,
                })}
              </span>

              {/* Change % */}
              <span
                className={`inline-flex items-center gap-0.5 ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isPositive ? (
                  <TrendingUp size={11} />
                ) : (
                  <TrendingDown size={11} />
                )}
                {isPositive ? "+" : ""}
                {asset.price_change_percentage_24h.toFixed(2)}%
              </span>

              {/* Dot separator */}
              <span className="text-gray-700 ml-1">·</span>
            </span>
          );
        })}
      </div>

      {/* Keyframe injected inline so no tailwind config needed */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        div[style*="ticker-scroll"]:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
