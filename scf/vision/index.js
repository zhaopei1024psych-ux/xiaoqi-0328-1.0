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

  // 优先用 body 里的 key（前端用户自己的），其次用环境变量
  const apiKey = (body && body.apiKey) || process.env.KIMI_API_KEY;
  if (!apiKey) return reply(500, { error: 'API Key not configured' });

  const { image, type } = body || {};
  if (!image) return reply(400, { error: 'image is required' });

  const prompts = {
    schedule: `识别这张大学课程表图片，提取所有课程信息。
注意事项：
- dayOfWeek: 1=周一, 2=周二, 3=周三, 4=周四, 5=周五, 6=周六, 7=周日
- startTime/endTime 格式为 "HH:MM"（24小时制），如 "08:00", "09:40"
- weeks 字段填写周次范围，如 "1-16周"、"1-8周"、"9-16周（双周）"
- 若图中有多个时间段（如上午/下午分区或第1-2节/第3-4节），注意对应转换为具体时间
- 同一课程若在多个星期有排课，需分别输出多条记录
只返回合法JSON，不要有任何解释文字：
{"courses":[{"name":"课程名称","teacher":"教师姓名","location":"上课地点","dayOfWeek":1,"startTime":"08:00","endTime":"09:40","weeks":"1-16周"}]}`,
    calendar: `识别这张中国大学校历图片，提取所有重要日期和事件。
校历常见内容包括：学期开始/结束日期、各周次对应日期、节假日（国庆、五一等）、补课日、期末考试周、期中考试、毕业答辩、寒暑假、法定节假日调休等。
注意事项：
- date 字段格式为 "YYYY-MM-DD"，必须是绝对日期（如 "2026-09-01"），不能是相对描述
- 对于多天连续事件（如考试周、假期），需拆分为 date_start 和 date_end 两个字段（date字段填date_start值）
- type 字段取值：semester_start（学期开始）| semester_end（学期结束）| exam_week（考试周/期末考试）| midterm（期中考试）| holiday（法定节假日）| makeup_day（补课/调休上班）| graduation（毕业相关）| other
- 如果图中有学年信息（如"2025-2026学年第二学期"），请提取到 semester 字段
只返回合法JSON，不要有任何解释文字：
{"semester":"2025-2026学年第二学期","events":[{"title":"事件名称","date":"2026-09-01","date_start":"2026-09-01","date_end":"2026-09-01","type":"semester_start|exam_week|holiday|other"}]}`,
    task: `识别图片中的待办任务信息（作业通知、任务截图等），提取任务列表。只返回合法JSON，不要有任何解释文字：
{"tasks":[{"title":"任务标题","description":"详细描述","deadline":"2026-04-01T15:00:00","course":"课程名称","type":"personal|group|exam|other"}]}`
  };

  const prompt = prompts[type] || prompts.schedule;
  const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

  try {
    const resp = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'moonshot-v1-8k-vision-preview',
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: prompt }
          ]
        }],
        temperature: 0.1
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return reply(resp.status, { error: 'Vision API call failed', details: errText });
    }

    const data = await resp.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return reply(200, JSON.parse(jsonMatch[0])); } catch {}
    }
    return reply(200, { rawContent: content, error: 'Could not parse JSON from response' });
  } catch (error) {
    return reply(500, { error: error.message });
  }
};
