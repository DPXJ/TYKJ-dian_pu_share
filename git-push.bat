@echo off
chcp 65001 >nul
echo ========================================
echo 开始推送到 GitHub Pages
echo ========================================
echo.

echo [1/5] 检查 Git 状态...
git status
echo.

echo [2/5] 添加所有更改的文件...
git add .
echo.

echo [3/5] 提交更改...
git commit -m "feat: 添加除草成效分析报告页面及分享功能

- 新增除草成效分析报告页面 (weedControlAnalysisReport)
- 实现完整的分享功能（微信、朋友圈、抖音、生成图片、复制链接）
- 优化按钮点击事件，点击除草成效分析按钮直接跳转到报告页面
- 添加报告页面样式和分享海报样式"
echo.

echo [4/5] 推送到 GitHub...
git push origin main
echo.

echo [5/5] 检查推送状态...
git status
echo.

echo ========================================
echo 推送完成！
echo ========================================
echo.
echo GitHub Actions 将自动部署到 GitHub Pages
echo 请访问仓库的 Actions 标签查看部署进度
echo.
echo 部署完成后，网站将在以下地址可用：
echo https://[您的GitHub用户名].github.io/[仓库名]/
echo.
pause
