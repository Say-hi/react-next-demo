export const ironOptions = {
    cookieName: process.env.SESSION_COOKIE_NAME + '',
    password: process.env!.SESSION_PASSWORD + '',
    cookieOptions: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
    }
}

export const github_id = 'a68d1f6151c2a9803631'