const request = require('request-promise')
const Promise = require('bluebird')

// Grabs and returns an array of package names and their
// tarball URLs, with a Map provided by topPackagesList.js
var getTarballUrls = function (packageMap) {
  var constructedUris = constructUris(packageMap)
  var names = Array.from(packageMap.keys())

  return Promise.map(constructedUris, function(uri) {
    return request({uri: uri, json: true})
      .then(function (response) { // return the tarball url
        return response.dist.tarball
      })
    })
    .then(function(results) { // add package names to results
      return names.map(function (error, item) {
        return [names[item], results[item]]
      })
    })

  function constructUris (packageMap) {
    var uris = []
    for (var item of packageMap) {
      var name = item[0], version = item[1]
      uris.push('https://registry.npmjs.org/' + name + '/' + version)
    }
    return uris
  }
}

module.exports = getTarballUrls
