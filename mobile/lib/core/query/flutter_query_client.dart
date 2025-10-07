import 'package:dio/dio.dart';

class FlutterQueryClientManager {
  Dio? _dio;

  Dio get dio {
    if (_dio == null) {
      throw StateError('Dio has not been initialized. Call setDio() first.');
    }
    return _dio!;
  }

  FlutterQueryClientManager();

  void setDio(Dio dio) {
    if (_dio != null) {
      // Already initialized, don't set again
      return;
    }
    _dio = dio;
  }

  void dispose() {
    _dio?.close();
  }
}
