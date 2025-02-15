const { webpack } = require('webpack');
const {
  createConfigClient
} = require('@lib/webpack/prod/createConfigClient');
const {
  createConfigServer
} = require('@lib/webpack/prod/createConfigServer');

module.exports.compile = async function compile(routes) {
  const config = [createConfigClient(routes), createConfigServer(routes)];

  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(err);
        console.log(
          stats.toString({
            errorDetails: true,
            warnings: true
          })
        );
        reject(err);
      }
      resolve(stats);
    });
  });
};
