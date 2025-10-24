import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ✅ أضف هذه الكتلة لتمكين الوصول من الشبكة المحلية
  server: {
    host: '0.0.0.0', // يستمع إلى جميع واجهات الشبكة
    port: 5173,      // يمكنك ترك هذا كما هو
  }
});
