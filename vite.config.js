import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon-96x96.png',
        'apple-icon-180x180.png',
        'robots.txt'
      ],
      manifest: {
        name: 'OwePal',
        short_name: 'OwePal',
        description: 'Friendly app to track and manage what you owe — OwePal.',
        theme_color: '#0A4DAB',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png'
          },
          {
            src: '/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: '/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/apple-icon-180x180.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-domain\.com\/.*$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'asset-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          },
          {
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
        enabled: true
      }
    })
  ]
})
