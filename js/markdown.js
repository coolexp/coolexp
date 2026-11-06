function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderInline(text) {
  let s = escapeHtml(text);
  s = s.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return s;
}

function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inCode = false, codeBuf = [], codeLang = '';
  let listType = null, listBuf = [];

  const flushList = () => {
    if (!listType) return;
    out.push(`<${listType}>` + listBuf.map(li => `<li>${li}</li>`).join('') + `</${listType}>`);
    listType = null; listBuf = [];
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushList();
      if (!inCode) { inCode = true; codeLang = line.slice(3).trim(); codeBuf = []; }
      else {
        out.push(`<pre><code${codeLang ? ` class="language-${codeLang}"` : ''}>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
        inCode = false;
      }
      continue;
    }
    if (inCode) { codeBuf.push(line); continue; }
    if (/^###\s/.test(line)) { flushList(); out.push(`<h3>${renderInline(line.slice(4))}</h3>`); continue; }
    if (/^##\s/.test(line))  { flushList(); out.push(`<h2>${renderInline(line.slice(3))}</h2>`); continue; }
    if (/^#\s/.test(line))   { flushList(); out.push(`<h1>${renderInline(line.slice(2))}</h1>`); continue; }
    if (/^>\s?/.test(line))  { flushList(); out.push(`<blockquote>${renderInline(line.replace(/^>\s?/, ''))}</blockquote>`); continue; }
    if (/^[-*]\s+/.test(line)) {
      if (listType !== 'ul') { flushList(); listType = 'ul'; }
      listBuf.push(renderInline(line.replace(/^[-*]\s+/, '')));
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      if (listType !== 'ol') { flushList(); listType = 'ol'; }
      listBuf.push(renderInline(line.replace(/^\d+\.\s+/, '')));
      continue;
    }
    if (line.trim() === '') { flushList(); continue; }
    flushList();
    out.push(`<p>${renderInline(line)}</p>`);
  }
  flushList();
  if (inCode) out.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
  return out.join('\n');
}
