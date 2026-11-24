// Minimal QR Code generator — renders to a Canvas element.
// Implements QR Code Model 2 with error correction level M.
// No dependencies.

const EC_LEVEL = 0 // 0=M (15% recovery)

// Galois field GF(256) with primitive polynomial 0x11d
const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
;(() => {
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP[i] = x
    LOG[x] = i
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0)
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]
})()

function gfMul(a, b) {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]
}

function polyMul(a, b) {
  const r = new Uint8Array(a.length + b.length - 1)
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < b.length; j++)
      r[i + j] ^= gfMul(a[i], b[j])
  return r
}

function polyRem(dividend, divisor) {
  const r = new Uint8Array(dividend)
  for (let i = 0; i < dividend.length - divisor.length + 1; i++) {
    if (r[i] === 0) continue
    for (let j = 1; j < divisor.length; j++)
      r[i + j] ^= gfMul(divisor[j], r[i])
  }
  return r.slice(dividend.length - divisor.length + 1)
}

function generatorPoly(n) {
  let g = new Uint8Array([1])
  for (let i = 0; i < n; i++)
    g = polyMul(g, new Uint8Array([1, EXP[i]]))
  return g
}

// Version info: [version, totalCodewords, ecCodewordsPerBlock, numBlocks]
const VERSION_TABLE = [
  null,
  [1, 26, 10, 1], [2, 44, 16, 1], [3, 70, 26, 1], [4, 100, 18, 2],
  [5, 134, 24, 2], [6, 86+86, 16, 4], [7, 196, 18, 4], [8, 242, 22, 4],
  [9, 292, 22, 5], [10, 346, 26, 5], [11, 404, 30, 5], [12, 466, 22, 8],
  [13, 532, 22, 9], [14, 581, 24, 9], [15, 655, 24, 10], [16, 733, 28, 10],
  [17, 815, 28, 11], [18, 901, 26, 13], [19, 991, 26, 14], [20, 1085, 26, 16],
]

// Data capacity (bytes) for byte mode, EC level M
const CAPACITY = [
  0, 14, 26, 42, 62, 84, 106, 122, 152, 180, 213, 251, 287, 331, 362, 412, 450, 504, 560, 611, 661,
]

function chooseVersion(dataLen) {
  for (let v = 1; v <= 20; v++) {
    if (dataLen <= CAPACITY[v]) return v
  }
  throw new Error('Data too long for QR code')
}

function encodeData(text, version) {
  const info = VERSION_TABLE[version]
  const totalCodewords = info[1]
  const ecPerBlock = info[2]
  const numBlocks = info[3]
  const dataCodewords = totalCodewords - ecPerBlock * numBlocks

  // Byte mode encoding
  const bytes = new TextEncoder().encode(text)
  const bits = []
  const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1) }

  push(0b0100, 4) // byte mode indicator
  push(bytes.length, version >= 10 ? 16 : 8) // character count
  for (const b of bytes) push(b, 8)

  // Terminator + padding
  const totalBits = dataCodewords * 8
  const termLen = Math.min(4, totalBits - bits.length)
  push(0, termLen)
  while (bits.length % 8 !== 0) bits.push(0)
  const pad = [0xec, 0x11]
  let pi = 0
  while (bits.length < totalBits) {
    push(pad[pi], 8)
    pi ^= 1
  }

  // Convert to bytes
  const data = new Uint8Array(dataCodewords)
  for (let i = 0; i < dataCodewords; i++) {
    let byte = 0
    for (let b = 0; b < 8; b++) byte = (byte << 1) | (bits[i * 8 + b] || 0)
    data[i] = byte
  }

  // Split into blocks and compute EC
  const blockSize = Math.floor(dataCodewords / numBlocks)
  const longBlocks = dataCodewords % numBlocks
  const gen = generatorPoly(ecPerBlock)

  const dataBlocks = []
  const ecBlocks = []
  let offset = 0
  for (let i = 0; i < numBlocks; i++) {
    const size = blockSize + (i >= numBlocks - longBlocks ? 1 : 0)
    const block = data.slice(offset, offset + size)
    dataBlocks.push(block)
    offset += size

    const padded = new Uint8Array(size + ecPerBlock)
    padded.set(block)
    ecBlocks.push(polyRem(padded, gen))
  }

  // Interleave
  const result = []
  const maxDataLen = blockSize + (longBlocks > 0 ? 1 : 0)
  for (let i = 0; i < maxDataLen; i++)
    for (const block of dataBlocks)
      if (i < block.length) result.push(block[i])
  for (let i = 0; i < ecPerBlock; i++)
    for (const block of ecBlocks)
      result.push(block[i])

  return new Uint8Array(result)
}

function createMatrix(version) {
  const size = version * 4 + 17
  const matrix = Array.from({ length: size }, () => new Int8Array(size)) // 0=unset, 1=black, -1=white
  const reserved = Array.from({ length: size }, () => new Uint8Array(size))

  function setModule(r, c, val) {
    matrix[r][c] = val ? 1 : -1
    reserved[r][c] = 1
  }

  // Finder patterns
  function finderPattern(row, col) {
    for (let r = -1; r <= 7; r++)
      for (let c = -1; c <= 7; c++) {
        const rr = row + r, cc = col + c
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue
        const inOuter = r === 0 || r === 6 || c === 0 || c === 6
        const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
        setModule(rr, cc, inOuter || inInner)
      }
  }

  finderPattern(0, 0)
  finderPattern(0, size - 7)
  finderPattern(size - 7, 0)

  // Alignment patterns
  if (version >= 2) {
    const positions = alignmentPositions(version)
    for (const r of positions)
      for (const c of positions) {
        if (reserved[r]?.[c]) continue
        for (let dr = -2; dr <= 2; dr++)
          for (let dc = -2; dc <= 2; dc++)
            setModule(r + dr, c + dc, Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0))
      }
  }

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    setModule(6, i, i % 2 === 0)
    setModule(i, 6, i % 2 === 0)
  }

  // Dark module
  setModule(size - 8, 8, true)

  // Reserve format info areas
  for (let i = 0; i < 8; i++) {
    reserved[8][i] = 1; reserved[8][size - 1 - i] = 1
    reserved[i][8] = 1; reserved[size - 1 - i][8] = 1
  }
  reserved[8][8] = 1

  // Reserve version info areas (version >= 7)
  if (version >= 7) {
    for (let i = 0; i < 6; i++)
      for (let j = 0; j < 3; j++) {
        reserved[i][size - 11 + j] = 1
        reserved[size - 11 + j][i] = 1
      }
  }

  return { matrix, reserved, size }
}

function alignmentPositions(version) {
  if (version === 1) return []
  const intervals = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (Math.floor(version / 7) * 2 + 2)) * 2
  const positions = [6]
  let pos = version * 4 + 10
  while (pos > 6 + intervals) { positions.unshift(pos); pos -= intervals }
  positions.unshift(pos)
  positions.unshift(6)
  return [...new Set(positions)].sort((a, b) => a - b)
}

function placeData(matrix, reserved, size, codewords) {
  let bitIndex = 0
  const getBit = () => {
    if (bitIndex >= codewords.length * 8) return 0
    const byte = codewords[bitIndex >> 3]
    const bit = (byte >> (7 - (bitIndex & 7))) & 1
    bitIndex++
    return bit
  }

  let upward = true
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5 // skip timing column
    for (let vert = 0; vert < size; vert++) {
      const row = upward ? size - 1 - vert : vert
      for (let j = 0; j < 2; j++) {
        const col = right - j
        if (reserved[row][col]) continue
        matrix[row][col] = getBit() ? 1 : -1
      }
    }
    upward = !upward
  }
}

const MASK_FNS = [
  (r, c) => (r + c) % 2 === 0,
  (r, c) => r % 2 === 0,
  (r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
  (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0,
]

function applyMask(matrix, reserved, size, maskIndex) {
  const fn = MASK_FNS[maskIndex]
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (!reserved[r][c] && fn(r, c))
        matrix[r][c] *= -1
}

// Format info (EC level M = 00)
const FORMAT_BITS = [
  0x5412, 0x5125, 0x5E7C, 0x5B4B, 0x45F9, 0x40CE, 0x4F97, 0x4AA0,
  0x77C4, 0x72F3, 0x7DAA, 0x789D, 0x662F, 0x6318, 0x6C41, 0x6976,
]

function placeFormatInfo(matrix, size, maskIndex) {
  const bits = FORMAT_BITS[maskIndex] // EC level M (bits 00) + mask
  const coords1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]]
  const coords2 = []
  for (let i = 0; i < 7; i++) coords2.push([size - 1 - i, 8])
  for (let i = 0; i < 8; i++) coords2.push([8, size - 8 + i])

  for (let i = 0; i < 15; i++) {
    const bit = (bits >> (14 - i)) & 1
    const val = bit ? 1 : -1
    const [r1, c1] = coords1[i]
    matrix[r1][c1] = val
    const [r2, c2] = coords2[i]
    matrix[r2][c2] = val
  }
}

function penalty(matrix, size) {
  let score = 0
  // Rule 1: runs of same color
  for (let r = 0; r < size; r++) {
    let run = 1
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === matrix[r][c - 1]) { run++; if (run === 5) score += 3; else if (run > 5) score++ }
      else run = 1
    }
  }
  for (let c = 0; c < size; c++) {
    let run = 1
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === matrix[r - 1][c]) { run++; if (run === 5) score += 3; else if (run > 5) score++ }
      else run = 1
    }
  }
  // Rule 2: 2x2 blocks
  for (let r = 0; r < size - 1; r++)
    for (let c = 0; c < size - 1; c++) {
      const v = matrix[r][c]
      if (v === matrix[r][c + 1] && v === matrix[r + 1][c] && v === matrix[r + 1][c + 1]) score += 3
    }
  return score
}

function generateQR(text) {
  const version = chooseVersion(new TextEncoder().encode(text).length)
  const codewords = encodeData(text, version)
  let bestMatrix, bestScore = Infinity

  for (let mask = 0; mask < 8; mask++) {
    const { matrix, reserved, size } = createMatrix(version)
    placeData(matrix, reserved, size, codewords)
    applyMask(matrix, reserved, size, mask)
    placeFormatInfo(matrix, size, mask)

    const score = penalty(matrix, size)
    if (score < bestScore) {
      bestScore = score
      bestMatrix = { matrix, size }
    }
  }

  return bestMatrix
}

export function renderQRToCanvas(canvas, text, pixelSize = 8, quietZone = 4) {
  const { matrix, size } = generateQR(text)
  const totalSize = size + quietZone * 2
  const canvasSize = totalSize * pixelSize

  canvas.width = canvasSize
  canvas.height = canvasSize

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvasSize, canvasSize)

  ctx.fillStyle = '#000000'
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (matrix[r][c] === 1)
        ctx.fillRect((c + quietZone) * pixelSize, (r + quietZone) * pixelSize, pixelSize, pixelSize)
}
