function googleSearch() {
  const searchTerm = document.getElementById("search_input").value.trim(); // 검색어로 설정 및 공백 제거
  const forbiddenWords = ["바보", "멍청이", "ㅅㅂ", "시발", "병신"]; // 비속어 리스트

  // 검색어 공백 검사
  if (searchTerm.length === 0) {
    alert("검색어를 입력해주세요.");
    return false;
  }

  // 비속어 필터링 검사
  for (let i = 0; i < forbiddenWords.length; i++) {
    if (searchTerm.includes(forbiddenWords[i])) {
      alert("비속어가 포함되어 있습니다.");
      return false;
    }
  }

  // 정상적인 검색어라면 알림 후 검색 실행
  alert("검색을 수행합니다.");
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    searchTerm
  )}`;
  window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기
  return false;
}

// 검색창 토글 기능
document.getElementById("search_toggle").addEventListener("click", function () {
  let searchForm = document.querySelector(".search-form");
  searchForm.classList.toggle("active");

  let input = document.getElementById("search_input");
  if (searchForm.classList.contains("active")) {
    input.focus();
  } else {
    input.value = ""; // 검색어 초기화
  }
});
