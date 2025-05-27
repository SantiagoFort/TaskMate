// Importo los hooks necesarios desde React
import { useState, useEffect } from 'react';
import './App.css'; // Importo los estilos

// Componente principal de la app
function App() {
  // Estado para controlar qué vista se muestra (tareas o acerca)
  const [vista, setVista] = useState('tareas');

  // Estado del texto de la tarea
  const [tarea, setTarea] = useState('');

  // Estado para la fecha seleccionada
  const [fecha, setFecha] = useState('');

  // Estado para activar/desactivar el campo de hora
  const [usarHora, setUsarHora] = useState(false);

  // Estado para la hora (si se activa)
  const [hora, setHora] = useState('');

  // Estado para la lista de tareas (inicializado desde LocalStorage)
  const [tareas, setTareas] = useState(() => {
    const tareasGuardadas = localStorage.getItem('tareas');
    return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
  });

  // useEffect que guarda las tareas en el navegador cada vez que cambian
  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  // Función para agregar una tarea nueva
  const agregarTarea = () => {
    // Validamos que haya texto y fecha (la hora es opcional)
    if (tarea.trim() !== '' && fecha !== '') {
      setTareas([
        ...tareas,
        {
          texto: tarea,
          completada: false,
          fecha,              // guardamos la fecha
          hora: usarHora ? hora : null, // si se activó, guardamos la hora
        },
      ]);
      // Limpiamos los campos
      setTarea('');
      setFecha('');
      setHora('');
      setUsarHora(false);
    }
  };

  // Eliminar una tarea según su índice
  const eliminarTarea = (index) => {
    setTareas(tareas.filter((_, i) => i !== index));
  };

  // Alternar el estado de completada de una tarea
  const toggleCompletarTarea = (index) => {
    setTareas(
      tareas.map((t, i) =>
        i === index ? { ...t, completada: !t.completada } : t
      )
    );
  };

  // Calcular cuántas tareas no están completadas
  const tareasPendientes = tareas.filter((t) => !t.completada).length;

  return (
    <div className="App">
      <h1>Tareas Pendientes</h1>

      {/* Botones para cambiar entre la vista de tareas y la sección acerca de */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setVista('tareas')} style={{ marginRight: '10px' }}>
          Tareas
        </button>
        <button onClick={() => setVista('acerca')}>Acerca de</button>
      </div>

      {/* Si la vista es "tareas", mostramos la app principal */}
      {vista === 'tareas' && (
        <>
          <p>Tienes {tareasPendientes} tareas pendientes</p>

          {/* Campo para escribir la tarea */}
          <input
            type="text"
            value={tarea}
            onChange={(e) => setTarea(e.target.value)}
            placeholder="Escribe una tarea"
          />

          {/* Campo para seleccionar la fecha */}
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            placeholder="dd/mm/aaaa"
            style={{ fontSize: '14px' }}
          />

          {/* Checkbox para activar o no el campo de hora */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '10px 0' }}>
            <input
              type="checkbox"
              checked={usarHora}
              onChange={(e) => setUsarHora(e.target.checked)}
            />
            Agregar hora
          </label>


          {/* Si se activa el checkbox, aparece el campo de hora */}
          {usarHora && (
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          )}

          {/* Botón para agregar la tarea */}
          <button onClick={agregarTarea}>Agregar</button>

          {/* Lista de tareas */}
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
                  {/* Texto de la tarea */}
                  {t.texto}
                  <br />
                  {/* Fecha y hora, si existe */}
                  📅 {t.fecha} {t.hora ? `🕒 ${t.hora}` : ''}
                </span>
                <button onClick={() => eliminarTarea(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Sección "Acerca de" */}
      {vista === 'acerca' && (
        <div>
          <p>Esta aplicación fue creada por Santiago Fort para practicar React.</p>
          <p>Incluye tareas con fecha y hora opcional.</p>
        </div>
      )}
    </div>
  );
}

// Exportamos el componente para que se use en React
export default App;
