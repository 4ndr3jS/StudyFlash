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
    const containers = document.querySelectorAll('.container3, .container, .chatContainer, .sideContainer, .quizContainer');
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
    const PercentageEffort = document.getElementById('PercentageEffort');
    const quizQuestion = document.getElementById('quizQuestion');

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
        if(PercentageEffort){
            PercentageEffort.style.color = "#fff";
        }
        if(quizQuestion){
            quizQuestion.style.color = "#fff";
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
            displayQuizFiles();
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
    if (!sideContainer) return;

    sideContainer.innerHTML = `
        <div style="flex: 1;">
            <h3 style="margin: 0; margin-bottom: 20px;">Files List</h3>
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 10px;">Select one file to generate flashcards</p>
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
        fileItem.style.cssText = 'padding: 12px; background: white; border-radius: 8px; margin-bottom: 10px; cursor: pointer;';
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="flashcard-file" class="file-radio" data-index="${index}">
                <div style="flex: 1;">
                    <p style="margin: 0; font-size: 14px; font-weight: 500; color: #1f2937;">${file.name}</p>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; margin-top: 4px;">${formatFileSize(file.size)}</p>
                </div>
            </div>
        `;
        filesList.appendChild(fileItem);
    });
    
    document.querySelector('.generateFlashcardsBtn').addEventListener('click', generateFlashcards);
}

async function generateFlashcardsForSingleFile(content, fileName) {
    const sanitizedContent = content.substring(0, 12000).trim();
    
    const prompt = `You are a flashcard generator. Generate flashcards from the following content.

CRITICAL INSTRUCTIONS:
1. Keep the content in its original script (Cyrillic stays Cyrillic, Latin stays Latin)
2. Generate flashcards in the SAME LANGUAGE as the source content
3. Return ONLY a valid JSON array - no greetings, no explanations, no markdown
4. Your response must start with [ and end with ]
5. Ensure all quotes inside text are properly escaped

Content from ${fileName}:
${sanitizedContent}

Generate 12 flashcards in this exact JSON format:
[{"front":"question","back":"answer"}]`;

    const res = await fetch("https://long-mode-42d3.andrejstanic3.workers.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            message: prompt,
            history: [],
            mode: "flashcard_generation"
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes('Rate limit')) {
            throw new Error('API rate limit reached. Please wait a few seconds and try again.');
        }
        throw new Error(`API request failed: ${res.status}`);
    }

    const data = JSON.parse(await res.text());
    if (data.error) throw new Error(data.error);

    let aiResponse = data.response || "";
    console.log('Raw AI response:', aiResponse.substring(0, 500));

    aiResponse = aiResponse.replace(/\\\\u([0-9a-fA-F]{4})/g, '\\u$1');

    let cleanedResponse = aiResponse.replace(/```json|```/g, "").trim();

    const startIdx = cleanedResponse.indexOf('[');
    const endIdx = cleanedResponse.lastIndexOf(']');
    
    if (startIdx === -1 || endIdx === -1) {
        console.error('No JSON array found in response');
        throw new Error('API response is not valid JSON format');
    }
    
    cleanedResponse = cleanedResponse.substring(startIdx, endIdx + 1);
    console.log('Cleaned response:', cleanedResponse.substring(0, 500));

    try {
        const flashcards = JSON.parse(cleanedResponse);
        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            throw new Error('No flashcards were generated');
        }
        return flashcards;
    } catch (parseError) {
        console.error('First parse failed:', parseError.message);
        
        try {
            let fixedResponse = cleanedResponse;
            
            fixedResponse = fixedResponse.replace(
                /"(front|back)"\s*:\s*"([^"]*(?:[^"\\]"[^"]*)*?)"/g,
                (match, key, value) => {
                    const escapedValue = value.replace(/\\"/g, '##ESCAPED##')
                                              .replace(/"/g, '\\"')
                                              .replace(/##ESCAPED##/g, '\\"');
                    return `"${key}":"${escapedValue}"`;
                }
            );
            
            console.log('Attempting parse with fixed quotes...');
            const flashcards = JSON.parse(fixedResponse);
            if (!Array.isArray(flashcards) || flashcards.length === 0) {
                throw new Error('No flashcards were generated');
            }
            return flashcards;
        } catch (secondError) {
            console.error('Second parse failed:', secondError.message);
            console.error('Problematic JSON:', cleanedResponse);
            
            try {
                const flashcards = [];
                const regex = /"front"\s*:\s*"([^"]+)"\s*,\s*"back"\s*:\s*"([^"]+)"/g;
                let match;
                
                while ((match = regex.exec(cleanedResponse)) !== null) {
                    flashcards.push({
                        front: match[1].replace(/\\"/g, '"'),
                        back: match[2].replace(/\\"/g, '"')
                    });
                }
                
                if (flashcards.length > 0) {
                    console.log('Successfully extracted flashcards using regex');
                    return flashcards;
                }
            } catch (regexError) {
                console.error('Regex extraction failed:', regexError);
            }
            
            throw new Error('Could not parse flashcards from API response. The content may have special characters that need different handling.');
        }
    }
}

async function generateFlashcards() {
    const selectedRadio = document.querySelector('.file-radio:checked');
    if (!selectedRadio) {
        alert('Please select a file to generate flashcards');
        return;
    }

    const selectedFile = uploadedFiles[parseInt(selectedRadio.dataset.index)];
    const fileId = selectedFile.id || selectedFile.name;
    const fileName = selectedFile.name;
    
    const flashcardContainer = document.querySelector('#flashcards .chatContainer');
    
    flashcardContainer.innerHTML = `
        <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <div style="border: 4px solid #f3f4f6; border-top: 4px solid #4f46e5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 20px; color: #6b7280;">Checking for existing flashcards...</p>
            </div>
        </div>
    `;
    
    try {
        const existingFlashcards = await getExistingFlashcards([fileId]);
        
        if (existingFlashcards && existingFlashcards.length > 0) {
            generatedFlashcards = existingFlashcards;
            currentCardIndex = 0;
            displayFlashcardViewer();
            showNotification('✓ Loaded saved flashcards', '#10b981');
            return;
        }
        
        flashcardContainer.innerHTML = `
            <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="border: 4px solid #f3f4f6; border-top: 4px solid #4f46e5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    <p style="margin-top: 20px; color: #6b7280;">Extracting text from file...</p>
                </div>
            </div>
        `;
        
        let content;
        if (selectedFile instanceof File || selectedFile instanceof Blob) {
            content = await readFileContent(selectedFile);
        } else if (selectedFile.fromDatabase && selectedFile.path) {
            content = await downloadFileFromSupabase(selectedFile.path);
        } else {
            throw new Error('Unable to read file');
        }
        
        if (!content || content.trim().length === 0) {
            throw new Error('No text could be extracted from the file');
        }
        
        content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ').trim();
        
        flashcardContainer.innerHTML = `
            <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="border: 4px solid #f3f4f6; border-top: 4px solid #4f46e5; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    <p style="margin-top: 20px; color: #6b7280;">Generating flashcards...</p>
                </div>
            </div>
        `;
        
        generatedFlashcards = await generateFlashcardsForSingleFile(content, fileName);
        
        await saveFlashcardsToSupabase([fileId], [fileName], generatedFlashcards);
        
        currentCardIndex = 0;
        displayFlashcardViewer();
        
    } catch (error) {
        console.error('Error:', error);
        flashcardContainer.innerHTML = `
            <div class="chatBox">
                <p style="text-align: center; color: #ef4444; padding: 20px;">
                    Error: ${error.message}<br><br>
                    Please try again.
                </p>
            </div>
        `;
    }
}

async function readFileContent(file) {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.pdf')) return await extractTextFromPDF(file);
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return await extractTextFromDOCX(file);
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

async function extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (!result.value || result.value.trim().length === 0) {
        throw new Error('No text found in document');
    }
    return result.value.trim();
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n\n';
    }
    
    return fullText;
}

async function downloadFileFromSupabase(filePath) {
    const { data, error } = await supabase.storage.from('documents').download(filePath);
    if (error) throw new Error(`Failed to download file: ${error.message}`);

    const fileName = filePath.toLowerCase();
    
    if (fileName.endsWith('.pdf')) return await extractTextFromPDF(data);
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return await extractTextFromDOCX(data);
    
    const text = await data.text();
    if (!text || text.trim().length === 0) throw new Error('File is empty');
    return text.trim();
}

function displayFlashcardViewer() {
    const flashcardContainer = document.querySelector('#flashcards .chatContainer');

    if (generatedFlashcards.length === 0) {
        flashcardContainer.innerHTML = '<div class="chatBox"><p style="text-align: center; padding: 20px;">No flashcards generated</p></div>';
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
                        <p style="font-size: 18px; line-height: 1.6; color: #1f2937; margin: 0;">${generatedFlashcards[currentCardIndex].front}</p>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">Click to reveal answer</p>
                    </div>
                </div>
                <div class="flashcard-back">
                    <div>
                        <p style="font-size: 16px; line-height: 1.6; color: #1f2937; margin: 0;">${generatedFlashcards[currentCardIndex].back}</p>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">Click to see question</p>
                    </div>
                </div>
            </div>
            <div class="buttons2" style="margin-top: 30px;">
                <button id="prevCard" class="prevCard" ${currentCardIndex === 0 ? 'disabled' : ''}>← Previous</button>
                <button id="nextCard" class="nextCard" ${currentCardIndex === generatedFlashcards.length - 1 ? 'disabled' : ''}>Next →</button>
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
        if (currentCardIndex > 0) {
            currentCardIndex--;
            displayFlashcardViewer();
        }
    });

    document.getElementById('nextCard').addEventListener('click', () => {
        if (currentCardIndex < generatedFlashcards.length - 1) {
            currentCardIndex++;
            displayFlashcardViewer();
        }
    });
}

async function saveFlashcardsToSupabase(fileIds, fileNames, flashcards) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const sortedFileIds = [...fileIds].sort();
        
        const { data: existing } = await supabase.from('flashcard_sets').select('id').eq('user_id', user.id);
        
        let existingSetId = null;
        if (existing && existing.length > 0) {
            for (const set of existing) {
                const { data: setData } = await supabase.from('flashcard_sets').select('file_ids, id').eq('id', set.id).single();
                if (setData && JSON.stringify([...(setData.file_ids || [])].sort()) === JSON.stringify(sortedFileIds)) {
                    existingSetId = setData.id;
                    break;
                }
            }
        }
        
        const result = existingSetId
            ? await supabase.from('flashcard_sets').update({ file_names: fileNames, flashcards, updated_at: new Date().toISOString() }).eq('id', existingSetId).select()
            : await supabase.from('flashcard_sets').insert({ user_id: user.id, file_ids: sortedFileIds, file_names: fileNames, flashcards }).select();

        return !result.error;
    } catch (err) {
        console.error('Save error:', err);
        return false;
    }
}

async function getExistingFlashcards(fileIds) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const sortedFileIds = [...fileIds].sort();
        const { data } = await supabase.from('flashcard_sets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);

        if (data && data.length > 0 && JSON.stringify([...data[0].file_ids].sort()) === JSON.stringify(sortedFileIds)) {
            return data[0].flashcards;
        }
        return null;
    } catch (err) {
        console.error('Get error:', err);
        return null;
    }
}

function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${color}; color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; animation: slideIn 0.3s ease-out;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const style = document.createElement('style');
style.textContent = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    #prevCard:disabled, #nextCard:disabled { opacity: 0.5; cursor: not-allowed; }
    #prevCard:not(:disabled):hover { background: #d1d5db !important; }
    #nextCard:not(:disabled):hover { background: #4338ca !important; }
`;
document.head.appendChild(style);

let generatedQuiz = [];
let currentQuestionIndex = 0;
let userAnswers = [];

function displayQuizFiles() {
    const sideContainer = document.querySelector('#quiz .sideContainer');
    if (!sideContainer) return;

    sideContainer.innerHTML = `
        <div style="flex: 1;">
            <h3 style="margin: 0; margin-bottom: 20px;">Files List</h3>
            <p style="color: #6b7280; font-size: 12px; margin-bottom: 10px;">Select one file to generate quiz</p>
            <div id="quizFilesList"></div>
        </div>
        <div class="buttons2" style="margin-top: auto;">
            <button class="button generateQuizBtn" style="align-items: center; background-color: #9333ea; color: white; width: 100%;">
                <img src="imgs/book.png" height="30" width="30">Generate Quiz
            </button>
        </div>
    `;
    
    const filesList = document.getElementById('quizFilesList');
    
    if (uploadedFiles.length === 0) {
        filesList.innerHTML = '<p style="color: #6b7280; font-size: 14px;">No files uploaded yet</p>';
        return;
    }
    
    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.style.cssText = 'padding: 12px; background: white; border-radius: 8px; margin-bottom: 10px; cursor: pointer;';
        fileItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="quiz-file" class="quiz-file-radio" data-index="${index}">
                <div style="flex: 1;">
                    <p style="margin: 0; font-size: 14px; font-weight: 500; color: #1f2937;">${file.name}</p>
                    <p style="margin: 0; font-size: 12px; color: #6b7280; margin-top: 4px;">${formatFileSize(file.size)}</p>
                </div>
            </div>
        `;
        filesList.appendChild(fileItem);
    });
    
    document.querySelector('.generateQuizBtn').addEventListener('click', generateQuiz);
}

async function generateQuizForSingleFile(content, fileName) {
    const sanitizedContent = content.substring(0, 12000).trim();
    
    const prompt = `You are a quiz generator. Generate quiz questions from the following content.

CRITICAL INSTRUCTIONS:
1. Keep questions in the SAME LANGUAGE as the source content
2. Generate EXACTLY 16 questions
3. Each question should be open-ended (not multiple choice)
4. Return ONLY a valid JSON array - no greetings, no explanations, no markdown
5. Your response must start with [ and end with ]
6. Do NOT include any text before or after the JSON array

Content from ${fileName}:
${sanitizedContent}

Generate exactly 16 quiz questions in this JSON format:
[{"question":"What is...?","correctAnswer":"The answer"}]`;

    const res = await fetch("https://long-mode-42d3.andrejstanic3.workers.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            message: prompt,
            history: [],
            mode: "quiz_generation"
        })
    });

    if (!res.ok) {
        const errorText = await res.text();
        if (errorText.includes('Rate limit')) {
            throw new Error('API rate limit reached. Please wait and try again.');
        }
        throw new Error(`API request failed: ${res.status}`);
    }

    const data = JSON.parse(await res.text());
    if (data.error) throw new Error(data.error);

    let aiResponse = data.response || "";
    console.log('Raw AI response:', aiResponse.substring(0, 500));
    
    aiResponse = aiResponse.replace(/\\\\u([0-9a-fA-F]{4})/g, '\\u$1');
    
    let cleanedResponse = aiResponse.replace(/```json|```/g, "").trim();
    
    const startIdx = cleanedResponse.indexOf('[');
    const endIdx = cleanedResponse.lastIndexOf(']');
    
    if (startIdx === -1 || endIdx === -1) {
        console.error('No JSON array found in response');
        throw new Error('AI did not return valid JSON format. Please try again.');
    }
    
    cleanedResponse = cleanedResponse.substring(startIdx, endIdx + 1);
    console.log('Cleaned response:', cleanedResponse.substring(0, 500));
    
    try {
        const questions = JSON.parse(cleanedResponse);
        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error('No questions were generated');
        }
        
        if (questions.length < 16) {
            throw new Error(`Only ${questions.length} questions generated, need 16`);
        }
        
        return questions.slice(0, 16);
    } catch (parseError) {
        console.error('Parse error:', parseError.message);
        console.error('Problematic JSON:', cleanedResponse.substring(0, 1000));

        try {
            let fixedResponse = cleanedResponse;

            fixedResponse = fixedResponse.replace(
                /"(question|correctAnswer)"\s*:\s*"([^"]*(?:[^"\\]"[^"]*)*?)"/g,
                (match, key, value) => {
                    const escapedValue = value.replace(/\\"/g, '##ESCAPED##')
                                              .replace(/"/g, '\\"')
                                              .replace(/##ESCAPED##/g, '\\"');
                    return `"${key}":"${escapedValue}"`;
                }
            );
            
            console.log('Attempting parse with fixed quotes...');
            const questions = JSON.parse(fixedResponse);
            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('No questions were generated');
            }
            return questions.slice(0, 16);
        } catch (secondError) {
            console.error('Second parse failed:', secondError.message);
            throw new Error('AI response could not be parsed. The AI may not be following instructions. Please try again.');
        }
    }
}

async function generateQuiz() {
    const selectedRadio = document.querySelector('.quiz-file-radio:checked');
    if (!selectedRadio) {
        alert('Please select a file to generate quiz');
        return;
    }

    const selectedFile = uploadedFiles[parseInt(selectedRadio.dataset.index)];
    const fileId = selectedFile.id || selectedFile.name;
    const fileName = selectedFile.name;
    
    const quizContainer = document.querySelector('#quiz .quizContainer');

    quizContainer.innerHTML = `
        <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <div style="border: 4px solid #f3f4f6; border-top: 4px solid #9333ea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 20px; color: #6b7280;">Checking for existing quiz...</p>
            </div>
        </div>
    `;
    
    try {
        const existingQuiz = await getExistingQuiz([fileId]);
        
        if (existingQuiz && existingQuiz.length > 0) {
            generatedQuiz = existingQuiz;
            currentQuestionIndex = 0;
            userAnswers = new Array(16).fill('');
            displayQuizQuestion();
            showNotification('✓ Loaded saved quiz', '#9333ea');
            return;
        }

        quizContainer.innerHTML = `
            <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="border: 4px solid #f3f4f6; border-top: 4px solid #9333ea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    <p style="margin-top: 20px; color: #6b7280;">Extracting text from file...</p>
                </div>
            </div>
        `;
        
        let content;
        if (selectedFile instanceof File || selectedFile instanceof Blob) {
            content = await readFileContent(selectedFile);
        } else if (selectedFile.fromDatabase && selectedFile.path) {
            content = await downloadFileFromSupabase(selectedFile.path);
        } else {
            throw new Error('Unable to read file');
        }
        
        if (!content || content.trim().length === 0) {
            throw new Error('No text could be extracted from the file');
        }
        
        content = content.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ').trim();
        
        quizContainer.innerHTML = `
            <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="border: 4px solid #f3f4f6; border-top: 4px solid #9333ea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    <p style="margin-top: 20px; color: #6b7280;">Generating 16 quiz questions...</p>
                </div>
            </div>
        `;
        
        generatedQuiz = await generateQuizForSingleFile(content, fileName);
        
        await saveQuizToSupabase([fileId], [fileName], generatedQuiz);
        
        currentQuestionIndex = 0;
        userAnswers = new Array(16).fill('');
        displayQuizQuestion();
        
    } catch (error) {
        console.error('Error:', error);
        quizContainer.innerHTML = `
            <div class="chatBox">
                <p style="text-align: center; color: #ef4444; padding: 20px;">
                    Error: ${error.message}<br><br>
                    Please try again.
                </p>
            </div>
        `;
    }
}

function displayQuizQuestion() {
    const quizContainer = document.querySelector('#quiz .quizContainer');
    
    if (generatedQuiz.length === 0) {
        quizContainer.innerHTML = '<div class="chatBox"><p style="text-align: center; padding: 20px;">No quiz generated</p></div>';
        return;
    }

    const question = generatedQuiz[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === 15;

    quizContainer.innerHTML = `
        <div class="chatBox" style="padding: 40px;">
            <div style="margin-bottom: 30px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">Question ${currentQuestionIndex + 1} of 16</p>
                <div style="width: 100%; background: #e5e7eb; height: 8px; border-radius: 4px; margin-top: 10px;">
                    <div style="width: ${((currentQuestionIndex + 1) / 16) * 100}%; background: #9333ea; height: 100%; border-radius: 4px; transition: width 0.3s;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 20px; font-weight: 500; class="quizQuestion" margin: 0 0 20px 0;">${question.question}</h3>
                <textarea 
                    id="quizAnswer" 
                    placeholder="Type your answer here..."
                    style="width: 100%; min-height: 120px; padding: 15px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; font-family: inherit; resize: vertical;"
                >${userAnswers[currentQuestionIndex]}</textarea>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: space-between;">
                <button id="prevQuestion" class="prevCard" ${currentQuestionIndex === 0 ? 'disabled' : ''} style="background: #6b7280;">
                    ← Previous
                </button>
                <button id="nextQuestion" class="nextCard" style="background: ${isLastQuestion ? '#10b981' : '#9333ea'};">
                    ${isLastQuestion ? 'Finish Quiz ✓' : 'Next →'}
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('quizAnswer').addEventListener('input', (e) => {
        userAnswers[currentQuestionIndex] = e.target.value;
    });
    
    document.getElementById('prevQuestion')?.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuizQuestion();
        }
    });
    
    document.getElementById('nextQuestion').addEventListener('click', async () => {
        userAnswers[currentQuestionIndex] = document.getElementById('quizAnswer').value;
        
        if (isLastQuestion) {
            await finishQuiz();
        } else {
            currentQuestionIndex++;
            displayQuizQuestion();
        }
    });
}

async function verifyAnswer(question, correctAnswer, userAnswer) {
    if (!userAnswer || userAnswer.trim().length === 0) {
        return false;
    }

    const normalizedCorrect = correctAnswer.toLowerCase().trim();
    const normalizedUser = userAnswer.toLowerCase().trim();
    
    if (normalizedUser === normalizedCorrect) {
        return true;
    }
    
    if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
        return true;
    }

    const prompt = `You are evaluating a student's answer. Determine if it is correct.

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Is the student's answer correct? Consider:
- The core meaning matches (exact wording not required)
- Key concepts are present
- Minor spelling/grammar errors are acceptable
- Answers in different languages but with same meaning are correct

Respond with ONLY one word: "correct" or "incorrect" - nothing else.`;

    try {
        const res = await fetch("https://long-mode-42d3.andrejstanic3.workers.dev/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                message: prompt,
                history: []
            })
        });

        const data = await res.json();
        const response = (data.response || '').toLowerCase().trim();
        
        console.log(`Question: ${question}`);
        console.log(`Correct: ${correctAnswer}`);
        console.log(`User: ${userAnswer}`);
        console.log(`AI says: ${response}`);
        
        return response.includes('correct') && !response.includes('incorrect');
    } catch (error) {
        console.error('Verification error:', error);
        const correctWords = normalizedCorrect.split(/\s+/);
        const userWords = normalizedUser.split(/\s+/);
        const matchCount = correctWords.filter(word => 
            userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
        ).length;

        return matchCount / correctWords.length > 0.5;
    }
}

async function finishQuiz() {
    const quizContainer = document.querySelector('#quiz .quizContainer');
    
    quizContainer.innerHTML = `
        <div class="chatBox" style="display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <div style="border: 4px solid #f3f4f6; border-top: 4px solid #9333ea; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                <p style="margin-top: 20px; color: #6b7280;">Checking your answers...</p>
            </div>
        </div>
    `;
    
    let correctCount = 0;
    
    for (let i = 0; i < 16; i++) {
        const isCorrect = await verifyAnswer(
            generatedQuiz[i].question,
            generatedQuiz[i].correctAnswer,
            userAnswers[i]
        );
        if (isCorrect) correctCount++;
    }
    
    const percentage = Math.round((correctCount / 16) * 100);
    
    quizContainer.innerHTML = `
        <div class="chatBox" style="display: flex; align-items: center; justify-content: center; min-height: 400px;">
            <div style="text-align: center; max-width: 500px;">
                <div style="width: 120px; height: 120px; border-radius: 50%; background: ${percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'}; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
                    <span style="font-size: 48px; font-weight: bold; color: white;">${percentage}%</span>
                </div>
                
                <h2 id="PercentageEffort" style="font-size: 32px; margin: 0 0 10px 0;">
                    ${percentage >= 70 ? 'Great Job! 🎉' : percentage >= 50 ? 'Good Effort! 👍' : 'Keep Practicing! 📚'}
                </h2>
                
                <p style="font-size: 18px; color: #6b7280; margin: 0 0 30px 0;">
                    You got ${correctCount} out of 16 questions correct
                </p>
                
                <button onclick="resetQuiz()" style="background: #9333ea; color: white; padding: 12px 30px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 500;">
                    Try Again
                </button>
            </div>
        </div>
    `;
}

function resetQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(16).fill('');
    displayQuizQuestion();
}

async function saveQuizToSupabase(fileIds, fileNames, questions) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const sortedFileIds = [...fileIds].sort();
        
        const { data: existing } = await supabase.from('quiz_sets').select('id').eq('user_id', user.id);
        
        let existingSetId = null;
        if (existing && existing.length > 0) {
            for (const set of existing) {
                const { data: setData } = await supabase.from('quiz_sets').select('file_ids, id').eq('id', set.id).single();
                if (setData && JSON.stringify([...(setData.file_ids || [])].sort()) === JSON.stringify(sortedFileIds)) {
                    existingSetId = setData.id;
                    break;
                }
            }
        }
        
        const result = existingSetId
            ? await supabase.from('quiz_sets').update({ file_names: fileNames, questions, updated_at: new Date().toISOString() }).eq('id', existingSetId).select()
            : await supabase.from('quiz_sets').insert({ user_id: user.id, file_ids: sortedFileIds, file_names: fileNames, questions }).select();

        return !result.error;
    } catch (err) {
        console.error('Save quiz error:', err);
        return false;
    }
}

async function getExistingQuiz(fileIds) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const sortedFileIds = [...fileIds].sort();
        const { data } = await supabase.from('quiz_sets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);

        if (data && data.length > 0 && JSON.stringify([...data[0].file_ids].sort()) === JSON.stringify(sortedFileIds)) {
            return data[0].questions;
        }
        return null;
    } catch (err) {
        console.error('Get quiz error:', err);
        return null;
    }
}