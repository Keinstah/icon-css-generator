#!/usr/bin/env node

const iconCssGenerator = require('../icon-css-generator');
const yargs = require('yargs');

const options = yargs.options({
    'target': {
        alias: 't',
        describe: 'Target path directory of images',
        type: 'string',
        demandOption: true
    },
    'output': {
        alias: 'o',
        describe: 'Output directory of generate css file and icons',
        type: 'string'
    },
    'tag': {
        alias: 'ti',
        describe: 'Tag element of icon',
        type: 'string'
    },
    'prefix': {
        alias: 'p',
        describe: 'Prefix of icon class',
        type: 'string'
    },
    'icondir': {
        alias: 'd',
        describe: 'Directory name for generated icons',
        type: 'string'
    },
    'ext': {
        alias: 'e',
        describe: 'File extension of the target icons',
        type: 'string'
    }
})
    .help()
    .argv;

iconCssGenerator({
    tagSelector: options.tag,
    iconsPath: options.target,
    outputPath: options.output,
    outputName: options.icondir,
    prefixClass: options.prefix,
    ext: options.ext,
    iconAttrs: {}
});