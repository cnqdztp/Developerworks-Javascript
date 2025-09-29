# DeveloperWorks JavaScript SDK (ESM)

## 简介

DeveloperWorks JavaScript SDK 是一套面向游戏与 AI 应用开发者的现代化 TypeScript/JavaScript 客户端库，支持文本生成、流式对话、结构化输出、AI 图像生成、NPC 智能对话、玩家认证等能力。现已全面采用 ES Module（ESM）规范，适配 Node.js 16+ 及现代前端构建工具。

---

## 安装

```bash
# 推荐本地开发直接引用源码目录
cd your-project-root
npm install ./DeveloperWorks-JavaScriptSDK
```

或将 `DeveloperWorks-JavaScriptSDK` 目录直接拷贝到你的项目中。

---

## ESM 导入说明

- 本 SDK 仅支持 ES Module（`import`/`export`）语法。
- 本地文件导入必须带 `.js` 扩展名（如：`import { DeveloperWorksSDK } from './dist/index.js'`）。
- `package.json` 已声明 `"type": "module"`，无需额外配置。

---

## 快速开始

### 1. 配置

```js
// config.js (或 config.mjs)
export default {
  gameId: 'your-game-id', // 控制台获取
  auth: {
    publishableKey: 'your-publishable-key', // 控制台获取
    developerToken: 'your-developer-token'  // 可选，用于开发测试
  },
  defaultChatModel: 'deepseek-reasoner', // 可选，默认聊天模型
  defaultImageModel: 'Kolors',           // 可选，默认图像模型
  network: {
    baseUrl: 'https://developerworks.agentlandlab.com', // 可选，API 基础地址
    timeoutSeconds: 90,                  // 可选，请求超时时间
    maxRetryCount: 3,                    // 可选，最大重试次数
    retryDelaySeconds: 1                 // 可选，重试延迟时间
  },
  enableDebugLogs: true                  // 可选，启用调试日志
};
```

### 2. 初始化 SDK

#### 2.1 使用开发者令牌（开发测试）

```js
// main.mjs 或 main.js (需 Node.js 16+)
import { DeveloperWorksSDK } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
import config from './config.js';

// 初始化（开发者令牌在配置中）
await DeveloperWorksSDK.Instance.initializeAsync(config);
```

#### 2.2 使用玩家认证流程（生产环境）

```js
// main.mjs 或 main.js (需 Node.js 16+)
import { DeveloperWorksSDK } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
import config from './config.js';

// 初始化（不包含开发者令牌）
await DeveloperWorksSDK.Instance.initializeAsync(config);

// 开始认证流程
await DeveloperWorksSDK.Instance.startAuthFlow({
  onLoading: (isLoading) => console.log('加载状态:', isLoading),
  onError: (error) => console.error('认证错误:', error),
  onSuccess: () => console.log('认证成功'),
  onCodeSent: (sessionId) => console.log('验证码已发送，会话ID:', sessionId),
  onVerificationComplete: (globalToken) => console.log('验证完成，全局令牌:', globalToken)
});

// 发送验证码
await DeveloperWorksSDK.Instance.sendVerificationCode('user@example.com', 'email', {
  onLoading: (isLoading) => console.log('发送中:', isLoading),
  onError: (error) => console.error('发送失败:', error),
  onCodeSent: (sessionId) => console.log('验证码已发送')
});

// 验证验证码
await DeveloperWorksSDK.Instance.verifyCode('123456', {
  onLoading: (isLoading) => console.log('验证中:', isLoading),
  onError: (error) => console.error('验证失败:', error),
  onSuccess: () => console.log('验证成功'),
  onVerificationComplete: (globalToken) => console.log('验证完成')
});
```

---

## API 参考

### 1. SDK 核心对象

- `DeveloperWorksSDK.Instance`：全局单例，负责 SDK 配置、认证、资源管理。
- `DeveloperWorksSDK.Factory`：工厂方法，创建各类 AI 客户端。
- `DeveloperWorksSDK.Populate`：便捷方法，创建带设定的 NPC 客户端。

### 2. 认证管理

#### 2.1 AuthManager

```js
const authManager = DeveloperWorksSDK.Instance.authManager;

// 检查认证状态
console.log('是否准备就绪:', authManager.isReady());
console.log('令牌是否有效:', authManager.isTokenValid());
console.log('是否使用开发者令牌:', authManager.isDeveloperToken());

// 获取认证令牌
const token = authManager.getAuthToken();
```

#### 2.2 认证流程管理

```js
// 开始认证流程
await DeveloperWorksSDK.Instance.startAuthFlow(callbacks);

// 发送验证码
await DeveloperWorksSDK.Instance.sendVerificationCode(
  'user@example.com', 
  'email', // 或 'phone'
  callbacks
);

// 验证验证码
await DeveloperWorksSDK.Instance.verifyCode('123456', callbacks);
```

### 3. 主要客户端与功能

#### 3.1 AIChatClient（文本生成/对话）

```js
import { DeveloperWorksSDK } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
const chatClient = DeveloperWorksSDK.Factory.CreateChatClient();

// 基础文本生成（使用配置中的默认模型）
const result = await chatClient.textGenerationAsync('请介绍一下原神这款游戏');
if (result.success) {
  console.log(result.data);
}

// 指定模型和参数的文本生成
const resultWithParams = await chatClient.textGenerationAsync('写一首关于春天的诗', {
  model: 'deepseek-reasoner',
  temperature: 0.8,
  max_tokens: 150
});

// 流式对话
await chatClient.textChatStreamAsync('你好', {
  onMessage: (msg) => process.stdout.write(msg),
  onComplete: (fullMsg) => console.log('\n完整回复:', fullMsg),
  onError: (err) => console.error('流式对话出错:', err)
});

// 结构化输出
import { SchemaLibrary } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
const schemaLibrary = new SchemaLibrary();
schemaLibrary.addSchema('quest', {
  name: 'quest',
  description: '任务格式',
  jsonSchema: JSON.stringify({
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
      reward: { type: 'string' }
    },
    required: ['title', 'description', 'difficulty']
  })
});
const structured = await chatClient.generateStructuredAsync(
  '请创建一个关于收集魔法水晶的任务',
  schemaLibrary,
  'quest'
);
if (structured.success) {
  console.log('结构化输出:', structured.data);
}
```

#### 3.2 AIImageClient（AI 图像生成）

```js
import { DeveloperWorksSDK } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
const imageClient = DeveloperWorksSDK.Factory.CreateImageClient();

// 使用配置中的默认模型生成图像
const imageResult = await imageClient.generateImageAsync({
  prompt: '一只可爱的小猫坐在花园里',
  size: '1024x1024',
  quality: 'standard',
  style: 'natural'
});

// 指定模型生成图像
const imageResultWithModel = await imageClient.generateImageAsync({
  prompt: '一只可爱的小猫坐在花园里',
  model: 'Kolors',
  size: '1024x1024',
  quality: 'standard',
  style: 'natural'
});

if (imageResult.success) {
  console.log('图片数据:', imageResult.data);
}
```

#### 3.3 NPCClient（NPC 智能对话）

```js
import { DeveloperWorksSDK } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
const chatClient = DeveloperWorksSDK.Factory.CreateChatClient();
const npc = DeveloperWorksSDK.Populate.NPCClient(
  chatClient,
  '你是一个友好的游戏NPC，名叫艾莉娅，喜欢帮助玩家解决问题。'
);

// 普通对话
const npcResult = await npc.talk('你好，艾莉娅！');
if (npcResult.success) {
  console.log('NPC回复:', npcResult.data);
}

// 流式对话
await npc.talkStream('我想学习魔法，你能教我吗？', {
  onMessage: (msg) => process.stdout.write(msg),
  onComplete: (fullMsg) => console.log('\nNPC完整回复:', fullMsg),
  onError: (err) => console.error('NPC流式对话出错:', err)
});

// 查看历史
console.log('历史对话:', npc.conversationHistory);
```

#### 3.4 PlayerClient（玩家信息/Token 交换）

```js
import { DeveloperWorksSDK } from './DeveloperWorks-JavaScriptSDK/dist/index.js';

// 创建 PlayerClient（会自动从 AuthManager 加载令牌）
const playerClient = DeveloperWorksSDK.Factory.CreatePlayerClient();

// 检查是否有有效的玩家令牌
if (playerClient.hasValidPlayerToken()) {
  console.log('发现有效的玩家令牌');
  
  // 获取玩家信息
  const playerInfo = await playerClient.getPlayerInfoAsync();
  if (playerInfo.success) {
    console.log('玩家信息:', playerInfo.data);
  }
} else {
  console.log('没有有效的玩家令牌，需要先完成认证流程');
}

// 手动 JWT 交换（如果需要）
await playerClient.initializeAsync('your-jwt-token');
await playerClient.exchangeJWTForPlayerTokenAsync();
```

#### 3.5 结构化输出（SchemaLibrary）

```js
import { SchemaLibrary } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
const schemaLibrary = new SchemaLibrary();

// 添加道具 Schema
schemaLibrary.addSchema('item', {
  name: 'item',
  description: '道具格式',
  jsonSchema: JSON.stringify({
    type: 'object',
    properties: {
      name: { type: 'string' },
      type: { type: 'string' },
      effect: { type: 'string' }
    },
    required: ['name', 'type']
  })
});

// 添加任务 Schema
schemaLibrary.addSchema('quest', {
  name: 'quest',
  description: '任务格式',
  jsonSchema: JSON.stringify({
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
      reward: { type: 'string' }
    },
    required: ['title', 'description', 'difficulty']
  })
});
```

---

## 认证流程详解

### 1. 开发者令牌模式（开发测试）

适用于开发阶段，跳过完整的用户认证流程：

```js
const config = {
  gameId: 'your-game-id',
  auth: {
    publishableKey: 'your-publishable-key',
    developerToken: 'dev-your-developer-token' // 开发令牌
  }
};

await DeveloperWorksSDK.Instance.initializeAsync(config);
// 直接可以使用所有 AI 功能
```

### 2. 玩家认证模式（生产环境）

适用于生产环境，需要用户完成完整的认证流程：

```js
const config = {
  gameId: 'your-game-id',
  auth: {
    publishableKey: 'your-publishable-key'
    // 不包含 developerToken
  }
};

await DeveloperWorksSDK.Instance.initializeAsync(config);

// 开始认证流程
await DeveloperWorksSDK.Instance.startAuthFlow({
  onLoading: (isLoading) => console.log('加载状态:', isLoading),
  onError: (error) => console.error('认证错误:', error),
  onSuccess: () => console.log('认证成功'),
  onCodeSent: (sessionId) => console.log('验证码已发送'),
  onVerificationComplete: (globalToken) => console.log('验证完成')
});

// 发送验证码
await DeveloperWorksSDK.Instance.sendVerificationCode('user@example.com', 'email');

// 验证验证码
await DeveloperWorksSDK.Instance.verifyCode('123456');
```

### 3. 认证状态管理

```js
const authManager = DeveloperWorksSDK.Instance.authManager;

// 检查认证状态
console.log('系统是否准备就绪:', authManager.isReady());
console.log('令牌是否有效:', authManager.isTokenValid());
console.log('是否使用开发者令牌:', authManager.isDeveloperToken());

// 令牌会自动保存到本地存储（浏览器环境）
// 在 Node.js 环境中，令牌保存在 AuthManager 实例中
```

---

## 典型用法与项目集成建议

- 推荐将 config 配置单独放在 config.js 文件，便于多环境切换。
- 所有 AI 能力均为异步方法，建议使用 async/await。
- 流式对话建议用 process.stdout.write 实现实时输出。
- NPCClient 支持历史对话存储，可用于实现持续对话体验。
- 结构化输出适合 RPG 任务、道具、事件等数据生成。
- 认证流程支持邮箱和手机号两种方式。
- 令牌会自动管理，包括保存、加载和过期检查。
- AI 模型可通过配置灵活设置，支持运行时切换。

---

## 常见问题

- **SDK 初始化失败**：请检查 gameId、publishableKey 是否正确。
- **认证失败**：检查开发者令牌是否有效，或确保用户完成认证流程。
- **令牌过期**：SDK 会自动处理令牌过期，重新进行认证即可。
- **图片/文本模型 404**：通常为服务端未配置该模型，检查配置中的模型名称。
- **结构化输出 JSON 解析失败**：通常为 AI 返回内容被 Markdown 包裹，SDK 已自动处理。
- **流式对话无输出**：建议检查网络和服务端响应格式。
- **本地导入路径必须带 .js 扩展名**：否则 Node.js ESM 会报错。
- **认证流程会话过期**：重新发送验证码即可。

---

## 构建与测试

- 构建：
  ```bash
  cd DeveloperWorks-JavaScriptSDK
  npm install
  npm run build
  ```
- 单元测试：
  ```bash
  npm run test
  ```
- 代码风格检查：
  ```bash
  npm run lint
  ```
- 认证流程测试：
  ```bash
  node test-auth-flow.mjs
  ```
- 全功能测试：
  ```bash
  node test-all-features.mjs
  ```

---

## 支持与反馈

如遇到问题请联系 DeveloperWorks 技术支持，或查阅控制台文档。
