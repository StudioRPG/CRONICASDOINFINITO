# 🌍 Como Publicar seu Jogo na Internet

Seu jogo é feito com tecnologias web (HTML, CSS, JS), o que torna **muito fácil** de colocar online!

> 🛑 **PROBLEMA COMUM: "Account credit usage exceeded"?**
> Se você viu esse erro no Netlify, você atingiu o limite gratuito. **Não pague!** Use a **Opção 2 (Vercel)** ou **Opção 3 (GitHub)** abaixo. Elas são ótimas alternativas.

---

## Opção 1: Netlify Drop (FÁCIL) 🥈
*Nota: Se você já atingiu o limite aqui, pule para a Opção 2.*

1.  **Prepare a Pasta**:
    *   Você deve ter uma pasta contendo:
        *   Arquivo `index.html` (O jogo).
        *   Pasta `assets` (Com `game-lib.js`, imagens, etc.).
    *   **IMPORTANTE**: Não altere os nomes ou mova arquivos da pasta `assets`, o jogo precisa deles lá!
2.  Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
3.  **Arraste a pasta inteira** para a área indicada na tela.
4.  Espere alguns segundos e pegue o link!

---

## Opção 2: Vercel (MUITO FÁCIL E ROBUSTO) 🏆
A Vercel é excelente e muito parecida com o Netlify, mas com limites mais generosos para projetos pessoais.

1.  Crie uma conta em [vercel.com](https://vercel.com/signup).
2.  Instale o **Vercel CLI** (Opcional, mas via site é mais fácil):
    *   Vá para o seu **Dashboard** na Vercel (pelo site).
    *   Clique em **"Add New..."** -> **"Project"**.
    *   Se você tiver o código no GitHub (Opção 3), importá-lo é o melhor jeito.
    *   **Método sem GitHub (Arrastar)**: Infelizmente a Vercel removeu o "drop" direto. **Recomendamos fortemente a Opção 3 (GitHub)** se o Netlify não funcionar.
    *   *Alternativa rápida:* Se você só quer hospedar rápido, use o **Surge.sh** (via terminal) ou vá para a **Opção 3** que é a definitiva.

---

## Opção 3: GitHub Pages (MÉTODO PROFISSIONAL) 👨‍💻
Ideal se você quer manter o histórico de alterações e ter um link fixo e seguro. **Nunca sai do ar por limite de crédito.**

1.  Crie uma conta no [GitHub.com](https://github.com).
2.  Crie um **Novo Repositório** (botão "New"). Dê um nome, ex: `cronicas-do-infinito`.
    *   Marque a opção "Public".
    *   Marque "Add a README file" (ajuda a iniciar).
3.  No seu repositório criado, clique em **Add file** -> **Upload files**.
4.  Arraste seus arquivos (o `index.html` e a pasta `assets`) para lá e clique em **Commit changes** (botão verde).
5.  **AGORA ATENÇÃO:** Você precisa estar **DENTRO** do repositório que acabou de criar.
    *   Se você saiu, clique no ícone do Gato no canto superior esquerdo.
    *   Na lista "Your repositories" (na esquerda), clique no nome do seu jogo (ex: `cronicas-do-infinito`).
6.  Agora sim: Olhe para o topo da página, abaixo do nome do repositório. Clique na aba **Settings** (Ícone de Engrenagem ⚙️).
    *   *Não vá no menu da sua foto de perfil! É na barra do repositório.*
7.  No menu lateral esquerdo dessa nova tela, clique em **Pages**.
8.  **OLHE O TOPO DA PÁGINA**: Logo abaixo do título grande "GitHub Pages" no topo.
9.  Procure a opção **Source** (Fonte). Ela geralmente é o **primeiro botão** que aparece.
10. Certifique-se que está escrito **"Deploy from a branch"**.
11. Embaixo dele, tem a opção **Branch**. Clique onde diz "None" e mude para **`main`**.
12. Clique no botão **Save** (Salvar) ao lado.
13. Aguarde uns 2 minutos. Atualize a página e o GitHub vai te mostrar o link no topo (ex: `https://seu-usuario.github.io/cronicas-do-infinito/`).

### 🌟 Como melhorar o nome do site (Link)
O link do site é baseado no **Nome do Repositório**.
*   Se o nome for `meu-rpg`, o link fica `.../meu-rpg`.
*   Para mudar: Vá em **Settings** > **General**, mude o nome lá em cima e clique em **Rename**. O link atualiza sozinho em alguns minutos!
*   *Quer um `.com.br`?* Aí precisaria comprar um domínio, mas mudar o nome do repositório já ajuda muito!

### 🕵️‍♂️ Como mudar seu Nome de Usuário (StudioRPG)
Para virar `studiorpg.github.io`, siga estes passos:

1.  No GitHub, clique na sua **Foto de Perfil** (canto superior direito) e vá em **Settings**.
2.  No menu lateral esquerdo, clique em **Account**.
3.  Na seção "Change username", clique no botão **Change username**.
4.  O GitHub vai te avisar sobre os riscos. Clique em **I understand, let's change my username**.
5.  Digite o novo nome (ex: `StudioRPG`).
    *   *Dica:* Nomes comuns como "StudioRPG" provavelmente já existem. Tente variações como `StudioRPG-BR`, `Studio-RPG-Game`, ou `O-StudioRPG`.
6.  Siga as instruções para confirmar.

---

## 🔄 Como ATUALIZAR seu Jogo no GitHub
Se você já publicou e quer enviar as novidades (Monstros novos, ajustes, mobile):

1.  Entre no seu repositório no GitHub.
2.  Clique em **Add file** -> **Upload files** (igual na primeira vez).
3.  Arraste o **`index.html`** e a pasta **`assets`** (inteira) de novo.
4.  O GitHub vai perguntar se quer substituir. Confirme no botão verde **Commit changes**.
5.  Pronto! Em alguns minutos o link do seu site será atualizado automaticamente com a nova versão.

**Atenção:** Depois de mudar, o link antigo para de funcionar e você terá o novo link `novo-nome.github.io`!

---

## ⚠️ Dicas Importantes
*   **Imagens**: Se você usa imagens locais, elas precisam estar na pasta enviada.
*   **Saves**: O jogo salva no *Navegador* do jogador.
*   **Renomear para index.html**: Isso é crucial para o link ficar bonito (ex: `site.com` em vez de `site.com/jogo.html`).

Divirta-se vendo seus amigos morrerem para o Dragão Branco! 🐉🔥
