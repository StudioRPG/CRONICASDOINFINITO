
import { GoogleGenAI, Type } from "@google/genai";
import { Monstro, ContextoMundo, EventoJogo, Item, Magia, Missao, ClasseTipo, MissaoRank, OpcaoViagem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const gerarMissoes = async (rankJogador: MissaoRank, local: string): Promise<Missao[]> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: `Você é um mestre de RPG. Gere uma lista de 4 missões de guilda disponíveis em "${local}". 
               O rank atual do jogador é "${rankJogador}".
               Regras:
               1. O campo 'rank' DEVE ser uma única letra: 'F', 'E', 'D', 'C', 'B', 'A' ou 'S'.
               2. O campo 'tipoAlvo' DEVE ser 'Monstro' ou 'Evento'.
               3. Recompensas de Ouro: Rank F(50-100), E(100-200), D(200-500), C(500-1000), B(1000-2500), A(2500-5000), S(5000+).
               4. Recompensas de XP: Rank F(50), E(150), D(400), C(1000), B(2500), A(6000), S(15000).
               Retorne APENAS o JSON.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        titulo: { type: Type.STRING },
                        descricao: { type: Type.STRING },
                        recompensaOuro: { type: Type.NUMBER },
                        recompensaXp: { type: Type.NUMBER },
                        rank: { type: Type.STRING },
                        tipoAlvo: { type: Type.STRING }
                    },
                    required: ["titulo", "descricao", "recompensaOuro", "recompensaXp", "rank", "tipoAlvo"]
                }
            }
        }
    });

    try {
        const data = JSON.parse(response.text!);
        return data.map((m: any) => ({
            ...m,
            id: Math.random().toString(36).substr(2, 9),
            rank: (['F', 'E', 'D', 'C', 'B', 'A', 'S'].includes(m.rank) ? m.rank : rankJogador) as MissaoRank,
            tipoAlvo: (m.tipoAlvo === 'Monstro' || m.tipoAlvo === 'Evento') ? m.tipoAlvo : 'Monstro'
        }));
    } catch (e) {
        console.error("Erro ao processar missões:", e);
        return [];
    }
};

export const gerarEventoNarrativo = async (nivelJogador: number, bioma: string, local: string): Promise<EventoJogo> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: `Crie um evento narrativo curto em "${local}" (${bioma}). 
               Se for uma cidade, foque em intrigas ou NPCs. Se for selvagem, foque em sobrevivência ou mistérios.
               O evento deve ter um título, uma descrição envolvente e pelo menos 2 escolhas.
               Retorne APENAS o JSON.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    titulo: { type: Type.STRING },
                    descricao: { type: Type.STRING },
                    npcNome: { type: Type.STRING },
                    opcoes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                texto: { type: Type.STRING },
                                consequencia: { type: Type.STRING },
                                impacto: {
                                    type: Type.OBJECT,
                                    properties: {
                                        hp: { type: Type.NUMBER },
                                        mana: { type: Type.NUMBER },
                                        ouro: { type: Type.NUMBER },
                                        xp: { type: Type.NUMBER }
                                    }
                                }
                            },
                            required: ["texto", "consequencia", "impacto"]
                        }
                    }
                },
                required: ["titulo", "descricao", "opcoes"]
            }
        }
    });

    try {
        const data = JSON.parse(response.text!);
        if (!data.opcoes || data.opcoes.length === 0) {
            data.opcoes = [{ texto: "Continuar", consequencia: "Você segue adiante.", impacto: {} }];
        }
        return data;
    } catch (e) {
        console.error("Erro ao gerar evento narrativo:", e);
        return {
            titulo: "Um Momento de Calma",
            descricao: "Nada de especial acontece enquanto você caminha pela área.",
            opcoes: [{ texto: "Continuar", consequencia: "Você segue adiante.", impacto: {} }]
        };
    }
};

export const gerarMonstro = async (nivelJogador: number, bioma: string): Promise<Monstro> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: `Gere um monstro nível ${nivelJogador} para o bioma ${bioma}.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING },
                    tipo: { type: Type.STRING },
                    familia: { type: Type.STRING },
                    descricao: { type: Type.STRING },
                    maxHp: { type: Type.NUMBER },
                    dano: { type: Type.NUMBER },
                    habilidade: { type: Type.NUMBER },
                    armadura: { type: Type.NUMBER },
                    raridade: { type: Type.STRING }
                },
                required: ["nome", "tipo", "familia", "descricao", "maxHp", "dano", "habilidade", "armadura", "raridade"]
            }
        }
    });
    const data = JSON.parse(response.text!);
    return { ...data, nivel: nivelJogador, hp: data.maxHp };
};

export const gerarContextoMundo = async (nomeLocal: string): Promise<ContextoMundo> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: `Descreva o local "${nomeLocal}" em um mundo de fantasia. 
               Identifique claramente se é um assentamento (Cidade, Vila, etc.) ou uma região selvagem (Floresta, Caverna, etc.) no campo 'bioma'.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    bioma: { type: Type.STRING, description: "Ex: Cidade Medieval, Floresta Densa, Caverna Sombria" },
                    descricao: { type: Type.STRING },
                    hostil: { type: Type.BOOLEAN },
                    reinoNome: { type: Type.STRING },
                    governoTipo: { type: Type.STRING }
                },
                required: ["bioma", "descricao", "hostil", "reinoNome", "governoTipo"]
            }
        }
    });
    return JSON.parse(response.text!);
};
