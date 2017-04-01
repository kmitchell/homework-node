'use strict'

const getTopPackagesMetadata = require('./util/topPackagesMetadata')
const getTarballUrls = require('./util/tarballUrls')
const handleTars = require('./util/handleTars')

module.exports = downloadPackages

function downloadPackages (count, callback) {
  console.log(`Beginning download of top ${count} packages...`)

  getTopPackagesMetadata(count)
    .then(getTarballUrls)
    .then(handleTars)
    .then(() => callback())
    .then(() => console.log('All done.'))
    .catch((error) => console.log(error))
}
