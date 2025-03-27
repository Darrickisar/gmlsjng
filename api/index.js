const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // 添加 CORS 支持
const { Blob } = require('@vercel/blob');

const app = express();
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json());

// 初始化 Blob 实例
const blob = new Blob({
  projectId:"prj_bfvK4fHtcklMayiHZEhNkEOBRpfx",
  token: "vercel_blob_rw_XUNFJUgwGuo8v8MC_ETEualt4YVHQJOGCiI9N53Qdhkqj2G"
});

// 获取计数器数据
app.get('/counter', async (req, res) => {
  const type = req.query.type;
  try {
    let counterData = {};
    try {
      counterData = await blob.readJSON('counters.json');
    } catch (err) {
      // 如果文件不存在，则初始化为空对象
      counterData = {};
    }

    if (counterData[type] !== undefined) {
      res.json({ count: counterData[type] });
    } else {
      res.status(404).json({ error: 'Counter type not found' });
    }
  } catch (error) {
    console.error('Error reading counters:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 更新计数器数据
app.post('/counter', async (req, res) => {
  const type = req.body.type;
  try {
    let counterData = {};
    try {
      counterData = await blob.readJSON('counters.json');
    } catch (err) {
      // 如果文件不存在，则初始化为空对象
      counterData = {};
    }

    if (counterData[type] === undefined) {
      counterData[type] = 0;
    }
    counterData[type]++;

    await blob.write('counters.json', JSON.stringify(counterData), {
      contentType: 'application/json'
    });

    res.json({ count: counterData[type] });
  } catch (error) {
    console.error('Error updating counters:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 获取留言列表
app.get('/messages', async (req, res) => {
  try {
    let messagesData = [];
    try {
      messagesData = await blob.readJSON('messages.json');
    } catch (err) {
      // 如果文件不存在，则初始化为空数组
      messagesData = [];
    }

    res.json({ messages: messagesData });
  } catch (error) {
    console.error('Error reading messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 发送留言
app.post('/messages', async (req, res) => {
  const message = req.body.message;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  try {
    let messagesData = [];
    try {
      messagesData = await blob.readJSON('messages.json');
    } catch (err) {
      // 如果文件不存在，则初始化为空数组
      messagesData = [];
    }

    messagesData.push(message);

    await blob.write('messages.json', JSON.stringify(messagesData), {
      contentType: 'application/json'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error writing messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = app;
