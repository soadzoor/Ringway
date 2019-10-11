var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/** This is a (kindof) Singleton class. The purpose of this is to handle some frequently used HTML/CSS manipulations */
var utils;
(function (utils) {
    var HTML = /** @class */ (function () {
        function HTML() {
        }
        HTML.addToClassList = function (elements, className) {
            for (var i = 0; i < elements.length; ++i) {
                elements[i].classList.add(className);
            }
        };
        HTML.removeFromClassList = function (elements, className) {
            for (var i = 0; i < elements.length; ++i) {
                elements[i].classList.remove(className);
            }
        };
        HTML.addListenerToHTMLElements = function (elements, type, listener) {
            for (var i = 0; i < elements.length; ++i) {
                elements[i].addEventListener(type, listener);
            }
        };
        HTML.removeListenerFromHTMLElements = function (elements, type, listener) {
            for (var i = 0; i < elements.length; ++i) {
                elements[i].removeEventListener(type, listener);
            }
        };
        HTML.addStyleToHTMLElements = function (elements, key, value) {
            for (var i = 0; i < elements.length; ++i) {
                elements[i].style[key] = value;
            }
        };
        HTML.clearElement = function (element) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        };
        HTML.hideElement = function (element) {
            element.style.display = 'none';
        };
        HTML.showElement = function (element, isHiddenByDefault) {
            if (isHiddenByDefault === void 0) { isHiddenByDefault = false; }
            element.style.display = isHiddenByDefault ? 'block' : '';
        };
        HTML.isElementChildOfElement = function (element, parent) {
            return parent.contains(element);
        };
        HTML.disableElement = function (element) {
            element.classList.add('disabledPointerActions');
        };
        HTML.enableElement = function (element) {
            element.classList.remove('disabledPointerActions');
        };
        return HTML;
    }());
    utils.HTML = HTML;
})(utils || (utils = {}));
var ProductObject = /** @class */ (function () {
    function ProductObject(product) {
        var _this = this;
        this.resize = function () {
            if (_this._isBeingInspected) {
                _this.blurBackground(false);
                _this.blurBackground(true);
            }
        };
        this.changeMaterialOpacity = function (mesh, opacity, originalTransparent) {
            mesh.material.opacity = opacity;
            mesh.material.transparent = opacity < 1 ? true : originalTransparent;
        };
        this.changeGroupOpacity = function (group, opacities) {
            for (var i = 0; i < group.children.length; ++i) {
                _this.changeMaterialOpacity(group.children[i], opacities[i], _this._originalOpacities[i].transparent);
            }
        };
        if (this.isSingleMesh(product)) {
            var scene = product.parent;
            var name_1 = product.name;
            product.parent.remove(product);
            this._container = new THREE.Group();
            this._container.position.copy(product.position);
            this._container.scale.copy(product.scale);
            this._container.rotation.copy(product.rotation);
            this._container.name = name_1;
            product.position.set(0, 0, 0);
            product.scale.set(1, 1, 1);
            product.rotation.set(0, 0, 0);
            scene.add(this._container);
            this._container.add(product);
        }
        else {
            this._container = product.parent;
        }
        this._originalOpacities = [];
        this._childrenOfOriginalScene = [];
        this._isBeingInspected = false;
        Main.getInstance().scene.eventDispatcher.addEventListener('windowResized', this.resize);
        this.saveOriginalValues();
    }
    ProductObject.prototype.isSingleMesh = function (product) {
        return isNaN(parseInt(product.parent.name));
    };
    Object.defineProperty(ProductObject.prototype, "position", {
        get: function () {
            return this._container.position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductObject.prototype, "scale", {
        get: function () {
            return this._container.scale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductObject.prototype, "rotation", {
        get: function () {
            return this._container.rotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductObject.prototype, "originalPosition", {
        get: function () {
            return this._originalPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductObject.prototype, "originalScale", {
        get: function () {
            return this._originalScale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductObject.prototype, "originalRotation", {
        get: function () {
            return this._originalRotation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductObject.prototype, "name", {
        get: function () {
            return this._container.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductObject.prototype, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    ProductObject.prototype.saveOriginalValues = function () {
        if (!this._originalPosition) {
            this._originalPosition = new THREE.Vector3().copy(this.position);
        }
        if (!this._originalScale) {
            this._originalScale = new THREE.Vector3().copy(this.scale);
        }
        if (!this._originalRotation) {
            this._originalRotation = new THREE.Euler().copy(this.rotation);
        }
        if (this._originalOpacities.length === 0) {
            for (var i = 0; i < this._container.children.length; ++i) {
                this._originalOpacities.push({
                    opacity: this._container.children[i].material.opacity,
                    transparent: this._container.children[i].material.transparent
                });
            }
        }
    };
    ProductObject.prototype.getBackgroundAsCanvas = function () {
        var canvas = Main.getInstance().scene.canvas;
        /** We have to resize it to the closest-smallest power of 2, because of webgl limitations */
        var newWidth = Math.pow(2, Math.floor(Math.log2(canvas.width)));
        var newHeight = Math.pow(2, Math.floor(Math.log2(canvas.height)));
        var canvas2d = document.createElement('canvas');
        canvas2d.width = newWidth;
        canvas2d.height = newHeight;
        var ctx = canvas2d.getContext('2d');
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);
        return canvas2d;
    };
    ProductObject.prototype.blurBackground = function (value) {
        var scene = Main.getInstance().scene;
        if (value) {
            this._productParent = this._container.parent;
            this._productParent.remove(this._container);
            scene.scene.remove(scene.UI.basketUI.container);
            scene.renderer.render(scene.scene, scene.camera);
            scene.renderer.gammaOutput = false;
            var canvas2d = this.getBackgroundAsCanvas();
            var ctx = canvas2d.getContext('2d');
            for (var i = 0; i < 4; ++i) /** This way we get a nicer result, because a single-pass blur doesn't really affect the edges */ {
                ctx.filter = 'blur(4px)';
                ctx.drawImage(canvas2d, 0, 0);
            }
            scene.scene.background = new THREE.CanvasTexture(canvas2d);
            // const startData = {value: 0};
            // const endData = {value: 1.5}; /** The small blur will be applied to the image. Then this value increases, and it gets applied to the already blurred image, so we need way less value here */
            //
            // new TWEEN.Tween(startData)
            // 	.to(endData, 1500)
            // 	.onUpdate(() =>
            // 	{
            // 		(<any>ctx).filter = `blur(${startData.value}px)`;
            // 		ctx.drawImage(canvas2d, 0, 0);
            // 		scene.scene.background = new THREE.CanvasTexture(canvas2d);
            // 	})
            // 	.start(); // Start the tween immediately.
            scene.scene.add(this._container);
            scene.scene.add(scene.UI.basketUI.container);
            this._childrenOfOriginalScene.length = 0;
            for (var i = scene.scene.children.length - 1; i >= 0; --i) {
                var child = scene.scene.children[i];
                if (child !== scene.lights && child !== this._container && child !== (scene.UI.basketUI.container)) {
                    this._childrenOfOriginalScene.push(child);
                    scene.scene.remove(child);
                }
            }
        }
        else {
            scene.scene.remove(this._container);
            this._productParent.add(this._container);
            for (var _i = 0, _a = this._childrenOfOriginalScene; _i < _a.length; _i++) {
                var child = _a[_i];
                scene.scene.add(child);
            }
            scene.renderer.gammaOutput = true;
        }
    };
    ProductObject.prototype.onInspectStart = function () {
        this._isBeingInspected = true;
        this.blurBackground(true);
        if (!Main.getInstance().scene.UI.productDetailsUI.isDesktopModeOn) {
            var productDetailsArrow_1 = document.getElementById('toggleProductDetails');
            productDetailsArrow_1.classList.add('blinker');
            setTimeout(function () {
                productDetailsArrow_1.classList.remove('blinker');
            }, 2250);
        }
        this.changeTexture();
    };
    ProductObject.prototype.onInspectEnd = function () {
        this._isBeingInspected = false;
        this.resetPosition();
        this.blurBackground(false);
    };
    ProductObject.prototype.equals = function (object) {
        return this._container === object._container;
    };
    ProductObject.prototype.resetPosition = function (didBasketChange, isInspectorActive) {
        var _this = this;
        if (didBasketChange === void 0) { didBasketChange = false; }
        if (isInspectorActive === void 0) { isInspectorActive = false; }
        var resetTime = 500;
        if (didBasketChange) {
            var startOpacities_1 = [];
            var endOpacities_1 = [];
            for (var i = 0; i < this._originalOpacities.length; ++i) {
                startOpacities_1.push(0);
                endOpacities_1.push(this._originalOpacities[i].opacity);
            }
            this.changeGroupOpacity(this._container, startOpacities_1);
            this._container.scale.copy(this._originalScale);
            this._container.position.copy(this._originalPosition);
            this._container.rotation.copy(this._originalRotation);
            setTimeout(function () {
                new TWEEN.Tween(startOpacities_1)
                    .to(endOpacities_1, resetTime)
                    .easing(TWEEN.Easing.Exponential.InOut) // Use an easing function to make the animation smooth.
                    .onUpdate(function () {
                    _this.changeGroupOpacity(_this._container, startOpacities_1);
                })
                    .start(); // Start the tween immediately.
            }, resetTime);
        }
        else {
            var startPos = { x: this._container.position.x, y: this._container.position.y, z: this._container.position.z };
            var endPos = { x: this._originalPosition.x, y: this._originalPosition.y, z: this._originalPosition.z };
            var startScale = { x: this._container.scale.x, y: this._container.scale.y, z: this._container.scale.z };
            var endScale = { x: this._originalScale.x, y: this._originalScale.y, z: this._originalScale.z };
            var startRotation = { x: this._container.rotation.x, y: this._container.rotation.y, z: this._container.rotation.z };
            var endRotation = { x: this._originalRotation.x, y: this._originalRotation.y, z: this._originalRotation.z };
            var startData_1 = {
                posX: startPos.x,
                posY: startPos.y,
                posZ: startPos.z,
                scaleX: startScale.x,
                scaleY: startScale.y,
                scaleZ: startScale.z,
                rotX: startRotation.x,
                rotY: startRotation.y,
                rotZ: startRotation.z,
                pivotZ: this._container.children[0].position.z
            };
            var endData = {
                posX: endPos.x,
                posY: endPos.y,
                posZ: endPos.z,
                scaleX: endScale.x,
                scaleY: endScale.y,
                scaleZ: endScale.z,
                rotX: endRotation.x,
                rotY: endRotation.y,
                rotZ: endRotation.z,
                pivotZ: isInspectorActive ? startData_1.pivotZ : 0
            };
            new TWEEN.Tween(startData_1)
                .to(endData, resetTime)
                .easing(TWEEN.Easing.Exponential.InOut) // Use an easing function to make the animation smooth.
                .onUpdate(function () {
                _this._container.scale.set(startData_1.scaleX, startData_1.scaleY, startData_1.scaleZ);
                _this._container.position.set(startData_1.posX, startData_1.posY, startData_1.posZ);
                _this._container.rotation.set(startData_1.rotX, startData_1.rotY, startData_1.rotZ);
                //this.setProductPivot(startData.pivotZ);
            })
                .start(); // Start the tween immediately.
        }
    };
    ProductObject.prototype.changeTexture = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = 600; }
        var startTime = performance.now();
        var imageName = null;
        for (var _i = 0, _a = this._container.children; _i < _a.length; _i++) {
            var mesh = _a[_i];
            if (mesh.material.map) {
                if (mesh.material.map.image) {
                    imageName = this._container.name;
                    break;
                }
            }
        }
        if (imageName) {
            var condition = imageName.indexOf('_original') === -1; /** true means it's already high-resolution. Apparently, there's no reason to change them back to low-resolution */
            if (imageName && condition) {
                var newImg_1 = new Image();
                newImg_1.onload = function () {
                    var deltaTime = performance.now() - startTime;
                    var timeoutDelay = deltaTime >= delay ? 0 : delay - deltaTime;
                    setTimeout(function () {
                        for (var _i = 0, _a = _this._container.children; _i < _a.length; _i++) {
                            var mesh = _a[_i];
                            if (mesh.material.map) {
                                mesh.material.map.image = newImg_1;
                                mesh.material.map.needsUpdate = true;
                            }
                        }
                    }, timeoutDelay);
                };
                newImg_1.onerror = function () {
                    console.warn(newImg_1.src + " doesn't exist");
                };
                newImg_1.src = "" + this._container.parent.name + imageName + "_original.jpg";
            }
        }
    };
    ProductObject.prototype.translateProductToPosition = function (desiredPosition, isPivotAlreadyCentered) {
        var _this = this;
        if (isPivotAlreadyCentered === void 0) { isPivotAlreadyCentered = false; }
        var endPos = desiredPosition;
        var boundingBox = new THREE.Box3();
        boundingBox.setFromObject(this._container);
        var productHeight = (boundingBox.max.y - boundingBox.min.y) / this._container.scale.z;
        var startData = {
            posX: this._container.position.x,
            posY: this._container.position.y,
            posZ: this._container.position.z,
            pivot: isPivotAlreadyCentered ? productHeight / 2 : 0
        };
        var endData = {
            posX: endPos.x,
            posY: endPos.y,
            posZ: endPos.z,
            pivot: productHeight / 2
        };
        new TWEEN.Tween(startData)
            .to(endData, 500)
            .easing(TWEEN.Easing.Exponential.Out) // Use an easing function to make the animation smooth.
            .onUpdate(function () {
            _this._container.position.set(startData.posX, startData.posY, startData.posZ);
            //this.setProductPivot(startData.pivot);
        })
            .start(); // Start the tween immediately.
    };
    return ProductObject;
}());
var ProductInspector = /** @class */ (function () {
    function ProductInspector(dragControls) {
        var _this = this;
        this.endProductInspect = function () {
            _this._inspectedProduct.onInspectEnd();
            _this._isBeingDragged = false;
            _this._inspectedProduct = null;
            _this.deactivate();
            Main.getInstance().scene.UI.productDetailsUI.swipeUpDetails();
            _this.enableHeader();
            _this._dragControls.dispatchEvent({ type: 'inspectEnd' });
        };
        this.handlePointerMove = function (event) {
            _this.pointerMove(event.pageX, event.pageY);
        };
        this.handleTouchMove = function (event) {
            var touchesLength = event.touches.length;
            if (touchesLength === 1) {
                var pageX = event.touches[0].pageX;
                var pageY = event.touches[0].pageY;
                _this.pointerMove(pageX, pageY);
            }
            else if (touchesLength === 2) {
                _this.handleTouchPinch(event);
            }
        };
        this.pointerMove = function (pointerX, pointerY) {
            if (!_this.isPointerOverUI(pointerX, pointerY) && _this._isPointerDown) {
                if (_this._shouldPointerMoveEventBeTriggered && _this._inspectedProduct) {
                    if (_this._pointer.prevX === null && _this._pointer.prevY === null) {
                        _this._pointer.prevX = pointerX;
                        _this._pointer.prevY = pointerY;
                    }
                    else {
                        var deltaX = (pointerX - _this._pointer.prevX) * window.devicePixelRatio;
                        var deltaY = (pointerY - _this._pointer.prevY) * window.devicePixelRatio;
                        if (deltaX !== 0 || deltaY !== 0) {
                            _this._pointerMovedAfterPress = true;
                        }
                        _this._pointer.prevX = pointerX;
                        _this._pointer.prevY = pointerY;
                        _this._horizontalRotation.increaseEndBy(-deltaX / 100);
                        _this._verticalRotation.increaseEndBy(deltaY / 100);
                    }
                    _this._shouldPointerMoveEventBeTriggered = false;
                }
            }
        };
        this.handlePointerDown = function (event) {
            _this.pointerDown(event.pageX, event.pageY);
        };
        this.handleTouchStart = function (event) {
            var touchesLength = event.touches.length;
            if (touchesLength === 1) {
                var pageX = event.touches[0].pageX;
                var pageY = event.touches[0].pageY;
                _this.pointerDown(pageX, pageY);
            }
        };
        this.pointerDown = function (pointerX, pointerY) {
            if (!_this.isPointerOverUI(pointerX, pointerY)) {
                _this._isPointerDown = true;
                _this._pointerMovedAfterPress = false;
            }
        };
        this.handlePointerUp = function (event) {
            _this.pointerUp(event.pageX, event.pageY);
        };
        this.handleTouchEnd = function (event) {
            var pageX = event.changedTouches[0].pageX;
            var pageY = event.changedTouches[0].pageY;
            _this.pointerUp(pageX, pageY);
            _this.pointerLeave();
        };
        this.pointerUp = function (pointerX, pointerY) {
            _this._pointer.prevX = null;
            _this._pointer.prevY = null;
            _this._pinchDistance.previous = null;
            if (_this.isPointerOverUI(pointerX, pointerY)) {
                _this._isPointerDown = false;
                return;
            }
            else if (!_this._pointerMovedAfterPress && _this._inspectedProduct) {
                if (!_this._isPointerDown) {
                    return;
                }
                else {
                    _this.endProductInspect();
                }
            }
            _this._isPointerDown = false;
        };
        this.handlePointerLeave = function () {
            _this.pointerLeave();
        };
        this.pointerLeave = function () {
            _this._isPointerDown = false;
            _this._pointer.prevX = null;
            _this._pointer.prevY = null;
            _this._pinchDistance.previous = null;
        };
        this.handleWheel = function (event) {
            _this.wheel(event);
        };
        this.wheel = function (event) {
            if (!_this.isPointerOverUI(event.pageX, event.pageY)) {
                var coeff = 0.1;
                _this._zoom.increaseEndBy(-Math.sign(event.deltaY) * coeff);
            }
        };
        this.handleTouchPinch = function (event) {
            if (event.touches.length === 2) // this one is for double-safety
             {
                var vec1 = { x: event.touches[0].pageX, y: event.touches[0].pageY };
                var vec2 = { x: event.touches[1].pageX, y: event.touches[1].pageY };
                _this._pinchDistance.current = utils.Geometry.distanceBetween2Vec2(vec1, vec2);
                if (_this._pinchDistance.previous === null) {
                    _this._pinchDistance.previous = _this._pinchDistance.current;
                }
                else {
                    var deltaDistance = _this._pinchDistance.current - _this._pinchDistance.previous;
                    if (deltaDistance !== 0) {
                        _this._pointerMovedAfterPress = true;
                    }
                    _this._zoom.increaseEndBy(deltaDistance / 75);
                    _this._pinchDistance.previous = _this._pinchDistance.current;
                }
            }
        };
        this.getInspectPosition = function () {
            var lookingAt = _this._dragControls.camera.getWorldDirection(new THREE.Vector3()).clone().normalize();
            _this._cameraRight = lookingAt.clone().cross(_this._dragControls.camera.up).normalize();
            var translateFactor = 0;
            if (_this._isDesktopModeOn) {
                var viewHeight = _this.getViewHeight(); // visible height
                var viewWidth = viewHeight * _this._dragControls.camera.aspect; // visible width
                translateFactor = viewWidth / 4;
            }
            return _this._dragControls.camera.position.clone().add(lookingAt.multiplyScalar(_this._productDistanceFromCamera)).add(_this._cameraRight.clone().multiplyScalar(translateFactor));
        };
        this.resize = function () {
            _this._isDesktopModeOn = window.innerWidth >= 1365;
            if (_this._inspectedProduct) {
                _this._inspectedProduct.translateProductToPosition(_this.getInspectPosition(), true);
            }
        };
        this._dragControls = dragControls;
        this._horizontalRotation = new Convergence(0, 0);
        this._verticalRotation = new Convergence(0, 0);
        this._canvas = Main.getInstance().scene.canvas;
        this._isPointerDown = false;
        this._pointer = { prevX: null, prevY: null };
        this._verticalDelta = 0;
        this._horizontalDelta = 0;
        this._axes = { vertical: new THREE.Vector3(1, 0, 0), horizontal: new THREE.Vector3(0, -1, 0) };
        this._zoom = new BoundedConvergence(0, 0, 0, 0);
        this._posZ = new Convergence(0, 0);
        this._pointerMovedAfterPress = false;
        this._pinchDistance = { current: 0, previous: 0 };
        this._isDesktopModeOn = window.innerWidth >= 1365;
        this._productDistanceFromCamera = 0.2;
        this._isBeingDragged = false;
        this._dragControls.addEventListener('dragStart', function () {
            _this.deactivate();
            _this._isBeingDragged = true;
        });
        this._dragControls.addEventListener('dragEnd', function () {
            if (_this._inspectedProduct) {
                requestAnimationFrame(function () {
                    _this.activate();
                    _this._isPointerDown = false;
                    setTimeout(function () {
                        _this._zoom.reset(_this._inspectedProduct.scale.x, _this._inspectedProduct.scale.x);
                        _this._isBeingDragged = false;
                    }, 500);
                });
            }
        });
        document.getElementById('closeProductDetails').addEventListener('click', function () {
            _this.endProductInspect();
        });
    }
    ProductInspector.prototype.add = function (product) {
        var _this = this;
        this.disableHeader();
        this._isBeingDragged = false;
        product.onInspectStart();
        this.updateDetails(product.name);
        this._zoom.reset(product.originalScale.x, product.originalScale.x * 2 * this._productDistanceFromCamera, product.originalScale.x * 1.0 * this._productDistanceFromCamera, product.originalScale.x * 4 * this._productDistanceFromCamera);
        this._horizontalRotation.reset(product.rotation.z, product.rotation.z);
        this._verticalRotation.reset(product.rotation.x, product.rotation.x);
        this._dragControls.dispatchEvent({ type: 'inspectStart', object: product });
        product.translateProductToPosition(this.getInspectPosition());
        this._axes.vertical = this._cameraRight;
        this._inspectedProduct = product;
        setTimeout(function () {
            _this.activate();
        }, 500);
    };
    ProductInspector.prototype.disableHeader = function () {
        utils.HTML.disableElement(document.getElementById('header'));
    };
    ProductInspector.prototype.enableHeader = function () {
        utils.HTML.enableElement(document.getElementById('header'));
    };
    ProductInspector.prototype.updateDetails = function (id) {
        Main.getInstance().basket.getProductDetailsById(id);
        Main.getInstance().basket.getProductInfoById(id);
    };
    ProductInspector.prototype.activate = function () {
        this._canvas.addEventListener('mousedown', this.handlePointerDown);
        this._canvas.addEventListener('mousemove', this.handlePointerMove);
        this._canvas.addEventListener('mouseup', this.handlePointerUp);
        this._canvas.addEventListener('mouseleave', this.handlePointerLeave);
        this._canvas.addEventListener('wheel', this.handleWheel);
        this._canvas.addEventListener('touchstart', this.handleTouchStart);
        this._canvas.addEventListener('touchmove', this.handleTouchMove);
        this._canvas.addEventListener('touchend', this.handleTouchEnd);
    };
    ProductInspector.prototype.deactivate = function () {
        this._canvas.removeEventListener('mousedown', this.handlePointerDown);
        this._canvas.removeEventListener('mousemove', this.handlePointerMove);
        this._canvas.removeEventListener('mouseup', this.handlePointerUp);
        this._canvas.removeEventListener('mouseleave', this.handlePointerLeave);
        this._canvas.removeEventListener('wheel', this.handleWheel);
        this._canvas.removeEventListener('touchstart', this.handleTouchStart);
        this._canvas.removeEventListener('touchmove', this.handleTouchMove);
        this._canvas.removeEventListener('touchend', this.handleTouchEnd);
    };
    ProductInspector.prototype.isPointerOverUI = function (pageX, pageY) {
        var target = document.elementFromPoint(pageX, pageY);
        var productDetailsContainer = Main.getInstance().scene.UI.productDetailsUI.container;
        var basketUI = Main.getInstance().scene.UI.basketUI;
        return (target === productDetailsContainer || utils.HTML.isElementChildOfElement(target, productDetailsContainer) ||
            basketUI.hitTestBasket(pageX, pageY));
    };
    ProductInspector.prototype.getViewHeight = function () {
        var vFOV = THREE.Math.degToRad(this._dragControls.camera.fov); // convert vertical fov to radians
        var viewHeight = 2 * Math.tan(vFOV / 2) * this._productDistanceFromCamera; // visible height
        return viewHeight;
    };
    Object.defineProperty(ProductInspector.prototype, "inspectedProduct", {
        get: function () {
            return this._inspectedProduct;
        },
        enumerable: true,
        configurable: true
    });
    ProductInspector.prototype.isActive = function () {
        return this._inspectedProduct != null;
    };
    ProductInspector.prototype.update = function () {
        this._shouldPointerMoveEventBeTriggered = true; /** See CircleControls for explanation */
        if (this._inspectedProduct) {
            var verticalStart = this._verticalRotation.start;
            this._verticalRotation.update();
            this._verticalDelta = this._verticalRotation.start - verticalStart;
            var horizontalStart = this._horizontalRotation.start;
            this._horizontalRotation.update();
            this._horizontalDelta = this._horizontalRotation.start - horizontalStart;
            this._zoom.update();
            //
            // Rotate
            //
            this._inspectedProduct.container.rotateOnWorldAxis(this._axes.horizontal, this._horizontalDelta);
            this._inspectedProduct.container.rotateOnWorldAxis(this._axes.vertical, this._verticalDelta);
            //
            // Zoom
            //
            if (!this._isBeingDragged) {
                this._inspectedProduct.scale.set(this._zoom.start, this._zoom.start, this._zoom.start);
            }
        }
    };
    return ProductInspector;
}());
/**
 * This is a TypeScript class based on THREE.DragControls. Note that some of the functions are modified.
 *
 * original authors:
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */
///<reference path='../utils/HTML.ts'/>
///<reference path='./ProductObject.ts'/>
///<reference path='./ProductInspector.ts'/>
var DragControls = /** @class */ (function (_super) {
    __extends(DragControls, _super);
    function DragControls(objects, camera, domElement) {
        var _this = _super.call(this) || this;
        _this.enlargeShoppingCart = function () {
            Main.getInstance().scene.UI.basketUI.enlargeShoppingCartSize();
        };
        _this.reductShoppingCart = function () {
            Main.getInstance().scene.UI.basketUI.reductShoppingCartSize();
        };
        _this.getDragPosition = function (object) {
            var cameraPos = _this._camera.position.clone();
            return _this._camera.position.clone().add((object.position.clone().sub(cameraPos)).normalize().multiplyScalar(0.1));
        };
        _this.pointerStart = function (pageX, pageY) {
            if (_this._isUserZooming) {
                return;
            }
            clearTimeout(_this._timeoutID);
            _this._timeoutID = null;
            var rect = _this._canvas.getBoundingClientRect();
            _this._mouse.x = ((pageX - rect.left) / rect.width) * 2 - 1;
            _this._mouse.y = -((pageY - rect.top) / rect.height) * 2 + 1;
            _this._raycaster.setFromCamera(_this._mouse, _this._camera);
            var intersects = _this._raycaster.intersectObjects(_this._draggableObjects, true);
            if (intersects.length > 0) {
                _this._selected = new ProductObject(intersects[0].object);
                _this.setPlane(_this._plane, _this._selected);
                if (_this._raycaster.ray.intersectPlane(_this._plane, _this._intersection)) {
                    var position = new THREE.Vector3(); /** This is going to be this._selected's position, but we need to animate */
                    position.copy(_this.getDragPosition(_this._selected));
                    _this._offset.copy(_this._intersection.sub(position));
                    var startScale = { x: _this._selected.originalScale.x, y: _this._selected.originalScale.y, z: _this._selected.originalScale.z };
                    var scaleFactor = _this._productInspector.isActive() ? 0.08 : 0.125 / _this._selected.originalPosition.clone().sub(_this._camera.position).length();
                    var endScale = { x: scaleFactor, y: scaleFactor, z: scaleFactor };
                    var startPos = { x: _this._selected.originalPosition.x, y: _this._selected.originalPosition.y, z: _this._selected.originalPosition.z };
                    var endPos = { x: position.x, y: position.y, z: position.z };
                    var startData_2 = { posX: startPos.x, posY: startPos.y, posZ: startPos.z, scaleX: startScale.x, scaleY: startScale.y, scaleZ: startScale.z };
                    var endData = { posX: endPos.x, posY: endPos.y, posZ: endPos.z, scaleX: endScale.x, scaleY: endScale.y, scaleZ: endScale.z };
                    new TWEEN.Tween(startData_2)
                        .to(endData, 100)
                        .easing(TWEEN.Easing.Exponential.Out) // Use an easing function to make the animation smooth.
                        .onUpdate(function () {
                        if (_this._selected) /** The drag can be canceled while this runs */ {
                            _this._selected.scale.set(startData_2.scaleX, startData_2.scaleY, startData_2.scaleZ);
                            _this._selected.position.set(startData_2.posX, startData_2.posY, startData_2.posZ);
                        }
                    })
                        .start(); // Start the tween immediately.
                }
                var baskets = document.getElementsByClassName('basket');
                utils.HTML.addListenerToHTMLElements(baskets, 'mouseover', _this.enlargeShoppingCart);
                utils.HTML.addListenerToHTMLElements(baskets, 'mouseleave', _this.reductShoppingCart);
                document.body.classList.add('dragProduct');
                document.body.classList.remove('productIntersected');
                document.body.classList.remove('addProductToBasket');
                _this.closestToScreenOrder(_this._canvas, Main.getInstance().scene.UI.basketUI.basketElement);
                Main.getInstance().scene.UI.basketUI.renderElementsNormally();
                _this.dispatchEvent({ type: 'dragStart', object: _this._selected, mouse: { pageX: pageX, pageY: pageY } });
            }
        };
        _this.pointerMove = function (pageX, pageY) {
            var condition = _this.productInspector.isActive() && (_this._pointer.prevX !== pageX || _this._pointer.prevY !== pageY); /** Sometimes pointermove is fired when the mouse is clicked, but the mouse doesn't even move. We have to check if the mouse really moved, or not */
            _this._pointer.prevX = pageX;
            _this._pointer.prevY = pageY;
            if (Main.getInstance().scene.cameraControls.isCameraMoving() || condition) {
                clearTimeout(_this._timeoutID);
                _this._timeoutID = null;
            }
            var rect = _this._canvas.getBoundingClientRect();
            _this._mouse.x = ((pageX - rect.left) / rect.width) * 2 - 1;
            _this._mouse.y = -((pageY - rect.top) / rect.height) * 2 + 1;
            _this._raycaster.setFromCamera(_this._mouse, _this._camera);
            if (_this._selected && _this._enabled) {
                if (_this._raycaster.ray.intersectPlane(_this._plane, _this._intersection)) {
                    _this._selected.position.copy(_this._intersection.sub(_this._offset));
                }
                var basketUI = Main.getInstance().scene.UI.basketUI;
                if (basketUI.hitTestBasket(pageX, pageY)) {
                    if (!basketUI.isBasketSwipedDown) {
                        basketUI.enlargeShoppingCartSize();
                    }
                    document.body.classList.add('addProductToBasket');
                    document.body.classList.remove('dragProduct');
                    document.body.classList.remove('productIntersected');
                }
                else {
                    if (!basketUI.isBasketSwipedDown) {
                        basketUI.reductShoppingCartSize();
                    }
                    document.body.classList.add('dragProduct');
                    document.body.classList.remove('addProductToBasket');
                    document.body.classList.remove('productIntersected');
                }
                _this.dispatchEvent({ type: 'drag', object: _this._selected, mouse: { pageX: pageX, pageY: pageY } });
                return;
            }
            var intersects = _this._raycaster.intersectObjects(_this._draggableObjects, true);
            if (intersects.length > 0) {
                var object = new ProductObject(intersects[0].object);
                _this.setPlane(_this._plane, object);
                var condition_1 = !_this._hovered;
                if (_this._hovered && !_this._hovered.equals(object)) {
                    condition_1 = true;
                }
                if (condition_1) {
                    _this.dispatchEvent({ type: 'hoveron', object: object });
                    document.body.classList.add('productIntersected');
                    document.body.classList.remove('dragProduct');
                    document.body.classList.remove('addProductToBasket');
                    _this._hovered = object;
                }
            }
            else {
                if (_this._hovered !== null) {
                    _this.dispatchEvent({ type: 'hoveroff', object: _this._hovered });
                    document.body.classList.remove('productIntersected');
                    document.body.classList.remove('dragProduct');
                    document.body.classList.remove('addProductToBasket');
                    _this._hovered = null;
                }
            }
        };
        _this.pointerCancel = function (didBasketChange, pageX, pageY) {
            if (didBasketChange === void 0) { didBasketChange = false; }
            _this._isUserZooming = false;
            _this._pointer.prevX = null;
            _this._pointer.prevY = null;
            clearTimeout(_this._timeoutID);
            if (_this._timeoutID != null && _this._hovered != null) {
                if (pageX && pageY) {
                    _this.pointerMove(pageX, pageY);
                }
                if (_this._hovered) // the pointerMove function above can return null
                 {
                    _this.onProductClick(_this._hovered);
                }
            }
            _this._timeoutID = null;
            if (_this._selected) {
                if (_this._selected.originalPosition) {
                    _this.deactivate();
                    _this._selected.resetPosition(didBasketChange, _this.productInspector.isActive());
                    _this.activate(500);
                }
                utils.HTML.removeFromClassList(document.getElementsByClassName('productContainer'), 'disabledPointerActions');
                var baskets = document.getElementsByClassName('basket');
                utils.HTML.removeListenerFromHTMLElements(baskets, 'mouseover', _this.enlargeShoppingCart);
                utils.HTML.removeListenerFromHTMLElements(baskets, 'mouseleave', _this.reductShoppingCart);
                if (!Main.getInstance().scene.UI.basketUI.isBasketSwipedDown) {
                    _this.reductShoppingCart();
                }
                _this.dispatchEvent({ type: 'dragEnd', object: _this._selected });
                _this._selected = null;
            }
            document.body.classList.remove('productIntersected');
            document.body.classList.remove('dragProduct');
            document.body.classList.remove('addProductToBasket');
            _this.closestToScreenOrder(Main.getInstance().scene.UI.basketUI.basketElement, _this._canvas);
            Main.getInstance().scene.UI.basketUI.renderElementsOnTop();
        };
        _this.handleMouseDown = function (event) {
            _this.startPointerStartTimeout(event.pageX, event.pageY);
        };
        _this.startPointerStartTimeout = function (pageX, pageY) {
            /** We need this to prevent positioning-bugs */
            if (Main.getInstance().scene.cameraControls.isCameraMoving()) {
                return;
            }
            _this._timeoutID = setTimeout(function () {
                _this.pointerStart(pageX, pageY);
            }, 200);
        };
        _this.handleMouseMove = function (event) {
            _this.pointerMove(event.pageX, event.pageY);
        };
        _this.handleMouseRelease = function (event) {
            var didBasketChange = _this.pointerRelease(event.pageX, event.pageY);
            _this.pointerCancel(didBasketChange, event.pageX, event.pageY);
        };
        _this.onProductClick = function (product) {
            //Main.getInstance().basket.getProductDetailsById(product.name);
            _this.inspectProduct(product);
        };
        _this.inspectProduct = function (product) {
            if (!_this.productInspector.isActive()) /** We can't inspect, if it's being inspected */ {
                _this._productInspector.add(product);
                _this._originalDraggableObjects = _this._draggableObjects;
                _this._draggableObjects = [product.container];
            }
        };
        _this.pointerRelease = function (pageX, pageY) {
            var endTarget = document.elementFromPoint(pageX, pageY);
            if (endTarget) /** If it goes out of the window, it is null */ {
                var basketUI = Main.getInstance().scene.UI.basketUI;
                if (basketUI.hitTestBasket(pageX, pageY)) {
                    if (_this._selected) {
                        Main.getInstance().basket.addBasketProductByID(_this._selected.name);
                        return true;
                    }
                }
            }
            return false;
        };
        _this.handleTouchStart = function (event) {
            if (event.changedTouches.length > 1) {
                _this._isUserZooming = true;
            }
            else {
                _this._isUserZooming = false;
                var touch = event.changedTouches[0];
                _this.startPointerStartTimeout(touch.pageX, touch.pageY);
            }
        };
        _this.handleTouchMove = function (event) {
            if (event.changedTouches.length > 1) {
                _this._isUserZooming = true;
            }
            else {
                _this._isUserZooming = false;
                var touch = event.changedTouches[0];
                _this.pointerMove(touch.pageX, touch.pageY);
            }
        };
        _this.handleTouchEnd = function (event) {
            var touches = event.changedTouches[0];
            var didBasketChange = _this.pointerRelease(touches.pageX, touches.pageY);
            _this.pointerCancel(didBasketChange, touches.pageX, touches.pageY);
        };
        _this._pointer = { prevX: null, prevY: null };
        _this._draggableObjects = objects;
        _this._camera = camera;
        _this._canvas = domElement;
        _this._plane = new THREE.Plane();
        _this._raycaster = new THREE.Raycaster();
        _this._mouse = new THREE.Vector2();
        _this._offset = new THREE.Vector3();
        _this._intersection = new THREE.Vector3();
        _this._selected = null;
        _this._hovered = null;
        _this._enabled = true;
        _this._timeoutID = null;
        _this._isUserZooming = false;
        _this._productInspector = new ProductInspector(_this);
        _this.addEventListener('inspectEnd', function () {
            _this.deactivate();
            _this._selected = null;
            clearTimeout(_this._timeoutID);
            _this._timeoutID = null;
            if (_this._originalDraggableObjects) {
                _this._draggableObjects = _this._originalDraggableObjects;
            }
            _this.activate(500);
        });
        _this.activate();
        return _this;
    }
    DragControls.prototype.activate = function (delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        setTimeout(function () {
            _this._canvas.addEventListener('mousemove', _this.handleMouseMove);
            _this._canvas.addEventListener('mousedown', _this.handleMouseDown);
            _this._canvas.addEventListener('mouseup', _this.handleMouseRelease);
            _this._canvas.addEventListener('touchmove', _this.handleTouchMove);
            _this._canvas.addEventListener('touchstart', _this.handleTouchStart);
            _this._canvas.addEventListener('touchend', _this.handleTouchEnd);
        }, delay);
    };
    DragControls.prototype.deactivate = function () {
        this._canvas.removeEventListener('mousemove', this.handleMouseMove);
        this._canvas.removeEventListener('mousedown', this.handleMouseDown);
        this._canvas.removeEventListener('mouseup', this.handleMouseRelease);
        this._canvas.removeEventListener('touchmove', this.handleTouchMove);
        this._canvas.removeEventListener('touchstart', this.handleTouchStart);
        this._canvas.removeEventListener('touchend', this.handleTouchEnd);
    };
    DragControls.prototype.setPlane = function (plane, object) {
        var planeNormal = this._camera.getWorldDirection(new THREE.Vector3()).clone();
        planeNormal.normalize();
        var dragPosition = this.getDragPosition(object);
        plane.setFromNormalAndCoplanarPoint(planeNormal, dragPosition);
    };
    DragControls.prototype.closestToScreenOrder = function (elem1, elem2) {
        elem1.style.zIndex = '999';
        elem2.style.zIndex = '998';
    };
    DragControls.prototype.isBeingDragged = function () {
        return this._selected != null;
    };
    DragControls.prototype.isBeingHovered = function () {
        return this._hovered != null;
    };
    Object.defineProperty(DragControls.prototype, "productInspector", {
        get: function () {
            return this._productInspector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragControls.prototype, "camera", {
        get: function () {
            return this._camera;
        },
        enumerable: true,
        configurable: true
    });
    return DragControls;
}(THREE.EventDispatcher));
var ClickableObject = /** @class */ (function () {
    function ClickableObject(object) {
        var _this = this;
        this.activate = function () {
            _this._canvas.addEventListener('mousemove', _this.handleMouseMove);
            _this._canvas.addEventListener('mousedown', _this.handleMouseDown);
            _this._canvas.addEventListener('mouseup', _this.handleMouseRelease);
            _this._canvas.addEventListener('touchmove', _this.handleTouchMove);
            _this._canvas.addEventListener('touchstart', _this.handleTouchStart);
            //this._canvas.addEventListener('touchend',   this.handleTouchEnd); /** It seems that touchend is fired along with mouseup */
        };
        this.deactivate = function () {
            _this._canvas.removeEventListener('mousemove', _this.handleMouseMove);
            _this._canvas.removeEventListener('mousedown', _this.handleMouseDown);
            _this._canvas.removeEventListener('mouseup', _this.handleMouseRelease);
            _this._canvas.removeEventListener('touchmove', _this.handleTouchMove);
            _this._canvas.removeEventListener('touchstart', _this.handleTouchStart);
            //this._canvas.addEventListener('touchend',   this.handleTouchEnd); /** It seems that touchend is fired along with mouseup */
        };
        this.handleMouseMove = function (event) {
            _this.pointerMove(event.pageX, event.pageY);
        };
        this.handleTouchMove = function (event) {
            var touch = event.changedTouches[0];
            _this.pointerMove(touch.pageX, touch.pageY);
        };
        this.pointerMove = function (pageX, pageY) {
            _this._mouseMoved = pageX !== _this._pointer.prevX || pageY !== _this._pointer.prevY; /** Sometimes pointermove is fired when the mouse is clicked, but the mouse doesn't even move. We have to check if the mouse really moved, or not */
            var rect = _this._canvas.getBoundingClientRect();
            _this._mouse.x = ((pageX - rect.left) / rect.width) * 2 - 1;
            _this._mouse.y = -((pageY - rect.top) / rect.height) * 2 + 1;
            _this._raycaster.setFromCamera(_this._mouse, _this._camera);
            var intersects = _this._raycaster.intersectObject(_this._object, true);
            if (intersects.length > 0) {
                document.body.classList.add('clickableObjectIntersected');
                _this._currentlyHovered = true;
            }
            else {
                document.body.classList.remove('clickableObjectIntersected');
                _this._currentlyHovered = false;
            }
            _this._pointer.prevX = pageX;
            _this._pointer.prevY = pageY;
        };
        this.handleMouseDown = function (event) {
            _this.pointerDown(event.pageX, event.pageY);
        };
        this.handleTouchStart = function (event) {
            var touch = event.changedTouches[0];
            _this.pointerDown(touch.pageX, touch.pageY);
        };
        this.pointerDown = function (pageX, pageY) {
            var rect = _this._canvas.getBoundingClientRect();
            _this._pointer.prevX = pageX;
            _this._pointer.prevY = pageY;
            _this._mouseMoved = false;
            _this._mouse.x = ((pageX - rect.left) / rect.width) * 2 - 1;
            _this._mouse.y = -((pageY - rect.top) / rect.height) * 2 + 1;
            _this._raycaster.setFromCamera(_this._mouse, _this._camera);
            var intersects = _this._raycaster.intersectObject(_this._object, true);
            if (intersects.length > 0) {
                _this._currentlyHovered = true;
            }
        };
        this.handleMouseRelease = function (event) {
            _this.pointerUp(event.pageX, event.pageY);
        };
        // private handleTouchEnd = (event: TouchEvent) =>
        // {
        // 	const touches = event.changedTouches[0];
        // 	this.pointerUp(touches.pageX, touches.pageY);
        // };
        this.pointerUp = function (pageX, pageY) {
            if (!_this._mouseMoved && _this._currentlyHovered) {
                _this._eventDispatcher.dispatchEvent({ type: 'click' });
            }
        };
        this._object = object;
        this._canvas = Main.getInstance().scene.canvas;
        this._camera = Main.getInstance().scene.camera;
        this._raycaster = new THREE.Raycaster();
        this._mouse = new THREE.Vector2(0, 0);
        this._pointer = { prevX: null, prevY: null };
        this._mouseMoved = true;
        this._currentlyHovered = false;
        this._eventDispatcher = new THREE.EventDispatcher();
        this.activate();
    }
    Object.defineProperty(ClickableObject.prototype, "eventDispatcher", {
        get: function () {
            return this._eventDispatcher;
        },
        enumerable: true,
        configurable: true
    });
    return ClickableObject;
}());
///<reference path='./ClickableObject.ts'/>
var VideoObject = /** @class */ (function () {
    function VideoObject(object, videoPath, autoplay, loop) {
        if (autoplay === void 0) { autoplay = false; }
        if (loop === void 0) { loop = false; }
        var _this = this;
        this.togglePlay = function () {
            if (_this._videoElement.paused) {
                _this.play();
            }
            else {
                _this.pause();
            }
        };
        this.play = function () {
            _this._videoElement.play();
        };
        this.pause = function () {
            _this._videoElement.pause();
        };
        this.activate = function () {
            _this._clickableObject.activate();
        };
        this.deactivate = function () {
            _this._clickableObject.deactivate();
        };
        /** Decrease sound with camera-distance from sound-source */
        this.update = function () {
            var distance = new THREE.Vector3().copy(_this._position).distanceTo(Main.getInstance().scene.camera.position);
            _this._videoElement.volume = Math.min(2 / distance, 1);
        };
        this._object = object;
        this._videoElement = document.createElement('video');
        this._videoElement.title = 'Click to play / pause';
        this._videoElement.src = videoPath;
        var videoTexture = new THREE.VideoTexture(this._videoElement);
        videoTexture.minFilter = THREE.LinearFilter;
        object.material.map = videoTexture;
        object.material.needsUpdate = true;
        this._videoElement.autoplay = autoplay;
        this._videoElement.loop = loop;
        /** This ones are a workaround for iOS to prevent video from going into fullscreen */
        this._videoElement.setAttribute('webkit-playsinline', 'true');
        this._videoElement.setAttribute('playsinline', 'true');
        enableInlineVideo(this._videoElement);
        this.init();
    }
    VideoObject.prototype.init = function () {
        this._clickableObject = new ClickableObject(this._object);
        this._clickableObject.eventDispatcher.addEventListener('click', this.togglePlay);
        Main.getInstance().scene.sceneLoader.dragControls.addEventListener('inspectStart', this._clickableObject.deactivate);
        Main.getInstance().scene.sceneLoader.dragControls.addEventListener('inspectEnd', this._clickableObject.activate);
        this._object.geometry.computeBoundingBox();
        var boundingBox = this._object.geometry.boundingBox;
        this._position = new THREE.Vector3();
        this._position.subVectors(boundingBox.max, boundingBox.min);
        this._position.multiplyScalar(0.5);
        this._position.add(boundingBox.min);
        this._position.applyMatrix4(this._object.matrixWorld);
    };
    return VideoObject;
}());
///<reference path='./DragControls.ts'/>
///<reference path='./VideoObject.ts'/>
var SceneLoader = /** @class */ (function () {
    function SceneLoader(scene) {
        var _this = this;
        this.onProgress = function (progressEvent) {
            var ratio = progressEvent.loaded / progressEvent.total;
            _this._percentage.reset(ratio * 95, ratio * 100);
        };
        this.onLoad = function (gltf, sceneData) {
            ga('send', {
                hitType: 'timing',
                timingCategory: 'Load',
                timingVar: 'load',
                timingValue: performance.now()
            });
            var object = gltf.scene;
            if (sceneData.lightMaps) {
                var _loop_1 = function (lightMap) {
                    var lightmappedMesh = object.getObjectByName(lightMap.meshName);
                    if (lightmappedMesh) {
                        lightmappedMesh.traverse(function (node) {
                            if (node.geometry) {
                                if (!node.geometry.attributes.uv2) /** If it has only one set of UVs (the 'green' material for example, because it doesn't have a texture) */ {
                                    node.geometry.attributes.uv2 = node.geometry.attributes.uv;
                                }
                                if (node.material) {
                                    if (node.material.lightMap) /** In this case, more objects uses the same material (for example multiple object has the 'green' material) */ {
                                        /** We have to duplicate it, because otherwise it overwrites the existing lightmap */
                                        node.material = node.material.clone();
                                    }
                                    node.material.lightMap = lightMap.map;
                                    node.material.lightMap.flipY = false;
                                    node.material.lightMapIntensity = 1;
                                }
                            }
                        });
                    }
                };
                for (var _i = 0, _a = sceneData.lightMaps; _i < _a.length; _i++) {
                    var lightMap = _a[_i];
                    _loop_1(lightMap);
                }
            }
            for (var _b = 0, _c = object.children; _b < _c.length; _b++) {
                var node = _c[_b];
                node.traverse(function (child) {
                    var node = child;
                    if (node.material) {
                        if (sceneData.envMap) {
                            node.material.envMap = sceneData.envMap;
                            node.material.envMap.needsUpdate = true;
                        }
                        if (node.geometry) {
                            var updateLightMap = false;
                            if (!node.geometry.attributes.uv2) /** It doesn't have any lightmaps, so we add a general lightmap, because otherwise they're too dark */ {
                                var count = node.geometry.attributes.position.count * 2;
                                node.geometry.attributes.uv2 = new THREE.BufferAttribute(new Float32Array(count), 2, false); /** Default values in Float32Array are 0 -> which is perfect */
                                updateLightMap = !node.lightMap;
                            }
                            updateLightMap = updateLightMap || node.geometry.lightMapAlreadyAdded; /** Some of the meshes (like treeleaves) are linked together, so we don't need to clone their material */
                            if (updateLightMap) {
                                if (!node.geometry.lightMapAlreadyAdded) {
                                    node.material.normalScale = node.material.normalScale ? node.material.normalScale : new THREE.Vector2(1, 1); /** Workaround for a three.js bug -> the line below (copy) has an error if it tried to copy 'undefined' */
                                    node.material = new THREE.MeshStandardMaterial().copy(node.material);
                                }
                                node.material.lightMap = _this._generalLightMap;
                                node.material.lightMap.flipY = false;
                                node.material.lightMapIntensity = 1;
                                node.material.lightMap.needsUpdate = true;
                                node.geometry.lightMapAlreadyAdded = true;
                            }
                        }
                        node.material.needsUpdate = true;
                    }
                });
            }
            sceneData.container.add(object);
        };
        this.addVideoObject = function (sceneData) {
            var video = sceneData.container.getObjectByName('Video');
            if (video) {
                sceneData.videoObject = new VideoObject(video, 'assets/videos/demo.mp4');
                if (sceneData === _this._sceneDataObjects[_this._currentSceneIndex]) {
                    sceneData.videoObject.activate();
                }
                else {
                    sceneData.videoObject.deactivate();
                }
            }
            else {
                console.warn("There's no mesh called \"Video\" in the scene!");
            }
        };
        this.update = function () {
            if (!_this._isLoadFinished) {
                _this._percentage.update();
                var percentage = Math.round(_this._percentage.start);
                document.getElementById('loadingBar').style.width = percentage + "%";
                document.getElementById('loadingPercent').textContent = _this.loadingTextForPercentage(percentage) + (percentage).toFixed(0);
            }
            if (_this._sceneDataObjects[_this._currentSceneIndex].videoObject) {
                _this._sceneDataObjects[_this._currentSceneIndex].videoObject.update();
            }
        };
        this._scene = scene;
        this._camera = scene.camera;
        this._renderer = scene.renderer;
        this._sceneContainer = new THREE.Object3D();
        this._products = [];
        this._percentage = new BoundedConvergence(0, 0, 0, 100, 0.008);
        this._isLoadFinished = false;
        this.initScenes();
        this.loadScene(0, true);
    }
    SceneLoader.prototype.initEnvMap = function (url) {
        var envMap = new THREE.TextureLoader().load(url);
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        return envMap;
    };
    SceneLoader.prototype.initLightMap = function (url) {
        return new THREE.TextureLoader().load(url);
    };
    SceneLoader.prototype.initSkyBox = function (url) {
        var geometry = new THREE.SphereBufferGeometry(50, 60, 40);
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(url),
            side: THREE.BackSide,
            depthWrite: false
        });
        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    };
    SceneLoader.prototype.initScenes = function () {
        this._sceneDataObjects = [];
        this._generalLightMap = this.initLightMap('assets/models/glb/scene2/General_lightmap.jpg');
        this._sceneDataObjects.push({
            baseURL: null,
            name: 'scene2',
            type: 'glb',
            container: new THREE.Object3D(),
            skyBox: this.initSkyBox('assets/textures/equirectangular/environment.jpg'),
            envMap: this.initEnvMap('assets/textures/equirectangular/environmentFromProductPOV.jpg'),
            lightMaps: [
                { map: this.initLightMap('assets/models/glb/scene2/Wall_lightmap.jpg'), meshName: 'Wall' },
                { map: this.initLightMap('assets/models/glb/scene2/Roof_lightmap.jpg'), meshName: 'Roof' },
                { map: this.initLightMap('assets/models/glb/scene2/Floor_lightmap.jpg'), meshName: 'Floor' },
                { map: this.initLightMap('assets/models/glb/scene2/Shelf_lightmap.jpg'), meshName: 'Shelf' },
                { map: this.initLightMap('assets/models/glb/scene2/Shelf-simpler_lightmap.jpg'), meshName: 'Shelf-simpler' },
                { map: this.initLightMap('assets/models/glb/scene2/Bench_lightmap.jpg'), meshName: 'Bench' }
            ],
            videoObject: null // it is initialized in the onload method
        });
        this._sceneDataObjects.push({
            baseURL: null,
            name: 'scene',
            type: 'glb',
            container: new THREE.Object3D(),
            skyBox: this._sceneDataObjects[0].skyBox.clone(),
            envMap: this._sceneDataObjects[0].envMap,
            lightMaps: [
                { map: this.initLightMap('assets/models/glb/scene/Lightmap.jpg'), meshName: 'Room' },
            ],
            videoObject: null // it is initialized in the onload method
        });
        for (var _i = 0, _a = this._sceneDataObjects; _i < _a.length; _i++) {
            var scene = _a[_i];
            if (scene.skyBox) {
                scene.container.add(scene.skyBox);
            }
            scene.baseURL = 'assets/models/' + scene.type + '/' + scene.name + '/';
        }
        this._loadedScenesCount = 0;
        this._currentSceneIndex = 0;
    };
    SceneLoader.prototype.loadScene = function (index, isFirstScene) {
        var _this = this;
        if (isFirstScene === void 0) { isFirstScene = false; }
        var sceneData = this._sceneDataObjects[index];
        var url = sceneData.baseURL + sceneData.name;
        THREE.DRACOLoader.setDecoderPath('libs/draco/gltf/');
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(new THREE.DRACOLoader());
        gltfLoader.load(url + '.' + sceneData.type, function (gltf) {
            _this.onLoad(gltf, sceneData);
            if (isFirstScene) {
                _this.displayScene(0, true);
                /** This is a workaround for the following issues:
                 * - Semi-transparent objects appearing white in the basket, when loaded from localstorage
                 * - Objects with larger textures make the screen freeze for a moment when they first being rendered on the scene
                 * - I figured out that if the whole scene is rendered first, then these issues disappear */
                _this._camera.position.set(0, 0, 20);
                _this._camera.lookAt(0, 0, 0);
                _this._renderer.render(_this._scene.scene, _this._camera);
                requestAnimationFrame(function () {
                    Main.getInstance().basket.loadBasket();
                    _this._percentage.reset(_this._percentage.start, _this._percentage.max, null, null, 0.1);
                    document.getElementById('loadingScreen').style.opacity = '0';
                    setTimeout(function () {
                        utils.HTML.hideElement(document.getElementById('loadingScreen'));
                        _this._isLoadFinished = true;
                    }, 500);
                });
            }
            if (sceneData.videoObject !== undefined) {
                setTimeout(function () {
                    _this.addVideoObject(sceneData);
                }, 1000);
            }
            if (++_this._loadedScenesCount < _this._sceneDataObjects.length) {
                _this.loadScene(_this._loadedScenesCount);
            }
            else {
                _this.activateSwitchSceneButton();
            }
        }, function (progressEvent) {
            if (isFirstScene) {
                _this.onProgress(progressEvent);
            }
        });
    };
    SceneLoader.prototype.activateSwitchSceneButton = function () {
        var _this = this;
        var switchScene = document.getElementById('switchScene');
        utils.HTML.showElement(switchScene, true);
        switchScene.addEventListener('click', function () {
            _this.displayScene((_this._currentSceneIndex + 1) % _this._sceneDataObjects.length);
        });
    };
    SceneLoader.prototype.displayScene = function (index, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        var condition = true;
        if (this._dragControls) {
            if (this._dragControls.productInspector.isActive()) {
                condition = false; /** The button is also disabled, this is for double safety */
            }
        }
        if ((this._currentSceneIndex !== index || force) && condition) {
            var videoObject = this._sceneDataObjects[this._currentSceneIndex].videoObject;
            if (videoObject) {
                videoObject.pause();
                videoObject.deactivate();
            }
            this._currentSceneIndex = index;
            var sceneCandidate = this._sceneDataObjects[index];
            if (sceneCandidate) {
                for (var _i = 0, _a = this._sceneContainer.children; _i < _a.length; _i++) {
                    var scene = _a[_i];
                    this._sceneContainer.remove(scene);
                }
                this._scene.scene.name = sceneCandidate.baseURL; /** We use this to get the url of the original, high-res textures in ProductObject's changeTexture method */
                this._sceneContainer.add(sceneCandidate.container);
                if (this._dragControls) {
                    this._dragControls.deactivate();
                }
                this._products.length = 0;
                this._sceneContainer.traverse(function (node) {
                    var idAsInt = parseInt(node.name);
                    if (!isNaN(idAsInt)) /** We assume that only products have numbers as names... */ {
                        node.name = idAsInt.toString();
                        _this._products.push(node);
                    }
                });
                if (sceneCandidate.videoObject) {
                    sceneCandidate.videoObject.activate();
                }
                this._dragControls = new DragControls(this._products, this._camera, this._renderer.domElement);
                this._scene.eventDispatcher.dispatchEvent({ type: 'dragControlsCreated' });
            }
            else {
                console.warn("Scene you want to display doesn't exist!");
            }
        }
    };
    SceneLoader.prototype.loadingTextForPercentage = function (percentage) {
        if (percentage < 20) {
            return 'Wir machen das Licht an...';
        }
        else if (percentage < 40) {
            return 'Der Raum wird geladen...';
        }
        else if (percentage < 60) {
            return 'Die Möbel werden geladen...';
        }
        else if (percentage < 80) {
            return 'Frische Produkte werden eingeräumt...';
        }
        else {
            return 'Wir arrangieren für Sie alles schön...';
        }
    };
    Object.defineProperty(SceneLoader.prototype, "sceneContainer", {
        get: function () {
            return this._sceneContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneLoader.prototype, "dragControls", {
        get: function () {
            return this._dragControls;
        },
        enumerable: true,
        configurable: true
    });
    return SceneLoader;
}());
var BasketUI = /** @class */ (function () {
    function BasketUI(scene) {
        var _this = this;
        this.preventCameraMovement = function (event) {
            event.stopImmediatePropagation();
        };
        this.enlargeShoppingCartSize = function () {
            _this._shoppingCartSize.setEnd(_this._shoppingCartSize.max);
            _this._shoppingCartElement.classList.add('copy');
            _this._isShoppingCartLarge = true;
        };
        this.reductShoppingCartSize = function () {
            _this._shoppingCartSize.setEnd(_this._shoppingCartSize.min);
            _this._shoppingCartElement.classList.remove('copy');
            _this._isShoppingCartLarge = false;
        };
        this.toggleBasket = function () {
            if (_this._isBasketSwipedDown) {
                _this.swipeUpBasket();
            }
            else {
                _this.swipeDownBasket();
            }
        };
        this.performBasketCheckout = function () {
            Main.getInstance().basket.performCheckout();
        };
        this.swipeUpBasket = function () {
            _this._cameraDownAmount.setEnd(_this.getViewHeight() / 2);
            _this._isBasketSwipedDown = false;
            _this._basketBottom.setEnd(0);
            _this.reductShoppingCartSize();
            _this._eventDispatcher.dispatchEvent({ type: 'swipeUpBasket' });
        };
        this.swipeDownBasket = function () {
            var viewHeight = _this.getViewHeight();
            var basketPos = viewHeight / 2 + _this._basketHeight * viewHeight / window.innerHeight;
            _this._cameraDownAmount.setEnd(basketPos);
            _this._isBasketSwipedDown = true;
            _this._basketBottom.setEnd(-_this._basketHeight);
            _this.enlargeShoppingCartSize();
            _this._eventDispatcher.dispatchEvent({ type: 'swipeDownBasket' });
        };
        this.resize = function () {
            if (window.innerHeight > 720) /** If the screen is big enough, the basket can be "open" by default */ {
                _this.swipeUpBasket();
            }
            else {
                _this.swipeDownBasket();
            }
            _this.updateTransformations();
        };
        this.updateTransformations = function () {
            var width = window.innerWidth;
            var viewHeight = _this.getViewHeight(); // visible height
            var viewWidth = viewHeight * _this._camera.aspect; // visible width
            var cameraPos = _this._camera.position.clone();
            var lookingAt = _this._camera.getWorldDirection(new THREE.Vector3()).clone().normalize();
            var cameraLeft = _this._camera.up.clone().cross(lookingAt).normalize();
            var cameraDown = cameraLeft.clone().cross(lookingAt).normalize();
            _this._glElements.remove(_this._plane);
            _this._plane.geometry.dispose();
            _this._plane = _this.createPlane(width, _this._basketHeight);
            _this._plane.geometry.computeBoundingBox();
            var scale = (viewWidth / (_this._plane.geometry.boundingBox.max.x * 2));
            _this._glElements.scale.set(scale, scale, scale);
            _this._cameraDownAmount.update();
            _this._basketBottom.update();
            _this._basketElement.style.bottom = Math.round(_this._basketBottom.start) + "px";
            var downAmount = cameraDown.clone().multiplyScalar(_this._cameraDownAmount.start);
            var desiredObjectPos = cameraPos.add(lookingAt.clone().multiplyScalar(_this._dist)).add(downAmount);
            _this._glElements.position.copy(desiredObjectPos);
            _this._shoppingCartSize.update();
            _this._circle.scale.set(_this._shoppingCartSize.start, _this._shoppingCartSize.start, 1);
            _this._glElements.lookAt(_this._camera.position.clone().add(downAmount));
            _this._glElements.add(_this._plane);
        };
        this._scene = scene;
        this._camera = this._scene.camera;
        this._glRenderer = this._scene.renderer;
        this._glScene = this._scene.scene;
        this._glElements = new THREE.Object3D();
        this._glElements.name = 'basketUI';
        this._glScene.add(this._glElements);
        this.getHTMLElements();
        this._basketHeight = parseInt(window.getComputedStyle(this._basketElement).height);
        var dampingFactor = 0.35;
        this._shoppingCartRadius = { small: 65 / 2 + 8, large: 90 / 2 + 8 };
        this._isShoppingCartLarge = false;
        this._shoppingCartSize = new BoundedConvergence(this._shoppingCartRadius.small, this._shoppingCartRadius.small, this._shoppingCartRadius.small, this._shoppingCartRadius.large, dampingFactor); /** 65 is the width in css. So the cirlce's radius needs to be half as that + some margin */
        this._basketBottom = new BoundedConvergence(-this._basketHeight, 0, -this._basketHeight, 0, dampingFactor);
        this._dist = 0.15;
        var viewHeight = this.getViewHeight();
        var basketPos = viewHeight / 2 + this._basketHeight * viewHeight / window.innerHeight;
        this._cameraDownAmount = new Convergence(basketPos, basketPos, dampingFactor);
        this._isBasketSwipedDown = true;
        /** It is based on this: http://adndevblog.typepad.com/cloud_and_mobile/2015/07/embedding-webpages-in-a-3d-threejs-scene.html */
        this._seeThroughMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.0,
            side: THREE.FrontSide,
            blending: THREE.NoBlending,
            transparent: true
        });
        this.init();
    }
    BasketUI.prototype.init = function () {
        this._eventDispatcher = new THREE.EventDispatcher();
        this.create3dElement(window.innerWidth, this._basketHeight);
        this.initListeners();
    };
    BasketUI.prototype.create3dElement = function (w, h) {
        this._plane = this.createPlane(w, h);
        this._glElements.add(this._plane);
        this._circle = this.createCircle(); // shoppingcart icon
        this._glElements.add(this._circle);
        this.renderElementsOnTop();
    };
    BasketUI.prototype.renderElementsOnTop = function () {
        this._circle.renderOrder = 999;
        this._circle.onBeforeRender = function (renderer) {
            renderer.clearDepth();
        };
        this._plane.renderOrder = 998;
        this._plane.onBeforeRender = function (renderer) {
            renderer.clearDepth();
        };
    };
    BasketUI.prototype.renderElementsNormally = function () {
        this._circle.renderOrder = 0;
        this._circle.onBeforeRender = function (renderer) { };
        this._plane.renderOrder = 0;
        this._plane.onBeforeRender = function (renderer) { };
    };
    BasketUI.prototype.createCircle = function () {
        var geometry = new THREE.CircleGeometry(1, 64);
        var mesh = new THREE.Mesh(geometry, this._seeThroughMaterial);
        this._shoppingCartCenterOffset = this._basketHeight / 2 + 50;
        mesh.translateY(this._shoppingCartCenterOffset);
        return mesh;
    };
    BasketUI.prototype.createPlane = function (w, h) {
        var geometry = new THREE.PlaneGeometry(w, h);
        var mesh = new THREE.Mesh(geometry, this._seeThroughMaterial);
        mesh.translateY(h / 2);
        return mesh;
    };
    BasketUI.prototype.getHTMLElements = function () {
        this._basketElement = document.getElementById('basket');
        this._basketElement.addEventListener('mousedown', this.preventCameraMovement);
        this._basketElement.addEventListener('touchstart', this.preventCameraMovement);
        this._productContainer = document.getElementById('productContainer');
        this._shoppingCartElement = document.getElementById('shoppingCartContainer');
        this._numberOfArticlesElement = document.getElementById('noOfArticles');
        this._totalPriceElement = document.getElementById('totalPrice');
        this._checkoutButton = document.getElementById('checkoutButton');
    };
    BasketUI.prototype.getViewHeight = function () {
        var vFOV = THREE.Math.degToRad(this._camera.fov); // convert vertical fov to radians
        var viewHeight = 2 * Math.tan(vFOV / 2) * this._dist; // visible height
        return viewHeight;
    };
    BasketUI.prototype.initListeners = function () {
        this._shoppingCartElement.addEventListener('click', this.toggleBasket);
        this._checkoutButton.addEventListener('click', this.performBasketCheckout);
        /** For some reason "click" doesn't work on touch devices here... */
        //this._shoppingCartElement.addEventListener('touchstart', this.toggleBasket);
    };
    BasketUI.prototype.hitTestBasket = function (pageX, pageY) {
        var basketUI = Main.getInstance().scene.UI.basketUI;
        var basketHeight = basketUI.isBasketSwipedDown ? 0 : basketUI.basketHeight;
        var shoppingCart = basketUI.shoppingCartCircle;
        var hitBasket = pageY >= window.innerHeight - basketHeight;
        var hitShoppingCartIcon = utils.Geometry.distanceBetween2Vec2({ x: pageX, y: pageY }, { x: window.innerWidth / 2, y: window.innerHeight - shoppingCart.offsetFromBottom }) <= shoppingCart.radius;
        return hitBasket || hitShoppingCartIcon;
    };
    Object.defineProperty(BasketUI.prototype, "isBasketSwipedDown", {
        get: function () {
            return this._isBasketSwipedDown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "basketElement", {
        get: function () {
            return this._basketElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "basketHeight", {
        get: function () {
            return this._basketHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "shoppingCartCircle", {
        get: function () {
            var size = this._isShoppingCartLarge ? 'large' : 'small';
            var offset = this._isBasketSwipedDown ? 0 : this._shoppingCartCenterOffset;
            return { radius: this._shoppingCartRadius[size], offsetFromBottom: offset };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "productContainer", {
        get: function () {
            return this._productContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "NoOfArticlesElement", {
        get: function () {
            return this._numberOfArticlesElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "totalPriceElement", {
        get: function () {
            return this._totalPriceElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "eventDispatcher", {
        get: function () {
            return this._eventDispatcher;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketUI.prototype, "container", {
        get: function () {
            return this._glElements;
        },
        enumerable: true,
        configurable: true
    });
    return BasketUI;
}());
/** This class is mainly for animating anything seamlessly and smoothly.
 *  If you modify the "end", end you keep calling "update", then start will get closer and closer to the value of "end"
 *  The higher the dampingFactor is, the faster the "animation" is. It should be between 0 and 1.*/
var Convergence = /** @class */ (function () {
    function Convergence(start, end, dampingFactor) {
        if (dampingFactor === void 0) { dampingFactor = 0.1; }
        var _this = this;
        this.update = function () {
            _this._start += (_this._end - _this._start) * _this._dampingFactor;
        };
        this._originalStart = start;
        this._start = start;
        this._originalEnd = end;
        this._end = end;
        this._dampingFactor = dampingFactor;
    }
    Convergence.prototype.increaseEndBy = function (value) {
        this._end += value;
    };
    Convergence.prototype.decreaseEndBy = function (value) {
        this._end -= value;
    };
    Object.defineProperty(Convergence.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Convergence.prototype, "end", {
        get: function () {
            return this._end;
        },
        enumerable: true,
        configurable: true
    });
    Convergence.prototype.setEnd = function (value) {
        this._end = value;
    };
    Convergence.prototype.reset = function (start, end) {
        this._start = start != null ? start : this._originalStart;
        this._end = end != null ? end : this._originalEnd;
    };
    return Convergence;
}());
var BoundedConvergence = /** @class */ (function (_super) {
    __extends(BoundedConvergence, _super);
    function BoundedConvergence(start, end, min, max, dampingFactor) {
        if (dampingFactor === void 0) { dampingFactor = 0.1; }
        var _this = _super.call(this, start, end, dampingFactor) || this;
        _this._min = min;
        _this._max = max;
        return _this;
    }
    Object.defineProperty(BoundedConvergence.prototype, "min", {
        get: function () {
            return this._min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundedConvergence.prototype, "max", {
        get: function () {
            return this._max;
        },
        enumerable: true,
        configurable: true
    });
    BoundedConvergence.prototype.increaseEndBy = function (value) {
        this.setEnd(this._end + value);
    };
    BoundedConvergence.prototype.decreaseEndBy = function (value) {
        this.setEnd(this._end - value);
    };
    BoundedConvergence.prototype.setEnd = function (value) {
        this._end = value;
        if (this._end < this._min) {
            this._end = this._min;
        }
        else if (this._end > this._max) {
            this._end = this._max;
        }
    };
    BoundedConvergence.prototype.reset = function (start, end, min, max, dampingFactor) {
        this._start = start != null ? start : this._originalStart;
        this._end = end != null ? end : this._originalEnd;
        this._min = min != null ? min : this._min;
        this._max = max != null ? max : this._max;
        this._dampingFactor = dampingFactor != null ? dampingFactor : this._dampingFactor;
    };
    return BoundedConvergence;
}(Convergence));
/** This module is for the camera movement control
 * You can move with left and right arrow in a circle shape
 * */
///<reference path='./UI/BasketUI.ts'/>
///<reference path='../utils/Convergence.ts'/>
///<reference path='../utils/BoundedConvergence.ts'/>
var CircleControls = /** @class */ (function () {
    function CircleControls(scene) {
        var _this = this;
        this.keyDown = function (event) {
            if (_this._isActive) {
                var key = event.keyCode ? event.keyCode : event.which;
                switch (key) {
                    case 37: // left arrow
                        _this._isKeyPressed.left = true;
                        break;
                    case 38: // up arrow
                        _this._isKeyPressed.up = true;
                        break;
                    case 39: // right arrow
                        _this._isKeyPressed.right = true;
                        break;
                    case 40: // down arrow
                        _this._isKeyPressed.down = true;
                        break;
                }
            }
        };
        this.keyUp = function (event) {
            var key = event.keyCode ? event.keyCode : event.which;
            switch (key) {
                case 37: // left arrow
                    _this._isKeyPressed.left = false;
                    break;
                case 38: // up arrow
                    _this._isKeyPressed.up = false;
                    break;
                case 39: // right arrow
                    _this._isKeyPressed.right = false;
                    break;
                case 40: // down arrow
                    _this._isKeyPressed.down = false;
                    break;
            }
        };
        this.pointerDown = function () {
            if (_this._isActive) {
                utils.HTML.addToClassList(document.getElementsByClassName('productContainer'), 'disabledPointerActions');
                _this._isPointerDown = true;
            }
        };
        this.handleMouseMove = function (event) {
            _this.pointerMove(event.pageX, event.pageY);
        };
        this.pointerMove = function (pointerX, pointerY, isTouch) {
            if (isTouch === void 0) { isTouch = false; }
            if (_this._isPointerDown && _this._isActive) {
                if (_this._shouldPointerMoveEventBeTriggered) {
                    if (_this._pointer.prevX === null && _this._pointer.prevY === null) {
                        _this._pointer.prevX = pointerX;
                        _this._pointer.prevY = pointerY;
                    }
                    else {
                        var deltaX = pointerX - _this._pointer.prevX;
                        var deltaY = pointerY - _this._pointer.prevY;
                        _this._pointer.prevX = pointerX;
                        _this._pointer.prevY = pointerY;
                        var offsetXAmount = Math.abs(deltaX) * 0.025 * window.devicePixelRatio;
                        if (deltaX < 0) {
                            _this.increaseCameraX(offsetXAmount);
                        }
                        else {
                            _this.decreaseCameraX(offsetXAmount);
                        }
                        var offsetYAmount = Math.abs(deltaY) * 0.025;
                        if (deltaY < 0) {
                            _this.decreaseCameraY(offsetYAmount);
                        }
                        else {
                            _this.increaseCameraY(offsetYAmount);
                        }
                    }
                    _this._shouldPointerMoveEventBeTriggered = false;
                }
            }
        };
        this.pointerUp = function () {
            //event.preventDefault();
            _this._isPointerDown = false;
            _this._pointer.prevX = null;
            _this._pointer.prevY = null;
            _this._pinchDistance.previous = null;
            utils.HTML.removeFromClassList(document.getElementsByClassName('productContainer'), 'disabledPointerActions');
        };
        this.wheelRotated = function (event) {
            if (_this.isProductBeingDragged() || !_this._isActive) {
                return;
            }
            else {
                /** e.deltaY in different browsers are very different (chrome: 100, firefox: 3, edge: ~71).
                 * This is for unifying the behaviour
                 * */
                _this._zoom.stepsPerOneUnit = 4; // it is changed in touch-zoom event
                _this._zoom.currentValue = -Math.sign(event.deltaY);
            }
        };
        this.handleTouchMove = function (event) {
            event.preventDefault();
            var touchesLength = event.touches.length;
            if (touchesLength === 1) {
                var pageX = event.touches[0].pageX;
                var pageY = event.touches[0].pageY;
                _this.pointerMove(pageX, pageY, true);
            }
            else if (touchesLength === 2) {
                _this.touchPinch(event);
            }
        };
        this.touchPinch = function (event) {
            if (event.touches.length === 2) // this one is for double-safety
             {
                var vec1 = { x: event.touches[0].pageX, y: event.touches[0].pageY };
                var vec2 = { x: event.touches[1].pageX, y: event.touches[1].pageY };
                _this._pinchDistance.current = utils.Geometry.distanceBetween2Vec2(vec1, vec2);
                if (_this._pinchDistance.previous === null) {
                    _this._pinchDistance.previous = _this._pinchDistance.current;
                }
                else {
                    if (_this.isProductBeingDragged() || !_this._isActive) {
                        return;
                    }
                    else {
                        var deltaDistance = _this._pinchDistance.current - _this._pinchDistance.previous;
                        _this._zoom.convergence.increaseEndBy(deltaDistance / 75);
                        /*this._zoom.stepsPerOneUnit = 4; // it is changed in mouse-wheel event
                        this._zoom.currentValue = Math.sign(deltaDistance);*/
                        _this._pinchDistance.previous = _this._pinchDistance.current;
                    }
                }
            }
        };
        this.updateAnalytics = function (time) {
            if ((time - _this._analytics.lastLogTime) > _this._analytics.updateFrequency) {
                var originalAngleInDeg = -THREE.Math.radToDeg(_this._angle.start);
                var didMoveSinceLastLog = Math.abs(originalAngleInDeg - _this._analytics.lastLogAngle) > 5;
                var angle = originalAngleInDeg < 0 ? 360 + originalAngleInDeg % 360 : originalAngleInDeg % 360;
                var zone = Math.round(angle / _this._analytics.noOfSegments);
                ga('send', 'event', {
                    eventCategory: 'Navigation-Circle',
                    eventAction: didMoveSinceLastLog ? 'Move' : 'Stay',
                    eventLabel: zone.toString(),
                    eventValue: angle
                });
                _this._analytics.lastLogAngle = angle;
                _this._analytics.lastLogTime = time;
            }
        };
        this._camera = scene.camera;
        this._canvas = scene.canvas;
        this._cameraLookingAt = new THREE.Vector3();
        this._cameraLookingDir = new THREE.Vector3();
        this._cameraHeight = new BoundedConvergence(1.2, 1.2, 1, 1.8);
        this._verticalCameraAngle = new BoundedConvergence(0, 0, -2, 4);
        this._isKeyPressed = { left: false, up: false, right: false, down: false };
        this._circle = { radius: 7, center: new THREE.Vector3(0, this._cameraHeight.start, 0) };
        this._angle = new Convergence(1, 1);
        var dirOffset = Math.PI / 3;
        this._horizontalCameraAngle = new BoundedConvergence(-dirOffset, -dirOffset, -dirOffset, dirOffset);
        this._pointer = { prevX: null, prevY: null };
        this._isPointerDown = false;
        this._shouldPointerMoveEventBeTriggered = false;
        this._zoom = { convergence: new BoundedConvergence(1, 1, 0, 3), currentValue: 0, stepsPerOneUnit: 4 };
        this._pinchDistance = { previous: null, current: null };
        this._analytics = { lastLogTime: 0, lastLogAngle: this._angle.start, lastLogPosition: this._camera.position, updateFrequency: 2000, noOfSegments: 36 };
        this.activate();
        this.initListeners();
        this.initCameraPosition();
    }
    CircleControls.prototype.initCameraPosition = function () {
        this.updateCamera();
    };
    CircleControls.prototype.updateCameraDirection = function () {
        this._horizontalCameraAngle.update();
        this._verticalCameraAngle.update();
        var x = this._circle.center.x + (this._circle.radius + 10) * Math.cos(this._angle.start + this._horizontalCameraAngle.start);
        var z = this._circle.center.z + (this._circle.radius + 10) * Math.sin(this._angle.start + this._horizontalCameraAngle.start);
        var y = this._verticalCameraAngle.start;
        this._cameraLookingAt.set(x, y, z);
        this._camera.lookAt(this._cameraLookingAt);
    };
    CircleControls.prototype.updateCameraPosition = function () {
        this._angle.update();
        this._cameraHeight.update();
        this._circle.center.y = this._cameraHeight.start;
        var x = this._circle.center.x + this._circle.radius * Math.cos(this._angle.start);
        var z = this._circle.center.z + this._circle.radius * Math.sin(this._angle.start);
        var y = this._circle.center.y;
        this._camera.position.set(x, y, z);
    };
    CircleControls.prototype.updateHorizontalLook = function () {
        var amount = 0.375;
        if (this._isKeyPressed.left) {
            this.decreaseCameraX(amount);
        }
        if (this._isKeyPressed.right) {
            this.increaseCameraX(amount);
        }
    };
    CircleControls.prototype.increaseCameraX = function (amount) {
        amount = THREE.Math.degToRad(amount);
        this._horizontalCameraAngle.increaseEndBy(amount);
        if (this._horizontalCameraAngle.end >= this._horizontalCameraAngle.max) {
            this._angle.increaseEndBy(amount);
        }
    };
    CircleControls.prototype.decreaseCameraX = function (amount) {
        amount = THREE.Math.degToRad(amount);
        this._horizontalCameraAngle.decreaseEndBy(amount);
        if (this._horizontalCameraAngle.end <= this._horizontalCameraAngle.min) {
            this._angle.decreaseEndBy(amount);
        }
    };
    CircleControls.prototype.updateVerticalLook = function () {
        var amount = 0.1;
        if (this._isKeyPressed.up) {
            this.increaseCameraY(amount);
        }
        if (this._isKeyPressed.down) {
            this.decreaseCameraY(amount);
        }
    };
    CircleControls.prototype.increaseCameraY = function (amount) {
        this._verticalCameraAngle.increaseEndBy(amount);
        if (this._verticalCameraAngle.end >= this._verticalCameraAngle.max) {
            this._cameraHeight.increaseEndBy(amount / 4);
        }
    };
    CircleControls.prototype.decreaseCameraY = function (amount) {
        this._verticalCameraAngle.decreaseEndBy(amount);
        if (this._verticalCameraAngle.end <= this._verticalCameraAngle.min) {
            this._cameraHeight.decreaseEndBy(amount / 4);
        }
    };
    CircleControls.prototype.updateCamera = function () {
        this.updateHorizontalLook();
        this.updateVerticalLook();
        this.updateCameraPosition();
        this.updateCameraDirection();
        this.updateZoom();
    };
    CircleControls.prototype.updateZoom = function () {
        /** We should not reset the cameraposition to the state before the zoom, because it gets calculated in the updateCameraPosition() method anyway  */
        this._zoom.convergence.increaseEndBy(this._zoom.currentValue / this._zoom.stepsPerOneUnit);
        this._zoom.currentValue = 0;
        this._cameraLookingDir = this._camera.getWorldDirection(new THREE.Vector3()).clone().normalize();
        this._cameraLookingDir.multiplyScalar((((Math.abs(Math.sin(this._horizontalCameraAngle.start)) + 1.25)) / 2.9) * this._zoom.convergence.start / Math.abs(Math.cos(this._horizontalCameraAngle.start)));
        this._camera.position.add(this._cameraLookingDir);
        this._zoom.convergence.update();
    };
    CircleControls.prototype.setCameraPosition = function (values) {
        this._angle.setEnd(values.angle);
        this._cameraHeight.setEnd(values.cameraHeight);
        this._horizontalCameraAngle.setEnd(values.horizontalLook);
        this._verticalCameraAngle.setEnd(values.verticalLook);
    };
    CircleControls.prototype.isCameraMoving = function () {
        var EPSILON = 1 / 100;
        var isZooming = Math.abs(this._zoom.convergence.end - this._zoom.convergence.start) > EPSILON;
        var isMovingHorizontally = Math.abs(this._angle.end - this._angle.start) > EPSILON;
        var isChangingHorizontalLookDirection = Math.abs(this._horizontalCameraAngle.end - this._horizontalCameraAngle.start) > EPSILON;
        var isMovingVertically = Math.abs(this._cameraHeight.end - this._cameraHeight.end) > EPSILON;
        var isChangingVerticalLookDirection = Math.abs(this._verticalCameraAngle.end - this._verticalCameraAngle.start) > EPSILON;
        return isZooming || isMovingHorizontally || isChangingHorizontalLookDirection || isMovingVertically || isChangingVerticalLookDirection;
    };
    CircleControls.prototype.setDragControls = function (dragControls) {
        this._dragControls = dragControls;
    };
    CircleControls.prototype.isProductBeingDragged = function () {
        if (this._dragControls) {
            return this._dragControls.isBeingDragged();
        }
        else /** I know this 'else' is not necessary, but I like to keep the if-else structure for readability purposes */ {
            return false;
        }
    };
    CircleControls.prototype.activate = function (switchSmoothly) {
        var _this = this;
        if (switchSmoothly === void 0) { switchSmoothly = false; }
        if (switchSmoothly) {
            var target = this._camera.position.clone().add(this._camera.getWorldDirection(new THREE.Vector3()).clone().normalize());
            var startData_3 = {
                posX: this._camera.position.x,
                posY: this._camera.position.y,
                posZ: this._camera.position.z,
                targetX: target.x,
                targetY: target.y,
                targetZ: target.z
            };
            this._horizontalCameraAngle.reset();
            this._verticalCameraAngle.reset();
            this._cameraHeight.reset();
            this._angle.reset();
            this._zoom.convergence.reset();
            var lookingDir = new THREE.Vector3(0.8889846687751208, -0.08082320066616207, -0.4507481213680944);
            lookingDir.multiplyScalar((((Math.abs(Math.sin(this._horizontalCameraAngle.start)) + 1.25)) / 2.9) * this._zoom.convergence.start / Math.abs(Math.cos(this._horizontalCameraAngle.start)));
            var newX = this._circle.center.x + this._circle.radius * Math.cos(this._angle.start) + lookingDir.x;
            var newZ = this._circle.center.z + this._circle.radius * Math.sin(this._angle.start) + lookingDir.z;
            var newY = this._circle.center.y + lookingDir.y;
            var endData = {
                posX: newX,
                posY: newY,
                posZ: newZ,
                targetX: newX + lookingDir.x,
                targetY: newY + lookingDir.y,
                targetZ: newZ + lookingDir.z
            };
            new TWEEN.Tween(startData_3)
                .to(endData, 1000)
                .easing(TWEEN.Easing.Exponential.InOut) // Use an easing function to make the animation smooth.
                .onUpdate(function () {
                _this._camera.position.set(startData_3.posX, startData_3.posY, startData_3.posZ);
                _this._camera.lookAt(startData_3.targetX, startData_3.targetY, startData_3.targetZ);
            })
                .onComplete(function () {
                _this._isActive = true;
            })
                .start(); // Start the tween immediately.
        }
        else {
            this._isActive = true;
        }
    };
    CircleControls.prototype.initListeners = function () {
        this._canvas.addEventListener('mousedown', this.pointerDown);
        this._canvas.addEventListener('mousemove', this.handleMouseMove);
        this._canvas.addEventListener('mouseup', this.pointerUp);
        this._canvas.addEventListener('mouseleave', this.pointerUp);
        this._canvas.addEventListener('wheel', this.wheelRotated);
        this._canvas.addEventListener('touchstart', this.pointerDown);
        this._canvas.addEventListener('touchmove', this.handleTouchMove);
        this._canvas.addEventListener('touchcancel', this.pointerUp);
        this._canvas.addEventListener('touchend', this.pointerUp);
        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    };
    CircleControls.prototype.deactivate = function () {
        this._isPointerDown = false;
        this._isActive = false;
    };
    Object.defineProperty(CircleControls.prototype, "angle", {
        get: function () {
            return this._angle.start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CircleControls.prototype, "type", {
        get: function () {
            return 'CIRCLE';
        },
        enumerable: true,
        configurable: true
    });
    CircleControls.prototype.update = function (time) {
        if (this._isActive) {
            /** Chrome triggers pointermoveEvents 60 times per second (or the refreshrate of your display).
             * Firefox and Edge triggers it 1500-2000 times per second... It made controls with mouse inconsistent across browsers.
             * So this is a workaround to prevent that. It is set to false in the pointermove-function */
            this._shouldPointerMoveEventBeTriggered = true;
            this.updateCamera();
        }
        this.updateAnalytics(time);
    };
    return CircleControls;
}());
var FreeMovementControls = /** @class */ (function () {
    function FreeMovementControls(scene) {
        var _this = this;
        this.EYE_HEIGHT = 1.5;
        this.EPSILON = 0.0001;
        this.INDICATOR_HEIGHT = 0.07;
        this.pointerDown = function () {
            utils.HTML.addToClassList(document.getElementsByClassName('productContainer'), 'disabledPointerActions');
            _this._isPointerDown = true;
            _this._mouseMoved = false;
        };
        this.handleMouseMove = function (event) {
            _this.pointerMove(event.pageX, event.pageY);
        };
        this.handleTouchMove = function (event) {
            var touch = event.changedTouches[0];
            _this.pointerMove(touch.pageX, touch.pageY);
        };
        this.pointerUp = function () {
            document.body.classList.remove('rotating');
            document.body.classList.remove('discIntersected');
            document.body.classList.remove('rotatable');
            if (!_this._mouseMoved && _this._intersectionPoint) {
                var newCameraPos = _this._intersectionPoint.clone().add(new THREE.Vector3(0, _this.EYE_HEIGHT, 0));
                var startData_4 = { x: _this._camera.position.x, y: _this._camera.position.y, z: _this._camera.position.z };
                var endData = { x: newCameraPos.x, y: newCameraPos.y, z: newCameraPos.z };
                _this.popIndicatingCircle();
                _this._isCameraPositionMoving = true;
                new TWEEN.Tween(startData_4)
                    .to(endData, 1000)
                    .easing(TWEEN.Easing.Exponential.Out) // Use an easing function to make the animation smooth.
                    .onUpdate(function () {
                    _this._camera.position.set(startData_4.x, startData_4.y, startData_4.z);
                })
                    .onComplete(function () {
                    _this._isCameraPositionMoving = false;
                })
                    .start(); // Start the tween immediately.
            }
            _this._isPointerDown = false;
            _this._pointer.prevX = null;
            _this._pointer.prevY = null;
            utils.HTML.removeFromClassList(document.getElementsByClassName('productContainer'), 'disabledPointerActions');
        };
        this.pointerMove = function (pageX, pageY) {
            _this._mouseMoved = pageX !== _this._pointer.prevX || pageY !== _this._pointer.prevY; /** Sometimes pointermove is fired when the mouse is clicked, but the mouse doesn't even move. We have to check if the mouse really moved, or not */
            if (_this._isPointerDown) {
                if (_this._mouseMoved) {
                    _this._circleIndicator.visible = false;
                }
                document.body.classList.add('rotating');
                document.body.classList.remove('rotatable');
                document.body.classList.remove('discIntersected');
                if (_this._pointer.prevX != null && _this._pointer.prevY != null) {
                    _this._u.decreaseEndBy(window.devicePixelRatio * (pageX - _this._pointer.prevX) / 800);
                    _this._v.decreaseEndBy(window.devicePixelRatio * (pageY - _this._pointer.prevY) / 800);
                }
            }
            else {
                _this.updateIntersectionPoint();
                if (_this._intersectionPoint) {
                    _this.updateCircleOnGround();
                    document.body.classList.add('discIntersected');
                    document.body.classList.remove('rotating');
                    document.body.classList.remove('rotatable');
                }
                else {
                    _this._circleIndicator.visible = false;
                    document.body.classList.add('rotatable');
                    document.body.classList.remove('discIntersected');
                    document.body.classList.remove('rotating');
                }
            }
            _this._pointer.prevX = _this._pointer.prevValidX = pageX;
            _this._pointer.prevY = _this._pointer.prevValidY = pageY;
        };
        this.updateAnalytics = function (time) {
            if ((time - _this._analytics.lastLogTime) > _this._analytics.updateFrequency) {
                var camPosProjectedOnGround = new THREE.Vector3(_this._camera.position.x, 0, _this._camera.position.z);
                var smallestAngle = THREE.Math.radToDeg(camPosProjectedOnGround.angleTo(new THREE.Vector3(1, 0, 0)));
                var angle = camPosProjectedOnGround.clone().cross(new THREE.Vector3(1, 0, 0)).y <= 0 ? smallestAngle : 360 - smallestAngle;
                var didMoveSinceLastLog = Math.abs(_this._camera.position.distanceTo(_this._analytics.lastLogPosition)) > 0;
                var angleZone = Math.ceil(angle / _this._analytics.noOfSegments);
                var depthZone = Math.ceil(camPosProjectedOnGround.distanceTo(new THREE.Vector3(0, 0, 0)) / 3);
                var zoneLabel = angleZone.toString() + '-' + depthZone.toString();
                ga('send', 'event', {
                    eventCategory: 'Navigation-Free',
                    eventAction: didMoveSinceLastLog ? 'Move' : 'Stay',
                    eventLabel: zoneLabel
                });
                _this._analytics.lastLogPosition = _this._camera.position.clone();
                _this._analytics.lastLogTime = time;
            }
        };
        this.update = function (time) {
            _this._u.update();
            _this._v.update();
            _this._forward = _this.getSphereSurfacePointFromUV(_this._u.start, _this._v.start);
            _this._camera.lookAt(_this._camera.position.clone().add(_this._forward));
            if (_this.isCameraMoving()) {
                _this.updateIntersectionPoint();
                _this.updateCircleOnGround();
            }
            _this.updateAnalytics(time);
        };
        this._camera = scene.camera;
        this._canvas = scene.canvas;
        this._isPointerDown = false;
        this._pointer = { prevX: null, prevY: null, prevValidX: null, prevValidY: null };
        this._u = new Convergence(0, 0);
        this._v = new BoundedConvergence(0, 0, 0.01, 3.14);
        this._mouseMoved = true;
        this._raycaster = new THREE.Raycaster();
        this._disc = { o: new THREE.Vector3(0, 0, 0), n: new THREE.Vector3(0, 1, 0), r: 9 };
        this._mouse = new THREE.Vector2();
        this._isCameraPositionMoving = false;
        this._analytics = { lastLogTime: 0, lastLogAngle: 0, lastLogPosition: this._camera.position, updateFrequency: 2000, noOfSegments: 36 };
        this._circleIndicator = new THREE.Mesh(new THREE.RingBufferGeometry(0.15, 0.5, 28, 1), new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.4 }));
        this._circleIndicator.lookAt(new THREE.Vector3(0, 1, 0));
        this._circleIndicator.position.setY(this.INDICATOR_HEIGHT);
        this._circleIndicator.visible = false;
        scene.scene.add(this._circleIndicator);
        this.activate();
    }
    FreeMovementControls.prototype.intersectPlane = function (ray, plane) {
        var t = plane.n.dot(plane.q.clone().sub(ray.origin)) / plane.n.dot(ray.direction);
        if (t >= this.EPSILON) {
            return ray.origin.clone().add(ray.direction.clone().multiplyScalar(t)); /** hit point */
        }
        else {
            return null;
        }
    };
    FreeMovementControls.prototype.intersectDisc = function (ray, disc) {
        var intersectionPoint = this.intersectPlane(ray, { q: disc.o, n: disc.n });
        if (intersectionPoint) {
            if (intersectionPoint.distanceTo(disc.o) <= disc.r) {
                return intersectionPoint;
            }
        }
        return null;
    };
    FreeMovementControls.prototype.popIndicatingCircle = function () {
        var _this = this;
        var startData = {
            originalScale: this._circleIndicator.scale.x,
            scale: this._circleIndicator.scale.x,
            originalOpacity: this._circleIndicator.material.opacity,
            opacity: this._circleIndicator.material.opacity
        };
        var endData = {
            scale: this._circleIndicator.scale.x * 1.5,
            opacity: 0
        };
        new TWEEN.Tween(startData)
            .to(endData, 200)
            .onUpdate(function () {
            _this._circleIndicator.scale.set(startData.scale, startData.scale, startData.scale);
            _this._circleIndicator.material.opacity = startData.opacity;
        })
            .onComplete(function () {
            _this._circleIndicator.visible = false; // it will be set to true on mousemove
            _this._circleIndicator.scale.set(startData.originalScale, startData.originalScale, startData.originalScale);
            _this._circleIndicator.material.opacity = startData.originalOpacity;
        })
            .start(); // Start the tween immediately.
    };
    FreeMovementControls.prototype.updateIntersectionPoint = function (pageX, pageY) {
        var x = pageX || this._pointer.prevValidX;
        var y = pageY || this._pointer.prevValidY;
        if (x && y) {
            var rect = this._canvas.getBoundingClientRect();
            this._mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
            this._mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
            this._raycaster.setFromCamera(this._mouse, this._camera);
            this._intersectionPoint = this.intersectDisc(this._raycaster.ray, this._disc);
        }
    };
    FreeMovementControls.prototype.updateCircleOnGround = function () {
        if (!this._isCameraPositionMoving && this._intersectionPoint) {
            /** we need to correct the position, because it's slightly above the ground, so it makes it look like it's not exactly at the center of the mouse */
            var distanceFromCameraToIntersectionPoint = this._camera.position.distanceTo(this._intersectionPoint);
            var cosAlpha = this._camera.position.y / distanceFromCameraToIntersectionPoint;
            var alpha = Math.acos(cosAlpha);
            var tanAlpha = Math.tan(alpha);
            var correctionDirection = this._camera.position.clone().sub(this._intersectionPoint);
            correctionDirection.setY(this.INDICATOR_HEIGHT);
            correctionDirection.normalize();
            var correctionAmount = tanAlpha * this._circleIndicator.position.y;
            var correctionVector = new THREE.Vector3().copy(correctionDirection).multiplyScalar(correctionAmount);
            var newPosition = new THREE.Vector3(this._intersectionPoint.x, this.INDICATOR_HEIGHT, this._intersectionPoint.z);
            newPosition.add(correctionVector);
            this._circleIndicator.position.copy(newPosition);
            this._circleIndicator.visible = true;
        }
    };
    FreeMovementControls.prototype.getSphereSurfacePointFromUV = function (u, v) {
        var uv = new THREE.Vector3(Math.cos(u) * Math.sin(v), Math.cos(v), Math.sin(u) * Math.sin(v)).normalize();
        return uv;
    };
    /** See this for explanation: https://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere */
    FreeMovementControls.prototype.setUVFromSphereSufracePoint = function () {
        var forward = this._camera.getWorldDirection(new THREE.Vector3()).clone().normalize();
        var u = Math.PI + Math.atan2(-forward.z, -forward.x);
        this._u.reset(u, u);
        var v = (Math.PI / 2) - Math.asin(forward.y);
        this._v.reset(v, v);
    };
    FreeMovementControls.prototype.isCameraMoving = function () {
        var EPSILON = 1 / 500;
        var isUMoving = Math.abs(this._u.end - this._u.start) > EPSILON;
        var isVMoving = Math.abs(this._v.end - this._v.start) > EPSILON;
        return isUMoving || isVMoving || this._isCameraPositionMoving;
    };
    FreeMovementControls.prototype.activate = function () {
        this.setUVFromSphereSufracePoint();
        this._canvas.addEventListener('mousedown', this.pointerDown);
        this._canvas.addEventListener('mousemove', this.handleMouseMove);
        this._canvas.addEventListener('mouseup', this.pointerUp);
        this._canvas.addEventListener('mouseleave', this.pointerUp);
        //this._canvas.addEventListener('wheel',       this.wheelRotated);
        this._canvas.addEventListener('touchstart', this.pointerDown);
        this._canvas.addEventListener('touchmove', this.handleTouchMove);
        this._canvas.addEventListener('touchcancel', this.pointerUp);
        this._canvas.addEventListener('touchend', this.pointerUp);
    };
    FreeMovementControls.prototype.deactivate = function () {
        this._isPointerDown = false;
        this._canvas.removeEventListener('mousedown', this.pointerDown);
        this._canvas.removeEventListener('mousemove', this.handleMouseMove);
        this._canvas.removeEventListener('mouseup', this.pointerUp);
        this._canvas.removeEventListener('mouseleave', this.pointerUp);
        //this._canvas.removeEventListener('wheel',       this.wheelRotated);
        this._canvas.removeEventListener('touchstart', this.pointerDown);
        this._canvas.removeEventListener('touchmove', this.handleTouchMove);
        this._canvas.removeEventListener('touchcancel', this.pointerUp);
        this._canvas.removeEventListener('touchend', this.pointerUp);
    };
    FreeMovementControls.prototype.setDragControls = function (dragControls) {
        this._dragControls = dragControls;
    };
    Object.defineProperty(FreeMovementControls.prototype, "type", {
        get: function () {
            return 'FREE';
        },
        enumerable: true,
        configurable: true
    });
    return FreeMovementControls;
}());
var ThumbnailFromModel = /** @class */ (function () {
    function ThumbnailFromModel(object, width, height) {
        if (width === void 0) { width = 85; }
        if (height === void 0) { height = 85; }
        object = object.clone();
        object.traverse(function (obj) {
            if (obj instanceof THREE.Mesh) {
                var material = obj.material;
                if (material instanceof THREE.Material) {
                    obj.material = material.clone();
                }
                obj.geometry = obj.geometry.clone();
            }
        });
        this._object = object;
        this._object.scale.set(1, 1, 1);
        this._object.position.set(0, 0, 0);
        this._object.rotation.set(Math.PI / 2, 0, 0);
        this._width = width;
        this._height = height;
        var boundingBox = new THREE.Box3();
        boundingBox.setFromObject(this._object);
        var productHeight = boundingBox.max.y - boundingBox.min.y;
        var productWidth = boundingBox.max.x - boundingBox.min.x;
        var productSize = Math.max(productHeight, productWidth);
        this.setProductPivot(this._object, productHeight);
        this._scene = new THREE.Scene();
        this._scene.add(this._object);
        var FOV = 10;
        var horizontalCameraPos = 0;
        var verticalCameraPos = 0;
        var fillDistance = Math.tan(THREE.Math.degToRad(90 - FOV / 2)) * productSize / 2; /** With this distance, the product's height is 100% of the canvas' height */
        var cameraDistance = fillDistance * 1.3;
        this._camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 10);
        this._camera.position.set(horizontalCameraPos, verticalCameraPos, cameraDistance);
        this.initLights();
        this.initRenderer();
        this.render();
    }
    ThumbnailFromModel.prototype.setProductPivot = function (product, value) {
        for (var _i = 0, _a = product.children; _i < _a.length; _i++) {
            var mesh = _a[_i];
            mesh.position.setY(value);
        }
    };
    ThumbnailFromModel.initRenderer = function () {
        if (!ThumbnailFromModel._renderer) {
            ThumbnailFromModel._renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            ThumbnailFromModel._renderer.setPixelRatio(window.devicePixelRatio);
            ThumbnailFromModel._renderer.setClearColor(0xFFFFFF, 0);
        }
    };
    ThumbnailFromModel.prototype.initLights = function () {
        var ambientLight = new THREE.AmbientLight(0x888888);
        this._scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xa8a8a8, 1.0);
        directionalLight.position.set(27, 52, 40);
        this._scene.add(directionalLight);
        var directionalLight2 = new THREE.DirectionalLight(0x333333, 1.0);
        directionalLight2.position.set(7, 12, -5);
        this._scene.add(directionalLight2);
    };
    ThumbnailFromModel.prototype.initRenderer = function () {
        ThumbnailFromModel.initRenderer();
        this._canvas = ThumbnailFromModel._renderer.domElement;
        ThumbnailFromModel._renderer.setSize(this._width, this._height);
    };
    ThumbnailFromModel.prototype.dispose = function (object) {
        object.traverse(function (node) {
            if (node.isMesh) {
                node.geometry.dispose();
            }
        });
    };
    ThumbnailFromModel.prototype.render = function () {
        ThumbnailFromModel._renderer.render(this._scene, this._camera);
        this._scene.remove(this._object);
        this.dispose(this._object);
    };
    ThumbnailFromModel.prototype.getImage = function () {
        return this._canvas.toDataURL();
    };
    return ThumbnailFromModel;
}());
///<reference path='./ThumbnailFromModel.ts'/>
var HeaderUI = /** @class */ (function () {
    function HeaderUI(scene) {
        var _this = this;
        this.CIRCLE = 'CIRCLE';
        this.FREE = 'FREE';
        this.changeFullScreenButton = function () {
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) /** FullScreen */ {
                _this._fullScreen.style.backgroundImage = "url('assets/img/no_fullscreen.svg')";
            }
            else {
                _this._fullScreen.style.backgroundImage = "url('assets/img/fullscreen.svg')";
            }
        };
        this.search = function () {
            var searchText = _this._searchInput.value;
            /*if (searchText.length > 0)
            {
                utils.AJAX.load({
                    url: utils.AJAX.BASE_URL + '/Search/ProductIds',
                    params: {
                        ShopId: Main.SHOP_ID,
                        Terms: searchText
                    },
                    method: utils.AJAX.METHOD_GET,
                    onComplete: this.searchComplete
                });
            }*/
            //const angle = Math.round(this._cameraControls.angle / (2*Math.PI)) * 2*Math.PI;
            //this._cameraControls.setCameraPosition({angle: angle-1.6368, cameraHeight: 3, horizontalLook: 0.0, verticalLook: 1.5});
        };
        this.searchComplete = function (response) {
            _this._dragControls.deactivate();
            _this._cameraControls.deactivate();
            /*const productIDs = JSON.parse(response);
    
            for (let i = 0; i < productIDs.length; ++i)
            {
                document.getElementById('searchResultsContainer').style.display = "block";
                utils.HTML.clearElement(document.getElementById('searchResults'));
                this.loadProduct(parseInt(productIDs[i]));
    
            }*/
        };
        this.loadProduct = function (ID) {
        };
        this.preventCameraMovement = function (event) {
            event.stopImmediatePropagation();
        };
        this._canvas = scene.canvas;
        this._eventDispatcher = scene.eventDispatcher;
        this._searchInput = document.getElementById('searchInput');
        this._fullScreen = document.getElementById('enterFullScreen');
        this._header = document.getElementById('header');
        this._switchControls = document.getElementById('switchControls');
        this.initListeners();
    }
    HeaderUI.prototype.initListeners = function () {
        var _this = this;
        this._header.addEventListener('mousedown', this.preventCameraMovement);
        this._header.addEventListener('touchstart', this.preventCameraMovement);
        document.getElementById('closeSearchResults').addEventListener('click', function () {
            document.getElementById('searchResultsContainer').style.display = "";
            _this._dragControls.activate();
            _this._cameraControls.activate();
        });
        document.onfullscreenchange = this.changeFullScreenButton;
        document.onwebkitfullscreenchange = this.changeFullScreenButton;
        document.onmozfullscreenchange = this.changeFullScreenButton;
        this._fullScreen.addEventListener('click', function () {
            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) /** FullScreen */ {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
            }
            else {
                if (document.body.requestFullscreen) {
                    document.body.requestFullscreen();
                }
                else if (document.body.webkitRequestFullScreen) {
                    document.body.webkitRequestFullScreen();
                }
                else if (document.body.mozRequestFullScreen) {
                    document.body.mozRequestFullScreen();
                }
            }
        });
        this._switchControls.addEventListener('click', function () {
            if (Main.getInstance().scene.cameraControls.type === _this.CIRCLE) {
                _this._switchControls.style.backgroundImage = "url('assets/img/ring_move.svg')";
                _this._eventDispatcher.dispatchEvent({ type: 'switchToFreeMovementControls' });
            }
            else {
                _this._switchControls.style.backgroundImage = "url('assets/img/free_move.svg')";
                _this._eventDispatcher.dispatchEvent({ type: 'switchToCircleMovementControls' });
            }
        });
        document.getElementById('searchSubmit').addEventListener('click', this.search);
        this._searchInput.addEventListener('keyup', function (event) {
            var key = event.keyCode ? event.keyCode : event.which;
            if (key === 13) // enter
             {
                _this.search();
            }
        });
    };
    HeaderUI.prototype.setDragControls = function (dragControls) {
        this._dragControls = dragControls;
    };
    HeaderUI.prototype.setCameraControls = function (cameraControls) {
        this._cameraControls = cameraControls;
    };
    return HeaderUI;
}());
var utils;
(function (utils) {
    var Geometry = /** @class */ (function () {
        function Geometry() {
        }
        Geometry.distanceBetween2Vec2 = function (vec1, vec2) {
            var dx = vec1.x - vec2.x;
            var dy = vec1.y - vec2.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        return Geometry;
    }());
    utils.Geometry = Geometry;
})(utils || (utils = {}));
///<reference path='../../utils/Geometry.ts'/>
var ProductDetailsUI = /** @class */ (function () {
    function ProductDetailsUI(ui) {
        var _this = this;
        this.swipeUpDetails = function () {
            if (!_this._isDesktopModeOn) {
                _this._container.style.transform = 'translateY(-100%)';
                _this._container.style.width = '';
                _this._container.style.left = '';
                _this._toggleBG.style.transform = 'rotateZ(0)';
                _this._productContent.style.display = '';
                _this._isOpen = false;
            }
        };
        this.swipeDownDetails = function () {
            _this._container.style.transform = 'translateY(0)';
            _this._container.style.width = 'calc(100% - 20px)';
            _this._container.style.left = '10px';
            _this._toggleBG.style.transform = 'rotateZ(180deg)';
            _this._productContent.style.display = 'block';
            _this._isOpen = true;
        };
        this.resize = function () {
            _this._isDesktopModeOn = window.innerWidth >= 1365;
            if (_this._isDesktopModeOn) {
                _this._container.style.width = '';
                _this._container.style.left = '';
                _this._container.style.transform = '';
            }
        };
        this._ui = ui;
        this._isOpen = false;
        this._isDesktopModeOn = false;
        this._toggleButton = document.getElementById('toggleProductDetails');
        this._container = document.getElementById('productDetailsContainer');
        this._productContent = document.getElementById('productContent');
        this._toggleBG = document.getElementById('toggleProductDetailsBG');
        utils.HTML.hideElement(this._container);
        this._basketUIEventDispatcher = ui.basketUI.eventDispatcher;
    }
    ProductDetailsUI.prototype.initListeners = function (dragControls) {
        var _this = this;
        this._container.style.height = this._ui.basketUI.isBasketSwipedDown ? 'calc(100% - 130px)' : 'calc(100% - 230px)';
        dragControls.addEventListener('inspectStart', function () {
            utils.HTML.showElement(_this._container, true);
        });
        dragControls.addEventListener('inspectEnd', function () {
            utils.HTML.hideElement(_this._container);
            _this.swipeUpDetails();
        });
        this._basketUIEventDispatcher.addEventListener('swipeUpBasket', function () {
            _this._container.style.height = 'calc(100% - 230px)';
        });
        this._basketUIEventDispatcher.addEventListener('swipeDownBasket', function () {
            _this._container.style.height = 'calc(100% - 130px)';
        });
        this._toggleButton.addEventListener('click', function () {
            _this._isOpen ? _this.swipeUpDetails() : _this.swipeDownDetails();
        });
        this._productDetailsElement = document.getElementById('productDetails');
        this._productInfoElement = document.getElementById('productInfoInDetails');
        this._tabSwitch = document.getElementById('tabSwitch');
        var productInfoDispatcher = Main.getInstance().basket.productInfoDownloader.eventDispatcher;
        productInfoDispatcher.addEventListener('productInfoChanged', function (event) {
            if (Main.getInstance().scene.sceneLoader.dragControls.productInspector.inspectedProduct) {
                var productInfo = JSON.parse(event.message).ProductsInformation[0];
                if (productInfo) {
                    _this._productInfoElement.innerHTML =
                        "<div class=\"manufacturer\">" + productInfo.Manufacturer + "</div>\n\t\t\t\t     <div class=\"name\">" + productInfo.Name + "</div>\n\t\t\t\t     <div class=\"addToBasketContainer\">\n\t\t\t\t     \t<input id=\"desiredQuantity\" class=\"desiredQuantity\" type=\"number\" min=\"1\" max=\"99\" value=\"1\">\n\t\t\t\t     \t<div id=\"addToBasket\" class=\"addToBasket\"></div>\n\t\t\t\t     </div>\n\t\t\t\t     <div class=\"price\">" + productInfo.Price + "</div>\n\t\t\t\t     <div class=\"VAT\">inkl. " + productInfo.VAT + "% MwSt. zzgl. Versand</div>";
                    var desiredQuantity_1 = _this._productInfoElement.getElementsByClassName('desiredQuantity')[0];
                    var addToBasket = _this._productInfoElement.getElementsByClassName('addToBasket')[0];
                    addToBasket.addEventListener('click', function () {
                        var productID = Main.getInstance().scene.sceneLoader.dragControls.productInspector.inspectedProduct.name;
                        var quantity = desiredQuantity_1.value;
                        Main.getInstance().basket.addBasketProductByID(productID, parseInt(quantity));
                    });
                }
            }
        });
        productInfoDispatcher.addEventListener('productDetailsChanged', function (event) {
            if (Main.getInstance().scene.sceneLoader.dragControls.productInspector.inspectedProduct) {
                var productDetails = event.message.HtmlDetails;
                productDetails = productDetails.replace(/<tabgroup>/g, '');
                productDetails = productDetails.replace(/<\/tabgroup>/g, '');
                productDetails = productDetails.replace(/<tab /g, '<div ');
                productDetails = productDetails.replace(/<\/tab>/g, '</div>');
                productDetails = productDetails.replace(/<div name/g, '<div class="tab" name');
                productDetails = productDetails.replace('<div class="tab"', '<div class="tab active"'); /** This changes only the first one */
                productDetails = productDetails.replace(event.message.Id, "<div class=\"detailsFooter\">" + event.message.Id + "</div>");
                _this._productDetailsElement.innerHTML = productDetails;
                var tabs_1 = _this._productDetailsElement.getElementsByClassName('tab');
                var tabsSwitchButtons_1 = _this._tabSwitch.children;
                var _loop_2 = function (i) {
                    var tab = tabsSwitchButtons_1[i];
                    var __this = _this;
                    tab.addEventListener('click', function (event) {
                        utils.HTML.removeFromClassList(tabsSwitchButtons_1, 'active');
                        utils.HTML.removeFromClassList(tabs_1, 'active');
                        var tab = __this._productDetailsElement.querySelector("[name=\"" + this.textContent + "\"]");
                        this.classList.add('active');
                        tab.classList.add('active');
                    });
                };
                for (var i = 0; i < tabsSwitchButtons_1.length; ++i) {
                    _loop_2(i);
                }
            }
        });
    };
    Object.defineProperty(ProductDetailsUI.prototype, "container", {
        get: function () {
            return this._container;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProductDetailsUI.prototype, "isDesktopModeOn", {
        get: function () {
            return this._isDesktopModeOn;
        },
        enumerable: true,
        configurable: true
    });
    return ProductDetailsUI;
}());
var ProductInformationDownloader = /** @class */ (function () {
    function ProductInformationDownloader() {
        var _this = this;
        this.informationReceived = function (response) {
            var productResponse = JSON.parse(response);
            var productInfo;
            if (productResponse.MissingProductsList.length > 0) {
                var noInfo = 'No info in database';
                var dummyInfo = {
                    ExternalId: productResponse.MissingProductsList[0],
                    Name: noInfo,
                    ShortDescription: noInfo,
                    Description: noInfo,
                    Manufacturer: noInfo,
                    Price: 1.23,
                    VAT: -1,
                    Available: false,
                    Properties: []
                };
                var product = Main.getInstance().basket.findProductByID(dummyInfo.ExternalId);
                if (!product) {
                    //Main.getInstance().basket.addProductByID(dummyInfo.ExternalId);
                }
                else {
                    product.updateProductInformation(dummyInfo);
                }
                _this._eventDispatcher.dispatchEvent({ type: 'productInfoChanged', message: response });
            }
            else if (productResponse.ProductsInformation.length > 0) {
                for (var _i = 0, _a = productResponse.ProductsInformation; _i < _a.length; _i++) {
                    var productInfo_1 = _a[_i];
                    var product = Main.getInstance().basket.findProductByID(productInfo_1.ExternalId);
                    if (!product) {
                        //Main.getInstance().basket.addProductByID(productInfo.ExternalId);
                    }
                    else {
                        product.updateProductInformation(productInfo_1);
                    }
                    _this._eventDispatcher.dispatchEvent({ type: 'productInfoChanged', message: response });
                }
            }
            else {
                console.log("There's an error with the productinfo, please check.");
                return;
            }
        };
        this.detailsReceived = function (response) {
            var detailsResponse = JSON.parse(response);
            //const product = Main.getInstance().basket.findProductByID(detailsResponse.Id);
            //product.updateProductDetails(detailsResponse);
            _this._eventDispatcher.dispatchEvent({ type: 'productDetailsChanged', message: detailsResponse });
        };
        this._eventDispatcher = new THREE.EventDispatcher();
    }
    ProductInformationDownloader.prototype.downloadProductInfo = function (productID, callback) {
        var ids = [productID];
        utils.AJAX.load({
            url: utils.AJAX.BASE_URL + '/Product/Information',
            params: {
                ShopId: Main.SHOP_ID,
                ProductIds: ids
            },
            method: utils.AJAX.METHOD_POST,
            onComplete: callback || this.informationReceived
        });
    };
    ProductInformationDownloader.prototype.downloadProductDetails = function (productID) {
        utils.AJAX.load({
            url: utils.AJAX.BASE_URL + '/Product/Details',
            params: {
                ShopId: Main.SHOP_ID,
                ProductId: productID
            },
            method: utils.AJAX.METHOD_GET,
            onComplete: this.detailsReceived
        });
    };
    ProductInformationDownloader.prototype.addEventListener = function (type, listener) {
        this._eventDispatcher.addEventListener(type, listener);
    };
    Object.defineProperty(ProductInformationDownloader.prototype, "eventDispatcher", {
        get: function () {
            return this._eventDispatcher;
        },
        enumerable: true,
        configurable: true
    });
    return ProductInformationDownloader;
}());
///<reference path='../../model/ProductInformationDownloader.ts'/>
var PriceTagUI = /** @class */ (function () {
    function PriceTagUI(ui) {
        var _this = this;
        this.changePriceTagPosition = function (pageX, pageY) {
            var isDesktopModeOn = window.innerWidth >= 600;
            //window.getComputedStyle(this._htmlContainer);
            var offsetWidth = _this._htmlContainer.offsetWidth || 150; // TODO: Somehow we should get these values from CSS, but it doesn't seem to work when element has "display: none"
            var offsetHeight = _this._htmlContainer.offsetHeight || 100;
            if (isDesktopModeOn) {
                _this._htmlContainer.style.top = (pageY - 20) + 'px';
                if (pageX + offsetWidth + 40 > window.innerWidth) {
                    _this._htmlContainer.style.left = (pageX - offsetWidth - 40) + 'px';
                }
                else {
                    _this._htmlContainer.style.left = (pageX + 40) + 'px';
                }
            }
            else {
                if ((pageY - offsetHeight - 50) >= 0) {
                    _this._htmlContainer.style.top = (pageY - offsetHeight - 50) + 'px';
                }
                else {
                    _this._htmlContainer.style.top = (pageY + 50) + 'px';
                }
                _this._htmlContainer.style.left = (pageX - offsetWidth / 2) + 'px';
            }
            _this.show();
        };
        this._htmlContainer = document.getElementById('priceTag');
        this._manufacturerText = document.getElementById('tagManufacturer');
        this._productNameText = document.getElementById('tagProductName');
        this._priceText = document.getElementById('tagPrice');
        this._hidden = false;
    }
    PriceTagUI.prototype.initListeners = function (dragControls, model) {
        var _this = this;
        this._dragControls = dragControls;
        dragControls.addEventListener('dragStart', function (dragEvent) {
            _this._hidden = false;
            model.getProductInfoById(dragEvent.object.name, function (response) {
                if (!_this._hidden) /** If the user is still dragging the product */ {
                    var productInfo = JSON.parse(response);
                    _this.updateContent(productInfo.ProductsInformation[0]);
                    _this.changePriceTagPosition(dragEvent.mouse.pageX, dragEvent.mouse.pageY);
                }
            });
        });
        dragControls.addEventListener('dragEnd', function () {
            _this._hidden = true;
            _this.hide();
        });
        dragControls.addEventListener('drag', function (dragEvent) {
            _this.changePriceTagPosition(dragEvent.mouse.pageX, dragEvent.mouse.pageY);
        });
    };
    PriceTagUI.prototype.updateContent = function (product) {
        this._manufacturerText.textContent = product.Manufacturer;
        this._productNameText.textContent = product.Name;
        this._priceText.textContent = product.Price.toFixed(2);
        this._priceText.classList.add('price');
    };
    PriceTagUI.prototype.show = function () {
        utils.HTML.showElement(this._htmlContainer, true);
    };
    PriceTagUI.prototype.hide = function () {
        utils.HTML.hideElement(this._htmlContainer);
    };
    return PriceTagUI;
}());
///<reference path='./HeaderUI.ts'/>
///<reference path='./BasketUI.ts'/>
///<reference path='./ProductDetailsUI.ts'/>
///<reference path='./PriceTagUI.ts'/>
var UI = /** @class */ (function () {
    function UI(scene) {
        var _this = this;
        this.resize = function () {
            _this._basketUI.resize();
            _this._productDetailsUI.resize();
        };
        this.update = function () {
            _this._basketUI.updateTransformations();
        };
        this._headerUI = new HeaderUI(scene);
        this._basketUI = new BasketUI(scene);
        this._productDetailsUI = new ProductDetailsUI(this);
        this._priceTagUI = new PriceTagUI(this);
    }
    Object.defineProperty(UI.prototype, "basketUI", {
        get: function () {
            return this._basketUI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UI.prototype, "headerUI", {
        get: function () {
            return this._headerUI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UI.prototype, "productDetailsUI", {
        get: function () {
            return this._productDetailsUI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UI.prototype, "priceTagUI", {
        get: function () {
            return this._priceTagUI;
        },
        enumerable: true,
        configurable: true
    });
    return UI;
}());
var utils;
(function (utils) {
    var FPSMeter = /** @class */ (function () {
        function FPSMeter() {
            this._frameCount = 0;
            this._frameCountFromBeginning = 0;
            this._elapsedTime = 0;
            this._lastUpdate = 0;
            this._interval = 10000;
        }
        FPSMeter.prototype.update = function () {
            this._elapsedTime = performance.now();
            if (this._elapsedTime - this._lastUpdate >= this._interval) {
                var avgFPSInInterval = Math.round(this._frameCount / (this._interval / 1000));
                console.log('FPS: ' + avgFPSInInterval);
                ga('send', 'event', {
                    eventCategory: 'System',
                    eventAction: 'FPS',
                    eventValue: avgFPSInInterval
                });
                this._lastUpdate = this._elapsedTime;
                this._frameCountFromBeginning += this._frameCount;
                this._averageFPS = this._interval * (this._frameCountFromBeginning / this._elapsedTime);
                this._frameCount = 0;
            }
            else {
                ++this._frameCount;
            }
        };
        return FPSMeter;
    }());
    utils.FPSMeter = FPSMeter;
})(utils || (utils = {}));
///<reference path='./SceneLoader.ts'/>
///<reference path='./CircleControls.ts'/>
///<reference path='./FreeMovementControls.ts'/>
///<reference path='./UI/UI.ts'/>
///<reference path='../utils/FPSMeter.ts'/>
var Scene = /** @class */ (function () {
    function Scene() {
        var _this = this;
        this.onWindowResize = function () {
            _this._canvas.width = 0;
            _this._canvas.height = 0;
            var width = window.innerWidth;
            var height = window.innerHeight;
            _this._renderer.setSize(width, height);
            _this._camera.aspect = width / height;
            _this._camera.updateProjectionMatrix();
            _this._UI.resize();
            if (_this._sceneLoader.dragControls) {
                _this._sceneLoader.dragControls.productInspector.resize();
            }
            _this._eventDispatcher.dispatchEvent({ type: 'windowResized' });
        };
        this.onContextLost = function (event) {
            event.preventDefault();
            alert('Unfortunately WebGL has crashed. Please reload the page to continue!');
        };
        this.animate = function (time) {
            _this.update(time);
            _this._renderer.render(_this._scene, _this._camera);
            requestAnimationFrame(_this.animate);
        };
        this._eventDispatcher = new THREE.EventDispatcher();
        this.init();
        this.animate(0);
    }
    Scene.prototype.init = function () {
        this._canvas = document.getElementById('myCanvas');
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.05, 70);
        this._camera.position.set(0, 0, 0); /** It gets overwritten in circlecontrols immediately */
        this._UI = new UI(this);
        this._fpsMeter = new utils.FPSMeter();
        this.initRenderer();
        this.initControls();
        this.initMeshes();
        this.initLights();
        this.onWindowResize();
        ThumbnailFromModel.initRenderer();
    };
    Scene.prototype.initLights = function () {
        // const light1  = new THREE.AmbientLight(0xFFFFFF, 0.6);
        //
        // const light2  = new THREE.DirectionalLight(0xFFFFFF, 0.3);
        // light2.position.set(0.5, 0, 0.866); // ~60º
        //
        // const light3 = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.3);
        var light1 = new THREE.AmbientLight(0xFFFFFF, 0.1);
        var light2 = new THREE.DirectionalLight(0xFFFFFF, 0.1);
        light2.position.set(0.5, 0, 0.866); // ~60º
        var light3 = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.1);
        this._lights = new THREE.Object3D();
        this._lights.add(light1, light2, light3);
        this._scene.add(this._lights);
    };
    Scene.prototype.initControls = function () {
        var _this = this;
        this._circleControls = new CircleControls(this);
        this._freeMovementControls = new FreeMovementControls(this);
        this._cameraControls = this._circleControls;
        this._freeMovementControls.deactivate();
        this._eventDispatcher.addEventListener('switchToFreeMovementControls', function () {
            _this._cameraControls = _this._freeMovementControls;
            _this._cameraControls.activate();
            _this._circleControls.deactivate();
        });
        this._eventDispatcher.addEventListener('switchToCircleMovementControls', function () {
            _this._cameraControls = _this._circleControls;
            _this._cameraControls.activate(true);
            _this._freeMovementControls.deactivate();
        });
    };
    Scene.prototype.initRenderer = function () {
        this._renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true,
            canvas: this._canvas
        });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setClearColor(0xECF8FF, 0);
        this._renderer.gammaOutput = true;
        this._renderer.context.canvas.addEventListener('webglcontextlost', this.onContextLost);
        window.addEventListener('resize', this.onWindowResize, false);
    };
    Scene.prototype.initMeshes = function () {
        var _this = this;
        this._eventDispatcher.addEventListener('dragControlsCreated', function () {
            _this._cameraControls.setDragControls(_this._sceneLoader.dragControls);
            _this._UI.headerUI.setDragControls(_this._sceneLoader.dragControls);
            _this._UI.headerUI.setCameraControls(_this._cameraControls);
            _this._UI.productDetailsUI.initListeners(_this._sceneLoader.dragControls);
            _this._UI.priceTagUI.initListeners(_this._sceneLoader.dragControls, Main.getInstance().basket);
            _this._productInspector = _this._sceneLoader.dragControls.productInspector;
            _this._sceneLoader.dragControls.addEventListener('dragStart', function () {
                _this._cameraControls.deactivate();
            });
            _this._sceneLoader.dragControls.addEventListener('dragEnd', function () {
                if (!_this._sceneLoader.dragControls.productInspector.isActive()) {
                    _this._cameraControls.activate();
                }
            });
            _this._sceneLoader.dragControls.addEventListener('inspectStart', function () {
                _this._cameraControls.deactivate();
            });
            _this._sceneLoader.dragControls.addEventListener('inspectEnd', function () {
                _this._cameraControls.activate();
            });
        });
        this._sceneLoader = new SceneLoader(this);
        this._scene.add(this._sceneLoader.sceneContainer);
    };
    Object.defineProperty(Scene.prototype, "camera", {
        get: function () {
            return this._camera;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "lights", {
        get: function () {
            return this._lights;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "sceneLoader", {
        get: function () {
            return this._sceneLoader;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "cameraControls", {
        get: function () {
            return this._cameraControls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "canvas", {
        get: function () {
            return this._canvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "UI", {
        get: function () {
            return this._UI;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "eventDispatcher", {
        get: function () {
            return this._eventDispatcher;
        },
        enumerable: true,
        configurable: true
    });
    Scene.prototype.update = function (time) {
        TWEEN.update(time);
        this._cameraControls.update(time);
        this._UI.update();
        this._sceneLoader.update();
        if (this._productInspector) {
            this._productInspector.update();
        }
        this._fpsMeter.update();
    };
    return Scene;
}());
var Product = /** @class */ (function () {
    function Product(id, mesh) {
        this._ID = id;
        this._mesh = mesh;
        this._image = new ThumbnailFromModel(this._mesh).getImage();
    }
    Object.defineProperty(Product.prototype, "imgData", {
        get: function () {
            return this._image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "info", {
        get: function () {
            return this._info;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Product.prototype, "ID", {
        get: function () {
            return this._ID;
        },
        enumerable: true,
        configurable: true
    });
    Product.prototype.updateProductInformation = function (info) {
        this._info = info;
    };
    Product.prototype.updateProductDetails = function (details) {
        this._details = details;
    };
    return Product;
}());
///<reference path='./Product.ts'/>
var BasketProduct = /** @class */ (function () {
    function BasketProduct(product, quantity) {
        if (quantity === void 0) { quantity = 1; }
        this._product = product;
        this._quantity = quantity;
    }
    BasketProduct.prototype.add = function (quantity) {
        if (quantity === void 0) { quantity = 1; }
        return this._quantity += quantity;
    };
    BasketProduct.prototype.remove = function (quantity) {
        if (quantity === void 0) { quantity = 1; }
        return this._quantity -= quantity;
    };
    Object.defineProperty(BasketProduct.prototype, "quantity", {
        get: function () {
            return this._quantity;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasketProduct.prototype, "productType", {
        get: function () {
            return this._product;
        },
        enumerable: true,
        configurable: true
    });
    return BasketProduct;
}());
var BasketModel = /** @class */ (function () {
    function BasketModel() {
        this.ShopId = Main.SHOP_ID;
        this.BasketId = Guid.newGuid();
        this.Contents = [];
        this.UnavailableContents = [];
    }
    BasketModel.prototype.equals = function (other) {
        return this.Contents == other.Contents && this.UnavailableContents == other.UnavailableContents;
    };
    return BasketModel;
}());
var BasketContentModel = /** @class */ (function () {
    function BasketContentModel(productID, productAmount) {
        this.productId = productID;
        this.productAmount = productAmount;
    }
    BasketContentModel.prototype.equals = function (other) {
        return this.productId == other.productId && this.productAmount == other.productAmount;
    };
    return BasketContentModel;
}());
var Guid = /** @class */ (function () {
    function Guid() {
    }
    Guid.newGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return Guid;
}());
///<reference path='./BasketProduct.ts'/>
///<reference path='./ProductInformationDownloader.ts'/>
///<reference path='./BasketModel.ts'/>
var Basket = /** @class */ (function () {
    function Basket() {
        var _this = this;
        this._sceneProducts = [];
        this._basketProducts = [];
        this._productInfoDownloader = new ProductInformationDownloader();
        requestAnimationFrame(function () {
            _this.updateView();
        });
        this._productInfoDownloader.addEventListener('productInfoChanged', function (event) {
            var productID = event.message;
            _this.updateView();
        });
    }
    Basket.prototype.addProductByID = function (id) {
        var product = this.findProductByID(id);
        if (!product) {
            var productMesh = Main.getInstance().scene.sceneLoader.sceneContainer.getObjectByName(id) || Main.getInstance().scene.scene.getObjectByName(id);
            product = new Product(id, productMesh);
            this._sceneProducts.push(product);
        }
        return product;
    };
    Basket.prototype.addBasketProductByID = function (id, quantity) {
        if (quantity === void 0) { quantity = 1; }
        var product = this.findBasketProductByID(id);
        if (product) {
            product.add(quantity);
            this.updateView();
        }
        else {
            var newProduct = this.addProductByID(id);
            if (newProduct) {
                product = new BasketProduct(newProduct, quantity);
                this._basketProducts.push(product);
                this.getProductInfoById(id);
            }
            /** If downloadProductInfo returns with the info, it dispatches 'productInfoChanged' event, and when that happens, updateView() is also called.
             *  So we shouldn't call updateView() here, because it would be invoked twice that way. */
        }
        this.updateBasketModel(id, product.quantity);
    };
    Basket.prototype.updateBasketModel = function (productID, quantity) {
        var contentProduct = this._basket.Contents.find(function (x) { return x.productId == productID; });
        if (contentProduct == undefined) {
            // new product
            contentProduct = new BasketContentModel(productID, quantity);
            this._basket.Contents.push(contentProduct);
        }
        else {
            if (quantity == 0) {
                // product needs to be removed from basket model
                var productIndex = this._basket.Contents.indexOf(contentProduct);
                this._basket.Contents.splice(productIndex, 1);
            }
            else {
                // update the quantity
                contentProduct.productAmount = quantity;
            }
        }
        this.saveBasket();
    };
    Basket.prototype.getProductInfoById = function (id, callback) {
        this._productInfoDownloader.downloadProductInfo(id, callback);
    };
    Basket.prototype.getProductDetailsById = function (id) {
        this._productInfoDownloader.downloadProductDetails(id);
    };
    Basket.prototype.findProductByID = function (id) {
        for (var _i = 0, _a = this._sceneProducts; _i < _a.length; _i++) {
            var product = _a[_i];
            if (product.ID === id) {
                return product;
            }
        }
        return null;
    };
    Basket.prototype.findBasketProductByID = function (id) {
        for (var _i = 0, _a = this._basketProducts; _i < _a.length; _i++) {
            var product = _a[_i];
            if (product.productType.ID === id) {
                return product;
            }
        }
        return null;
    };
    Basket.prototype.loadBasket = function () {
        var serializedBasket = localStorage.getItem('basket');
        if (!serializedBasket) {
            this._basket = new BasketModel();
        }
        else {
            this._basket = JSON.parse(serializedBasket);
            this._basketProducts = [];
            for (var _i = 0, _a = this._basket.Contents; _i < _a.length; _i++) {
                var basketContent = _a[_i];
                var productMesh = Main.getInstance().scene.sceneLoader.sceneContainer.getObjectByName(basketContent.productId);
                if (productMesh) {
                    this.addBasketProductByID(basketContent.productId, basketContent.productAmount);
                }
                else {
                    // the mesh for the product is not available, remove it from the basket
                    this.updateBasketModel(basketContent.productId, 0);
                }
            }
        }
    };
    Basket.prototype.saveBasket = function () {
        var serializedBasket = JSON.stringify(this._basket);
        localStorage.setItem("basket", serializedBasket);
    };
    Basket.prototype.performCheckout = function () {
        /*let checkoutUrl = 'https://www.alnatura-shop.de/g/pages/addMultipleProducts.jsf?ref=ringway_';

        checkoutUrl += this._basket.BasketId;
        checkoutUrl += '&productList=';

        let productPairs = [];
        for (let basketContentProduct of this._basket.Contents)
        {
            productPairs.push(basketContentProduct.productId + '-' + basketContentProduct.productAmount);
        }
        let pairString = productPairs.join('|');
        checkoutUrl += pairString;
        checkoutUrl = encodeURI(checkoutUrl);

        ga('send',
            {
                hitType: 'event',
                eventCategory: 'Basket',
                eventAction: 'Checkout',
                eventLabel: 'Checkout',
                eventValue: this._basket.TotalValue
            }
        );*/
        window.location.href = '../checkout/index.html';
    };
    Basket.prototype.addOne = function (product, priceAndQuantity) {
        product.add();
        this.updatePriceAndQuantity(priceAndQuantity, product);
        this.updateTotals();
        this.updateBasketModel(product.productType.ID, product.quantity);
    };
    Basket.prototype.removeOne = function (product, priceAndQuantity) {
        product.remove();
        if (product.quantity > 0) {
            this.updatePriceAndQuantity(priceAndQuantity, product);
            this.updateTotals();
        }
        else {
            var index = this._basketProducts.indexOf(product);
            if (index > -1) {
                this._basketProducts.splice(index, 1);
                this.updateView();
            }
        }
        this.updateBasketModel(product.productType.ID, product.quantity);
    };
    Basket.prototype.updateTotals = function () {
        var sum = 0;
        var articles = 0;
        for (var _i = 0, _a = this._basketProducts; _i < _a.length; _i++) {
            var product = _a[_i];
            if (product.productType.info == null) {
                continue;
            }
            else {
                sum += product.quantity * product.productType.info.Price;
                articles += product.quantity;
            }
        }
        var totalPrice = Main.getInstance().scene.UI.basketUI.totalPriceElement;
        totalPrice.textContent = sum.toFixed(2);
        var noOfArticles = Main.getInstance().scene.UI.basketUI.NoOfArticlesElement;
        noOfArticles.textContent = articles.toString();
    };
    Basket.prototype.updatePriceAndQuantity = function (element, product) {
        if (product.productType.info == null) {
            return;
        }
        else {
            element.textContent = product.quantity + ' x ' + product.productType.info.Price.toFixed(2);
        }
    };
    Object.defineProperty(Basket.prototype, "productInfoDownloader", {
        get: function () {
            return this._productInfoDownloader;
        },
        enumerable: true,
        configurable: true
    });
    Basket.prototype.updateView = function () {
        var _this = this;
        var productContainer = Main.getInstance().scene.UI.basketUI.productContainer;
        utils.HTML.clearElement(productContainer);
        var _loop_3 = function (product) {
            var productBox = document.createElement('div');
            productBox.classList.add('productBox');
            var productImage = document.createElement('div');
            productImage.classList.add('productInBasket');
            var imgData = product.productType.imgData;
            productImage.style.backgroundImage = 'url(' + imgData + ')';
            var priceAndQuantity = document.createElement('div');
            priceAndQuantity.classList.add('price');
            priceAndQuantity.classList.add('quantity');
            priceAndQuantity.classList.add('disabledPointerActions');
            this_1.updatePriceAndQuantity(priceAndQuantity, product);
            var increaseQuantity = document.createElement('div');
            increaseQuantity.classList.add('quantityModifier');
            increaseQuantity.classList.add('increaseQuantity');
            utils.HTML.hideElement(increaseQuantity);
            var decreaseQuantity = document.createElement('div');
            decreaseQuantity.classList.add('quantityModifier');
            decreaseQuantity.classList.add('decreaseQuantity');
            utils.HTML.hideElement(decreaseQuantity);
            productBox.addEventListener('mouseenter', function (event) {
                event.preventDefault();
                utils.HTML.showElement(increaseQuantity);
                utils.HTML.showElement(decreaseQuantity);
            });
            productBox.addEventListener('mouseleave', function (event) {
                event.preventDefault();
                utils.HTML.hideElement(increaseQuantity);
                utils.HTML.hideElement(decreaseQuantity);
            });
            increaseQuantity.addEventListener('click', function () {
                _this.addOne(product, priceAndQuantity);
            });
            decreaseQuantity.addEventListener('click', function () {
                _this.removeOne(product, priceAndQuantity);
            });
            productBox.appendChild(productImage);
            productBox.appendChild(priceAndQuantity);
            productBox.appendChild(increaseQuantity);
            productBox.appendChild(decreaseQuantity);
            productContainer.appendChild(productBox);
        };
        var this_1 = this;
        for (var _i = 0, _a = this._basketProducts; _i < _a.length; _i++) {
            var product = _a[_i];
            _loop_3(product);
        }
        this.updateTotals();
    };
    return Basket;
}());
/** This is a (kindof) Singleton class. The purpose of this is to handle AJAX requests */
var utils;
(function (utils) {
    var AJAX = /** @class */ (function () {
        function AJAX() {
        }
        AJAX.encodeParams = function (params) {
            var str = [];
            for (var key in params) {
                str.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
            }
            return str.join("&");
        };
        AJAX.BASE_URL = "https://ringway3d.de/api";
        AJAX.METHOD_GET = "GET";
        AJAX.METHOD_POST = "POST";
        AJAX.load = function (config) {
            /** Adding default values to the optionals, if there was none given */
            if (config.async == null) {
                config.async = true;
            }
            if (config.onFail == null) {
                config.onFail = AJAX.defaultOnFail;
            }
            if (config.method == null) {
                config.method = AJAX.METHOD_POST;
            }
            var url = config.url;
            if (config.params && config.method === AJAX.METHOD_GET) {
                url += "?" + AJAX.encodeParams(config.params);
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    config.onComplete(xhr.responseText);
                }
                else if (xhr.readyState === 4 && xhr.status !== 200) {
                    config.onFail(xhr.status, xhr.statusText);
                }
            };
            xhr.onerror = xhr.ontimeout = xhr.onabort = function () {
                config.onFail(xhr.status, xhr.statusText);
            };
            xhr.open(config.method, url, config.async);
            if (config.method === AJAX.METHOD_POST) {
                var encoded_params = AJAX.encodeJSONParams(config.params);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(encoded_params);
            }
            else {
                xhr.send();
            }
        };
        AJAX.defaultOnFail = function (status, statusText) {
            console.warn('AJAX call failed!');
            console.warn('Status: ' + status + ' (' + statusText + ')');
        };
        AJAX.encodeJSONParams = function (params) {
            var str = JSON.stringify(params);
            return str;
        };
        return AJAX;
    }());
    utils.AJAX = AJAX;
})(utils || (utils = {}));
///<reference path='./view/Scene.ts'/>
///<reference path='./model/Basket.ts'/>
///<reference path='./utils/AJAX.ts'/>
var Main = /** @class */ (function () {
    function Main() {
        Main.instance = this;
        this._basket = new Basket();
        this._scene = new Scene();
    }
    Main.getInstance = function () {
        return Main.instance || new Main();
    };
    Object.defineProperty(Main.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "basket", {
        get: function () {
            return this._basket;
        },
        enumerable: true,
        configurable: true
    });
    Main.SHOP_ID = 1;
    return Main;
}());
//# sourceMappingURL=app.js.map