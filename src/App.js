// App.js
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vista, setVista] = useState('tareas');
  const [tarea, setTarea] = useState('');
  const [fecha, setFecha] = useState('');
  const [usarHora, setUsarHora] = useState(false);
  const [hora, setHora] = useState('');
  const [criterioOrden, setCriterioOrden] = useState('fechaAsc');

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
    const confirmar = window.confirm("¿Seguro que querés eliminar esta tarea?");
    if (confirmar) {
      setTareas(tareas.filter((_, i) => i !== index));
    }
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

      {/* Navegación entre vistas */}
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

          <div className="fecha-container">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              placeholder="dd/mm/aaaa"
            />
            {!fecha && /iPhone|iPad|iPod/i.test(navigator.userAgent) && (
              <span className="fecha-placeholder">dd/mm/aaaa</span>
            )}
          </div>

          <div className="checkbox-row">
            <input
              id="checkboxHora"
              type="checkbox"
              checked={usarHora}
              onChange={(e) => setUsarHora(e.target.checked)}
            />
            <label htmlFor="checkboxHora" style={{ fontSize: '14px' }}>Agregar hora</label>
          </div>

          {usarHora && (
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              style={{ marginTop: '10px' }}
            />
          )}

          <button onClick={agregarTarea} style={{ marginTop: '10px' }}>Agregar</button>

          {/* Filtro de orden */}
          <label htmlFor="orden" style={{ marginTop: '10px', fontSize: '14px' }}>Ordenar por:</label>
          <select
            id="orden"
            value={criterioOrden}
            onChange={(e) => setCriterioOrden(e.target.value)}
            style={{ marginBottom: '10px', padding: '8px', fontSize: '14px', width: '100%' }}
          >
            <option value="fechaAsc">Fecha (más cercana primero)</option>
            <option value="fechaDesc">Fecha (más lejana primero)</option>
            <option value="pendientes">Pendientes primero</option>
            <option value="completadas">Completadas primero</option>
          </select>

          <ul>
            {[...tareas]
              .sort((a, b) => {
                const dateA = new Date(`${a.fecha}T${a.hora || '00:00'}`);
                const dateB = new Date(`${b.fecha}T${b.hora || '00:00'}`);

                switch (criterioOrden) {
                  case 'fechaDesc':
                    return dateB - dateA;
                  case 'pendientes':
                    return (a.completada === b.completada) ? 0 : a.completada ? 1 : -1;
                  case 'completadas':
                    return (a.completada === b.completada) ? 0 : a.completada ? -1 : 1;
                  case 'fechaAsc':
                  default:
                    return dateA - dateB;
                }
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
                    {t.texto}<br />
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
