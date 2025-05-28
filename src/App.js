import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vista, setVista] = useState('tareas');
  const [tarea, setTarea] = useState('');
  const [fecha, setFecha] = useState('');
  const [usarHora, setUsarHora] = useState(false);
  const [hora, setHora] = useState('');

  const [tareas, setTareas] = useState(() => {
    const tareasGuardadas = localStorage.getItem('tareas');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  });

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const agregarTarea = () => {
    if (tarea.trim() !== '' && fecha !== '') {
      setTareas([
        ...tareas,
        {
          texto: tarea,
          completada: false,
          fecha,
          hora: usarHora ? hora : null,
        },
      ]);
      setTarea('');
      setFecha('');
      setHora('');
      setUsarHora(false);
    }
  };

  const eliminarTarea = (index) => {
    setTareas(tareas.filter((_, i) => i !== index));
  };

  const toggleCompletarTarea = (index) => {
    setTareas(
      tareas.map((t, i) =>
        i === index ? { ...t, completada: !t.completada } : t
      )
    );
  };

  const tareasPendientes = tareas.filter((t) => !t.completada).length;

  return (
    <div className="App">
      <h1>Tareas Pendientes</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setVista('tareas')} style={{ marginRight: '10px' }}>
          Tareas
        </button>
        <button onClick={() => setVista('acerca')}>Acerca de</button>
      </div>

      {vista === 'tareas' && (
        <>
          <p>Tienes {tareasPendientes} tareas pendientes</p>

          <input
            type="text"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            placeholder="Escribe una tarea"
          />

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{
              color: fecha ? '#000' : '#aaa',
              fontSize: '14px',
              marginTop: '8px',
            }}
          />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
            gap: '8px',
            fontSize: '14px',
            justifyContent: 'center'
          }}>
            <input
              type="checkbox"
              id="horaCheckbox"
              checked={usarHora}
              onChange={(e) => setUsarHora(e.target.checked)}
            />
            <label htmlFor="horaCheckbox">Agregar hora</label>
          </div>

          {usarHora && (
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              style={{ marginTop: '10px' }}
            />
          )}

          <button onClick={agregarTarea}>Agregar</button>

          <ul>
            {[...tareas]
              .sort((a, b) => {
                const dateA = new Date(`${a.fecha}T${a.hora || '00:00'}`);
                const dateB = new Date(`${b.fecha}T${b.hora || '00:00'}`);
                return dateA - dateB;
              })
              .map((t, index) => (
                <li key={index}>
                  <span
                    style={{
                      textDecoration: t.completada ? 'line-through' : 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleCompletarTarea(index)}
                  >
                    {t.texto}
                    <br />
                    📅 {t.fecha} {t.hora ? `🕒 ${t.hora}` : ''}
                  </span>
                  <button onClick={() => eliminarTarea(index)}>Eliminar</button>
                </li>
              ))}
          </ul>
        </>
      )}

      {vista === 'acerca' && (
        <div>
          <p>Esta aplicación fue creada por Santiago Fort para practicar React.</p>
          <p>Incluye tareas con fecha y hora opcional.</p>
        </div>
      )}
    </div>
  );
}

export default App;
