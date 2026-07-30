import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        academic: resolve(__dirname, 'academic.html'),
        blog: resolve(__dirname, 'blog.html'),
        contact: resolve(__dirname, 'contact.html'),
        experience: resolve(__dirname, 'experience.html'),
        person: resolve(__dirname, 'person.html'),
        research: resolve(__dirname, 'research.html'),
        odyssey: resolve(__dirname, 'the-odyssey.html'),
        brain: resolve(__dirname, 'your-brain-is-not-against-you.html'),
      },
    },
  },
});
