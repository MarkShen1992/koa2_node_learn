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

上面的内容可以使用`yarn`的方式重新来一遍，课后作业。



## 0200 usage of middleware

```javascript
app.use(async (ctx, next) => {
  await next()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello World</h1>'
})
```

### the mean of code

​	每收到一个 `http` 请求，`Koa` 都会调用通过 `app.use()` 注册的 `async` 函数，同时为该函数传入 `ctx` 和 `next` 两个参数。而这个 `async` 函数就是我们所说的中间件。 

the mean of `ctx` and `next`

#### ctx:

ctx作为上下文使用，包含了基本的 `ctx.request` 和 `ctx.response`。另外，还对 `Koa` 内部对一些常用的属性或者方法做了代理操作，使得我们可以直接通过 `ctx` 获取。比如，`ctx.request.url` 可以写成 `ctx.url`。 

除此之外，`Koa` 还约定了一个中间件的存储空间 `ctx.state`。通过 `state` 可以**存储一些数据**，比如用户数据，版本信息等。如果你使用 `webpack` 打包的话，可以使用中间件，将加载资源的方法作为 `ctx.state` 的属性传入到 `view` 层，方便获取资源路径。 

#### next:

`next` 参数的作用是将处理的控制权转交给下一个中间件，而 `next()` 后面的代码，将会在下一个中间件及后面的中间件（如果有的话）执行结束后再执行。

**注意：** 中间件的顺序很重要！

```javascript
// 按照官方示例
const Koa = require('koa')
const app = new Koa()

// 记录执行的时间
app.use(async (ctx, next) => {
  let stime = new Date().getTime()
  await next()
  let etime = new Date().getTime()
  ctx.response.type = 'text/html'
  ctx.response.body = '<h1>Hello World</h1>'
  console.log(`请求地址: ${ctx.path}，响应时间：${etime - stime}ms`)
});

app.use(async (ctx, next) => {
  console.log('中间件1 doSoming')
  await next();
  console.log('中间件1 end')
})

app.use(async (ctx, next) => {
  console.log('中间件2 doSoming')
  await next();
  console.log('中间件2 end')
})

app.use(async (ctx, next) => {
  console.log('中间件3 doSoming')
  await next();
  console.log('中间件3 end')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
```

程序运行结果：

```
server is running at http://localhost:3000
中间件1 doSoming
中间件2 doSoming
中间件3 doSoming

中间件3 end
中间件2 end
中间件1 end


请求地址: /，响应时间：21ms
中间件1 doSoming
中间件2 doSoming
中间件3 doSoming

中间件3 end
中间件2 end
中间件1 end
请求地址: /favicon.ico，响应时间：3ms
```

从结果上可以看到，流程是一层层的打开，然后一层层的闭合，像是剥洋葱一样 —— 洋葱模型。 