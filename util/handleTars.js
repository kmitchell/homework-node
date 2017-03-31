const tar = require('tar-fs')
const gunzip = require('gunzip-maybe')
const request = require('request')
const Promise = require('bluebird')

// Asynchronously downloads and extracts package tars into
// appropriate folders, via a list from tarballUrls.js
var handleTars = function (packageMetadatas) {
  return Promise.map(packageMetadatas, (function(promise) {
    var name = promise[0], url = promise[1]
      return request
        .get(url)
        .on('error', (error) => console.log(error))
        .pipe(gunzip())
        .pipe(tar.extract(`./packages/${name}`))
        .on('finish', () => console.log(`* Downloaded and extracted '${name}' successfully!`))
  }))
}

module.exports = handleTars
