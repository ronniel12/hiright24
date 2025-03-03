document.addEventListener('DOMContentLoaded', function() {
    // Language toggle elements
    const langToggle = document.createElement('div');
    langToggle.className = 'lang-toggle';
    langToggle.innerHTML = `
        <button class="lang-btn" data-lang="en">EN</button>
        <button class="lang-btn" data-lang="fi">FI</button>
    `;
    document.body.prepend(langToggle);

    // Translation system
    let currentLang = localStorage.getItem('lang') || 'en';
    
    async function loadTranslations(lang) {
        const response = await fetch(`translations/${lang}.json`);
        return await response.json();
    }

    async function updateContent(lang) {
        const translations = await loadTranslations(lang);
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = translations[key];
        });

        // Update complex structures
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            el.innerHTML = translations[key];
        });

        // Update service listings
        const serviceElements = document.querySelectorAll('.service-name');
        serviceElements.forEach(el => {
            const serviceKey = el.dataset.service;
            el.textContent = translations.fullServiceList[serviceKey];
        });
    }

    // Language toggle event
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentLang = this.dataset.lang;
            localStorage.setItem('lang', currentLang);
            updateContent(currentLang);
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Initialize
    updateContent(currentLang);
    document.querySelector(`.lang-btn[data-lang="${currentLang}"]`).classList.add('active');
});