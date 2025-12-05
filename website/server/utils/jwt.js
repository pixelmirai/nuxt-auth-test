// server/config/jwt.js

const jwtConfig = {
    /**
     * Secret key for signing and verifying JWT tokens.
     * Stored securely in an environment variable.
     */
    secret:  'secret123',

    /**
     * Token expiration time.
     * Examples: '1h' (1 hour), '7d' (7 days)
     */
    expiresIn: '1h',

    /**
     * Algorithm used for signing JWT tokens.
     * Default: 'HS256'
     */
    algorithm: 'HS256',
};

export {
    jwtConfig
}