import CryptoJS from 'crypto-js';

export const encrypt = (data: string) =>
  CryptoJS.AES.encrypt(data, process.env.SECRET_KEY).toString();

export const decrypt = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
