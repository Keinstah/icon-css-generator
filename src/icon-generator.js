const fs = require('fs');
const css = require('@mojule/object-to-css-string');

const getRootCss = (props) => {
    return {
        ':root': {
            ['--primary']: '#5c7079'
        },
        [`${props.tagSelector}[class*=' ${props.prefixClass}'],${props.tagSelector}[class^='${props.prefixClass}']`]: {
            display: 'block',
            width: '16px',
            height: '16px'
        },
        [`${props.tagSelector}.overlay-icon`]: {
            width: '8px!important',
            height: '8px!important',
            position: 'absolute',
            'background-size': '8px 8px!important'
        },
        [`${props.tagSelector}.tl.overlay-icon`]: {
            'margin': '0'
        },
        [`${props.tagSelector}.tr.overlay-icon`]: {
            'margin-left': '8px'
        },
        [`${props.tagSelector}.bl.overlay-icon`]: {
            'margin-top': '8px'
        },
        [`${props.tagSelector}.br.overlay-icon`]: {
            'margin-left': '8px',
            'margin-top': '8px'
        }
    };
}

const getIconCss = (props) => {
    return {
        background: `url('${props.path}') no-repeat`,
        'background-size': '16px 16px',
    };
}

const cleanName = (name) => {
    return name.trim().replace(/\s/, '-').replace('_', '-');
}

/**
 * Options:
 * {
 *   tagSelector: 'i', // Tag element of icon
 *   iconsPath: './resources/svg', // Path of the icons
 *   outputPath: './dist', // Output path directory
 *   outputName: 'icons', // Name of the icons directory
 *   prefixClass: 'icon-', // Prefix of class icon
 *   iconAttrs: {} // Extra css attributes for icon
 * }
 * @param options
 */
function generateIconCss(options) {
    if (!options || !(options instanceof Object))
        throw new Error('Missing option object.');

    const ext = options.ext || '.svg';
    const outputName = options.outputName.endsWith('.css') ? options.outputName : options.outputName + '.css';
    const outputPath = options.outputPath || './dist';

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
        console.log(`[INFO] Created output directory '${outputPath}'.`);
    }

    if (!fs.existsSync(outputPath + '/icons')) {
        fs.mkdirSync(outputPath + '/icons');
        console.log(`[INFO] Created icons directory '${outputPath}'.`);
    }

    const outputCss = getRootCss(options);
    console.log(`[INFO] Reading icons at '${options.iconsPath}'.`);
    const iconFileNames = fs.readdirSync(options.iconsPath)
        .filter((fileName) => fileName.endsWith(ext));

    for (const iconFileName of iconFileNames) {
        const iconPath = `${options.iconsPath}/${iconFileName}`;
        const iconName = iconFileName.substr(0, iconFileName.length - ext.length);
        const outputIconPath = `${outputPath}/icons/${iconFileName}`;

        console.log(`[INFO] Adding icon file '${outputIconPath}'.`);
        fs.copyFileSync(iconPath, outputIconPath);
        console.log(`[INFO] Icon file was successfully added.`);

        outputCss[`.${options.prefixClass}${cleanName(iconName)}`] = {
            ...getIconCss({path: './icons/' + iconFileName}),
            ...options.iconAttrs
        };
    }

    console.log(`[INFO] Writing css file at '${outputPath}/${outputName}'`)
    fs.writeFileSync(outputPath + '/' + outputName, css(outputCss));

    console.log(`[INFO] Successfully generated '${iconFileNames.length}' icons in css file!`);
}


module.exports = generateIconCss;

//
// generateIconCss({
//     tagSelector: 'i',
//     iconsPath: './resources/svg',
//     outputPath: './dist',
//     outputName: 'icons',
//     prefixClass: 'icon-',
//     iconAttrs: {}
// })