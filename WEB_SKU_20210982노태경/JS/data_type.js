let number = 5;
let str = "문자열입력"; // “ “도묶음가능
letprime = 1.5123;
let is_ok= true; // 참
let is_not= false; // 거짓
letundefi; // 변수이름만, 초기화x
let empty = null; // 비어있음
console.log(undefi,empty); // 여러개출력
const sym1 = Symbol('test'); // 심볼함수로값생성
let symbolVar1 = sym1; // 변수초기화
const airline = ["비행기", 320, "airbus", ["V1", true]];
// 다양한데이터배열
// 빈객체생성
const obj1 = {};
// 속성을추가하여객체생성
const obj2 = {
name: "John Doe",
age: 30,
isMale: true,
};
console.log(symbolVar1.toString()); // 문자열변환출력
console.log(obj1, obj2, airline); // 여러개출력
const users = new Map(); // 사용자정보Map 객체생성
users.set("user1", { // 사용자정보추가
id: 1, password: "password123",
});
users.set("user2", {
id: 2, password: "password456",
});
// Map 객체의모든사용자정보반복출력
for (const [username, user] of users) {
console.log(`사용자이름: ${username}`, `ID: ${user.id}`);
console.log(`비밀번호: ${user.password}`);
}
// Set 객체활용(예), 이름만저장할Set 객체생성
const usernames = new Set();
usernames.add("user1"); // 사용자이름추가
usernames.add("user2");
// Set 객체의모든사용자이름반복출력
for (const username of usernames) {
console.log(`사용자이름: ${username}`);
}