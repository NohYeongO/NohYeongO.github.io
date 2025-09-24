// Main JavaScript for ZeroFive Blog

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    initAnimations();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize code highlighting
    initCodeHighlighting();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize reading progress
    initReadingProgress();
});

// Animation initialization
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.blog-post-card, .stat-item, .contact-item, .skill-tag');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Code highlighting with Prism.js
function initCodeHighlighting() {
    // Load Prism.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
    script.onload = () => {
        // Load additional language support
        const languages = ['javascript', 'java', 'python', 'css', 'html', 'json', 'bash'];
        languages.forEach(lang => {
            const langScript = document.createElement('script');
            langScript.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${lang}.min.js`;
            document.head.appendChild(langScript);
        });
        
        // Initialize Prism after all languages are loaded
        setTimeout(() => {
            if (window.Prism) {
                window.Prism.highlightAll();
            }
        }, 1000);
    };
    document.head.appendChild(script);
}

// Search functionality
function initSearch() {
    // Create search overlay
    const searchOverlay = document.createElement('div');
    searchOverlay.id = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-header">
                <input type="text" id="search-input" placeholder="검색어를 입력하세요..." autocomplete="off">
                <button id="search-close" aria-label="검색 닫기">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results" id="search-results">
                <div class="search-placeholder">
                    <i class="fas fa-search"></i>
                    <p>검색어를 입력하여 포스트를 찾아보세요</p>
                </div>
            </div>
        </div>
    `;
    
    // Add search overlay styles
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        #search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        #search-overlay.active {
            display: flex;
            opacity: 1;
        }
        
        .search-container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background-color: var(--bg-card);
            border-radius: 1rem;
            box-shadow: var(--shadow-lg);
            overflow: hidden;
        }
        
        .search-header {
            display: flex;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        #search-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 1.125rem;
            background: transparent;
            color: var(--text-primary);
        }
        
        #search-input::placeholder {
            color: var(--text-muted);
        }
        
        #search-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
        }
        
        #search-close:hover {
            color: var(--primary-color);
            background-color: var(--bg-secondary);
        }
        
        .search-results {
            max-height: 400px;
            overflow-y: auto;
            padding: 1rem;
        }
        
        .search-placeholder {
            text-align: center;
            padding: 2rem;
            color: var(--text-muted);
        }
        
        .search-placeholder i {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        
        .search-result-item {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .search-result-item:hover {
            background-color: var(--bg-secondary);
        }
        
        .search-result-item:last-child {
            border-bottom: none;
        }
        
        .search-result-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .search-result-excerpt {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
        }
        
        .search-result-meta {
            font-size: 0.75rem;
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(searchStyles);
    document.body.appendChild(searchOverlay);

    // Search functionality
    let allPosts = [];
    
    // Load all posts for search
    async function loadAllPosts() {
        try {
            const categories = ['devblog', 'lifeblog'];
            allPosts = [];

            for (const category of categories) {
                const response = await fetch(`posts/${category}/index.json`);
                if (response.ok) {
                    const fileList = await response.json();
                    
                    for (const htmlFile of fileList) {
                        const mdFile = htmlFile.replace('.html', '.md');
                        const mdResponse = await fetch(`posts/${category}/${mdFile}`);
                        
                        if (mdResponse.ok) {
                            const mdContent = await mdResponse.text();
                            const post = parseMarkdownPost(mdContent, mdFile, category);
                            if (post) {
                                allPosts.push(post);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error loading posts for search:', error);
        }
    }

    function parseMarkdownPost(content, filename, category) {
        const lines = content.split('\n');
        const frontMatter = {};
        let contentStart = 0;

        if (lines[0] === '---') {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '---') {
                    contentStart = i + 1;
                    break;
                }
                const [key, ...valueParts] = lines[i].split(':');
                if (key && valueParts.length > 0) {
                    frontMatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
                }
            }
        }

        const content = lines.slice(contentStart).join('\n');
        
        return {
            title: frontMatter.title || 'Untitled',
            excerpt: frontMatter.excerpt || '',
            content: content,
            date: frontMatter.date || new Date().toISOString().split('T')[0],
            category: frontMatter.category || category,
            tags: frontMatter.tags ? frontMatter.tags.split(',').map(tag => tag.trim()) : [],
            author: frontMatter.author || 'NohYeongO',
            filename: filename.replace('.md', '.html'),
            categoryPath: category
        };
    }

    function searchPosts(query) {
        if (!query.trim()) {
            return [];
        }

        const searchTerms = query.toLowerCase().split(' ');
        
        return allPosts.filter(post => {
            const searchText = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
            return searchTerms.every(term => searchText.includes(term));
        }).slice(0, 10); // Limit to 10 results
    }

    function renderSearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-placeholder">
                    <i class="fas fa-search"></i>
                    <p>검색 결과가 없습니다</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = results.map(post => `
            <div class="search-result-item" onclick="window.location.href='posts/${post.categoryPath}/${post.filename}'">
                <div class="search-result-title">${post.title}</div>
                <div class="search-result-excerpt">${post.excerpt}</div>
                <div class="search-result-meta">
                    <i class="fas fa-calendar"></i> ${post.date} • 
                    <i class="fas fa-tag"></i> ${post.category}
                </div>
            </div>
        `).join('');
    }

    // Bind search events
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        
        // Escape to close search
        if (e.key === 'Escape') {
            closeSearch();
        }
    });

    function openSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        overlay.classList.add('active');
        input.focus();
        
        // Load posts if not already loaded
        if (allPosts.length === 0) {
            loadAllPosts();
        }
    }

    function closeSearch() {
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        
        overlay.classList.remove('active');
        input.value = '';
        
        // Clear results
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = `
            <div class="search-placeholder">
                <i class="fas fa-search"></i>
                <p>검색어를 입력하여 포스트를 찾아보세요</p>
            </div>
        `;
    }

    // Bind search input events
    document.addEventListener('input', (e) => {
        if (e.target.id === 'search-input') {
            const query = e.target.value;
            const results = searchPosts(query);
            renderSearchResults(results);
        }
    });

    // Bind close button
    document.addEventListener('click', (e) => {
        if (e.target.id === 'search-close' || e.target.closest('#search-close')) {
            closeSearch();
        }
        
        if (e.target.id === 'search-overlay') {
            closeSearch();
        }
    });
}

// Reading progress indicator
function initReadingProgress() {
    // Only show on post detail pages
    if (!document.querySelector('.post-detail-content')) return;

    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
        z-index: 999;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);

    const updateProgress = ZeroFiveBlog.Utils.throttle(() => {
        const content = document.querySelector('.post-detail-content');
        if (!content) return;

        const contentHeight = content.offsetHeight;
        const contentTop = content.offsetTop;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        const progress = Math.min(
            Math.max((scrollTop - contentTop + windowHeight) / contentHeight, 0),
            1
        ) * 100;
        
        progressBar.style.width = `${progress}%`;
    }, 100);

    window.addEventListener('scroll', updateProgress);
}

// Copy code functionality
function initCodeCopy() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('pre')) {
            const pre = e.target.closest('pre');
            const code = pre.querySelector('code');
            
            if (code) {
                navigator.clipboard.writeText(code.textContent).then(() => {
                    // Show copy feedback
                    const feedback = document.createElement('div');
                    feedback.textContent = '코드가 복사되었습니다!';
                    feedback.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: var(--primary-color);
                        color: white;
                        padding: 1rem 2rem;
                        border-radius: 0.5rem;
                        z-index: 10000;
                        font-weight: 500;
                    `;
                    
                    document.body.appendChild(feedback);
                    
                    setTimeout(() => {
                        feedback.remove();
                    }, 2000);
                });
            }
        }
    });
}

// Initialize code copy functionality
initCodeCopy();

// Export functions for global use
window.ZeroFiveBlogMain = {
    openSearch,
    closeSearch
};