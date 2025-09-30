import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/ai_chat_entity.dart';

part 'ai_chat_model.g.dart';

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
