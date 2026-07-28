# My Intimate Relationship Mentor — Encrypted Pages

这是亲密关系成长中心的公开 GitHub Pages 外壳。

## 隐私结构

公开仓库只保存：

- 本地解密页面；
- 通用样式与解密程序；
- AES-256-GCM 加密后的内容包；
- GitHub Pages 部署工作流。

公开仓库不保存：

- 原始聊天记录；
- 明文关系分析；
- 明文对话脚本；
- 图片、语音、视频等原始媒体；
- 解密密码、访问令牌或其他凭据。

解密密码通过 PBKDF2-HMAC-SHA-256 在浏览器本地派生 AES-256-GCM 密钥。密码不会提交到 GitHub，也不会由网页发送到服务器。

## 发布方式

加密内容由私有源仓库中的手动 GitHub Actions 工作流生成。工作流只把 `assets/private-content.enc.json` 密文文件推送到本仓库。

## 安全边界

客户端加密无法阻止他人下载密文并离线尝试密码。因此必须使用独立、随机、至少 24 个字符的解密密码，不得复用 GitHub、邮箱、Cloudflare 或其他账户密码。
