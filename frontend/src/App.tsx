import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/auth" replace />} />
                    <Route path="/auth" element={<Auth />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;