# coolexp 个人研究主页

深色科技风中英双语静态站，托管于 GitHub Pages。零依赖、零构建：push 到 main 即发布。

## 本地预览

```
python3 -m http.server 8000
# 打开 http://localhost:8000/index.html
```

## 添加文章

编辑 `js/posts.js`，在 `POSTS` 数组头部追加一个对象：

```js
{
  slug: 'my-new-post',            // URL 标识，唯一
  title: { zh: '标题', en: 'Title' },
  date: '2026-12-01',
  lang: 'zh',                     // 'zh' 或 'en'，正文语言
  excerpt: { zh: '摘要', en: '...' },
  content: `Markdown 正文`        // 正文中的反引号写成 \`
}
```

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
