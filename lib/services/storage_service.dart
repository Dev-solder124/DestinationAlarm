import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:wakemethere/models/destination.dart';

class StorageService {
  static const String _favoritesKey = 'favorites';
  static const String _recentsKey = 'recents';

  Future<void> saveFavorite(Destination destination) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await getFavorites();
    favorites.add(destination);
    await _saveDestinations(prefs, _favoritesKey, favorites);
  }

  Future<void> saveRecent(Destination destination) async {
    final prefs = await SharedPreferences.getInstance();
    final recents = await getRecents();
    // Avoid duplicates
    recents.removeWhere((d) =>
        d.latitude == destination.latitude &&
        d.longitude == destination.longitude);
    recents.insert(0, destination);
    // Keep only the last 10 recents
    if (recents.length > 10) {
      recents.removeLast();
    }
    await _saveDestinations(prefs, _recentsKey, recents);
  }

  Future<List<Destination>> getFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    return _getDestinations(prefs, _favoritesKey);
  }

  Future<List<Destination>> getRecents() async {
    final prefs = await SharedPreferences.getInstance();
    return _getDestinations(prefs, _recentsKey);
  }

  Future<void> removeFavorite(Destination destination) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await getFavorites();
    favorites.removeWhere((d) =>
        d.latitude == destination.latitude &&
        d.longitude == destination.longitude);
    await _saveDestinations(prefs, _favoritesKey, favorites);
  }

  Future<void> removeRecent(Destination destination) async {
    final prefs = await SharedPreferences.getInstance();
    final recents = await getRecents();
    recents.removeWhere((d) =>
        d.latitude == destination.latitude &&
        d.longitude == destination.longitude);
    await _saveDestinations(prefs, _recentsKey, recents);
  }

  Future<void> _saveDestinations(
      SharedPreferences prefs, String key, List<Destination> destinations) async {
    final destinationList =
        destinations.map((d) => jsonEncode({
          'latitude': d.latitude,
          'longitude': d.longitude,
          'name': d.name,
          'address': d.address,
        })).toList();
    await prefs.setStringList(key, destinationList);
  }

  List<Destination> _getDestinations(SharedPreferences prefs, String key) {
    final destinationList = prefs.getStringList(key) ?? [];
    return destinationList
        .map((d) {
          final json = jsonDecode(d);
          return Destination(
            latitude: json['latitude'],
            longitude: json['longitude'],
            name: json['name'],
            address: json['address'],
          );
        })
        .toList();
  }
}
