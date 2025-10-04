import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../bloc/settings_bloc.dart';

class SiteSettingsPage extends StatefulWidget {
  const SiteSettingsPage({super.key});

  @override
  State<SiteSettingsPage> createState() => _SiteSettingsPageState();
}

class _SiteSettingsPageState extends State<SiteSettingsPage> {
  final _formKey = GlobalKey<FormState>();
  final _siteNameController = TextEditingController();
  final _siteDescriptionController = TextEditingController();
  final _siteUrlController = TextEditingController();
  final _faviconUrlController = TextEditingController();
  final _logoUrlController = TextEditingController();
  final _primaryColorController = TextEditingController();
  final _secondaryColorController = TextEditingController();
  final _googleAnalyticsController = TextEditingController();
  final _googleTagManagerController = TextEditingController();
  final _customCssController = TextEditingController();
  final _customJsController = TextEditingController();
  
  bool _isLoading = false;
  bool _enableAnalytics = true;
  bool _enableComments = true;
  bool _enableContactForm = true;
  bool _enableBlog = true;
  bool _enableProjects = true;
  bool _enableTestimonials = true;
  bool _enableResume = true;
  bool _maintenanceMode = false;
  String _selectedTheme = 'light';
  String _selectedLanguage = 'en';

  final List<String> _themes = ['light', 'dark', 'auto'];
  final List<String> _languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'];

  @override
  void initState() {
    super.initState();
    // Load site settings
    context.read<SettingsBloc>().add(GetSiteSettingsRequested());
  }

  @override
  void dispose() {
    _siteNameController.dispose();
    _siteDescriptionController.dispose();
    _siteUrlController.dispose();
    _faviconUrlController.dispose();
    _logoUrlController.dispose();
    _primaryColorController.dispose();
    _secondaryColorController.dispose();
    _googleAnalyticsController.dispose();
    _googleTagManagerController.dispose();
    _customCssController.dispose();
    _customJsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Site Settings'),
        backgroundColor: Colors.orange.shade600,
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
          } else if (state is SiteSettingsLoaded) {
            _populateForm(state.settings);
          } else if (state is SiteSettingsUpdated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Site settings updated successfully'),
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
                            Icons.settings,
                            size: 48,
                            color: Colors.orange.shade600,
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Site Configuration',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Configure your portfolio site appearance and functionality',
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

                  // Basic Information
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Basic Information',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _siteNameController,
                            decoration: const InputDecoration(
                              labelText: 'Site Name *',
                              hintText: 'My Portfolio',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Site name is required';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _siteDescriptionController,
                            decoration: const InputDecoration(
                              labelText: 'Site Description',
                              hintText: 'A brief description of your site',
                              border: OutlineInputBorder(),
                            ),
                            maxLines: 3,
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _siteUrlController,
                            decoration: const InputDecoration(
                              labelText: 'Site URL',
                              hintText: 'https://yourname.com',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value != null && value.isNotEmpty) {
                                if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                  return 'Please enter a valid URL';
                                }
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Branding
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Branding',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _logoUrlController,
                            decoration: const InputDecoration(
                              labelText: 'Logo URL',
                              hintText: 'https://example.com/logo.png',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value != null && value.isNotEmpty) {
                                if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                  return 'Please enter a valid URL';
                                }
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _faviconUrlController,
                            decoration: const InputDecoration(
                              labelText: 'Favicon URL',
                              hintText: 'https://example.com/favicon.ico',
                              border: OutlineInputBorder(),
                            ),
                            validator: (value) {
                              if (value != null && value.isNotEmpty) {
                                if (Uri.tryParse(value)?.hasAbsolutePath != true) {
                                  return 'Please enter a valid URL';
                                }
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: TextFormField(
                                  controller: _primaryColorController,
                                  decoration: const InputDecoration(
                                    labelText: 'Primary Color',
                                    hintText: '#3B82F6',
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: TextFormField(
                                  controller: _secondaryColorController,
                                  decoration: const InputDecoration(
                                    labelText: 'Secondary Color',
                                    hintText: '#10B981',
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Appearance
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Appearance',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('Theme'),
                                    const SizedBox(height: 8),
                                    DropdownButtonFormField<String>(
                                      value: _selectedTheme,
                                      decoration: const InputDecoration(
                                        border: OutlineInputBorder(),
                                      ),
                                      items: _themes.map((theme) {
                                        return DropdownMenuItem(
                                          value: theme,
                                          child: Text(theme.toUpperCase()),
                                        );
                                      }).toList(),
                                      onChanged: (value) {
                                        setState(() {
                                          _selectedTheme = value ?? 'light';
                                        });
                                      },
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('Language'),
                                    const SizedBox(height: 8),
                                    DropdownButtonFormField<String>(
                                      value: _selectedLanguage,
                                      decoration: const InputDecoration(
                                        border: OutlineInputBorder(),
                                      ),
                                      items: _languages.map((lang) {
                                        return DropdownMenuItem(
                                          value: lang,
                                          child: Text(lang.toUpperCase()),
                                        );
                                      }).toList(),
                                      onChanged: (value) {
                                        setState(() {
                                          _selectedLanguage = value ?? 'en';
                                        });
                                      },
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Features
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Features',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _buildFeatureToggle('Enable Blog', _enableBlog, (value) {
                            setState(() {
                              _enableBlog = value;
                            });
                          }),
                          _buildFeatureToggle('Enable Projects', _enableProjects, (value) {
                            setState(() {
                              _enableProjects = value;
                            });
                          }),
                          _buildFeatureToggle('Enable Testimonials', _enableTestimonials, (value) {
                            setState(() {
                              _enableTestimonials = value;
                            });
                          }),
                          _buildFeatureToggle('Enable Resume', _enableResume, (value) {
                            setState(() {
                              _enableResume = value;
                            });
                          }),
                          _buildFeatureToggle('Enable Contact Form', _enableContactForm, (value) {
                            setState(() {
                              _enableContactForm = value;
                            });
                          }),
                          _buildFeatureToggle('Enable Comments', _enableComments, (value) {
                            setState(() {
                              _enableComments = value;
                            });
                          }),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Analytics
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'Analytics',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const Spacer(),
                              Switch(
                                value: _enableAnalytics,
                                onChanged: (value) {
                                  setState(() {
                                    _enableAnalytics = value;
                                  });
                                },
                                activeColor: Colors.orange,
                              ),
                            ],
                          ),
                          if (_enableAnalytics) ...[
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _googleAnalyticsController,
                              decoration: const InputDecoration(
                                labelText: 'Google Analytics ID',
                                hintText: 'G-XXXXXXXXXX',
                                border: OutlineInputBorder(),
                              ),
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _googleTagManagerController,
                              decoration: const InputDecoration(
                                labelText: 'Google Tag Manager ID',
                                hintText: 'GTM-XXXXXXX',
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Advanced Settings
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'Advanced Settings',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const Spacer(),
                              Switch(
                                value: _maintenanceMode,
                                onChanged: (value) {
                                  setState(() {
                                    _maintenanceMode = value;
                                  });
                                },
                                activeColor: Colors.red,
                              ),
                              const SizedBox(width: 8),
                              const Text('Maintenance Mode'),
                            ],
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _customCssController,
                            decoration: const InputDecoration(
                              labelText: 'Custom CSS',
                              hintText: '/* Your custom CSS code */',
                              border: OutlineInputBorder(),
                              alignLabelWithHint: true,
                            ),
                            maxLines: 4,
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _customJsController,
                            decoration: const InputDecoration(
                              labelText: 'Custom JavaScript',
                              hintText: '// Your custom JavaScript code',
                              border: OutlineInputBorder(),
                              alignLabelWithHint: true,
                            ),
                            maxLines: 4,
                          ),
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
                        backgroundColor: Colors.orange.shade600,
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

  Widget _buildFeatureToggle(String title, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              style: const TextStyle(fontSize: 16),
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: Colors.orange,
          ),
        ],
      ),
    );
  }

  void _populateForm(Map<String, String> settings) {
    _siteNameController.text = settings['siteName'] ?? '';
    _siteDescriptionController.text = settings['siteDescription'] ?? '';
    _siteUrlController.text = settings['siteUrl'] ?? '';
    _faviconUrlController.text = settings['faviconUrl'] ?? '';
    _logoUrlController.text = settings['logoUrl'] ?? '';
    _primaryColorController.text = settings['primaryColor'] ?? '';
    _secondaryColorController.text = settings['secondaryColor'] ?? '';
    _googleAnalyticsController.text = settings['googleAnalytics'] ?? '';
    _googleTagManagerController.text = settings['googleTagManager'] ?? '';
    _customCssController.text = settings['customCss'] ?? '';
    _customJsController.text = settings['customJs'] ?? '';
    
    _enableAnalytics = settings['enableAnalytics'] == 'true';
    _enableComments = settings['enableComments'] == 'true';
    _enableContactForm = settings['enableContactForm'] == 'true';
    _enableBlog = settings['enableBlog'] == 'true';
    _enableProjects = settings['enableProjects'] == 'true';
    _enableTestimonials = settings['enableTestimonials'] == 'true';
    _enableResume = settings['enableResume'] == 'true';
    _maintenanceMode = settings['maintenanceMode'] == 'true';
    _selectedTheme = settings['theme'] ?? 'light';
    _selectedLanguage = settings['language'] ?? 'en';
  }

  void _saveSettings() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      final settings = {
        'siteName': _siteNameController.text.trim(),
        'siteDescription': _siteDescriptionController.text.trim(),
        'siteUrl': _siteUrlController.text.trim(),
        'faviconUrl': _faviconUrlController.text.trim(),
        'logoUrl': _logoUrlController.text.trim(),
        'primaryColor': _primaryColorController.text.trim(),
        'secondaryColor': _secondaryColorController.text.trim(),
        'googleAnalytics': _googleAnalyticsController.text.trim(),
        'googleTagManager': _googleTagManagerController.text.trim(),
        'customCss': _customCssController.text.trim(),
        'customJs': _customJsController.text.trim(),
        'enableAnalytics': _enableAnalytics.toString(),
        'enableComments': _enableComments.toString(),
        'enableContactForm': _enableContactForm.toString(),
        'enableBlog': _enableBlog.toString(),
        'enableProjects': _enableProjects.toString(),
        'enableTestimonials': _enableTestimonials.toString(),
        'enableResume': _enableResume.toString(),
        'maintenanceMode': _maintenanceMode.toString(),
        'theme': _selectedTheme,
        'language': _selectedLanguage,
      };

      context.read<SettingsBloc>().add(UpdateSiteSettingsRequested(settings));
    }
  }
}
