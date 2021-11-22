/**
 * 服务端
 */
 import { createApp } from './app'

 export default async context => {
   const { app, router } = createApp()
   console.log(context.url);
   router.push(context.url)
   await new Promise(router.onReady.bind(router))
   return app
 }
