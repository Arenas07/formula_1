class ResponseHandler {
    static success(res, data = null, message = 'Operación exitosa') {
        return res.status(200).json({
            success: true,
            message,
            data
        });
    }

    static created(res, data = null, message = 'Recurso creado exitosamente') {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    static notFound(res, message = 'Recurso no encontrado') {
        return res.status(404).json({
            success: false,
            message,
            error: {
                code: 'NOT_FOUND',
                details: message
            }
        });
    }

    static badRequest(res, message = 'Solicitud inválida', errors = []) {
        return res.status(400).json({
            success: false,
            message,
            error: {
                code: 'BAD_REQUEST',
                details: errors.length > 0 ? errors : message
            }
        });
    }

    static unauthorized(res, message = 'No autorizado') {
        return res.status(401).json({
            success: false,
            message,
            error: {
                code: 'UNAUTHORIZED',
                details: message
            }
        });
    }

    static forbidden(res, message = 'Acceso denegado') {
        return res.status(403).json({
            success: false,
            message,
            error: {
                code: 'FORBIDDEN',
                details: message
            }
        });
    }

    static serverError(res, message = 'Error interno del servidor', error = null) {
        return res.status(500).json({
            success: false,
            message,
            error: {
                code: 'SERVER_ERROR',
                details: error ? error.message : message
            }
        });
    }

    static validationError(res, errors) {
        return res.status(422).json({
            success: false,
            message: 'Error de validación',
            error: {
                code: 'VALIDATION_ERROR',
                details: errors.map(error => ({
                    campo: error.param,
                    mensaje: error.msg
                }))
            }
        });
    }

    static conflict(res, message = 'Conflicto con el estado actual del recurso') {
        return res.status(409).json({
            success: false,
            message,
            error: {
                code: 'CONFLICT',
                details: message
            }
        });
    }

    static tooManyRequests(res, message = 'Demasiadas solicitudes') {
        return res.status(429).json({
            success: false,
            message,
            error: {
                code: 'TOO_MANY_REQUESTS',
                details: message
            }
        });
    }
}

module.exports = ResponseHandler; 