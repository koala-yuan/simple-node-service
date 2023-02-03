const koa = require('koa')
const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')
const static = require('koa-static')

const BASE = process.env['PROXY_BASE'] || 'http://kong-svc.admin.svc.cluster.local:8000'
const PATH_PREFIX = process.env['PATH_PREFIX'] || '/online/marvelorg'

const app = new koa()

app.use(async(ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', '*');
  ctx.set('Access-Control-Allow-Methods', '*');
  await next();
})

const getProxyResponse = async (ctx) => {
  // 如果路由以api开头，则直接转发到对应的服务
  const { method, originalUrl } = ctx

  const url = `${BASE}${originalUrl.replace(/^\/ds/, PATH_PREFIX)}`
  console.log(`Proxy to ${url}`)

  let rawResponse
  try {
    rawResponse = await fetch(url, {
      method,
      body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : ctx.req,
      headers: {
        accept: 'application/json'
      }
    })
  } catch (e) {
    console.log('Proxy error:', e)
    return e
  }

  let data = {}
  try {
    data = await rawResponse && rawResponse.json()
  } catch (e) {
    console.log('parse json error', rawResponse && rawResponse.status, e)
  }
  return data
}
app.use(static(path.join( __dirname, './dist')))

app.use(async(ctx, next) => {
  const { originalUrl } = ctx
  if (originalUrl.match(/^\/ds/)) {
    ctx.body = await getProxyResponse(ctx)
    return
  } else if (originalUrl === '/') {
    ctx.body = fs.readFileSync(`./dist/index.html`, 'utf-8')
  }
})


console.log('######### running 8888')
app.listen(8888)
