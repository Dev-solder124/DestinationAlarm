import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:wakemethere/models/destination.dart';
import 'package:wakemethere/services/location_service.dart';
import 'package:geocoding/geocoding.dart';
import 'package:wakemethere/services/storage_service.dart';

class AddDestinationScreen extends StatefulWidget {
  const AddDestinationScreen({super.key});

  @override
  State<AddDestinationScreen> createState() => _AddDestinationScreenState();
}

class _AddDestinationScreenState extends State<AddDestinationScreen> {
  late final LocationService _locationService;
  final StorageService _storageService = StorageService();
  LatLng? _currentPosition;
  GoogleMapController? _mapController;
  Set<Marker> _markers = {};
  Destination? _selectedDestination;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _locationService = LocationService();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    final position = await _locationService.getCurrentLocation();
    if (position != null) {
      setState(() {
        _currentPosition = LatLng(position.latitude, position.longitude);
      });
      _mapController?.animateCamera(
        CameraUpdate.newLatLngZoom(_currentPosition!, 15.0),
      );
    }
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
  }

  Future<void> _onTap(LatLng position) async {
    try {
      final placemarks =
          await placemarkFromCoordinates(position.latitude, position.longitude);
      if (placemarks.isNotEmpty) {
        final placemark = placemarks.first;
        setState(() {
          _selectedDestination = Destination(
            latitude: position.latitude,
            longitude: position.longitude,
            name: placemark.name ?? 'Selected Location',
            address:
                '${placemark.street}, ${placemark.locality}, ${placemark.country}',
          );
          _markers = {
            Marker(
              markerId: const MarkerId('destination'),
              position: position,
              infoWindow: InfoWindow(
                title: _selectedDestination!.name,
                snippet: _selectedDestination!.address,
              ),
            ),
          };
          _searchController.text = _selectedDestination!.name;
        });
      }
    } catch (e) {
      // TODO: Handle geocoding errors
    }
  }

  Future<void> _searchAndGo() async {
    try {
      final locations = await locationFromAddress(_searchController.text);
      if (locations.isNotEmpty) {
        final location = locations.first;
        final position = LatLng(location.latitude, location.longitude);
        _mapController?.animateCamera(
          CameraUpdate.newLatLngZoom(position, 15.0),
        );
        _onTap(position);
      }
    } catch (e) {
      // TODO: Handle search errors
    }
  }

  Future<void> _saveDestination() async {
    if (_selectedDestination == null) return;

    await _storageService.saveRecent(_selectedDestination!);

    // ignore: use_build_context_synchronously
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add to Favorites?'),
        content:
            const Text('Would you like to save this destination to your favorites?'),
        actions: [
          TextButton(
            onPressed: () {
              context.pop();
            },
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () async {
              await _storageService.saveFavorite(_selectedDestination!);
              // ignore: use_build_context_synchronously
              context.pop();
            },
            child: const Text('Yes'),
          ),
        ],
      ),
    ).then((_) => context.pop());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Destination'),
        actions: [
          if (_selectedDestination != null)
            IconButton(
              icon: const Icon(Icons.check),
              onPressed: _saveDestination,
            ),
        ],
      ),
      body: Stack(
        children: [
          GoogleMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: CameraPosition(
              target: _currentPosition ?? const LatLng(0, 0),
              zoom: 12.0,
            ),
            markers: _markers,
            onTap: _onTap,
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
          ),
          Positioned(
            top: 10,
            left: 10,
            right: 10,
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search for a destination...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30.0),
                  borderSide: BorderSide.none,
                ),
              ),
              onSubmitted: (value) => _searchAndGo(),
            ),
          ),
        ],
      ),
    );
  }
}
