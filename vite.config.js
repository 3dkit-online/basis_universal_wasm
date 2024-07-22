import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({ insertTypesEntry: true,copyDtsFiles:true })
  ],
  base: "/",
  build:{
    lib:{
        entry:  'src/index.ts',
        name:"basis_universal",
        formats:['es']
    }
  }
});