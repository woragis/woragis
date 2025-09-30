// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ai_chat_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ChatMessageModel _$ChatMessageModelFromJson(Map<String, dynamic> json) =>
    ChatMessageModel(
      id: json['id'] as String,
      role: json['role'] as String,
      content: json['content'] as String,
      timestamp: DateTime.parse(json['timestamp'] as String),
      metadata: json['metadata'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$ChatMessageModelToJson(ChatMessageModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'role': instance.role,
      'content': instance.content,
      'timestamp': instance.timestamp.toIso8601String(),
      'metadata': instance.metadata,
    };

AiChatModel _$AiChatModelFromJson(Map<String, dynamic> json) => AiChatModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  title: json['title'] as String,
  ideaNodeId: json['ideaNodeId'] as String?,
  agent: $enumDecode(_$AiAgentEnumMap, json['agent']),
  model: json['model'] as String?,
  systemPrompt: json['systemPrompt'] as String?,
  temperature: (json['temperature'] as num).toDouble(),
  maxTokens: (json['maxTokens'] as num?)?.toInt(),
  messages: (json['messages'] as List<dynamic>)
      .map((e) => ChatMessageModel.fromJson(e as Map<String, dynamic>))
      .toList(),
  visible: json['visible'] as bool,
  archived: json['archived'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$AiChatModelToJson(AiChatModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'title': instance.title,
      'ideaNodeId': instance.ideaNodeId,
      'agent': _$AiAgentEnumMap[instance.agent]!,
      'model': instance.model,
      'systemPrompt': instance.systemPrompt,
      'temperature': instance.temperature,
      'maxTokens': instance.maxTokens,
      'visible': instance.visible,
      'archived': instance.archived,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'messages': instance.messages.map((e) => e.toJson()).toList(),
    };

const _$AiAgentEnumMap = {
  AiAgent.gpt4: 'gpt4',
  AiAgent.gpt4Turbo: 'gpt4Turbo',
  AiAgent.gpt35Turbo: 'gpt35Turbo',
  AiAgent.claude3Opus: 'claude3Opus',
  AiAgent.claude3Sonnet: 'claude3Sonnet',
  AiAgent.claude3Haiku: 'claude3Haiku',
  AiAgent.geminiPro: 'geminiPro',
  AiAgent.custom: 'custom',
};
