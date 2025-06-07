class SignUp {
  constructor(name, email, password, re_password) {
    this.name = name; // 사용자 이름
    this.email = email; // 사용자 이메일
    this.password = password; // 비밀번호
    this.re_password = re_password; // 비밀번호 재입력 확인용
    this.secretKey = "MySuperSecretKey123!"; // AES 암호화에 사용할 비밀 키
  }

  // 이메일 형식 유효성 검사 (간단한 정규식)
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // 비밀번호 유효성 검사
  // 10자 이상, 대문자, 소문자, 숫자, 특수문자 포함 여부 확인
  isValidPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|\\:;"'<>,.?/~]).{10,}$/.test(
      password
    );
  }

  // 데이터를 AES 방식으로 암호화해서 문자열로 변환
  encryptData(data) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
  }

  // 암호화된 문자열을 AES 복호화하여 객체로 변환
  decryptData(encrypted) {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  // 회원가입 처리 함수
  register() {
    // 입력값이 모두 존재하는지 확인
    if (!this.name || !this.email || !this.password || !this.re_password) {
      alert("모든 항목을 입력해주세요.");
      return false;
    }

    // 이메일 형식이 올바른지 검사
    if (!this.isValidEmail(this.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return false;
    }

    // 비밀번호 조건에 맞는지 검사
    if (!this.isValidPassword(this.password)) {
      alert(
        "비밀번호는 10자 이상이며 대소문자, 숫자, 특수문자를 포함해야 합니다."
      );
      return false;
    }

    // 비밀번호와 비밀번호 확인이 같은지 비교
    if (this.password !== this.re_password) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }

    // 회원 데이터 객체 생성 (실제 서비스라면 비밀번호는 해싱 필요)
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    // 회원 데이터 암호화 후 세션 스토리지에 저장
    const encryptedUserData = this.encryptData(userData);
    sessionStorage.setItem("user", encryptedUserData);

    // 가입 완료 메시지 출력
    alert(`${this.name}님 안녕하세요!`);

    // 암호화된 데이터를 복호화해서 콘솔에 출력 (디버깅용)
    const decryptedUserData = this.decryptData(encryptedUserData);
    console.log("복호화된 사용자 데이터:", decryptedUserData);

    // 회원가입 완료 후 로그인 페이지로 이동
    window.location.href = "/login/index_login.html";
    return true;
  }
}

// DOM 로딩 후 폼 제출 이벤트 바인딩
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signup-form");

  // 폼 제출 시 기본 동작 막고 회원가입 처리 함수 실행
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("nickname").value.trim();
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const re_password = document.getElementById("confirm-password").value;

    const newUser = new SignUp(name, email, password, re_password);
    newUser.register();
  });
});
