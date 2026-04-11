# 部署指南

## 架构概览

```
前端 index_0331.html（GitHub 托管）
    ↓ HTTPS
腾讯云 SCF 函数URL（后端 API）
    ↓ Bearer Token
Kimi API（moonshot.cn）
```

---

## 一、GitHub 推送（前端）

```bash
cd "D:\CC-research\学生大创"
git add index_0331.html
git commit -m "update frontend"
git push origin main
```

仓库：`https://github.com/zhaopei1024psych-ux/xiaoqi-0328-1.0`

---

## 二、腾讯云 SCF 部署（后端）

> ⚠️ 腾讯云 API 网关已停止服务，必须使用**函数 URL（Function URL）**作为触发器。

### 2.1 创建函数 `xiaoqi-chat`

1. 登录 [腾讯云 SCF 控制台](https://console.cloud.tencent.com/scf)
2. 点击**新建** → 从头开始
3. 填写：
   - 函数名称：`xiaoqi-chat`
   - 运行环境：`Node.js 18.15`
   - 地域：任意（推荐上海/广州）
4. 函数代码：选择**本地上传文件夹**，上传 `scf/chat/` 目录
   - 执行方法：`index.main_handler`
5. 环境变量：
   - 键：`KIMI_API_KEY`
   - 值：你的 Kimi API Key（从 [platform.moonshot.cn](https://platform.moonshot.cn) 获取）
6. 点击**完成**

### 2.2 开启函数 URL（替代 API 网关）

1. 进入 `xiaoqi-chat` 函数详情页
2. 左侧菜单 → **触发器管理**
3. 点击**创建触发器**
4. 触发方式选择：**函数URL（Function URL）**
5. 鉴权方式：**不鉴权（公网访问）**
6. 点击**提交**
7. 复制生成的 URL，格式类似：
   ```
   https://xxxxxxxx.ap-shanghai.tencentserverless.com/release/
   ```
   **记录此 URL → 这是 `CHAT_URL`**

### 2.3 创建函数 `xiaoqi-vision`（同上步骤）

1. 新建函数，名称 `xiaoqi-vision`
2. 上传 `scf/vision/` 目录
   - 执行方法：`index.main_handler`
3. 环境变量同上（`KIMI_API_KEY`）
4. 开启函数 URL
5. 复制生成的 URL → **记录此 URL → 这是 `VISION_URL`**

---

## 三、更新前端 API 地址

打开 `index_0331.html`，找到顶部的 `API_BASE` 配置（在 `<script>` 标签开头处）：

```javascript
const API_BASE = {
  chat: '/api/chat',
  vision: '/api/vision'
};
```

替换为你的函数 URL：

```javascript
const API_BASE = {
  chat: 'https://xxxxxxxx.ap-shanghai.tencentserverless.com/release/',   // CHAT_URL
  vision: 'https://yyyyyyyy.ap-shanghai.tencentserverless.com/release/'  // VISION_URL
};
```

然后推送到 GitHub：

```bash
git add index_0331.html
git commit -m "chore: point API_BASE to SCF function URLs"
git push origin main
```

---

## 四、本地开发测试

不需要部署 SCF，在 Settings 页面填入 Kimi API Key，前端会直连 Kimi API。

或者用 Vercel CLI 在本地运行完整后端：

```bash
# 安装 Vercel CLI（一次性）
npm i -g vercel

# 在项目根目录创建 .env.local（已在 .gitignore 中排除）
echo "KIMI_API_KEY=sk-xxxx" > .env.local

# 本地启动（会运行 api/ 目录下的 Vercel Functions）
vercel dev
```

访问 `http://localhost:3000` 即可测试完整功能。

---

## 五、验证部署

| 测试项 | 预期结果 |
|--------|---------|
| 输入笼统任务（如"写论文"） | AI 提问引导，不直接生成任务列表 |
| 多轮对话后（有截止日期+具体内容） | 生成子任务，deadline 按天分散 |
| 上传课程表图片 → 确认导入 | 课程出现在课程表视图中 |
| 上传截图任务 → 确认导入 | 任务出现在待办列表中 |

---

## 文件结构

```
学生大创/
├── index_0331.html        # 单文件前端（PWA）
├── api/                   # Vercel Functions（本地开发用）
│   ├── chat.js
│   └── vision.js
├── scf/                   # 腾讯云 SCF 函数（生产部署用）
│   ├── chat/
│   │   └── index.js       # 执行方法: index.main_handler
│   └── vision/
│       └── index.js       # 执行方法: index.main_handler
├── vercel.json            # Vercel 路由配置
├── .gitignore
└── DEPLOY.md              # 本文件
```

---

## 环境变量

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `KIMI_API_KEY` | 是 | Kimi（月之暗面）API Key，在 platform.moonshot.cn 获取 |

---

## 故障排查

**API 调用失败**：检查 SCF 函数环境变量中 `KIMI_API_KEY` 是否正确填写，查看 SCF 控制台的函数日志。

**课程导入后不显示**：确认 `index_0331.html` 中的 `API_BASE.vision` 指向了正确的函数 URL。

**CORS 错误**：SCF 代码中已内置 CORS 头，确认函数 URL 鉴权方式设为"不鉴权"。
