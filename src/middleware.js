import {AuthenticationError} from "apollo-server";

export function verifyAuthorization({req}) {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        throw new AuthenticationError('you must be logged in');
    }

    if(bearerToken !== 'dGhlc2VjcmV0dG9rZW4=') {
        throw new AuthenticationError('Wrong token');
    }
}