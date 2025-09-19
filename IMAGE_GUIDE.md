# 🖼️ 블로그 이미지 업로드 가이드

## 📁 이미지 저장 구조

```
NohYeongO.github.io/
├── assets/
│   └── images/
│       └── blog/
│           ├── devblog/          # 개발 블로그 이미지
│           └── lifeblog/         # 라이프 블로그 이미지
├── posts/
│   ├── devblog/
│   └── lifeblog/
└── ...
```

## 🚀 이미지 업로드 방법

### 1. 이미지 파일 준비
- **지원 형식**: JPG, PNG, GIF, WebP
- **권장 크기**: 최대 1920px 너비
- **파일명**: 영어와 하이픈(-) 사용 (예: `jvm-memory-structure.png`)

### 2. 이미지 업로드
1. `assets/images/blog/devblog/` 또는 `assets/images/blog/lifeblog/` 폴더에 이미지 업로드
2. 카테고리에 맞는 폴더에 저장

### 3. TXT 파일에서 이미지 참조
```markdown
---
title: "JVM 메모리 구조"
excerpt: "JVM의 메모리 구조에 대해 알아보겠습니다"
date: "2025-01-XX"
category: "Backend"
tags: "Java, JVM, Memory"
author: "NohYeongO"
---

# JVM 메모리 구조

JVM의 메모리 구조는 다음과 같습니다:

![JVM 메모리 구조](./assets/images/blog/devblog/jvm-memory-structure.png)

## 힙 메모리

힙 메모리는 객체가 저장되는 공간입니다:

![힙 메모리 구조](./assets/images/blog/devblog/heap-memory-layout.png)

### 이미지 캡션 추가
```markdown
![JVM 메모리 구조](./assets/images/blog/devblog/jvm-memory-structure.png)
*그림 1: JVM 메모리 구조도*
```

## 📝 이미지 사용 팁

### 1. 상대 경로 사용
```markdown
<!-- 올바른 방법 -->
![이미지](./assets/images/blog/devblog/image.png)

<!-- 잘못된 방법 -->
![이미지](https://example.com/image.png)
```

### 2. 이미지 최적화
- **압축**: 이미지 크기를 최적화하여 로딩 속도 향상
- **WebP 형식**: 최신 브라우저에서 더 나은 압축률
- **반응형**: CSS에서 자동으로 반응형 처리됨

### 3. 이미지 정렬
```markdown
<!-- 중앙 정렬 -->
<div align="center">
  <img src="./assets/images/blog/devblog/image.png" alt="설명" width="80%">
</div>

<!-- 좌측 정렬 -->
<img src="./assets/images/blog/devblog/image.png" alt="설명" style="float: left; margin-right: 20px;">
```

## 🎨 이미지 스타일링

블로그에서 이미지는 자동으로 다음 스타일이 적용됩니다:
- ✅ 둥근 모서리 (12px)
- ✅ 그림자 효과
- ✅ 호버 시 확대 효과
- ✅ 반응형 크기 조정
- ✅ 테두리 효과

## 📱 반응형 이미지

모든 이미지는 자동으로 반응형으로 처리됩니다:
- **데스크톱**: 원본 크기
- **태블릿**: 90% 크기
- **모바일**: 100% 너비, 자동 높이

## 🔗 GitHub에서 이미지 업로드

### 1. GitHub 웹에서 업로드
1. `assets/images/blog/devblog/` 폴더로 이동
2. "Add file" → "Upload files" 클릭
3. 이미지 파일 드래그 앤 드롭
4. 커밋 메시지 작성 후 커밋

### 2. 로컬에서 업로드
```bash
# 이미지 파일을 해당 폴더에 복사
cp your-image.png assets/images/blog/devblog/

# Git에 추가
git add assets/images/blog/devblog/your-image.png
git commit -m "Add blog image: your-image.png"
git push
```

## 📋 체크리스트

- [ ] 이미지 파일명이 영어와 하이픈으로 구성되어 있는가?
- [ ] 이미지가 올바른 카테고리 폴더에 저장되었는가?
- [ ] MD 파일에서 상대 경로로 이미지를 참조하고 있는가?
- [ ] 이미지에 적절한 alt 텍스트가 있는가?
- [ ] 이미지 크기가 적절한가? (최대 1920px 너비)
- [ ] MD 파일에 author 필드가 포함되어 있는가?
- [ ] excerpt 필드가 작성되어 있는가?
- [ ] category가 올바르게 설정되어 있는가?

## 🚨 주의사항

1. **저작권**: 사용할 수 있는 이미지만 업로드
2. **용량**: 이미지 파일 크기를 적절히 조절
3. **경로**: 상대 경로를 정확히 사용
4. **백업**: 중요한 이미지는 로컬에 백업 보관

## 🔗 관련 링크

- [블로그 글 작성 가이드](./BLOG_GUIDE.md)
- [GitHub Pages 문서](https://pages.github.com/)
- [Markdown 이미지 문법](https://www.markdownguide.org/basic-syntax/#images)
