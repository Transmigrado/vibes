# AGENTS.md - Developer Guidelines for Vibes

This document provides guidelines for agentic coding agents working on this codebase.

## Project Overview

- **Type**: Expo/React Native mobile application (iOS/Android/Web)
- **Language**: TypeScript (strict mode enabled)
- **Framework**: Expo SDK 54 with expo-router for file-based routing
- **State Management**: **Redux Toolkit-style slices OR classic Redux** + **Redux-Saga** (this repo uses Redux + Saga patterns)
- **Backend**: **Supabase**
- **Architecture**: **Feature-based** + **Functional Agents** (no classes)
- **Testing**: Not yet configured (recommended: Jest + jest-expo + @testing-library/react-native)

---

## Non‑Negotiables

1. **No TypeScript classes** in agents/business logic.
2. **No Supabase calls in UI** (components/screens).
3. **No Supabase calls inside sagas** (sagas call agents only).
4. **No `any`**. Use `unknown` or proper typing.
5. **Reducers must be pure** (no side effects, no async).
6. **Sagas handle side effects** (API calls, storage, navigation effects if needed).
7. **Agents throw errors**; sagas catch and convert to Redux state.

---

## Recommended Folder Structure

```
app/                      # Expo Router pages (file-based routing)
  (tabs)/
  _layout.tsx
  index.tsx

components/               # Reusable UI components
  ui/

store/                    # Redux + Sagas per feature
  index.ts                # configureStore + rootSaga
  rootReducer.ts
  rootSaga.ts
  auth/
    auth.types.ts
    auth.actions.ts
    auth.reducer.ts
    auth.selectors.ts
    auth.sagas.ts
  profile/
    ...

agents/                   # Business logic (functional), calls Supabase
  authAgent.ts
  profileAgent.ts

services/                 # External clients (supabase client, etc.)
  supabase.ts

hooks/
constants/
```

---

## Architecture Layers & Responsibilities

### UI Layer (Expo Router screens + components)
- Render UI and dispatch Redux actions.
- Select state via selectors/hooks.
- **Must not** call Supabase or agents directly.

### Redux Layer
- **Actions**: describe events and intents (e.g., login requested).
- **Reducers**: pure state transitions.
- **Sagas**: orchestrate async work and side effects; call agents; dispatch success/failure actions.

### Agent Layer (Functional Agents)
- Encapsulates **Supabase** calls and domain logic.
- Returns typed data.
- Throws errors with meaningful messages.

### Services Layer
- Creates and exports the Supabase client once.

---

## Redux + Redux‑Saga Guidelines

### Actions
- Prefer explicit request/success/failure triplets for async flows.
- Payloads must be typed.
- Keep action naming consistent:

Examples:
- `auth/loginRequest`
- `auth/loginSuccess`
- `auth/loginFailure`

### Reducers
- Must be pure.
- No calls to agents/services.
- Keep error and loading state explicit:

Typical shape:
- `status: 'idle' | 'loading' | 'succeeded' | 'failed'`
- `error?: string | null`
- `data?: ...`

### Sagas
- Use `call`, `put`, `takeLatest`, `select`.
- **Do**: call agents.
- **Don’t**: call Supabase directly.
- Always wrap async flows in `try/catch`.
- Normalize errors into a user‑safe string.

**Correct**
```ts
const data = yield call(authAgent.login, action.payload);
yield put(authActions.loginSuccess(data));
```

**Wrong**
```ts
const { data } = yield call(supabase.auth.signInWithPassword, action.payload); // ❌
```

### Root Saga / Feature Sagas
- Each feature exports a `watchX()` saga.
- `rootSaga` composes all watchers using `all([...])`.

---

## Supabase Integration Rules

### `services/supabase.ts`
- Create the client once.
- Use environment variables for URL and anon key (Expo env strategy).

### Usage
- Only agents import and use the Supabase client.
- Never instantiate multiple clients.
- Never call Supabase in UI or sagas.

---

## Functional Agent Pattern (No Classes)

Agents must be functional and mockable.

### Template
```ts
export type SomeAgent = {
  method: (params: Params) => Promise<Result>;
};

export const createSomeAgent = (deps?: { supabaseClient?: typeof supabase }): SomeAgent => {
  const client = deps?.supabaseClient ?? supabase;

  const method: SomeAgent["method"] = async (params) => {
    const { data, error } = await client.from("table").select("*");
    if (error) throw new Error(error.message);
    return data;
  };

  return { method };
};

export const someAgent = createSomeAgent();
```

### Error Handling in Agents
- Throw `Error` with a clean message.
- Avoid returning `{ error }` objects.
- Let sagas decide how to present the message to UI.

---

## TypeScript Rules

- Strict mode is required.
- **No `any`**.
- Use `unknown` when truly unknown, then narrow.
- Exported functions should have explicit return types when complex.
- Prefer `type` over `interface` for unions and composition.

---

## Imports & Aliases

- Use path aliases (`@/*`):
```ts
import { authAgent } from "@/agents/authAgent";
import { supabase } from "@/services/supabase";
```

- Order imports: external → internal alias → relative.
- Separate groups with blank lines.

---

## Common Tasks

### Add a New Feature (Redux + Saga + Agent)
1. Create `store/<feature>/` with `types/actions/reducer/sagas/selectors`.
2. Create `agents/<feature>Agent.ts` with Supabase calls.
3. Wire the reducer into `rootReducer`.
4. Wire the watcher into `rootSaga`.
5. Use UI screens/components to dispatch request actions and render state.

### Add a New Screen (expo-router)
1. Create `app/<route>.tsx` or `app/<folder>/<route>.tsx`.
2. Use `useDispatch()` to dispatch actions.
3. Use selectors to read state.

---

## Testing (Recommended Setup)

When adding tests, use:
- `jest`
- `jest-expo`
- `@testing-library/react-native`

Test focus:
- Reducers (pure functions)
- Sagas (mock agents)
- Agents (inject mock Supabase client via `createXAgent({ supabaseClient })`)

---

## Performance & UX

- Prefer memoized selectors for derived data.
- Avoid heavy computations in components.
- Keep lists optimized (`FlashList` if needed).
- Use `expo-image` for efficient image rendering.
- Use `react-native-reanimated` for animations.

---

## Dark Mode

Follow the pattern in `constants/theme.ts`:
- Define colors in `Colors.light` and `Colors.dark`
- Use `useThemeColor` hook
- Allow component overrides via `lightColor` / `darkColor`
