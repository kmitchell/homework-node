const request = require('request')
const async = require('async')

// Grabs and returns an array of package names and their
// tarball URLs, with a Map provided by topPackagesList.js

var getTarballUrls = function (packageMap, callback) {
  var constructedUris = constructUris(packageMap)
  var names = Array.from(packageMap.keys())

  async.map(constructedUris, makeRequest, function (error, results) {
    if (error) {
      console.log(error)
    } else {
      var zippedResults = names.map(function (error, item) {
        return [names[item], results[item]]
      })
      callback(zippedResults)
    }
  })

  function constructUris (packageMap) {
    var uris = []
    for (var item of packageMap) {
      var name = item[0], version = item[1]
      uris.push('https://registry.npmjs.org/' + name + '/' + version)
    }
    return uris
  }

  function makeRequest (uri, callback) {
    request({uri: uri, json: true}, function (error, response, body) {
      if (error) {
        console.log(error)
      } else {
        callback(null, body.dist.tarball)
      }
    })
  }
}

module.exports = getTarballUrls
