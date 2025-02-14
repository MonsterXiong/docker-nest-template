import { Injectable } from '@nestjs/common';
import {translator} from './translator.util'

let pipe = (name)=>{}
!(async ()=>{
  pipe = await translator()
})()

@Injectable()
export class TranslatorService {
    async getResult(name){
        // return await name
        const [translation_text]:any = await pipe(name)
        return translation_text.translation_text
    }
}
