# 好帮手ChatGPT

```
文星一言

中年不易，压力重重，遇到问题崩溃的时候，总不能找老婆，找父母，找..但是能找 ChatGPT 寻求解决方案，所以要用起来。帮我生成 ChatGPT 的广告语?
"当生活给你出难题，让ChatGPT为你解答。"

广告语可以再长一点吗, 突出 ChatGPT 的优点?
"当生活给你出难题，让ChatGPT为你解答。无论何时何地，只需打开ChatGPT，它都能耐心倾听，为你提供有价值的建议和解决方案。"

```

## 好用的有哪些

[openai ChatGPT](https://chat.openai.com/)

[百度 文心一言](https://yiyan.baidu.com/)

[科大讯飞 星火认知大模型](https://xinghuo.xfyun.cn/desk)

### 分别问他们几个问题？
```
"AI 大模型排名？"

"写一个中国春节祝词"

"javascript 有哪些主流的框架？"

"你现在是一名资深程序员，请用 javascript 写一个快速排序"

"中金，图表4：中美日金融周期转向前后的房租、房价与GDP走势，资料来源：Haver，FRED，Wind，中金公司研究部，作为一名金融分析师，帮我分析一下"

"请你扮演一个影评人，写一篇关于中国电影《第二十条》的影评，现在请写出这篇影评的剧情概述部分。要求：用你自己的方式重新讲述这个故事，不要做点评，只叙述故事，但不要透露太多细节，以免剧透。"

第二十条、热辣滚烫、飞驰人生2

这太棒了！// Negative
这太糟糕了！// Positive
哇，那部电影太棒了！// Positive
多么可怕的节目！//

"我去市场买了10个苹果。我给了邻居2个苹果和修理工2个苹果。然后我去买了5个苹果并吃了1个。我还剩下多少苹果？"

"你真专业"
```

## 提词器


[题词工程指南](https://www.promptingguide.ai/zh/introduction/elements)

零样本提示、少样本提示、链式思考（CoT）提示、自我一致性、生成知识提示、链式提示、思维树 (ToT)、ReAct 框架、GraphPrompts

## 代码补全

GitHub Copilot 


## 了解原理

[拆解追溯 GPT-3.5 各项能力的起源](https://yaofu.notion.site/GPT-3-5-360081d91ec245f29029d37b54573756)

符尧, yao.fu@ed.ac.uk
爱丁堡大学博士生，硕士毕业于哥伦比亚大学，本科毕业于北京大学

- 语言生成：遵循提示词（prompt），然后生成补全提示词的句子 (completion)。这也是今天人类与语言模型最普遍的交互方式。
- 上下文学习 (in-context learning):  遵循给定任务的几个示例，然后为新的测试用例生成解决方案。很重要的一点是，GPT-3虽然是个语言模型，但它的论文几乎没有谈到“语言建模” (language modeling) —— 作者将他们全部的写作精力都投入到了对上下文学习的愿景上，这才是 GPT-3的真正重点。
- 世界知识 (world knowledge)：包括事实性知识 (factual knowledge) 和常识 (commonsense)。

