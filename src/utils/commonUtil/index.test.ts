import { VMRunner } from '../vmRunner/VMRunner';
import { ExcelUtil, PathUtil, CompressUtil } from './index';

ExcelUtil.readExcel('test.xlsx');
ExcelUtil.writeExcel('test.xlsx', {
  name: 'test',
  age: 18,
});

const currentPath = PathUtil.normalizePath(process.cwd());
const testPath = PathUtil.joinPath(currentPath, 'test.xlsx');
console.log(PathUtil.getFileName(testPath));
console.log(PathUtil.getFileExtension(testPath));
console.log(PathUtil.getFileNameWithoutExtension(testPath));
console.log(PathUtil.removePrefix(testPath, 'C:/Users/刘雄成/Desktop/'));

// const compress = CompressUtil.CompressorFactory.getCompressor();

// for (let i = 0; i < 10; i++) {
//   const source = PathUtil.joinPath(currentPath, `src`);
//   const target = PathUtil.joinPath(currentPath, `test-${i}.zip`);
//   compress.compress(source, target);
// }

const vm = VMRunner.getInstance({
  additionalUtils: {
    x: {
      sum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),
    },
  },
});

console.log(vm.run('return utils.x.sum([1, 2, 3, 4, 5])'));
// console.log(compress.decompress(target, source));
