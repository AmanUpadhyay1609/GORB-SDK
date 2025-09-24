"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningError = exports.TransactionError = exports.SDKError = void 0;
// Error types
class SDKError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "SDKError";
    }
}
exports.SDKError = SDKError;
class TransactionError extends SDKError {
    constructor(message, signature) {
        super(message, "TRANSACTION_ERROR");
        this.signature = signature;
        this.name = "TransactionError";
    }
}
exports.TransactionError = TransactionError;
class SigningError extends SDKError {
    constructor(message) {
        super(message, "SIGNING_ERROR");
        this.name = "SigningError";
    }
}
exports.SigningError = SigningError;
//# sourceMappingURL=index.js.map