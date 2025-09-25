import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:wakemethere/providers/trip_provider.dart';

class DistanceSettingsScreen extends StatefulWidget {
  const DistanceSettingsScreen({super.key});

  @override
  State<DistanceSettingsScreen> createState() => _DistanceSettingsScreenState();
}

class _DistanceSettingsScreenState extends State<DistanceSettingsScreen> {
  double _currentSliderValue = 1.0;

  @override
  void initState() {
    super.initState();
    _currentSliderValue =
        Provider.of<TripProvider>(context, listen: false).alertDistance / 1000;
  }

  void _setDistance(double km) {
    setState(() {
      _currentSliderValue = km;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Alert Distance'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${_currentSliderValue.toStringAsFixed(1)}km',
              style: Theme.of(context).textTheme.displayLarge,
            ),
            const Text(
                "You'll be alerted when you're this close to your destination"),
            const SizedBox(height: 32),
            const Text(
              'Quick Options',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildQuickOptionButton('100m', 0.1),
                _buildQuickOptionButton('250m', 0.25),
                _buildQuickOptionButton('500m', 0.5),
                _buildQuickOptionButton('1.0km', 1.0),
                _buildQuickOptionButton('2.0km', 2.0),
              ],
            ),
            const SizedBox(height: 32),
            const Text(
              'Custom Distance',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Slider(
              value: _currentSliderValue,
              min: 0.1,
              max: 5.0,
              divisions: 49,
              label: _currentSliderValue.toStringAsFixed(1),
              onChanged: (double value) {
                _setDistance(value);
              },
            ),
            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      "Alert Zone\nYou'll receive notifications when entering this area",
                    ),
                  ),
                ],
              ),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () {
                Provider.of<TripProvider>(context, listen: false)
                    .setAlertDistance(_currentSliderValue * 1000);
                Navigator.of(context).pop();
              },
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Set Alert Distance'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickOptionButton(String text, double value) {
    return OutlinedButton(
      onPressed: () {
        _setDistance(value);
      },
      child: Text(text),
    );
  }
}
