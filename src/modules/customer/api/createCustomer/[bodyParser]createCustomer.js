const { insert, select } = require('../../../../postgres-query-builder');
const bcrypt = require('bcryptjs');
const { pool } = require('../../../../lib/postgres/connection');
const {
  OK,
  INTERNAL_SERVER_ERROR
} = require('../../../../lib/util/httpStatus');
const { buildUrl } = require('../../../../lib/router/buildUrl');

// eslint-disable-next-line no-unused-vars
module.exports = async (request, response, delegate, next) => {
  const { body } = request;
  // eslint-disable-next-line camelcase
  const { email, full_name, password } = body;
  try {
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    await insert('customer')
      .given({
        email,
        // eslint-disable-next-line camelcase
        full_name,
        password: hash,
        group_id: 1,
        status: 1
      })
      .execute(pool);

    const customer = await select()
      .from('customer')
      .where('email', '=', email)
      .load(pool);

    response.status(OK).json({
      data: {
        ...customer,
        links: [
          {
            rel: 'customerGrid',
            href: buildUrl('customerGrid'),
            action: 'GET',
            types: ['text/xml']
          },
          {
            rel: 'edit',
            href: buildUrl('customerEdit', { id: customer.uuid }),
            action: 'GET',
            types: ['text/xml']
          }
        ]
      }
    });
  } catch (e) {
    response.status(INTERNAL_SERVER_ERROR);
    response.json({
      error: {
        status: INTERNAL_SERVER_ERROR,
        message: e.message
      }
    });
  }
};
