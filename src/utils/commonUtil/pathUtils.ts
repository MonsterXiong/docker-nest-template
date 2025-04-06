// 统一window、linux的路径分隔符
export function normalizePath(path: string) {
  if (process.platform === 'win32') {
    return path.replace(/\\/g, '/');
  }
  return path;
}

// 拼接路径
export function joinPath(path: string, ...paths: string[]) {
  return normalizePath(path + '/' + paths.join('/'));
}

// 获取文件名
export function getFileName(path: string) {
  return path.split('/').pop();
}

// 获取文件扩展名
export function getFileExtension(path: string) {
  return path.split('.').pop();
}

// 获取没有扩展的文件名
export function getFileNameWithoutExtension(path: string) {
  const extension = getFileExtension(path);
  const fileName = getFileName(path);
  if (extension) {
    return fileName.replace(`.${extension}`, '');
  }
  return fileName;
}

//  移除固定前缀
export function removePrefix(path: string, prefix: string) {
  return path.replace(normalizePath(prefix), '');
}
