import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    logLevel: 'warn',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        },
        // Phaser alone is about 1.3 MB minified, so Vite's default 500 kB warning always fires.
        chunkSizeWarningLimit: 1600,
        minify: 'terser',
        terserOptions: {
            compress: {
                passes: 2
            },
            mangle: true,
            format: {
                comments: false
            }
        }
    },
    server: {
        port: 8080
    }
});
