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
        .on('error', (error) => { return reject ((error) => console.log(error))})
        .pipe(tar.extract(`./packages/${metadata[0]}`, {
          map: function(header) {
            header.name = transformPath(header.name)
            return header
          }
        }))
        .on('error', (error) => { return reject ((error) => console.log(error))})
        .on('finish', function () {
          return resolve (console.log(`* Downloaded and extracted '${metadata[0]}' successfully!`))
        })

      function transformPath (path) {
        var original = path.split('/'), updated = original.splice(0,1)
        return original.join('/')
      }
    })
  }
}

module.exports = handleTars
