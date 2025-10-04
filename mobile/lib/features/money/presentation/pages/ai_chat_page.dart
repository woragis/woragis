import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/ai_chat_entity.dart';
import '../bloc/money_bloc.dart';

class AiChatPage extends StatefulWidget {
  final String chatId;

  const AiChatPage({
    super.key,
    required this.chatId,
  });

  @override
  State<AiChatPage> createState() => _AiChatPageState();
}

class _AiChatPageState extends State<AiChatPage> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  bool _isTyping = false;

  @override
  void initState() {
    super.initState();
    // Load the specific AI chat
    context.read<MoneyBloc>().add(GetAiChatByIdRequested(widget.chatId));
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Chat'),
        backgroundColor: Colors.purple.shade600,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () => _showChatSettings(context),
            icon: const Icon(Icons.settings),
          ),
        ],
      ),
      body: BlocConsumer<MoneyBloc, MoneyState>(
        listener: (context, state) {
          if (state is MoneyError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is MessageSent) {
            _messageController.clear();
            _scrollToBottom();
          }
        },
        builder: (context, state) {
          if (state is MoneyLoading) {
            return const Center(child: CircularProgressIndicator());
          } else if (state is MoneyError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: Colors.red.shade300,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading chat',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.red.shade700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    state.message,
                    style: TextStyle(color: Colors.red.shade600),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      context.read<MoneyBloc>().add(GetAiChatByIdRequested(widget.chatId));
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (state is AiChatLoaded) {
            final chat = state.aiChat;
            
            return Column(
              children: [
                // Chat header
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    border: Border(
                      bottom: BorderSide(color: Colors.grey.shade300),
                    ),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 20,
                        backgroundColor: _getAgentColor(chat.agent),
                        child: Icon(
                          _getAgentIcon(chat.agent),
                          color: Colors.white,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              chat.title,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              _getAgentDisplayName(chat.agent),
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (chat.archived)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'Archived',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),

                // Messages list
                Expanded(
                  child: chat.messages.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.chat_bubble_outline,
                                size: 64,
                                color: Colors.grey.shade400,
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'No messages yet',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Start a conversation with ${_getAgentDisplayName(chat.agent)}!',
                                style: TextStyle(
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.all(16),
                          itemCount: chat.messages.length + (_isTyping ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == chat.messages.length && _isTyping) {
                              return _buildTypingIndicator();
                            }
                            final message = chat.messages[index];
                            return _buildMessageBubble(message);
                          },
                        ),
                ),

                // Message input
                if (!chat.archived)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border(
                        top: BorderSide(color: Colors.grey.shade300),
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _messageController,
                            decoration: InputDecoration(
                              hintText: 'Type your message...',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(24),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                            ),
                            maxLines: null,
                            onSubmitted: (value) => _sendMessage(),
                          ),
                        ),
                        const SizedBox(width: 8),
                        FloatingActionButton.small(
                          onPressed: _isTyping ? null : _sendMessage,
                          backgroundColor: Colors.purple.shade600,
                          child: _isTyping
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white,
                                    ),
                                  ),
                                )
                              : const Icon(Icons.send, color: Colors.white),
                        ),
                      ],
                    ),
                  ),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessageEntity message) {
    final isUser = message.role == 'user';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.grey.shade300,
              child: const Icon(
                Icons.smart_toy,
                size: 16,
                color: Colors.grey,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isUser ? Colors.purple.shade600 : Colors.grey.shade100,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    message.content,
                    style: TextStyle(
                      color: isUser ? Colors.white : Colors.black87,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatTime(message.timestamp),
                    style: TextStyle(
                      color: isUser ? Colors.white70 : Colors.grey.shade600,
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: Colors.blue.shade600,
              child: const Icon(
                Icons.person,
                size: 16,
                color: Colors.white,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          CircleAvatar(
            radius: 16,
            backgroundColor: Colors.grey.shade300,
            child: const Icon(
              Icons.smart_toy,
              size: 16,
              color: Colors.grey,
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildTypingDot(0),
                const SizedBox(width: 4),
                _buildTypingDot(1),
                const SizedBox(width: 4),
                _buildTypingDot(2),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypingDot(int index) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 600),
      width: 8,
      height: 8,
      decoration: BoxDecoration(
        color: Colors.grey.shade400,
        shape: BoxShape.circle,
      ),
    );
  }

  void _sendMessage() {
    final message = _messageController.text.trim();
    if (message.isNotEmpty) {
      setState(() {
        _isTyping = true;
      });
      
      context.read<MoneyBloc>().add(SendMessageRequested(
        chatId: widget.chatId,
        message: message,
      ));

      // Simulate typing delay
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _isTyping = false;
          });
        }
      });
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _showChatSettings(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Chat Settings'),
        content: const Text('Chat settings will be implemented in a future update.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
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
        return 'GPT-4';
      case AiAgent.gpt4Turbo:
        return 'GPT-4 Turbo';
      case AiAgent.gpt35Turbo:
        return 'GPT-3.5 Turbo';
      case AiAgent.claude3Opus:
        return 'Claude 3 Opus';
      case AiAgent.claude3Sonnet:
        return 'Claude 3 Sonnet';
      case AiAgent.claude3Haiku:
        return 'Claude 3 Haiku';
      case AiAgent.geminiPro:
        return 'Gemini Pro';
      case AiAgent.custom:
        return 'Custom Model';
    }
  }

  String _formatTime(DateTime timestamp) {
    return '${timestamp.hour.toString().padLeft(2, '0')}:${timestamp.minute.toString().padLeft(2, '0')}';
  }
}
