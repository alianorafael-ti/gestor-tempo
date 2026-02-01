import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const audioRef = useRef(new Audio('/alarm.wav'));
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

  // FUNÇÃO PARA PARAR O SOM
  const pararAlarme = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Lógica de Alerta (Checa a cada segundo)
  useEffect(() => {
    const intervalo = setInterval(() => {
      const agoraData = new Date().toISOString().split('T')[0];
      const agoraHora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
     
      tarefas.forEach(t => {
        if (t.data === agoraData && t.hora === agoraHora && !t.notificado) {
          // 1. Tocar o Som
          audioRef.current.play().catch(e => console.log("Erro ao tocar:", e));
          audioRef.current.loop = true;

          // 2. Notificação de Sistema
          if (Notification.permission === "granted") {
            new Notification("Lembrete: " + t.texto, {
              body: `Horário: ${t.hora}`,
              icon: "/vite.svg"
            });
          }
          
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

      {/* BOTÃO PARA PARAR O SOM QUANDO ESTIVER TOCANDO */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button 
          onClick={pararAlarme}
          style={{ 
            backgroundColor: '#ff4d4d', 
            color: 'white', 
            padding: '15px 30px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            borderRadius: '10px',
            cursor: 'pointer',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}
        >
          🛑 PARAR ALARME
        </button>
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
          Notification.requestPermission().then(p => alert("Notificações: " + p));
          pararAlarme(); // Testa se o controle de áudio está funcionando
          audioRef.current.play().then(() => {
             setTimeout(() => pararAlarme(), 2000); // Toca 2 segundos e para
          });
        }}>
          🔔 Ativar Som e Notificações
        </button>
      </footer>
    </div>
  );
}

export default App;