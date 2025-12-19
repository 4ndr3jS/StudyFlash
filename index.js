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
    const containers = document.querySelectorAll('.container3, .container');
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
    const chatContainer = document.getElementById('chat');

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
        if(chatContainer){
            chatContainer.style.background = '#0206178c'
            chatContainer.style.color = '#fff'
        }
        conatinerBtns.forEach(btn => {
            btn.style.color = '#fff'
            btn.style.background = '#0206178c';
        });
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
    } else {
        containers.forEach(container => {
            container.style.background = '#e9edf4';
        });
        titles.forEach(title => {
            title.style.color = '#1f2937';
        });
        if(chatContainer){
            chatContainer.style.background = '#e6e8eb'
            chatContainer.style.color = '#1f2937'
        }
        if(deleteLabel) {
            deleteLabel.style.color = '#1f2937';
        }
        
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
