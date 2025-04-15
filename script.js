document.addEventListener('DOMContentLoaded', function() {

    function logEvent(eventType, eventObjectDescription) {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} , ${eventType} , ${eventObjectDescription}`);
    }

    function getElementDescription(element) {
        if (!element) { return 'unknown element'; }
        const tagName = element.tagName.toLowerCase();
        switch (tagName) {
            case 'a': return `link (${element.textContent.trim().substring(0, 20) || element.href})`;
            case 'img': return `image (alt: ${element.alt || 'none'})`;
            case 'button': return `button (${element.textContent.trim().substring(0, 20) || element.id || 'unnamed'})`;
            case 'input': const inputType = element.type || 'text'; return `${inputType} input${element.placeholder ? ' (' + element.placeholder.substring(0,20) + ')' : ''}`;
            case 'textarea': return `textarea${element.placeholder ? ' (' + element.placeholder.substring(0,20) + ')' : ''}`;
            case 'select': return 'drop-down select';
            case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': return `heading (${element.textContent.trim().substring(0, 30)})`;
            case 'p': return `paragraph text`;
            case 'li': return `list item (${element.textContent.trim().substring(0, 30)})`;
            case 'i': if (element.classList.contains('fab') || element.classList.contains('fas')) { return `icon (${Array.from(element.classList).join(' ')})`; } return 'italic text';
            case 'div': if (element.id) return `div container (#${element.id})`; if (element.classList.length > 0) return `div container (.${element.classList[0]})`; return 'div container';
            case 'span': if (element.id) return `span (#${element.id})`; if (element.classList.length > 0) return `span (.${element.classList[0]})`; return 'text span';
            default: return tagName;
        }
    }

    logEvent('view', `page (${document.title || window.location.pathname})`);

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const description = getElementDescription(clickedElement);
        logEvent('click', description);
    }, true);

    setTimeout(function() {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        if (loaderWrapper) {
            loaderWrapper.style.opacity = '0';
            setTimeout(function() {
                loaderWrapper.style.display = 'none';
            }, 500);
        }
    }, 1500);

    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        function animateCursor() {
            let dx = mouseX - cursorX;
            let dy = mouseY - cursorY;
            cursorX += dx * 0.2;
            cursorY += dy * 0.2;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            cursorFollower.style.left = cursorX + 'px';
            cursorFollower.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        document.addEventListener('mousedown', function() {
            cursor.style.width = '8px';
            cursor.style.height = '8px';
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
        });
        document.addEventListener('mouseup', function() {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
        });
        const linksAndButtons = document.querySelectorAll('a, button, .menu-toggle');
        linksAndButtons.forEach(link => {
            link.addEventListener('mouseenter', function() {
                cursor.style.width = '0px';
                cursor.style.height = '0px';
                cursorFollower.style.width = '50px';
                cursorFollower.style.height = '50px';
                cursorFollower.style.borderWidth = '2px';
                cursorFollower.style.backgroundColor = 'rgba(94, 53, 177, 0.1)';
            });
            link.addEventListener('mouseleave', function() {
                cursor.style.width = '10px';
                cursor.style.height = '10px';
                cursorFollower.style.width = '30px';
                cursorFollower.style.height = '30px';
                cursorFollower.style.borderWidth = '1px';
                cursorFollower.style.backgroundColor = 'transparent';
            });
        });
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            if (!document.getElementById('mobile-menu-styles')) {
                const style = document.createElement('style');
                style.id = 'mobile-menu-styles';
                style.innerHTML = `
                    @media screen and (max-width: 768px) {
                         .nav-links.active { display: block !important; position: absolute; top: 100%; left: 0; width: 100%; background-color: var(--card-background); padding: 15px 0; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); z-index: 999; max-height: calc(100vh - 60px); overflow-y: auto; }
                         .nav-links.active ul { flex-direction: column; align-items: center; width: 100%; }
                         .nav-links.active li { margin: 0; width: 100%; text-align: center; border-bottom: 1px solid var(--border-color); }
                         .nav-links.active li:last-child { border-bottom: none; }
                         .nav-links.active a { padding: 12px 0; display: block; width: 100%; }
                         .nav-links.active a::after { display: none; }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }

    const categoryTabs = document.querySelectorAll('.category-tab');
    const skillCards = document.querySelectorAll('.skill-card');

    if (categoryTabs.length > 0 && skillCards.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                categoryTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-category');
                skillCards.forEach(card => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                         card.style.display = 'block';
                         setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 10);
                    } else {
                        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
                         setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    const analyzeButton = document.getElementById('analyzeButton');
    const textInput = document.getElementById('textInput');
    const analysisResultsDiv = document.getElementById('analysisResults');

    if (analyzeButton && textInput && analysisResultsDiv) {
        analyzeButton.addEventListener('click', function() {
            const text = textInput.value;
            if (!text.trim()) {
                analysisResultsDiv.innerHTML = '<p style="color: red;">Please enter some text to analyze.</p>';
                return;
            }
            const requiredLength = 10000;
            if (text.length <= requiredLength) {
                analysisResultsDiv.innerHTML = `<p style="color: red;">Text must contain more than ${requiredLength} characters for analysis. Current length: ${text.length}.</p>`;
                return;
            }
            analyzeText(text);
        });
    }

    function analyzeText(text) {
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const words = (text.trim().split(/\s+/).filter(word => word.length > 0)).length;
        const spaces = (text.match(/ /g) || []).length;
        const newlines = (text.match(/\n/g) || []).length;
        const specialSymbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
        const tokens = text.toLowerCase().replace(/[^a-z0-9'\s]/g, ' ').split(/\s+/).filter(token => token.length > 0);
        const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'who', 'whom', 'whose', 'which', 'what', 'that', 'this', 'these', 'those', 'all', 'another', 'any', 'anybody', 'anyone', 'anything', 'both', 'each', 'either', 'everybody', 'everyone', 'everything', 'few', 'many', 'most', 'neither', 'nobody', 'none', 'no one', 'one', 'other', 'others', 'several', 'some', 'somebody', 'someone', 'something', 'such'];
        const prepositions = ['aboard', 'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'concerning', 'considering', 'despite', 'down', 'during', 'except', 'excepting', 'excluding', 'following', 'for', 'from', 'in', 'inside', 'into', 'like', 'minus', 'near', 'of', 'off', 'on', 'onto', 'opposite', 'out', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'than', 'through', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without'];
        const indefiniteArticles = ['a', 'an'];
        const pronounCounts = {};
        const prepositionCounts = {};
        const articleCounts = {};
        tokens.forEach(token => {
            if (pronouns.includes(token)) { pronounCounts[token] = (pronounCounts[token] || 0) + 1; }
            if (prepositions.includes(token)) { prepositionCounts[token] = (prepositionCounts[token] || 0) + 1; }
            if (indefiniteArticles.includes(token)) { articleCounts[token] = (articleCounts[token] || 0) + 1; }
        });
        let resultsHTML = `<h3>Analysis Results:</h3>`;
        resultsHTML += `<p><strong>Basic Counts:</strong><br>Letters: ${letters}<br>Words: ${words}<br>Spaces: ${spaces}<br>Newlines: ${newlines}<br>Special Symbols: ${specialSymbols}</p>`;
        resultsHTML += formatCounts('Pronouns', pronounCounts);
        resultsHTML += formatCounts('Prepositions', prepositionCounts);
        resultsHTML += formatCounts('Indefinite Articles', articleCounts);
        if (analysisResultsDiv) { analysisResultsDiv.innerHTML = resultsHTML; }
    }

    function formatCounts(title, counts) {
        let html = `<p><strong>${title} Found (${Object.keys(counts).length}):</strong><br>`;
        const sortedKeys = Object.keys(counts).sort();
        if (sortedKeys.length === 0) { html += `None found.<br>`; }
        else { sortedKeys.forEach(key => { html += `${key}: ${counts[key]}<br>`; }); }
        html += `</p>`;
        return html;
    }

    const revealElements = document.querySelectorAll('.section-header, .hero-content, .hero-image, .gallery-item, .analyzer-container, .timeline-item, .skill-card, .footer-content > div');

    function checkReveal() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 80) { element.classList.add('revealed'); }
        });
    }

    if (revealElements.length > 0 && !document.getElementById('reveal-styles')) {
         const style = document.createElement('style');
         style.id = 'reveal-styles';
         style.innerHTML = `
            .section-header, .hero-content, .hero-image, .gallery-item, .analyzer-container, .timeline-item, .skill-card, .footer-content > div { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; will-change: opacity, transform; }
            .revealed { opacity: 1 !important; transform: translateY(0) !important; }
         `;
         document.head.appendChild(style);
    }

    checkReveal();
    window.addEventListener('scroll', checkReveal);

});
