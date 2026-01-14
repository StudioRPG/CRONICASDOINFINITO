import { RacaTipo, Atributos } from '../types';

export const RACAS: Record<string, { description: string; bonus: Partial<Atributos> }> = {
    'Humano': {
        description: "Versáteis e ambiciosos. Humanos não possuem bônus extremos, mas são equilibrados em tudo.",
        bonus: { forca: 1, habilidade: 1, resistencia: 1, armadura: 1, poderDeFogo: 1 }
    },
    'Elfo': {
        description: "Seres graciosos da floresta. Possuem alta destreza e afinidade mágica.",
        bonus: { habilidade: 2, poderDeFogo: 2, resistencia: -1 }
    },
    'Anão': {
        description: "Robustos e teimosos. Mestres da forja e resistentes a venenos e magia.",
        bonus: { forca: 1, resistencia: 2, armadura: 1, habilidade: -1 }
    },
    'Halfling': {
        description: "Pequenos e ágeis. Ótimos em se esconder e evitar perigos.",
        bonus: { habilidade: 2, esquiva: 1 } as any // Assuming esquiva is handled by Habilidade usually, but keeping compatible with Partial<Stats>
    },
    'Orc': {
        description: "Guerreiros brutais que valorizam a força acima de tudo.",
        bonus: { forca: 3, resistencia: 1, habilidade: -1, poderDeFogo: -1 }
    },
    'Meio-Elfo': {
        description: "Uma mistura de adaptabilidade humana e graça élfica.",
        bonus: { habilidade: 1, poderDeFogo: 1, forca: 1 }
    },
    'Minotauro': {
        description: "Gigantes com cabeça de touro, possuem força descomunal.",
        bonus: { forca: 4, resistencia: 1, habilidade: -1, armadura: 1 }
    },
    'Fada': {
        description: "Pequenos seres mágicos com grande poder de fogo e agilidade, mas frágeis.",
        bonus: { habilidade: 3, poderDeFogo: 2, forca: -2, resistencia: -2 }
    },
    'Goblin': {
        description: "Criaturas engenhosas e rápidas, embora fracas fisicamente.",
        bonus: { habilidade: 2, poderDeFogo: 1, resistencia: -1 }
    },
    'Celestial': {
        description: "Seres tocados por planos superiores, exalam poder divino.",
        bonus: { poderDeFogo: 2, habilidade: 1, resistencia: 1 }
    },
    'Abissal': {
        description: "Descendentes de demônios, possuem pele resistente e força das trevas.",
        bonus: { armadura: 2, forca: 2, carisma: -2 } as any
    }
};
