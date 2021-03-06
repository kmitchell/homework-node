'use strict'

const tar = require('tar-fs')
const gunzip = require('gunzip-maybe')
const request = require('request')
const Promise = require('bluebird')

module.exports = handleTars

// Asynchronously downloads and extracts package tars into appropriate
// folders, via an array of package names and tarball URLs
function handleTars (packagesMetadata) {
  return Promise.map(packagesMetadata, function (metadata) {
    return new Promise(function (resolve, reject) {
      request
        .get(metadata[1])
        .on('error', (error) => { return reject(console.log(error)) })
        .pipe(gunzip())
        .on('error', (error) => { return reject(console.log(error)) })
        .pipe(tar.extract(`./packages/${metadata[0]}`, {
          map: function (header) {
            // remove the unnecessary 'package/' parent directory from path
            header.name = transformPath(header.name)
            return header
          }
        }))
        .on('error', (error) => { return reject(console.log(error)) })
        .on('finish', function () {
          return resolve(console.log(`* Downloaded and extracted '${metadata[0]}' successfully!`))
        })

      function transformPath (path) {
        var splitPath = path.split('/')
        splitPath.splice(0, 1)
        return splitPath.join('/')
      }
    })
  })
}
