var path = require('path')
var fs   = require('fs')
var jph  = require('json-parse-helpfulerror')

module.exports = closest
module.exports.sync = closestSync

function closest(dirname, filter, found) {
  dirname = path.resolve(dirname)

  if (!found) {
    found  = filter
    filter = truthy
  }

  check()
  function check() {
    if (isRoot(dirname)) return found(null, null)

    var pkgfile = path.join(dirname, 'package.json')

    fs.exists(pkgfile, function(exists) {
      if (!exists) return next()

      read(pkgfile, function(err, pkg) {
        if (err) return found(err)
        if (filter(pkg, pkgfile)) return found(null, pkgfile)
        next()
      })
    })
  }

  function next() {
    dirname = path.join(dirname, '..')
    check()
  }
}

function closestSync(dirname, filter) {
  dirname = path.resolve(dirname)
  filter  = filter || truthy

  do {
    var pkgfile = path.join(dirname, 'package.json')
    if (!fs.existsSync(pkgfile)) continue
    var pkg = readSync(pkgfile)
    if (filter(pkg, pkgfile)) return pkgfile
  } while (!isRoot(
    dirname = path.join(dirname, '..')
  ))

  return null
}

function isRoot(dirname) {
  return path.resolve(dirname, '..') === dirname
}

function read(pkg, done) {
  fs.readFile(pkg, 'utf8', function(err, json) {
    if (err) return done(err)

    try {
      json = jph.parse(json)
    } catch(e) {
      extendParseError(e, pkg)
      done(e)
    }

    return done(null, json)
  })
}

function readSync(pkg) {
  try {
    return jph.parse(fs.readFileSync(pkg, 'utf8'))
  } catch(e) {
    extendParseError(e, pkg)
    throw e
  }
}

function truthy() {
  return true
}

function extendParseError(e, filename) {
  if (e instanceof SyntaxError) {
    e.message = 'Malformed JSON in file: ' + filename + '\n' + e.message
  }
}
