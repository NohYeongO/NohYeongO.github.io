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
        title: 'Zariyo 콘서트 예약 시스템',
        content: `
            <h3>대기열 시스템 설계</h3>
            <p>Zariyo 프로젝트에서는 웹사이트 접속 트래픽이 급증하는 상황에서도 안정적으로 사용자 요청을 처리할 수 있도록 대기열 시스템을 설계했습니다.</p>
            
            <p>빠른 응답 속도를 유지하면서도 사용자에게 실시간 순번 정보를 제공하는 것을 목표로 삼았고, 이를 위해 HTTP 폴링 방식과 웹소켓 기반 방식 두 가지를 실제로 구현하고 비교하며 개발을 진행했습니다.</p>
            
            <p>개발 과정에서는 사용자 경험, 유지보수, 시스템 성능 사이에서 균형을 맞추기 위해 여러 구조적 고민을 진행했고, 총 4번의 리팩토링을 거치며 기능을 완성했습니다.</p>
            
            <p>각 리팩토링은 단순 기능뿐만 아니라, 모듈 간 책임 분리, 분산 환경 대응, Redis 최적화와 같은 실제적인 문제 해결을 염두에 두고 진행했습니다. 아래는 그 개선 흐름에 대한 정리입니다.</p>
            
            <h3>1) 실시간 순번 반환을 위한 WebSocket 기반 대기열 설계</h3>
            <p>처음에는 대기열 시스템을 놀이공원 입장 방식처럼, 초당 일정 인원(예: 5~10명)을 입장시키는 형태로 만들고자 했습니다. 대기열 생성 기준은 토큰 발급 요청이 있을 때마다 현재 시간의 초(LocalTime.now().getSecond()) 값을 Redis의 키로 사용하고, INCR 명령어로 초당 요청 수(RPS)를 늘려 임계값을 넘었는지 확인하는 구조였습니다. 이후, 임계값을 넘는 경우에만 토큰을 Redis 대기열에 넣도록 설계했습니다.</p>
            
            <p>이 방식은 초기에는 문제없이 작동하는 듯했지만, PR 과정에서 입장 순서가 보장되지 않는다는 점을 알게 되었습니다. 트래픽이 몰릴 때는 대기열에 들어가고, 트래픽이 적을 때는 바로 입장하면서 선착순이라는 기본 원칙이 지켜지지 않았습니다. 이 부분을 개선해야겠다고 생각했고, 두 번째 기능 구현 단계에서 보완 작업을 진행했습니다.</p>
            
            <p>이어서, 대기열에 있는 사용자에게 실시간으로 순번을 알려주기 위해 두 가지 방법을 생각했습니다. 하나는 사용자가 주기적으로 HTTP 폴링을 통해 순번을 확인하는 방식이었고, 다른 하나는 웹소켓을 통해 서버에서 순번이 바뀔 때마다 사용자에게 바로 알려주는 방식이었습니다. 웹소켓은 양방향 통신이 가능하고, 순번 변화를 즉시 사용자에게 전달할 수 있다는 장점 때문에 이 방식을 먼저 선택하여 구현했습니다.</p>
            
            <p>대기열을 구현하는 데는 Redis의 ZSET을 사용했습니다. ZADD 명령어로 토큰을 넣으면 자동으로 순서대로 정렬되기 때문에, RANK 명령어만으로 실시간 순번 조회가 가능해서 효율적이라고 판단했습니다. Waiting 상태를 받은 사용자는 웹소켓을 통해 /ws/queue 엔드포인트로 접속하고, STOMP 프로토콜을 이용하여 /sub/queue/{token} 경로를 구독하면 서버에서는 대기열 순서에 변동이 생길 때마다 해당 토큰을 구독한 사용자에게 QueueDto를 통해 현재 순번과 상태를 실시간으로 보냈습니다.</p>
            
            <p>웹소켓 연결이 끊어질 때 Redis에서 사용자 정보를 정리하기 위해 SessionDisconnectEvent 이벤트 리스너를 등록했습니다. 연결이 해제되면 해당 토큰을 Redis 대기열에서 자동으로 삭제하여, 중간에 나간 사용자로 인해 불필요하게 대기열이 늘어나는 것을 막을 수 있도록 구현했습니다.</p>
            
            <p>이러한 구조에는 다음과 같은 예상되는 문제점과 고민 사항이 있었습니다:</p>
            <ul>
                <li>주기적으로 서버에 입장시키는 방식은 서버 확장이 늦어지거나 없을 경우 서버가 다운될 위험이 있습니다.</li>
                <li>웹소켓은 항상 연결을 유지해야 하므로, 동시 접속자가 수천 명 이상으로 늘어나면 커넥션 풀 자원이 부족해져 시스템 성능 저하나 장애로 이어질 수 있습니다.</li>
                <li>웹소켓 연결이 시작되면 입장을 처리하는 스케줄러가 작동하도록 만들었는데, 분산 환경을 고려하지 않아 여러 서버 인스턴스가 실행될 경우 동기화 문제나 중복 처리가 발생할 수 있었습니다.</li>
                <li>OPEN 상태의 회원에 대한 토큰 유효성 검사 로직이 없어, 사용자가 URL을 직접 입력하여 접속을 시도하면 대기열을 거치지 않고 들어올 수 있는 보안상의 허점이 있었습니다.</li>
                <li>Redis의 빠른 성능이라는 장점을 ZSET을 사용하는 것이 가장 잘 활용하는 방법인지에 대한 고민이 있었습니다.</li>
                <li>웹소켓을 사용하여 예상되는 문제점을 해결하려고 하면 코드 복잡성은 증가하지만, 그만큼 사용자 경험을 향상시키고 성능상 이점이 있을지에 대한 의문이 들었습니다.</li>
            </ul>
            
            <h3>2) HTTP Polling, 순번 계산 최적화 (O(1)) 구조 전환</h3>
            <p>두 번째 구현에서는 HTTP Polling을 통해 실시간 순번을 확인하는 기능으로 전환하고, 첫 번째 수정 작업에서 고민했던 문제들을 개선하는 데 집중했습니다.</p>
            
            <p>서버에 주기적으로 입장시키는 방식에서 서버 확장이 늦어지거나 없을 경우 서버 다운 위험이 있다는 점을 고려하여, 서버가 감당할 수 있는 threshold를 설정하고 현재 웹사이트 이용자 수가 이 threshold를 넘으면 대기열을 만들고, 이용자가 나가는 수만큼 대기열에서 입장시키는 방식을 적용해 서버 다운 위험을 개선했습니다. 그리고, 서버 인스턴스를 늘려 확장할 경우 threshold 값을 Redis에 저장해 관리하도록 했습니다. 이 방식을 통해 서버를 확장할 때 Redis에서 threshold 값만 변경하면 모든 서버에 공통으로 적용할 수 있게 되었습니다.</p>
            
            <p>웹소켓 연결로 인한 커넥션 풀 문제와 코드 복잡성 증가에 비해 사용자 경험 향상이 크지 않다고 판단해, HTTP 폴링 방식으로 변경했습니다. 개인적인 경험상 웹사이트 대기열에서 실시간 순번 변화를 크게 신경 쓰지 않았기 때문에, 실시간성은 떨어지더라도 순번을 확인할 수 있다면 사용자 경험에 큰 문제가 없을 것이라고 생각했습니다.</p>
            
            <p>대기열이 생성되면 스프링 이벤트를 통해 스케줄러를 실행하여 현재 입장 가능한 수를 주기적으로 확인하고 대기열에서 입장시키도록 설계했지만, 스케줄러를 언제 종료해야 할지에 대한 의문이 남았습니다. 그리고, 스케줄러가 한번 실행된 후 계속 실행되고, 이후 대기열이 다시 생성될 때마다 또 실행되는 문제가 있어, 최초 실행 시 스레드 하나를 생성해 하나의 스레드만 스케줄러를 작동시키는 방식으로 추후 개선하는 것을 고민했습니다.</p>
            
            <p>OPEN 상태의 회원에 대한 토큰 유효성 검증이 없어 사용자가 URL로 직접 접속하면 대기열을 통과하지 못하는 문제를 해결하기 위해, 대기열에서 나간 토큰을 Redis에 저장하고 유효성을 검증할 수 있도록 했습니다. 이때 대기열 정보와 메인 서비스 이용 중인 토큰을 하나의 Redis 포트에서 관리하는 구조는 싱글 스레드인 Redis의 성능을 저하시킬 수 있다고 판단해, MainRedis와 QueueRedis로 Redis 인스턴스를 분리해서 병렬로 처리하도록 만들었습니다.</p>
            
            <p>기존에 ZSET을 사용하여 대기열을 만들고 정렬된 순번을 바탕으로 ZRANK를 통해 웹소켓으로 실시간 순번을 반환했지만, ZADD 연산은 정렬된 집합 크기 N에 대해 O(log(N))의 시간 복잡도를 가진다는 점을 확인하고, Redis의 인메모리 기반 빠른 성능을 더 효과적으로 활용할 방법을 고민했습니다. 그 결과, LIST 자료구조를 사용해 대기열을 구현하기로 했습니다. LIST의 LPUSH와 RPOP 연산은 O(1)의 시간 복잡도로 순차 처리에 유리하고 빠른 속도를 낼 수 있기 때문입니다. 하지만 ZADD 방식을 LPUSH로 변경한 후에는 ZRANK를 사용하여 현재 순번을 쉽게 확인할 수 있었던 것과 달리, LIST에서는 인덱스를 탐색해야 하므로 O(N)의 탐색 시간이 걸려 순번 확인 기능의 성능이 떨어지는 문제가 발생했습니다. 그래서 더 빠르게 현재 순번을 찾을 방법을 고민한 결과, Redis에 EXIT_COUNT와 PUSH_COUNT라는 키를 만들어 대기열에서 나간 토큰 수와 대기열에 추가된 토큰 수를 각각 INCRBY 명령으로 1씩 증가시키는 방식을 사용했습니다. 사용자가 대기열에 들어가면 Waiting 상태 값과 함께 PUSH_COUNT의 현재 값을 entryNumber로 반환하고, 폴링 시 이 entryNumber를 서버에 보내면 서버에서 entryNumber - EXIT_COUNT 연산을 통해 현재 순번을 계산하는 방식입니다. 이때 Redis는 기본적으로 싱글 스레드로 동작하므로 LPUSH 이후 INCRBY 연산의 순서가 보장되지 않아 분산 환경에서는 정확한 순번을 받지 못할 수 있다는 점을 인지하고, 이 두 연산을 묶어서 처리할 방법을 고민했습니다. Redis 트랜잭션과 Lua 스크립트 두 가지 방법을 고려했고, 최종적으로는 내부에서 조건 판단과 여러 작업을 수행할 수 있고 쿼리를 사용하여 더 빠른 성능을 낼 수 있다고 판단한 Lua 스크립트를 사용해 원자성을 보장했습니다.</p>
            
            <p>2번의 작업을 통해 웹소켓과 HTTP 폴링 두 가지 방식으로 순번 반환 서비스를 구현했지만, 웹소켓 구현에 드는 시간과 노력에 비해 사용자 경험 향상 효과는 크지 않다고 생각해 이후 작업에서는 HTTP 폴링 방식으로 리팩토링을 진행했습니다.</p>
            
            <h3>3) 모듈 책임 분리 및 Redis Stream 도입 시도</h3>
            <p>기존 Redis 대기열 시스템에서는 큐 모듈이 토큰을 생성하고, 접속자가 서버 임계값을 넘었는지 확인하여 OPEN 또는 WAITING 상태를 알려주는 방식이었습니다. 하지만 이 과정에서 메인 모듈에서 검증할 토큰을 굳이 큐 모듈에서 만들고 저장하는 것은 각 모듈의 역할 분담에 맞지 않다는 생각이 들었습니다. 그래서 토큰 생성 및 상태 판단 로직을 메인 모듈로 옮겨 각 모듈의 책임을 더 명확하게 나누는 리팩토링을 진행했습니다.</p>
            
            <p>새로운 구조에서는 사용자가 페이지에 접속하면 메인 모듈이 서버의 여유 공간(임계값)을 확인합니다. 입장이 가능하다면 Redis에 토큰을 저장하고 OPEN 상태를 반환하며, 그렇지 않다면 WAITING 상태를 반환한 뒤 클라이언트가 직접 대기열 추가 API를 호출하도록 했습니다. 이렇게 큐 모듈은 단순히 대기열을 관리하는 역할에 집중할 수 있게 되었지만, 동시에 새로운 문제가 발생했습니다.</p>
            
            <p>서버 인스턴스가 늘어나거나 기존 사용자가 이탈하여 입장 가능한 자리가 생기면, 메인 모듈은 큐 모듈에 얼마나 많은 인원이 입장 가능한지 알려줘야 하고, 큐 모듈은 그 인원수만큼 토큰을 꺼내 메인 모듈에 전달해야 합니다. 하지만 모듈이 분리된 구조에서는 직접 자원을 공유할 수 없었기에, 큐와 메인 모듈이 서로 데이터를 주고받는 통신 방식이 필요했습니다. 이때 Redis를 이용하여 대기열을 구현하고 있었기 때문에 Redis에서 제공하는 Pub/Sub과 Stream 기능을 고려했습니다.</p>
            
            <p>처음에는 Pub/Sub을 생각했지만, Pub/Sub은 메시지를 구독하는 모든 서버에 동시에 전달되므로 여러 서버 환경에서 같은 메시지를 여러 번 처리할 위험이 있다고 판단했습니다. 그래서 여러 소비자가 있더라도 메시지가 하나의 소비자에게만 전달되는 Redis Stream이 다중 서버 환경에서 더 안전하다고 보았습니다. Stream은 Consumer Group을 통해 여러 생산자가 데이터를 추가해도 항상 맨 끝에 추가되는 특징이 있고, 소비자도 하나의 메시지를 순서대로 처리하기 때문에 현재 구현하려는 기능에 적합하다고 생각했습니다. 게다가 소비자의 연결이 끊어져도 데이터는 안전하게 유지된다는 점도 안정성을 높이는 요소라고 생각했습니다.</p>
            
            <p>해당 기능 구현의 구체적인 과정은 다음과 같습니다. 사용자가 대기열에 처음 진입해서 entryNumber가 1이 되면, 큐 모듈은 Redis Pub/Sub을 통해 start 메시지를 보냅니다. 메인 모듈은 이 메시지를 받고, 비동기 스레드를 통해 스케줄러를 실행합니다. 그 후 메인 모듈은 일정 시간마다 OpenCount를 확인하고, 입장 가능한 인원이 생기면 Redis Stream을 통해 큐 모듈에 입장 가능한 인원수를 보내며 토큰을 요청합니다. 큐 모듈은 OpenCount만큼 토큰을 꺼내 다시 Stream으로 메인 모듈에 전달하고, 메인 모듈은 이 토큰을 받아 Redis에 저장하여 입장을 허용합니다. 이때 Stream의 Consumer Group 덕분에 큐 모듈 인스턴스가 여러 대 있더라도 단 하나의 서버만 메시지를 처리하므로 중복 처리 없이 안정적인 분산 환경에서 작동할 것이라고 생각했습니다.</p>
            
            <p>하지만 이 구조에도 불안한 점이 있었습니다. OpenCount가 수백 단위로 늘어날 경우, 토큰을 하나씩 Stream으로 보내면 네트워크 IO에 성능 문제가 생기고 Redis에 부담이 될 수 있다고 생각했습니다. 이 문제를 해결하기 위해 Redis 파이프라인을 도입했고, 여러 요청을 묶어서 한 번에 네트워크 IO를 처리할 수 있다는 점이 현재 고민을 해결해줄 수 있다고 보았습니다. 큐 모듈에서 꺼낸 토큰 목록을 파이프라인을 통해 한 번에 메인 모듈에 전달함으로써 성능을 최적화했습니다. 그리고 입장한 회원은 TTL을 사용하여 처음 SET에 저장하고, 메인 모듈의 필터에서 API 요청이 올 때마다 TTL을 갱신하는 방식으로 토큰의 유효성을 유지했습니다. 대기열 크기가 0이 되면 "stop" 메시지를 Pub/Sub으로 보내 스케줄러를 종료하도록 구성하여 전체 흐름을 정리했습니다.</p>
            
            <p>이러한 구조는 기술적으로는 역할 분담을 가능하게 하지만, 오히려 단점이 더 크고 분명하다고 생각이 들었습니다. 메인 모듈에 모든 판단과 처리가 집중되면서 큐 모듈의 역할이 줄어들어 큐 모듈에 필요성이 줄어들었고, 시스템 구조가 복잡해져 코드 유지보수가 어려워졌습니다. Pub/Sub을 사용하여 스케줄링을 시작하고 종료하며, Stream으로 데이터를 주고받고, 많은 양의 데이터에는 Redis 파이프라인까지 사용하는 것은 과도한 설계(오버엔지니어링)라는 생각이 들었습니다. 무엇보다 복잡한 구조에 비해 실제로 얻는 성능 향상이나 다른 이점이 뚜렷하게 보이지 않는다는 점이 아쉬운 아이디어였다고 생각됩니다. 그래도, 새로 Stream과 파이프라인에 대해서 학습하고 적용해 본 경험이 다음에 문제 상황에 좀 더 넓은 범위로 고민하고 해결할 수 있는 계기가 되지 않을까 생각합니다.</p>
            
            <h3>4) 예측 가능한 입장 처리와 만료 관리로 최종 대기열 구조 안정화</h3>
            <p>지속적인 구조 개선과 성능 최적화 노력 끝에, 대기열 관련 기능을 큐 모듈에서 통합적으로 관리하는 최종 구조를 완성했습니다. 마지막 단계에서는 입장 스케줄러의 효율적인 실행 방식과 사이트 이탈 회원의 토큰을 안정적으로 삭제하는 메커니즘을 확립하는 데 집중했습니다.</p>
            
            <p>먼저, 입장 스케줄러는 애플리케이션 실행 시 단일 스레드로 작동하도록 @EventListener(ApplicationReadyEvent.class)를 활용해 애플리케이션 실행과 동시에 스케줄러 스레드가 실행되도록 구성했습니다. 매 요청마다 스레드를 생성하는 방식은 비효율과 구조적 복잡성이 있다고 판단해, 단일 스레드를 지속적으로 입장 스케줄러로만 활용하는 것이 성능과 구조 측면에서 더 유리하다고 생각했습니다. 다만, 분산 환경에서의 중복 실행 가능성을 고려해 Redisson의 RedLock을 추가적으로 적용했고, 스케줄러의 동시 입장 실행을 방지했습니다.</p>
            
            <p>다음으로, 사이트를 이탈한 회원의 토큰 삭제 처리 방안을 고민했습니다. 기존의 TTL 설정 후 주기적인 갱신 방식은 삭제 시점의 불확실성으로 확장성 측면에서 데이터 수치화 또는 모니터링 시스템 도입에 어려움이 있을 거라는 생각을 했고, 입장 스케줄러와 유사한 방식의 독립적인 삭제 스케줄러를 도입해, 단일 스레드가 예측 가능한 주기로 삭제 작업을 수행하도록 개선했습니다.</p>
            
            <p>토큰 정보는 main:{token} 형식의 키로 Main Redis에 저장하고, 값으로는 생성 시점의 타임스탬프를 기록했습니다. 삭제 스케줄러는 이 타임스탬프와 현재 시간을 비교하여 만료된 토큰을 식별하고 제거합니다.</p>
            
            <p>하지만 main:{token} 형식의 키 패턴 때문에 삭제 대상을 효율적으로 찾기 어렵다는 문제가 있었습니다. Redis 공식 문서에서 KEYS 명령어의 사용을 권장하지 않으므로, 전체 키 스페이스를 검색하는 대신 효율적인 방법을 고민했습니다.</p>
            
            <p>최종적으로 채택한 해결책은 토큰을 Main Redis에 저장할 때, MAIN_TOKEN_SET_KEY라는 별도의 Set 자료구조에 토큰 값 자체를 함께 저장하는 것입니다. 삭제 스케줄러는 SCAN 명령어를 사용해 Token이 담겨있는 Set을 Cursor 기반으로 순회하며 토큰 목록을 가져오고, 각 토큰에 대해 main:{token} 키로 저장된 만료 시간을 확인한 후 만료된 토큰만 삭제합니다. 이 방식을 통해 Redis의 성능에 미치는 영향을 최소화하면서 토큰 관리가 가능해졌습니다.</p>
            
            <p>보안 측면에서는 발급된 토큰의 유효성을 철저히 검증하기 위해 Main 모듈에 필터를 적용했습니다. HTTP 헤더의 X-QUEUE-TOKEN 값을 검증해, 정상적으로 대기열을 통과해서 OPEN 상태를 획득한 회원만 서비스에 접근할 수 있도록 구현하며 대기열 시스템을 개발을 마무리했습니다.</p>
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