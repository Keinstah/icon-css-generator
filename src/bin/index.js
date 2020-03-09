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
    'name': {
        alias: 'n',
        describe: 'Name of generated css',
        type: 'string'
    },
    'prefix': {
        alias: 'p',
        describe: 'Prefix of icon class',
        type: 'string'
    },
    'suffix': {
        alias: 's',
        describe: 'Suffix of icon class',
        type: 'string'
    },
    'tag': {
        alias: 'g',
        describe: 'Tag element of icon',
        type: 'string'
    },
    'ext': {
        alias: 'e',
        describe: 'File extension of the target icons',
        type: 'array'
    },
    'overlay': {
        alias: 'v',
        describe: 'Whether to add support for overlay icon in css',
        type: 'boolean'
    },
    'base': {
        alias: 'b',
        describe: 'Whether to add the base styling in css',
        type: 'boolean'
    },
    'copy': {
        alias: 'c',
        describe: 'Make a copy of icons when generating the css file. This option will only work if the output path and target path is not the same.',
        type: 'boolean'
    }
})
    .help()
    .argv;

iconCssGenerator({
    tagSelector: options.tag,
    iconsPath: options.target,
    outputPath: options.output,
    outputName: options.name,
    prefixClass: options.prefix,
    suffixClass: options.suffix,
    ext: options.ext,
    iconAttrs: {},
    overlay: options.overflow,
    base: options.base,
    copyIcons: options.copy,
});