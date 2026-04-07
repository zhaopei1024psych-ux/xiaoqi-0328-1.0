export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    const { image, type } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'image is required' });
    }

    const prompts = {
      schedule: `识别这张课程表图片，提取所有课程信息。只返回JSON，格式：
{
  "courses": [
    {
      "name": "课程名称",
      "teacher": "教师姓名",
      "location": "上课地点",
      "dayOfWeek": 1,
      "startTime": "08:00",
      "endTime": "09:40",
      "weeks": "1-16周"
    }
  ]
}`,
      calendar: `识别这张校历图片，提取所有重要日期和事件。只返回JSON，格式：
{
  "events": [
    {
      "title": "事件名称",
      "date": "2026-09-01",
      "type": "semester_start|exam|holiday|other"
    }
  ]
}`,
      task: `识别图片中的待办任务信息（作业通知、任务截图、聊天记录等），提取任务列表。只返回JSON，格式：
{
  "tasks": [
    {
      "title": "任务标题",
      "description": "详细描述",
      "deadline": "2026-04-01T15:00:00",
      "course": "课程名称（若有）",
      "type": "personal|group|exam|other"
    }
  ]
}`
    };

    const prompt = prompts[type] || prompts.schedule;

    // 调用 Kimi Vision API
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'moonshot-v1-8k-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kimi Vision API error:', errorText);
      return res.status(response.status).json({ error: 'Vision API call failed', details: errorText });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const result = JSON.parse(jsonMatch[0]);
        return res.status(200).json(result);
      } catch {
        // fall through to error response
      }
    }

    return res.status(200).json({
      rawContent: content,
      error: 'Could not parse JSON from response'
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
