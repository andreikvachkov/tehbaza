!function() {
    "use strict";
    // import debounce from "lodash.debounce";
        const input = document.querySelector(".header__search");
    /**
     * SSR Window 4.0.2
     * Better handling for window object in SSR environment
     * https://github.com/nolimits4web/ssr-window
     *
     * Copyright 2021, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: December 13, 2021
     */
    /* eslint-disable no-param-reassign */
    function isObject$1(obj) {
        return null !== obj && "object" == typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend$1(target, src) {
        void 0 === target && (target = {}), void 0 === src && (src = {}), Object.keys(src).forEach((key => {
            void 0 === target[key] ? target[key] = src[key] : isObject$1(src[key]) && isObject$1(target[key]) && Object.keys(src[key]).length > 0 && extend$1(target[key], src[key]);
        }));
    }
    document.querySelector(".header__form-close").addEventListener("click", (() => {
        input.focus();
    }));
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        createEvent: () => ({
            initEvent() {}
        }),
        createElement: () => ({
            children: [],
            childNodes: [],
            style: {},
            setAttribute() {},
            getElementsByTagName: () => []
        }),
        createElementNS: () => ({}),
        importNode: () => null,
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function getDocument() {
        const doc = "undefined" != typeof document ? document : {};
        return extend$1(doc, ssrDocument), doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle: () => ({
            getPropertyValue: () => ""
        }),
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia: () => ({}),
        requestAnimationFrame: callback => "undefined" == typeof setTimeout ? (callback(), 
        null) : setTimeout(callback, 0),
        cancelAnimationFrame(id) {
            "undefined" != typeof setTimeout && clearTimeout(id);
        }
    };
    function getWindow() {
        const win = "undefined" != typeof window ? window : {};
        return extend$1(win, ssrWindow), win;
    }
    function nextTick(callback, delay) {
        return void 0 === delay && (delay = 0), setTimeout(callback, delay);
    }
    function now() {
        return Date.now();
    }
    function getTranslate(el, axis) {
        void 0 === axis && (axis = "x");
        const window = getWindow();
        let matrix, curTransform, transformMatrix;
        const curStyle = function(el) {
            const window = getWindow();
            let style;
            return window.getComputedStyle && (style = window.getComputedStyle(el, null)), !style && el.currentStyle && (style = el.currentStyle), 
            style || (style = el.style), style;
        }(el);
        return window.WebKitCSSMatrix ? (curTransform = curStyle.transform || curStyle.webkitTransform, 
        curTransform.split(",").length > 6 && (curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ")), 
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform)) : (transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), 
        matrix = transformMatrix.toString().split(",")), "x" === axis && (
        // Latest Chrome and webkits Fix
        curTransform = window.WebKitCSSMatrix ? transformMatrix.m41 : 16 === matrix.length ? parseFloat(matrix[12]) : parseFloat(matrix[4])), 
        "y" === axis && (
        // Latest Chrome and webkits Fix
        curTransform = window.WebKitCSSMatrix ? transformMatrix.m42 : 16 === matrix.length ? parseFloat(matrix[13]) : parseFloat(matrix[5])), 
        curTransform || 0;
    }
    function isObject(o) {
        return "object" == typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function extend() {
        const to = Object(arguments.length <= 0 ? void 0 : arguments[0]), noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < arguments.length; i += 1) {
            const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
            if (null != nextSource && (node = nextSource, !(
            // eslint-disable-next-line
            "undefined" != typeof window && void 0 !== window.HTMLElement ? node instanceof HTMLElement : node && (1 === node.nodeType || 11 === node.nodeType)))) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex], desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    void 0 !== desc && desc.enumerable && (isObject(to[nextKey]) && isObject(nextSource[nextKey]) ? nextSource[nextKey].__swiper__ ? to[nextKey] = nextSource[nextKey] : extend(to[nextKey], nextSource[nextKey]) : !isObject(to[nextKey]) && isObject(nextSource[nextKey]) ? (to[nextKey] = {}, 
                    nextSource[nextKey].__swiper__ ? to[nextKey] = nextSource[nextKey] : extend(to[nextKey], nextSource[nextKey])) : to[nextKey] = nextSource[nextKey]);
                }
            }
        }
        var node;
        return to;
    }
    function setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll(_ref) {
        let {swiper: swiper, targetPosition: targetPosition, side: side} = _ref;
        const window = getWindow(), startPosition = -swiper.translate;
        let time, startTime = null;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none", window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev", isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target, animate = () => {
            time = (new Date).getTime(), null === startTime && (startTime = time);
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0), easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition) && (currentPosition = targetPosition), 
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            }), isOutOfBound(currentPosition, targetPosition)) return swiper.wrapperEl.style.overflow = "hidden", 
            swiper.wrapperEl.style.scrollSnapType = "", setTimeout((() => {
                swiper.wrapperEl.style.overflow = "", swiper.wrapperEl.scrollTo({
                    [side]: currentPosition
                });
            })), void window.cancelAnimationFrame(swiper.cssModeFrameID);
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    function getSlideTransformEl(slideEl) {
        return slideEl.querySelector(".swiper-slide-transform") || slideEl.shadowRoot && slideEl.shadowRoot.querySelector(".swiper-slide-transform") || slideEl;
    }
    function elementChildren(element, selector) {
        return void 0 === selector && (selector = ""), [ ...element.children ].filter((el => el.matches(selector)));
    }
    function showWarning(text) {
        try {
            return void console.warn(text);
        } catch (err) {
            // err
        }
    }
    function createElement(tag, classes) {
        void 0 === classes && (classes = []);
        const el = document.createElement(tag);
        return el.classList.add(...Array.isArray(classes) ? classes : function(classes) {
            return void 0 === classes && (classes = ""), classes.trim().split(" ").filter((c => !!c.trim()));
        }(classes)), el;
    }
    function elementStyle(el, prop) {
        return getWindow().getComputedStyle(el, null).getPropertyValue(prop);
    }
    function elementIndex(el) {
        let i, child = el;
        if (child) {
            // eslint-disable-next-line
            for (i = 0; null !== (child = child.previousSibling); ) 1 === child.nodeType && (i += 1);
            return i;
        }
    }
    function elementParents(el, selector) {
        const parents = [];
 // eslint-disable-line
                let parent = el.parentElement;
 // eslint-disable-line
                for (;parent; ) selector ? parent.matches(selector) && parents.push(parent) : parents.push(parent), 
        parent = parent.parentElement;
        return parents;
    }
    function elementOuterSize(el, size, includeMargins) {
        const window = getWindow();
        return includeMargins ? el["width" === size ? "offsetWidth" : "offsetHeight"] + parseFloat(window.getComputedStyle(el, null).getPropertyValue("width" === size ? "margin-right" : "margin-top")) + parseFloat(window.getComputedStyle(el, null).getPropertyValue("width" === size ? "margin-left" : "margin-bottom")) : el.offsetWidth;
    }
    let support, deviceCached, browser;
    function getSupport() {
        return support || (support = function() {
            const window = getWindow(), document = getDocument();
            return {
                smoothScroll: document.documentElement && document.documentElement.style && "scrollBehavior" in document.documentElement.style,
                touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch)
            };
        }()), support;
    }
    function getDevice(overrides) {
        return void 0 === overrides && (overrides = {}), deviceCached || (deviceCached = function(_temp) {
            let {userAgent: userAgent} = void 0 === _temp ? {} : _temp;
            const support = getSupport(), window = getWindow(), platform = window.navigator.platform, ua = userAgent || window.navigator.userAgent, device = {
                ios: !1,
                android: !1
            }, screenWidth = window.screen.width, screenHeight = window.screen.height, android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            // eslint-disable-line
            let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/), windows = "Win32" === platform;
            let macos = "MacIntel" === platform;
            // iPadOs 13 fix
                        // Export object
            return !ipad && macos && support.touch && [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ].indexOf(`${screenWidth}x${screenHeight}`) >= 0 && (ipad = ua.match(/(Version)\/([\d.]+)/), 
            ipad || (ipad = [ 0, 1, "13_0_0" ]), macos = !1), 
            // Android
            android && !windows && (device.os = "android", device.android = !0), (ipad || iphone || ipod) && (device.os = "ios", 
            device.ios = !0), device;
        }(overrides)), deviceCached;
    }
    function getBrowser() {
        return browser || (browser = function() {
            const window = getWindow();
            let needPerspectiveFix = !1;
            function isSafari() {
                const ua = window.navigator.userAgent.toLowerCase();
                return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
            }
            if (isSafari()) {
                const ua = String(window.navigator.userAgent);
                if (ua.includes("Version/")) {
                    const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num => Number(num)));
                    needPerspectiveFix = major < 16 || 16 === major && minor < 2;
                }
            }
            return {
                isSafari: needPerspectiveFix || isSafari(),
                needPerspectiveFix: needPerspectiveFix,
                isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
            };
        }()), browser;
    }
    /* eslint-disable no-underscore-dangle */
    var eventsEmitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" != typeof handler) return self;
            const method = priority ? "unshift" : "push";
            return events.split(" ").forEach((event => {
                self.eventsListeners[event] || (self.eventsListeners[event] = []), self.eventsListeners[event][method](handler);
            })), self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" != typeof handler) return self;
            function onceHandler() {
                self.off(events, onceHandler), onceHandler.__emitterProxy && delete onceHandler.__emitterProxy;
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                handler.apply(self, args);
            }
            return onceHandler.__emitterProxy = handler, self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" != typeof handler) return self;
            const method = priority ? "unshift" : "push";
            return self.eventsAnyListeners.indexOf(handler) < 0 && self.eventsAnyListeners[method](handler), 
            self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            return index >= 0 && self.eventsAnyListeners.splice(index, 1), self;
        },
        off(events, handler) {
            const self = this;
            return !self.eventsListeners || self.destroyed ? self : self.eventsListeners ? (events.split(" ").forEach((event => {
                void 0 === handler ? self.eventsListeners[event] = [] : self.eventsListeners[event] && self.eventsListeners[event].forEach(((eventHandler, index) => {
                    (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) && self.eventsListeners[event].splice(index, 1);
                }));
            })), self) : self;
        },
        emit() {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events, data, context;
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
            "string" == typeof args[0] || Array.isArray(args[0]) ? (events = args[0], data = args.slice(1, args.length), 
            context = self) : (events = args[0].events, data = args[0].data, context = args[0].context || self), 
            data.unshift(context);
            return (Array.isArray(events) ? events : events.split(" ")).forEach((event => {
                self.eventsAnyListeners && self.eventsAnyListeners.length && self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                })), self.eventsListeners && self.eventsListeners[event] && self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            })), self;
        }
    };
    const processLazyPreloader = (swiper, imageEl) => {
        if (!swiper || swiper.destroyed || !swiper.params) return;
        const slideEl = imageEl.closest(swiper.isElement ? "swiper-slide" : `.${swiper.params.slideClass}`);
        if (slideEl) {
            let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
            !lazyEl && swiper.isElement && (slideEl.shadowRoot ? lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`) : 
            // init later
            requestAnimationFrame((() => {
                slideEl.shadowRoot && (lazyEl = slideEl.shadowRoot.querySelector(`.${swiper.params.lazyPreloaderClass}`), 
                lazyEl && lazyEl.remove());
            }))), lazyEl && lazyEl.remove();
        }
    }, unlazy = (swiper, index) => {
        if (!swiper.slides[index]) return;
        const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
        imageEl && imageEl.removeAttribute("loading");
    }, preload = swiper => {
        if (!swiper || swiper.destroyed || !swiper.params) return;
        let amount = swiper.params.lazyPreloadPrevNext;
        const len = swiper.slides.length;
        if (!len || !amount || amount < 0) return;
        amount = Math.min(amount, len);
        const slidesPerView = "auto" === swiper.params.slidesPerView ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView), activeIndex = swiper.activeIndex;
        if (swiper.params.grid && swiper.params.grid.rows > 1) {
            const activeColumn = activeIndex, preloadColumns = [ activeColumn - amount ];
            return preloadColumns.push(...Array.from({
                length: amount
            }).map(((_, i) => activeColumn + slidesPerView + i))), void swiper.slides.forEach(((slideEl, i) => {
                preloadColumns.includes(slideEl.column) && unlazy(swiper, i);
            }));
        }
        const slideIndexLastInView = activeIndex + slidesPerView - 1;
        if (swiper.params.rewind || swiper.params.loop) for (let i = activeIndex - amount; i <= slideIndexLastInView + amount; i += 1) {
            const realIndex = (i % len + len) % len;
            (realIndex < activeIndex || realIndex > slideIndexLastInView) && unlazy(swiper, realIndex);
        } else for (let i = Math.max(activeIndex - amount, 0); i <= Math.min(slideIndexLastInView + amount, len - 1); i += 1) i !== activeIndex && (i > slideIndexLastInView || i < activeIndex) && unlazy(swiper, i);
    };
    var update = {
        updateSize: function() {
            const swiper = this;
            let width, height;
            const el = swiper.el;
            width = void 0 !== swiper.params.width && null !== swiper.params.width ? swiper.params.width : el.clientWidth, 
            height = void 0 !== swiper.params.height && null !== swiper.params.height ? swiper.params.height : el.clientHeight, 
            0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical() || (
            // Subtract paddings
            width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10), 
            height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10), 
            Number.isNaN(width) && (width = 0), Number.isNaN(height) && (height = 0), Object.assign(swiper, {
                width: width,
                height: height,
                size: swiper.isHorizontal() ? width : height
            }));
        },
        updateSlides: function() {
            const swiper = this;
            function getDirectionPropertyValue(node, label) {
                return parseFloat(node.getPropertyValue(swiper.getDirectionLabel(label)) || 0);
            }
            const params = swiper.params, {wrapperEl: wrapperEl, slidesEl: slidesEl, size: swiperSize, rtlTranslate: rtl, wrongRTL: wrongRTL} = swiper, isVirtual = swiper.virtual && params.virtual.enabled, previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length, slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`), slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
            let snapGrid = [];
            const slidesGrid = [], slidesSizesGrid = [];
            let offsetBefore = params.slidesOffsetBefore;
            "function" == typeof offsetBefore && (offsetBefore = params.slidesOffsetBefore.call(swiper));
            let offsetAfter = params.slidesOffsetAfter;
            "function" == typeof offsetAfter && (offsetAfter = params.slidesOffsetAfter.call(swiper));
            const previousSnapGridLength = swiper.snapGrid.length, previousSlidesGridLength = swiper.slidesGrid.length;
            let spaceBetween = params.spaceBetween, slidePosition = -offsetBefore, prevSlideSize = 0, index = 0;
            if (void 0 === swiperSize) return;
            "string" == typeof spaceBetween && spaceBetween.indexOf("%") >= 0 ? spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize : "string" == typeof spaceBetween && (spaceBetween = parseFloat(spaceBetween)), 
            swiper.virtualSize = -spaceBetween, 
            // reset margins
            slides.forEach((slideEl => {
                rtl ? slideEl.style.marginLeft = "" : slideEl.style.marginRight = "", slideEl.style.marginBottom = "", 
                slideEl.style.marginTop = "";
            })), 
            // reset cssMode offsets
            params.centeredSlides && params.cssMode && (setCSSProperty(wrapperEl, "--swiper-centered-offset-before", ""), 
            setCSSProperty(wrapperEl, "--swiper-centered-offset-after", ""));
            const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
            // Calc slides
            let slideSize;
            gridEnabled ? swiper.grid.initSlides(slides) : swiper.grid && swiper.grid.unsetSlides();
            const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => void 0 !== params.breakpoints[key].slidesPerView)).length > 0;
            for (let i = 0; i < slidesLength; i += 1) {
                let slide;
                if (slideSize = 0, slides[i] && (slide = slides[i]), gridEnabled && swiper.grid.updateSlide(i, slide, slides), 
                !slides[i] || "none" !== elementStyle(slide, "display")) {
                    // eslint-disable-line
                    if ("auto" === params.slidesPerView) {
                        shouldResetSlideSize && (slides[i].style[swiper.getDirectionLabel("width")] = "");
                        const slideStyles = getComputedStyle(slide), currentTransform = slide.style.transform, currentWebKitTransform = slide.style.webkitTransform;
                        if (currentTransform && (slide.style.transform = "none"), currentWebKitTransform && (slide.style.webkitTransform = "none"), 
                        params.roundLengths) slideSize = swiper.isHorizontal() ? elementOuterSize(slide, "width", !0) : elementOuterSize(slide, "height", !0); else {
                            // eslint-disable-next-line
                            const width = getDirectionPropertyValue(slideStyles, "width"), paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left"), paddingRight = getDirectionPropertyValue(slideStyles, "padding-right"), marginLeft = getDirectionPropertyValue(slideStyles, "margin-left"), marginRight = getDirectionPropertyValue(slideStyles, "margin-right"), boxSizing = slideStyles.getPropertyValue("box-sizing");
                            if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                                const {clientWidth: clientWidth, offsetWidth: offsetWidth} = slide;
                                slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                            }
                        }
                        currentTransform && (slide.style.transform = currentTransform), currentWebKitTransform && (slide.style.webkitTransform = currentWebKitTransform), 
                        params.roundLengths && (slideSize = Math.floor(slideSize));
                    } else slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView, 
                    params.roundLengths && (slideSize = Math.floor(slideSize)), slides[i] && (slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`);
                    slides[i] && (slides[i].swiperSlideSize = slideSize), slidesSizesGrid.push(slideSize), 
                    params.centeredSlides ? (slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween, 
                    0 === prevSlideSize && 0 !== i && (slidePosition = slidePosition - swiperSize / 2 - spaceBetween), 
                    0 === i && (slidePosition = slidePosition - swiperSize / 2 - spaceBetween), Math.abs(slidePosition) < .001 && (slidePosition = 0), 
                    params.roundLengths && (slidePosition = Math.floor(slidePosition)), index % params.slidesPerGroup == 0 && snapGrid.push(slidePosition), 
                    slidesGrid.push(slidePosition)) : (params.roundLengths && (slidePosition = Math.floor(slidePosition)), 
                    (index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup == 0 && snapGrid.push(slidePosition), 
                    slidesGrid.push(slidePosition), slidePosition = slidePosition + slideSize + spaceBetween), 
                    swiper.virtualSize += slideSize + spaceBetween, prevSlideSize = slideSize, index += 1;
                }
            }
            // Remove last grid elements depending on width
            if (swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter, 
            rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect) && (wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`), 
            params.setWrapperSize && (wrapperEl.style[swiper.getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`), 
            gridEnabled && swiper.grid.updateWrapperSize(slideSize, snapGrid), !params.centeredSlides) {
                const newSlidesGrid = [];
                for (let i = 0; i < snapGrid.length; i += 1) {
                    let slidesGridItem = snapGrid[i];
                    params.roundLengths && (slidesGridItem = Math.floor(slidesGridItem)), snapGrid[i] <= swiper.virtualSize - swiperSize && newSlidesGrid.push(slidesGridItem);
                }
                snapGrid = newSlidesGrid, Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1 && snapGrid.push(swiper.virtualSize - swiperSize);
            }
            if (isVirtual && params.loop) {
                const size = slidesSizesGrid[0] + spaceBetween;
                if (params.slidesPerGroup > 1) {
                    const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup), groupSize = size * params.slidesPerGroup;
                    for (let i = 0; i < groups; i += 1) snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
                }
                for (let i = 0; i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i += 1) 1 === params.slidesPerGroup && snapGrid.push(snapGrid[snapGrid.length - 1] + size), 
                slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size), swiper.virtualSize += size;
            }
            if (0 === snapGrid.length && (snapGrid = [ 0 ]), 0 !== spaceBetween) {
                const key = swiper.isHorizontal() && rtl ? "marginLeft" : swiper.getDirectionLabel("marginRight");
                slides.filter(((_, slideIndex) => !(params.cssMode && !params.loop) || slideIndex !== slides.length - 1)).forEach((slideEl => {
                    slideEl.style[key] = `${spaceBetween}px`;
                }));
            }
            if (params.centeredSlides && params.centeredSlidesBounds) {
                let allSlidesSize = 0;
                slidesSizesGrid.forEach((slideSizeValue => {
                    allSlidesSize += slideSizeValue + (spaceBetween || 0);
                })), allSlidesSize -= spaceBetween;
                const maxSnap = allSlidesSize - swiperSize;
                snapGrid = snapGrid.map((snap => snap <= 0 ? -offsetBefore : snap > maxSnap ? maxSnap + offsetAfter : snap));
            }
            if (params.centerInsufficientSlides) {
                let allSlidesSize = 0;
                if (slidesSizesGrid.forEach((slideSizeValue => {
                    allSlidesSize += slideSizeValue + (spaceBetween || 0);
                })), allSlidesSize -= spaceBetween, allSlidesSize < swiperSize) {
                    const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                    snapGrid.forEach(((snap, snapIndex) => {
                        snapGrid[snapIndex] = snap - allSlidesOffset;
                    })), slidesGrid.forEach(((snap, snapIndex) => {
                        slidesGrid[snapIndex] = snap + allSlidesOffset;
                    }));
                }
            }
            if (Object.assign(swiper, {
                slides: slides,
                snapGrid: snapGrid,
                slidesGrid: slidesGrid,
                slidesSizesGrid: slidesSizesGrid
            }), params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
                setCSSProperty(wrapperEl, "--swiper-centered-offset-before", -snapGrid[0] + "px"), 
                setCSSProperty(wrapperEl, "--swiper-centered-offset-after", swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2 + "px");
                const addToSnapGrid = -swiper.snapGrid[0], addToSlidesGrid = -swiper.slidesGrid[0];
                swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid)), swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
            }
            if (slidesLength !== previousSlidesLength && swiper.emit("slidesLengthChange"), 
            snapGrid.length !== previousSnapGridLength && (swiper.params.watchOverflow && swiper.checkOverflow(), 
            swiper.emit("snapGridLengthChange")), slidesGrid.length !== previousSlidesGridLength && swiper.emit("slidesGridLengthChange"), 
            params.watchSlidesProgress && swiper.updateSlidesOffset(), swiper.emit("slidesUpdated"), 
            !(isVirtual || params.cssMode || "slide" !== params.effect && "fade" !== params.effect)) {
                const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`, hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
                slidesLength <= params.maxBackfaceHiddenSlides ? hasClassBackfaceClassAdded || swiper.el.classList.add(backFaceHiddenClass) : hasClassBackfaceClassAdded && swiper.el.classList.remove(backFaceHiddenClass);
            }
        },
        updateAutoHeight: function(speed) {
            const swiper = this, activeSlides = [], isVirtual = swiper.virtual && swiper.params.virtual.enabled;
            let i, newHeight = 0;
            "number" == typeof speed ? swiper.setTransition(speed) : !0 === speed && swiper.setTransition(swiper.params.speed);
            const getSlideByIndex = index => isVirtual ? swiper.slides[swiper.getSlideIndexByData(index)] : swiper.slides[index];
            // Find slides currently in view
                        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || []).forEach((slide => {
                activeSlides.push(slide);
            })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
                const index = swiper.activeIndex + i;
                if (index > swiper.slides.length && !isVirtual) break;
                activeSlides.push(getSlideByIndex(index));
            } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
            // Find new height from highest slide in view
                        for (i = 0; i < activeSlides.length; i += 1) if (void 0 !== activeSlides[i]) {
                const height = activeSlides[i].offsetHeight;
                newHeight = height > newHeight ? height : newHeight;
            }
            // Update Height
                        (newHeight || 0 === newHeight) && (swiper.wrapperEl.style.height = `${newHeight}px`);
        },
        updateSlidesOffset: function() {
            const swiper = this, slides = swiper.slides, minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
            for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = (swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
        },
        updateSlidesProgress: function(translate) {
            void 0 === translate && (translate = this && this.translate || 0);
            const swiper = this, params = swiper.params, {slides: slides, rtlTranslate: rtl, snapGrid: snapGrid} = swiper;
            if (0 === slides.length) return;
            void 0 === slides[0].swiperSlideOffset && swiper.updateSlidesOffset();
            let offsetCenter = -translate;
            rtl && (offsetCenter = translate), 
            // Visible Slides
            slides.forEach((slideEl => {
                slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass);
            })), swiper.visibleSlidesIndexes = [], swiper.visibleSlides = [];
            let spaceBetween = params.spaceBetween;
            "string" == typeof spaceBetween && spaceBetween.indexOf("%") >= 0 ? spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size : "string" == typeof spaceBetween && (spaceBetween = parseFloat(spaceBetween));
            for (let i = 0; i < slides.length; i += 1) {
                const slide = slides[i];
                let slideOffset = slide.swiperSlideOffset;
                params.cssMode && params.centeredSlides && (slideOffset -= slides[0].swiperSlideOffset);
                const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween), originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + spaceBetween), slideBefore = -(offsetCenter - slideOffset), slideAfter = slideBefore + swiper.slidesSizesGrid[i], isFullyVisible = slideBefore >= 0 && slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
                (slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size) && (swiper.visibleSlides.push(slide), 
                swiper.visibleSlidesIndexes.push(i), slides[i].classList.add(params.slideVisibleClass)), 
                isFullyVisible && slides[i].classList.add(params.slideFullyVisibleClass), slide.progress = rtl ? -slideProgress : slideProgress, 
                slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
            }
        },
        updateProgress: function(translate) {
            const swiper = this;
            if (void 0 === translate) {
                const multiplier = swiper.rtlTranslate ? -1 : 1;
                // eslint-disable-next-line
                                translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
            }
            const params = swiper.params, translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
            let {progress: progress, isBeginning: isBeginning, isEnd: isEnd, progressLoop: progressLoop} = swiper;
            const wasBeginning = isBeginning, wasEnd = isEnd;
            if (0 === translatesDiff) progress = 0, isBeginning = !0, isEnd = !0; else {
                progress = (translate - swiper.minTranslate()) / translatesDiff;
                const isBeginningRounded = Math.abs(translate - swiper.minTranslate()) < 1, isEndRounded = Math.abs(translate - swiper.maxTranslate()) < 1;
                isBeginning = isBeginningRounded || progress <= 0, isEnd = isEndRounded || progress >= 1, 
                isBeginningRounded && (progress = 0), isEndRounded && (progress = 1);
            }
            if (params.loop) {
                const firstSlideIndex = swiper.getSlideIndexByData(0), lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1), firstSlideTranslate = swiper.slidesGrid[firstSlideIndex], lastSlideTranslate = swiper.slidesGrid[lastSlideIndex], translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1], translateAbs = Math.abs(translate);
                progressLoop = translateAbs >= firstSlideTranslate ? (translateAbs - firstSlideTranslate) / translateMax : (translateAbs + translateMax - lastSlideTranslate) / translateMax, 
                progressLoop > 1 && (progressLoop -= 1);
            }
            Object.assign(swiper, {
                progress: progress,
                progressLoop: progressLoop,
                isBeginning: isBeginning,
                isEnd: isEnd
            }), (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) && swiper.updateSlidesProgress(translate), 
            isBeginning && !wasBeginning && swiper.emit("reachBeginning toEdge"), isEnd && !wasEnd && swiper.emit("reachEnd toEdge"), 
            (wasBeginning && !isBeginning || wasEnd && !isEnd) && swiper.emit("fromEdge"), swiper.emit("progress", progress);
        },
        updateSlidesClasses: function() {
            const swiper = this, {slides: slides, params: params, slidesEl: slidesEl, activeIndex: activeIndex} = swiper, isVirtual = swiper.virtual && params.virtual.enabled, gridEnabled = swiper.grid && params.grid && params.grid.rows > 1, getFilteredSlide = selector => elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
            let activeSlide, prevSlide, nextSlide;
            if (slides.forEach((slideEl => {
                slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
            })), isVirtual) if (params.loop) {
                let slideIndex = activeIndex - swiper.virtual.slidesBefore;
                slideIndex < 0 && (slideIndex = swiper.virtual.slides.length + slideIndex), slideIndex >= swiper.virtual.slides.length && (slideIndex -= swiper.virtual.slides.length), 
                activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
            } else activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`); else gridEnabled ? (activeSlide = slides.filter((slideEl => slideEl.column === activeIndex))[0], 
            nextSlide = slides.filter((slideEl => slideEl.column === activeIndex + 1))[0], prevSlide = slides.filter((slideEl => slideEl.column === activeIndex - 1))[0]) : activeSlide = slides[activeIndex];
            activeSlide && (
            // Active classes
            activeSlide.classList.add(params.slideActiveClass), gridEnabled ? (nextSlide && nextSlide.classList.add(params.slideNextClass), 
            prevSlide && prevSlide.classList.add(params.slidePrevClass)) : (
            // Next Slide
            nextSlide = function(el, selector) {
                const nextEls = [];
                for (;el.nextElementSibling; ) {
                    const next = el.nextElementSibling;
 // eslint-disable-line
                                        selector ? next.matches(selector) && nextEls.push(next) : nextEls.push(next), 
                    el = next;
                }
                return nextEls;
            }(activeSlide, `.${params.slideClass}, swiper-slide`)[0], params.loop && !nextSlide && (nextSlide = slides[0]), 
            nextSlide && nextSlide.classList.add(params.slideNextClass), 
            // Prev Slide
            prevSlide = function(el, selector) {
                const prevEls = [];
                for (;el.previousElementSibling; ) {
                    const prev = el.previousElementSibling;
 // eslint-disable-line
                                        selector ? prev.matches(selector) && prevEls.push(prev) : prevEls.push(prev), 
                    el = prev;
                }
                return prevEls;
            }(activeSlide, `.${params.slideClass}, swiper-slide`)[0], params.loop && 0 === !prevSlide && (prevSlide = slides[slides.length - 1]), 
            prevSlide && prevSlide.classList.add(params.slidePrevClass))), swiper.emitSlidesClasses();
        },
        updateActiveIndex: function(newActiveIndex) {
            const swiper = this, translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate, {snapGrid: snapGrid, params: params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
            let snapIndex, activeIndex = newActiveIndex;
            const getVirtualRealIndex = aIndex => {
                let realIndex = aIndex - swiper.virtual.slidesBefore;
                return realIndex < 0 && (realIndex = swiper.virtual.slides.length + realIndex), 
                realIndex >= swiper.virtual.slides.length && (realIndex -= swiper.virtual.slides.length), 
                realIndex;
            };
            if (void 0 === activeIndex && (activeIndex = function(swiper) {
                const {slidesGrid: slidesGrid, params: params} = swiper, translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
                let activeIndex;
                for (let i = 0; i < slidesGrid.length; i += 1) void 0 !== slidesGrid[i + 1] ? translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2 ? activeIndex = i : translate >= slidesGrid[i] && translate < slidesGrid[i + 1] && (activeIndex = i + 1) : translate >= slidesGrid[i] && (activeIndex = i);
                // Normalize slideIndex
                                return params.normalizeSlideIndex && (activeIndex < 0 || void 0 === activeIndex) && (activeIndex = 0), 
                activeIndex;
            }(swiper)), snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
                const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
                snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
            }
            if (snapIndex >= snapGrid.length && (snapIndex = snapGrid.length - 1), activeIndex === previousIndex && !swiper.params.loop) return void (snapIndex !== previousSnapIndex && (swiper.snapIndex = snapIndex, 
            swiper.emit("snapIndexChange")));
            if (activeIndex === previousIndex && swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) return void (swiper.realIndex = getVirtualRealIndex(activeIndex));
            const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
            // Get real index
                        let realIndex;
            if (swiper.virtual && params.virtual.enabled && params.loop) realIndex = getVirtualRealIndex(activeIndex); else if (gridEnabled) {
                const firstSlideInColumn = swiper.slides.filter((slideEl => slideEl.column === activeIndex))[0];
                let activeSlideIndex = parseInt(firstSlideInColumn.getAttribute("data-swiper-slide-index"), 10);
                Number.isNaN(activeSlideIndex) && (activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0)), 
                realIndex = Math.floor(activeSlideIndex / params.grid.rows);
            } else if (swiper.slides[activeIndex]) {
                const slideIndex = swiper.slides[activeIndex].getAttribute("data-swiper-slide-index");
                realIndex = slideIndex ? parseInt(slideIndex, 10) : activeIndex;
            } else realIndex = activeIndex;
            Object.assign(swiper, {
                previousSnapIndex: previousSnapIndex,
                snapIndex: snapIndex,
                previousRealIndex: previousRealIndex,
                realIndex: realIndex,
                previousIndex: previousIndex,
                activeIndex: activeIndex
            }), swiper.initialized && preload(swiper), swiper.emit("activeIndexChange"), swiper.emit("snapIndexChange"), 
            (swiper.initialized || swiper.params.runCallbacksOnInit) && (previousRealIndex !== realIndex && swiper.emit("realIndexChange"), 
            swiper.emit("slideChange"));
        },
        updateClickedSlide: function(el, path) {
            const swiper = this, params = swiper.params;
            let slide = el.closest(`.${params.slideClass}, swiper-slide`);
            !slide && swiper.isElement && path && path.length > 1 && path.includes(el) && [ ...path.slice(path.indexOf(el) + 1, path.length) ].forEach((pathEl => {
                !slide && pathEl.matches && pathEl.matches(`.${params.slideClass}, swiper-slide`) && (slide = pathEl);
            }));
            let slideIndex, slideFound = !1;
            if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
                slideFound = !0, slideIndex = i;
                break;
            }
            if (!slide || !slideFound) return swiper.clickedSlide = void 0, void (swiper.clickedIndex = void 0);
            swiper.clickedSlide = slide, swiper.virtual && swiper.params.virtual.enabled ? swiper.clickedIndex = parseInt(slide.getAttribute("data-swiper-slide-index"), 10) : swiper.clickedIndex = slideIndex, 
            params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex && swiper.slideToClickedSlide();
        }
    };
    var translate = {
        getTranslate: function(axis) {
            void 0 === axis && (axis = this.isHorizontal() ? "x" : "y");
            const {params: params, rtlTranslate: rtl, translate: translate, wrapperEl: wrapperEl} = this;
            if (params.virtualTranslate) return rtl ? -translate : translate;
            if (params.cssMode) return translate;
            let currentTranslate = getTranslate(wrapperEl, axis);
            return currentTranslate += this.cssOverflowAdjustment(), rtl && (currentTranslate = -currentTranslate), 
            currentTranslate || 0;
        },
        setTranslate: function(translate, byController) {
            const swiper = this, {rtlTranslate: rtl, params: params, wrapperEl: wrapperEl, progress: progress} = swiper;
            let newProgress, x = 0, y = 0;
            swiper.isHorizontal() ? x = rtl ? -translate : translate : y = translate, params.roundLengths && (x = Math.floor(x), 
            y = Math.floor(y)), swiper.previousTranslate = swiper.translate, swiper.translate = swiper.isHorizontal() ? x : y, 
            params.cssMode ? wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y : params.virtualTranslate || (swiper.isHorizontal() ? x -= swiper.cssOverflowAdjustment() : y -= swiper.cssOverflowAdjustment(), 
            wrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0px)`);
            const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
            newProgress = 0 === translatesDiff ? 0 : (translate - swiper.minTranslate()) / translatesDiff, 
            newProgress !== progress && swiper.updateProgress(translate), swiper.emit("setTranslate", swiper.translate, byController);
        },
        minTranslate: function() {
            return -this.snapGrid[0];
        },
        maxTranslate: function() {
            return -this.snapGrid[this.snapGrid.length - 1];
        },
        translateTo: function(translate, speed, runCallbacks, translateBounds, internal) {
            void 0 === translate && (translate = 0), void 0 === speed && (speed = this.params.speed), 
            void 0 === runCallbacks && (runCallbacks = !0), void 0 === translateBounds && (translateBounds = !0);
            const swiper = this, {params: params, wrapperEl: wrapperEl} = swiper;
            if (swiper.animating && params.preventInteractionOnTransition) return !1;
            const minTranslate = swiper.minTranslate(), maxTranslate = swiper.maxTranslate();
            let newTranslate;
            if (newTranslate = translateBounds && translate > minTranslate ? minTranslate : translateBounds && translate < maxTranslate ? maxTranslate : translate, 
            // Update progress
            swiper.updateProgress(newTranslate), params.cssMode) {
                const isH = swiper.isHorizontal();
                if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                    if (!swiper.support.smoothScroll) return animateCSSModeScroll({
                        swiper: swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    }), !0;
                    wrapperEl.scrollTo({
                        [isH ? "left" : "top"]: -newTranslate,
                        behavior: "smooth"
                    });
                }
                return !0;
            }
            return 0 === speed ? (swiper.setTransition(0), swiper.setTranslate(newTranslate), 
            runCallbacks && (swiper.emit("beforeTransitionStart", speed, internal), swiper.emit("transitionEnd"))) : (swiper.setTransition(speed), 
            swiper.setTranslate(newTranslate), runCallbacks && (swiper.emit("beforeTransitionStart", speed, internal), 
            swiper.emit("transitionStart")), swiper.animating || (swiper.animating = !0, swiper.onTranslateToWrapperTransitionEnd || (swiper.onTranslateToWrapperTransitionEnd = function(e) {
                swiper && !swiper.destroyed && e.target === this && (swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd), 
                swiper.onTranslateToWrapperTransitionEnd = null, delete swiper.onTranslateToWrapperTransitionEnd, 
                runCallbacks && swiper.emit("transitionEnd"));
            }), swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd))), 
            !0;
        }
    };
    function transitionEmit(_ref) {
        let {swiper: swiper, runCallbacks: runCallbacks, direction: direction, step: step} = _ref;
        const {activeIndex: activeIndex, previousIndex: previousIndex} = swiper;
        let dir = direction;
        if (dir || (dir = activeIndex > previousIndex ? "next" : activeIndex < previousIndex ? "prev" : "reset"), 
        swiper.emit(`transition${step}`), runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) return void swiper.emit(`slideResetTransition${step}`);
            swiper.emit(`slideChangeTransition${step}`), "next" === dir ? swiper.emit(`slideNextTransition${step}`) : swiper.emit(`slidePrevTransition${step}`);
        }
    }
    var slide = {
        slideTo: function(index, speed, runCallbacks, internal, initial) {
            void 0 === index && (index = 0), void 0 === speed && (speed = this.params.speed), 
            void 0 === runCallbacks && (runCallbacks = !0), "string" == typeof index && (index = parseInt(index, 10));
            const swiper = this;
            let slideIndex = index;
            slideIndex < 0 && (slideIndex = 0);
            const {params: params, snapGrid: snapGrid, slidesGrid: slidesGrid, previousIndex: previousIndex, activeIndex: activeIndex, rtlTranslate: rtl, wrapperEl: wrapperEl, enabled: enabled} = swiper;
            if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return !1;
            const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
            let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
            snapIndex >= snapGrid.length && (snapIndex = snapGrid.length - 1);
            const translate = -snapGrid[snapIndex];
            // Normalize slideIndex
                        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
                const normalizedTranslate = -Math.floor(100 * translate), normalizedGrid = Math.floor(100 * slidesGrid[i]), normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
                void 0 !== slidesGrid[i + 1] ? normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2 ? slideIndex = i : normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext && (slideIndex = i + 1) : normalizedTranslate >= normalizedGrid && (slideIndex = i);
            }
            // Directions locks
                        if (swiper.initialized && slideIndex !== activeIndex) {
                if (!swiper.allowSlideNext && (rtl ? translate > swiper.translate && translate > swiper.minTranslate() : translate < swiper.translate && translate < swiper.minTranslate())) return !1;
                if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate() && (activeIndex || 0) !== slideIndex) return !1;
            }
            let direction;
            // Update Index
            if (slideIndex !== (previousIndex || 0) && runCallbacks && swiper.emit("beforeSlideChangeStart"), 
            // Update progress
            swiper.updateProgress(translate), direction = slideIndex > activeIndex ? "next" : slideIndex < activeIndex ? "prev" : "reset", 
            rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) return swiper.updateActiveIndex(slideIndex), 
            // Update Height
            params.autoHeight && swiper.updateAutoHeight(), swiper.updateSlidesClasses(), "slide" !== params.effect && swiper.setTranslate(translate), 
            "reset" !== direction && (swiper.transitionStart(runCallbacks, direction), swiper.transitionEnd(runCallbacks, direction)), 
            !1;
            if (params.cssMode) {
                const isH = swiper.isHorizontal(), t = rtl ? translate : -translate;
                if (0 === speed) {
                    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                    isVirtual && (swiper.wrapperEl.style.scrollSnapType = "none", swiper._immediateVirtual = !0), 
                    isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0 ? (swiper._cssModeVirtualInitialSet = !0, 
                    requestAnimationFrame((() => {
                        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                    }))) : wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t, isVirtual && requestAnimationFrame((() => {
                        swiper.wrapperEl.style.scrollSnapType = "", swiper._immediateVirtual = !1;
                    }));
                } else {
                    if (!swiper.support.smoothScroll) return animateCSSModeScroll({
                        swiper: swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    }), !0;
                    wrapperEl.scrollTo({
                        [isH ? "left" : "top"]: t,
                        behavior: "smooth"
                    });
                }
                return !0;
            }
            return swiper.setTransition(speed), swiper.setTranslate(translate), swiper.updateActiveIndex(slideIndex), 
            swiper.updateSlidesClasses(), swiper.emit("beforeTransitionStart", speed, internal), 
            swiper.transitionStart(runCallbacks, direction), 0 === speed ? swiper.transitionEnd(runCallbacks, direction) : swiper.animating || (swiper.animating = !0, 
            swiper.onSlideToWrapperTransitionEnd || (swiper.onSlideToWrapperTransitionEnd = function(e) {
                swiper && !swiper.destroyed && e.target === this && (swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd), 
                swiper.onSlideToWrapperTransitionEnd = null, delete swiper.onSlideToWrapperTransitionEnd, 
                swiper.transitionEnd(runCallbacks, direction));
            }), swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd)), 
            !0;
        },
        slideToLoop: function(index, speed, runCallbacks, internal) {
            if (void 0 === index && (index = 0), void 0 === speed && (speed = this.params.speed), 
            void 0 === runCallbacks && (runCallbacks = !0), "string" == typeof index) {
                index = parseInt(index, 10);
            }
            const swiper = this, gridEnabled = swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
            let newIndex = index;
            if (swiper.params.loop) if (swiper.virtual && swiper.params.virtual.enabled) 
            // eslint-disable-next-line
            newIndex += swiper.virtual.slidesBefore; else {
                let targetSlideIndex;
                if (gridEnabled) {
                    const slideIndex = newIndex * swiper.params.grid.rows;
                    targetSlideIndex = swiper.slides.filter((slideEl => 1 * slideEl.getAttribute("data-swiper-slide-index") === slideIndex))[0].column;
                } else targetSlideIndex = swiper.getSlideIndexByData(newIndex);
                const cols = gridEnabled ? Math.ceil(swiper.slides.length / swiper.params.grid.rows) : swiper.slides.length, {centeredSlides: centeredSlides} = swiper.params;
                let slidesPerView = swiper.params.slidesPerView;
                "auto" === slidesPerView ? slidesPerView = swiper.slidesPerViewDynamic() : (slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10)), 
                centeredSlides && slidesPerView % 2 == 0 && (slidesPerView += 1));
                let needLoopFix = cols - targetSlideIndex < slidesPerView;
                if (centeredSlides && (needLoopFix = needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2)), 
                needLoopFix) {
                    const direction = centeredSlides ? targetSlideIndex < swiper.activeIndex ? "prev" : "next" : targetSlideIndex - swiper.activeIndex - 1 < swiper.params.slidesPerView ? "next" : "prev";
                    swiper.loopFix({
                        direction: direction,
                        slideTo: !0,
                        activeSlideIndex: "next" === direction ? targetSlideIndex + 1 : targetSlideIndex - cols + 1,
                        slideRealIndex: "next" === direction ? swiper.realIndex : void 0
                    });
                }
                if (gridEnabled) {
                    const slideIndex = newIndex * swiper.params.grid.rows;
                    newIndex = swiper.slides.filter((slideEl => 1 * slideEl.getAttribute("data-swiper-slide-index") === slideIndex))[0].column;
                } else newIndex = swiper.getSlideIndexByData(newIndex);
            }
            return requestAnimationFrame((() => {
                swiper.slideTo(newIndex, speed, runCallbacks, internal);
            })), swiper;
        }
        /* eslint no-unused-vars: "off" */ ,
        slideNext: function(speed, runCallbacks, internal) {
            void 0 === speed && (speed = this.params.speed), void 0 === runCallbacks && (runCallbacks = !0);
            const swiper = this, {enabled: enabled, params: params, animating: animating} = swiper;
            if (!enabled) return swiper;
            let perGroup = params.slidesPerGroup;
            "auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto && (perGroup = Math.max(swiper.slidesPerViewDynamic("current", !0), 1));
            const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup, isVirtual = swiper.virtual && params.virtual.enabled;
            if (params.loop) {
                if (animating && !isVirtual && params.loopPreventsSliding) return !1;
                if (swiper.loopFix({
                    direction: "next"
                }), 
                // eslint-disable-next-line
                swiper._clientLeft = swiper.wrapperEl.clientLeft, swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) return requestAnimationFrame((() => {
                    swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
                })), !0;
            }
            return params.rewind && swiper.isEnd ? swiper.slideTo(0, speed, runCallbacks, internal) : swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
        }
        /* eslint no-unused-vars: "off" */ ,
        slidePrev: function(speed, runCallbacks, internal) {
            void 0 === speed && (speed = this.params.speed), void 0 === runCallbacks && (runCallbacks = !0);
            const swiper = this, {params: params, snapGrid: snapGrid, slidesGrid: slidesGrid, rtlTranslate: rtlTranslate, enabled: enabled, animating: animating} = swiper;
            if (!enabled) return swiper;
            const isVirtual = swiper.virtual && params.virtual.enabled;
            if (params.loop) {
                if (animating && !isVirtual && params.loopPreventsSliding) return !1;
                swiper.loopFix({
                    direction: "prev"
                }), 
                // eslint-disable-next-line
                swiper._clientLeft = swiper.wrapperEl.clientLeft;
            }
            function normalize(val) {
                return val < 0 ? -Math.floor(Math.abs(val)) : Math.floor(val);
            }
            const normalizedTranslate = normalize(rtlTranslate ? swiper.translate : -swiper.translate), normalizedSnapGrid = snapGrid.map((val => normalize(val)));
            let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
            if (void 0 === prevSnap && params.cssMode) {
                let prevSnapIndex;
                snapGrid.forEach(((snap, snapIndex) => {
                    normalizedTranslate >= snap && (
                    // prevSnap = snap;
                    prevSnapIndex = snapIndex);
                })), void 0 !== prevSnapIndex && (prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex]);
            }
            let prevIndex = 0;
            if (void 0 !== prevSnap && (prevIndex = slidesGrid.indexOf(prevSnap), prevIndex < 0 && (prevIndex = swiper.activeIndex - 1), 
            "auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto && (prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", !0) + 1, 
            prevIndex = Math.max(prevIndex, 0))), params.rewind && swiper.isBeginning) {
                const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
                return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
            }
            return params.loop && 0 === swiper.activeIndex && params.cssMode ? (requestAnimationFrame((() => {
                swiper.slideTo(prevIndex, speed, runCallbacks, internal);
            })), !0) : swiper.slideTo(prevIndex, speed, runCallbacks, internal);
        }
        /* eslint no-unused-vars: "off" */ ,
        slideReset: function(speed, runCallbacks, internal) {
            return void 0 === speed && (speed = this.params.speed), void 0 === runCallbacks && (runCallbacks = !0), 
            this.slideTo(this.activeIndex, speed, runCallbacks, internal);
        }
        /* eslint no-unused-vars: "off" */ ,
        slideToClosest: function(speed, runCallbacks, internal, threshold) {
            void 0 === speed && (speed = this.params.speed), void 0 === runCallbacks && (runCallbacks = !0), 
            void 0 === threshold && (threshold = .5);
            const swiper = this;
            let index = swiper.activeIndex;
            const skip = Math.min(swiper.params.slidesPerGroupSkip, index), snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup), translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
            if (translate >= swiper.snapGrid[snapIndex]) {
                // The current translate is on or after the current snap index, so the choice
                // is between the current index and the one after it.
                const currentSnap = swiper.snapGrid[snapIndex];
                translate - currentSnap > (swiper.snapGrid[snapIndex + 1] - currentSnap) * threshold && (index += swiper.params.slidesPerGroup);
            } else {
                // The current translate is before the current snap index, so the choice
                // is between the current index and the one before it.
                const prevSnap = swiper.snapGrid[snapIndex - 1];
                translate - prevSnap <= (swiper.snapGrid[snapIndex] - prevSnap) * threshold && (index -= swiper.params.slidesPerGroup);
            }
            return index = Math.max(index, 0), index = Math.min(index, swiper.slidesGrid.length - 1), 
            swiper.slideTo(index, speed, runCallbacks, internal);
        },
        slideToClickedSlide: function() {
            const swiper = this, {params: params, slidesEl: slidesEl} = swiper, slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
            let realIndex, slideToIndex = swiper.clickedIndex;
            const slideSelector = swiper.isElement ? "swiper-slide" : `.${params.slideClass}`;
            if (params.loop) {
                if (swiper.animating) return;
                realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10), 
                params.centeredSlides ? slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2 ? (swiper.loopFix(), 
                slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]), 
                nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }))) : swiper.slideTo(slideToIndex) : slideToIndex > swiper.slides.length - slidesPerView ? (swiper.loopFix(), 
                slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]), 
                nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }))) : swiper.slideTo(slideToIndex);
            } else swiper.slideTo(slideToIndex);
        }
    };
    var loop = {
        loopCreate: function(slideRealIndex) {
            const swiper = this, {params: params, slidesEl: slidesEl} = swiper;
            if (!params.loop || swiper.virtual && swiper.params.virtual.enabled) return;
            const initSlides = () => {
                elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`).forEach(((el, index) => {
                    el.setAttribute("data-swiper-slide-index", index);
                }));
            }, gridEnabled = swiper.grid && params.grid && params.grid.rows > 1, slidesPerGroup = params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1), shouldFillGroup = swiper.slides.length % slidesPerGroup != 0, shouldFillGrid = gridEnabled && swiper.slides.length % params.grid.rows != 0, addBlankSlides = amountOfSlides => {
                for (let i = 0; i < amountOfSlides; i += 1) {
                    const slideEl = swiper.isElement ? createElement("swiper-slide", [ params.slideBlankClass ]) : createElement("div", [ params.slideClass, params.slideBlankClass ]);
                    swiper.slidesEl.append(slideEl);
                }
            };
            if (shouldFillGroup) {
                if (params.loopAddBlankSlides) {
                    addBlankSlides(slidesPerGroup - swiper.slides.length % slidesPerGroup), swiper.recalcSlides(), 
                    swiper.updateSlides();
                } else showWarning("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                initSlides();
            } else if (shouldFillGrid) {
                if (params.loopAddBlankSlides) {
                    addBlankSlides(params.grid.rows - swiper.slides.length % params.grid.rows), swiper.recalcSlides(), 
                    swiper.updateSlides();
                } else showWarning("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                initSlides();
            } else initSlides();
            swiper.loopFix({
                slideRealIndex: slideRealIndex,
                direction: params.centeredSlides ? void 0 : "next"
            });
        },
        loopFix: function(_temp) {
            let {slideRealIndex: slideRealIndex, slideTo: slideTo = !0, direction: direction, setTranslate: setTranslate, activeSlideIndex: activeSlideIndex, byController: byController, byMousewheel: byMousewheel} = void 0 === _temp ? {} : _temp;
            const swiper = this;
            if (!swiper.params.loop) return;
            swiper.emit("beforeLoopFix");
            const {slides: slides, allowSlidePrev: allowSlidePrev, allowSlideNext: allowSlideNext, slidesEl: slidesEl, params: params} = swiper, {centeredSlides: centeredSlides} = params;
            if (swiper.allowSlidePrev = !0, swiper.allowSlideNext = !0, swiper.virtual && params.virtual.enabled) return slideTo && (params.centeredSlides || 0 !== swiper.snapIndex ? params.centeredSlides && swiper.snapIndex < params.slidesPerView ? swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, !1, !0) : swiper.snapIndex === swiper.snapGrid.length - 1 && swiper.slideTo(swiper.virtual.slidesBefore, 0, !1, !0) : swiper.slideTo(swiper.virtual.slides.length, 0, !1, !0)), 
            swiper.allowSlidePrev = allowSlidePrev, swiper.allowSlideNext = allowSlideNext, 
            void swiper.emit("loopFix");
            let slidesPerView = params.slidesPerView;
            "auto" === slidesPerView ? slidesPerView = swiper.slidesPerViewDynamic() : (slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10)), 
            centeredSlides && slidesPerView % 2 == 0 && (slidesPerView += 1));
            const slidesPerGroup = params.slidesPerGroupAuto ? slidesPerView : params.slidesPerGroup;
            let loopedSlides = slidesPerGroup;
            loopedSlides % slidesPerGroup != 0 && (loopedSlides += slidesPerGroup - loopedSlides % slidesPerGroup), 
            loopedSlides += params.loopAdditionalSlides, swiper.loopedSlides = loopedSlides;
            const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
            slides.length < slidesPerView + loopedSlides ? showWarning("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters") : gridEnabled && "row" === params.grid.fill && showWarning("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
            const prependSlidesIndexes = [], appendSlidesIndexes = [];
            let activeIndex = swiper.activeIndex;
            void 0 === activeSlideIndex ? activeSlideIndex = swiper.getSlideIndex(slides.filter((el => el.classList.contains(params.slideActiveClass)))[0]) : activeIndex = activeSlideIndex;
            const isNext = "next" === direction || !direction, isPrev = "prev" === direction || !direction;
            let slidesPrepended = 0, slidesAppended = 0;
            const cols = gridEnabled ? Math.ceil(slides.length / params.grid.rows) : slides.length, activeColIndexWithShift = (gridEnabled ? slides[activeSlideIndex].column : activeSlideIndex) + (centeredSlides && void 0 === setTranslate ? -slidesPerView / 2 + .5 : 0);
            // prepend last slides before start
            if (activeColIndexWithShift < loopedSlides) {
                slidesPrepended = Math.max(loopedSlides - activeColIndexWithShift, slidesPerGroup);
                for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
                    const index = i - Math.floor(i / cols) * cols;
                    if (gridEnabled) {
                        const colIndexToPrepend = cols - index - 1;
                        for (let i = slides.length - 1; i >= 0; i -= 1) slides[i].column === colIndexToPrepend && prependSlidesIndexes.push(i);
                        // slides.forEach((slide, slideIndex) => {
                        //   if (slide.column === colIndexToPrepend) prependSlidesIndexes.push(slideIndex);
                        // });
                                        } else prependSlidesIndexes.push(cols - index - 1);
                }
            } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
                slidesAppended = Math.max(activeColIndexWithShift - (cols - 2 * loopedSlides), slidesPerGroup);
                for (let i = 0; i < slidesAppended; i += 1) {
                    const index = i - Math.floor(i / cols) * cols;
                    gridEnabled ? slides.forEach(((slide, slideIndex) => {
                        slide.column === index && appendSlidesIndexes.push(slideIndex);
                    })) : appendSlidesIndexes.push(index);
                }
            }
            if (swiper.__preventObserver__ = !0, requestAnimationFrame((() => {
                swiper.__preventObserver__ = !1;
            })), isPrev && prependSlidesIndexes.forEach((index => {
                slides[index].swiperLoopMoveDOM = !0, slidesEl.prepend(slides[index]), slides[index].swiperLoopMoveDOM = !1;
            })), isNext && appendSlidesIndexes.forEach((index => {
                slides[index].swiperLoopMoveDOM = !0, slidesEl.append(slides[index]), slides[index].swiperLoopMoveDOM = !1;
            })), swiper.recalcSlides(), "auto" === params.slidesPerView ? swiper.updateSlides() : gridEnabled && (prependSlidesIndexes.length > 0 && isPrev || appendSlidesIndexes.length > 0 && isNext) && swiper.slides.forEach(((slide, slideIndex) => {
                swiper.grid.updateSlide(slideIndex, slide, swiper.slides);
            })), params.watchSlidesProgress && swiper.updateSlidesOffset(), slideTo) if (prependSlidesIndexes.length > 0 && isPrev) {
                if (void 0 === slideRealIndex) {
                    const currentSlideTranslate = swiper.slidesGrid[activeIndex], diff = swiper.slidesGrid[activeIndex + slidesPrepended] - currentSlideTranslate;
                    byMousewheel ? swiper.setTranslate(swiper.translate - diff) : (swiper.slideTo(activeIndex + slidesPrepended, 0, !1, !0), 
                    setTranslate && (swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff, 
                    swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff));
                } else if (setTranslate) {
                    const shift = gridEnabled ? prependSlidesIndexes.length / params.grid.rows : prependSlidesIndexes.length;
                    swiper.slideTo(swiper.activeIndex + shift, 0, !1, !0), swiper.touchEventsData.currentTranslate = swiper.translate;
                }
            } else if (appendSlidesIndexes.length > 0 && isNext) if (void 0 === slideRealIndex) {
                const currentSlideTranslate = swiper.slidesGrid[activeIndex], diff = swiper.slidesGrid[activeIndex - slidesAppended] - currentSlideTranslate;
                byMousewheel ? swiper.setTranslate(swiper.translate - diff) : (swiper.slideTo(activeIndex - slidesAppended, 0, !1, !0), 
                setTranslate && (swiper.touchEventsData.startTranslate = swiper.touchEventsData.startTranslate - diff, 
                swiper.touchEventsData.currentTranslate = swiper.touchEventsData.currentTranslate - diff));
            } else {
                const shift = gridEnabled ? appendSlidesIndexes.length / params.grid.rows : appendSlidesIndexes.length;
                swiper.slideTo(swiper.activeIndex - shift, 0, !1, !0);
            }
            if (swiper.allowSlidePrev = allowSlidePrev, swiper.allowSlideNext = allowSlideNext, 
            swiper.controller && swiper.controller.control && !byController) {
                const loopParams = {
                    slideRealIndex: slideRealIndex,
                    direction: direction,
                    setTranslate: setTranslate,
                    activeSlideIndex: activeSlideIndex,
                    byController: !0
                };
                Array.isArray(swiper.controller.control) ? swiper.controller.control.forEach((c => {
                    !c.destroyed && c.params.loop && c.loopFix({
                        ...loopParams,
                        slideTo: c.params.slidesPerView === params.slidesPerView && slideTo
                    });
                })) : swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop && swiper.controller.control.loopFix({
                    ...loopParams,
                    slideTo: swiper.controller.control.params.slidesPerView === params.slidesPerView && slideTo
                });
            }
            swiper.emit("loopFix");
        },
        loopDestroy: function() {
            const {params: params, slidesEl: slidesEl} = this;
            if (!params.loop || this.virtual && this.params.virtual.enabled) return;
            this.recalcSlides();
            const newSlidesOrder = [];
            this.slides.forEach((slideEl => {
                const index = void 0 === slideEl.swiperSlideIndex ? 1 * slideEl.getAttribute("data-swiper-slide-index") : slideEl.swiperSlideIndex;
                newSlidesOrder[index] = slideEl;
            })), this.slides.forEach((slideEl => {
                slideEl.removeAttribute("data-swiper-slide-index");
            })), newSlidesOrder.forEach((slideEl => {
                slidesEl.append(slideEl);
            })), this.recalcSlides(), this.slideTo(this.realIndex, 0);
        }
    };
    function preventEdgeSwipe(swiper, event, startX) {
        const window = getWindow(), {params: params} = swiper, edgeSwipeDetection = params.edgeSwipeDetection, edgeSwipeThreshold = params.edgeSwipeThreshold;
        return !edgeSwipeDetection || !(startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold) || "prevent" === edgeSwipeDetection && (event.preventDefault(), 
        !0);
    }
    function onTouchStart(event) {
        const swiper = this, document = getDocument();
        let e = event;
        e.originalEvent && (e = e.originalEvent);
        const data = swiper.touchEventsData;
        if ("pointerdown" === e.type) {
            if (null !== data.pointerId && data.pointerId !== e.pointerId) return;
            data.pointerId = e.pointerId;
        } else "touchstart" === e.type && 1 === e.targetTouches.length && (data.touchId = e.targetTouches[0].identifier);
        if ("touchstart" === e.type) 
        // don't proceed touch event
        return void preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
        const {params: params, touches: touches, enabled: enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && "mouse" === e.pointerType) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        !swiper.animating && params.cssMode && params.loop && swiper.loopFix();
        let targetEl = e.target;
        if ("wrapper" === params.touchEventsTarget && !swiper.wrapperEl.contains(targetEl)) return;
        if ("which" in e && 3 === e.which) return;
        if ("button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        // change target el for shadow root component
                const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass, eventPath = e.composedPath ? e.composedPath() : e.path;
        // eslint-disable-next-line
                swipingClassHasValue && e.target && e.target.shadowRoot && eventPath && (targetEl = eventPath[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`, isTargetShadow = !(!e.target || !e.target.shadowRoot);
        // use closestElement for shadow root element to get the actual closest for nested shadow root element
        if (params.noSwiping && (isTargetShadow ? 
        // Modified from https://stackoverflow.com/questions/54520554/custom-element-getrootnode-closest-function-crossing-multiple-parent-shadowd
        function(selector, base) {
            return void 0 === base && (base = this), function __closestFrom(el) {
                if (!el || el === getDocument() || el === getWindow()) return null;
                el.assignedSlot && (el = el.assignedSlot);
                const found = el.closest(selector);
                return found || el.getRootNode ? found || __closestFrom(el.getRootNode().host) : null;
            }(base);
        }(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) return void (swiper.allowClick = !0);
        if (params.swipeHandler && !targetEl.closest(params.swipeHandler)) return;
        touches.currentX = e.pageX, touches.currentY = e.pageY;
        const startX = touches.currentX, startY = touches.currentY;
        // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore
        if (!preventEdgeSwipe(swiper, e, startX)) return;
        Object.assign(data, {
            isTouched: !0,
            isMoved: !1,
            allowTouchCallbacks: !0,
            isScrolling: void 0,
            startMoving: void 0
        }), touches.startX = startX, touches.startY = startY, data.touchStartTime = now(), 
        swiper.allowClick = !0, swiper.updateSize(), swiper.swipeDirection = void 0, params.threshold > 0 && (data.allowThresholdMove = !1);
        let preventDefault = !0;
        targetEl.matches(data.focusableElements) && (preventDefault = !1, "SELECT" === targetEl.nodeName && (data.isTouched = !1)), 
        document.activeElement && document.activeElement.matches(data.focusableElements) && document.activeElement !== targetEl && document.activeElement.blur();
        const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
        !params.touchStartForcePreventDefault && !shouldPreventDefault || targetEl.isContentEditable || e.preventDefault(), 
        params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode && swiper.freeMode.onTouchStart(), 
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = getDocument(), swiper = this, data = swiper.touchEventsData, {params: params, touches: touches, rtlTranslate: rtl, enabled: enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && "mouse" === event.pointerType) return;
        let targetTouch, e = event;
        if (e.originalEvent && (e = e.originalEvent), "pointermove" === e.type) {
            if (null !== data.touchId) return;
 // return from pointer if we use touch
                        if (e.pointerId !== data.pointerId) return;
        }
        if ("touchmove" === e.type) {
            if (targetTouch = [ ...e.changedTouches ].filter((t => t.identifier === data.touchId))[0], 
            !targetTouch || targetTouch.identifier !== data.touchId) return;
        } else targetTouch = e;
        if (!data.isTouched) return void (data.startMoving && data.isScrolling && swiper.emit("touchMoveOpposite", e));
        const pageX = targetTouch.pageX, pageY = targetTouch.pageY;
        if (e.preventedByNestedSwiper) return touches.startX = pageX, void (touches.startY = pageY);
        if (!swiper.allowTouchMove) return e.target.matches(data.focusableElements) || (swiper.allowClick = !1), 
        void (data.isTouched && (Object.assign(touches, {
            startX: pageX,
            startY: pageY,
            currentX: pageX,
            currentY: pageY
        }), data.touchStartTime = now()));
        if (params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            // Vertical
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) return data.isTouched = !1, 
            void (data.isMoved = !1);
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (document.activeElement && e.target === document.activeElement && e.target.matches(data.focusableElements)) return data.isMoved = !0, 
        void (swiper.allowClick = !1);
        data.allowTouchCallbacks && swiper.emit("touchMove", e), touches.previousX = touches.currentX, 
        touches.previousY = touches.currentY, touches.currentX = pageX, touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX, diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if (void 0 === data.isScrolling) {
            let touchAngle;
            swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX ? data.isScrolling = !1 : 
            // eslint-disable-next-line
            diffX * diffX + diffY * diffY >= 25 && (touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI, 
            data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle);
        }
        if (data.isScrolling && swiper.emit("touchMoveOpposite", e), void 0 === data.startMoving && (touches.currentX === touches.startX && touches.currentY === touches.startY || (data.startMoving = !0)), 
        data.isScrolling) return void (data.isTouched = !1);
        if (!data.startMoving) return;
        swiper.allowClick = !1, !params.cssMode && e.cancelable && e.preventDefault(), params.touchMoveStopPropagation && !params.nested && e.stopPropagation();
        let diff = swiper.isHorizontal() ? diffX : diffY, touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
        params.oneWayMovement && (diff = Math.abs(diff) * (rtl ? 1 : -1), touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1)), 
        touches.diff = diff, diff *= params.touchRatio, rtl && (diff = -diff, touchesDiff = -touchesDiff);
        const prevTouchesDirection = swiper.touchesDirection;
        swiper.swipeDirection = diff > 0 ? "prev" : "next", swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
        const isLoop = swiper.params.loop && !params.cssMode, allowLoopFix = "next" === swiper.touchesDirection && swiper.allowSlideNext || "prev" === swiper.touchesDirection && swiper.allowSlidePrev;
        if (!data.isMoved) {
            if (isLoop && allowLoopFix && swiper.loopFix({
                direction: swiper.swipeDirection
            }), data.startTranslate = swiper.getTranslate(), swiper.setTransition(0), swiper.animating) {
                const evt = new window.CustomEvent("transitionend", {
                    bubbles: !0,
                    cancelable: !0
                });
                swiper.wrapperEl.dispatchEvent(evt);
            }
            data.allowMomentumBounce = !1, 
            // Grab Cursor
            !params.grabCursor || !0 !== swiper.allowSlideNext && !0 !== swiper.allowSlidePrev || swiper.setGrabCursor(!0), 
            swiper.emit("sliderFirstMove", e);
        }
        if ((new Date).getTime(), data.isMoved && data.allowThresholdMove && prevTouchesDirection !== swiper.touchesDirection && isLoop && allowLoopFix && Math.abs(diff) >= 1) return Object.assign(touches, {
            startX: pageX,
            startY: pageY,
            currentX: pageX,
            currentY: pageY,
            startTranslate: data.currentTranslate
        }), data.loopSwapReset = !0, void (data.startTranslate = data.currentTranslate);
        swiper.emit("sliderMove", e), data.isMoved = !0, data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = !0, resistanceRatio = params.resistanceRatio;
        // Threshold
        if (params.touchReleaseOnEdges && (resistanceRatio = 0), diff > 0 ? (isLoop && allowLoopFix && data.allowThresholdMove && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.slidesSizesGrid[swiper.activeIndex + 1] : swiper.minTranslate()) && swiper.loopFix({
            direction: "prev",
            setTranslate: !0,
            activeSlideIndex: 0
        }), data.currentTranslate > swiper.minTranslate() && (disableParentSwiper = !1, 
        params.resistance && (data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio))) : diff < 0 && (isLoop && allowLoopFix && data.allowThresholdMove && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] : swiper.maxTranslate()) && swiper.loopFix({
            direction: "next",
            setTranslate: !0,
            activeSlideIndex: swiper.slides.length - ("auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
        }), data.currentTranslate < swiper.maxTranslate() && (disableParentSwiper = !1, 
        params.resistance && (data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio))), 
        disableParentSwiper && (e.preventedByNestedSwiper = !0), 
        // Directions locks
        !swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate && (data.currentTranslate = data.startTranslate), 
        !swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate && (data.currentTranslate = data.startTranslate), 
        swiper.allowSlidePrev || swiper.allowSlideNext || (data.currentTranslate = data.startTranslate), 
        params.threshold > 0) {
            if (!(Math.abs(diff) > params.threshold || data.allowThresholdMove)) return void (data.currentTranslate = data.startTranslate);
            if (!data.allowThresholdMove) return data.allowThresholdMove = !0, touches.startX = touches.currentX, 
            touches.startY = touches.currentY, data.currentTranslate = data.startTranslate, 
            void (touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY);
        }
        params.followFinger && !params.cssMode && (
        // Update active index in free mode
        (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) && (swiper.updateActiveIndex(), 
        swiper.updateSlidesClasses()), params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.freeMode.onTouchMove(), 
        // Update progress
        swiper.updateProgress(data.currentTranslate), 
        // Update translate
        swiper.setTranslate(data.currentTranslate));
    }
    function onTouchEnd(event) {
        const swiper = this, data = swiper.touchEventsData;
        let targetTouch, e = event;
        e.originalEvent && (e = e.originalEvent);
        if ("touchend" === e.type || "touchcancel" === e.type) {
            if (targetTouch = [ ...e.changedTouches ].filter((t => t.identifier === data.touchId))[0], 
            !targetTouch || targetTouch.identifier !== data.touchId) return;
        } else {
            if (null !== data.touchId) return;
 // return from pointer if we use touch
                        if (e.pointerId !== data.pointerId) return;
            targetTouch = e;
        }
        if ([ "pointercancel", "pointerout", "pointerleave", "contextmenu" ].includes(e.type)) {
            if (!([ "pointercancel", "contextmenu" ].includes(e.type) && (swiper.browser.isSafari || swiper.browser.isWebView))) return;
        }
        data.pointerId = null, data.touchId = null;
        const {params: params, touches: touches, rtlTranslate: rtl, slidesGrid: slidesGrid, enabled: enabled} = swiper;
        if (!enabled) return;
        if (!params.simulateTouch && "mouse" === e.pointerType) return;
        if (data.allowTouchCallbacks && swiper.emit("touchEnd", e), data.allowTouchCallbacks = !1, 
        !data.isTouched) return data.isMoved && params.grabCursor && swiper.setGrabCursor(!1), 
        data.isMoved = !1, void (data.startMoving = !1);
        // Return Grab Cursor
                params.grabCursor && data.isMoved && data.isTouched && (!0 === swiper.allowSlideNext || !0 === swiper.allowSlidePrev) && swiper.setGrabCursor(!1);
        // Time diff
                const touchEndTime = now(), timeDiff = touchEndTime - data.touchStartTime;
        // Tap, doubleTap, Click
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target, pathTree), swiper.emit("tap click", e), 
            timeDiff < 300 && touchEndTime - data.lastClickTime < 300 && swiper.emit("doubleTap doubleClick", e);
        }
        if (data.lastClickTime = now(), nextTick((() => {
            swiper.destroyed || (swiper.allowClick = !0);
        })), !data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff && !data.loopSwapReset || data.currentTranslate === data.startTranslate && !data.loopSwapReset) return data.isTouched = !1, 
        data.isMoved = !1, void (data.startMoving = !1);
        let currentPos;
        if (data.isTouched = !1, data.isMoved = !1, data.startMoving = !1, currentPos = params.followFinger ? rtl ? swiper.translate : -swiper.translate : -data.currentTranslate, 
        params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled) return void swiper.freeMode.onTouchEnd({
            currentPos: currentPos
        });
        // Find current slide
                const swipeToLast = currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
        let stopIndex = 0, groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            void 0 !== slidesGrid[i + increment] ? (swipeToLast || currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) && (stopIndex = i, 
            groupSize = slidesGrid[i + increment] - slidesGrid[i]) : (swipeToLast || currentPos >= slidesGrid[i]) && (stopIndex = i, 
            groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2]);
        }
        let rewindFirstIndex = null, rewindLastIndex = null;
        params.rewind && (swiper.isBeginning ? rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1 : swiper.isEnd && (rewindFirstIndex = 0));
        // Find current slide size
                const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize, increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            // Long touches
            if (!params.longSwipes) return void swiper.slideTo(swiper.activeIndex);
            "next" === swiper.swipeDirection && (ratio >= params.longSwipesRatio ? swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment) : swiper.slideTo(stopIndex)), 
            "prev" === swiper.swipeDirection && (ratio > 1 - params.longSwipesRatio ? swiper.slideTo(stopIndex + increment) : null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio ? swiper.slideTo(rewindLastIndex) : swiper.slideTo(stopIndex));
        } else {
            // Short swipes
            if (!params.shortSwipes) return void swiper.slideTo(swiper.activeIndex);
            swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl) ? e.target === swiper.navigation.nextEl ? swiper.slideTo(stopIndex + increment) : swiper.slideTo(stopIndex) : ("next" === swiper.swipeDirection && swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment), 
            "prev" === swiper.swipeDirection && swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex));
        }
    }
    function onResize() {
        const swiper = this, {params: params, el: el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        // Breakpoints
                params.breakpoints && swiper.setBreakpoint();
        // Save locks
                const {allowSlideNext: allowSlideNext, allowSlidePrev: allowSlidePrev, snapGrid: snapGrid} = swiper, isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        // Disable locks on resize
        swiper.allowSlideNext = !0, swiper.allowSlidePrev = !0, swiper.updateSize(), swiper.updateSlides(), 
        swiper.updateSlidesClasses();
        const isVirtualLoop = isVirtual && params.loop;
        !("auto" === params.slidesPerView || params.slidesPerView > 1) || !swiper.isEnd || swiper.isBeginning || swiper.params.centeredSlides || isVirtualLoop ? swiper.params.loop && !isVirtual ? swiper.slideToLoop(swiper.realIndex, 0, !1, !0) : swiper.slideTo(swiper.activeIndex, 0, !1, !0) : swiper.slideTo(swiper.slides.length - 1, 0, !1, !0), 
        swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused && (clearTimeout(swiper.autoplay.resizeTimeout), 
        swiper.autoplay.resizeTimeout = setTimeout((() => {
            swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused && swiper.autoplay.resume();
        }), 500)), 
        // Return locks after resize
        swiper.allowSlidePrev = allowSlidePrev, swiper.allowSlideNext = allowSlideNext, 
        swiper.params.watchOverflow && snapGrid !== swiper.snapGrid && swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        swiper.enabled && (swiper.allowClick || (swiper.params.preventClicks && e.preventDefault(), 
        swiper.params.preventClicksPropagation && swiper.animating && (e.stopPropagation(), 
        e.stopImmediatePropagation())));
    }
    function onScroll() {
        const swiper = this, {wrapperEl: wrapperEl, rtlTranslate: rtlTranslate, enabled: enabled} = swiper;
        if (!enabled) return;
        let newProgress;
        swiper.previousTranslate = swiper.translate, swiper.isHorizontal() ? swiper.translate = -wrapperEl.scrollLeft : swiper.translate = -wrapperEl.scrollTop, 
        // eslint-disable-next-line
        0 === swiper.translate && (swiper.translate = 0), swiper.updateActiveIndex(), swiper.updateSlidesClasses();
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        newProgress = 0 === translatesDiff ? 0 : (swiper.translate - swiper.minTranslate()) / translatesDiff, 
        newProgress !== swiper.progress && swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate), 
        swiper.emit("setTranslate", swiper.translate, !1);
    }
    function onLoad(e) {
        processLazyPreloader(this, e.target), this.params.cssMode || "auto" !== this.params.slidesPerView && !this.params.autoHeight || this.update();
    }
    function onDocumentTouchStart() {
        const swiper = this;
        swiper.documentTouchHandlerProceeded || (swiper.documentTouchHandlerProceeded = !0, 
        swiper.params.touchReleaseOnEdges && (swiper.el.style.touchAction = "auto"));
    }
    const events = (swiper, method) => {
        const document = getDocument(), {params: params, el: el, wrapperEl: wrapperEl, device: device} = swiper, capture = !!params.nested, domMethod = "on" === method ? "addEventListener" : "removeEventListener", swiperMethod = method;
        // Touch Events
        document[domMethod]("touchstart", swiper.onDocumentTouchStart, {
            passive: !1,
            capture: capture
        }), el[domMethod]("touchstart", swiper.onTouchStart, {
            passive: !1
        }), el[domMethod]("pointerdown", swiper.onTouchStart, {
            passive: !1
        }), document[domMethod]("touchmove", swiper.onTouchMove, {
            passive: !1,
            capture: capture
        }), document[domMethod]("pointermove", swiper.onTouchMove, {
            passive: !1,
            capture: capture
        }), document[domMethod]("touchend", swiper.onTouchEnd, {
            passive: !0
        }), document[domMethod]("pointerup", swiper.onTouchEnd, {
            passive: !0
        }), document[domMethod]("pointercancel", swiper.onTouchEnd, {
            passive: !0
        }), document[domMethod]("touchcancel", swiper.onTouchEnd, {
            passive: !0
        }), document[domMethod]("pointerout", swiper.onTouchEnd, {
            passive: !0
        }), document[domMethod]("pointerleave", swiper.onTouchEnd, {
            passive: !0
        }), document[domMethod]("contextmenu", swiper.onTouchEnd, {
            passive: !0
        }), 
        // Prevent Links Clicks
        (params.preventClicks || params.preventClicksPropagation) && el[domMethod]("click", swiper.onClick, !0), 
        params.cssMode && wrapperEl[domMethod]("scroll", swiper.onScroll), 
        // Resize handler
        params.updateOnWindowResize ? swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, !0) : swiper[swiperMethod]("observerUpdate", onResize, !0), 
        // Images loader
        el[domMethod]("load", swiper.onLoad, {
            capture: !0
        });
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    var defaults = {
        init: !0,
        direction: "horizontal",
        oneWayMovement: !1,
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: !1,
        updateOnWindowResize: !0,
        resizeObserver: !0,
        nested: !1,
        createElements: !1,
        eventsPrefix: "swiper",
        enabled: !0,
        focusableElements: "input, select, option, textarea, button, video, label",
        // Overrides
        width: null,
        height: null,
        preventInteractionOnTransition: !1,
        // ssr
        userAgent: null,
        url: null,
        // To support iOS's swipe-to-go-back gesture (when being used in-app).
        edgeSwipeDetection: !1,
        edgeSwipeThreshold: 20,
        // Autoheight
        autoHeight: !1,
        // Set wrapper width
        setWrapperSize: !1,
        // Virtual Translate
        virtualTranslate: !1,
        // Effects
        effect: "slide",
        // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
        // Breakpoints
        breakpoints: void 0,
        breakpointsBase: "window",
        // Slides grid
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: !1,
        centeredSlides: !1,
        centeredSlidesBounds: !1,
        slidesOffsetBefore: 0,
        // in px
        slidesOffsetAfter: 0,
        // in px
        normalizeSlideIndex: !0,
        centerInsufficientSlides: !1,
        // Disable swiper and hide navigation when container not overflow
        watchOverflow: !0,
        // Round length
        roundLengths: !1,
        // Touches
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: !0,
        shortSwipes: !0,
        longSwipes: !0,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: !0,
        allowTouchMove: !0,
        threshold: 5,
        touchMoveStopPropagation: !1,
        touchStartPreventDefault: !0,
        touchStartForcePreventDefault: !1,
        touchReleaseOnEdges: !1,
        // Unique Navigation Elements
        uniqueNavElements: !0,
        // Resistance
        resistance: !0,
        resistanceRatio: .85,
        // Progress
        watchSlidesProgress: !1,
        // Cursor
        grabCursor: !1,
        // Clicks
        preventClicks: !0,
        preventClicksPropagation: !0,
        slideToClickedSlide: !1,
        // loop
        loop: !1,
        loopAddBlankSlides: !0,
        loopAdditionalSlides: 0,
        loopPreventsSliding: !0,
        // rewind
        rewind: !1,
        // Swiping/no swiping
        allowSlidePrev: !0,
        allowSlideNext: !0,
        swipeHandler: null,
        // '.swipe-handler',
        noSwiping: !0,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        // Passive Listeners
        passiveListeners: !0,
        maxBackfaceHiddenSlides: 10,
        // NS
        containerModifierClass: "swiper-",
        // NEW
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-blank",
        slideActiveClass: "swiper-slide-active",
        slideVisibleClass: "swiper-slide-visible",
        slideFullyVisibleClass: "swiper-slide-fully-visible",
        slideNextClass: "swiper-slide-next",
        slidePrevClass: "swiper-slide-prev",
        wrapperClass: "swiper-wrapper",
        lazyPreloaderClass: "swiper-lazy-preloader",
        lazyPreloadPrevNext: 0,
        // Callbacks
        runCallbacksOnInit: !0,
        // Internals
        _emitClasses: !1
    };
    function moduleExtendParams(params, allModulesParams) {
        return function(obj) {
            void 0 === obj && (obj = {});
            const moduleParamName = Object.keys(obj)[0], moduleParams = obj[moduleParamName];
            "object" == typeof moduleParams && null !== moduleParams ? (!0 === params[moduleParamName] && (params[moduleParamName] = {
                enabled: !0
            }), "navigation" === moduleParamName && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].prevEl && !params[moduleParamName].nextEl && (params[moduleParamName].auto = !0), 
            [ "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && params[moduleParamName] && params[moduleParamName].enabled && !params[moduleParamName].el && (params[moduleParamName].auto = !0), 
            moduleParamName in params && "enabled" in moduleParams ? ("object" != typeof params[moduleParamName] || "enabled" in params[moduleParamName] || (params[moduleParamName].enabled = !0), 
            params[moduleParamName] || (params[moduleParamName] = {
                enabled: !1
            }), extend(allModulesParams, obj)) : extend(allModulesParams, obj)) : extend(allModulesParams, obj);
        };
    }
    /* eslint no-param-reassign: "off" */    const prototypes = {
        eventsEmitter: eventsEmitter,
        update: update,
        translate: translate,
        transition: {
            setTransition: function(duration, byController) {
                const swiper = this;
                swiper.params.cssMode || (swiper.wrapperEl.style.transitionDuration = `${duration}ms`, 
                swiper.wrapperEl.style.transitionDelay = 0 === duration ? "0ms" : ""), swiper.emit("setTransition", duration, byController);
            },
            transitionStart: function(runCallbacks, direction) {
                void 0 === runCallbacks && (runCallbacks = !0);
                const swiper = this, {params: params} = swiper;
                params.cssMode || (params.autoHeight && swiper.updateAutoHeight(), transitionEmit({
                    swiper: swiper,
                    runCallbacks: runCallbacks,
                    direction: direction,
                    step: "Start"
                }));
            },
            transitionEnd: function(runCallbacks, direction) {
                void 0 === runCallbacks && (runCallbacks = !0);
                const {params: params} = this;
                this.animating = !1, params.cssMode || (this.setTransition(0), transitionEmit({
                    swiper: this,
                    runCallbacks: runCallbacks,
                    direction: direction,
                    step: "End"
                }));
            }
        },
        slide: slide,
        loop: loop,
        grabCursor: {
            setGrabCursor: function(moving) {
                const swiper = this;
                if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
                const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
                swiper.isElement && (swiper.__preventObserver__ = !0), el.style.cursor = "move", 
                el.style.cursor = moving ? "grabbing" : "grab", swiper.isElement && requestAnimationFrame((() => {
                    swiper.__preventObserver__ = !1;
                }));
            },
            unsetGrabCursor: function() {
                const swiper = this;
                swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode || (swiper.isElement && (swiper.__preventObserver__ = !0), 
                swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "", 
                swiper.isElement && requestAnimationFrame((() => {
                    swiper.__preventObserver__ = !1;
                })));
            }
        },
        events: {
            attachEvents: function() {
                const swiper = this, {params: params} = swiper;
                swiper.onTouchStart = onTouchStart.bind(swiper), swiper.onTouchMove = onTouchMove.bind(swiper), 
                swiper.onTouchEnd = onTouchEnd.bind(swiper), swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper), 
                params.cssMode && (swiper.onScroll = onScroll.bind(swiper)), swiper.onClick = onClick.bind(swiper), 
                swiper.onLoad = onLoad.bind(swiper), events(swiper, "on");
            },
            detachEvents: function() {
                events(this, "off");
            }
        },
        breakpoints: {
            setBreakpoint: function() {
                const swiper = this, {realIndex: realIndex, initialized: initialized, params: params, el: el} = swiper, breakpoints = params.breakpoints;
                if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
                // Get breakpoint for window width and update parameters
                                const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
                if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
                const breakpointParams = (breakpoint in breakpoints ? breakpoints[breakpoint] : void 0) || swiper.originalParams, wasMultiRow = isGridEnabled(swiper, params), isMultiRow = isGridEnabled(swiper, breakpointParams), wasEnabled = params.enabled;
                wasMultiRow && !isMultiRow ? (el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`), 
                swiper.emitContainerClasses()) : !wasMultiRow && isMultiRow && (el.classList.add(`${params.containerModifierClass}grid`), 
                (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) && el.classList.add(`${params.containerModifierClass}grid-column`), 
                swiper.emitContainerClasses()), 
                // Toggle navigation, pagination, scrollbar
                [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
                    if (void 0 === breakpointParams[prop]) return;
                    const wasModuleEnabled = params[prop] && params[prop].enabled, isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
                    wasModuleEnabled && !isModuleEnabled && swiper[prop].disable(), !wasModuleEnabled && isModuleEnabled && swiper[prop].enable();
                }));
                const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction, needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged), wasLoop = params.loop;
                directionChanged && initialized && swiper.changeDirection(), extend(swiper.params, breakpointParams);
                const isEnabled = swiper.params.enabled, hasLoop = swiper.params.loop;
                Object.assign(swiper, {
                    allowTouchMove: swiper.params.allowTouchMove,
                    allowSlideNext: swiper.params.allowSlideNext,
                    allowSlidePrev: swiper.params.allowSlidePrev
                }), wasEnabled && !isEnabled ? swiper.disable() : !wasEnabled && isEnabled && swiper.enable(), 
                swiper.currentBreakpoint = breakpoint, swiper.emit("_beforeBreakpoint", breakpointParams), 
                initialized && (needsReLoop ? (swiper.loopDestroy(), swiper.loopCreate(realIndex), 
                swiper.updateSlides()) : !wasLoop && hasLoop ? (swiper.loopCreate(realIndex), swiper.updateSlides()) : wasLoop && !hasLoop && swiper.loopDestroy()), 
                swiper.emit("breakpoint", breakpointParams);
            },
            getBreakpoint: function(breakpoints, base, containerEl) {
                if (void 0 === base && (base = "window"), !breakpoints || "container" === base && !containerEl) return;
                let breakpoint = !1;
                const window = getWindow(), currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight, points = Object.keys(breakpoints).map((point => {
                    if ("string" == typeof point && 0 === point.indexOf("@")) {
                        const minRatio = parseFloat(point.substr(1));
                        return {
                            value: currentHeight * minRatio,
                            point: point
                        };
                    }
                    return {
                        value: point,
                        point: point
                    };
                }));
                points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
                for (let i = 0; i < points.length; i += 1) {
                    const {point: point, value: value} = points[i];
                    "window" === base ? window.matchMedia(`(min-width: ${value}px)`).matches && (breakpoint = point) : value <= containerEl.clientWidth && (breakpoint = point);
                }
                return breakpoint || "max";
            }
        },
        checkOverflow: {
            checkOverflow: function() {
                const swiper = this, {isLocked: wasLocked, params: params} = swiper, {slidesOffsetBefore: slidesOffsetBefore} = params;
                if (slidesOffsetBefore) {
                    const lastSlideIndex = swiper.slides.length - 1, lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
                    swiper.isLocked = swiper.size > lastSlideRightEdge;
                } else swiper.isLocked = 1 === swiper.snapGrid.length;
                !0 === params.allowSlideNext && (swiper.allowSlideNext = !swiper.isLocked), !0 === params.allowSlidePrev && (swiper.allowSlidePrev = !swiper.isLocked), 
                wasLocked && wasLocked !== swiper.isLocked && (swiper.isEnd = !1), wasLocked !== swiper.isLocked && swiper.emit(swiper.isLocked ? "lock" : "unlock");
            }
        },
        classes: {
            addClasses: function() {
                const {classNames: classNames, params: params, rtl: rtl, el: el, device: device} = this, suffixes = function(entries, prefix) {
                    const resultClasses = [];
                    return entries.forEach((item => {
                        "object" == typeof item ? Object.keys(item).forEach((classNames => {
                            item[classNames] && resultClasses.push(prefix + classNames);
                        })) : "string" == typeof item && resultClasses.push(prefix + item);
                    })), resultClasses;
                }([ "initialized", params.direction, {
                    "free-mode": this.params.freeMode && params.freeMode.enabled
                }, {
                    autoheight: params.autoHeight
                }, {
                    rtl: rtl
                }, {
                    grid: params.grid && params.grid.rows > 1
                }, {
                    "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
                }, {
                    android: device.android
                }, {
                    ios: device.ios
                }, {
                    "css-mode": params.cssMode
                }, {
                    centered: params.cssMode && params.centeredSlides
                }, {
                    "watch-progress": params.watchSlidesProgress
                } ], params.containerModifierClass);
                classNames.push(...suffixes), el.classList.add(...classNames), this.emitContainerClasses();
            },
            removeClasses: function() {
                const {el: el, classNames: classNames} = this;
                el.classList.remove(...classNames), this.emitContainerClasses();
            }
        }
    }, extendedDefaults = {};
    class Swiper {
        constructor() {
            let el, params;
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1) ? params = args[0] : [el, params] = args, 
            params || (params = {}), params = extend({}, params), el && !params.el && (params.el = el);
            const document = getDocument();
            if (params.el && "string" == typeof params.el && document.querySelectorAll(params.el).length > 1) {
                const swipers = [];
                // eslint-disable-next-line no-constructor-return
                return document.querySelectorAll(params.el).forEach((containerEl => {
                    const newParams = extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new Swiper(newParams));
                })), swipers;
            }
            // Swiper Instance
                        const swiper = this;
            swiper.__swiper__ = !0, swiper.support = getSupport(), swiper.device = getDevice({
                userAgent: params.userAgent
            }), swiper.browser = getBrowser(), swiper.eventsListeners = {}, swiper.eventsAnyListeners = [], 
            swiper.modules = [ ...swiper.__modules__ ], params.modules && Array.isArray(params.modules) && swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    params: params,
                    swiper: swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            // Extend defaults with modules params
            const swiperParams = extend({}, defaults, allModulesParams);
            // Extend defaults with passed params
                        // Return app instance
            // eslint-disable-next-line no-constructor-return
            return swiper.params = extend({}, swiperParams, extendedDefaults, params), swiper.originalParams = extend({}, swiper.params), 
            swiper.passedParams = extend({}, params), 
            // add event listeners
            swiper.params && swiper.params.on && Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            })), swiper.params && swiper.params.onAny && swiper.onAny(swiper.params.onAny), 
            // Extend Swiper
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el: el,
                // Classes
                classNames: [],
                // Slides
                slides: [],
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                // isDirection
                isHorizontal: () => "horizontal" === swiper.params.direction,
                isVertical: () => "vertical" === swiper.params.direction,
                // Indexes
                activeIndex: 0,
                realIndex: 0,
                isBeginning: !0,
                isEnd: !1,
                // Props
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: !1,
                cssOverflowAdjustment() {
                    // Returns 0 unless `translate` is > 2**23
                    // Should be subtracted from css values to prevent overflow
                    return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
                },
                // Locks
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                // Touch Events
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    // Form elements to match
                    focusableElements: swiper.params.focusableElements,
                    // Last click time
                    lastClickTime: 0,
                    clickTimeout: void 0,
                    // Velocities
                    velocities: [],
                    allowMomentumBounce: void 0,
                    startMoving: void 0,
                    pointerId: null,
                    touchId: null
                },
                // Clicks
                allowClick: !0,
                // Touches
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                // Images
                imagesToLoad: [],
                imagesLoaded: 0
            }), swiper.emit("_swiper"), 
            // Init
            swiper.params.init && swiper.init(), swiper;
        }
        getDirectionLabel(property) {
            return this.isHorizontal() ? property : {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
            // prettier-ignore
                }
        getSlideIndex(slideEl) {
            const {slidesEl: slidesEl, params: params} = this, firstSlideIndex = elementIndex(elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`)[0]);
            return elementIndex(slideEl) - firstSlideIndex;
        }
        getSlideIndexByData(index) {
            return this.getSlideIndex(this.slides.filter((slideEl => 1 * slideEl.getAttribute("data-swiper-slide-index") === index))[0]);
        }
        recalcSlides() {
            const {slidesEl: slidesEl, params: params} = this;
            this.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
        }
        enable() {
            const swiper = this;
            swiper.enabled || (swiper.enabled = !0, swiper.params.grabCursor && swiper.setGrabCursor(), 
            swiper.emit("enable"));
        }
        disable() {
            const swiper = this;
            swiper.enabled && (swiper.enabled = !1, swiper.params.grabCursor && swiper.unsetGrabCursor(), 
            swiper.emit("disable"));
        }
        setProgress(progress, speed) {
            progress = Math.min(Math.max(progress, 0), 1);
            const min = this.minTranslate(), current = (this.maxTranslate() - min) * progress + min;
            this.translateTo(current, void 0 === speed ? 0 : speed), this.updateActiveIndex(), 
            this.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            return swiper.destroyed ? "" : slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.forEach((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl: slideEl,
                    classNames: classNames
                }), swiper.emit("_slideClass", slideEl, classNames);
            })), swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view, exact) {
            void 0 === view && (view = "current"), void 0 === exact && (exact = !1);
            const {params: params, slides: slides, slidesGrid: slidesGrid, slidesSizesGrid: slidesSizesGrid, size: swiperSize, activeIndex: activeIndex} = this;
            let spv = 1;
            if ("number" == typeof params.slidesPerView) return params.slidesPerView;
            if (params.centeredSlides) {
                let breakLoop, slideSize = slides[activeIndex] ? slides[activeIndex].swiperSlideSize : 0;
                for (let i = activeIndex + 1; i < slides.length; i += 1) slides[i] && !breakLoop && (slideSize += slides[i].swiperSlideSize, 
                spv += 1, slideSize > swiperSize && (breakLoop = !0));
                for (let i = activeIndex - 1; i >= 0; i -= 1) slides[i] && !breakLoop && (slideSize += slides[i].swiperSlideSize, 
                spv += 1, slideSize > swiperSize && (breakLoop = !0));
            } else 
            // eslint-disable-next-line
            if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                (exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize) && (spv += 1);
            } else 
            // previous
            for (let i = activeIndex - 1; i >= 0; i -= 1) {
                slidesGrid[activeIndex] - slidesGrid[i] < swiperSize && (spv += 1);
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid: snapGrid, params: params} = swiper;
            // Breakpoints
                        function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate, newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate), swiper.updateActiveIndex(), swiper.updateSlidesClasses();
            }
            let translated;
            if (params.breakpoints && swiper.setBreakpoint(), [ ...swiper.el.querySelectorAll('[loading="lazy"]') ].forEach((imageEl => {
                imageEl.complete && processLazyPreloader(swiper, imageEl);
            })), swiper.updateSize(), swiper.updateSlides(), swiper.updateProgress(), swiper.updateSlidesClasses(), 
            params.freeMode && params.freeMode.enabled && !params.cssMode) setTranslate(), params.autoHeight && swiper.updateAutoHeight(); else {
                if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
                    const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
                    translated = swiper.slideTo(slides.length - 1, 0, !1, !0);
                } else translated = swiper.slideTo(swiper.activeIndex, 0, !1, !0);
                translated || setTranslate();
            }
            params.watchOverflow && snapGrid !== swiper.snapGrid && swiper.checkOverflow(), 
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate) {
            void 0 === needUpdate && (needUpdate = !0);
            const swiper = this, currentDirection = swiper.params.direction;
            return newDirection || (
            // eslint-disable-next-line
            newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal"), newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection || (swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`), 
            swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`), 
            swiper.emitContainerClasses(), swiper.params.direction = newDirection, swiper.slides.forEach((slideEl => {
                "vertical" === newDirection ? slideEl.style.width = "" : slideEl.style.height = "";
            })), swiper.emit("changeDirection"), needUpdate && swiper.update()), swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction || (swiper.rtl = "rtl" === direction, 
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl, swiper.rtl ? (swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`), 
            swiper.el.dir = "rtl") : (swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`), 
            swiper.el.dir = "ltr"), swiper.update());
        }
        mount(element) {
            const swiper = this;
            if (swiper.mounted) return !0;
            // Find el
                        let el = element || swiper.params.el;
            if ("string" == typeof el && (el = document.querySelector(el)), !el) return !1;
            el.swiper = swiper, el.parentNode && el.parentNode.host && "SWIPER-CONTAINER" === el.parentNode.host.nodeName && (swiper.isElement = !0);
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            // Find Wrapper
            let wrapperEl = (() => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    // Children needs to return slot items
                    return el.shadowRoot.querySelector(getWrapperSelector());
                }
                return elementChildren(el, getWrapperSelector())[0];
            })();
            return !wrapperEl && swiper.params.createElements && (wrapperEl = createElement("div", swiper.params.wrapperClass), 
            el.append(wrapperEl), elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl => {
                wrapperEl.append(slideEl);
            }))), Object.assign(swiper, {
                el: el,
                wrapperEl: wrapperEl,
                slidesEl: swiper.isElement && !el.parentNode.host.slideSlots ? el.parentNode.host : wrapperEl,
                hostEl: swiper.isElement ? el.parentNode.host : el,
                mounted: !0,
                // RTL
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === elementStyle(el, "direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === elementStyle(el, "direction")),
                wrongRTL: "-webkit-box" === elementStyle(wrapperEl, "display")
            }), !0;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            if (!1 === swiper.mount(el)) return swiper;
            swiper.emit("beforeInit"), 
            // Set breakpoint
            swiper.params.breakpoints && swiper.setBreakpoint(), 
            // Add Classes
            swiper.addClasses(), 
            // Update size
            swiper.updateSize(), 
            // Update slides
            swiper.updateSlides(), swiper.params.watchOverflow && swiper.checkOverflow(), 
            // Set Grab Cursor
            swiper.params.grabCursor && swiper.enabled && swiper.setGrabCursor(), 
            // Slide To Initial Slide
            swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled ? swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, !1, !0) : swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, !1, !0), 
            // Create loop
            swiper.params.loop && swiper.loopCreate(), 
            // Attach events
            swiper.attachEvents();
            const lazyElements = [ ...swiper.el.querySelectorAll('[loading="lazy"]') ];
            return swiper.isElement && lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]')), 
            lazyElements.forEach((imageEl => {
                imageEl.complete ? processLazyPreloader(swiper, imageEl) : imageEl.addEventListener("load", (e => {
                    processLazyPreloader(swiper, e.target);
                }));
            })), preload(swiper), 
            // Init Flag
            swiper.initialized = !0, preload(swiper), 
            // Emit
            swiper.emit("init"), swiper.emit("afterInit"), swiper;
        }
        destroy(deleteInstance, cleanStyles) {
            void 0 === deleteInstance && (deleteInstance = !0), void 0 === cleanStyles && (cleanStyles = !0);
            const swiper = this, {params: params, el: el, wrapperEl: wrapperEl, slides: slides} = swiper;
            return void 0 === swiper.params || swiper.destroyed || (swiper.emit("beforeDestroy"), 
            // Init Flag
            swiper.initialized = !1, 
            // Detach events
            swiper.detachEvents(), 
            // Destroy loop
            params.loop && swiper.loopDestroy(), 
            // Cleanup styles
            cleanStyles && (swiper.removeClasses(), el.removeAttribute("style"), wrapperEl.removeAttribute("style"), 
            slides && slides.length && slides.forEach((slideEl => {
                slideEl.classList.remove(params.slideVisibleClass, params.slideFullyVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass), 
                slideEl.removeAttribute("style"), slideEl.removeAttribute("data-swiper-slide-index");
            }))), swiper.emit("destroy"), 
            // Detach emitter events
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            })), !1 !== deleteInstance && (swiper.el.swiper = null, function(obj) {
                const object = obj;
                Object.keys(object).forEach((key => {
                    try {
                        object[key] = null;
                    } catch (e) {
                        // no getter for object
                    }
                    try {
                        delete object[key];
                    } catch (e) {
                        // something got wrong
                    }
                }));
            }(swiper)), swiper.destroyed = !0), null;
        }
        static extendDefaults(newDefaults) {
            extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            Swiper.prototype.__modules__ || (Swiper.prototype.__modules__ = []);
            const modules = Swiper.prototype.__modules__;
            "function" == typeof mod && modules.indexOf(mod) < 0 && modules.push(mod);
        }
        static use(module) {
            return Array.isArray(module) ? (module.forEach((m => Swiper.installModule(m))), 
            Swiper) : (Swiper.installModule(module), Swiper);
        }
    }
    function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        return swiper.params.createElements && Object.keys(checkProps).forEach((key => {
            if (!params[key] && !0 === params.auto) {
                let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
                element || (element = createElement("div", checkProps[key]), element.className = checkProps[key], 
                swiper.el.append(element)), params[key] = element, originalParams[key] = element;
            }
        })), params;
    }
    function Navigation(_ref) {
        let {swiper: swiper, extendParams: extendParams, on: on, emit: emit} = _ref;
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: !1,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        }), swiper.navigation = {
            nextEl: null,
            prevEl: null
        };
        const makeElementsArray = el => (Array.isArray(el) ? el : [ el ]).filter((e => !!e));
        function getEl(el) {
            let res;
            return el && "string" == typeof el && swiper.isElement && (res = swiper.el.querySelector(el), 
            res) ? res : (el && ("string" == typeof el && (res = [ ...document.querySelectorAll(el) ]), 
            swiper.params.uniqueNavElements && "string" == typeof el && res.length > 1 && 1 === swiper.el.querySelectorAll(el).length && (res = swiper.el.querySelector(el))), 
            el && !res ? el : res);
        }
        function toggleEl(el, disabled) {
            const params = swiper.params.navigation;
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl && (subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" ")), 
                "BUTTON" === subEl.tagName && (subEl.disabled = disabled), swiper.params.watchOverflow && swiper.enabled && subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass));
            }));
        }
        function update() {
            // Update Navigation Buttons
            const {nextEl: nextEl, prevEl: prevEl} = swiper.navigation;
            if (swiper.params.loop) return toggleEl(prevEl, !1), void toggleEl(nextEl, !1);
            toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind), toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault(), (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) && (swiper.slidePrev(), 
            emit("navigationPrev"));
        }
        function onNextClick(e) {
            e.preventDefault(), (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) && (swiper.slideNext(), 
            emit("navigationNext"));
        }
        function init() {
            const params = swiper.params.navigation;
            if (swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            }), !params.nextEl && !params.prevEl) return;
            let nextEl = getEl(params.nextEl), prevEl = getEl(params.prevEl);
            Object.assign(swiper.navigation, {
                nextEl: nextEl,
                prevEl: prevEl
            }), nextEl = makeElementsArray(nextEl), prevEl = makeElementsArray(prevEl);
            const initButton = (el, dir) => {
                el && el.addEventListener("click", "next" === dir ? onNextClick : onPrevClick), 
                !swiper.enabled && el && el.classList.add(...params.lockClass.split(" "));
            };
            nextEl.forEach((el => initButton(el, "next"))), prevEl.forEach((el => initButton(el, "prev")));
        }
        function destroy() {
            let {nextEl: nextEl, prevEl: prevEl} = swiper.navigation;
            nextEl = makeElementsArray(nextEl), prevEl = makeElementsArray(prevEl);
            const destroyButton = (el, dir) => {
                el.removeEventListener("click", "next" === dir ? onNextClick : onPrevClick), el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
            };
            nextEl.forEach((el => destroyButton(el, "next"))), prevEl.forEach((el => destroyButton(el, "prev")));
        }
        on("init", (() => {
            !1 === swiper.params.navigation.enabled ? 
            // eslint-disable-next-line
            disable() : (init(), update());
        })), on("toEdge fromEdge lock unlock", (() => {
            update();
        })), on("destroy", (() => {
            destroy();
        })), on("enable disable", (() => {
            let {nextEl: nextEl, prevEl: prevEl} = swiper.navigation;
            nextEl = makeElementsArray(nextEl), prevEl = makeElementsArray(prevEl), swiper.enabled ? update() : [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.add(swiper.params.navigation.lockClass)));
        })), on("click", ((_s, e) => {
            let {nextEl: nextEl, prevEl: prevEl} = swiper.navigation;
            nextEl = makeElementsArray(nextEl), prevEl = makeElementsArray(prevEl);
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                nextEl.length ? isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass) : prevEl.length && (isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass)), 
                emit(!0 === isHidden ? "navigationShow" : "navigationHide"), [ ...nextEl, ...prevEl ].filter((el => !!el)).forEach((el => el.classList.toggle(swiper.params.navigation.hiddenClass)));
            }
        }));
        const disable = () => {
            swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" ")), 
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable: () => {
                swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" ")), 
                init(), update();
            },
            disable: disable,
            update: update,
            init: init,
            destroy: destroy
        });
    }
    function classesToSelector(classes) {
        return void 0 === classes && (classes = ""), `.${classes.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
    }
    function Pagination(_ref) {
        let {swiper: swiper, extendParams: extendParams, on: on, emit: emit} = _ref;
        const pfx = "swiper-pagination";
        let bulletSize;
        extendParams({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: !1,
                hideOnClick: !1,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: !1,
                type: "bullets",
                // 'bullets' or 'progressbar' or 'fraction' or 'custom'
                dynamicBullets: !1,
                dynamicMainBullets: 1,
                formatFractionCurrent: number => number,
                formatFractionTotal: number => number,
                bulletClass: `${pfx}-bullet`,
                bulletActiveClass: `${pfx}-bullet-active`,
                modifierClass: `${pfx}-`,
                currentClass: `${pfx}-current`,
                totalClass: `${pfx}-total`,
                hiddenClass: `${pfx}-hidden`,
                progressbarFillClass: `${pfx}-progressbar-fill`,
                progressbarOppositeClass: `${pfx}-progressbar-opposite`,
                clickableClass: `${pfx}-clickable`,
                lockClass: `${pfx}-lock`,
                horizontalClass: `${pfx}-horizontal`,
                verticalClass: `${pfx}-vertical`,
                paginationDisabledClass: `${pfx}-disabled`
            }
        }), swiper.pagination = {
            el: null,
            bullets: []
        };
        let dynamicBulletIndex = 0;
        const makeElementsArray = el => (Array.isArray(el) ? el : [ el ]).filter((e => !!e));
        function isPaginationDisabled() {
            return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && 0 === swiper.pagination.el.length;
        }
        function setSideBullets(bulletEl, position) {
            const {bulletActiveClass: bulletActiveClass} = swiper.params.pagination;
            bulletEl && (bulletEl = bulletEl[("prev" === position ? "previous" : "next") + "ElementSibling"]) && (bulletEl.classList.add(`${bulletActiveClass}-${position}`), 
            (bulletEl = bulletEl[("prev" === position ? "previous" : "next") + "ElementSibling"]) && bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`));
        }
        function onBulletClick(e) {
            const bulletEl = e.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
            if (!bulletEl) return;
            e.preventDefault();
            const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
            if (swiper.params.loop) {
                if (swiper.realIndex === index) return;
                swiper.slideToLoop(index);
            } else swiper.slideTo(index);
        }
        function update() {
            // Render || Update Pagination bullets/items
            const rtl = swiper.rtl, params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            let current, previousIndex, el = swiper.pagination.el;
            el = makeElementsArray(el);
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length, total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
            // Types
            if (swiper.params.loop ? (previousIndex = swiper.previousRealIndex || 0, current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex) : void 0 !== swiper.snapIndex ? (current = swiper.snapIndex, 
            previousIndex = swiper.previousSnapIndex) : (previousIndex = swiper.previousIndex || 0, 
            current = swiper.activeIndex || 0), "bullets" === params.type && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
                const bullets = swiper.pagination.bullets;
                let firstIndex, lastIndex, midIndex;
                if (params.dynamicBullets && (bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height", !0), 
                el.forEach((subEl => {
                    subEl.style[swiper.isHorizontal() ? "width" : "height"] = bulletSize * (params.dynamicMainBullets + 4) + "px";
                })), params.dynamicMainBullets > 1 && void 0 !== previousIndex && (dynamicBulletIndex += current - (previousIndex || 0), 
                dynamicBulletIndex > params.dynamicMainBullets - 1 ? dynamicBulletIndex = params.dynamicMainBullets - 1 : dynamicBulletIndex < 0 && (dynamicBulletIndex = 0)), 
                firstIndex = Math.max(current - dynamicBulletIndex, 0), lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1), 
                midIndex = (lastIndex + firstIndex) / 2), bullets.forEach((bulletEl => {
                    const classesToRemove = [ ...[ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((suffix => `${params.bulletActiveClass}${suffix}`)) ].map((s => "string" == typeof s && s.includes(" ") ? s.split(" ") : s)).flat();
                    bulletEl.classList.remove(...classesToRemove);
                })), el.length > 1) bullets.forEach((bullet => {
                    const bulletIndex = elementIndex(bullet);
                    bulletIndex === current ? bullet.classList.add(...params.bulletActiveClass.split(" ")) : swiper.isElement && bullet.setAttribute("part", "bullet"), 
                    params.dynamicBullets && (bulletIndex >= firstIndex && bulletIndex <= lastIndex && bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" ")), 
                    bulletIndex === firstIndex && setSideBullets(bullet, "prev"), bulletIndex === lastIndex && setSideBullets(bullet, "next"));
                })); else {
                    const bullet = bullets[current];
                    if (bullet && bullet.classList.add(...params.bulletActiveClass.split(" ")), swiper.isElement && bullets.forEach(((bulletEl, bulletIndex) => {
                        bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
                    })), params.dynamicBullets) {
                        const firstDisplayedBullet = bullets[firstIndex], lastDisplayedBullet = bullets[lastIndex];
                        for (let i = firstIndex; i <= lastIndex; i += 1) bullets[i] && bullets[i].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
                        setSideBullets(firstDisplayedBullet, "prev"), setSideBullets(lastDisplayedBullet, "next");
                    }
                }
                if (params.dynamicBullets) {
                    const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4), bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize, offsetProp = rtl ? "right" : "left";
                    bullets.forEach((bullet => {
                        bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
                    }));
                }
            }
            el.forEach(((subEl, subElIndex) => {
                if ("fraction" === params.type && (subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl => {
                    fractionEl.textContent = params.formatFractionCurrent(current + 1);
                })), subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl => {
                    totalEl.textContent = params.formatFractionTotal(total);
                }))), "progressbar" === params.type) {
                    let progressbarDirection;
                    progressbarDirection = params.progressbarOpposite ? swiper.isHorizontal() ? "vertical" : "horizontal" : swiper.isHorizontal() ? "horizontal" : "vertical";
                    const scale = (current + 1) / total;
                    let scaleX = 1, scaleY = 1;
                    "horizontal" === progressbarDirection ? scaleX = scale : scaleY = scale, subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl => {
                        progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`, 
                        progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
                    }));
                }
                "custom" === params.type && params.renderCustom ? (subEl.innerHTML = params.renderCustom(swiper, current + 1, total), 
                0 === subElIndex && emit("paginationRender", subEl)) : (0 === subElIndex && emit("paginationRender", subEl), 
                emit("paginationUpdate", subEl)), swiper.params.watchOverflow && swiper.enabled && subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
            }));
        }
        function render() {
            // Render Container
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.grid && swiper.params.grid.rows > 1 ? swiper.slides.length / Math.ceil(swiper.params.grid.rows) : swiper.slides.length;
            let el = swiper.pagination.el;
            el = makeElementsArray(el);
            let paginationHTML = "";
            if ("bullets" === params.type) {
                let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
                swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength && (numberOfBullets = slidesLength);
                for (let i = 0; i < numberOfBullets; i += 1) params.renderBullet ? paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass) : 
                // prettier-ignore
                paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
            }
            "fraction" === params.type && (paginationHTML = params.renderFraction ? params.renderFraction.call(swiper, params.currentClass, params.totalClass) : `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`), 
            "progressbar" === params.type && (paginationHTML = params.renderProgressbar ? params.renderProgressbar.call(swiper, params.progressbarFillClass) : `<span class="${params.progressbarFillClass}"></span>`), 
            swiper.pagination.bullets = [], el.forEach((subEl => {
                "custom" !== params.type && (subEl.innerHTML = paginationHTML || ""), "bullets" === params.type && swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
            })), "custom" !== params.type && emit("paginationRender", el[0]);
        }
        function init() {
            swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
                el: "swiper-pagination"
            });
            const params = swiper.params.pagination;
            if (!params.el) return;
            let el;
            "string" == typeof params.el && swiper.isElement && (el = swiper.el.querySelector(params.el)), 
            el || "string" != typeof params.el || (el = [ ...document.querySelectorAll(params.el) ]), 
            el || (el = params.el), el && 0 !== el.length && (swiper.params.uniqueNavElements && "string" == typeof params.el && Array.isArray(el) && el.length > 1 && (el = [ ...swiper.el.querySelectorAll(params.el) ], 
            // check if it belongs to another nested Swiper
            el.length > 1 && (el = el.filter((subEl => elementParents(subEl, ".swiper")[0] === swiper.el))[0])), 
            Array.isArray(el) && 1 === el.length && (el = el[0]), Object.assign(swiper.pagination, {
                el: el
            }), el = makeElementsArray(el), el.forEach((subEl => {
                "bullets" === params.type && params.clickable && subEl.classList.add(...(params.clickableClass || "").split(" ")), 
                subEl.classList.add(params.modifierClass + params.type), subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass), 
                "bullets" === params.type && params.dynamicBullets && (subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`), 
                dynamicBulletIndex = 0, params.dynamicMainBullets < 1 && (params.dynamicMainBullets = 1)), 
                "progressbar" === params.type && params.progressbarOpposite && subEl.classList.add(params.progressbarOppositeClass), 
                params.clickable && subEl.addEventListener("click", onBulletClick), swiper.enabled || subEl.classList.add(params.lockClass);
            })));
        }
        function destroy() {
            const params = swiper.params.pagination;
            if (isPaginationDisabled()) return;
            let el = swiper.pagination.el;
            el && (el = makeElementsArray(el), el.forEach((subEl => {
                subEl.classList.remove(params.hiddenClass), subEl.classList.remove(params.modifierClass + params.type), 
                subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass), 
                params.clickable && (subEl.classList.remove(...(params.clickableClass || "").split(" ")), 
                subEl.removeEventListener("click", onBulletClick));
            }))), swiper.pagination.bullets && swiper.pagination.bullets.forEach((subEl => subEl.classList.remove(...params.bulletActiveClass.split(" "))));
        }
        on("changeDirection", (() => {
            if (!swiper.pagination || !swiper.pagination.el) return;
            const params = swiper.params.pagination;
            let {el: el} = swiper.pagination;
            el = makeElementsArray(el), el.forEach((subEl => {
                subEl.classList.remove(params.horizontalClass, params.verticalClass), subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
            }));
        })), on("init", (() => {
            !1 === swiper.params.pagination.enabled ? 
            // eslint-disable-next-line
            disable() : (init(), render(), update());
        })), on("activeIndexChange", (() => {
            void 0 === swiper.snapIndex && update();
        })), on("snapIndexChange", (() => {
            update();
        })), on("snapGridLengthChange", (() => {
            render(), update();
        })), on("destroy", (() => {
            destroy();
        })), on("enable disable", (() => {
            let {el: el} = swiper.pagination;
            el && (el = makeElementsArray(el), el.forEach((subEl => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass))));
        })), on("lock unlock", (() => {
            update();
        })), on("click", ((_s, e) => {
            const targetEl = e.target, el = makeElementsArray(swiper.pagination.el);
            if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
                if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
                const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
                emit(!0 === isHidden ? "paginationShow" : "paginationHide"), el.forEach((subEl => subEl.classList.toggle(swiper.params.pagination.hiddenClass)));
            }
        }));
        const disable = () => {
            swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
            let {el: el} = swiper.pagination;
            el && (el = makeElementsArray(el), el.forEach((subEl => subEl.classList.add(swiper.params.pagination.paginationDisabledClass)))), 
            destroy();
        };
        Object.assign(swiper.pagination, {
            enable: () => {
                swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
                let {el: el} = swiper.pagination;
                el && (el = makeElementsArray(el), el.forEach((subEl => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass)))), 
                init(), render(), update();
            },
            disable: disable,
            render: render,
            update: update,
            init: init,
            destroy: destroy
        });
    }
    function A11y(_ref) {
        let {swiper: swiper, extendParams: extendParams, on: on} = _ref;
        extendParams({
            a11y: {
                enabled: !0,
                notificationClass: "swiper-notification",
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide",
                paginationBulletMessage: "Go to slide {{index}}",
                slideLabelMessage: "{{index}} / {{slidesLength}}",
                containerMessage: null,
                containerRoleDescriptionMessage: null,
                itemRoleDescriptionMessage: null,
                slideRole: "group",
                id: null
            }
        }), swiper.a11y = {
            clicked: !1
        };
        let liveRegion = null;
        function notify(message) {
            const notification = liveRegion;
            0 !== notification.length && (notification.innerHTML = "", notification.innerHTML = message);
        }
        const makeElementsArray = el => (Array.isArray(el) ? el : [ el ]).filter((e => !!e));
        function makeElFocusable(el) {
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl.setAttribute("tabIndex", "0");
            }));
        }
        function makeElNotFocusable(el) {
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl.setAttribute("tabIndex", "-1");
            }));
        }
        function addElRole(el, role) {
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl.setAttribute("role", role);
            }));
        }
        function addElRoleDescription(el, description) {
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl.setAttribute("aria-roledescription", description);
            }));
        }
        function addElLabel(el, label) {
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl.setAttribute("aria-label", label);
            }));
        }
        function disableEl(el) {
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl.setAttribute("aria-disabled", !0);
            }));
        }
        function enableEl(el) {
            (el = makeElementsArray(el)).forEach((subEl => {
                subEl.setAttribute("aria-disabled", !1);
            }));
        }
        function onEnterOrSpaceKey(e) {
            if (13 !== e.keyCode && 32 !== e.keyCode) return;
            const params = swiper.params.a11y, targetEl = e.target;
            swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e.target)) && !e.target.matches(classesToSelector(swiper.params.pagination.bulletClass)) || (swiper.navigation && swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl && (swiper.isEnd && !swiper.params.loop || swiper.slideNext(), 
            swiper.isEnd ? notify(params.lastSlideMessage) : notify(params.nextSlideMessage)), 
            swiper.navigation && swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl && (swiper.isBeginning && !swiper.params.loop || swiper.slidePrev(), 
            swiper.isBeginning ? notify(params.firstSlideMessage) : notify(params.prevSlideMessage)), 
            swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass)) && targetEl.click());
        }
        function hasPagination() {
            return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
        }
        function hasClickablePagination() {
            return hasPagination() && swiper.params.pagination.clickable;
        }
        const initNavEl = (el, wrapperId, message) => {
            makeElFocusable(el), "BUTTON" !== el.tagName && (addElRole(el, "button"), el.addEventListener("keydown", onEnterOrSpaceKey)), 
            addElLabel(el, message), function(el, controls) {
                (el = makeElementsArray(el)).forEach((subEl => {
                    subEl.setAttribute("aria-controls", controls);
                }));
            }(el, wrapperId);
        }, handlePointerDown = () => {
            swiper.a11y.clicked = !0;
        }, handlePointerUp = () => {
            requestAnimationFrame((() => {
                requestAnimationFrame((() => {
                    swiper.destroyed || (swiper.a11y.clicked = !1);
                }));
            }));
        }, handleFocus = e => {
            if (swiper.a11y.clicked) return;
            const slideEl = e.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
            if (!slideEl || !swiper.slides.includes(slideEl)) return;
            const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex, isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
            isActive || isVisible || e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents || (swiper.isHorizontal() ? swiper.el.scrollLeft = 0 : swiper.el.scrollTop = 0, 
            swiper.slideTo(swiper.slides.indexOf(slideEl), 0));
        }, initSlides = () => {
            const params = swiper.params.a11y;
            params.itemRoleDescriptionMessage && addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage), 
            params.slideRole && addElRole(swiper.slides, params.slideRole);
            const slidesLength = swiper.slides.length;
            params.slideLabelMessage && swiper.slides.forEach(((slideEl, index) => {
                const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10) : index;
                addElLabel(slideEl, params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength));
            }));
        }, init = () => {
            const params = swiper.params.a11y;
            swiper.el.append(liveRegion);
            // Container
            const containerEl = swiper.el;
            params.containerRoleDescriptionMessage && addElRoleDescription(containerEl, params.containerRoleDescriptionMessage), 
            params.containerMessage && addElLabel(containerEl, params.containerMessage);
            // Wrapper
            const wrapperEl = swiper.wrapperEl, wrapperId = params.id || wrapperEl.getAttribute("id") || `swiper-wrapper-${size = 16, 
            void 0 === size && (size = 16), "x".repeat(size).replace(/x/g, (() => Math.round(16 * Math.random()).toString(16)))}`;
            var size;
            const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? "off" : "polite";
            var id;
            id = wrapperId, makeElementsArray(wrapperEl).forEach((subEl => {
                subEl.setAttribute("id", id);
            })), function(el, live) {
                (el = makeElementsArray(el)).forEach((subEl => {
                    subEl.setAttribute("aria-live", live);
                }));
            }(wrapperEl, live), 
            // Slide
            initSlides();
            // Navigation
            let {nextEl: nextEl, prevEl: prevEl} = swiper.navigation ? swiper.navigation : {};
            // Pagination
            if (nextEl = makeElementsArray(nextEl), prevEl = makeElementsArray(prevEl), nextEl && nextEl.forEach((el => initNavEl(el, wrapperId, params.nextSlideMessage))), 
            prevEl && prevEl.forEach((el => initNavEl(el, wrapperId, params.prevSlideMessage))), 
            hasClickablePagination()) {
                makeElementsArray(swiper.pagination.el).forEach((el => {
                    el.addEventListener("keydown", onEnterOrSpaceKey);
                }));
            }
            // Tab focus
                        swiper.el.addEventListener("focus", handleFocus, !0), swiper.el.addEventListener("pointerdown", handlePointerDown, !0), 
            swiper.el.addEventListener("pointerup", handlePointerUp, !0);
        };
        on("beforeInit", (() => {
            liveRegion = createElement("span", swiper.params.a11y.notificationClass), liveRegion.setAttribute("aria-live", "assertive"), 
            liveRegion.setAttribute("aria-atomic", "true");
        })), on("afterInit", (() => {
            swiper.params.a11y.enabled && init();
        })), on("slidesLengthChange snapGridLengthChange slidesGridLengthChange", (() => {
            swiper.params.a11y.enabled && initSlides();
        })), on("fromEdge toEdge afterInit lock unlock", (() => {
            swiper.params.a11y.enabled && function() {
                if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
                const {nextEl: nextEl, prevEl: prevEl} = swiper.navigation;
                prevEl && (swiper.isBeginning ? (disableEl(prevEl), makeElNotFocusable(prevEl)) : (enableEl(prevEl), 
                makeElFocusable(prevEl))), nextEl && (swiper.isEnd ? (disableEl(nextEl), makeElNotFocusable(nextEl)) : (enableEl(nextEl), 
                makeElFocusable(nextEl)));
            }();
        })), on("paginationUpdate", (() => {
            swiper.params.a11y.enabled && function() {
                const params = swiper.params.a11y;
                hasPagination() && swiper.pagination.bullets.forEach((bulletEl => {
                    swiper.params.pagination.clickable && (makeElFocusable(bulletEl), swiper.params.pagination.renderBullet || (addElRole(bulletEl, "button"), 
                    addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1)))), 
                    bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass)) ? bulletEl.setAttribute("aria-current", "true") : bulletEl.removeAttribute("aria-current");
                }));
            }();
        })), on("destroy", (() => {
            swiper.params.a11y.enabled && function() {
                liveRegion && liveRegion.remove();
                let {nextEl: nextEl, prevEl: prevEl} = swiper.navigation ? swiper.navigation : {};
                // Pagination
                nextEl = makeElementsArray(nextEl), prevEl = makeElementsArray(prevEl), nextEl && nextEl.forEach((el => el.removeEventListener("keydown", onEnterOrSpaceKey))), 
                prevEl && prevEl.forEach((el => el.removeEventListener("keydown", onEnterOrSpaceKey))), 
                hasClickablePagination() && makeElementsArray(swiper.pagination.el).forEach((el => {
                    el.removeEventListener("keydown", onEnterOrSpaceKey);
                }));
                // Tab focus
                                swiper.el.removeEventListener("focus", handleFocus, !0), swiper.el.removeEventListener("pointerdown", handlePointerDown, !0), 
                swiper.el.removeEventListener("pointerup", handlePointerUp, !0);
            }();
        }));
    }
    /* eslint no-underscore-dangle: "off" */
    /* eslint no-use-before-define: "off" */    function Autoplay(_ref) {
        let timeout, raf, {swiper: swiper, extendParams: extendParams, on: on, emit: emit, params: params} = _ref;
        swiper.autoplay = {
            running: !1,
            paused: !1,
            timeLeft: 0
        }, extendParams({
            autoplay: {
                enabled: !1,
                delay: 3e3,
                waitForTransition: !0,
                disableOnInteraction: !1,
                stopOnLastSlide: !1,
                reverseDirection: !1,
                pauseOnMouseEnter: !1
            }
        });
        let autoplayTimeLeft, wasPaused, isTouched, pausedByTouch, touchStartTimeout, slideChanged, pausedByInteraction, pausedByPointerEnter, autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3, autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3, autoplayStartTime = (new Date).getTime();
        function onTransitionEnd(e) {
            swiper && !swiper.destroyed && swiper.wrapperEl && e.target === swiper.wrapperEl && (swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd), 
            pausedByPointerEnter || resume());
        }
        const calcTimeLeft = () => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            swiper.autoplay.paused ? wasPaused = !0 : wasPaused && (autoplayDelayCurrent = autoplayTimeLeft, 
            wasPaused = !1);
            const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (new Date).getTime();
            swiper.autoplay.timeLeft = timeLeft, emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal), 
            raf = requestAnimationFrame((() => {
                calcTimeLeft();
            }));
        }, run = delayForce => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            cancelAnimationFrame(raf), calcTimeLeft();
            let delay = void 0 === delayForce ? swiper.params.autoplay.delay : delayForce;
            autoplayDelayTotal = swiper.params.autoplay.delay, autoplayDelayCurrent = swiper.params.autoplay.delay;
            const currentSlideDelay = (() => {
                let activeSlideEl;
                if (activeSlideEl = swiper.virtual && swiper.params.virtual.enabled ? swiper.slides.filter((slideEl => slideEl.classList.contains("swiper-slide-active")))[0] : swiper.slides[swiper.activeIndex], 
                !activeSlideEl) return;
                return parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
            })();
            !Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && void 0 === delayForce && (delay = currentSlideDelay, 
            autoplayDelayTotal = currentSlideDelay, autoplayDelayCurrent = currentSlideDelay), 
            autoplayTimeLeft = delay;
            const speed = swiper.params.speed, proceed = () => {
                swiper && !swiper.destroyed && (swiper.params.autoplay.reverseDirection ? !swiper.isBeginning || swiper.params.loop || swiper.params.rewind ? (swiper.slidePrev(speed, !0, !0), 
                emit("autoplay")) : swiper.params.autoplay.stopOnLastSlide || (swiper.slideTo(swiper.slides.length - 1, speed, !0, !0), 
                emit("autoplay")) : !swiper.isEnd || swiper.params.loop || swiper.params.rewind ? (swiper.slideNext(speed, !0, !0), 
                emit("autoplay")) : swiper.params.autoplay.stopOnLastSlide || (swiper.slideTo(0, speed, !0, !0), 
                emit("autoplay")), swiper.params.cssMode && (autoplayStartTime = (new Date).getTime(), 
                requestAnimationFrame((() => {
                    run();
                }))));
            };
            // eslint-disable-next-line
            return delay > 0 ? (clearTimeout(timeout), timeout = setTimeout((() => {
                proceed();
            }), delay)) : requestAnimationFrame((() => {
                proceed();
            })), delay;
        }, start = () => {
            autoplayStartTime = (new Date).getTime(), swiper.autoplay.running = !0, run(), emit("autoplayStart");
        }, stop = () => {
            swiper.autoplay.running = !1, clearTimeout(timeout), cancelAnimationFrame(raf), 
            emit("autoplayStop");
        }, pause = (internal, reset) => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            clearTimeout(timeout), internal || (pausedByInteraction = !0);
            const proceed = () => {
                emit("autoplayPause"), swiper.params.autoplay.waitForTransition ? swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd) : resume();
            };
            if (swiper.autoplay.paused = !0, reset) return slideChanged && (autoplayTimeLeft = swiper.params.autoplay.delay), 
            slideChanged = !1, void proceed();
            const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
            autoplayTimeLeft = delay - ((new Date).getTime() - autoplayStartTime), swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || (autoplayTimeLeft < 0 && (autoplayTimeLeft = 0), 
            proceed());
        }, resume = () => {
            swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running || (autoplayStartTime = (new Date).getTime(), 
            pausedByInteraction ? (pausedByInteraction = !1, run(autoplayTimeLeft)) : run(), 
            swiper.autoplay.paused = !1, emit("autoplayResume"));
        }, onVisibilityChange = () => {
            if (swiper.destroyed || !swiper.autoplay.running) return;
            const document = getDocument();
            "hidden" === document.visibilityState && (pausedByInteraction = !0, pause(!0)), 
            "visible" === document.visibilityState && resume();
        }, onPointerEnter = e => {
            "mouse" === e.pointerType && (pausedByInteraction = !0, pausedByPointerEnter = !0, 
            swiper.animating || swiper.autoplay.paused || pause(!0));
        }, onPointerLeave = e => {
            "mouse" === e.pointerType && (pausedByPointerEnter = !1, swiper.autoplay.paused && resume());
        };
        on("init", (() => {
            swiper.params.autoplay.enabled && (swiper.params.autoplay.pauseOnMouseEnter && (swiper.el.addEventListener("pointerenter", onPointerEnter), 
            swiper.el.addEventListener("pointerleave", onPointerLeave)), getDocument().addEventListener("visibilitychange", onVisibilityChange), 
            start());
        })), on("destroy", (() => {
            swiper.el.removeEventListener("pointerenter", onPointerEnter), swiper.el.removeEventListener("pointerleave", onPointerLeave), 
            getDocument().removeEventListener("visibilitychange", onVisibilityChange), swiper.autoplay.running && stop();
        })), on("_freeModeStaticRelease", (() => {
            (pausedByTouch || pausedByInteraction) && resume();
        })), on("_freeModeNoMomentumRelease", (() => {
            swiper.params.autoplay.disableOnInteraction ? stop() : pause(!0, !0);
        })), on("beforeTransitionStart", ((_s, speed, internal) => {
            !swiper.destroyed && swiper.autoplay.running && (internal || !swiper.params.autoplay.disableOnInteraction ? pause(!0, !0) : stop());
        })), on("sliderFirstMove", (() => {
            !swiper.destroyed && swiper.autoplay.running && (swiper.params.autoplay.disableOnInteraction ? stop() : (isTouched = !0, 
            pausedByTouch = !1, pausedByInteraction = !1, touchStartTimeout = setTimeout((() => {
                pausedByInteraction = !0, pausedByTouch = !0, pause(!0);
            }), 200)));
        })), on("touchEnd", (() => {
            if (!swiper.destroyed && swiper.autoplay.running && isTouched) {
                if (clearTimeout(touchStartTimeout), clearTimeout(timeout), swiper.params.autoplay.disableOnInteraction) return pausedByTouch = !1, 
                void (isTouched = !1);
                pausedByTouch && swiper.params.cssMode && resume(), pausedByTouch = !1, isTouched = !1;
            }
        })), on("slideChange", (() => {
            !swiper.destroyed && swiper.autoplay.running && (slideChanged = !0);
        })), Object.assign(swiper.autoplay, {
            start: start,
            stop: stop,
            pause: pause,
            resume: resume
        });
    }
    function Thumb(_ref) {
        let {swiper: swiper, extendParams: extendParams, on: on} = _ref;
        extendParams({
            thumbs: {
                swiper: null,
                multipleActiveThumbs: !0,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-thumbs"
            }
        });
        let initialized = !1, swiperCreated = !1;
        function onThumbClick() {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const clickedIndex = thumbsSwiper.clickedIndex, clickedSlide = thumbsSwiper.clickedSlide;
            if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass)) return;
            if (null == clickedIndex) return;
            let slideToIndex;
            slideToIndex = thumbsSwiper.params.loop ? parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10) : clickedIndex, 
            swiper.params.loop ? swiper.slideToLoop(slideToIndex) : swiper.slideTo(slideToIndex);
        }
        function init() {
            const {thumbs: thumbsParams} = swiper.params;
            if (initialized) return !1;
            initialized = !0;
            const SwiperClass = swiper.constructor;
            if (thumbsParams.swiper instanceof SwiperClass) swiper.thumbs.swiper = thumbsParams.swiper, 
            Object.assign(swiper.thumbs.swiper.originalParams, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            }), Object.assign(swiper.thumbs.swiper.params, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            }), swiper.thumbs.swiper.update(); else if (isObject(thumbsParams.swiper)) {
                const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
                Object.assign(thumbsSwiperParams, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                }), swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams), swiperCreated = !0;
            }
            return swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass), 
            swiper.thumbs.swiper.on("tap", onThumbClick), !0;
        }
        function update(initial) {
            const thumbsSwiper = swiper.thumbs.swiper;
            if (!thumbsSwiper || thumbsSwiper.destroyed) return;
            const slidesPerView = "auto" === thumbsSwiper.params.slidesPerView ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
            // Activate thumbs
                        let thumbsToActivate = 1;
            const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
            if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides && (thumbsToActivate = swiper.params.slidesPerView), 
            swiper.params.thumbs.multipleActiveThumbs || (thumbsToActivate = 1), thumbsToActivate = Math.floor(thumbsToActivate), 
            thumbsSwiper.slides.forEach((slideEl => slideEl.classList.remove(thumbActiveClass))), 
            thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) for (let i = 0; i < thumbsToActivate; i += 1) elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i}"]`).forEach((slideEl => {
                slideEl.classList.add(thumbActiveClass);
            })); else for (let i = 0; i < thumbsToActivate; i += 1) thumbsSwiper.slides[swiper.realIndex + i] && thumbsSwiper.slides[swiper.realIndex + i].classList.add(thumbActiveClass);
            const autoScrollOffset = swiper.params.thumbs.autoScrollOffset, useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
            if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
                const currentThumbsIndex = thumbsSwiper.activeIndex;
                let newThumbsIndex, direction;
                if (thumbsSwiper.params.loop) {
                    const newThumbsSlide = thumbsSwiper.slides.filter((slideEl => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`))[0];
                    newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide), direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
                } else newThumbsIndex = swiper.realIndex, direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
                useOffset && (newThumbsIndex += "next" === direction ? autoScrollOffset : -1 * autoScrollOffset), 
                thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0 && (thumbsSwiper.params.centeredSlides ? newThumbsIndex = newThumbsIndex > currentThumbsIndex ? newThumbsIndex - Math.floor(slidesPerView / 2) + 1 : newThumbsIndex + Math.floor(slidesPerView / 2) - 1 : newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup, 
                thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0));
            }
        }
        swiper.thumbs = {
            swiper: null
        }, on("beforeInit", (() => {
            const {thumbs: thumbs} = swiper.params;
            if (thumbs && thumbs.swiper) if ("string" == typeof thumbs.swiper || thumbs.swiper instanceof HTMLElement) {
                const document = getDocument(), getThumbsElementAndInit = () => {
                    const thumbsElement = "string" == typeof thumbs.swiper ? document.querySelector(thumbs.swiper) : thumbs.swiper;
                    if (thumbsElement && thumbsElement.swiper) thumbs.swiper = thumbsElement.swiper, 
                    init(), update(!0); else if (thumbsElement) {
                        const onThumbsSwiper = e => {
                            thumbs.swiper = e.detail[0], thumbsElement.removeEventListener("init", onThumbsSwiper), 
                            init(), update(!0), thumbs.swiper.update(), swiper.update();
                        };
                        thumbsElement.addEventListener("init", onThumbsSwiper);
                    }
                    return thumbsElement;
                }, watchForThumbsToAppear = () => {
                    if (swiper.destroyed) return;
                    getThumbsElementAndInit() || requestAnimationFrame(watchForThumbsToAppear);
                };
                requestAnimationFrame(watchForThumbsToAppear);
            } else init(), update(!0);
        })), on("slideChange update resize observerUpdate", (() => {
            update();
        })), on("setTransition", ((_s, duration) => {
            const thumbsSwiper = swiper.thumbs.swiper;
            thumbsSwiper && !thumbsSwiper.destroyed && thumbsSwiper.setTransition(duration);
        })), on("beforeDestroy", (() => {
            const thumbsSwiper = swiper.thumbs.swiper;
            thumbsSwiper && !thumbsSwiper.destroyed && swiperCreated && thumbsSwiper.destroy();
        })), Object.assign(swiper.thumbs, {
            init: init,
            update: update
        });
    }
    function effectTarget(effectParams, slideEl) {
        const transformEl = getSlideTransformEl(slideEl);
        return transformEl !== slideEl && (transformEl.style.backfaceVisibility = "hidden", 
        transformEl.style["-webkit-backface-visibility"] = "hidden"), transformEl;
    }
    function effectVirtualTransitionEnd(_ref) {
        let {swiper: swiper, duration: duration, transformElements: transformElements, allSlides: allSlides} = _ref;
        const {activeIndex: activeIndex} = swiper;
        if (swiper.params.virtualTranslate && 0 !== duration) {
            let transitionEndTarget, eventTriggered = !1;
            transitionEndTarget = allSlides ? transformElements : transformElements.filter((transformEl => {
                const el = transformEl.classList.contains("swiper-slide-transform") ? (el => {
                    if (!el.parentElement) return swiper.slides.filter((slideEl => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode))[0];
                    return el.parentElement;
                })(transformEl) : transformEl;
                return swiper.getSlideIndex(el) === activeIndex;
            })), transitionEndTarget.forEach((el => {
                !function(el, callback) {
                    callback && el.addEventListener("transitionend", (function fireCallBack(e) {
                        e.target === el && (callback.call(el, e), el.removeEventListener("transitionend", fireCallBack));
                    }));
                }(el, (() => {
                    if (eventTriggered) return;
                    if (!swiper || swiper.destroyed) return;
                    eventTriggered = !0, swiper.animating = !1;
                    const evt = new window.CustomEvent("transitionend", {
                        bubbles: !0,
                        cancelable: !0
                    });
                    swiper.wrapperEl.dispatchEvent(evt);
                }));
            }));
        }
    }
    function EffectFade(_ref) {
        let {swiper: swiper, extendParams: extendParams, on: on} = _ref;
        extendParams({
            fadeEffect: {
                crossFade: !1
            }
        });
        !function(params) {
            const {effect: effect, swiper: swiper, on: on, setTranslate: setTranslate, setTransition: setTransition, overwriteParams: overwriteParams, perspective: perspective, recreateShadows: recreateShadows, getEffectParams: getEffectParams} = params;
            let requireUpdateOnVirtual;
            on("beforeInit", (() => {
                if (swiper.params.effect !== effect) return;
                swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`), perspective && perspective() && swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
                const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
                Object.assign(swiper.params, overwriteParamsResult), Object.assign(swiper.originalParams, overwriteParamsResult);
            })), on("setTranslate", (() => {
                swiper.params.effect === effect && setTranslate();
            })), on("setTransition", ((_s, duration) => {
                swiper.params.effect === effect && setTransition(duration);
            })), on("transitionEnd", (() => {
                if (swiper.params.effect === effect && recreateShadows) {
                    if (!getEffectParams || !getEffectParams().slideShadows) return;
                    // remove shadows
                                        swiper.slides.forEach((slideEl => {
                        slideEl.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((shadowEl => shadowEl.remove()));
                    })), 
                    // create new one
                    recreateShadows();
                }
            })), on("virtualUpdate", (() => {
                swiper.params.effect === effect && (swiper.slides.length || (requireUpdateOnVirtual = !0), 
                requestAnimationFrame((() => {
                    requireUpdateOnVirtual && swiper.slides && swiper.slides.length && (setTranslate(), 
                    requireUpdateOnVirtual = !1);
                })));
            }));
        }({
            effect: "fade",
            swiper: swiper,
            on: on,
            setTranslate: () => {
                const {slides: slides} = swiper;
                swiper.params.fadeEffect;
                for (let i = 0; i < slides.length; i += 1) {
                    const slideEl = swiper.slides[i];
                    let tx = -slideEl.swiperSlideOffset;
                    swiper.params.virtualTranslate || (tx -= swiper.translate);
                    let ty = 0;
                    swiper.isHorizontal() || (ty = tx, tx = 0);
                    const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(slideEl.progress), 0) : 1 + Math.min(Math.max(slideEl.progress, -1), 0), targetEl = effectTarget(0, slideEl);
                    targetEl.style.opacity = slideOpacity, targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
                }
            },
            setTransition: duration => {
                const transformElements = swiper.slides.map((slideEl => getSlideTransformEl(slideEl)));
                transformElements.forEach((el => {
                    el.style.transitionDuration = `${duration}ms`;
                })), effectVirtualTransitionEnd({
                    swiper: swiper,
                    duration: duration,
                    transformElements: transformElements,
                    allSlides: !0
                });
            },
            overwriteParams: () => ({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: !0,
                spaceBetween: 0,
                virtualTranslate: !swiper.params.cssMode
            })
        });
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    })), Swiper.use([ function(_ref) {
        let {swiper: swiper, on: on, emit: emit} = _ref;
        const window = getWindow();
        let observer = null, animationFrame = null;
        const resizeHandler = () => {
            swiper && !swiper.destroyed && swiper.initialized && (emit("beforeResize"), emit("resize"));
        }, orientationChangeHandler = () => {
            swiper && !swiper.destroyed && swiper.initialized && emit("orientationchange");
        };
        on("init", (() => {
            swiper.params.resizeObserver && void 0 !== window.ResizeObserver ? swiper && !swiper.destroyed && swiper.initialized && (observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width: width, height: height} = swiper;
                    let newWidth = width, newHeight = height;
                    entries.forEach((_ref2 => {
                        let {contentBoxSize: contentBoxSize, contentRect: contentRect, target: target} = _ref2;
                        target && target !== swiper.el || (newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize, 
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize);
                    })), newWidth === width && newHeight === height || resizeHandler();
                }));
            })), observer.observe(swiper.el)) : (window.addEventListener("resize", resizeHandler), 
            window.addEventListener("orientationchange", orientationChangeHandler));
        })), on("destroy", (() => {
            animationFrame && window.cancelAnimationFrame(animationFrame), observer && observer.unobserve && swiper.el && (observer.unobserve(swiper.el), 
            observer = null), window.removeEventListener("resize", resizeHandler), window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }, function(_ref) {
        let {swiper: swiper, extendParams: extendParams, on: on, emit: emit} = _ref;
        const observers = [], window = getWindow(), attach = function(target, options) {
            void 0 === options && (options = {});
            const observer = new (window.MutationObserver || window.WebkitMutationObserver)((mutations => {
                // The observerUpdate event should only be triggered
                // once despite the number of mutations.  Additional
                // triggers are redundant and are very costly
                if (swiper.__preventObserver__) return;
                if (1 === mutations.length) return void emit("observerUpdate", mutations[0]);
                const observerUpdate = function() {
                    emit("observerUpdate", mutations[0]);
                };
                window.requestAnimationFrame ? window.requestAnimationFrame(observerUpdate) : window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: void 0 === options.attributes || options.attributes,
                childList: void 0 === options.childList || options.childList,
                characterData: void 0 === options.characterData || options.characterData
            }), observers.push(observer);
        };
        extendParams({
            observer: !1,
            observeParents: !1,
            observeSlideChildren: !1
        }), on("init", (() => {
            if (swiper.params.observer) {
                if (swiper.params.observeParents) {
                    const containerParents = elementParents(swiper.hostEl);
                    for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
                }
                // Observe container
                                attach(swiper.hostEl, {
                    childList: swiper.params.observeSlideChildren
                }), 
                // Observe wrapper
                attach(swiper.wrapperEl, {
                    attributes: !1
                });
            }
        })), on("destroy", (() => {
            observers.forEach((observer => {
                observer.disconnect();
            })), observers.splice(0, observers.length);
        }));
    } ]), window.addEventListener("resize", (function() {
        if (window.innerWidth > 768) {
            const newsSlider = document.querySelector(".news__slider");
            newsSlider && new Swiper(newsSlider, {
                slidesPerView: 4,
                spaceBetween: 60,
                loop: !0,
                modules: [ Navigation, A11y ],
                navigation: {
                    nextEl: ".news__nav-next",
                    prevEl: ".news__nav-prev"
                },
                a11y: {
                    focusableElements: "button, a"
                }
            });
        }
    }));
    const productSliderElems = document.querySelectorAll(".product__slider");
    var PipsMode, PipsType;
    function isValidPartialFormatter(entry) {
        // partial formatters only need a to function and not a from function
        return "object" == typeof entry && "function" == typeof entry.to;
    }
    function removeElement(el) {
        el.parentElement.removeChild(el);
    }
    function isSet(value) {
        return null != value;
    }
    // Bindable version
        function preventDefault(e) {
        e.preventDefault();
    }
    // Removes duplicates from an array.
        // Checks whether a value is numerical.
    function isNumeric(a) {
        return "number" == typeof a && !isNaN(a) && isFinite(a);
    }
    // Sets a class and removes it after [duration] ms.
        function addClassFor(element, className, duration) {
        duration > 0 && (addClass(element, className), setTimeout((function() {
            removeClass(element, className);
        }), duration));
    }
    // Limits a value to 0 - 100
        function limit(a) {
        return Math.max(Math.min(a, 100), 0);
    }
    // Wraps a variable as an array, if it isn't one yet.
    // Note that an input array is returned by reference!
        function asArray(a) {
        return Array.isArray(a) ? a : [ a ];
    }
    // Counts decimals
        function countDecimals(numStr) {
        var pieces = (numStr = String(numStr)).split(".");
        return pieces.length > 1 ? pieces[1].length : 0;
    }
    // http://youmightnotneedjquery.com/#add_class
        function addClass(el, className) {
        el.classList && !/\s/.test(className) ? el.classList.add(className) : el.className += " " + className;
    }
    // http://youmightnotneedjquery.com/#remove_class
        function removeClass(el, className) {
        el.classList && !/\s/.test(className) ? el.classList.remove(className) : el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
    // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
    function getPageOffset(doc) {
        var supportPageOffset = void 0 !== window.pageXOffset, isCSS1Compat = "CSS1Compat" === (doc.compatMode || "");
        return {
            x: supportPageOffset ? window.pageXOffset : isCSS1Compat ? doc.documentElement.scrollLeft : doc.body.scrollLeft,
            y: supportPageOffset ? window.pageYOffset : isCSS1Compat ? doc.documentElement.scrollTop : doc.body.scrollTop
        };
    }
    // we provide a function to compute constants instead
    // of accessing window.* as soon as the module needs it
    // so that we do not compute anything if not needed
        //endregion
    //region Range Calculation
    // Determine the size of a sub-range in relation to a full range.
    function subRangeRatio(pa, pb) {
        return 100 / (pb - pa);
    }
    // (percentage) How many percent is this value of this range?
        function fromPercentage(range, value, startRange) {
        return 100 * value / (range[startRange + 1] - range[startRange]);
    }
    // (percentage) Where is this value on this range?
        function getJ(value, arr) {
        for (var j = 1; value >= arr[j]; ) j += 1;
        return j;
    }
    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
        function toStepping(xVal, xPct, value) {
        if (value >= xVal.slice(-1)[0]) return 100;
        var j = getJ(value, xVal), va = xVal[j - 1], vb = xVal[j], pa = xPct[j - 1], pb = xPct[j];
        return pa + function(range, value) {
            return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
        }
        // (value) How much is this percentage on this range?
        ([ va, vb ], value) / subRangeRatio(pa, pb);
    }
    // (value) Input a percentage, find where it is on the specified range.
        // (percentage) Get the step that applies at a certain value.
    function getStep(xPct, xSteps, snap, value) {
        if (100 === value) return value;
        var j = getJ(value, xPct), a = xPct[j - 1], b = xPct[j];
        // If 'snap' is set, steps are used as fixed points on the slider.
        return snap ? 
        // Find the closest position, a or b.
        value - a > (b - a) / 2 ? b : a : xSteps[j - 1] ? xPct[j - 1] + 
        // Round a value to the closest 'to'.
        function(value, to) {
            return Math.round(value / to) * to;
        }
        // Current position of an element relative to the document.
        (value - xPct[j - 1], xSteps[j - 1]) : value;
    }
    //endregion
    //region Spectrum
        document.addEventListener("DOMContentLoaded", (function() {
        if (window.innerWidth > 768) {
            document.querySelectorAll(".catalog__section-slider").forEach(((slider, index) => {
                const swiper = new Swiper(slider, {
                    loop: !0,
                    spaceBetween: 50,
                    slidesPerView: 4,
                    modules: [ Navigation, A11y ],
                    navigation: {
                        nextEl: `#section-nav-next${index + 1}`,
                        prevEl: `#section-nav-prev${index + 1}`
                    },
                    a11y: {
                        focusableElements: "button, a"
                    }
                });
                swiper.navigation.nextEl[0].classList.add("btn-init"), swiper.navigation.prevEl[0].classList.add("btn-init");
            }));
        }
    })), productSliderElems.forEach(((slider, index) => {
        new Swiper(slider, {
            loop: !0,
            effect: "fade",
            modules: [ Pagination, EffectFade, Autoplay, A11y ],
            fadeEffect: {
                crossFade: !0
            },
            autoplay: !0,
            pagination: {
                el: ".product__pagination",
                clickable: !0,
                modifierClass: "product__pagination",
                bulletClass: "product__pagination-bullet",
                bulletActiveClass: "product__pagination-bullet--active",
                bulletElement: "button"
            },
            a11y: {
                focusableElements: "button, a"
            }
        });
    })), function(PipsMode) {
        PipsMode.Range = "range", PipsMode.Steps = "steps", PipsMode.Positions = "positions", 
        PipsMode.Count = "count", PipsMode.Values = "values";
    }(PipsMode || (PipsMode = {})), function(PipsType) {
        PipsType[PipsType.None = -1] = "None", PipsType[PipsType.NoValue = 0] = "NoValue", 
        PipsType[PipsType.LargeValue = 1] = "LargeValue", PipsType[PipsType.SmallValue = 2] = "SmallValue";
    }(PipsType || (PipsType = {}));
    var Spectrum = /** @class */ function() {
        function Spectrum(entry, snap, singleStep) {
            var index;
            this.xPct = [], this.xVal = [], this.xSteps = [], this.xNumSteps = [], this.xHighestCompleteStep = [], 
            this.xSteps = [ singleStep || !1 ], this.xNumSteps = [ !1 ], this.snap = snap;
            var ordered = [];
            // Map the object keys to an array.
                        // Convert all entries to subranges.
            for (Object.keys(entry).forEach((function(index) {
                ordered.push([ asArray(entry[index]), index ]);
            })), 
            // Sort all entries by value (numeric sort).
            ordered.sort((function(a, b) {
                return a[0][0] - b[0][0];
            })), index = 0; index < ordered.length; index++) this.handleEntryPoint(ordered[index][1], ordered[index][0]);
            // Store the actual step values.
            // xSteps is sorted in the same order as xPct and xVal.
                        // Convert all numeric steps to the percentage of the subrange they represent.
            for (this.xNumSteps = this.xSteps.slice(0), index = 0; index < this.xNumSteps.length; index++) this.handleStepPoint(index, this.xNumSteps[index]);
        }
        return Spectrum.prototype.getDistance = function(value) {
            for (var distances = [], index = 0; index < this.xNumSteps.length - 1; index++) distances[index] = fromPercentage(this.xVal, value, index);
            return distances;
        }, 
        // Calculate the percentual distance over the whole scale of ranges.
        // direction: 0 = backwards / 1 = forwards
        Spectrum.prototype.getAbsoluteDistance = function(value, distances, direction) {
            var start_factor, xPct_index = 0;
            // Calculate range where to start calculation
                        if (value < this.xPct[this.xPct.length - 1]) for (;value > this.xPct[xPct_index + 1]; ) xPct_index++; else value === this.xPct[this.xPct.length - 1] && (xPct_index = this.xPct.length - 2);
            // If looking backwards and the value is exactly at a range separator then look one range further
                        direction || value !== this.xPct[xPct_index + 1] || xPct_index++, null === distances && (distances = []);
            var rest_factor = 1, rest_rel_distance = distances[xPct_index], range_pct = 0, rel_range_distance = 0, abs_distance_counter = 0, range_counter = 0;
            // Do until the complete distance across ranges is calculated
            for (
            // Calculate what part of the start range the value is
            start_factor = direction ? (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]) : (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]); rest_rel_distance > 0; ) 
            // Calculate the percentage of total range
            range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter], 
            // Detect if the margin, padding or limit is larger then the current range and calculate
            distances[xPct_index + range_counter] * rest_factor + 100 - 100 * start_factor > 100 ? (
            // If larger then take the percentual distance of the whole range
            rel_range_distance = range_pct * start_factor, 
            // Rest factor of relative percentual distance still to be calculated
            rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter], 
            // Set start factor to 1 as for next range it does not apply.
            start_factor = 1) : (
            // If smaller or equal then take the percentual distance of the calculate percentual part of that range
            rel_range_distance = distances[xPct_index + range_counter] * range_pct / 100 * rest_factor, 
            // No rest left as the rest fits in current range
            rest_factor = 0), direction ? (abs_distance_counter -= rel_range_distance, 
            // Limit range to first range when distance becomes outside of minimum range
            this.xPct.length + range_counter >= 1 && range_counter--) : (abs_distance_counter += rel_range_distance, 
            // Limit range to last range when distance becomes outside of maximum range
            this.xPct.length - range_counter >= 1 && range_counter++), 
            // Rest of relative percentual distance still to be calculated
            rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
            return value + abs_distance_counter;
        }, Spectrum.prototype.toStepping = function(value) {
            return value = toStepping(this.xVal, this.xPct, value);
        }, Spectrum.prototype.fromStepping = function(value) {
            return function(xVal, xPct, value) {
                // There is no range group that fits 100
                if (value >= 100) return xVal.slice(-1)[0];
                var j = getJ(value, xPct), va = xVal[j - 1], vb = xVal[j], pa = xPct[j - 1];
                return function(range, value) {
                    return value * (range[1] - range[0]) / 100 + range[0];
                }([ va, vb ], (value - pa) * subRangeRatio(pa, xPct[j]));
            }(this.xVal, this.xPct, value);
        }, Spectrum.prototype.getStep = function(value) {
            return value = getStep(this.xPct, this.xSteps, this.snap, value);
        }, Spectrum.prototype.getDefaultStep = function(value, isDown, size) {
            var j = getJ(value, this.xPct);
            // When at the top or stepping down, look at the previous sub-range
                        return (100 === value || isDown && value === this.xPct[j - 1]) && (j = Math.max(j - 1, 1)), 
            (this.xVal[j] - this.xVal[j - 1]) / size;
        }, Spectrum.prototype.getNearbySteps = function(value) {
            var j = getJ(value, this.xPct);
            return {
                stepBefore: {
                    startValue: this.xVal[j - 2],
                    step: this.xNumSteps[j - 2],
                    highestStep: this.xHighestCompleteStep[j - 2]
                },
                thisStep: {
                    startValue: this.xVal[j - 1],
                    step: this.xNumSteps[j - 1],
                    highestStep: this.xHighestCompleteStep[j - 1]
                },
                stepAfter: {
                    startValue: this.xVal[j],
                    step: this.xNumSteps[j],
                    highestStep: this.xHighestCompleteStep[j]
                }
            };
        }, Spectrum.prototype.countStepDecimals = function() {
            var stepDecimals = this.xNumSteps.map(countDecimals);
            return Math.max.apply(null, stepDecimals);
        }, Spectrum.prototype.hasNoSize = function() {
            return this.xVal[0] === this.xVal[this.xVal.length - 1];
        }, 
        // Outside testing
        Spectrum.prototype.convert = function(value) {
            return this.getStep(this.toStepping(value));
        }, Spectrum.prototype.handleEntryPoint = function(index, value) {
            var percentage;
            // Covert min/max syntax to 0 and 100.
                        // Check for correct input.
            if (!isNumeric(percentage = "min" === index ? 0 : "max" === index ? 100 : parseFloat(index)) || !isNumeric(value[0])) throw new Error("noUiSlider: 'range' value isn't numeric.");
            // Store values.
                        this.xPct.push(percentage), this.xVal.push(value[0]);
            var value1 = Number(value[1]);
            // NaN will evaluate to false too, but to keep
            // logging clear, set step explicitly. Make sure
            // not to override the 'step' setting with false.
                        percentage ? this.xSteps.push(!isNaN(value1) && value1) : isNaN(value1) || (this.xSteps[0] = value1), 
            this.xHighestCompleteStep.push(0);
        }, Spectrum.prototype.handleStepPoint = function(i, n) {
            // Ignore 'false' stepping.
            if (n) 
            // Step over zero-length ranges (#948);
            if (this.xVal[i] !== this.xVal[i + 1]) {
                // Factor to range ratio
                this.xSteps[i] = fromPercentage([ this.xVal[i], this.xVal[i + 1] ], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
                var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i], highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1), step = this.xVal[i] + this.xNumSteps[i] * highestStep;
                this.xHighestCompleteStep[i] = step;
            } else this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
        }, Spectrum;
    }(), defaultFormatter = {
        to: function(value) {
            return void 0 === value ? "" : value.toFixed(2);
        },
        from: Number
    }, cssClasses = {
        target: "target",
        base: "base",
        origin: "origin",
        handle: "handle",
        handleLower: "handle-lower",
        handleUpper: "handle-upper",
        touchArea: "touch-area",
        horizontal: "horizontal",
        vertical: "vertical",
        background: "background",
        connect: "connect",
        connects: "connects",
        ltr: "ltr",
        rtl: "rtl",
        textDirectionLtr: "txt-dir-ltr",
        textDirectionRtl: "txt-dir-rtl",
        draggable: "draggable",
        drag: "state-drag",
        tap: "state-tap",
        active: "active",
        tooltip: "tooltip",
        pips: "pips",
        pipsHorizontal: "pips-horizontal",
        pipsVertical: "pips-vertical",
        marker: "marker",
        markerHorizontal: "marker-horizontal",
        markerVertical: "marker-vertical",
        markerNormal: "marker-normal",
        markerLarge: "marker-large",
        markerSub: "marker-sub",
        value: "value",
        valueHorizontal: "value-horizontal",
        valueVertical: "value-vertical",
        valueNormal: "value-normal",
        valueLarge: "value-large",
        valueSub: "value-sub"
    }, INTERNAL_EVENT_NS = {
        tooltips: ".__tooltips",
        aria: ".__aria"
    };
    //endregion
    //region Options
    /*	Every input option is tested and parsed. This will prevent
        endless validation in internal methods. These tests are
        structured with an item for every option available. An
        option can be marked as required by setting the 'r' flag.
        The testing function is provided with three arguments:
            - The provided value for the option;
            - A reference to the options object;
            - The name for the option;

        The testing function returns false when an error is detected,
        or true when everything is OK. It can also modify the option
        object, to make sure all values can be correctly looped elsewhere. */
    //region Defaults
        //endregion
    function testStep(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'step' is not numeric.");
        // The step option can still be used to set stepping
        // for linear sliders. Overwritten if set in 'range'.
                parsed.singleStep = entry;
    }
    function testKeyboardPageMultiplier(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
        parsed.keyboardPageMultiplier = entry;
    }
    function testKeyboardMultiplier(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
        parsed.keyboardMultiplier = entry;
    }
    function testKeyboardDefaultStep(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
        parsed.keyboardDefaultStep = entry;
    }
    function testRange(parsed, entry) {
        // Filter incorrect input.
        if ("object" != typeof entry || Array.isArray(entry)) throw new Error("noUiSlider: 'range' is not an object.");
        // Catch missing start or end.
                if (void 0 === entry.min || void 0 === entry.max) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
        parsed.spectrum = new Spectrum(entry, parsed.snap || !1, parsed.singleStep);
    }
    function testStart(parsed, entry) {
        // Validate input. Values aren't tested, as the public .val method
        // will always provide a valid location.
        if (entry = asArray(entry), !Array.isArray(entry) || !entry.length) throw new Error("noUiSlider: 'start' option is incorrect.");
        // Store the number of handles.
                parsed.handles = entry.length, 
        // When the slider is initialized, the .val method will
        // be called with the start options.
        parsed.start = entry;
    }
    function testSnap(parsed, entry) {
        if ("boolean" != typeof entry) throw new Error("noUiSlider: 'snap' option must be a boolean.");
        // Enforce 100% stepping within subranges.
                parsed.snap = entry;
    }
    function testAnimate(parsed, entry) {
        if ("boolean" != typeof entry) throw new Error("noUiSlider: 'animate' option must be a boolean.");
        // Enforce 100% stepping within subranges.
                parsed.animate = entry;
    }
    function testAnimationDuration(parsed, entry) {
        if ("number" != typeof entry) throw new Error("noUiSlider: 'animationDuration' option must be a number.");
        parsed.animationDuration = entry;
    }
    function testConnect(parsed, entry) {
        var i, connect = [ !1 ];
        // Handle boolean options
        if (
        // Map legacy options
        "lower" === entry ? entry = [ !0, !1 ] : "upper" === entry && (entry = [ !1, !0 ]), 
        !0 === entry || !1 === entry) {
            for (i = 1; i < parsed.handles; i++) connect.push(entry);
            connect.push(!1);
        }
        // Reject invalid input
         else {
            if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
            connect = entry;
        }
        parsed.connect = connect;
    }
    function testOrientation(parsed, entry) {
        // Set orientation to an a numerical value for easy
        // array selection.
        switch (entry) {
          case "horizontal":
            parsed.ort = 0;
            break;

          case "vertical":
            parsed.ort = 1;
            break;

          default:
            throw new Error("noUiSlider: 'orientation' option is invalid.");
        }
    }
    function testMargin(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'margin' option must be numeric.");
        // Issue #582
                0 !== entry && (parsed.margin = parsed.spectrum.getDistance(entry));
    }
    function testLimit(parsed, entry) {
        if (!isNumeric(entry)) throw new Error("noUiSlider: 'limit' option must be numeric.");
        if (parsed.limit = parsed.spectrum.getDistance(entry), !parsed.limit || parsed.handles < 2) throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
    }
    function testPadding(parsed, entry) {
        var index;
        if (!isNumeric(entry) && !Array.isArray(entry)) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (Array.isArray(entry) && 2 !== entry.length && !isNumeric(entry[0]) && !isNumeric(entry[1])) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (0 !== entry) {
            for (Array.isArray(entry) || (entry = [ entry, entry ]), 
            // 'getDistance' returns false for invalid values.
            parsed.padding = [ parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1]) ], 
            index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) 
            // last "range" can't contain step size as it is purely an endpoint.
            if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
            var totalPadding = entry[0] + entry[1], firstValue = parsed.spectrum.xVal[0];
            if (totalPadding / (parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1] - firstValue) > 1) throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
        }
    }
    function testDirection(parsed, entry) {
        // Set direction as a numerical value for easy parsing.
        // Invert connection for RTL sliders, so that the proper
        // handles get the connect/background classes.
        switch (entry) {
          case "ltr":
            parsed.dir = 0;
            break;

          case "rtl":
            parsed.dir = 1;
            break;

          default:
            throw new Error("noUiSlider: 'direction' option was not recognized.");
        }
    }
    function testBehaviour(parsed, entry) {
        // Make sure the input is a string.
        if ("string" != typeof entry) throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
        // Check if the string contains any keywords.
        // None are required.
                var tap = entry.indexOf("tap") >= 0, drag = entry.indexOf("drag") >= 0, fixed = entry.indexOf("fixed") >= 0, snap = entry.indexOf("snap") >= 0, hover = entry.indexOf("hover") >= 0, unconstrained = entry.indexOf("unconstrained") >= 0, dragAll = entry.indexOf("drag-all") >= 0, smoothSteps = entry.indexOf("smooth-steps") >= 0;
        if (fixed) {
            if (2 !== parsed.handles) throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
            // Use margin to enforce fixed state
                        testMargin(parsed, parsed.start[1] - parsed.start[0]);
        }
        if (unconstrained && (parsed.margin || parsed.limit)) throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
        parsed.events = {
            tap: tap || snap,
            drag: drag,
            dragAll: dragAll,
            smoothSteps: smoothSteps,
            fixed: fixed,
            snap: snap,
            hover: hover,
            unconstrained: unconstrained
        };
    }
    function testTooltips(parsed, entry) {
        if (!1 !== entry) if (!0 === entry || isValidPartialFormatter(entry)) {
            parsed.tooltips = [];
            for (var i = 0; i < parsed.handles; i++) parsed.tooltips.push(entry);
        } else {
            if ((entry = asArray(entry)).length !== parsed.handles) throw new Error("noUiSlider: must pass a formatter for all handles.");
            entry.forEach((function(formatter) {
                if ("boolean" != typeof formatter && !isValidPartialFormatter(formatter)) throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
            })), parsed.tooltips = entry;
        }
    }
    function testHandleAttributes(parsed, entry) {
        if (entry.length !== parsed.handles) throw new Error("noUiSlider: must pass a attributes for all handles.");
        parsed.handleAttributes = entry;
    }
    function testAriaFormat(parsed, entry) {
        if (!isValidPartialFormatter(entry)) throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
        parsed.ariaFormat = entry;
    }
    function testFormat(parsed, entry) {
        if (!
        //region Helper Methods
        function(entry) {
            return isValidPartialFormatter(entry) && "function" == typeof entry.from;
        }(entry)) throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
        parsed.format = entry;
    }
    function testKeyboardSupport(parsed, entry) {
        if ("boolean" != typeof entry) throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
        parsed.keyboardSupport = entry;
    }
    function testDocumentElement(parsed, entry) {
        // This is an advanced option. Passed values are used without validation.
        parsed.documentElement = entry;
    }
    function testCssPrefix(parsed, entry) {
        if ("string" != typeof entry && !1 !== entry) throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
        parsed.cssPrefix = entry;
    }
    function testCssClasses(parsed, entry) {
        if ("object" != typeof entry) throw new Error("noUiSlider: 'cssClasses' must be an object.");
        "string" == typeof parsed.cssPrefix ? (parsed.cssClasses = {}, Object.keys(entry).forEach((function(key) {
            parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
        }))) : parsed.cssClasses = entry;
    }
    // Test all developer settings and parse to assumption-safe values.
        function testOptions(options) {
        // To prove a fix for #537, freeze options here.
        // If the object is modified, an error will be thrown.
        // Object.freeze(options);
        var parsed = {
            margin: null,
            limit: null,
            padding: null,
            animate: !0,
            animationDuration: 300,
            ariaFormat: defaultFormatter,
            format: defaultFormatter
        }, tests = {
            step: {
                r: !1,
                t: testStep
            },
            keyboardPageMultiplier: {
                r: !1,
                t: testKeyboardPageMultiplier
            },
            keyboardMultiplier: {
                r: !1,
                t: testKeyboardMultiplier
            },
            keyboardDefaultStep: {
                r: !1,
                t: testKeyboardDefaultStep
            },
            start: {
                r: !0,
                t: testStart
            },
            connect: {
                r: !0,
                t: testConnect
            },
            direction: {
                r: !0,
                t: testDirection
            },
            snap: {
                r: !1,
                t: testSnap
            },
            animate: {
                r: !1,
                t: testAnimate
            },
            animationDuration: {
                r: !1,
                t: testAnimationDuration
            },
            range: {
                r: !0,
                t: testRange
            },
            orientation: {
                r: !1,
                t: testOrientation
            },
            margin: {
                r: !1,
                t: testMargin
            },
            limit: {
                r: !1,
                t: testLimit
            },
            padding: {
                r: !1,
                t: testPadding
            },
            behaviour: {
                r: !0,
                t: testBehaviour
            },
            ariaFormat: {
                r: !1,
                t: testAriaFormat
            },
            format: {
                r: !1,
                t: testFormat
            },
            tooltips: {
                r: !1,
                t: testTooltips
            },
            keyboardSupport: {
                r: !0,
                t: testKeyboardSupport
            },
            documentElement: {
                r: !1,
                t: testDocumentElement
            },
            cssPrefix: {
                r: !0,
                t: testCssPrefix
            },
            cssClasses: {
                r: !0,
                t: testCssClasses
            },
            handleAttributes: {
                r: !1,
                t: testHandleAttributes
            }
        }, defaults = {
            connect: !1,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: !0,
            cssPrefix: "noUi-",
            cssClasses: cssClasses,
            keyboardPageMultiplier: 5,
            keyboardMultiplier: 1,
            keyboardDefaultStep: 10
        };
        // Tests are executed in the order they are presented here.
                // AriaFormat defaults to regular format, if any.
        options.format && !options.ariaFormat && (options.ariaFormat = options.format), 
        // Run all options through a testing mechanism to ensure correct
        // input. It should be noted that options might get modified to
        // be handled properly. E.g. wrapping integers in arrays.
        Object.keys(tests).forEach((function(name) {
            // If the option isn't set, but it is required, throw an error.
            if (isSet(options[name]) || void 0 !== defaults[name]) tests[name].t(parsed, isSet(options[name]) ? options[name] : defaults[name]); else if (tests[name].r) throw new Error("noUiSlider: '" + name + "' is required.");
        })), 
        // Forward pips options
        parsed.pips = options.pips;
        // All recent browsers accept unprefixed transform.
        // We need -ms- for IE9 and -webkit- for older Android;
        // Assume use of -webkit- if unprefixed and -ms- are not supported.
        // https://caniuse.com/#feat=transforms2d
        var d = document.createElement("div"), msPrefix = void 0 !== d.style.msTransform, noPrefix = void 0 !== d.style.transform;
        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
        return parsed.style = [ [ "left", "top" ], [ "right", "bottom" ] ][parsed.dir][parsed.ort], 
        parsed;
    }
    //endregion
        function scope(target, options, originalOptions) {
        var scope_Base, scope_Handles, scope_Connects, scope_Pips, scope_Tooltips, addTarget, behaviour, actions = window.navigator.pointerEnabled ? {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
        } : window.navigator.msPointerEnabled ? {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        } : {
            start: "mousedown touchstart",
            move: "mousemove touchmove",
            end: "mouseup touchend"
        }, supportsPassive = window.CSS && CSS.supports && CSS.supports("touch-action", "none") && 
        // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
        // Issue #785
        function() {
            var supportsPassive = !1;
            /* eslint-disable */            try {
                var opts = Object.defineProperty({}, "passive", {
                    get: function() {
                        supportsPassive = !0;
                    }
                });
                // @ts-ignore
                                window.addEventListener("test", null, opts);
            } catch (e) {}
            /* eslint-enable */            return supportsPassive;
        }(), scope_Target = target, scope_Spectrum = options.spectrum, scope_Values = [], scope_Locations = [], scope_HandleNumbers = [], scope_ActiveHandlesCount = 0, scope_Events = {}, scope_Document = target.ownerDocument, scope_DocumentElement = options.documentElement || scope_Document.documentElement, scope_Body = scope_Document.body, scope_DirOffset = "rtl" === scope_Document.dir || 1 === options.ort ? 0 : 100;
        // Creates a node, adds it to target, returns the new node.
        function addNodeTo(addTarget, className) {
            var div = scope_Document.createElement("div");
            return className && addClass(div, className), addTarget.appendChild(div), div;
        }
        // Append a origin to the base
                function addOrigin(base, handleNumber) {
            var origin = addNodeTo(base, options.cssClasses.origin), handle = addNodeTo(origin, options.cssClasses.handle);
            if (addNodeTo(handle, options.cssClasses.touchArea), handle.setAttribute("data-handle", String(handleNumber)), 
            options.keyboardSupport && (
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
            // 0 = focusable and reachable
            handle.setAttribute("tabindex", "0"), handle.addEventListener("keydown", (function(event) {
                // Handles keydown on focused handles
                // Don't move the document when pressing arrow keys on focused handles
                return function(event, handleNumber) {
                    if (isSliderDisabled() || isHandleDisabled(handleNumber)) return !1;
                    var horizontalKeys = [ "Left", "Right" ], verticalKeys = [ "Down", "Up" ], largeStepKeys = [ "PageDown", "PageUp" ], edgeKeys = [ "Home", "End" ];
                    options.dir && !options.ort ? 
                    // On an right-to-left slider, the left and right keys act inverted
                    horizontalKeys.reverse() : options.ort && !options.dir && (
                    // On a top-to-bottom slider, the up and down keys act inverted
                    verticalKeys.reverse(), largeStepKeys.reverse());
                    // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
                                        var to, key = event.key.replace("Arrow", ""), isLargeDown = key === largeStepKeys[0], isLargeUp = key === largeStepKeys[1], isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown, isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp, isMin = key === edgeKeys[0], isMax = key === edgeKeys[1];
                    if (!(isDown || isUp || isMin || isMax)) return !0;
                    if (event.preventDefault(), isUp || isDown) {
                        var direction = isDown ? 0 : 1, step = getNextStepsForHandle(handleNumber)[direction];
                        // At the edge of a slider, do nothing
                        if (null === step) return !1;
                        // No step set, use the default of 10% of the sub-range
                                                !1 === step && (step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep)), 
                        step *= isLargeUp || isLargeDown ? options.keyboardPageMultiplier : options.keyboardMultiplier, 
                        // Step over zero-length ranges (#948);
                        step = Math.max(step, 1e-7), 
                        // Decrement for down steps
                        step *= isDown ? -1 : 1, to = scope_Values[handleNumber] + step;
                    } else 
                    // End key
                    to = isMax ? options.spectrum.xVal[options.spectrum.xVal.length - 1] : options.spectrum.xVal[0];
                    return setHandle(handleNumber, scope_Spectrum.toStepping(to), !0, !0), fireEvent("slide", handleNumber), 
                    fireEvent("update", handleNumber), fireEvent("change", handleNumber), fireEvent("set", handleNumber), 
                    !1;
                }
                // Attach events to several slider parts.
                (event, handleNumber);
            }))), void 0 !== options.handleAttributes) {
                var attributes_1 = options.handleAttributes[handleNumber];
                Object.keys(attributes_1).forEach((function(attribute) {
                    handle.setAttribute(attribute, attributes_1[attribute]);
                }));
            }
            return handle.setAttribute("role", "slider"), handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal"), 
            0 === handleNumber ? addClass(handle, options.cssClasses.handleLower) : handleNumber === options.handles - 1 && addClass(handle, options.cssClasses.handleUpper), 
            origin.handle = handle, origin;
        }
        // Insert nodes for connect elements
                function addConnect(base, add) {
            return !!add && addNodeTo(base, options.cssClasses.connect);
        }
        // Add handles to the slider base.
                function addTooltip(handle, handleNumber) {
            return !(!options.tooltips || !options.tooltips[handleNumber]) && addNodeTo(handle.firstChild, options.cssClasses.tooltip);
        }
        function isSliderDisabled() {
            return scope_Target.hasAttribute("disabled");
        }
        // Disable the slider dragging if any handle is disabled
                function isHandleDisabled(handleNumber) {
            return scope_Handles[handleNumber].hasAttribute("disabled");
        }
        function removeTooltips() {
            scope_Tooltips && (removeEvent("update" + INTERNAL_EVENT_NS.tooltips), scope_Tooltips.forEach((function(tooltip) {
                tooltip && removeElement(tooltip);
            })), scope_Tooltips = null);
        }
        // The tooltips option is a shorthand for using the 'update' event.
                function tooltips() {
            removeTooltips(), 
            // Tooltips are added with options.tooltips in original order.
            scope_Tooltips = scope_Handles.map(addTooltip), bindEvent("update" + INTERNAL_EVENT_NS.tooltips, (function(values, handleNumber, unencoded) {
                if (scope_Tooltips && options.tooltips && !1 !== scope_Tooltips[handleNumber]) {
                    var formattedValue = values[handleNumber];
                    !0 !== options.tooltips[handleNumber] && (formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber])), 
                    scope_Tooltips[handleNumber].innerHTML = formattedValue;
                }
            }));
        }
        function mapToRange(values, stepped) {
            return values.map((function(value) {
                return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
            }));
        }
        function generateSpread(pips) {
            var array, group = function(pips) {
                // Use the range.
                if (pips.mode === PipsMode.Range || pips.mode === PipsMode.Steps) return scope_Spectrum.xVal;
                if (pips.mode === PipsMode.Count) {
                    if (pips.values < 2) throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
                    // Divide 0 - 100 in 'count' parts.
                                        // List these parts and have them handled as 'positions'.
                    for (var interval = pips.values - 1, spread = 100 / interval, values = []; interval--; ) values[interval] = interval * spread;
                    return values.push(100), mapToRange(values, pips.stepped);
                }
                return pips.mode === PipsMode.Positions ? mapToRange(pips.values, pips.stepped) : pips.mode === PipsMode.Values ? 
                // If the value must be stepped, it needs to be converted to a percentage first.
                pips.stepped ? pips.values.map((function(value) {
                    // Convert to percentage, apply step, return to value.
                    return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                })) : pips.values : [];
            }(pips), indexes = {}, firstInRange = scope_Spectrum.xVal[0], lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1], ignoreFirst = !1, ignoreLast = !1, prevPct = 0;
            return array = group.slice().sort((function(a, b) {
                return a - b;
            })), 
            // Make sure the range starts with the first element.
            (
            // Create a copy of the group, sort it and filter away all duplicates.
            group = array.filter((function(a) {
                return !this[a] && (this[a] = !0);
            }), {}))[0] !== firstInRange && (group.unshift(firstInRange), ignoreFirst = !0), 
            // Likewise for the last one.
            group[group.length - 1] !== lastInRange && (group.push(lastInRange), ignoreLast = !0), 
            group.forEach((function(current, index) {
                // Get the current step and the lower + upper positions.
                var step, i, q, newPct, pctDifference, pctPos, type, steps, realSteps, stepSize, low = current, high = group[index + 1], isSteps = pips.mode === PipsMode.Steps;
                // Find all steps in the subrange.
                for (
                // When using 'steps' mode, use the provided steps.
                // Otherwise, we'll step on to the next subrange.
                isSteps && (step = scope_Spectrum.xNumSteps[index]), 
                // Default to a 'full' step.
                step || (step = high - low), 
                // If high is undefined we are at the last subrange. Make sure it iterates once (#1088)
                void 0 === high && (high = low), 
                // Make sure step isn't 0, which would cause an infinite loop (#654)
                step = Math.max(step, 1e-7), i = low; i <= high; i = Number((i + step).toFixed(7))) {
                    // Divide all points evenly, adding the correct number to this subrange.
                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                    for (
                    // Get the percentage value for the current step,
                    // calculate the size for the subrange.
                    steps = (pctDifference = (newPct = scope_Spectrum.toStepping(i)) - prevPct) / (pips.density || 1), 
                    // This ratio represents the amount of percentage-space a point indicates.
                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                    // Round the percentage offset to an even number, then divide by two
                    // to spread the offset on both sides of the range.
                    stepSize = pctDifference / (realSteps = Math.round(steps)), q = 1; q <= realSteps; q += 1) 
                    // The ratio between the rounded value and the actual size might be ~1% off.
                    // Correct the percentage offset by the number of points
                    // per subrange. density = 1 will result in 100 points on the
                    // full range, 2 for 50, 4 for 25, etc.
                    indexes[(pctPos = prevPct + q * stepSize).toFixed(5)] = [ scope_Spectrum.fromStepping(pctPos), 0 ];
                    // Determine the point type.
                                        type = group.indexOf(i) > -1 ? PipsType.LargeValue : isSteps ? PipsType.SmallValue : PipsType.NoValue, 
                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                    !index && ignoreFirst && i !== high && (type = 0), i === high && ignoreLast || (
                    // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                    indexes[newPct.toFixed(5)] = [ i, type ]), 
                    // Update the percentage count.
                    prevPct = newPct;
                }
            })), indexes;
        }
        function addMarking(spread, filterFunc, formatter) {
            var _a, _b, element = scope_Document.createElement("div"), valueSizeClasses = ((_a = {})[PipsType.None] = "", 
            _a[PipsType.NoValue] = options.cssClasses.valueNormal, _a[PipsType.LargeValue] = options.cssClasses.valueLarge, 
            _a[PipsType.SmallValue] = options.cssClasses.valueSub, _a), markerSizeClasses = ((_b = {})[PipsType.None] = "", 
            _b[PipsType.NoValue] = options.cssClasses.markerNormal, _b[PipsType.LargeValue] = options.cssClasses.markerLarge, 
            _b[PipsType.SmallValue] = options.cssClasses.markerSub, _b), valueOrientationClasses = [ options.cssClasses.valueHorizontal, options.cssClasses.valueVertical ], markerOrientationClasses = [ options.cssClasses.markerHorizontal, options.cssClasses.markerVertical ];
            function getClasses(type, source) {
                var a = source === options.cssClasses.value, sizeClasses = a ? valueSizeClasses : markerSizeClasses;
                return source + " " + (a ? valueOrientationClasses : markerOrientationClasses)[options.ort] + " " + sizeClasses[type];
            }
            return addClass(element, options.cssClasses.pips), addClass(element, 0 === options.ort ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical), 
            // Append all points.
            Object.keys(spread).forEach((function(offset) {
                !function(offset, value, type) {
                    if ((
                    // Apply the filter function, if it is set.
                    type = filterFunc ? filterFunc(value, type) : type) !== PipsType.None) {
                        // Add a marker for every point
                        var node = addNodeTo(element, !1);
                        node.className = getClasses(type, options.cssClasses.marker), node.style[options.style] = offset + "%", 
                        // Values are only appended for points marked '1' or '2'.
                        type > PipsType.NoValue && ((node = addNodeTo(element, !1)).className = getClasses(type, options.cssClasses.value), 
                        node.setAttribute("data-value", String(value)), node.style[options.style] = offset + "%", 
                        node.innerHTML = String(formatter.to(value)));
                    }
                }(offset, spread[offset][0], spread[offset][1]);
            })), element;
        }
        function removePips() {
            scope_Pips && (removeElement(scope_Pips), scope_Pips = null);
        }
        function pips(pips) {
            // Fix #669
            removePips();
            var spread = generateSpread(pips), filter = pips.filter, format = pips.format || {
                to: function(value) {
                    return String(Math.round(value));
                }
            };
            return scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
        }
        // Shorthand for base dimensions.
                function baseSize() {
            var rect = scope_Base.getBoundingClientRect(), alt = "offset" + [ "Width", "Height" ][options.ort];
            return 0 === options.ort ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
        }
        // Handler for attaching events trough a proxy.
                function attachEvent(events, element, callback, data) {
            // This function can be used to 'filter' events to the slider.
            // element is a node, not a nodeList
            var method = function(event) {
                var el, className, e = 
                // Provide a clean event with standardized offset values.
                function(e, pageOffset, eventTarget) {
                    // Filter the event to register the type, which can be
                    // touch, mouse or pointer. Offset changes need to be
                    // made on an event specific basis.
                    var touch = 0 === e.type.indexOf("touch"), mouse = 0 === e.type.indexOf("mouse"), pointer = 0 === e.type.indexOf("pointer"), x = 0, y = 0;
                    // IE10 implemented pointer events with a prefix;
                    0 === e.type.indexOf("MSPointer") && (pointer = !0);
                    // Erroneous events seem to be passed in occasionally on iOS/iPadOS after user finishes interacting with
                    // the slider. They appear to be of type MouseEvent, yet they don't have usual properties set. Ignore
                    // events that have no touches or buttons associated with them. (#1057, #1079, #1095)
                                        if ("mousedown" === e.type && !e.buttons && !e.touches) return !1;
                    // The only thing one handle should be concerned about is the touches that originated on top of it.
                                        if (touch) {
                        // Returns true if a touch originated on the target.
                        var isTouchOnTarget = function(checkTouch) {
                            var target = checkTouch.target;
                            return target === eventTarget || eventTarget.contains(target) || e.composed && e.composedPath().shift() === eventTarget;
                        };
                        // In the case of touchstart events, we need to make sure there is still no more than one
                        // touch on the target so we look amongst all touches.
                                                if ("touchstart" === e.type) {
                            var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
                            // Do not support more than one touch per handle.
                                                        if (targetTouches.length > 1) return !1;
                            x = targetTouches[0].pageX, y = targetTouches[0].pageY;
                        } else {
                            // In the other cases, find on changedTouches is enough.
                            var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
                            // Cancel if the target touch has not moved.
                                                        if (!targetTouch) return !1;
                            x = targetTouch.pageX, y = targetTouch.pageY;
                        }
                    }
                    pageOffset = pageOffset || getPageOffset(scope_Document), (mouse || pointer) && (x = e.clientX + pageOffset.x, 
                    y = e.clientY + pageOffset.y);
                    // Fix #435
                    return e.pageOffset = pageOffset, e.points = [ x, y ], e.cursor = mouse || pointer, 
                    e;
                }
                // Translate a coordinate in the document to a percentage on the slider
                (event, data.pageOffset, data.target || element);
                // fixEvent returns false if this event has a different target
                // when handling (multi-) touch events;
                                return !!e && (
                // doNotReject is passed by all end events to make sure released touches
                // are not rejected, leaving the slider "stuck" to the cursor;
                !(isSliderDisabled() && !data.doNotReject) && (
                // Stop if an active 'tap' transition is taking place.
                el = scope_Target, className = options.cssClasses.tap, !((el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className)) && !data.doNotReject) && (
                // Ignore right or middle clicks on start #454
                !(events === actions.start && void 0 !== e.buttons && e.buttons > 1) && (
                // Ignore right or middle clicks on start #454
                (!data.hover || !e.buttons) && (
                // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
                // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
                // touch-action: manipulation, but that allows panning, which breaks
                // sliders after zooming/on non-responsive pages.
                // See: https://bugs.webkit.org/show_bug.cgi?id=133112
                supportsPassive || e.preventDefault(), e.calcPoint = e.points[options.ort], void 
                // Call the event handler with the event [ and additional data ].
                callback(e, data))))));
            }, methods = [];
            // Bind a closure on the target for every event type.
            return events.split(" ").forEach((function(eventName) {
                element.addEventListener(eventName, method, !!supportsPassive && {
                    passive: !0
                }), methods.push([ eventName, method ]);
            })), methods;
        }
        function calcPointToPercentage(calcPoint) {
            var elem, orientation, rect, doc, docElem, pageOffset, proposal = 100 * (calcPoint - (elem = scope_Base, 
            orientation = options.ort, rect = elem.getBoundingClientRect(), doc = elem.ownerDocument, 
            docElem = doc.documentElement, pageOffset = getPageOffset(doc), 
            // getBoundingClientRect contains left scroll in Chrome on Android.
            // I haven't found a feature detection that proves this. Worst case
            // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
            /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (pageOffset.x = 0), orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft)) / baseSize();
            // Clamp proposal between 0% and 100%
            // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
            // are used (e.g. contained handles feature)
            return proposal = limit(proposal), options.dir ? 100 - proposal : proposal;
        }
        // Find handle closest to a certain percentage on the slider
                // Fire 'end' when a mouse or pen leaves the document.
        function documentLeave(event, data) {
            "mouseout" === event.type && "HTML" === event.target.nodeName && null === event.relatedTarget && eventEnd(event, data);
        }
        // Handle movement on document for handle and range drag.
                function eventMove(event, data) {
            // Fix #498
            // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
            // IE9 has .buttons and .which zero on mousemove.
            // Firefox breaks the spec MDN defines.
            if (-1 === navigator.appVersion.indexOf("MSIE 9") && 0 === event.buttons && 0 !== data.buttonsProperty) return eventEnd(event, data);
            // Check if we are moving up or down
                        var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
            // Convert the movement into a percentage of the slider width/height
                        moveHandles(movement > 0, 100 * movement / data.baseSize, data.locations, data.handleNumbers, data.connect);
        }
        // Unbind move events on document, call callbacks.
                function eventEnd(event, data) {
            // The handle is no longer active, so remove the class.
            data.handle && (removeClass(data.handle, options.cssClasses.active), scope_ActiveHandlesCount -= 1), 
            // Unbind the move and end events, which are added on 'start'.
            data.listeners.forEach((function(c) {
                scope_DocumentElement.removeEventListener(c[0], c[1]);
            })), 0 === scope_ActiveHandlesCount && (
            // Remove dragging class.
            removeClass(scope_Target, options.cssClasses.drag), setZindex(), 
            // Remove cursor styles and text-selection events bound to the body.
            event.cursor && (scope_Body.style.cursor = "", scope_Body.removeEventListener("selectstart", preventDefault))), 
            options.events.smoothSteps && (data.handleNumbers.forEach((function(handleNumber) {
                setHandle(handleNumber, scope_Locations[handleNumber], !0, !0, !1, !1);
            })), data.handleNumbers.forEach((function(handleNumber) {
                fireEvent("update", handleNumber);
            }))), data.handleNumbers.forEach((function(handleNumber) {
                fireEvent("change", handleNumber), fireEvent("set", handleNumber), fireEvent("end", handleNumber);
            }));
        }
        // Bind move events on document.
                function eventStart(event, data) {
            // Ignore event if any handle is disabled
            if (!data.handleNumbers.some(isHandleDisabled)) {
                var handle;
                if (1 === data.handleNumbers.length) handle = scope_Handles[data.handleNumbers[0]].children[0], 
                scope_ActiveHandlesCount += 1, 
                // Mark the handle as 'active' so it can be styled.
                addClass(handle, options.cssClasses.active);
                // A drag should never propagate up to the 'tap' event.
                                event.stopPropagation();
                // Record the event listeners.
                var listeners = [], moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
                    // The event target has changed so we need to propagate the original one so that we keep
                    // relying on it to extract target touches.
                    target: event.target,
                    handle: handle,
                    connect: data.connect,
                    listeners: listeners,
                    startCalcPoint: event.calcPoint,
                    baseSize: baseSize(),
                    pageOffset: event.pageOffset,
                    handleNumbers: data.handleNumbers,
                    buttonsProperty: event.buttons,
                    locations: scope_Locations.slice()
                }), endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
                    target: event.target,
                    handle: handle,
                    listeners: listeners,
                    doNotReject: !0,
                    handleNumbers: data.handleNumbers
                }), outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
                    target: event.target,
                    handle: handle,
                    listeners: listeners,
                    doNotReject: !0,
                    handleNumbers: data.handleNumbers
                });
                // Attach the move and end events.
                                // We want to make sure we pushed the listeners in the listener list rather than creating
                // a new one as it has already been passed to the event handlers.
                listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent)), 
                // Text selection isn't an issue on touch devices,
                // so adding cursor styles can be skipped.
                event.cursor && (
                // Prevent the 'I' cursor and extend the range-drag cursor.
                scope_Body.style.cursor = getComputedStyle(event.target).cursor, 
                // Mark the target with a dragging state.
                scope_Handles.length > 1 && addClass(scope_Target, options.cssClasses.drag), 
                // Prevent text selection when dragging the handles.
                // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
                // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
                // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
                // The 'cursor' flag is false.
                // See: http://caniuse.com/#search=selectstart
                scope_Body.addEventListener("selectstart", preventDefault, !1)), data.handleNumbers.forEach((function(handleNumber) {
                    fireEvent("start", handleNumber);
                }));
            }
        }
        // Move closest handle to tapped location.
                function eventTap(event) {
            // The tap event shouldn't propagate up
            event.stopPropagation();
            var proposal = calcPointToPercentage(event.calcPoint), handleNumber = function(clickedPosition) {
                var smallestDifference = 100, handleNumber = !1;
                return scope_Handles.forEach((function(handle, index) {
                    // Disabled handles are ignored
                    if (!isHandleDisabled(index)) {
                        var handlePosition = scope_Locations[index], differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
                        (differenceWithThisHandle < smallestDifference || differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition || 100 === differenceWithThisHandle && 100 === smallestDifference) && (handleNumber = index, 
                        smallestDifference = differenceWithThisHandle);
                    }
                })), handleNumber;
            }(proposal);
            // Tackle the case that all handles are 'disabled'.
            !1 !== handleNumber && (
            // Flag the slider as it is now in a transitional state.
            // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
            options.events.snap || addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration), 
            setHandle(handleNumber, proposal, !0, !0), setZindex(), fireEvent("slide", handleNumber, !0), 
            fireEvent("update", handleNumber, !0), options.events.snap ? eventStart(event, {
                handleNumbers: [ handleNumber ]
            }) : (fireEvent("change", handleNumber, !0), fireEvent("set", handleNumber, !0)));
        }
        // Fires a 'hover' event for a hovered mouse/pen position.
                function eventHover(event) {
            var proposal = calcPointToPercentage(event.calcPoint), to = scope_Spectrum.getStep(proposal), value = scope_Spectrum.fromStepping(to);
            Object.keys(scope_Events).forEach((function(targetEvent) {
                "hover" === targetEvent.split(".")[0] && scope_Events[targetEvent].forEach((function(callback) {
                    callback.call(scope_Self, value);
                }));
            }));
        }
        // Attach an event to this slider, possibly including a namespace
        function bindEvent(namespacedEvent, callback) {
            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [], scope_Events[namespacedEvent].push(callback), 
            // If the event bound is 'update,' fire it immediately for all handles.
            "update" === namespacedEvent.split(".")[0] && scope_Handles.forEach((function(a, index) {
                fireEvent("update", index);
            }));
        }
        // Undo attachment of event
        function removeEvent(namespacedEvent) {
            var event = namespacedEvent && namespacedEvent.split(".")[0], namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
            Object.keys(scope_Events).forEach((function(bind) {
                var tEvent = bind.split(".")[0], tNamespace = bind.substring(tEvent.length);
                event && event !== tEvent || namespace && namespace !== tNamespace || function(namespace) {
                    return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
                }(tNamespace) && namespace !== tNamespace || delete scope_Events[bind];
            }));
        }
        // External event handling
                function fireEvent(eventName, handleNumber, tap) {
            Object.keys(scope_Events).forEach((function(targetEvent) {
                var eventType = targetEvent.split(".")[0];
                eventName === eventType && scope_Events[targetEvent].forEach((function(callback) {
                    callback.call(
                    // Use the slider public API as the scope ('this')
                    scope_Self, 
                    // Return values as array, so arg_1[arg_2] is always valid.
                    scope_Values.map(options.format.to), 
                    // Handle index, 0 or 1
                    handleNumber, 
                    // Un-formatted slider values
                    scope_Values.slice(), 
                    // Event is fired by tap, true or false
                    tap || !1, 
                    // Left offset of the handle, in relation to the slider
                    scope_Locations.slice(), 
                    // add the slider public API to an accessible parameter when this is unavailable
                    scope_Self);
                }));
            }));
        }
        // Split out the handle positioning logic so the Move event can use it, too
                function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue, smoothSteps) {
            var distance;
            // For sliders with multiple handles, limit movement to the other handle.
            // Apply the margin option by adding it to the handle positions.
                        // Return false if handle can't move
            return scope_Handles.length > 1 && !options.events.unconstrained && (lookBackward && handleNumber > 0 && (distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, !1), 
            to = Math.max(to, distance)), lookForward && handleNumber < scope_Handles.length - 1 && (distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, !0), 
            to = Math.min(to, distance))), 
            // The limit option has the opposite effect, limiting handles to a
            // maximum distance from another. Limit must be > 0, as otherwise
            // handles would be unmovable.
            scope_Handles.length > 1 && options.limit && (lookBackward && handleNumber > 0 && (distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, !1), 
            to = Math.min(to, distance)), lookForward && handleNumber < scope_Handles.length - 1 && (distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, !0), 
            to = Math.max(to, distance))), 
            // The padding option keeps the handles a certain distance from the
            // edges of the slider. Padding must be > 0.
            options.padding && (0 === handleNumber && (distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], !1), 
            to = Math.max(to, distance)), handleNumber === scope_Handles.length - 1 && (distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], !0), 
            to = Math.min(to, distance))), smoothSteps || (to = scope_Spectrum.getStep(to)), 
            !((
            // Limit percentage to the 0 - 100 range
            to = limit(to)) === reference[handleNumber] && !getValue) && to;
        }
        // Uses slider orientation to create CSS rules. a = base value;
                function inRuleOrder(v, a) {
            var o = options.ort;
            return (o ? a : v) + ", " + (o ? v : a);
        }
        // Moves handle(s) by a percentage
        // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
                function moveHandles(upward, proposal, locations, handleNumbers, connect) {
            var proposals = locations.slice(), firstHandle = handleNumbers[0], smoothSteps = options.events.smoothSteps, b = [ !upward, upward ], f = [ upward, !upward ];
            // Store first handle now, so we still have it in case handleNumbers is reversed
                        // Copy handleNumbers so we don't change the dataset
            handleNumbers = handleNumbers.slice(), 
            // Check to see which handle is 'leading'.
            // If that one can't move the second can't either.
            upward && handleNumbers.reverse(), 
            // Step 1: get the maximum percentage that any of the handles can move
            handleNumbers.length > 1 ? handleNumbers.forEach((function(handleNumber, o) {
                var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], !1, smoothSteps);
                // Stop if one of the handles can't move.
                                !1 === to ? proposal = 0 : (proposal = to - proposals[handleNumber], 
                proposals[handleNumber] = to);
            })) : b = f = [ !0 ];
            var state = !1;
            // Step 2: Try to set the handles with the found percentage
                        handleNumbers.forEach((function(handleNumber, o) {
                state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o], !1, smoothSteps) || state;
            })), 
            // Step 3: If a handle moved, fire events
            state && (handleNumbers.forEach((function(handleNumber) {
                fireEvent("update", handleNumber), fireEvent("slide", handleNumber);
            })), 
            // If target is a connect, then fire drag event
            null != connect && fireEvent("drag", firstHandle));
        }
        // Takes a base value and an offset. This offset is used for the connect bar size.
        // In the initial design for this feature, the origin element was 1% wide.
        // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
        // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
                function transformDirection(a, b) {
            return options.dir ? 100 - a - b : a;
        }
        // Updates scope_Locations and scope_Values, updates visual state
                // Handles before the slider middle are stacked later = higher,
        // Handles after the middle later is lower
        // [[7] [8] .......... | .......... [5] [4]
        function setZindex() {
            scope_HandleNumbers.forEach((function(handleNumber) {
                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1, zIndex = 3 + (scope_Handles.length + dir * handleNumber);
                scope_Handles[handleNumber].style.zIndex = String(zIndex);
            }));
        }
        // Test suggested values and apply margin, step.
        // if exactInput is true, don't run checkHandlePosition, then the handle can be placed in between steps (#436)
                function setHandle(handleNumber, to, lookBackward, lookForward, exactInput, smoothSteps) {
            return exactInput || (to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, !1, smoothSteps)), 
            !1 !== to && (function(handleNumber, to) {
                // Update locations.
                scope_Locations[handleNumber] = to, 
                // Convert the value to the slider stepping/range.
                scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
                var translateRule = "translate(" + inRuleOrder(transformDirection(to, 0) - scope_DirOffset + "%", "0") + ")";
                scope_Handles[handleNumber].style[options.transformRule] = translateRule, updateConnect(handleNumber), 
                updateConnect(handleNumber + 1);
            }(handleNumber, to), !0);
        }
        // Updates style attribute for connect nodes
                function updateConnect(index) {
            // Skip connects set to false
            if (scope_Connects[index]) {
                var l = 0, h = 100;
                0 !== index && (l = scope_Locations[index - 1]), index !== scope_Connects.length - 1 && (h = scope_Locations[index]);
                // We use two rules:
                // 'translate' to change the left/top offset;
                // 'scale' to change the width of the element;
                // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
                var connectWidth = h - l, translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")", scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
                scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
            }
        }
        // Parses value passed to .set method. Returns current value if not parse-able.
                function resolveToValue(to, handleNumber) {
            // Setting with null indicates an 'ignore'.
            // Inputting 'false' is invalid.
            return null === to || !1 === to || void 0 === to ? scope_Locations[handleNumber] : (
            // If a formatted number was passed, attempt to decode it.
            "number" == typeof to && (to = String(to)), !1 !== (to = options.format.from(to)) && (to = scope_Spectrum.toStepping(to)), 
            // If parsing the number failed, use the current value.
            !1 === to || isNaN(to) ? scope_Locations[handleNumber] : to);
        }
        // Set the slider value.
                function valueSet(input, fireSetEvent, exactInput) {
            var values = asArray(input), isInit = void 0 === scope_Locations[0];
            // Event fires by default
            fireSetEvent = void 0 === fireSetEvent || fireSetEvent, 
            // Animation is optional.
            // Make sure the initial values were set before using animated placement.
            options.animate && !isInit && addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration), 
            // First pass, without lookAhead but with lookBackward. Values are set from left to right.
            scope_HandleNumbers.forEach((function(handleNumber) {
                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), !0, !1, exactInput);
            }));
            var i = 1 === scope_HandleNumbers.length ? 0 : 1;
            // Spread handles evenly across the slider if the range has no size (min=max)
                        if (isInit && scope_Spectrum.hasNoSize() && (exactInput = !0, scope_Locations[0] = 0, 
            scope_HandleNumbers.length > 1)) {
                var space_1 = 100 / (scope_HandleNumbers.length - 1);
                scope_HandleNumbers.forEach((function(handleNumber) {
                    scope_Locations[handleNumber] = handleNumber * space_1;
                }));
            }
            // Secondary passes. Now that all base values are set, apply constraints.
            // Iterate all handles to ensure constraints are applied for the entire slider (Issue #1009)
                        for (;i < scope_HandleNumbers.length; ++i) scope_HandleNumbers.forEach((function(handleNumber) {
                setHandle(handleNumber, scope_Locations[handleNumber], !0, !0, exactInput);
            }));
            setZindex(), scope_HandleNumbers.forEach((function(handleNumber) {
                fireEvent("update", handleNumber), 
                // Fire the event only for handles that received a new value, as per #579
                null !== values[handleNumber] && fireSetEvent && fireEvent("set", handleNumber);
            }));
        }
        // Reset slider to initial values
                // Get the slider value.
        function valueGet(unencoded) {
            if (void 0 === unencoded && (unencoded = !1), unencoded) 
            // return a copy of the raw values
            return 1 === scope_Values.length ? scope_Values[0] : scope_Values.slice(0);
            var values = scope_Values.map(options.format.to);
            // If only one handle is used, return a single value.
                        return 1 === values.length ? values[0] : values;
        }
        // Removes classes from the root and empties it.
                function getNextStepsForHandle(handleNumber) {
            var location = scope_Locations[handleNumber], nearbySteps = scope_Spectrum.getNearbySteps(location), value = scope_Values[handleNumber], increment = nearbySteps.thisStep.step, decrement = null;
            // If snapped, directly use defined step value
            if (options.snap) return [ value - nearbySteps.stepBefore.startValue || null, nearbySteps.stepAfter.startValue - value || null ];
            // If the next value in this step moves into the next step,
            // the increment is the start of the next step - the current value
                        !1 !== increment && value + increment > nearbySteps.stepAfter.startValue && (increment = nearbySteps.stepAfter.startValue - value), 
            // If the value is beyond the starting point
            decrement = value > nearbySteps.thisStep.startValue ? nearbySteps.thisStep.step : !1 !== nearbySteps.stepBefore.step && value - nearbySteps.stepBefore.highestStep, 
            // Now, if at the slider edges, there is no in/decrement
            100 === location ? increment = null : 0 === location && (decrement = null);
            // As per #391, the comparison for the decrement step can have some rounding issues.
            var stepDecimals = scope_Spectrum.countStepDecimals();
            // Round per #391
                        return null !== increment && !1 !== increment && (increment = Number(increment.toFixed(stepDecimals))), 
            null !== decrement && !1 !== decrement && (decrement = Number(decrement.toFixed(stepDecimals))), 
            [ decrement, increment ];
        }
        // Get the current step size for the slider.
                // Apply classes and data to the target.
        addClass(addTarget = scope_Target, options.cssClasses.target), 0 === options.dir ? addClass(addTarget, options.cssClasses.ltr) : addClass(addTarget, options.cssClasses.rtl), 
        0 === options.ort ? addClass(addTarget, options.cssClasses.horizontal) : addClass(addTarget, options.cssClasses.vertical), 
        addClass(addTarget, "rtl" === getComputedStyle(addTarget).direction ? options.cssClasses.textDirectionRtl : options.cssClasses.textDirectionLtr), 
        // Create the base element, initialize HTML and set classes.
        // Add handles and connect elements.
        scope_Base = addNodeTo(addTarget, options.cssClasses.base), function(connectOptions, base) {
            var connectBase = addNodeTo(base, options.cssClasses.connects);
            scope_Handles = [], (scope_Connects = []).push(addConnect(connectBase, connectOptions[0]));
            // [::::O====O====O====]
            // connectOptions = [0, 1, 1, 1]
            for (var i = 0; i < options.handles; i++) 
            // Keep a list of all added handles.
            scope_Handles.push(addOrigin(base, i)), scope_HandleNumbers[i] = i, scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
        }
        // Initialize a single slider.
        (options.connect, scope_Base), 
        // Attach the standard drag event to the handles.
        (
        // Attach user events.
        behaviour = options.events).fixed || scope_Handles.forEach((function(handle, index) {
            // These events are only bound to the visual handle
            // element, not the 'real' origin element.
            attachEvent(actions.start, handle.children[0], eventStart, {
                handleNumbers: [ index ]
            });
        })), 
        // Attach the tap event to the slider base.
        behaviour.tap && attachEvent(actions.start, scope_Base, eventTap, {}), 
        // Fire hover events
        behaviour.hover && attachEvent(actions.move, scope_Base, eventHover, {
            hover: !0
        }), 
        // Make the range draggable.
        behaviour.drag && scope_Connects.forEach((function(connect, index) {
            if (!1 !== connect && 0 !== index && index !== scope_Connects.length - 1) {
                var handleBefore = scope_Handles[index - 1], handleAfter = scope_Handles[index], eventHolders = [ connect ], handlesToDrag = [ handleBefore, handleAfter ], handleNumbersToDrag = [ index - 1, index ];
                addClass(connect, options.cssClasses.draggable), 
                // When the range is fixed, the entire range can
                // be dragged by the handles. The handle in the first
                // origin will propagate the start event upward,
                // but it needs to be bound manually on the other.
                behaviour.fixed && (eventHolders.push(handleBefore.children[0]), eventHolders.push(handleAfter.children[0])), 
                behaviour.dragAll && (handlesToDrag = scope_Handles, handleNumbersToDrag = scope_HandleNumbers), 
                eventHolders.forEach((function(eventHolder) {
                    attachEvent(actions.start, eventHolder, eventStart, {
                        handles: handlesToDrag,
                        handleNumbers: handleNumbersToDrag,
                        connect: connect
                    });
                }));
            }
        })), 
        // Use the public value method to set the start values.
        valueSet(options.start), options.pips && pips(options.pips), options.tooltips && tooltips(), 
        removeEvent("update" + INTERNAL_EVENT_NS.aria), bindEvent("update" + INTERNAL_EVENT_NS.aria, (function(values, handleNumber, unencoded, tap, positions) {
            // Update Aria Values for all handles, as a change in one changes min and max values for the next.
            scope_HandleNumbers.forEach((function(index) {
                var handle = scope_Handles[index], min = checkHandlePosition(scope_Locations, index, 0, !0, !0, !0), max = checkHandlePosition(scope_Locations, index, 100, !0, !0, !0), now = positions[index], text = String(options.ariaFormat.to(unencoded[index]));
                // Map to slider range values
                min = scope_Spectrum.fromStepping(min).toFixed(1), max = scope_Spectrum.fromStepping(max).toFixed(1), 
                now = scope_Spectrum.fromStepping(now).toFixed(1), handle.children[0].setAttribute("aria-valuemin", min), 
                handle.children[0].setAttribute("aria-valuemax", max), handle.children[0].setAttribute("aria-valuenow", now), 
                handle.children[0].setAttribute("aria-valuetext", text);
            }));
        }));
        var scope_Self = {
            destroy: function() {
                for (
                // remove protected internal listeners
                removeEvent(INTERNAL_EVENT_NS.aria), removeEvent(INTERNAL_EVENT_NS.tooltips), Object.keys(options.cssClasses).forEach((function(key) {
                    removeClass(scope_Target, options.cssClasses[key]);
                })); scope_Target.firstChild; ) scope_Target.removeChild(scope_Target.firstChild);
                delete scope_Target.noUiSlider;
            },
            steps: function() {
                return scope_HandleNumbers.map(getNextStepsForHandle);
            }
            // Updatable: margin, limit, padding, step, range, animate, snap
            ,
            on: bindEvent,
            off: removeEvent,
            get: valueGet,
            set: valueSet,
            setHandle: 
            // Set value for a single handle
            function(handleNumber, value, fireSetEvent, exactInput) {
                if (!((
                // Ensure numeric input
                handleNumber = Number(handleNumber)) >= 0 && handleNumber < scope_HandleNumbers.length)) throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
                // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
                // The exactInput argument can be used to ignore slider stepping (#436)
                                setHandle(handleNumber, resolveToValue(value, handleNumber), !0, !0, exactInput), 
                fireEvent("update", handleNumber), fireSetEvent && fireEvent("set", handleNumber);
            },
            reset: function(fireSetEvent) {
                valueSet(options.start, fireSetEvent);
            },
            disable: function(handleNumber) {
                null != handleNumber ? (scope_Handles[handleNumber].setAttribute("disabled", ""), 
                scope_Handles[handleNumber].handle.removeAttribute("tabindex")) : (scope_Target.setAttribute("disabled", ""), 
                scope_Handles.forEach((function(handle) {
                    handle.handle.removeAttribute("tabindex");
                })));
            },
            enable: function(handleNumber) {
                null != handleNumber ? (scope_Handles[handleNumber].removeAttribute("disabled"), 
                scope_Handles[handleNumber].handle.setAttribute("tabindex", "0")) : (scope_Target.removeAttribute("disabled"), 
                scope_Handles.forEach((function(handle) {
                    handle.removeAttribute("disabled"), handle.handle.setAttribute("tabindex", "0");
                })));
            },
            // Exposed for unit testing, don't use this in your application.
            __moveHandles: function(upward, proposal, handleNumbers) {
                moveHandles(upward, proposal, scope_Locations, handleNumbers);
            },
            options: originalOptions,
            updateOptions: function(optionsToUpdate, fireSetEvent) {
                // Spectrum is created using the range, snap, direction and step options.
                // 'snap' and 'step' can be updated.
                // If 'snap' and 'step' are not passed, they should remain unchanged.
                var v = valueGet(), updateAble = [ "margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips" ];
                // Only change options that we're actually passed to update.
                updateAble.forEach((function(name) {
                    // Check for undefined. null removes the value.
                    void 0 !== optionsToUpdate[name] && (originalOptions[name] = optionsToUpdate[name]);
                }));
                var newOptions = testOptions(originalOptions);
                // Load new options into the slider state
                                updateAble.forEach((function(name) {
                    void 0 !== optionsToUpdate[name] && (options[name] = newOptions[name]);
                })), scope_Spectrum = newOptions.spectrum, 
                // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
                options.margin = newOptions.margin, options.limit = newOptions.limit, options.padding = newOptions.padding, 
                // Update pips, removes existing.
                options.pips ? pips(options.pips) : removePips(), 
                // Update tooltips, removes existing.
                options.tooltips ? tooltips() : removeTooltips(), 
                // Invalidate the current positioning so valueSet forces an update.
                scope_Locations = [], valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
            }
            // Initialization steps
            ,
            target: scope_Target,
            removePips: removePips,
            removeTooltips: removeTooltips,
            getPositions: function() {
                return scope_Locations.slice();
            },
            getTooltips: function() {
                return scope_Tooltips;
            },
            getOrigins: function() {
                return scope_Handles;
            },
            pips: pips
        };
        return scope_Self;
    }
    // Run the standard initializer
        var noUiSlider = {
        // Exposed for unit testing, don't use this in your application.
        __spectrum: Spectrum,
        // A reference to the default classes, allows global changes.
        // Use the cssClasses option for changes to one slider.
        cssClasses: cssClasses,
        create: function(target, originalOptions) {
            if (!target || !target.nodeName) throw new Error("noUiSlider: create requires a single element, got: " + target);
            // Throw an error if the slider was already initialized.
                        if (target.noUiSlider) throw new Error("noUiSlider: Slider was already initialized.");
            // Test the options and create the slider environment;
                        var api = scope(target, testOptions(originalOptions), originalOptions);
            return target.noUiSlider = api, api;
        }
    }, build = {};
    // Polyfill for creating CustomEvents on IE9/10/11
    // code pulled from:
    // https://github.com/d4tocchini/customevent-polyfill
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
    try {
        var ce = new window.CustomEvent("test");
        if (ce.preventDefault(), !0 !== ce.defaultPrevented) 
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error("Could not prevent default");
    } catch (e) {
        var CustomEvent$1 = function(event, params) {
            var evt, origPrevent;
            return params = params || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            }, (evt = document.createEvent("CustomEvent")).initCustomEvent(event, params.bubbles, params.cancelable, params.detail), 
            origPrevent = evt.preventDefault, evt.preventDefault = function() {
                origPrevent.call(this);
                try {
                    Object.defineProperty(this, "defaultPrevented", {
                        get: function() {
                            return !0;
                        }
                    });
                } catch (e) {
                    this.defaultPrevented = !0;
                }
            }, evt;
        };
        CustomEvent$1.prototype = window.Event.prototype, window.CustomEvent = CustomEvent$1;
    }
    Object.defineProperty(build, "__esModule", {
        value: !0
    });
    var _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }, _slicedToArray = function(arr, i) {
        if (Array.isArray(arr)) return arr;
        if (Symbol.iterator in Object(arr)) return function(arr, i) {
            var _arr = [], _n = !0, _d = !1, _e = void 0;
            try {
                for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), 
                !i || _arr.length !== i); _n = !0) ;
            } catch (err) {
                _d = !0, _e = err;
            } finally {
                try {
                    !_n && _i.return && _i.return();
                } finally {
                    if (_d) throw _e;
                }
            }
            return _arr;
        }(arr, i);
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }, _default = build.default = function(element, customParams) {
        // Overrides the default options with the ones provided by the user
        var nodeList = [], selects = [];
        return function() {
            // The plugin is called on a single HTMLElement
            if (element && element instanceof HTMLElement && "SELECT" === element.tagName.toUpperCase()) nodeList.push(element);
            // The plugin is called on a selector
             else if (element && "string" == typeof element) for (var elementsList = document.querySelectorAll(element), i = 0, l = elementsList.length; i < l; ++i) elementsList[i] instanceof HTMLElement && "SELECT" === elementsList[i].tagName.toUpperCase() && nodeList.push(elementsList[i]);
            // The plugin is called on any HTMLElements list (NodeList, HTMLCollection, Array, etc.)
             else if (element && element.length) for (var _i3 = 0, _l3 = element.length; _i3 < _l3; ++_i3) element[_i3] instanceof HTMLElement && "SELECT" === element[_i3].tagName.toUpperCase() && nodeList.push(element[_i3]);
            // Launches the plugin over every HTMLElement
            // And stores every plugin instance
                        for (var _i4 = 0, _l4 = nodeList.length; _i4 < _l4; ++_i4) selects.push(builder(nodeList[_i4], _extends({}, defaultParams, customParams)));
            // Returns all plugin instances
                        return selects;
        }();
    }, defaultParams = {
        containerClass: "custom-select-container",
        openerClass: "custom-select-opener",
        panelClass: "custom-select-panel",
        optionClass: "custom-select-option",
        optgroupClass: "custom-select-optgroup",
        isSelectedClass: "is-selected",
        hasFocusClass: "has-focus",
        isDisabledClass: "is-disabled",
        isOpenClass: "is-open"
    };
    function builder(el, builderParams) {
        var containerClass = "customSelect", isOpen = !1, uId = "", select = el, container = void 0, opener = void 0, focusedElement = void 0, selectedElement = void 0, panel = void 0, currLabel = void 0, resetSearchTimeout = void 0, searchKey = "";
        // Inner Functions
        // Sets the focused element with the neccessary classes substitutions
        function setFocusedElement(cstOption) {
            focusedElement && focusedElement.classList.remove(builderParams.hasFocusClass), 
            void 0 !== cstOption ? ((focusedElement = cstOption).classList.add(builderParams.hasFocusClass), 
            // Offset update: checks if the focused element is in the visible part of the panelClass
            // if not dispatches a custom event
            isOpen && (cstOption.offsetTop < cstOption.offsetParent.scrollTop || cstOption.offsetTop > cstOption.offsetParent.scrollTop + cstOption.offsetParent.clientHeight - cstOption.clientHeight) && cstOption.dispatchEvent(new CustomEvent("custom-select:focus-outside-panel", {
                bubbles: !0
            }))) : focusedElement = void 0;
        }
        // Reassigns the focused and selected custom option
        // Updates the opener text
        // IMPORTANT: the setSelectedElement function doesn't change the select value!
                function setSelectedElement(cstOption) {
            selectedElement && (selectedElement.classList.remove(builderParams.isSelectedClass), 
            selectedElement.removeAttribute("id"), opener.removeAttribute("aria-activedescendant")), 
            void 0 !== cstOption ? (cstOption.classList.add(builderParams.isSelectedClass), 
            cstOption.setAttribute("id", containerClass + "-" + uId + "-selectedOption"), opener.setAttribute("aria-activedescendant", containerClass + "-" + uId + "-selectedOption"), 
            selectedElement = cstOption, opener.children[0].textContent = selectedElement.customSelectOriginalOption.text) : (selectedElement = void 0, 
            opener.children[0].textContent = ""), setFocusedElement(cstOption);
        }
        function moveFocuesedElement(direction) {
            // Get all the .custom-select-options
            // Get the index of the current focused one
            var currentFocusedIndex = [].indexOf.call(select.options, focusedElement.customSelectOriginalOption);
            // If the next or prev custom option exist
            // Sets it as the new focused one
                        select.options[currentFocusedIndex + direction] && setFocusedElement(select.options[currentFocusedIndex + direction].customSelectCstOption);
        }
        // Open/Close function (toggle)
                function open(bool) {
            // Open
            if (bool || void 0 === bool) {
                // If present closes an opened instance of the plugin
                // Only one at time can be open
                var openedCustomSelect = document.querySelector("." + containerClass + "." + builderParams.isOpenClass);
                openedCustomSelect && (openedCustomSelect.customSelect.open = !1), 
                // Opens only the clicked one
                container.classList.add(builderParams.isOpenClass), 
                // aria-expanded update
                container.classList.add(builderParams.isOpenClass), opener.setAttribute("aria-expanded", "true"), 
                // Updates the scrollTop position of the panel in relation with the focused option
                selectedElement && (panel.scrollTop = selectedElement.offsetTop), 
                // Dispatches the custom event open
                container.dispatchEvent(new CustomEvent("custom-select:open")), 
                // Sets the global state
                isOpen = !0;
            } else 
            // Removes the css classes
            container.classList.remove(builderParams.isOpenClass), 
            // aria-expanded update
            opener.setAttribute("aria-expanded", "false"), 
            // Sets the global state
            isOpen = !1, 
            // When closing the panel the focused custom option must be the selected one
            setFocusedElement(selectedElement), 
            // Dispatches the custom event close
            container.dispatchEvent(new CustomEvent("custom-select:close"));
            return isOpen;
        }
        function clickEvent(e) {
            // Opener click
            e.target === opener || opener.contains(e.target) ? isOpen ? open(!1) : open() : e.target.classList && e.target.classList.contains(builderParams.optionClass) && panel.contains(e.target) ? (setSelectedElement(e.target), 
            // Sets the corrisponding select's option to selected updating the select's value too
            selectedElement.customSelectOriginalOption.selected = !0, open(!1), 
            // Triggers the native change event of the select
            select.dispatchEvent(new CustomEvent("change"))) : e.target === select ? 
            // if the original select is focusable (for any external reason) let the focus
            // else trigger the focus on opener
            opener !== document.activeElement && select !== document.activeElement && opener.focus() : isOpen && !container.contains(e.target) && open(!1);
        }
        function mouseoverEvent(e) {
            // On mouse move over and options it bacames the focused one
            e.target.classList && e.target.classList.contains(builderParams.optionClass) && setFocusedElement(e.target);
        }
        function keydownEvent(e) {
            if (isOpen) switch (e.keyCode) {
              case 13:
              case 32:
                // On "Enter" or "Space" selects the focused element as the selected one
                setSelectedElement(focusedElement), 
                // Sets the corrisponding select's option to selected updating the select's value too
                selectedElement.customSelectOriginalOption.selected = !0, 
                // Triggers the native change event of the select
                select.dispatchEvent(new CustomEvent("change")), open(!1);
                break;

              case 27:
                // On "Escape" closes the panel
                open(!1);
                break;

              case 38:
                // On "Arrow up" set focus to the prev option if present
                moveFocuesedElement(-1);
                break;

              case 40:
                // On "Arrow down" set focus to the next option if present
                moveFocuesedElement(1);
                break;

              default:
                // search in panel (autocomplete)
                if (e.keyCode >= 48 && e.keyCode <= 90) {
                    // clear existing reset timeout
                    resetSearchTimeout && clearTimeout(resetSearchTimeout), 
                    // reset timeout for empty search key
                    resetSearchTimeout = setTimeout((function() {
                        searchKey = "";
                    }), 1500), 
                    // update search keyword appending the current key
                    searchKey += String.fromCharCode(e.keyCode);
                    // search the element
                    for (var i = 0, l = select.options.length; i < l; i++) 
                    // removed cause not supported by IE:
                    // if (options[i].text.startsWith(searchKey))
                    if (select.options[i].text.toUpperCase().substr(0, searchKey.length) === searchKey) {
                        setFocusedElement(select.options[i].customSelectCstOption);
                        break;
                    }
                }
            } else 
            // On "Arrow down", "Arrow up" and "Space" keys opens the panel
            40 !== e.keyCode && 38 !== e.keyCode && 32 !== e.keyCode || open();
        }
        function changeEvent() {
            var index = select.selectedIndex;
            setSelectedElement(-1 === index ? void 0 : select.options[index].customSelectCstOption);
        }
        // When the option is outside the visible part of the opened panel, updates the scrollTop position
        // This is the default behaviour
        // To block it the plugin user must
        // add a "custom-select:focus-outside-panel" eventListener on the panel
        // with useCapture set to true
        // and stopPropagation
                function scrollToFocused(e) {
            var currPanel = e.currentTarget, currOption = e.target;
            // Up
            currOption.offsetTop < currPanel.scrollTop ? currPanel.scrollTop = currOption.offsetTop : currPanel.scrollTop = currOption.offsetTop + currOption.clientHeight - currPanel.clientHeight;
        }
        function addEvents() {
            document.addEventListener("click", clickEvent), panel.addEventListener("mouseover", mouseoverEvent), 
            panel.addEventListener("custom-select:focus-outside-panel", scrollToFocused), select.addEventListener("change", changeEvent), 
            container.addEventListener("keydown", keydownEvent);
        }
        function removeEvents() {
            document.removeEventListener("click", clickEvent), panel.removeEventListener("mouseover", mouseoverEvent), 
            panel.removeEventListener("custom-select:focus-outside-panel", scrollToFocused), 
            select.removeEventListener("change", changeEvent), container.removeEventListener("keydown", keydownEvent);
        }
        // Form a given select children DOM tree (options and optgroup),
        // Creates the corresponding custom HTMLElements list (divs with different classes and attributes)
        function parseMarkup(children) {
            var nodeList = children, cstList = [];
            if (void 0 === nodeList.length) throw new TypeError("Invalid Argument");
            for (var i = 0, li = nodeList.length; i < li; i++) if (nodeList[i] instanceof HTMLElement && "OPTGROUP" === nodeList[i].tagName.toUpperCase()) {
                var cstOptgroup = document.createElement("div");
                cstOptgroup.classList.add(builderParams.optgroupClass), cstOptgroup.setAttribute("data-label", nodeList[i].label), 
                // IMPORTANT: Stores in a property of the created custom option group
                // a hook to the the corrisponding select's option group
                cstOptgroup.customSelectOriginalOptgroup = nodeList[i], 
                // IMPORTANT: Stores in a property of select's option group
                // a hook to the created custom option group
                nodeList[i].customSelectCstOptgroup = cstOptgroup;
                for (var subNodes = parseMarkup(nodeList[i].children), j = 0, lj = subNodes.length; j < lj; j++) cstOptgroup.appendChild(subNodes[j]);
                cstList.push(cstOptgroup);
            } else {
                if (!(nodeList[i] instanceof HTMLElement && "OPTION" === nodeList[i].tagName.toUpperCase())) throw new TypeError("Invalid Argument");
                var cstOption = document.createElement("div");
                cstOption.classList.add(builderParams.optionClass), cstOption.textContent = nodeList[i].text, 
                cstOption.setAttribute("data-value", nodeList[i].value), cstOption.setAttribute("role", "option"), 
                // IMPORTANT: Stores in a property of the created custom option
                // a hook to the the corrisponding select's option
                cstOption.customSelectOriginalOption = nodeList[i], 
                // IMPORTANT: Stores in a property of select's option
                // a hook to the created custom option
                nodeList[i].customSelectCstOption = cstOption, 
                // If the select's option is selected
                nodeList[i].selected && setSelectedElement(cstOption), cstList.push(cstOption);
            }
            return cstList;
        }
        function _append(nodePar, appendIntoOriginal, targetPar) {
            var target = void 0;
            if (void 0 === targetPar || targetPar === select) target = panel; else {
                if (!(targetPar instanceof HTMLElement && "OPTGROUP" === targetPar.tagName.toUpperCase() && select.contains(targetPar))) throw new TypeError("Invalid Argument");
                // If the node provided is a single HTMLElement it is stored in an array
                                target = targetPar.customSelectCstOptgroup;
            }
            var node = nodePar instanceof HTMLElement ? [ nodePar ] : nodePar;
            // Injects the options|optgroup in the select
                        if (appendIntoOriginal) for (var i = 0, l = node.length; i < l; i++) target === panel ? select.appendChild(node[i]) : target.customSelectOriginalOptgroup.appendChild(node[i]);
            // The custom markup to append
                        // Injects the created DOM content in the panel
            for (var markupToInsert = parseMarkup(node), _i = 0, _l = markupToInsert.length; _i < _l; _i++) target.appendChild(markupToInsert[_i]);
            return node;
        }
        (
        // Custom Select DOM tree creation
        // Creates the container/wrapper
        container = document.createElement("div")).classList.add(builderParams.containerClass, containerClass), 
        (
        // Creates the opener
        opener = document.createElement("span")).className = builderParams.openerClass, 
        opener.setAttribute("role", "combobox"), opener.setAttribute("aria-autocomplete", "list"), 
        opener.setAttribute("aria-expanded", "false"), opener.innerHTML = "<span>\n   " + (-1 !== select.selectedIndex ? select.options[select.selectedIndex].text : "") + "\n   </span>", 
        // Creates the panel
        // and injects the markup of the select inside
        // with some tag and attributes replacement
        panel = document.createElement("div");
        for (
        // Create random id
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0; i < 5; i++) uId += possible.charAt(Math.floor(62 * Math.random()));
        // Returns the plugin instance, with the public exposed methods and properties
        return panel.id = containerClass + "-" + uId + "-panel", panel.className = builderParams.panelClass, 
        panel.setAttribute("role", "listbox"), opener.setAttribute("aria-owns", panel.id), 
        _append(select.children, !1), 
        // Injects the container in the original DOM position of the select
        container.appendChild(opener), select.parentNode.replaceChild(container, select), 
        container.appendChild(select), container.appendChild(panel), 
        // ARIA labelledby - label
        document.querySelector('label[for="' + select.id + '"]') ? currLabel = document.querySelector('label[for="' + select.id + '"]') : "LABEL" === container.parentNode.tagName.toUpperCase() && (currLabel = container.parentNode), 
        void 0 !== currLabel && (currLabel.setAttribute("id", containerClass + "-" + uId + "-label"), 
        opener.setAttribute("aria-labelledby", containerClass + "-" + uId + "-label")), 
        // Event Init
        select.disabled ? container.classList.add(builderParams.isDisabledClass) : (opener.setAttribute("tabindex", "0"), 
        select.setAttribute("tabindex", "-1"), addEvents()), 
        // Stores the plugin public exposed methods and properties, directly in the container HTMLElement
        container.customSelect = {
            get pluginOptions() {
                return builderParams;
            },
            get open() {
                return isOpen;
            },
            set open(bool) {
                open(bool);
            },
            get disabled() {
                return select.disabled;
            },
            set disabled(bool) {
                !function(bool) {
                    bool && !select.disabled ? (container.classList.add(builderParams.isDisabledClass), 
                    select.disabled = !0, opener.removeAttribute("tabindex"), container.dispatchEvent(new CustomEvent("custom-select:disabled")), 
                    removeEvents()) : !bool && select.disabled && (container.classList.remove(builderParams.isDisabledClass), 
                    select.disabled = !1, opener.setAttribute("tabindex", "0"), container.dispatchEvent(new CustomEvent("custom-select:enabled")), 
                    addEvents());
                }(bool);
            },
            get value() {
                return select.value;
            },
            set value(val) {
                var value, toSelect;
                value = val, 
                // If no option has the provided value get the first
                (toSelect = select.querySelector("option[value='" + value + "']")) || (toSelect = _slicedToArray(select.options, 1)[0]), 
                // The option with the provided value becomes the selected one
                // And changes the select current value
                toSelect.selected = !0, setSelectedElement(select.options[select.selectedIndex].customSelectCstOption);
            },
            append: function(node, target) {
                return _append(node, !0, target);
            },
            insertBefore: function(node, target) {
                return function(node, targetPar) {
                    var target = void 0;
                    if (targetPar instanceof HTMLElement && "OPTION" === targetPar.tagName.toUpperCase() && select.contains(targetPar)) target = targetPar.customSelectCstOption; else {
                        if (!(targetPar instanceof HTMLElement && "OPTGROUP" === targetPar.tagName.toUpperCase() && select.contains(targetPar))) throw new TypeError("Invalid Argument");
                        // The custom markup to append
                                                target = targetPar.customSelectCstOptgroup;
                    }
                    var markupToInsert = parseMarkup(node.length ? node : [ node ]);
                    // Injects the option or optgroup node in the original select and returns the injected node
                    return target.parentNode.insertBefore(markupToInsert[0], target), targetPar.parentNode.insertBefore(node.length ? node[0] : node, targetPar);
                }(node, target);
            },
            remove: function(node) {
                var cstNode = void 0;
                if (node instanceof HTMLElement && "OPTION" === node.tagName.toUpperCase() && select.contains(node)) cstNode = node.customSelectCstOption; else {
                    if (!(node instanceof HTMLElement && "OPTGROUP" === node.tagName.toUpperCase() && select.contains(node))) throw new TypeError("Invalid Argument");
                    cstNode = node.customSelectCstOptgroup;
                }
                cstNode.parentNode.removeChild(cstNode);
                var removedNode = node.parentNode.removeChild(node);
                return changeEvent(), removedNode;
            },
            empty: function() {
                for (var removed = []; select.children.length; ) panel.removeChild(panel.children[0]), 
                removed.push(select.removeChild(select.children[0]));
                return setSelectedElement(), removed;
            },
            destroy: function() {
                for (var i = 0, l = select.options.length; i < l; i++) delete select.options[i].customSelectCstOption;
                for (var optGroup = select.getElementsByTagName("optgroup"), _i2 = 0, _l2 = optGroup.length; _i2 < _l2; _i2++) delete optGroup.customSelectCstOptgroup;
                return removeEvents(), container.parentNode.replaceChild(select, container);
            },
            opener: opener,
            select: select,
            panel: panel,
            container: container
        }, 
        // Stores the plugin directly in the original select
        select.customSelect = container.customSelect, container.customSelect;
    }
    const valuesSlider = document.getElementById("catalog__range"), techview = document.getElementById("techview"), branches = document.getElementById("branches");
    if (console.log(techview), valuesSlider && techview) {
        const valuesForSlider = [ "0", "500т", "800т", "1,1м", "1,4м", "1,7м", "2м", "2,3м", "2,7м", "3м" ];
        var format = {
            to: function(value) {
                return valuesForSlider[Math.round(value)];
            },
            from: function(value) {
                return valuesForSlider.indexOf(Number(value));
            }
        };
        noUiSlider.create(valuesSlider, {
            start: [ 5, 32 ],
            range: {
                min: 0,
                max: valuesForSlider.length - 1
            },
            connect: !0,
            step: 1,
            format: format,
            pips: {
                mode: "steps",
                format: format
            }
        }), _default(techview), _default(branches);
    }
    document.addEventListener("DOMContentLoaded", (function() {
        if (window.innerWidth > 768) {
            const compilationsSlider = document.querySelector(".catalog__compilations-slider");
            if (compilationsSlider) {
                const swiper = new Swiper(compilationsSlider, {
                    loop: !0,
                    spaceBetween: 50,
                    slidesPerView: 3,
                    modules: [ Navigation ],
                    navigation: {
                        nextEl: "#compilations-nav-next",
                        prevEl: "#compilations-nav-prev"
                    }
                });
                swiper.navigation.nextEl[0].classList.add("btn-init"), swiper.navigation.prevEl[0].classList.add("btn-init");
            }
        }
    }));
    const trambailsMain = document.querySelector(".product-page__trambail-main"), trambailsNav = document.querySelector(".product-page__trambail-nav");
    if (trambailsMain) if (trambailsNav) {
        const nav = new Swiper(trambailsNav, {
            spaceBetween: 20,
            slidesPerView: 4,
            freeMode: !0,
            watchSlidesProgress: !0
        });
        new Swiper(trambailsMain, {
            loop: !0,
            spaceBetween: 20,
            modules: [ Pagination, Thumb ],
            pagination: {
                el: ".product-page__trambail-pagination",
                bulletClass: "product-page__trambail-bullet",
                bulletActiveClass: "product-page__trambail-bullet--active",
                clickable: !0,
                bulletElement: "button"
            },
            thumbs: {
                swiper: nav
            }
        });
    } else new Swiper(trambailsMain, {
        loop: !0,
        spaceBetween: 20,
        modules: [ Pagination, Thumb ],
        pagination: {
            el: ".product-page__trambail-pagination",
            bulletClass: "product-page__trambail-bullet",
            bulletActiveClass: "product-page__trambail-bullet--active",
            clickable: !0,
            bulletElement: "button"
        }
    });
    document.addEventListener("DOMContentLoaded", (function() {
        if (window.innerWidth > 768) {
            const lizingSlider = document.querySelector(".product-lizing__slider");
            if (lizingSlider) {
                const swiper = new Swiper(lizingSlider, {
                    slidesPerView: 1,
                    loop: !0,
                    modules: [ Navigation, A11y ],
                    navigation: {
                        nextEl: ".product-lizing__nav-next",
                        prevEl: ".product-lizing__nav-prev"
                    },
                    a11y: {
                        focusableElements: "button, a"
                    }
                });
                swiper.navigation.nextEl[0].classList.add("btn-init"), swiper.navigation.prevEl[0].classList.add("btn-init");
            }
        }
    }));
    const noveltySlider = document.querySelector(".product-novelty__slider"), noventyPrevieFadeSliders = document.querySelectorAll(".product-novelty__fade");
    noveltySlider && (document.addEventListener("DOMContentLoaded", (function() {
        if (window.innerWidth > 768) {
            const swiper = new Swiper(noveltySlider, {
                slidesPerView: 4,
                spaceBetween: 50,
                loop: !0,
                modules: [ Navigation, A11y ],
                navigation: {
                    nextEl: ".product-novelty__nav-next",
                    prevEl: ".product-novelty__nav-prev"
                }
            });
            swiper.navigation.nextEl[0].classList.add("btn-init"), swiper.navigation.prevEl[0].classList.add("btn-init");
        }
    })), noventyPrevieFadeSliders.forEach(((sliderFadeElem, index) => {
        new Swiper(sliderFadeElem, {
            loop: !0,
            effect: "fade",
            modules: [ Pagination, EffectFade, Autoplay, A11y ],
            fadeEffect: {
                crossFade: !0
            },
            autoplay: !0,
            pagination: {
                el: ".product-novelty__pagination",
                clickable: !0,
                modifierClass: "product-novelty__pagination",
                bulletClass: "product-novelty__pagination-bullet",
                bulletActiveClass: "product-novelty__pagination-bullet--active",
                bulletElement: "button"
            }
        });
    })));
}();

//# sourceMappingURL=bundle.js.map

function toggleNav() {
    var sidebar;
    if (window.innerWidth <= 768) {
        sidebar = document.getElementById("mobile-menu");
    } else {
        sidebar = document.getElementById("desktop-menu");
    }
    sidebar.classList.toggle('open');

    var body = document.querySelector('body');

    body.classList.toggle('no-scroll');
}
//# sourceMappingURL=bundle.js.map
