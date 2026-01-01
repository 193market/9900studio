import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// ------------------------------------------------------------------
// [보안 설정]
// 깃허브에 API Key가 노출되지 않도록 수동/환경변수 설정으로 변경되었습니다.
// 
// 1. .env 파일을 사용하여 환경변수로 관리하거나 (권장)
// 2. 로컬 테스트 시 아래 빈 따옴표("") 안에 직접 값을 입력하세요.
//    (주의: 값을 입력한 상태로 코드를 커밋/푸시하지 마세요!)
// ------------------------------------------------------------------

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "", 
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL || "", 
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || ""
};

// Config가 입력되었는지 확인
const isConfigured = 
  !!firebaseConfig.apiKey && 
  !!firebaseConfig.databaseURL;

// Firebase 초기화
let app = null;
let db = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    // getDatabase를 호출할 때 app 인스턴스를 명시적으로 전달하여 오류 방지
    db = getDatabase(app);
    console.log("Firebase Database Service Initialized Successfully");
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    // 오류 발생 시 null 상태 유지
    app = null;
    db = null;
  }
}

export { app, db, isConfigured as isFirebaseReady };
