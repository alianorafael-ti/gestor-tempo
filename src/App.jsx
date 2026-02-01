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

  const pararAlarme = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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
    <div className="app-container" style={{ color: '#333' }}>
      <h1>Gestor de Tempo</h1>

      <div className="formulario">
        <input 
          type="text" 
          placeholder="O que precisa fazer?" 
          value={texto} 
          onChange={(e) => setTexto(e.target.value)} 
          style={{ color: '#000' }}
        />
        <div className="campo-grupo">
          <label style={{ color: '#444' }}>Data:</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="campo-grupo">
          <label style={{ color: '#444' }}>Horário:</label>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </div>
        <button className="btn-agendar" onClick={adicionarTarefa}>Agendar</button>
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button 
          onClick={pararAlarme}
          style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '12px 25px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
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
              <div key={t.id} className={`card ${t.notificado ? 'concluida' : ''}`} style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="info-tarefa" style={{ color: '#333' }}>
                  <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#000' }}>
                    {t.data.split('-').reverse().join('/')}
                  </span>
                  <span style={{ color: '#000' }}>
                    <strong>{t.hora}</strong> - {t.texto}
                  </span>
                </div>
                <button className="btn-remover" onClick={() => removerTarefa(t.id)} style={{ color: 'red' }}>Excluir</button>
              </div>
            ))
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>Nenhum compromisso agendado.</p>
        )}
      </div>

      <footer className="rodape">
        <button className="btn-discreto" onClick={() => {
          Notification.requestPermission();
          alert("Sistema pronto!");
        }}>
          🔔 Ativar Alarme e Avisos
        </button>
      </footer>
    </div>
  );
}

export default App;