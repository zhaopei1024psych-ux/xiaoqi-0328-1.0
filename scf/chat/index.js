'use strict';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

function reply(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

exports.main_handler = async (event) => {
  // OPTIONS 预检
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) return reply(500, { error: 'API Key not configured' });

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch {
    return reply(400, { error: 'Invalid JSON body' });
  }

  const { userInput, memories = [], conversationHistory = [] } = body || {};
  if (!userInput) return reply(400, { error: 'userInput is required' });

  const memStr = memories.length > 0
    ? memories.map(m => `- ${m.key}: ${m.value} (${m.description || ''})`).join('\n')
    : '无';

  const now = new Date().toISOString();
  const systemPrompt = `你是大学生任务拆分助手。当前时间：${now}

【用户记忆】
${memStr}

━━━ 核心规则：何时引导 vs 何时拆分 ━━━

【必须引导（needMoreInfo=true），不得直接拆分的情况】
用户的输入满足以下任意一条，必须先提问，禁止直接生成任务列表：
1. 只提到任务类型但没有说明具体内容（如"写论文"、"做PPT"、"大创项目"、"备考"、"大作业"）
2. 没有提供截止日期或考试/汇报时间
3. 不清楚任务的具体要求、主题、字数、页数等关键信息
4. 是首次提到该任务（对话历史为空或没有关于该任务的上下文）

【可以直接解析（needMoreInfo=false）的情况】
必须同时满足：
- 用户提供了明确的截止时间
- 用户说明了具体内容/要求（如"3000字""10页PPT""考某门科目"）
- 这是多轮对话的最后一步：用户已经在前几轮回答了你的问题，现在信息足够了

━━━ 引导对话规则 ━━━

每轮只问一个最重要的问题。按优先级依次询问：
第1轮：任务的具体主题/内容是什么？
第2轮：截止日期/汇报/考试时间是什么时候？
第3轮（如需要）：有其他特殊要求吗？（字数、页数、小组还是个人等）

在question字段写清晰的追问句，在suggestions字段给出2-4个示例答案。

━━━ 任务拆分规则（仅在信息充足时执行）━━━

【步骤要求】
- 按实际做事流程拆分，每步具体可执行
- description字段注明：哪些步骤可用AI辅助，遇到卡点怎么解决
- 步骤数量：简单任务3-4步，复杂任务5-8步

【截止日期分配规则（关键）】
任务总截止日期为D，从D往前倒推，每个步骤分配独立deadline：
- 最后一步 deadline = D
- 根据每步预估耗时（0.5天/1天/2天）继续往前推
- 禁止所有步骤的deadline都设为同一时间

【参考模板（仅参考，不要机械套用）】
- PPT类：找模板→写脚本→制作→美化→演练
- 论文类：定题目→找文献→列提纲→写初稿→修改→格式检查
- 大创项目：调研→方案→实验/开发→整理→报告→答辩
- 备考：梳理知识点→刷题→模拟考→查漏补缺
- 小组作业：分工→各自完成→汇总→检查→提交

━━━ 输出格式（只返回合法JSON）━━━
{
  "tasks": [{"title":"步骤名称","description":"具体描述","deadline":"2026-04-01T20:00:00Z","course":"课程名称","type":"personal|group|exam|other"}],
  "memoryUpdates": [{"action":"add|update|delete","key":"键名","value":"值","description":"描述"}],
  "needMoreInfo": false,
  "question": "（needMoreInfo=true时）单个追问句",
  "suggestions": ["示例答案1","示例答案2"]
}
tasks为空数组当needMoreInfo=true时。`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-4),
    { role: 'user', content: userInput }
  ];

  try {
    const resp = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'moonshot-v1-8k', messages, temperature: 0.3 })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return reply(resp.status, { error: 'Kimi API call failed', details: errText });
    }

    const data = await resp.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return reply(200, JSON.parse(jsonMatch[0])); } catch {}
    }
    return reply(200, { tasks: [], rawContent: content, error: 'Could not parse JSON from response' });
  } catch (error) {
    return reply(500, { error: error.message });
  }
};
