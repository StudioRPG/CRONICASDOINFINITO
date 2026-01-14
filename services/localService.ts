import { Item, Magia, Missao, MissaoRank, ClasseTipo, OpcaoViagem, ContextoMundo } from '../types';
import { ITEMS } from '../data/items';
import { MAGIAS } from '../data/spells';
import { LOCAIS } from '../data/locations';

export const getItensLoja = async (nivelJogador: number, local: string): Promise<Item[]> => {
    // Return random 6 items
    const embaralhado = [...ITEMS].sort(() => 0.5 - Math.random());
    return embaralhado.slice(0, 6).map(item => ({ ...item, id: Math.random().toString(36).substr(2, 9) }));
};

export const getMagiasDisponiveis = async (nivelJogador: number, classeJogador: ClasseTipo): Promise<Magia[]> => {
    const magiasValidas = MAGIAS.filter(m => !m.classeRequerida || m.classeRequerida === classeJogador);
    const embaralhado = [...magiasValidas].sort(() => 0.5 - Math.random());
    return embaralhado.slice(0, 4).map(m => ({ ...m, id: Math.random().toString(36).substr(2, 9) }));
};

export const getOpcoesViagem = async (localAtual: string, nivelJogador: number): Promise<OpcaoViagem[]> => {
    const opcoes = LOCAIS.filter(l => l.nome !== localAtual)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    return opcoes.map(l => ({
        nome: l.nome,
        bioma: l.bioma,
        descricao: l.descricao,
        nivelPerigo: l.nivelPerigo > 7 ? 'Extremo' : l.nivelPerigo > 4 ? 'Alto' : l.nivelPerigo > 2 ? 'Médio' : 'Baixo'
    }));
};

export const getContextoMundo = (nomeLocal: string): ContextoMundo | null => {
    const loc = LOCAIS.find(l => l.nome === nomeLocal);
    if (loc) {
        return {
            bioma: loc.bioma,
            descricao: loc.descricao,
            hostil: loc.hostil,
            reinoNome: loc.reino,
            governoTipo: loc.tipo
        };
    }
    return null;
};
