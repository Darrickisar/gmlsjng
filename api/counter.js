import { put, get } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const { type } = req.query;
    const validTypes = ['candle', 'flower', 'incense'];

    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: '无效的计数类型' });
    }

    const blobPath = `memorial/${type}.json`;

    // 读取当前计数
    let countData = await get(blobPath);
    let count = 0;

    if (countData) {
      try {
        count = JSON.parse(await countData.text()).count || 0;
      } catch (err) {
        console.error('JSON 解析错误:', err);
        count = 0;
      }
    }

    if (req.method === 'GET') {
      return res.status(200).json({ count });
    }

    if (req.method === 'POST') {
      count++;
      await put(blobPath, JSON.stringify({ count }), {
        access: 'public',
      });

      return res.status(200).json({ count });
    }

    return res.status(405).json({ error: '不允许的方法' });
  } catch (error) {
    console.error('API 发生错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
