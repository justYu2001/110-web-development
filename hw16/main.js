// Your web app's Firebase configuration
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

const filmReview = db.collection('filmReview');


const ratyOptions = {
    starHalf: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-half.png",
    starOff: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-off.png",
    starOn: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-on.png"
}

$('#rating').raty({ ...ratyOptions });

const reviewTable = $('table');

async function addReview(event) {
    event.preventDefault();
    
    const title = $('.form-group input').val();
    const score = $('#rating').data('raty').score();
    
    await filmReview.add({
        title,
        score,
    });

    window.location.reload(); 
}

$('.form-group button').on('click', addReview);

function updateScore(score) {
    filmReview.doc(this.id).update({
        score,
    });
}

async function render() {
    const filmReviewDocs = await filmReview.get();
    filmReviewDocs.forEach((filmReviewDoc) => {
        const { title, score } = filmReviewDoc.data();
        const review = `
            <tr>
                <td>${title}</td>
                <td><div id="${filmReviewDoc.id}"></div></td>
            </tr>
        `;
        reviewTable.append(review);
        $(`#${filmReviewDoc.id}`).raty({
            ...ratyOptions,
            score,
            click: updateScore,
        });
    });
}

render();