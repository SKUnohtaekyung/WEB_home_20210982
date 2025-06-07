// 팝업 띄우는 함수
function pop_up() {
  var cookieCheck = getCookie("popupYN"); // 쿠키 확인

  // 쿠키가 'N'이 아니면 팝업을 띄운다.
  if (cookieCheck != "N") {
    window.open(
      "popup/popup.html",
      "팝업테스트",
      "width=400, height=300, top=10, left=10"
    );

    // 팝업 띄운 후, 쿠키 값을 'N'으로 설정 (하루 동안 유지)
    setCookie("popupYN", "N", 1); // 하루루 동안 쿠키 유지
  }
}

// 현재 시간을 표시하는 함수
function show_clock() {
  let currentDate = new Date(); // 현재 시스템 날짜 객체 생성
  let divClock = document.getElementById("divClock"); // 시간 표시할 요소
  let msg = "현재 시간: ";

  // 오전/오후 구분
  if (currentDate.getHours() > 12) {
    msg += "오후";
    msg += currentDate.getHours() - 12 + "시";
  } else {
    msg += "오전";
    msg += currentDate.getHours() + "시";
  }

  // 분, 초 표시
  msg += currentDate.getMinutes() + "분";
  msg += currentDate.getSeconds() + "초";
  divClock.innerText = msg; // divClock에 시간 표시

  // 정각 1분 전에는 빨간색으로 표시
  if (currentDate.getMinutes() > 58) {
    divClock.style.color = "red";
  }

  setTimeout(show_clock, 1000); // 1초마다 시간 갱신
}

// 이미지에 마우스를 올리면 변경되는 함수
function over(obj) {
  obj.src = "image/riot_red.png"; // 마우스를 올리면 이미지 변경
}

// 이미지에서 마우스를 뗄 때 원래 이미지로 돌아가는 함수
function out(obj) {
  obj.src = "image/riot_white.png"; // 마우스를 떼면 원래 이미지로 변경
}

// 쿠키를 설정하는 함수
function setCookie(name, value, expiredays) {
  var date = new Date();
  date.setDate(date.getDate() + expiredays); // 만료일 설정
  document.cookie =
    encodeURIComponent(name) +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    date.toUTCString() +
    "; path=/; SameSite=None; Secure"; // 쿠키에 SameSite 및 Secure 속성 추가
}

// 쿠키를 가져오는 함수
function getCookie(name) {
  var cookie = document.cookie;
  console.log("쿠키를 요청합니다.");
  if (cookie != "") {
    var cookie_array = cookie.split("; ");
    for (var index in cookie_array) {
      var cookie_name = cookie_array[index].split("=");
      if (cookie_name[0] == name) {
        return decodeURIComponent(cookie_name[1]); // 요청한 쿠키 값 반환
      }
    }
  }
  return null; // 쿠키가 없으면 null 반환
}

// 팝업을 닫고 쿠키를 설정하는 함수
function closePopup() {
  var checkPopupElement = document.getElementById("check_popup");

  // check_popup 요소가 존재하고, 해당 값이 true일 경우
  if (checkPopupElement && checkPopupElement.value) {
    setCookie("popupYN", "N", 1); // 쿠키에 'N' 설정 (1일 동안 유효)
    console.log("쿠키를 설정합니다.");
    self.close(); // 팝업 창 닫기
  }
}
