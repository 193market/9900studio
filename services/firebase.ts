import * as firebaseApp from "firebase/app";
import { getDatabase } from "firebase/database";

// ------------------------------------------------------------------
// [자동 동기화 설정 방법]
// 1. https://console.firebase.google.com/ 접속 -> 프로젝트 생성
// 2. 'Realtime Database' 생성 (생성 시 '테스트 모드' 선택)
// 3. 프로젝트 설정(톱니바퀴) -> 일반 -> '내 앱' -> 웹 앱 추가 (</>)
// 4. 복사한 설정값(const firebaseConfig = { ... })을 아래에 덮어씌우거나,
//    각 항목의 따옴표("") 안에 값을 채워 넣으세요.
// ------------------------------------------------------------------

export const firebaseConfig = {
  apiKey: "AIzaSyAgLTrva767_Ix3PAEcmSLjpLHYi2cfgE0",
  authDomain: "studio-7a0c5.firebaseapp.com",
  databaseURL: "https://studio-7a0c5-default-rtdb.firebaseio.com/", // 중요: Realtime Database 주소
  projectId: "studio-7a0c5",
  storageBucket: "studio-7a0c5.firebasestorage.app",
  messagingSenderId: "120611137028",
  appId: "1:120611137028:web:c78f2e77c6e7390a313751"
};

// Config가 입력되었는지 확인
const isConfigured = 
  !!firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes("여기에") &&
  !!firebaseConfig.databaseURL &&
  !firebaseConfig.databaseURL.includes("여기에");

// Firebase 초기화
let app = null;
let db = null;

if (isConfigured) {
  try {
    app = firebaseApp.initializeApp(firebaseConfig);
    // getDatabase를 호출할 때 app 인스턴스를 명시적으로 전달하여 오류 방지
    db = getDatabase(app);
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
}

export { app, db, isConfigured as isFirebaseReady };