# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart API is a React + TypeScript + Vite frontend application. This is a single-page application (SPA) using modern web technologies with functional components and React Hooks.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Production build (TypeScript compilation + Vite bundling)
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint to check code quality and lint rules

## Architecture

### Technology Stack
- **Frontend**: React 19.2.4 with TypeScript 6.0.2
- **Build Tool**: Vite 8.0.4 with `@vitejs/plugin-react` (using Oxc)
- **Styling**: Plain CSS with CSS custom properties for theming (supports dark/light mode)
- **Linting**: ESLint 9.x with flat config, React Hooks plugin, and React Refresh plugin

### Project Structure
- `src/` - Application source code
  - `main.tsx` - Application entry point
  - `App.tsx` - Root component
  - `*.css` - Component and global styles
- `public/` - Static assets served directly
- `index.html` - HTML entry point that mounts the React app

### TypeScript Configuration
The project uses a composite TypeScript configuration with multiple config files:
- `tsconfig.json` - Root configuration with references
- `tsconfig.app.json` - Application code configuration (ES2023 target, bundler module resolution)
- `tsconfig.node.json` - Node.js tooling configuration (for Vite config)

### Key Architectural Patterns
- **Functional Components** with React Hooks (no class components)
- **CSS Custom Properties** for theming with dark mode support
- **ES Modules** with bundler resolution for imports
- **Component Co-location** - Styles are kept alongside components

## Important Notes

### No Testing Framework
This project does not currently have a testing framework configured. When adding tests, consider using Vitest + React Testing Library for consistency with the Vite ecosystem.

### No State Management Library
The app uses React's built-in state management (useState, useContext). For complex state needs, consider adding a state management library like Zustand or Redux.

### No Routing
Currently a single-page application without client-side routing. For multi-page functionality, add React Router.

### ESLint Configuration
The project uses the modern ESLint flat config format. When adding type-aware linting, refer to the instructions in README.md for enabling `tseslint.configs.recommendedTypeChecked` or stricter variants.

### React Compiler Not Enabled
The React Compiler is intentionally not enabled in this template due to performance considerations. If needed, follow the [official React Compiler installation guide](https://react.dev/learn/react-compiler/installation).
