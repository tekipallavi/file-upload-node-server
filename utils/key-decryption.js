const crypto = require('crypto');

// Secret key
const secretKey = 'pallavi';

// Encryption function
function encrypt(text, key) {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, crypto.scryptSync(key, 'salt', 32), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Combine IV and encrypted text
}



function decrypt(encryptedText, key) {
    const algorithm = 'aes-256-cbc';
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, crypto.scryptSync(key, 'salt', 32), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}



module.exports = { encrypt, decrypt };
