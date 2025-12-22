var supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

async function saveStudyGoal() {
    const studyGoalInput = document.getElementById('studyGoalInput');
    
    // Check if element exists
    if (!studyGoalInput) {
        console.error('Study goal input not found');
        return;
    }
    
    const studyTime = parseInt(studyGoalInput.value);
    
    if (!studyTime || studyTime < 1) {
        alert('Please input a valid goal time (minimum 1 hour)');
        return;
    }
    
    const saveBtn = document.getElementById('saveGoalBtn');
    if (!saveBtn) {
        console.error('Save button not found');
        return;
    }
    
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            alert('You must be signed in to save study goals');
            return;
        }

        const { data, error } = await supabase
            .from('study_goals')
            .upsert({
                user_id: user.id,
                hours_per_day: studyTime,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            })
            .select();
        
        if (error) {
            throw error;
        }
        
        alert('Study goal saved successfully!');
        displayCurrentGoal(studyTime); // Fixed: was "studytime" (lowercase)
        
    } catch (err) {
        console.error('Error saving goal:', err);
        alert("Failed to save goal: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
}

async function loadStudyGoal() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            console.log('No user logged in, skipping goal load');
            return;
        }
        
        const { data, error } = await supabase
            .from('study_goals')
            .select('hours_per_day')
            .eq('user_id', user.id)
            .maybeSingle(); // Changed from .single() to .maybeSingle()
        
        if (error) {
            console.error('Error loading goal:', error);
            return;
        }
        
        if (data && data.hours_per_day) {
            const input = document.getElementById('studyGoalInput');
            if (input) {
                input.value = data.hours_per_day;
            }
            displayCurrentGoal(data.hours_per_day);
        }
        
    } catch (err) {
        console.error("Error loading goal:", err);
    }
}

function displayCurrentGoal(hours) {
    const currentGoalDiv = document.getElementById('currentGoalDisplay');
    if (currentGoalDiv) {
        currentGoalDiv.textContent = `Current goal: ${hours} hours/day`;
        currentGoalDiv.style.display = 'block';
    }
}

// Only run this code if we're on the settings page
if (window.location.pathname.includes('settings.html')) {
    window.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for elements to be ready
        setTimeout(() => {
            loadStudyGoal();
            
            // Attach event listener only if button exists
            const saveBtn = document.getElementById('saveGoalBtn');
            if (saveBtn) {
                saveBtn.onclick = saveStudyGoal;
            }
        }, 100);
    });
}

async function uploadToSupabase(file) {
    try {
        const sanitizedName = file.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9._-]/g, '_');
        
        const fileName = `${Date.now()}_${sanitizedName}`;
        
        console.log('Original filename:', file.name);
        console.log('Sanitized filename:', fileName);
        
        const { data, error } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

        if (error) {
            console.error('Supabase error details:', error);
            alert('Failed to upload: ' + file.name + '\nError: ' + error.message);
            return null;
        }

        console.log('File uploaded successfully:', data);
        
        await saveFileMetadata(fileName, file);
        
        return data;
    } catch (err) {
        console.error('Upload error:', err);
        alert('Upload failed: ' + err.message);
        return null;
    }
}

async function saveFileMetadata(fileName, file) {

    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
        .from('uploaded_files')
        .insert([
            {
                file_name: file.name,
                file_path: fileName,
                file_size: file.size,
                file_type: file.type,
                user_id: user?.id,
                uploaded_at: new Date().toISOString()
            }
        ]);

    if (error) {
        console.error('Error saving metadata:', error);
    } else {
        console.log('Metadata saved:', data);
    }
}

async function loadUserFiles() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            console.log('No user logged in');
            return [];
        }

        const { data, error } = await supabase
            .from('uploaded_files')
            .select('*')
            .eq('user_id', user.id)
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('Error loading files:', error);
            return [];
        }

        return data;
    } catch (err) {
        console.error('Load files error:', err);
        return [];
    }
}

function getFileUrl(filePath) {
    const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
    
    return data.publicUrl;
}

