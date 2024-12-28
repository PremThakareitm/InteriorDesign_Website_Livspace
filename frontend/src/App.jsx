import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Shared/Header';
import AppRoutes from './routes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen w-full bg-surface font-sans scrollbar-luxury">
          <Header />
          <AnimatePresence mode="wait">
            <main className="w-full py-16 min-h-[calc(100vh-4rem)]"> 
              <AppRoutes />
            </main>
          </AnimatePresence>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
