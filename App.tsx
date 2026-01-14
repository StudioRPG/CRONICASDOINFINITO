
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Jogador, RacaTipo, ClasseTipo, Monstro, LogJogo, ContextoMundo, EventoJogo, Escolha, Item, Magia, Atributos, Missao, MissaoRank, Raridade, OpcaoViagem } from './types';
import { RACAS, CLASSES, ATRIBUTOS_INICIAIS } from './constants';
import {
    gerarMonstro, gerarContextoMundo, gerarEventoNarrativo,
    gerarMissoes
} from './services/geminiService';
import { getItensLoja, getOpcoesViagem, getMagiasDisponiveis, getContextoMundo } from './services/localService';
import {
    Shield, Sword, Zap, Heart,
    ChevronRight, Skull, RefreshCcw, ScrollText,
    BookOpen, Swords, ShoppingBag, X, PackageOpen,
    Wand2, Map as MapIcon, Coffee, Castle,
    Award, Target, Hammer, ArrowUpCircle, ShoppingCart, Trash2, Plus, Users,
    Layers, User, GraduationCap, Sun, Moon, AlertTriangle, Trophy, Trash, Tent, Compass
} from 'lucide-react';

const RANKS: MissaoRank[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
const RARIDADES: Raridade[] = ['Comum', 'Raro', 'Épico', 'Lendário'];
const SAVE_KEY = 'CRONICAS_DO_INFINITO_SAVE_V2';

const App: React.FC = () => {
    const [estadoJogo, setEstadoJogo] = useState<'criacao' | 'jogando'>('criacao');
    const [jogador, setJogador] = useState<Jogador | null>(null);
    const [monstros, setMonstros] = useState<Monstro[]>([]);
    const [indiceAlvo, setIndiceAlvo] = useState<number>(0);
    const [eventoAtivo, setEventoAtivo] = useState<EventoJogo | null>(null);
    const [itensLoja, setItensLoja] = useState<Item[] | null>(null);
    const [magiasDisponiveis, setMagiasDisponiveis] = useState<Magia[] | null>(null);
    const [carrinho, setCarrinho] = useState<Item[]>([]);
    const [carrinhoAcademia, setCarrinhoAcademia] = useState<Magia[]>([]);
    const [opcoesViagem, setOpcoesViagem] = useState<OpcaoViagem[] | null>(null);
    const [missoesGuilda, setMissoesGuilda] = useState<Missao[] | null>(null);
    const [mundo, setMundo] = useState<ContextoMundo | null>(null);
    const [logs, setLogs] = useState<LogJogo[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [modalAtivo, setModalAtivo] = useState<'inventario' | 'grimorio' | 'loja' | 'viagem' | 'guilda' | 'forja' | 'academia' | null>(null);
    const [isNoite, setIsNoite] = useState(false);

    const [dadosCriacao, setDadosCriacao] = useState({
        nome: '',
        raca: 'Humano' as RacaTipo,
        classe: 'Guerreiro' as ClasseTipo
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    const isAssentamento = useMemo(() => {
        if (!mundo) return true;
        const bioma = mundo.bioma.toLowerCase();
        const keywords = ['cidade', 'vila', 'porto', 'cidadela', 'fortaleza', 'posto', 'assentamento', 'reino', 'capital'];
        return keywords.some(kw => bioma.includes(kw));
    }, [mundo]);

    useEffect(() => {
        const salvo = localStorage.getItem(SAVE_KEY);
        if (salvo) {
            try {
                const parsed = JSON.parse(salvo);
                if (parsed.jogador) setJogador(parsed.jogador);
                if (parsed.mundo) setMundo(parsed.mundo);
                if (parsed.logs) setLogs(parsed.logs);
                if (parsed.isNoite !== undefined) setIsNoite(parsed.isNoite);
                if (parsed.estadoJogo) setEstadoJogo(parsed.estadoJogo);
            } catch (e) {
                console.error("Falha ao carregar save:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (jogador) {
            const paraSalvar = {
                jogador,
                mundo,
                logs: logs.slice(-50),
                isNoite,
                estadoJogo
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(paraSalvar));
        }
    }, [jogador, mundo, logs, isNoite, estadoJogo]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = useCallback((mensagem: string, tipo: LogJogo['tipo'] = 'info') => {
        setLogs(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), mensagem, tipo }]);
    }, []);

    const resetarJogo = () => {
        if (window.confirm("Deseja realmente apagar seu progresso e reiniciar a jornada?")) {
            localStorage.removeItem(SAVE_KEY);
            window.location.reload();
        }
    };

    const avancarTempo = useCallback(() => {
        setIsNoite(prev => !prev);
        addLog(isNoite ? "🌅 O sol nasce no horizonte." : "🌙 As sombras se alongam. A noite caiu.", 'info');
    }, [isNoite, addLog]);

    const atributosTotais = useMemo(() => {
        if (!jogador) return ATRIBUTOS_INICIAIS;
        const attrs = { ...jogador.atributos };
        const itens = [jogador.equipamento.arma, jogador.equipamento.armadura, jogador.equipamento.acessorio];
        itens.forEach(item => {
            if (item?.bonus) {
                Object.entries(item.bonus).forEach(([k, v]) => { if (v) attrs[k as keyof Atributos] = (attrs[k as keyof Atributos] || 0) + v; });
            }
        });
        return attrs;
    }, [jogador]);

    const progressoGuilda = useMemo(() => {
        if (!jogador) return { percent: 0, next: 5, remaining: 5, isMax: false };
        const idxRankAtual = RANKS.indexOf(jogador.rankGuilda);
        const alvoMissoes = (idxRankAtual + 1) * 5;
        const missoesNesteNivel = jogador.missoesCompletas - (idxRankAtual * 5);
        const percent = (missoesNesteNivel / 5) * 100;
        const restante = alvoMissoes - jogador.missoesCompletas;
        return {
            percent: idxRankAtual === RANKS.length - 1 ? 100 : percent,
            next: alvoMissoes,
            remaining: Math.max(0, restante),
            isMax: idxRankAtual === RANKS.length - 1
        };
    }, [jogador]);

    const rolarDado = () => Math.floor(Math.random() * 6) + 1;

    const initMundo = async (local: string) => {
        if (carregando) return;
        setCarregando(true);
        try {
            let contexto = getContextoMundo(local);
            if (!contexto) {
                contexto = await gerarContextoMundo(local);
            }
            setMundo(contexto);
            addLog(`Exploração: ${local} (${contexto?.reinoNome}).`, 'info');
        } catch (error) {
            addLog("Caminho obscuro...", 'info');
        } finally {
            setCarregando(false);
        }
    };

    const iniciarJogo = async () => {
        if (!dadosCriacao.nome.trim() || carregando) return;
        const racaSelecionada = RACAS[dadosCriacao.raca];
        const attrs = { ...ATRIBUTOS_INICIAIS };
        Object.entries(racaSelecionada.bonus).forEach(([stat, val]) => { attrs[stat as keyof Atributos] += val as number; });

        const jogadorInicial: Jogador = {
            nome: dadosCriacao.nome,
            raca: dadosCriacao.raca,
            classe: dadosCriacao.classe,
            nivel: 1, xp: 0, proximoNivelXp: 100,
            hp: 10 + (attrs.resistencia * 5), maxHp: 10 + (attrs.resistencia * 5),
            mana: 10 + (attrs.resistencia * 5), maxMana: 10 + (attrs.resistencia * 5),
            atributos: attrs, ouro: 1000, localizacao: 'Cidadela da Forja',
            inventario: [], magias: [], equipamento: { arma: null, armadura: null, acessorio: null },
            rankGuilda: 'F', missoesCompletas: 0, missaoAtiva: null
        };

        setJogador(jogadorInicial);
        setEstadoJogo('jogando');
        await initMundo('Cidadela da Forja');
    };

    const lancarMagia = (magia: Magia) => {
        if (!jogador || monstros.length === 0) return;
        if (jogador.mana < magia.custoMana) {
            addLog("PM insuficiente!", 'info');
            return;
        }

        addLog(`✨ ${magia.nome}!`, 'magia');

        let novoMana = jogador.mana - magia.custoMana;
        let novoHp = jogador.hp;
        let monstrosAtualizados = [...monstros];

        if (magia.tipo === 'Ataque') {
            const poder = magia.poder + atributosTotais.poderDeFogo;
            if (magia.alvo === 'Todos') {
                monstrosAtualizados = monstrosAtualizados.map(m => {
                    const dano = Math.max(1, poder + atributosTotais.habilidade + rolarDado() - (m.armadura + rolarDado()));
                    addLog(`💥 Dano em área: ${dano} ao ${m.nome}.`, 'combate');
                    return { ...m, hp: Math.max(0, m.hp - dano) };
                });
            } else {
                const monstroAtual = monstros[indiceAlvo];
                const dano = Math.max(1, poder + atributosTotais.habilidade + rolarDado() - (monstroAtual.armadura + rolarDado()));
                monstrosAtualizados[indiceAlvo] = { ...monstroAtual, hp: Math.max(0, monstroAtual.hp - dano) };
                addLog(`💥 Dano direto: ${dano} ao ${monstroAtual.nome}.`, 'combate');
            }
        } else if (magia.tipo === 'Cura') {
            const cura = magia.poder + atributosTotais.poderDeFogo + (magia.alvo === 'Todos' ? 5 : 0);
            novoHp = Math.min(jogador.maxHp, jogador.hp + cura);
            addLog(`💚 Regeneração: +${cura} PV.`, 'loot');
        }

        setJogador({ ...jogador, mana: novoMana, hp: novoHp });
        processarResultadoCombate(monstrosAtualizados, { ...jogador, mana: novoMana, hp: novoHp });
        setModalAtivo(null);
    };

    const processarResultadoCombate = (monstrosAtuais: Monstro[], jogadorAtual: Jogador) => {
        const vivos = monstrosAtuais.filter(m => m.hp > 0);
        const mortos = monstrosAtuais.filter(m => m.hp <= 0);

        mortos.forEach(m => vitoria(m, false));

        if (vivos.length === 0) {
            setMonstros([]);
            setIndiceAlvo(0);
            verificarMissao(jogadorAtual);
            avancarTempo();
        } else {
            setMonstros(vivos);
            if (indiceAlvo >= vivos.length) setIndiceAlvo(0);
            turnoMonstro(vivos, jogadorAtual);
        }
    };

    const turnoMonstro = (monstrosAtuais: Monstro[], p: Jogador) => {
        let hpAtual = p.hp;
        addLog(`⚠️ Inimigos atacando!`, 'info');
        monstrosAtuais.forEach(m => {
            if (hpAtual <= 0) return;
            const mFA = m.dano + m.habilidade + rolarDado();
            const pFD = atributosTotais.habilidade + atributosTotais.armadura + rolarDado();
            const danoP = Math.max(1, mFA - pFD);
            hpAtual = Math.max(0, hpAtual - danoP);
            addLog(`⚔️ ${m.nome}: -${danoP} PV.`, 'combate');
        });
        setJogador({ ...p, hp: hpAtual });
        if (hpAtual <= 0) {
            addLog("Você foi derrotado...", 'info');
            setJogador({ ...p, hp: Math.floor(p.maxHp * 0.3), mana: 0, ouro: Math.floor(p.ouro * 0.5), missaoAtiva: null });
            setMonstros([]);
            setIndiceAlvo(0);
            avancarTempo();
        }
    };

    const vitoria = (m: Monstro, checkMissao: boolean = true) => {
        const xp = 50 + (m.nivel * 20);
        const ouro = (rolarDado() * 10) + (m.raridade === 'Chefe' ? 150 : 0);
        addLog(`💀 ${m.nome} derrotado! +${xp} XP.`, 'loot');
        if (checkMissao) verificarMissao(jogador!);
        handleLevelUp(xp, ouro);
    };

    const verificarMissao = (jogadorAtual: Jogador) => {
        if (jogadorAtual.missaoAtiva && jogadorAtual.missaoAtiva.tipoAlvo === 'Monstro') {
            addLog(`🎯 Objetivo Concluído!`, 'nivel');
            const recompensaOuro = jogadorAtual.missaoAtiva.recompensaOuro;
            const recompensaXp = jogadorAtual.missaoAtiva.recompensaXp;
            setJogador(prev => {
                if (!prev) return null;
                const p = { ...prev };
                p.missoesCompletas += 1;
                p.missaoAtiva = null;
                const idxRankAtual = RANKS.indexOf(p.rankGuilda);
                if (p.missoesCompletas >= (idxRankAtual + 1) * 5 && idxRankAtual < RANKS.length - 1) {
                    p.rankGuilda = RANKS[idxRankAtual + 1];
                    addLog(`🏆 Rank de Guilda: ${p.rankGuilda}!`, 'nivel');
                }
                return p;
            });
            handleLevelUp(recompensaXp, recompensaOuro);
        }
    };

    const handleAtaque = () => {
        if (!jogador || monstros.length === 0 || carregando) return;
        const monstroAtual = monstros[indiceAlvo];
        const pAttr = jogador.classe === 'Mago' || jogador.classe === 'Necromante' ? atributosTotais.poderDeFogo : atributosTotais.forca;
        const FA = pAttr + atributosTotais.habilidade + rolarDado();
        const FD_M = monstroAtual.armadura + monstroAtual.habilidade + rolarDado();
        const danoM = Math.max(1, FA - FD_M);
        addLog(`🎲 Ataque: FA ${FA} vs FD ${FD_M}. Dano: ${danoM}`, 'combate');
        const monstrosAtualizados = [...monstros];
        monstrosAtualizados[indiceAlvo] = { ...monstroAtual, hp: Math.max(0, monstroAtual.hp - danoM) };
        processarResultadoCombate(monstrosAtualizados, jogador);
    };

    const handleLevelUp = (xp: number, ouro: number, jogadorExistente?: Jogador) => {
        setJogador(prev => {
            const p = jogadorExistente || prev;
            if (!p) return null;
            let nxp = p.xp + xp;
            let nlvl = p.nivel;
            let nprox = p.proximoNivelXp;
            let nattrs = { ...p.atributos };
            while (nxp >= nprox) {
                nxp -= nprox; nlvl++; nprox = Math.floor(nprox * 1.8);
                nattrs.forca += 1; nattrs.habilidade += 1; nattrs.resistencia += 1; nattrs.armadura += 1; nattrs.poderDeFogo += 1;
                addLog(`Subiu para o Nível ${nlvl}!`, 'nivel');
            }
            const maxH = 10 + (nattrs.resistencia * 5);
            const maxM = 10 + (nattrs.resistencia * 5);
            return { ...p, nivel: nlvl, xp: nxp, proximoNivelXp: nprox, atributos: nattrs, ouro: p.ouro + ouro, maxHp: maxH, hp: Math.min(p.hp, maxH), maxMana: maxM, mana: Math.min(p.mana, maxM) };
        });
    };

    const handleEscolha = (escolha: Escolha) => {
        if (!jogador || carregando) return;
        addLog(escolha.consequencia, 'evento');
        setJogador(prev => {
            if (!prev) return null;
            const p = { ...prev, atributos: { ...prev.atributos } };
            const impacto = escolha.impacto;
            if (impacto.hp) p.hp = Math.max(0, Math.min(p.maxHp, p.hp + impacto.hp));
            if (impacto.mana) p.mana = Math.max(0, Math.min(p.maxMana, p.mana + impacto.mana));
            if (impacto.ouro) p.ouro = Math.max(0, p.ouro + impacto.ouro);
            if (impacto.magiaAprendida) p.magias = [...p.magias, { ...impacto.magiaAprendida, id: Math.random().toString(36).substr(2, 9) }];
            if (p.missaoAtiva && p.missaoAtiva.tipoAlvo === 'Evento') p.missaoAtiva = null;
            return p;
        });
        if (escolha.impacto.xp) handleLevelUp(escolha.impacto.xp, 0);
        setEventoAtivo(null);
    };

    const abrirAcademia = async () => {
        if (carregando) return;
        setCarregando(true);
        setCarrinhoAcademia([]);
        try {
            const magias = await getMagiasDisponiveis(jogador!.nivel, jogador!.classe);
            setMagiasDisponiveis(magias);
            setModalAtivo('academia');
        } catch (error) {
            addLog("Academia indisponível.", 'info');
        } finally {
            setCarregando(false);
        }
    };

    const addCarrinhoAcademia = (magia: Magia) => setCarrinhoAcademia(prev => [...prev, magia]);
    const removeCarrinhoAcademia = (index: number) => setCarrinhoAcademia(prev => prev.filter((_, i) => i !== index));

    const comprarTreino = () => {
        if (!jogador) return;
        const custoTotal = carrinhoAcademia.reduce((sum, m) => sum + (m.preco || 0), 0);
        if (jogador.ouro < custoTotal) {
            addLog("Ouro insuficiente para o treinamento!", 'info');
            return;
        }
        setJogador(prev => ({
            ...prev!,
            ouro: prev!.ouro - custoTotal,
            magias: [...prev!.magias, ...carrinhoAcademia]
        }));
        addLog(`📖 Treinamento concluído.`, 'nivel');
        setCarrinhoAcademia([]);
        setModalAtivo(null);
    };

    const abrirMapa = async () => {
        if (carregando) return;
        setCarregando(true);
        setOpcoesViagem([]);
        setModalAtivo('viagem');
        try {
            const opcoes = await getOpcoesViagem(jogador!.localizacao, jogador!.nivel);
            setOpcoesViagem(opcoes);
        } catch (error) {
            addLog("Mapa indisponível.", 'info');
        } finally {
            setCarregando(false);
        }
    };

    const abrirGuilda = async () => {
        if (carregando) return;
        setCarregando(true);
        setMissoesGuilda([]);
        setModalAtivo('guilda');
        try {
            const missoes = await gerarMissoes(jogador!.rankGuilda, jogador!.localizacao);
            setMissoesGuilda(missoes);
        } catch (error) {
            addLog("Mural vazio.", 'info');
        } finally {
            setCarregando(false);
        }
    };

    const visitarLoja = async () => {
        if (carregando) return;
        setCarregando(true);
        setCarrinho([]);
        try {
            const itens = await getItensLoja(jogador!.nivel, jogador!.localizacao);
            setItensLoja(itens);
            setModalAtivo('loja');
        } catch (error) {
            addLog("Lojas fechadas.", 'info');
        } finally {
            setCarregando(false);
        }
    };

    const addCarrinho = (item: Item) => setCarrinho(prev => [...prev, item]);
    const removeCarrinho = (index: number) => setCarrinho(prev => prev.filter((_, i) => i !== index));

    const comprarCarrinho = () => {
        if (!jogador) return;
        const custoTotal = carrinho.reduce((sum, item) => sum + item.preco, 0);
        if (jogador.ouro < custoTotal) {
            addLog("Ouro insuficiente!", 'info');
            return;
        }
        setJogador(prev => ({
            ...prev!,
            ouro: prev!.ouro - custoTotal,
            inventario: [...prev!.inventario, ...carrinho.map(c => ({ ...c, id: Math.random().toString(36).substr(2, 9) }))]
        }));
        addLog(`💰 Compra realizada.`, 'loja');
        setCarrinho([]);
        setModalAtivo(null);
    };

    const viajarPara = async (dest: OpcaoViagem) => {
        if (!jogador || carregando) return;
        if (jogador.ouro < 20) {
            addLog("Gold insuficiente!", 'info');
            return;
        }
        setJogador({ ...jogador, localizacao: dest.nome, ouro: jogador.ouro - 20 });
        setModalAtivo(null);
        await initMundo(dest.nome);
        avancarTempo();
        if (Math.random() > 0.4) await encontrarMonstro();
    };

    const encontrarMonstro = async () => {
        if (!jogador) return;
        setCarregando(true);
        setModalAtivo(null);
        setEventoAtivo(null);
        setMonstros([]);
        try {
            const rollCount = Math.random();
            let count = rollCount > 0.95 ? 5 : rollCount > 0.85 ? 3 : rollCount > 0.6 ? 2 : 1;
            const novosMonstros: Monstro[] = [];
            for (let i = 0; i < count; i++) {
                const m = await gerarMonstro(jogador.nivel, mundo?.bioma || "Ermos");
                novosMonstros.push(m);
            }
            setMonstros(novosMonstros);
            setIndiceAlvo(0);
            addLog(`🚨 Inimigos avistados: ${count} oponente(s)!`, 'combate');
        } catch (error) {
            addLog("Área tranquila.", 'info');
        } finally {
            setCarregando(false);
        }
    };

    const interagirNPC = async (tipo: string) => {
        if (!jogador) return;
        setCarregando(true);
        setModalAtivo(null);
        setMonstros([]);
        setEventoAtivo(null);
        try {
            const evento = await gerarEventoNarrativo(jogador.nivel, mundo?.bioma || "Cidade", `${jogador.localizacao} (${tipo})`);
            if (!evento.opcoes) evento.opcoes = [];

            if (tipo === 'Taberna' || tipo === 'Acampamento') {
                const podeDormir = isNoite || (jogador.hp < jogador.maxHp * 0.4);
                if (podeDormir) {
                    evento.opcoes.unshift({
                        texto: tipo === 'Taberna' ? "Dormir (50 💰)" : "Descansar (Risco de Emboscada)",
                        consequencia: "Você recuperou suas forças sob o céu estrelado.",
                        impacto: { ouro: tipo === 'Taberna' ? -50 : 0, hp: 999, mana: 999 }
                    });
                    if (isNoite) avancarTempo();
                    if (tipo === 'Acampamento' && Math.random() > 0.7) {
                        setTimeout(() => encontrarMonstro(), 500);
                    }
                } else {
                    evento.descricao += tipo === 'Taberna'
                        ? " O estalajadeiro avisa que quartos só estão disponíveis à noite ou para os feridos."
                        : " Você ainda está desperto demais para montar acampamento agora.";
                }
            }

            if (!evento.opcoes.some(c => c.texto.toLowerCase().includes("sair") || c.texto.toLowerCase().includes("continuar"))) {
                evento.opcoes.push({ texto: "Sair", consequencia: "Você segue adiante.", impacto: {} });
            }

            setEventoAtivo(evento);
        } catch (error) {
            addLog("O destino é incerto.", 'info');
        } finally {
            setCarregando(false);
        }
    };

    const aceitarMissao = (missao: Missao) => {
        if (!jogador) return;
        setJogador({ ...jogador, missaoAtiva: missao });
        addLog(`📜 Aceito: ${missao.titulo}.`, 'evento');
        setModalAtivo(null);

        setTimeout(() => {
            if (missao.tipoAlvo === 'Monstro') encontrarMonstro();
            else interagirNPC('Missão');
        }, 100);
    };

    const upgradeItem = (item: Item) => {
        if (!jogador) return;
        const req = getRequisitosUpgrade(item.raridade);
        if (!req) return;
        const matIdx = jogador.inventario.findIndex(i => i.tipo === 'Material' && i.raridade === req.materialRaridade);
        if (matIdx === -1 || jogador.ouro < req.ouro) {
            addLog("Recursos insuficientes!", 'info');
            return;
        }
        const nextRarity = RARIDADES[RARIDADES.indexOf(item.raridade) + 1];
        const newBonus = { ...item.bonus };
        Object.keys(newBonus).forEach(k => {
            const key = k as keyof Atributos;
            newBonus[key] = (newBonus[key] || 0) + 2;
        });
        setJogador(prev => {
            const newInv = [...prev!.inventario];
            newInv.splice(matIdx, 1);
            const itemIdx = newInv.findIndex(i => i.id === item.id);
            newInv[itemIdx] = { ...item, raridade: nextRarity, bonus: newBonus };
            return { ...prev!, ouro: prev!.ouro - req.ouro, inventario: newInv };
        });
        addLog(`🔨 Upgrade: ${item.nome}!`, 'loot');
        setModalAtivo(null);
    };

    const getRequisitosUpgrade = (raridade: Raridade) => {
        switch (raridade) {
            case 'Comum': return { ouro: 200, materialRaridade: 'Raro' };
            case 'Raro': return { ouro: 500, materialRaridade: 'Épico' };
            case 'Épico': return { ouro: 1500, materialRaridade: 'Lendário' };
            default: return null;
        }
    };

    const getCorRaridade = (raridade: string) => {
        switch (raridade) {
            case 'Lendário': return 'text-orange-400 border-orange-500/40 bg-orange-950/10';
            case 'Épico': return 'text-purple-400 border-purple-500/40 bg-purple-950/10';
            case 'Raro': return 'text-blue-400 border-blue-500/40 bg-blue-950/10';
            default: return 'text-zinc-300 border-zinc-700 bg-zinc-800/30';
        }
    };

    const getCorRank = (rank: MissaoRank) => {
        switch (rank) {
            case 'S': return 'text-red-500'; case 'A': return 'text-orange-500';
            case 'B': return 'text-purple-500'; case 'C': return 'text-blue-500';
            case 'D': return 'text-green-500'; default: return 'text-zinc-400';
        }
    };

    if (estadoJogo === 'criacao') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000')] bg-cover">
                <div className="absolute inset-0 bg-black/85"></div>
                <div className="relative z-50 w-full max-w-lg glass-card ornate-border rounded-2xl p-8 text-center animate-slide">
                    <h1 className="text-3xl text-amber-500 mb-2 tracking-widest font-fantasy">Crônicas do Infinito</h1>
                    <p className="text-zinc-500 mb-8 text-sm italic">Aventura Powered by 3D&T</p>
                    <div className="space-y-6 text-left">
                        <div>
                            <label className="text-[10px] uppercase font-black text-amber-500/50 mb-2 block tracking-widest">Nome do Herói</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-lg font-medieval outline-none focus:border-amber-600 transition-all text-white" value={dadosCriacao.nome} onChange={e => setDadosCriacao({ ...dadosCriacao, nome: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] uppercase font-black text-amber-500/50 mb-2 block tracking-widest">Raça</label>
                                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                                    {Object.keys(RACAS).map(r => (
                                        <button key={r} onClick={() => setDadosCriacao({ ...dadosCriacao, raca: r as RacaTipo })} className={`p-2 rounded-lg border text-xs font-bold transition-all ${dadosCriacao.raca === r ? 'bg-amber-600 border-amber-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>{r}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-black text-amber-500/50 mb-2 block tracking-widest">Classe</label>
                                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                                    {Object.keys(CLASSES).map(c => (
                                        <button key={c} onClick={() => setDadosCriacao({ ...dadosCriacao, classe: c as ClasseTipo })} className={`p-2 rounded-lg border text-xs font-bold transition-all ${dadosCriacao.classe === c ? 'bg-amber-600 border-amber-500 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>{c}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-zinc-400 italic bg-zinc-900/50 p-3 rounded-lg border border-white/5">
                            <span className="text-amber-500 font-bold block mb-1">Bônus Racial:</span>
                            {Object.entries(RACAS[dadosCriacao.raca].bonus).map(([k, v]) => `${k.toUpperCase()} +${v}`).join(', ')}
                        </div>
                        <button onClick={iniciarJogo} disabled={!dadosCriacao.nome || carregando} className="w-full bg-amber-600 hover:bg-amber-500 text-black p-4 rounded-xl font-black uppercase text-sm shadow-xl transition-all cursor-pointer disabled:opacity-50">Começar Jornada</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-screen w-full flex flex-col md:flex-row p-4 gap-4 overflow-hidden relative transition-colors duration-1000 ${isNoite ? 'bg-[#010105]' : 'bg-[#020202]'}`}>

            {/* Sidebar */}
            <div className="w-full md:w-72 flex flex-col gap-4 shrink-0 overflow-y-auto scroll-hide">
                <div className="glass-card ornate-border rounded-2xl p-6 relative flex-1 flex flex-col">
                    {/* ... (UI similar to before but with Portuguese vars) */}
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-2 bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">{CLASSES[jogador!.classe].icon}</div>
                        <h2 className="text-xl font-fantasy text-amber-100 mb-1">{jogador?.nome}</h2>
                        <div className="flex justify-center gap-2 items-center text-[10px] text-amber-50 font-black tracking-widest uppercase opacity-70">
                            <span>Nvl {jogador?.nivel}</span>
                            <span className={`font-black ${getCorRank(jogador!.rankGuilda)}`}>Rank {jogador!.rankGuilda}</span>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        {/* Stats Display */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { i: <Sword size={14} />, v: atributosTotais.forca, c: 'text-red-500', t: 'FOR' },
                                { i: <Zap size={14} />, v: atributosTotais.habilidade, c: 'text-yellow-500', t: 'HAB' },
                                { i: <Heart size={14} />, v: atributosTotais.resistencia, c: 'text-green-500', t: 'RES' },
                                { i: <Shield size={14} />, v: atributosTotais.armadura, c: 'text-blue-500', t: 'ARM' },
                                { i: <Target size={14} />, v: atributosTotais.poderDeFogo, c: 'text-orange-500', t: 'PDF' },
                            ].map((s, i) => (
                                <div key={i} className={`flex items-center gap-2 bg-zinc-900/40 p-2 rounded-xl border border-white/5 justify-center ${i === 4 ? 'col-span-2' : ''}`} title={s.t}>
                                    <span className={`${s.c} opacity-70`}>{s.i}</span>
                                    <span className="text-sm font-black text-amber-50">{s.v}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-center text-xl font-medieval text-amber-400">💰 {jogador?.ouro}</div>

                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setModalAtivo('inventario')} className="action-btn p-3 bg-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 flex flex-col items-center gap-1 cursor-pointer"><PackageOpen size={16} /> Mochila</button>
                            <button onClick={() => setModalAtivo('grimorio')} className="action-btn p-3 bg-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 flex flex-col items-center gap-1 cursor-pointer"><BookOpen size={16} /> Magias</button>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
                        <button onClick={resetarJogo} className="w-full flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors">
                            <Trash size={10} /> Reiniciar Jornada
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden relative">
                <div className="glass-card ornate-border rounded-2xl p-6 shrink-0 relative overflow-hidden animate-slide">
                    <div className="absolute top-0 right-0 p-4 text-amber-500/5">
                        {isAssentamento ? <Castle size={80} /> : <Tent size={80} />}
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-2xl font-fantasy text-amber-50 mb-1">{jogador?.localizacao}</h1>
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isAssentamento ? 'bg-blue-500 shadow-[0_0_5px_blue]' : 'bg-green-500 shadow-[0_0_5px_green]'}`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{mundo?.bioma || 'Terras Desconhecidas'}</span>
                        </div>
                        <p className="text-sm text-zinc-400 italic opacity-80 line-clamp-1">{mundo?.descricao}</p>
                    </div>
                </div>

                <div className={`flex-1 glass-card ornate-border rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-1000 ${isNoite ? 'bg-blue-900/5' : 'bg-black/40'}`}>
                    {carregando ? (
                        <div className="flex flex-col items-center gap-4">
                            <RefreshCcw className="animate-spin text-amber-600" size={40} />
                            <p className="text-xs text-amber-500 font-black uppercase tracking-widest">Explorando...</p>
                        </div>
                    ) : eventoAtivo ? (
                        <div className="w-full max-w-2xl text-center animate-slide">
                            <h3 className="text-xl font-fantasy text-amber-500 mb-6">{eventoAtivo.titulo}</h3>
                            <p className="text-lg text-zinc-200 mb-10 leading-relaxed italic">"{eventoAtivo.descricao}"</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {eventoAtivo.opcoes?.map((c, i) => (
                                    <button key={i} onClick={() => handleEscolha(c)} className="p-4 bg-zinc-900/80 hover:bg-amber-900/20 border border-amber-500/10 hover:border-amber-500/40 rounded-xl text-left transition-all group flex items-start gap-3 cursor-pointer">
                                        <div className="bg-amber-600 text-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</div>
                                        <div className="text-xs font-bold text-zinc-300 group-hover:text-amber-100">{c.texto}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : monstros.length > 0 ? (
                        <div className="w-full h-full flex flex-col items-center animate-slide">
                            <div className="flex items-center gap-2 mb-6 text-amber-500 opacity-50">
                                <Users size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Combate ({monstros.length})</span>
                            </div>
                            <div className="flex-1 flex flex-wrap justify-center content-center gap-6 w-full max-w-4xl px-4">
                                {monstros.map((m, idx) => (
                                    <div key={idx} onClick={() => setIndiceAlvo(idx)} className={`relative w-48 p-5 glass-card rounded-2xl border transition-all cursor-pointer group hover:scale-105 ${indiceAlvo === idx ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-white/5 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                                        {indiceAlvo === idx && <div className="absolute -top-3 -right-3 bg-amber-600 text-black p-1 rounded-full shadow-lg z-20"><Target size={16} /></div>}
                                        <div className="text-[8px] font-black uppercase text-red-500 mb-1">{m.familia}</div>
                                        <h4 className="text-sm font-fantasy text-zinc-100 mb-4 line-clamp-1">{m.nome}</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[8px] font-black"><span className="text-red-500">PV</span><span className="text-zinc-400">{Math.ceil(m.hp)}/{m.maxHp}</span></div>
                                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                                                <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${(m.hp / m.maxHp) * 100}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex gap-4 w-full max-w-md">
                                <button onClick={handleAtaque} className="flex-1 bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-xl">
                                    <Swords size={20} />
                                    <div className="flex flex-col items-start leading-none uppercase text-[10px]"><span>Atacar</span><span className="font-fantasy">Alvo</span></div>
                                </button>
                                <button onClick={() => setModalAtivo('grimorio')} className="flex-1 bg-blue-700 hover:bg-blue-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-xl">
                                    <Wand2 size={20} />
                                    <div className="flex flex-col items-start leading-none uppercase text-[10px]"><span>Usar</span><span className="font-fantasy">Habilidade</span></div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
                            <button onClick={() => interagirNPC(isAssentamento ? 'Taberna' : 'Acampamento')} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer">
                                {isAssentamento ? <Coffee size={24} className="text-orange-400 opacity-60" /> : <Tent size={24} className="text-green-500 opacity-60" />}
                                <div className="text-xs font-bold uppercase">{isAssentamento ? 'Taberna' : 'Acampar'}</div>
                            </button>

                            {isAssentamento ? (
                                <>
                                    <button onClick={visitarLoja} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border-amber-500/20"><ShoppingBag size={24} className="text-red-500 opacity-60" /><div className="text-xs font-bold uppercase">Mercado</div></button>
                                    <button onClick={abrirAcademia} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border-blue-500/20"><GraduationCap size={24} className="text-blue-400 opacity-60" /><div className="text-xs font-bold uppercase">Academia</div></button>
                                    <button onClick={() => setModalAtivo('forja')} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border-zinc-500/20"><Hammer size={24} className="text-amber-500 opacity-60" /><div className="text-xs font-bold uppercase">Forja</div></button>
                                    <button onClick={abrirGuilda} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border-amber-500/10"><Award size={24} className="text-amber-500 opacity-60" /><div className="text-xs font-bold uppercase">Guilda</div></button>
                                    <button onClick={encontrarMonstro} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border-red-900/10"><Skull size={24} className="text-red-600 opacity-60" /><div className="text-xs font-bold uppercase">Sair da Cidade</div></button>
                                </>
                            ) : (
                                <>
                                    <button onClick={encontrarMonstro} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border-red-500/20 col-span-2">
                                        <Compass size={24} className="text-red-400 opacity-60" />
                                        <div className="text-xs font-bold uppercase">Explorar Arredores</div>
                                    </button>
                                </>
                            )}

                            <button onClick={abrirMapa} className="action-btn bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-2 cursor-pointer border-blue-900/10 col-span-full">
                                <MapIcon size={24} className="text-blue-500 opacity-60" />
                                <div className="text-xs font-bold uppercase">Mapa de Viagem</div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Game Log */}
                <div className="h-48 glass-card ornate-border rounded-2xl p-4 overflow-hidden flex flex-col">
                    <h5 className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">Registro de Aventura</h5>
                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1.5 scroll-hide text-[11px]">
                        {logs.map(log => (
                            <div key={log.id} className={`p-2 rounded-lg border-l-2 bg-black/20 animate-slide ${log.tipo === 'combate' ? 'border-red-500/50 text-red-200' :
                                    log.tipo === 'loot' ? 'border-amber-500/50 text-amber-200' :
                                        log.tipo === 'nivel' ? 'border-purple-500/50 text-purple-200' :
                                            log.tipo === 'evento' ? 'border-blue-500/50 text-blue-200' :
                                                log.tipo === 'magia' ? 'border-cyan-500/50 text-cyan-200' :
                                                    'border-zinc-500/50 text-zinc-400'
                                }`}>
                                {log.mensagem}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals - Simplified for brevity */}
            {modalAtivo && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-zinc-900 w-full max-w-2xl max-h-[80vh] rounded-2xl border border-amber-500/20 flex flex-col overflow-hidden relative">
                        <button onClick={() => setModalAtivo(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X /></button>
                        <div className="p-6 border-b border-white/5 bg-black/40">
                            <h2 className="text-xl font-fantasy text-amber-500">
                                {modalAtivo === 'inventario' && 'Inventário'}
                                {modalAtivo === 'loja' && 'Mercado'}
                                {modalAtivo === 'viagem' && 'Mapa de Viagem'}
                                {modalAtivo === 'guilda' && 'Guilda de Aventureiros'}
                                {modalAtivo === 'academia' && 'Academia Arcana'}
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 scroll-hide">
                            {/* Implementation for list views (Inventory, Shop, Maps) would go here matching the data structure */}
                            {modalAtivo === 'viagem' && opcoesViagem?.map((op, i) => (
                                <div key={i} onClick={() => viajarPara(op)} className="p-4 bg-black/20 border border-white/5 rounded-xl mb-2 cursor-pointer hover:border-amber-500/50">
                                    <h4 className="font-bold text-amber-100">{op.nome}</h4>
                                    <p className="text-xs text-zinc-500">{op.descricao}</p>
                                    <span className="text-[10px] uppercase font-black text-red-500">Perigo: {op.nivelPerigo}</span>
                                </div>
                            ))}
                            {/* ... other modals code */}
                            {modalAtivo === 'loja' && itensLoja?.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg mb-2">
                                    <div>
                                        <div className={`text-sm font-bold ${getCorRaridade(item.raridade).split(' ')[0]}`}>{item.nome}</div>
                                        <div className="text-[10px] text-zinc-500">{item.descricao}</div>
                                    </div>
                                    <button onClick={() => addCarrinho(item)} className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 text-green-500">{item.preco} 💰</button>
                                </div>
                            ))}
                            {modalAtivo === 'loja' && carrinho.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <button onClick={comprarCarrinho} className="w-full bg-green-600 p-3 rounded-xl font-bold text-black uppercase">Comprar ({carrinho.reduce((a, b) => a + b.preco, 0)} 💰)</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default App;
