import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem('minhasTarefas');
    return salvas ? JSON.parse(salvas) : [];
  });
  const [texto, setTexto] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  // Salvar no navegador automaticamente
  useEffect(() => {
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  // Lógica de Alerta (Checa a cada segundo)
  useEffect(() => {
    const intervalo = setInterval(() => {
      const agoraData = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      const agoraHora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      tarefas.forEach(t => {
        if (t.data === agoraData && t.hora === agoraHora && !t.notificado) {
          // 1. Tocar o Som
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log("Aguardando interação para tocar som"));

          // 2. Notificação de Sistema
          new Notification("Lembrete: " + t.texto, {
            body: `Horário: ${t.hora}`,
            icon: "/vite.svg"
          });
          
          marcarComoNotificado(t.id);
        }
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (texto.trim() !== '' && data !== '' && hora !== '') {
      const novaTarefa = { 
        id: Date.now(), 
        texto, 
        data, 
        hora, 
        notificado: false 
      };
      setTarefas(prev => [...prev, novaTarefa]);
      setTexto('');
      setData('');
      setHora('');
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  };

  const marcarComoNotificado = (id) => {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, notificado: true } : t));
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  return (
    <div className="app-container">
      <h1>Meu Gestor de Vida</h1>

      <div className="formulario">
        <input 
          type="text" 
          placeholder="O que precisa fazer?" 
          value={texto} 
          onChange={(e) => setTexto(e.target.value)} 
        />
        
        <div className="campo-grupo">
          <label className="label-celular">Data:</label>
          <input 
            type="date" 
            value={data} 
            onChange={(e) => setData(e.target.value)}
            className="input-data-mobile"
          />
        </div>

        <div className="campo-grupo">
          <label className="label-celular">Horário:</label>
          <input 
            type="time" 
            value={hora} 
            onChange={(e) => setHora(e.target.value)}
            className="input-hora-mobile"
          />
        </div>

        <button className="btn-agendar" onClick={adicionarTarefa}>Agendar</button>
      </div>

      <div className="lista-tarefas">
        {tarefas.length > 0 ? (
          tarefas
            .slice()
            .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))
            .map(t => (
              <div key={t.id} className={`card ${t.notificado ? 'concluida' : ''}`}>
                <div className="info-tarefa">
                  <span className="data-display">{t.data.split('-').reverse().join('/')}</span>
                  <span><strong>{t.hora}</strong> - {t.texto}</span>
                </div>
                <button className="btn-remover" onClick={() => removerTarefa(t.id)}>Remover</button>
              </div>
            ))
        ) : (
          <p className="vazio">Nenhum compromisso agendado.</p>
        )}
      </div>

      <footer className="rodape">
        <button className="btn-discreto" onClick={() => {
          Notification.requestPermission().then(p => alert("Permissão: " + p));
          const audio = new Audio('/alarm.wav');
          audio.play();
        }}>
          🔔 Ativar Som e Notificações
        </button>
      </footer>
    </div>
  );
}

export default App;