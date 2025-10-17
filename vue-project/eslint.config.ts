import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

// Importamos el analizador de Vue explícitamente
import vueParser from "vue-eslint-parser";

export default [
  // 1. Configuraciones globales y reglas base para todos los archivos
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],

  // 2. Configuración específica y CORRECTA para los archivos .vue
  {
    files: ["/*.vue"], // Esto se aplica SOLO a los archivos .vue
    languageOptions: {
      // El analizador principal para .vue DEBE ser 'vue-eslint-parser'
      // Este sabe cómo manejar <template>, <script> y <style>
      parser: vueParser,
      parserOptions: {
        // Dentro del analizador de Vue, le decimos qué analizador usar
        // para el código dentro de la etiqueta <script>
        parser: tseslint.parser,
        
        // Y le damos la información del proyecto de TypeScript que necesita
        tsconfigRootDir: import.meta.dirname,
        project: ["./tsconfig.app.json"],
        extraFileExtensions: [".vue"],
      },
    },
  },
];