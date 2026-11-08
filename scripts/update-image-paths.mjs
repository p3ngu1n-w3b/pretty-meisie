import { readFileSync, writeFileSync } from 'fs'

let src = readFileSync('src/data/products.ts', 'utf8')
src = src.replace(/id: '([^']+)',([\s\S]*?)image: '\/products\/[^']+'/g, (_, id, mid) => {
  return `id: '${id}',${mid}image: '/products/${id}.webp'`
})
writeFileSync('src/data/products.ts', src)
console.log('webp paths:', (src.match(/\.webp'/g) || []).length)
