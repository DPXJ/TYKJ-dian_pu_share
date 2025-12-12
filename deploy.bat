@echo off
chcp 65001 >nul
echo ========================================
echo 开始部署到 GitHub Pages
echo ========================================
echo.

echo [1/4] 检查 Git 状态...
git status
echo.

echo [2/4] 添加所有更改的文件...
git add .
echo.

echo [3/4] 提交更改...
git commit -m "添加除草成效分析报告页面及分享功能"
echo.

echo [4/4] 推送到 GitHub...
git push origin main
echo.

echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 请按照以下步骤完成 GitHub Pages 配置：
echo 1. 打开 GitHub 仓库页面
echo 2. 进入 Settings -^> Pages
echo 3. 在 Source 中选择 "GitHub Actions"
echo 4. 保存设置
echo.
echo 部署完成后，网站将在以下地址可用：
echo https://[您的GitHub用户名].github.io/[仓库名]/
echo.
pause
