# coolexp 个人研究主页 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 GitHub Pages 上发布深色科技风的双语个人研究主页（3 个静态页面 + 零依赖 JS）。

**Architecture:** 三个 HTML 页面（index/blog/article）共享一套 CSS 与四个 JS 文件（i18n/posts/markdown/main），全部在读者浏览器执行，push 到 main 即部署。

**Tech Stack:** 原生 HTML/CSS/JS，无框架、无构建、无 CDN。

## Global Constraints

- 零依赖：不引入任何框架、构建步骤、CDN 资源、外部字体（spec §3）
- 界面文案双语 zh/en；文章带 `lang` 字段单语（spec §4.2）
- 语言选择存 localStorage key `lang`；默认 `navigator.language` 以 `zh` 开头则 zh，否则 en（spec §4.2）
- 署名统一 `coolexp`（spec §5）
- 深色科技风：深蓝黑底、青/紫霓虹点缀、玻璃拟态卡片、等宽字体点缀（spec §4.5）
- 错误边界仅两条：未知 slug 显示"文章不存在"；posts 为空显示空态（spec §8）
- 本地预览命令：`python3 -m http.server 8000`（在仓库根目录）

---

### Task 1: 深色主题 CSS + 三页 HTML 骨架

**Files:**
- Create: `css/style.css`
- Create: `index.html`
- Create: `blog.html`
- Create: `article.html`

**Interfaces:**
- Consumes: 无
- Produces: DOM id `langToggle`（Task 2 绑定事件）、`researchGrid` / `latestPosts`（Task 4 渲染目标）、`postList`（Task 5）、`articleBox`（Task 5）；`data-i18n` 属性节点（Task 2 替换）；脚本加载顺序 `js/i18n.js` → `js/posts.js` → `js/markdown.js` → `js/main.js`

- [ ] **Step 1: 写 css/style.css**

```css
:root {
  --bg: #0a0e17;
  --bg-soft: #0f1522;
  --card: rgba(255, 255, 255, 0.04);
  --border: rgba(255, 255, 255, 0.09);
  --text: #e6edf3;
  --text-dim: #8b949e;
  --accent: #22d3ee;
  --accent2: #a78bfa;
  --mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif;
  line-height: 1.7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main { flex: 1; width: 100%; max-width: 1000px; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

/* 导航 */
.nav {
  position: sticky; top: 0; z-index: 10;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.9rem 1.25rem;
  background: rgba(10, 14, 23, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: var(--mono); font-size: 1.15rem; font-weight: 700;
  color: var(--text);
}
.nav-logo::before { content: "<"; color: var(--accent); }
.nav-logo::after { content: " />"; color: var(--accent2); }
.nav-right { display: flex; align-items: center; gap: 1.25rem; }
.nav-link { color: var(--text-dim); font-size: 0.95rem; }
.nav-link:hover { color: var(--text); text-decoration: none; }
.lang-btn {
  font-family: var(--mono); font-size: 0.8rem;
  color: var(--accent); background: transparent;
  border: 1px solid var(--accent); border-radius: 4px;
  padding: 0.15rem 0.55rem; cursor: pointer;
}
.lang-btn:hover { background: rgba(34, 211, 238, 0.12); }

/* Hero */
.hero { text-align: center; padding: 4rem 0 3rem; }
.hero h1 {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero .tagline {
  font-family: var(--mono); color: var(--text-dim);
  margin: 0.75rem 0 1.25rem; font-size: 0.95rem; letter-spacing: 0.05em;
}
.hero .intro { max-width: 620px; margin: 0 auto; color: var(--text-dim); }

/* 区块标题 */
.section-title { font-size: 1.5rem; margin-bottom: 0.4rem; }
.section-title::before { content: "# "; color: var(--accent); font-family: var(--mono); }
.section-sub { color: var(--text-dim); font-size: 0.9rem; margin-bottom: 1.5rem; }

/* 卡片 */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.4rem;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.card:hover {
  border-color: rgba(34, 211, 238, 0.5);
  box-shadow: 0 0 24px rgba(34, 211, 238, 0.08);
  transform: translateY(-2px);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  margin-bottom: 3.5rem;
}

.research-card .card-icon { font-size: 1.5rem; margin-bottom: 0.6rem; }
.research-card h3 { font-size: 1.05rem; margin-bottom: 0.4rem; }
.research-card p { color: var(--text-dim); font-size: 0.88rem; }

/* 文章条目 */
.post-item { display: block; color: inherit; }
.post-item:hover { text-decoration: none; }
.post-item h3 { font-size: 1.05rem; margin: 0.35rem 0; }
.post-item h3:hover { color: var(--accent); }
.post-item p { color: var(--text-dim); font-size: 0.88rem; }
.post-meta {
  display: flex; gap: 0.75rem; align-items: center;
  font-family: var(--mono); font-size: 0.75rem; color: var(--text-dim);
}
.lang-tag {
  border: 1px solid var(--accent2); color: var(--accent2);
  border-radius: 3px; padding: 0 0.35rem; font-size: 0.7rem;
}
.view-all { font-family: var(--mono); font-size: 0.9rem; }
.empty { color: var(--text-dim); font-family: var(--mono); }

/* 文章详情 */
.article-box { max-width: 760px; margin: 0 auto; }
.article-box h1 { font-size: 1.9rem; margin: 0.75rem 0 1.5rem; }
.article-body h2 { margin: 1.8rem 0 0.6rem; font-size: 1.3rem; }
.article-body h3 { margin: 1.4rem 0 0.5rem; font-size: 1.1rem; }
.article-body p { margin-bottom: 1rem; }
.article-body ul, .article-body ol { margin: 0 0 1rem 1.5rem; }
.article-body blockquote {
  border-left: 3px solid var(--accent);
  background: var(--bg-soft);
  padding: 0.6rem 1rem; margin: 0 0 1rem;
  color: var(--text-dim);
}
.article-body code {
  font-family: var(--mono); font-size: 0.85em;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 4px; padding: 0.1rem 0.35rem;
}
.article-body pre {
  background: var(--bg-soft); border: 1px solid var(--border);
  border-radius: 8px; padding: 1rem 1.25rem;
  overflow-x: auto; margin-bottom: 1rem;
}
.article-body pre code { background: none; border: none; padding: 0; font-size: 0.85rem; }
.article-body img { max-width: 100%; border-radius: 8px; }

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 1.5rem; text-align: center;
  color: var(--text-dim); font-size: 0.85rem;
}
.footer a { font-family: var(--mono); margin-left: 0.75rem; }

@media (max-width: 480px) {
  .nav { padding: 0.8rem 1rem; }
  .nav-right { gap: 0.9rem; }
}
```

- [ ] **Step 2: 写 index.html**

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>coolexp</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="nav">
    <a class="nav-logo" href="index.html">coolexp</a>
    <div class="nav-right">
      <a class="nav-link" href="index.html" data-i18n="navHome">首页</a>
      <a class="nav-link" href="blog.html" data-i18n="navBlog">博客</a>
      <button id="langToggle" class="lang-btn" type="button">EN</button>
    </div>
  </nav>
  <main>
    <section class="hero">
      <h1 data-i18n="heroName">coolexp</h1>
      <p class="tagline" data-i18n="heroTagline">AI · 多智能体 · 企业架构 · 数字化转型 · 大模型优化</p>
      <p class="intro" data-i18n="heroIntro">长期研究人工智能与企业数字化的工程师，关注多智能体系统协作、企业架构方法与大模型优化实践。</p>
    </section>
    <section>
      <h2 class="section-title" data-i18n="researchTitle">研究方向</h2>
      <p class="section-sub" data-i18n="researchSubtitle">五个核心领域，从算法到企业落地</p>
      <div class="grid" id="researchGrid"></div>
    </section>
    <section>
      <h2 class="section-title" data-i18n="latestTitle">最新文章</h2>
      <p class="section-sub"><a class="view-all" href="blog.html" data-i18n="viewAll">查看全部 →</a></p>
      <div class="grid" id="latestPosts"></div>
    </section>
  </main>
  <footer class="footer">
    <span data-i18n="footerText">© 2026 coolexp · 由 GitHub Pages 托管</span>
    <a href="https://github.com/coolexp" target="_blank" rel="noopener">GitHub</a>
  </footer>
  <script src="js/i18n.js"></script>
  <script src="js/posts.js"></script>
  <script src="js/markdown.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: 写 blog.html**（head/nav/footer 与 index.html 完全一致，仅 main 不同）

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>coolexp · 博客</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="nav">
    <a class="nav-logo" href="index.html">coolexp</a>
    <div class="nav-right">
      <a class="nav-link" href="index.html" data-i18n="navHome">首页</a>
      <a class="nav-link" href="blog.html" data-i18n="navBlog">博客</a>
      <button id="langToggle" class="lang-btn" type="button">EN</button>
    </div>
  </nav>
  <main>
    <section>
      <h2 class="section-title" data-i18n="blogTitle">博客</h2>
      <p class="section-sub" data-i18n="blogSubtitle">研究与思考</p>
      <div class="grid" id="postList"></div>
    </section>
  </main>
  <footer class="footer">
    <span data-i18n="footerText">© 2026 coolexp · 由 GitHub Pages 托管</span>
    <a href="https://github.com/coolexp" target="_blank" rel="noopener">GitHub</a>
  </footer>
  <script src="js/i18n.js"></script>
  <script src="js/posts.js"></script>
  <script src="js/markdown.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: 写 article.html**（同上，main 为文章容器）

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>coolexp</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <nav class="nav">
    <a class="nav-logo" href="index.html">coolexp</a>
    <div class="nav-right">
      <a class="nav-link" href="index.html" data-i18n="navHome">首页</a>
      <a class="nav-link" href="blog.html" data-i18n="navBlog">博客</a>
      <button id="langToggle" class="lang-btn" type="button">EN</button>
    </div>
  </nav>
  <main>
    <article class="article-box" id="articleBox"></article>
  </main>
  <footer class="footer">
    <span data-i18n="footerText">© 2026 coolexp · 由 GitHub Pages 托管</span>
    <a href="https://github.com/coolexp" target="_blank" rel="noopener">GitHub</a>
  </footer>
  <script src="js/i18n.js"></script>
  <script src="js/posts.js"></script>
  <script src="js/markdown.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: 验证布局**

Run: `python3 -m http.server 8000`（仓库根目录，后台运行），浏览器打开 `http://localhost:8000/index.html`、`/blog.html`、`/article.html`。
Expected: 深色背景、sticky 毛玻璃导航、渐变 Hero 标题；三个页面导航互通；此时卡片区域为空（JS 未实现）属预期。截图留存。

- [ ] **Step 6: Commit**

```bash
git add css index.html blog.html article.html
git commit -m "feat: dark tech theme skeleton with three pages"
```

---

### Task 2: i18n 双语系统

**Files:**
- Create: `js/i18n.js`

**Interfaces:**
- Consumes: DOM 节点的 `data-i18n` 属性、`#langToggle` 按钮（Task 1 产出）
- Produces: 全局 `I18N`（字典对象，键值见下方代码）、`getLang(): 'zh'|'en'`、`applyLang(lang: 'zh'|'en'): void`（替换所有 data-i18n 文本、更新按钮标签、写 localStorage、派发 `langchange` 事件）

- [ ] **Step 1: 写 js/i18n.js**

```js
const I18N = {
  zh: {
    navHome: '首页',
    navBlog: '博客',
    heroName: 'coolexp',
    heroTagline: 'AI · 多智能体 · 企业架构 · 数字化转型 · 大模型优化',
    heroIntro: '长期研究人工智能与企业数字化的工程师，关注多智能体系统协作、企业架构方法与大模型优化实践。',
    researchTitle: '研究方向',
    researchSubtitle: '五个核心领域，从算法到企业落地',
    latestTitle: '最新文章',
    viewAll: '查看全部 →',
    blogTitle: '博客',
    blogSubtitle: '研究与思考',
    emptyBlog: '还没有文章。',
    notFoundTitle: '文章不存在',
    notFoundBack: '← 返回博客',
    footerText: '© 2026 coolexp · 由 GitHub Pages 托管'
  },
  en: {
    navHome: 'Home',
    navBlog: 'Blog',
    heroName: 'coolexp',
    heroTagline: 'AI · Multi-Agent · Enterprise Architecture · Digital Transformation · LLM Optimization',
    heroIntro: 'Engineer researching AI and enterprise digitalization, focusing on multi-agent collaboration, enterprise architecture methods and LLM optimization practices.',
    researchTitle: 'Research',
    researchSubtitle: 'Five core areas, from algorithms to enterprise adoption',
    latestTitle: 'Latest Posts',
    viewAll: 'View all →',
    blogTitle: 'Blog',
    blogSubtitle: 'Research and thoughts',
    emptyBlog: 'No posts yet.',
    notFoundTitle: 'Post not found',
    notFoundBack: '← Back to blog',
    footerText: '© 2026 coolexp · Hosted on GitHub Pages'
  }
};

function getLang() {
  const saved = localStorage.getItem('lang');
  if (saved === 'zh' || saved === 'en') return saved;
  return navigator.language.startsWith('zh') ? 'zh' : 'en';
}

function applyLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key] !== undefined) el.textContent = I18N[lang][key];
  });
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中文';
  localStorage.setItem('lang', lang);
  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}
```

- [ ] **Step 2: 浏览器验证**

Run: 浏览器打开 `http://localhost:8000/index.html`，控制台执行 `applyLang('en'); applyLang('zh');`
Expected: 导航/Hero/Footer 文本随调用切换为英文再切回中文；按钮标签在 `EN`/`中文` 之间变化。（main.js 未实现前页面加载时不会自动调用 applyLang，属预期；语言按钮点击暂无响应也属预期，Task 4 接管。）

- [ ] **Step 3: Commit**

```bash
git add js/i18n.js
git commit -m "feat: bilingual i18n system with localStorage persistence"
```

---

### Task 3: Markdown 渲染器 + 文章数据

**Files:**
- Create: `js/markdown.js`
- Create: `js/posts.js`

**Interfaces:**
- Consumes: 无
- Produces: `renderMarkdown(md: string): string`（返回 HTML 字符串，输入先整体转义防结构破坏）；全局 `POSTS` 数组，元素结构 `{ slug, title: {zh, en}, date, lang, excerpt: {zh, en}, content }`

- [ ] **Step 1: 写 js/markdown.js**

```js
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
```

- [ ] **Step 2: node 冒烟断言（一次性验证命令，不产生测试文件）**

Run（仓库根目录）:

```bash
node -e "
const fs = require('fs');
eval(fs.readFileSync('js/markdown.js', 'utf8'));
const html = renderMarkdown('# T\n\n**b** *i* \`c\`\n\n- a\n- b\n\n1. x\n\n> q\n\n\`\`\`py\n1 < 2\n\`\`\`\n\n[l](https://x.com)');
const assert = require('assert');
assert.ok(html.includes('<h1>T</h1>'));
assert.ok(html.includes('<strong>b</strong>'));
assert.ok(html.includes('<em>i</em>'));
assert.ok(html.includes('<code>c</code>'));
assert.ok(html.includes('<ul><li>a</li><li>b</li></ul>'));
assert.ok(html.includes('<ol><li>x</li></ol>'));
assert.ok(html.includes('<blockquote>q</blockquote>'));
assert.ok(html.includes('1 &lt; 2'));
assert.ok(html.includes('href=\"https://x.com\"'));
console.log('markdown renderer OK');
"
```

Expected: 输出 `markdown renderer OK`

- [ ] **Step 3: 写 js/posts.js（含 1 篇示例文章，正文覆盖渲染器全部语法）**

注意：content 为 template literal，正文里的反引号必须写成 `\\``。

```js
const POSTS = [
  {
    slug: 'why-multi-agent',
    title: { zh: '为什么研究多智能体系统', en: 'Why Multi-Agent Systems' },
    date: '2026-11-06',
    lang: 'zh',
    excerpt: {
      zh: '单个大模型已经足够强大，为什么还需要多个智能体？从任务分解、通信协议到共识达成的三个关键问题。',
      en: 'Why do we need multiple agents when a single LLM is already powerful? Three key problems: decomposition, communication, consensus.'
    },
    content: `# 为什么研究多智能体系统

单个大模型已经足够强大，为什么还需要**多个智能体**？

## 从单体到协作

现实世界的复杂任务往往超出单次推理的能力边界：上下文长度有限、角色职责混杂、验证与执行耦合。多智能体系统通过*分工*把这些问题拆开。

## 关键问题

- 任务分解与角色分工
- 通信协议与信息共享
- 冲突消解与共识达成

## 一个最小协作回路

1. Planner 拆解目标
2. Worker 执行子任务
3. Critic 审查并反馈

> 多智能体的本质，是把软件工程中的分工协作引入模型推理过程。

一个最小的智能体骨架：

\`\`\`python
class Agent:
    def __init__(self, role):
        self.role = role  # planner / worker / critic

    def run(self, task):
        prompt = f"[{self.role}] {task}"
        return call_llm(prompt)
\`\`\`

行内代码如 \`call_llm\` 同样重要：它把模型调用收敛到单一出口，方便统一观测与降级。

更多内容见 [我的 GitHub](https://github.com/coolexp)。`
  }
];
```

- [ ] **Step 4: node 验证 POSTS 数据结构**

Run: `node -e "const fs=require('fs'); eval(fs.readFileSync('js/posts.js','utf8')); const assert=require('assert'); assert.ok(Array.isArray(POSTS)&&POSTS.length===1); assert.ok(POSTS[0].slug&&POSTS[0].title.zh&&POSTS[0].title.en&&POSTS[0].lang==='zh'&&POSTS[0].content.includes('\`\`\`')); console.log('posts OK')"`

Expected: 输出 `posts OK`

- [ ] **Step 5: Commit**

```bash
git add js/markdown.js js/posts.js
git commit -m "feat: markdown renderer and sample post data"
```

---

### Task 4: 首页渲染（方向卡片 + 最新文章）

**Files:**
- Create: `js/main.js`

**Interfaces:**
- Consumes: `getLang()` / `applyLang()`（Task 2）、`POSTS`（Task 3）、DOM `#researchGrid` `#latestPosts` `#langToggle`（Task 1）
- Produces: 全局 `RESEARCH` 数组（`{ icon, title: {zh,en}, desc: {zh,en} }`）、`pickLocalized(obj, lang): string`、`postItem(p): string`（Task 5 复用）

- [ ] **Step 1: 写 js/main.js**

```js
const RESEARCH = [
  {
    icon: '🧠',
    title: { zh: '人工智能', en: 'Artificial Intelligence' },
    desc: { zh: '机器学习与大模型基础能力研究：推理、规划与工具使用的边界在哪里。', en: 'Machine learning and LLM fundamentals: the boundaries of reasoning, planning and tool use.' }
  },
  {
    icon: '🤖',
    title: { zh: '多智能体', en: 'Multi-Agent Systems' },
    desc: { zh: '多智能体协作机制：任务分解、角色分工、通信协议与冲突消解。', en: 'Multi-agent collaboration: task decomposition, role assignment, communication protocols and conflict resolution.' }
  },
  {
    icon: '🏛️',
    title: { zh: '企业架构', en: 'Enterprise Architecture' },
    desc: { zh: '业务架构、应用架构与数据架构的建模方法，让复杂组织可被设计。', en: 'Modeling business, application and data architectures to make complex organizations designable.' }
  },
  {
    icon: '🔄',
    title: { zh: '数字化 + AI 转型', en: 'Digital & AI Transformation' },
    desc: { zh: '从流程数字化到智能化的转型路径：价值场景识别、落地节奏与组织配套。', en: 'From process digitalization to intelligence: value-scenario identification, delivery cadence and organizational alignment.' }
  },
  {
    icon: '⚡',
    title: { zh: '大模型优化', en: 'LLM Optimization' },
    desc: { zh: '推理成本与效果的优化实践：提示工程、RAG、量化与推理加速。', en: 'Cost-effectiveness practices: prompt engineering, RAG, quantization and inference acceleration.' }
  }
];

function pickLocalized(obj, lang) {
  return obj[lang] || obj.zh || obj.en || '';
}

function postItem(p) {
  const lang = getLang();
  return `<a class="card post-item" href="article.html?id=${p.slug}">
    <div class="post-meta"><time>${p.date}</time><span class="lang-tag">${p.lang.toUpperCase()}</span></div>
    <h3>${pickLocalized(p.title, lang)}</h3>
    <p>${pickLocalized(p.excerpt, lang)}</p>
  </a>`;
}

function renderIndex() {
  const lang = getLang();
  document.getElementById('researchGrid').innerHTML = RESEARCH.map(r => `
    <div class="card research-card">
      <div class="card-icon">${r.icon}</div>
      <h3>${pickLocalized(r.title, lang)}</h3>
      <p>${pickLocalized(r.desc, lang)}</p>
    </div>`).join('');
  document.getElementById('latestPosts').innerHTML = POSTS.slice(0, 3).map(postItem).join('');
}

function renderBlog() {
  const box = document.getElementById('postList');
  if (!POSTS.length) { box.innerHTML = `<p class="empty">${I18N[getLang()].emptyBlog}</p>`; return; }
  box.innerHTML = POSTS.map(postItem).join('');
}

function renderArticle() {
  const box = document.getElementById('articleBox');
  const slug = new URLSearchParams(location.search).get('id');
  const post = POSTS.find(p => p.slug === slug);
  const lang = getLang();
  if (!post) {
    box.innerHTML = `<h1>${I18N[lang].notFoundTitle}</h1>
      <p><a href="blog.html">${I18N[lang].notFoundBack}</a></p>`;
    return;
  }
  box.innerHTML = `
    <div class="post-meta"><time>${post.date}</time><span class="lang-tag">${post.lang.toUpperCase()}</span></div>
    <h1>${pickLocalized(post.title, lang)}</h1>
    <div class="article-body">${renderMarkdown(post.content)}</div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(getLang());
  document.getElementById('langToggle').addEventListener('click', () => {
    applyLang(getLang() === 'zh' ? 'en' : 'zh');
  });
  window.addEventListener('langchange', () => {
    if (document.getElementById('researchGrid')) renderIndex();
    if (document.getElementById('postList')) renderBlog();
    if (document.getElementById('articleBox')) renderArticle();
  });
  if (document.getElementById('researchGrid')) renderIndex();
});
```

说明：`renderBlog` / `renderArticle` 本任务一并写入（Task 5 只做浏览器验证），因为三者共享 `postItem` 与事件骨架，拆开反而要改同一文件两次。

- [ ] **Step 2: 浏览器验证首页**

Run: 浏览器打开 `http://localhost:8000/index.html`
Expected: 5 张方向卡片（图标+标题+描述）、最新文章区显示示例文章卡片（日期 2026-11-06、ZH 标签）；点击右上角 `EN` 全站切英文（含卡片与文章摘要），刷新后保持英文；再点 `中文` 切回。截图留存。

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat: homepage research cards, latest posts and language toggle"
```

---

### Task 5: 博客列表页 + 文章详情页验证

**Files:**
- 无新文件（验证 Task 4 已写入的 `renderBlog` / `renderArticle`）

**Interfaces:**
- Consumes: Task 4 的 `renderBlog` / `renderArticle`，DOM `#postList` `#articleBox`

- [ ] **Step 1: 验证博客页**

Run: 浏览器打开 `http://localhost:8000/blog.html`
Expected: 文章列表显示示例文章（标题、日期、ZH 标签、摘要），点击进入 `article.html?id=why-multi-agent`。

- [ ] **Step 2: 验证文章详情**

Run: 浏览器打开 `http://localhost:8000/article.html?id=why-multi-agent`
Expected: 标题+日期+ZH 标签；正文 H1/H2 呈现层级、无序/有序列表、引用块左边框青色、Python 代码块深色圆角背景且 `<` `>` 已转义显示、行内代码带底色、外链可点。切英文时标题变为 "Why Multi-Agent Systems"（正文保持中文）。截图留存。

- [ ] **Step 3: 验证错误边界**

Run: 浏览器打开 `http://localhost:8000/article.html?id=not-exist`
Expected: 显示"文章不存在"+ 返回博客链接（切换语言时该提示也跟随切换）。

- [ ] **Step 4: 无 commit**（本任务无代码变更）

---

### Task 6: README + 全站回归（含移动端）

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: 全部已上线文件
- Produces: 面向站长自己的维护文档

- [ ] **Step 1: 写 README.md**

```markdown
# coolexp 个人研究主页

深色科技风中英双语静态站，托管于 GitHub Pages。零依赖、零构建：push 到 main 即发布。

## 本地预览

​```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/index.html
​```

## 添加文章

编辑 `js/posts.js`，在 `POSTS` 数组头部追加一个对象：

​```js
{
  slug: 'my-new-post',            // URL 标识，唯一
  title: { zh: '标题', en: 'Title' },
  date: '2026-12-01',
  lang: 'zh',                     // 'zh' 或 'en'，正文语言
  excerpt: { zh: '摘要', en: '...' },
  content: `Markdown 正文`        // 正文中的反引号写成 \`
}
​```

支持的 Markdown 语法：标题 `#`/`##`/`###`、无序/有序列表、围栏代码块、行内代码、**粗体**、*斜体*、[链接](url)、> 引用、![图片](url)。

## 目录结构

- `index.html` / `blog.html` / `article.html` — 三个页面
- `css/style.css` — 深色主题（CSS 变量定义在 `:root`，改配色只动这里）
- `js/i18n.js` — 界面文案双语字典
- `js/posts.js` — 文章数据
- `js/markdown.js` — 迷你 Markdown 渲染器
- `js/main.js` — 页面渲染逻辑

## 设计文档

见 `docs/superpowers/specs/2026-11-06-personal-website-design.md`。
```

（注意：README 中嵌套代码围栏使用零宽字符或缩进处理，实际写入时用四空格缩进或调整围栏长度，确保渲染正确。）

- [ ] **Step 2: 全站回归**

Run: 浏览器依次验证：
1. `index.html`：卡片、文章、语言切换与刷新记忆
2. `blog.html`：列表
3. `article.html?id=why-multi-agent`：排版
4. `article.html?id=not-exist`：错误态
5. DevTools 切换设备模拟 375px 宽度：三个页面无横向滚动条，卡片单列排布

Expected: 全部通过。截图留存。

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with local preview and posting guide"
```

---

### Task 7: 部署 GitHub Pages

**Files:**
- 无新文件

**Interfaces:**
- Consumes: main 分支上的全部提交

- [ ] **Step 1: push**

Run: `git push -u origin main`
Expected: 推送成功（远程仓库为空，无冲突）。

- [ ] **Step 2: 开启 GitHub Pages**

Run: `gh api repos/coolexp/coolexp/pages -X POST -f "source[branch]=main" -f "source[path]=/"` 
Expected: 返回含 `"html_url": "https://coolexp.github.io/coolexp/"` 的 JSON。
若 `gh` 未登录或无权限：指引用户打开 `https://github.com/coolexp/coolexp/settings/pages`，Source 选 `main` 分支 `/` 目录，Save。

- [ ] **Step 3: 线上验证**

Run: 浏览器打开 `https://coolexp.github.io/coolexp/`（Pages 首次构建约 1 分钟）
Expected: 与本地一致的完整站点。截图留存。

- [ ] **Step 4: 无 commit**（部署不产生代码变更）
