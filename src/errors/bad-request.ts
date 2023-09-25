import * as HttpStatus from 'http-status';

class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
  }

  get statusCode() {
    return HttpStatus.BAD_REQUEST;
  }
}

export { BadRequestError };
