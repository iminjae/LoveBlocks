import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     NodeGlobalsPolyfillPlugin({
//       buffer: true // 'buffer' 모듈 폴리필이 필요한 경우 활성화
//     })
//   ],
//   resolve: {
//     alias: {
//       // 폴리필이 필요한 모듈을 브라우저 호환 버전으로 매핑
//       'crypto': 'crypto-browserify',
//       'stream': 'stream-browserify',
//       // 다른 필요한 폴리필도 여기에 추가
//     }
//   },
//   define: {
//     'process.env': {},
//     'global': 'window' // global을 window로 매핑
//   },
//   build: {
//     rollupOptions: {
//       plugins: [
//         // 필요한 추가 Rollup 플러그인
//       ]
//     }
//   }
// })