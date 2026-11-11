const PASSPHRASE =
  import.meta.env.VITE_SECURITY_PAYLOAD_KEY ?? 'MedisinSecretKey2026PayloadAES!'

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

async function getCryptoKey() {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(PASSPHRASE),
  )
  return crypto.subtle.importKey('raw', digest, { name: 'AES-CBC' }, false, [
    'encrypt',
  ])
}

/**
 * Encrypt a payload value with AES-256-CBC using a random 16-byte IV,
 * outputting Base64(IV + ciphertext) so it matches the backend
 * SecurityService (sha256(passphrase) as key, PKCS7 padding).
 */
export async function encryptPayload(value) {
  const key = await getCryptoKey()
  const iv = crypto.getRandomValues(new Uint8Array(16))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    new TextEncoder().encode(value),
  )

  const combined = new Uint8Array(16 + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), 16)

  return toBase64(combined)
}
