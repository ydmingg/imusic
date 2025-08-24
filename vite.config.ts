import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://music.163.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/weapi': {
                target: 'http://music.163.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/weapi/, ''),
            },
            '/baiduapi': {
                target: 'http://musicapi.taihe.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/baiduapi/, '')
            }
        }
    }
})
