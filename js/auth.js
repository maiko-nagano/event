// Firebaseの設定情報
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {

  };
  
// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

$(document).ready(() => {
  // サインアップの独自関数
  function signUpUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("サインアップ成功:", userCredential);
        location.href = "index.html";
      })
      .catch((error) => {
        console.error('新規登録に失敗しました:', error);
        alert('新規登録に失敗しました。もう一度お試しください。');
      });
  }

  // 新規登録（サインアップ）ボタンを押したら
  $('#signup-button').on('click', (e) => {
    e.preventDefault();
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
    signUpUser(email, password);
  });

  // ログイン処理を担当する独自関数
  function loginUser(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("ログイン成功:", userCredential);
        location.href = "index.html";
      })
      .catch((error) => {
        console.error('ログインに失敗しました:', error);
        alert('ログインに失敗しました。もう一度お試しください。');
      });
  }

  // ログインボタンを押したときの処理
  $('#login-button').on('click', (e) => {
    e.preventDefault();
    const email = $('#login-email').val();
    const password = $('#login-password').val();
    loginUser(email, password);
  });

  // ログアウト処理する独自関数
  function logoutUser() {
    signOut(auth)
      .then(() => {
        console.log('ログアウト成功');
        location.href = "signuplogin.html";
      })
      .catch((error) => {
        console.error('ログアウトに失敗しました:', error);
        alert('ログアウトに失敗しました。もう一度お試しください。');
      });
  }

  // ログアウトボタン押したら
  $('#logout-button').on('click', (e) => {
    e.preventDefault();
    logoutUser();
  });
});