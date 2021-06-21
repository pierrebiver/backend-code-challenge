export function verifyAuthorization(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.sendStatus(401);
    }
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if(bearerToken !== 'dGhlc2VjcmV0dG9rZW4=') {
        return res.sendStatus(401)
    }

    next();
}