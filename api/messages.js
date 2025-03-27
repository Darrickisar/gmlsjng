// pages/api/messages.js
import { Blob } from '@vercel/blob';

const blob = new Blob();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = await req.json();
    // 保存新留言
    let messages = await blob.get('messages');
    messages = messages ? JSON.parse(messages) : [];
    messages.push(message);
    await blob.set('messages', JSON.stringify(messages));
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    // 获取所有留言
    const messages = await blob.get('messages');
    res.status(200).json({ messages: messages ? JSON.parse(messages) : [] });
  } else {
    res.status(405).end();
  }
}
