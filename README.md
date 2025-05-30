# 한글 음절 TTS 생성기 | Korean Hangul Syllable TTS Generator

🎤 **모든 한글 음절의 음성 합성 도구**  
🔊 **Text-to-Speech Generator for All Korean Hangul Syllables**

![Korean](https://img.shields.io/badge/language-Korean-red.svg)
![English](https://img.shields.io/badge/language-English-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black.svg)
![OpenAI](https://img.shields.io/badge/OpenAI-TTS-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Developed by Jeanyoon Choi (최정윤) | PhD Candidate, XD Lab | KAIST**

---

## 🇰🇷 한국어 설명

### 📝 프로젝트 개요

이 프로젝트는 **모든 한국어 한글 음절(11,172개, 겹받침 포함)**에 대한 TTS(Text-to-Speech) 오디오 파일을 생성하는 웹 애플리케이션입니다. OpenAI의 TTS API를 활용하여 정확하고 자연스러운 한국어 발음을 제공합니다.

### 🎯 주요 기능

- **📊 완전한 음절 생성**: 초성(19개) × 중성(21개) × 종성(28개, 겹받침 포함) = 11,172개 음절
- **🎵 배치 처리**: 안정적인 대량 음성 파일 생성
- **📈 실시간 진행률**: 생성 과정 모니터링 및 진행상황 확인
- **🔊 개별 테스트**: 특정 음절의 즉시 음성 생성 및 재생
- **📁 자동 정리**: 초성별 폴더 구조로 체계적인 파일 관리
- **🗂️ 인덱스 생성**: 빠른 검색을 위한 JSON 인덱스 파일 자동 생성
- **🔤 겹받침 지원**: ㄱㅅ, ㄴㅈ, ㄴㅎ, ㄹㄱ, ㄹㅁ, ㄹㅂ, ㄹㅅ, ㄹㅌ, ㄹㅍ, ㄹㅎ, ㅂㅅ 등 모든 복합 종성 포함

### 🛠️ 기술 스택

- **Frontend**: Next.js 15.3.3, React 19, Styled-Components
- **API**: OpenAI TTS API (gpt-4o-mini-tts 모델)
- **언어**: JavaScript
- **스타일링**: Styled-Components (CSS-in-JS)

### 📂 프로젝트 구조

```
hangeul-syllables/
├── pages/
│   ├── index.js          # 메인 TTS 생성 페이지
│   ├── test.js           # 개별 음절 테스트 페이지
│   ├── _app.js           # Next.js 앱 설정
│   ├── _document.js      # SEO 및 메타데이터
│   └── api/
│       └── tts.js        # TTS API 엔드포인트
├── public/
│   └── audio/            # 생성된 음성 파일 저장소
│       ├── ㄱ/           # 초성별 폴더
│       ├── ㄴ/
│       └── ...
└── package.json
```

### 🚀 사용법

1. **환경 설정**
   ```bash
   pnpm install
   ```

2. **OpenAI API 키 설정**
   ```bash
   # .env.local 파일 생성
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **개발 서버 실행**
   ```bash
   pnpm run dev
   ```

4. **웹 브라우저에서 접속**
   - 메인 페이지: `http://localhost:3000`
   - 테스트 페이지: `http://localhost:3000/test`

### 💡 활용 분야

- **한국어 교육**: 외국인 한국어 학습자를 위한 발음 교육 자료
- **언어학 연구**: 한국어 음성학 및 음운론 연구 (겹받침 포함)
- **접근성 도구**: 시각 장애인을 위한 한글 읽기 도구
- **언어 치료**: 발음 교정 및 언어 재활 치료 (복합 자음 학습)
- **AI 훈련 데이터**: 음성 인식 및 합성 모델 훈련용 완전한 데이터셋

---

## 🇺🇸 English Description

### 📝 Project Overview

This project is a web application that generates **TTS (Text-to-Speech) audio files for all Korean Hangul syllables (11,172 total including complex final consonants)**. It leverages OpenAI's TTS API to provide accurate and natural Korean pronunciation.

### 🎯 Key Features

- **📊 Complete Syllable Generation**: Initial consonants (19) × Medial vowels (21) × Final consonants (28, including complex ones) = 11,172 syllables
- **🎵 Batch Processing**: Stable mass audio file generation
- **📈 Real-time Progress**: Generation process monitoring and progress tracking
- **🔊 Individual Testing**: Instant voice generation and playback for specific syllables
- **📁 Auto Organization**: Systematic file management with initial consonant-based folder structure
- **🗂️ Index Generation**: Automatic JSON index file creation for fast searching
- **🔤 Complex Consonant Support**: Includes all compound final consonants like ㄱㅅ, ㄴㅈ, ㄴㅎ, ㄹㄱ, ㄹㅁ, ㄹㅂ, ㄹㅅ, ㄹㅌ, ㄹㅍ, ㄹㅎ, ㅂㅅ

### 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, Styled-Components
- **API**: OpenAI TTS API (gpt-4o-mini-tts model)
- **Language**: JavaScript
- **Styling**: Styled-Components (CSS-in-JS)

### 📂 Project Structure

```
hangeul-syllables/
├── pages/
│   ├── index.js          # Main TTS generation page
│   ├── test.js           # Individual syllable test page
│   ├── _app.js           # Next.js app configuration
│   ├── _document.js      # SEO and metadata
│   └── api/
│       └── tts.js        # TTS API endpoint
├── public/
│   └── audio/            # Generated audio files storage
│       ├── ㄱ/           # Folders by initial consonant
│       ├── ㄴ/
│       └── ...
└── package.json
```

### 🚀 Usage

1. **Environment Setup**
   ```bash
   pnpm install
   ```

2. **OpenAI API Key Configuration**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run Development Server**
   ```bash
   pnpm run dev
   ```

4. **Access via Web Browser**
   - Main page: `http://localhost:3000`
   - Test page: `http://localhost:3000/test`

### 💡 Use Cases

- **Korean Language Education**: Pronunciation teaching materials for foreign Korean learners
- **Linguistic Research**: Korean phonetics and phonology research (including complex consonants)
- **Accessibility Tools**: Hangul reading tools for visually impaired users
- **Speech Therapy**: Pronunciation correction and language rehabilitation therapy (compound consonant learning)
- **AI Training Data**: Complete dataset for training speech recognition and synthesis models

---

## 🔧 Technical Details | 기술적 세부사항

### Korean Syllable Structure | 한글 음절 구조

```
한글 음절 = 초성 + 중성 + 종성(선택)
Hangul Syllable = Initial Consonant + Medial Vowel + Final Consonant (optional)

초성 (Initial): ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ ㄲ ㄸ ㅃ ㅆ ㅉ (19개)
중성 (Medial): ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ ㅐ ㅒ ㅔ ㅖ ㅘ ㅙ ㅚ ㅝ ㅞ ㅟ ㅢ (21개)
종성 (Final): (없음) ㄱ ㄲ ㄱㅅ ㄴ ㄴㅈ ㄴㅎ ㄷ ㄹ ㄹㄱ ㄹㅁ ㄹㅂ ㄹㅅ ㄹㅌ ㄹㅍ ㄹㅎ ㅁ ㅂ ㅂㅅ ㅅ ㅆ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ (28개, 겹받침 포함)

총 음절 수: 19 × 21 × 28 = 11,172개
Total syllables: 19 × 21 × 28 = 11,172
```

### Complex Final Consonants (겹받침) | 복합 종성

이 프로젝트는 다음과 같은 겹받침을 모두 포함합니다:
- **ㄱㅅ** (갅, 맄, 반옑 등)
- **ㄴㅈ** (겉, 녾 등) 
- **ㄴㅎ** (같, 많 등)
- **ㄹㄱ** (닭, 흙 등)
- **ㄹㅁ** (삶, 젊 등)
- **ㄹㅂ** (굽, 밟 등)
- **ㄹㅅ** (곬, 핥 등)
- **ㄹㅌ** (핥, 훑 등)
- **ㄹㅍ** (읊 등)
- **ㄹㅎ** (훌, 굴 등)
- **ㅂㅅ** (값, 없 등)

### API Endpoints | API 엔드포인트

- `POST /api/tts` - Main TTS API endpoint
  - `action: 'get-progress'` - Get generation progress
  - `action: 'generate-all'` - Start batch generation  
  - `action: 'generate-single'` - Generate single syllable

---

## ⏱️ Performance | 성능 정보

- **예상 생성 시간**: 약 3-4시간 (11,172개 음절)
- **배치 크기**: 50개씩 처리
- **API 지연**: 요청 간 100ms 대기
- **총 비용**: OpenAI TTS API 사용량에 따라 결정

---

## 👨‍🎓 Developer | 개발자

**최정윤 (Jeanyoon Choi)**  
PhD Candidate, XD Lab  
Korea Advanced Institute of Science and Technology (KAIST)

---

## 📄 License | 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

이 프로젝트는 MIT 라이선스 하에 배포됩니다 - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 🤝 Contributing | 기여하기

Contributions are welcome! Please feel free to submit a Pull Request.

기여를 환영합니다! 언제든지 Pull Request를 제출해 주세요.

---

## 📞 Contact | 연락처

jeanyoon.choi@kaist.ac.kr

For questions or suggestions, please open an issue on GitHub.

질문이나 제안사항이 있으시면 GitHub에서 이슈를 열어주세요.
