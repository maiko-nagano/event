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

  document.addEventListener('DOMContentLoaded', () => {
    const events = [
        { id: 1, name: 'ねこまつり', date: '2024-07-20', description: 'ねこを崇めるお祭りです。ねこを飼っている人限定で参加できます。', image: 'images/neko.png', location: '東京' },
        { id: 2, name: 'カエルフェスティバル', date: '2024-07-27', description: '世界中のカエルが一堂に会する楽しいイベントです。カエルの王様に会えるかも？！', image: 'images/kaeru.png', location: '大阪' },
        { id: 3, name: 'とんぼ大会', date: '2024-08-03', description: 'とんぼをどこまで遠く飛ばせるかの競争です。優勝者にはとんぼのメガネが贈られます。', image: 'images/tombo.png', location: '名古屋' }
    ];

    const eventList = document.getElementById('event-list');
    const eventSelect = document.getElementById('event');
    const searchBox = document.getElementById('search-box');
    const modal = document.getElementById('confirmation-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const confirmationDetails = document.getElementById('confirmation-details');
    const confirmButton = document.getElementById('confirm-button');

    function displayEvents(filteredEvents) {
        eventList.innerHTML = '';
        eventSelect.innerHTML = '';

        // デフォルトの「選択してください」オプションを追加
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '選択してください';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        eventSelect.appendChild(defaultOption);

        filteredEvents.forEach(event => {
            // イベントリストに表示
            const eventItem = document.createElement('div');
            eventItem.className = 'event';
            eventItem.innerHTML = `
                <h3>${event.name}</h3>
                <p>${event.date}</p>
                <p>${event.description}</p>
                <p>開催地: ${event.location}</p>
                <img src="${event.image}" alt="${event.name}">
            `;
            eventList.appendChild(eventItem);

            // 申し込みフォームの選択肢に追加
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = event.name;
            eventSelect.appendChild(option);
        });
    }

    // 初期表示
    displayEvents(events);

    // 検索機能
    searchBox.addEventListener('input', () => {
        const searchTerm = searchBox.value.toLowerCase();
        const filteredEvents = events.filter(event => event.location.toLowerCase().includes(searchTerm));
        displayEvents(filteredEvents);
    });

    // フォーム送信時の処理
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedEvent = eventSelect.value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const event = events.find(event => event.id == selectedEvent);

        // 確認画面にデータを表示
        confirmationDetails.innerHTML = `
            <p>イベント: ${event.name}</p>
            <p>開催地: ${event.location}</p>
            <p>日付: ${event.date}</p>
            <p>名前: ${name}</p>
            <p>メールアドレス: ${email}</p>
        `;
        modal.style.display = 'block';

        // 確定ボタンのクリックイベント
        confirmButton.onclick = () => {
            const selectedEvent = events.find(event => event.id == eventSelect.value);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
        
            // Firebaseにデータを保存
            const dbRef = ref(database, 'registrations');
            const newRegistrationRef = push(dbRef);
            set(newRegistrationRef, {
                eventId: selectedEvent.id,
                eventName: selectedEvent.name,
                eventDate: selectedEvent.date,
                eventLocation: selectedEvent.location,
                name: name,
                email: email
            }).then(() => {
                console.log('データが保存されました');
                alert('申し込みが完了しました！');
                modal.style.display = 'none';
                // マイページにリダイレクト
                window.location.href = 'mypage.html';
            }).catch((error) => {
                console.error('データの保存に失敗しました:', error);
                alert('申し込みに失敗しました。もう一度お試しください。');
            });
        };
    });

    // モーダルウィンドウを閉じる
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});

