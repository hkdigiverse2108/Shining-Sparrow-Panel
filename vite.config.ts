import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.VITE_PORT || env.PORT || '5173', 10);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: port,
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**']
      }
    },
    preview: {
      port: port,
      strictPort: true,
    },
    build: {
      sourcemap: false, // Disables memory-heavy source map tracing files
    },
  };
})
