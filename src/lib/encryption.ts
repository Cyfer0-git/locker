'use client';

// This file assumes CryptoJS is loaded from a script tag in layout.tsx
declare const CryptoJS: any;

const SALT = "secure-data-manager-static-salt"; // A static salt is acceptable for this use case

/**
 * Derives a key from the master password using PBKDF2.
 * @param password The user's master password.
 * @returns The derived key as a string.
 */
export function deriveKey(password: string): string {
  if (typeof CryptoJS === 'undefined') {
    console.error('CryptoJS not loaded');
    return '';
  }
  const key = CryptoJS.PBKDF2(password, SALT, { keySize: 256 / 32, iterations: 1000 });
  return key.toString();
}

/**
 * Encrypts a piece of text using the provided key.
 * @param text The plaintext to encrypt.
 * @param key The encryption key.
 * @returns The encrypted ciphertext.
 */
export function encrypt(text: string, key: string): string {
  if (typeof CryptoJS === 'undefined') {
    console.error('CryptoJS not loaded');
    return '';
  }
  if (!key) throw new Error("Encryption key is missing.");
  return CryptoJS.AES.encrypt(text, key).toString();
}

/**
 * Decrypts a piece of ciphertext using the provided key.
 * @param encryptedText The ciphertext to decrypt.
 * @param key The decryption key.
 * @returns The original plaintext.
 */
export function decrypt(encryptedText: string, key: string): string {
  if (typeof CryptoJS === 'undefined') {
    console.error('CryptoJS not loaded');
    return '';
  }
  if (!key) throw new Error("Decryption key is missing.");
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) {
      throw new Error("Decryption resulted in empty string. Wrong password?");
    }
    return originalText;
  } catch (e) {
    console.error("Decryption error:", e);
    throw new Error("Decryption failed. The master password may be incorrect or the data is corrupt.");
  }
}
