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

从结果上可以看到，流程是一层层的打开，然后一层层的闭合，像是剥洋葱一样 —— **洋葱模型**。 



## 0300 koa-router

### what is router?

路由是用于描述 `URL` 与处理函数之间的对应关系的。比如用户访问 `http://localhost:3000/`，那么浏览器就会显示 `index` 页面的内容，如果用户访问的是 `http://localhost:3000/home`，那么浏览器应该显示 `home` 页面的内容。 

如果不使用路由中间件，或者相关的框架的化，可以像下面代码块中一样实现这个功能

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    if (ctx.request.path === '/') {
        ctx.response.body = '<h1>index page</h1>';
    } else {
        await next();
    }
});
app.use(async (ctx, next) => {
    if (ctx.request.path === '/home') {
        ctx.response.body = '<h1>home page</h1>';
    } else {
        await next();
    }
});
app.use(async (ctx, next) => {
    if (ctx.request.path === '/404') {
        ctx.response.body = '<h1>404 Not Found</h1>';
    } else {
        await next();
    }
});

app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})
```

上述 代码中，由 `async` 标记的函数称为『异步函数』，在异步函数中，可以用 `await` 调用另一个异步函数，`async` 和 `await` 这两个关键字将在 ES7 中引入。参数 `ctx` 是由 `koa` 传入的，我们可以通过它来访问 `request` 和 `response`，`next` 是 `koa` 传入的将要处理的下一个异步函数。 

**注意：** 由于 `node` 在 `v7.6.0` 中才支持 `async` 和 `await`，所以在运行 `app.js` 之前请确保 node 版本正确，或者使用一些第三方的 `async` 库来支持。 

这样的写法能够处理简单的应用，但是，一旦要处理的 `URL` 多起来的话就会显得特别笨重。所以我们可以借助 `koa-router`来更简单的实现这一功能。 下面来介绍一下如何正确的使用 `koa-router`。 

### koa-router

install: `npm i koa-router -S`

`-S` 或者 `--save` 是为了安装完成之后能够在 `package.json` 的 `dependencies` 中保留 `koa-router`，以便于下次只需要执行 `npm i` 或者 `npm install` 就能够安装所有需要的依赖包。 

```javascript
const Koa = require('koa')
// 注意 require('koa-router') 返回的是函数:
const router = require('koa-router')()
const app = new Koa()

// 添加路由
router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>index page</h1>`
})

router.get('/home', async (ctx, next) => {
    ctx.response.body = '<h1>HOME page</h1>'
})

router.get('/404', async (ctx, next) => {
    ctx.response.body = '<h1>404 Not Found</h1>'
})

// 调用路由中间件
app.use(router.routes())

app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})
```

在 `HTTP` 协议方法中，`GET`、`POST`、`PUT`、`DELETE` 分别对应 `查`，`增`，`改`，`删`，这里 `router` 的方法也一一对应。通常我们使用 `GET` 来读数据，使用 `POST` 来写数据。`PUT` 和 `DELETE` 使用比较少，但是如果你们团队采用 `RESTful架构`，就比较推荐使用了。我们注意到，上述代码中还有一个`all` 方法。`all` 方法用于处理上述方法无法匹配的情况，或者你不确定客户端发送的请求方法类型。 

```javascript
router.all('/*', async (ctx, next) => {
  ctx.response.status = 404;
  ctx.response.body = '<h1>404 Not Found</h1>';
});
```

`*` 号是一种通配符，表示匹配任意 `URL`。这里的返回是一种简化的写法，真实开发中，我们肯定要去读取 `HTML` 文件或者其他模板文件的内容，再响应请求。关于这部分的内容后面的章节中会详细介绍。 

notice:

`RESTful`:

[RESTful](https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)

[RESTful wiki](https://en.wikipedia.org/wiki/Representational_state_transfer)

### named router

在开发过程中我们能够很方便的生成路由 `URL`： 

```javascript
router.get('user', '/users/:id', function (ctx, next) {
  // ... 
});

router.url('user', 3);
// => 生成路由 "/users/3" 

router.url('user', { id: 3 });
// => 生成路由 "/users/3" 

router.use(function (ctx, next) {
  // 重定向到路由名称为 “sign-in” 的页面 
  ctx.redirect(ctx.router.url('sign-in'));
})
```

`router.url` 方法方便我们在代码中根据路由名称和参数(可选)去生成具体的 `URL`，而不用采用字符串拼接的方式去生成 `URL` 了。 

### multi-middleware

`koa-router` 也支持单个路由多中间件的处理。通过这个特性，我们能够为一个路由添加特殊的中间件处理。也可以把一个路由要做的事情拆分成多个步骤去实现，当路由处理函数中有异步操作时，这种写法的可读性和可维护性更高。比如下面的示例代码所示 :

```javascript
router.get(
  '/users/:id',
  function (ctx, next) {
    return User.findOne(ctx.params.id).then(function(user) {
      // 首先读取用户的信息，异步操作
      ctx.user = user;
      next();
    });
  },
  function (ctx) {
    console.log(ctx.user);
    // 在这个中间件中再对用户信息做一些处理
    // => { id: 17, name: "Alex" }
  }
);
```

### nested router

我们可以在应用中定义多个路由，然后把这些路由组合起来用，这样便于我们管理多个路由，也简化了路由的写法。 

```javascript
var forums = new Router();
var posts = new Router();

posts.get('/', function (ctx, next) {...});
posts.get('/:pid', function (ctx, next) {...});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

// 可以匹配到的路由为 "/forums/123/posts" 或者 "/forums/123/posts/123"
app.use(forums.routes());
```

### router prefix

通过 `prefix` 这个参数，我们可以为一组路由添加统一的前缀，和嵌套路由类似，也方便我们管理路由和简化路由的写法。不同的是，前缀是一个固定的字符串，不能添加动态参数。 

```js
var router = new Router({
  prefix: '/users'
});

router.get('/', ...); // 匹配路由 "/users" 
router.get('/:id', ...); // 匹配路由 "/users/:id"
```

### URL parameters

`koa-router` 也支持参数，参数会被添加到 `ctx.params` 中。参数可以是一个正则表达式，这个功能的实现是通过 `path-to-regexp` 来实现的。原理是把 `URL` 字符串转化成正则对象，然后再进行正则匹配，之前的例子中的 `*` 通配符就是一种正则表达式。 

```js
router.get('/:category/:title', function (ctx, next) {
  console.log(ctx.params);
  // => { category: 'programming', title: 'how-to-node' } 
});
```

通过上面的例子可以看出，我们可以通过 `ctx.params` 去访问路由中的参数，使得我们能够对参数做一些处理后再执行后续的代码。 