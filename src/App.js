// Importo los hooks necesarios desde React
import { useState, useEffect } from 'react';
import './App.css'; // Importo los estilos

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

      {/* Navegación entre vistas */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setVista('tareas')} style={{ marginRight: '10px' }}>Tareas</button>
        <button onClick={() => setVista('acerca')}>Acerca de</button>
      </div>

      {/* Vista de tareas */}
      {vista === 'tareas' && (
        <>
          <p>Tienes {tareasPendientes} tareas pendientes</p>

          {/* Input de texto */}
          <input
            type="text"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            placeholder="Escribe una tarea"
          />

          {/* Etiqueta visible para la fecha */}
          <label htmlFor="fechaInput" style={{ fontSize: '14px', marginTop: '10px', display: 'block' }}>
            Fecha:
          </label>
          <input
            id="fechaInput"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{ fontSize: '14px' }}
          />

          {/* Checkbox "Agregar hora" */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '10px 0' }}>
            <input
              id="horaCheckbox"
              type="checkbox"
              checked={usarHora}
              onChange={(e) => setUsarHora(e.target.checked)}
            />
            <label htmlFor="horaCheckbox" style={{ fontSize: '14px' }}>Agregar hora</label>
          </div>

          {/* Input de hora si está activado */}
          {usarHora && (
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          )}

          {/* Botón agregar */}
          <button onClick={agregarTarea}>Agregar</button>

          {/* Lista de tareas ordenadas por fecha/hora */}
          <ul>
            {[...tareas]
              .sort((a, b) => new Date(`${a.fecha}T${a.hora || '00:00'}`) - new Date(`${b.fecha}T${b.hora || '00:00'}`))
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

      {/* Vista acerca */}
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
