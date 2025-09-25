# WakeMeThere App Blueprint

## Overview

WakeMeThere is a destination alarm app for Android and iOS, designed for travelers on public transport. It uses GPS to track the user's location and triggers an alarm when they approach their destination, allowing them to rest without worrying about missing their stop.

## Style and Design

*   **Theme**: The app will use a modern, clean, and intuitive dark theme (Material 3) to reduce eye strain, especially during night travel.
*   **Typography**: Custom fonts will be used via the `google_fonts` package to enhance readability and aesthetics. The primary fonts will be Oswald for headings and Roboto for body text.
*   **Iconography**: Clear and universally understood icons will be used to ensure ease of navigation and interaction.
*   **Color Scheme**: The color scheme will be based on a deep purple seed color, generating a harmonious and accessible palette for both light and dark modes.

## Features

### Implemented

*   **Project Setup**: Initial Flutter project created.
*   **Core Dependencies**: `provider`, `go_router`, and `google_fonts` have been added for state management, navigation, and typography.
*   **Theming**: A full Material 3 theme is implemented with a dark theme as the default. A `ThemeProvider` is set up to allow for future light/dark mode toggling.
*   **Routing**: A basic routing system is configured using `go_router` for navigating between screens.
*   **Home Screen**: A placeholder home screen is created with a clear structure, including a title, a placeholder for favorite/recent destinations, and a prominent "Set New Destination" button.

### Current Plan

1.  **Add Core Dependencies**: Integrate packages for mapping, geolocation, local notifications, and local storage (`google_maps_flutter`, `geolocator`, `flutter_local_notifications`, `shared_preferences`).
2.  **Refine Home Screen**: Implement the UI for displaying lists of "Favorite" and "Recent" destinations.
3.  **Build Destination Selection Screen**:
    *   Create a new screen with a `GoogleMap` widget.
    *   Implement a search bar that allows users to find and pinpoint a location.
4.  **Implement Location Service**: Create a service to handle real-time GPS tracking using the `geolocator` package.
5.  **Develop Alarm Functionality**:
    *   Create a screen for alarm customization (alert distance, tones, vibration).
    *   Integrate `flutter_local_notifications` to trigger alerts when the user is near their destination.
6.  **Implement State Management**: Use the `provider` package to manage the application's state, including destination, alarm settings, and trip status.
7.  **Background Execution**: Ensure the location tracking and alarm logic can run efficiently in the background.
8.  **Local Storage**: Use `shared_preferences` to save and retrieve favorite and recent destinations.
