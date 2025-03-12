import { Client } from 'ssh2';
import fse from 'fs-extra';
import path from 'path';
export class SSHClient {
  config: any;
  client: any;
  constructor(config) {
    this.config = config;
    this.client = new Client();
  }
  // 连接服务器
  connect() {
    return new Promise((resolve, reject) => {
      this.client
        .on('ready', () => {
          console.log('SSH连接成功');
          resolve(true);
        })
        .on('error', (err) => {
          console.error('SSH连接错误', err);
          reject(err);
        })
        .connect(this.config);
    });
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      this.client.exec(command, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        let stdout = '';
        let stderr = '';

        stream
          .on('close', (code) => {
            if (code === 0) {
              resolve({ stdout, stderr, code });
            } else {
              reject(new Error(`命令执行失败，退出码:${code}\n${stderr}`));
            }
          })
          .on('data', (data) => {
            stdout += data.toString();
          })
          .stderr.on('data', (data) => {
            stderr += data.toString();
          });
      });
    });
  }

  // 上传文件
  uploadFile(localPath, remotePath) {
    return new Promise((resolve, reject) => {
      this.client.sftp((err, sftp) => {
        if (err) {
          reject(err);
          return;
        }

        const readStream = fse.createReadStream(localPath);
        const writeStream = sftp.createWriteStream(remotePath);

        writeStream.on('close', () => {
          console.log(`文件上传成功:${localPath} -> ${remotePath}`);
          resolve(true);
        });

        writeStream.on('error', (err) => {
          console.log(`文件上传失败`);
          reject(err);
        });

        readStream.pipe(writeStream);
      });
    });
  }

  // 下载文件
  downloadFile(remotePath, localPath) {
    return new Promise((resolve, reject) => {
      this.client.sftp((err, sftp) => {
        if (err) {
          reject(err);
          return;
        }

        const readStream = sftp.createReadStream(remotePath);
        const writeStream = fse.createWriteStream(localPath);

        writeStream.on('close', () => {
          console.log(`文件下载成功:${remotePath} -> ${localPath}`);
          resolve(true);
        });

        writeStream.on('error', (err) => {
          console.log(`文件下载失败`);
          reject(err);
        });

        readStream.pipe(writeStream);
      });
    });
  }

  //   上传目录
  async uploadDirectory(localDir, remoteDir) {
    const files = await fse.readdir(localDir);
    for (const file of files) {
      const localPath = path.join(localDir, file);
      const remotePath = `${remoteDir}/${file}`;
      const stats = await fse.stat(localPath);

      if (stats.isDirectory()) {
        // 确保远程目录存在
        await this.executeCommand(`mkdir -p ${remotePath}`);
        // 递归上传子目录
        await this.uploadDirectory(localPath, remotePath);
      } else {
        // 上传文件
        await this.uploadFile(localPath, remotePath);
      }
    }
  }

  // 关闭连接
  disconnect() {
    this.client.end();
  }
}
