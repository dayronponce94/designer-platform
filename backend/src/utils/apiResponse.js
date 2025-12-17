class ApiResponse {
    constructor(success, message, data = null, statusCode = 200) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
    }

    static success(message, data = null, statusCode = 200) {
        return new ApiResponse(true, message, data, statusCode);
    }

    static error(message, statusCode = 400, data = null) {
        return new ApiResponse(false, message, data, statusCode);
    }

    static unauthorized(message = 'No autorizado') {
        return new ApiResponse(false, message, null, 401);
    }

    static forbidden(message = 'Acceso prohibido') {
        return new ApiResponse(false, message, null, 403);
    }

    static notFound(message = 'Recurso no encontrado') {
        return new ApiResponse(false, message, null, 404);
    }

    toJSON() {
        return {
            success: this.success,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp
        };
    }
}

module.exports = ApiResponse;