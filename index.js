'use strict'

const Promise = require('bluebird')
const getTopPackagesMetadata = require('./util/topPackagesMetadata')
const getTarballUrls = require('./util/tarballUrls')
const handleTars = require('./util/handleTars')
const COUNT = parseInt(process.env.COUNT, 10) || 10

module.exports = downloadPackages

function downloadPackages (count) {
  console.log(`Beginning download of top ${COUNT} packages...`)

  getTopPackagesMetadata(count)
    .then(getTarballUrls)
    .then(handleTars)
    .catch((error) => console.log(error))
    }

downloadPackages(COUNT)
