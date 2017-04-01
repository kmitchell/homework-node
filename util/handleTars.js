const tar = require('tar-fs')
const gunzip = require('gunzip-maybe')
const request = require('request')
const Promise = require('bluebird')

// Asynchronously downloads and extracts package tars into
// appropriate folders, via a list from tarballUrls.js
var handleTars = function (packageMetadatas) {
  return Promise.map(packageMetadatas, makeRequest)

  function makeRequest(metadata) {
    return new Promise (function (resolve, reject) {
      request
        .get(metadata[1])
        .on('error', (error) => { return reject ((error) => console.log(error))})
        .pipe(gunzip())
        .pipe(tar.extract(`./packages/${metadata[0]}`))
        .on('finish', function () {
          return resolve (console.log(`* Downloaded and extracted '${metadata[0]}'' successfully!`))
        })
    })
  }
}

module.exports = handleTars
