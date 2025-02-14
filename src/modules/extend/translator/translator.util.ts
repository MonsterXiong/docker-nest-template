export async function translator(){
    try {
        const { pipeline,env } = await import('@xenova/transformers');
        env.allowLocalModels = true;
        env.allowRemoteModels = false;
        env.localModelPath = 'public/onnx'

        const pipe = await pipeline('translation', 'Xenova/opus-mt-zh-en');
        return (name)=>pipe(name)
    } catch (error) {
        console.log(error);
    }

}
