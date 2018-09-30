const fs = require('fs')
const pluginError = require('plugin-error')
const through = require('through2')
const rs = require('replacestream')
const Vinyl = require('vinyl')
const path = require('path')

const PLUGIN_NAME = 'gulp-hashres'

const defaults = {
  htmlName: "default.html",
  exts: [".js",".css",".html"]
}

var replace = function(dest,rule){
  const reg = rule.reg
  const rep = rule.rep
  // const dest_file = fs.createReadStream(dest) //获取需要替换的文件
  // const dest_content = dest_file.pipe(rs(reg,rep))
  const dest_name = getFileName(dest).file || defaults.htmlName
  const destContents = fs.readFileSync(dest,'utf-8')
  const dest_content = destContents.replace(reg,rep)

  fs.writeFileSync(dest,dest_content,'utf-8')
  // const newFile = new Vinyl({
  //   cwd: "",
  //   base: undefined,
  //   path: dest_name,  //filename
  //   contents: dest_content
  // });
  // return newFile
}

var getFileName = function(path){
  const file = path.match(/((\w+\.){1,})(\w+)$/)
  return {
    file: file[0],
    name: file[1].slice(0,-1), //文件名
    ext: file[file.length-1]//后缀
  }
}

module.exports = function(options){

  return through.obj(function(file,enc,cb){
    let dest = options.dest

    const fileName = getFileName(file.path).file
    const lastfileName = getFileName(file.history[0]).file
    // console.log(file.contents)
    const rule = {
      reg: lastfileName,
      rep: fileName
    }

    if(file.isNull()){ //如果文件为空，不做任何操作，直接转入下一个pipe
      this.push(file)
      return cb()
    }
    if(file.isStream()){
      // replaceStream() //后续
      this.emit('error',new pluginError(PLUGIN_NAME,'steam not supported!'))
      this.push(file)
      return cb()
    }
    if(file.isBuffer()){
      if(dest){
        if(typeof dest == "string"){ //简单转一下类型
          dest = [dest]
        }
        if(dest.length){
          const $this = this
          dest.forEach((d)=>{
            // $this.push(replace(d,rule))
            replace(d,rule)
          })
          this.push(file)
          return cb()
        }else {
          thie.emit('error',new pluginError(PLUGIN_NAME,'dest length of 0 !'))
        }
      }else{
        thie.emit('error',new pluginError(PLUGIN_NAME,'dest undefined!'))
      }
    }
    cb()
  })
}
