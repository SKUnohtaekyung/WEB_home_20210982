// 전역 변수 정의
const MAX_ATTEMPTS = 3;
const LIMIT_TIME_MS = 60 * 1000; // 1분 제한
const loginBtn = document.getElementById("login_btn");
const emailInput = document.getElementById("typeEmailX");
const passwordInput = document.getElementById("typePasswordX");
const idsave_check = document.getElementById("idSaveCheck");
const statusBox = document.getElementById("status_msg");
const logoutBtn = document.getElementById("logout_btn"); // 로그아웃 버튼

// 쿠키 관련 함수
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
}
function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// XSS 필터링
function check_xss(input) {
  const sanitized = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (sanitized !== input) {
    alert("XSS 공격 가능성이 있는 입력값을 발견했습니다.");
    return false;
  }
  return sanitized;
}

// 이메일 형식 검사
function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 로그인 실패 처리
function login_failed() {
  let failCount = parseInt(getCookie("login_fail")) || 0;
  failCount++;
  setCookie("login_fail", failCount, 1);
  if (failCount >= MAX_ATTEMPTS) {
    const blockUntil = Date.now() + LIMIT_TIME_MS;
    setCookie("login_block", blockUntil, 1);
    setLoginButtonVisibility(false);
    showBlockStatus(blockUntil);
  } else {
    alert(`로그인 실패! 현재 ${failCount}회 실패했습니다.`);
    if (failCount === MAX_ATTEMPTS - 1) {
      alert("로그인 시도 가능 횟수가 1번 남았습니다.");
    }
  }
}

// 로그인 차단 상태 메시지 표시
function showBlockStatus(blockUntil) {
  const statusBox = document.getElementById("blockMsg");
  const interval = setInterval(() => {
    const remaining = blockUntil - Date.now();
    if (remaining <= 0) {
      clearInterval(interval);
      deleteCookie("login_fail");
      deleteCookie("login_block");
      statusBox.style.display = "none";
      setLoginButtonVisibility(true);
    } else {
      statusBox.style.display = "block";
      const seconds = Math.ceil(remaining / 1000);
      statusBox.innerHTML = `
        <div style="border: 2px solid red; border-radius: 10px; padding: 10px; background-color: #ffe0e0;">
          로그인 시도 횟수를 초과했습니다.<br>
          ${seconds}초 후 다시 시도해주세요.
        </div>`;
    }
  }, 1000); 
}

// AES 암호화/복호화 함수
function encodeByAES256(key, data) {
  return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString();
}
function decodeByAES256(key, data) {
  const bytes = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}

// 암호화 실행 함수
function encrypt_text(password) {
  const k = "key";
  const rk = k.padEnd(32, " ");
  const eb = encodeByAES256(rk, password);
  sessionStorage.setItem("enc_pw", eb);
  return eb;
}

// 복호화 실행 함수
function decrypt_text() {
  const k = "key";
  const rk = k.padEnd(32, " ");
  const eb = sessionStorage.getItem("enc_pw");
  const b = decodeByAES256(rk, eb);
  return b;
}

// 세션 저장
function session_set() {
  if (sessionStorage) {
    const session_id = emailInput.value;
    const session_pass = passwordInput.value;
    const en_text = encrypt_text(session_pass);
    sessionStorage.setItem("Session_Storage_id", session_id);
    sessionStorage.setItem("Session_Storage_pass", en_text);
    sessionStorage.setItem("is_logged_in", "true");
  } else {
    alert("세션 스토리지를 지원하지 않습니다.");
  }
}

// 로그인 후 복호화
function init_logined() {
  if (sessionStorage) {
    const decrypted = decrypt_text();
    console.log("복호화된 비밀번호:", decrypted);
  } else {
    alert("세션 스토리지를 지원하지 않습니다.");
  }
}

// 세션에서 비밀번호 가져오기
function session_get() {
  if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_pass");
  } else {
    alert("세션 스토리지를 지원하지 않습니다.");
  }
}

// 로그인 입력 검사
function check_input() {
  const rawEmail = emailInput.value.trim();
  const rawPassword = passwordInput.value.trim();

  if (
    getCookie("login_block") &&
    parseInt(getCookie("login_block")) > Date.now()
  ) {
    showBlockStatus(parseInt(getCookie("login_block")));
    return false;
  }

  if (rawEmail === "") {
    alert("이메일을 입력하세요.");
    return false;
  }
  if (rawPassword === "") {
    alert("비밀번호를 입력하세요.");
    return false;
  }
  if (!validateEmailFormat(rawEmail)) {
    alert("올바른 이메일 형식이 아닙니다.");
    return false;
  }
  if (rawEmail.length < 5) {
    alert("아이디는 최소 5글자 이상 입력해야 합니다.");
    return false;
  }
  if (rawPassword.length < 10) {
    alert("비밀번호는 반드시 10글자 이상 입력해야 합니다.");
    return false;
  }

  const hasSpecialChar = /[!,@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(
    rawPassword
  );
  const hasUpper = /[A-Z]/.test(rawPassword);
  const hasLower = /[a-z]/.test(rawPassword);

  if (!hasSpecialChar) {
    alert("패스워드는 특수문자를 1개 이상 포함해야 합니다.");
    return false;
  }
  if (!hasUpper || !hasLower) {
    alert("패스워드는 대소문자를 모두 포함해야 합니다.");
    return false;
  }

  const sanitizedEmail = check_xss(rawEmail);
  const sanitizedPassword = check_xss(rawPassword);
  if (!sanitizedEmail || !sanitizedPassword) {
    return false;
  }

  if (idsave_check.checked) {
    setCookie("id", sanitizedEmail, 1);
  } else {
    deleteCookie("id");
  }

  session_set();

  const payload = {
    id: sanitizedEmail,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  const jwtToken = generateJWT(payload);
  localStorage.setItem("access_token", jwtToken);

  alert("로그인 성공! 메인 페이지로 이동합니다.");
  window.location.href = "/login/index_login.html";
  return true;
}

// 로그인 버튼 숨기기/보이기 함수
function setLoginButtonVisibility(isVisible) {
  loginBtn.style.visibility = isVisible ? "visible" : "hidden";
}

// 로그인 상태 확인 (이제 버튼 누를 때만 실행됨)
function session_check() {
  const isLoggedIn = sessionStorage.getItem("is_logged_in");
  if (isLoggedIn && isLoggedIn === "true") {
    alert("이미 로그인 되었습니다.");
    return true;
  }
  return false;
}

// 로그아웃 함수 (세션 + 토큰 완전 삭제 + 페이지 이동)
function logout() {
  sessionStorage.clear(); // 세션 저장소 완전 초기화
  localStorage.removeItem("access_token"); // JWT 토큰 삭제

  alert("로그아웃 되었습니다. 로그인 페이지로 이동합니다.");

  // 히스토리 남기지 않고 이동 (뒤로가기 눌러도 로그인 상태 유지 안 됨)
  window.location.replace("index.html"); // 로그인 페이지 경로에 맞게 수정
}

// 초기화 함수
function init() {
  const savedId = getCookie("id");
  const blockUntil = parseInt(getCookie("login_block"));

  if (savedId) {
    emailInput.value = decodeURIComponent(savedId);
    idsave_check.checked = true;
  }

  if (blockUntil && blockUntil > Date.now()) {
    setLoginButtonVisibility(false);
    showBlockStatus(blockUntil);
  } else {
    setLoginButtonVisibility(true);
  }
}

// 로그인 버튼 이벤트 등록
loginBtn.addEventListener("click", () => {
  if (session_check()) return;

  const result = check_input();
  if (!result) {
    login_failed();
  }
});

// 로그아웃 버튼 이벤트 등록
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// 페이지 로딩 시 초기화
window.onload = init;

function init_logined() {
  // 기존 로그인 상태 처리 코드들 여기에

  // 로그아웃 버튼 이벤트 등록
  const logoutBtn = document.getElementById("logout_btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.clear(); // 세션 저장소 비우기
      localStorage.removeItem("access_token"); // 필요한 로컬 저장소 항목 삭제
      alert("로그아웃 되었습니다.");
      window.location.replace("/index.html"); // 로그아웃 후 이동할 페이지 (로그인 페이지 등)
    });
  }
}
