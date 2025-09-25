import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wakemethere/providers/trip_provider.dart';

class StatusScreen extends StatelessWidget {
  const StatusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trip Status'),
      ),
      body: Consumer<TripProvider>(
        builder: (context, tripProvider, child) {
          if (!tripProvider.isTripActive) {
            return const Center(
              child: Text('No active trip.'),
            );
          }
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Destination: ${tripProvider.destination?.name}',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Text(
                  'Remaining Distance: ${(tripProvider.distance / 1000).toStringAsFixed(2)} km',
                  style: const TextStyle(fontSize: 16),
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: () {
                    tripProvider.endTrip();
                  },
                  child: const Text('End Trip'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
