import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import MyOrders from "./pages/MyOrders.tsx";
import WalletReplenish from "./pages/WalletReplenish.tsx";
import Home from "./pages/Home.tsx";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/auth" replace />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/wallet-replenish" element={<WalletReplenish />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;