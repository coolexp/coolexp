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
