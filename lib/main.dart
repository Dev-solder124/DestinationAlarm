import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:wakemethere/providers/trip_provider.dart';
import 'package:wakemethere/screens/add_destination_screen.dart';
import 'package:wakemethere/screens/alarm_settings_screen.dart';
import 'package:wakemethere/screens/distance_settings_screen.dart';
import 'package:wakemethere/screens/status_screen.dart';
import 'package:wakemethere/theme.dart';

import 'home_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => ThemeProvider()),
        ChangeNotifierProvider(create: (context) => TripProvider()),
      ],
      child: const WakeMeThereApp(),
    ),
  );
}

class ThemeProvider with ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.dark;

  ThemeMode get themeMode => _themeMode;

  void toggleTheme() {
    _themeMode =
        _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }
}

final _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/add-destination',
      builder: (context, state) => const AddDestinationScreen(),
    ),
    GoRoute(
      path: '/distance-settings',
      builder: (context, state) => const DistanceSettingsScreen(),
    ),
    GoRoute(
      path: '/alarm-settings',
      builder: (context, state) => const AlarmSettingsScreen(),
    ),
    GoRoute(
      path: '/status',
      builder: (context, state) => const StatusScreen(),
    ),
  ],
);

class WakeMeThereApp extends StatelessWidget {
  const WakeMeThereApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp.router(
          title: 'WakeMeThere',
          theme: AppTheme.darkTheme, // For now, we only have a dark theme
          darkTheme: AppTheme.darkTheme,
          themeMode: themeProvider.themeMode,
          routerConfig: _router,
        );
      },
    );
  }
}
