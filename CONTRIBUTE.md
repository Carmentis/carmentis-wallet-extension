# Contributing to Carmentis Wallet Extension

This document provides an overview of the project structure to help you understand how the codebase is organized, particularly focusing on the `src` directory.

## Project Structure

The `src` directory contains the source code for the Carmentis Wallet Extension. Here's a breakdown of its organization:

### Main Directories

- **assets**: Contains static assets like images, fonts, and other resources used in the application.

- **components**: React components organized by functionality:
  - `dashboard`: Components specific to the dashboard view
  - `layout`: Components related to the application layout
  - `onboarding`: Components for the user onboarding process
  - `popup`: Components used in popup windows
  - `shared`: Reusable components shared across the application (e.g., Splashscreen, SpinningWheel)

- **contexts**: React context providers for state management across components.

- **entrypoints**: Entry points for different parts of the application:
  - `background.ts`: Background script for the browser extension
  - `content.ts`: Content script for the browser extension
  - `main`: Main application components, further organized into:
    - `activity`: Activity tracking components
    - `dashboard`: Main dashboard components
    - `history`: Transaction history components
    - `parameters`: Settings and parameters components
    - `proofChecker`: Components for proof verification
    - `transfer`: Components for transfer functionality
  - `popup`: Components for popup windows
  - `styles`: Style-related files

- **errors**: Error handling related code.

- **hooks**: Custom React hooks (e.g., useWallet).

- **lib**: Library code or third-party integrations.

- **locales**: Internationalization and localization files.

- **public**: Public assets accessible directly.

- **states**: State management code.

- **types**: TypeScript type definitions.

- **utils**: Utility functions used throughout the application.

## Component Organization

Components are organized based on their functionality and reusability:
- Shared components that are used across multiple parts of the application are placed in `components/shared`
- Feature-specific components are placed in their respective feature directories
- Layout components that define the structure of the application are in `components/layout`

## Entry Points

The application has multiple entry points:
- The main application entry point is in `entrypoints/main/main.tsx`
- The background script for the extension is in `entrypoints/background.ts`
- The content script for the extension is in `entrypoints/content.ts`
- Popup windows have their own entry points in `entrypoints/popup`

## Development Guidelines

When contributing to this project, please follow these guidelines:

1. Place new components in the appropriate directory based on their functionality
2. Reuse existing shared components when possible
3. Follow the established patterns for state management using contexts and hooks
4. Ensure proper typing with TypeScript
5. Maintain the separation of concerns between different parts of the application

## Getting Started

To start contributing:
1. Fork the repository
2. Clone your fork
3. Install dependencies
4. Make your changes following the structure described above
5. Submit a pull request

Thank you for contributing to the Carmentis Wallet Extension!