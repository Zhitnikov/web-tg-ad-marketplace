import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingPage from './components/loading/LoadingPage.tsx';
import './sass/blocks/app/app.scss';
import NotFound from "./pages/NotFoundPage/NotFound.tsx";

const Auth = lazy(() => import('./pages/Auth'));
const MyOrders = lazy(() => import("./pages/MyOrders.tsx"));
const WalletReplenish = lazy(() => import("./pages/WalletReplenish.tsx"));
const Home = lazy(() => import("./pages/Home.tsx"));
const CreateAdPage = lazy(() => import('./pages/CreateAdPage/CreateAdPage.tsx'));
const AdsPage = lazy(() => import('./pages/AdsPage/AdsPage.tsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage/OrdersPage.tsx'));
const SupportPage = lazy(() => import('./pages/SupportPage/SupportPage.tsx'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage/MarketplacePage.tsx'));
const AcceptedAdsPage = lazy(() => import('./pages/AcceptedAdsPage/AcceptedAdsPage.tsx'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute/ProtectedRoute.tsx'));
const RoleProtectedRoute = lazy(() => import('./components/RoleProtectedRoute/RoleProtectedRoute.tsx'));
const RedirectHandler = lazy(() => import('./components/RedirectHandler/RedirectHandler.tsx'));

function App() {
    return (
        <Router>
            <div className="App">
                <Suspense fallback={<LoadingPage />}>
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
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;