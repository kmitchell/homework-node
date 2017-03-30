const tar = require('tar-fs')
const async = require('async')
const request = require('request')
const gunzip = require('gunzip-maybe')

// Asynchronously downloads and extracts package tars into
// appropriate folders, via a list from tarballUrls.js

var handleTars = function (list, callback) {
  async.each(list, downloadAndExtractTar, function (error, result) {
    if (error) console.log(error)
    else callback(result)
  })

  function downloadAndExtractTar (packageMetadata, callback) {
    var name = packageMetadata[0]
    var url = packageMetadata[1]

    request
      .get(url)
      .on('error', function (err) {
        console.log('Oops:' + err)
      })
      .pipe(gunzip())
      .pipe(tar.extract(`./packages/${name}`))
      .on('finish', function () {
        console.log(`* Downloaded and extracted '${name}' successfully!`)
      })
  }
}

module.exports = handleTars
