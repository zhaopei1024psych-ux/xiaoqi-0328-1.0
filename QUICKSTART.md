# 快速开始指南

## 🚀 5分钟部署到 Vercel

### 1. 准备 API Key

访问 [阿里云 DashScope](https://dashscope.aliyun.com/)，注册并获取 API Key。

### 2. 一键部署

点击下方按钮一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/student-todo-assistant&env=QWEN_API_KEY&envDescription=阿里云千问API%20Key)

或手动部署：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 进入项目目录
cd 学生大创

# 3. 登录 Vercel
vercel login

# 4. 部署
vercel

# 5. 添加环境变量
vercel env add QWEN_API_KEY
# 粘贴你的 API Key

# 6. 生产部署
vercel --prod
```

### 3. 使用应用

1. 打开 Vercel 提供的网址
2. 在手机浏览器中访问
3. 添加到主屏幕
4. 开始使用！

---

## 📱 本地测试

### 方法 1：直接打开（仅前端功能）

```bash
# 用浏览器打开 index.html
open index.html  # macOS
start index.html # Windows
```

**注意**：直接打开时，AI 功能需要在设置中配置 API Key，且可能因 CORS 限制无法使用。

### 方法 2：本地服务器（完整功能）

```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx serve

# 然后访问 http://localhost:8000
```

---

## ✨ 核心功能演示

### 1. AI 解析任务

在输入框输入：
```
下周一下午3点前完成高数作业第三章，周三考试线性代数
```

AI 会自动创建两个待办：
- ✅ 完成高数作业（个人作业，下周一 15:00）
- ✅ 线性代数考试（考试，周三）

### 2. 语音输入

1. 点击麦克风图标 🎤
2. 说："明天上午10点开会"
3. 自动转为文字并解析

### 3. 手动添加

1. 点击右下角 + 按钮
2. 填写任务信息
3. 保存

---

## 🔧 配置说明

### 环境变量（Vercel）

在 Vercel 项目设置中添加：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `QWEN_API_KEY` | 阿里云千问 API Key | `sk-xxx...` |

### 本地配置（纯前端）

1. 打开应用
2. 点击"设置"标签
3. 输入 API Key
4. 点击"保存"

---

## 📂 项目结构

```
学生大创/
├── index.html          # 主应用（21KB）
├── manifest.json       # PWA 配置
├── sw.js              # Service Worker
├── api/
│   └── chat.js        # Vercel 后端代理
├── vercel.json        # Vercel 配置
├── README.md          # 完整文档
└── QUICKSTART.md      # 本文件
```

---

## 🎯 下一步

- [ ] 添加课程表
- [ ] 设置校历
- [ ] 体验 AI 记忆功能
- [ ] 导出日历到系统

详细功能说明见 [README.md](README.md)

---

## ❓ 遇到问题？

### AI 解析失败
- 检查 API Key 是否正确
- 查看浏览器控制台错误

### 语音识别不工作
- 使用 Chrome/Edge 浏览器
- 检查麦克风权限

### 无法添加到主屏幕
- 确保使用 HTTPS（Vercel 自动提供）
- iOS 需要在 Safari 中操作

---

**开始使用吧！📚✨**