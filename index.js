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
    const containers = document.querySelectorAll('.container3, .container, .chatContainer');
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
}

window.addEventListener('DOMContentLoaded', () => {
    initializeUserFiles();
});

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

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

async function askFlashy(message) {
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${window.CONFIG.HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: window.CONFIG.MODEL,
            messages: [
                {
                    role: "system",
                    content: "You are Flashy, a friendly AI study assistant."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        })
    });

    const data = await res.json();

    if(data.choices && data.choices[0]?.message?.content){
        return data.choices[0].message.content;
    } else if(data.error) {
        console.error("HF API Error:", data.error);
        return "Sorry, I couldn't get a response.";
    } else {
        return "Sorry, I couldn't get a response.";
    }
}