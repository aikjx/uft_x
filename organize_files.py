#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文件整理脚本
用于整理项目中的测试文件、文档和配置文件
"""

import os
import shutil
from pathlib import Path

# 定义文件分类规则
FILE_CATEGORIES = {
    'test_files': {
        'folder': 'archived/test_files',
        'patterns': [
            'diagnose.html',
            'formula-debug.html',
            'formula-test.html',
            'mathjax-advanced-config-test.html',
            'mathjax-comprehensive-test.html',
            'mathjax-fix-test.html',
            'mathjax-interactive-test.html',
            'mathjax-optimization-demo.html',
            'mathjax-performance-test.html',
            'mathjax-test-suite-index.html',
            'performance-test.html',
            'test-all-formulas.html',
            'test-formula-simple.html',
            'test-math-formula.js',
            'test-mathjax.bat',
            'test-mathjax.ps1',
            'verify-mathjax-fix.js',
        ]
    },
    'fix_scripts': {
        'folder': 'archived/fix_scripts',
        'patterns': [
            'fix-formula-rendering.js',
            'quick-fix.js',
        ]
    },
    'documentation': {
        'folder': 'archived/documentation',
        'patterns': [
            'FORMULA_FIX_GUIDE.md',
            'FORMULA_RENDERING_SOLUTION.md',
            'MATHJAX_FIX_GUIDE.md',
            'MATHJAX_修复完成.md',
            'MATHJAX_修复文件清单.md',
            'MATHJAX_快速测试.md',
            'OPTIMIZATION_ACHIEVEMENTS.md',
        ]
    },
    'optimized_configs': {
        'folder': 'archived/optimized_configs',
        'patterns': [
            'eslint.config.optimized.js',
            'package.optimized.json',
            'vite.config.optimized.ts',
            'vitest.config.optimized.ts',
        ]
    }
}

# 需要保留的重要文件（不移动）
KEEP_FILES = [
    '.env',
    '.env.production',
    '.eslintrc-auto-import.json',
    '.eslintrc.cjs',
    '.gitignore',
    '.npmrc',
    '.prettierrc.json',
    'auto-imports.d.ts',
    'components.d.ts',
    'env.d.ts',
    'index.html',
    'LICENSE',
    'package.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'postcss.config.js',
    'README.md',
    'tailwind.config.js',
    'tsconfig.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'vitest.config.ts',
]

def create_folder_if_not_exists(folder_path):
    """创建文件夹（如果不存在）"""
    Path(folder_path).mkdir(parents=True, exist_ok=True)
    print(f"✓ 创建文件夹: {folder_path}")

def move_file(src, dest_folder):
    """移动文件到目标文件夹"""
    if not os.path.exists(src):
        print(f"✗ 文件不存在: {src}")
        return False
    
    create_folder_if_not_exists(dest_folder)
    dest = os.path.join(dest_folder, os.path.basename(src))
    
    try:
        shutil.move(src, dest)
        print(f"✓ 移动: {src} -> {dest}")
        return True
    except Exception as e:
        print(f"✗ 移动失败: {src} - {e}")
        return False

def organize_files(dry_run=True):
    """整理文件"""
    print("=" * 60)
    print("文件整理脚本")
    print("=" * 60)
    
    if dry_run:
        print("\n【预览模式】- 不会实际移动文件\n")
    else:
        print("\n【执行模式】- 将实际移动文件\n")
    
    moved_count = 0
    
    for category, config in FILE_CATEGORIES.items():
        print(f"\n--- {category} ---")
        dest_folder = config['folder']
        
        for pattern in config['patterns']:
            if dry_run:
                if os.path.exists(pattern):
                    print(f"[预览] 将移动: {pattern} -> {dest_folder}")
                    moved_count += 1
            else:
                if move_file(pattern, dest_folder):
                    moved_count += 1
    
    print("\n" + "=" * 60)
    print(f"总计: {moved_count} 个文件")
    
    if dry_run:
        print("\n要实际执行移动，请运行: python organize_files.py --execute")
    else:
        print("\n✓ 文件整理完成！")
    print("=" * 60)

if __name__ == "__main__":
    import sys
    
    # 检查是否有 --execute 参数
    execute = '--execute' in sys.argv or '-e' in sys.argv
    
    organize_files(dry_run=not execute)
