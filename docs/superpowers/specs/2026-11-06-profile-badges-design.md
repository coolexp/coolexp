# Profile README 技能/方向图形化 — 设计文档

- 日期：2026-11-06
- 状态：设计已获口头批准，待实现
- 仓库：coolexp/coolexp（GitHub Profile README 仓库）

## 背景

GitHub 个人主页版式固定（README + 置顶仓库 + 贡献图 + 成就），README 是唯一可定制画布。
用户选定方向：**技能/方向图形化**，采用混合方案 = 研究方向徽章墙（shields.io）+ 技术底座图标行（skillicons.dev）。

账号现状约束：203 个公开仓库几乎全为 fork、0 star，故不加统计卡片（会显空）；博客入口/置顶仓库/文章流为用户未选项。

## 目标

1. `## 🔬 研究方向`：表格 → 徽章墙，**5 个方向全保留**，关键词原文不变
2. 新增 `## 🛠️ 技术底座`：skillicons 两行图标
3. 其余部分（标题、定位行、简介、当前关注、英文尾行）零改动

## 非目标

- 不加统计卡片（stats/语言/streak/贡献蛇）
- 不加博客入口、不动置顶仓库、不做文章流
- 不引入 JS、GitHub Actions 或任何动态机制
- 不改仓库其它文件

## 设计

### README 目标结构

```markdown
# 你好，我是 coolexp 👋                  ← 不动
**定位行** / 简介段                       ← 不动

## 🔬 研究方向                            ← 改造
**🧠 人工智能**
![](推理) ![](规划) ![](工具使用)
**🤖 多智能体系统**
![](任务分解) ![](角色协作) ![](通信协议) ![](共识达成)
**🏛️ 企业架构**
![](业务架构) ![](应用架构) ![](数据架构)
**🔄 数字化 + AI 转型**
![](价值场景识别) ![](落地路径) ![](组织配套)
**⚡ 大模型优化**
![](提示工程) ![](RAG) ![](量化) ![](推理加速)

## 🛠️ 技术底座                            ← 新增
![](图标行1) ![](图标行2)

## 📌 当前关注                            ← 不动
---
*Research interests: ...*                ← 不动
```

### 徽章规格（shields.io）

- URL 模板：`https://img.shields.io/badge/<关键词URL编码>-<色值>.svg?style=flat-square`
- 已验证：该两段式语法渲染为单色胶囊（白字、自适应宽度、无 label/message 分裂）；中文须 UTF-8 百分号编码，`RAG` 等纯 ASCII 词不需编码
- 色板（同方向同色）：

| 方向 | 色值 |
|---|---|
| 🧠 人工智能 | `3B82F6`（蓝） |
| 🤖 多智能体系统 | `8B5CF6`（紫） |
| 🏛️ 企业架构 | `F59E0B`（琥珀） |
| 🔄 数字化 + AI 转型 | `14B8A6`（青） |
| ⚡ 大模型优化 | `EF4444`（红） |

- 徽章为裸图片 `![](...)`，不包链接

### 技术底座规格（skillicons.dev）

- 两行，默认主题，各一个 `![](...)`：
  - 行 1（语言与平台）：`https://skillicons.dev/icons?i=python,pytorch,java,spring,docker,kubernetes`
  - 行 2（数据与基础）：`https://skillicons.dev/icons?i=mysql,redis,kafka,linux,git`
- 选取依据：用户真实技术栈（Java/Spring 企业工程 + Python/PyTorch + 中间件）
- `vue` 图标存在但与当前研究定位无关，不放

## 已验证的技术事实（2026-11-06 curl 实测）

- shields.io 中文单段徽章：HTTP 200，SVG 含 `<title>推理</title>`、单矩形填充色，语法成立
- skillicons 存在（响应 >1KB 真图）：python / pytorch / java / spring / docker / kubernetes / mysql / redis / kafka / linux / git / vue
- skillicons 不存在（256B 占位）：huggingface / langchain / langgraph / clickhouse / milvus / flink

## 验收标准

1. README 中 5 个方向齐全，17 枚关键词徽章与原文一致，色值符合上表
2. 每枚徽章 URL curl 返回 HTTP 200，且 SVG 文本含对应关键词
3. 两条 skillicons URL 返回 HTTP 200 且体积 > 5KB（非占位）
4. 原表格行全部移除，无残留
5. 标题、定位行、简介、`## 📌 当前关注`、英文尾行逐字未动（diff 可证）

## 风险

- 外链图片服务可用性：shields.io / skillicons.dev 均为生态事实标准，单枚失败仅影响自身，接受
- 中文 URL 编码手写易错：实现时用脚本生成编码并逐枚 curl 校验（验收标准 2 覆盖）

## 备注

- 本仓库定位为「只保留 README.md 的 Profile 仓库」；本 spec 为过程文档，存放于 `docs/superpowers/specs/`，不参与 profile 渲染
