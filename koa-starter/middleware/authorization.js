'use strict';

const unless = require('koa-unless');

module.exports = exports = () => {
  const middleware = async function authorization(ctx, next) {
    let res;
    const auth = ctx.request.get('Authorization');
    const token = ctx.cookies.get('token') || (auth && auth.split(' ')[0] === 'Bearer'
      ? auth.split(' ')[1]
      : ctx.request.query.token !== undefined
        ? ctx.request.query.token
        : null);
    if (token) {
      try {
        ctx.state.user = await ctx.jwt.getPayload(token);
        ctx.state.token = token;
      } catch (err) {
        ctx.logger.error(err);
        res = { ...ctx.errCode.UNAUTHORIZED, data: err.toString() };
      }
    } else {
      res = { ...ctx.errCode.UNAUTHORIZED };
    }
    if (res) {
      ctx.body = res;
    } else {
      await next();
      ctx.cookies.set('token', token, {
        maxAge: ctx.config.jwt.expire * 1000,
      });
    }
  };

  middleware.unless = unless;

  return middleware;
};
