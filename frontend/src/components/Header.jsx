import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiDribbble, FiLogOut, FiPlusCircle, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/useAuth';

export default function Header() {
    const { autenticado, fazerLogout } = useAuth();
    const navegar = useNavigate();

    function sair() {
        fazerLogout();
        navegar('/login');
    }

    const linkClass = ({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-orange-50 text-orange-700' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`;

    return (
        <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/95 backdrop-blur">
            <div className="page-container flex h-[72px] items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                        <FiDribbble className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-extrabold tracking-tight text-stone-900">Bora Jogar<span className="text-orange-500">?</span></span>
                </Link>

                <nav className="flex items-center gap-1">
                    <NavLink to="/" end className={linkClass}>Início</NavLink>
                    <NavLink to="/partidas" className={linkClass}>Partidas</NavLink>
                    {autenticado && (
                        <>
                            <NavLink to="/criar-partida" className={({ isActive }) => `${linkClass({ isActive })} hidden sm:inline-flex`}>
                                <FiPlusCircle className="mr-1 inline" /> Criar partida
                            </NavLink>
                            <NavLink to="/perfil" className={linkClass}>
                                <FiUser className="mr-1 inline" /> <span className="hidden sm:inline">Perfil</span>
                            </NavLink>
                            <button onClick={sair} title="Sair" className="rounded-lg p-2 text-stone-500 hover:bg-red-50 hover:text-red-600">
                                <FiLogOut />
                            </button>
                        </>
                    )}
                    {!autenticado && (
                        <Link to="/login" className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600">Entrar</Link>
                    )}
                </nav>
            </div>
        </header>
    );
}