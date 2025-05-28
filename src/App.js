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

      {/* Navegación */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setVista('tareas')} style={{ marginRight: '10px' }}>
          Tareas
        </button>
        <button onClick={() => setVista('acerca')}>Acerca de</button>
      </div>

      {vista === 'tareas' && (
        <>
          <p>Tienes {tareasPendientes} {tareasPendientes === 1 ? 'tarea pendiente' : 'tareas pendientes'}</p>

          <input
            type="text"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            placeholder="Escribe una tarea"
          />

          {/* Campo de fecha con etiqueta clara */}
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <label htmlFor="fecha" style={{ display: 'block', fontSize: '14px' }}>Fecha:</label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              style={{ fontSize: '14px' }}
            />
          </div>

          {/* Checkbox de hora, ahora en su fila y bien alineado */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              id="checkboxHora"
              type="checkbox"
              checked={usarHora}
              onChange={(e) => setUsarHora(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="checkboxHora" style={{ fontSize: '14px' }}>Agregar hora</label>
          </div>

          {/* Campo de hora visible solo si se activa el checkbox */}
          {usarHora && (
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
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
