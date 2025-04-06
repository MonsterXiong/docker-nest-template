import * as path from 'path';
import * as fs from 'fs';
import archiver from 'archiver';
import compressing from 'compressing';
import { ensureDir } from './fileUtils';

/**
 * 压缩选项接口
 */
export interface CompressOptions {
  /** 压缩级别 (1-9) */
  level?: number;
  /** 是否保留原始目录结构 */
  preserveDirectory?: boolean;
}

/**
 * 解压选项接口
 */
export interface DecompressOptions {
  /** 是否覆盖已存在的文件 */
  overwrite?: boolean;
}

/**
 * 文件压缩器接口
 */
export interface Compressor {
  /**
   * 压缩文件/目录
   * @param source 源文件或目录路径
   * @param target 目标压缩文件路径
   * @param options 压缩选项
   * @returns Promise<boolean> 压缩是否成功
   */
  compress(
    source: string,
    target: string,
    options?: CompressOptions,
  ): Promise<boolean>;

  /**
   * 解压文件
   * @param source 源压缩文件路径
   * @param target 目标解压目录路径
   * @returns Promise<boolean> 解压是否成功
   */
  decompress(
    source: string,
    target: string,
    options?: DecompressOptions,
  ): Promise<boolean>;
}

/**
 * Zip压缩器实现
 */
class ZipCompressor implements Compressor {
  /**
   * 使用archiver压缩文件/目录
   * @param source 源文件或目录路径
   * @param target 目标压缩文件路径
   * @param options 压缩选项
   * @returns Promise<boolean> 压缩是否成功
   */
  async compress(
    source: string,
    target: string,
    options: CompressOptions = {},
  ): Promise<boolean> {
    const { level = 9, preserveDirectory = false } = options;

    try {
      // 确保目标路径存在
      ensureDir(path.dirname(target));

      return await new Promise<boolean>((resolve, reject) => {
        // 创建 archiver 实例
        const archive = archiver('zip', {
          zlib: { level },
        });

        const output = fs.createWriteStream(target);

        // 监听完成事件
        output.on('close', () => resolve(true));

        // 监听错误事件
        archive.on('error', (error) => reject(error));
        output.on('error', (error) => reject(error));

        // 将输出流管道连接到 archiver
        archive.pipe(output);

        // 将源文件夹添加到压缩包
        archive.directory(source, preserveDirectory);

        // 完成压缩
        archive.finalize();
      });
    } catch (error) {
      console.error('Compression failed:', error);
      throw error;
    }
  }

  /**
   * 使用compressing解压文件
   * @param source 源压缩文件路径
   * @param target 目标解压目录路径
   * @returns Promise<boolean> 解压是否成功
   */
  async decompress(
    source: string,
    target: string,
    options?: DecompressOptions,
  ): Promise<boolean> {
    const { overwrite = false } = options || {};

    try {
      // 确保目标路径存在
      ensureDir(target);

      await compressing.zip.uncompress(source, target, {
        overwrite,
      });
      return true;
    } catch (error) {
      console.error('Decompression failed:', error);
      throw error;
    }
  }
}

/**
 * 压缩工厂类
 */
export class CompressorFactory {
  /**
   * 获取压缩器实例
   * @param type 压缩类型
   * @returns Compressor 压缩器实例
   */
  static getCompressor(): Compressor {
    return new ZipCompressor();
  }
}

/**
 * 压缩文件/目录
 * @param source 源文件或目录路径
 * @param target 目标压缩文件路径
 * @param options 压缩选项
 * @returns Promise<boolean> 压缩是否成功
 */
export async function compress(
  source: string,
  target: string,
  options: CompressOptions = {},
): Promise<boolean> {
  const compressor = CompressorFactory.getCompressor();
  return compressor.compress(source, target, options);
}

/**
 * 解压文件
 * @param source 源压缩文件路径
 * @param target 目标解压目录路径
 * @returns Promise<boolean> 解压是否成功
 */
export async function decompress(
  source: string,
  target: string,
  options: DecompressOptions = {},
): Promise<boolean> {
  const compressor = CompressorFactory.getCompressor();
  return compressor.decompress(source, target, options);
}
