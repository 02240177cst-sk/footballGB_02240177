const errorHandler = (err, req, res, next) => {
    console.error('System Exception Trapped:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Fatal internal processing breakdown occurred.'
    });
};
module.exports = errorHandler;