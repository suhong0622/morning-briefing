// Vercel Serverless Function
// 이 파일은 브라우저가 아니라 서버에서만 실행되기 때문에,
// ANTHROPIC_API_KEY가 사용자에게 절대 노출되지 않습니다.
//
// 프론트엔드(index.html)는 https://api.anthropic.com 을 직접 호출하지 않고
// 같은 도메인의 /api/generate 를 호출하고, 이 함수가 실제 Anthropic API로
// 요청을 대신 전달(proxy)합니다.

module.exports = async function handler(req, res) {
  // 간단한 CORS 허용 (같은 도메인에서만 쓸 거라면 없어도 되지만, 안전하게 포함)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: { message: 'Method not allowed' } });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: { message: '서버에 ANTHROPIC_API_KEY 환경변수가 설정되지 않았어요. 배포 설정(Environment Variables)을 확인해주세요.' }
    });
    return;
  }

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await apiRes.json();
    res.status(apiRes.status).json(data);
  } catch (err) {
    res.status(500).json({
      error: { message: (err && err.message) ? err.message : 'proxy_error' }
    });
  }
};
