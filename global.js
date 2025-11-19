// Global persistent settings management
class GHSettingsManager {
    constructor() {
        this.settings = {
            theme: 'light',
            language: 'en',
            notifications: true
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.applyStoredSettings();
        this.setupEventListeners();
    }

    loadSettings() {
        const stored = localStorage.getItem('GH-settings');
        if (stored) {
            this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
    }

    saveSettings() {
        localStorage.setItem('GH-settings', JSON.stringify(this.settings));
    }

    applyStoredSettings() {
        // Apply theme
        this.applyTheme(this.settings.theme);
        
        // Apply language
        if (this.settings.language !== currentLanguage) {
            window.changeLanguage(this.settings.language);
        }

        // Apply notification preference (can be extended later)
        this.updateNotificationUI();
    }

    applyTheme(theme) {
        const body = document.body;
        const modeToggle = document.getElementById('modeToggle');
        
        if (theme === 'dark') {
            body.classList.replace('GH-light-mode', 'GH-dark-mode');
            if (modeToggle) {
                const modeIcon = modeToggle.querySelector('.GH-icon');
                if (modeIcon) modeIcon.textContent = '☀️';
                this.updateThemeTooltip();
            }
        } else {
            body.classList.replace('GH-dark-mode', 'GH-light-mode');
            if (modeToggle) {
                const modeIcon = modeToggle.querySelector('.GH-icon');
                if (modeIcon) modeIcon.textContent = '🌙';
                this.updateThemeTooltip();
            }
        }
        this.settings.theme = theme;
        this.saveSettings();
    }

    updateThemeTooltip() {
        const modeToggle = document.getElementById('modeToggle');
        if (!modeToggle) return;
        
        const translations = window.getTranslations ? window.getTranslations() : {};
        const isDarkMode = document.body.classList.contains('GH-dark-mode');
        
        if (translations.general) {
            modeToggle.setAttribute('title', 
                isDarkMode ? translations.general.lightMode : translations.general.darkMode
            );
        }
    }

    updateNotificationUI() {
        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            // You can add visual indicators for notification state here
            // For now, we just store the preference
        }
    }

    setupEventListeners() {
        // Theme toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#modeToggle')) {
                this.toggleTheme();
            }
        });

        // Language change
        document.addEventListener('change', (e) => {
            if (e.target.id === 'languageSelect') {
                this.changeLanguage(e.target.value);
            }
        });

        // Notification toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#notificationToggle')) {
                this.toggleNotifications();
            }
        });

        // Update theme tooltip when translations change
        document.addEventListener('DOMContentLoaded', () => {
            // Listen for custom event when translations are updated
            document.addEventListener('translationsUpdated', () => {
                this.updateThemeTooltip();
            });
        });
    }

     toggleTheme() {
        const newTheme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Show toast notification with translatable message
        const messageKey = newTheme === 'dark' ? 
            'general.darkModeEnabled' : 
            'general.lightModeEnabled';
        this.showTranslatableToast(messageKey, 'success');
    }

    changeLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        
        if (window.changeLanguage) {
            window.changeLanguage(lang);
        }
        
        // Show toast notification with translatable message
        this.showTranslatableToast('general.languageChanged', 'info');
    }

    toggleNotifications() {
        this.settings.notifications = !this.settings.notifications;
        this.saveSettings();
        
        // Show toast notification with translatable message
        const messageKey = this.settings.notifications ? 
            'general.notificationsEnabled' : 
            'general.notificationsDisabled';
        
        this.showTranslatableToast(messageKey, 'info');
        this.updateNotificationUI();
    }
    // Helper method to show toast with translatable messages
showTranslatableToast(messageKey, type = 'info') {
    const translations = window.getTranslations ? window.getTranslations() : {};
    
    // Remove 'GH.' prefix if present and split the key
    const cleanKey = messageKey.replace(/^GH\./, '');
    const keys = cleanKey.split('.');
    
    let message = keys.reduce((obj, key) => {
        return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, translations);
    
    // Fallback to key if translation not found
    if (!message || typeof message !== 'string') {
        console.warn(`Translation not found for key: ${messageKey}`);
        message = this.getFallbackMessage(cleanKey);
    }
    
    showGlobalToast(message, type);
}

// Fallback messages in case translations are not found
getFallbackMessage(key) {
    const fallbackMessages = {
        'general.darkModeEnabled': 'Dark mode enabled',
        'general.lightModeEnabled': 'Light mode enabled',
        'general.languageChanged': 'Language changed',
        'general.notificationsEnabled': 'Notifications enabled',
        'general.notificationsDisabled': 'Notifications disabled'
    };
    
    return fallbackMessages[key] || key;
}

    // Get current settings
    getSettings() {
        return { ...this.settings };
    }

    // Update specific setting
    updateSetting(key, value) {
        if (this.settings.hasOwnProperty(key)) {
            this.settings[key] = value;
            this.saveSettings();
            
            // Apply the change immediately if it's theme or language
            if (key === 'theme') {
                this.applyTheme(value);
            } else if (key === 'language') {
                this.changeLanguage(value);
            }
        }
    }
}

// Global toast notification function
function showGlobalToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('GH-global-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'GH-global-toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `GH-global-toast GH-toast-${type}`;
    toast.style.cssText = `
        padding: 12px 20px;
        border-radius: var(--gh-radius-md);
        color: white;
        font-weight: 500;
        box-shadow: var(--gh-shadow-lg);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        cursor: pointer;
        backdrop-filter: blur(10px);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            toast.style.backgroundColor = 'var(--gh-success)';
            break;
        case 'error':
            toast.style.backgroundColor = 'var(--gh-accent)';
            break;
        case 'warning':
            toast.style.backgroundColor = 'var(--game-warning)';
            toast.style.color = 'var(--gh-dark-text)';
            break;
        default:
            toast.style.backgroundColor = 'var(--gh-primary)';
    }
    
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        hideToast(toast);
    }, 3000);
    
    // Also allow manual dismissal by clicking
    toast.addEventListener('click', () => {
        hideToast(toast);
    });
    
    function hideToast(toastElement) {
        toastElement.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 300);
    }
}

// Initialize global settings manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.GHSettings = new GHSettingsManager();
});

// Make settings manager and toast function available globally
window.GHSettingsManager = GHSettingsManager;
window.showGlobalToast = showGlobalToast;
