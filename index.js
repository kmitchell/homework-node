'use strict'

const utils = require('./util')

module.exports = downloadPackages

function downloadPackages (count, callback) {
  console.log(`Beginning download of top ${count} packages...`)

  utils.getTopPackagesMetadata(count)
    .then(utils.getTarballUrls)
    .then(utils.handleTars)
    .then(() => callback())
    .then(() => console.log('All done.'))
    .catch((error) => console.log(error))
}
