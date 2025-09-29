# 📋 DeveloperWorks JavaScript SDK 配置指南

## 🎯 概述

本指南详细说明如何配置 DeveloperWorks JavaScript SDK，包括所有必需和可选参数的含义、获取方法以及配置示例。

## 📋 配置参数总览

### 完整配置结构

```javascript
const config = {
  // 🔑 必需参数
  gameId: 'your-game-id',                    // 游戏ID
  auth: {
    publishableKey: 'your-publishable-key'   // 发布密钥
  },
  
  // ⚙️ 可选参数
  defaultChatModel: 'gpt-3.5-turbo',         // 默认聊天模型
  defaultImageModel: 'dall-e-3',             // 默认图像模型
  network: {
    baseUrl: 'https://developerworks.agentlandlab.com', // API基础URL
    timeoutSeconds: 30,                      // 超时时间
    maxRetryCount: 3,                        // 最大重试次数
    retryDelaySeconds: 1                     // 重试延迟
  },
  auth: {
    useOversea: false                        // 是否使用海外服务器
  },
  enableDebugLogs: true                      // 是否启用调试日志
};
```

## 🔑 必需参数详解

### 1. `gameId` - 游戏ID

**含义：** 你的游戏在 DeveloperWorks 平台上的唯一标识符

**如何获取：**
1. 登录 [DeveloperWorks 控制台](https://console.developerworks.com)
2. 进入"游戏管理"页面
3. 创建新游戏或选择现有游戏
4. 复制游戏ID（通常格式为：`game_xxxxxxxxxx`）

**示例：**
```javascript
gameId: 'game_abc123def456'
```

### 2. `auth.publishableKey` - 发布密钥

**含义：** 用于API认证的公开密钥

**如何获取：**
1. 在 DeveloperWorks 控制台的"API密钥"页面
2. 点击"创建新密钥"
3. 选择"发布密钥"类型
4. 复制生成的密钥（通常以 `dw_pk_` 开头）

**示例：**
```javascript
auth: {
  publishableKey: 'dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}
```

## ⚙️ 可选参数详解

### 1. `defaultChatModel` - 默认聊天模型

**含义：** 默认使用的AI聊天模型

**可选值：**
- `'gpt-3.5-turbo'` (推荐，性价比高)
- `'gpt-4'` (更智能，但成本更高)
- `'gpt-4-turbo'` (最新版本)

**默认值：** `'gpt-3.5-turbo'`

**示例：**
```javascript
defaultChatModel: 'gpt-4'
```

### 2. `defaultImageModel` - 默认图像模型

**含义：** 默认使用的AI图像生成模型

**可选值：**
- `'dall-e-3'` (推荐，质量最高)
- `'dall-e-2'` (成本较低)

**默认值：** `'dall-e-3'`

**示例：**
```javascript
defaultImageModel: 'dall-e-2'
```

### 3. `network` - 网络配置

#### `baseUrl` - API基础URL
**含义：** DeveloperWorks API的基础地址

**默认值：** `'https://developerworks.agentlandlab.com'`

**注意：** 通常不需要修改，除非使用特殊环境

#### `timeoutSeconds` - 超时时间
**含义：** 网络请求的超时时间（秒）

**默认值：** `30`

**建议：** 根据网络环境调整，网络较慢时可增加

#### `maxRetryCount` - 最大重试次数
**含义：** 网络请求失败时的最大重试次数

**默认值：** `3`

**建议：** 网络不稳定时可增加

#### `retryDelaySeconds` - 重试延迟
**含义：** 重试之间的延迟时间（秒）

**默认值：** `1`

**示例：**
```javascript
network: {
  baseUrl: 'https://developerworks.agentlandlab.com',
  timeoutSeconds: 60,        // 增加超时时间
  maxRetryCount: 5,          // 增加重试次数
  retryDelaySeconds: 2       // 增加重试延迟
}
```

### 4. `auth.useOversea` - 海外服务器

**含义：** 是否使用海外服务器

**可选值：**
- `false` (默认，使用国内服务器)
- `true` (使用海外服务器)

**使用场景：** 如果你的用户主要在国外，设置为 `true`

**示例：**
```javascript
auth: {
  publishableKey: 'dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  useOversea: true
}
```

### 5. `enableDebugLogs` - 调试日志

**含义：** 是否启用详细的调试日志

**可选值：**
- `true` (启用，开发时推荐)
- `false` (禁用，生产环境推荐)

**默认值：** `true`

**示例：**
```javascript
enableDebugLogs: false  // 生产环境禁用
```

## 📝 配置示例

### 1. 最小配置（仅必需参数）

```javascript
// config.js
const config = {
  gameId: 'game_abc123def456',
  auth: {
    publishableKey: 'dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
};

module.exports = config;
```

### 2. 开发环境配置

```javascript
// config.js
const config = {
  gameId: 'game_abc123def456',
  defaultChatModel: 'gpt-3.5-turbo',
  defaultImageModel: 'dall-e-3',
  network: {
    baseUrl: 'https://developerworks.agentlandlab.com',
    timeoutSeconds: 30,
    maxRetryCount: 3,
    retryDelaySeconds: 1
  },
  auth: {
    publishableKey: 'dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    useOversea: false
  },
  enableDebugLogs: true  // 开发时启用调试日志
};

module.exports = config;
```

### 3. 生产环境配置

```javascript
// config.js
const config = {
  gameId: 'game_abc123def456',
  defaultChatModel: 'gpt-4',  // 使用更高级的模型
  defaultImageModel: 'dall-e-3',
  network: {
    baseUrl: 'https://developerworks.agentlandlab.com',
    timeoutSeconds: 60,       // 增加超时时间
    maxRetryCount: 5,         // 增加重试次数
    retryDelaySeconds: 2      // 增加重试延迟
  },
  auth: {
    publishableKey: 'dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    useOversea: false
  },
  enableDebugLogs: false      // 生产环境禁用调试日志
};

module.exports = config;
```

### 4. 海外用户配置

```javascript
// config.js
const config = {
  gameId: 'game_abc123def456',
  defaultChatModel: 'gpt-4',
  defaultImageModel: 'dall-e-3',
  network: {
    baseUrl: 'https://developerworks.agentlandlab.com',
    timeoutSeconds: 90,       // 海外网络较慢，增加超时
    maxRetryCount: 5,
    retryDelaySeconds: 3
  },
  auth: {
    publishableKey: 'dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    useOversea: true          // 使用海外服务器
  },
  enableDebugLogs: false
};

module.exports = config;
```

## 🔒 安全注意事项

### 1. 密钥保护

```javascript
// ❌ 错误：直接在代码中硬编码密钥
const config = {
  auth: {
    publishableKey: 'dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
};

// ✅ 正确：使用环境变量
const config = {
  auth: {
    publishableKey: process.env.DEVELOPERWORKS_PUBLISHABLE_KEY
  }
};
```

### 2. 环境变量配置

```bash
# .env 文件
DEVELOPERWORKS_GAME_ID=game_abc123def456
DEVELOPERWORKS_PUBLISHABLE_KEY=dw_pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```javascript
// config.js
require('dotenv').config();

const config = {
  gameId: process.env.DEVELOPERWORKS_GAME_ID,
  auth: {
    publishableKey: process.env.DEVELOPERWORKS_PUBLISHABLE_KEY
  }
};

module.exports = config;
```

### 3. 配置文件管理

```javascript
// config.js
const config = {
  gameId: process.env.NODE_ENV === 'production' 
    ? process.env.DEVELOPERWORKS_GAME_ID_PROD 
    : process.env.DEVELOPERWORKS_GAME_ID_DEV,
  auth: {
    publishableKey: process.env.NODE_ENV === 'production'
      ? process.env.DEVELOPERWORKS_PUBLISHABLE_KEY_PROD
      : process.env.DEVELOPERWORKS_PUBLISHABLE_KEY_DEV
  }
};

module.exports = config;
```

## 🚀 使用配置

### 1. 导入和使用

```javascript
// main.js
import { DeveloperWorksSDK } from './DeveloperWorks-JavaScriptSDK/dist/index.js';
import config from './config.js';

async function main() {
  try {
    // 初始化SDK
    await DeveloperWorksSDK.Instance.initializeAsync(config);
    console.log('✅ SDK初始化成功！');
    
    // 使用SDK功能
    const chatClient = DeveloperWorksSDK.Factory.CreateChatClient();
    const result = await chatClient.textGenerationAsync({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: '你好' }]
    });
    
    console.log('AI回复:', result.data);
    
  } catch (error) {
    console.error('❌ 初始化失败:', error);
  }
}

main();
```

### 2. 配置验证

```javascript
// config-validator.js
function validateConfig(config) {
  const errors = [];
  
  // 检查必需参数
  if (!config.gameId) {
    errors.push('缺少 gameId 参数');
  }
  
  if (!config.auth?.publishableKey) {
    errors.push('缺少 auth.publishableKey 参数');
  }
  
  // 检查参数格式
  if (config.gameId && !config.gameId.startsWith('game_')) {
    errors.push('gameId 格式错误，应以 "game_" 开头');
  }
  
  if (config.auth?.publishableKey && !config.auth.publishableKey.startsWith('dw_pk_')) {
    errors.push('publishableKey 格式错误，应以 "dw_pk_" 开头');
  }
  
  if (errors.length > 0) {
    throw new Error('配置验证失败:\n' + errors.join('\n'));
  }
  
  return true;
}

module.exports = { validateConfig };
```

## ❓ 常见问题

### Q1: 如何获取 gameId 和 publishableKey？
A1: 登录 DeveloperWorks 控制台，在"游戏管理"和"API密钥"页面获取。

### Q2: 配置参数有默认值吗？
A2: 是的，除了 `gameId` 和 `publishableKey` 是必需的，其他参数都有合理的默认值。

### Q3: 可以动态修改配置吗？
A3: 初始化后不建议修改配置，如需修改请重新初始化SDK。

### Q4: 如何为不同环境使用不同配置？
A4: 使用环境变量或不同的配置文件来管理开发、测试、生产环境的配置。

### Q5: 配置错误会有什么影响？
A5: 配置错误会导致SDK初始化失败，无法使用任何功能。

## 📞 获取帮助

如果遇到配置问题：

1. 检查 [API参考文档](./API_REFERENCE.md)
2. 查看 [README文档](./README.md)
3. 运行示例代码验证配置
4. 联系 DeveloperWorks 技术支持

---

**记住：** 正确的配置是使用SDK的第一步，请仔细检查所有参数！🎯
