
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 模拟数据库
let db = {
  counters: {
    candle: 0,
    flower: 0,
    incense: 0
  },
  messages: []
};

// 获取计数器数据
app.get('/counter', (req, res) => {
  const type = req.query.type;
  if (db.counters[type] !== undefined) {
    res.json({ count: db.counters[type] });
  } else {
    res.status(404).json({ error: 'Counter type not found' });
  }
});

// 更新计数器数据
app.post('/counter', (req, res) => {
  const type = req.body.type;
  if (db.counters[type] !== undefined) {
    db.counters[type]++;
    res.json({ count: db.counters[type] });
  } else {
    res.status(404).json({ error: 'Counter type not found' });
  }
});

// 获取留言列表
app.get('/messages', (req, res) => {
  res.json({ messages: db.messages });
});

// 发送留言
app.post('/messages', (req, res) => {
  const message = req.body.message;
  if (message && typeof message === 'string') {
    db.messages.push(message);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid message format' });
  }
});

module.exports = app;
