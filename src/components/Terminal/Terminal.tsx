import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { useAppStore } from '../../store';
import { CommandResult } from '../../types';
import './Terminal.css';

const { Text } = Typography;

export const Terminal: React.FC = () => {
  const { commandResults } = useAppStore();

  const renderOutput = (result: CommandResult, index: number) => {
    const isError = !result.success || result.stderr;

    return (
      <div key={index} className="terminal-output">
        <div className="terminal-output-header">
          <Text type={isError ? 'danger' : 'secondary'}>
            {isError ? '✗ 执行失败' : '✓ 执行成功'}
          </Text>
        </div>
        <pre className="terminal-output-content">
          {result.stdout}
          {result.stderr && (
            <>
              <div style={{ color: '#f85149', marginTop: 8 }}>错误:</div>
              <div style={{ color: '#f85149' }}>{result.stderr}</div>
            </>
          )}
        </pre>
      </div>
    );
  };

  return (
    <div className="terminal">
      <div className="terminal-header">
        <Text style={{ color: '#cccccc' }}>终端输出</Text>
      </div>
      <div className="terminal-content">
        {commandResults.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span style={{ color: '#888' }}>暂无命令输出</span>}
          />
        ) : (
          <div className="terminal-outputs">
            {commandResults.map((result, index) => renderOutput(result, index))}
          </div>
        )}
      </div>
    </div>
  );
};
