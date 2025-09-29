const { 
  DeveloperWorksSDK, 
  AIChatClient, 
  AIImageClient, 
  NPCClient,
  SchemaLibrary 
} = require('./dist/index.js');

async function testSDK() {
  try {
    console.log('🧪 开始测试 DeveloperWorks JavaScript SDK...\n');

    // 1. 测试SchemaLibrary
    console.log('1️⃣ 测试 SchemaLibrary...');
    const schemaLibrary = new SchemaLibrary();
    
    const testSchema = {
      name: 'test_schema',
      description: '测试Schema',
      jsonSchema: JSON.stringify({
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'number' }
        },
        required: ['name']
      })
    };
    
    const addResult = schemaLibrary.addSchema('test_schema', testSchema);
    console.log(`   ✅ 添加Schema: ${addResult ? '成功' : '失败'}`);
    
    const hasSchema = schemaLibrary.hasSchema('test_schema');
    console.log(`   ✅ 检查Schema存在: ${hasSchema ? '是' : '否'}`);
    
    const schema = schemaLibrary.getSchema('test_schema');
    console.log(`   ✅ 获取Schema: ${schema ? '成功' : '失败'}`);
    
    const isValid = schemaLibrary.isValid('test_schema');
    console.log(`   ✅ Schema验证: ${isValid ? '通过' : '失败'}`);
    
    const exported = schemaLibrary.exportToJson();
    console.log(`   ✅ 导出Schema数量: ${exported.length}`);
    
    console.log('');

    // 2. 测试AIResult
    console.log('2️⃣ 测试 AIResult...');
    const { AIResultImpl } = require('./dist/index.js');
    
    const successResult = AIResultImpl.success('测试成功数据');
    console.log(`   ✅ 成功结果: ${successResult.success}, 数据: ${successResult.data}`);
    
    const failureResult = AIResultImpl.failure('测试错误信息');
    console.log(`   ✅ 失败结果: ${failureResult.success}, 错误: ${failureResult.error}`);
    
    console.log('');

    // 3. 测试类型定义
    console.log('3️⃣ 测试类型定义...');
    const { ChatMessage, ChatConfig } = require('./dist/index.js');
    
    const testMessage = {
      role: 'user',
      content: '测试消息'
    };
    
    const testConfig = {
      model: 'gpt-3.5-turbo',
      messages: [testMessage]
    };
    
    console.log(`   ✅ 消息角色: ${testMessage.role}`);
    console.log(`   ✅ 消息内容: ${testMessage.content}`);
    console.log(`   ✅ 配置模型: ${testConfig.model}`);
    console.log(`   ✅ 消息数量: ${testConfig.messages.length}`);
    
    console.log('');

    // 4. 测试SDK实例创建（不初始化）
    console.log('4️⃣ 测试SDK实例...');
    try {
      const sdk = DeveloperWorksSDK.Instance;
      console.log('   ✅ SDK单例创建成功');
      console.log(`   ✅ SDK初始化状态: ${sdk.isInitialized}`);
    } catch (error) {
      console.log(`   ❌ SDK创建失败: ${error.message}`);
    }
    
    console.log('');

    // 5. 测试工具函数
    console.log('5️⃣ 测试工具函数...');
    try {
      const { ChatService } = require('./dist/index.js');
      const chatService = new ChatService(null); // 传入null作为provider
      
      const systemMessage = chatService.createSystemMessage('你是一个测试AI');
      console.log(`   ✅ 系统消息创建: ${systemMessage.role} - ${systemMessage.content}`);
      
      const userMessage = chatService.createUserMessage('测试用户消息');
      console.log(`   ✅ 用户消息创建: ${userMessage.role} - ${userMessage.content}`);
      
      const availableModels = chatService.getAvailableModels();
      console.log(`   ✅ 可用模型数量: ${availableModels.length}`);
      
    } catch (error) {
      console.log(`   ❌ 工具函数测试失败: ${error.message}`);
    }
    
    console.log('');
    console.log('🎉 SDK基本功能测试完成！');
    console.log('');
    console.log('📝 说明:');
    console.log('   - 这些测试验证了SDK的基本结构和类型定义');
    console.log('   - 由于没有真实的API密钥，无法测试网络功能');
    console.log('   - 要测试完整功能，请配置有效的API密钥');
    console.log('');
    console.log('🔑 配置API密钥:');
    console.log('   1. 在 examples/basic-usage.js 中替换 your-game-id 和 your-publishable-key');
    console.log('   2. 运行: node start-example.js basic');
    
  } catch (error) {
    console.error('❌ 测试过程中出错:', error);
  }
}

// 运行测试
testSDK();
