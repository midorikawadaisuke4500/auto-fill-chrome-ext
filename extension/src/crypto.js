// Crypto utility for AES-256-GCM encryption
// Uses Web Crypto API

const CryptoUtil = {
    // Generate a key from a master password and salt using PBKDF2
    async deriveKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    },

    // Encrypt a plaintext string using the derived key
    async encryptData(key, plaintext) {
        const enc = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM

        const ciphertextBuffer = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            enc.encode(plaintext)
        );

        // Combine IV and ciphertext, then base64 encode for storage
        const combinedArray = new Uint8Array(iv.length + ciphertextBuffer.byteLength);
        combinedArray.set(iv, 0);
        combinedArray.set(new Uint8Array(ciphertextBuffer), iv.length);

        // Convert to base64
        return btoa(String.fromCharCode.apply(null, combinedArray));
    },

    // Decrypt a base64 encoded payload using the derived key
    async decryptData(key, encryptedBase64) {
        // Convert base64 back to Uint8Array
        const binaryStr = atob(encryptedBase64);
        const combinedArray = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            combinedArray[i] = binaryStr.charCodeAt(i);
        }

        const iv = combinedArray.slice(0, 12);
        const ciphertext = combinedArray.slice(12);

        try {
            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: iv
                },
                key,
                ciphertext
            );

            const dec = new TextDecoder();
            return dec.decode(decryptedBuffer);
        } catch (e) {
            console.error("Decryption failed. Incorrect password or corrupted data.");
            return null;
        }
    }
};

// Export for module usage or global scope attachment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoUtil;
} else if (typeof window !== 'undefined') {
    window.CryptoUtil = CryptoUtil;
}
