var deep    = require('deep-equal')
var test    = require('tape')
var path    = require('path')
var closest = require('./')

var lowest  = require.resolve('./fixtures/a/b/package.json')
var local   = require.resolve('./package.json')

test('async: always true', function(t) {
  t.plan(1)

  closest(__dirname, function(pkg) {
    return true
  }, function(err, result) {
    if (err) return t.fail(err)
    t.ok(result === local, 'found local package.json')
  })
})

test('sync: always true', function(t) {
  var result = closest.sync(__dirname, function(pkg) {
    return true
  })

  t.ok(result === local, 'found local package.json')
  t.end()
})

test('async: always false', function(t) {
  t.plan(1)

  closest(__dirname, function(pkg) {
    return false
  }, function(err, result) {
    if (err) return t.fail(err)
    t.ok(result === null, 'returned null')
  })
})

test('sync: always false', function(t) {
  var result = closest.sync(__dirname, function(pkg) {
    return false
  })

  t.ok(result === null, 'returned null')
  t.end()
})

test('async: three levels down', function(t) {
  t.plan(1)

  closest(path.dirname(lowest)
    , localDir
    , function(err, result) {
      if (err) return t.fail(err)
      t.equal(3, require(result).level, '"level": 3')
    })
})

test('async: three levels down', function(t) {
  var result = closest.sync(path.dirname(lowest), localDir)

  t.ok(result, 'should find package.json')
  t.equal(3, require(result).level, '"level": 3')
  t.end()
})

test('async: level === 1', function(t) {
  t.plan(1)

  closest(path.dirname(lowest), function(pkg, pkgfile) {
    return localDir(pkg, pkgfile) && pkg.level === 1
  }, function(err, result) {
    if (err) return t.fail(err)
    t.equal(1, require(result).level, '"level": 1')
  })
})

test('sync: level === 1', function(t) {
  var result = closest.sync(path.dirname(lowest), function(pkg, pkgfile) {
    return localDir(pkg, pkgfile) && pkg.level === 1
  })

  t.ok(result, 'should find package.json')
  t.equal(1, require(result).level, '"level": 1')
  t.end()
})

function localDir(pkg, pkgfile) {
  var pkgdir = path
    .dirname(pkgfile)
    .split(path.sep)

  return (
    pkgdir.length >= __dirname.split(path.sep).length
  )
}
