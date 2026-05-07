import { MarketTable } from "../components/MarketTable";
import { useCryptoPrices } from "../hooks/useCryptoPrices";

function Home() {
  const { data: assets, isLoading } = useCryptoPrices();

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6">
      <h1 className="text-2xl font-bold mb-4">CryptoLens - Marché</h1>
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-800/60 rounded-xl" />
          ))}
        </div>
      ) : (
        <MarketTable assets={assets ?? []} />
      )}
    </main>
  );
}

export default Home;
