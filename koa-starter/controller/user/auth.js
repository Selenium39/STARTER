class AuthController {
    async login(ctx) {
        let res;
        let conn;
        try {
            conn = await ctx.db.getConnection();
            const { username, password } = ctx.request.body;
            const users = await ctx.db.query(conn, 'SELECT * FROM user WHERE username = ?', [username])
            if (users.length === 0) {
                res = { ...ctx.errCode.LOGIN_ERROR }
            } else {
                const verify = await ctx.crypto.verifyPassword(password, users[0].salt, users[0].password);
                if (verify) {
                  const token = await ctx.jwt.createToken({ id: users[0].id, username: users[0].username });
                  res = { ...ctx.errCode.SUCCESS, data: { token } };
                  ctx.cookies.set('token', token, {
                    maxAge: ctx.config.jwt.expire * 1000,
                  });
                } else {
                  res = { ...ctx.errCode.LOGIN_ERROR };
                }
            }
        } catch (error) {
            ctx.logger.error(error);
            res = { ...ctx.errCode.INTERNAL_SERVER_ERROR };
            if (ctx.app.env === 'dev') {
                res.data = error.toString();
            }
        } finally {
            ctx.db.releaseConnection(conn);
            ctx.body = res;
        }
    }
}
module.exports = exports = new AuthController();
