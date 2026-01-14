
export type RacaTipo = 'Humano' | 'Elfo' | 'Anão' | 'Halfling' | 'Orc' | 'Meio-Elfo' | 'Minotauro' | 'Fada' | 'Goblin' | 'Celestial' | 'Abissal';
export type ClasseTipo = 'Guerreiro' | 'Mago' | 'Ladino' | 'Paladino' | 'Necromante' | 'Bardo' | 'Ranger' | 'Clérigo' | 'Monge' | 'Druida' | 'Samurai';
export type ItemTipo = 'Arma' | 'Armadura' | 'Acessório' | 'Material';
export type MagiaTipo = 'Ataque' | 'Cura' | 'Suporte';
export type MissaoRank = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type Raridade = 'Comum' | 'Raro' | 'Épico' | 'Lendário';

export interface Atributos {
    forca: number;
    habilidade: number;
    resistencia: number;
    armadura: number;
    poderDeFogo: number;
    vida?: number;
    mana?: number;
}

export interface Magia {
    id: string;
    nome: string;
    descricao: string;
    custoMana: number;
    poder: number;
    tipo: MagiaTipo;
    alvo: 'Unico' | 'Todos';
    classeRequerida?: ClasseTipo;
    elemento: string;
    preco?: number;
}

export interface Item {
    id: string;
    nome: string;
    tipo: ItemTipo;
    descricao: string;
    preco: number;
    bonus: Partial<Atributos>;
    raridade: Raridade;
}

export interface Missao {
    id: string;
    titulo: string;
    descricao: string;
    recompensaOuro: number;
    recompensaXp: number;
    rank: MissaoRank;
    tipoAlvo: 'Monstro' | 'Evento';
}

export interface Jogador {
    nome: string;
    raca: RacaTipo;
    classe: ClasseTipo;
    nivel: number;
    xp: number;
    proximoNivelXp: number;
    hp: number;
    maxHp: number;
    mana: number;
    maxMana: number;
    atributos: Atributos;
    ouro: number;
    localizacao: string;
    inventario: Item[];
    magias: Magia[];
    equipamento: {
        arma: Item | null;
        armadura: Item | null;
        acessorio: Item | null;
    };
    rankGuilda: MissaoRank;
    missoesCompletas: number;
    missaoAtiva: Missao | null;
}

export interface Escolha {
    texto: string;
    consequencia: string;
    impacto: {
        hp?: number;
        mana?: number;
        ouro?: number;
        xp?: number;
        atributos?: Partial<Atributos>;
        magiaAprendida?: Magia;
    };
}

export interface EventoJogo {
    titulo: string;
    descricao: string;
    npcNome?: string;
    opcoes: Escolha[];
}

export interface Monstro {
    nome: string;
    nivel: number;
    hp: number;
    maxHp: number;
    dano: number;
    habilidade: number;
    armadura: number;
    descricao: string;
    tipo: string;
    familia: 'Morto-vivo' | 'Besta' | 'Elemental' | 'Dracônico' | 'Humanoide';
    raridade: 'Comum' | 'Raro' | 'Elite' | 'Chefe';
}

export interface LogJogo {
    id: string;
    mensagem: string;
    tipo: 'info' | 'combate' | 'loot' | 'nivel' | 'evento' | 'loja' | 'magia';
}

export interface ContextoMundo {
    bioma: string;
    descricao: string;
    hostil: boolean;
    reinoNome: string;
    governoTipo: string;
}

export interface OpcaoViagem {
    nome: string;
    bioma: string;
    descricao: string;
    nivelPerigo: 'Baixo' | 'Médio' | 'Alto' | 'Extremo';
}
