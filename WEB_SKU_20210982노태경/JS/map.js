// 마커를 담는 배열
var markers = [];

var mapContainer = document.getElementById("map"), // 지도를 표시할 div 요소
  mapOption = {
    center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심 좌표(서울 시청)
    level: 3, // 지도 확대 레벨(1~높을수록 축소)
  };

// 지도 생성
var map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체 생성
var ps = new kakao.maps.services.Places();

// 장소명 표시용 인포윈도우 생성
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드로 장소 검색 실행
searchPlaces();

// 키워드 검색 함수
function searchPlaces() {
  var keyword = document.getElementById("keyword").value;

  // 공백만 입력 시 경고 후 종료
  if (!keyword.replace(/^\s+|\s+$/g, "")) {
    alert("키워드를 입력해주세요!");
    return false;
  }

  // 키워드로 장소 검색 요청
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소 검색 완료 후 호출되는 콜백 함수
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 검색 정상 완료 시 장소 목록과 마커 표시
    displayPlaces(data);

    // 페이지 번호 표시
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

// 검색 결과 목록과 마커 표시 함수
function displayPlaces(places) {
  var listEl = document.getElementById("placesList"), // 결과 목록 컨테이너
    menuEl = document.getElementById("menu_wrap"), // 전체 메뉴 래퍼
    fragment = document.createDocumentFragment(), // 효율적 요소 추가를 위한 DocumentFragment
    bounds = new kakao.maps.LatLngBounds(); // 지도 범위 조정을 위한 객체

  // 기존 검색 결과 목록 삭제
  removeAllChildNods(listEl);

  // 기존 마커 모두 제거
  removeMarker();

  for (var i = 0; i < places.length; i++) {
    var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x), // 장소 좌표
      marker = addMarker(placePosition, i), // 마커 생성 및 지도 표시
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 엘리먼트 생성

    // 지도 범위에 좌표 추가
    bounds.extend(placePosition);

    // 마커와 리스트 항목에 마우스 이벤트 연결하여 인포윈도우 표시
    (function (marker, title) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, title);
      });
      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };
      itemEl.onmouseout = function () {
        infowindow.close();
      };
    })(marker, places[i].place_name);

    // fragment에 항목 추가
    fragment.appendChild(itemEl);
  }

  // fragment에 담긴 항목들을 리스트에 한 번에 추가
  listEl.appendChild(fragment);

  // 검색결과 목록 스크롤 초기화
  menuEl.scrollTop = 0;

  // 지도 범위를 검색된 장소 범위로 재설정
  map.setBounds(bounds);
}

// 검색 결과 항목 Element 생성 함수
function getListItem(index, places) {
  var el = document.createElement("li"),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      "   <h5>" +
      places.place_name +
      "</h5>";

  // 도로명 주소가 있으면 함께 표시
  if (places.road_address_name) {
    itemStr +=
      "    <span>" +
      places.road_address_name +
      "</span>" +
      '   <span class="jibun gray">' +
      places.address_name +
      "</span>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span>";
  }

  // 전화번호 표시
  itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

  el.innerHTML = itemStr;
  el.className = "item";

  return el;
}

// 마커 생성 및 지도 위에 표시하는 함수
function addMarker(position, idx) {
  var imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 URL (스프라이트)
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 전체 이미지 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 사용할 영역 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표와 이미지 좌표 맞춤
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커 위치
      image: markerImage,
    });

  marker.setMap(map); // 지도에 마커 표시
  markers.push(marker); // 배열에 마커 저장

  return marker;
}

// 지도 위에 표시된 모든 마커 제거 함수
function removeMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // 지도에서 마커 제거
  }
  markers = []; // 배열 초기화
}

// 페이지네이션 표시 함수
function displayPagination(pagination) {
  var paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  // 기존 페이지 번호 모두 제거
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  // 페이지 번호 생성
  for (i = 1; i <= pagination.last; i++) {
    var el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = "on"; // 현재 페이지 강조
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i); // 해당 페이지로 이동
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 인포윈도우에 장소명 표시 함수
function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + "</div>";

  infowindow.setContent(content); // 인포윈도우 내용 설정
  infowindow.open(map, marker); // 인포윈도우 표시
}

// 부모 엘리먼트의 모든 자식 노드 제거 함수
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

// 지도 클릭 이벤트 리스너 추가 (좌표 출력)
kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  var latlng = mouseEvent.latLng;
  var lat = latlng.getLat();
  var lng = latlng.getLng();

  // id가 coords인 요소에 위도, 경도 소수점 6자리까지 출력
  document.getElementById("coords").innerText =
    "위도: " + lat.toFixed(6) + ", 경도: " + lng.toFixed(6);
});
