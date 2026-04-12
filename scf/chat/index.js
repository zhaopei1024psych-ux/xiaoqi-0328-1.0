'use strict';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
  'Content-Type': 'application/json'
};

function reply(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) };
}

// 将课程表转为可读文字，供 AI 避开上课时间
function formatCourses(courses) {
  if (!courses || courses.length === 0) return '无';
  const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const lines = [];
  courses.forEach(c => {
    (c.schedule || []).forEach(s => {
      lines.push(`${days[s.weekday] || ''}  ${s.startTime}-${s.endTime}  ${c.name}${c.location ? '（' + c.location + '）' : ''}`);
    });
  });
  return lines.join('\n') || '无';
}

// 统计未来各天的已有任务数
function formatDailyTaskLoad(todos) {
  if (!todos || todos.length === 0) return '无';
  const counts = {};
  const todayStr = new Date().toISOString().slice(0, 10);
  todos.forEach(t => {
    if (!t.deadline || t.status === 'completed') return;
    const d = t.deadline.slice(0, 10);
    if (d >= todayStr) {
      counts[d] = (counts[d] || 0) + 1;
    }
  });
  if (Object.keys(counts).length === 0) return '无';
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 14)
    .map(([d, n]) => `${d}：已有 ${n} 个任务`)
    .join('\n');
}

exports.main_handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch {
    return reply(400, { error: 'Invalid JSON body' });
  }

  const apiKey = (body && body.apiKey) || process.env.KIMI_API_KEY;
  if (!apiKey) return reply(500, { error: 'API Key not configured' });

  const {
    userInput,
    memories = [],
    conversationHistory = [],
    courses = [],
    todos = [],
    userName = ''
  } = body || {};
  if (!userInput) return reply(400, { error: 'userInput is required' });

  const memStr = memories.length > 0
    ? memories.map(m => `[${m.category || '通用'}] ${m.key}: ${m.value}${m.description ? '（' + m.description + '）' : ''}`).join('\n')
    : '无';

  const courseStr = formatCourses(courses);
  const taskLoadStr = formatDailyTaskLoad(todos);
  const now = new Date().toISOString();

  const systemPrompt = `你是${userName ? userName + '的' : ''}个性化学习任务调度助手（v3.0）。当前时间：${now}

━━━ 用户记忆 ━━━
${memStr}

━━━ 本周课程表（需避开这些时间段安排任务）━━━
${courseStr}

━━━ 未来14天已有任务负载 ━━━
${taskLoadStr}

━━━ 核心规则：何时引导 vs 何时拆分 ━━━

【对话轮次】当前历史：${conversationHistory.length} 条。

【必须引导（needMoreInfo=true）】
仅当第一轮（历史为空）且用户输入缺失以下任意一项时提问：
1. 没有截止日期/考试/汇报时间
2. 任务内容过于模糊（如"写论文"、"大作业"没有主题）

【必须直接拆分（needMoreInfo=false）】
满足任意一条，立刻生成任务列表：
- 对话历史 ≥ 2 条（已追问过，不得再问）
- 输入同时包含具体内容和明确时间
- 用户说"直接拆"、"不用问了"

引导时只问一个问题，优先问截止时间。suggestions给2-4个示例。

━━━ 智能调度规则（任务拆分时必须遵守）━━━

【每日任务数限制】
- 每天新分配的步骤 ≤ 3 个
- 若某天任务负载已 ≥ 3，自动顺延至次日
- 告知用户哪几天任务较重

【避开课程时间】
- 分配 deadline 时，避免将截止时间设在有课的时间段内
- 步骤的建议完成时间应安排在无课的时间段

【高效时段优先】
- 若 memory 中记录了用户高效时段，deadline 时间优先设在该时段末尾
- 默认假设 20:00-22:00 为晚间完成时段

【截止日期倒推】
- 最后一步 deadline = 用户给定截止时间
- 其余步骤从 D 往前倒推，按预估耗时分配
- 禁止所有步骤 deadline 相同

【步骤要求】
- 每步具体可执行，description 说明可用 AI 辅助的部分
- 简单任务 3-4 步，复杂任务 5-8 步

━━━ Memory 更新规则 ━━━
每次任务生成后，根据对话内容更新以下类别的 memory：
- category: "学习习惯"  key示例: "高效时段"、"每日可用时间"
- category: "课程信息"  key示例: "当前学期"、"主要课程"
- category: "任务偏好"  key示例: "偏好任务类型"、"常用工具"

━━━ 输出格式（只返回合法JSON，不加任何解释）━━━
{
  "tasks": [{"title":"步骤名称","description":"具体描述，含AI辅助建议","deadline":"2026-04-01T20:00:00Z","course":"课程名称","type":"personal|group|exam|other"}],
  "memoryUpdates": [{"action":"add|update|delete","key":"键名","value":"值","description":"描述","category":"学习习惯|课程信息|任务偏好|通用"}],
  "needMoreInfo": false,
  "question": "（needMoreInfo=true时填写）单个追问句",
  "suggestions": ["示例1","示例2"],
  "scheduleNote": "（可选）关于任务分配的说明，如某天任务较多、避开了某节课等"
}
needMoreInfo=true时tasks为空数组。`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-6),
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
