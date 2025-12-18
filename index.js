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

// Function to initialize a searchable dropdown
function initSearchableDropdown(inputSelector, menuSelector) {
    const searchInput = document.querySelector(inputSelector);
    const dropdownMenu = document.querySelector(menuSelector);
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

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

// Initialize both dropdowns
initSearchableDropdown('#searchInputFont', '#dropdownMenu');
initSearchableDropdown('#searchInputColors', '#dropdownMenuColors');

// Global click handler to close all dropdowns
document.addEventListener('click', (e) => {
    if(!e.target.closest('.search-dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});