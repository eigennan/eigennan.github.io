import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url))
const source = fileURLToPath(
  new URL("../src/assets/avatar.png", import.meta.url),
)

/* The portrait is a 4002x4002 head-and-shoulders frame and a tab paints the
   icon at 16px, so crop to the head before downscaling or the face turns to
   mush. Tuned by eye against the rendered 32px output -- adjust here, not per
   size. */
const FACE_CROP = { left: 510, top: 0, width: 2800, height: 2800 }

/* Maskable icons may be clipped to a circle of 80% diameter, and this frame has
   little headroom above the hair. Sit lower and wider than FACE_CROP so the
   face survives the mask even where the crown does not. */
const MASKABLE_CROP = { left: 430, top: 50, width: 2900, height: 2900 }

function face(crop, size) {
  return sharp(source).extract(crop).resize(size, size)
}

/** Mask that turns everything outside the inscribed circle transparent. */
function circleMask(size) {
  const radius = size / 2
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="#fff"/></svg>`,
  )
}

/* The tab icon, matching how Avatar.astro already renders this photo. Lanczos
   down to 16px leaves the face soft, so sharpen gently -- the default sigma
   halos at that size. */
function renderCircle(size) {
  return face(FACE_CROP, size)
    .sharpen({ sigma: 0.6 })
    .ensureAlpha()
    .composite([{ input: circleMask(size), blend: "dest-in" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
}

/* Full bleed, no transparency: iOS composites transparent pixels on black and
   applies its own mask, and maskable manifest icons must fill the square.
   Adaptive filtering roughly halves a photograph losslessly; sharp's `effort`
   would halve it again but quietly implies palette:true, which dithers visible
   grain into the skin and the blurred background. */
function renderSquare(crop, size) {
  return face(crop, size).png({ compressionLevel: 9, adaptiveFiltering: true })
}

function createIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  const directory = Buffer.alloc(images.length * 16)
  let offset = header.length + directory.length

  images.forEach(({ data, size }, index) => {
    const entryOffset = index * 16
    directory.writeUInt8(size === 256 ? 0 : size, entryOffset)
    directory.writeUInt8(size === 256 ? 0 : size, entryOffset + 1)
    directory.writeUInt8(0, entryOffset + 2)
    directory.writeUInt8(0, entryOffset + 3)
    directory.writeUInt16LE(1, entryOffset + 4)
    directory.writeUInt16LE(32, entryOffset + 6)
    directory.writeUInt32LE(data.length, entryOffset + 8)
    directory.writeUInt32LE(offset, entryOffset + 12)
    offset += data.length
  })

  return Buffer.concat([header, directory, ...images.map(({ data }) => data)])
}

await Promise.all([
  renderCircle(96).toFile(`${publicDirectory}favicon-96x96.png`),
  renderSquare(FACE_CROP, 180).toFile(`${publicDirectory}apple-touch-icon.png`),
  renderSquare(MASKABLE_CROP, 192).toFile(
    `${publicDirectory}web-app-manifest-192x192.png`,
  ),
  renderSquare(MASKABLE_CROP, 512).toFile(
    `${publicDirectory}web-app-manifest-512x512.png`,
  ),
])

const icoImages = await Promise.all(
  [16, 32, 48].map(async (size) => ({
    size,
    data: await renderCircle(size).toBuffer(),
  })),
)

await writeFile(`${publicDirectory}favicon.ico`, createIco(icoImages))
