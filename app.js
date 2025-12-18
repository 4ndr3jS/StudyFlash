async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email : email,
        password : password,
    })

    if(error){
        console.error('Error signing up: ', error.message);
        return false;
    }

    console.log('User has signed up: ', data);
    return true
}

async function logIn(email, password) {
    const { data, error} = await supabase.auth.signInWithPassword({
        email : email,
        password : password,
    })

    if(error){
        console.error('Error logging in: ', error.message);
        return false;
    }
    console.log('User has logged in: ', data);
    return true;
}

async function logOut() {
    const { error } = await supabase.auth.signOut();

    if(error){
        console.error('Error logging out: ', error.message);
        return false;
    }

    console.log('User has logged out: ');
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