// 블로그 데이터 (MD 파일에서 자동 로드)
const blogData = {
    devblog: [],
    lifeblog: []
};

// 현재 상태
let currentSection = 'home';
let currentCategory = 'devblog';
let currentPost = null;

// 테마 관리
let currentTheme = 'dark';

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadBlogPosts();
    initializeTheme();
    updateStats();
    initializeClickableVariables();
    
    // 브라우저 뒤로가기/앞으로가기 처리
    window.addEventListener('popstate', function(event) {
        if (event.state) {
            const { section, post, category } = event.state;
            
            if (section === 'home') {
                showSection('home');
            } else if (section === 'blog') {
                if (post) {
                    // 특정 포스트로 이동
                    showPostDirect(post, category);
                } else {
                    // 블로그 목록으로 이동
                    showSection('blog');
                }
            }
        }
    });
});

// 앱 초기화
function initializeApp() {
    // 네비게이션 애니메이션
    animateNavigation();
    
    // 브랜드 애니메이션 시작
    startBrandAnimation();
}

// 브랜드 애니메이션 시작
function startBrandAnimation() {
    const brandTitle = document.getElementById('brand-title');
    if (!brandTitle) return;
    
    // 타이핑 효과
    const text = 'ZEROFIVE';
    brandTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            brandTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 150);
        } else {
            // 타이핑 완료 후 글로우 효과 강화
            brandTitle.style.animation = 'brandGlow 2s ease-in-out infinite alternate, brandPulse 1.5s ease-in-out infinite';
        }
    };
    
    setTimeout(typeWriter, 500);
}

// 클릭 가능한 변수 초기화
function initializeClickableVariables() {
    const clickableVariables = document.querySelectorAll('.variable.clickable');
    
    clickableVariables.forEach(variable => {
        variable.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            if (link) {
                if (link.startsWith('mailto:')) {
                    window.location.href = link;
        } else {
                    window.open(link, '_blank');
                }
            }
        });
    });
}

// 네비게이션 애니메이션
function animateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        link.style.transition = 'all 0.5s ease';

        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 섹션 표시
function showSection(sectionName) {
    // 현재 섹션 숨기기
    const currentSectionElement = document.querySelector('.content-section.active');
    if (currentSectionElement) {
        currentSectionElement.classList.remove('active');
    }
    
    // 네비게이션 링크 업데이트
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // 새 섹션 표시
    const newSection = document.getElementById(`${sectionName}-section`);
    if (newSection) {
        newSection.classList.add('active');
        currentSection = sectionName;
        
        // 홈으로 갈 때 상태 초기화
        if (sectionName === 'home') {
            currentPost = null;
            // 브라우저 히스토리에 홈 상태 추가
            history.pushState({section: 'home', post: null}, '', '#home');
        }
        
        // 섹션별 콘텐츠 로드
        if (sectionName === 'blog') {
            // 블로그 목록으로 이동
            showBlogList();
        }
    }
}

// 블로그 포스트 로드 (MD 파일에서)
async function loadBlogPosts() {
    try {
        // posts 폴더에서 MD 파일들 로드
        const devBlogPosts = await loadMarkdownFiles('posts/devblog');
        const lifeBlogPosts = await loadMarkdownFiles('posts/lifeblog');
        
        blogData.devblog = devBlogPosts;
        blogData.lifeblog = lifeBlogPosts;
        
        // 통계 업데이트
        updateStats();
        
        // 현재 카테고리에 맞는 포스트 표시
        displayPosts(currentCategory);
        
    } catch (error) {
        console.log('MD 파일 로딩 실패, 기본 데이터 사용:', error);
        // MD 파일이 없으면 기본 데이터 사용
        loadDefaultPosts();
    }
}

// MD 파일 로드 함수
async function loadMarkdownFiles(folderPath) {
    const posts = [];
    
    try {
        // 실제 환경에서는 서버에서 파일 목록을 가져와야 함
        // 여기서는 시뮬레이션
        const response = await fetch(`${folderPath}/index.json`);
        if (!response.ok) throw new Error('File not found');
        
        const fileList = await response.json();
        
        for (const file of fileList) {
            try {
                const postResponse = await fetch(`${folderPath}/${file}`);
                if (!postResponse.ok) {
                    console.warn(`파일을 찾을 수 없습니다: ${folderPath}/${file}`);
                    continue;
                }
                const content = await postResponse.text();
                
                const post = parseMarkdownFile(content, file);
                if (post) {
                    posts.push(post);
                }
            } catch (error) {
                console.warn(`파일 로드 실패: ${folderPath}/${file}`, error);
            }
        }
        
        // 날짜순 정렬 (최신순)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
    } catch (error) {
        console.log(`MD 파일 로드 실패: ${folderPath}`, error);
    }
    
    return posts;
}

// MD 파일 파싱
function parseMarkdownFile(content, filename) {
    try {
        const lines = content.split('\n');
        const frontMatter = {};
        let contentStart = 0;
        
        // Front Matter 파싱
        if (lines[0] === '---') {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '---') {
                    contentStart = i + 1;
                    break;
                }
                const [key, ...valueParts] = lines[i].split(':');
                if (key && valueParts.length > 0) {
                    frontMatter[key.trim()] = valueParts.join(':').trim();
                }
            }
        }
        
        // 제목 추출 (첫 번째 # 헤더)
        let title = frontMatter.title || 'Untitled';
        let excerpt = frontMatter.excerpt || '';
        
        // 내용에서 제목 추출
        for (let i = contentStart; i < lines.length; i++) {
            if (lines[i].startsWith('# ')) {
                title = lines[i].substring(2).trim();
                break;
            }
        }
        
        // 요약 추출 (첫 번째 문단)
        if (!excerpt) {
            for (let i = contentStart; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line && !line.startsWith('#') && !line.startsWith('```')) {
                    excerpt = line.substring(0, 150) + (line.length > 150 ? '...' : '');
                    break;
                }
            }
        }
        
        // Front Matter를 제거한 순수한 마크다운 내용
        const cleanContent = lines.slice(contentStart).join('\n');
        
        return {
            id: Date.now() + Math.random(),
            title: title,
            excerpt: excerpt,
            content: cleanContent,
            date: frontMatter.date || new Date().toISOString().split('T')[0],
            category: frontMatter.category || 'General',
            tags: frontMatter.tags ? frontMatter.tags.split(',').map(tag => tag.trim()) : [],
            author: frontMatter.author || 'NohYeongO',
            filename: filename
        };
        
    } catch (error) {
        console.error('MD 파일 파싱 실패:', error);
        return null;
    }
}

// 기본 포스트 로드 (MD 파일이 없을 때)
function loadDefaultPosts() {
    blogData.devblog = [
        {
            id: 1,
            title: "새로운 블로그 시작",
            excerpt: "MD 파일을 posts 폴더에 업로드하면 자동으로 블로그에 반영됩니다.",
            content: `# 새로운 블로그 시작

이 블로그는 MD 파일을 자동으로 로드하는 시스템입니다.

## 사용 방법

1. \`posts/devblog\` 폴더에 MD 파일 업로드
2. \`posts/lifeblog\` 폴더에 MD 파일 업로드
3. 자동으로 블로그에 반영됩니다

## Front Matter 예시

\`\`\`yaml
---
title: "게시글 제목"
excerpt: "게시글 요약"
date: "2025-01-30"
category: "Backend"
tags: "Spring Boot, Redis"
---
\`\`\`

곧 새로운 내용으로 찾아뵙겠습니다!`,
            date: "2025-01-30",
            category: "General",
            tags: ["Blog", "Getting Started"],
            author: "NohYeongO"
        }
    ];
    
    blogData.lifeblog = [
        {
            id: 1,
            title: "개발자의 일상",
            excerpt: "개발자로서의 일상과 생각을 공유합니다.",
            content: `# 개발자의 일상

안녕하세요! 개발자로서의 일상을 공유하고 싶습니다.

## 오늘의 학습

- 새로운 기술 스택 학습
- 코드 리뷰 참여
- 프로젝트 기획

## 앞으로의 계획

더 많은 경험을 쌓아가고 싶습니다.`,
            date: "2025-01-30",
            category: "Daily",
            tags: ["Life", "Developer"],
            author: "NohYeongO"
        }
    ];
    
    updateStats();
    displayPosts(currentCategory);
}

// 포스트 표시
function displayPosts(category) {
    const postsContainer = document.getElementById('blog-posts');
    if (!postsContainer) return;
    
    let posts = [];
    
    if (category === 'devblog') {
        posts = blogData.devblog;
    } else if (category === 'lifeblog') {
        posts = blogData.lifeblog;
    }
    
    // 날짜순 정렬 (최신순)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>아직 게시글이 없습니다</h3>
                <p>MD 파일을 posts 폴더에 업로드해주세요!</p>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = posts.map(post => `
        <div class="blog-post" onclick="showPostDirect('${post.id}', '${category}')">
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-meta">
                <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                <span><i class="fas fa-user"></i> ${post.author}</span>
                <span><i class="fas fa-tag"></i> ${post.category}</span>
                ${post.tags.length > 0 ? `<span><i class="fas fa-hashtag"></i> ${post.tags.join(', ')}</span>` : ''}
            </div>
        </div>
    `).join('');
}

// 카테고리 탭 클릭
function switchCategory(category) {
    // 탭 상태 업데이트
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = document.querySelector(`[data-category="${category}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    currentCategory = category;
    displayPosts(category);
}

// 테마 초기화
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

// 테마 토글
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// 테마 설정
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// 통계 업데이트
function updateStats() {
    const blogCount = blogData.devblog.length + blogData.lifeblog.length;
    const devPosts = blogData.devblog.length;
    const lifePosts = blogData.lifeblog.length;
    const experienceYears = 0; // 설정에서 가져올 예정
    
    // 애니메이션과 함께 숫자 업데이트
    animateNumber('blog-count', blogCount);
    animateNumber('dev-posts', devPosts);
    animateNumber('life-posts', lifePosts);
    animateNumber('experience-years', experienceYears);
}

// 숫자 애니메이션
function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentNumber = 0;
    const increment = targetNumber / 50;
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentNumber);
    }, 30);
}

// 포스트 모달 표시
// 포스트 직접 보기
function showPostDirect(postId, category) {
    const post = blogData[category].find(p => p.id == postId);
    if (!post) return;
    
    // 현재 포스트 상태 설정
    currentPost = post;
    
    // 브라우저 히스토리에 포스트 상태 추가
    history.pushState({section: 'blog', post: postId, category: category}, '', `#blog/${category}/${postId}`);
    
    // 블로그 섹션을 포스트 상세 보기로 변경
    const blogSection = document.getElementById('blog-section');
    const blogContent = blogSection.querySelector('.blog-content');
    
    // 기존 내용 제거
    blogContent.innerHTML = '';
    
    // DOM 요소 생성
    const postDetailDiv = document.createElement('div');
    postDetailDiv.className = 'post-detail';
    
    // 헤더 생성
    const headerDiv = document.createElement('div');
    headerDiv.className = 'post-detail-header';
    
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-secondary';
    backButton.onclick = showBlogList;
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> 목록으로 돌아가기';
    
    const titleH1 = document.createElement('h1');
    titleH1.className = 'post-detail-title';
    titleH1.textContent = post.title;
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'post-detail-meta';
    
    const dateSpan = document.createElement('span');
    dateSpan.innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(post.date)}`;
    
    const authorSpan = document.createElement('span');
    authorSpan.innerHTML = `<i class="fas fa-user"></i> ${post.author}`;
    
    const categorySpan = document.createElement('span');
    categorySpan.innerHTML = `<i class="fas fa-tag"></i> ${post.category}`;
    
    metaDiv.appendChild(dateSpan);
    metaDiv.appendChild(authorSpan);
    metaDiv.appendChild(categorySpan);
    
    if (post.tags.length > 0) {
        const tagsSpan = document.createElement('span');
        tagsSpan.innerHTML = `<i class="fas fa-hashtag"></i> ${post.tags.join(', ')}`;
        metaDiv.appendChild(tagsSpan);
    }
    
    headerDiv.appendChild(backButton);
    headerDiv.appendChild(titleH1);
    headerDiv.appendChild(metaDiv);
    
    // 콘텐츠 생성
    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-detail-content';
    
    // 마크다운 파싱 및 안전한 HTML 삽입
    const parsedContent = marked.parse(post.content);
    // CSP 메타 태그 제거
    const cleanContent = parsedContent.replace(/<meta[^>]*>/gi, '');
    contentDiv.innerHTML = cleanContent;
    
    // DOM 조립
    postDetailDiv.appendChild(headerDiv);
    postDetailDiv.appendChild(contentDiv);
    blogContent.appendChild(postDetailDiv);
    
    // 코드 하이라이팅 적용
    blogContent.querySelectorAll('pre code').forEach(block => {
        Prism.highlightElement(block);
    });
    
    // 이미지 클릭 확대/축소 이벤트 추가
    blogContent.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', function() {
            toggleImageScale(this);
        });
    });
    
    // 카테고리 탭 클릭 이벤트를 목록으로 돌아가기로 변경
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.onclick = function() {
            showBlogList();
            // 클릭된 탭 활성화
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            // 해당 카테고리로 전환
            const category = this.getAttribute('data-category');
            currentCategory = category;
            displayPosts(category);
        };
    });
}

// 블로그 목록으로 돌아가기
function showBlogList() {
    const blogSection = document.getElementById('blog-section');
    const blogContent = blogSection.querySelector('.blog-content');
    
    // 현재 포스트 상태 초기화
    currentPost = null;
    
    // 브라우저 히스토리에 블로그 목록 상태 추가
    history.pushState({section: 'blog', post: null}, '', '#blog');
    
    // 원래 블로그 목록 구조로 복원
    blogContent.innerHTML = `
        <div class="blog-posts" id="blog-posts">
            <!-- 블로그 포스트들이 여기에 동적으로 추가됩니다 -->
        </div>
    `;
    
    // 카테고리 탭 이벤트 복원
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.onclick = function() {
            // 모든 탭에서 active 클래스 제거
            categoryTabs.forEach(t => t.classList.remove('active'));
            // 클릭된 탭에 active 클래스 추가
            this.classList.add('active');
            // 해당 카테고리로 전환
            const category = this.getAttribute('data-category');
            currentCategory = category;
            displayPosts(category);
        };
    });
    
    // 현재 카테고리의 포스트들을 다시 표시
    displayPosts(currentCategory);
}

function showPostModal(postId, category) {
    let post = null;
    
    // 카테고리에서 포스트 찾기
    post = blogData[category].find(p => p.id === postId);
    
    if (!post) return;
    
    currentPost = post;
    
    // 모달 요소들 업데이트
    document.getElementById('modal-title').textContent = post.title;
    document.getElementById('modal-date').innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(post.date)}`;
    document.getElementById('modal-category').innerHTML = `<i class="fas fa-tag"></i> ${post.category}`;
    
    // 태그 표시
    const tagsElement = document.getElementById('modal-tags');
    if (post.tags && post.tags.length > 0) {
        tagsElement.innerHTML = `<i class="fas fa-hashtag"></i> ${post.tags.join(', ')}`;
        } else {
        tagsElement.innerHTML = '';
    }
    
    // 마크다운 콘텐츠 렌더링
    const contentElement = document.getElementById('modal-content');
    contentElement.innerHTML = renderMarkdown(post.content);
    
    // 모달 표시
    const modal = document.getElementById('post-modal');
    modal.classList.add('show');
    modal.style.display = 'flex';
    
    // 모달 애니메이션
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// 모달 닫기
function closePostModal() {
    const modal = document.getElementById('post-modal');
    modal.style.opacity = '0';
    
    setTimeout(() => {
        modal.classList.remove('show');
        modal.style.display = 'none';
        currentPost = null;
    }, 300);
}

// 마크다운 렌더링 (향상된 버전)
function renderMarkdown(content) {
    return content
        // Front Matter 제거
        .replace(/^---[\s\S]*?---\n/, '')
        // 헤더
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        // 강조
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // 코드
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>')
        // 링크
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
        // 줄바꿈
        .replace(/\n/gim, '<br>');
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 이미지 확대/축소 토글
function toggleImageScale(img) {
    // 현재 확대 상태 확인
    const isScaled = img.classList.contains('scaled');
    
    if (isScaled) {
        // 축소 (원래 크기로)
        img.classList.remove('scaled');
        img.style.transform = 'scale(1)';
        img.style.zIndex = 'auto';
        img.style.position = 'relative';
    } else {
        // 확대
        img.classList.add('scaled');
        img.style.transform = 'scale(1.5)';
        img.style.zIndex = '1000';
        img.style.position = 'relative';
        img.style.transition = 'transform 0.3s ease';
    }
}


// 이벤트 리스너
document.addEventListener('click', function(e) {
    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('post-modal');
    if (e.target === modal) {
        closePostModal();
    }
    
    // 카테고리 탭 클릭
    if (e.target.closest('.category-tab')) {
        const category = e.target.closest('.category-tab').dataset.category;
        switchCategory(category);
    }
    
    // 네비게이션 링크 클릭
    if (e.target.closest('.nav-link')) {
        e.preventDefault();
        const section = e.target.closest('.nav-link').dataset.section;
        showSection(section);
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePostModal();
    }
});

// 스크롤 시 네비게이션 효과
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.9)';
    }
});

// 초기 애니메이션 설정
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.stat-card, .blog-post, .contact-card');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // 순차적으로 애니메이션 실행
    setTimeout(() => {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 1000);
});