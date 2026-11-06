# Profile README 图形化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 README.md 的研究方向表格替换为 17 枚 shields.io 彩色徽章墙，并新增 🛠️ 技术底座 skillicons 图标两行；其余内容逐字不动。

**Architecture:** 单文件（README.md）一次 Edit 完成；所有图片 URL 已于 2026-11-06 计划阶段实测通过（17 徽章 200+title 校验、2 图标行 >5KB），执行时先复验 URL 再改文件、改后从文件反向再验。

**Tech Stack:** 纯 Markdown + 外链图片（shields.io / skillicons.dev）；验证用 python3（/tmp 一次性脚本）+ curl + git diff。

**Spec:** `docs/superpowers/specs/2026-11-06-profile-badges-design.md`

## Global Constraints

- 仓库只允许改动 `README.md`；脚本与临时文件只放 `/tmp`，不进仓库
- 未动区域（头部 1-5 行、`## 📌 当前关注` 起的尾部）必须与 HEAD 逐字一致
- 徽章/图标 URL 必须与本计划嵌入的字符串完全一致（已实测可用，禁止改写）
- 请求 shields.io 必须带自定义 User-Agent（python urllib 默认 UA 会 403）
- 提交信息沿用仓库 conventional 风格，body 末尾加 `Co-Authored-By: Claude Code <noreply@anthropic.com>`
- 不 push（push 由用户另行决定）

---

### Task 1: 预检全部图片 URL

**Files:**
- Create: `/tmp/gen_badges.py`（一次性脚本，不进仓库）

**Interfaces:**
- Produces: stdout 输出 `verify: 17 badges + 2 icon rows, fails=0`，随后在 `-----BEGIN MARKDOWN-----` / `-----END MARKDOWN-----` 标记间输出最终 markdown 片段（Task 2 的 new_string 即此内容）

- [x] **Step 1: 写入脚本**

```python
#!/usr/bin/env python3
"""Generate + verify shields.io badge wall & skillicons rows for coolexp profile README."""
from urllib.parse import quote
from urllib.request import Request, urlopen
import sys


def fetch(url):
    return urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0 badge-verify'}), timeout=20)


DIRECTIONS = [
    ("🧠 人工智能",           "3B82F6", ["推理", "规划", "工具使用"]),
    ("🤖 多智能体系统",       "8B5CF6", ["任务分解", "角色协作", "通信协议", "共识达成"]),
    ("🏛️ 企业架构",          "F59E0B", ["业务架构", "应用架构", "数据架构"]),
    ("🔄 数字化 + AI 转型",   "14B8A6", ["价值场景识别", "落地路径", "组织配套"]),
    ("⚡ 大模型优化",         "EF4444", ["提示工程", "RAG", "量化", "推理加速"]),
]
ICON_ROWS = [
    "https://skillicons.dev/icons?i=python,pytorch,java,spring,docker,kubernetes",
    "https://skillicons.dev/icons?i=mysql,redis,kafka,linux,git",
]

lines = ["## 🔬 研究方向", ""]
badge_urls = []  # (url, keyword)
for name, color, kws in DIRECTIONS:
    lines += [f"**{name}**", ""]
    badges = []
    for kw in kws:
        url = f"https://img.shields.io/badge/{quote(kw)}-{color}.svg?style=flat-square"
        badges.append(f"![]({url})")
        badge_urls.append((url, kw))
    lines += [" ".join(badges), ""]

lines += ["## 🛠️ 技术底座", ""]
for row in ICON_ROWS:
    lines += [f"![]({row})", ""]
lines = lines[:-1]  # 去掉末尾多余空行

fails = 0
for url, kw in badge_urls:
    body = fetch(url).read().decode()
    if f"<title>{kw}</title>" not in body:
        fails += 1
        print(f"FAIL badge {kw}: {url}", file=sys.stderr)
for url in ICON_ROWS:
    size = len(fetch(url).read())
    if size < 5000:
        fails += 1
        print(f"FAIL icons too small ({size}B): {url}", file=sys.stderr)
print(f"verify: {len(badge_urls)} badges + {len(ICON_ROWS)} icon rows, fails={fails}")
if fails:
    sys.exit(1)

print("-----BEGIN MARKDOWN-----")
print("\n".join(lines))
print("-----END MARKDOWN-----")
```

- [x] **Step 2: 运行并验证**

Run: `python3 /tmp/gen_badges.py`
Expected: 首行 `verify: 17 badges + 2 icon rows, fails=0`（任何 FAIL 或 fails>0 → 停止并上报，不进入 Task 2）

---

### Task 2: 改写 README.md 并验收提交

**Files:**
- Modify: `README.md`（仅一处 Edit：研究方向表格 → 徽章墙 + 技术底座）

**Interfaces:**
- Consumes: Task 1 的 `fails=0` 结论与本任务给出的精确 old_string / new_string

- [x] **Step 1: 执行唯一一次 Edit**

old_string（当前 README 第 7-15 行，表格整段）:

```markdown
## 🔬 研究方向

| 方向 | 关键词 |
|---|---|
| 🧠 人工智能 | 推理 · 规划 · 工具使用 |
| 🤖 多智能体系统 | 任务分解 · 角色协作 · 通信协议 · 共识达成 |
| 🏛️ 企业架构 | 业务架构 · 应用架构 · 数据架构 |
| 🔄 数字化 + AI 转型 | 价值场景识别 · 落地路径 · 组织配套 |
| ⚡ 大模型优化 | 提示工程 · RAG · 量化 · 推理加速 |
```

new_string（与 Task 1 脚本 MARKDOWN 标记间输出完全一致；URL 已实测，禁止改写）:

```markdown
## 🔬 研究方向

**🧠 人工智能**

![](https://img.shields.io/badge/%E6%8E%A8%E7%90%86-3B82F6.svg?style=flat-square) ![](https://img.shields.io/badge/%E8%A7%84%E5%88%92-3B82F6.svg?style=flat-square) ![](https://img.shields.io/badge/%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8-3B82F6.svg?style=flat-square)

**🤖 多智能体系统**

![](https://img.shields.io/badge/%E4%BB%BB%E5%8A%A1%E5%88%86%E8%A7%A3-8B5CF6.svg?style=flat-square) ![](https://img.shields.io/badge/%E8%A7%92%E8%89%B2%E5%8D%8F%E4%BD%9C-8B5CF6.svg?style=flat-square) ![](https://img.shields.io/badge/%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE-8B5CF6.svg?style=flat-square) ![](https://img.shields.io/badge/%E5%85%B1%E8%AF%86%E8%BE%BE%E6%88%90-8B5CF6.svg?style=flat-square)

**🏛️ 企业架构**

![](https://img.shields.io/badge/%E4%B8%9A%E5%8A%A1%E6%9E%B6%E6%9E%84-F59E0B.svg?style=flat-square) ![](https://img.shields.io/badge/%E5%BA%94%E7%94%A8%E6%9E%B6%E6%9E%84-F59E0B.svg?style=flat-square) ![](https://img.shields.io/badge/%E6%95%B0%E6%8D%AE%E6%9E%B6%E6%9E%84-F59E0B.svg?style=flat-square)

**🔄 数字化 + AI 转型**

![](https://img.shields.io/badge/%E4%BB%B7%E5%80%BC%E5%9C%BA%E6%99%AF%E8%AF%86%E5%88%AB-14B8A6.svg?style=flat-square) ![](https://img.shields.io/badge/%E8%90%BD%E5%9C%B0%E8%B7%AF%E5%BE%84-14B8A6.svg?style=flat-square) ![](https://img.shields.io/badge/%E7%BB%84%E7%BB%87%E9%85%8D%E5%A5%97-14B8A6.svg?style=flat-square)

**⚡ 大模型优化**

![](https://img.shields.io/badge/%E6%8F%90%E7%A4%BA%E5%B7%A5%E7%A8%8B-EF4444.svg?style=flat-square) ![](https://img.shields.io/badge/RAG-EF4444.svg?style=flat-square) ![](https://img.shields.io/badge/%E9%87%8F%E5%8C%96-EF4444.svg?style=flat-square) ![](https://img.shields.io/badge/%E6%8E%A8%E7%90%86%E5%8A%A0%E9%80%9F-EF4444.svg?style=flat-square)

## 🛠️ 技术底座

![](https://skillicons.dev/icons?i=python,pytorch,java,spring,docker,kubernetes)

![](https://skillicons.dev/icons?i=mysql,redis,kafka,linux,git)
```

- [x] **Step 2: 校验未动区域逐字一致**

```bash
diff <(git show HEAD:README.md | sed -n '1,5p') <(sed -n '1,5p' README.md) && echo HEAD-OK
diff <(git show HEAD:README.md | sed -n '/^## 📌/,$p') <(sed -n '/^## 📌/,$p' README.md) && echo TAIL-OK
```

Expected: `HEAD-OK` 与 `TAIL-OK`（任一 diff 有输出 → Edit 误伤，回滚重查）

- [x] **Step 3: 从 README 反向验收 URL**

```bash
grep -o '!\[\](' README.md | wc -l   # 期望 19（17 徽章 + 2 图标行的图片引用数）
grep -c '^|' README.md              # 期望 0（原表格无残留，spec 验收 #4）
grep -o 'https://[^)]*' README.md | sort -u | wc -l   # 期望 19（无重复无缺失）
grep -o 'https://[^)]*' README.md | while read -r u; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$u")
  [ "$code" = 200 ] || echo "BROKEN $code $u"
done; echo CHECK-DONE
```

Expected: `19`、`0`、`19`、仅 `CHECK-DONE`（无 BROKEN 行）

- [x] **Step 4: 提交**

```bash
git add README.md
git commit -m "feat: visualize research directions and tech stack in profile readme

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

- [x] **Step 5: 收尾报告**

告知用户：改动已提交（未 push）；`git push` 后约 1-2 分钟在 https://github.com/coolexp 生效；旧表格未删任何关键词，仅换呈现形式。
