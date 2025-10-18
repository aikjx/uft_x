# MathJax 修复测试启动脚本 (PowerShell)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MathJax 修复测试启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "[1/3] 检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js 已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js 未安装" -ForegroundColor Red
    Write-Host "请先安装 Node.js: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""

# 检查依赖
Write-Host "[2/3] 检查依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  依赖未安装，正在安装..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
} else {
    Write-Host "✅ 依赖已安装" -ForegroundColor Green
}

Write-Host ""

# 启动服务器
Write-Host "[3/3] 启动开发服务器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  服务器启动中..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 测试页面将在浏览器中打开：" -ForegroundColor White
Write-Host "   http://localhost:5173/mathjax-fix-test.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 提示：" -ForegroundColor White
Write-Host "   - 检查控制台是否显示 '✅ MathJax 已成功加载'" -ForegroundColor Gray
Write-Host "   - 确认 4 个公式都正确渲染" -ForegroundColor Gray
Write-Host "   - 按 Ctrl+C 停止服务器" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 3

# 打开浏览器
Start-Process "http://localhost:5173/mathjax-fix-test.html"

# 启动开发服务器
npm run dev
