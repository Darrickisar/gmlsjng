// pages/api/counter.js
import { Blob } from '@vercel/blob';

const blob = new Blob();

export default async function handler(req, res) {
  const { type } = req.query;
  if (req.method === 'POST') {
    // 递增计数
    let count = await blob.get(type);
    count = count ? parseInt(count) : 0;
    count += 1;
    await blob.set(type, count.toString());
    res.status(200).json({ count });
  } else if (req.method === 'GET') {
    // 获取当前计数
    const count = await blob.get(type);
    res.status(200).json({ count: count ? parseInt(count) : 0 });
  } else {
    res.status(405).end();
  }
}
