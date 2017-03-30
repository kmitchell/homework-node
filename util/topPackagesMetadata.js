const jsdom = require('jsdom')

// Grabs /depended HTML, parses pertinent elements and
// returns them in a Map.

var getTopPackagesMetadata = function (count, callback) {
  jsdom.env({
    url: 'https://www.npmjs.com/browse/depended',
    done: function (error, window) {
      if (error) {
        console.log(error)
      } else {
        document = window.document
        callback(extractPackagesMetadata(count))
      }
    }
  })

  function extractPackagesMetadata (count) {
    var packageNames = parseElements('name', count)
    var packageVersions = parseElements('version', count)
    var list = new Map() // use Map instead of Object to preserve order

    for (var i = 0; i < packageNames.length; i++) {
      list.set(packageNames[i], packageVersions[i])
    }
    return list
  }

  function parseElements (element, count) {
    var elements = document.getElementsByClassName(element)
    return Array.from(elements)
                .slice(0, (count || 10))
                .map(item => item.text)
  }
}

module.exports = getTopPackagesMetadata
