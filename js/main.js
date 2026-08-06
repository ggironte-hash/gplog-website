// Simple Multi-Language Toggle (ES/EN)
document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('lang-toggle');
    let currentLang = 'es';

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'es' ? 'en' : 'es';
        langBtn.textContent = currentLang === 'es' ? 'EN' : 'ES';

        document.querySelectorAll('[data-es]').forEach(el => {
            if (el.dataset[currentLang]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = el.dataset[currentLang];
                } else {
                    el.textContent = el.dataset[currentLang];
                }
            }
        });
    });
});
