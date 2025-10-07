// js/app.js - CORE APPLICATION
class DailyMotivationApp {
    constructor() {
        this.quotes = [];
        this.savedQuotes = [];
        this.currentQuote = null;
        this.quoteCount = 0;
        this.adCounter = 0;
        this.isPremium = false;
        this.currentCategory = 'motivation';
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing Daily Motivation App...');
        
        // Initialize quotes
        this.loadQuotes();
        this.loadSavedQuotes();
        this.loadUserData();
        
        // Bind events setelah DOM siap
        this.bindEvents();
        
        // Tampilkan quote pertama
        this.displayRandomQuote();
        
        console.log('✅ App initialized successfully!');
    }

    loadQuotes() {
        this.quotes = [
            {
                text: "The only way to do great work is to love what you do.",
                author: "Steve Jobs",
                category: "motivation"
            },
            {
                text: "Life is what happens when you're busy making other plans.",
                author: "John Lennon", 
                category: "life"
            },
            {
                text: "The future belongs to those who believe in the beauty of their dreams.",
                author: "Eleanor Roosevelt",
                category: "motivation"
            },
            {
                text: "Way to get started is to quit talking and begin doing.",
                author: "Walt Disney",
                category: "success"
            },
            {
                text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
                author: "Mother Teresa",
                category: "life"
            },
            {
                text: "Jangan tunda pekerjaanmu, lakukan sekarang juga!",
                author: "Unknown",
                category: "indonesia"
            },
            {
                text: "Kesempatan tidak datang dua kali, manfaatkan yang ada.",
                author: "Unknown", 
                category: "indonesia"
            }
        ];
    }

    bindEvents() {
        console.log('🔗 Binding events...');
        
        // Gunakan event delegation untuk menghindari masalah timing
        document.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target.id);
            
            switch(e.target.id) {
                case 'new-quote-btn':
                    this.displayRandomQuote();
                    break;
                case 'share-btn':
                    this.shareQuote();
                    break;
                case 'save-btn':
                    this.saveQuote();
                    break;
                case 'saved-btn':
                    this.showSavedQuotes();
                    break;
                case 'ai-btn':
                    this.generateAIQuote();
                    break;
                case 'show-premium-modal':
                    this.showPremiumModal();
                    break;
                case 'buy-btn':
                    this.purchasePremium();
                    break;
                case 'close-modal':
                    this.closeModal();
                    break;
            }
            
            // Handle category buttons
            if (e.target.classList.contains('category')) {
                this.setCategory(e.target.dataset.category);
            }
        });

        // Tambahkan event listeners langsung sebagai backup
        this.addDirectEventListeners();
    }

    addDirectEventListeners() {
        // Backup direct event listeners
        const buttons = [
            'new-quote-btn', 'share-btn', 'save-btn', 
            'saved-btn', 'ai-btn', 'show-premium-modal',
            'buy-btn', 'close-modal'
        ];

        buttons.forEach(btnId => {
            const element = document.getElementById(btnId);
            if (element) {
                console.log(`✅ Found button: ${btnId}`);
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleButtonClick(btnId);
                });
            } else {
                console.warn(`❌ Button not found: ${btnId}`);
            }
        });

        // Category buttons
        document.querySelectorAll('.category').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setCategory(btn.dataset.category);
            });
        });
    }

    handleButtonClick(buttonId) {
        console.log(`Button clicked: ${buttonId}`);
        
        const actions = {
            'new-quote-btn': () => this.displayRandomQuote(),
            'share-btn': () => this.shareQuote(),
            'save-btn': () => this.saveQuote(),
            'saved-btn': () => this.showSavedQuotes(),
            'ai-btn': () => this.generateAIQuote(),
            'show-premium-modal': () => this.showPremiumModal(),
            'buy-btn': () => this.purchasePremium(),
            'close-modal': () => this.closeModal()
        };

        if (actions[buttonId]) {
            actions[buttonId]();
        }
    }

    displayRandomQuote() {
        console.log('Displaying random quote...');
        
        const filteredQuotes = this.quotes.filter(quote => 
            quote.category === this.currentCategory
        );
        
        if (filteredQuotes.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        this.currentQuote = filteredQuotes[randomIndex];
        
        document.getElementById('quote-text').textContent = `"${this.currentQuote.text}"`;
        document.getElementById('quote-author').textContent = `- ${this.currentQuote.author}`;
        document.getElementById('quote-source').textContent = '📚 Original Quote';
        
        this.quoteCount++;
        this.updateStats();
        
        // Show ad every 3 quotes if not premium
        if (!this.isPremium && this.quoteCount % 3 === 0) {
            this.showAd();
        }
    }

    showAd() {
        this.adCounter++;
        console.log(`Showing ad #${this.adCounter}`);
        
        // Simulasi iklan
        const adContainer = document.getElementById('ad-container');
        if (adContainer) {
            adContainer.innerHTML = `
                <div class="ad-placeholder" style="background: #ffcc00; color: black; padding: 10px; border-radius: 10px; text-align: center;">
                    <p>📱 Iklan (Simulated)</p>
                    <small>Revenue untuk support developer! 💰</small>
                </div>
            `;
            
            // Hide ad after 5 seconds
            setTimeout(() => {
                adContainer.innerHTML = `
                    <div class="ad-placeholder">
                        <p>📱 Iklan akan tampil di sini</p>
                        <small>Revenue source kita! 💰</small>
                    </div>
                `;
            }, 5000);
        }
    }

    shareQuote() {
        if (!this.currentQuote) return;
        
        const text = `"${this.currentQuote.text}" - ${this.currentQuote.author}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Daily Motivation Quote',
                text: text,
                url: window.location.href
            }).then(() => {
                console.log('Quote shared successfully');
            }).catch(err => {
                console.log('Error sharing:', err);
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Quote copied to clipboard! 📋');
            }).catch(err => {
                console.log('Could not copy text: ', err);
            });
        }
    }

    saveQuote() {
        if (!this.currentQuote) return;
        
        this.savedQuotes.push({
            ...this.currentQuote,
            savedAt: new Date().toISOString()
        });
        
        localStorage.setItem('savedQuotes', JSON.stringify(this.savedQuotes));
        alert('Quote saved! 💾');
        this.updateStats();
    }

    showSavedQuotes() {
        if (this.savedQuotes.length === 0) {
            alert('No saved quotes yet!');
            return;
        }
        
        const quotesList = this.savedQuotes.map((quote, index) => `
            <div class="saved-quote">
                <p>"${quote.text}"</p>
                <p>- ${quote.author}</p>
                <small>Saved: ${new Date(quote.savedAt).toLocaleDateString()}</small>
                <button onclick="app.deleteSavedQuote(${index})">🗑️</button>
            </div>
        `).join('');
        
        document.body.innerHTML = `
            <div class="container">
                <header>
                    <h1>📚 Saved Quotes</h1>
                    <button onclick="app.goBack()">⬅ Back</button>
                </header>
                <div id="saved-quotes-container">
                    ${quotesList}
                </div>
            </div>
        `;
    }

    deleteSavedQuote(index) {
        this.savedQuotes.splice(index, 1);
        localStorage.setItem('savedQuotes', JSON.stringify(this.savedQuotes));
        this.showSavedQuotes();
    }

    goBack() {
        location.reload();
    }

    generateAIQuote() {
        // Simulasi AI quote generation
        const aiQuotes = [
            "Hidup adalah perjalanan, nikmati setiap langkahnya.",
            "Kesuksesan dimulai dari kemauan untuk mencoba.",
            "Jangan bandingkan dirimu dengan orang lain, bandingkan dengan dirimu yang kemarin.",
            "Setiap hari adalah kesempatan baru untuk menjadi lebih baik.",
            "Kegagalan adalah guru terbaik dalam hidup."
        ];
        
        const randomQuote = aiQuotes[Math.floor(Math.random() * aiQuotes.length)];
        
        document.getElementById('quote-text').textContent = `"${randomQuote}"`;
        document.getElementById('quote-author').textContent = '- AI Generated';
        document.getElementById('quote-source').textContent = '🤖 AI Quote';
        
        this.quoteCount++;
        this.updateStats();
    }

    setCategory(category) {
        this.currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.displayRandomQuote();
    }

    showPremiumModal() {
        document.getElementById('purchase-modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('purchase-modal').style.display = 'none';
    }

    purchasePremium() {
        this.isPremium = true;
        localStorage.setItem('isPremium', 'true');
        
        document.getElementById('premium-badge').classList.remove('hidden');
        document.getElementById('ad-container').style.display = 'none';
        document.getElementById('purchase-modal').style.display = 'none';
        
        alert('🎉 Terima kasih! Premium aktif. Iklan dihilangkan!');
    }

    updateStats() {
        document.getElementById('quote-count').textContent = `Quotes: ${this.quoteCount}`;
        document.getElementById('ad-counter').textContent = `Ads: ${this.adCounter}`;
        document.getElementById('total-quotes').textContent = `Total Quotes: ${this.quoteCount}`;
        document.getElementById('saved-count').textContent = `Saved: ${this.savedQuotes.length}`;
        
        localStorage.setItem('quoteCount', this.quoteCount.toString());
        localStorage.setItem('adCounter', this.adCounter.toString());
    }

    loadSavedQuotes() {
        const saved = localStorage.getItem('savedQuotes');
        this.savedQuotes = saved ? JSON.parse(saved) : [];
    }

    loadUserData() {
        this.quoteCount = parseInt(localStorage.getItem('quoteCount')) || 0;
        this.adCounter = parseInt(localStorage.getItem('adCounter')) || 0;
        this.isPremium = localStorage.getItem('isPremium') === 'true';
        
        if (this.isPremium) {
            document.getElementById('premium-badge').classList.remove('hidden');
            document.getElementById('ad-container').style.display = 'none';
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM fully loaded!');
    app = new DailyMotivationApp();
});

// Fallback initialization
window.addEventListener('load', function() {
    console.log('🔄 Window fully loaded!');
    if (!app) {
        app = new DailyMotivationApp();
    }
});