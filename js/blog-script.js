const API_BASE_URL = 'https://my-blog-server-bcbhawbtbpdza7fz.koreasouth-01.azurewebsites.net/';

let currentUser = null;
let isAuthenticated = false;
let currentPage = 0;
let totalPages = 0;
let currentCategory = 'all';

let categories = [];
let currentEditingPost = null;
let grandTotalPostCount = 0; 

document.addEventListener('DOMContentLoaded', async function() {

    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('show');
    });
    
    loadUserFromSessionStorage(); 
    checkUrlParams();
    initializeBlog();
});

function loadUserFromSessionStorage() {
    try {
    const storedUser = sessionStorage.getItem('currentUser');
        const storedAuth = sessionStorage.getItem('isAuthenticated');
        
    if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            
            if (parsedUser && parsedUser.authenticated) {
                currentUser = parsedUser;
            isAuthenticated = true;
                return true;
        } else {
                currentUser = null;
            isAuthenticated = false;

                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('isAuthenticated');
                return false;
            }
        } else {
            currentUser = null;
            isAuthenticated = false;
            return false;
        }
    } catch (error) {
        currentUser = null;
        isAuthenticated = false;

        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('isAuthenticated');
        return false;
    }
}

// 사용자 정보를 세션 스토리지에 저장
function saveUserToSessionStorage() {
    try {
    if (currentUser && isAuthenticated) {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            sessionStorage.setItem('isAuthenticated', 'true');
    } else {
        sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('isAuthenticated');
        }
    } catch (error) {
        // 오류가 발생해도 조용히 처리
    }
}

// URL 파라미터에서 사용자 정보 확인
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const githubId = urlParams.get('githubId');
    const name = urlParams.get('name');
    const role = urlParams.get('role');
    const loginSuccess = urlParams.get('login');
    
    if (githubId && name && role) {
        currentUser = {
            githubId: githubId,
            name: name,
            role: role,
            authenticated: true
        };
        isAuthenticated = true;
        saveUserToSessionStorage();
        
        // 즉시 UI 업데이트
        showAuthenticatedState();
        
        // URL 정리
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
    // 로그인 성공 파라미터가 있는 경우 sessionStorage 확인
    else if (loginSuccess === 'success') {
        loadUserFromSessionStorage();
        // URL 정리
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        
        if (isAuthenticated && currentUser) {
            // 즉시 UI 업데이트
            showAuthenticatedState();
            showSuccess(`${currentUser.name}님, 환영합니다!`);
        }
    }
}

// 블로그 초기화
async function initializeBlog() {
    const startTime = Date.now();
    const minLoadingTime = 200; // 최소 로딩 시간 (ms)
    const maxLoadingTime = 5000; // 최대 로딩 시간 (ms)

    // 로딩 스크린 표시
    showLoading();

    // 최대 로딩 시간 후 강제 종료 타이머
    const forceHideTimeout = setTimeout(() => {
        hideLoading();
        showWelcomeScreen();
    }, maxLoadingTime);

    try {
        // 세션 스토리지에 사용자 정보가 있으면 UI만 업데이트
        let authPromise;
        if (isAuthenticated && currentUser) {
            showAuthenticatedState();
            authPromise = Promise.resolve(); // 서버 요청 없이 즉시 해결
        } else {
            // 로그인 정보가 없을 때만 서버에 인증 상태 확인 요청
            authPromise = Promise.resolve(); // 불필요한 서버 요청 제거
            showUnauthenticatedState();
        }

        // 카테고리 로드 프로미스
        const categoriesPromise = loadCategories().catch(error => {
            categories = []; 
            renderCategories();
            updateCategorySelect();
        });

        // 초기 게시글 수 로드 프로미스 ('all' 카테고리)
        const initialPostsCountPromise = loadPosts(0, 'all').catch(error => {
        });

        await Promise.allSettled([authPromise, categoriesPromise, initialPostsCountPromise]);

        showWelcomeScreen();
    } catch (error) {
        showWelcomeScreen(); 
    } finally {
        clearTimeout(forceHideTimeout); 

        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
            hideLoading();
        }, remainingTime);
    }
}

// 로딩 스크린 표시/숨김
function showLoading() {
    document.getElementById('loading').style.opacity = '1';
    document.getElementById('loading').style.visibility = 'visible';
}

function hideLoading() {
    const loadingEl = document.getElementById('loading');
    loadingEl.style.opacity = '0';
    setTimeout(() => {
        loadingEl.style.visibility = 'hidden';
    }, 300); 
}

// 인증 상태 확인
async function checkAuthStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const userData = await response.json();
            if (userData.authenticated) {
                currentUser = userData;
                isAuthenticated = true;
                saveUserToSessionStorage(); 
                showAuthenticatedState();
            } else {
                currentUser = null; 
                isAuthenticated = false;
                saveUserToSessionStorage(); 
                showUnauthenticatedState();
            }
        } else {
            currentUser = null;
            isAuthenticated = false;
            saveUserToSessionStorage();
            showUnauthenticatedState();
        }
    } catch (error) {
        if (!isAuthenticated) { 
            showUnauthenticatedState();
        }
    }
}

// 인증된 상태 UI 표시
function showAuthenticatedState() {
    document.getElementById('auth-logged-out').style.display = 'none';
    document.getElementById('auth-logged-in').style.display = 'flex';
    if (currentUser) { // currentUser가 null이 아닌지 확인
        document.getElementById('user-name').textContent = `${currentUser.name} (${currentUser.githubId})`;
        if (currentUser.role === 'ADMIN') {
            document.getElementById('admin-tools').style.display = 'block';
        }
    } else {
        // currentUser가 비정상적으로 null이면 로그아웃 상태로 처리
        showUnauthenticatedState();
    }
}
// 미인증 상태 UI 표시
function showUnauthenticatedState() {
    document.getElementById('auth-logged-out').style.display = 'flex';
    document.getElementById('auth-logged-in').style.display = 'none';
    document.getElementById('admin-tools').style.display = 'none';
    currentUser = null;
    isAuthenticated = false;
}

// GitHub 로그인
function login() {
    try {
        // 로그인 시도 정보 저장
        sessionStorage.setItem('loginAttempt', JSON.stringify({
            timestamp: new Date().getTime(),
            redirectUrl: window.location.href
        }));
    // 서버에서 자동으로 success.html 또는 error.html로 리다이렉트
    const successUrl = `${window.location.origin}/login/success.html`;
        const errorUrl = `${window.location.origin}/api/auth/login-error.html`;
        
        // OAuth URL 생성 시 에러 URL도 포함
        const oauthUrl = `${API_BASE_URL}/oauth2/authorization/github?redirect_uri=${encodeURIComponent(successUrl)}&error_uri=${encodeURIComponent(errorUrl)}`;
        
        // 로그인 버튼 비활성화 및 로딩 상태 표시
        const loginBtn = document.querySelector('button[onclick="login()"]');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GitHub 연결 중...';
            
            // 10초 후 버튼 복구 (타임아웃 대비)
            setTimeout(() => {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fab fa-github"></i> GitHub 로그인';
            }, 10000);
        }
        // GitHub OAuth 페이지로 이동
        window.location.href = oauthUrl;
        
    } catch (error) {
        showError('로그인을 시작할 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.');
        
        // 버튼 복구
        const loginBtn = document.querySelector('button[onclick="login()"]');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fab fa-github"></i> GitHub 로그인';
        }
    }
}

// 로그아웃
async function logout() {
    try {
        // 1. 즉시 UI 상태 변경
        currentUser = null;
        isAuthenticated = false;
        showUnauthenticatedState(); 
        
        // 2. 모든 쿠키 삭제
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // 도메인별 쿠키도 삭제
        const domains = [window.location.hostname, `.${window.location.hostname}`];
        domains.forEach(domain => {
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=" + domain); 
            });
        });
        
        // 3. 모든 스토리지 정리
        sessionStorage.clear();
        localStorage.clear();
        
        // 4. 추가 인증 정보 정리
        saveUserToSessionStorage();
        
        // 5. 화면 상태 초기화
        currentCategory = 'all'; 
        currentPage = 0; 
        showWelcomeScreen(); 
        updateToolbarTitle('welcome'); 

        // 6. 즉시 성공 메시지 표시
        showSuccess('로그아웃이 완료되었습니다.');
        
    } catch (error) {
        currentUser = null;
        isAuthenticated = false;
        showUnauthenticatedState();
        
        // 강제 정리
        try {
            sessionStorage.clear();
            localStorage.clear();
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
        } catch (cleanupError) {
            // 정리 오류도 무시
        }
        saveUserToSessionStorage();
        showWelcomeScreen(); 
        updateToolbarTitle('welcome');
        showSuccess('로그아웃이 완료되었습니다.');
    }
}

// 카테고리 로드
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            categories = await response.json();
            renderCategories();
            updateCategorySelect();
        } else {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        categories = [];
        renderCategories();
        updateCategorySelect();
    }
}

// 카테고리 렌더링
function renderCategories() {
    const container = document.getElementById('categories-list');
    if (!container) {
        return;
    }

    container.innerHTML = '';
    // "All" 카테고리 아이템 생성
    const allItem = document.createElement('div');
    allItem.classList.add('category-item');
    // "All" 카테고리가 기본적으로 선택되도록 active 클래스 추가
    if (currentCategory === 'all' && document.getElementById('posts-container').style.display !== 'none') { // 게시글 화면일 때만 active
        allItem.classList.add('active');
    }
    allItem.dataset.category = 'all';

    const allIcon = document.createElement('i');
    allIcon.className = 'fas fa-list'; 

    const allNameSpan = document.createElement('span');
    allNameSpan.classList.add('category-item-name');
    allNameSpan.textContent = 'All';

    const allCountSpan = document.createElement('span');
    allCountSpan.classList.add('post-count');
    allCountSpan.id = 'all-count'; 
    allCountSpan.textContent = grandTotalPostCount || '0';

    const allNameAndIconWrapper = document.createElement('div');
    allNameAndIconWrapper.style.display = 'flex';
    allNameAndIconWrapper.style.alignItems = 'center';
    allNameAndIconWrapper.style.overflow = 'hidden';
    allNameAndIconWrapper.appendChild(allIcon);
    allNameAndIconWrapper.appendChild(allNameSpan);

    allItem.appendChild(allNameAndIconWrapper);
    allItem.appendChild(allCountSpan);
    allItem.addEventListener('click', () => filterPosts('all'));
    container.appendChild(allItem);

    // API에서 가져온 다른 카테고리들 렌더링
    categories.forEach(category => {
        const item = document.createElement('div');
        item.classList.add('category-item');
        if (currentCategory === category.name && document.getElementById('posts-container').style.display !== 'none') {
            item.classList.add('active');
        }
        item.dataset.category = category.name;
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-folder'; 
        
        const nameSpan = document.createElement('span');
        nameSpan.classList.add('category-item-name');
        nameSpan.textContent = category.name;
        
        const countSpan = document.createElement('span');
        countSpan.classList.add('post-count');
        countSpan.textContent = category.postCount;
        
        const nameAndIconWrapper = document.createElement('div');
        nameAndIconWrapper.style.display = 'flex';
        nameAndIconWrapper.style.alignItems = 'center';
        nameAndIconWrapper.style.overflow = 'hidden';
        nameAndIconWrapper.appendChild(icon);
        nameAndIconWrapper.appendChild(nameSpan);

        item.appendChild(nameAndIconWrapper);
        item.appendChild(countSpan);

        // ADMIN인 경우 새 게시글 버튼 추가
        if (isAuthenticated && currentUser && currentUser.role === 'ADMIN') {
            const newPostBtn = document.createElement('button');
            newPostBtn.className = 'category-new-post-btn';
            newPostBtn.innerHTML = '<i class="fas fa-plus"></i>';
            newPostBtn.title = `${category.name}에 새 게시글 작성`;
            newPostBtn.style.opacity = '0';
            
            newPostBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showWriteModalWithCategory(category.name);
            });

            item.addEventListener('mouseenter', () => {
                newPostBtn.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', () => {
                newPostBtn.style.opacity = '0';
            });

            item.appendChild(newPostBtn);
        }
        
        item.addEventListener('click', () => filterPosts(category.name));
        container.appendChild(item);
    });
}

function updateActiveCategory() {
    const items = document.querySelectorAll('.category-item');
    const isPostsScreenVisible = document.getElementById('posts-container').style.display !== 'none';

    items.forEach(item => {
        if (isPostsScreenVisible && item.dataset.category === currentCategory) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 카테고리 선택 옵션 업데이트
function updateCategorySelect() {
    const select = document.getElementById('post-category');

    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

// 게시글 로드
async function loadPosts(page = 0, categoryName = currentCategory) {
    try {
        const params = new URLSearchParams({
            page: page,
            size: 10, 
            sort: 'createdDate,desc'
        });
        
        if (categoryName && categoryName !== 'all') {
            params.append('categoryName', categoryName);
        }
        
        const url = `${API_BASE_URL}/api/posts?${params}`;
        
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();

            if (categoryName === 'all') {
                grandTotalPostCount = data.totalElements;
                const allCountElement = document.getElementById('all-count');
                if (allCountElement) {
                    allCountElement.textContent = grandTotalPostCount;
                }
            }

            renderPosts(data.content);
            updatePagination(data);
            updatePostCounts(data.totalElements); 
        } else {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        const emptyData = {
            content: [],
            currentPage: page,
            totalPages: 0,
            totalElements: 0
        };
        renderPosts(emptyData.content);
        updatePagination(emptyData);
        updatePostCounts(emptyData.totalElements);
    }
}

// 게시글 렌더링
function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    const toolbar = document.querySelector('.content-toolbar');
    
    if (!container) return;

    if (posts.length === 0) {
        showNormalEmptyState(); // 내부에서 toolbar 및 container 클래스 처리
        return;
    }
    
    // 게시글이 있으면 클래스 제거
    if (toolbar) {
        toolbar.classList.remove('hidden-by-empty-state');
        toolbar.style.display = 'flex'; // 명시적으로 다시 보이도록 설정
    }
    container.classList.remove('no-posts');

    container.innerHTML = posts.map(post => `
        <div class="post-card" onclick="showPostDetail(${post.id})">
            <span class="post-status ${post.published ? 'published' : 'draft'}">
                ${post.published ? 'Published' : 'Draft'}
            </span>
            <h3 class="post-title">${escapeHtml(post.title)}</h3>
            <div class="post-excerpt">
                ${getExcerpt(post.content, 120)}
            </div>
            <div class="post-meta">
                <span><i class="fas fa-user"></i> ${escapeHtml(post.author)}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(post.createdDate)}</span>
                <span><i class="fas fa-folder"></i> ${escapeHtml(post.category.name)}</span>
            </div>
        </div>
    `).join('');
}

// 일반적인 빈 게시글 상태 표시
function showNormalEmptyState() {
    const container = document.getElementById('posts-container');
    const toolbar = document.querySelector('.content-toolbar');
    
    if (!container) return;

    // 툴바 숨김 및 그리드 마진 조정용 클래스 추가
    if (toolbar) {
        toolbar.classList.add('hidden-by-empty-state');
        // toolbar.style.display = 'none'; // CSS 클래스로 제어
    }
    container.classList.add('no-posts');
    
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-file-alt"></i>
            <h3>게시글이 없습니다</h3>
            <p>아직 작성된 게시글이 없습니다.<br>
            ${isAuthenticated && currentUser?.role === 'ADMIN' ? '첫 번째 게시글을 작성해보세요!' : '곧 새로운 게시글이 업데이트될 예정입니다.'}</p>
            ${isAuthenticated && currentUser?.role === 'ADMIN' ? '<button class="btn btn-primary empty-state-btn" onclick="showWriteModal()"><i class="fas fa-pen"></i> 첫 게시글 작성하기</button>' : ''}
        </div>
    `;
}

// 빈 상태 렌더링 (서버 연결 실패용 - 사용 안함)
function renderEmptyState() {
    showNormalEmptyState();
}

// 페이지네이션 업데이트
function updatePagination(data) {
    currentPage = data.pageNumber;
    totalPages = data.totalPages;
    
    const container = document.getElementById('pagination-container');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'flex';
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalPages - 1;
    pageInfo.textContent = `Page ${currentPage + 1} of ${totalPages}`;
}

// 게시글 수 업데이트 (통계 영역 및 카테고리 총 개수)
function updatePostCounts(currentViewTotalElements) {
    // 사이드바 통계의 "게시글" 수는 현재 보여지는 목록의 게시글 수로 업데이트
    document.getElementById('total-posts').textContent = currentViewTotalElements;
    
    // "All" 카테고리 옆의 숫자는 loadPosts 함수에서 직접 grandTotalPostCount로 업데이트하므로 여기서는 건드리지 않음

    // 사이드바의 전체 카테고리 수도 업데이트
    const totalCategoriesElement = document.getElementById('total-categories');
    if (totalCategoriesElement) {
        totalCategoriesElement.textContent = categories.length;
    }
}

// 환영 화면 표시
function showWelcomeScreen() {
    document.getElementById('main-welcome-section').style.display = 'block';
    document.getElementById('posts-container').style.display = 'none';
    document.getElementById('pagination-container').style.display = 'none';
    updateToolbarTitle('welcome');
    currentCategory = null;
    updateActiveCategory(); 
}

// 게시글 목록 화면 표시
function showPostsScreen() {
    document.getElementById('main-welcome-section').style.display = 'none';
    document.getElementById('posts-container').style.display = 'grid';

    updateActiveCategory();
}

// "전체 게시글 보기" 버튼 클릭 시
async function showAllPosts() {
    currentCategory = 'all';
    currentPage = 0;
    updateActiveCategory();
    updateToolbarTitle('all');
    showPostsScreen();
    await loadPosts(0, 'all');
}

// 이전 페이지
async function prevPage() {
    if (currentPage > 0) {
        await loadPosts(currentPage - 1, currentCategory);
    }
}

// 다음 페이지
async function nextPage() {
    if (currentPage < totalPages - 1) {
        await loadPosts(currentPage + 1, currentCategory); 
    }
}

// 카테고리로 필터링
async function filterPosts(categoryName) {
    currentCategory = categoryName;
    currentPage = 0;
    
    updateActiveCategory(); 
    updateToolbarTitle(categoryName); 
    showPostsScreen();  
    await loadPosts(0, categoryName);

    const sidebar = document.querySelector('.blog-sidebar');
    const hamburger = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
}

// 게시글 작성 모달 표시
function showWriteModal() {
    if (!isAuthenticated) {
        showError('로그인이 필요합니다.');
        return;
    }
    
    // 폼 초기화
    document.getElementById('post-form').reset();
    document.getElementById('post-published').checked = true;
    currentEditingPost = null;
    
    document.querySelector('#write-modal .modal-header h2').textContent = '새 포스트 작성';
    const modal = document.getElementById('write-modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

// 카테고리가 자동 선택된 상태로 게시글 작성 모달 표시
function showWriteModalWithCategory(categoryName) {
    if (!isAuthenticated) {
        showError('로그인이 필요합니다.');
        return;
    }
    
    // 폼 초기화
    document.getElementById('post-form').reset();
    document.getElementById('post-published').checked = true;
    currentEditingPost = null;
    
    // 카테고리 자동 선택
    document.getElementById('post-category').value = categoryName;
    
    document.querySelector('#write-modal .modal-header h2').textContent = '새 포스트 작성';
    const modal = document.getElementById('write-modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

// 게시글 작성 모달 닫기
function closeWriteModal() {
    const modal = document.getElementById('write-modal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    currentEditingPost = null;
}

// 게시글 저장
document.getElementById('post-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!isAuthenticated) {
        showError('로그인이 필요합니다.');
        return;
    }
    
    const formData = {
        title: document.getElementById('post-title').value.trim(),
        content: document.getElementById('post-content').value.trim(),
        categoryName: document.getElementById('post-category').value,
        published: document.getElementById('post-published').checked
    };
    
    if (!formData.title || !formData.content || !formData.categoryName) {
        showError('모든 필수 항목을 입력해주세요.');
        return;
    }
    
    if (formData.title.length > 255) {
        showError('제목은 255자를 넘을 수 없습니다.');
        return;
    }
    
    try {
        const url = currentEditingPost 
            ? `${API_BASE_URL}/api/posts/${currentEditingPost.id}`
            : `${API_BASE_URL}/api/posts`;
        
        const method = currentEditingPost ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            closeWriteModal();
            
            // 현재 카테고리 저장 후 새로고침
            const savedCategory = currentCategory;
            await loadPosts(0, savedCategory);
            await loadCategories();
            
            // 카테고리 상태 복원 및 UI 업데이트
            currentCategory = savedCategory;
            updateActiveCategory();
            updateToolbarTitle(savedCategory);
            
            showSuccess(currentEditingPost ? '게시글이 수정되었습니다.' : '게시글이 작성되었습니다.');
        } else {
            const error = await response.json();
            showError(error.message || '게시글 저장에 실패했습니다.');
        }
    } catch (error) {
        showError('게시글 저장에 실패했습니다.');
    }
});

// 게시글 상세 보기
async function showPostDetail(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const post = await response.json();
            displayPostDetail(post);
        } else {
            showError('게시글을 불러오는데 실패했습니다.');
        }
    } catch (error) {
        showError('게시글을 불러오는데 실패했습니다.');
    }
}

// 게시글 상세 표시
function displayPostDetail(post) {
    currentEditingPost = post;
    
    document.getElementById('post-detail-title').textContent = post.title;
    document.getElementById('post-detail-author').innerHTML = `<i class="fas fa-user"></i> ${escapeHtml(post.author)}`;
    document.getElementById('post-detail-date').innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(post.createdDate)}`;
    document.getElementById('post-detail-category').innerHTML = `<i class="fas fa-folder"></i> ${escapeHtml(post.category.name)}`;
    
    // 마크다운을 HTML로 변환
    if (typeof marked !== 'undefined') {
        document.getElementById('post-detail-content').innerHTML = marked.parse(post.content);
    } else {
        document.getElementById('post-detail-content').innerHTML = post.content.replace(/\n/g, '<br>');
    }
    
    // 관리자인 경우 수정/삭제 버튼 표시
    if (isAuthenticated && currentUser.role === 'ADMIN') {
        document.getElementById('edit-post-btn').style.display = 'inline-block';
        document.getElementById('delete-post-btn').style.display = 'inline-block';
    } else {
        document.getElementById('edit-post-btn').style.display = 'none';
        document.getElementById('delete-post-btn').style.display = 'none';
    }
    
    const modal = document.getElementById('post-detail-modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    // 코드 하이라이팅 적용
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
}

// 게시글 상세 모달 닫기
function closePostDetail(fromEditButton = false) {
    const modal = document.getElementById('post-detail-modal');
    modal.style.display = 'none';
    modal.classList.remove('show');

    if (!fromEditButton) {
        currentEditingPost = null; 
    }
}

// 게시글 수정
function editPost() {
    if (!currentEditingPost) return;

    closePostDetail(true); 

    document.getElementById('post-title').value = currentEditingPost.title;
    document.getElementById('post-content').value = currentEditingPost.content;
    document.getElementById('post-category').value = currentEditingPost.category.name;
    document.getElementById('post-published').checked = currentEditingPost.published;
    
    document.querySelector('#write-modal .modal-header h2').textContent = '포스트 수정';
    document.getElementById('write-modal').style.display = 'block';
}

// 게시글 삭제
async function deletePost() {
    if (!currentEditingPost) return;
    
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${currentEditingPost.id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            closePostDetail();
            await loadPosts();
            await loadCategories();
            showSuccess('게시글이 삭제되었습니다.');
        } else {
            showError('게시글 삭제에 실패했습니다.');
        }
    } catch (error) {
        showError('게시글 삭제에 실패했습니다.');
    }
}

// 카테고리 관리 모달 표시
function showCategoryModal() {
    if (!isAuthenticated) {
        showError('로그인이 필요합니다.');
        // 로그인 페이지로 리다이렉트 고려
        return;
    }
    
    renderCategoryManagement();
    const modal = document.getElementById('category-modal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

// 카테고리 관리 모달 닫기
function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    modal.style.display = 'none';
    modal.classList.remove('show');
}

// 카테고리 관리 렌더링
function renderCategoryManagement() {
    const container = document.getElementById('categories-management-list');
    
    if (categories.length === 0) {
        container.innerHTML = '<p style="color: var(--text-tertiary);">등록된 카테고리가 없습니다.</p>';
        return;
    }
    
    container.innerHTML = categories.map(category => `
        <div class="category-management-item">
            <span>${escapeHtml(category.name)}</span>
            <button class="btn btn-danger btn-small" onclick="deleteCategory(${category.id})">
                <i class="fas fa-trash"></i> 삭제
            </button>
        </div>
    `).join('');
}

// 새 카테고리 생성
async function createCategory() {
    const name = document.getElementById('new-category-name').value.trim();
    
    if (!name) {
        showError('카테고리 이름을 입력해주세요.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ name: name })
        });
        
        if (response.ok) {
            document.getElementById('new-category-name').value = '';
            await loadCategories();
            renderCategoryManagement();
            showSuccess('카테고리가 생성되었습니다.');
        } else {
            const error = await response.json();
            showError(error.message || '카테고리 생성에 실패했습니다.');
        }
    } catch (error) {
        showError('카테고리 생성에 실패했습니다.');
    }
}

// 카테고리 삭제
async function deleteCategory(categoryId) {
    if (!confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            await loadCategories();
            renderCategoryManagement();
            showSuccess('카테고리가 삭제되었습니다.');
        } else {
            showError('카테고리 삭제에 실패했습니다.');
        }
    } catch (error) {
        showError('카테고리 삭제에 실패했습니다.');
    }
}

// 유틸리티 함수들
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) { 
        return '날짜 정보 없음';
    }
    const date = new Date(dateString);
    // 추가: 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
        return '유효하지 않은 날짜';
    }
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getExcerpt(content, maxLength = 150) {
    // content가 null, undefined이거나 문자열이 아니면 빈 문자열 반환
    if (typeof content !== 'string' || !content) {
        return ''; // 또는 '내용 없음' 같은 플레이스홀더 텍스트
    }

    // 마크다운 제거하고 텍스트만 추출
    const text = content
        .replace(/#{1,6}\s+/g, '') // 헤딩 제거
        .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
        .replace(/\*(.*?)\*/g, '$1') // 이탤릭 제거
        .replace(/`(.*?)`/g, '$1') // 인라인 코드 제거
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 제거
        .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
        .replace(/\n+/g, ' ') // 줄바꿈을 공백으로
        .trim();
    
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function showSuccess(message) {
    // 임시 토스트 메시지 (추후 개선 가능)
    alert(message);
}

function showError(message) {
    // 임시 토스트 메시지 (추후 개선 가능)
    alert(message);
}

// 모달 닫기 이벤트
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        e.target.classList.remove('show');
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('show');
        });
        // 사이드바도 ESC로 닫기
        const sidebar = document.querySelector('.blog-sidebar');
        const hamburger = document.getElementById('hamburger-btn');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
            if (overlay) overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }
});

// DOMContentLoaded 이벤트 리스너 (햄버거 메뉴 및 기타 초기화)
document.addEventListener('DOMContentLoaded', function() {
    loadUserFromSessionStorage(); 
    checkUrlParams(); 
    initializeBlog();
    
    const hamburger = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.blog-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (hamburger && sidebar && overlay) {
        hamburger.addEventListener('click', function(event) {
            event.stopPropagation(); 
            const isOpen = sidebar.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen.toString());
            overlay.classList.toggle('active', isOpen);
            document.body.classList.toggle('sidebar-open', isOpen);
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        });
    }
}); 

// 툴바 제목 업데이트 함수
function updateToolbarTitle(categoryOrViewName) {
    const toolbarTitleElement = document.getElementById('toolbar-title');
    if (toolbarTitleElement) {
        if (categoryOrViewName === 'welcome') {
            toolbarTitleElement.textContent = 'Welcome';
        } else if (categoryOrViewName && categoryOrViewName !== 'all') {
            toolbarTitleElement.textContent = categoryOrViewName;
        } else {
            toolbarTitleElement.textContent = 'All Posts'; 
        }
    }
} 