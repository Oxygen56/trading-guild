# Demo 视频视觉风格指南

> **项目**: Casper Autonomous Trading Guild
> **用途**: Casper Agentic Buildathon 2026 资格赛 Demo 视频
> **时长**: 3-5 分钟 · **平台**: YouTube / Bilibili · **语言**: 英文 + 中英字幕

---

## 1. 视频结构

| 时间 | 段落 | 内容 |
|------|------|------|
| 0:00-0:15 | 开场 | 项目名 + 一句话核心概念 + Logo 动画 |
| 0:15-0:45 | 问题 → 方案 | 当前 DeFi 痛点 → Trading Guild 如何解决 |
| 0:45-2:30 | 核心 Demo | 实时操作演示（用户输入 → Agent 协作 → 链上交易） |
| 2:30-3:30 | 架构解说 | 技术架构图 + Casper toolkit 集成亮点 |
| 3:30-4:00 | 创新点 | 为什么这个项目能赢（Agent 间经济 + 全链上透明） |
| 4:00-4:30 | 结尾 | 开源地址 + "Built on Casper" + CTA |

---

## 2. 视觉风格

### 2.1 整体调性

- **关键词**: 未来感、专业、透明、动感
- **参考**: Apple 产品宣传片的简洁节奏 + Web3 项目的技术感
- **配色**: 与应用一致（深色底 + Casper 绿 accent），保持品牌统一

### 2.2 色彩使用

| 场景 | 主色 | 辅色 |
|------|------|------|
| 背景 | #060B1A (Deep Space) | — |
| 标题/关键文字 | #F1F5F9 (White) | #00E5A0 (Casper Green) |
| 数据展示 | #F1F5F9 + #00E5A0 | #10B981 (Profit) |
| 技术标注 | #94A3B8 (Secondary) | #6366F1 / #F59E0B / #06B6D4 (Agent colors) |
| 过渡动画 | — | #00E5A0 glow |

### 2.3 字体

| 用途 | 字体 | 字重 | 大小参考 |
|------|------|------|----------|
| 大标题 | Space Grotesk | Bold (700) | 72px+ |
| 章节标题 | Space Grotesk | Semibold (600) | 48px |
| 说明文字 | Inter | Regular (400) | 28px |
| 代码/地址 | JetBrains Mono | Medium (500) | 24px |
| 字幕 | Inter | Medium (500) | 20px |

### 2.4 动效风格

- **转场**: 平滑推入/淡入淡出，不用夸张的 3D 翻转
- **数据出现**: 数字递增动画（count-up），图表从左到右绘制
- **Agent 交互**: 对话气泡从下往上弹出，模拟打字效果
- **链上交易**: 交易哈希从右到左飞入，带绿色确认勾
- **Logo**: 粒子汇聚或描边绘制动画（1-2 秒）

---

## 3. 关键画面设计

### 3.1 开场画面（0:00-0:05）

```
        ┌───────────────────────────────────┐
        │                                   │
        │         [Logo 居中]               │
        │    Guild 徽章 + Casper 标志       │
        │                                   │
        │   Casper Autonomous               │
        │   Trading Guild                   │
        │                                   │
        │   AI Agents Trading Together      │
        │                                   │
        └───────────────────────────────────┘
```

- 深色背景，Logo 从中心浮现（scale + fade in, 800ms）
- 标题逐字出现（typewriter effect, 1.5s）
- 底部 tagline 淡入

### 3.2 问题陈述（0:15-0:30）

左右对比式布局：

```
┌──────────────────────┐  ┌──────────────────────┐
│     Traditional DeFi │  │   Trading Guild       │
│                      │  │                       │
│  ❌ Manual trading   │  │  ✅ AI Agent 自主决策  │
│  ❌ Single point     │  │  ✅ 多 Agent 协作     │
│     of failure       │  │     风控分离          │
│  ❌ Opaque decision  │  │  ✅ 全链上透明        │
│  ❌ 24/7 monitoring  │  │  ✅ Agents 全天候运行  │
│                      │  │                       │
└──────────────────────┘  └──────────────────────┘
```

- 左侧红色调（问题），右侧绿色调（方案）
- 每个要点逐条出现（stagger 150ms）

### 3.3 核心 Demo（0:45-2:30）

**这是视频的核心段落，需要屏幕录制应用实际操作。**

Demo 流程：
```
1. 展示 Guild Dashboard（5s）
   → 镜头缓慢推进 TVL 指标卡
   
2. 切换到 Agent Terminal（5s）
   → 用户输入 "I want to invest 500 CSPR in low-risk strategies"
   
3. Strategy Agent 响应（15s）
   → 对话区显示 Agent 思考过程（流式输出）
   → Strategy Proposal 卡片弹出
   
4. Risk Agent 审核（10s）
   → 画面切到 Strategy Feed 显示 "Risk Review in progress"
   → Risk Agent 审核动画（扫描效果）
   → 审核通过 ✅
   
5. Execution Agent 执行（15s）
   → 显示链上交易提交
   → 交易哈希 + 区块确认计数
   → 交易确认 ✅
   
6. 结果展示（10s）
   → 回到 Dashboard，PnL 数字滚动更新
   → Strategy Feed 显示完成状态
```

**画面排版**（屏幕录制 + 标注框）:
```
┌─────────────────────────────────────────────┐
│                                             │
│          [屏幕录制 — 应用实际操作]            │
│                                             │
│   ┌──────────────────────────┐              │
│   │ 💡 Strategy Agent        │  ← 标注框    │
│   │ Analyzing market data    │              │
│   │ from CSPR.trade MCP...   │              │
│   └──────────────────────────┘              │
│                                             │
│   ┌──────────────────────────┐              │
│   │ 🔗 CSPR.trade MCP        │  ← 技术标注  │
│   │ 14 DeFi tools available  │              │
│   └──────────────────────────┘              │
│                                             │
└─────────────────────────────────────────────┘
```

**标注框样式**:
- 半透明深色底 + 对应 Agent 颜色左边框
- 圆角 8px
- 带箭头指向屏幕录制中的对应元素
- 文字使用 Inter Medium 20px

### 3.4 架构解说（2:30-3:30）

三层架构图动画：

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │              Frontend (React)                │   │
│   │   Dashboard · Terminal · Feed · Vault       │   │
│   └──────────────────┬──────────────────────────┘   │
│                      │                              │
│   ┌──────────────────▼──────────────────────────┐   │
│   │              AI Agent Layer                   │   │
│   │                                              │   │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │   │
│   │  │Strategy │  │  Risk   │  │  Execution  │  │   │
│   │  │ Agent   │─▶│ Agent   │─▶│  Agent      │  │   │
│   │  │  🧠     │  │  🛡️     │  │  ⚡          │  │   │
│   │  └────┬────┘  └────┬────┘  └──────┬──────┘  │   │
│   │       │            │              │          │   │
│   │       │    x402 Payment (Agent-to-Agent)    │   │
│   └───────┼────────────┼──────────────┼──────────┘   │
│           │            │              │              │
│   ┌───────┼────────────┼──────────────┼──────────┐   │
│   │       ▼            ▼              ▼          │   │
│   │           Casper Testnet Layer               │   │
│   │                                              │   │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │   │
│   │  │  Guild   │ │  Vault   │ │  CSPR.trade  │ │   │
│   │  │ Registry │ │ Contract │ │  MCP Server   │ │   │
│   │  │ (Odra)   │ │ (Odra)   │ │  (DEX ops)   │ │   │
│   │  └──────────┘ └──────────┘ └──────────────┘ │   │
│   └──────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- 从下往上逐层出现（Casper → Agent → Frontend）
- 每层出现时高亮对应层的边框（Casper green glow）
- Agent 间箭头画 x402 payment 动画（金色粒子沿箭头流动）
- 右上角标注使用的 Casper AI Toolkit 组件

### 3.5 创新亮点（3:30-4:00）

三列并排展示核心创新：

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│                 │ │                 │ │                 │
│   Agent Economy │ │  Full On-chain  │ │   Composable    │
│                 │ │                 │ │                 │
│  AI Agents earn │ │  Every decision │ │  3rd-party can  │
│  money from     │ │  and payment is │ │  deploy their   │
│  each other     │ │  verifiable on  │ │  own agents to  │
│  via x402       │ │  Casper Testnet │ │  join the guild │
│                 │ │                 │ │                 │
│  🧠──💰──▶🛡️    │ │  📊 Chain Data  │ │  🔌 Plug & Play │
│                 │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

- 每列图标 + 标题 + 一句话说明
- 用 Agent 颜色区分三列
- 出现动画: 从左到右 stagger 200ms

### 3.6 结尾画面（4:00-4:30）

```
        ┌───────────────────────────────────┐
        │                                   │
        │       [Logo + Project Name]       │
        │                                   │
        │     github.com/xxx/trading-guild  │
        │                                   │
        │       Built on Casper 💚          │
        │                                   │
        │     Casper Agentic Buildathon     │
        │           2026                    │
        │                                   │
        └───────────────────────────────────┘
```

- Logo 和项目名居中
- GitHub 地址用 JetBrains Mono
- "Built on Casper" 用 Casper green
- 渐隐黑屏结束

---

## 4. 技术制作指南

### 4.1 工具建议

| 用途 | 推荐工具 | 备选 |
|------|----------|------|
| 屏幕录制 | OBS Studio (免费) | QuickTime |
| 视频剪辑 | DaVinci Resolve (免费) | CapCut / Premiere |
| 动画/标题 | DaVinci Fusion (内建) | After Effects |
| 架构图 | Figma / Excalidraw | draw.io |
| 字幕 | 剪映 / Descript | 手动 SRT |

### 4.2 导出规格

```
分辨率:   1920×1080 (16:9)
帧率:     30fps
编码:     H.264
码率:     8-12 Mbps
音频:     AAC 128kbps
字幕:     SRT (英文) + SRT (中文) 双文件
```

### 4.3 音频建议

- **BGM**: 科技感电子音乐（无版权或 CC 授权），音量低于人声 12-15dB
- **人声**: 清晰英文解说，语速适中（~140 wpm）
- **音效**: 操作点击、交易确认、成功提示等简短音效增强节奏感（可选）
- **推荐音效源**: Mixkit (免费), YouTube Audio Library

### 4.4 录制流程

1. 准备干净的桌面（隐藏不相关的图标/通知）
2. 关闭浏览器其他标签页和书签栏
3. 打开应用，预热所有页面（确保数据已加载）
4. OBS 录制区域设为浏览器窗口（不是全屏）
5. 按 Demo 脚本操作，每个步骤之间停顿 2-3 秒（方便后期剪接）
6. 如出错，停顿 5 秒后重试该步骤（后期剪掉 NG 部分）

---

## 5. 内容检查清单

录制前确认：

- [ ] 应用所有页面数据加载正常
- [ ] Casper Testnet 链上交易可以正常产生
- [ ] Agent 对话流式输出无卡顿
- [ ] Dashboard 指标数字不会出现 0 或空值
- [ ] Strategy Feed 至少有一条完成状态的策略做展示
- [ ] 架构图中的组件名与实际代码一致
- [ ] GitHub 仓库已公开且 README 完整
- [ ] 所有外部标识使用 jiangth99 第一人称（不出现 OXY-xxx 等内部 ID）

---

> 本指南与 `DESIGN_SPEC.md` 配合使用，确保 UI 设计与视频呈现风格统一。
