import { useState } from 'react';
import type { DemoConfig, ThemeColors } from './types';
import { CodeHighlight } from './CodeHighlight';
import {
  generateInstallCode,
  generateSetupCode,
  generateTableCode,
  generateThemeCode,
  generateCustomizationCode,
} from './codeGenerator';

interface CodeSectionProps {
  title: string;
  code: string;
  defaultOpen?: boolean;
}

function CodeSection({ title, code, defaultOpen = true }: CodeSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-gray-800/50 sticky top-0 cursor-pointer hover:bg-gray-800"
      >
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
          <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-90' : ''}`}>
            {'\u25B6'}
          </span>
          {title}
        </div>
        <button
          onClick={handleCopy}
          className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-gray-400 transition-colors"
        >
          {copied ? '\u2713' : 'Copy'}
        </button>
      </div>
      {isOpen && (
        <div className="px-3 py-2 overflow-x-auto custom-scrollbar">
          <CodeHighlight code={code} />
        </div>
      )}
    </div>
  );
}

function DoneSection() {
  return (
    <div className="px-3 py-4 text-center">
      <div className="text-lg mb-1">{'\uD83C\uDF89'}</div>
      <div className="text-xs font-medium text-gray-300">You're all set!</div>
      <div className="text-[10px] text-gray-500 mt-1">Your table is ready to use</div>
    </div>
  );
}

interface CodePanelProps {
  config: DemoConfig;
  theme: ThemeColors;
}

export function CodePanel({ config, theme }: CodePanelProps) {
  return (
    <div className="bg-gray-900 text-gray-100 h-full overflow-y-auto flex flex-col custom-scrollbar">
      <div className="px-3 py-2 border-b border-gray-700/50 bg-gray-800 flex-shrink-0">
        <h2 className="text-sm font-semibold">Developer Preview</h2>
        <p className="text-[11px] text-gray-500">Code to reproduce this table</p>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-800 custom-scrollbar">
        <CodeSection
          title="0. Install dependencies"
          code={generateInstallCode()}
          defaultOpen={false}
        />
        <CodeSection
          title="1. Setup (once per app)"
          code={generateSetupCode()}
          defaultOpen={false}
        />
        <CodeSection
          title="2. Customize theme (optional)"
          code={generateThemeCode(theme)}
          defaultOpen={false}
        />
        <CodeSection
          title="3. Use the DataTable"
          code={generateTableCode(config)}
        />
        <CodeSection
          title="4. Override styles (rare)"
          code={generateCustomizationCode()}
          defaultOpen={false}
        />
        <DoneSection />
      </div>
    </div>
  );
}
