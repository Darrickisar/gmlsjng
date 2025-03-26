// api/messages.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // 从 KV 中获取留言列表
    const messages = await kv.get('memorial:messages') || [];
    return res.status(200).json({ messages });
  }

  if (req.method === 'POST') {
    // 添加留言，假设请求体为 { message: '留言内容' }
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: '留言不能为空' });

    let messages = await kv.get('memorial:messages') || [];
    messages.push(message);
    await kv.set('memorial:messages', messages);
    return res.status(200).json({ messages });
  }

  if (req.method === 'DELETE') {
    // 删除留言（需要密码验证等，这里简化处理）
    const { index } = req.body;
    let messages = await kv.get('memorial:messages') || [];
    messages.splice(index, 1);
    await kv.set('memorial:messages', messages);
    return res.status(200).json({ messages });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
