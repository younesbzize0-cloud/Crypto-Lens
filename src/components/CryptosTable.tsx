import { useCryptoPrices } from "../Hooks/useCryptoPrices.ts";

export const CryptosTable = () => {
    
    const { data: cryptoPrices, isLoading, error } = useCryptoPrices();

    if (isLoading) {
        return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;
    }
    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>Error: {error.message}</div>;
    }
    
    if (cryptoPrices){
        return (
            <div className="crypto-section">
                <h2>Marché Crypto (Top 50)</h2>
            
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Rang</th>
                                <th>Nom</th>
                                <th>Prix</th>
                                <th>Symbole</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cryptoPrices?.map((crypto, index) => (
                                <tr key={crypto.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="crypto-name-cell">
                                            <img src={crypto.image} alt={crypto.name} />
                                            <span>{crypto.name}</span>
                                        </div>
                                    </td>
                                    <td className="price-cell">
                                        ${crypto.current_price.toLocaleString()}
                                    </td>
                                    <td className="symbol-cell">
                                        {crypto.symbol}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    return null;
}
