import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { type } = req.query; // 确保前端传入的类型是正确的
  if (!type || !['candle', 'flower', 'incense'].includes(type)) {
    return res.status(400).json({ error: '无效的计数类型' });
  }

  try {
    // 获取计数
    if (req.method === 'GET') {
      const count = (await kv.get(`memorial:${type}`)) || 0;
      return res.status(200).json({ count });
    }

    // 累加计数
    if (req.method === 'POST') {
      const currentCount = (await kv.get(`memorial:${type}`)) || 0;
      const newCount = currentCount + 1;
      await kv.set(`memorial:${type}`, newCount);
      return res.status(200).json({ count: newCount });
    }

    return res.status(405).json({ error: '不允许的方法' });
  } catch (error) {
    console.error('计数器 API 发生错误:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
}
