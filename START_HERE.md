# 🎯 立即开始使用

## 当前状态

✅ **项目已完成并可使用！**

本地服务器已启动：**http://localhost:8000**

---

## 🚀 三种使用方式

### 方式 1：本地测试（当前已启动）

服务器已在后台运行，直接访问：

```
http://localhost:8000
```

在浏览器中打开上述地址即可使用。

**停止服务器**：
```bash
# 查找进程
ps aux | grep "python -m http.server"

# 停止进程
kill <进程ID>
```

---

### 方式 2：部署到 Vercel（推荐生产环境）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd "D:\CC-research\学生大创"
vercel

# 4. 添加环境变量
vercel env add QWEN_API_KEY
# 输入你的阿里云千问 API Key

# 5. 生产部署
vercel --prod
```

部署完成后，Vercel 会提供一个永久网址。

---

### 方式 3：直接打开 HTML

```bash
# Windows
start "D:\CC-research\学生大创\index.html"

# 或直接双击 index.html 文件
```

**注意**：直接打开时需要在设置中配置 API Key。

---

## 📱 在手机上使用

### 方法 1：访问本地服务器（同一 WiFi）

1. 查看电脑 IP 地址：
```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

2. 在手机浏览器中访问：
```
http://你的IP地址:8000
```

3. 添加到主屏幕

### 方法 2：部署后访问（推荐）

1. 部署到 Vercel
2. 在手机浏览器中打开 Vercel 提供的网址
3. 添加到主屏幕

---

## ⚙️ 首次使用配置

### 如果使用 Vercel 部署
- ✅ 无需配置，直接使用

### 如果本地使用或直接打开 HTML
1. 打开应用
2. 点击底部"设置"标签
3. 输入阿里云千问 API Key
4. 点击"保存"

**获取 API Key**：
1. 访问 [阿里云 DashScope](https://dashscope.aliyun.com/)
2. 注册并创建 API Key
3. 复制 Key（格式：sk-xxx...）

---

## 🎮 功能演示

### 1. 添加待办

**方式 A：AI 解析**
```
输入：下周一下午3点前完成高数作业
点击：AI 解析任务
```

**方式 B：语音输入**
```
点击：麦克风图标 🎤
说话：明天上午10点开会
```

**方式 C：手动添加**
```
点击：右下角 + 按钮
填写：任务信息
保存
```

### 2. 添加课程

```
切换到：课程表标签
点击：+ 添加课程
填写：课程信息
保存
```

### 3. 设置校历

```
切换到：日历标签
设置：学期起止日期
添加：节假日
保存
```

### 4. 导出日历

```
切换到：日历标签
点击：导出待办到日历
下载：.ics 文件
导入：系统日历
```

### 5. 管理记忆

```
切换到：设置标签
点击：AI 记忆管理
添加/编辑/删除：记忆
```

---

## 🐛 常见问题

### Q1：AI 解析失败？
**A**：检查 API Key 是否正确配置。

### Q2：语音识别不工作？
**A**：
- 使用 Chrome/Edge 浏览器
- 检查麦克风权限
- iOS Safari 支持有限，建议使用文字输入

### Q3：数据会丢失吗？
**A**：
- 数据存储在浏览器 localStorage
- 不会丢失，除非清除浏览器数据
- 建议定期导出备份

### Q4：如何在手机上使用？
**A**：
- 部署到 Vercel（推荐）
- 或访问本地服务器（同一 WiFi）
- 添加到主屏幕获得最佳体验

---

## 📚 完整文档

- [README.md](README.md) - 完整项目文档
- [QUICKSTART.md](QUICKSTART.md) - 快速开始指南
- [DEPLOY.md](DEPLOY.md) - 详细部署指南
- [TEST_CHECKLIST.md](TEST_CHECKLIST.md) - 功能测试清单
- [CHANGELOG.md](CHANGELOG.md) - 更新日志
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目总结
- [COMPLETION_REPORT.md](COMPLETION_REPORT.md) - 完成报告

---

## 🎉 开始使用吧！

**本地访问**：http://localhost:8000

**或部署到 Vercel 获得永久网址**

祝使用愉快！📚✨