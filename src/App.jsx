import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  // Referência única para o áudio
  const audioRef = useRef(new Audio('/alarm.wav'));
  
  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem('minhasTarefas');
    return salvas ? JSON.parse(salvas) : [];
  });
  
  const [texto, setTexto] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  // 1. Salvar no navegador automaticamente
  useEffect(() => {
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  // 2. Função para parar o alarme
  const pararAlarme = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // 3. Lógica de Alerta (Padronizada para evitar erros de formato de hora)
  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = new Date();
      
      // Formato YYYY-MM-DD (ex: 2023-10-27)
      const agoraData = agora.getFullYear() + '-' + 
                        String(agora.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(agora.getDate()).padStart(2, '0');
      
      // Formato HH:MM (sempre 24h para bater com o input do navegador)
      const agoraHora = String(agora.getHours()).padStart(2, '0') + ':' + 
                        String(agora.getMinutes()).padStart(2, '0');
     
      tarefas.forEach(t => {
        // Compara Data, Hora e se já não foi notificado
        if (t.data === agoraData && t.hora === agoraHora && !t.notificado) {
          
          // Tocar o Som
          audioRef.current.loop = true;
          audioRef.current.play().catch(e => console.log("Navegador bloqueou som inicial:", e));

          // Notificação de Sistema (Plano A) ou Alert (Plano B)
          if (Notification.permission === "granted") {
            new Notification("⏰ HORA DE: " + t.texto, {
              body: `Compromisso agendado para às ${t.hora}`,
              icon: "/vite.svg"
            });
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
      // "Acorda" o áudio para o navegador permitir o som automático depois
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {});

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
      <h1>Gestor de Tarefas</h1>

      <div className="formulario">
        <input 
          type="text" 
          placeholder="O que precisa fazer?" 
          value={texto} 
          onChange={(e) => setTexto(e.target.value)} 
        />
        
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

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button className="btn-parar" onClick={pararAlarme}>
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
                <button className="btn-remover" onClick={() => removerTarefa(t.id)}>Excluir</button>
              </div>
            ))
        ) : (
          <p className="vazio">Nenhum compromisso agendado.</p>
        )}
      </div>

      <footer className="rodape">
        <button className="btn-discreto" onClick={() => {
          Notification.requestPermission();
          alert("Som e Notificações ativados! Mantenha esta aba aberta.");
          audioRef.current.play().then(() => {
            setTimeout(() => pararAlarme(), 1000); // Toca 1 seg só para testar
          });
        }}>
          🔔 Ativar Alarme e Avisos
        </button>
      </footer>
    </div>
  );
}

export default App;