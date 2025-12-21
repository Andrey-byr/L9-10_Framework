class ErrorHandler {
    static handle404(req, res) {
        res.status(404).json({
            error: 'Route not found',
            path: req.url,
            method: req.method
        });
    }
    
    static handleError(error, req, res) {
        console.error('Unhandled error:', error);
        
        if (!res.headersSent) {
            const status = error.status || 500;
            const message = error.message || 'Internal Server Error';
            
            res.status(status).json({
                error: message,
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            });
        }
    }
    
    static asyncWrapper(fn) {
        return async (req, res, next) => {
            try {
                await fn(req, res, next);
            } catch (error) {
                next(error);
            }
        };
    }
}

module.exports = ErrorHandler;