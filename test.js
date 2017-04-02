'use strict'

const test = require('tape')
const series = require('run-series')
const fs = require('fs')
const folderSize = require('get-folder-size')
const download = require('./')
const del = require('del')

function cleanupPackages (callback) {
  console.log('Clearing packages directory...')
  del.sync(['packages/**', '!packages', '!packages/.gitignore'])
  callback()
}

series([
  utilTestplan,
  downloadTestplan
])

function downloadTestplan (callback) {
  test('downloadPackages', function (t) {
    t.plan(3)

    const COUNT = parseInt(process.env.COUNT, 10) || 10

    series([
      cleanupPackages,
      (callback) => download(COUNT, callback),
      verifyCount,
      verifySize,
      verifyLodash,
      cleanupPackages
    ], t.end)

    function verifyCount (callback) {
      fs.readdir('./packages', function (err, files) {
        if (err) return callback(err)
        // Filter .gitignore and other hidden files
        files = files.filter((file) => !/^\./.test(file))
        t.equal(files.length, COUNT, `has ${COUNT} files`)
        callback()
      })
    }

    function verifySize (callback) {
      folderSize('./packages', function (err, size) {
        if (err) return callback(err)
        t.ok(size / 1024 > 5 * COUNT, 'min 5k per package')
        callback()
      })
    }

    function verifyLodash (callback) {
      const _ = require('./packages/lodash')
      t.equal(typeof _.map, 'function', '_.map exists')
      callback()
    }
  })
  callback()
}

function utilTestplan (callback) {
  test('utils', function (assert) {
    const util = require('./util/')
    const versionMetadata = [ [ 'lodash', '4.17.4' ] ]
    const tarballMetadata = [ [ 'lodash', 'http://registry.npmjs.org/lodash/-/lodash-4.17.4.tgz' ] ]

    series([
      cleanupPackages,
      handleTars,
      tarballUrls,
      topPackagesMetadata,
      cleanupPackages
    ], assert.end)

    function handleTars (callback) {
      fs.readdir('./packages', function (err, files) {
        if (err) return callback(err)
        util.handleTars(tarballMetadata)
          .then(function () {
            assert.equal(files.length, 1, `has 1 file`)
          })
          .then(() => callback())
      })
    }

    function tarballUrls (callback) {
      util.getTarballUrls(versionMetadata)
        .then(function (result) {
          assert.equal(tarballMetadata.toString(), result.toString(), 'tarballUrls returns expected result')
        })
        .then(() => callback())
    }

    function topPackagesMetadata (callback) {
      util.getTopPackagesMetadata(1)
        .then(function (result) {
          assert.equal(versionMetadata.toString(), result.toString(), 'topPackagesMetadata returns expected result')
        })
        .then(() => callback())
    }
  })
  callback()
}
