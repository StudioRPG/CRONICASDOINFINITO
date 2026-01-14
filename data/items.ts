import { Item, ItemTipo, Raridade, Atributos } from '../types';

const item = (
    name: string,
    type: ItemTipo,
    desc: string,
    price: number,
    rarity: Raridade,
    bonus: Partial<Atributos>
): Item => ({
    id: name.toLowerCase().replace(/\s/g, '-'),
    nome: name,
    tipo: type,
    descricao: desc,
    preco: price,
    raridade: rarity,
    bonus
});

export const ITEMS: Item[] = [
    // Armas Comuns
    item("Adaga Velha", "Arma", "Uma lâmina enferrujada, melhor que nada.", 10, "Comum", { forca: 1 }),
    item("Espada Curta", "Arma", "Lâmina padrão para aventureiros iniciantes.", 50, "Comum", { forca: 2 }),
    item("Cajado de Madeira", "Arma", "Foco mágico simples feito de carvalho.", 40, "Comum", { poderDeFogo: 1 }),
    item("Arco de Caça", "Arma", "Simples, mas eficaz para caça.", 45, "Comum", { habilidade: 1 }),
    item("Maça de Ferro", "Arma", "Brutal e pesada. Esmaga ossos.", 60, "Comum", { forca: 3, habilidade: -1 }),

    // Armas Raras
    item("Espada Longa de Aço", "Arma", "Bem balanceada e afiada.", 200, "Raro", { forca: 4, habilidade: 1 }),
    item("Cajado de Cristal", "Arma", "Amplifica o fluxo de mana.", 300, "Raro", { poderDeFogo: 3 }),
    item("Adagas Gêmeas", "Arma", "Par de adagas para ataques rápidos.", 250, "Raro", { habilidade: 3 }),
    item("Martelo de Guerra", "Arma", "Arma pesada militar.", 350, "Raro", { forca: 5, habilidade: -1 }),

    // Armas Épicas
    item("Lâmina Vorpal", "Arma", "Dizem que pode cortar a própria realidade.", 1500, "Épico", { forca: 8, habilidade: 2 }),
    item("Cetro do Arquimago", "Arma", "Puta poder cósmico.", 2000, "Épico", { poderDeFogo: 8, resistencia: 2 }),
    item("Arco Élfico Ancestral", "Arma", "Nunca erra o alvo sob a luz da lua.", 1800, "Épico", { habilidade: 6, poderDeFogo: 2 }),

    // Armaduras
    item("Túnica de Viajante", "Armadura", "Roupas simples de linho e couro.", 20, "Comum", { armadura: 1 }),
    item("Couro Batido", "Armadura", "Oferece proteção decente sem limitar movimento.", 80, "Comum", { armadura: 2, habilidade: 1 }),
    item("Cota de Malha", "Armadura", "Anéis de metal entrelaçados.", 150, "Comum", { armadura: 3, habilidade: -1 }),
    item("Placa Completa", "Armadura", "A melhor proteção mundana.", 500, "Raro", { armadura: 5, resistencia: 1, habilidade: -2 }),
    item("Manto das Sombras", "Armadura", "Torna o usuário difícil de ver.", 1200, "Épico", { armadura: 3, habilidade: 4 }),
    item("Armadura de Escamas de Dragão", "Armadura", "Virtualmente impenetrável e resistente ao fogo.", 3000, "Lendário", { armadura: 8, resistencia: 4 }),

    // Acessórios
    item("Anel de Força", "Acessório", "Aumenta ligeiramente a força física.", 100, "Raro", { forca: 1 }),
    item("Amuleto de Proteção", "Acessório", "Cria um campo de força menor.", 150, "Raro", { armadura: 1 }),
    item("Botas de Velocidade", "Acessório", "Permite correr como o vento.", 500, "Épico", { habilidade: 2 }),
    item("Pedra da Sábio", "Acessório", "Amplia imensamente o poder mágico.", 5000, "Lendário", { poderDeFogo: 5, mana: 50 } as any),

    // Materiais
    item("Minério de Ferro", "Material", "Usado para forjar equipamentos básicos.", 10, "Comum", {}),
    item("Couro de Lobo", "Material", "Material resistente para armaduras leves.", 15, "Comum", {}),
    item("Mithril", "Material", "Metal leve e extremamente resistente.", 500, "Épico", {}),
    item("Escama de Dragão", "Material", "Componente lendário de forja.", 1000, "Lendário", {})
];
