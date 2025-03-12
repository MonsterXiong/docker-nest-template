import compressing from 'compressing';
import * as fse from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import fs from 'fs';

export async function outputCode(res, codeData,type,projectPath="./temp") {
    await writeCode(projectPath,codeData)
    return await downloadCodeFile(projectPath,res,type)
  }

  async function writeCode(projectPath,codeData) {
    // 确保项目路径存在
    fse.ensureDirSync(projectPath);

    const codeList = format(projectPath,codeData)
    // 生成代码
    await genCode(codeList);
  }

  function format(projectPath,codeData){
    return codeData.map(item=>{
      return {
        ...item,
        filePath:path.join(projectPath,item.filePath)
      }
    })
  }

  // 输出到文件系统
async function genCode(result) {
    for (const writeItem of result) {
      const writeFilePath = path.join(writeItem.filePath);
      fse.ensureFileSync(writeFilePath);
      fse.writeFile(writeFilePath, writeItem.content);
    }
  }

  async function downloadCodeFile(dirPath, res,type) {
    const zipFilePath = path.join(dirPath, `../${type}.zip`);
    const flag = await compress(dirPath, zipFilePath);
    return new Promise((resolve, reject) => {
      // 下载
      if (flag) {
        res.set({
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${type}.zip"`,
        });
        // 创建可读流并发送给客户端
        const readStream = fs.createReadStream(zipFilePath);
        readStream.pipe(res);
        readStream.on('end', () => {
          // 移除压缩包
          fse.removeSync(zipFilePath);
          // 移除项目目录
          fse.removeSync(dirPath);
          // fse.emptyDirSync(dirPath, true);
          resolve('操作成功');
        });
      } else {
        reject('操作失败');
      }
    });
  }

export  async function uncompress(source, targetDir) {
    fse.ensureDirSync(targetDir);
    return await compressing.zip.uncompress(source, targetDir);
  }

  export  function compress(source, target) {
    // 创建 archiver 实例
    const archive = archiver('zip', {
      zlib: { level: 9 }, // 设置压缩级别（可选）
    });
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(target);
      // 将输出流管道连接到 archiver
      archive.pipe(output);
      // 将源文件夹添加到压缩包
      archive.directory(source, false);
      // 完成压缩
      archive.finalize();
      // 监听完成事件
      output.on('close', () => {
        resolve(true);
      });
      // 监听错误事件
      archive.on('error', (error) => {
        reject(error);
      });
    });
  }
  