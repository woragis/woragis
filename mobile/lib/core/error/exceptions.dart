class ServerException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  const ServerException(this.message, {this.statusCode, this.data});

  @override
  String toString() => 'ServerException: $message';
}

class NetworkException implements Exception {
  final String message;
  final String? originalException;

  const NetworkException(this.message, {this.originalException});

  @override
  String toString() => 'NetworkException: $message';
}

class CacheException implements Exception {
  final String message;

  const CacheException(this.message);

  @override
  String toString() => 'CacheException: $message';
}

class ValidationException implements Exception {
  final String message;
  final Map<String, List<String>>? fieldErrors;

  const ValidationException(this.message, {this.fieldErrors});

  @override
  String toString() => 'ValidationException: $message';
}

class AuthenticationException implements Exception {
  final String message;

  const AuthenticationException(this.message);

  @override
  String toString() => 'AuthenticationException: $message';
}

class AuthorizationException implements Exception {
  final String message;

  const AuthorizationException(this.message);

  @override
  String toString() => 'AuthorizationException: $message';
}

class NotFoundException implements Exception {
  final String message;
  final String? resourceType;

  const NotFoundException(this.message, {this.resourceType});

  @override
  String toString() => 'NotFoundException: $message';
}

class ConflictException implements Exception {
  final String message;
  final String? conflictingResource;

  const ConflictException(this.message, {this.conflictingResource});

  @override
  String toString() => 'ConflictException: $message';
}

class RateLimitException implements Exception {
  final String message;
  final int? retryAfterSeconds;

  const RateLimitException(this.message, {this.retryAfterSeconds});

  @override
  String toString() => 'RateLimitException: $message';
}

class OfflineException implements Exception {
  final String message;

  const OfflineException(this.message);

  @override
  String toString() => 'OfflineException: $message';
}
