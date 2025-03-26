import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const messages = (await kv.get('memorial:messages')) || [];
      return res.status(200).json({ messages });
    }

    if (req.method === 'POST') {
      const { message } = req.body;
      if (!message || message.trim() === '') {
        return res.status(400).json({ error: '留言不能为空' });
      }
      let messages = (await kv.get('memorial:messages')) || [];
      messages.push(message);
      await kv.set('memorial:messages', messages);
      return res.status(200).json({ messages });
    }

    if (req.method === 'DELETE') {
      const { index } = req.body;
      let messages = (await kv.get('memorial:messages')) || [];
      messages.splice(index, 1);
      await kv.set('memorial:messages', messages);
      return res.status(200).json({ messages });
    }

    return res.status(405).json({ error: '不允许的方法' });
  } catch (error) {
    console.error('留言 API 发生错误:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
}
