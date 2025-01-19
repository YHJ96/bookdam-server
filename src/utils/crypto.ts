import crypto from 'crypto';

export const encrypt = (data: string) => {
  const algorithm = 'aes-256-ccm';
  const key = process.env.SECRET_KEY;
  const nonce = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(key, 'utf-8'),
    nonce,
    { authTagLength: 16 },
  );
  const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return (
    nonce.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
  );
};
