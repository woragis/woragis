import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;

  const Failure(this.message);

  @override
  List<Object> get props => [message];
}

// General failures
class ServerFailure extends Failure {
  const ServerFailure(super.message);
}

class NetworkFailure extends Failure {
  const NetworkFailure(super.message);
}

class CacheFailure extends Failure {
  const CacheFailure(super.message);
}

class ValidationFailure extends Failure {
  const ValidationFailure(super.message);
}

class AuthenticationFailure extends Failure {
  const AuthenticationFailure(super.message);
}

class AuthorizationFailure extends Failure {
  const AuthorizationFailure(super.message);
}

class UnexpectedFailure extends Failure {
  const UnexpectedFailure(super.message);
}

// Specific domain failures
class UserNotFoundFailure extends Failure {
  const UserNotFoundFailure(super.message);
}

class InvalidCredentialsFailure extends Failure {
  const InvalidCredentialsFailure(super.message);
}

class TokenExpiredFailure extends Failure {
  const TokenExpiredFailure(super.message);
}

class EmailAlreadyExistsFailure extends Failure {
  const EmailAlreadyExistsFailure(super.message);
}

class UsernameAlreadyExistsFailure extends Failure {
  const UsernameAlreadyExistsFailure(super.message);
}

class ResourceNotFoundFailure extends Failure {
  const ResourceNotFoundFailure(super.message);
}

class DuplicateResourceFailure extends Failure {
  const DuplicateResourceFailure(super.message);
}

class PermissionDeniedFailure extends Failure {
  const PermissionDeniedFailure(super.message);
}

class RateLimitExceededFailure extends Failure {
  const RateLimitExceededFailure(super.message);
}

class OfflineFailure extends Failure {
  const OfflineFailure(super.message);
}
