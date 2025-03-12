import * as ejs from 'ejs';

export class RenderEngine{
    templateMap: any;
    constructor(initTemplateMap = new Map()){
        this.templateMap = initTemplateMap
    }
    async updateTemplateMap(){}

    render(key,options:any={}){
        const {depth = 0} = options
        if(depth > 10) return '<!-- 递归深度过大 -->';
        const template = this.templateMap.get(key)
        
        if(!template){
            return '<!-- 模板未找到 -->'
        }
        // 扩展EJS的include函数，使其能够处理数据库模板
        const customInclude = (subKey,subData)=>{
            return this.render(subKey,{...options,...subData,depth:depth + 1})
        }
        const renderData = {
            include:customInclude,
            ...options
        }
    
        return ejs.render(template.templateCode,renderData)

    }
}