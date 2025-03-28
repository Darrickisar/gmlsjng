import React from 'react';
import ReactDOM from 'react-dom';
import 'src/styles.css'; // 引入样式文件

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>革命烈士线上纪念馆</h1>
      </header>
      <main>
        <section className="about">
          <h2>关于我们</h2>
          <p>这里是革命烈士线上纪念馆，旨在纪念伟大的革命先烈们。</p>
        </section>
        <section className="heroes">
          <h2>英雄名录</h2>
          <ul>
            <li>刘胡兰</li>
            <li>刘伯承</li>
            <li>朱德</li>
            <li>毛泽东</li>
          </ul>
        </section>
        <section className="messages">
          <h2>留言区</h2>
          <form id="messageForm">
            <textarea name="message" placeholder="留下您的感言..." required></textarea>
            <button type="submit">提交</button>
          </form>
          <div id="messageList">
            {/* 留言将动态插入到这里 */}
          </div>
        </section>
      </main>
      <footer className="App-footer">
        <p>&copy; 2023 革命烈士线上纪念馆. All rights reserved.</p>
      </footer>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// 处理留言表单提交
document.getElementById('messageForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const messageInput = document.querySelector('#messageForm textarea');
  const message = messageInput.value;

  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (data.success) {
      messageInput.value = '';
      loadMessages(); // 刷新留言列表
    } else {
      console.error('Failed to send message:', data);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
});

// 加载留言列表
async function loadMessages() {
  try {
    const response = await fetch('/api/messages');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const messagesContainer = document.getElementById('messageList');
    messagesContainer.innerHTML = ''; // 清空现有留言

    data.messages.forEach((message, index) => {
      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      messageElement.textContent = `${index + 1}. ${message}`;
      messagesContainer.appendChild(messageElement);
    });
  } catch (error) {
    console.error('Error loading messages:', error);
  }
}

// 初始化时加载留言列表
loadMessages();
