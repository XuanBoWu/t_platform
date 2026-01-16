#!/usr/bin/env python3
"""
电池监控脚本 - 获取Android设备电池信息
用法: python battery_monitor.py [--json]
"""

import subprocess
import json
import sys
import argparse


def get_battery_info():
    """获取电池信息"""
    try:
        # 获取电池状态
        result = subprocess.run(
            ['adb', 'shell', 'dumpsys', 'battery'],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode != 0:
            return {
                'success': False,
                'error': result.stderr
            }

        # 解析电池信息
        battery_info = {}
        for line in result.stdout.split('\n'):
            line = line.strip()
            if ':' in line:
                key, value = line.split(':', 1)
                battery_info[key.strip().lower().replace(' ', '_')] = value.strip()

        return {
            'success': True,
            'data': battery_info
        }

    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'error': 'Command timed out'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def get_battery_json():
    """获取JSON格式的电池信息"""
    info = get_battery_info()
    return json.dumps(info, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Android Battery Monitor')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    args = parser.parse_args()

    if args.json:
        print(get_battery_json())
    else:
        info = get_battery_info()
        if info['success']:
            for key, value in info['data'].items():
                print(f"{key}: {value}")
        else:
            print(f"Error: {info['error']}")
