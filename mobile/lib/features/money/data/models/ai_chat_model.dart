import 'dart:convert';
import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/ai_chat_entity.dart';

part 'ai_chat_model.g.dart';

// Helper extension for null-safe operations
extension NullableExtension<T> on T? {
  R? let<R>(R Function(T) transform) {
    if (this != null) {
      return transform(this as T);
    }
    return null;
  }
}

enum AiAgentModel {
  @JsonValue('gpt-4')
  gpt4,
  @JsonValue('gpt-4-turbo')
  gpt4Turbo,
  @JsonValue('gpt-3.5-turbo')
  gpt35Turbo,
  @JsonValue('claude-3-opus')
  claude3Opus,
  @JsonValue('claude-3-sonnet')
  claude3Sonnet,
  @JsonValue('claude-3-haiku')
  claude3Haiku,
  @JsonValue('gemini-pro')
  geminiPro,
  @JsonValue('custom')
  custom,
}

@JsonSerializable()
class ChatMessageModel extends ChatMessageEntity {
  const ChatMessageModel({
    required super.id,
    required super.role,
    required super.content,
    required super.timestamp,
    super.metadata,
  });

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageModelFromJson(json);

  Map<String, dynamic> toJson() => _$ChatMessageModelToJson(this);

  // Custom methods for API (camelCase) and Local Storage (snake_case) conversion
  factory ChatMessageModel.fromApiJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id'] as String,
      role: json['role'] as String,
      content: json['content'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  Map<String, dynamic> toApiJson() {
    return {
      'id': id,
      'role': role,
      'content': content,
      'timestamp': timestamp.toIso8601String(),
      'metadata': metadata,
    };
  }

  factory ChatMessageModel.fromLocalJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      id: json['id'] as String,
      role: json['role'] as String,
      content: json['content'] as String,
      timestamp: DateTime.fromMillisecondsSinceEpoch(json['timestamp'] as int),
      metadata: json['metadata'] != null 
          ? jsonDecode(json['metadata'] as String) as Map<String, dynamic>
          : null,
    );
  }

  Map<String, dynamic> toLocalJson() {
    return {
      'id': id,
      'role': role,
      'content': content,
      'timestamp': timestamp.millisecondsSinceEpoch,
      'metadata': metadata != null ? jsonEncode(metadata) : null,
    };
  }

  factory ChatMessageModel.fromEntity(ChatMessageEntity entity) {
    return ChatMessageModel(
      id: entity.id,
      role: entity.role,
      content: entity.content,
      timestamp: entity.timestamp,
      metadata: entity.metadata,
    );
  }

  ChatMessageEntity toEntity() {
    return ChatMessageEntity(
      id: id,
      role: role,
      content: content,
      timestamp: timestamp,
      metadata: metadata,
    );
  }

  @override
  ChatMessageModel copyWith({
    String? id,
    String? role,
    String? content,
    DateTime? timestamp,
    Map<String, dynamic>? metadata,
  }) {
    return ChatMessageModel(
      id: id ?? this.id,
      role: role ?? this.role,
      content: content ?? this.content,
      timestamp: timestamp ?? this.timestamp,
      metadata: metadata ?? this.metadata,
    );
  }
}

@JsonSerializable(explicitToJson: true)
class AiChatModel extends AiChatEntity {
  @override
  final List<ChatMessageModel> messages;

  const AiChatModel({
    required super.id,
    required super.userId,
    required super.title,
    super.ideaNodeId,
    required super.agent,
    super.model,
    super.systemPrompt,
    required super.temperature,
    super.maxTokens,
    required this.messages,
    required super.visible,
    required super.archived,
    required super.createdAt,
    required super.updatedAt,
  }) : super(messages: messages);

  factory AiChatModel.fromJson(Map<String, dynamic> json) =>
      _$AiChatModelFromJson(json);

  Map<String, dynamic> toJson() => _$AiChatModelToJson(this);

  // Custom methods for API (camelCase) and Local Storage (snake_case) conversion
  factory AiChatModel.fromApiJson(Map<String, dynamic> json) {
    return AiChatModel(
      id: json['id'] as String,
      userId: json['userId'] as String,
      title: json['title'] as String,
      ideaNodeId: json['ideaNodeId'] as String?,
      agent: AiAgent.values.firstWhere(
        (e) => e.name == json['agent'] as String,
        orElse: () => AiAgent.custom,
      ),
      model: json['model'] as String?,
      systemPrompt: json['systemPrompt'] as String?,
      temperature: (json['temperature'] as num).toDouble(),
      maxTokens: json['maxTokens'] as int?,
      messages: (json['messages'] as List<dynamic>?)
          ?.map((msg) => ChatMessageModel.fromApiJson(msg as Map<String, dynamic>))
          .toList() ?? [],
      visible: json['visible'] as bool,
      archived: json['archived'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toApiJson() {
    return {
      'id': id,
      'userId': userId,
      'title': title,
      'ideaNodeId': ideaNodeId,
      'agent': agent,
      'model': model,
      'systemPrompt': systemPrompt,
      'temperature': temperature,
      'maxTokens': maxTokens,
      'messages': messages.map((msg) => msg.toApiJson()).toList(),
      'visible': visible,
      'archived': archived,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory AiChatModel.fromLocalJson(Map<String, dynamic> json) {
    return AiChatModel(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      title: json['title'] as String,
      ideaNodeId: json['idea_node_id'] as String?,
      agent: AiAgent.values.firstWhere(
        (e) => e.name == json['agent'] as String,
        orElse: () => AiAgent.custom,
      ),
      model: json['model'] as String?,
      systemPrompt: json['system_prompt'] as String?,
      temperature: (json['temperature'] as num).toDouble(),
      maxTokens: json['max_tokens'] as int?,
      messages: (json['messages'] as String?)
          ?.let((messagesJson) => (jsonDecode(messagesJson) as List<dynamic>)
              .map((msg) => ChatMessageModel.fromLocalJson(msg as Map<String, dynamic>))
              .toList()) ?? [],
      visible: (json['visible'] as int) == 1,
      archived: (json['archived'] as int) == 1,
      createdAt: DateTime.fromMillisecondsSinceEpoch(json['created_at'] as int),
      updatedAt: DateTime.fromMillisecondsSinceEpoch(json['updated_at'] as int),
    );
  }

  Map<String, dynamic> toLocalJson() {
    return {
      'id': id,
      'user_id': userId,
      'title': title,
      'idea_node_id': ideaNodeId,
      'agent': agent,
      'model': model,
      'system_prompt': systemPrompt,
      'temperature': temperature,
      'max_tokens': maxTokens,
      'messages': jsonEncode(messages.map((msg) => msg.toLocalJson()).toList()),
      'visible': visible ? 1 : 0,
      'archived': archived ? 1 : 0,
      'created_at': createdAt.millisecondsSinceEpoch,
      'updated_at': updatedAt.millisecondsSinceEpoch,
    };
  }

  factory AiChatModel.fromEntity(AiChatEntity entity) {
    return AiChatModel(
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      ideaNodeId: entity.ideaNodeId,
      agent: entity.agent,
      model: entity.model,
      systemPrompt: entity.systemPrompt,
      temperature: entity.temperature,
      maxTokens: entity.maxTokens,
      messages: entity.messages.map((msg) => ChatMessageModel.fromEntity(msg)).toList(),
      visible: entity.visible,
      archived: entity.archived,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    );
  }

  AiChatEntity toEntity() {
    return AiChatEntity(
      id: id,
      userId: userId,
      title: title,
      ideaNodeId: ideaNodeId,
      agent: agent,
      model: model,
      systemPrompt: systemPrompt,
      temperature: temperature,
      maxTokens: maxTokens,
      messages: messages.map((msg) => msg.toEntity()).toList(),
      visible: visible,
      archived: archived,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }

  @override
  AiChatModel copyWith({
    String? id,
    String? userId,
    String? title,
    String? ideaNodeId,
    AiAgent? agent,
    String? model,
    String? systemPrompt,
    double? temperature,
    int? maxTokens,
    covariant List<ChatMessageModel>? messages,
    bool? visible,
    bool? archived,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return AiChatModel(
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
