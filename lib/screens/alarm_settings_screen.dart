import 'package:flutter/material.dart';
import 'package:wakemethere/services/notification_service.dart';

class AlarmSettingsScreen extends StatefulWidget {
  const AlarmSettingsScreen({super.key});

  @override
  State<AlarmSettingsScreen> createState() => _AlarmSettingsScreenState();
}

class _AlarmSettingsScreenState extends State<AlarmSettingsScreen> {
  final NotificationService _notificationService = NotificationService();
  bool _soundAlert = true;
  bool _vibrationAlert = true;
  String _selectedSound = 'Gentle Chime';
  String _selectedVibration = 'Short Buzz';

  @override
  void initState() {
    super.initState();
    _notificationService.init();
  }

  void _testAlarm() {
    String title = 'Test Alarm';
    String body = 'This is a test of your alarm settings.';
    if (_soundAlert && _vibrationAlert) {
      _notificationService.showNotification(title, body);
    } else if (_soundAlert) {
      _notificationService.showNotification(title, body);
    } else if (_vibrationAlert) {
      _notificationService.showNotification(title, body);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enable sound or vibration to test the alarm.'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Alarm Settings'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildSectionHeader('Sound Alert', _soundAlert, (value) {
              setState(() {
                _soundAlert = value;
              });
            }),
            if (_soundAlert) _buildSoundOptions(),
            const SizedBox(height: 24),
            _buildSectionHeader('Vibration Alert', _vibrationAlert, (value) {
              setState(() {
                _vibrationAlert = value;
              });
            }),
            if (_vibrationAlert) _buildVibrationOptions(),
            const Spacer(),
            OutlinedButton.icon(
              icon: const Icon(Icons.play_arrow),
              label: const Text('Test Alarm'),
              onPressed: _testAlarm,
              style: OutlinedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(
      String title, bool value, ValueChanged<bool> onChanged) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        Switch(
          value: value,
          onChanged: onChanged,
        ),
      ],
    );
  }

  Widget _buildSoundOptions() {
    final sounds = [
      {'title': 'Gentle Chime', 'subtitle': 'Soft and pleasant'},
      {'title': 'Classic Bell', 'subtitle': 'Traditional alarm sound'},
      {'title': 'Modern Beep', 'subtitle': 'Clean digital tone'},
      {'title': 'Nature Sound', 'subtitle': 'Birds chirping'},
      {'title': 'Urgent Alert', 'subtitle': 'For heavy sleepers'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 16),
        const Text('Choose Alarm Tone'),
        const SizedBox(height: 8),
        ...sounds.map((sound) => _buildOptionCard(
              sound['title']!,
              sound['subtitle']!,
              _selectedSound == sound['title'],
              () {
                setState(() {
                  _selectedSound = sound['title']!;
                });
              },
            )),
      ],
    );
  }

  Widget _buildVibrationOptions() {
    final vibrations = [
      {'title': 'Short Buzz', 'subtitle': '...'},
      {'title': 'Long Pulse', 'subtitle': '___'},
      {'title': 'Pattern', 'subtitle': '_.._'},
      {'title': 'Intense', 'subtitle': '......'},
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 16),
        const Text('Vibration Pattern'),
        const SizedBox(height: 8),
        ...vibrations.map((vibration) => _buildOptionCard(
              vibration['title']!,
              vibration['subtitle']!,
              _selectedVibration == vibration['title'],
              () {
                setState(() {
                  _selectedVibration = vibration['title']!;
                });
              },
            )),
      ],
    );
  }

  Widget _buildOptionCard(
      String title, String subtitle, bool isSelected, VoidCallback onTap) {
    return Card(
      color: isSelected ? Theme.of(context).colorScheme.primaryContainer : null,
      child: ListTile(
        title: Text(title),
        subtitle: Text(subtitle),
        onTap: onTap,
      ),
    );
  }
}
