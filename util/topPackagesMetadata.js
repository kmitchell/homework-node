'use strict'

const request = require('request-promise')
const cheerio = require('cheerio')
const Promise = require('bluebird')
const DEPENDED_URI = process.env.DEPENDED_URI || 'https://www.npmjs.com/browse/depended'

module.exports = getTopPackagesMetadata

// Grabs /depended HTML, parses pertinent elements, and
// returns the text of those elements in an array
function getTopPackagesMetadata (count) {
  return new Promise(function (resolve, reject) {
    var options = {
      uri: DEPENDED_URI,
      timeout: 5000,
      transform: (body) => { return cheerio.load(body) }
    }

    return request
      .get(options)
      .then(($) => resolve(extractPackagesMetadata(count, $)))
      .catch((error) => reject(error))
  })

  function extractPackagesMetadata (count, $) {
    var names = parseElements('name', count, $)
    var versions = parseElements('version', count, $)
    return names.map((name, version) => { return [name, versions[version]] })
  }

  function parseElements (element, count, $) {
    return $(`.${element}`)
      .map(function () { return $(this).text() })
      .slice(0, count)
      .get()
  }
}
