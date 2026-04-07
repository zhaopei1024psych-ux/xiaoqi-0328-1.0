# 大学生智能待办助手 - 部署指南

## 项目简介

这是一个专为大学生设计的智能待办管理系统，支持：
- ✅ 多模态输入（文字/语音/截图）
- 🤖 AI 自动解析任务（阿里云千问）
- 📚 课程表管理
- 📅 校历系统
- 🧠 AI 记忆学习
- ⚠️ 时间冲突检测
- 📱 PWA 支持（可添加到主屏幕）

## 文件结构

```
project/
├── index.html          # 主应用（包含所有前端代码）
├── manifest.json       # PWA 配置
├── sw.js              # Service Worker
├── api/
│   └── chat.js        # Vercel serverless 函数（后端代理）
└── README.md          # 本文档
```

## 部署方式

### 方案 A：Vercel 部署（推荐）

这是最安全的方案，API Key 存储在服务器端环境变量中。

#### 步骤 1：准备工作

1. 注册 [Vercel 账号](https://vercel.com)
2. 获取阿里云千问 API Key：
   - 访问 [阿里云 DashScope](https://dashscope.aliyun.com/)
   - 注册并创建 API Key

#### 步骤 2：部署到 Vercel

**方法 1：通过 GitHub（推荐）**

1. 将项目上传到 GitHub
2. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 配置环境变量：
   - 变量名：`QWEN_API_KEY`
   - 值：你的千问 API Key
6. 点击 "Deploy"

**方法 2：使用 Vercel CLI**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录下运行
cd 学生大创
vercel

# 设置环境变量
vercel env add QWEN_API_KEY
# 输入你的 API Key

# 部署
vercel --prod
```

#### 步骤 3：使用应用

1. 部署完成后，Vercel 会提供一个网址（如 `https://your-app.vercel.app`）
2. 在手机浏览器中打开这个网址
3. 点击浏览器菜单中的"添加到主屏幕"
4. 开始使用！

**注意**：使用 Vercel 部署时，前端会自动调用 `/api/chat` 端点，无需配置 API Key。

---

### 方案 B：纯前端部署（用户自行配置 API Key）

如果不想部署后端，可以直接使用 HTML 文件，但需要用户自己输入 API Key。

#### 步骤 1：下载文件

只需要 `index.html` 文件即可。

#### 步骤 2：部署到静态托管

可以部署到任何静态托管服务：

**GitHub Pages**
```bash
# 创建 GitHub 仓库
# 上传 index.html, manifest.json, sw.js
# 在仓库设置中启用 GitHub Pages
```

**Netlify**
- 拖拽文件到 [Netlify Drop](https://app.netlify.com/drop)

**本地使用**
- 直接用浏览器打开 `index.html` 文件

#### 步骤 3：配置 API Key

1. 打开应用
2. 点击底部"设置"标签
3. 输入你的阿里云千问 API Key
4. 点击"保存"

**安全提示**：
- API Key 存储在浏览器 localStorage 中
- 不要在公共设备上使用
- 不要分享你的 API Key

---

## 功能说明

### 基础功能（已实现）

#### 1. 待办管理
- 手动添加待办（点击右下角 + 按钮）
- AI 解析任务（在输入框输入自然语言）
- 标记完成/删除/编辑

#### 2. AI 解析示例

输入：
```
下周一下午3点前完成高数作业第三章
```

AI 会自动解析为：
- 标题：完成高数作业
- 描述：第三章
- 截止时间：下周一 15:00
- 课程：高等数学
- 类型：个人作业

#### 3. 语音输入
- 点击麦克风图标
- 说出任务描述
- 自动转为文字并解析

**兼容性**：
- ✅ Chrome/Edge（完美支持）
- ✅ Android Chrome
- ⚠️ iOS Safari（部分支持）
- ❌ Firefox（不支持）

#### 4. 主题切换
- 设置 → 深色模式开关
- 自动保存偏好

#### 5. 数据导出
- 设置 → 导出数据
- 下载 JSON 文件备份

### 即将推出的功能

- 📖 课程表系统
- 📅 校历管理
- ⚠️ 时间冲突检测
- 🧠 AI 记忆系统
- 📷 截图识别
- 👥 小组作业多轮交互
- 📊 考试倒计时
- 🎨 更多主题
- 🏆 成就系统

---

## API 调用说明

### 方案 A：通过后端代理

前端调用 `/api/chat`：

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userInput: '下周一完成作业',
    memories: []
  })
});
```

### 方案 B：直接调用千问 API

前端直接调用（需要 API Key）：

```javascript
const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'qwen-max',
    input: { messages: [...] }
  })
});
```

**注意**：千问 API 不支持 CORS，直接调用会失败。必须使用后端代理或 CORS 代理服务。

---

## 常见问题

### 1. 语音识别不工作？

- 确保使用 Chrome/Edge 浏览器
- 检查麦克风权限
- iOS Safari 支持有限，建议使用文字输入

### 2. AI 解析失败？

- 检查 API Key 是否正确
- 确保网络连接正常
- 查看浏览器控制台错误信息

### 3. 如何添加到主屏幕？

**iOS**：
1. Safari 浏览器打开应用
2. 点击分享按钮
3. 选择"添加到主屏幕"

**Android**：
1. Chrome 浏览器打开应用
2. 点击菜单（三个点）
3. 选择"添加到主屏幕"

### 4. 数据会丢失吗？

- 数据存储在浏览器 localStorage 中
- 清除浏览器数据会导致数据丢失
- 建议定期导出备份

### 5. API 费用如何计算？

- 千问 API 按 token 计费
- 每次解析约消耗 100-500 tokens
- 具体价格见[阿里云定价](https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-qianwen-metering-and-billing)

---

## 技术栈

- **前端**：纯 HTML/CSS/JavaScript（无框架）
- **AI**：阿里云千问（qwen-max）
- **存储**：localStorage
- **部署**：Vercel Serverless Functions
- **PWA**：Service Worker + manifest.json

---

## 开发计划

### Phase 1 - MVP ✅
- [x] 基础待办管理
- [x] AI 解析（文字输入）
- [x] localStorage 存储
- [x] API Key 配置
- [x] 语音输入
- [x] 主题切换

### Phase 2 - 核心功能（开发中）
- [ ] 课程表系统
- [ ] 校历管理
- [ ] 时间冲突检测
- [ ] AI 记忆系统
- [ ] 日历导出（.ics）

### Phase 3 - 增强功能
- [ ] 截图识别
- [ ] 小组作业多轮交互
- [ ] 考试倒计时
- [ ] 响应式优化

### Phase 4 - 锦上添花
- [ ] 成就系统
- [ ] 学期总结海报
- [ ] 隐私模式
- [ ] 共享任务链接

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

---

## 许可证

MIT License

---

## 联系方式

如有问题，请提交 Issue 或联系开发者。

---

**祝学习愉快！📚✨**