# 功能开发计划

## ✅ 紧急修复（已完成 2026-03-31）

### Fix 1：API调用失败 ✅
**问题**：本地调试时 `KIMI_API_KEY` 环境变量不存在，导致API全部返回500

**已实施**：
- Settings页面新增 Kimi API Key 输入框（存 localStorage）
- `callQwenAPI()` 支持**本地直连模式**：检测到本地Key时直接调用 `https://api.moonshot.cn/v1`
- 区分错误类型：无Key / Key无效(401) / 频率超限(429) / 额度不足(402)
- 用 `showToast()` 替代 `alert()`，体验更友好

### Fix 2：图片识别功能失效 ✅
**问题**：async回调错误被吞、缺少task识别类型

**已实施**：
- 用 `Promise` 包装 `FileReader`，修复 async 错误捕获
- 添加 `'task'` 识别类型（截图提取待办任务）
- 图片识别也支持本地直连模式（`callKimiVisionDirect`）
- 添加识别结果预览+确认模态框（`showVisionPreview`）
- 截图按钮（📷）现在默认触发 `task` 类型识别

### Fix 3：任务拆解机械，缺少引导和确认机制 ✅
**问题**：prompt简单、无多轮对话、无引导拆分

**已实施**：
- 重写 system prompt，加入【直接解析 vs 引导拆分】判断逻辑
- 预置4种拆分模板（论文、大创、考试准备、小组作业）
- 前端对话状态机：`conversationState { mode, history, pendingTasks }`
- `needMoreInfo=true` 时显示 AI 引导气泡 + 建议子任务标签
- 拆解完成后显示任务预览，用户确认后批量添加
- 后端支持 `conversationHistory`（最近4条），上下文感知

---

## 第一阶段：核心功能（1-2天）

### 1. 日历视图 ⭐⭐⭐
**优先级：最高**

#### 月视图
- 显示当月所有日期
- 标记有任务的日期（圆点/数字）
- 点击日期显示当天任务列表
- 高亮今天、截止日期

#### 周视图
- 显示本周7天
- 每天显示任务卡片
- 支持左右滑动切换周

#### 技术方案
```javascript
// 使用原生 JS + CSS Grid
// 库选择：可选 FullCalendar.js（轻量）或自己实现
```

---

### 2. 图片识别（校历/课程表）⭐⭐⭐
**优先级：高**

#### 功能
- 上传图片按钮
- 调用 Kimi Vision API 识别
- 自动解析：
  - 校历：学期开始/结束、考试周、假期
  - 课程表：课程名、时间、地点、教师

#### API 调用
```javascript
// Kimi 支持 vision
POST /api/vision
{
  "image": "base64_string",
  "type": "schedule" | "calendar"
}
```

#### 后端实现
```javascript
// api/vision.js
// 使用 Kimi vision model
model: "moonshot-v1-8k"
messages: [
  {
    role: "user",
    content: [
      { type: "image_url", image_url: { url: "data:image/jpeg;base64,..." } },
      { type: "text", text: "识别这张课程表..." }
    ]
  }
]
```

---

### 3. 任务拆分对话 ⭐⭐
**优先级：中**

#### 当前问题
- 只有单轮对话
- 没有任务拆分引导
- 缺少确认/调整机制

#### 改进方案
**多轮对话流程：**
1. 用户输入："下周要做大创项目"
2. AI 回复："这个项目包含哪些子任务？例如：文献调研、代码实现、报告撰写"
3. 用户确认/补充
4. AI 生成详细任务列表（带时间估算）
5. 用户调整截止日期

**实现：**
```javascript
// 增加对话状态管理
conversationState: {
  mode: 'normal' | 'task_breakdown',
  context: {},
  history: []
}

// 后端 prompt 优化
if (needMoreInfo) {
  return {
    needMoreInfo: true,
    question: "这个任务可以拆分成哪些子任务？",
    suggestions: ["文献调研", "代码实现", "报告撰写"]
  }
}
```

---

## 第二阶段：增强功能（3-5天）

### 4. 语音识别 ⭐
**优先级：低（需额外成本）**

#### 技术方案
- **方案A**：浏览器 Web Speech API（免费，但准确率低）
- **方案B**：阿里云/腾讯云语音识别（付费，准确率高）

#### 实现
```javascript
// 方案A：Web Speech API
const recognition = new webkitSpeechRecognition();
recognition.lang = 'zh-CN';
recognition.onresult = (event) => {
  const text = event.results[0][0].transcript;
  // 发送给 AI
};

// 方案B：云服务
POST /api/speech-to-text
{ audio: "base64_audio" }
```

---

## 文件结构调整

```
学生大创/
├── index.html          # 主页（任务列表）
├── calendar.html       # 新增：日历视图页面
├── api/
│   ├── chat.js        # 现有：文本对话
│   ├── vision.js      # 新增：图片识别
│   └── speech.js      # 新增：语音识别（可选）
├── js/
│   ├── app.js         # 主逻辑
│   ├── calendar.js    # 新增：日历组件
│   └── conversation.js # 新增：对话管理
└── css/
    └── calendar.css   # 新增：日历样式
```

---

## 开发时间估算

| 功能 | 工作量 | 说明 |
|------|--------|------|
| 日历视图 | 6-8h | 月视图 + 周视图 + 交互 |
| 图片识别 | 4-6h | API 对接 + 解析逻辑 |
| 任务拆分对话 | 3-4h | 状态管理 + prompt 优化 |
| 语音识别 | 2-4h | 取决于方案选择 |

**总计：15-22小时（2-3天全职开发）**

---

## 下一步行动

### 立即开始（推荐顺序）
1. ✅ **日历视图** - 用户最需要，技术简单
2. ✅ **图片识别** - 差异化功能，Kimi 已支持
3. ✅ **任务拆分** - 提升 AI 体验

### 暂缓
4. ⏸️ 语音识别 - 成本高，优先级低

---

## 技术风险

### 低风险
- 日历视图：纯前端，无依赖
- 任务拆分：只需优化 prompt

### 中风险
- 图片识别：依赖 Kimi vision 准确率
  - **缓解**：提供手动编辑功能

### 高风险
- 语音识别：需额外 API，成本未知
  - **缓解**：先用 Web Speech API 测试

---

## 用户体验优化

### 日历视图
- 支持手势滑动（移动端）
- 快速跳转到今天
- 任务颜色编码（类型/优先级）

### 图片识别
- 拍照 + 相册选择
- 识别进度提示
- 识别结果预览 + 编辑

### 任务拆分
- 预置模板（论文、项目、考试准备）
- 智能时间分配
- 一键接受/逐项调整
