import { join } from 'path';

const pathToFile = join(__filename, "..", "..", "..", "jwtKey.txt");

console.log(pathToFile);
export default pathToFile;