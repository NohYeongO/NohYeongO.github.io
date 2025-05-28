// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Loading Screen - Simple and Reliable
setTimeout(() => {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}, 2000); // 2초 후 무조건 제거

// Easter Egg - Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger bars
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

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Reset hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Reset hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
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

// Navbar scroll effect
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

// IDE Button Click Effects
document.addEventListener('DOMContentLoaded', () => {
    // IDE Control Buttons
    const ideButtons = document.querySelectorAll('.ide-button');
    ideButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Toolbar Icons
    const toolbarIcons = document.querySelectorAll('.toolbar-icon');
    toolbarIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            icon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, 200);
            
            // Special effects for specific icons
            if (icon.classList.contains('run')) {
                showNotification('코드 실행 중...', 'success');
            } else if (icon.classList.contains('debug')) {
                showNotification('디버그 모드 시작', 'info');
            } else if (icon.classList.contains('stop')) {
                showNotification('실행 중지됨', 'warning');
            }
        });
    });

    // File Tab Close Button
    const tabClose = document.querySelector('.tab-close');
    if (tabClose) {
        tabClose.addEventListener('click', (e) => {
            e.stopPropagation();
            showNotification('파일을 닫을 수 없습니다 😄', 'info');
        });
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Konami Code detection
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
});

// Utility Functions
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
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .journey-card, .sport-item, .skill-item, .stat-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 연속 타이핑 애니메이션 시스템
class ContinuousTypingAnimation {
    constructor(element, cursorElement) {
        this.element = element;
        this.cursor = cursorElement;
        this.isRunning = false;
        this.currentStep = 0;
        
        // 애니메이션 시퀀스 정의
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
            // 시퀀스 완료, 처음부터 다시 시작
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
        
        // 타이핑 효과 추가
        this.element.classList.add('typing');
        
        const typeChar = () => {
            if (!this.isRunning) return;
            
            if (i < text.length) {
                span.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed + Math.random() * 30); // 자연스러운 속도 변화
            } else {
                // 타이핑 완료
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
        
        // 지우기 효과 추가
        this.element.classList.add('typing');
        
        const eraseChar = () => {
            if (!this.isRunning) return;
            
            if (currentLength > 0) {
                // 마지막 문자 제거
                const spans = this.element.querySelectorAll('span');
                const lastSpan = spans[spans.length - 1];
                
                if (lastSpan && lastSpan.textContent.length > 0) {
                    lastSpan.textContent = lastSpan.textContent.slice(0, -1);
                } else if (lastSpan && lastSpan.textContent.length === 0) {
                    lastSpan.remove();
                }
                
                // br 태그도 제거
                const brs = this.element.querySelectorAll('br');
                if (brs.length > 0 && Math.random() > 0.7) {
                    brs[brs.length - 1].remove();
                }
                
                currentLength--;
                setTimeout(eraseChar, speed + Math.random() * 20);
            } else {
                // 모든 내용 완전 삭제
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

// 기존 타이핑 관련 함수들 제거하고 새로운 시스템으로 교체
let typingAnimation = null;

// 페이지 로드 시 연속 타이핑 애니메이션 시작
document.addEventListener('DOMContentLoaded', () => {
    // 로딩 화면이 끝난 후 타이핑 애니메이션 시작
    setTimeout(() => {
        const typingDisplay = document.getElementById('typing-display');
        const cursor = document.querySelector('.typing-cursor');
        
        if (typingDisplay && cursor) {
            typingAnimation = new ContinuousTypingAnimation(typingDisplay, cursor);
            typingAnimation.start();
        }
    }, 2500); // 로딩 화면이 끝나고 0.5초 후 시작
});

// Dynamic skill progress animation
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

// Sports items animation
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

// Trigger animations when about section is visible
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

// Project card hover effects
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Social button click effects
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Create ripple effect
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

// Add ripple effect CSS
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

// Email copy functionality
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

// Add click event to email button
document.addEventListener('DOMContentLoaded', () => {
    const emailBtn = document.querySelector('.social-btn.email');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copyEmail();
        });
    }
});

// Resize handler for responsive adjustments
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Reset hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Performance optimization - Throttle scroll events
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

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Navbar scroll effect
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
    
    // Active navigation link highlighting
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
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Add CSS styles
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