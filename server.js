const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 处理 API 请求
app.use('/api', require('./api/index'));

// 所有其他路由返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
