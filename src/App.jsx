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

  useEffect(() => {
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  // FUNÇÃO DE PARAR (Melhorada para Celular)
  const pararAlarme = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
    }
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = new Date();
      const agoraData = agora.getFullYear() + '-' + 
                        String(agora.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(agora.getDate()).padStart(2, '0');
      const agoraHora = String(agora.getHours()).padStart(2, '0') + ':' + 
                        String(agora.getMinutes()).padStart(2, '0');
     
      tarefas.forEach(t => {
        if (t.data === agoraData && t.hora === agoraHora && !t.notificado) {
          audioRef.current.loop = true;
          audioRef.current.play().catch(e => console.log("Erro som:", e));

          if (Notification.permission === "granted") {
            new Notification("⏰ Lembrete: " + t.texto);
          } else {
            alert("⏰ ALERTA: " + t.texto);
          }
          marcarComoNotificado(t.id);
        }
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (texto.trim() !== '' && data !== '' && hora !== '') {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {});

      const novaTarefa = { id: Date.now(), texto, data, hora, notificado: false };
      setTarefas(prev => [...prev, novaTarefa]);
      setTexto(''); setData(''); setHora('');
    } else {
      alert("Preencha todos os campos!");
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
      <h1>Gestor de Tarefas</h1>

      <div className="formulario">
        <input type="text" placeholder="O que precisa fazer?" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <div className="campo-grupo">
          <label>Data:</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="campo-grupo">
          <label>Horário:</label>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </div>
        <button className="btn-agendar" onClick={adicionarTarefa}>Agendar</button>
      </div>

      {/* BOTÃO DE PARAR CORRIGIDO (ESTILO FORÇADO E SUPORTE A TOQUE) */}
      <div style={{ textAlign: 'center', margin: '25px 0' }}>
        <button 
          onClick={pararAlarme}
          onPointerDown={pararAlarme}
          style={{ 
            backgroundColor: '#d32f2f', 
            color: '#ffffff', 
            padding: '18px 40px', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            borderRadius: '12px',
            border: '2px solid #b71c1c',
            cursor: 'pointer',
            width: '90%',
            maxWidth: '300px',
            display: 'inline-block',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        >
          🛑 PARAR ALARME
        </button>
      </div>

      <div className="lista-tarefas">
        {tarefas.length > 0 ? (
          tarefas.slice().sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora)).map(t => (
            <div key={t.id} className={`card ${t.notificado ? 'concluida' : ''}`}>
              <div className="info-tarefa">
                <span>{t.data.split('-').reverse().join('/')}</span>
                <span><strong>{t.hora}</strong> - {t.texto}</span>
              </div>
              <button className="btn-remover" onClick={() => removerTarefa(t.id)}>Excluir</button>
            </div>
          ))
        ) : (
          <p className="vazio">Nenhum compromisso.</p>
        )}
      </div>

      <footer className="rodape">
        <button className="btn-discreto" onClick={() => {
          Notification.requestPermission();
          alert("Ativado! Clique em OK.");
          audioRef.current.play().then(() => setTimeout(() => pararAlarme(), 1000));
        }}>
          🔔 Ativar Alarme e Avisos
        </button>
      </footer>
    </div>
  );
}

export default App;