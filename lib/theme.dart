import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primarySeedColor = Color(0xFF1E1E2C);
  static const Color textColor = Colors.white;

  static ThemeData get darkTheme {
    final ColorScheme colorScheme = ColorScheme.fromSeed(
      seedColor: primarySeedColor,
      brightness: Brightness.dark,
      surface: const Color(0xFF1E1E2C),
      onSurface: textColor,
    );

    final TextTheme textTheme = TextTheme(
      displayLarge: GoogleFonts.oswald(fontSize: 57, fontWeight: FontWeight.bold, color: textColor),
      titleLarge: GoogleFonts.roboto(fontSize: 22, fontWeight: FontWeight.w500, color: textColor),
      bodyMedium: GoogleFonts.openSans(fontSize: 14, color: textColor),
      labelLarge: GoogleFonts.roboto(fontSize: 16, fontWeight: FontWeight.w500, color: textColor),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: colorScheme.surface,
        foregroundColor: textColor,
        elevation: 0,
        titleTextStyle: GoogleFonts.oswald(fontSize: 24, fontWeight: FontWeight.bold),
      ),
      scaffoldBackgroundColor: colorScheme.surface,
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          foregroundColor: colorScheme.onPrimary,
          backgroundColor: colorScheme.primary,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          textStyle: textTheme.labelLarge,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colorScheme.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        hintStyle: textTheme.bodyMedium?.copyWith(color: Colors.grey[400]),
      ),
      cardTheme: CardThemeData(
        color: colorScheme.surface,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
