export class BaseException extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
    this.message = message;
  }

  toString() {
    return `Status: ${this.status}, code: ${this.code}, message: ${this.message}`;
  }
}

export class AuthException extends BaseException {
  constructor(code, message) {
    super(401, code, message);
  }
}

export class ConflictException extends BaseException {
  constructor(code, message) {
    super(409, code, message);
  }
}

export class NotFoundException extends BaseException {
  constructor(code, message) {
    super(404, code, message);
  }
}
