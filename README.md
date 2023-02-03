# simple-node-service
一个轻量级的模版服务项目，frontend用vue3+vite，web用koa，通过node服务转发前端请求



#### Frontend（Vue 3 + Vite , node版本 > 16）

##### 启动

```
cd frontend
npm install
npm run dev
```



##### 打包 (静态文件输出到/dist目录)
```
npm run build
```




#### Web（node版本 > 14）

##### 启动

1. 打开setupBackend.sh文件，替换PROXY_BASE env（要转发的服务地址）
2. 运行 ``bash setupBackend.sh``



##### 使用Docker本地运行
1. 手动把frontend build后的dist文件复制到/web下
2. ``docker build -t online_winner:1.0 .`` (构建镜像)
3. ``docker run --rm -p 8888:8888 --env PROXY_BASE=http://host.docker.internal:49543 online_winner:1.0`` (本地运行镜像，host.docker.internal 就是本机的localhost，在docker容器内，需要这样写才能访问到，49543是forward到本地的kong-svc端口号)

4. ``docker tag online_winner:1.0 koala/online_winner:1.0`` (把第二步打好的镜像换个名称，放到DockerHub登陆的用户名下，也可以直接在第一步build的时候就直接用这个名字)
5. ``docker push koalayuan/online_winner:1.0`` (推送到DockerHub仓库, push前需要把clashx vpn关掉，不然会超时失败)



#### TODO
前端目前只进行了初始化，还需要补充 vue3组件实例、访问接口 等功能

