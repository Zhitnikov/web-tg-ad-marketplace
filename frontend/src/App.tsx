import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import MyOrders from "./pages/MyOrders.tsx";
import WalletReplenish from "./pages/WalletReplenish.tsx";
import Home from "./pages/Home.tsx";
import { CreateAdPage } from './pages/CreateAdPage';
import { AdsPage } from './pages/AdsPage';
import { OrdersPage } from './pages/OrdersPage';
import { SupportPage } from './pages/SupportPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RedirectHandler } from './components/RedirectHandler';
import './sass/blocks/app/app.scss';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<RedirectHandler />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <AdsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <OrdersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-ad"
                        element={
                            <ProtectedRoute>
                                <CreateAdPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/support"
                        element={
                            <ProtectedRoute>
                                <SupportPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-orders"
                        element={
                            <ProtectedRoute>
                                <MyOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wallet"
                        element={
                            <ProtectedRoute>
                                <WalletReplenish />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;