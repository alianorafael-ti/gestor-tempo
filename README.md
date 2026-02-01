# ⏰ Gestor de Tempo

Um aplicativo web moderno, leve e eficiente para gerenciamento de tarefas com sistema de alarme sonoro e notificações nativas. Desenvolvido para garantir que você nunca perca um compromisso importante.

## ✨ Funcionalidades

- **Agendamento Inteligente:** Defina tarefas com data e hora específicas.
- **Alarme Sonoro:** Alerta de áudio (`alarm.wav`) que toca em loop até ser desativado.
- **Notificações de Sistema:** Avisos visuais nativos (Desktop e Mobile).
- **Persistência de Dados:** Suas tarefas ficam salvas no navegador (LocalStorage), mesmo após fechar a aba.
- **Controle de Alarme:** Botão exclusivo para interromper o som do alarme.
- **Design Adaptativo:** Interface otimizada para Firefox, Chrome e dispositivos móveis.

## 🚀 Tecnologias Utilizadas

- [React.js](https://reactjs.org/) - Biblioteca principal.
- [Vite](https://vitejs.dev/) - Build tool ultra-rápida.
- [JavaScript/ES6+](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) - Lógica do sistema.
- [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS) - Estilização e layout responsivo.

## 🛠️ Como usar

1. **Ativar Som e Notificações:** Ao abrir o app, clique no botão 🔔 no rodapé para dar permissão ao navegador.
2. **Adicionar Tarefa:** Preencha a descrição, data e hora, e clique em "Agendar".
3. **Alarme:** Quando o horário chegar, o som tocará e uma notificação aparecerá.
4. **Parar Som:** Use o botão vermelho "🛑 PARAR ALARME" para silenciar o aviso.

## 📦 Instalação e Execução

Para rodar este projeto localmente:

```bash
# Clone o repositório
git clone [https://github.com/alianorafael-ti/gestor-tempo.git

# Entre na pasta
cd gestor-tempo

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev