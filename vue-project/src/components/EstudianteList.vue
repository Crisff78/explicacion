<template>
  <div class="estudiante-list-container mt-10">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2">
      Estudiantes Registrados
    </h2>
    
    <!-- Muestra la tabla si hay estudiantes -->
    <div v-if="estudiantes.length > 0" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre Completo
            </th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Edad
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Curso/Grado
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="estudiante in estudiantes" :key="estudiante.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ estudiante.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ estudiante.nombre }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">
              {{ estudiante.edad }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ estudiante.curso }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensaje si la lista está vacía -->
    <div v-else class="text-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
      <p>No hay estudiantes registrados. ¡Usa el formulario para agregar el primero!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EstudianteList',
  props: {
    estudiantes: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente si son necesarios */
</style>