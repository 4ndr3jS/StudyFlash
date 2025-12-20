var supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

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