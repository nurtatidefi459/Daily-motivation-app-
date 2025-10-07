// js/pwa.js - PWA Functionality
class PWAHandler {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.setupInstallPrompt();
        this.registerServiceWorker();
        this.setupPWAFeatures();
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('App installed successfully!');
            this.deferredPrompt = null;
        });
    }

    showInstallButton() {
        // Create install button
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.innerHTML = '📱 Install App';
        installBtn.style.cssText = `
            position: fixed; 
            bottom: 20px; 
            right: 20px; 
            background: #667eea; 
            color: white; 
            border: none; 
            padding: 12px 15px; 
            border-radius: 25px; 
            cursor: pointer;
            z-index: 1000;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        installBtn.onclick = () => this.installApp();
        document.body.appendChild(installBtn);
    }

    installApp() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted install');
                document.getElementById('pwa-install-btn').style.display = 'none';
            }
            this.deferredPrompt = null;
        });
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    setupPWAFeatures() {
        // Setup offline functionality
        this.setupOfflineUI();
    }

    setupOfflineUI() {
        // Show offline indicator when needed
        window.addEventListener('online', () => {
            this.showStatus('You are back online!', 'success');
        });

        window.addEventListener('offline', () => {
            this.showStatus('You are offline. App works in offline mode!', 'warning');
        });
    }

    showStatus(message, type) {
        const status = document.createElement('div');
        status.textContent = message;
        status.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#4CAF50' : '#FF9800'};
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            z-index: 1000;
            font-weight: bold;
        `;
        
        document.body.appendChild(status);
        setTimeout(() => status.remove(), 3000);
    }
}

// Initialize PWA
let pwaHandler;
document.addEventListener('DOMContentLoaded', function() {
    pwaHandler = new PWAHandler();
});