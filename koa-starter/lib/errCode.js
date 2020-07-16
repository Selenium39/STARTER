'use strict';

const code = 'status';

module.exports = exports = {
  SUCCESS: { [code]: 200, msg: 'success' },
  UNAUTHORIZED: { [code]: 401, msg: 'unauthorized' },
  INTERNAL_SERVER_ERROR: { [code]: 500, msg: 'internal server error' },
  LOGIN_ERROR: { [code]: -1, msg: 'username or password wrong' },
};
