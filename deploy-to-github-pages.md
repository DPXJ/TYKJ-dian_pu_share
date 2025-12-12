# GitHub Pages 快速部署指南

## ✅ 已完成的配置
- ✅ GitHub Actions workflow 已配置 (`.github/workflows/deploy-pages.yml`)
- ✅ 静态网站文件已准备就绪

## 🚀 部署步骤

### 步骤 1: 确保代码已提交并推送
如果您的代码还没有推送到 GitHub，请执行以下命令：

```bash
# 检查当前状态
git status

# 如果有未提交的更改，添加并提交
git add .
git commit -m "准备部署到 GitHub Pages"

# 推送到 GitHub（如果还没有远程仓库，需要先添加）
git push origin main
```

### 步骤 2: 在 GitHub 上启用 Pages
1. 打开您的 GitHub 仓库页面
2. 点击 **Settings**（设置）标签
3. 在左侧菜单中找到 **Pages**（页面）
4. 在 **Source**（源）部分，选择 **GitHub Actions**
5. 保存设置

### 步骤 3: 等待自动部署
- 推送代码后，GitHub Actions 会自动运行
- 您可以在仓库的 **Actions** 标签中查看部署进度
- 部署通常需要 1-2 分钟

### 步骤 4: 访问您的网站
部署完成后，您的网站将在以下地址可用：
```
https://[您的GitHub用户名].github.io/[仓库名]/
```

## 📝 注意事项

1. **仓库可见性**：免费账户需要将仓库设置为公开（Public）才能使用 GitHub Pages
2. **分支名称**：确保您的主分支是 `main`（不是 `master`）
3. **首次部署**：第一次部署可能需要几分钟时间
4. **自动更新**：之后每次推送到 `main` 分支都会自动重新部署

## 🔍 检查部署状态

1. 在 GitHub 仓库页面，点击 **Actions** 标签
2. 查看最新的工作流运行状态
3. 如果显示绿色 ✓，说明部署成功
4. 如果显示红色 ✗，点击查看错误详情

## 🆘 常见问题

**Q: 部署失败怎么办？**
- 检查仓库是否为公开仓库
- 检查 GitHub Actions 权限设置
- 查看 Actions 日志中的错误信息

**Q: 网站无法访问？**
- 等待几分钟让部署完成
- 检查 Pages 设置中是否选择了 "GitHub Actions"
- 确认 URL 地址是否正确

**Q: 如何更新网站？**
- 只需推送新的代码到 `main` 分支
- GitHub Actions 会自动重新部署
