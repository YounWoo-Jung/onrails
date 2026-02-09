# onrails

Rails 개발을 단순하고 빠르게 오케스트레이션하는 CLI.

**철학: Convention over Configuration** - Rails 프로젝트를 자동 감지하고, 복잡한 설정 없이 바로 동작합니다.

## 설치

```bash
bun install
```

글로벌 설치:

```bash
bun link
```

## 기본 어댑터: opencode

onrails는 LLM 호출에 [opencode](https://github.com/nicepkg/opencode) CLI를 사용합니다.
API 키나 결제 설정을 onrails에 직접 할 필요가 없습니다 - opencode가 알아서 처리합니다.

```bash
curl -fsSL https://opencode.ai/install | bash
```

## 사용법

### 역할 목록 보기

```bash
onrails roles
```

### 워크플로우 목록 보기

```bash
onrails workflows
```

### 워크플로우 실행

```bash
onrails run feature "사용자 프로필에 아바타 업로드 기능 추가"
```

```bash
onrails run refine "N+1 쿼리를 eager loading으로 개선"
```

```bash
onrails run recover "결제 후 이메일이 발송되지 않는 버그 수정"
```

## 워크플로우

| 워크플로우 | 파이프라인 | 용도 |
|-----------|-----------|------|
| `feature` | Orion -> Lyra -> Libra | 새 기능 개발 |
| `refine`  | Orion -> Lyra -> Libra | 기존 코드 개선 |
| `recover` | Phoenix -> Lyra -> Libra | 버그 수정/장애 복구 |

## 역할

| 역할 | 책임 |
|------|------|
| **Orion** | 설계/계획 (코드 작성 금지) |
| **Lyra** | 구현/코딩 (계획대로만 구현) |
| **Libra** | 리뷰/품질 게이트 (BLOCKING/ADVISORY 구분) |
| **Phoenix** | 디버그/장애 복구 (재현 -> 원인 -> 최소수정 -> 회귀방지) |

English guide: [README.md](README.md)
