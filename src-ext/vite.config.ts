import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync } from 'fs';

// Get the directory name
const __dirname = dirname(fileURLToPath(import.meta.url));

// Custom plugin to copy manifest.json, content.js, and popup.html to dist directory
const copyFilesPlugin = () => {
    return {
        name: 'copy-files',
        closeBundle() {
            copyFileSync(resolve(__dirname, 'src/extension/manifest.json'), resolve(__dirname, 'dist/manifest.json'));
            copyFileSync(resolve(__dirname, 'src/extension/content.js'), resolve(__dirname, 'dist/content.js'));
            copyFileSync(resolve(__dirname, 'src/extension/popup.html'), resolve(__dirname, 'dist/popup.html'));
        }
    };
};

export default defineConfig({
    plugins: [react(), copyFilesPlugin()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/main.tsx'),
                popup: resolve(__dirname, 'src/extension/popup.html')
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
                dir: 'dist'
            }
        }
    }
});