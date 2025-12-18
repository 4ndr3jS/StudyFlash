document.querySelector('.signlog').addEventListener('click', () => {
    document.getElementById('authModal').style.display = 'block';
});

document.getElementById('authModal').addEventListener('click', (e) => {
    if(e.target.id === 'authModal'){
        closeModal();
    }
});

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

    const loginAttempt = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if(loginAttempt.data && loginAttempt.data.user && loginAttempt.data.session) {
        alert('You already have an account! Logging you in...');
        closeModal();
        checkAuth();
        return;
    }

    if(loginAttempt.error) {
        if(loginAttempt.error.message.includes('Invalid login credentials') || 
           loginAttempt.error.message.includes('Email not confirmed')) {
            alert('An account with this email already exists. Please use the Log In button with the correct password.');
            return;
        }
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

async function checkAuth() {
    const user = await checkUser();
    const signlogButton = document.querySelector('.signlog');
    const welcomeText = document.querySelector('.wlcm');
    
    if(user && user.email){
        signlogButton.style.display = 'none';
        
        const userName = user.email.split('@')[0];
        welcomeText.textContent = `Welcome, ${userName}!`;
        welcomeText.style.display = 'block';
        
        const logoutButton = document.getElementById('logout');
        logoutButton.style.display = 'block';
        logoutButton.textContent = 'Log Out';
        
        logoutButton.onclick = async () => {
            await logOut();
            location.reload();
        }
    } else {
        welcomeText.style.display = 'none';
        signlogButton.style.display = 'block';
        document.getElementById('logout').style.display = 'none';
    }
}

checkAuth();
checkAuth();