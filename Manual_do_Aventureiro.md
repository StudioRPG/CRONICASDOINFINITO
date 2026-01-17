# 📖 Glossário do Jogo - Crônicas de Aetheria

Este documento lista todo o conteúdo atualmente implementado no jogo.

### 🐾 Companheiros (Pets)
Agora você pode comprar Pets na Loja!
- **Cão de Caça:** Causa dano extra.
- **Fada da Luz:** Cura você todo turno.
- **Dragãozinho:** Dano massivo!
Eles agem automaticamente no seu turno.

### 🗝️ Masmorras
Locais perigosos com múltiplos andares e Chefes Épicos.
- Requer nível mínimo.
- Enfrente salas consecutivas sem descanso total (cura pequena entre salas).
- Derrote o Chefe para ganhar muito OURO e itens raros.
- Se fugir, você sai da masmorra e perde o progresso da run.

## 🛡️ Classes e Evoluções

| Classe Básica | Ícone | Descrição | Evolução (Nvl 20) | Ícone Supremo |
| :--- | :---: | :--- | :--- | :---: |
| **Guerreiro** | ⚔️ | Combate corpo a corpo. | **Cavaleiro** | 🏇 |
| **Mago** | 🪄 | Artes arcanas. | **Arquimago** | 🔮 |
| **Ladino** | 🗡️ | Furtividade e precisão. | **Assassino** | 🌑 |
| **Paladino** | 🛡️ | Guerreiros santos. | **Cruzado** | ✝️ |
| **Necromante** | 💀 | Magia da morte. | **Lich** | ☠️ |
| **Bardo** | 🎵 | Música e magia. | **Trovador** | 🎶 |
| **Clérigo** | ✨ | Cura divina. | **Sumo-Sacerdote** | 🌟 |
| **Druida** | 🌿 | Força da natureza. | **Guardião** | 🌲 |
| **Arqueiro** | 🏹 | Mestre do arco e flecha. | **Sentinela** | 🦅 |

---

## ✨ Magias (Academia Arcana)

| Magia | Tipo | Custo (PM) | Custo (Ouro) | Efeito |
| :--- | :--- | :---: | :---: | :--- |
| **Cura Rápida** | Cura | 3 | 100 | Recupera PV (5 + Habilidade). |
| **Bola de Fogo** | Ataque | 5 | 200 | Dano de Fogo (8 + Poder de Fogo). |
| **Pele de Pedra** | Buff | 4 | 150 | +2 Armadura Temporária (Não imp.). |
| **Relâmpago** | Ataque | 6 | 250 | Dano Elétrico Massivo (10 + Poder). |
| **Luz Divina** | Ataque | 4 | 120 | Dano Sagrado (6 + Poder). |

---

## 🎒 Itens e Equipamentos

### Consumíveis
*   **Poção de Vida** (50💰): Recupera 10 PV.
*   **Poção de Mana** (50💰): Recupera 10 PM.

### Armas
| Arma | Bônus | Preço | Descrição |
| :--- | :--- | :---: | :--- |
| **Espada Curta** | +1 Força, +1 Hab. | 200💰 | Comum entre humanos. |
| **Espada Longa** | +3 Força | 600💰 | Lâmina pesada de aço. |
| **Arco Élfico** | +3 Habilidade | 500💰 | Feito de madeira ancestral. |
| **Lâminas Gêmeas** | +2 Hab, +1 Fogo | 800💰 | Ágeis e letais. |
| **Machado de Guerra**| +4 Força, -1 Hab. | 700💰 | Devastador mas pesado. |
| **Martelo da Forja** | +2 Força, +1 Res. | 400💰 | Ferramenta e arma. |
| **Clava c/ Espinhos**| +3 Força, -2 Hab. | 300💰 | Brutalidade pura. |
| **Machadão Duplo** | +5 Força | 1200💰 | Requer muita força. |
| **Cajado de Aprendiz**| +2 Poder de Fogo | 300💰 | Para iniciantes. |
| **Varinha de Cristal**| +4 Fogo, +10 PM | 2500💰 | Amplifica muito a magia. |

### Armaduras
| Armadura | Bônus | Preço | Descrição |
| :--- | :--- | :---: | :--- |
| **Armadura de Couro**| +1 Def, +1 Hab. | 300💰 | Leve e flexível. |
| **Cota de Malha** | +3 Def, -1 Hab. | 600💰 | Boa proteção. |
| **Armadura de Placas**| +5 Def, -2 Hab. | 1800💰 | Tanque de guerra. |
| **Manto Arcano** | +1 Def, +2 Res, +5 PM | 1500💰 | Proteção mágica. |

---

## 🗺️ Locais e Bestiário

Os monstros escalam com seu nível e possuem **versões Boss** (1.5x mais fortes) e **Drops Raros**.

### 🏰 Vila Verdejante (Nível 1-5)
*   **Ratataz**: Fraco, irritante. (HP 10)
*   **Slime**: Viscoso e básico. (HP 12)
*   **Bandido Pé-de-Chinelo**: Ladrãozinho iniciante. (HP 15)

### 🌲 Bosque Ancestral (Nível 5-10)
*   **Lobo Faminto**: Rápido e agressivo. (HP 25, Drop: Pele de Lobo)
*   **Urso Pardo**: Forte e resistente. (HP 60, Drop: Garra de Urso)
*   **Javali Selvagem**: Investe com força. (HP 35)
*   **Bandido da Estrada**: Mais perigoso que o da vila. (HP 30)

### ☠️ Floresta Sombria (Nível 10-15)
*   **Esqueleto Guerreiro**: Não sente dor. (HP 30, Drop: Osso Antigo)
*   **Aranha Gigante**: Venenosa. (HP 40, Drop: Veneno)
*   **Goblin Saqueador**: Ataca em bando. (HP 20)
*   **Espectro**: Etéreo e assustador. (HP 50, Drop: Ectoplasma)
*   **🐲 Dragão Jovem (BOSS)**: O terror dos céus. (HP 150, Drop: Escama de Dragão)

### 🏔️ Montanhas de Ferro (Nível 15-25)
*   **Orc Guerreiro**: Brutalidade pura. (HP 55, Drop: Machado Velho)
*   **Troll da Montanha**: Se regenera? (HP 120, Drop: Couro de Troll)
*   **💎 Golem de Pedra (BOSS)**: Defesa impenetrável. (HP 150, Drop: Minério de Ferro)

### 🧪 Pântano da Perdição (Nível 15-20)
*   **Slime Tóxico**: Corrosivo. (HP 40)
*   **Cobra Gigante**: Esmaga e envenena. (HP 50, Drop: Presa de Cobra)
*   **🐊 Crocodilo Ancião (BOSS)**: Predador perfeito. (HP 90, Drop: Couro Rígido)

### ❄️ Montanhas de Gelo (Nível 25-35+)
*   **Lobo das Neves**: Camuflado na neve. (HP 45, Drop: Pele Branca)
*   **Guerreiro Nórdico**: Viking perdido. (HP 60)
*   **Elemental de Gelo**: Magia pura. (HP 110, Drop: Fragmento)
*   **Yeti (BOSS)**: A lenda das neves. (HP 150, Drop: Pele de Yeti)
*   **💎 Gigante de Gelo (BOSS)**: Colossal. (HP 300, Drop: Armadura Congelada)
*   **🐲 DRAGÃO BRANCO (SUPER BOSS)**: O pináculo do desafio. (HP 500, Drop: Lâmina de Gelo)

### 🏰 Cidadela Real (Zona Segura / Nvl 1-8)
*   **Rato de Esgoto**: Praga urbana.
*   **Ladrão Urbano**: Perigo nos becos.
