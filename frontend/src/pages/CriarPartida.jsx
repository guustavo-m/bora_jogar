import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';
import Button from '../components/Button';
import Input from '../components/Input';
import { API_URL, requisicaoProtegida } from '../services/api';

const hoje = new Date();
const dataMinima = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

export default function CriarPartida() {
    const [esportes, setEsportes] = useState([]);
    const [form, setForm] = useState({ nome: '', esporte_id: '', data: '', horario: '', local: '', max_participantes: 12, descricao: '' });
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navegar = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/esportes`)
            .then(r => {
                if (!r.ok) throw new Error('Erro ao carregar modalidades');
                return r.json();
            })
            .then(setEsportes)
            .catch(error => setErro(error.message));
    }, []);

    function alterar(campo, valor) {
        setForm(atual => ({ ...atual, [campo]: valor }));
    }

    async function publicar(evento) {
        evento.preventDefault();
        setErro('');
        setCarregando(true);
        try {
            const partida = await requisicaoProtegida('/partidas', {
                method: 'POST',
                body: JSON.stringify({ ...form, esporte_id: Number(form.esporte_id), max_participantes: Number(form.max_participantes) })
            });
            navegar(`/partidas/${partida.id}`);
        } catch (error) {
            setErro(error.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="page-container max-w-4xl pb-16 pt-10 sm:pt-14">
            <p className="eyebrow">Organize seu jogo</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-stone-900">Criar nova partida</h1>
            <p className="mt-2 text-sm text-stone-500">Preencha as informações abaixo para publicar sua partida.</p>

            <form onSubmit={publicar} className="panel mt-8 p-5 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                    <Input as="select" id="esporte_id" label="Modalidade" required value={form.esporte_id} onChange={e => alterar('esporte_id', e.target.value)}>
                        <option value="">Selecione um esporte</option>
                        {esportes.map(esporte => <option key={esporte.id} value={esporte.id}>{esporte.nome}</option>)}
                    </Input>
                    <Input id="nome" label="Nome da partida" placeholder="Ex.: Futebol de quarta" required maxLength={150} value={form.nome} onChange={e => alterar('nome', e.target.value)} />
                    <Input id="data" label="Data" type="date" min={dataMinima} required value={form.data} onChange={e => alterar('data', e.target.value)} />
                    <Input id="horario" label="Horário" type="time" required value={form.horario} onChange={e => alterar('horario', e.target.value)} />
                    <div className="sm:col-span-2">
                        <Input id="local" label="Local" placeholder="Nome do espaço ou endereço" required maxLength={200} value={form.local} onChange={e => alterar('local', e.target.value)} />
                    </div>
                    <div>
                        <label className="field-label">Número máximo de participantes</label>
                        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-1.5">
                            <button type="button" onClick={() => alterar('max_participantes', Math.max(1, Number(form.max_participantes) - 1))} className="rounded-lg p-2 text-orange-600 hover:bg-orange-100"><FiMinus /></button>
                            <span className="font-bold text-stone-800">{form.max_participantes}</span>
                            <button type="button" onClick={() => alterar('max_participantes', Math.min(100, Number(form.max_participantes) + 1))} className="rounded-lg p-2 text-orange-600 hover:bg-orange-100"><FiPlus /></button>
                        </div>
                    </div>
                    <Input id="descricao" label="Descrição" placeholder="Conte um pouco sobre a partida" maxLength={1000} value={form.descricao} onChange={e => alterar('descricao', e.target.value)} />
                </div>

                {erro && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
                <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-stone-100 pt-5 sm:flex-row">
                    <Button variant="secondary" onClick={() => navegar('/')}>Cancelar</Button>
                    <Button type="submit" loading={carregando}>Publicar partida</Button>
                </div>
            </form>
        </main>
    );
}