let currentUser = null;

function signIn() {
    const username = document.getElementById('username').value;
    const profilePicInput = document.getElementById('profilePic');
    if (username && profilePicInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser = {
                name: username,
                profilePic: e.target.result
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.location.href = 'home.html';
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        alert("Please enter your name and choose a profile picture.");
    }
}

function logOut() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function goToPost() {
    window.location.href = 'post.html';
}

function cancelPost() {
    window.location.href = 'home.html';
}

function postContent() {
    const postText = document.getElementById('postText').value;
    const postImageInput = document.getElementById('postImage');
    let postImage = null;

    if (postImageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            postImage = e.target.result;
            savePost(postText, postImage);
        };
        reader.readAsDataURL(postImageInput.files[0]);
    } else {
        savePost(postText, postImage);
    }
}

function savePost(text, image) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const newPost = {
        username: currentUser.name,
        profilePic: currentUser.profilePic,
        text: text,
        image: image,
        timestamp: new Date().toLocaleString()
    };
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = 'home.html';
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postsContainer = document.getElementById('posts');

    postsContainer.innerHTML = posts.map(post => `
        <div class="post">
            <div class="post-header">
                <img src="${post.profilePic}" alt="Profile Picture" width="50">
                <strong>${post.username}</strong>
                <span class="timestamp">${post.timestamp}</span>
            </div>
            <p>${post.text}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image">` : ''}
        </div>
    `).join('');
}

window.onload = function() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (window.location.pathname.includes('home.html')) {
        if (!currentUser) {
            window.location.href = 'index.html';
        } else {
            loadPosts();
        }
    } else if (window.location.pathname.includes('post.html')) {
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }
};
