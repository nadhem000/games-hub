// Current language - will be overridden by persistent settings
let currentLanguage = 'en';

/* ensure we have two categories of translation objects: 1. general generalTranslationsMap for the shared keys, and 2. GHObjectTranslations objects in each html page (the keys specific to that page) without conflicts. */
// Global translation objects
let GHGeneralTranslations = {};
let GHObjectTranslations = {};

// Available general translations by language
const generalTranslationsMap = {
    en: {
        general: {
            logo: "GH",
            logoAlt: "GameHub Logo",
            title: "GameHub",
            darkMode: "Dark Mode",
            lightMode: "Light Mode",
            notifications: "Notifications",
            version: "Version:",
            developer: "Developer:",
            terms: "Terms of Use",
            privacy: "Privacy Policy",
            homeTooltip: "Return to home page",
            darkModeEnabled: "Dark mode enabled",
            lightModeEnabled: "Light mode enabled",
            languageChanged: "Language changed",
            notificationsEnabled: "Notifications enabled",
            notificationsDisabled: "Notifications disabled",
            success: "Success",
            error: "Error",
            warning: "Warning",
            info: "Information"
        }
    },
    ar: {
        general: {
            logo: "GH",
            logoAlt: "شعار مركز الألعاب",
            title: "مركز الألعاب",
            darkMode: "الوضع الداكن",
            lightMode: "الوضع المضيء",
            notifications: "الإشعارات",
            version: "الإصدار:",
            developer: "المطور:",
            terms: "شروط الاستخدام",
            privacy: "سياسة الخصوصية",
            homeTooltip: "العودة إلى الصفحة الرئيسية",
            darkModeEnabled: "تم تفعيل الوضع الداكن",
            lightModeEnabled: "تم تفعيل الوضع المضيء",
            languageChanged: "تم تغيير اللغة",
            notificationsEnabled: "تم تفعيل الإشعارات",
            notificationsDisabled: "تم إيقاف الإشعارات",
            success: "نجاح",
            error: "خطأ",
            warning: "تحذير",
            info: "معلومات"
        }
    },
    fr: {
        general: {
            logo: "GH",
            logoAlt: "Logo GameHub",
            title: "GameHub",
            darkMode: "Mode Sombre",
            lightMode: "Mode Clair",
            notifications: "Notifications",
            version: "Version:",
            developer: "Développeur:",
            terms: "Conditions d'utilisation",
            privacy: "Politique de confidentialité",
            homeTooltip: "Retour à la page d'accueil",
            darkModeEnabled: "Mode sombre activé",
            lightModeEnabled: "Mode clair activé",
            languageChanged: "Langue changée",
            notificationsEnabled: "Notifications activées",
            notificationsDisabled: "Notifications désactivées",
            success: "Succès",
            error: "Erreur",
            warning: "Avertissement",
            info: "Information"
        }
    }
};

// Function to get all translations for current language
function getTranslations() {
    const general = GHGeneralTranslations || {};
    // Access window.GHObjectTranslations to ensure we get the latest value
    const object = (window.GHObjectTranslations && window.GHObjectTranslations[currentLanguage]) || {};
    
    // Deep merge to avoid conflicts
    return deepMerge({}, general, object);
}

// Deep merge function to properly combine translation objects
function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    
    return deepMerge(target, ...sources);
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

// Function to load general translations
function loadGeneralTranslations() {
    return new Promise((resolve) => {
        GHGeneralTranslations = generalTranslationsMap[currentLanguage] || generalTranslationsMap.en;
        resolve();
    });
}

// Function to update title attributes
function updateTitleAttributes() {
    const elements = document.querySelectorAll('[data-i18n-title]');
    const translations = getTranslations();
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const [namespace, category, subKey] = key.split('.');
        
        if (namespace === 'GH' && translations[category] && translations[category][subKey]) {
            element.setAttribute('title', translations[category][subKey]);
        }
    });
}

// Function to update all translations
function updateTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    const translations = getTranslations();
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const [namespace, category, subKey] = key.split('.');
        
        if (namespace === 'GH' && translations[category] && translations[category][subKey]) {
            element.textContent = translations[category][subKey];
        }
    });
    
    // Update title attributes
    updateTitleAttributes();
    
    // Update HTML direction for RTL languages
    if (currentLanguage === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
    
    // Update language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    // Dispatch event for other components to know translations were updated
    document.dispatchEvent(new CustomEvent('translationsUpdated'));
}

// Set initial language based on stored preference or browser preference
// Set initial language based on stored preference or browser preference
function detectBrowserLanguage() {
    // First check if we have stored settings
    const storedSettings = localStorage.getItem('GH-settings');
    if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        if (settings.language) {
            currentLanguage = settings.language;
            window.currentLanguage = currentLanguage;
            return;
        }
    }
    
    // Fall back to browser detection
    const browserLang = navigator.language || navigator.userLanguage;
    const supportedLangs = ['en', 'ar', 'fr'];
    const primaryLang = browserLang.split('-')[0];
    
    if (supportedLangs.includes(primaryLang)) {
        currentLanguage = primaryLang;
        window.currentLanguage = currentLanguage;
    }
}

// Function to change language
// Function to change language
async function changeLanguage(lang) {
    currentLanguage = lang;
    window.currentLanguage = currentLanguage;
    await loadGeneralTranslations();
    updateTranslations();
}

// Initialize translations when page loads
document.addEventListener('DOMContentLoaded', async function() {
    detectBrowserLanguage();
    await loadGeneralTranslations();
    
    // Ensure object translations are available
    if (window.GHObjectTranslations) {
        // If we need to do any additional processing with object translations
    }
    
    updateTranslations();
});

// Make functions globally available
window.changeLanguage = changeLanguage;
window.getTranslations = getTranslations;
