const request = require('request-promise')
const cheerio = require('cheerio')
const Promise = require('bluebird')

// Grabs /depended HTML, parses pertinent elements, and
// returns those elements in a Map.
var getTopPackagesMetadata = function (count) {
  return new Promise (function (resolve, reject) {
    var options = {
      uri: 'https://www.npmjs.com/browse/depended',
      transform: function (body) {
        return cheerio.load(body)
      }
    }

    return request(options)
      .then(function ($) {
        resolve(extractPackagesMetadata(count, $))
      })
      .catch(function (error) {
        reject(error)
      })
  })

  function extractPackagesMetadata (count, $) {
    var packageNames = parseElements('name', count, $)
    var packageVersions = parseElements('version', count, $)

    var list = new Map() // use Map instead of Object to preserve order
    for (var i = 0; i < packageNames.length; i++) {
      list.set(packageNames[i], packageVersions[i])
    }
    return list
  }

  function parseElements (element, count, $) {
    var elements = $(`.${element}`).map(function() {
      return $(this).text()
    }).slice(0, (count).get()
    return elements
  }
}

module.exports = getTopPackagesMetadata
