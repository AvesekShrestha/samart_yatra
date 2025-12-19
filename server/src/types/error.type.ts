interface IAurgmentException {
    fileld: string
    message: string
}

export class CustomError extends Error {
    status: number;
    details?: IAurgmentException[]

    constructor(message: string, status: number, details?: IAurgmentException[]) {
        super(message)
        this.status = status
        this.details = details

        Object.setPrototypeOf(this, CustomError.prototype)
    }
}

export class NotfoundError extends CustomError {

    constructor(message: string = "Resource not found", details?: IAurgmentException[]) {
        super(message, 404, details)

        Object.setPrototypeOf(this, NotfoundError.prototype)
    }
}

export class AlreadyExistsError extends CustomError {

    constructor(message: string = "Resource already exists", details?: IAurgmentException[]) {
        super(message, 400, details)
        Object.setPrototypeOf(this, AlreadyExistsError.prototype)
    }
}

export class InvalidPayloadError extends CustomError {

    constructor(message: string = "Invalid payload", details?: IAurgmentException[]) {
        super(message, 400, details)
        Object.setPrototypeOf(this, InvalidPayloadError.prototype)
    }
}

export class UnauthorizedError extends CustomError {

    constructor(message: string = "Unauthorized access", details?: IAurgmentException[]) {
        super(message, 401, details)
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
}
