# 🚀 一键部署指南

## 方式 1：Vercel 一键部署（推荐）

### 步骤 1：准备 API Key
1. 访问 [阿里云 DashScope](https://dashscope.aliyun.com/)
2. 注册并创建 API Key
3. 复制 API Key（格式：sk-xxx...）

### 步骤 2：部署到 Vercel

#### 方法 A：通过 GitHub（推荐）
```bash
# 1. 创建 GitHub 仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/student-todo-assistant.git
git push -u origin main

# 2. 访问 Vercel
# https://vercel.com/new

# 3. 导入 GitHub 仓库

# 4. 配置环境变量
# 变量名：QWEN_API_KEY
# 值：你的 API Key

# 5. 点击 Deploy
```

#### 方法 B：使用 Vercel CLI
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd 学生大创
vercel

# 4. 添加环境变量
vercel env add QWEN_API_KEY
# 粘贴你的 API Key

# 5. 生产部署
vercel --prod
```

### 步骤 3：使用应用
1. 部署完成后，Vercel 会提供一个网址
2. 在手机浏览器中打开
3. 添加到主屏幕
4. 开始使用！

---

## 方式 2：本地测试

### 使用 Python
```bash
cd 学生大创
python -m http.server 8000

# 访问 http://localhost:8000
```

### 使用 Node.js
```bash
npx serve

# 访问 http://localhost:3000
```

**注意**：本地测试时，AI 功能需要在设置中配置 API Key。

---

## 方式 3：其他静态托管

### GitHub Pages
```bash
# 1. 创建 gh-pages 分支
git checkout -b gh-pages

# 2. 推送到 GitHub
git push origin gh-pages

# 3. 在仓库设置中启用 GitHub Pages
# Settings → Pages → Source: gh-pages
```

### Netlify
1. 访问 [Netlify Drop](https://app.netlify.com/drop)
2. 拖拽整个文件夹
3. 等待部署完成

**注意**：GitHub Pages 和 Netlify 无法运行后端代理，需要用户自行配置 API Key。

---

## 环境变量说明

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `QWEN_API_KEY` | 是 | 阿里云千问 API Key | `sk-xxx...` |

---

## 部署后配置

### 1. 添加到主屏幕

**iOS（Safari）**：
1. 打开应用网址
2. 点击分享按钮
3. 选择"添加到主屏幕"

**Android（Chrome）**：
1. 打开应用网址
2. 点击菜单（三个点）
3. 选择"添加到主屏幕"

### 2. 首次使用

1. 打开应用
2. 如果使用 Vercel 部署，直接开始使用
3. 如果使用其他方式，进入设置配置 API Key

---

## 故障排查

### 问题 1：AI 解析失败
**原因**：API Key 未配置或错误
**解决**：
1. 检查 Vercel 环境变量是否正确
2. 或在设置中重新输入 API Key

### 问题 2：语音识别不工作
**原因**：浏览器不支持
**解决**：
1. 使用 Chrome/Edge 浏览器
2. 检查麦克风权限
3. 或使用文字输入

### 问题 3：无法添加到主屏幕
**原因**：需要 HTTPS
**解决**：
1. 确保使用 Vercel 等提供 HTTPS 的服务
2. 本地测试无法添加到主屏幕

### 问题 4：数据丢失
**原因**：清除了浏览器数据
**解决**：
1. 定期导出数据备份
2. 不要清除浏览器缓存

---

## 性能优化建议

1. **定期清理**：删除已完成的旧待办
2. **数据备份**：每周导出一次数据
3. **浏览器缓存**：不要频繁清除缓存

---

## 安全建议

1. **API Key 保护**：
   - 使用 Vercel 部署（推荐）
   - 不要在公共设备上使用
   - 不要分享你的 API Key

2. **数据隐私**：
   - 数据存储在本地浏览器
   - 不会上传到服务器
   - 可开启隐私模式

---

## 更新应用

### Vercel 部署
```bash
# 1. 更新代码
git pull origin main

# 2. 推送到 GitHub
git add .
git commit -m "Update"
git push

# 3. Vercel 自动部署
```

### 本地使用
1. 下载最新的 index.html
2. 替换旧文件
3. 刷新浏览器

---

## 费用说明

### Vercel
- 免费额度：100GB 带宽/月
- Serverless 函数：100GB-小时/月
- 对于个人使用完全免费

### 千问 API
- 按 token 计费
- 每次解析约 100-500 tokens
- 价格：约 ¥0.001-0.005/次
- 每月使用 100 次约 ¥0.1-0.5

---

## 技术支持

- 📖 完整文档：[README.md](README.md)
- 🚀 快速开始：[QUICKSTART.md](QUICKSTART.md)
- ✅ 测试清单：[TEST_CHECKLIST.md](TEST_CHECKLIST.md)
- 📝 更新日志：[CHANGELOG.md](CHANGELOG.md)
- 📊 项目总结：[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

**祝部署顺利！📚✨**