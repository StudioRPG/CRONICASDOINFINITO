import { ClasseTipo, Atributos } from '../types';

export const CLASSES: Record<string, { description: string; primaryStat: keyof Atributos; icon: string; bonus: Partial<Atributos> }> = {
    'Guerreiro': {
        description: "Mestres do combate corpo a corpo, versados em todas as armas.",
        primaryStat: "forca",
        icon: "⚔️",
        bonus: { forca: 1, armadura: 1 }
    },
    'Mago': {
        description: "Estudiosos das artes arcanas, manipulam a realidade com feitiços.",
        primaryStat: "poderDeFogo",
        icon: "🪄",
        bonus: { poderDeFogo: 2 }
    },
    'Ladino': {
        description: "Especialistas em furtividade, armadilhas e ataques precisos.",
        primaryStat: "habilidade",
        icon: "🗡️",
        bonus: { habilidade: 2 }
    },
    'Paladino': {
        description: "Guerreiros santos que protegem os fracos e punem o mal.",
        primaryStat: "armadura",
        icon: "🛡️",
        bonus: { armadura: 1, resistencia: 1 }
    },
    'Necromante': {
        description: "Magos que manipulam a morte e os espíritos.",
        primaryStat: "poderDeFogo",
        icon: "💀",
        bonus: { poderDeFogo: 1, resistencia: 1 }
    },
    'Bardo': {
        description: "Artistas versáteis que inspiram aliados e confundem inimigos.",
        primaryStat: "habilidade",
        icon: "🎵",
        bonus: { habilidade: 1, poderDeFogo: 1 }
    },
    'Ranger': {
        description: "Caçadores experientes, mestres do arco e da sobrevivência.",
        primaryStat: "habilidade",
        icon: "🏹",
        bonus: { habilidade: 1, forca: 1 }
    },
    'Clérigo': {
        description: "Servos dos deuses, focados em cura e proteção divina.",
        primaryStat: "resistencia",
        icon: "✨",
        bonus: { resistencia: 2 }
    },
    'Monge': {
        description: "Lutadores marciais que usam o corpo como arma letal.",
        primaryStat: "habilidade",
        icon: "🥋",
        bonus: { habilidade: 1, armadura: 1 }
    },
    'Druida': {
        description: "Protetores da natureza que comandam os elementos.",
        primaryStat: "resistencia",
        icon: "🌿",
        bonus: { resistencia: 1, poderDeFogo: 1 }
    },
    'Samurai': {
        description: "Guerreiros honrados com técnicas de espada mortais.",
        primaryStat: "forca",
        icon: "🏯",
        bonus: { forca: 1, habilidade: 1 }
    }
};
