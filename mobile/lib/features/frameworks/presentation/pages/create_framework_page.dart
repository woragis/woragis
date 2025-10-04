import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../domain/entities/framework_entity.dart';

class CreateFrameworkPage extends StatefulWidget {
  final String? frameworkId;

  const CreateFrameworkPage({
    super.key,
    this.frameworkId,
  });

  @override
  State<CreateFrameworkPage> createState() => _CreateFrameworkPageState();
}

class _CreateFrameworkPageState extends State<CreateFrameworkPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _slugController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _iconController = TextEditingController();
  final _colorController = TextEditingController();

  FrameworkType _selectedType = FrameworkType.framework;
  ProficiencyLevel? _selectedProficiency;
  bool _isVisible = true;
  bool _isPublic = true;
  int _order = 0;

  bool get _isEditing => widget.frameworkId != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      _loadFrameworkData();
    }
  }

  void _loadFrameworkData() {
    // TODO: Load actual framework data from BLoC or API
    // For now, using placeholder data
    _nameController.text = 'Flutter';
    _slugController.text = 'flutter';
    _descriptionController.text = 'A UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.';
    _iconController.text = 'flutter';
    _colorController.text = '#02569B';
    _selectedType = FrameworkType.framework;
    _selectedProficiency = ProficiencyLevel.advanced;
    _isVisible = true;
    _isPublic = true;
    _order = 1;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _slugController.dispose();
    _descriptionController.dispose();
    _iconController.dispose();
    _colorController.dispose();
    super.dispose();
  }

  void _generateSlug() {
    final name = _nameController.text;
    if (name.isNotEmpty) {
      _slugController.text = name.toLowerCase().replaceAll(RegExp(r'[^a-z0-9]'), '-');
    }
  }

  bool _isValidColor(String color) {
    if (color.isEmpty) return false;
    final hexColor = color.startsWith('#') ? color : '#$color';
    return RegExp(r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$').hasMatch(hexColor);
  }

  void _saveFramework() {
    if (_formKey.currentState!.validate()) {
      // TODO: Implement save functionality with BLoC
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditing ? 'Framework updated successfully!' : 'Framework created successfully!'),
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
        title: Text(_isEditing ? 'Edit Framework' : 'Create Framework'),
        actions: [
          TextButton(
            onPressed: _saveFramework,
            child: const Text('Save'),
          ),
        ],
      ),
      body: Form(
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
                          hintText: 'e.g., Flutter, React, Python',
                        ),
                        onChanged: (value) {
                          if (!_isEditing) {
                            _generateSlug();
                          }
                        },
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a name';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Slug
                      TextFormField(
                        controller: _slugController,
                        decoration: const InputDecoration(
                          labelText: 'Slug *',
                          hintText: 'e.g., flutter, react, python',
                          helperText: 'URL-friendly identifier',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a slug';
                          }
                          if (!RegExp(r'^[a-z0-9-]+$').hasMatch(value)) {
                            return 'Slug can only contain lowercase letters, numbers, and hyphens';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Description
                      TextFormField(
                        controller: _descriptionController,
                        decoration: const InputDecoration(
                          labelText: 'Description',
                          hintText: 'Brief description of the framework or technology',
                        ),
                        maxLines: 3,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Visual Settings
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Visual Settings',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Icon
                      TextFormField(
                        controller: _iconController,
                        decoration: const InputDecoration(
                          labelText: 'Icon',
                          hintText: 'Icon name or identifier',
                          helperText: 'Optional: Icon identifier for the framework',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Color
                      TextFormField(
                        controller: _colorController,
                        decoration: const InputDecoration(
                          labelText: 'Color',
                          hintText: '#02569B',
                          helperText: 'Hex color code (e.g., #02569B)',
                          prefixText: '#',
                        ),
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(RegExp(r'[A-Fa-f0-9]')),
                          LengthLimitingTextInputFormatter(6),
                        ],
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            if (!_isValidColor(value)) {
                              return 'Please enter a valid hex color';
                            }
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Color Preview
                      if (_colorController.text.isNotEmpty && _isValidColor(_colorController.text))
                        Container(
                          width: double.infinity,
                          height: 60,
                          decoration: BoxDecoration(
                            color: Color(int.parse(_colorController.text.replaceFirst('#', '0xFF'))),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: Center(
                            child: Text(
                              _colorController.text,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Classification
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Classification',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Type
                      DropdownButtonFormField<FrameworkType>(
                        value: _selectedType,
                        decoration: const InputDecoration(
                          labelText: 'Type *',
                        ),
                        items: FrameworkType.values.map((type) {
                          return DropdownMenuItem(
                            value: type,
                            child: Text(type.name.toUpperCase()),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedType = value!;
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Proficiency Level
                      DropdownButtonFormField<ProficiencyLevel?>(
                        value: _selectedProficiency,
                        decoration: const InputDecoration(
                          labelText: 'Proficiency Level',
                          helperText: 'Optional: Your skill level with this technology',
                        ),
                        items: [
                          const DropdownMenuItem(
                            value: null,
                            child: Text('Not specified'),
                          ),
                          ...ProficiencyLevel.values.map((level) {
                            return DropdownMenuItem(
                              value: level,
                              child: Text(level.name.toUpperCase()),
                            );
                          }),
                        ],
                        onChanged: (value) {
                          setState(() {
                            _selectedProficiency = value;
                          });
                        },
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

                      // Order
                      TextFormField(
                        initialValue: _order.toString(),
                        decoration: const InputDecoration(
                          labelText: 'Order',
                          helperText: 'Display order (lower numbers appear first)',
                        ),
                        keyboardType: TextInputType.number,
                        onChanged: (value) {
                          _order = int.tryParse(value) ?? 0;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Visibility
                      SwitchListTile(
                        title: const Text('Visible'),
                        subtitle: const Text('Show this framework in your portfolio'),
                        value: _isVisible,
                        onChanged: (value) {
                          setState(() {
                            _isVisible = value;
                          });
                        },
                      ),

                      // Public
                      SwitchListTile(
                        title: const Text('Public'),
                        subtitle: const Text('Make this framework visible to others'),
                        value: _isPublic,
                        onChanged: (value) {
                          setState(() {
                            _isPublic = value;
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
                  onPressed: _saveFramework,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text(
                    _isEditing ? 'Update Framework' : 'Create Framework',
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
