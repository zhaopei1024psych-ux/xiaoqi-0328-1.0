# 大学生智能待办助手 — 项目记忆

> 本文件由 Claude Code 自动读取，记录项目关键信息，避免每次重复探索。

## 项目概览

**名称**：大学生智能待办助手（Student AI Todo Assistant）
**版本**：v0.2.0（Phase 1&2 完成，约60%）
**架构**：单文件HTML PWA + Vercel Serverless 后端
**主文件**：`index_0331.html`（约1660行，含所有CSS/JS）
**部署**：Vercel（`vercel.json` 已配置）

## 技术栈

- 前端：原生 HTML/CSS/JS，无框架
- AI：Kimi API（moonshot，月之暗面）via OpenAI兼容接口
- 存储：localStorage（无后端数据库）
- PWA：Service Worker（`sw.js`） + manifest（`manifest.json`）
- 后端：Vercel Serverless Functions（`api/chat.js`, `api/vision.js`）

## API 配置

### Kimi API（主要）
- 端点：`https://api.moonshot.cn/v1/chat/completions`
- 文字模型：`moonshot-v1-8k`
- 视觉模型：`moonshot-v1-8k`（支持vision，通过content数组传图片）
- 环境变量：`KIMI_API_KEY`（Vercel部署时配置）
- **本地调试**：Settings页面有API Key输入框，存localStorage，前端直连Kimi

### 本地开发说明
```bash
python -m http.server 8000  # 启动本地服务
# 访问 http://localhost:8000/index_0331.html
# API功能需要在Settings填入Kimi API Key才能使用
```

## 文件结构

```
学生大创/
├── index_0331.html     # 主应用（全部功能）
├── api/
│   ├── chat.js         # 文字对话/任务解析 endpoint
│   └── vision.js       # 图片识别 endpoint
├── CLAUDE.md           # 本文件（项目记忆）
├── FEATURE_PLAN.md     # 功能开发计划（含优先级）
├── COMPLETION_REPORT.md # 阶段完成报告
├── manifest.json       # PWA配置
├── sw.js               # Service Worker
└── vercel.json         # 部署配置
```

## 当前开发状态（2026-03-31）

### 已完成
- [x] Phase 1：基础待办管理、AI自然语言解析、语音输入、暗色模式
- [x] Phase 2：课程系统、日历管理、冲突检测、AI记忆、日历导出

### 已知问题（待修复）
1. **API调用失败**：本地调试时KIMI_API_KEY未配置，需前端直连模式
2. **图片识别无效**：async回调错误被吞、task识别类型缺失
3. **任务拆解机械**：prompt简单、无多轮对话状态管理

### 待开发（Phase 3）
- 截图读取任务（图片识别修复后解锁）
- 考试倒计时
- 学习计划生成
- 成就系统

## 数据模型

```javascript
// Todo
{ id, title, description, deadline, courseId, course, type, status, createdAt }

// Course
{ id, name, teacher, location, weekday(1-7), startTime, endTime, weeks }

// Memory（AI记忆）
{ key, value, type, description }

// CalendarEvent
{ title, date, type: 'semester_start|exam|holiday|other' }
```

## 核心函数位置（index_0331.html）

| 函数 | 行号（约） | 说明 |
|------|-----------|------|
| `parseWithAI()` | ~813 | AI解析任务入口 |
| `callQwenAPI()` | ~874 | API调用（支持直连模式） |
| `handleImageUpload()` | ~1070 | 图片识别处理 |
| `uploadScheduleImage()` | ~1125 | 课程表识别触发 |
| `addTodo()` | ~893 | 添加待办 |

## 对话状态机（改进中）

```javascript
conversationState: {
  mode: 'normal' | 'breakdown_confirming',
  history: [],  // 最近3轮对话
  context: {}   // 当前任务拆解上下文
}
```

## 注意事项

- 图片识别model：`moonshot-v1-8k`（已支持vision）
- 前端直连Kimi时需处理CORS（Kimi已允许跨域）
- `needMoreInfo: true` 时前端需进入多轮对话模式
- 所有数据存localStorage，key为 `todoAppData`
