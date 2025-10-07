// js/telegram.js - Telegram Web App Integration
class TelegramApp {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.init();
    }

    init() {
        if (!this.tg) {
            console.log('Not in Telegram environment');
            return;
        }

        console.log('🚀 Initializing Telegram Web App...');
        
        // Expand to full screen
        this.tg.expand();
        
        // Apply Telegram theme
        this.applyTheme();
        
        // Enable closing confirmation
        this.tg.enableClosingConfirmation();
        
        // Setup Telegram specific UI
        this.setupTelegramUI();
        
        console.log('✅ Telegram Web App initialized!');
    }

    applyTheme() {
        const themeParams = this.tg.themeParams;
        
        // Apply Telegram theme colors
        if (themeParams.bg_color) {
            document.body.style.background = `#${themeParams.bg_color}`;
        }
        if (themeParams.text_color) {
            document.body.style.color = `#${themeParams.text_color}`;
        }
        
        // Update CSS variables
        document.documentElement.style.setProperty(
            '--primary', 
            themeParams.button_color ? `#${themeParams.button_color}` : '#667eea'
        );
    }

    setupTelegramUI() {
        // Hide elements not needed in Telegram
        this.hideNonTelegramElements();
        
        // Setup Telegram Main Button
        this.setupMainButton();
        
        // Setup Back Button
        this.setupBackButton();
        
        // Modify share functionality for Telegram
        this.setupTelegramShare();
    }

    hideNonTelegramElements() {
        // Hide PWA install button and premium section
        const elementsToHide = [
            'pwa-install-btn',
            'premium-section'
        ];
        
        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.style.display = 'none';
        });
    }

    setupMainButton() {
        this.tg.MainButton.setText('⭐ Upgrade Premium');
        this.tg.MainButton.color = '#667eea';
        this.tg.MainButton.textColor = '#ffffff';
        
        this.tg.MainButton.onClick(() => {
            this.showPremiumModal();
        });
        
        this.tg.MainButton.show();
    }

    setupBackButton() {
        this.tg.BackButton.onClick(() => {
            this.handleBackButton();
        });
    }

    showPremiumModal() {
        document.getElementById('purchase-modal').style.display = 'block';
        this.tg.BackButton.show();
    }

    handleBackButton() {
        const modal = document.getElementById('purchase-modal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
            this.tg.BackButton.hide();
        }
    }

    setupTelegramShare() {
        // Replace default share with Telegram share
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.onclick = () => this.shareToTelegram();
        }
    }

    shareToTelegram() {
        if (!app.currentQuote) return;
        
        const quoteText = `"${app.currentQuote.text}" - ${app.currentQuote.author}`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(quoteText)}`;
        
        window.open(shareUrl, '_blank');
    }

    // Payment handling for Telegram
    processPayment() {
        // In real implementation, use Telegram Payments
        // For now, simulate payment
        if (confirm('Lanjutkan pembelian premium via Telegram?')) {
            this.tg.showPopup({
                title: 'Konfirmasi Pembelian',
                message: 'Anda akan membeli akses premium seharga $0.99',
                buttons: [
                    {id: 'confirm', type: 'ok', text: 'Beli'},
                    {id: 'cancel', type: 'cancel'}
                ]
            }, (buttonId) => {
                if (buttonId === 'confirm') {
                    this.completePayment();
                }
            });
        }
    }

    completePayment() {
        // Simulate payment processing
        this.tg.showAlert('Memproses pembelian...');
        
        setTimeout(() => {
            app.purchasePremium();
            this.tg.showAlert('🎉 Premium activated! Thank you for your purchase.');
            this.tg.MainButton.hide();
        }, 2000);
    }

    // Get user info for personalization
    getUserInfo() {
        const user = this.tg.initDataUnsafe?.user;
        if (user) {
            return {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                language: user.language_code
            };
        }
        return null;
    }
}

// Initialize Telegram App
let telegramApp;
if (window.Telegram?.WebApp) {
    document.addEventListener('DOMContentLoaded', function() {
        telegramApp = new TelegramApp();
    });
}