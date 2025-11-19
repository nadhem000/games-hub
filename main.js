// PWA Installation and Service Worker Management
class GHPWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = document.getElementById('installButton');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.registerServiceWorker();
        this.checkInstallability();
    }

    setupEventListeners() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show the install button
            this.showInstallButton();
        });

        // Handle install button click
        if (this.installButton) {
            this.installButton.addEventListener('click', () => {
                this.installApp();
            });
        }

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            // Hide the install button
            this.hideInstallButton();
            // Clear the deferredPrompt
            this.deferredPrompt = null;
            // Show success message
            this.showInstallSuccess();
        });

        // Check if the app is already installed
        window.addEventListener('load', () => {
            if (this.isAppInstalled()) {
                this.hideInstallButton();
            }
        });
    }

    showInstallButton() {
        if (this.installButton) {
            this.installButton.classList.remove('hidden');
            this.updateInstallButtonText();
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.classList.add('hidden');
        }
    }

    updateInstallButtonText() {
        if (this.installButton) {
            const translations = window.getTranslations ? window.getTranslations() : {};
            const installText = translations.general?.install || 'Install';
            this.installButton.querySelector('span:last-child').textContent = installText;
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferredPrompt
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                console.log('Service Worker registered successfully:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('New service worker found:', newWorker);
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, show update notification
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    checkInstallability() {
        // Check if the app meets PWA installation criteria
        const isInstallable = this.deferredPrompt !== null || this.isAppInstalled();
        
        if (!isInstallable) {
            // Check if the app meets the PWA criteria
            this.checkPWARequirements();
        }
    }

    checkPWARequirements() {
        // Check for required PWA features
        const hasServiceWorker = 'serviceWorker' in navigator;
        const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
        const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        
        if (hasServiceWorker && hasManifest && isHTTPS) {
            // App meets PWA criteria, might be installable
            console.log('App meets PWA installation criteria');
        }
    }

    showInstallSuccess() {
        const translations = window.getTranslations ? window.getTranslations() : {};
        const message = translations.general?.appInstalled || 'App installed successfully!';
        showGlobalToast(message, 'success');
    }

    showUpdateNotification() {
        const translations = window.getTranslations ? window.getTranslations() : {};
        const message = translations.general?.updateAvailable || 'New version available! Refresh to update.';
        
        const updateToast = showGlobalToast(message, 'info');
        
        // Add refresh action to the toast
        updateToast.style.cursor = 'pointer';
        updateToast.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// Additional PWA-related utilities
class GHPWAUtils {
    static async getStorageEstimate() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                return {
                    used: estimate.usage,
                    quota: estimate.quota,
                    percentage: (estimate.usage / estimate.quota * 100).toFixed(2)
                };
            } catch (error) {
                console.error('Error getting storage estimate:', error);
                return null;
            }
        }
        return null;
    }

    static async persistStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
            try {
                const isPersisted = await navigator.storage.persist();
                console.log('Storage persistence granted:', isPersisted);
                return isPersisted;
            } catch (error) {
                console.error('Error persisting storage:', error);
                return false;
            }
        }
        return false;
    }

    static displayStorageInfo() {
        this.getStorageEstimate().then(estimate => {
            if (estimate) {
                const usedMB = (estimate.used / 1024 / 1024).toFixed(2);
                const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
                console.log(`Storage used: ${usedMB} MB of ${quotaMB} MB (${estimate.percentage}%)`);
            }
        });
    }

    static checkConnectivity() {
        const updateOnlineStatus = () => {
            const isOnline = navigator.onLine;
            document.documentElement.setAttribute('data-online', isOnline);
            
            if (!isOnline) {
                const translations = window.getTranslations ? window.getTranslations() : {};
                const message = translations.general?.offline || 'You are currently offline';
                showGlobalToast(message, 'warning');
            } else {
                const translations = window.getTranslations ? window.getTranslations() : {};
                const message = translations.general?.online || 'Back online!';
                showGlobalToast(message, 'success');
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus(); // Set initial state
    }

    static enableBackgroundSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                return registration.sync.register('background-sync');
            }).catch(error => {
                console.log('Background Sync failed:', error);
            });
        }
    }
}

// Initialize PWA Manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.GHPWAManager = new GHPWAManager();
    window.GHPWAUtils = GHPWAUtils;
    
    // Initialize PWA utilities
    GHPWAUtils.checkConnectivity();
    GHPWAUtils.persistStorage();
    
    // Update install button text when translations change
    document.addEventListener('translationsUpdated', () => {
        if (window.GHPWAManager) {
            window.GHPWAManager.updateInstallButtonText();
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GHPWAManager, GHPWAUtils };
}