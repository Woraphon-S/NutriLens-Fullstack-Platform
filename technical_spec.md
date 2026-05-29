# NutriLens AI: Technical Specification

**Project Goal**: A high-performance nutrition analysis platform using Gemini AI to identify and decompose meals from images.

## 1. Technical Framework
- **Architecture**: Clean Modular Architecture (Domain-Driven design Lite).
- **Core Stack**: Next.js 16 (App Router), TypeScript.
- **Styling**: Tailwind CSS (Minimalist Healthy White/Green theme).
- **Database**: PostgreSQL with `node-pg` (Raw SQL only, no ORM).
- **AI**: Gemini 2.5 Flash (Nutrition Engine).
- **Containerization**: Docker & Docker Compose for consistent environments.

---

## 2. Implementation Strategy
**Logic First Approach**: All core services (AI, Streaks, Calculations) will be implemented as pure-logic services before finalizing raw SQL database integration.

---

## 2. Senior-Level Directory Structure
```text
/src
  /app                     # UI Layers & Next.js Magic
    /(guest)               # Publicly accessible routes (Upload/Analyze)
    /(member)              # Auth-gated routes (History/XP Dashboard)
    /api                   # Edge/Serverless Route Handlers
  /domain                  # Raw Business Logic (Calculation logic, Streak rules)
    /meals/meal.service.ts
    /user/streak.service.ts
  /infrastructure          # External Integrations
    /database/db.ts        # Client connection (pg)
    /database/repositories # Raw SQL Query Logic
    /ai/gemini.client.ts   # AI wrapper
    /storage/file.store.ts # Local file system management (public/uploads)
  /shared                  # Interfaces & DTOs
    /types/index.ts
    /utils/index.ts
```

---

## 3. Data Flow (Guest vs. Member)

### A. The "Instant Analyze" Flow (Guest)
1. **Frontend**: Image capture/upload via `FileUploader`.
2. **Server Action**: `ProcessImageAction` converts file to Buffer.
3. **AI Layer**: `GeminiClient` sends prompt (Decomposition request).
4. **Result Viewer**: Render structured data (Cal, Macros, Ingredients) in memory.
5. **Call to Action**: Prompt user to login to "Save this meal & earn XP".

### B. The "Persistence" Flow (Member)
1. **Flow A + Auth Check**: If session exists...
2. **Repository**: `MealRepository.save()` executes raw SQL to `meals` and `meal_ingredients`.
3. **Domain Logic**: `StreakService` checks last entry date and updates XP.
4. **State Update**: Result page reflects new level/streak.

---

## 4. Database Schema (PostgreSQL Raw SQL)
```sql
-- Core User Profile
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Main Meal Log
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for Guest Mode if needed
    image_path TEXT NOT NULL,
    total_calories INTEGER NOT NULL,
    analyzed_at TIMESTAMP DEFAULT NOW()
);

-- Ingredient Breakdown
CREATE TABLE meal_ingredients (
    id SERIAL PRIMARY KEY,
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    estimated_weight_g INTEGER,
    calories INTEGER,
    protein FLOAT,
    carbs FLOAT,
    fat FLOAT
);

-- Gamification
CREATE TABLE user_progression (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    last_login_at TIMESTAMP
);
```

---

## 5. Coding Standards: Senior Developer
- **Type Safety**: No `any`. Use strict interfaces for AI outputs and DB rows.
- **SQL Best Practices**: Use parameterized queries (`$1, $2`) to prevent injection.
- **Minimalist Comments**: Code should be self-documenting. Use comments only for complex domain logic.
- **Error Handling**: Use the "Result Pattern" or specialized Error classes instead of silent failures.
- **Tailwind**: Use semantic colors (e.g., `bg-health-white`, `text-health-dark`). Avoid repetitive utility classes where components can be abstracted.
