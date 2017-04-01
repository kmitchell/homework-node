const request = require('request-promise')
const Promise = require('bluebird')

// Grabs and returns an array of package names and their
// tarball URLs, with a Map provided by topPackagesList.js
var getTarballUrls = function (packageMap) {
  var constructedUris = constructUris(packageMap)
  var names = Array.from(packageMap.keys())

  return Promise.map(constructedUris, function (uri) {
    return request({uri: uri, json: true})
      // return the tarball url
      .then(function (response) {
        return response.dist.tarball
      })
      .catch((error) => console.log(error))
  })
  // then zip results with package names
  .then(function (results) {
    return names.map(function (name, uri) {
      return [name, results[uri]]
    })
  })
  .catch((error) => console.log(error))

  function constructUris (packageMap) {
    var uris = []
    for (var item of packageMap) {
      uris.push(`https://registry.npmjs.org/${item[0]}/${item[1]}`)
    }
    return uris
  }
}

module.exports = getTarballUrls
