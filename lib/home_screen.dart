import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:wakemethere/models/destination.dart';
import 'package:wakemethere/providers/trip_provider.dart';
import 'package:wakemethere/services/storage_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final StorageService _storageService = StorageService();
  List<Destination> _favorites = [];
  List<Destination> _recents = [];

  @override
  void initState() {
    super.initState();
    _loadDestinations();
  }

  Future<void> _loadDestinations() async {
    final favorites = await _storageService.getFavorites();
    final recents = await _storageService.getRecents();
    setState(() {
      _favorites = favorites;
      _recents = recents;
    });
  }

  Future<void> _deleteDestination(Destination destination, bool isFavorite) async {
    if (isFavorite) {
      await _storageService.removeFavorite(destination);
    } else {
      await _storageService.removeRecent(destination);
    }
    _loadDestinations();
  }

  void _startTrip(Destination destination) {
    Provider.of<TripProvider>(context, listen: false).startTrip(destination);
    context.go('/status');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Destinations'),
        actions: [
          IconButton(
            icon: const Icon(Icons.gps_fixed),
            onPressed: () {
              // TODO: Implement GPS status
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              decoration: InputDecoration(
                hintText: 'Search your destinations...',
                prefixIcon: const Icon(Icons.search),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              icon: const Icon(Icons.add),
              label: const Text('Add New Destination'),
              onPressed: () async {
                await context.push('/add-destination');
                _loadDestinations();
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
            ),
            const SizedBox(height: 24),
            Expanded(
              child: ListView(
                children: [
                  _buildDestinationList('Favorites', _favorites, true),
                  const SizedBox(height: 24),
                  _buildDestinationList('Recent Destinations', _recents, false),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDestinationList(
      String title, List<Destination> destinations, bool isFavorite) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            if (title == 'Favorites')
              TextButton(
                onPressed: () => context.go('/distance-settings'),
                child: const Text('distance'),
              ),
            if (title == 'Favorites')
              TextButton(
                onPressed: () => context.go('/alarm-settings'),
                child: const Text('alarm'),
              )
          ],
        ),
        const SizedBox(height: 8),
        if (destinations.isEmpty)
          const Text('No destinations yet.')
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: destinations.length,
            itemBuilder: (context, index) {
              final destination = destinations[index];
              return Card(
                child: ListTile(
                  title: Text(destination.name),
                  subtitle: Text(destination.address),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete_outline),
                    onPressed: () => _deleteDestination(destination, isFavorite),
                  ),
                  onTap: () => _startTrip(destination),
                ),
              );
            },
          ),
      ],
    );
  }
}
