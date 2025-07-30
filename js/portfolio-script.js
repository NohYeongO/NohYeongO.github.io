// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            if (loading) {
                loading.style.display = 'none';
            }
        }, 3000);
    }
}, 0);

let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    const bars = hamburger.querySelectorAll('.bar');
    if (hamburger.classList.contains('active')) {
        bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        
        if (targetId.startsWith('http://') || targetId.startsWith('https://')) {
            return;
        }
        
        e.preventDefault();
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1e1e2e 100%)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.7)';
        navbar.style.borderBottom = '1px solid rgba(102, 126, 234, 0.4)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1e1e2e 100%)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
        navbar.style.borderBottom = '1px solid rgba(102, 126, 234, 0.3)';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const ideButtons = document.querySelectorAll('.ide-button');
    ideButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });

    const toolbarIcons = document.querySelectorAll('.toolbar-icon');
    toolbarIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 200);
            
            if (icon.classList.contains('run')) {
                showNotification('코드 실행 중...', 'success');
            } else if (icon.classList.contains('debug')) {
                showNotification('디버그 모드 시작', 'info');
            } else if (icon.classList.contains('stop')) {
                showNotification('실행 중지됨', 'warning');
            }
        });
    });

    const tabClose = document.querySelector('.tab-close');
    if (tabClose) {
        tabClose.addEventListener('click', (e) => {
            e.stopPropagation();
            showNotification('파일을 닫을 수 없습니다 😄', 'info');
        });
    }
});

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .journey-card, .sport-item, .skill-item, .stat-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

class ContinuousTypingAnimation {
    constructor(element, cursorElement) {
        this.element = element;
        this.cursor = cursorElement;
        this.isRunning = false;
        this.currentStep = 0;
        
        this.sequence = [
            {
                type: 'type',
                text: 'Backend Developer',
                speed: 80,
                className: 'backend-line'
            },
            {
                type: 'newline',
                delay: 300
            },
            {
                type: 'type',
                text: '노 영 오',
                speed: 120,
                className: 'name-line'
            },
            {
                type: 'pause',
                duration: 2000
            },
            {
                type: 'erase_all',
                speed: 50
            },
            {
                type: 'pause',
                duration: 1000
            }
        ];
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.currentStep = 0;
        this.showCursor();
        this.executeStep();
    }
    
    stop() {
        this.isRunning = false;
        this.hideCursor();
    }
    
    showCursor() {
        if (this.cursor) {
            this.cursor.classList.add('typing');
            this.cursor.classList.remove('hide');
        }
    }
    
    hideCursor() {
        if (this.cursor) {
            this.cursor.classList.remove('typing');
            this.cursor.classList.add('hide');
        }
    }
    
    executeStep() {
        if (!this.isRunning) return;
        
        const step = this.sequence[this.currentStep];
        if (!step) {
            this.currentStep = 0;
            setTimeout(() => this.executeStep(), 500);
            return;
        }
        
        switch (step.type) {
            case 'type':
                this.typeText(step.text, step.speed, step.className);
                break;
            case 'newline':
                this.addNewline(step.delay);
                break;
            case 'pause':
                this.pause(step.duration);
                break;
            case 'erase_all':
                this.eraseAll(step.speed);
                break;
        }
    }
    
    typeText(text, speed, className) {
        let i = 0;
        const span = document.createElement('span');
        span.className = className;
        this.element.appendChild(span);
        
        this.element.classList.add('typing');
        
        const typeChar = () => {
            if (!this.isRunning) return;
            
            if (i < text.length) {
                span.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed + Math.random() * 30);
            } else {
                this.element.classList.remove('typing');
                this.nextStep();
            }
        };
        typeChar();
    }
    
    addNewline(delay = 0) {
        setTimeout(() => {
            if (!this.isRunning) return;
            this.element.appendChild(document.createElement('br'));
            this.nextStep();
        }, delay);
    }
    
    pause(duration) {
        setTimeout(() => {
            if (!this.isRunning) return;
            this.nextStep();
        }, duration);
    }
    
    eraseAll(speed) {
        const allText = this.element.textContent;
        let currentLength = allText.length;
        
        this.element.classList.add('typing');
        
        const eraseChar = () => {
            if (!this.isRunning) return;
            
            if (currentLength > 0) {
                const spans = this.element.querySelectorAll('span');
                const lastSpan = spans[spans.length - 1];
                
                if (lastSpan && lastSpan.textContent.length > 0) {
                    lastSpan.textContent = lastSpan.textContent.slice(0, -1);
                } else if (lastSpan && lastSpan.textContent.length === 0) {
                    lastSpan.remove();
                }
                const brs = this.element.querySelectorAll('br');
                if (brs.length > 0 && Math.random() > 0.7) {
                    brs[brs.length - 1].remove();
                }
                
                currentLength--;
                setTimeout(eraseChar, speed + Math.random() * 20);
            } else {
                this.element.innerHTML = '';
                this.element.classList.remove('typing');
                this.nextStep();
            }
        };
        
        eraseChar();
    }
    
    nextStep() {
        this.currentStep++;
        setTimeout(() => this.executeStep(), 100);
    }
}

let typingAnimation = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const typingDisplay = document.getElementById('typing-display');
        const cursor = document.querySelector('.typing-cursor');
        
        if (typingDisplay && cursor) {
            typingAnimation = new ContinuousTypingAnimation(typingDisplay, cursor);
            typingAnimation.start();
        }
    }, 2500);
});

function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1.05)';
            setTimeout(() => {
                item.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }, index * 100);
    });
}

function animateSportsItems() {
    const sportItems = document.querySelectorAll('.sport-item');
    sportItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1.02)';
            setTimeout(() => {
                item.style.transform = 'translateY(0) scale(1)';
            }, 300);
        }, index * 150);
    });
}

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                animateSportsItems();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    aboutObserver.observe(aboutSection);
}

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        btn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .social-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

function copyEmail() {
    const email = 'your.email@example.com';
    navigator.clipboard.writeText(email).then(() => {
        showNotification('이메일이 클립보드에 복사되었습니다! 📧');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('이메일이 클립보드에 복사되었습니다! 📧');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.querySelector('.social-btn.email');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copyEmail();
        });
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

function throttle(func, wait) {
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

const throttledScrollHandler = throttle(() => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1e1e2e 100%)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.7)';
        navbar.style.borderBottom = '1px solid rgba(102, 126, 234, 0.4)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1e1e2e 100%)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5)';
        navbar.style.borderBottom = '1px solid rgba(102, 126, 234, 0.3)';
    }
    
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 50;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            const currentNavLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (currentNavLink) {
                currentNavLink.classList.add('active');
            }
        }
    });
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .nav-link.active {
        color: #667eea !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 1;
        transition: opacity 0.5s ease;
    }
    
    .loading-text {
        color: white;
        font-size: 2rem;
        font-weight: 700;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// Portfolio Detail Modal
const modal = document.getElementById('portfolioModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.getElementsByClassName('close')[0];

// 포트폴리오 상세 내용
const portfolioDetails = {
    ana: {
        title: 'ANA (충남 지역 해커톤)',
        content: `
            <h3>구름톤 유니브 충남지부 해커톤 프로젝트</h3>
            <p>이번 프로젝트는 구름톤 유니브 충남지부 해커톤에서 진행한 팀 프로젝트입니다. 주제는 "IT 기반의 환경과 문화가 공존하는 천안 만들기"였으며, 이 주제를 바탕으로 기획부터 개발까지 전 과정을 함께했습니다.</p>
            
            <p>팀은 총 5명(디자이너 1명, 프론트엔드 1명, 백엔드 3명)으로 구성되었으며, 저는 백엔드 파트에서 가장 경력이 많았으며 개발을 주도적으로 이끌었습니다.</p>
            
            <p>프로젝트 명 ANA는 <strong>ACT(행동과 실천), NATURE(자연 회복), AGAIN(지역 사회 순환)</strong>의 의미를 담고 있으며, AI 기반 자동 미션 생성과 시민 참여형 미션 수행, 소상공인 매장에서 사용할 수 있는 포인트 제공 기능을 중심으로 한 애플리케이션을 개발했습니다.</p>
            
            <p>일반적인 해커톤이 짧은 시간 안에 결과물을 만들어야 하는 구조라면, 이번 해커톤은 3주의 개발 기간이 주어져 상대적으로 여유가 있었고, 저희 팀은 이를 기회로 삼아 코드 품질과 완성도 향상을 핵심 목표로 설정했습니다.</p>
            
            <h3>팀원의 실력을 고려한 개발 진행</h3>
            <p>이번 프로젝트에서는 처음 개발을 접한 팀원 1명과 개발 경력 8개월 차의 팀원 2명과 함께 협업하게 되었습니다.</p>
            
            <p>저는 "아무리 좋은 아키텍처와 기술이 있어도, 팀원이 이해하지 못하면 무용지물"이라고 생각해왔습니다. 아무리 멋진 코드라도 제대로 작동하지 않으면 의미가 없다고 믿습니다.</p>
            
            <p>그래서 이번 프로젝트에서는 복잡한 설계나 기술보다, 기본에 충실하고 팀원 모두가 이해할 수 있는 방식으로 개발을 진행했습니다.</p>
            
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;"><strong style="color: #667eea;">구조는 단순하게</strong> Controller, Service, Repository 계층만 나누었고</li>
                <li style="margin-bottom: 8px;"><strong style="color: #667eea;">API 명세도 Swagger 대신 Notion을 활용</strong>해 작성했습니다</li>
            </ul>
            
            <p>Swagger가 익숙하지 않은 팀원들이 오히려 부담을 느끼는 모습을 보고, Notion에 Request/Response, Http Method, 상태 코드, 파라미터 설명 등을 꼼꼼하게 정리해 모두가 쉽게 이해하고 참조할 수 있는 방식을 선택했습니다.</p>
            
            <p>그리고 Pull Request 리뷰를 적극 활용해, 제가 알고 있는 내용을 설명하고 팀원들이 자연스럽게 학습할 수 있도록 돕는 데 집중했습니다. 단순히 빠르게 개발하는 것이 아니라, 함께 성장하는 개발을 지향했습니다.</p>
            
            <p>그 결과, 해커톤에서 유일하게 모든 기획 API를 완성하고, 프론트엔드와 완벽하게 연동된 결과물을 만들 수 있었습니다.</p>
            
            <h3>Redis 캐싱 전략</h3>
            <p>저는 ANA 프로젝트에서 사용자의 미션 조회 및 제출 기능을 담당하며, 단순 CRUD를 넘어서 사용자 경험을 고려한 개발을 지향했습니다.</p>
            
            <p>미션 조회 기능에는 두 가지 주요 흐름이 존재합니다:</p>
            <ol style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;">사용자가 주간/일일 미션을 선택한 경우</li>
                <li style="margin-bottom: 8px;">아직 선택하지 않아, 미션 테이블에서 랜덤하게 미션을 추천해주는 경우</li>
            </ol>
            
            <p>여기서 발생한 문제는, 사용자가 마음에 들지 않는 미션이 나올 경우 새로고침을 통해 계속 다른 미션을 받을 수 있다는 점이었습니다.</p>
            
            <p>처음에는 조회 시 DB에 바로 저장하는 방식도 고려했지만, 일일 미션은 자정, 주간 미션은 일요일 자정에 삭제되어야 해서 추가적인 스케줄러 로직이 필요했습니다. 이 접근은 불필요한 DB I/O가 발생할 수 있습니다.</p>
            
            <p>그래서 저는 <strong>Redis를 활용한 캐싱 전략</strong>을 선택했습니다:</p>
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;">최초 미션 조회 시, Redis에 userId를 키로 하는 데이터를 저장하고</li>
                <li style="margin-bottom: 8px;">TTL(Time to Live) 설정을 통해 일일/주간 단위로 자동 만료되도록 구성했습니다</li>
            </ul>
            
            <p>예를 들어, 일일 미션은 자정까지 TTL을 설정하고, 주간 미션은 일요일 자정까지 TTL을 지정했습니다.</p>
            
            <p>이 전략을 통해, 새로 고침을 하더라도 같은 미션이 유지되어 일관된 사용자 경험을 제공하고, DB 접근 없이 메모리 기반으로 빠르게 응답함으로써 성능 최적화도 달성할 수 있었습니다.</p>
            
            <p>이러한 Redis 기반 캐싱 전략은 사용자 행동 패턴에 대응하면서도, 시스템 효율성과 경험의 안정성을 모두 만족하게 할 수 있는 좋은 해결책이 되었다고 생각합니다.</p>
            
            <h3>비동기 처리와 캐싱 적용</h3>
            <p>메인 페이지에서는 사용자 정보와 함께 사용자가 수행 중인 일일/주간 미션을 함께 조회해야 했습니다. 하지만 해당 데이터는 사용자가 요청할 때마다 DB를 매번 조회하고 있어, 불필요한 IO 비용이 발생하고 있었습니다.</p>
            
            <p>이를 개선하기 위해 기존에 구현했던 Redis 캐시 전략을 적용했고, 추가로 더 최적화할 수 있는 방안을 고민했습니다:</p>
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;">TTL이 긴 주간 미션은 모든 서버가 공유할 수 있도록 Redis에 저장</li>
                <li style="margin-bottom: 8px;">TTL이 짧은 일일 미션은 서버 인메모리 캐시(Caffeine)를 사용해 조회 성능을 더욱 향상</li>
            </ul>
            
            <p>이렇게 상황에 따라 Redis와 Caffeine을 병행 적용하는 캐시 전략을 도입했습니다.</p>
            
            <p>그리고 미션 조회 로직이 동기적으로 실행되는 점을 조금 더 빠르게 조회할 수 있는 방법을 고민했고, <strong>CompletableFuture를 활용해 일일/주간 미션을 비동기 처리</strong>하도록 개선했습니다.</p>
            
            <p>하지만 캐싱 도입 후 예상치 못한 문제도 발생했습니다. 미션 제출 시 status가 변경되는데 캐시된 데이터가 갱신되지 않아 상태값이 그대로인 문제가 발생했습니다. 이 문제는 미션을 제출할 때 캐시를 삭제하는 로직을 통해 처리함으로써 해결할 수 있었습니다.</p>
        `
    },
    ecommerce: {
        title: 'E-Commerce 개인 프로젝트',
        content: `
            <h3>🧪 Testcontainers와 단위 테스트를 활용한 안정성 향상</h3>
            <p>해당 프로젝트에서는 모든 주요 기능에 대해 단위 테스트를 작성하여, 코드 수정 시마다 테스트를 통해 오류를 빠르게 검출하고 수정하며 개발을 진행했습니다. 이를 통해 코드의 안정성을 높이고, 수정에 소요되는 시간을 줄일 수 있었습니다.</p>
            
            <p>특히 프로젝트 초기에는 "어떤 기능까지 단위 테스트를 작성해야 할까?", "외부 의존성이 있는 로직도 테스트 대상에 포함해야 할까?" 등 단위 테스트의 적절한 범위와 깊이에 대한 고민이 많았습니다. 이런 과정을 거치며 테스트 대상을 정하고 의미없는 테스트를 지향하고자 했습니다.</p>
            
            <p>그리고, 테스트 환경이 로컬에 종속되어 있어 다른 컴퓨터로 작업을 진행할때 테스트가 실행되지 않는 문제를 겪기도 했습니다. 이를 해결하기 위해 <strong>Testcontainers</strong>를 도입했고, Docker 기반으로 데이터베이스 및 필요한 환경을 테스트 시 자동으로 구성함으로써 어느 환경에서도 일관된 테스트가 가능하도록 개선했습니다.</p>
            
            <h3>🔒 주문 시 발생하는 데드락 개선 (데드락 테스트 및 해결)</h3>
            <p><a href="https://zerofive.tistory.com/9" target="_blank" style="color: #667eea; text-decoration: none; font-weight: 600;">📝 블로그 포스트 보기</a></p>
            
            <p>해당 프로젝트에서는 주문 요청 시, 먼저 상품의 재고를 조회한 후 재고를 차감하고, 이어서 사용자의 잔고를 차감하는 순서로 로직이 구성되어 있었습니다. 동시 주문 시 발생할 수 있는 동시성 이슈를 해결하기 위해 <strong>비관적 락</strong>을 도입했고, 이를 통해 재고 차감 시 데이터 충돌을 방지할 수 있었습니다.</p>
            
            <p>그러나 실제 운영 상황을 가정해보며, 비관적 락에서 데드락이 발생할 수 있다는 피드백을 받았고, 이에 대해 직접 데드락 상황을 유도하는 테스트 코드를 작성하여 실험을 진행했습니다. 테스트 결과 실제로 데드락이 발생하는 상황이 확인되었고, 특이하게도 한 스레드는 정상적으로 주문이 처리되는 현상을 발견했습니다.</p>
            
            <p>확인 결과 <strong>MySQL에서는 데드락이 감지되면 내부적으로 한 트랜잭션만 롤백시키고, 다른 하나는 정상 처리하는 정책</strong>을 사용한다는 점을 새로 알게 되었습니다.</p>
            
            <p>하지만 모든 주문 요청에 대해 안정적으로 처리되도록 하기 위해, 근본적인 데드락 방지 방안을 고민하였고, ProductId 목록이 여러 개일 경우 각 스레드가 조회하는 순서가 달라 데드락이 발생했기 때문에, 이를 해결하기 위해 <strong>Service Layer에서 ProductId 리스트를 정렬한 후 모든 스레드가 순차적으로 조회</strong>하도록 코드를 수정했고, 다시 테스트를 진행한 결과 데드락이 발생하지 않는 것을 확인할 수 있었습니다.</p>
            
            <h3>⚡ Redis를 활용한 캐싱 전략</h3>
            <p>해당 프로젝트에서는 판매 상위 5개 제품을 조회하는 기능이 있었고, 수많은 데이터 중 상위 5개만 추출하는 과정에서 쿼리 성능 저하 문제가 발생했습니다. 이를 개선하기 위해 고민했고, 분석 결과 해당 데이터는 실시간 갱신이 필요하지 않고, 하루에 한 번만 업데이트해도 충분하다는 판단을 내렸습니다.</p>
            
            <p>이에 따라, <strong>사용자가 적은 새벽 00시에 스케줄러를 통해 상위 5개 제품을 조회하고, Redis에 캐싱</strong>하는 방식으로 개선하였습니다. 이후 사용자가 해당 기능을 이용할 때는 DB가 아닌 Redis에서 데이터를 조회하도록 변경하여 빠르고 안정적인 응답 속도를 확보할 수 있었습니다.</p>
            
            <p>하지만 Redis는 메모리 기반 저장소이기 때문에 데이터가 사라질 수 있는 휘발성 문제도 함께 고려했습니다. 이를 대비하여, <strong>Redis에 캐싱된 데이터가 없을 경우 자동으로 DB에서 데이터를 조회하고 다시 캐싱하는 백업 로직</strong>도 함께 구현하였습니다.</p>
            
            <h3>📊 K6, InfluxDB, Grafana를 통한 모니터링 시스템 구축</h3>
            <p>해당 프로젝트에서는 <strong>K6를 활용해 부하 테스트를 진행하고, 성능 데이터를 InfluxDB에 저장한 후, Grafana를 통해 시각화</strong>하는 모니터링 시스템을 구축하였습니다. 이를 통해 각 API의 응답 시간, 처리량, 성공률 등 핵심 성능 지표를 수집하고, 실시간으로 확인할 수 있는 대시보드를 구성했습니다.</p>
            
            <p>이 모니터링 시스템을 기반으로 개발한 기능들을 테스트한 결과, <strong>Redis를 활용한 캐싱 로직의 조회 성능이 확연히 개선</strong>되었음을 확인할 수 있었고, 각 기능별 병목 구간을 시각적으로 파악하는 데에도 큰 도움이 되었습니다.</p>
            
            <p>단순한 성능 테스트를 넘어서, 실제 데이터 기반으로 병목 현상을 사전에 인지하고 개선할 수 있는 환경을 마련함으로써, 개발 생산성과 서비스 안정성 모두를 향상시킬 수 있었습니다. 이 경험을 통해, 운영 환경에서도 이러한 모니터링 시스템이 매우 유용하다는 점을 체감하게 되었습니다.</p>
        `
    },
    zariyo: {
        title: 'Zariyo (콘서트 예약 시스템)',
        content: `
            <h3>웹사이트 안정성을 위한 대기열 시스템</h3>
            <p>Zariyo 프로젝트에서는 인기 공연오픈과 같이 트래픽이 급증하는 상황에서 웹사이트에 사용자가 몰리더라도 서버가 안정적으로 요청을 처리하고, 선착순 원칙에 따라 사용자에게 공정하게 입장 기회를 제공해야 했습니다. 동시에 시스템 과부하로 인한 서버 다운을 방지하고, 사용자에게 실시간 순번 정보를 제공하는 기능도 중요했습니다. 이러한 목적을 달성하기 위해, 대기열 시스템을 직접 설계하고 네 번에 걸쳐 구조적으로 리팩토링하며 기능을 개선했습니다. 각 리팩토링은 단순 기능 변경이 아니라 사용자 경험, 시스템 성능, 유지보수성, 확장성을 다각도로 고려하여 진행되었습니다.</p>
            
            <h3>1) WebSocket과 Redis ZSET을 활용하여 실시간 대기열 시스템 구축</h3>
            <p>초기 구현은 놀이공원처럼 초당 일정 인원만 입장시키는 구조로, Redis ZSET을 사용하여 사용자의 토큰을 정렬된 형태로 저장하고 WebSocket을 통해 사용자에게 실시간 순번을 전달하는 방식이었습니다. 사용자는 STOMP를 통해 /sub/queue/{token} 채널을 구독하고, 서버에서는 대기열 순번이 바뀔 때마다 실시간으로 메시지를 발송했습니다.</p>
            
            <p>이 구조는 실시간 전달이라는 사용자 경험 측면에서는 장점이 있었지만, 몇 가지 중요한 문제가 발견되었습니다. 첫째, 트래픽이 몰리지 않는 상황에서는 바로 입장되며, 몰릴 경우에는 대기열이 작동되므로 입장 순서가 보장되지 않는 구조였습니다. 둘째, WebSocket 연결은 항상 유지되어야 하며, 사용자 수가 많아질수록 커넥션 풀 자원이 급속도로 소모되어 성능 저하와 웹소켓 연결을 할 수 없는 위험성이 존재했습니다. 셋째, 입장 처리를 스케줄러가 담당했지만, 분산 환경에서 여러 서버 인스턴스가 동시에 실행될 경우 중복 실행에 문제점이 예상 되었습니다.</p>
            
            <h3>2) 실시간성보다 유지보수성과 안정성을 우선시하며 HTTP Polling 방식으로 구조로 전환</h3>
            <p>실제 사용자 경험을 바탕으로 실시간 순번 전송이 필수는 아니라고 판단했습니다. 일반적으로 사용자는 수초 내에 순번이 바뀌는 것을 민감하게 느끼기보다는, "현재 내 순번이 어디쯤인가"를 간헐적으로 확인할 수 있는 기능이면 충분하다고 생각했습니다. 이에 따라 WebSocket 방식에서 HTTP Polling 방식으로 리팩토링을 진행했고, 동시에 성능과 데이터 정합성을 보장하기 위한 구조 개선도 함께 이루어졌습니다.</p>
            
            <p>Redis의 ZSET은 ZRANK 명령어로 순번을 조회할 수 있지만, 삽입 시 O(logN)의 시간 복잡도를 가지고 있어 수천 명의 대기열이 형성될 경우 조회 성능에 최선의 방식이 아니라고 판단해 개선작업을 진행했습니다. ZSET 대신 LIST 자료구조를 사용하고, 대기열 진입 시 LPUSH, 나갈 때 RPOP을 수행하며 O(1)의 성능을 확보했습니다. 하지만 LIST에서는 특정 토큰의 순서를 조회하기 위해 리스트를 탐색해야 하는데 이때 O(N) 연산이 필요했기 때문에, 이를 개선하기 위해 PUSH_COUNT와 EXIT_COUNT라는 카운터 키를 Redis에 저장하고, entryNumber(PUSH_COUNT) - EXIT_COUNT 계산을 통해 현재 순번을 O(1)로 구할 수 있는 방식을 생각해 구현했습니다.</p>
            
            <p>단, Redis는 단일 스레드 구조이기 때문에 정합성은 보장 할 수 있지만 순서를 보장하지는 않기 때문에 LPUSH 이후 INCRBY가 순서 보장을 받지 못하는 문제가 예상 되었습니다. 이 부분을 해결하기 위해 Lua 스크립트를 사용해 두 연산을 원자적으로 처리했고, 정확한 순번 반환이 가능해졌습니다. 이 방식으로 실시간성보다는 빠르고 정확한 순서반환을 할 수 있었고, 복잡한 WebSocket 구조 대신 HTTP Polling을 사용함으로써 추후 유지보수성 향상에 초점을 맞춰 대기열 시스템을 구축했습니다.</p>
            
            <h3>3) 시스템 모듈의 책임을 분리하여 유지보수성 강화를 시도</h3>
            <p>현재 구조에서는 큐 모듈이 토큰을 발급하고, 서버의 여유 여부에 따라 사용자에게 OPEN 또는 WAITING 상태를 판단해 응답까지 내려주면 OPEN 상태일 경우 메인 모듈에 진입할 수 있는 구조였습니다. 하지만 이 구조는 메인 모듈(서비스 진입)에 입장하는 모든 기능을 큐 모듈(대기열 관리)에서 관리를 하게 되면서 경계를 모호하게 만든다고 생각했고, 메인 모듈에서 토큰 발급과 입장가능 여부에 역할을 수행해 준다면 모듈간 역할 분리와 코드에 가독성을 높이고 유지보수성 향상이라는 결과를 가져올 수 있을거라 판단했습니다.</p>
            
            <p>이에 따라 리팩토링을 통해 메인 모듈은 오직 입장 가능 여부 판단과 토큰 발급만 담당하고, 큐 모듈은 대기열 추가와 순번 반환 등 대기열 자체에 대한 책임만 가지도록 역할을 명확히 분리했습니다. 사용자가 웹사이트에 접근하면, 메인 모듈이 Redis에 저장된 현재 접속 인원 수를 확인하고 입장이 가능하다면 OPEN 상태의 토큰을 발급하며, 그렇지 않으면 WAITING 응답을 내려준 후, 클라이언트는 큐 모듈의 대기열 진입 API를 호출하는 흐름입니다.</p>
            
            <p>하지만 이렇게 책임을 분리하자 새로운 문제가 생겼습니다. 사용자가 이탈하거나 서버 인스턴스가 늘어나면서 입장 가능 인원이 생길 경우, 메인 모듈이 큐 모듈에 "지금 몇 명 입장시켜도 된다"는 신호를 보내야 하고, 큐 모듈은 그 수만큼 대기열에서 토큰을 꺼내 다시 메인 모듈로 전달해야 합니다. 두 모듈 간 직접 통신이 어려운 구조였기에 Redis 메시징 기능을 도입하기로 결정했습니다.</p>
            
            <p>처음에는 Pub/Sub을 사용해 메인 모듈이 입장 가능 인원을 큐 모듈에 알리도록 했습니다. 그러나 Pub/Sub은 모든 구독자에게 동일한 메시지를 전파하므로, 큐 모듈 인스턴스가 여러 개일 경우 동일 토큰을 중복 처리하는 문제가 생길 수 있었습니다. 이를 방지하기 위해 단일 소비자에게만 메시지를 전달할 수 있는 Redis Stream의 Consumer Group 구조로 변경했습니다. Stream은 메시지를 순서대로 처리하며, 연결이 끊겨도 데이터가 유지되기 때문에 안정성과 확장성 측면에서 더 유리했습니다.</p>
            
            <p>입장 절차는 다음과 같습니다:</p>
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;">큐에 처음 진입한 사용자가 entryNumber 1일 경우, 큐 모듈이 Pub/Sub으로 "start" 메시지를 발송</li>
                <li style="margin-bottom: 8px;">메인 모듈은 해당 메시지를 수신하고 입장 스케줄러를 실행</li>
                <li style="margin-bottom: 8px;">이후 주기적으로 Redis Stream을 통해 "현재 입장 가능한 인원 수"를 큐 모듈에 전달</li>
                <li style="margin-bottom: 8px;">큐 모듈은 대기열에서 해당 수만큼 토큰을 pop하여 Stream으로 다시 메인 모듈에 전달</li>
                <li style="margin-bottom: 8px;">메인 모듈은 받은 토큰들을 main Redis에 등록하고 해당 사용자 입장을 허용</li>
            </ul>
            
            <p>여기서 성능 병목이 예상되었습니다. 입장 가능한 인원이 수십, 수백 명일 경우, 토큰을 하나씩 Stream에 추가하면 네트워크 I/O와 Redis 처리량에 부담이 되기 때문입니다. 이를 해결하기 위해 Redis 파이프라인을 적용해 토큰을 한 번에 처리하고 성능을 최적화했습니다.</p>
            
            <p>개발 단계에서 기술적으로 많은 기술을 도입해 성능 개선을 진행했고 역할 분담과 비동기 처리 측면에서 나쁘지 않은 구조라고 생각했지만, 실제로 구현을 마친 뒤 생각은 얻을 수 있는 이점에 비해 구조의 복잡성이 지나치게 커졌다는 생각을 하게 됐습니다. 무엇보다 역할 분리를 통해 코드 가독성을 높이고 유지보수성을 향상해보자는 초기 구상에 적합하지 않는 구조라는 생각이 들었습니다. 밑에 문제점을 분석해 정리해 보았습니다:</p>
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;">모듈간의 I/O 작업이 추가적으로 생겨 많은 트래픽을 안전하게 처리해야하는 현재 상황에 병목구간을 제공해버렸고, 최적화 하는 과정에서 다양한 기술이 얽히며 코드의 복잡도가 급격히 증가했습니다.</li>
                <li style="margin-bottom: 8px;">메인 모듈에 모든 판단과 제어 로직이 집중되어 큐 모듈의 역할이 과도하게 축소되었으며, 눈에 보이는 성능이나 구조적인 이점이 없어, 과도한 설계(오버엔지니어링)와 부적합한 리펙토링 과정이라는 결론에 도달했습니다.</li>
            </ul>
            
            <p>결국 이 구조는 실제 배포에는 적용하지 않았고, 학습용 시도에 그쳤습니다. 하지만 Redis Stream과 Consumer Group, 파이프라인, 그리고 모듈 간 통신 방식에 대해 실제로 설계하고 실험해본 경험이 다음에 보다 복잡한 분산 시스템을 설계할 때 중요한 기반이 될 수 있을 것이라고 생각합니다.</p>
            
            <h3>4) Redis 기반 대기열 시스템 최종 구현</h3>
            <p>지속적인 구조 개선과 성능 최적화 끝에, 대기열 관련 기능을 큐 모듈에서 통합적으로 관리하는 최종 구조를 완성했습니다. 마지막 단계에서는 특히 입장 스케줄러의 효율적인 실행 방식과 사이트를 이탈한 회원의 토큰을 안정적으로 삭제하는 메커니즘을 확립하는 데 집중했습니다.</p>
            
            <p>우선 입장 스케줄러는 애플리케이션 실행과 동시에 단일 스레드가 자동으로 작동하도록 설계했습니다. 이를 위해 @EventListener(ApplicationReadyEvent.class)를 활용하여 서버 시작 시 스케줄러 스레드가 즉시 실행되도록 구성했습니다. 이전까지는 매 요청마다 스레드를 생성하여 입장을 처리했으나, 이 방식은 구조적 복잡성과 자원 낭비가 발생한다는 단점이 있었습니다. 따라서 하나의 스레드를 지속적으로 입장 처리에만 활용하는 방식이 성능과 유지보수 측면에서 더 낫다고 판단했습니다.</p>
            
            <p>또한 분산 서버 환경에서는 스케줄러가 여러 인스턴스에서 동시에 실행되는 문제가 생길 수 있기 때문에, 이를 방지하기 위해 Redisson의 RedLock을 적용했습니다. 이를 통해 서버 인스턴스 간 동기화 문제를 해결해, 스케줄러의 중복 입장 없이 안전하게 처리할 수 있도록 했습니다.</p>
            
            <p>다음으로 고민한 것은, 사이트를 이탈한 회원의 토큰을 어떻게 안정적으로 정리할 것인가였습니다. 기존에는 Redis TTL을 설정하고, API 요청마다 TTL을 갱신하는 방식이었지만, TTL 기반 삭제는 시점을 예측하기 어렵고 추후 데이터 수치화나 모니터링 시스템 도입에도 어려움이 있다고 생각했습니다.</p>
            
            <p>그래서, 입장 스케줄러와 유사한 방식의 삭제 전용 스케줄러를 별도로 구성하여, 하나의 스레드가 일정 주기로 만료된 토큰을 직접 삭제하도록 개선했습니다.</p>
            
            <p>각 토큰은 main:{token} 형식의 키로 Redis에 저장되며, 값에는 토큰 생성 시각의 타임스탬프를 기록합니다. 삭제 스케줄러는 현재 시간과 비교하여 만료된 토큰을 식별하고 제거합니다.</p>
            
            <p>그러나 main:* 패턴으로 키를 검색하려면 Redis의 KEYS 명령어를 사용해야 하는데, 이는 성능에 악영향을 주기 때문에 Redis 공식 문서에서도 사용이 권장되지 않습니다.</p>
            
            <p>대안으로 선택한 방식은, 토큰을 Redis에 저장할 때 별도로 MAIN_TOKEN_SET_KEY를 사용해 Set 자료구조에 토큰 값을 함께 저장하는 것입니다. 삭제 스케줄러는 SCAN 명령어를 통해 이 Set을 커서 기반으로 순회하며 토큰 목록을 조회하고, 각 토큰의 main:{token} 키를 통해 저장된 타임스탬프를 비교해 만료된 토큰만 제거하는 구조로 설계하였습니다.</p>
            
            <p>이 방식은 삭제 처리에 고성능이 필수적인 작업이 아니며, 단일 스레드로도 충분히 안정적으로 작동한다는 점에서 적합하다고 판단했고, Set을 별도로 운용함으로써 키 검색의 효율성과 확장성을 동시에 확보할 수 있었습니다.</p>
            
            <p>마지막으로, 보안 측면에서도 대기열 시스템을 강화하기 위해, 메인 모듈에 필터를 적용해 모든 HTTP 요청의 X-QUEUE-TOKEN 헤더 값을 검증했습니다. 이 토큰이 Redis에 저장된 OPEN 상태의 유효한 토큰일 경우에만 서비스에 접근할 수 있도록 제어함으로써, 사용자가 대기열을 우회해 직접 진입하는 보안 허점을 차단했습니다.</p>
            
            <p>다양한 아이디어 실험과 구조적 리팩토링을 반복하며 문제를 단계적으로 해결해 나갔고, 그 결과 사용자 경험은 물론 확장성과 유지보수까지 고려한 안정적인 대기열 시스템을 완성할 수 있었습니다.</p>
            
            <h3>콘서트 조회 속도 개선을 위한 캐싱 전략 설계</h3>
            <p>콘서트 조회 기능을 만들면서, 어떻게 하면 사용자에게 더 빠른 응답을 제공할 수 있을지 고민했습니다. 기본적으로는 사용자가 원하는 공연을 쉽게 찾을 수 있도록 카테고리별 조회와 공연 임박순, 최신 등록순, 예약 인기순 등의 필터링 기능을 제공했으며, 페이징 처리를 위해 Pageable을 사용해 페이지당 10개의 공연 정보를 조회하도록 구성했습니다.</p>
            
            <p>하지만 단순한 필터링만으로는 부족하다고 생각했고, 조회 속도를 높이기 위한 캐싱 전략을 도입했습니다. 캐시 전략은 데이터의 특성과 접근 빈도를 기준으로 Caffeine(Local Cache)과 Redis(Cache Server)를 적용했습니다.</p>
            
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;"><strong style="color: #667eea;">Caffeine (로컬 캐시)</strong><br>자주 조회되는 콘서트 목록과 TTL이 짧은 데이터인 예약 가능 좌석 정보에 적용해, 인메모리 기반의 빠른 응답을 제공했습니다.</li>
                <li style="margin-bottom: 8px;"><strong style="color: #667eea;">Redis (분산 캐시)</strong><br>데이터 크기가 크고 TTL이 긴 콘서트 상세 정보와 전체 좌석 정보는 Redis에 캐싱했습니다. 다만, Redis 메모리 사용량을 고려해 2KB 이상의 객체는 Gzip으로 압축하여 직렬화 후 저장함으로써 메모리 낭비를 최소화했습니다.</li>
            </ul>
            
            <p>추가로, 성능 병목을 줄이기 위해 CompletableFuture를 활용한 비동기 처리도 함께 도입했습니다. 많은 조회 트래픽이 동시에 발생할 경우 Tomcat 스레드 풀이 고갈될 수 있는데, 이 문제를 방지하기 위해 워커 스레드를 통해 병렬 처리하고, 사용자에게 빠른 응답을 유지할 수 있도록 구성했습니다.</p>
            
            <p>캐시 무효화 전략도 데이터 성격에 맞춰 설계했습니다:</p>
            <ul style="margin-left: 20px; line-height: 1.8;">
                <li style="margin-bottom: 8px;">좌석 예약 가능 상태는 정확성이 가장 중요하므로, TTL을 3초로 설정해 실시간성과 정확도를 확보했습니다.</li>
                <li style="margin-bottom: 8px;">콘서트 목록과 상세 정보는 변동이 적기 때문에 24시간마다 스케줄러를 통해 캐시를 자동 삭제하고 재생성하는 방식으로 구현했습니다.</li>
            </ul>
            
            <p>이처럼, 비동기 처리와 계층별 캐싱 전략을 함께 도입함으로써, 조회 트래픽이 많은 상황에서도 빠른 응답성과 안정성을 유지하는 콘서트 조회 시스템을 완성할 수 있었습니다.</p>
        `
    }
};

// 모달 열기 - 개선된 버전
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('portfolio-detail')) {
        e.preventDefault();
        const projectType = e.target.getAttribute('data-project');
        
        const detail = portfolioDetails[projectType];
        
        if (detail && modal && modalContent) {
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h2 class="modal-title">${detail.title}</h2>
                    <span class="close" id="modalCloseBtn">&times;</span>
                </div>
                <div class="modal-body">
                    ${detail.content}
                </div>
            `;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // 새로 생성된 닫기 버튼에 이벤트 추가
            const newCloseBtn = document.getElementById('modalCloseBtn');
            if (newCloseBtn) {
                newCloseBtn.onclick = function() {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
        }
    }
});

// 모달 닫기
if (closeBtn) {
    closeBtn.onclick = function() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// 모달 외부 클릭시 닫기
window.onclick = function(event) {
    if (event.target == modal && modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}); 