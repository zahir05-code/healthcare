---
name: verify
description: Use when you want to validate changes before committing, or when you need to check all React contribution requirements.
---

# Verification

Run all verification steps.

Arguments:
- $ARGUMENTS: Test pattern for the test step

## Instructions

Run these first in sequence:
1. Run `yarn prettier` - format code (stop if fails)
2. Run `yarn linc` - lint changed files (stop if fails)

Then run these with subagents in parallel:
1. Use `/flow` to type check (stop if fails)
2. Use `/test` to test changes in source (stop if fails)
3. Use `/test www` to test changes in www (stop if fails)

If all pass, show success summary. On failure, stop immediately and report the issue with suggested fixes.
---
name: readme
description: 프로젝트 README.md 자동 생성 및 업데이트 스킬입니다.
---

# README 생성 스킬

## 목적
앱 개발 프로젝트에서 기본 README.md 파일을 빠르게 생성합니다.

## 사용 상황
- 새 프로젝트 초기 설정
- 문서 업데이트 요청
- 시스템 구성 설명 필요 시

## 동작
1. 프로젝트 목적 및 기능을 물어봅니다.
2. 설치/실행 방법 템플릿을 구성합니다.
3. 코드 구조 설명과 예시를 포함합니다.
4. 최종 README.md 파일을 워크스페이스에 출력합니다.
---
name: brainstorming
description: 기능/아이디어를 구조화된 설계로 변환하는 스킬입니다.
---

# Brainstorming 스킬

## 목적
앱 아이디어를 구현 가능한 설계로 정리합니다.

## 절차
1. 앱 핵심 목표를 정리합니다.
2. 기능 목록을 작성합니다.
3. UI/UX 흐름을 도식화합니다.
4. 각 기능에 필요한 기술 구성 요소를 제안합니다.
5. 설계 산출물을 마크다운 형식으로 출력합니다.

## 결과물
- 기능 리스트
- 컴포넌트/화면 구조 설명
- 데이터 흐름 요약
---
name: skill-creator
description: Agent Skill을 Antigravity 표준 템플릿으로 생성/관리하는 Meta 스킬입니다.
---

# Skill Creator (Meta)

## 목적
Antigravity에 사용할 새로운 스킬을 표준 YAML + Markdown 형식으로 자동 생성합니다.

## 절차
1. 스킬 이름과 목적을 사용자로부터 입력받습니다.
2. YAML frontmatter 기반 기본 템플릿을 생성합니다.
3. 주요 단계(동작, 조건, 예시)를 설명하는 마크다운 본문을 작성합니다.
4. `.agent/skills/<name>/SKILL.md`로 저장합니다.

## 기대 효과
- 반복되는 스킬 생성 시간을 절약
- 일관된 스킬 구조 유지
- 커스텀 스킬 확장 가능
