const fs = require('fs');
const css = require('obj-to-css');

const rootVar = ':root';

const getRootCss = (props) => {
    let rootCss = {
        [rootVar]: {
            [`--${props.prefixClass}size${props.suffixClass}`]: '16px 16px',
            [`--${props.prefixClass}overlay-size${props.suffixClass}`]: '8px 8px'
        }
    };

    if (props.base) {
        rootCss = {
            ...rootCss,
            [`${props.tagSelector}[class*=' ${props.prefixClass}'][class*=' ${props.suffixClass}'],
            ${props.tagSelector}[class^='${props.prefixClass}'][class$='${props.suffixClass}']`]: {
                display: 'block',
                width: '16px',
                height: '16px',
                'background-size': `var(--${props.prefixClass}size${props.suffixClass})`,
                'background-position': 'center center'
            },
        };
    }

    if (props.overlay) {
        return {
            ...rootCss,
            ...getOverlayCss(props)
        }
    }
    return rootCss;
}

const getOverlayCss = (props) => {
    return {
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
        'background-image': `var(${props.iconNameProp})`
    };
}

const cleanName = (name) => {
    return name.trim()
        .replace(/\s/, '-')
        .replace('_', '-');
}

/**
 *
 * Generates a css file from icons.
 *
 * Options:
 * {
 *   tagSelector: string,   // tag element of icon
 *   iconsPath: string,     // path of target icons
 *   ext: string,           // file extension of target icons
 *   outputPath: string,    // path of output directory
 *   outputName: string,    // name of generated css file
 *   prefixClass: string,   // prefix class of icon
 *   suffixClass: string,   // suffix class of icon
 *   iconAttrs: object,     // extra css attributes for css icon
 *   overlay: boolean,      // whether to support overlay icon in the css
 *   base: boolean,         // whether to add base styling in the css
 * }
 */
function generateCssIcon(options) {
    if (!options || !(options instanceof Object))
        throw new Error('Missing option object.');

    if (!options.outputName) {
        options.outputName = 'icons.css'
    }

    if (!options.tagSelector) {
        options.tagSelector = 'i';
    }

    const ext = options.ext = options.ext || '.svg';
    const outputName = options.outputName = (options.outputName.endsWith('.css') ? options.outputName : options.outputName + '.css');
    const outputPath = options.outputPath = options.outputPath || './dist';
    const prefixClass = options.prefixClass = options.prefixClass || 'my-';
    const suffixClass = options.suffixClass = options.suffixClass || '-icon';

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
        const iconFilePathName = './icons/' + iconFileName;
        const iconNameProp = `--${prefixClass}${iconName}${suffixClass}`;

        // Add icon path as custom prop
        outputCss[rootVar] = {...outputCss[rootVar], [iconNameProp]: `url(${iconFilePathName})`};

        console.log(`[INFO] Adding icon file '${outputIconPath}'.`);
        fs.copyFileSync(iconPath, outputIconPath);
        console.log(`[INFO] Icon file was successfully added.`);

        outputCss[`.${prefixClass}${cleanName(iconName)}${suffixClass}`] = {
            ...getIconCss({iconNameProp}),
            ...options.iconAttrs
        };
    }

    console.log(`[INFO] Writing css file at '${outputPath}/${outputName}'`);
    fs.writeFileSync(outputPath + '/' + outputName, css(outputCss));

    console.log(`[INFO] Successfully generated '${iconFileNames.length}' icons in css file!`);
}


module.exports = generateCssIcon;