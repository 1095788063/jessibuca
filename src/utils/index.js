import {MP4_CODECS, FILE_SUFFIX} from "../constant";

export function noop() {
}


export function supportOffscreen($canvas) {
    return typeof $canvas.transferControlToOffscreen === 'function';
}


export function supportOffscreenV2() {
    return typeof OffscreenCanvas !== "undefined";
}


export function createContextGL($canvas) {
    let gl = null;

    const validContextNames = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
    let nameIndex = 0;

    while (!gl && nameIndex < validContextNames.length) {
        const contextName = validContextNames[nameIndex];

        try {
            let contextOptions = {preserveDrawingBuffer: true};
            gl = $canvas.getContext(contextName, contextOptions);
        } catch (e) {
            gl = null;
        }

        if (!gl || typeof gl.getParameter !== "function") {
            gl = null;
        }

        ++nameIndex;
    }


    return gl;
}


export function audioContextUnlock(context) {
    context.resume();
    const source = context.createBufferSource();
    source.buffer = context.createBuffer(1, 1, 22050);
    source.connect(context.destination);
    if (source.noteOn) {
        source.noteOn(0);
    } else {
        source.start(0);
    }
}

export function dataURLToFile(dataURL = '') {
    const arr = dataURL.split(",");
    const bstr = atob(arr[1]);
    const type = arr[0].replace("data:", "").replace(";base64", "")
    let n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'file', {type});
}

export function downloadFile(file, fileName) {
    if (file instanceof Blob || file instanceof File) {
        file = new Blob([file]);
    }
    const aLink = document.createElement("a");
    aLink.download = fileName;
    aLink.href = file;
    aLink.click();
}


export function downloadImg(content, fileName) {
    const aLink = document.createElement("a");
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(content);
    aLink.click();
    setTimeout(() => {
        URL.revokeObjectURL(content);
    }, isIOS() ? 1000 : 0)
}

export function checkFull() {
    let isFull = document.fullscreenElement || window.webkitFullscreenElement || document.msFullscreenElement;
    if (isFull === undefined) isFull = false;
    return !!isFull;
}

export function now() {
    return new Date().getTime();
}

export const supportedWasm = (() => {
    try {
        if (typeof WebAssembly === "object"
            && typeof WebAssembly.instantiate === "function") {
            const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
            if (module instanceof WebAssembly.Module)
                return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
        }
    } catch (e) {
    }
    return false;
})();

export function clamp(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}

export function setStyle(element, key, value) {
    if (!element) {
        return
    }
    if (typeof key === 'object') {
        Object.keys(key).forEach(item => {
            setStyle(element, item, key[item]);
        });
    }
    element.style[key] = value;
    return element;
}


export function getStyle(element, key, numberType = true) {
    if (!element) {
        return 0
    }

    const value = getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? parseFloat(value) : value;
}

export function getNowTime() {
    if (performance && typeof performance.now === 'function') {
        return performance.now();
    }
    return Date.now();
}

export function calculationRate(callback) {
    let totalSize = 0;
    let lastTime = getNowTime();
    return size => {
        totalSize += size;
        const thisTime = getNowTime();
        const diffTime = thisTime - lastTime;
        if (diffTime >= 1000) {
            callback((totalSize / diffTime) * 1000);
            lastTime = thisTime;
            totalSize = 0;
        }
    };
}

export function downloadRecord(blob, name, suffix) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (name || now()) + '.' + (suffix || FILE_SUFFIX.webm);
    a.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, isIOS() ? 1000 : 0)
}

export const env = '__ENV__';

export function isMobile() {
    return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
}

export function isAndroid() {
    const UA = window.navigator.userAgent.toLowerCase();
    return (/android/i.test(UA));
}

export function isIOS() {
    const UA = window.navigator.userAgent.toLowerCase();
    return UA && /iphone|ipad|ipod|ios/.test(UA);
}


export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    var date;
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;
        time = +time; // 转成int 型
        date = new Date(time)
    }
    var formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        var value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    });
    return time_str
}

// 是否支持 webcodecs
export function supportWCS() {
    return "VideoEncoder" in window;
}

export function toNumber(value) {
    if (typeof value !== 'string') {
        return value;
    } else {
        // 转换成 number 类型
        var parsed = Number(value);
        return isNaN(parsed) ? value : parsed;
    }
}

export function uuid16() {
    return 'xxxxxxxxxxxx4xxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

export function throttle(callback, delay) {
    let isThrottled = false;
    let args;
    let context;

    function fn(...args2) {
        if (isThrottled) {
            args = args2;
            context = this;
            return;
        }

        isThrottled = true;
        callback.apply(this, args2);
        setTimeout(() => {
            isThrottled = false;
            if (args) {
                fn.apply(context, args);
                args = null;
                context = null;
            }
        }, delay);
    }

    return fn;
}


export function isDef(v) {
    return v !== undefined && v !== null;
}

export function formatVideoDecoderConfigure(avcC) {
    let codecArray = avcC.subarray(1, 4);
    let codecString = "avc1.";
    for (let j = 0; j < 3; j++) {
        let h = codecArray[j].toString(16);
        if (h.length < 2) {
            h = "0" + h
        }
        codecString += h
    }

    return {
        codec: codecString,
        description: avcC
    }
}

export function isFullScreen() {
    return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
}

export function bpsSize(value) {
    if (null == value || value === '') {
        return "0 KB/S";
    }
    let size = parseFloat(value);
    size = size.toFixed(2);
    return size + 'KB/S';
}


export function fpsStatus(fps) {
    let result = 0;
    if (fps >= 24) {
        result = 2;
    } else if (fps >= 15) {
        result = 1;
    }

    return result;
}

export function createEmptyImageBitmap(width, height) {
    const $canvasElement = document.createElement("canvas");
    $canvasElement.width = width;
    $canvasElement.height = height;
    return createImageBitmap($canvasElement, 0, 0, width, height);
}


export function supportMSE() {
    return window.MediaSource && window.MediaSource.isTypeSupported(MP4_CODECS.avc);
}


export function formatMp4VideoCodec(codec) {
    return `video/mp4; codecs="${codec}"`
}


export function saveBlobToFile(fileName, blob) {
    let url = window.URL.createObjectURL(blob);
    let aLink = window.document.createElement('a');
    aLink.download = fileName;
    aLink.href = url;
    //创建内置事件并触发
    let evt = window.document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    aLink.dispatchEvent(evt);
}

export function isEmpty(value) {
    return value === null || value === undefined
}

export function isBoolean(value) {
    return value === true || value === false;
}

export function isNotEmpty(value) {
    return !isEmpty(value)
}

export function initPlayTimes() {
    return {
        playInitStart: '', //1
        playStart: '', // 2
        streamStart: '', //3
        streamResponse: '', // 4
        demuxStart: '', // 5
        decodeStart: '', // 6
        videoStart: '', // 7
        playTimestamp: '',// playStart- playInitStart
        streamTimestamp: '',// streamStart - playStart
        streamResponseTimestamp: '',// streamResponse - streamStart
        demuxTimestamp: '', // demuxStart - streamResponse
        decodeTimestamp: '', // decodeStart - demuxStart
        videoTimestamp: '',// videoStart - decodeStart
        allTimestamp: '' // videoStart - playInitStart
    }
}

// create watermark
export function createWatermark(options) {
    let defaultConfig = {
        container: '',
        left: '',
        right: '',
        top: '',
        bottom: '',
        image: {
            src: '',
            width: '100',
            height: '60',
        },
        text: {
            content: '',
            fontSize: '14',
            color: '#000'
        },
    }
    defaultConfig = Object.assign(defaultConfig, options)

    const $container = defaultConfig.container;

    if ($container) {
        return
    }

    let shadowRoot = null;
    const otDiv = document.createElement('div');
    otDiv.setAttribute('style', 'pointer-events: none !important; display: block !important');

    if (typeof otDiv.attachShadow === "function") {
        shadowRoot = otDiv.attachShadow({mode: 'open'});
    } else if (otDiv.shadowRoot) {
        shadowRoot = otDiv.shadowRoot;
    } else {
        shadowRoot = otDiv;
    }

    const nodeList = $container.children;
    const index = Math.floor(Math.random() * (nodeList.length - 1));

    if (nodeList[index]) {
        $container.insertBefore(otDiv, nodeList[index]);
    } else {
        $container.appendChild(otDiv);
    }


    const maskDiv = document.createElement('div');
    let innerDom = null;
    if (defaultConfig.text && defaultConfig.text.content) {
        innerDom = document.createTextNode(defaultConfig.text);
    } else if (defaultConfig.image && defaultConfig.image.src) {
        innerDom = document.createElement('img')
        innerDom.style.height = '100%'
        innerDom.style.width = '100%'
        innerDom.src = defaultConfig.image.src;
    }

    if (!innerDom) {
        return;
    }

    maskDiv.appendChild(innerDom);

    maskDiv.style.visibility = '';
    maskDiv.style.position = "absolute";
    maskDiv.style.display = 'block'
    maskDiv.style['-ms-user-select'] = "none";
    maskDiv.style.left = defaultConfig.left;
    maskDiv.style.right = defaultConfig.right;
    maskDiv.style.top = defaultConfig.top;
    maskDiv.style.bottom = defaultConfig.bottom;
    maskDiv.style.overflow = 'hidden';
    maskDiv.style.zIndex = "9999999";
    if (defaultConfig.text && defaultConfig.text.content) {
        maskDiv.style.fontSize = defaultConfig.text.fontSize;
        maskDiv.style.color = defaultConfig.text.color;
    } else if (defaultConfig.image && defaultConfig.image.src) {
        maskDiv.style.width = defaultConfig.image.width + 'px';
        maskDiv.style.height = defaultConfig.image.height + 'px';
    }

    shadowRoot.appendChild(maskDiv)

    // remove function
    return () => {
        $container.removeChild(otDiv);
    }
}

export function formatTimeTips(time) {
    var result;

    //
    if (time > -1) {
        var hour = Math.floor(time / 3600);
        var min = Math.floor(time / 60) % 60;
        var sec = time % 60;

        sec = Math.round(sec);

        if (hour < 10) {
            result = '0' + hour + ":";
        } else {
            result = hour + ":";
        }

        if (min < 10) {
            result += "0";
        }
        result += min + ":";
        if (sec < 10) {
            result += "0";
        }
        result += sec.toFixed(0);
    }

    return result;
}
