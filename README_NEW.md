# 📚 大学生智能待办助手

<div align="center">

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![PWA](https://img.shields.io/badge/PWA-ready-orange)

**AI 驱动的智能任务管理系统，专为大学生设计**

[快速开始](QUICKSTART.md) · [部署指南](DEPLOY.md) · [功能测试](TEST_CHECKLIST.md) · [更新日志](CHANGELOG.md)

</div>

---

## ✨ 核心特性

### 🤖 AI 智能解析
- 文字输入自动解析任务
- 语音输入支持（Web Speech API）
- 截图识别（即将推出）

### 🧠 记忆系统
- AI 自动学习用户习惯
- 个性化任务处理
- 手动管理记忆库

### 📖 课程管理
- 课程表系统
- 校历管理
- 时间冲突检测

### 📅 日历集成
- 导出为 .ics 文件
- 兼容所有主流日历应用
- 系统提醒支持

### 🎨 精美界面
- iOS 风格设计
- 深色模式支持
- 响应式布局

### 📱 PWA 支持
- 可添加到主屏幕
- 离线缓存
- 类原生体验

---

## 🚀 快速开始

### 在线体验（推荐）

1. 访问 [演示地址](https://your-app.vercel.app)
2. 在手机浏览器中打开
3. 添加到主屏幕
4. 开始使用！

### 本地运行

```bash
# 克隆项目
git clone https://github.com/你的用户名/student-todo-assistant.git
cd student-todo-assistant

# 启动本地服务器
python -m http.server 8000

# 访问 http://localhost:8000
```

### 一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/你的用户名/student-todo-assistant&env=QWEN_API_KEY)

详细部署指南：[DEPLOY.md](DEPLOY.md)

---

## 📖 使用示例

### 1. AI 解析任务

**输入**：
```
下周一下午3点前完成高数作业第三章，周三考试线性代数
```

**结果**：
- ✅ 完成高数作业（个人作业，下周一 15:00）
- ✅ 线性代数考试（考试，周三）

### 2. 语音输入

1. 点击麦克风图标 🎤
2. 说："明天上午10点开会"
3. 自动转为文字并解析

### 3. 课程表

添加课程后，自动按星期分组显示，方便查看每周安排。

### 4. 时间冲突检测

添加待办时，自动检测同一天的其他任务，避免时间冲突。

---

## 📂 项目结构

```
student-todo-assistant/
├── index.html              # 主应用（36KB）
├── manifest.json           # PWA 配置
├── sw.js                   # Service Worker
├── api/
│   └── chat.js            # Vercel serverless 后端
├── README.md              # 本文件
├── QUICKSTART.md          # 快速开始
├── DEPLOY.md              # 部署指南
├── CHANGELOG.md           # 更新日志
├── TEST_CHECKLIST.md      # 测试清单
├── PROJECT_SUMMARY.md     # 项目总结
├── package.json           # NPM 配置
├── vercel.json            # Vercel 配置
└── LICENSE                # MIT 许可证
```

---

## 🛠️ 技术栈

- **前端**：纯 HTML/CSS/JavaScript（无框架）
- **AI**：阿里云千问 qwen-max
- **存储**：localStorage
- **部署**：Vercel Serverless Functions
- **PWA**：Service Worker + manifest.json

---

## ✅ 已实现功能

### Phase 1 - MVP
- [x] 基础待办管理
- [x] AI 解析（文字输入）
- [x] 语音输入
- [x] 本地存储
- [x] API Key 配置
- [x] 主题切换

### Phase 2 - 核心功能
- [x] 课程表系统
- [x] 校历管理
- [x] 时间冲突检测
- [x] AI 记忆系统
- [x] 日历导出（.ics）

### Phase 3 - 增强功能（开发中）
- [ ] 截图识别
- [ ] 小组作业多轮交互
- [ ] 考试倒计时
- [ ] 复习计划生成

### Phase 4 - 锦上添花
- [ ] 成就系统
- [ ] 学期总结海报
- [ ] 隐私模式
- [ ] 共享任务链接

---

## 📊 性能指标

| 指标 | 数值 |
|------|------|
| 文件大小 | 36KB |
| 首次加载 | <1s |
| AI 响应 | 2-5s |
| 支持待办 | 1000+ |

---

## 🌐 浏览器兼容性

| 浏览器 | 基础功能 | 语音识别 | PWA |
|--------|---------|---------|-----|
| Chrome | ✅ | ✅ | ✅ |
| Safari | ✅ | ⚠️ | ⚠️ |
| Firefox | ✅ | ❌ | ⚠️ |
| Edge | ✅ | ✅ | ✅ |

---

## 📝 文档

- [快速开始指南](QUICKSTART.md) - 5 分钟上手
- [部署指南](DEPLOY.md) - 详细部署步骤
- [功能测试清单](TEST_CHECKLIST.md) - 完整测试场景
- [更新日志](CHANGELOG.md) - 版本历史
- [项目总结](PROJECT_SUMMARY.md) - 技术细节

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发指南

```bash
# 克隆项目
git clone https://github.com/你的用户名/student-todo-assistant.git

# 启动开发服务器
npm run dev

# 部署到 Vercel
npm run deploy
```

---

## 📄 许可证

[MIT License](LICENSE)

---

## 🙏 致谢

- [阿里云千问](https://dashscope.aliyun.com/) - AI 能力支持
- [Vercel](https://vercel.com/) - 免费托管服务
- [Font Awesome](https://fontawesome.com/) - 图标库

---

## 📞 联系方式

- GitHub Issues：[提交问题](https://github.com/你的用户名/student-todo-assistant/issues)
- Email：your-email@example.com

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star！**

Made with ❤️ by Claude Code

</div>