>  plugin for gulp,should use with other hash plugins and replace the hash in the files.Only support buffer files now.

### Usage

install `gulp-hash-replace` as a development dependency:

```bash
npm install gulp-hash-replace -D
```
And then you can add it to your `gulpfile.js`.

### Example:

```js
const gulp = require('gulp')
const hash = require('gulp-hash')
const replace = require('gulp-hash-replace')
gulp.src([
  'XX.css'
])
.pipe(hash())
.pipe(replace({
  dest:[
    'XX.html'
  ]
}))
.pipe(gulp.dest('./'))
```

### Options

#### dest
Type: `Array/String`
Required:  `true`

The origin file(s) you want to change the hashes in.
The file(s) will be rewrited at the `same path` with the `same name`.This means you have to clear the hashes in the file(s) before  `gulp-hash`.

### License
