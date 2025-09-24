#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const marked = require('marked');

// marked 설정
marked.setOptions({
    breaks: true,
    gfm: true,
    sanitize: false,
    smartLists: true,
    smartypants: true
});

/**
 * 마크다운 파일을 HTML로 변환
 */
function convertMarkdownToHtml(mdContent, filename) {
    const lines = mdContent.split('\n');
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
                frontMatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
            }
        }
    }

    const title = frontMatter.title || 'Untitled';
    const excerpt = frontMatter.excerpt || '';
    const date = frontMatter.date || new Date().toISOString().split('T')[0];
    const category = frontMatter.category || 'General';
    const tags = frontMatter.tags ? frontMatter.tags.split(',').map(tag => tag.trim()) : [];
    const author = frontMatter.author || 'NohYeongO';

    // 마크다운 내용 추출 (Front Matter 제외)
    let content = lines.slice(contentStart).join('\n').trim();
    
    // 첫 번째 헤더가 제목과 같거나 비슷하면 제거 (모든 헤더 레벨 지원)
    const contentLines = content.split('\n');
    let processedContent = '';
    let skipFirstHeader = false;
    
    for (let i = 0; i < contentLines.length; i++) {
        const line = contentLines[i];
        
        // 첫 번째 헤더 체크
        if (!skipFirstHeader && line.trim().startsWith('#')) {
            const headerText = line.replace(/^#+\s*/, '').trim();
            // 제목과 정확히 같거나 비슷한 경우 제거
            if (headerText === title || headerText.includes(title) || title.includes(headerText)) {
                skipFirstHeader = true;
                continue; // 이 헤더 라인을 건너뛰기
            }
        }
        
        processedContent += line + '\n';
    }
    
    // 빈 줄 정리
    processedContent = processedContent.replace(/^\s*\n/g, '').trim();
    
    const htmlContent = marked.parse(processedContent);

    return {
        id: filename.replace('.md', ''),
        title: title,
        excerpt: excerpt,
        content: htmlContent,
        date: date,
        category: category,
        tags: tags,
        author: author,
        filename: filename
    };
}

/**
 * 카테고리별 마크다운 파일들을 HTML로 변환
 */
async function convertCategory(category) {
    const categoryDir = path.join(__dirname, 'posts', category);
    const indexPath = path.join(categoryDir, 'index.json');
    
    if (!fs.existsSync(indexPath)) {
        console.log(`index.json not found for ${category}`);
        return;
    }

    const fileList = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const posts = [];

    for (const htmlFilename of fileList) {
        // HTML 파일명에서 마크다운 파일명 추출
        const mdFilename = htmlFilename.replace('.html', '.md');
        const mdPath = path.join(categoryDir, mdFilename);
        
        if (fs.existsSync(mdPath)) {
            const mdContent = fs.readFileSync(mdPath, 'utf8');
            const post = convertMarkdownToHtml(mdContent, mdFilename);
            posts.push(post);
            
            console.log(`✅ Converted: ${category}/${mdFilename}`);
        } else {
            console.log(`❌ Markdown file not found: ${mdPath}`);
        }
    }

    // 날짜순 정렬 (최신순)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // HTML 파일로 저장
    for (const post of posts) {
        const htmlFilename = post.filename.replace('.md', '.html');
        const htmlPath = path.join(categoryDir, htmlFilename);
        
        const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - ZeroFive Blog</title>
    <meta name="description" content="${post.excerpt}">
    <meta name="author" content="${post.author}">
    <meta name="keywords" content="ZeroFive, 개발자, 블로그, 기술, 프로그래밍">
    <meta property="og:title" content="${post.title} - ZeroFive Blog">
    <meta property="og:description" content="${post.excerpt}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://nohyeongo.github.io/posts/${category}/${htmlFilename}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title} - ZeroFive Blog">
    <meta name="twitter:description" content="${post.excerpt}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://nohyeongo.github.io/posts/${category}/${htmlFilename}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../../assets/ico/zerofive_icon.ico">
    <link rel="shortcut icon" href="../../assets/ico/zerofive_icon.ico">
    <link rel="apple-touch-icon" href="../../assets/ico/zerofive_icon.ico">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Prism.js for code highlighting -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-dark.min.css" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="../../css/style.css">
</head>
<body>
    <!-- Navigation Container -->
    <div id="navbar-container"></div>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Blog Section -->
            <section class="blog-section">
                <div class="blog-header">
                    <div class="breadcrumb">
                        <a href="../../index.html">Home</a>
                        <span>/</span>
                        <a href="../../blog/${category}.html">${category === 'devblog' ? 'Dev Blog' : 'Life Blog'}</a>
                        <span>/</span>
                        <span>${post.title}</span>
                    </div>
                </div>
                
                <!-- Post Detail -->
                <div class="post-detail">
                    <div class="post-detail-header">
                        <h1 class="post-title">${post.title}</h1>
                        <div class="post-detail-meta">
                            <span><i class="fas fa-calendar"></i> ${post.date}</span>
                            <span><i class="fas fa-user"></i> ${post.author}</span>
                            <span><i class="fas fa-tag"></i> ${category === 'devblog' ? '개발 블로그' : '라이프 블로그'}</span>
                            <span><i class="fas fa-hashtag"></i> ${post.tags.join(', ')}</span>
                        </div>
                    </div>
                    <div class="post-detail-content">
                        ${post.content}
                    </div>
                    
                    <!-- Comments Section -->
                    <div class="comments-section">
                        <div class="comments-container">
                            <h3 class="comments-title">
                                <i class="fas fa-comments"></i>
                                댓글
                            </h3>
                            <div class="comments-wrapper">
                                <div id="giscus-comments">
                                    <script src="https://giscus.app/client.js"
                                            data-repo="NohYeongO/NohYeongO.github.io"
                                            data-repo-id="R_kgDOP1wrxA"
                                            data-category="General"
                                            data-category-id="DIC_kwDOP1wrxM4Cv1FJ"
                                            data-mapping="pathname"
                                            data-strict="1"
                                            data-reactions-enabled="1"
                                            data-emit-metadata="1"
                                            data-input-position="top"
                                            data-theme="preferred_color_scheme"
                                            data-lang="ko"
                                            data-loading="lazy"
                                            crossorigin="anonymous"
                                            async>
                                    </script>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Footer Container -->
    <div id="footer-container"></div>
    
    <!-- Common Scripts -->
    <script src="../../js/common.js"></script>
</body>
</html>`;

        fs.writeFileSync(htmlPath, htmlTemplate, 'utf8');
        console.log(`📄 Created HTML: ${category}/${htmlFilename}`);
    }
}

/**
 * 블로그 목록 페이지 생성
 */
async function createBlogListPage(category) {
    const categoryDir = path.join(__dirname, 'posts', category);
    const indexPath = path.join(categoryDir, 'index.json');
    
    if (!fs.existsSync(indexPath)) {
        console.log(`index.json not found for ${category}`);
        return;
    }

    const fileList = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const posts = [];

    // 마크다운 파일에서 메타데이터 추출
    for (const htmlFilename of fileList) {
        const mdFilename = htmlFilename.replace('.html', '.md');
        const mdPath = path.join(categoryDir, mdFilename);
        
        if (fs.existsSync(mdPath)) {
            const mdContent = fs.readFileSync(mdPath, 'utf8');
            const post = convertMarkdownToHtml(mdContent, mdFilename);
            
            posts.push({
                title: post.title,
                excerpt: post.excerpt,
                author: post.author,
                filename: htmlFilename,
                date: post.date,
                tags: post.tags,
                category: post.category
            });
        }
    }

    // 날짜순 정렬 (최신순)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 블로그 목록 HTML 생성
    const categoryName = category === 'devblog' ? 'Dev Blog' : 'Life Blog';
    const categoryDescription = category === 'devblog' ? '개발 관련 글들을 모았습니다' : '일상과 경험을 공유합니다';
    
    const blogListHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${categoryName} - ZeroFive Blog</title>
    <meta name="description" content="${categoryDescription}">
    <meta name="author" content="NohYeongO">
    <meta name="keywords" content="ZeroFive, 개발자, 블로그, 기술, 프로그래밍">
    <meta property="og:title" content="${categoryName} - ZeroFive Blog">
    <meta property="og:description" content="${categoryDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://nohyeongo.github.io/blog/${category}.html">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${categoryName} - ZeroFive Blog">
    <meta name="twitter:description" content="${categoryDescription}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://nohyeongo.github.io/blog/${category}.html">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../assets/ico/zerofive_icon.ico">
    <link rel="shortcut icon" href="../assets/ico/zerofive_icon.ico">
    <link rel="apple-touch-icon" href="../assets/ico/zerofive_icon.ico">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Styles -->
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <!-- Navigation Container -->
    <div id="navbar-container"></div>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Blog Section -->
            <section class="blog-section">
                <div class="blog-header">
                    <div class="breadcrumb">
                        <a href="../index.html">Home</a>
                        <span>/</span>
                        <span>${categoryName}</span>
                    </div>
                    <h1 class="blog-title">${categoryName}</h1>
                    <p class="blog-description">${categoryDescription}</p>
                    
                    <!-- Category Tabs -->
                    <div class="category-tabs">
                        <a href="devblog.html" class="category-tab ${category === 'devblog' ? 'active' : ''}">
                            <i class="fas fa-code"></i>
                            Dev Blog
                        </a>
                        <a href="lifeblog.html" class="category-tab ${category === 'lifeblog' ? 'active' : ''}">
                            <i class="fas fa-heart"></i>
                            Life Blog
                        </a>
                    </div>
                </div>
                
                <div class="blog-posts">
                    ${posts.length > 0 ? posts.map(post => `
                        <article class="blog-post-card" onclick="window.location.href='../posts/${category}/${post.filename}'">
                            <div class="post-card-content">
                                <h2 class="post-title">
                                    ${post.title}
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
                    `).join('') : `
                        <div class="empty-state">
                            <i class="fas fa-file-alt"></i>
                            <h3>아직 작성된 글이 없습니다</h3>
                            <p>곧 새로운 글로 찾아뵙겠습니다!</p>
                        </div>
                    `}
                </div>
            </section>
        </div>
    </main>

    <!-- Footer Container -->
    <div id="footer-container"></div>
    
    <!-- Common Scripts -->
    <script src="../js/common.js"></script>
</body>
</html>`;

    // 블로그 목록 HTML 파일 저장
    const blogListPath = path.join(__dirname, 'blog', `${category}.html`);
    
    // blog 디렉토리가 없으면 생성
    const blogDir = path.join(__dirname, 'blog');
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }
    
    fs.writeFileSync(blogListPath, blogListHtml, 'utf8');
    console.log(`📄 Created blog list: blog/${category}.html`);
}

/**
 * 메인 함수
 */
async function main() {
    console.log('🚀 Converting markdown files to HTML...');
    
    const categories = ['devblog', 'lifeblog'];
    
    for (const category of categories) {
        await convertCategory(category);
        await createBlogListPage(category);
    }
    
    console.log('✅ All markdown files converted successfully!');
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { convertMarkdownToHtml, convertCategory };