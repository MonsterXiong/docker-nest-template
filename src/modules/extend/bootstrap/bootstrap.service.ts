import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BootstrapService implements OnModuleInit{

    private pipe;
    // 初始化时自动加载数据
    async onModuleInit() {
      this.pipe = await this._getTranslator()
    }
    async _getTranslator() {
      const { pipeline, env } = await import('@xenova/transformers');
      env.allowLocalModels = true;
      env.allowRemoteModels = false;
      env.localModelPath = 'public/onnx'
      const pipe = await pipeline('translation', 'Xenova/opus-mt-zh-en');
      return (name) => pipe(name)
    }
    async translator(name) {
      const [translation_text]: any = await this.pipe(name)
      return translation_text.translation_text
    }
  
}
