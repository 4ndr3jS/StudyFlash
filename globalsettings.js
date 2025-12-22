function applyFont(fontName) {
    document.body.style.fontFamily = fontName;
}

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

    let accentColor;
    switch (colorName) {
        case 'Blue':
            accentColor = '#12296f';
            break;
        case 'Yellow':
            accentColor = '#f5c542';
            break;
        case 'Red':
            accentColor = '#d32f2f';
            break;
        case 'Green':
            accentColor = '#2e7d32';
            break;
        default:
            accentColor = '#12296f';
    }

    localStorage.setItem('accent', accentColor);
    document.documentElement.style.setProperty('--accent-bg', accentColor);
    document.documentElement.style.setProperty('--accent-hover', accentColor);

    applyAccentToElements(accentColor);
    
    addAccentHoverStyles(accentColor);
}

function applyAccentToElements(accentColor) {
    const isDark = localStorage.getItem('darkMode') !== 'false';
    
    const settingsInputs = [
        document.getElementById('nameChange'),
        document.getElementById('passwordChange'),
        document.getElementById('searchInputFont'),
        document.getElementById('searchInputColors')
    ];
    
    settingsInputs.forEach(el => {
        if (el) {
            el.style.backgroundColor = isDark ? accentColor : '#e6e8eb';
            el.style.color = isDark ? '#ffffff' : '#1f2937';
            el.style.border = isDark ? 'none' : '1px solid #aaaaaa';
        }
    });

    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        if (isDark) {
            item.style.backgroundColor = accentColor;
            item.style.color = '#ffffff';
        } else {
            item.style.backgroundColor = '#ffffff';
            item.style.color = '#1f2937';
        }
    });

    const quickActions = document.querySelectorAll('.quick-action');
    quickActions.forEach(action => {
        if (isDark) {
            action.style.backgroundColor = accentColor;
            action.style.borderColor = accentColor;
            action.style.color = '#ffffff';
        } else {
            action.style.backgroundColor = '#ffffff';
            action.style.borderColor = '#e5e7eb';
            action.style.color = '#1f2937';
        }
    });

    const chatInput = document.querySelector('.chatInput');
    const send = document.getElementById('send');
    if (chatInput) {
        if (isDark) {
            chatInput.style.border = 'none';
            chatInput.style.background = accentColor;
            send.style.background = accentColor;
        } else {
            chatInput.style.borderColor = '#d1d5db';
        }
    }
    const containerBtns = document.querySelectorAll('.containerBtn');
    containerBtns.forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.style.color = isDark ? '#fff' : '#1f2937';
            btn.style.backgroundColor = isDark ? '#0206178c' : '#e6e8eb';
        }
    });

    const activeBtn = document.querySelector('.containerBtn.active');
    if (activeBtn) {
        if (isDark) {
            activeBtn.style.backgroundColor = accentColor;
            activeBtn.style.color = '#ffffff';
        } else {
            activeBtn.style.backgroundColor = accentColor;
            activeBtn.style.color = '#ffffff';
        }
    }

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const specialContainer = document.getElementById('specialContainer');
    const studyGoalInput = document.getElementById('studyGoalInput');
    const currentGoalDisplay = document.getElementById('currentGoalDisplay');
    dropdownItems.forEach(item => {
        if (isDark) {
            item.style.backgroundColor = accentColor;
            item.style.color = '#ffffff';
            specialContainer.style.backgroundColor = accentColor
            currentGoalDisplay.style.backgroundColor = accentColor
            studyGoalInput.style.backgroundColor = accentColor
            
        } else {
            item.style.backgroundColor = '#e6e8eb';
            item.style.color = '#1f2937';
        }
    });
}

function applyDarkMode(isDark) {
    const containers = document.querySelectorAll('.container3, .container, .chatContainer, .sideContainer, .quizContainer, .welcome-section, .cards');
    const aboutSection = document.querySelector('.about');
    const titles = document.querySelectorAll('.title2, .welcome-title, .name2, .titlechart');
    const titles1 = document.querySelectorAll('.title');
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
    const session = document.getElementById('specialContainer');
    const sessionT = document.querySelectorAll('.sessionT');
    const studyGoalInput = document.getElementById('studyGoalInput');
    const currentGoalDisplay = document.getElementById('currentGoalDisplay');
    const progressValue = document.getElementById('progressValue');
    const progressBar = document.getElementById('progressBar');
    const welcomeQuote = document.getElementById('dailyQuote');
    const streak = document.querySelector('.streak-badge');
    const liveTimer = document.querySelectorAll('.stat');

    if(isDark) {
        containers.forEach(container => {
            container.style.background = '#0206178c';
            container.style.color = '#ffffff';
        });
        if(aboutSection){
            aboutSection.style.backgroundColor = '#0206178c';
            aboutSection.style.color = '#ffffff';
            const aboutH2 = aboutSection.querySelector('h2');
            if(aboutH2) aboutH2.style.color = '#fff';
        }
        sessionT.forEach(st => st.style.color = "#fff");
        if(studyGoalInput){
            studyGoalInput.style.background = "#13286f";
            studyGoalInput.style.color = '#fff';
        }
        titles.forEach(title => title.style.color = '#fff');
        conatinerBtns.forEach(btn => {
            if(!btn.classList.contains('active')) {
                btn.style.color = '#fff';
                btn.style.background = '#0206178c';
            }
        });
        if(listF) listF.style.color = '#fff';
        liveTimer.forEach(lt => lt.style.color = '#fff');
        if(streak) streak.style.color = '#fff';
        if(progressValue) progressValue.style.color = '#fff';
        if(welcomeQuote) welcomeQuote.style.color = '#fff';
        if(progressBar) progressBar.style.background = '#fff';
        if(PercentageEffort) PercentageEffort.style.color = "#fff";
        if(session) session.style.background = '#4842b4';
        if(passwordChange) passwordChange.style.color = '#fff';
        if(currentGoalDisplay){
            currentGoalDisplay.style.background = '#13286f';
            currentGoalDisplay.style.color = '#fff';
        }
        if(quizQuestion) quizQuestion.style.color = "#fff";
        if(button){
            button.style.background = '#4f46e5';
            button.style.color = '#fff';
        }
        if(button2){
            button2.style.background = '#9333ea';
            button2.style.color = '#fff';
        }
        Ps.forEach(P => P.style.color = '#fff');
        titles1.forEach(title => title.style.color = '#fff');
        descs.forEach(desc => desc.style.color = '#fff');
        labels.forEach(label => label.style.color = '#fff');
        descriptions.forEach(desc => desc.style.color = '#fff');
        names.forEach(name => name.style.color = '#fff');
        
        const accent = localStorage.getItem('accent') || '#12296f';
        [nameChange, passwordChange, searchInputFont, searchInputColors, ...dropdownItems].forEach(el => {
            if (el) {
                el.style.backgroundColor = accent;
                el.style.color = '#ffffff';
                el.style.border = 'none';
            }
        });
        if(dropdownMenu) dropdownMenu.style.backgroundColor = '#12296f';
        if(chatP) chatP.style.color = '#c7c6c4';
        uploadPs.forEach(p => p.style.color = '#c7c6c4');
        if(uploadMainText) uploadMainText.style.color = '#dfe3e9';
    } else {
        containers.forEach(container => {
            container.style.background = '#e9edf4';
        });
        if(streak) streak.style.color = '#000';
        if(welcomeQuote) welcomeQuote.style.color = '#000';
        if(currentGoalDisplay){
            currentGoalDisplay.style.background = '#e6e8eb';
            currentGoalDisplay.style.color = '#000';
        }
        liveTimer.forEach(lt => lt.style.color = '#000');
        if(studyGoalInput){
            studyGoalInput.style.background = "#e6e8eb";
            studyGoalInput.style.border = '1px solid #aaaaaa';
            studyGoalInput.style.color = '#000';
        }
        sessionT.forEach(st => st.style.color = "#1f2937");
        if(progressBar) progressBar.style.background = '#878787';
        if(progressValue) progressValue.style.color = '#000';
        titles.forEach(title => title.style.color = '#1f2937');
        if(deleteLabel) deleteLabel.style.color = '#1f2937';
        if(chatP) chatP.style.color = '#c7c6c4';
        if(listF) listF.style.color = '#1f2937';
        if(session) session.style.background = '#e6e8eb';
        uploadPs.forEach(p => p.style.color = '#c7c6c4');
        labels.forEach(label => {
            if(label.id !== 'deleteLabel') label.style.color = '#1f2937';
        });
        conatinerBtns.forEach(btn => {
            if(!btn.classList.contains('active')) {
                btn.style.color = '#1f2937';
                btn.style.background = '#e6e8eb';
            }
        });
        descriptions.forEach(desc => desc.style.color = '#4b5563');
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
            passwordChange.style.color = '#000';
            passwordChange.style.border = '1px solid #aaaaaa';
        }
        if(searchInputFont) {
            searchInputFont.style.backgroundColor = '#e6e8eb';
            searchInputFont.style.border = '1px solid #aaaaaa';
            searchInputFont.style.color = '#1f2937';
        }
        if(dropdownMenu) dropdownMenu.style.backgroundColor = '#e6e8eb';
        if(searchInputColors){
            searchInputColors.style.backgroundColor = "#e6e8eb";
            searchInputColors.style.color = "#1f2937";
            searchInputColors.style.border = '1px solid #aaaaaa';
        }
    }

    const savedColor = localStorage.getItem('color') || 'Blue';
    const accent = localStorage.getItem('accent') || '#12296f';
    applyAccentToElements(accent);
}

function loadGlobalSettings() {
    const savedFont = localStorage.getItem('font');
    if (savedFont) {
        applyFont(savedFont);
    }

    const savedColor = localStorage.getItem('color');
    if (savedColor) {
        applyColor(savedColor);
    }

    const isDarkMode = localStorage.getItem('darkMode') !== 'false';
    applyDarkMode(isDarkMode);

    const accent = localStorage.getItem('accent') || '#12296f';
    addAccentHoverStyles(accent);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('containerBtn')) {
                    const accent = localStorage.getItem('accent') || '#12296f';
                    if (target.classList.contains('active')) {
                        target.style.backgroundColor = accent + ' !important';
                        target.style.color = '#ffffff';
                    } else {
                        const isDark = localStorage.getItem('darkMode') !== 'false';
                        target.style.backgroundColor = isDark ? '#0206178c' : '#e6e8eb';
                        target.style.color = isDark ? '#fff' : '#1f2937';
                    }
                }
            }
        });
    });

    document.querySelectorAll('.containerBtn').forEach(btn => {
        observer.observe(btn, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

function addAccentHoverStyles(accentColor) {
    const existingStyle = document.getElementById('accent-hover-styles');
    if (existingStyle) {
        existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = 'accent-hover-styles';
    style.textContent = `
        .containerBtn.active {
            background-color: ${accentColor} !important;
            color: #ffffff !important;
        }
        .active{
            border-bottom: 3px solid ${accentColor};
        }
        .containerBtn.active:hover {
            background-color: ${accentColor} !important;
            opacity: 0.9;
        }
        .containerBtn:hover {
            background-color: ${accentColor} !important;
            opacity: 0.9;
        }
        .quick-action:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

loadGlobalSettings();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGlobalSettings);
} else {
    loadGlobalSettings();
}