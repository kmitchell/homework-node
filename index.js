'use strict'

const getTopPackagesMetadata = require('./util/topPackagesMetadata.js')
const getTarballUrls = require('./util/tarballUrls.js')
const handleTars = require('./util/handleTars.js')
const COUNT = parseInt(process.env.COUNT, 10) || 10

module.exports = downloadPackages

function downloadPackages (count, callback) {
  console.log(`Beginning download of top ${COUNT} packages...`)

  getTopPackagesMetadata(count, function (list) {
    getTarballUrls(list, function (urls) {
      handleTars(urls, function (error, result) {
        if (error) console.log(error)
        else callback(console.log(result))
      })
    })
  })
}

downloadPackages(COUNT, function (error, result) {
  if (error) console.log(error)
  else console.log(result)
})
