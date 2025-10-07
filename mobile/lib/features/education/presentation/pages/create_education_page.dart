import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../../domain/entities/education_entity.dart';

class CreateEducationPage extends StatefulWidget {
  final String? educationId;

  const CreateEducationPage({
    super.key,
    this.educationId,
  });

  @override
  State<CreateEducationPage> createState() => _CreateEducationPageState();
}

class _CreateEducationPageState extends State<CreateEducationPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _institutionController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _fieldOfStudyController = TextEditingController();
  final _gradeController = TextEditingController();
  final _creditsController = TextEditingController();
  final _certificateIdController = TextEditingController();
  final _issuerController = TextEditingController();
  final _validityPeriodController = TextEditingController();
  final _pdfDocumentController = TextEditingController();
  final _verificationUrlController = TextEditingController();
  final _skillsController = TextEditingController();

  EducationType _selectedType = EducationType.degree;
  DegreeLevel? _selectedDegreeLevel;
  DateTime? _startDate;
  DateTime? _endDate;
  DateTime? _completionDate;
  bool _isVisible = true;
  int _order = 0;
  List<String> _skills = [];

  bool get _isEditing => widget.educationId != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      _loadEducationData();
    }
  }

  void _loadEducationData() {
    // TODO: Load actual education data from BLoC or API
    // For now, using placeholder data
    _titleController.text = 'Bachelor of Computer Science';
    _institutionController.text = 'University of Technology';
    _descriptionController.text = 'Comprehensive program covering software engineering, algorithms, data structures, and computer systems.';
    _fieldOfStudyController.text = 'Computer Science';
    _gradeController.text = '3.8/4.0';
    _creditsController.text = '120';
    _certificateIdController.text = 'CS-BS-2024-001';
    _issuerController.text = 'University of Technology';
    _validityPeriodController.text = 'Lifetime';
    _pdfDocumentController.text = '/documents/degree.pdf';
    _verificationUrlController.text = 'https://verify.university.edu/CS-BS-2024-001';
    _skillsController.text = 'Programming, Algorithms, Data Structures, Software Engineering';
    _selectedType = EducationType.degree;
    _selectedDegreeLevel = DegreeLevel.bachelor;
    _startDate = DateTime(2020, 9);
    _endDate = DateTime(2024, 6);
    _completionDate = DateTime(2024, 6);
    _isVisible = true;
    _order = 1;
    _skills = ['Programming', 'Algorithms', 'Data Structures', 'Software Engineering'];
  }

  @override
  void dispose() {
    _titleController.dispose();
    _institutionController.dispose();
    _descriptionController.dispose();
    _fieldOfStudyController.dispose();
    _gradeController.dispose();
    _creditsController.dispose();
    _certificateIdController.dispose();
    _issuerController.dispose();
    _validityPeriodController.dispose();
    _pdfDocumentController.dispose();
    _verificationUrlController.dispose();
    _skillsController.dispose();
    super.dispose();
  }

  void _parseSkills() {
    final skillsText = _skillsController.text.trim();
    if (skillsText.isNotEmpty) {
      _skills = skillsText.split(',').map((skill) => skill.trim()).where((skill) => skill.isNotEmpty).toList();
    } else {
      _skills = [];
    }
    setState(() {}); // Trigger rebuild to show parsed skills
  }

  void _saveEducation() {
    if (_formKey.currentState!.validate()) {
      _parseSkills();
      // TODO: Implement save functionality with BLoC
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_isEditing ? 'Education updated successfully!' : 'Education created successfully!'),
          backgroundColor: Colors.green,
        ),
      );
      context.pop();
    }
  }

  Future<void> _selectDate(BuildContext context, String field) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now().add(const Duration(days: 365 * 10)),
    );
    if (picked != null) {
      setState(() {
        switch (field) {
          case 'start':
            _startDate = picked;
            break;
          case 'end':
            _endDate = picked;
            break;
          case 'completion':
            _completionDate = picked;
            break;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit Education' : 'Add Education'),
        actions: [
          TextButton(
            onPressed: _saveEducation,
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

                      // Title
                      TextFormField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          labelText: 'Title *',
                          hintText: 'e.g., Bachelor of Computer Science',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a title';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Institution
                      TextFormField(
                        controller: _institutionController,
                        decoration: const InputDecoration(
                          labelText: 'Institution *',
                          hintText: 'e.g., University of Technology',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter an institution';
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
                          hintText: 'Brief description of the education program',
                        ),
                        maxLines: 3,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Education Type and Level
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Education Type',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Type
                      DropdownButtonFormField<EducationType>(
                        value: _selectedType,
                        decoration: const InputDecoration(
                          labelText: 'Type *',
                        ),
                        items: EducationType.values.map((type) {
                          return DropdownMenuItem(
                            value: type,
                            child: Text(type.name.toUpperCase()),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedType = value!;
                            if (value != EducationType.degree) {
                              _selectedDegreeLevel = null;
                            }
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Degree Level (only for degrees)
                      if (_selectedType == EducationType.degree)
                        DropdownButtonFormField<DegreeLevel?>(
                          value: _selectedDegreeLevel,
                          decoration: const InputDecoration(
                            labelText: 'Degree Level',
                            helperText: 'Required for degree type',
                          ),
                          items: [
                            const DropdownMenuItem(
                              value: null,
                              child: Text('Select degree level'),
                            ),
                            ...DegreeLevel.values.map((level) {
                              return DropdownMenuItem(
                                value: level,
                                child: Text(level.name.toUpperCase()),
                              );
                            }),
                          ],
                          onChanged: (value) {
                            setState(() {
                              _selectedDegreeLevel = value;
                            });
                          },
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Academic Details
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Academic Details',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Field of Study
                      TextFormField(
                        controller: _fieldOfStudyController,
                        decoration: const InputDecoration(
                          labelText: 'Field of Study',
                          hintText: 'e.g., Computer Science, Business Administration',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Grade
                      TextFormField(
                        controller: _gradeController,
                        decoration: const InputDecoration(
                          labelText: 'Grade/GPA',
                          hintText: 'e.g., 3.8/4.0, A+, 85%',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Credits
                      TextFormField(
                        controller: _creditsController,
                        decoration: const InputDecoration(
                          labelText: 'Credits',
                          hintText: 'e.g., 120',
                        ),
                        keyboardType: TextInputType.number,
                        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Dates
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Important Dates',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Start Date
                      ListTile(
                        title: const Text('Start Date'),
                        subtitle: Text(_startDate != null ? _formatDate(_startDate!) : 'Select start date'),
                        trailing: const Icon(Icons.calendar_today),
                        onTap: () => _selectDate(context, 'start'),
                      ),

                      // End Date
                      ListTile(
                        title: const Text('End Date'),
                        subtitle: Text(_endDate != null ? _formatDate(_endDate!) : 'Select end date'),
                        trailing: const Icon(Icons.calendar_today),
                        onTap: () => _selectDate(context, 'end'),
                      ),

                      // Completion Date
                      ListTile(
                        title: const Text('Completion Date'),
                        subtitle: Text(_completionDate != null ? _formatDate(_completionDate!) : 'Select completion date'),
                        trailing: const Icon(Icons.calendar_today),
                        onTap: () => _selectDate(context, 'completion'),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Certificate Details
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Certificate Details',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Certificate ID
                      TextFormField(
                        controller: _certificateIdController,
                        decoration: const InputDecoration(
                          labelText: 'Certificate ID',
                          hintText: 'e.g., CS-BS-2024-001',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Issuer
                      TextFormField(
                        controller: _issuerController,
                        decoration: const InputDecoration(
                          labelText: 'Issuer',
                          hintText: 'e.g., University of Technology',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Validity Period
                      TextFormField(
                        controller: _validityPeriodController,
                        decoration: const InputDecoration(
                          labelText: 'Validity Period',
                          hintText: 'e.g., Lifetime, 2 years',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Documents & Links
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Documents & Links',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      // PDF Document
                      TextFormField(
                        controller: _pdfDocumentController,
                        decoration: const InputDecoration(
                          labelText: 'PDF Document URL',
                          hintText: 'e.g., /documents/degree.pdf',
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Verification URL
                      TextFormField(
                        controller: _verificationUrlController,
                        decoration: const InputDecoration(
                          labelText: 'Verification URL',
                          hintText: 'e.g., https://verify.university.edu/certificate',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Skills
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Skills & Competencies',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),

                      TextFormField(
                        controller: _skillsController,
                        decoration: const InputDecoration(
                          labelText: 'Skills',
                          hintText: 'e.g., Programming, Algorithms, Data Structures',
                          helperText: 'Separate skills with commas',
                        ),
                        maxLines: 2,
                        onChanged: (value) => _parseSkills(),
                      ),
                      if (_skills.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _skills.map((skill) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.blue.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Text(
                                skill,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.blue,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
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
                        subtitle: const Text('Show this education in your portfolio'),
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
                  onPressed: _saveEducation,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text(
                    _isEditing ? 'Update Education' : 'Add Education',
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

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
