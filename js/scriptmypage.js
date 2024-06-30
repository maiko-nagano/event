// Firebaseの設定情報
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {

  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);


// マイページ
document.addEventListener('DOMContentLoaded', () => {
    const registrationList = document.getElementById('registration-list');
    const cancelModal = document.getElementById('cancel-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const confirmCancel = document.getElementById('confirm-cancel');
    const denyCancel = document.getElementById('deny-cancel');
    let currentRegistrationId = null;

    // Firebaseからデータをリアルタイムに取得
    const dbRef = ref(database, 'registrations');
    onChildAdded(dbRef, (snapshot) => {
        const registration = snapshot.val();
        const registrationItem = document.createElement('div');
        registrationItem.className = 'registration';
        registrationItem.innerHTML = `
            <h3>イベント: ${registration.eventName}</h3>
            <p>開催日: ${registration.eventDate}</p>
            <p>開催地: ${registration.eventLocation}</p>
            <p>名前: ${registration.name}</p>
            <p>メールアドレス: ${registration.email}</p>
            <button class="cancel-button" data-id="${snapshot.key}">キャンセル</button>
        `;
        registrationList.appendChild(registrationItem);
    });

    // キャンセルボタンのクリックイベント
    registrationList.addEventListener('click', (e) => {
        if (e.target.classList.contains('cancel-button')) {
            currentRegistrationId = e.target.getAttribute('data-id');
            cancelModal.style.display = 'block';
        }
    });

    // モーダルウィンドウを閉じる
    closeModal.onclick = () => {
        cancelModal.style.display = 'none';
    };

    denyCancel.onclick = () => {
        cancelModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == cancelModal) {
            cancelModal.style.display = 'none';
        }
    };

    // 確認ボタンのクリックイベント
    confirmCancel.onclick = () => {
        if (currentRegistrationId) {
            const registrationRef = ref(database, `registrations/${currentRegistrationId}`);
            remove(registrationRef).then(() => {
                alert('イベントの申し込みをキャンセルしました。');
                document.querySelector(`button[data-id="${currentRegistrationId}"]`).parentElement.remove();
                cancelModal.style.display = 'none';
            }).catch((error) => {
                console.error('キャンセルに失敗しました:', error);
                alert('キャンセルに失敗しました。もう一度お試しください。');
            });
        }
    };
});

