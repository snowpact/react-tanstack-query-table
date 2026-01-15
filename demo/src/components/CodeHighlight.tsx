interface CodeHighlightProps {
  code: string;
}

export function CodeHighlight({ code }: CodeHighlightProps) {
  const highlightCode = (code: string): string => {
    const tokens: { type: string; value: string }[] = [];
    let remaining = code;

    const patterns: { type: string; regex: RegExp }[] = [
      { type: 'comment', regex: /^(\/\/.*$)/m },
      { type: 'string', regex: /^(['"`])((?:\\.|(?!\1)[^\\])*?)\1/ },
      { type: 'keyword', regex: /^(import|export|from|const|let|var|function|return|if|else|for|while|switch|case|break|continue|new|this|class|extends|implements|interface|type|async|await|try|catch|throw|finally|default|true|false|null|undefined)\b/ },
      { type: 'type', regex: /^([A-Z][a-zA-Z0-9]*)/ },
      { type: 'number', regex: /^(\d+)/ },
      { type: 'function', regex: /^([a-z][a-zA-Z0-9]*)\s*(?=\()/ },
      { type: 'bracket', regex: /^([{}[\]()])/ },
      { type: 'operator', regex: /^([=<>!+\-*/&|?:]+)/ },
      { type: 'property', regex: /^\.([a-zA-Z_][a-zA-Z0-9_]*)/ },
      { type: 'text', regex: /^([^'"`\/{}[\]()=<>!+\-*/&|?:.\s\w]+)/ },
      { type: 'space', regex: /^(\s+)/ },
      { type: 'other', regex: /^(.)/ },
    ];

    while (remaining.length > 0) {
      let matched = false;
      for (const { type, regex } of patterns) {
        const match = remaining.match(regex);
        if (match) {
          if (type === 'property') {
            tokens.push({ type: 'other', value: '.' });
            tokens.push({ type, value: match[1] });
            remaining = remaining.slice(match[0].length);
          } else {
            tokens.push({ type, value: match[0] });
            remaining = remaining.slice(match[0].length);
          }
          matched = true;
          break;
        }
      }
      if (!matched) {
        tokens.push({ type: 'other', value: remaining[0] });
        remaining = remaining.slice(1);
      }
    }

    const escapeHtml = (str: string) =>
      str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return tokens
      .map(({ type, value }) => {
        const escaped = escapeHtml(value);
        switch (type) {
          case 'comment':
            return `<span class="code-comment">${escaped}</span>`;
          case 'string':
            return `<span class="code-string">${escaped}</span>`;
          case 'keyword':
            return `<span class="code-keyword">${escaped}</span>`;
          case 'type':
            return `<span class="code-type">${escaped}</span>`;
          case 'number':
            return `<span class="code-number">${escaped}</span>`;
          case 'function':
            return `<span class="code-function">${escaped}</span>`;
          case 'bracket':
            return `<span class="code-bracket">${escaped}</span>`;
          case 'property':
            return `<span class="code-property">${escaped}</span>`;
          default:
            return escaped;
        }
      })
      .join('');
  };

  return (
    <pre>
      <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
    </pre>
  );
}
