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
