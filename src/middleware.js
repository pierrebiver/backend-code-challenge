import {AuthenticationError} from "apollo-server";

export function verifyAuthorization({req}) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        throw new AuthenticationError('you must be logged in');
    }
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    if(bearerToken !== 'dGhlc2VjcmV0dG9rZW4=') {
        throw new AuthenticationError('Wrong token');
    }
}