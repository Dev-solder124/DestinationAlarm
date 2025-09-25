import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:wakemethere/models/destination.dart';
import 'package:wakemethere/services/notification_service.dart';

class TripProvider with ChangeNotifier {
  Destination? _destination;
  Position? _currentPosition;
  double _distance = 0.0;
  double _alertDistance = 1000.0; // in meters
  bool _isTripActive = false;
  StreamSubscription<Position>? _positionStream;
  final NotificationService _notificationService = NotificationService();

  Destination? get destination => _destination;
  Position? get currentPosition => _currentPosition;
  double get distance => _distance;
  double get alertDistance => _alertDistance;
  bool get isTripActive => _isTripActive;

  TripProvider() {
    _notificationService.init();
  }

  void setAlertDistance(double distance) {
    _alertDistance = distance;
    notifyListeners();
  }

  void startTrip(Destination destination) {
    _destination = destination;
    _isTripActive = true;
    _positionStream =
        Geolocator.getPositionStream().listen((Position position) {
      _currentPosition = position;
      if (_destination != null) {
        _distance = Geolocator.distanceBetween(
          _currentPosition!.latitude,
          _currentPosition!.longitude,
          _destination!.latitude,
          _destination!.longitude,
        );
        if (_distance <= _alertDistance) {
          _notificationService.showNotification(
            'Approaching Destination',
            'You are now within ${_alertDistance / 1000}km of your destination.',
          );
          endTrip();
        }
      }
      notifyListeners();
    });
    notifyListeners();
  }

  void endTrip() {
    _destination = null;
    _isTripActive = false;
    _positionStream?.cancel();
    notifyListeners();
  }
}
