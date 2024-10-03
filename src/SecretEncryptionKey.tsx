export interface SecretEncryptionKey {
    encrypt(plaintext: Uint8Array): Promise<Uint8Array>;
    decrypt(ciphertext: Uint8Array): Promise<Uint8Array>;
}