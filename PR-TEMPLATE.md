# Dark/Light Mode Theme Implementation

## Description
This PR adds a fully functional dark/light mode theme system to the GenZ Finance Management application, enhancing user experience by allowing personalized visual preferences.

## Changes Made
- Created `tailwind.config.js` with class-based dark mode configuration
- Enhanced `SettingsContext` to apply theme classes and detect theme changes
- Updated the Settings component with immediate theme toggle saving
- Applied theme-sensitive styling across all main components (Layout, Home, TransactionList)
- Added orange border styling to card components in both themes
- Implemented smooth CSS transitions for theme switching
- Ensured appropriate color contrast for accessibility in both themes

## How to Test
1. Navigate to Settings > Profile
2. Toggle the "Dark Mode" switch
3. Verify the theme changes immediately across the application
4. Check that all components maintain proper styling in both themes
5. Verify the orange border is visible on card components in both themes

## Screenshots
[Screenshots would be attached to the PR showing dark and light themes]

## Technical Notes
- The implementation uses Tailwind's `darkMode: 'class'` approach
- Theme preference is stored in the user settings and persisted via API
- Transitions are applied via CSS to ensure smooth visual changes
- Conditional styling is applied based on the current theme setting

## Related Issues
Closes #XX (Replace with actual issue number if applicable)

## Checklist
- [x] Code follows project's style guidelines
- [x] Components maintain functionality in both themes
- [x] All UI elements have appropriate contrast in both themes
- [x] Changes are responsive across different screen sizes
- [x] Documentation updated where necessary 