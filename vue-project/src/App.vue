<template>
  <div class="main-container">
    <div class="app-card">
      <h1 class="main-title">
        Sistema de Registro de Estudiantes
      </h1>

      <!-- ESTILIZACIÓN DEL FORMULARIO -->
      <div class="form-section">
        <h2 class="form-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Añadir Nuevo Estudiante
        </h2>
        
        <!-- INICIO DEL FORMULARIO -->
        <form @submit.prevent="agregarEstudiante" class="form-grid">
          <!-- Campo: Nombre -->
          <div class="form-group full-width">
            <label for="input-nombre" class="form-label">Nombre Completo:</label>
            <input
              id="input-nombre"
              v-model="nuevoEstudiante.nombre"
              type="text"
              required
              placeholder="Ej: Juan Pérez"
              class="form-input"
            />
          </div>
          
          <!-- Contenedor de Edad y Curso (en dos columnas) -->
          <div class="split-group">
            
            <!-- Campo: Edad -->
            <div class="form-group">
              <label for="input-edad" class="form-label">Edad:</label>
              <input
                id="input-edad"
                v-model="nuevoEstudiante.edad"
                type="number"
                required
                placeholder="Escribe la edad"
                min="1"
                max="99"
                class="form-input"
              />
            </div>
            
            <!-- Campo: Curso/Grado -->
            <div class="form-group">
              <label for="input-curso" class="form-label">Curso o Grado:</label>
              <input
                id="input-curso"
                v-model="nuevoEstudiante.curso"
                type="text"
                required
                placeholder="Ej: 5to de Secundaria"
                class="form-input"
              />
            </div>
          </div>
          
          <button
            type="submit"
            class="submit-button"
          >
            <!-- Usamos un SVG para el botón -->
            <span class="button-content">
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Guardar y Agregar Estudiante
            </span>
          </button>
        </form>
        <!-- FIN DEL FORMULARIO -->
      </div>
      <!-- FIN DE ESTILIZACIÓN DEL FORMULARIO -->


      <!-- Componente de Lista (Hijo) -->
      <!-- IMPORTANTE: Asegúrate de que el archivo EstudianteList.vue exista en el mismo directorio. -->
      <EstudianteList :estudiantes="estudiantes" />
      
      <!-- Modal personalizado con mejor estilo (usando clases de estilo) -->
      <div v-if="showModal" class="modal-backdrop" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <div :class="modalVariant === 'success' ? 'text-green' : 'text-red'" class="modal-icon">
            {{ modalVariant === 'success' ? '🎉' : '⚠️' }}
          </div>
          <h3 class="modal-title-text">{{ modalTitle }}</h3>
          <p class="modal-message">{{ modalMessage }}</p>
          <button 
            @click="showModal = false" 
            :class="modalVariant === 'success' ? 'modal-button-success' : 'modal-button-error'" 
            class="modal-button"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import EstudianteList from './components/EstudianteList.vue';

interface Estudiante {
  id: number;
  nombre: string;
  edad: number;
  curso: string;
}

const API_URL = 'http://localhost:4000/api/estudiantes';

const nuevoEstudiante = ref({ nombre: '', edad: '', curso: '' });
const estudiantes = ref<Estudiante[]>([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalVariant = ref('success');

const mostrarModal = (title: string, message: string, variant = 'success') => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalVariant.value = variant;
  showModal.value = true;
};

const cargarEstudiantes = async () => {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    estudiantes.value = await res.json();
  } catch (error: any) {
    console.error('Error al cargar estudiantes:', error);
    estudiantes.value = [];
    if (!estudiantes.value.length) {
      mostrarModal('❌ Error de Conexión', `No se pudo conectar con el servidor. Asegúrate de que el backend (http://localhost:4000) esté corriendo.`, 'error');
    }
  }
};

const agregarEstudiante = async () => {
  try {
    const dataToSend = {
      ...nuevoEstudiante.value,
      edad: parseInt(String(nuevoEstudiante.value.edad), 10),
    };
    
    if (isNaN(dataToSend.edad) || dataToSend.edad <= 0) {
        throw new Error('La edad debe ser un número válido y positivo.');
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    nuevoEstudiante.value = { nombre: '', edad: '', curso: '' };
    mostrarModal('✅ Éxito', 'El estudiante fue agregado correctamente.', 'success');
    await cargarEstudiantes();
  } catch (error: any) {
    console.error('Error al agregar estudiante:', error);
    mostrarModal('❌ Error al Registrar', error.message || 'Ocurrió un error inesperado al intentar registrar el estudiante.', 'error');
  }
};

onMounted(cargarEstudiantes);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* ESTILOS BASE */
.main-container {
  min-height: 100vh;
  background-color: #f8fafc; /* slate-50 */
  display: flex;
  /* CAMBIO: Usar flex-start para evitar que el contenido largo se salga de la pantalla */
  align-items: flex-start; 
  justify-content: center;
  /* CAMBIO: Añadir padding superior para que no esté pegado al tope y permitir scroll */
  padding: 2rem 1rem; 
  font-family: 'Inter', sans-serif;
}

.app-card {
  max-width: 56rem; /* max-w-4xl (900px) */
  width: 100%;
  background-color: #ffffff;
  padding: 2.5rem; /* p-10 */
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
  transition: box-shadow 0.3s ease;
  overflow-y: auto; /* AÑADIDO: Permite el desplazamiento dentro de la tarjeta si el contenido es demasiado largo */
}

.app-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-3xl (custom) */
}

.main-title {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 800; /* font-extrabold */
  color: #3730a3; /* indigo-800 */
  text-align: center;
  margin-bottom: 2rem;
}

/* ESTILOS DEL FORMULARIO */
.form-section {
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background-color: #eef2ff; /* indigo-50 */
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* shadow-inner */
  border: 1px solid #e0e7ff; /* indigo-100 */
}

.form-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700; /* font-bold */
  color: #4338ca; /* indigo-700 */
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  height: 1.5rem;
  width: 1.5rem;
  color: #4f46e5; /* indigo-600 */
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* space-y-6 */
}

.form-group {
    margin-bottom: 0.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #4b5563; /* gray-700 */
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem; /* p-3 */
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  transition: all 0.2s ease;
  outline: none;
}

.form-input:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05); /* hover:shadow-md */
}

.form-input:focus {
  border-color: #6366f1; /* indigo-500 */
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); /* focus:ring-3 focus:ring-indigo-400 */
}

.split-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 768px) { /* md breakpoint */
    .split-group {
        grid-template-columns: repeat(2, 1fr);
    }
}

.submit-button {
  width: 100%;
  background-image: linear-gradient(to right, #4f46e5, #3b82f6); /* from-indigo-600 to-blue-600 */
  color: white;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4), 0 4px 6px -4px rgba(79, 70, 229, 0.4); /* shadow-xl shadow-indigo-500/50 */
  transition: all 0.3s ease;
  margin-top: 1.5rem; /* mt-6 */
  border: none;
  cursor: pointer;
}

.submit-button:hover {
  background-image: linear-gradient(to right, #4338ca, #2563eb); /* hover:from-indigo-700 hover:to-blue-700 */
  transform: scale(1.01);
}

.submit-button:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5); /* focus:ring-4 focus:ring-indigo-400 */
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.button-icon {
    height: 1.25rem;
    width: 1.25rem;
}


/* ESTILOS DEL MODAL */

.modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    transition: opacity 0.3s ease;
}

.modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 24rem;
    width: 100%;
    text-align: center;
    transform: scale(1);
    transition: transform 0.3s ease;
}

.modal-icon {
    margin-bottom: 1rem;
    font-size: 2.25rem;
}
.text-green { color: #10b981; } /* Tailwind green-500 */
.text-red { color: #ef4444; }   /* Tailwind red-500 */

.modal-title-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937; /* gray-800 */
    margin-bottom: 1rem;
}

.modal-message {
    color: #4b5563; /* gray-600 */
    margin-bottom: 1.5rem;
}

.modal-button {
    width: 100%;
    color: white;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;
    border: none;
    cursor: pointer;
}

.modal-button-success {
    background-color: #6366f1; /* indigo-500 */
}
.modal-button-success:hover {
    background-color: #4f46e5; /* indigo-600 */
}

.modal-button-error {
    background-color: #ef4444; /* red-500 */
}
.modal-button-error:hover {
    background-color: #dc2626; /* red-600 */
}
</style>
