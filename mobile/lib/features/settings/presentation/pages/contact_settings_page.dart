import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/settings_bloc.dart';

class ContactSettingsPage extends StatefulWidget {
  const ContactSettingsPage({super.key});

  @override
  State<ContactSettingsPage> createState() => _ContactSettingsPageState();
}

class _ContactSettingsPageState extends State<ContactSettingsPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _addressController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _zipCodeController = TextEditingController();
  final _countryController = TextEditingController();
  final _skypeController = TextEditingController();
  final _telegramController = TextEditingController();
  final _whatsappController = TextEditingController();
  
  bool _isLoading = false;
  bool _showPhone = true;
  bool _showAddress = true;
  bool _showMessaging = true;

  @override
  void initState() {
    super.initState();
    // Load contact settings
    context.read<SettingsBloc>().add(GetContactSettingsRequested());
  }

  @override
  void dispose() {
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _zipCodeController.dispose();
    _countryController.dispose();
    _skypeController.dispose();
    _telegramController.dispose();
    _whatsappController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Contact Information'),
        backgroundColor: Colors.green.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: true,
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _saveSettings,
            child: Text(
              'Save',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: BlocConsumer<SettingsBloc, SettingsState>(
        listener: (context, state) {
          if (state is SettingsError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is ContactSettingsLoaded) {
            _populateForm(state.settings);
          } else if (state is ContactSettingsUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Contact settings updated successfully'),
                backgroundColor: Colors.green,
              ),
            );
            setState(() {
              _isLoading = false;
            });
          }
        },
        builder: (context, state) {
          if (state is SettingsLoading && !_isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Icon(
                            Icons.contact_mail,
                            size: 48,
                            color: Colors.green.shade600,
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Contact Information',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Manage how people can get in touch with you',
                            style: TextStyle(
                              color: Colors.grey.shade600,
                              fontSize: 14,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Email Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.email,
                                color: Colors.green.shade600,
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Email',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _emailController,
                            decoration: const InputDecoration(
                              labelText: 'Email Address *',
                              hintText: 'your.email@example.com',
                              border: OutlineInputBorder(),
                              prefixIcon: Icon(Icons.email),
                            ),
                            keyboardType: TextInputType.emailAddress,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Email is required';
                              }
                              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                                return 'Please enter a valid email';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Phone Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.phone,
                                color: Colors.green.shade600,
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Phone',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const Spacer(),
                              Switch(
                                value: _showPhone,
                                onChanged: (value) {
                                  setState(() {
                                    _showPhone = value;
                                  });
                                },
                                activeColor: Colors.green,
                              ),
                            ],
                          ),
                          if (_showPhone) ...[
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _phoneController,
                              decoration: const InputDecoration(
                                labelText: 'Phone Number',
                                hintText: '+1 (555) 123-4567',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.phone),
                              ),
                              keyboardType: TextInputType.phone,
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Address Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.location_on,
                                color: Colors.green.shade600,
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Address',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const Spacer(),
                              Switch(
                                value: _showAddress,
                                onChanged: (value) {
                                  setState(() {
                                    _showAddress = value;
                                  });
                                },
                                activeColor: Colors.green,
                              ),
                            ],
                          ),
                          if (_showAddress) ...[
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _addressController,
                              decoration: const InputDecoration(
                                labelText: 'Street Address',
                                hintText: '123 Main Street',
                                border: OutlineInputBorder(),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(
                                  flex: 2,
                                  child: TextFormField(
                                    controller: _cityController,
                                    decoration: const InputDecoration(
                                      labelText: 'City',
                                      border: OutlineInputBorder(),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: TextFormField(
                                    controller: _stateController,
                                    decoration: const InputDecoration(
                                      labelText: 'State',
                                      border: OutlineInputBorder(),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: TextFormField(
                                    controller: _zipCodeController,
                                    decoration: const InputDecoration(
                                      labelText: 'ZIP',
                                      border: OutlineInputBorder(),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _countryController,
                              decoration: const InputDecoration(
                                labelText: 'Country',
                                hintText: 'United States',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Messaging Apps Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.chat,
                                color: Colors.green.shade600,
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Messaging Apps',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const Spacer(),
                              Switch(
                                value: _showMessaging,
                                onChanged: (value) {
                                  setState(() {
                                    _showMessaging = value;
                                  });
                                },
                                activeColor: Colors.green,
                              ),
                            ],
                          ),
                          if (_showMessaging) ...[
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _skypeController,
                              decoration: const InputDecoration(
                                labelText: 'Skype',
                                hintText: 'your.skype.username',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.chat_bubble),
                              ),
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _telegramController,
                              decoration: const InputDecoration(
                                labelText: 'Telegram',
                                hintText: '@username',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.send),
                              ),
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _whatsappController,
                              decoration: const InputDecoration(
                                labelText: 'WhatsApp',
                                hintText: '+1 555 123 4567',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.phone_android),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Preview Section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Preview',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildContactPreview(),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Save Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _saveSettings,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green.shade600,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: _isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Colors.white,
                                ),
                              ),
                            )
                          : const Text(
                              'Save Settings',
                              style: TextStyle(fontSize: 16),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildContactPreview() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_emailController.text.isNotEmpty) ...[
          _buildContactItem(Icons.email, 'Email', _emailController.text),
          const SizedBox(height: 8),
        ],
        if (_showPhone && _phoneController.text.isNotEmpty) ...[
          _buildContactItem(Icons.phone, 'Phone', _phoneController.text),
          const SizedBox(height: 8),
        ],
        if (_showAddress && _addressController.text.isNotEmpty) ...[
          _buildContactItem(Icons.location_on, 'Address', _getFullAddress()),
          const SizedBox(height: 8),
        ],
        if (_showMessaging) ...[
          if (_skypeController.text.isNotEmpty) ...[
            _buildContactItem(Icons.chat_bubble, 'Skype', _skypeController.text),
            const SizedBox(height: 8),
          ],
          if (_telegramController.text.isNotEmpty) ...[
            _buildContactItem(Icons.send, 'Telegram', _telegramController.text),
            const SizedBox(height: 8),
          ],
          if (_whatsappController.text.isNotEmpty) ...[
            _buildContactItem(Icons.phone_android, 'WhatsApp', _whatsappController.text),
            const SizedBox(height: 8),
          ],
        ],
        if (_emailController.text.isEmpty &&
            (!_showPhone || _phoneController.text.isEmpty) &&
            (!_showAddress || _addressController.text.isEmpty) &&
            (!_showMessaging || (_skypeController.text.isEmpty &&
                _telegramController.text.isEmpty &&
                _whatsappController.text.isEmpty)))
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.info_outline,
                  color: Colors.grey.shade600,
                ),
                const SizedBox(width: 8),
                Text(
                  'No contact information added yet',
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildContactItem(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey.shade600),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: TextStyle(
            fontWeight: FontWeight.w500,
            color: Colors.grey.shade700,
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: TextStyle(color: Colors.grey.shade600),
          ),
        ),
      ],
    );
  }

  String _getFullAddress() {
    final parts = <String>[];
    if (_addressController.text.isNotEmpty) parts.add(_addressController.text);
    if (_cityController.text.isNotEmpty) parts.add(_cityController.text);
    if (_stateController.text.isNotEmpty) parts.add(_stateController.text);
    if (_zipCodeController.text.isNotEmpty) parts.add(_zipCodeController.text);
    if (_countryController.text.isNotEmpty) parts.add(_countryController.text);
    return parts.join(', ');
  }

  void _populateForm(Map<String, String> settings) {
    _emailController.text = settings['email'] ?? '';
    _phoneController.text = settings['phone'] ?? '';
    _addressController.text = settings['address'] ?? '';
    _cityController.text = settings['city'] ?? '';
    _stateController.text = settings['state'] ?? '';
    _zipCodeController.text = settings['zipCode'] ?? '';
    _countryController.text = settings['country'] ?? '';
    _skypeController.text = settings['skype'] ?? '';
    _telegramController.text = settings['telegram'] ?? '';
    _whatsappController.text = settings['whatsapp'] ?? '';
    _showPhone = settings['showPhone'] == 'true';
    _showAddress = settings['showAddress'] == 'true';
    _showMessaging = settings['showMessaging'] == 'true';
  }

  void _saveSettings() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      final settings = {
        'email': _emailController.text.trim(),
        'phone': _phoneController.text.trim(),
        'address': _addressController.text.trim(),
        'city': _cityController.text.trim(),
        'state': _stateController.text.trim(),
        'zipCode': _zipCodeController.text.trim(),
        'country': _countryController.text.trim(),
        'skype': _skypeController.text.trim(),
        'telegram': _telegramController.text.trim(),
        'whatsapp': _whatsappController.text.trim(),
        'showPhone': _showPhone.toString(),
        'showAddress': _showAddress.toString(),
        'showMessaging': _showMessaging.toString(),
      };

      context.read<SettingsBloc>().add(UpdateContactSettingsRequested(settings));
    }
  }
}
