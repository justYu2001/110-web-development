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
const storageRef = firebase.storage().ref();

const images = db.collection('images');

const $createPostForm = $("#createPostForm");
const $createPostTitle = $("#createPostTitle");
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $galleryPostList = $("#galleryPostList");

// Binding change event for createPostImage
$createPostImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `galleryImages/${fileName}`;
    const ref = firebase.storage().ref(storagePath);
    // Upload file to firebase storage
    console.log(`Start Upload image to: ${storagePath}`);
    $createPostImageURL.text(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL
            ref.getDownloadURL()
                .then(imageURL => {
                    console.log("imageURL", imageURL);
                    $createPostImageURL.text(`Image URL: ${imageURL}`);
                    const previewImgTag = `<img src="${imageURL}">`;
                    $imagePreview.append(previewImgTag);
                    $createPostBtn.attr('disabled', false);
                })
                .catch(err => {
                    $createPostImageURL.text(`Error: ${err}`);
                    console.log(err)
                });
        })
        .catch(err => {
            $createPostImageURL.text(`Error: ${err}`);
            console.log(err)
        });
});

$createPostBtn.on('click', async (event) => {
    event.preventDefault();

    const title = $createPostTitle.val();
    const url = $createPostImageURL.text().split(': ')[1];
    console.log(url);

    await images.add({
        title,
        url
    });

    window.location.reload();

});

async function render() {
    const todoDocs = await images.get();
    todoDocs.forEach((ImageDoc) => {
        const { title, url } = ImageDoc.data();
        const imageCard = `
            <div class="card" style="width: 18rem; margin: 10px">
                <img class="card-img-top" src="${url}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                </div>
            </div>
        `;
        $galleryPostList.append(imageCard);
    });
}

render();