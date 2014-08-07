# closest-package [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Find the closest package.json file meeting specific criteria by searching
upwards from a given directory until hitting root.

## Usage

[![NPM](https://nodei.co/npm/closest-package.png)](https://nodei.co/npm/closest-package/)

### `closest(dir, [filter], found(err, file))`

Given a starting directory `dir`, look up through every directory to see if
it contains a `package.json` file matching the `filter` function, for example:

``` javascript
closest(__dirname, function(json, filename) {
  return json.name === 'async'
}, function(err, file) {
  console.log(file)
})
```

Note that `filter` is optional and takes the following arguments:

* `json`: the parsed `package.json` file.
* `filename`: the `package.json`'s absolute filename.

### `file = closest.sync(dir, [filter])`

Same as the `closest` function, however executed synchronously:

``` javascript
var result = closest.sync(__dirname, function(json, filename) {
  return json.name === 'async'
})

console.log(result)
```

## License

MIT. See [LICENSE.md](http://github.com/hughsk/closest-package/blob/master/LICENSE.md) for details.
