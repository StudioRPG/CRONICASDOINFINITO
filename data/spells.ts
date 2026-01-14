import { Magia, MagiaTipo, ClasseTipo } from '../types';

const spellTemplate = (
    name: string,
    desc: string,
    mana: number,
    pwr: number,
    type: MagiaTipo,
    target: 'Unico' | 'Todos',
    elem: string,
    cls: ClasseTipo | undefined,
    price: number
): Magia => ({
    id: name.toLowerCase().replace(/\s/g, '-'),
    nome: name,
    descricao: desc,
    custoMana: mana,
    poder: pwr,
    tipo: type,
    alvo: target,
    classeRequerida: cls,
    elemento: elem,
    preco: price
});

export const MAGIAS: Magia[] = [
    // Mago
    spellTemplate("Bola de Fogo", "Lança uma esfera explosiva de chamas.", 5, 6, "Ataque", "Todos", "Fogo", "Mago", 200),
    spellTemplate("Raio Arcano", "Um disparo rápido de energia mágica puro.", 2, 4, "Ataque", "Unico", "Arcano", "Mago", 50),
    spellTemplate("Congelamento", "Envolve o alvo em gelo, causando dano e lentidão.", 4, 5, "Ataque", "Unico", "Gelo", "Mago", 150),

    // Clérigo / Paladino
    spellTemplate("Cura Menor", "Restaura uma pequena quantidade de vitalidade.", 3, 5, "Cura", "Unico", "Luz", "Clérigo", 100),
    spellTemplate("Cura Maior", "Restaura grande quantidade de vida.", 8, 15, "Cura", "Unico", "Luz", "Clérigo", 400),
    spellTemplate("Luz Divina", "Queima inimigos com o poder da fé.", 4, 6, "Ataque", "Unico", "Luz", "Paladino", 150),
    spellTemplate("Bênção em Área", "Cura todos os aliados levemente.", 10, 8, "Cura", "Todos", "Luz", "Clérigo", 500),

    // Necromante
    spellTemplate("Drenar Vida", "Rouba vitalidade do inimigo para si.", 6, 4, "Ataque", "Unico", "Trevas", "Necromante", 300),
    spellTemplate("Seta Sombria", "Um projétil de escuridão concentrada.", 3, 5, "Ataque", "Unico", "Trevas", "Necromante", 100),
    spellTemplate("Explosão de Cadáveres", "Detona restos mortais causando dano massivo em área.", 12, 10, "Ataque", "Todos", "Trevas", "Necromante", 600),

    // Druida
    spellTemplate("Vinhas Esmagadoras", "Invoca plantas para prender e esmagar.", 5, 5, "Ataque", "Todos", "Terra", "Druida", 200),
    spellTemplate("Relâmpago", "Invoca um raio dos céus.", 5, 7, "Ataque", "Unico", "Ar", "Druida", 250),
    spellTemplate("Toque de Gaia", "Uma cura natural regenerativa.", 4, 6, "Cura", "Unico", "Natureza", "Druida", 180),

    // Bardo
    spellTemplate("Canção de Ninar", "Magia que causa dano psíquico.", 4, 4, "Ataque", "Todos", "Psíquico", "Bardo", 200),
    spellTemplate("Grito Sônico", "Ondas sonoras que atordoam.", 5, 6, "Ataque", "Unico", "Som", "Bardo", 220),

    // Universal / Outros (Atribuídos a classes genéricas ou específicas para balancear)
    spellTemplate("Chama do Dragão", "Sopro de fogo intenso.", 15, 20, "Ataque", "Todos", "Fogo", "Mago", 1000),
    spellTemplate("Meteoro", "Invoca uma rocha flamejante do céu.", 20, 30, "Ataque", "Todos", "Terra", "Mago", 2000),
    spellTemplate("Julgamento Final", "O poder absoluto da ordem.", 25, 35, "Ataque", "Unico", "Luz", "Paladino", 2500),
];
