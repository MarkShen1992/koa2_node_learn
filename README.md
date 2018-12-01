# koa2_node_learn
​																		project driven

## 0100 build env and hello world

### env prepare:

| 开发工具及框架             | 官网                                         |
| -------------------------- | -------------------------------------------- |
| 集成开发工具IDE(VsCode)    | https://code.visualstudio.com/               |
| node.js                    | https://nodejs.org/en/                       |
| koa2                       | https://koa.bootcss.com/                     |
| 用nvm 进行node版本进行管理 | <https://github.com/coreybutler/nvm-windows> |
| koa-guide                  | https://github.com/guo-yu/koa-guide          |

### notice:

​	由于 `koa2` 已经开始使用 `async/await` 等新语法，所以请保证 `node` 环境在 `7.6` 版本以上。 



### step 1 init project

```
D:\koa2-learn>npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (koa2-learn)
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to D:\koa2-learn\package.json:

{
  "name": "koa2-learn",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this ok? (yes) yes
```

### step 2 install koa2

```
// 安装 koa，并将版本信息保存在 package.json 中
npm i koa -S
```

app.js

```javascript
console.log('hello world');
```

server.js

```javascript
const Koa = require('koa')
const app = new Koa()

// 增加代码
app.use(async (ctx, next) => {
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello World</h1>'
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
```

以上两个文件执行`node + 文件名 `。