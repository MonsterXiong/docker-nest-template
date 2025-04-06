import * as fs from 'fs';
import * as path from 'path';

/**
 * 文件操作结果接口
 */
export interface FileOperationResult {
  /** 操作是否成功 */
  success: boolean;
  /** 错误消息（如果有） */
  error?: string;
  /** 操作路径 */
  path: string;
}

/**
 * 文件项接口
 */
export interface FileItem {
  /** 文件路径 */
  filepath: string;
  /** 文件内容 */
  content: string;
}

/**
 * 确保目录存在
 * @param dir 目录路径
 * @returns 操作结果
 */
export function ensureDir(dir: string): FileOperationResult {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return { success: true, path: dir };
  } catch (error) {
    console.error(`创建目录失败: ${dir}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      path: dir,
    };
  }
}

/**
 * 删除目录
 * @param dir 目录路径
 * @returns 操作结果
 */
export function _deleteDir(dir: string): FileOperationResult {
  try {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    return { success: true, path: dir };
  } catch (error) {
    console.error(`删除目录失败: ${dir}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      path: dir,
    };
  }
}

/**
 * 删除文件
 * @param file 文件路径
 * @returns 操作结果
 */
export function _deleteFile(file: string): FileOperationResult {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    return { success: true, path: file };
  } catch (error) {
    console.error(`删除文件失败: ${file}`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      path: file,
    };
  }
}


// 根据path删除文件/文件夹
export function deleteFile(path: string): FileOperationResult {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      return _deleteDir(path);
    } else {
      return _deleteFile(path); // 删除文件
    }
  }
  return { success: true, path };
}

/**
 * 写入文件
 * @param filepath 文件路径
 * @param content 文件内容
 * @param options 写入选项
 * @returns Promise<FileOperationResult> 操作结果
 */
export function _writeFile(
  filepath: string,
  content: string,
  options: { encoding?: BufferEncoding; isSync?: boolean } = {},
): Promise<FileOperationResult> | FileOperationResult {
  const { encoding = 'utf8', isSync = false } = options;

  // 确保目录存在
  const dirResult = ensureDir(path.dirname(filepath));
  if (!dirResult.success) {
    return isSync ? dirResult : Promise.resolve(dirResult);
  }

  if (isSync) {
    try {
      fs.writeFileSync(filepath, content, { encoding });
      return { success: true, path: filepath };
    } catch (error) {
      console.error(`同步写入文件失败: ${filepath}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        path: filepath,
      };
    }
  } else {
    return new Promise<FileOperationResult>((resolve) => {
      fs.writeFile(filepath, content, { encoding }, (err) => {
        if (err) {
          console.error(`异步写入文件失败: ${filepath}`, err);
          resolve({
            success: false,
            error: err.message,
            path: filepath,
          });
        } else {
          resolve({ success: true, path: filepath });
        }
      });
    });
  }
}

/**
 * 写入文件
 * @param filepath 文件路径
 * @param content 文件内容
 * @returns Promise<FileOperationResult> 操作结果
 */
export function writeFile(
  filepath: string,
  content: string,
): Promise<FileOperationResult> | FileOperationResult {
  return _writeFile(filepath, content, { isSync: false });
}

/**
 * 写入文件
 * @param filepath 文件路径
 * @param content 文件内容
 * @returns Promise<FileOperationResult> 操作结果
 */
export function writeFileSync(
  filepath: string,
  content: string,
): Promise<FileOperationResult> | FileOperationResult {
  return _writeFile(filepath, content, { isSync: true });
}

export function _writeFileBatch(
  fileList: FileItem[],
  isSync: boolean = false,
): Promise<FileOperationResult[]> | FileOperationResult[] {
  if (fileList.length === 0) {
    return isSync ? [] : Promise.resolve([]);
  }

  if (isSync) {
    const results: FileOperationResult[] = [];
    for (const file of fileList) {
      results.push(
        writeFileSync(file.filepath, file.content) as FileOperationResult,
      );
    }
    return results;
  } else {
    const promises: Promise<FileOperationResult>[] = fileList.map(
      (file) =>
        writeFile(file.filepath, file.content) as Promise<FileOperationResult>,
    );
    return Promise.all(promises);
  }
}

/**
 * 批量写入文件
 * @param fileList 文件列表
 * @param options 写入选项
 * @returns Promise<FileOperationResult[]> 操作结果数组
 */
export function writeFileBatch(
  fileList: FileItem[],
): Promise<FileOperationResult[]> | FileOperationResult[] {
  return _writeFileBatch(fileList, false);
}

export function writeFileBatchSync(
  fileList: FileItem[],
): Promise<FileOperationResult[]> | FileOperationResult[] {
  return _writeFileBatch(fileList, true);
}

/**
 * 读取文件
 * @param filepath 文件路径
 * @param options 读取选项
 * @returns 文件内容或操作结果
 */
export function readFile(
  filepath: string,
  options: {
    encoding?: BufferEncoding;
    isSync?: boolean;
    returnContent?: boolean;
  } = {},
): string | Promise<string | FileOperationResult> | FileOperationResult {
  const { encoding = 'utf8', isSync = true, returnContent = true } = options;

  if (isSync) {
    try {
      const content = fs.readFileSync(filepath, { encoding });
      return returnContent ? content : { success: true, path: filepath };
    } catch (error) {
      console.error(`同步读取文件失败: ${filepath}`, error);
      const result: FileOperationResult = {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        path: filepath,
      };
      return returnContent ? '' : result;
    }
  } else {
    return new Promise<string | FileOperationResult>((resolve) => {
      fs.readFile(filepath, { encoding }, (err, data) => {
        if (err) {
          console.error(`异步读取文件失败: ${filepath}`, err);
          resolve(
            returnContent
              ? ''
              : {
                  success: false,
                  error: err.message,
                  path: filepath,
                },
          );
        } else {
          resolve(returnContent ? data : { success: true, path: filepath });
        }
      });
    });
  }
}

/**
 * 检查文件是否存在
 * @param filepath 文件路径
 * @returns 文件是否存在
 */
export function fileExists(filepath: string): boolean {
  try {
    return fs.existsSync(filepath);
  } catch (error) {
    console.error(`检查文件存在失败: ${filepath}`, error);
    return false;
  }
}

/**
 * 复制文件
 * @param source 源文件路径
 * @param target 目标文件路径
 * @param options 复制选项
 * @returns 操作结果
 */
export function copyFile(
  source: string,
  target: string,
  options: { overwrite?: boolean; isSync?: boolean } = {},
): Promise<FileOperationResult> | FileOperationResult {
  const { overwrite = true, isSync = false } = options;

  // 检查源文件是否存在
  if (!fileExists(source)) {
    const result: FileOperationResult = {
      success: false,
      error: `源文件不存在: ${source}`,
      path: source,
    };
    return isSync ? result : Promise.resolve(result);
  }

  // 确保目标目录存在
  const dirResult = ensureDir(path.dirname(target));
  if (!dirResult.success) {
    return isSync ? dirResult : Promise.resolve(dirResult);
  }

  // 检查目标文件是否存在且不覆盖
  if (fileExists(target) && !overwrite) {
    const result: FileOperationResult = {
      success: false,
      error: `目标文件已存在且不覆盖: ${target}`,
      path: target,
    };
    return isSync ? result : Promise.resolve(result);
  }

  if (isSync) {
    try {
      fs.copyFileSync(source, target);
      return { success: true, path: target };
    } catch (error) {
      console.error(`同步复制文件失败: ${source} -> ${target}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        path: target,
      };
    }
  } else {
    return new Promise<FileOperationResult>((resolve) => {
      fs.copyFile(source, target, (err) => {
        if (err) {
          console.error(`异步复制文件失败: ${source} -> ${target}`, err);
          resolve({
            success: false,
            error: err.message,
            path: target,
          });
        } else {
          resolve({ success: true, path: target });
        }
      });
    });
  }
}
