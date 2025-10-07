// js/ads.js - Comprehensive Ad Management System
class AdManager {
    constructor() {
        this.adNetworks = {
            ADMOB: 'admob',
            FACEBOOK: 'facebook',
            TELEGRAM: 'telegram',
            SIMULATED: 'simulated' // Untuk testing
        };
        
        this.adFormats = {
            BANNER: 'banner',
            INTERSTITIAL: 'interstitial',
            REWARDED: 'rewarded',
            NATIVE: 'native'
        };
        
        this.currentNetwork = this.adNetworks.SIMULATED;
        this.adCounter = 0;
        this.revenue = 0;
        this.adConfig = {
            bannerFrequency: 3, // Tampilkan banner setiap 3 quotes
            interstitialFrequency: 5, // Tampilkan interstitial setiap 5 quotes
            rewardedCooldown: 30 // Cooldown rewarded ads (menit)
        };
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing Ad Manager...');
        this.loadAdSettings();
        this.setupAdContainers();
        this.detectPlatform();
    }

    detectPlatform() {
        // Deteksi platform untuk set network yang tepat
        if (window.Telegram?.WebApp) {
            this.currentNetwork = this.adNetworks.TELEGRAM;
        } else if (window.FB) {
            this.currentNetwork = this.adNetworks.FACEBOOK;
        } else {
            this.currentNetwork = this.adNetworks.SIMULATED;
        }
        console.log(`📱 Detected platform: ${this.currentNetwork}`);
    }

    loadAdSettings() {
        // Load dari localStorage
        this.adCounter = parseInt(localStorage.getItem('adCounter')) || 0;
        this.revenue = parseFloat(localStorage.getItem('adRevenue')) || 0;
        
        // Load user preferences
        const savedConfig = localStorage.getItem('adConfig');
        if (savedConfig) {
            this.adConfig = { ...this.adConfig, ...JSON.parse(savedConfig) };
        }
    }

    setupAdContainers() {
        // Setup container untuk berbagai jenis iklan
        this.createAdContainer('banner-ad-container', this.adFormats.BANNER);
        this.createAdContainer('interstitial-ad-container', this.adFormats.INTERSTITIAL);
    }

    createAdContainer(id, adType) {
        if (!document.getElementById(id)) {
            const container = document.createElement('div');
            container.id = id;
            container.className = `ad-container ${adType}-container`;
            
            // Styling berdasarkan type
            const styles = {
                [this.adFormats.BANNER]: `
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    background: #f0f0f0;
                    z-index: 999;
                    display: none;
                `,
                [this.adFormats.INTERSTITIAL]: `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    z-index: 1000;
                    display: none;
                    justify-content: center;
                    align-items: center;
                `
            };
            
            container.style.cssText = styles[adType] || '';
            document.body.appendChild(container);
        }
    }

    // Main method untuk menampilkan iklan
    showAd(adFormat = this.adFormats.BANNER) {
        if (app?.isPremium) {
            console.log('🎯 Premium user - no ads shown');
            return;
        }

        this.adCounter++;
        localStorage.setItem('adCounter', this.adCounter.toString());
        
        console.log(`📢 Showing ${adFormat} ad (${this.adCounter} total ads)`);

        switch(adFormat) {
            case this.adFormats.BANNER:
                this.showBannerAd();
                break;
            case this.adFormats.INTERSTITIAL:
                this.showInterstitialAd();
                break;
            case this.adFormats.REWARDED:
                return this.showRewardedAd();
            default:
                this.showBannerAd();
        }

        this.updateAdDisplay();
        this.trackAdEvent('ad_shown', { format: adFormat, network: this.currentNetwork });
    }

    showBannerAd() {
        const container = document.getElementById('banner-ad-container');
        if (!container) return;

        const adContent = this.generateAdContent(this.adFormats.BANNER);
        container.innerHTML = adContent;
        container.style.display = 'block';

        // Auto hide setelah 30 detik
        setTimeout(() => {
            this.hideBannerAd();
        }, 30000);
    }

    hideBannerAd() {
        const container = document.getElementById('banner-ad-container');
        if (container) {
            container.style.display = 'none';
        }
    }

    showInterstitialAd() {
        const container = document.getElementById('interstitial-ad-container');
        if (!container) return;

        const adContent = this.generateAdContent(this.adFormats.INTERSTITIAL);
        container.innerHTML = adContent;
        container.style.display = 'flex';

        // Auto close setelah 5 detik
        setTimeout(() => {
            this.hideInterstitialAd();
        }, 5000);
    }

    hideInterstitialAd() {
        const container = document.getElementById('interstitial-ad-container');
        if (container) {
            container.style.display = 'none';
        }
    }

    showRewardedAd() {
        return new Promise((resolve, reject) => {
            const container = document.getElementById('interstitial-ad-container');
            if (!container) {
                reject('Ad container not found');
                return;
            }

            const adContent = this.generateAdContent(this.adFormats.REWARDED);
            container.innerHTML = adContent;
            container.style.display = 'flex';

            let countdown = 5;
            const countdownElement = document.getElementById('rewarded-countdown');
            const closeBtn = document.getElementById('close-rewarded-ad');

            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdownElement) {
                    countdownElement.textContent = countdown;
                }

                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    this.hideInterstitialAd();
                    this.grantReward();
                    resolve('reward_granted');
                }
            }, 1000);

            if (closeBtn) {
                closeBtn.onclick = () => {
                    clearInterval(countdownInterval);
                    this.hideInterstitialAd();
                    reject('ad_skipped');
                };
            }
        });
    }

    generateAdContent(adFormat) {
        const templates = {
            [this.adFormats.BANNER]: `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 15px; height: 100%;">
                    <div style="flex: 1;">
                        <strong style="color: #333;">📱 Advertisement</strong>
                        <p style="margin: 0; font-size: 0.8em; color: #666;">Support our development! 🚀</p>
                    </div>
                    <button onclick="adManager.hideBannerAd()" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                        ✕
                    </button>
                </div>
            `,
            
            [this.adFormats.INTERSTITIAL]: `
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 300px; margin: 20px;">
                    <h3>🎯 Advertisement</h3>
                    <p>Thank you for using our app! This ad helps us continue development.</p>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px 0;">
                        <strong>Simulated Interstitial Ad</strong>
                        <p style="font-size: 0.9em; color: #666;">Closing in <span id="interstitial-countdown">5</span>s</p>
                    </div>
                    <button onclick="adManager.hideInterstitialAd()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; font-weight: bold;">
                        Continue to App
                    </button>
                </div>
            `,
            
            [this.adFormats.REWARDED]: `
                <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; max-width: 300px; margin: 20px;">
                    <h3>🎁 Rewarded Ad</h3>
                    <p>Watch this ad to get 1 hour of premium features!</p>
                    <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 15px 0; border: 2px solid #ffc107;">
                        <strong>Premium Reward:</strong>
                        <p>✅ No ads for 1 hour</p>
                        <p>✅ Exclusive quotes</p>
                        <p>✅ Priority support</p>
                    </div>
                    <div style="margin: 15px 0;">
                        <p>Ad completes in <span id="rewarded-countdown" style="font-weight: bold; color: #667eea;">5</span> seconds</p>
                    </div>
                    <button id="close-rewarded-ad" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 10px; cursor: pointer; margin-top: 10px;">
                        Skip Ad
                    </button>
                </div>
            `
        };

        return templates[adFormat] || templates[this.adFormats.BANNER];
    }

    grantReward() {
        // Berikan reward kepada user
        const rewardExpiry = new Date();
        rewardExpiry.setHours(rewardExpiry.getHours() + 1);
        
        localStorage.setItem('premiumRewardExpiry', rewardExpiry.toISOString());
        localStorage.setItem('hasPremiumReward', 'true');
        
        // Update UI
        if (app) {
            app.isPremium = true;
            document.getElementById('premium-badge').classList.remove('hidden');
            document.getElementById('premium-badge').textContent = '⭐ PREMIUM (1h)';
            this.hideBannerAd();
        }
        
        this.trackAdEvent('reward_granted', { type: '1h_premium' });
        alert('🎉 Reward granted! Premium features activated for 1 hour!');
    }

    checkRewardStatus() {
        const expiry = localStorage.getItem('premiumRewardExpiry');
        const hasReward = localStorage.getItem('hasPremiumReward') === 'true';
        
        if (hasReward && expiry) {
            const now = new Date();
            const expiryDate = new Date(expiry);
            
            if (now < expiryDate) {
                // Reward masih aktif
                if (app) {
                    app.isPremium = true;
                    document.getElementById('premium-badge').classList.remove('hidden');
                    
                    // Hitung sisa waktu
                    const hoursLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60));
                    document.getElementById('premium-badge').textContent = `⭐ PREMIUM (${hoursLeft}h)`;
                }
                return true;
            } else {
                // Reward expired
                localStorage.removeItem('premiumRewardExpiry');
                localStorage.removeItem('hasPremiumReward');
                if (app) {
                    app.isPremium = false;
                    document.getElementById('premium-badge').classList.add('hidden');
                }
                return false;
            }
        }
        return false;
    }

    // Auto ad display berdasarkan frequency
    setupAutoAds() {
        // Banner otomatis setiap X quotes
        if (app) {
            const originalDisplayQuote = app.displayRandomQuote;
            app.displayRandomQuote = function() {
                originalDisplayQuote.call(app);
                
                if (!app.isPremium) {
                    // Banner setiap 3 quotes
                    if (app.quoteCount % adManager.adConfig.bannerFrequency === 0) {
                        adManager.showAd(adManager.adFormats.BANNER);
                    }
                    
                    // Interstitial setiap 5 quotes
                    if (app.quoteCount % adManager.adConfig.interstitialFrequency === 0) {
                        setTimeout(() => {
                            adManager.showAd(adManager.adFormats.INTERSTITIAL);
                        }, 1000);
                    }
                }
            };
        }
    }

    updateAdDisplay() {
        const adCounterElement = document.getElementById('ad-counter');
        if (adCounterElement) {
            adCounterElement.textContent = `Ads: ${this.adCounter}`;
        }
    }

    trackAdEvent(eventName, parameters = {}) {
        // Simpan event untuk analytics
        const events = JSON.parse(localStorage.getItem('adEvents') || '[]');
        events.push({
            event: eventName,
            timestamp: new Date().toISOString(),
            ...parameters
        });
        localStorage.setItem('adEvents', JSON.stringify(events));
        
        console.log(`📊 Ad Event: ${eventName}`, parameters);
    }

    getStats() {
        return {
            totalAds: this.adCounter,
            totalRevenue: this.revenue,
            currentNetwork: this.currentNetwork,
            rewardActive: this.checkRewardStatus()
        };
    }

    // Method untuk integrasi dengan AdMob/Facebook nanti
    initializeAdNetwork(network, config = {}) {
        this.currentNetwork = network;
        console.log(`🔄 Initializing ${network} ads...`);
        
        // Di sini nanti akan ada kode untuk initialize AdMob/Facebook SDK
        // Untuk sekarang kita simulasi saja
    }
}

// Initialize Ad Manager
let adManager;
document.addEventListener('DOMContentLoaded', function() {
    adManager = new AdManager();
    adManager.setupAutoAds();
    adManager.checkRewardStatus();
});

// Integrasi dengan app utama
if (typeof app !== 'undefined') {
    // Override purchasePremium untuk update ad manager
    const originalPurchasePremium = app.purchasePremium;
    app.purchasePremium = function() {
        originalPurchasePremium.call(app);
        adManager.hideBannerAd();
    };
}