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

const todo = db.collection('todoList');

const titleInput = document.querySelector('#createTodoTitle');
const colorSelect = document.querySelector('#createTodoColor');
const creatTodoButton = document.querySelector('button');
const todoList = document.querySelector('#listGroup');

async function addTodo(event) {
    event.preventDefault();
    
    const title = titleInput.value;
    const color = colorSelect.value;
    
    await todo.add({
        title,
        color
    });

    window.location.reload(); 
}

creatTodoButton.addEventListener('click', addTodo);

async function renderTodo() {
    const todoDocs = await todo.get();
    todoDocs.forEach((todoDoc) => {
        const { title, color } = todoDoc.data();
        const todoItem = `
            <li class="list-group-item">
                <span class="box bg-${color}"></span>
                ${title}
            </li> 
        `;
        todoList.innerHTML = todoList.innerHTML + todoItem;
    });
}

renderTodo();