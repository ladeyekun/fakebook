'use strict';

class User {
    #id;
    #name;
    #userName;
    #email;

    constructor(id, name, userName, email) {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.email = email;
    }

    set id(id) {
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set name(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    set userName(userName) {
        this.#userName = userName;
    }

    get userName() {
        return this.#userName;
    }

    set email(email) {
        this.#email = email;
    }

    get email() {
        return this.#email;
    }

    getInfo() {
        return {
            name: this.name,
            userName: this.userName,
            email: this.email
        }
    }
}

class Subscriber extends User {
    #pages;
    #groups;
    #canMonetize;

    constructor(id, name, userName, email, pages, groups, canMonetize) {
        super(id, name, userName, email);
        this.pages = pages;
        this.groups = groups;
        this.canMonetize = canMonetize;
    }
    set pages(pages) {
        this.#pages = pages;
    }

    get pages() {
        return this.#pages;
    }

    set groups(groups) {
        this.#groups = groups;
    }

    get groups() {
        return this.#groups;
    }

    set canMonetize(value) {
        this.#canMonetize = value;
    }

    get canMonetize() {
        return this.#canMonetize;
    }

    getInfo() {
        return {
            ...super.getInfo(),
            pages: this.pages,
            groups: this.groups,
            canMonetize: this.canMonetize
        }
    }
}

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function selectAll(selector, scope = document) {
    return scope.querySelectorAll(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function create(element, scope = document) {
    return scope.createElement(element);
}

function selectElement(selector, scope = document) {
    return scope.getElementById(selector);
}


const openDialogBtn = select('.profile img');
const profileDialog = select('.dialog-overlay');
const closeDialogBtn = select('.close-btn');
const userNamePl = select('.userName');
const namePl = select('.name');
const emailPl = select('.email');
const pagesPl = select('.pages');
const groupsPl = select('.groups');
const monetizePl = select('.can-monetize');


const fileUploadIcon = select('.upload-icon');
const postImageInput = select('.file-upload');
const postBtn = select('.post-button');
const imageNameDisplay = select('.image-name');
const postForm = select('.post-form');
const postsContainer = select('.posts');
const postTextArea = select('.post-text');
const fileInput = selectElement('file-upload');
const testBtn = select('.text-btn');
let postCounter = 0;

const subscriber = new Subscriber(
    1111,
    'Lateef Adeyekun',
    'lateef.adeyekun',
    'lateef.adeyekun@email.com',
    ['Arsenal FC', 'Roger Federer', 'Lionel Messi'],
    ['Health and Lifestyle', 'Become Pro Developer', 'Vegetarian Lifestyle'],
    true
);


listen('click', fileUploadIcon, () => {
    postImageInput.click();
});

listen('change', postImageInput, (event) => {
    showFile(event.target.files[0]);
});

listen('click', openDialogBtn, () => {
    profileDialog.style.display = 'flex';
});

listen('click', closeDialogBtn, () => {
    profileDialog.style.display = 'none';
});

listen('click', window, (event) => {
    if (event.target === profileDialog) {
        profileDialog.style.display = 'none';
    }
});

listen('click', postBtn, () => {
    const postText = postTextArea.value.trim();
    const selectedImage = postImageInput.files[0];
    makePost(postText, selectedImage);
});

loadDialogContent(subscriber);

function showFile(file) {
    imageNameDisplay.textContent 
        = `Filename: ${file ? file.name : 'No image selected'}`;
}

function makePost(text, image) {
    if (!text && !image) return;

    const post = create('div');
    post.classList.add('post', 'grid', 'gap-20');
    post.setAttribute('data', `post-id-${++postCounter}`);

    getContent(text, image, (htmlContent) => {
        post.innerHTML = htmlContent;
    });

    postsContainer.prepend(post);
    postForm.reset();
    imageNameDisplay.textContent = '';
}

function getContent(text, image, callbackFn) {
    let html = '';
    html += `<div class="post-header flex flex-between">`;
    html += `<div class="post-profile flex">`;
    html += `<div class="grid grid-center">`;
    html += `<img src="./assets/img/profile.jpg">`;
    html += `</div>`; 
    html += `<h3>${subscriber.name}</h3>`;
    html += `</div>`;
    html += `<div class="post-date">`;
    html += `<p>${getPostDate()}</p>`;
    html += `</div>`;
    html += `</div>`;

    if (text) {
        html += `<div class="post-content">`;
        html += `<p>${text}</p>`;
        html += `</div>`;    
    }

    if (image) {
        const reader = new FileReader();
        let base64Image = '';
        reader.onload = function(e) {
            base64Image = e.target.result;
            html += `<div class="post-image">`;
            html += `<img src=${base64Image} alt="Uploaded Image">`;
            html += `</div>`;
            callbackFn(html);
        };
        reader.readAsDataURL(image);
    } else {
        callbackFn(html);
    }
}

function loadDialogContent(subscriber) {
    const data = subscriber.getInfo();
    userNamePl.innerHTML = formatContentData('Username', data.userName);
    namePl.innerHTML = formatContentData('Name', data.name);
    emailPl.innerHTML = formatContentData('Email', data.email);
    pagesPl.innerHTML = formatContentData('Pages', data.pages.join(', '));
    groupsPl.innerHTML = formatContentData('Group', data.groups.join(', '));
    monetizePl.innerHTML = 
        formatContentData('Can Monetize', data.canMonetize ? 'Yes' : 'No');
}

function getPostDate() {
    const now = new Date();

    const options = [
        {month: 'short'},
        {day: 'numeric'},
        {year: 'numeric'}
    ];

    const formattedParts = options.map(option => {
        const formatter = new Intl.DateTimeFormat('en-ca', option);
        return formatter.format(now);
    });
    return `${formattedParts[0]} ${formattedParts[1]}, ${formattedParts[2]}`;
}

function formatContentData(title, value) {
    return `<p><strong>${title}:</strong> ${value}`;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();    
}

