import 'package:equatable/equatable.dart';

enum AiAgent { gpt4, gpt4Turbo, gpt35Turbo, claude3Opus, claude3Sonnet, claude3Haiku, geminiPro, custom }

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
