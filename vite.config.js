import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',           // auto updates when SW changes
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'OwePal',
        short_name: 'OwePal',
        description: 'Friendly app to track and manage what you owe — OwePal.',
        theme_color: '#0A4DAB',             // bank-like blue
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // Cache API calls (Network First)
            urlPattern: /^https:\/\/your-api-domain\.com\/.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 1 day
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Static assets (Cache First)
            urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'asset-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            // Fonts
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true, // enable PWA during `vite` dev (optional)
      }
    })
  ]
})
