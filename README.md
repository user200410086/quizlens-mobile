# QuizLens 手机网页版 AI 识题助手

适合课后复习与自测。支持拍照、相册截图、中文解析、提示模式和浏览器本地历史记录。

## 部署到 Render（获得公网 HTTPS 网址）

1. 注册 GitHub，将此项目文件上传到一个 GitHub 仓库（不要上传 `.env` 或任何 API Key）。
2. 登录 https://render.com/ ，选择 **New > Web Service**，连接该仓库。
3. Runtime 选择 **Node**，Build Command 为 `npm install`，Start Command 为 `npm start`。
4. 在 Render 的 **Environment** 中添加 `OPENAI_API_KEY`，值为你自己的 OpenAI API 密钥；可选 `OPENAI_MODEL=gpt-4.1-mini`。
5. 部署成功后打开 Render 提供的 `https://...onrender.com` 地址，手机浏览器即可访问。
6. 在 iPhone Safari 中可使用“分享 > 添加到主屏幕”，Android Chrome 可使用“添加到主屏幕”。

注意：Render 的免费计划及服务限制可能调整，请以其官网当前规则为准。API 费用与 ChatGPT 订阅分开计费。公网服务会消耗你的 API 额度，请勿随意公开地址；如果准备给多人使用，建议增加登录认证和更严格的配额控制。

## 本地运行

安装 Node.js 20 或更高版本，在项目目录执行：

```bash
npm install
```

PowerShell 配置环境变量：

```powershell
$env:OPENAI_API_KEY="你的API密钥"
npm start
```

浏览器打开 http://localhost:3000 。在本地使用手机摄像头时需要 HTTPS，推荐部署后用公网 HTTPS 地址访问。

## 隐私与安全

- API Key 只在服务端读取，不会放入前端网页。
- 图片发送至你的服务器，再提交给 OpenAI API 分析；请不要上传敏感个人信息。
- 历史解析保存在当前浏览器 localStorage；不会自动同步到其他设备。
- 默认每 IP 每分钟最多8次请求，主要用于防止意外滥用，并不能代替用户认证。
- 这是课后学习辅助工具，不保证每题正确；考试中请遵守课程规则。
