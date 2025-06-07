// JWT 비밀키(실제운영환경에서는복잡한키사용필수)
const JWT_SECRET = "your_secret_key_here";
function generateJWT(payload) {
  // 1. 헤더생성및Base64 인코딩
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header)); // 2. 페이로드Base64 인코딩
  const encodedPayload = btoa(JSON.stringify(payload)); // JSON 형태로변환후인코딩// 3. 서명생성(HMAC-SHA256 알고리즘사용)
  const signature = CryptoJS.HmacSHA256(
    `${encodedHeader}.${encodedPayload}`,
    JWT_SECRET
  );
  const encodedSignature = CryptoJS.enc.Base64.stringify(signature); // 4. 최종토큰조합
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}
function verifyJWT(token) {
  // 토큰검증
  try {
    // 1. 토큰을헤더, 페이로드, 서명으로분할
    const parts = token.split(".");
    if (parts.length !== 3) return null; // 형식오류체크
    const [encodedHeader, encodedPayload, encodedSignature] = parts; // 2. 서명재계산및비교
    const signature = CryptoJS.HmacSHA256(
      `${encodedHeader}.${encodedPayload}`,
      JWT_SECRET
    );
    const calculatedSignature = CryptoJS.enc.Base64.stringify(signature);
    if (calculatedSignature !== encodedSignature) return null; // 서명불일치// 3. 페이로드파싱및만료시간검증
    const payload = JSON.parse(atob(encodedPayload)); // 디코딩후해석
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      // 밀리초단위
      console.log("보안토큰이만료되었습니다");
      return null;
    }
    return payload; // 검증성공
  } catch (error) {
    return null; // 파싱오류또는기타예외처리
  }
}

function isAuthenticated() {
  // 사용자인증상태확인
  const token = localStorage.getItem("jwt_token");
  if (!token) return false; // 토큰없음
  const payload = verifyJWT(token);
  console.log(payload);
  return !!payload; // 페이로드유무로인증상태판단
}
function checkAuth() {
  // 인증검사수행
  const authenticated = isAuthenticated(); // 한번만검증호출
  if (authenticated) {
    alert("정상적으로토큰이검증되었습니다.");
  } else {
    alert("토큰검증에러!! 인증되지않은접근입니다.");
    window.location.href = "../login/login.html"; // 로그인페이지이동
  }
}