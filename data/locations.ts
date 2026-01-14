export interface LocalFixo {
    nome: string;
    tipo: 'Cidade' | 'Vila' | 'Masmorra' | 'Selvagem';
    bioma: string;
    descricao: string;
    reino: string;
    hostil: boolean;
    nivelPerigo: number; // 1-10
}

export const LOCAIS: LocalFixo[] = [
    {
        nome: "Cidadela da Forja",
        tipo: "Cidade",
        bioma: "Montanha / Cidade Industrial",
        descricao: "Uma enorme cidade construída dentro de um vulcão adormecido. Lar dos anões e melhores ferreiros do mundo.",
        reino: "Reino de Pedra",
        hostil: false,
        nivelPerigo: 1
    },
    {
        nome: "Vila Verdejante",
        tipo: "Vila",
        bioma: "Floresta",
        descricao: "Um pequeno povoado pacífico cercado por árvores antigas. O ar aqui é puro e cheio de magia feérica.",
        reino: "Dominio Élfico",
        hostil: false,
        nivelPerigo: 1
    },
    {
        nome: "Porto Real",
        tipo: "Cidade",
        bioma: "Litoral / Capital",
        descricao: "A capital metropolitana do reino humano. Comércio flui junto com intrigas políticas.",
        reino: "Reino Humano",
        hostil: false,
        nivelPerigo: 2
    },
    {
        nome: "Pantano das Almas",
        tipo: "Selvagem",
        bioma: "Pântano",
        descricao: "Um local úmido e sombrio onde os mortos não descansam. Necromantes frequentam este lugar.",
        reino: "Terras Esquecidas",
        hostil: true,
        nivelPerigo: 5
    },
    {
        nome: "Torre do Arquimago",
        tipo: "Masmorra",
        bioma: "Arcano",
        descricao: "Uma torre que desafia a geometria, cheia de construtos mágicos e armadilhas dimensionais.",
        reino: "Independente",
        hostil: true,
        nivelPerigo: 8
    },
    {
        nome: "Deserto de Cristal",
        tipo: "Selvagem",
        bioma: "Deserto",
        descricao: "Areias que brilham sob o sol causticante. Elementais de vidro vagam por aqui.",
        reino: "Terras Esquecidas",
        hostil: true,
        nivelPerigo: 6
    },
    {
        nome: "Aldeia da Névoa",
        tipo: "Vila",
        bioma: "Montanha Nebulosa",
        descricao: "Uma vila misteriosa que só aparece em noites de lua cheia.",
        reino: "Reino dos Espíritos",
        hostil: false,
        nivelPerigo: 3
    }
];
