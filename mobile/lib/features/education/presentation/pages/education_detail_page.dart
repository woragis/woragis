import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../domain/entities/education_entity.dart';

class EducationDetailPage extends StatelessWidget {
  final String educationId;

  const EducationDetailPage({
    super.key,
    required this.educationId,
  });

  @override
  Widget build(BuildContext context) {
    // TODO: Replace with actual education data from BLoC or API
    // For now, using placeholder data
    final education = EducationEntity(
      id: educationId,
      userId: 'user123',
      title: 'Bachelor of Computer Science',
      institution: 'University of Technology',
      description: 'Comprehensive program covering software engineering, algorithms, data structures, and computer systems.',
      type: EducationType.degree,
      degreeLevel: DegreeLevel.bachelor,
      fieldOfStudy: 'Computer Science',
      startDate: DateTime(2020, 9),
      endDate: DateTime(2024, 6),
      completionDate: DateTime(2024, 6),
      grade: '3.8/4.0',
      credits: 120,
      certificateId: 'CS-BS-2024-001',
      issuer: 'University of Technology',
      validityPeriod: 'Lifetime',
      pdfDocument: '/documents/degree.pdf',
      verificationUrl: 'https://verify.university.edu/CS-BS-2024-001',
      skills: ['Programming', 'Algorithms', 'Data Structures', 'Software Engineering'],
      order: 1,
      visible: true,
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
      updatedAt: DateTime.now(),
    );

    return Scaffold(
      appBar: AppBar(
        title: Text(education.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              context.go('/education/${education.id}/edit');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Icon and Title
                    Row(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: _getTypeColor(education.type).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Icon(
                            _getTypeIcon(education.type),
                            color: _getTypeColor(education.type),
                            size: 40,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                education.title,
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                education.institution,
                                style: const TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: _getTypeColor(education.type).withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Text(
                                      education.type.name.toUpperCase(),
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: _getTypeColor(education.type),
                                      ),
                                    ),
                                  ),
                                  if (education.degreeLevel != null) ...[
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      decoration: BoxDecoration(
                                        color: Colors.blue.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: Text(
                                        education.degreeLevel!.name.toUpperCase(),
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.blue,
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Description
                    if (education.description != null)
                      Text(
                        education.description!,
                        style: const TextStyle(
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Education Details
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Education Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    if (education.fieldOfStudy != null)
                      _buildDetailRow('Field of Study', education.fieldOfStudy!),
                    if (education.startDate != null)
                      _buildDetailRow('Start Date', _formatDate(education.startDate!)),
                    if (education.endDate != null)
                      _buildDetailRow('End Date', _formatDate(education.endDate!)),
                    if (education.completionDate != null)
                      _buildDetailRow('Completion Date', _formatDate(education.completionDate!)),
                    if (education.grade != null)
                      _buildDetailRow('Grade', education.grade!),
                    if (education.credits != null)
                      _buildDetailRow('Credits', education.credits.toString()),
                    _buildDetailRow('Order', education.order.toString()),
                    _buildDetailRow('Created', _formatDate(education.createdAt)),
                    _buildDetailRow('Updated', _formatDate(education.updatedAt)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Certificate Details
            if (education.certificateId != null || education.issuer != null || education.validityPeriod != null)
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
                      if (education.certificateId != null)
                        _buildDetailRow('Certificate ID', education.certificateId!),
                      if (education.issuer != null)
                        _buildDetailRow('Issuer', education.issuer!),
                      if (education.validityPeriod != null)
                        _buildDetailRow('Validity Period', education.validityPeriod!),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 16),

            // Skills
            if (education.skills != null && education.skills!.isNotEmpty)
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
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: education.skills!.map((skill) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.blue.withOpacity(0.1),
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
                    if (education.pdfDocument != null)
                      ListTile(
                        leading: const Icon(Icons.picture_as_pdf, color: Colors.red),
                        title: const Text('Certificate PDF'),
                        subtitle: const Text('Download certificate'),
                        trailing: const Icon(Icons.download),
                        onTap: () {
                          // TODO: Implement PDF download
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('PDF download coming soon!')),
                          );
                        },
                      ),
                    if (education.verificationUrl != null)
                      ListTile(
                        leading: const Icon(Icons.link, color: Colors.blue),
                        title: const Text('Verification Link'),
                        subtitle: const Text('Verify certificate online'),
                        trailing: const Icon(Icons.open_in_new),
                        onTap: () {
                          // TODO: Implement URL opening
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('URL opening coming soon!')),
                          );
                        },
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Visibility Status
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Visibility',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Icon(
                          education.visible ? Icons.visibility : Icons.visibility_off,
                          color: education.visible ? Colors.green : Colors.grey,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          education.visible ? 'Visible' : 'Hidden',
                          style: TextStyle(
                            color: education.visible ? Colors.green : Colors.grey,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Actions
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Actions',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              context.go('/education/${education.id}/edit');
                            },
                            icon: const Icon(Icons.edit),
                            label: const Text('Edit'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () {
                              // TODO: Implement delete functionality
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Delete functionality coming soon!')),
                              );
                            },
                            icon: const Icon(Icons.delete),
                            label: const Text('Delete'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  Color _getTypeColor(EducationType type) {
    switch (type) {
      case EducationType.degree:
        return Colors.blue;
      case EducationType.certificate:
        return Colors.green;
      case EducationType.course:
        return Colors.orange;
      case EducationType.workshop:
        return Colors.purple;
      case EducationType.bootcamp:
        return Colors.red;
      case EducationType.other:
        return Colors.grey;
    }
  }

  IconData _getTypeIcon(EducationType type) {
    switch (type) {
      case EducationType.degree:
        return Icons.school;
      case EducationType.certificate:
        return Icons.verified;
      case EducationType.course:
        return Icons.menu_book;
      case EducationType.workshop:
        return Icons.work;
      case EducationType.bootcamp:
        return Icons.computer;
      case EducationType.other:
        return Icons.article;
    }
  }
}
