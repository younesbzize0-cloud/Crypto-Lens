import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { CryptoAssetSchema, type CryptoAsset } from "../Types/crypto.ts";

// On crée un schéma pour un tableau (array) d'assets
const CryptoResponseSchema = z.array(CryptoAssetSchema);

const fetchCryptoPrices = async (): Promise<CryptoAsset[]> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1'
  );
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données CoinGecko');
  }

  const data = await response.json();
  
  // Zod va vérifier que les données de l'API correspondent bien à nos attentes
  return CryptoResponseSchema.parse(data); 
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ['cryptoPrices'], // Identifiant unique pour le cache
    queryFn: fetchCryptoPrices,
    refetchInterval: 60000, // Polling toutes les 60 secondes (en millisecondes)
    refetchOnWindowFocus: true, // Rafraîchit quand on revient sur l'onglet
    // TanStack Query gère automatiquement la pause si l'onglet est inactif !
  });
};