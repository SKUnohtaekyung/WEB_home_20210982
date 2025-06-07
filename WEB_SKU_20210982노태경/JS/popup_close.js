let close_time; // setTimeout ID
let countdown = 50; // 50초 설정 (초 단위)

// 50초 후 창 닫기
clearTimeout(close_time);
close_time = setTimeout(close_window, 50000);

// 카운트다운 시작
show_time();

function show_time() {
  const divClock = document.getElementById("Time");

  // 남은 시간 표시
  divClock.innerText = `${countdown}초 후 창이 닫힙니다`;

  countdown--;

  if (countdown >= 0) {
    setTimeout(show_time, 1000); // 1초마다 반복
  }
}

function close_window() {
  alert("시간이 종료되어 창을 닫습니다.");
  window.close(); // 주의: 사용자가 연 창에서만 작동함
}
