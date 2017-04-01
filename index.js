'use strict'

const Promise = require('bluebird')
const getTopPackagesMetadata = require('./util/topPackagesMetadata')
const getTarballUrls = require('./util/tarballUrls')
const handleTars = require('./util/handleTars')
const COUNT = parseInt(process.env.COUNT, 10) || 10

module.exports = downloadPackages

function downloadPackages (count, callback) {
  console.log(`Beginning download of top ${COUNT} packages...`)

  getTopPackagesMetadata(count)
    .then(getTarballUrls)
    .then(handleTars)
    .then(() => callback() )
    .then(() => console.log("All done."))
    .catch((error) => console.log(error))

}
