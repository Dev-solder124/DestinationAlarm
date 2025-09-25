import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationService {
  Future<Position?>getCurrentLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // TODO: Handle case where location services are disabled.
      return null;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        // TODO: Handle case where permission is denied.
        return null;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      // TODO: Handle case where permission is permanently denied.
      return null;
    }

    return await Geolocator.getCurrentPosition();
  }

  Future<PermissionStatus> requestPermission() async {
    final status = await Permission.location.request();
    return status;
  }
}
