// ================================================================
// GAME LIBRARY (game-lib.js)
// Lógica de processamento e banco de dados do Crônicas RPG
// ================================================================

// --- CONFIGURAÇÕES ---
const STORAGE_KEY_V2 = 'cronicas_saves_v2';
const NIVEL_MAX_CLASSE_BASICA = 20;
const CICLOS = ['Manhã', 'Tarde', 'Noite']; // Novo sistema de tempo

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

// --- HABILIDADES (Antigas Magias) ---
const HABILIDADES_LOJA = [
    // --- GUERREIRO ---
    { id: 'g_golpe', nome: "Golpe Pesado", classe: 'Guerreiro', custo: 100, mana: 3, tipo: 'Físico', poder: 6, desc: "Ataque forte com arma." },
    { id: 'g_grito', nome: "Grito de Guerra", classe: 'Guerreiro', custo: 200, mana: 5, tipo: 'Buff', poder: 3, desc: "+3 Dano temporário." },
    { id: 'g_corte', nome: "Corte Giratório", classe: 'Guerreiro', custo: 400, mana: 10, tipo: 'Físico', poder: 10, area: true, desc: "Ataque em área." },

    // --- MAGO ---
    { id: 'm_missil', nome: "Míssil Mágico", classe: 'Mago', custo: 100, mana: 4, tipo: 'Mágico', poder: 6, desc: "Dano arcano infalível." },
    { id: 'm_fogo', nome: "Bola de Fogo", classe: 'Mago', custo: 300, mana: 12, tipo: 'Mágico', poder: 8, area: true, desc: "Explosão térmica em área." },
    { id: 'm_escudo', nome: "Escudo de Mana", classe: 'Mago', custo: 250, mana: 8, tipo: 'Buff', poder: 5, desc: "Absorve dano." },

    // --- LADINO ---
    { id: 'l_adaga', nome: "Punhalada", classe: 'Ladino', custo: 150, mana: 5, tipo: 'Físico', poder: 8, desc: "Crítico garantido pelas costas." },
    { id: 'l_veneno', nome: "Lâmina Venenosa", classe: 'Ladino', custo: 250, mana: 8, tipo: 'DoT', poder: 4, desc: "Dano por turno." },
    { id: 'l_sombras', nome: "Passo Sombrio", classe: 'Ladino', custo: 300, mana: 12, tipo: 'Buff', poder: 0, desc: "Imune por 1 turno." },
    { id: 'l_leque', nome: "Leque de Facas", classe: 'Ladino', custo: 400, mana: 10, tipo: 'Físico', poder: 6, area: true, desc: "Lança facas em todos." },

    // --- PALADINO ---
    { id: 'p_luz', nome: "Golpe Sacro", classe: 'Paladino', custo: 200, mana: 6, tipo: 'Físico/Sagrado', poder: 7, desc: "Dano + Cura pequena." },
    { id: 'p_cura', nome: "Imposição de Mãos", classe: 'Paladino', custo: 300, mana: 10, tipo: 'Cura', poder: 15, desc: "Grande cura em si mesmo." },
    { id: 'p_consagrar', nome: "Consagração", classe: 'Paladino', custo: 450, mana: 15, tipo: 'Mágico', poder: 8, area: true, desc: "Permea o solo com luz (AoE)." },

    // --- CLÉRIGO ---
    { id: 'c_cura', nome: "Cura Maior", classe: 'Clérigo', custo: 200, mana: 8, tipo: 'Cura', poder: 20, desc: "Recupera muita vida." },
    { id: 'c_luz', nome: "Punição Divina", classe: 'Clérigo', custo: 250, mana: 8, tipo: 'Mágico', poder: 8, desc: "Queima inimigos com fé." },
    { id: 'c_nova', nome: "Nova Sagrada", classe: 'Clérigo', custo: 400, mana: 15, tipo: 'Mágico', poder: 9, area: true, desc: "Explosão de luz em área." },

    // --- ARQUEIRO ---
    { id: 'a_duplo', nome: "Disparo Duplo", classe: 'Arqueiro', custo: 150, mana: 6, tipo: 'Físico', poder: 7, desc: "Duas flechas rápidas." },
    { id: 'a_chuva', nome: "Chuva de Flechas", classe: 'Arqueiro', custo: 350, mana: 12, tipo: 'Físico', poder: 8, area: true, desc: "Atinge múltiplos inimigos." },

    // --- NECROMANTE ---
    { id: 'n_drenar', nome: "Drenar Vida", classe: 'Necromante', custo: 250, mana: 8, tipo: 'Mágico', poder: 6, desc: "Rouba vida do alvo." },
    { id: 'n_nevoa', nome: "Névoa Mortal", classe: 'Necromante', custo: 450, mana: 15, tipo: 'Mágico', poder: 7, area: true, desc: "Nuvem tóxica em área." },
    { id: 'n_esqueleto', nome: "Invocar Morto", classe: 'Necromante', custo: 400, mana: 20, tipo: 'Summon', poder: 0, desc: "Invoca ajudante." },

    // --- BARDO ---
    { id: 'b_inspirar', nome: "Canção da Coragem", classe: 'Bardo', custo: 200, mana: 10, tipo: 'Buff', poder: 2, desc: "+2 em todos atributos." },
    { id: 'b_dissonante', nome: "Acorde Dissonante", classe: 'Bardo', custo: 250, mana: 8, tipo: 'Mágico', poder: 8, desc: "Dano sônico." },
    { id: 'b_requiem', nome: "Réquiem Final", classe: 'Bardo', custo: 500, mana: 18, tipo: 'Mágico', poder: 10, area: true, desc: "Música mortal em área." },

    // --- DRUIDA ---
    { id: 'd_vinhas', nome: "Vinhas Esmagadoras", classe: 'Druida', custo: 200, mana: 8, tipo: 'Mágico', poder: 7, desc: "Dano de terra." },
    { id: 'd_urso', nome: "Forma de Urso", classe: 'Druida', custo: 500, mana: 20, tipo: 'Transform', poder: 10, desc: "+10 Força/Res temp." },
    { id: 'd_tempestade', nome: "Tempestade", classe: 'Druida', custo: 450, mana: 18, tipo: 'Mágico', poder: 9, area: true, desc: "Raios em todos os inimigos." },
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

    // --- GUERREIRO ---
    { id: 'g_espada_aco', nome: "Espada de Aço", preco: 400, tipo: "Arma", classe: "Guerreiro", bonus: { forca: 4 }, desc: "Lâmina confiável." },
    { id: 'g_machado_duplo', nome: "Machado Duplo", preco: 1200, tipo: "Arma", classe: "Guerreiro", bonus: { forca: 8, habilidade: -1 }, desc: "Devastador." },
    { id: 'g_placas', nome: "Placas de Ferro", preco: 800, tipo: "Armadura", classe: "Guerreiro", bonus: { armadura: 5 }, desc: "Proteção pesada." },
    { id: 'g_placas_mithril', nome: "Placas de Mithril", preco: 3000, tipo: "Armadura", classe: "Guerreiro", bonus: { armadura: 10, resistencia: 2 }, desc: "Leve e impenetrável." },

    // --- PETS (NOVOS) ---
    { id: 'pet_cao', nome: "Cão de Caça", preco: 1500, tipo: "Pet", bonus: { dano: 3 }, desc: "Fiel companheiro. Ataca todo turno." },
    { id: 'pet_gato', nome: "Gato Preto", preco: 2500, tipo: "Pet", bonus: { critico: 5 }, desc: "Dá sorte (+5% Crítico e Esquiva)." }, // Simplificado: Ataca também
    { id: 'pet_fada', nome: "Fada da Luz", preco: 5000, tipo: "Pet", bonus: { cura: 5 }, desc: "Cura 5 PV por turno." },
    { id: 'pet_lobo', nome: "Lobo das Neves", preco: 8000, tipo: "Pet", bonus: { dano: 8 }, desc: "Mordida feroz." },
    { id: 'pet_dragao', nome: "Dragãozinho", preco: 50000, tipo: "Pet", bonus: { dano: 20 }, desc: "Cospe fogo." },


    // --- MAGO / NECROMANTE ---
    { id: 'm_cajado_carvalho', nome: "Cajado de Carvalho", preco: 300, tipo: "Arma", classe: "Mago", bonus: { poderDeFogo: 3 }, desc: "Foco arcano básico." },
    { id: 'm_cajado_rubi', nome: "Cajado de Rubi", preco: 1500, tipo: "Arma", classe: "Mago", bonus: { poderDeFogo: 8, mana: 10 }, desc: "Pulsando com magia." },
    { id: 'm_robe', nome: "Robe de Aprendiz", preco: 250, tipo: "Armadura", classe: "Mago", bonus: { armadura: 1, mana: 10 }, desc: "Tecido simples." },
    { id: 'm_robe_arquimago', nome: "Robe do Arquimago", preco: 2000, tipo: "Armadura", classe: "Mago", bonus: { armadura: 3, resistencia: 5, mana: 30 }, desc: "Encantado com proteções." },

    // --- LADINO / ARQUEIRO ---
    { id: 'l_adagas', nome: "Adagas de Aço", preco: 350, tipo: "Arma", classe: "Ladino", bonus: { habilidade: 3, forca: 1 }, desc: "Rápidas." },
    { id: 'l_arco_comp', nome: "Arco Composto", preco: 600, tipo: "Arma", classe: "Arqueiro", bonus: { habilidade: 5 }, desc: "Longo alcance." },
    { id: 'l_couro', nome: "Couro Batido", preco: 400, tipo: "Armadura", classe: "Ladino", bonus: { armadura: 3, habilidade: 1 }, desc: "Não faz barulho." },
    { id: 'l_capa_sombra', nome: "Capa das Sombras", preco: 1800, tipo: "Armadura", classe: "Ladino", bonus: { armadura: 5, habilidade: 4 }, desc: "Mescla-se com o escuro." },

    // --- PALADINO / CLÉRIGO ---
    { id: 'p_martelo', nome: "Martelo de Guerra", preco: 500, tipo: "Arma", classe: "Paladino", bonus: { forca: 4, poderDeFogo: 1 }, desc: "Esmaga hereges." },
    { id: 'p_maca', nome: "Maça Consagrada", preco: 1000, tipo: "Arma", classe: "Clérigo", bonus: { poderDeFogo: 5, forca: 2 }, desc: "Brilha com luz." },
    { id: 'p_cota_malha', nome: "Cota de Malha Sagrada", preco: 900, tipo: "Armadura", classe: "Paladino", bonus: { armadura: 6, resistencia: 2 }, desc: "Abençoada." },

    // --- DRUIDA ---
    { id: 'd_foice', nome: "Foice da Natureza", preco: 450, tipo: "Arma", classe: "Druida", bonus: { forca: 2, poderDeFogo: 3 }, desc: "Ferramenta druídica." },
    { id: 'd_pelames', nome: "Manto de Peles", preco: 500, tipo: "Armadura", classe: "Druida", bonus: { armadura: 4, resistencia: 2 }, desc: "Pele de urso real." },

    // --- BARDO ---
    { id: 'b_alaude', nome: "Alaude Mágico", preco: 600, tipo: "Arma", classe: "Bardo", bonus: { poderDeFogo: 4, habilidade: 2 }, desc: "Toca sozinho." },
    { id: 'b_roupa_fina', nome: "Roupas da Corte", preco: 700, tipo: "Armadura", classe: "Bardo", bonus: { armadura: 2, habilidade: 3 }, desc: "Estilosas." }
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
        { nome: "Ratataz", baseHp: 50, baseDano: 4, xp: 20, ouro: 5 },
        { nome: "Slime", baseHp: 65, baseDano: 5, xp: 25, ouro: 8 },
        { nome: "Bandido Pé-de-Chinelo", baseHp: 80, baseDano: 6, xp: 30, ouro: 12 }
    ],
    "Tumba do Rei Esqueleto": [
        { nome: "Esqueleto", baseHp: 60, baseDano: 8, xp: 40, ouro: 10 },
        { nome: "Zumbi", baseHp: 80, baseDano: 6, xp: 35, ouro: 8 }
    ],
    "Bosque Ancestral": [
        { nome: "Lobo Faminto", baseHp: 120, baseDano: 12, xp: 60, ouro: 12, drop: "Pele de Lobo" },
        { nome: "Urso Pardo", baseHp: 250, baseDano: 20, xp: 120, ouro: 25, drop: "Garra de Urso" },
        { nome: "Javali Selvagem", baseHp: 160, baseDano: 14, xp: 80, ouro: 15 },
        { nome: "Bandido da Estrada", baseHp: 140, baseDano: 13, xp: 70, ouro: 35 }
    ],
    "Floresta Sombria": [
        { nome: "Esqueleto Guerreiro", baseHp: 180, baseDano: 16, xp: 90, ouro: 20, drop: "Osso Antigo", horarios: ['Noite'] },
        { nome: "Aranha Gigante", baseHp: 200, baseDano: 18, xp: 100, ouro: 25, drop: "Veneno de Aranha", horarios: ['Noite'] },
        { nome: "Goblin Saqueador", baseHp: 130, baseDano: 14, xp: 60, ouro: 15, horarios: ['Manhã', 'Tarde'] },
        { nome: "Espectro", baseHp: 300, baseDano: 25, xp: 200, ouro: 60, drop: "Ectoplasma", horarios: ['Noite'] },
        { nome: "Dragão Jovem", baseHp: 800, baseDano: 45, xp: 800, ouro: 300, drop: "Escama de Dragão" } // Chefe Raro
    ],
    "Ninho da Aranha Rainha": [
        { nome: "Aranha Pequena", baseHp: 80, baseDano: 10, xp: 40, ouro: 10 },
        { nome: "Aranha Gigante", baseHp: 200, baseDano: 18, xp: 110, ouro: 25, drop: "Veneno de Aranha" }
    ],
    "Montanhas de Ferro": [
        { nome: "Orc Guerreiro", baseHp: 350, baseDano: 30, xp: 150, ouro: 50, drop: "Machado Velho" },
        { nome: "Troll da Montanha", baseHp: 600, baseDano: 40, xp: 300, ouro: 100, drop: "Couro de Troll" },
        { nome: "Golem de Pedra", baseHp: 900, baseDano: 35, xp: 400, ouro: 150, drop: "Minério de Ferro" }
    ],
    "Caverna do Dragão": [
        { nome: "Kobold", baseHp: 100, baseDano: 15, xp: 70, ouro: 30 },
        { nome: "Elemental de Fogo", baseHp: 400, baseDano: 40, xp: 250, ouro: 80 }
    ],
    "Pântano da Perdição": [
        { nome: "Slime Tóxico", baseHp: 250, baseDano: 20, xp: 120, ouro: 40 },
        { nome: "Cobra Gigante", baseHp: 300, baseDano: 25, xp: 150, ouro: 50, drop: "Presa de Cobra" },
        { nome: "Crocodilo Ancião", baseHp: 550, baseDano: 35, xp: 300, ouro: 80, drop: "Couro Rígido" }
    ],
    "Montanhas de Gelo": [
        { nome: "Lobo das Neves", baseHp: 300, baseDano: 25, xp: 140, ouro: 40, drop: "Pele de Lobo Branco" },
        { nome: "Yeti", baseHp: 1000, baseDano: 50, xp: 600, ouro: 150, drop: "Pele de Yeti" },
        { nome: "Elemental de Gelo", baseHp: 800, baseDano: 60, xp: 500, ouro: 120, drop: "Fragmento de Gelo" },
        { nome: "Guerreiro Nórdico", baseHp: 400, baseDano: 35, xp: 200, ouro: 80 },
        { nome: "Gigante de Gelo", baseHp: 2000, baseDano: 90, xp: 1500, ouro: 600, drop: "Armadura Congelada" },
        { nome: "Dragão Branco", baseHp: 5000, baseDano: 150, xp: 4000, ouro: 3000, drop: "Lâmina de Gelo" }
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

// Log para confirmar carregamento
console.log("Game Library v1.2 carregada com sucesso.");
