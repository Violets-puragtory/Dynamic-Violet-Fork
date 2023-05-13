import MetaURL from '../../meta/type';
import iterate from './iterate';
import process from './process';
import emit from './emit';

export default class js {
  iterate = iterate;
  process = process;
  emit = emit;

  ctx;
  
  constructor(ctx:any) {
    this.ctx = ctx.ctx;
  }

  rewrite(this: any, src:any, config: any = {}, inject: Boolean = true, dynamic: any = {}) {

    if (src.includes('/* dynamic.js */')) return src;

    src = `/* dynamic.js */ \n\n${src}`;

    try {
      try {
        src = this.process(src, config, {module: true, ...this.ctx}, dynamic);
      } catch {
        src = this.process(src, config, {module: false, ...this.ctx}, dynamic);
      }
    } catch(e) {
      console.log(e, src)
    }
    
    if (inject) {
      src = `
      if (typeof self !== undefined && typeof self.importScripts == 'function' && typeof self.__dynamic == 'undefined') importScripts('/dynamic/dynamic.config.js', '/dynamic/dynamic.handler.js?'+Math.floor(Math.random()*(99999-10000)+10000));

      ${src}`;
    }

    return src;
  }
}