# 📝 블로그 글 추가 가이드

## 🚀 PR로 블로그 글 추가하는 방법

### 1. 저장소 포크 (Fork)
1. [NohYeongO.github.io](https://github.com/NohYeongO/NohYeongO.github.io) 저장소를 포크합니다
2. 포크된 저장소를 로컬에 클론합니다

### 2. 블로그 글 작성
1. `posts/` 폴더에 카테고리별로 TXT 파일을 생성합니다
   - **Dev Blog**: `posts/devblog/` 폴더
   - **Life Blog**: `posts/lifeblog/` 폴더

### 3. TXT 파일 형식
```markdown
---
title: "글 제목"
excerpt: "글 요약 (선택사항)"
date: "2025-01-XX"
category: "Backend" 또는 "Frontend" 또는 "Daily" 등
tags: "Java, Spring, Redis"
author: "NohYeongO"
---

# 글 제목

글 내용을 여기에 작성하세요...

## 소제목

코드 블록도 사용할 수 있습니다:

```java
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 마크다운 문법
- **굵은 글씨**: `**굵은 글씨**`
- *기울임체*: `*기울임체*`
- [링크](https://example.com): `[링크](https://example.com)`
- `인라인 코드`: `` `인라인 코드` ``
- > 인용문: `> 인용문`
- - 리스트: `- 리스트 항목`
- ![이미지](./assets/images/blog/devblog/image.jpg): `![이미지](./assets/images/blog/devblog/image.jpg)`
```

### 4. 인덱스 파일 업데이트
카테고리 폴더의 `index.json` 파일에 새 글을 추가합니다:

**Dev Blog** (`posts/devblog/index.json`):
```json
[
  "spring-boot-redis-caching.md",
  "새로운-글-파일명.md"
]
```

**Life Blog** (`posts/lifeblog/index.json`):
```json
[
  "first-hackathon-experience.md",
  "새로운-글-파일명.md"
]
```

### 5. PR 생성
1. 변경사항을 커밋합니다:
   ```bash
   git add .
   git commit -m "Add new blog post: [글 제목]"
   ```

2. 브랜치를 푸시합니다:
   ```bash
   git push origin main
   ```

3. GitHub에서 Pull Request를 생성합니다

### 6. PR 리뷰 및 머지
- PR이 승인되면 자동으로 블로그에 반영됩니다
- GitHub Pages가 자동으로 빌드되어 배포됩니다

## 📁 폴더 구조
```
NohYeongO.github.io/
├── posts/
│   ├── devblog/
│   │   ├── index.json
│   │   └── 새로운-글.md
│   └── lifeblog/
│       ├── index.json
│       └── 새로운-글.md
├── index.html
├── css/
├── js/
└── ...
```

## ✨ 팁
- 파일명은 영어와 하이픈(-)을 사용하세요
- 제목은 명확하고 구체적으로 작성하세요
- 태그는 쉼표로 구분하여 관련 기술이나 주제를 포함하세요
- 코드 블록에는 언어를 명시하세요 (```java, ```javascript 등)
- **author 필드는 필수입니다** - 작성자 이름을 명시하세요
- excerpt는 블로그 목록에서 보이는 요약문입니다
- category는 "Backend", "Frontend", "Daily", "General" 등을 사용하세요
- 이미지는 `assets/images/blog/devblog/` 또는 `assets/images/blog/lifeblog/` 폴더에 저장하세요

## 🔗 링크
- [블로그 사이트](https://nohyeongo.github.io)
- [GitHub 저장소](https://github.com/NohYeongO/NohYeongO.github.io)
