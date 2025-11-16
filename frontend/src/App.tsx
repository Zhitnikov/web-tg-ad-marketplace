import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import MyOrders from "./pages/MyOrders.tsx";
import WalletReplenish from "./pages/WalletReplenish.tsx";
import Home from "./pages/Home.tsx";
import { CreateAdPage } from './pages/CreateAdPage';
import { AdsPage } from './pages/AdsPage';
import { OrdersPage } from './pages/OrdersPage';
import { SupportPage } from './pages/SupportPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AcceptedAdsPage } from './pages/AcceptedAdsPage/AcceptedAdsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute/RoleProtectedRoute';
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
                                <RoleProtectedRoute allowedRoles={['Company']}>
                                    <AdsPage />
                                </RoleProtectedRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <RoleProtectedRoute allowedRoles={['Channel']}>
                                    <OrdersPage />
                                </RoleProtectedRoute>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-ad"
                        element={
                            <ProtectedRoute>
                                <RoleProtectedRoute allowedRoles={['Company']}>
                                    <CreateAdPage />
                                </RoleProtectedRoute>
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
                           <Route
                               path="/marketplace"
                               element={
                                   <ProtectedRoute>
                                       <RoleProtectedRoute allowedRoles={['Channel']}>
                                           <MarketplacePage />
                                       </RoleProtectedRoute>
                                   </ProtectedRoute>
                               }
                           />
                           <Route
                               path="/accepted-ads"
                               element={
                                   <ProtectedRoute>
                                       <RoleProtectedRoute allowedRoles={['Company']}>
                                           <AcceptedAdsPage />
                                       </RoleProtectedRoute>
                                   </ProtectedRoute>
                               }
                           />
                       </Routes>
                   </div>
               </Router>
           );
       }

       export default App;