function check(){
    const signlog  = document.querySelector('.signlog');
    if(!signlog){
        return;
    }
    signlog.addEventListener('click', () => {
        document.getElementById('authModal').style.display = 'block';
    });
}

function check2(){
    const authM = document.getElementById('authModal')
    if(!authM){
        return;
    }
    authM.addEventListener('click', (e) => {
        if(e.target.id === 'authModal'){
            closeModal();
        }
    });
}

function closeModal(){
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
}

async function handleSignUp() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if(!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    const success = await signUp(email, password);
    
    if(success){
        alert('Sign up successful! Check your email to confirm your account.');
        closeModal();
    }
}

async function handleLogIn() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    
    const success = await logIn(email, password);

    if(success){
        closeModal();
        checkAuth();
    }
}

async function handleNameChange(){
    const newName = document.getElementById('nameChange').value.trim();
    const nameExist = await checkNameExists(newName);
    if(nameExist){
        alert("This name already exists, please choose a different one.");
        return;
    }

    if(!newName){
        alert("Enter new a name");
    }

    const success = await updateUserName(newName);
    if(success){
        checkAuth();
    }
}

async function handlePasswordChange(){
    const newPassword = document.getElementById('passwordChange').value.trim();
    
    if(!newPassword){
        alert("Enter a new password");
        return;
    }

    if(newPassword.length < 6){
        alert("Password must be at least 6 characters long");
        return;
    }

    const confirmed = confirm("Are you sure you want to change your password?");
    if(!confirmed){
        return;
    }

    const success = await updateUserPassword(newPassword);
    if(success){
        alert('Password updated successfully!');
        document.getElementById('passwordChange').value = '';
    }
}

async function handleDeleteAccount(){
    const confirmed = confirm("Are you sure you want to delete your account? This action CANNOT be undone!");
    if(!confirmed){
        return;
    }

    const doubleConfirm = confirm("This will permanently delete all your data. Are you absolutely sure?");
    if(!doubleConfirm){
        return;
    }

    const success = await deleteUserAccount();
    if(success){
        alert('Your account has been deleted.');
        window.location.href = 'index.html';
    }
}

async function checkAuth() {
    const user = await checkUser();
    const signlogButton = document.querySelector('.signlog');
    const welcomeText = document.querySelector('.wlcm');
    const settings = document.getElementById('settings');
    const logoutButton = document.getElementById('logout');
    const nameInput = document.getElementById('nameChange');
    
    if(user && user.email){
        if(signlogButton){
            signlogButton.style.display = 'none';
        }
        
        const userName = user.user_metadata?.display_name || user.email.split('@')[0];
        
        if(welcomeText){
            welcomeText.textContent = `Welcome, ${userName}!`;
            welcomeText.style.display = 'block';
        }
        
        if(settings){
            settings.style.display = 'inline-block';
        }
        
        if(nameInput){
            nameInput.value = userName;
        }
        
        if(logoutButton){
            logoutButton.style.display = 'block';
            logoutButton.textContent = 'Log Out';
            
            logoutButton.onclick = async () => {
                await logOut();
                location.reload();
            }
        }
    } else {
        if(welcomeText){
            welcomeText.style.display = 'none';
        }
        if(signlogButton){
            signlogButton.style.display = 'block';
        }
        if(logoutButton){
            logoutButton.style.display = 'none';
        }
        if(settings){
            settings.style.display = 'none';
        }
        if(nameInput){
            nameInput.value = '';
        }
    }
}

checkAuth();
check();
check2();

function initSearchableDropdown(inputSelector, menuSelector) {
    const searchInput = document.querySelector(inputSelector);
    const dropdownMenu = document.querySelector(menuSelector);

    if(!dropdownMenu){
        return;
    }
    
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

    if(dropdownItems.length === 0){
        return;
    }
    searchInput.addEventListener('focus', () => {
        dropdownMenu.classList.add('show');
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        dropdownItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if(text.includes(searchTerm)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        if(!dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.add('show');
        }
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            searchInput.value = item.textContent;
            dropdownMenu.classList.remove('show');
            const selectedValue = item.getAttribute('data-value');
            console.log('Selected:', selectedValue);
        });
    });

    searchInput.addEventListener('keydown', (e) => {
        const visibleItems = Array.from(dropdownItems).filter(item => 
            !item.classList.contains('hidden')
        );
        if(e.key === 'Enter' && visibleItems.length > 0) {
            visibleItems[0].click();
        }
    });
}

initSearchableDropdown('#searchInputFont', '#dropdownMenu');
initSearchableDropdown('#searchInputColors', '#dropdownMenuColors');

document.addEventListener('click', (e) => {
    if(!e.target.closest('.search-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

document.addEventListener('click', (e) => {
    if(!e.target.closest('.search-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

function initDarkMode() {
    const modeToggle = document.getElementById('modetoggle');
    if(!modeToggle) return;

    const isDarkMode = localStorage.getItem('darkMode') !== 'false';
    modeToggle.checked = isDarkMode;
    applyDarkMode(isDarkMode);

    modeToggle.addEventListener('change', (e) => {
        const darkModeEnabled = e.target.checked;
        localStorage.setItem('darkMode', darkModeEnabled);
        applyDarkMode(darkModeEnabled);
    });
}

function initFont(){
    const fontInput = document.getElementById('searchInputFont');
    if(!fontInput) return;

    const savedFont = localStorage.getItem('font');
    if(savedFont) {
        setTimeout(() => {
            fontInput.value = savedFont;
        }, 0);
        applyFont(savedFont);
    }

    const dropdownItems = document.querySelectorAll('#dropdownMenu .dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedFont = item.getAttribute('data-value');
            localStorage.setItem('font', selectedFont);
            applyFont(selectedFont);
        });
    });
}

initSearchableDropdown('#searchInputFont', '#dropdownMenu');
initFont();
function applyFont(fontName) {
    document.body.style.fontFamily = fontName;
}

function initAccentColor(){
    const colorInput = document.getElementById('searchInputColors');
    if(!colorInput){
        return;
    }

    const savedColor = localStorage.getItem('color');
    if(savedColor) {
        setTimeout(() => {
            colorInput.value = savedColor;
        }, 0);
        applyColor(savedColor);
    }

    const dropdownItems = document.querySelectorAll('#dropdownMenuColors .dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const selectedColor = item.getAttribute('data-value');
            localStorage.setItem('color', selectedColor);
            applyColor(selectedColor);
        });
    });
}

initSearchableDropdown('#searchInputFont', '#dropdownMenu');
initAccentColor();
function applyColor(colorName) {
    const colors = {
        Blue: {
            top: 'rgb(24, 52, 145)',
            bottom: 'rgb(10, 23, 59)'
        },
        Red: {
            top: 'rgb(145, 24, 24)',
            bottom: 'rgb(59, 10, 10)'
        },
        Yellow: {
            top: 'rgb(145, 132, 24)',
            bottom: 'rgb(59, 52, 10)'
        },
        Green: {
            top: 'rgb(24, 145, 58)',
            bottom: 'rgb(10, 59, 23)'
        }
    };

    const selectedColor = colors[colorName] || colors.Blue;

    document.documentElement.style.background = `radial-gradient(
        circle at center top,
        ${selectedColor.top},
        ${selectedColor.bottom} 70%
    )`;

    document.body.style.background = `radial-gradient(
        circle at center top,
        ${selectedColor.top},
        ${selectedColor.bottom} 70%
    )`;

    switch (colorName) {
        case 'Blue':
            setAccent('#12296f');
            break;

        case 'Yellow':
            setAccent('#f5c542');
            break;

        case 'Red':
            setAccent('#d32f2f');
            break;

        case 'Green':
            setAccent('#2e7d32');
            break;
    }
}

function setAccent(color) {
    localStorage.setItem('accent', color);
    document.documentElement.style.setProperty('--accent-bg', color);
    document.documentElement.style.setProperty('--accent-hover', color);

    const elements = [
        document.getElementById('nameChange'),
        document.getElementById('searchInputColors'),
        document.getElementById('passwordChange'),
        document.getElementById('searchInputFont')
    ];

    elements.forEach(el => {
        if (el) {
            el.style.backgroundColor = color;
            el.style.color = '#ffffff';
            el.style.border = 'none';
        }
    });
}

function applyAccentToElements(elements) {
    const accent = localStorage.getItem('accent') || '#12296f';
    
    elements.forEach(el => {
        if (!el) return;

        el.style.backgroundColor = accent;
        el.style.color = '#ffffff';
        el.style.border = `1px solid ${accent}`;
        el.style.outline = 'none';
    });

    
}


function applyDarkMode(isDark) {
    const containers = document.querySelectorAll('.container3, .container, .chatContainer, .sideContainer');
    const aboutSection = document.querySelector('.about');
    const titles = document.querySelectorAll('.title2');
    const titles1 = document.querySelectorAll('.title')
    const labels = document.querySelectorAll('.container3 label');
    const descriptions = document.querySelectorAll('.container3 .description');
    const nameChange = document.getElementById('nameChange');
    const passwordChange = document.getElementById('passwordChange');
    const deleteLabel = document.getElementById('deleteLabel');
    const searchInputFont = document.getElementById('searchInputFont');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const searchInputColors = document.getElementById('searchInputColors');
    const Ps = document.querySelectorAll('p');
    const descs = document.querySelectorAll('.description');
    const names = document.querySelectorAll('.name');
    const items = document.querySelectorAll('.item');
    const conatinerBtns = document.querySelectorAll('.containerBtn');
    const chatP = document.getElementById('chatP');
    const uploadPs = document.querySelectorAll('#upload p');
    const uploadMainText = document.getElementById('uploadMainText');
    const button = document.querySelector('.button');
    const button2 = document.querySelector('.button2');
    const listF = document.getElementById('listF');

    if(isDark) {
        containers.forEach(container => {
            container.style.background = '#0206178c';
            container.style.color = '#ffffff';
        });
        if(aboutSection){
            aboutSection.style.backgroundColor = '#0206178c';
            aboutSection.style.color = '#ffffff'

            const aboutH2 = aboutSection.querySelector('h2');
            if(aboutH2){
                aboutH2.style.color = '#fff'
            }
        }
        titles.forEach(title => {
            title.style.color = '#fff'
        });
        conatinerBtns.forEach(btn => {
            btn.style.color = '#fff'
            btn.style.background = '#0206178c';
        });
        if(listF){
            listF.style.color = '#fff';
        }
        if(button){
            button.style.background = '#4f46e5';
            button.style.color = '#fff';
        }
        if(button2){
            button2.style.background = '#9333ea';
            button2.style.color = '#fff';
        }
        Ps.forEach(P => {
            P.style.color = '#fff';
        });
        titles1.forEach(title => {
            title.style.color = '#fff';
        });
        descs.forEach(desc => {
            desc.style.color = '#fff';
        })
        labels.forEach(label => {
            label.style.color = '#fff';
        });
        descriptions.forEach(desc => {
            desc.style.color = '#fff';
        });
        names.forEach(name => {
            name.style.color = '#fff';
        });
        items.forEach(item =>{
            item.style.backgroundColor = '#0E1A4F';
        });
        applyAccentToElements([
            nameChange,
            passwordChange,
            searchInputFont,
            searchInputColors,
            ...dropdownItems
        ]);
        if(dropdownMenu) {
            dropdownMenu.style.backgroundColor = '#12296f';
        }
        if(chatP) {
            chatP.style.color = '#c7c6c4';
        }
        uploadPs.forEach(p => {
            p.style.color = '#c7c6c4';
        });
        if(uploadMainText) {
            uploadMainText.style.color = '#dfe3e9';
        }
    } else {
        containers.forEach(container => {
            container.style.background = '#e9edf4';
        });
        titles.forEach(title => {
            title.style.color = '#1f2937';
        });
        if(deleteLabel) {
            deleteLabel.style.color = '#1f2937';
        }
        if(chatP) {
            chatP.style.color = '#c7c6c4';
        }
        if(listF){
            listF.style.color = '#1f2937';
        }
        uploadPs.forEach(p => {
            p.style.color = '#c7c6c4';
        });
        labels.forEach(label => {
            if(label.id !== 'deleteLabel') {
                label.style.color = '#1f2937';
            }
        });
        conatinerBtns.forEach(btn => {
            btn.style.color = '#1f2937'
            btn.style.background = '#e6e8eb';
        });
        descriptions.forEach(desc => {
            desc.style.color = '#4b5563';
        });
        dropdownItems.forEach(item => {
            item.style.color = '#1f2937';
            item.style.backgroundColor = '#e6e8eb';
            item.classList.remove('dark-mode');
        });
        if(nameChange) {
            nameChange.style.backgroundColor = '#e6e8eb';
            nameChange.style.color = '#1f2937';
            nameChange.style.border = '1px solid #aaaaaa';
        }
        if(passwordChange) {
            passwordChange.style.backgroundColor = '#e6e8eb';
            passwordChange.style.color = '#1f2937';
            passwordChange.style.border = '1px solid #aaaaaa';
        }
        if(searchInputFont) {
            searchInputFont.style.backgroundColor = '#e6e8eb';
            searchInputFont.style.border = '1px solid #aaaaaa';
            searchInputFont.style.color = '#1f2937';
        }
        if(dropdownMenu) {
            dropdownMenu.style.backgroundColor = '#e6e8eb';
        }
        if(searchInputColors){
            searchInputColors.style.backgroundColor = "#e6e8eb";
            searchInputColors.style.color = "#1f2937";
            searchInputColors.style.border = '1px solid #aaaaaa';
        }
    }
}

initDarkMode();

document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') !== 'false';
    applyDarkMode(isDarkMode);
    document.body.classList.add('dark-mode');
});

const tabs = document.querySelectorAll('.containerBtn');

const tabContentMap ={
    "Chat" : 'chat',
    "Upload" : 'upload',
    "Flashcards" : 'flashcards',
    "Quiz" : 'quiz'
};

function hideAllContents(){
    for(let key in tabContentMap){
        const content = document.getElementById(tabContentMap[key]);
        if(content){
            content.style.display = 'none';
        }
    }
}

function deactivateAllTabs(){
    tabs.forEach(tab => tab.classList.remove('active'));
}

tabs.forEach( tab => {
    tab.addEventListener('click',() => {
        deactivateAllTabs();
        hideAllContents();
        tab.classList.add('active');

        const contentId = tabContentMap[tab.textContent];
        const content = document.getElementById(contentId);
        if(content){
            content.style.display = 'block';
            displayFlashcardFiles();
        }
    });
});

hideAllContents();
document.getElementById('chat').style.display = 'block';
tabs[0].classList.add('active');


const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const uploadedFilesContainer = document.getElementById('uploadedFilesContainer');
const filesList = document.getElementById('filesList');
let uploadedFiles = [];

uploadBox.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

let loadedFromDatabase = false;

async function initializeUserFiles() {
    const files = await loadUserFiles();
    
    if (files && files.length > 0) {
        uploadedFiles = [];
        
        files.forEach(fileRecord => {
            uploadedFiles.push({
                name: fileRecord.file_name,
                size: fileRecord.file_size,
                type: fileRecord.file_type,
                path: fileRecord.file_path,
                id: fileRecord.id,
                fromDatabase: true
            });
        });
        
        loadedFromDatabase = true;
        displayUploadedFiles();
    }
}

async function handleFiles(files){
    const allowedFiles = ['.pdf', '.txt', '.doc', '.docx'];
    for(let file of files){
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if(allowedFiles.includes(ext)){
            uploadedFiles.push(file);
            await uploadToSupabase(file);
        }
    }
    displayUploadedFiles();
    displayFlashcardFiles()
}

window.addEventListener('DOMContentLoaded', () => {
    initializeUserFiles();
});

function displayUploadedFiles(){
    if(uploadedFiles.length === 0){
        uploadedFilesContainer.style.display = 'none';
        return;
    }
    uploadedFilesContainer.style.display = 'block';
    filesList.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'uploadedFileItem';
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <div class="img" style="display: flex; align-self: center; padding-left: 8px; padding-right: 8px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="36">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M8 12H16V14H8V12M8 16H16V18H8V16Z" 
                            fill="#645de8"/>
                    </svg>
                </div>
                <div class="itemDisplay">
                    <h3 class="nameFile">
                        ${index + 1}. ${file.name}
                    </h3>
                    <h5 class="fileSize">
                        ${formatFileSize(file.size)}
                    </h5>
                </div>
            </div>
            <div class="remove" onclick="removeFile(${index})">
                <img src="imgs/remove.png" heigth=12 width=12>
            </div>
        `;
        filesList.appendChild(fileItem);
    });
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'btns';
    buttonsDiv.style.cssText = 'justify-self: center; justify-content: space-between; margin-top: 26px; width: 80%; display: flex;';
    buttonsDiv.innerHTML = `
        <div class="buttons2">
            <button class="button flashcardsBtn" style="align-items: center; background-color: #4f46e5; color: white;"><img src="imgs/brain.png" height="30" width="30">Generate Flashcards</button>
        </div>
        <div class="buttons2">
            <button class="button2 quizBtn" style="background-color: #9333ea; color: white;"><img src="imgs/book.png" height="30" width="30">Generate Quiz</button>
        </div>
    `;
    filesList.appendChild(buttonsDiv);

    const flashcardsBtn = buttonsDiv.querySelector('.flashcardsBtn');
    const quizBtn = buttonsDiv.querySelector('.quizBtn');
    
    flashcardsBtn.addEventListener('click', switchTab);
    quizBtn.addEventListener('click', switchTab2);
}

async function removeFile(index){
    const file = uploadedFiles[index];
    if (file.fromDatabase || file.path) {
        try {
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([file.path]);
            
            if (storageError) {
                console.error('Error deleting from storage:', storageError);
            }

            if (file.id) {
                const { error: dbError } = await supabase
                    .from('uploaded_files')
                    .delete()
                    .eq('id', file.id);
                
                if (dbError) {
                    console.error('Error deleting from database:', dbError);
                }
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    }
    uploadedFiles.splice(index, 1);
    displayUploadedFiles();
}

function switchTab(){
    hideAllContents();
    deactivateAllTabs();
    document.getElementById('flashcards').style.display = 'block';
    tabs[2].classList.add('active');
    displayFlashcardFiles();
}

function switchTab2(){
    hideAllContents();
    deactivateAllTabs();
    document.getElementById('quiz').style.display = 'block';
    tabs[3].classList.add('active');
}

const chatInput = document.querySelector(".chatInput");
const sendBtn = document.getElementById("send");
const chatBox = document.querySelector(".chatBox");
const chatIntro = document.getElementById("chatP");


let conversationHistory = [];

async function askFlashy(message) {
    try {
        conversationHistory.push({
            role: 'user',
            content: message
        });

        const res = await fetch("https://long-mode-42d3.andrejstanic3.workers.dev/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                history: conversationHistory
            })
        });

        const textResponse = await res.text();
        console.log("Raw response:", textResponse);

        const data = JSON.parse(textResponse);

        if(data.error) {
            console.error("API Error:", data.error);
            return "Sorry, I couldn't get a response. Error: " + data.error;
        }

        conversationHistory.push({
            role: 'assistant',
            content: data.response
        });

        if(conversationHistory.length > 20) {
            conversationHistory = conversationHistory.slice(-20);
        }

        return data.response || "Sorry, I couldn't get a response.";
        
    } catch(error) {
        console.error("Fetch error:", error);
        return "Sorry, there was a network error: " + error.message;
    }
}

function formatMessage(text) {
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    const intro = document.querySelector('.intro');
    if (!message){
        return;
    }
    if(chatIntro) {
        chatIntro.style.display = "none";
    }
    if(intro) {
        intro.style.display = "none";
    }

    const userDiv = document.createElement("p");
    userDiv.textContent = message;
    userDiv.classList.add("userMessage");
    chatBox.appendChild(userDiv);

    chatInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    const typingDiv = document.createElement("p");
    typingDiv.textContent = "Flashy is typing";
    typingDiv.classList.add("botMessage", "typing");
    chatBox.appendChild(typingDiv);

    let dots = 0;
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        typingDiv.textContent = "Flashy is typing" + ".".repeat(dots);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    const botReply = await askFlashy(message);

    clearInterval(interval);
    typingDiv.innerHTML = "Flashy: " + formatMessage(botReply);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter") sendMessage();
});

const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let generatedFlashcards = [];
let currentCardIndex = 0;

function displayFlashcardFiles() {
    const sideContainer = document.querySelector('#flashcards .sideContainer');
    
    if (!sideContainer){
        return;
    }

    sideContainer.innerHTML = `
        <div style="flex: 1;">
            <h3 style="margin: 0; margin-bottom: 20px;">Files List</h3>
            <div id="flashcardFilesList"></div>
        </div>
        <div class="buttons2" style="margin-top: auto;">
            <button class="button generateFlashcardsBtn" style="align-items: center; background-color: #4f46e5; color: white; width: 100%;">
                <img src="imgs/brain.png" height="30" width="30">Generate Flashcards
            </button>
        </div>
    `;
    
    const filesList = document.getElementById('flashcardFilesList');
    
    if (uploadedFiles.length === 0) {
        filesList.innerHTML = '<p style="color: #6b7280; font-size: 14px;">No files uploaded yet</p>';
        return;
    }
    
    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.style.cssText = 'padding: 12px; background: white; border-radius: 8px; margin-bottom: 10px; cursor: pointer; border: 2px solid transparent; transition: border 0.2s;';
        fileItem.className = 'flashcard-file-item';
        
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" class="file-checkbox" data-index="${index}">
                <div style="flex: 1;">
                    <p style="margin: 0; font-size: 14px; font-weight: 500; color: #1f2937;">${file.name}</p>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; margin-top: 4px;">${formatFileSize(file.size)}</p>
                </div>
            </div>
        `;
        
        filesList.appendChild(fileItem);
    });
    
    const generateBtn = sideContainer.querySelector('.generateFlashcardsBtn');
    generateBtn.addEventListener('click', generateFlashcards);
}

async function generateFlashcards() {
    const checkboxes = document.querySelectorAll('.file-checkbox:checked');
    
    if (checkboxes.length === 0) {
        alert('Please select at least one file to generate flashcards');
        return;
    }

    const selectedFiles = Array.from(checkboxes).map(cb => uploadedFiles[parseInt(cb.dataset.index)]);
    
    console.log('Selected files:', selectedFiles);

    const flashcardContainer = document.querySelector('#flashcards .chatContainer');
    flashcardContainer.innerHTML = `
        <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <div style="border: 4px solid #f3f4f6; border-top: 4px solid #4f46e5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 20px; color: #6b7280;">Generating flashcards...</p>
            </div>
        </div>
    `;
    
    try {
        let combinedContent = '';
        for (const file of selectedFiles) {
            console.log('Reading file:', file);
            
            let content;
            
            if (file instanceof File || file instanceof Blob) {
                content = await readFileContent(file);
            } else if (file.fromDatabase && file.path) {
                content = await downloadFileFromSupabase(file.path);
            } else {
                throw new Error(`Unable to read file: ${file.name || 'unknown'}`);
            }
            
            combinedContent += `\n\n--- Content from ${file.name} ---\n\n${content}`;
        }
        
        const prompt = `TASK: Generate flashcards as JSON array ONLY.

        CRITICAL INSTRUCTIONS:
        - Convert any input text written in Cyrillic to Latin script.
        - Generate flashcards in the SAME LANGUAGE as the source content
        - DO NOT greet me. DO NOT explain. DO NOT add any text before or after the JSON.
        - Your ENTIRE response must be ONLY valid JSON array starting with [ and ending with ].

        Content to create flashcards from:
        ${combinedContent.substring(0, 12000)}

        FORMAT (respond with ONLY this, nothing else):
        [{"front":"question","back":"answer"},{"front":"question","back":"answer"}]

        Generate 8-12 flashcards now:`;

        const res = await fetch("https://long-mode-42d3.andrejstanic3.workers.dev/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                history: [],
                mode: "flashcard_generation"
            })
        });

        const textResponse = await res.text();
        console.log("Raw response:", textResponse);

        const data = JSON.parse(textResponse);

        if (data.error) {
            throw new Error(data.error);
        }

        const aiResponse = data.response || "";

        const cleanedResponse = aiResponse.replace(/```json|```/g, "").trim();
        generatedFlashcards = JSON.parse(cleanedResponse);
        currentCardIndex = 0;

        displayFlashcardViewer();
        
    } catch (error) {
        console.error('Error generating flashcards:', error);
        flashcardContainer.innerHTML = `
            <div class="chatBox">
                <p style="text-align: center; color: #ef4444; padding: 20px;">
                    Error generating flashcards: ${error.message}<br>
                    Please try again.
                </p>
            </div>
        `;
    }
}

async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
        }
        
        return fullText;
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
}

async function downloadFileFromSupabase(filePath) {
    try {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(filePath);
        
        if (error) {
            console.error('Error downloading file:', error);
            throw new Error(`Failed to download file: ${error.message}`);
        }

        if (filePath.toLowerCase().endsWith('.pdf')) {
            return await extractTextFromPDF(data);
        }

        const text = await data.text();
        return text;
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
}

function displayFlashcardViewer(){
    const flashcardContainer = document.querySelector('#flashcards .chatContainer');

    if(generatedFlashcards.length === 0){
        flashcardContainer.innerHTML = `
            <div class="chatBox">
                <p style="text-align: center; padding: 20px;">No flashcards generated</p>
            </div>
        `;
        return;
    }

    flashcardContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; padding: 40px; width: 100%;">
            <div style="margin-bottom: 20px; color: #6b7280; font-size: 14px;">
                Card ${currentCardIndex + 1} of ${generatedFlashcards.length}
            </div>
            
            <div class="flashcard" id="flashcard">
                <div class="flashcard-front">
                    <div>
                        <p style="font-size: 18px; line-height: 1.6; color: #1f2937; margin: 0;">
                            ${generatedFlashcards[currentCardIndex].front}
                        </p>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">Click to reveal answer</p>
                    </div>
                </div>
                
                <div class="flashcard-back">
                    <div>
                        <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0;">
                            ${generatedFlashcards[currentCardIndex].back}
                        </p>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">Click to see question</p>
                    </div>
                </div>
            </div>
            
            <div class="buttons2" style="margin-top: 30px;">
                <button id="prevCard" class="prevCard" ${currentCardIndex === 0 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <button id="nextCard" class="nextCard" ${currentCardIndex === generatedFlashcards.length - 1 ? 'disabled' : ''}>
                    Next →
                </button>
            </div>
        </div>
    `;
    
    const flashcard = document.getElementById('flashcard');
    let isFlipped = false;

    flashcard.addEventListener('click', () => {
        isFlipped = !isFlipped;
        flashcard.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    });

    document.getElementById('prevCard').addEventListener('click', () => {
        if(currentCardIndex > 0){
            currentCardIndex--;
            displayFlashcardViewer();
        }
    });

    document.getElementById('nextCard').addEventListener('click', () => {
        if(currentCardIndex < generatedFlashcards.length - 1){
            currentCardIndex++;
            displayFlashcardViewer();
        }
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #prevCard:disabled, #nextCard:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    #prevCard:not(:disabled):hover {
        background: #d1d5db !important;
    }

    #nextCard:not(:disabled):hover {
        background: #4338ca !important;
    }
`;
document.head.appendChild(style);