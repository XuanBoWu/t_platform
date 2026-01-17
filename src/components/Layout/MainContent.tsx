import React from 'react';
import { CommandPanel } from '../CommandPanel/CommandPanel';
import { Terminal } from '../Terminal/Terminal';
import './MainContent.css';

export const MainContent: React.FC = () => {
  return (
    <div className="main-content">
      <CommandPanel />
      <Terminal />
    </div>
  );
};
