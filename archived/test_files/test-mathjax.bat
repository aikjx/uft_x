@echo off
echo ========================================
echo   MathJax 修复测试启动脚本
echo ========================================
echo.

echo [1/3] 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

echo.
echo [2/3] 检查依赖...
if not exist "node_modules" (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
    if errorlevel 1 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装
)

echo.
echo [3/3] 启动开发服务器...
echo.
echo ========================================
echo   服务器启动中...
echo ========================================
echo.
echo 📝 测试页面将在浏览器中打开：
echo    http://localhost:5173/mathjax-fix-test.html
echo.
echo 💡 提示：
echo    - 检查控制台是否显示 "✅ MathJax 已成功加载"
echo    - 确认 4 个公式都正确渲染
echo    - 按 Ctrl+C 停止服务器
echo.
echo ========================================

timeout /t 3 >nul

start http://localhost:5173/mathjax-fix-test.html

call npm run dev
