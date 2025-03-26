// api/counter.js
import { kv } from '@vercel/kv';

// 这里我们约定使用不同 key 来存储各个计数器
// 例如：memorial:candle, memorial:flower, memorial:incense
export default async function handler(req, res) {
  const { type } = req.query; // type 可能为 'candle', 'flower', 'incense'
  if (!type) return res.status(400).json({ error: '缺少计数器类型' });

  if (req.method === 'GET') {
    // 获取当前计数
    const count = await kv.get(`memorial:${type}`) || 0;
    return res.status(200).json({ count });
  }

  if (req.method === 'POST') {
    // 累加计数
    const currentCount = await kv.get(`memorial:${type}`) || 0;
    const newCount = currentCount + 1;
    await kv.set(`memorial:${type}`, newCount);
    return res.status(200).json({ count: newCount });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
