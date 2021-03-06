'use strict'

const request = require('request-promise')
const Promise = require('bluebird')
const REGISTRY_URI = process.env.REGISTRY_URI || 'https://registry.npmjs.org/'

module.exports = getTarballUrls

// Grabs package registry metadata and returns an array of package names and their
// tarball URLs, via an array of package names and versions
function getTarballUrls (packagesMetadata) {
  var constructedUris = packagesMetadata.map(function (metadata) {
    return REGISTRY_URI + `${metadata[0]}/${metadata[1]}`
  })

  return Promise.map(constructedUris, function (uri) {
    return request({uri: uri, timeout: 5000, json: true})
      // return the tarball url
      .then(function (response) {
        return response.dist.tarball
      })
      .catch((error) => console.log(error))
  })
  // then zip results with package names
  .then(function (results) {
    return packagesMetadata.map(function (name, uri) {
      return [name[0], results[uri]]
    })
  })
  .catch((error) => console.log(error))
}
