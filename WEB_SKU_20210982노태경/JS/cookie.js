// 쿠키 생성 함수
function setCookie(name, value, expiredays) {
  var date = new Date();
  date.setDate(date.getDate() + expiredays);
  document.cookie =
    escape(name) +
    "=" +
    escape(value) +
    "; expires=" +
    date.toUTCString() +
    "; path=/; SameSite=None; Secure";
}

// 쿠키 가져오기 함수
function getCookie(name) {
  var cookie = document.cookie;
  console.log("쿠키를 요청합니다");
  if (cookie != "") {
    var cookieArray = cookie.split("; ");
    for (var index in cookieArray) {
      var cookieName = cookieArray[index].split("=");
      if (cookieName[0] == name) {
        return cookieName[1];
      }
    }
  }
  return null;
}
