# coolexp 个人研究主页 设计文档

- 日期：2026-11-06
- 状态：已批准
- 仓库：github.com/coolexp/coolexp（GitHub Pages 项目站点）

## 1. 目标

在 GitHub Pages 上发布一个深色科技风的个人研究主页，核心展示五个研究方向，附带博客文章列表与文章详情页。界面中英双语切换，文章单语。

非目标（明确不做）：评论系统、搜索、RSS、站点统计、全文双语翻译、构建工具链。

## 2. 页面结构（3 个 HTML 页面）

| 页面 | 内容 |
|---|---|
| `index.html` 首页 | Hero 区（署名 coolexp + 一句话定位）→ 5 张研究方向卡片 → 最新文章（前 3 篇）→ Footer（GitHub 仓库链接） |
| `blog.html` 博客 | 全部文章列表：标题、日期、语言标签（zh/en）、摘要 |
| `article.html` 文章详情 | URL 形如 `article.html?id=<slug>`，渲染正文 |

三个页面共享同一套 CSS 与 JS，导航栏互通。

## 3. 文件结构

```
├── index.html
├── blog.html
├── article.html
├── css/style.css        # 深色主题全部样式
├── js/i18n.js           # zh/en 字典 + data-i18n 替换 + localStorage 记忆
├── js/posts.js          # 文章数据（元数据 + Markdown 正文字符串）
├── js/markdown.js       # 迷你 Markdown 渲染器
├── js/main.js           # 页面逻辑：卡片渲染、文章列表、文章详情
└── README.md            # 本地预览与添加文章说明
```

零依赖：不引入任何框架、构建步骤或 CDN 资源。

## 4. 技术决策

### 4.1 部署模型

纯静态文件由 GitHub Pages 托管，JS 全部在读者浏览器执行。push 到 main 即部署，无服务器端代码。

### 4.2 双语策略

- 界面文案（导航、按钮、方向介绍、Footer）在 `i18n.js` 维护 zh/en 两份字典，通过 `data-i18n` 属性标记替换。
- 语言切换按钮位于导航栏；选择存 localStorage；首次访问默认跟随浏览器语言（`navigator.language`，非 zh 开头一律 en）。
- 文章带 `lang: 'zh' | 'en'` 字段，列表以标签标注；界面语言与文章语言不一致时照常显示，不做翻译。

### 4.3 文章数据模型

`posts.js` 导出数组，每个元素：

```js
{
  slug: 'why-multi-agent',        // URL 标识，唯一
  title: { zh: '…', en: '…' },    // 列表展示时按界面语言取，缺失则回退另一语言
  date: '2026-11-06',
  lang: 'zh',                     // 正文语言
  excerpt: { zh: '…', en: '…' },  // 摘要，同 title 回退规则
  content: 'Markdown 字符串'      // 正文
}
```

添加文章 = 在该数组追加一个对象并 push。

### 4.4 Markdown 渲染器

自写约 100 行迷你渲染器，支持：标题（#/##/###）、段落、无序/有序列表、围栏代码块、行内代码、粗体、斜体、链接、引用、图片。渲染前先对 HTML 敏感字符转义（内容为站长本人所写，转义只为防意外破坏结构）。

### 4.5 视觉风格

深色科技风：深蓝黑背景、青/紫霓虹渐变点缀、卡片玻璃拟态（半透明边框 + 模糊）、等宽字体强调代码感、hover 过渡效果。全部用 CSS 变量管理，字体走系统字体栈，不加载外部字体。

## 5. 内容文案

- 署名：coolexp（用户后续可要求更换）。
- 五个研究方向及中英介绍由实现时起草，作为首版文案，用户可在审阅时修改：
  1. 人工智能 / Artificial Intelligence
  2. 多智能体 / Multi-Agent Systems
  3. 企业架构 / Enterprise Architecture
  4. 数字化 + AI 转型 / Digital & AI Transformation
  5. 大模型优化 / LLM Optimization
- 预置 1 篇示例文章《为什么研究多智能体系统》（中文），覆盖渲染器全部语法以验证排版。

## 6. 验证方式

1. 本地 `python3 -m http.server` 起服务。
2. Chrome DevTools 打开三个页面，逐项确认：首页卡片与文章区渲染、语言切换（含刷新后记忆）、博客列表、文章详情（含代码块/列表/引用排版）、移动端宽度（DevTools 模拟 375px）无横向溢出。
3. 截图留存。

## 7. 部署步骤

1. 提交全部文件并 push 到 main。
2. 开启 GitHub Pages（source: main 分支 / root）：优先尝试 `gh` CLI API 直接开启；无权限则指引用户在仓库 Settings → Pages 手动开启。
3. 验证 `https://coolexp.github.io/coolexp/` 可访问。

## 8. 错误处理边界

- `article.html?id=` 传入未知 slug → 显示"文章不存在"提示与返回博客链接。
- `posts.js` 为空 → 博客页显示空态提示。
- 不为上述之外的场景做额外防御（YAGNI）。
