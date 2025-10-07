import 'package:equatable/equatable.dart';

enum AiAgent { 
  gpt4('gpt-4'), 
  gpt4Turbo('gpt-4-turbo'), 
  gpt35Turbo('gpt-3.5-turbo'), 
  claude3Opus('claude-3-opus'), 
  claude3Sonnet('claude-3-sonnet'), 
  claude3Haiku('claude-3-haiku'), 
  geminiPro('gemini-pro'), 
  custom('custom');

  const AiAgent(this.value);
  final String value;

  static AiAgent fromString(String value) {
    return AiAgent.values.firstWhere(
      (agent) => agent.value == value,
      orElse: () => AiAgent.custom,
    );
  }
}

class ChatMessageEntity extends Equatable {
  final String id;
  final String role;
  final String content;
  final DateTime timestamp;
  final Map<String, dynamic>? metadata;

  const ChatMessageEntity({
    required this.id,
    required this.role,
    required this.content,
    required this.timestamp,
    this.metadata,
  });

  @override
  List<Object?> get props => [id, role, content, timestamp, metadata];

  ChatMessageEntity copyWith({
    String? id,
    String? role,
    String? content,
    DateTime? timestamp,
    Map<String, dynamic>? metadata,
  }) {
    return ChatMessageEntity(
      id: id ?? this.id,
      role: role ?? this.role,
      content: content ?? this.content,
      timestamp: timestamp ?? this.timestamp,
      metadata: metadata ?? this.metadata,
    );
  }
}

class AiChatEntity extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String? ideaNodeId;
  final AiAgent agent;
  final String? model;
  final String? systemPrompt;
  final double temperature;
  final int? maxTokens;
  final List<ChatMessageEntity> messages;
  final bool visible;
  final bool archived;
  final DateTime createdAt;
  final DateTime updatedAt;

  const AiChatEntity({
    required this.id,
    required this.userId,
    required this.title,
    this.ideaNodeId,
    required this.agent,
    this.model,
    this.systemPrompt,
    required this.temperature,
    this.maxTokens,
    required this.messages,
    required this.visible,
    required this.archived,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [
        id,
        userId,
        title,
        ideaNodeId,
        agent,
        model,
        systemPrompt,
        temperature,
        maxTokens,
        messages,
        visible,
        archived,
        createdAt,
        updatedAt,
      ];

  AiChatEntity copyWith({
    String? id,
    String? userId,
    String? title,
    String? ideaNodeId,
    AiAgent? agent,
    String? model,
    String? systemPrompt,
    double? temperature,
    int? maxTokens,
    List<ChatMessageEntity>? messages,
    bool? visible,
    bool? archived,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AiChatEntity(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      ideaNodeId: ideaNodeId ?? this.ideaNodeId,
      agent: agent ?? this.agent,
      model: model ?? this.model,
      systemPrompt: systemPrompt ?? this.systemPrompt,
      temperature: temperature ?? this.temperature,
      maxTokens: maxTokens ?? this.maxTokens,
      messages: messages ?? this.messages,
      visible: visible ?? this.visible,
      archived: archived ?? this.archived,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
