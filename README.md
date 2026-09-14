# 모닝브리핑 스크립트 생성기 — 독립 배포판

Claude 계정이 없는 사람도 링크만으로 바로 쓸 수 있는 완전히 독립된 웹사이트 버전입니다.
프론트엔드(`index.html`)는 자체 백엔드(`api/generate.js`)를 거쳐 Anthropic API를 호출하고,
API 키는 서버에만 저장되어 사용자에게 절대 노출되지 않습니다.

## 준비물

1. **Anthropic API 키** — Claude.ai 구독과는 별개입니다. 아래에서 발급받으세요.
   - https://console.anthropic.com 접속 → 로그인/가입
   - 결제 수단 등록 (사용한 만큼 과금되는 종량제입니다)
   - Settings → API Keys → "Create Key"로 키 발급 (`sk-ant-...` 형태)
   - ⚠️ 이 키는 절대 index.html이나 프론트엔드 코드에 넣지 마세요. 아래 3단계처럼 서버 환경변수로만 등록합니다.

2. **Vercel 계정** (무료로 시작 가능) — https://vercel.com

## 배포 방법 (Vercel 기준, 가장 간단함)

1. 이 폴더(`briefing-website`) 전체를 GitHub 저장소에 올리거나, Vercel CLI로 바로 배포합니다.

   **GitHub을 쓰는 경우**
   - GitHub에 새 저장소를 만들고 이 폴더 내용을 push
   - vercel.com → "Add New Project" → 방금 만든 저장소 선택 → Import
   - Framework Preset은 "Other"로 두면 됩니다 (별도 설정 불필요)

   **CLI를 쓰는 경우** (Node.js가 설치되어 있어야 함)
   ```bash
   npm install -g vercel
   cd briefing-website
   vercel
   ```
   화면의 안내를 따라가면 됩니다.

2. **환경변수 등록**
   - Vercel 프로젝트 → Settings → Environment Variables
   - Key: `ANTHROPIC_API_KEY`
   - Value: 1단계에서 발급받은 키 (`sk-ant-...`)
   - 등록 후 "Redeploy" 한 번 눌러줘야 반영됩니다.

3. 배포가 끝나면 `https://프로젝트이름.vercel.app` 같은 주소가 생깁니다.
   이 링크는 **Claude 계정이 전혀 없는 사람도** 바로 열어서 쓸 수 있습니다.

## 비용 관련 참고

- 이제부터는 스크립트를 생성할 때마다 등록하신 Anthropic API 키로 실제 과금이 발생합니다 (Claude.ai 무료/유료 구독과는 완전히 별개의 요금입니다).
- 사용량이 걱정되면 console.anthropic.com에서 사용량/한도(Usage limits)를 설정해두는 걸 권장합니다.
- 나만 쓰거나 소수 인원만 쓸 예정이라면, 지난번 방식(Claude 아티팩트 Publish + 로그인해서 사용)이 무료라서 더 경제적일 수 있어요. 정말 불특정 다수/외부인이 로그인 없이 쓸 수 있어야 할 때만 이 독립 배포판을 쓰는 걸 추천합니다.

## 다른 곳에 배포하고 싶다면

Vercel이 아니어도 됩니다. Netlify Functions, Cloudflare Workers, AWS Lambda + API Gateway 등
"정적 파일 호스팅 + 서버리스 함수"를 지원하는 곳이면 어디든 `api/generate.js`의 로직을 그대로 옮겨서 쓸 수 있습니다.
핵심은 하나입니다: **API 키는 항상 서버 쪽 환경변수로만 두고, 브라우저 코드에는 절대 넣지 않는다.**
