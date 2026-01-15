import { Highlight, themes } from 'prism-react-renderer';

interface CodeHighlightProps {
  code: string;
}

export function CodeHighlight({ code }: CodeHighlightProps) {
  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language="tsx">
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre style={{ ...style, background: 'transparent', margin: 0, fontSize: '13px', lineHeight: 1.4 }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
