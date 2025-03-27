import { put, get } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    const blobPath = 'memorial/messages.json';

    // 获取留言列表
    let messagesData = await get(blobPath);
    let messages = [];

    if (messagesData) {
      try {
        messages = JSON.parse(await messagesData.text());
      } catch (err) {
        console.error('留言 JSON 解析错误:', err);
        messages = [];
      }
    }

    if (req.method === 'GET') {
      return res.status(200).json({ messages });
    }

    if (req.method === 'POST') {
      const body = await req.json(); // 确保解析 JSON
      const { message } = body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ error: '留言不能为空' });
      }

      messages.push({ text: message, time: new Date().toISOString() });

      await put(blobPath, JSON.stringify(messages), {
        access: 'public',
      });

      return res.status(200).json({ messages });
    }

    return res.status(405).json({ error: '不允许的方法' });
  } catch (error) {
    console.error('API 发生错误:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
