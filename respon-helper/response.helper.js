class Response {
    constructor(res, status, data) {
        return res.status(status).json({
            status: true,
            data: data,
            error: {}
        })
    }
}

module.exports = Response