// Common JavaScript functionality for ZeroFive Blog

// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (this.theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadComponents();
        this.bindEvents();
    }

    async loadComponents() {
        try {
            // Load navbar
            const navbarResponse = await fetch('components/navbar.html');
            if (navbarResponse.ok) {
                const navbarHtml = await navbarResponse.text();
                const navbarContainer = document.getElementById('navbar-container');
                if (navbarContainer) {
                    navbarContainer.innerHTML = navbarHtml;
                }
            }

            // Load footer
            const footerResponse = await fetch('components/footer.html');
            if (footerResponse.ok) {
                const footerHtml = await footerResponse.text();
                const footerContainer = document.getElementById('footer-container');
                if (footerContainer) {
                    footerContainer.innerHTML = footerHtml;
                }
            }

            // Re-initialize theme manager after loading components
            new ThemeManager();
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    bindEvents() {
        // Mobile menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('#navbar-toggle')) {
                this.toggleMobileMenu();
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    toggleMobileMenu() {
        const navbarMenu = document.getElementById('navbar-menu');
        const navbarToggle = document.getElementById('navbar-toggle');
        
        if (navbarMenu && navbarToggle) {
            navbarMenu.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        const navbarMenu = document.getElementById('navbar-menu');
        const navbarToggle = document.getElementById('navbar-toggle');
        
        if (navbarMenu && navbarToggle) {
            navbarMenu.classList.remove('active');
            navbarToggle.classList.remove('active');
        }
    }
}

// Blog Post Manager
class BlogPostManager {
    constructor() {
        this.posts = [];
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.renderRecentPosts();
    }

    async loadPosts() {
        try {
            const categories = ['devblog', 'lifeblog'];
            this.posts = [];

            for (const category of categories) {
                const response = await fetch(`posts/${category}/index.json`);
                if (response.ok) {
                    const fileList = await response.json();
                    
                    for (const htmlFile of fileList) {
                        const mdFile = htmlFile.replace('.html', '.md');
                        const mdResponse = await fetch(`posts/${category}/${mdFile}`);
                        
                        if (mdResponse.ok) {
                            const mdContent = await mdResponse.text();
                            const post = this.parseMarkdownPost(mdContent, mdFile, category);
                            if (post) {
                                this.posts.push(post);
                            }
                        }
                    }
                }
            }

            // Sort by date (newest first)
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    parseMarkdownPost(content, filename, category) {
        const lines = content.split('\n');
        const frontMatter = {};
        let contentStart = 0;

        // Parse front matter
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

        return {
            title: frontMatter.title || 'Untitled',
            excerpt: frontMatter.excerpt || '',
            date: frontMatter.date || new Date().toISOString().split('T')[0],
            category: frontMatter.category || category,
            tags: frontMatter.tags ? frontMatter.tags.split(',').map(tag => tag.trim()) : [],
            author: frontMatter.author || 'NohYeongO',
            filename: filename.replace('.md', '.html'),
            categoryPath: category
        };
    }

    renderRecentPosts() {
        const container = document.getElementById('recent-posts');
        if (!container) return;

        const recentPosts = this.posts.slice(0, 6); // Show only 6 recent posts

        if (recentPosts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>아직 작성된 글이 없습니다</h3>
                    <p>곧 새로운 글로 찾아뵙겠습니다!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentPosts.map(post => `
            <article class="blog-post-card">
                <div class="post-card-content">
                    <h2 class="post-title">
                        <a href="posts/${post.categoryPath}/${post.filename}">${post.title}</a>
                    </h2>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <span class="post-date">
                            <i class="fas fa-calendar"></i>
                            ${post.date}
                        </span>
                        <span class="post-author">
                            <i class="fas fa-user"></i>
                            ${post.author}
                        </span>
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </article>
        `).join('');
    }
}

// Utility Functions
class Utils {
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Scroll to Top Button
class ScrollToTop {
    constructor() {
        this.init();
    }

    init() {
        this.createButton();
        this.bindEvents();
    }

    createButton() {
        const button = document.createElement('button');
        button.id = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', '맨 위로 이동');
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(button);
        this.button = button;
    }

    bindEvents() {
        const scrollHandler = Utils.throttle(() => {
            if (window.scrollY > 300) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        }, 100);

        window.addEventListener('scroll', scrollHandler);

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
    new BlogPostManager();
    new ScrollToTop();
});

// Export for use in other files
window.ZeroFiveBlog = {
    ThemeManager,
    NavigationManager,
    BlogPostManager,
    Utils,
    ScrollToTop
};