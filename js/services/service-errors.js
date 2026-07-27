(function serviceErrors(global){
  class ServiceError extends Error{constructor(code,message,details=null){super(message);this.name='ServiceError';this.code=code;this.details=details}}
  class NotImplementedError extends ServiceError{constructor(method){super('NOT_IMPLEMENTED',`${method} is not implemented by this provider.`);this.name='NotImplementedError'}}
  global.LEFUSIL_SERVICE_ERRORS={ServiceError,NotImplementedError};
})(window);
