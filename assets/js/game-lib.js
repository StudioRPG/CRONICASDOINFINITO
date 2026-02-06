// ================================================================
// GAME LIBRARY (game-lib.js)
// Lógica de processamento e banco de dados do Crônicas RPG
// ================================================================

// --- CONFIGURAÇÕES ---
const STORAGE_KEY_V2 = 'cronicas_saves_v2';
const NIVEL_MAX_CLASSE_BASICA = 20;
const CICLOS = ['Manhã', 'Tarde', 'Noite']; // Novo sistema de tempo

// --- SISTEMA ELEMENTAL ---
const ELEMENTOS = {
    'Neutro': { icon: '⚔️', cor: 'text-zinc-400', forte: [], fraco: [] },
    'Fogo': { icon: '🔥', cor: 'text-red-500', forte: ['Planta', 'Gelo'], fraco: ['Água'] },
    'Água': { icon: '💧', cor: 'text-blue-500', forte: ['Fogo', 'Terra'], fraco: ['Planta', 'Raio'] },
    'Planta': { icon: '🌿', cor: 'text-green-500', forte: ['Água', 'Terra'], fraco: ['Fogo', 'Gelo'] },
    'Raio': { icon: '⚡', cor: 'text-yellow-400', forte: ['Água', 'Metal'], fraco: ['Terra'] },
    'Terra': { icon: '🧱', cor: 'text-amber-700', forte: ['Raio', 'Fogo'], fraco: ['Água', 'Planta'] },
    'Gelo': { icon: '❄️', cor: 'text-cyan-300', forte: ['Planta', 'Terra'], fraco: ['Fogo'] },
    'Luz': { icon: '✨', cor: 'text-yellow-200', forte: ['Trevas', 'Morto-Vivo'], fraco: [] }, // Especial
    'Trevas': { icon: '💀', cor: 'text-purple-500', forte: ['Luz'], fraco: [] }
};

// --- RAÇAS ---
const RACAS = {
    'Humano': {
        description: "Versáteis e ambiciosos.",
        bonus: { forca: 1, habilidade: 1, resistencia: 1, armadura: 1, poderDeFogo: 1 },
        trait: { nome: "Prodígio", desc: "+10% de ganho de XP." }
    },
    'Elfo': {
        description: "Graciosos e mágicos.",
        bonus: { habilidade: 2, poderDeFogo: 2, resistencia: 0, forca: 0, armadura: 0 }, // Net +4
        trait: { nome: "Graça Élfica", desc: "+10 Mana inicial e +1 Mana por nível." }
    },
    'Anão': {
        description: "Robustos mestres da forja.",
        bonus: { forca: 1, resistencia: 2, armadura: 1, habilidade: -1, poderDeFogo: 0 }, // Net +3 (Strong Def)
        trait: { nome: "Pele de Pedra", desc: "+20 Vida Máxima." }
    },
    'Orc': {
        description: "Guerreiros brutais.",
        bonus: { forca: 3, resistencia: 1, habilidade: -1, poderDeFogo: -1, armadura: 1 }, // Net +3
        trait: { nome: "Fúria", desc: "+2 Dano físico fixo." }
    },
    'Celestial': {
        description: "Descendência divina.",
        bonus: { poderDeFogo: 2, habilidade: 1, resistencia: 1, forca: 0, armadura: 0 }, // Net +4
        trait: { nome: "Proteção Divina", desc: "+2 Armadura e +2 Resistência (Passivo)." }
    }
};

// --- CLASSES E EVOLUÇÕES ---
const CLASSES = {
    'Guerreiro': {
        description: "Combate corpo a corpo.", icon: "⚔️",
        recurso: { nome: "FÚRIA", cor: "bg-red-600" },
        bonus: { forca: 3, armadura: 2 }
    },
    'Mago': {
        description: "Artes arcanas.", icon: "🧙‍♂️",
        recurso: { nome: "MANA", cor: "bg-blue-600" },
        bonus: { poderDeFogo: 3, habilidade: 2 }
    },
    'Ladino': {
        description: "Furtividade e precisão.", icon: "🗡️",
        recurso: { nome: "ENERGIA", cor: "bg-yellow-500" },
        bonus: { habilidade: 3, forca: 2 }
    },
    'Paladino': {
        description: "Guerreiros santos.", icon: "🛡️",
        recurso: { nome: "FÉ", cor: "bg-cyan-400" },
        bonus: { resistencia: 2, forca: 2, armadura: 1 }
    },
    'Necromante': {
        description: "Magia da morte.", icon: "💀",
        recurso: { nome: "ALMAS", cor: "bg-purple-800" },
        bonus: { poderDeFogo: 3, resistencia: 2 }
    },
    'Bardo': {
        description: "Música e magia.", icon: "🎵",
        recurso: { nome: "INSPIRAÇÃO", cor: "bg-pink-500" },
        bonus: { habilidade: 2, poderDeFogo: 2, resistencia: 1 }
    },
    'Clérigo': {
        description: "Cura divina.", icon: "✨",
        recurso: { nome: "FÉ", cor: "bg-cyan-400" },
        bonus: { resistencia: 3, poderDeFogo: 2 }
    },
    'Druida': {
        description: "Força da natureza.", icon: "🌿",
        recurso: { nome: "MANA", cor: "bg-green-600" },
        bonus: { forca: 2, poderDeFogo: 2, resistencia: 1 }
    },
    'Arqueiro': {
        description: "Mestre do arco e flecha.", icon: "🏹",
        recurso: { nome: "ENERGIA", cor: "bg-yellow-500" },
        bonus: { habilidade: 3, forca: 1, poderDeFogo: 1 }
    },
    // Evoluções podem ter bonus cumulativos ou serem apenas flavor/skills no futuro
    'Cavaleiro': { description: "Mestre do combate.", icon: "🏇", recurso: { nome: "VIGOR", cor: "bg-red-700" } }, // Mantem bonus base
    'Arquimago': { description: "Mestre dos arcanos.", icon: "🔮", recurso: { nome: "MANA", cor: "bg-blue-600" } },
    'Assassino': { description: "Mestre das sombras.", icon: "🌑", recurso: { nome: "ENERGIA", cor: "bg-yellow-500" } },
    'Cruzado': { description: "Campeão divino.", icon: "✝️", recurso: { nome: "FÉ", cor: "bg-cyan-400" } },
    'Lich': { description: "Senhor dos mortos.", icon: "☠️", recurso: { nome: "ALMAS", cor: "bg-purple-800" } },
    'Trovador': { description: "Lenda musical.", icon: "🎶", recurso: { nome: "INSPIRAÇÃO", cor: "bg-pink-500" } },
    'Sumo-Sacerdote': { description: "Voz dos deuses.", icon: "🌟", recurso: { nome: "FÉ", cor: "bg-cyan-400" } },
    'Guardião': { description: "Protetor da floresta.", icon: "🌲", recurso: { nome: "MANA", cor: "bg-green-600" } },
    'Sentinela': { description: "Olhos de águia, mira perfeita.", icon: "🦅", recurso: { nome: "ENERGIA", cor: "bg-yellow-500" } }
};

const EVOLUCOES = {
    'Guerreiro': 'Cavaleiro',
    'Mago': 'Arquimago',
    'Ladino': 'Assassino',
    'Paladino': 'Cruzado',
    'Necromante': 'Lich',
    'Bardo': 'Trovador',
    'Clérigo': 'Sumo-Sacerdote',
    'Druida': 'Guardião',
    'Arqueiro': 'Sentinela'
};

// --- RECEITAS DE CRAFTING (FERREIRO) ---
const RECEITAS = [
    { id: 'g_bi_m', nome: "Espada de Mithril", tipo: "Arma", classe: "Guerreiro", inputs: [{ id: 'minerio_mithril', qtd: 5 }, { id: 'minerio_ferro', qtd: 10 }], custo: 1000, resultado: { id: 'g_espada_mithril', nome: "Lâmina de Mithril", tipo: "Arma", bonus: { forca: 12, habilidade: 2 }, desc: "Extremamente leve e afiada." } },
    { id: 'g_pla_ad', nome: "Armadura de Adamantina", tipo: "Armadura", classe: "Guerreiro", inputs: [{ id: 'minerio_adamantina', qtd: 3 }, { id: 'minerio_mithril', qtd: 5 }], custo: 5000, resultado: { id: 'g_placas_adamantina', nome: "Placas de Adamantina", tipo: "Armadura", bonus: { armadura: 15, resistencia: 5 }, desc: "Indestrutível." } },
    { id: 'pic_mi', nome: "Picareta de Mithril", tipo: "Ferramenta", inputs: [{ id: 'minerio_mithril', qtd: 10 }, { id: 'picareta_ferro', qtd: 1 }], custo: 2000, resultado: { id: 'picareta_mithril', nome: "Picareta de Mithril", tipo: "Ferramenta", tier: 3, desc: "Minera Adamantina." } }
];

// --- SISTEMA DE ALQUIMIA ---
const RECEITAS_ALQUIMIA = [
    // POÇÕES DE VIDA
    { id: 'alq_vida_p', resultado: 'pocao_p', inputs: [{ id: 'erva_cura', qtd: 3 }], nivelReq: 1, desc: "Básica para sobrevivência." },
    { id: 'alq_vida_g', resultado: 'pocao_g', inputs: [{ id: 'erva_cura', qtd: 5 }, { id: 'mel', qtd: 1 }], nivelReq: 5, desc: "Cura ferimentos graves." },

    // POÇÕES DE MANA
    { id: 'alq_mana_p', resultado: 'mana_p', inputs: [{ id: 'erva_mana', qtd: 3 }], nivelReq: 2, desc: "Restaura energia mágica." },
    { id: 'alq_mana_g', resultado: 'mana_g', inputs: [{ id: 'erva_mana', qtd: 5 }, { id: 'po_de_fada', qtd: 1 }], nivelReq: 6, desc: "Essência mágica concentrada." },

    // POÇÕES DE UTILIDADE (BUFFS)
    { id: 'alq_forca', resultado: 'pocao_forca', inputs: [{ id: 'raiz_rocha', qtd: 2 }, { id: 'presa_lobo', qtd: 2 }], nivelReq: 3, desc: "+10 Força por 10 min." },
    { id: 'alq_vel', resultado: 'pocao_vel', inputs: [{ id: 'folha_vento', qtd: 2 }, { id: 'asa_morcego', qtd: 2 }], nivelReq: 4, desc: "+Esquiva por 10 min." },

    // TRANSFORMAÇÃO DE RECURSOS
    { id: 'alq_antidoto', resultado: 'antidoto', inputs: [{ id: 'erva_cura', qtd: 1 }, { id: 'cogumelo_venenoso', qtd: 1 }], nivelReq: 2, desc: "Cura veneno." }
];

// --- HABILIDADES (Antigas Magias) ---
const HABILIDADES_LOJA = [
    // --- GUERREIRO ---
    { id: 'g_golpe', nome: "Golpe Pesado", classe: 'Guerreiro', custo: 100, mana: 3, tipo: 'Físico', poder: 6, desc: "Ataque forte com arma." },
    { id: 'g_grito', nome: "Grito de Guerra", classe: 'Guerreiro', custo: 200, mana: 5, tipo: 'Buff', poder: 3, desc: "+3 Dano temporário." },
    { id: 'g_corte', nome: "Corte Giratório", classe: 'Guerreiro', custo: 400, mana: 10, tipo: 'Físico', poder: 10, area: true, desc: "Ataque em área." },
    // NOVAS
    { id: 'g_investida', nome: "Investida Brutal", classe: 'Guerreiro', custo: 800, mana: 8, tipo: 'Físico', poder: 12, desc: "Atordoa o alvo (Dano alto)." },
    { id: 'g_avatar', nome: "Avatar da Guerra", classe: 'Guerreiro', custo: 60000, mana: 50, tipo: 'Buff', poder: 30, desc: "Transforma-se em pura fúria. (+30 Dano por 3 turnos)" }, // ULTIMATE

    // --- MAGO ---
    { id: 'm_missil', nome: "Míssil Mágico", classe: 'Mago', custo: 100, mana: 4, tipo: 'Mágico', elemento: 'Neutro', poder: 6, desc: "Dano arcano infalível." },
    { id: 'm_fogo', nome: "Bola de Fogo", classe: 'Mago', custo: 300, mana: 12, tipo: 'Mágico', elemento: 'Fogo', poder: 8, area: true, desc: "Explosão térmica em área." },
    { id: 'm_escudo', nome: "Escudo de Mana", classe: 'Mago', custo: 250, mana: 8, tipo: 'Buff', elemento: 'Neutro', poder: 5, desc: "Absorve dano." },
    // NOVAS
    { id: 'm_raio', nome: "Raio Arcano", classe: 'Mago', custo: 8000, mana: 15, tipo: 'Mágico', elemento: 'Raio', poder: 25, desc: "Dano massivo em alvo único." },
    { id: 'm_meteoro', nome: "Chuva de Meteoros", classe: 'Mago', custo: 75000, mana: 60, tipo: 'Mágico', elemento: 'Fogo', poder: 50, area: true, desc: "Destruição em área." }, // ULTIMATE

    // --- LADINO ---
    { id: 'l_adaga', nome: "Punhalada", classe: 'Ladino', custo: 150, mana: 5, tipo: 'Físico', poder: 8, desc: "Crítico garantido pelas costas." },
    { id: 'l_veneno', nome: "Lâmina Venenosa", classe: 'Ladino', custo: 250, mana: 8, tipo: 'DoT', poder: 4, desc: "Dano por turno." },
    { id: 'l_sombras', nome: "Passo Sombrio", classe: 'Ladino', custo: 300, mana: 12, tipo: 'Buff', poder: 0, desc: "Imune por 1 turno." },
    { id: 'l_leque', nome: "Leque de Facas", classe: 'Ladino', custo: 400, mana: 10, tipo: 'Físico', poder: 6, area: true, desc: "Lança facas em todos." },
    // NOVAS
    { id: 'l_executar', nome: "Executar", classe: 'Ladino', custo: 10000, mana: 20, tipo: 'Físico', poder: 40, desc: "Dano fatal em inimigos feridos." },
    { id: 'l_fantasma', nome: "Lâmina Fantasma", classe: 'Ladino', custo: 65000, mana: 45, tipo: 'Físico', poder: 35, desc: "Ignora armadura inimiga." }, // ULTIMATE

    // --- PALADINO ---
    { id: 'p_luz', nome: "Golpe Sacro", classe: 'Paladino', custo: 200, mana: 6, tipo: 'Físico/Sagrado', poder: 7, desc: "Dano + Cura pequena." },
    { id: 'p_cura', nome: "Imposição de Mãos", classe: 'Paladino', custo: 300, mana: 10, tipo: 'Cura', poder: 15, desc: "Grande cura em si mesmo." },
    { id: 'p_consagrar', nome: "Consagração", classe: 'Paladino', custo: 450, mana: 15, tipo: 'Mágico', poder: 8, area: true, desc: "Permea o solo com luz (AoE)." },
    // NOVAS
    { id: 'p_egide', nome: "Égide Divina", classe: 'Paladino', custo: 70000, mana: 50, tipo: 'Cura', poder: 50, desc: "Cura total e imunidade por 1 turno." }, // ULTIMATE

    // --- OUTROS ITENS DE LOJA (Expandido) ---
    // Inserido aqui para facilitar acesso na loja
    { id: 'anel_noivado', nome: "Anel de Noivado", imagem: "💍", custo: 50000, tipo: "Acessório", desc: "Um símbolo de amor eterno. Use para pedir a mão de alguém." },

    // --- CLÉRIGO ---
    { id: 'c_cura', nome: "Cura Maior", classe: 'Clérigo', custo: 200, mana: 8, tipo: 'Cura', elemento: 'Luz', poder: 20, desc: "Recupera muita vida." },
    { id: 'c_luz', nome: "Punição Divina", classe: 'Clérigo', custo: 250, mana: 8, tipo: 'Mágico', elemento: 'Luz', poder: 8, desc: "Queima inimigos com fé." },
    { id: 'c_nova', nome: "Nova Sagrada", classe: 'Clérigo', custo: 400, mana: 15, tipo: 'Mágico', elemento: 'Luz', poder: 9, area: true, desc: "Explosão de luz em área." },
    // NOVAS
    { id: 'c_ressurreicao', nome: "Milagre", classe: 'Clérigo', custo: 3000, mana: 50, tipo: 'Cura', elemento: 'Luz', poder: 100, area: true, desc: "Cura TOTAL em área." },

    // --- ARQUEIRO ---
    { id: 'a_duplo', nome: "Disparo Duplo", classe: 'Arqueiro', custo: 150, mana: 6, tipo: 'Físico', poder: 7, desc: "Duas flechas rápidas." },
    { id: 'a_chuva', nome: "Chuva de Flechas", classe: 'Arqueiro', custo: 350, mana: 12, tipo: 'Físico', poder: 8, area: true, desc: "Atinge múltiplos inimigos." },
    // NOVAS
    { id: 'a_precisao', nome: "Tiro na Cabeça", classe: 'Arqueiro', custo: 1000, mana: 15, tipo: 'Físico', poder: 18, desc: "Dano crítico massivo." },

    // --- NECROMANTE ---
    { id: 'n_drenar', nome: "Drenar Vida", classe: 'Necromante', custo: 250, mana: 8, tipo: 'Mágico', poder: 6, desc: "Rouba vida do alvo." },
    { id: 'n_nevoa', nome: "Névoa Mortal", classe: 'Necromante', custo: 450, mana: 15, tipo: 'Mágico', poder: 7, area: true, desc: "Nuvem tóxica em área." },
    { id: 'n_esqueleto', nome: "Invocar Morto", classe: 'Necromante', custo: 400, mana: 20, tipo: 'Summon', poder: 0, desc: "Invoca ajudante." },
    // NOVAS
    { id: 'n_exercito', nome: "Exército das Trevas", classe: 'Necromante', custo: 2000, mana: 40, tipo: 'Summon', poder: 10, area: true, desc: "Dano massivo em todos." },

    // --- BARDO ---
    { id: 'b_inspirar', nome: "Canção da Coragem", classe: 'Bardo', custo: 200, mana: 10, tipo: 'Buff', poder: 2, desc: "+2 em todos atributos." },
    { id: 'b_dissonante', nome: "Acorde Dissonante", classe: 'Bardo', custo: 250, mana: 8, tipo: 'Mágico', poder: 8, desc: "Dano sônico." },
    { id: 'b_requiem', nome: "Réquiem Final", classe: 'Bardo', custo: 500, mana: 18, tipo: 'Mágico', poder: 10, area: true, desc: "Música mortal em área." },
    // NOVAS
    { id: 'b_concerto', nome: "Concerto Lendário", classe: 'Bardo', custo: 3000, mana: 30, tipo: 'Buff', poder: 5, desc: "+5 em tudo para todos." },

    // --- DRUIDA ---
    { id: 'd_vinhas', nome: "Vinhas Esmagadoras", classe: 'Druida', custo: 200, mana: 8, tipo: 'Mágico', elemento: 'Planta', poder: 7, desc: "Dano de terra." },
    { id: 'd_urso', nome: "Forma de Urso", classe: 'Druida', custo: 500, mana: 20, tipo: 'Transform', elemento: 'Neutro', poder: 10, desc: "+10 Força/Res temp." },
    { id: 'd_tempestade', nome: "Tempestade", classe: 'Druida', custo: 450, mana: 18, tipo: 'Mágico', elemento: 'Raio', poder: 9, area: true, desc: "Raios em todos os inimigos." },
    // NOVAS
    { id: 'd_furacao', nome: "Furação", classe: 'Druida', custo: 2000, mana: 35, tipo: 'Mágico', elemento: 'Raio', poder: 20, area: true, desc: "Devastação natural." },
];

// --- ITENS À VENDA NAS LOJAS (Expandido) ---
const ITENS_LOJA = [
    // --- CONSUMÍVEIS ---
    { id: 'pocao_p', nome: "Poção de Vida (P)", preco: 50, tipo: "Consumivel", efeito: { hp: 20 }, desc: "Recupera 20 PV" },
    { id: 'pocao_g', nome: "Poção de Vida (G)", preco: 150, tipo: "Consumivel", efeito: { hp: 50 }, desc: "Recupera 50 PV" },
    { id: 'mana_p', nome: "Poção de Mana (P)", preco: 50, tipo: "Consumivel", efeito: { mana: 20 }, desc: "Recupera 20 MP/Energia/Fúria" },
    { id: 'mana_g', nome: "Poção de Mana (G)", preco: 150, tipo: "Consumivel", efeito: { mana: 50 }, desc: "Recupera 50 MP/Energia/Fúria" },
    { id: 'jaula_simples', nome: "Jaula Simples", preco: 50, tipo: "Consumivel", efeito: { especial: 'captura' }, desc: "Usada para capturar monstros enfraquecidos." },

    // --- FERRAMENTAS ---
    { id: 'picareta_madeira', nome: "Picareta de Madeira", preco: 100, tipo: "Ferramenta", tier: 1, desc: "Minera Cobre e Ferro." },
    { id: 'picareta_ferro', nome: "Picareta de Ferro", preco: 1500, tipo: "Ferramenta", tier: 2, desc: "Minera Ouro e Mithril." },
    // Picareta de Mithril só via Craft

    // --- RECURSOS (Não aparecem na loja para comprar, só vender/usar - Preço de Venda) ---
    // Colocamos aqui para terem Definição
    { id: 'minerio_cobre', nome: "Minério de Cobre", preco: 2, tipo: "Recurso", desc: "Metal comum." },
    { id: 'minerio_ferro', nome: "Minério de Ferro", preco: 5, tipo: "Recurso", desc: "Usado em quase tudo." },
    { id: 'minerio_ouro', nome: "Pepita de Ouro", preco: 30, tipo: "Recurso", desc: "Brilhante e valioso." },
    { id: 'minerio_mithril', nome: "Minério de Mithril", preco: 150, tipo: "Recurso", desc: "Prateado e mágico." },
    { id: 'minerio_adamantina', nome: "Adamantina Bruta", preco: 500, tipo: "Recurso", desc: "O metal mais duro existente." },

    // --- INGREDIENTES DE ALQUIMIA (Espalhados pelo mundo) ---
    { id: 'erva_cura', nome: "Erva Medicinal", preco: 5, tipo: "Ingrediente", desc: "Folha verde com propriedades curativas." },
    { id: 'erva_mana', nome: "Flor Etérea", preco: 8, tipo: "Ingrediente", desc: "Brilha com luz azul suave." },
    { id: 'raiz_rocha', nome: "Raiz de Rocha", preco: 10, tipo: "Ingrediente", desc: "Dura e terrosa (Montanhas)." },
    { id: 'folha_vento', nome: "Folha do Vento", preco: 10, tipo: "Ingrediente", desc: "Parece flutuar (Planícies)." },
    { id: 'cogumelo_venenoso', nome: "Cogumelo Roxo", preco: 12, tipo: "Ingrediente", desc: "Perigoso se ingerido cru (Floresta Sombria)." },
    { id: 'mel', nome: "Mel Silvestre", preco: 15, tipo: "Ingrediente", desc: "Doce e energizante." },

    // DROPS DE MONSTROS (Que servem para alquimia)
    { id: 'po_de_fada', nome: "Pó de Fada", preco: 50, tipo: "Ingrediente", desc: "Brilho mágico." },
    { id: 'presa_lobo', nome: "Presa de Lobo", preco: 15, tipo: "Ingrediente", desc: "Afiada." },
    { id: 'asa_morcego', nome: "Asa de Morcego", preco: 10, tipo: "Ingrediente", desc: "Membrana fina." },
    // Novas Poções Criáveis
    { id: 'pocao_forca', nome: "Poção de Força", preco: 200, tipo: "Consumivel", efeito: { buff: 'forca', valor: 10, duracao: 10 }, desc: "Aumenta Força temporariamente." },
    { id: 'pocao_vel', nome: "Poção de Velocidade", preco: 200, tipo: "Consumivel", efeito: { buff: 'esquiva', valor: 20, duracao: 10 }, desc: "Aumenta Esquiva temporariamente." },
    { id: 'antidoto', nome: "Antídoto", preco: 75, tipo: "Consumivel", efeito: { especial: 'curar_veneno' }, desc: "Remove veneno." },

    // --- GUERREIRO ---
    { id: 'g_espada_aco', nome: "Espada de Aço", preco: 400, tipo: "Arma", classe: "Guerreiro", bonus: { forca: 4 }, desc: "Lâmina confiável." },
    { id: 'g_machado_guerra', nome: "Machado de Guerra", preco: 800, tipo: "Arma", classe: "Guerreiro", bonus: { forca: 6 }, desc: "Lâmina pesada e brutal." },
    { id: 'g_machado_duplo', nome: "Machado Duplo", preco: 1200, tipo: "Arma", classe: "Guerreiro", bonus: { forca: 8, habilidade: -1 }, desc: "Devastador." },
    { id: 'g_montante_obsidiana', nome: "Montante de Obsidiana", preco: 3500, tipo: "Arma", classe: "Guerreiro", bonus: { forca: 15 }, desc: "Vidro vulcânico afiadíssimo." },

    { id: 'g_placas', nome: "Placas de Ferro", preco: 800, tipo: "Armadura", classe: "Guerreiro", bonus: { armadura: 5 }, desc: "Proteção pesada." },
    { id: 'g_escamas_dragao', nome: "Placas de Escama", preco: 1800, tipo: "Armadura", classe: "Guerreiro", bonus: { armadura: 8, resistencia: 3 }, desc: "Feita de escamas de dragão menores." },
    { id: 'g_placas_mithril', nome: "Placas de Mithril", preco: 3000, tipo: "Armadura", classe: "Guerreiro", bonus: { armadura: 10, resistencia: 2 }, desc: "Leve e impenetrável." },

    // --- PETS (NOVOS) ---
    { id: 'pet_cao', nome: "Cão de Caça", preco: 1500, tipo: "Pet", bonus: { dano: 3 }, desc: "Fiel companheiro. Ataca todo turno." },
    { id: 'pet_gato', nome: "Gato Preto", preco: 2500, tipo: "Pet", bonus: { critico: 5 }, desc: "Dá sorte (+5% Crítico e Esquiva)." },
    { id: 'pet_coruja', nome: "Coruja Sábia", preco: 3500, tipo: "Pet", bonus: { mana: 20 }, desc: "Recupera mana passivamente." },
    { id: 'pet_fada', nome: "Fada da Luz", preco: 5000, tipo: "Pet", bonus: { cura: 5 }, desc: "Cura 5 PV por turno." },
    { id: 'pet_grifo', nome: "Filhote de Grifo", preco: 7000, tipo: "Pet", bonus: { dano: 5, habilidade: 5 }, desc: "Ágil e mortal." },
    { id: 'pet_lobo', nome: "Lobo das Neves", preco: 8000, tipo: "Pet", bonus: { dano: 8 }, desc: "Mordida feroz." },
    { id: 'pet_mimico', nome: "Mímico Domesticado", preco: 12000, tipo: "Pet", bonus: { ouro: 10 }, desc: "Aumenta o ouro encontrado." },
    { id: 'pet_fenix', nome: "Fênix Renascida", preco: 25000, tipo: "Pet", bonus: { cura: 20 }, desc: "Cura massiva constantemente." },
    { id: 'pet_dragao', nome: "Dragãozinho", preco: 50000, tipo: "Pet", bonus: { dano: 20 }, desc: "Cospe fogo." },


    // --- MAGO / NECROMANTE ---
    { id: 'm_varinha', nome: "Varinha de Cristal", preco: 600, tipo: "Arma", classe: "Mago", elemento: 'Neutro', bonus: { poderDeFogo: 5 }, desc: "Melhor foco que madeira." },
    { id: 'm_cajado_carvalho', nome: "Cajado de Carvalho", preco: 300, tipo: "Arma", classe: "Mago", elemento: 'Planta', bonus: { poderDeFogo: 3 }, desc: "Foco arcano básico." },
    { id: 'm_cajado_rubi', nome: "Cajado de Rubi", preco: 1500, tipo: "Arma", classe: "Mago", elemento: 'Fogo', bonus: { poderDeFogo: 8, mana: 10 }, desc: "Pulsando com magia." },
    { id: 'm_cajado_vazio', nome: "Cajado do Vazio", preco: 4000, tipo: "Arma", classe: "Mago", elemento: 'Trevas', bonus: { poderDeFogo: 15, mana: 30 }, desc: "Magia pura e instável." },

    { id: 'm_robe', nome: "Robe de Aprendiz", preco: 250, tipo: "Armadura", classe: "Mago", bonus: { armadura: 1, mana: 10 }, desc: "Tecido simples." },
    { id: 'm_robe_seda', nome: "Robe de Seda Arcana", preco: 900, tipo: "Armadura", classe: "Mago", bonus: { armadura: 2, resistencia: 3, mana: 20 }, desc: "Tecido reforçado com magia." },
    { id: 'm_robe_estelar', nome: "Traje Estelar", preco: 3500, tipo: "Armadura", classe: "Mago", bonus: { armadura: 5, resistencia: 8, mana: 50 }, desc: "Feito da luz das estrelas." },
    { id: 'm_robe_arquimago', nome: "Robe do Arquimago", preco: 2000, tipo: "Armadura", classe: "Mago", bonus: { armadura: 3, resistencia: 5, mana: 30 }, desc: "Encantado com proteções." },

    // --- LADINO / ARQUEIRO ---
    { id: 'l_adagas', nome: "Adagas de Aço", preco: 350, tipo: "Arma", classe: "Ladino", bonus: { habilidade: 3, forca: 1 }, desc: "Rápidas." },
    { id: 'l_adagas_mitril', nome: "Lâminas de Mitril", preco: 1200, tipo: "Arma", classe: "Ladino", bonus: { habilidade: 7, forca: 2 }, desc: "Corte silencioso." },
    { id: 'l_fantasma', nome: "Lâmina Fantasma", preco: 3000, tipo: "Arma", classe: "Ladino", bonus: { habilidade: 12, critico: 10 }, desc: "Atravessa armaduras." },

    { id: 'l_arco_longo', nome: "Arco Longo", preco: 1000, tipo: "Arma", classe: "Arqueiro", bonus: { habilidade: 7 }, desc: "Maior alcance e dano." },
    { id: 'l_arco_comp', nome: "Arco Composto", preco: 600, tipo: "Arma", classe: "Arqueiro", bonus: { habilidade: 5 }, desc: "Longo alcance." },
    { id: 'l_arco_elfico', nome: "Arco Élfico", preco: 2500, tipo: "Arma", classe: "Arqueiro", bonus: { habilidade: 12, forca: 2 }, desc: "Obra prima inigualável." },

    { id: 'l_couro', nome: "Couro Batido", preco: 400, tipo: "Armadura", classe: "Ladino", bonus: { armadura: 3, habilidade: 1 }, desc: "Não faz barulho." },
    { id: 'l_capa_viajante', nome: "Capa do Viajante", preco: 900, tipo: "Armadura", classe: "Ladino", bonus: { armadura: 4, resistencia: 2 }, desc: "Discreta." },
    { id: 'l_capa_sombra', nome: "Capa das Sombras", preco: 1800, tipo: "Armadura", classe: "Ladino", bonus: { armadura: 5, habilidade: 4 }, desc: "Mescla-se com o escuro." },
    { id: 'l_traje_mestre', nome: "Traje do Mestre", preco: 3200, tipo: "Armadura", classe: "Ladino", bonus: { armadura: 8, habilidade: 8 }, desc: "Leve como pluma." },

    // --- PALADINO / CLÉRIGO ---
    { id: 'p_martelo', nome: "Martelo de Guerra", preco: 500, tipo: "Arma", classe: "Paladino", bonus: { forca: 4, poderDeFogo: 1 }, desc: "Esmaga hereges." },
    { id: 'p_maca_prata', nome: "Maça de Prata", preco: 1200, tipo: "Arma", classe: "Paladino", bonus: { forca: 6, poderDeFogo: 4 }, desc: "Eficiente contra mortos-vivos." },
    { id: 'p_martelo_justica', nome: "Martelo da Justiça", preco: 3000, tipo: "Arma", classe: "Paladino", bonus: { forca: 10, poderDeFogo: 8 }, desc: "Brilha com poder sagrado." },

    { id: 'p_maca', nome: "Maça Consagrada", preco: 1000, tipo: "Arma", classe: "Clérigo", bonus: { poderDeFogo: 5, forca: 2 }, desc: "Brilha com luz." },
    { id: 'p_cetro_luz', nome: "Cetro da Luz", preco: 2500, tipo: "Arma", classe: "Clérigo", bonus: { poderDeFogo: 12, mana: 10 }, desc: "Canaliza milagres." },

    { id: 'p_cota_malha', nome: "Cota de Malha Sagrada", preco: 900, tipo: "Armadura", classe: "Paladino", bonus: { armadura: 6, resistencia: 2 }, desc: "Abençoada." },
    { id: 'p_placas_divinas', nome: "Placas Divinas", preco: 3500, tipo: "Armadura", classe: "Paladino", bonus: { armadura: 12, resistencia: 8 }, desc: "Forjada nos céus." },

    // --- DRUIDA ---
    { id: 'd_foice', nome: "Foice da Natureza", preco: 450, tipo: "Arma", classe: "Druida", bonus: { forca: 2, poderDeFogo: 3 }, desc: "Ferramenta druídica." },
    { id: 'd_cajado_espinho', nome: "Cajado de Espinhos", preco: 1200, tipo: "Arma", classe: "Druida", bonus: { forca: 4, poderDeFogo: 6 }, desc: "Vivo e perigoso." },
    { id: 'd_pelames', nome: "Manto de Peles", preco: 500, tipo: "Armadura", classe: "Druida", bonus: { armadura: 4, resistencia: 2 }, desc: "Pele de urso real." },
    { id: 'd_armadura_casca', nome: "Armadura de Casca", preco: 1500, tipo: "Armadura", classe: "Druida", bonus: { armadura: 7, resistencia: 4 }, desc: "Dura como carvalho." },

    // --- BARDO ---
    { id: 'b_alaude', nome: "Alaude Mágico", preco: 600, tipo: "Arma", classe: "Bardo", bonus: { poderDeFogo: 4, habilidade: 2 }, desc: "Toca sozinho." },
    { id: 'b_flauta', nome: "Flauta Encantada", preco: 1500, tipo: "Arma", classe: "Bardo", bonus: { poderDeFogo: 8, habilidade: 5 }, desc: "Controla mentes." },
    { id: 'b_roupa_fina', nome: "Roupas da Corte", preco: 700, tipo: "Armadura", classe: "Bardo", bonus: { armadura: 2, habilidade: 3 }, desc: "Estilosas." },
    { id: 'b_traje_artista', nome: "Traje do Artista", preco: 1800, tipo: "Armadura", classe: "Bardo", bonus: { armadura: 4, habilidade: 8 }, desc: "Permite movimentos rápidos." }
];

const RANKS_GUILDA = ['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS'];

const LOCAIS_FIXOS = [
    { nome: "Vila Verdejante", tipo: "Vila", bioma: "Planície", descricao: "Uma ilha pacífica cercada pelo mar.", x: 44, y: 57 },
    { nome: "Floresta Sombria", tipo: "Sombria", bioma: "Sombria", descricao: "Árvores mortas e terras amaldiçoadas.", x: 88, y: 40 },
    { nome: "Bosque Ancestral", tipo: "Floresta", bioma: "Floresta", descricao: "Árvores gigantes e magia antiga.", x: 36, y: 42 },
    { nome: "Montanhas de Gelo", tipo: "Montanha", bioma: "Gelo", descricao: "Picos eternamente congelados e perigosos.", x: 62, y: 18 },
    { nome: "Montanhas de Ferro", tipo: "Montanha", bioma: "Montanha", descricao: "Minas antigas e picos rochosos.", x: 50, y: 17 },
    { nome: "Pântano da Perdição", tipo: "Pântano", bioma: "Pântano", descricao: "Águas tóxicas e criaturas venenosas.", x: 75, y: 70 },
    { nome: "Cidadela Real", tipo: "Cidade", bioma: "Urbano", descricao: "A capital do reino, estratégica entre os rios.", x: 50, y: 43 },
    { nome: "Mina Profunda", tipo: "Mina", bioma: "Caverna", descricao: "Riquezas da terra e perigos profundos.", x: 20, y: 20 }
];

const MASMORRAS = [
    { id: 'dg_tumba', nome: "Tumba do Rei Esqueleto", local: "Vila Verdejante", pool: "Tumba do Rei Esqueleto", nivelMin: 5, salas: 5, boss: "Rei Esqueleto", desc: "Uma cripta antiga ressurgida sob a vila." },
    { id: 'dg_ninho', nome: "Ninho da Aranha Rainha", local: "Floresta Sombria", pool: "Ninho da Aranha Rainha", nivelMin: 15, salas: 7, boss: "Aranha Rainha", desc: "Teias cobrem tudo... Cuidado com o veneno." },
    { id: 'dg_caverna', nome: "Caverna do Dragão", local: "Montanhas de Ferro", pool: "Caverna do Dragão", nivelMin: 25, salas: 10, boss: "Dragão Vermelho", desc: "Calor intenso e riquezas inimagináveis." },
    { id: 'dg_cidadela', nome: "Esgotos Reais", local: "Cidadela Real", pool: "Esgotos Reais", nivelMin: 10, salas: 6, boss: "Mestre dos Ratos", desc: "O submundo da capital." }
];

// --- CIDADES VIVAS: NPCs & IMÓVEIS ---
const NPCS = {
    "Vila Verdejante": [
        {
            nome: "Velho Pescador",
            cargo: "Aldeão",
            falas: ["O mar está agitado hoje...", "Dizem que há um tesouro afundado perto da costa.", "Cuidado com os slimes, eles comem tudo!"],
            quest: {
                titulo: "Praga de Slimes",
                desc: "Esses bichos gosmentos estão arruinando minhas redes! Mate alguns para mim.",
                req: { tipo: 'monstro', alvo: 'Slime', qtd: 5 },
                recompensa: { ouro: 200, xp: 100, rep: 2 }
            }
        },
        {
            nome: "Elena",
            cargo: "Curandeira",
            falas: ["Precisa de curativos?", "A natureza nos dá tudo que precisamos."],
            servico: "Cura",
            casavel: true,
            dano: 5,
            classe: "Curandeira",
            habilidades: [{ nome: "Toque Suave", tipo: "Cura", poder: 15, chance: 0.4 }]
        },
        {
            nome: "Capitão do Porto",
            cargo: "Guarda",
            falas: ["Mantenha a ordem, forasteiro.", "Estamos de olho nos bandidos da estrada."],
            reqRep: 5,
            casavel: true,
            dano: 15,
            classe: "Guerreiro",
            habilidades: [{ nome: "Golpe de Escudo", tipo: "Físico", poder: 20, chance: 0.3 }],
            quest: {
                titulo: "Patrulha da Costa",
                desc: "Bandidos foram vistos saqueando viajantes. Dê um jeito neles.",
                req: { tipo: 'monstro', alvo: 'Bandido', qtd: 3 },
                recompensa: { ouro: 500, xp: 250, rep: 5 }
            }
        },
        {
            nome: "Ana, a Fazendeira",
            cargo: "Camponesa",
            falas: ["As colheitas estão fracas este ano...", "Você parece forte! Quer casar?", "Tenho torta de maçã!"],
            casavel: true,
            dano: 8,
            classe: "Camponesa",
            habilidades: [{ nome: "Lanche da Tarde", tipo: "Cura", poder: 10, chance: 0.2 }, { nome: "Forcadada", tipo: "Físico", poder: 12, chance: 0.5 }]
        }
    ],
    "Cidadela Real": [
        {
            nome: "Rei Aldous",
            cargo: "Rei",
            falas: ["Bem-vindo à capital do meu reino.", "Precisamos de heróis corajosos como você.", "A guilda tem trabalho para quem busca glória."],
            reqRank: 'A',
            reqRep: 50
        },
        { nome: "Mestre da Guilda", cargo: "Guilda", falas: ["Sua reputação o precede.", "Temos missões perigosas hoje.", "Continue evoluindo, aventureiro!"], servico: "Guilda" },
        { nome: "Ferreiro Real", cargo: "Comerciante", falas: ["Apenas o melhor aço para a guarda real.", "Se tiver Mithril, posso forjar algo lendário."], servico: "Loja" },
        { nome: "Banqueiro Gnob", cargo: "Banqueiro", falas: ["Ouro é poder.", "Quer comprar um título de propriedade?", "Juros compostos são a magia mais forte de todas."] },
        {
            nome: "Magnus, o Mago da Corte",
            cargo: "Mago Real",
            falas: ["A magia flui como a água...", "Cuidado com o que você deseja.", "Se busca conhecimento, veio ao lugar certo."],
            casavel: true,
            dano: 25,
            classe: "Mago",
            habilidades: [{ nome: "Bola de Fogo", tipo: "Mágico", poder: 40, chance: 0.4 }, { nome: "Escudo Arcano", tipo: "Buff", poder: 10, chance: 0.2 }]
        },
        {
            nome: "Sor Galahad",
            cargo: "Guarda Real",
            falas: ["Por honra e glória!", "O dever chama.", "Mantenha sua espada afiada."],
            casavel: true,
            dano: 30,
            classe: "Paladino",
            habilidades: [{ nome: "Luz Sagrada", tipo: "Físico/Sagrado", poder: 35, chance: 0.5 }, { nome: "Imposição de Mãos", tipo: "Cura", poder: 50, chance: 0.1 }]
        }
    ],
    "Montanhas de Ferro": [
        {
            nome: "Thorin",
            cargo: "Minerador",
            falas: ["Cava, cava, cava...", "Achou Adamantina? Não? Então volte ao trabalho!", "Cuidado com os Golems."],
            casavel: true, dano: 20, classe: "Vingador",
            habilidades: [{ nome: "Martelada Sísmica", tipo: "Físico", poder: 30, chance: 0.3 }],
            quest: {
                titulo: "Pedras Vivas",
                desc: "Os Golems estão atacando a mina. Quebre alguns para mim.",
                req: { tipo: 'monstro', alvo: 'Golem', qtd: 3 },
                recompensa: { ouro: 800, xp: 400, rep: 3 }
            }
        },
        { nome: "Ancião das Runas", cargo: "Sábio", falas: ["As pedras falam, se você souber ouvir.", "Antigamente, dragões viviam aqui."] }
    ],
    "Floresta Sombria": [
        { nome: "Eremita Louco", cargo: "Desconhecido", falas: ["Eles me observam... as aranhas...", "Não entre na tumba à noite!", "O espectro... ele quer minha alma!"] },
        {
            nome: "Vendedora de Venenos",
            cargo: "Mercadora",
            falas: ["Quer algo para... 'resolver' problemas?", "Tudo tem um preço."],
            servico: "LojaIlegal",
            casavel: true,
            dano: 18,
            classe: "Assassina",
            habilidades: [{ nome: "Adaga Envenenada", tipo: "DoT", poder: 5, chance: 0.5 }]
        },
        {
            nome: "Draven",
            cargo: "Caçador de Recompensas",
            falas: ["Já matei monstros maiores que essa cidade.", "Se paga bem, eu mato.", "Cuidado onde pisa."],
            casavel: true,
            dano: 28,
            classe: "Caçador",
            habilidades: [{ nome: "Tiro Preciso", tipo: "Físico", poder: 40, chance: 0.4 }, { nome: "Armadilha", tipo: "DoT", poder: 10, chance: 0.2 }]
        }
    ],
    "Montanhas de Gelo": [
        {
            nome: "Nômade do Gelo",
            cargo: "Viajante",
            falas: ["O frio conserva tudo, até a morte.", "Vi o Dragão Branco ontem. Magnífico e aterrorizante."],
            casavel: true,
            dano: 25,
            classe: "Caçador",
            habilidades: [{ nome: "Lança de Gelo", tipo: "Mágico", poder: 30, chance: 0.4 }]
        }
    ]
};

const IMOVEIS = [
    // CASAS (Recuperação e Save Seguro/Roleplay) - PREÇOS INFLACIONADOS
    { id: 'casa_vila', nome: "Cabana de Pescador", local: "Vila Verdejante", tipo: "Casa", preco: 25000, desc: "Uma cabana simples à beira-mar. Recupera Vida/Mana de graça.", img: "https://images.unsplash.com/photo-1487546276868-b3917de27cba?q=80&w=400" },
    { id: 'casa_cidade', nome: "Apartamento Nobre", local: "Cidadela Real", tipo: "Casa", preco: 150000, desc: "Luxo e conforto no centro da capital. Recupera tudo e dá buff 'Descansado' (+10% XP).", img: "https://images.unsplash.com/photo-1605218427368-35b8168f44d7?q=80&w=400" },
    { id: 'casa_fortaleza', nome: "Fortaleza da Montanha", local: "Montanhas de Ferro", tipo: "Casa", preco: 500000, desc: "Uma fortaleza impenetrável escavada na rocha.", img: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?q=80&w=400" },

    // COMÉRCIOS (Renda Passiva) - PREÇOS INFLACIONADOS
    // Renda baseada em ciclos (dias passando)
    { id: 'loja_vila', nome: "Peixaria da Vila", local: "Vila Verdejante", tipo: "Comercio", preco: 50000, renda: 300, desc: "Gera 300 ouro por dia.", img: "https://images.unsplash.com/photo-1559304787-945aa4341065?q=80&w=400" },
    { id: 'loja_ferreiro', nome: "Forja da Montanha", local: "Montanhas de Ferro", tipo: "Comercio", preco: 120000, renda: 800, desc: "Gera 800 ouro por dia.", img: "https://images.unsplash.com/photo-1617377182283-4a0b224e756c?q=80&w=400" },
    { id: 'loja_taverna', nome: "Taverna Real", local: "Cidadela Real", tipo: "Comercio", preco: 400000, renda: 3000, desc: "O lugar mais badalado do reino. Gera 3000 ouro por dia.", img: "https://images.unsplash.com/photo-1572061486801-94a2b9a7857c?q=80&w=400" },
    { id: 'loja_mina', nome: "Mina de Ouro Abandonada", local: "Mina Profunda", tipo: "Comercio", preco: 1000000, renda: 12000, desc: "Investimento de alto risco e retorno. Gera 12000 ouro por dia.", img: "https://images.unsplash.com/photo-1581093583449-ed25287d3a0f?q=80&w=400" }
];

// --- Imagens de Bioma ---
const BIOME_IMAGES = {
    'Vila': './assets/bg_vila.png',
    'Cidade': './assets/bg_cidade.png',
    'Floresta': './assets/bg_floresta.png',
    'Sombria': './assets/bg_sombria.png',
    'Montanha': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000', // Montanha
    'Caverna': 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=2000', // Caverna Escura
    'Ruínas': 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=2000', // Ruínas
    'Deserto': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000', // Deserto
    'Gelado': 'https://images.unsplash.com/photo-1623594247514-9b2f21af5866?q=80&w=2000', // Neve/Gelo
    'Pântano': './assets/bg_pantano.png',
    'Pântano': './assets/bg_pantano.png',
    'Mina': './assets/bg_mina.png', // Mina
    'Padrão': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000' // Genérico Épico
};

// --- Configuração de Monstros (Global para acesso externo) ---
const POOLS = {
    "Vila Verdejante": [
        { nome: "Ratataz", baseHp: 50, baseDano: 4, xp: 20, ouro: 5, elemento: 'Neutro' },
        { nome: "Slime", baseHp: 65, baseDano: 5, xp: 25, ouro: 8, elemento: 'Água' },
        { nome: "Bandido Pé-de-Chinelo", baseHp: 80, baseDano: 6, xp: 30, ouro: 12, elemento: 'Neutro' }
    ],
    "Tumba do Rei Esqueleto": [
        { nome: "Esqueleto", baseHp: 60, baseDano: 8, xp: 40, ouro: 10, elemento: 'Trevas' },
        { nome: "Zumbi", baseHp: 80, baseDano: 6, xp: 35, ouro: 8, elemento: 'Trevas' }
    ],
    "Bosque Ancestral": [
        { nome: "Lobo Faminto", baseHp: 120, baseDano: 12, xp: 60, ouro: 12, drop: "Pele de Lobo", elemento: 'Neutro' },
        { nome: "Urso Pardo", baseHp: 250, baseDano: 20, xp: 120, ouro: 25, drop: "Garra de Urso", elemento: 'Terra' },
        { nome: "Javali Selvagem", baseHp: 160, baseDano: 14, xp: 80, ouro: 15, elemento: 'Terra' },
        { nome: "Bandido da Estrada", baseHp: 140, baseDano: 13, xp: 70, ouro: 35, elemento: 'Neutro' }
    ],
    "Floresta Sombria": [
        { nome: "Esqueleto Guerreiro", baseHp: 180, baseDano: 16, xp: 90, ouro: 20, drop: "Osso Antigo", horarios: ['Noite'], elemento: 'Trevas' },
        { nome: "Aranha Gigante", baseHp: 200, baseDano: 18, xp: 100, ouro: 25, drop: "Veneno de Aranha", horarios: ['Noite'], elemento: 'Trevas' },
        { nome: "Goblin Saqueador", baseHp: 130, baseDano: 14, xp: 60, ouro: 15, horarios: ['Manhã', 'Tarde'], elemento: 'Neutro' },
        { nome: "Espectro", baseHp: 300, baseDano: 25, xp: 200, ouro: 60, drop: "Ectoplasma", horarios: ['Noite'], elemento: 'Trevas' },
        { nome: "Dragão Jovem", baseHp: 800, baseDano: 45, xp: 800, ouro: 300, drop: "Escama de Dragão", elemento: 'Fogo' } // Chefe Raro
    ],
    "Ninho da Aranha Rainha": [
        { nome: "Aranha Pequena", baseHp: 80, baseDano: 10, xp: 40, ouro: 10 },
        { nome: "Aranha Gigante", baseHp: 200, baseDano: 18, xp: 110, ouro: 25, drop: "Veneno de Aranha" }
    ],
    "Montanhas de Ferro": [
        { nome: "Orc Guerreiro", baseHp: 350, baseDano: 30, xp: 150, ouro: 50, drop: "Machado Velho", elemento: 'Terra' },
        { nome: "Troll da Montanha", baseHp: 600, baseDano: 40, xp: 300, ouro: 100, drop: "Couro de Troll", elemento: 'Terra' },
        { nome: "Golem de Pedra", baseHp: 900, baseDano: 35, xp: 400, ouro: 150, drop: "Minério de Ferro", elemento: 'Terra' }
    ],
    "Caverna do Dragão": [
        { nome: "Kobold", baseHp: 100, baseDano: 15, xp: 70, ouro: 30, elemento: 'Terra' },
        { nome: "Elemental de Fogo", baseHp: 400, baseDano: 40, xp: 250, ouro: 80, elemento: 'Fogo' }
    ],
    "Pântano da Perdição": [
        { nome: "Slime Tóxico", baseHp: 250, baseDano: 20, xp: 120, ouro: 40, elemento: 'Planta' },
        { nome: "Cobra Gigante", baseHp: 300, baseDano: 25, xp: 150, ouro: 50, drop: "Presa de Cobra", elemento: 'Planta' },
        { nome: "Crocodilo Ancião", baseHp: 550, baseDano: 35, xp: 300, ouro: 80, drop: "Couro Rígido", elemento: 'Água' }
    ],
    "Montanhas de Gelo": [
        { nome: "Lobo das Neves", baseHp: 300, baseDano: 25, xp: 140, ouro: 40, drop: "Pele de Lobo Branco", elemento: 'Gelo' },
        { nome: "Yeti", baseHp: 1000, baseDano: 50, xp: 600, ouro: 150, drop: "Pele de Yeti", elemento: 'Gelo' },
        { nome: "Elemental de Gelo", baseHp: 800, baseDano: 60, xp: 500, ouro: 120, drop: "Fragmento de Gelo", elemento: 'Gelo' },
        { nome: "Guerreiro Nórdico", baseHp: 400, baseDano: 35, xp: 200, ouro: 80, elemento: 'Físico' },
        { nome: "Gigante de Gelo", baseHp: 2000, baseDano: 90, xp: 1500, ouro: 600, drop: "Armadura Congelada", elemento: 'Gelo' },
        { nome: "Dragão Branco", baseHp: 5000, baseDano: 150, xp: 4000, ouro: 3000, drop: "Lâmina de Gelo", elemento: 'Gelo' }
    ],
    "Cidadela Real": [
        { nome: "Rato de Esgoto", baseHp: 50, baseDano: 4, xp: 10, ouro: 2 },
        { nome: "Ladrão Urbano", baseHp: 100, baseDano: 10, xp: 40, ouro: 50 }
    ],
    "Esgotos Reais": [
        { nome: "Rato Gigante", baseHp: 80, baseDano: 8, xp: 40, ouro: 12 },
        { nome: "Limo de Esgoto", baseHp: 150, baseDano: 15, xp: 75, ouro: 25 }
    ]
};

// --- LOGICA DE GERAÇÃO E PROCESSAMENTO ---
const Gerador = {
    monstro: (nivel, local, ciclo = 'Tarde') => {
        // Seleciona a pool baseada no local
        let pool = POOLS[local] || POOLS["Bosque Ancestral"];

        // Filtra por horário (se o monstro tiver restrição)
        // Monstros sem 'horarios' aparecem sempre.
        const poolPorHorario = pool.filter(m => !m.horarios || m.horarios.includes(ciclo));

        // Fallback: Se não sobrar ninguém (ex: dia na floresta sombria so tem monstro noturno?), usa a pool completa
        const poolFinal = poolPorHorario.length > 0 ? poolPorHorario : pool;

        // Escolhe um monstro aleatório
        const base = poolFinal[Math.floor(Math.random() * poolFinal.length)];

        // REMOVIDO SCALING: Monstros agora tem status fixos definidos no POOLS
        const multHp = 1;

        // Bônus para monstros com drop (Elites/Chefes implícitos) -> Mantém apenas bonus de drop
        let bonusXp = 1;
        if (base.drop) bonusXp = 1.5;

        // Boost Noturno para Mortos-Vivos
        let danoFinal = base.baseDano;
        let nomeFinal = base.nome;
        if (ciclo === 'Noite' && (base.nome.includes("Esqueleto") || base.nome.includes("Zumbi") || base.nome.includes("Espectro"))) {
            danoFinal = Math.floor(danoFinal * 1.3);
            nomeFinal = `${base.nome} (Frenético)`;
        }

        return {
            ...base,
            nome: nomeFinal,
            hp: base.baseHp,
            maxHp: base.baseHp,
            dano: danoFinal,
            xp: Math.floor(base.xp * bonusXp),
            ouro: base.ouro + 3,
            uid: Date.now()
        };
    },
    missao: (rank) => {
        const tipos = ['Eliminar', 'Coletar'];
        const alvos = ['Goblin', 'Erva', 'Bandido', 'Relíquia', 'Lobo', 'Orc', 'Slime']; // Singulares para facilitar match
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        const alvo = alvos[Math.floor(Math.random() * alvos.length)];
        const rankIdx = RANKS_GUILDA.indexOf(rank);
        const qtdBase = 3 + (rankIdx * 2); // F:3, E:5, D:7...
        const qtd = Math.floor(qtdBase + (Math.random() * rankIdx)); // Variação

        return {
            id: Math.random(),
            titulo: `${tipo} ${alvo}s`,
            desc: `A guilda precisa que você vá ${tipo === 'Eliminar' ? 'caçar' : 'buscar'} ${alvo}s nos arredores.`,
            rank,
            req: qtd,
            atual: 0,
            xp: 100 * (rankIdx + 1),
            ouro: 50 * (rankIdx + 1)
        };
    }
};

// Funções Utilitárias Globais
const getMonsterIcon = (nome) => {
    if (nome.includes("Lobo")) return "🐺";
    if (nome.includes("Urso")) return "🐻";
    if (nome.includes("Javali")) return "🐗";
    if (nome.includes("Esqueleto")) return "💀";
    if (nome.includes("Aranha")) return "🕷️";
    if (nome.includes("Goblin")) return "👺";
    if (nome.includes("Espectro")) return "👻";
    if (nome.includes("Dragão")) return "🐉";
    if (nome.includes("Orc")) return "👹";
    if (nome.includes("Troll")) return "👹";
    if (nome.includes("Slime")) return "🦠";
    if (nome.includes("Rato")) return "🐀";
    if (nome.includes("Bandido") || nome.includes("Ladrão")) return "🦹";
    if (nome.includes("Vampiro") || nome.includes("Dracula")) return "🧛";
    if (nome.includes("Elemental de Gelo")) return "❄️";
    if (nome.includes("Yeti")) return "🦍";
    if (nome.includes("Gigante")) return "🗿";
    if (nome.includes("Cobra")) return "🐍";
    if (nome.includes("Crocodilo")) return "🐊"; // Ou jacaré
    return "👾";
};

const MERCENARIOS = [
    { nome: "Garrick", classe: "Guerreiro", custo: 500, dano: 15, desc: "Ex-guarda real, robusto e confiável.", habilidades: [{ nome: "Golpe Debilitante", tipo: "Físico", poder: 25, chance: 0.3 }] },
    { nome: "Elara", classe: "Curandeira", custo: 800, dano: 5, desc: "Sacerdotisa itinerante.", habilidades: [{ nome: "Oração de Cura", tipo: "Cura", poder: 25, chance: 0.5 }] },
    { nome: "Kael", classe: "Mago", custo: 1200, dano: 25, desc: "Mago expulso da academia por experimentos perigosos.", habilidades: [{ nome: "Raio Arcano", tipo: "Mágico", poder: 40, chance: 0.4 }] },
    { nome: "Zog", classe: "Bárbaro", custo: 1000, dano: 30, desc: "Gosta de esmagar coisas.", habilidades: [{ nome: "Fúria", tipo: "Buff", poder: 10, chance: 0.2 }, { nome: "Esmagar", tipo: "Físico", poder: 45, chance: 0.3 }] }
];

// Log para confirmar carregamento
console.log("Game Library v1.3 carregada com sucesso.");
