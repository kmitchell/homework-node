'use strict'

const utils = require('./util')

module.exports = downloadPackages

function downloadPackages (count, callback) {
  if (count > 36) {
    console.log('!!! The current implementation can only grab up to the 36th most depended-upon package!\n' +
                '!!! Grabbing the top 36 instead.')
  } else {
    console.log(`Beginning download of top ${count} packages...`)
  }

  utils.getTopPackagesMetadata(count)
    .then(utils.getTarballUrls)
    .then(utils.handleTars)
    .then(() => callback())
    .then(() => console.log('All done.'))
    .catch((error) => console.log(error))
}
