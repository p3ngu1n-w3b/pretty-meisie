/**
 * Crop individual product photos from catalogue page PNGs.
 * Excludes SALE PRICE / description text — photo region only.
 */
import sharp from 'sharp'
import { mkdirSync, readdirSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public', 'products')
const pagesDir = join(root, 'content', 'page-renders')

const PAGE_W = 2020
const PAGE_H = 2861

/** Standard product pages: 3 columns × 2 rows, photo-only crop per cell */
const GRID = {
  left: 100,
  right: 100,
  top: 400,
  bottom: 220,
  cols: 3,
  rows: 2,
  padX: 40,
  photoRatio: 0.3,
  padTopRow0: 30,
  padTopRow1: 55,
}

/** Visual slot order (row-major) → product ids per page */
const PAGE_PRODUCTS = {
  3: [
    'extreme-coverage-foundation',
    '48hr-matte-foundation',
    'under-eye-concealer-stick',
    'hydrating-serum-foundation',
    'umuhle-48hr-matte-foundation',
    'contour-stick',
  ],
  4: [
    'colour-corrector',
    'luminous-foundation',
    'barely-there-skin-tint',
    'umuhle-extreme-coverage',
    'umuhle-hydrating-foundation',
    'umuhle-luminous-foundation',
  ],
  5: [
    'radiant-day-night-cream',
    'hypochlorous-acid-spray',
    'advanced-face-cleanser',
    'complete-control-vitamin-c-serum',
    'advanced-day-night-cream',
    'vitamin-c-cleanser',
  ],
  6: [
    'micellar-cleansing-water',
    'hyaluronic-gel-moisturiser',
    'luxury-face-cleansing-cloth',
    'eye-cream-retinol',
    'brightening-hydrating-serum',
    'advanced-vitamin-c-serum',
  ],
  7: [
    'glass-skin-pdrn-mist',
    'advanced-retinol-serum',
    'eye-cream-vitamin-c',
    'salicylic-blemish-cream-gel',
    'teen-balancing-gel-cream',
    'salicylic-face-cleanser',
  ],
  8: [
    'gentle-teen-adult-cleanser',
    'dermal-barrier-recovery-cream',
    'teen-repair-reset-serum',
    'thick-creamy-day-night',
    'lip-matte-gloss-refill',
    'glow-exfoliating-serum',
  ],
  9: [
    'liquid-lip-matte-gloss-liner',
    'liquid-blush',
    'colour-changing-lip-tint',
    'extreme-volume-mascara',
    'single-refills',
    'eye-pencils',
  ],
  10: [
    'essentials-matte-palette',
    'black-liquid-pen-eyeliner',
    'let-it-glow-palette',
    'liquid-gold-palette',
    'peach-perfect-palette',
    'eye-see-blue-palette',
  ],
  11: [
    'pink-patootie-palette',
    'gold-diggin-honey-palette',
    'evergreen-queen-palette',
    'loose-setting-powder',
    'long-stay-setting-spray',
    'your-majesty-palette',
  ],
  12: [
    'grip-primer',
    'oil-sweat-block-primer',
    'spf50-primer',
    'brow-tattoo',
    'powder-puff-set',
    'pressed-powder-palette',
  ],
  13: [
    'brow-lamination-gel',
    'radiant-shimmer-tanning-lotion',
    'deep-moisturising-body-wash',
    'body-tan-mousse',
    'lactic-acid-body-lotion',
    'coochie-fresh-gel',
  ],
  14: [
    'advanced-body-butter',
    'hair-growth-repair-mask',
    'micellar-cloths-pack',
    'batana-oil-hair-mask',
    'raw-batana-butter-oil',
    'hair-growth-shampoo',
  ],
  // Page 15: unique catalogue items use slots 0, 1, 5 (others are re-features)
  15: {
    mode: 'slots',
    items: [
      { id: 'batana-oil-shampoo', slot: 0 },
      { id: 'hair-growth-serum', slot: 1 },
      { id: 'pure-beauty-collagen', slot: 5 },
    ],
  },
}

function gridRect(slotIndex) {
  const { left, right, top, bottom, cols, rows, padX, photoRatio, padTopRow0, padTopRow1 } = GRID
  const cw = PAGE_W - left - right
  const ch = PAGE_H - top - bottom
  const cellW = Math.floor(cw / cols)
  const cellH = Math.floor(ch / rows)
  const r = Math.floor(slotIndex / cols)
  const c = slotIndex % cols
  const padTop = r === 0 ? padTopRow0 : padTopRow1
  return {
    left: left + c * cellW + padX,
    top: top + r * cellH + padTop,
    width: cellW - padX * 2,
    height: Math.floor(cellH * photoRatio),
  }
}

async function cropToWebp(pagePath, region, outPath) {
  await sharp(pagePath).extract(region).webp({ quality: 88 }).toFile(outPath)
}

async function cropCombos() {
  const page = join(pagesDir, 'page-2.png')
  // Left lifestyle product photo only (no R499 / R399 text panel)
  await cropToWebp(
    page,
    { left: 140, top: 500, width: 820, height: 740 },
    join(outDir, 'skincare-combo.webp'),
  )
  await cropToWebp(
    page,
    { left: 140, top: 1400, width: 820, height: 740 },
    join(outDir, 'makeup-combo.webp'),
  )
  console.log('cropped combos from page 2')
}

async function cropGridPage(pageNum, config) {
  const pagePath = join(pagesDir, `page-${pageNum}.png`)
  if (Array.isArray(config)) {
    for (let i = 0; i < config.length; i++) {
      await cropToWebp(pagePath, gridRect(i), join(outDir, `${config[i]}.webp`))
    }
    console.log(`cropped page ${pageNum}: ${config.length} products`)
    return
  }
  for (const { id, slot } of config.items) {
    await cropToWebp(pagePath, gridRect(slot), join(outDir, `${id}.webp`))
  }
  console.log(`cropped page ${pageNum}: ${config.items.length} slotted products`)
}

function cleanupProbesAndPages() {
  const probe = join(outDir, '_probe')
  try {
    for (const f of readdirSync(probe)) unlinkSync(join(probe, f))
  } catch {
    /* no probe dir */
  }

  // Keep page PNGs for re-crop; UI will not reference them.
}

async function main() {
  mkdirSync(outDir, { recursive: true })
  await cropCombos()
  for (const [page, ids] of Object.entries(PAGE_PRODUCTS)) {
    await cropGridPage(Number(page), ids)
  }
  cleanupProbesAndPages()
  console.log('done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
