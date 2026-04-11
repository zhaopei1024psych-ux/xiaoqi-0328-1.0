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

  const headers = event.headers || {};
  const apiKey = headers['x-api-key'] || headers['X-Api-Key'] || process.env.KIMI_API_KEY;
  if (!apiKey) return reply(500, { error: 'API Key not configured' });

  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch {
    return reply(400, { error: 'Invalid JSON body' });
  }

  const { image, type } = body || {};
  if (!image) return reply(400, { error: 'image is required' });

  const prompts = {
    schedule: `识别这张课程表图片，提取所有课程信息。只返回JSON，格式：
{"courses":[{"name":"课程名称","teacher":"教师","location":"地点","dayOfWeek":1,"startTime":"08:00","endTime":"09:40","weeks":"1-16周"}]}`,
    calendar: `识别这张校历图片，提取所有重要日期和事件。只返回JSON，格式：
{"events":[{"title":"事件名称","date":"2026-09-01","type":"semester_start|exam|holiday|other"}]}`,
    task: `识别图片中的待办任务信息（作业通知、任务截图等），提取任务列表。只返回JSON，格式：
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
