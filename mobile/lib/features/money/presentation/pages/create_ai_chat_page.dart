import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../bloc/money_bloc.dart';

class CreateAiChatPage extends StatefulWidget {
  final String? ideaId; // Optional: link to an idea

  const CreateAiChatPage({
    super.key,
    this.ideaId,
  });

  @override
  State<CreateAiChatPage> createState() => _CreateAiChatPageState();
}

class _CreateAiChatPageState extends State<CreateAiChatPage> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _systemPromptController = TextEditingController();
  
  AiAgent _selectedAgent = AiAgent.gpt4;
  double _temperature = 0.7;
  int? _maxTokens;
  bool _visible = true;
  bool _archived = false;

  @override
  void initState() {
    super.initState();
    
    // Set default title based on agent
    _titleController.text = _getAgentDisplayName(_selectedAgent);
    
    // Set default system prompt
    _systemPromptController.text = 'You are a helpful AI assistant specialized in helping with business ideas and entrepreneurship. Provide thoughtful, practical advice.';
  }

  @override
  void dispose() {
    _titleController.dispose();
    _systemPromptController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create AI Chat'),
        backgroundColor: Colors.purple.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => context.pop(),
            icon: const Icon(Icons.close),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
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
                      TextFormField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          labelText: 'Chat Title *',
                          hintText: 'Enter a title for your chat',
                          border: OutlineInputBorder(),
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Title is required';
                          }
                          if (value.trim().length < 3) {
                            return 'Title must be at least 3 characters';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<AiAgent>(
                        value: _selectedAgent,
                        decoration: const InputDecoration(
                          labelText: 'AI Agent *',
                          border: OutlineInputBorder(),
                        ),
                        items: AiAgent.values.map((agent) {
                          return DropdownMenuItem(
                            value: agent,
                            child: Row(
                              children: [
                                Icon(
                                  _getAgentIcon(agent),
                                  color: _getAgentColor(agent),
                                  size: 20,
                                ),
                                const SizedBox(width: 8),
                                Text(_getAgentDisplayName(agent)),
                              ],
                            ),
                          );
                        }).toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setState(() {
                              _selectedAgent = value;
                              _titleController.text = _getAgentDisplayName(value);
                            });
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // System Prompt
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'System Prompt',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Define how the AI should behave in this conversation.',
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _systemPromptController,
                        decoration: const InputDecoration(
                          labelText: 'System Prompt',
                          hintText: 'You are a helpful AI assistant...',
                          border: OutlineInputBorder(),
                          alignLabelWithHint: true,
                        ),
                        maxLines: 4,
                      ),
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
                      const Text(
                        'Advanced Settings',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Temperature
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              'Temperature: ${_temperature.toStringAsFixed(1)}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          Text(
                            _getTemperatureDescription(_temperature),
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                      Slider(
                        value: _temperature,
                        min: 0.0,
                        max: 2.0,
                        divisions: 20,
                        onChanged: (value) {
                          setState(() {
                            _temperature = value;
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Max Tokens
                      TextFormField(
                        initialValue: _maxTokens?.toString(),
                        decoration: const InputDecoration(
                          labelText: 'Max Tokens (Optional)',
                          hintText: 'Leave empty for default',
                          border: OutlineInputBorder(),
                        ),
                        keyboardType: TextInputType.number,
                        onChanged: (value) {
                          _maxTokens = int.tryParse(value);
                        },
                      ),
                      const SizedBox(height: 16),

                      // Visibility Settings
                      SwitchListTile(
                        title: const Text('Visible'),
                        subtitle: const Text('Make this chat visible in lists'),
                        value: _visible,
                        onChanged: (value) {
                          setState(() {
                            _visible = value;
                          });
                        },
                        activeColor: Colors.green,
                      ),
                      SwitchListTile(
                        title: const Text('Archived'),
                        subtitle: const Text('Mark this chat as archived'),
                        value: _archived,
                        onChanged: (value) {
                          setState(() {
                            _archived = value;
                          });
                        },
                        activeColor: Colors.orange,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Action Buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => context.pop(),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _createChat,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple.shade600,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: const Text('Create Chat'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _createChat() {
    if (_formKey.currentState!.validate()) {
      context.read<MoneyBloc>().add(CreateAiChatRequested(
        title: _titleController.text.trim(),
        ideaNodeId: widget.ideaId,
        agent: _selectedAgent.name,
        model: _getModelForAgent(_selectedAgent),
        systemPrompt: _systemPromptController.text.trim(),
        temperature: _temperature,
        maxTokens: _maxTokens,
        visible: _visible,
        archived: _archived,
      ));
    }
  }

  Color _getAgentColor(AiAgent agent) {
    switch (agent) {
      case AiAgent.gpt4:
      case AiAgent.gpt4Turbo:
        return Colors.green;
      case AiAgent.gpt35Turbo:
        return Colors.blue;
      case AiAgent.claude3Opus:
      case AiAgent.claude3Sonnet:
      case AiAgent.claude3Haiku:
        return Colors.orange;
      case AiAgent.geminiPro:
        return Colors.purple;
      case AiAgent.custom:
        return Colors.grey;
    }
  }

  IconData _getAgentIcon(AiAgent agent) {
    switch (agent) {
      case AiAgent.gpt4:
      case AiAgent.gpt4Turbo:
      case AiAgent.gpt35Turbo:
        return Icons.smart_toy;
      case AiAgent.claude3Opus:
      case AiAgent.claude3Sonnet:
      case AiAgent.claude3Haiku:
        return Icons.psychology;
      case AiAgent.geminiPro:
        return Icons.auto_awesome;
      case AiAgent.custom:
        return Icons.settings;
    }
  }

  String _getAgentDisplayName(AiAgent agent) {
    switch (agent) {
      case AiAgent.gpt4:
        return 'GPT-4 Chat';
      case AiAgent.gpt4Turbo:
        return 'GPT-4 Turbo Chat';
      case AiAgent.gpt35Turbo:
        return 'GPT-3.5 Turbo Chat';
      case AiAgent.claude3Opus:
        return 'Claude 3 Opus Chat';
      case AiAgent.claude3Sonnet:
        return 'Claude 3 Sonnet Chat';
      case AiAgent.claude3Haiku:
        return 'Claude 3 Haiku Chat';
      case AiAgent.geminiPro:
        return 'Gemini Pro Chat';
      case AiAgent.custom:
        return 'Custom Model Chat';
    }
  }

  String _getModelForAgent(AiAgent agent) {
    switch (agent) {
      case AiAgent.gpt4:
        return 'gpt-4';
      case AiAgent.gpt4Turbo:
        return 'gpt-4-turbo-preview';
      case AiAgent.gpt35Turbo:
        return 'gpt-3.5-turbo';
      case AiAgent.claude3Opus:
        return 'claude-3-opus-20240229';
      case AiAgent.claude3Sonnet:
        return 'claude-3-sonnet-20240229';
      case AiAgent.claude3Haiku:
        return 'claude-3-haiku-20240307';
      case AiAgent.geminiPro:
        return 'gemini-pro';
      case AiAgent.custom:
        return 'custom-model';
    }
  }

  String _getTemperatureDescription(double temperature) {
    if (temperature < 0.3) {
      return 'Focused';
    } else if (temperature < 0.7) {
      return 'Balanced';
    } else if (temperature < 1.2) {
      return 'Creative';
    } else {
      return 'Very Creative';
    }
  }
}
