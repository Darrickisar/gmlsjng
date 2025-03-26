// /api/counter.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { type } = req.query; // type 应该为 candle, flower, 或 incense
  if (!type) {
    return res.status(400).json({ error: '缺少计数器类型' });
  }

  // 获取计数值
  if (req.method === 'GET') {
    const count = await kv.get(`memorial:${type}`) || 0;
    return res.status(200).json({ count });
  }

  // 累加计数
  if (req.method === 'POST') {
    const currentCount = await kv.get(`memorial:${type}`) || 0;
    const newCount = currentCount + 1;
    await kv.set(`memorial:${type}`, newCount);
    return res.status(200).json({ count: newCount });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
