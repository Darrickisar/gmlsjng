// /api/messages.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // 获取留言列表
  if (req.method === 'GET') {
    const messages = await kv.get('memorial:messages') || [];
    return res.status(200).json({ messages });
  }

  // 添加留言
  if (req.method === 'POST') {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: '留言不能为空' });
    }
    let messages = await kv.get('memorial:messages') || [];
    messages.push(message);
    await kv.set('memorial:messages', messages);
    return res.status(200).json({ messages });
  }

  // 删除留言
  if (req.method === 'DELETE') {
    const { index } = req.body;
    let messages = await kv.get('memorial:messages') || [];
    messages.splice(index, 1);
    await kv.set('memorial:messages', messages);
    return res.status(200).json({ messages });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
