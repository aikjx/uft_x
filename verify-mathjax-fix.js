/**
 * MathJax 修复验证脚本
 * 用于快速验证修复是否成功
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始验证 MathJax 修复...\n');

const checks = [];

// 1. 检查 index.html
try {
  const indexPath = path.join(__dirname, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  if (indexContent.includes('window.MathJax = {')) {
    checks.push({ name: 'index.html MathJax 配置', status: '✅', message: '配置存在' });
  } else {
    checks.push({ name: 'index.html MathJax 配置', status: '❌', message: '配置缺失' });
  }
  
  if (indexContent.includes("inlineMath: [['\\\\(', '\\\\)'], ['$', '$']]")) {
    checks.push({ name: 'inlineMath 配置', status: '✅', message: '格式正确' });
  } else {
    checks.push({ name: 'inlineMath 配置', status: '⚠️', message: '格式可能有问题' });
  }
  
  if (indexContent.includes('mathjax-ready')) {
    checks.push({ name: 'MathJax 就绪事件', status: '✅', message: '事件已配置' });
  } else {
    checks.push({ name: 'MathJax 就绪事件', status: '❌', message: '事件未配置' });
  }
} catch (error) {
  checks.push({ name: 'index.html', status: '❌', message: `读取失败: ${error.message}` });
}

// 2. 检查 mathjax.ts
try {
  const mathjaxPath = path.join(__dirname, 'src/utils/mathjax.ts');
  const mathjaxContent = fs.readFileSync(mathjaxPath, 'utf-8');
  
  if (mathjaxContent.includes('class MathJaxManager')) {
    checks.push({ name: 'MathJax 管理器类', status: '✅', message: '已创建' });
  } else {
    checks.push({ name: 'MathJax 管理器类', status: '❌', message: '未找到' });
  }
  
  if (mathjaxContent.includes('async typeset')) {
    checks.push({ name: '渲染方法', status: '✅', message: '已实现' });
  } else {
    checks.push({ name: '渲染方法', status: '❌', message: '未实现' });
  }
  
  if (mathjaxContent.includes('retries')) {
    checks.push({ name: '重试机制', status: '✅', message: '已实现' });
  } else {
    checks.push({ name: '重试机制', status: '❌', message: '未实现' });
  }
} catch (error) {
  checks.push({ name: 'mathjax.ts', status: '❌', message: `读取失败: ${error.message}` });
}

// 3. 检查 MathFormula.vue
try {
  const formulaPath = path.join(__dirname, 'src/components/MathFormula.vue');
  const formulaContent = fs.readFileSync(formulaPath, 'utf-8');
  
  if (formulaContent.includes("import { mathJaxManager }")) {
    checks.push({ name: 'MathFormula 组件导入', status: '✅', message: '已导入管理器' });
  } else {
    checks.push({ name: 'MathFormula 组件导入', status: '❌', message: '未导入管理器' });
  }
  
  if (formulaContent.includes('mathJaxManager.typeset')) {
    checks.push({ name: 'MathFormula 使用管理器', status: '✅', message: '已使用' });
  } else {
    checks.push({ name: 'MathFormula 使用管理器', status: '❌', message: '未使用' });
  }
} catch (error) {
  checks.push({ name: 'MathFormula.vue', status: '❌', message: `读取失败: ${error.message}` });
}

// 4. 检查测试文件
try {
  const testPath = path.join(__dirname, 'mathjax-fix-test.html');
  if (fs.existsSync(testPath)) {
    checks.push({ name: '测试文件', status: '✅', message: '已创建' });
  } else {
    checks.push({ name: '测试文件', status: '⚠️', message: '未找到' });
  }
} catch (error) {
  checks.push({ name: '测试文件', status: '❌', message: `检查失败: ${error.message}` });
}

// 5. 检查文档
try {
  const docPath = path.join(__dirname, 'MATHJAX_FIX_GUIDE.md');
  if (fs.existsSync(docPath)) {
    checks.push({ name: '修复文档', status: '✅', message: '已创建' });
  } else {
    checks.push({ name: '修复文档', status: '⚠️', message: '未找到' });
  }
} catch (error) {
  checks.push({ name: '修复文档', status: '❌', message: `检查失败: ${error.message}` });
}

// 输出结果
console.log('📋 验证结果：\n');
console.log('┌─────────────────────────────────┬────────┬──────────────────────┐');
console.log('│ 检查项                          │ 状态   │ 说明                 │');
console.log('├─────────────────────────────────┼────────┼──────────────────────┤');

checks.forEach(check => {
  const name = check.name.padEnd(30);
  const status = check.status.padEnd(6);
  const message = check.message.padEnd(20);
  console.log(`│ ${name} │ ${status} │ ${message} │`);
});

console.log('└─────────────────────────────────┴────────┴──────────────────────┘\n');

// 统计
const passed = checks.filter(c => c.status === '✅').length;
const failed = checks.filter(c => c.status === '❌').length;
const warnings = checks.filter(c => c.status === '⚠️').length;

console.log(`📊 统计：`);
console.log(`   ✅ 通过: ${passed}`);
console.log(`   ❌ 失败: ${failed}`);
console.log(`   ⚠️  警告: ${warnings}`);
console.log(`   📝 总计: ${checks.length}\n`);

if (failed === 0) {
  console.log('🎉 所有关键检查都已通过！');
  console.log('\n📝 下一步：');
  console.log('   1. 运行 npm run dev 启动开发服务器');
  console.log('   2. 访问 http://localhost:5173/mathjax-fix-test.html');
  console.log('   3. 检查公式是否正确渲染');
  console.log('   4. 查看浏览器控制台确认无错误\n');
} else {
  console.log('⚠️  发现问题，请检查失败的项目！\n');
  process.exit(1);
}
