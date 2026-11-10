import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CriarPartida from './pages/CriarPartida';
import DetalhesPartida from './pages/DetalhesPartida';
import Perfil from './pages/Perfil';

export default function App() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/partidas" element={<Home />} />
                <Route path="/partidas/:id" element={<DetalhesPartida />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/criar-partida" element={<CriarPartida />} />
                    <Route path="/perfil" element={<Perfil />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <footer className="border-t border-stone-100 py-6 text-center text-xs text-stone-400">
                © {new Date().getFullYear()} Bora Jogar? — Encontre sua próxima partida.
            </footer>
        </div>
    );
}