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
  if (document.getElementById('postList')) renderBlog();
  if (document.getElementById('articleBox')) renderArticle();
});
