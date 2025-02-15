const { insert } = require('@bin/postgres-query-builder');

module.exports = async (request, response, delegate) => {
  const connection = await delegate.getConnection;
  const result = await insert('coupon').given(request.body).execute(connection);

  return result;
};
