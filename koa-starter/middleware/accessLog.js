'use strict';

const accessLog = () => {
  return async (ctx, next) => {
    const start = Date.now();

    await next();

    const ms = Date.now() - start;
    const [req, res] = [
      ctx.request,
      ctx.response,
    ];
    const [ip, protocol, method, type, url, status, length] = [
      req.ip,
      req.protocol,
      req.method,
      req.type || null,
      req.originalUrl,
      res.status,
      res.length,
    ];
    const formatLog = [`${ip} - "${protocol} ${method} ${url} ${type}" ${status} ${length} ${ms}ms`];

    if (ctx.app.env === 'dev' && ctx.response.is('json') && status !== 404) {
      formatLog.push('------------------------- start');
      formatLog.push(`req type: ${type}`);
      formatLog.push(`req query: ${JSON.stringify(req.query)}`);
      formatLog.push(`req body: ${JSON.stringify(req.body)}`);
      formatLog.push(`res type: ${res.type}`);
      formatLog.push(`res body: ${JSON.stringify(res.body)}`);
      formatLog.push('------------------------- end');
    }

    ctx.logger.access(formatLog.join('\n'));
  };
};

module.exports = exports = accessLog;
