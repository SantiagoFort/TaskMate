import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [vista, setVista] = useState('tareas'); // Nueva vista
  const [tarea, setTarea] = useState('');
  const [tareas, setTareas] = useState(() => {
    const tareasGuardadas = localStorage.getItem('tareas');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  });

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const agregarTarea = () => {
    if (tarea.trim() !== '') {
      setTareas([...tareas, { texto: tarea, completada: false }]);
      setTarea('');
    }
  };

  const eliminarTarea = (indexAEliminar) => {
    setTareas(tareas.filter((_, index) => index !== indexAEliminar));
  };

  const toggleCompletarTarea = (indexACambiar) => {
    setTareas(tareas.map((t, index) =>
      index === indexACambiar ? { ...t, completada: !t.completada } : t
    ));
  };

  const tareasPendientes = tareas.filter(t => !t.completada).length;

  return (
    <div className="App">
      <h1>Mis Tareas</h1>

      {/* Botones para cambiar de vista */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setVista('tareas')} style={{ marginRight: '10px' }}>
          Tareas
        </button>
        <button onClick={() => setVista('acerca')}>
          Acerca de
        </button>
      </div>

      {/* Mostrar contenido según la vista */}
      {vista === 'tareas' && (
        <>
          <p>Tienes {tareasPendientes} {tareasPendientes === 1 ? 'tarea pendiente' : 'tareas pendientes'}</p>

          <input
            type="text"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            placeholder="Escribe una tarea"
          />

          <button onClick={agregarTarea}>Agregar</button>

          <ul>
            {tareas.map((t, index) => (
              <li key={index}>
                <span
                  style={{ textDecoration: t.completada ? 'line-through' : 'none', cursor: 'pointer' }}
                  onClick={() => toggleCompletarTarea(index)}
                >
                  {t.texto}
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
          <p>Contiene:</p>
          <ul>
            <li>Gestión de tareas</li>
            <li>Persistencia en el navegador</li>
            <li>Diseño atractivo</li>
            <li>Cambio de vistas sin recargar</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

