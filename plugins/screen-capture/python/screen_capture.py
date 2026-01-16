#!/usr/bin/env python3
"""
屏幕截图脚本 - 捕获Android设备屏幕
用法: python screen_capture.py <output_path> [--device DEVICE_ID]
"""

import subprocess
import sys
import os
import argparse
import tempfile
from datetime import datetime


def capture_screen(device_id: str = None, output_path: str = None):
    """捕获设备屏幕"""
    try:
        # 构建ADB命令
        cmd = ['adb']
        if device_id:
            cmd.extend(['-s', device_id])

        # 使用临时文件
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            temp_path = tmp.name

        # 截图命令
        exec_cmd = cmd + ['shell', 'screencap', '-p', '/sdcard/screen.png']
        result = subprocess.run(exec_cmd, capture_output=True, timeout=10)

        if result.returncode != 0:
            raise Exception(f"截图失败: {result.stderr.decode()}")

        # 拉取文件到本地
        pull_cmd = cmd + ['pull', '/sdcard/screen.png', temp_path]
        result = subprocess.run(pull_cmd, capture_output=True, timeout=30)

        if result.returncode != 0:
            raise Exception(f"传输失败: {result.stderr.decode()}")

        # 清理设备上的临时文件
        subprocess.run(cmd + ['shell', 'rm', '/sdcard/screen.png'], capture_output=True)

        # 如果指定了输出路径，复制过去
        if output_path:
            os.rename(temp_path, output_path)
            actual_path = output_path
        else:
            # 生成带时间戳的文件名
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            default_path = f'screenshot_{timestamp}.png'
            os.rename(temp_path, default_path)
            actual_path = default_path

        return {
            'success': True,
            'path': actual_path,
            'message': f'截图已保存: {actual_path}'
        }

    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': '操作超时'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Android Screen Capture')
    parser.add_argument('output', nargs='?', help='Output file path')
    parser.add_argument('--device', '-d', help='Device ID')
    args = parser.parse_args()

    result = capture_screen(args.device, args.output)
    print(json.dumps(result, ensure_ascii=False, indent=2))
