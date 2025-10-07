// js/facebook.js - Facebook Integration
class FacebookApp {
    constructor() {
        this.isSDKLoaded = false;
        this.init();
    }

    init() {
        this.loadFacebookSDK();
        this.setupFacebookUI();
    }

    loadFacebookSDK() {
        // Load Facebook SDK asynchronously
        window.fbAsyncInit = () => {
            FB.init({
                appId: 'YOUR_APP_ID', // You'll get this from Facebook Developer
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
            
            this.isSDKLoaded = true;
            console.log('✅ Facebook SDK loaded');
            
            // Check login status
            this.checkLoginStatus();
        };

        // Load SDK script
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    setupFacebookUI() {
        // Add Facebook specific UI elements
        this.addFacebookButtons();
        this.modifyShareForFacebook();
    }

    addFacebookButtons() {
        // These are already in facebook.html, just add handlers
        const inviteBtn = document.getElementById('fb-invite');
        const shareBtn = document.getElementById('fb-share');
        
        if (inviteBtn) {
            inviteBtn.addEventListener('click', () => this.inviteFriends());
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareToTimeline());
        }
    }

    modifyShareForFacebook() {
        // Replace default share with Facebook share
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.textContent = '📢 Share to FB';
            shareBtn.onclick = () => this.shareToTimeline();
        }
    }

    checkLoginStatus() {
        if (!this.isSDKLoaded) return;
        
        FB.getLoginStatus((response) => {
            if (response.status === 'connected') {
                console.log('User is logged in to Facebook');
                this.handleConnectedUser(response.authResponse);
            }
        });
    }

    handleConnectedUser(authResponse) {
        // User is logged in and connected to app
        console.log('Facebook user connected:', authResponse);
        
        // Get user info for personalization
        this.getUserProfile(authResponse.userID, authResponse.accessToken);
    }

    getUserProfile(userId, accessToken) {
        FB.api('/me', { fields: 'name,first_name,last_name,picture' }, (response) => {
            if (response && !response.error) {
                console.log('Facebook user profile:', response);
                this.updateUIWithUserInfo(response);
            }
        });
    }

    updateUIWithUserInfo(user) {
        // Personalize app for Facebook user
        const welcomeElement = document.createElement('div');
        welcomeElement.innerHTML = `
            <div style="text-align: center; margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                <p>Welcome, ${user.first_name}! 👋</p>
                <small>Connected via Facebook</small>
            </div>
        `;
        
        const header = document.querySelector('header');
        header.appendChild(welcomeElement);
    }

    shareToTimeline() {
        if (!this.isSDKLoaded) {
            this.showFacebookLogin();
            return;
        }

        if (!app.currentQuote) return;

        const quoteText = `"${app.currentQuote.text}" - ${app.currentQuote.author}`;
        
        FB.ui({
            method: 'share',
            href: window.location.href,
            quote: quoteText,
            hashtag: '#DailyMotivation'
        }, (response) => {
            if (response && !response.error_message) {
                console.log('Shared successfully:', response);
                this.showMessage('Posted to Facebook! 🎉');
            } else {
                console.log('Share cancelled or failed');
            }
        });
    }

    inviteFriends() {
        if (!this.isSDKLoaded) {
            this.showFacebookLogin();
            return;
        }

        FB.ui({
            method: 'game_invite',
            title: 'Join me in Daily Motivation!',
            message: 'Check out this amazing motivation app with daily inspirational quotes!'
        }, (response) => {
            if (response && !response.error_message) {
                console.log('Invite sent:', response);
                this.showMessage('Friends invited! 👥');
            }
        });
    }

    showFacebookLogin() {
        FB.login((response) => {
            if (response.authResponse) {
                console.log('Welcome! Fetching your information....');
                this.checkLoginStatus();
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {scope: 'public_profile,email'});
    }

    showMessage(text) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1877F2;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            font-weight: bold;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    }

    // Facebook Analytics
    trackEvent(eventName, parameters = {}) {
        if (this.isSDKLoaded && typeof fbq !== 'undefined') {
            fbq('track', eventName, parameters);
        }
    }
}

// Initialize Facebook App
let facebookApp;
document.addEventListener('DOMContentLoaded', function() {
    facebookApp = new FacebookApp();
});