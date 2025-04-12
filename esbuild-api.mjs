import esbuild from 'esbuild'
import zl from 'zip-lib'

const folderName = 'api'
const outFile = `./dist/${folderName}`

await esbuild.build({
    entryPoints: ['./src/apps/backend/startLambda.ts'],
    bundle: true,
    minify: true,
    outfile: `${outFile}/index.js`,
    platform: 'node',
    format: 'cjs',
    target: 'es2022',
    tsconfig: './tsconfig.build.json',
});

await zl.archiveFile(`${outFile}/index.js`, `${outFile}/${folderName}.zip`)
