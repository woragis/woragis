import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../bloc/about_bloc.dart';

class EditAboutPage extends StatefulWidget {
  const EditAboutPage({super.key});

  @override
  State<EditAboutPage> createState() => _EditAboutPageState();
}

class _EditAboutPageState extends State<EditAboutPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _biographyController = TextEditingController();
  final _featuredBiographyController = TextEditingController();
  final _currentProfessionController = TextEditingController();

  bool _isVisible = true;

  @override
  void initState() {
    super.initState();
    // Load current about data
    context.read<AboutBloc>().add(const LoadAboutCore());
  }

  @override
  void dispose() {
    _nameController.dispose();
    _biographyController.dispose();
    _featuredBiographyController.dispose();
    _currentProfessionController.dispose();
    super.dispose();
  }

  void _loadCurrentData() {
    final state = context.read<AboutBloc>().state;
    if (state is AboutLoaded) {
      _nameController.text = state.aboutCore.name;
      _biographyController.text = state.aboutCore.biography ?? '';
      _featuredBiographyController.text = state.aboutCore.featuredBiography ?? '';
      _currentProfessionController.text = state.aboutCore.currentProfessionId ?? '';
      _isVisible = state.aboutCore.visible;
    }
  }

  void _saveAbout() {
    if (_formKey.currentState!.validate()) {
      context.read<AboutBloc>().add(UpdateAboutCore(
        name: _nameController.text,
        currentProfessionId: _currentProfessionController.text.isEmpty 
            ? null 
            : _currentProfessionController.text,
        biography: _biographyController.text.isEmpty 
            ? null 
            : _biographyController.text,
        featuredBiography: _featuredBiographyController.text.isEmpty 
            ? null 
            : _featuredBiographyController.text,
        visible: _isVisible,
      ));

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('About information updated successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit About'),
        actions: [
          TextButton(
            onPressed: _saveAbout,
            child: const Text('Save'),
          ),
        ],
      ),
      body: BlocListener<AboutBloc, AboutState>(
        listener: (context, state) {
          if (state is AboutLoaded) {
            _loadCurrentData();
          }
        },
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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

                        // Name
                        TextFormField(
                          controller: _nameController,
                          decoration: const InputDecoration(
                            labelText: 'Name *',
                            hintText: 'Your full name',
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your name';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Current Profession
                        TextFormField(
                          controller: _currentProfessionController,
                          decoration: const InputDecoration(
                            labelText: 'Current Profession',
                            hintText: 'e.g., Software Developer, Designer',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Biography Section
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Biography',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Featured Biography
                        TextFormField(
                          controller: _featuredBiographyController,
                          decoration: const InputDecoration(
                            labelText: 'Featured Biography',
                            hintText: 'Short summary for your profile',
                            helperText: 'This will be displayed prominently on your profile',
                          ),
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),

                        // Full Biography
                        TextFormField(
                          controller: _biographyController,
                          decoration: const InputDecoration(
                            labelText: 'Full Biography',
                            hintText: 'Detailed information about yourself',
                            helperText: 'Tell your story, background, and interests',
                          ),
                          maxLines: 5,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Settings
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Settings',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Visibility
                        SwitchListTile(
                          title: const Text('Public Profile'),
                          subtitle: const Text('Make your about information visible to others'),
                          value: _isVisible,
                          onChanged: (value) {
                            setState(() {
                              _isVisible = value;
                            });
                          },
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
                    onPressed: _saveAbout,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text(
                      'Update About Information',
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
