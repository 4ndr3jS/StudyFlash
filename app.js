async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if(error){
        console.error('Error signing up: ', error.message);

        if(error.message.includes('already registered') || 
           error.message.includes('User already registered') ||
           error.message.includes('already been registered')) {
            alert('This email is already registered. Please log in instead.');
        } else {
            alert('Sign up failed: ' + error.message);
        }
        return false;
    }

    if(data.user && data.user.identities && data.user.identities.length === 0) {
        alert('This email is already registered. Please check your email to confirm or try logging in.');
        return false;
    }

    console.log('User has signed up: ', data);
    return true;
}

async function logIn(email, password) {
    const { data, error} = await supabase.auth.signInWithPassword({
        email : email,
        password : password,
    })

    if(error){
        console.error('Error logging in: ', error.message);
        
        if(error.message.includes('Invalid login credentials')) {
            alert('Incorrect email or password. Please try again.');
        } else if(error.message.includes('Email not confirmed')) {
            alert('Please confirm your email before logging in. Check your inbox.');
        } else {
            alert('Log in failed: ' + error.message);
        }
        return false;
    }
    console.log('User has logged in: ', data);
    return true;
}

async function logOut() {
    const { error } = await supabase.auth.signOut();

    if(error){
        console.error('Error logging out: ', error.message);
        alert('Log out failed: ' + error.message);
        return false;
    }

    console.log('User has logged out');
    return true;
}

async function checkUser() {
    const { data : { user }, error } = await supabase.auth.getUser();

    if(user){
        console.log('User is logged in', user);
        return user;
    }
    else{
        console.log('No user logged in');
        return null;
    }
}

async function updateUserName(newName) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if(!user){
        alert("You must be logged in to change your name");
        return false;
    }

    const { data, error } = await supabase.auth.updateUser({
        data: { display_name: newName }
    });

    if(error){
        alert("Failed to update name: " + error.message);
        return false;
    }

    const { error: dbError } = await supabase
        .from('user_names')
        .upsert({ 
            user_id: user.id, 
            name: newName.toLowerCase() 
        });

    if(dbError){
        console.error('Error storing name in database:', dbError);
    }

    console.log('Name updated:', newName);
    return true;
}

async function checkNameExists(name) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if(!user){
        return false;
    }

    const { data, error } = await supabase
        .from('user_names')
        .select('name')
        .eq('name', name.toLowerCase())
        .neq('user_id', user.id);

    if(error){
        console.error('Error checking name:', error);
        return false;
    }

    return data && data.length > 0;
}

async function updateUserPassword(newPassword) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if(!user){
        alert("You must be logged in to change your password");
        return false;
    }

    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if(error){
        alert("Failed to update password: " + error.message);
        return false;
    }

    console.log('Password updated successfully');
    return true;
}

async function deleteUserAccount() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if(!user){
        alert("You must be logged in to delete your account");
        return false;
    }

    const { data, error} = await supabase.rpc('delete_user')

    if(error){
        alert("Account deletion failed " + error.message);
        console.error('Error deleting account:', error);
        return false;
    }

    console.log('Account deleted successfully');
    await supabase.auth.signOut();
    return true;
}