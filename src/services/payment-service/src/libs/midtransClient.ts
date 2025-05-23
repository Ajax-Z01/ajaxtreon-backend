import axios from 'axios';
import { Buffer } from 'buffer';

const isProduction = false;
const BASE_URL = isProduction
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com';

function getAxiosInstance() {
  const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
  if (!MIDTRANS_SERVER_KEY) {
    throw new Error('MIDTRANS_SERVER_KEY is not defined in environment variables');
  }

  const encodedKey = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString('base64');

  return axios.create({
    baseURL: `${BASE_URL}/snap/v1`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedKey}`,
    },
  });
}

export default {
  postTransaction: async function (payload: any) {
    const axiosInstance = getAxiosInstance();
    const res = await axiosInstance.post('/transactions', payload);
    return res.data;
  }
};
