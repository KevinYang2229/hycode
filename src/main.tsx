import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainApp from './MainApp.tsx'

console.log('🚀 main.tsx 開始執行')

const root = document.getElementById('root');
console.log('📍 root element:', root)

if (!root) {
  console.error('❌ 無法找到 root element')
  throw new Error('Failed to find root element');
}

console.log('✅ 開始 render MainApp')

try {
  createRoot(root).render(
    <StrictMode>
      <MainApp />
    </StrictMode>,
  )
  console.log('✅ render 成功')
} catch (error) {
  console.error('❌ render 失敗:', error)
  throw error
}
