import Header from "./components/Header";
import { CryptosTable } from "./components/CryptosTable";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="header">
        <Header />
      </div>
      <main>
        <CryptosTable />
      </main>
    </QueryClientProvider>
  )
  
}

export default App;