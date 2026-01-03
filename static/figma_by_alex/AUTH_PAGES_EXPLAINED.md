# Authentication Pages Architecture

This document explains the implementation of the Sign-in and Sign-up pages in the "Make It Pop" application.

## Overview

The authentication flow consists of two main components: `LoginPage` and `SignupPage`. Both share a consistent visual style featuring a unique rotating gradient background and animated entry elements using `motion/react`.

## Key Files

### 1. `components/LoginPage.tsx`

This component handles user authentication.

**Key Features:**
*   **Form Management**: Uses local state (`email`, `password`) to manage inputs.
*   **Validation**: Real-time validation for email format and password length.
*   **Authentication**: Calls `signIn` from `AuthContext`.
*   **UI Feedback**:
    *   Visual indicators (Check/X icons) for field validation.
    *   Loading state with spinner.
    *   Toast notifications for success/error messages.
*   **Animations**: Uses `motion.div` for staggered entrance animations of the logo, form, and footer.

### 2. `components/SignupPage.tsx`

This component handles new user registration.

**Key Features:**
*   **Extended Form**: Includes `name` and `confirmPassword` fields in addition to email/password.
*   **Validation**: Ensures passwords match and fields are not empty.
*   **Registration**: Calls `signUp` from `AuthContext`.
*   **Success State**: Displays a success animation (green checkmark) before redirecting.

### 3. `styles/globals.css`

This file contains the global styles, including the crucial CSS for the background animation.

**The Rotating Gradient:**
The background effect is achieved using a large pseudo-element with a conic gradient that rotates infinitely.

```css
/* Defined in styles/globals.css */

@keyframes rotate-gradient {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.rotating-gradient {
  animation: rotate-gradient 20s linear infinite;
  /* ... positioning and size styles ... */
}
```

## How It Works Together

1.  **Navigation**:
    *   The parent component (likely `App.tsx` or a router wrapper) renders either `LoginPage` or `SignupPage`.
    *   Props `onNavigateToSignup` and `onNavigateToLogin` allow switching between the two views without a full page reload.

2.  **Visual Consistency**:
    *   Both pages use the same structure:
        *   Full-screen container with `overflow-hidden`.
        *   Absolute positioned `.rotating-gradient` div for the background.
        *   Centered "Card" (white box) containing the form.
    *   This ensures a seamless transition when switching between Login and Signup.

3.  **Animations**:
    *   **Background**: Pure CSS animation (`rotate-gradient`) runs continuously.
    *   **Elements**: `motion/react` (Framer Motion) is used for the "spring" entrance animations.
        *   `initial={{ opacity: 0, y: 20 }}`: Elements start slightly lower and invisible.
        *   `animate={{ opacity: 1, y: 0 }}`: Elements move up and fade in.
        *   `transition={{ delay: 0.1, ... }}`: Delays are staggered (0.1s, 0.2s, 0.3s) to create a cascading effect.

## Code Snippets

### Background Animation (CSS)

```css
.rotating-gradient {
  width: 200vmax;
  height: 200vmax;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  background-image: conic-gradient(from 90deg, ...); /* Full gradient definition */
  animation: rotate-gradient 20s linear infinite;
}
```

### Entrance Animation (React/Motion)

```tsx
<motion.div 
  className="flex flex-col gap-3 px-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    type: "spring",
    stiffness: 260,
    damping: 20,
    delay: 0.2 
  }}
>
  {/* Form content */}
</motion.div>
```
