# Dark/Light Mode Theme Feature

The GenZ Finance Management application now supports a fully customizable dark/light mode theme system, allowing users to choose their preferred visual experience.

## Theme Toggle

Users can toggle between dark and light mode through the Settings > Profile page:

- **Dark Mode**: Optimized for low-light environments with a dark background and light text
- **Light Mode**: Classic bright interface with dark text on light background

## Features

- **Real-time Switching**: Theme changes are applied instantly throughout the application
- **Persistent Settings**: Theme preference is saved automatically and preserved across sessions
- **Smooth Transitions**: Visual elements transition smoothly between themes
- **Consistent Design**: All components maintain visual harmony in both themes
- **Accessible Contrast**: Text and interactive elements maintain proper contrast ratios in both themes

## Implementation

The theme system is implemented using:

- Tailwind CSS dark mode with the 'class' strategy
- React Context for global theme state management
- CSS transitions for smooth visual changes

## Screenshots

### Dark Mode
[Dark mode screenshot would be inserted here]

### Light Mode
[Light mode screenshot would be inserted here]

## Developer Notes

### Adding Theme Support to New Components

When creating new components, follow these patterns for theme support:

```jsx
// Import the settings context
import { useSettings } from '../context/SettingsContext';

const YourComponent = () => {
  // Access the current theme mode
  const { settings } = useSettings();
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  // Create conditional styling based on theme
  const cardStyle = isDarkMode 
    ? "bg-gray-900 border-orange-500 border-l-4" 
    : "bg-white border-orange-500 border-l-4";
  
  return (
    <div className={cardStyle}>
      {/* Component content */}
    </div>
  );
};
``` 