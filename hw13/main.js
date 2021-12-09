// Add your Firebase Project Config here...
const firebaseConfig = {
    apiKey: "AIzaSyD_NKyk9407YX79pWtjUFDbb_Xc_eoikPg",
    authDomain: "ntut-web-3a121.firebaseapp.com",
    projectId: "ntut-web-3a121",
    storageBucket: "ntut-web-3a121.appspot.com",
    messagingSenderId: "844147146054",
    appId: "1:844147146054:web:69873165f8b4d980377947",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const user = db.collection('user');

const tbody = document.querySelector('tbody');

(async () => {
    const userDocList = await user.get();
    userDocList.forEach((userDoc) => {
        const { city, country, gender, name , phone, picture } = userDoc.data();
        const tableRow = `
            <tr>
                <th>
                    <img src="${picture}" class="rounded-circle" style="width: 25px; height: 25px;"></img>
                </th>
                <td>${name}</td>
                <td>${gender}</td>
                <td>${country}</td>
                <td>${city}</td>
                <td>${phone}</td>
            </tr>`;
        tbody.innerHTML = tbody.innerHTML + tableRow;
    })
})();