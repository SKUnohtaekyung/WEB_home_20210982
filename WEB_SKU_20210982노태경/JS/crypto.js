// AES 암호화
function encodeByAES256(key, data) {
  const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return cipher.toString(); // 암호문 반환
}

// AES 복호화
function decodeByAES256(key, data) {
  const decipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse("0000000000000000"),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decipher.toString(CryptoJS.enc.Utf8); // 복호문 반환
}

// 암호화 실행 함수
function encrypt_text(password) {
  const k = "key"; // 클라이언트 키
  const rk = k.padEnd(32, " "); // AES256은 key 길이가 32자여야 함
  const b = password;
  const eb = encodeByAES256(rk, b); // 암호화 실행
  console.log("암호화 결과:", eb);
  sessionStorage.setItem("enc_pw", eb); // 세션스토리지에 저장
  return eb;
}

// 복호화 실행 함수
function decrypt_text() {
  const k = "key"; // 서버의 키 (동일해야 함)
  const rk = k.padEnd(32, " "); // 32자로 맞추기
  const eb = sessionStorage.getItem("enc_pw"); // 저장된 암호문 불러오기
  const b = decodeByAES256(rk, eb); // 복호화 실행
  console.log("복호화 결과:", b);
  return b;
}
