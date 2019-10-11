/** This is a (kindof) Singleton class. The purpose of this is to handle some frequently used HTML/CSS manipulations */
declare module utils {
    class HTML {
        static addToClassList(elements: HTMLCollectionOf<Element>, className: string): void;
        static removeFromClassList(elements: HTMLCollectionOf<Element> | NodeListOf<Element>, className: string): void;
        static addListenerToHTMLElements(elements: HTMLCollectionOf<Element>, type: string, listener: () => any): void;
        static removeListenerFromHTMLElements(elements: HTMLCollectionOf<Element>, type: string, listener: () => any): void;
        static addStyleToHTMLElements(elements: HTMLCollectionOf<Element>, key: string, value: string): void;
        static clearElement(element: HTMLElement): void;
        static hideElement(element: HTMLElement): void;
        static showElement(element: HTMLElement, isHiddenByDefault?: boolean): void;
        static isElementChildOfElement(element: Element, parent: Element): boolean;
        static disableElement(element: Element): void;
        static enableElement(element: Element): void;
    }
}
declare class ProductObject {
    private _container;
    private _productParent;
    private _originalPosition;
    private _originalScale;
    private _originalRotation;
    private _originalOpacities;
    private _childrenOfOriginalScene;
    private _isBeingInspected;
    constructor(product: THREE.Object3D);
    private isSingleMesh;
    readonly position: THREE.Vector3;
    readonly scale: THREE.Vector3;
    readonly rotation: THREE.Euler;
    readonly originalPosition: THREE.Vector3;
    readonly originalScale: THREE.Vector3;
    readonly originalRotation: THREE.Euler;
    readonly name: string;
    readonly container: THREE.Group;
    private saveOriginalValues;
    private resize;
    private getBackgroundAsCanvas;
    private blurBackground;
    onInspectStart(): void;
    onInspectEnd(): void;
    equals(object: ProductObject): boolean;
    resetPosition(didBasketChange?: boolean, isInspectorActive?: boolean): void;
    private changeTexture;
    translateProductToPosition(desiredPosition: THREE.Vector3, isPivotAlreadyCentered?: boolean): void;
    private changeMaterialOpacity;
    private changeGroupOpacity;
}
declare class ProductInspector {
    private _dragControls;
    private _inspectedProduct;
    private _horizontalRotation;
    private _verticalRotation;
    private _canvas;
    private _isPointerDown;
    private _pointer;
    private _shouldPointerMoveEventBeTriggered;
    private _cameraRight;
    private _verticalDelta;
    private _horizontalDelta;
    private _axes;
    private _zoom;
    private _posZ;
    private _pointerMovedAfterPress;
    private _pinchDistance;
    private _isDesktopModeOn;
    private _productDistanceFromCamera;
    private _isBeingDragged;
    constructor(dragControls: DragControls);
    add(product: ProductObject): void;
    private disableHeader;
    private enableHeader;
    private updateDetails;
    activate(): void;
    deactivate(): void;
    endProductInspect: () => void;
    private handlePointerMove;
    private handleTouchMove;
    private pointerMove;
    private handlePointerDown;
    private handleTouchStart;
    private pointerDown;
    private handlePointerUp;
    private handleTouchEnd;
    private pointerUp;
    private handlePointerLeave;
    private pointerLeave;
    private handleWheel;
    private wheel;
    private handleTouchPinch;
    private isPointerOverUI;
    private getViewHeight;
    private getInspectPosition;
    readonly inspectedProduct: ProductObject;
    isActive(): boolean;
    resize: () => void;
    update(): void;
}
/**
 * This is a TypeScript class based on THREE.DragControls. Note that some of the functions are modified.
 *
 * original authors:
 * @author zz85 / https://github.com/zz85
 * @author mrdoob / http://mrdoob.com
 * Running this will allow you to drag three.js objects around the screen.
 */
declare class DragControls extends THREE.EventDispatcher {
    private _draggableObjects;
    private _originalDraggableObjects; /** When a product is inspected, the inspected product gets assignes to _draggableObjects. When the user exits the inspectmode, we should be able to revert to the original draggable objects. */
    private _camera;
    private _canvas;
    private _plane;
    private _raycaster;
    private _mouse;
    private _offset;
    private _intersection;
    private _selected;
    private _hovered;
    private _enabled;
    private _timeoutID;
    private _pointer;
    private _isUserZooming;
    private _productInspector;
    constructor(objects: THREE.Object3D[], camera: THREE.PerspectiveCamera, domElement: HTMLCanvasElement);
    activate(delay?: number): void;
    deactivate(): void;
    private enlargeShoppingCart;
    private reductShoppingCart;
    private getDragPosition;
    private setPlane;
    private pointerStart;
    private closestToScreenOrder;
    private pointerMove;
    private pointerCancel;
    private handleMouseDown;
    private startPointerStartTimeout;
    private handleMouseMove;
    private handleMouseRelease;
    private onProductClick;
    private inspectProduct;
    private pointerRelease;
    private handleTouchStart;
    private handleTouchMove;
    private handleTouchEnd;
    isBeingDragged(): boolean;
    isBeingHovered(): boolean;
    readonly productInspector: ProductInspector;
    readonly camera: THREE.PerspectiveCamera;
}
declare class ClickableObject {
    private _object;
    private _canvas;
    private _raycaster;
    private _mouse;
    private _camera;
    private _pointer;
    private _mouseMoved;
    private _currentlyHovered;
    private _eventDispatcher;
    constructor(object: THREE.Object3D);
    activate: () => void;
    deactivate: () => void;
    private handleMouseMove;
    private handleTouchMove;
    private pointerMove;
    private handleMouseDown;
    private handleTouchStart;
    private pointerDown;
    private handleMouseRelease;
    private pointerUp;
    readonly eventDispatcher: THREE.EventDispatcher;
}
/** This class is for adding video as texture to an object */
declare const enableInlineVideo: any; /** This one is for a workaround for iOS to prevent video from going into fullscreen */
declare class VideoObject {
    private _object;
    private _videoElement;
    private _clickableObject;
    private _position;
    constructor(object: THREE.Mesh, videoPath: string, autoplay?: boolean, loop?: boolean);
    private init;
    private togglePlay;
    play: () => void;
    pause: () => void;
    activate: () => void;
    deactivate: () => void;
    /** Decrease sound with camera-distance from sound-source */
    update: () => void;
}
interface SceneData {
    baseURL: string;
    name: string;
    type: string;
    container: THREE.Object3D;
    skyBox?: THREE.Mesh;
    envMap?: THREE.Texture;
    lightMaps?: {
        map: THREE.Texture;
        meshName: string;
    }[];
    videoObject?: VideoObject;
}
declare class SceneLoader {
    private _sceneContainer;
    private _dragControls;
    private _camera;
    private _renderer;
    private _sceneDataObjects;
    private _loadedScenesCount;
    private _currentSceneIndex;
    private _scene;
    private _products;
    private _generalLightMap;
    private _percentage;
    private _isLoadFinished;
    constructor(scene: Scene);
    private initEnvMap;
    private initLightMap;
    private initSkyBox;
    private initScenes;
    private loadScene;
    private activateSwitchSceneButton;
    private displayScene;
    private onProgress;
    private onLoad;
    private addVideoObject;
    private loadingTextForPercentage;
    readonly sceneContainer: THREE.Object3D;
    readonly dragControls: DragControls;
    update: () => void;
}
declare class BasketUI {
    private _scene;
    private _camera;
    private _glRenderer;
    private _glScene;
    private _seeThroughMaterial;
    private _glElements;
    private _plane;
    private _circle;
    private _basketHeight;
    private _basketBottom;
    private _basketElement;
    private _productContainer;
    private _shoppingCartElement;
    private _numberOfArticlesElement;
    private _totalPriceElement;
    private _checkoutButton;
    private _shoppingCartSize;
    private _shoppingCartRadius;
    private _shoppingCartCenterOffset; /** The offset from the bottom of the page */
    private _isShoppingCartLarge;
    private _cameraDownAmount;
    private _isBasketSwipedDown;
    private _eventDispatcher;
    private _dist;
    constructor(scene: Scene);
    private init;
    private create3dElement;
    renderElementsOnTop(): void;
    renderElementsNormally(): void;
    private createCircle;
    private createPlane;
    private preventCameraMovement;
    private getHTMLElements;
    private getViewHeight;
    enlargeShoppingCartSize: () => void;
    reductShoppingCartSize: () => void;
    private initListeners;
    hitTestBasket(pageX: number, pageY: number): boolean;
    toggleBasket: () => void;
    performBasketCheckout: () => void;
    swipeUpBasket: () => void;
    swipeDownBasket: () => void;
    readonly isBasketSwipedDown: boolean;
    readonly basketElement: HTMLDivElement;
    readonly basketHeight: number;
    readonly shoppingCartCircle: {
        radius: number;
        offsetFromBottom: number;
    };
    readonly productContainer: HTMLDivElement;
    readonly NoOfArticlesElement: HTMLDivElement;
    readonly totalPriceElement: HTMLDivElement;
    readonly eventDispatcher: THREE.EventDispatcher;
    readonly container: THREE.Object3D;
    resize: () => void;
    updateTransformations: () => void;
}
/** This class is mainly for animating anything seamlessly and smoothly.
 *  If you modify the "end", end you keep calling "update", then start will get closer and closer to the value of "end"
 *  The higher the dampingFactor is, the faster the "animation" is. It should be between 0 and 1.*/
declare class Convergence {
    protected _originalStart: number;
    protected _originalEnd: number;
    protected _start: number;
    protected _end: number;
    protected _dampingFactor: number;
    constructor(start: number, end: number, dampingFactor?: number);
    increaseEndBy(value: number): void;
    decreaseEndBy(value: number): void;
    readonly start: number;
    readonly end: number;
    setEnd(value: number): void;
    reset(start?: number, end?: number): void;
    update: () => void;
}
declare class BoundedConvergence extends Convergence {
    private _min;
    private _max;
    constructor(start: number, end: number, min: number, max: number, dampingFactor?: number);
    readonly min: number;
    readonly max: number;
    increaseEndBy(value: number): void;
    decreaseEndBy(value: number): void;
    setEnd(value: number): void;
    reset(start?: number, end?: number, min?: number, max?: number, dampingFactor?: number): void;
}
/** This module is for the camera movement control
 * You can move with left and right arrow in a circle shape
 * */
interface KeyPressState {
    left: boolean;
    up: boolean;
    right: boolean;
    down: boolean;
}
interface Circle {
    radius: number;
    center: THREE.Vector3;
}
interface Zoom {
    convergence: BoundedConvergence;
    currentValue: number; /** -1 for zooming out, 1 for zooming in. Changed in wheel event function, then immediately changed back to 0 */
    stepsPerOneUnit: number;
}
interface AngleAnalytics {
    lastLogTime: number;
    lastLogAngle: number;
    lastLogPosition: THREE.Vector3;
    updateFrequency: number; /** in milliseconds */
    noOfSegments: number; /** the number of segments the room is divided in */
}
declare class CircleControls {
    private _camera;
    private _canvas;
    private _cameraLookingAt;
    private _cameraLookingDir;
    private _isKeyPressed;
    private _circle;
    private _angle;
    private _cameraHeight;
    private _verticalCameraAngle; /** the camera looks at another cirlce (with 2*originalRadius), and this is the position.y of that */
    private _horizontalCameraAngle; /** compared to the main circle's normal */
    private _pointer;
    private _isPointerDown;
    private _shouldPointerMoveEventBeTriggered;
    private _zoom;
    private _pinchDistance;
    private _dragControls;
    private _analytics;
    private _isActive;
    constructor(scene: Scene);
    private keyDown;
    private keyUp;
    private pointerDown;
    private handleMouseMove;
    private pointerMove;
    private pointerUp;
    private wheelRotated;
    private handleTouchMove;
    private touchPinch;
    private initCameraPosition;
    private updateCameraDirection;
    private updateCameraPosition;
    private updateHorizontalLook;
    private increaseCameraX;
    private decreaseCameraX;
    private updateVerticalLook;
    private increaseCameraY;
    private decreaseCameraY;
    private updateCamera;
    private updateZoom;
    setCameraPosition(values: {
        angle: number;
        cameraHeight: number;
        horizontalLook: number;
        verticalLook: number;
    }): void;
    isCameraMoving(): boolean;
    setDragControls(dragControls: DragControls): void;
    private isProductBeingDragged;
    activate(switchSmoothly?: boolean): void;
    private initListeners;
    deactivate(): void;
    readonly angle: number;
    readonly type: string;
    private updateAnalytics;
    update(time: number): void;
}
interface Plane {
    q: THREE.Vector3;
    n: THREE.Vector3;
}
interface Disc {
    o: THREE.Vector3;
    n: THREE.Vector3;
    r: number;
}
declare class FreeMovementControls {
    private _camera;
    private _canvas;
    private _isPointerDown;
    private _mouseMoved;
    private _pointer; /** we need the prevValid values to update the circleindicator when the camera is still moving, but the mouse is not */
    private _u;
    private _v;
    private _forward;
    private _mouse;
    private _dragControls;
    private _raycaster;
    private _disc;
    private _intersectionPoint;
    private _isCameraPositionMoving;
    private _circleIndicator;
    private _analytics;
    private readonly EYE_HEIGHT;
    private readonly EPSILON;
    private readonly INDICATOR_HEIGHT;
    constructor(scene: Scene);
    private intersectPlane;
    private intersectDisc;
    private pointerDown;
    private handleMouseMove;
    private handleTouchMove;
    private pointerUp;
    private popIndicatingCircle;
    private pointerMove;
    private updateIntersectionPoint;
    private updateCircleOnGround;
    private getSphereSurfacePointFromUV;
    /** See this for explanation: https://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere */
    private setUVFromSphereSufracePoint;
    isCameraMoving(): boolean;
    activate(): void;
    deactivate(): void;
    setDragControls(dragControls: DragControls): void;
    readonly type: string;
    private updateAnalytics;
    update: (time: number) => void;
}
declare class ThumbnailFromModel {
    private _camera;
    private _canvas;
    private _object;
    private _scene;
    private _width;
    private _height;
    private static _renderer;
    constructor(object: THREE.Object3D, width?: number, height?: number);
    private setProductPivot;
    static initRenderer(): void;
    private initLights;
    private initRenderer;
    private dispose;
    private render;
    getImage(): string;
}
declare class HeaderUI {
    private _header;
    private _searchInput;
    private _cameraControls;
    private _dragControls;
    private _switchControls;
    private _fullScreen;
    private _eventDispatcher;
    private _canvas;
    private readonly CIRCLE;
    private readonly FREE;
    constructor(scene: Scene);
    private initListeners;
    private changeFullScreenButton;
    setDragControls(dragControls: DragControls): void;
    setCameraControls(cameraControls: CircleControls | FreeMovementControls): void;
    private search;
    private searchComplete;
    private loadProduct;
    private preventCameraMovement;
}
declare module utils {
    class Geometry {
        static distanceBetween2Vec2(vec1: {
            x: number;
            y: number;
        }, vec2: {
            x: number;
            y: number;
        }): number;
    }
}
declare class ProductDetailsUI {
    private _isOpen;
    private _toggleButton;
    private _container;
    private _toggleBG;
    private _basketUIEventDispatcher;
    private _ui;
    private _isDesktopModeOn;
    private _productDetailsElement;
    private _productInfoElement;
    private _productContent;
    private _tabSwitch;
    constructor(ui: UI);
    swipeUpDetails: () => void;
    swipeDownDetails: () => void;
    initListeners(dragControls: DragControls): void;
    resize: () => void;
    readonly container: HTMLDivElement;
    readonly isDesktopModeOn: boolean;
}
interface ProductInformationResponseModel {
    ProductsInformation: ProductInformation[];
    MissingProductsList: string[];
}
interface ProductInformationPropertyPairModel {
    Key: string;
    Value: string;
    Type: string;
}
interface ProductInformation {
    ExternalId: string;
    Name: string;
    ShortDescription: string;
    Description: string;
    Manufacturer: string;
    Price: number;
    VAT: number;
    Available: boolean;
    Properties: ProductInformationPropertyPairModel[];
}
interface ProductDetails {
    Id: string;
    HtmlDetails: string;
}
declare class ProductInformationDownloader {
    private _eventDispatcher;
    constructor();
    downloadProductInfo(productID: string, callback?: (response: string) => any): void;
    downloadProductDetails(productID: string): void;
    addEventListener(type: string, listener: any): void;
    private informationReceived;
    private detailsReceived;
    readonly eventDispatcher: THREE.EventDispatcher;
}
declare class PriceTagUI {
    private _htmlContainer;
    private _manufacturerText;
    private _productNameText;
    private _priceText;
    private _basePriceText;
    private _dragControls;
    private _hidden; /** We need this because the "show" happens asynchronously, so we need to check this first.*/
    constructor(ui: UI);
    initListeners(dragControls: DragControls, model: Basket): void;
    updateContent(product: ProductInformation): void;
    private changePriceTagPosition;
    private show;
    private hide;
}
declare class UI {
    private _headerUI;
    private _basketUI;
    private _productDetailsUI;
    private _priceTagUI;
    constructor(scene: Scene);
    readonly basketUI: BasketUI;
    readonly headerUI: HeaderUI;
    readonly productDetailsUI: ProductDetailsUI;
    readonly priceTagUI: PriceTagUI;
    resize: () => void;
    update: () => void;
}
declare module utils {
    class FPSMeter {
        private _frameCount;
        private _elapsedTime;
        private _lastUpdate;
        private _frameCountFromBeginning;
        private _averageFPS;
        private _interval;
        constructor();
        update(): void;
    }
}
declare class Scene {
    private _canvas;
    private _scene;
    private _camera;
    private _renderer;
    private _lights;
    private _sceneLoader;
    private _cameraControls;
    private _circleControls;
    private _freeMovementControls;
    private _UI;
    private _fpsMeter;
    private _productInspector;
    private _eventDispatcher;
    constructor();
    private init;
    private initLights;
    private initControls;
    private initRenderer;
    private onWindowResize;
    private initMeshes;
    readonly camera: THREE.PerspectiveCamera;
    readonly renderer: THREE.WebGLRenderer;
    readonly scene: THREE.Scene;
    readonly lights: THREE.Object3D;
    readonly sceneLoader: SceneLoader;
    readonly cameraControls: CircleControls | FreeMovementControls;
    readonly canvas: HTMLCanvasElement;
    readonly UI: UI;
    readonly eventDispatcher: THREE.EventDispatcher;
    private onContextLost;
    private update;
    private animate;
}
declare class Product {
    private _ID;
    private _image;
    private _info;
    private _details;
    private _mesh;
    constructor(id: string, mesh: THREE.Object3D);
    readonly imgData: string;
    readonly info: ProductInformation;
    readonly ID: string;
    updateProductInformation(info: ProductInformation): void;
    updateProductDetails(details: ProductDetails): void;
}
declare class BasketProduct {
    private _quantity;
    private _product;
    constructor(product: Product, quantity?: number);
    add(quantity?: number): number;
    remove(quantity?: number): number;
    readonly quantity: number;
    readonly productType: Product;
}
declare class BasketModel {
    BasketId: string;
    TotalValue: number;
    Contents: BasketContentModel[];
    ShopId: number;
    IsCheckoutComplete: boolean;
    CheckoutSendDate: Date;
    CheckoutCompleteDate: Date;
    ConfirmedValue: number;
    UnavailableContents: string[];
    constructor();
    equals(other: BasketModel): boolean;
}
declare class BasketContentModel {
    productId: string;
    productAmount: number;
    constructor(productID: string, productAmount: number);
    equals(other: BasketContentModel): boolean;
}
declare class Guid {
    static newGuid(): string;
}
declare class Basket {
    private _basket;
    private _sceneProducts;
    private _basketProducts;
    private _productInfoDownloader;
    constructor();
    private addProductByID;
    addBasketProductByID(id: string, quantity?: number): void;
    private updateBasketModel;
    getProductInfoById(id: string, callback?: (response: string) => any): void;
    getProductDetailsById(id: string): void;
    findProductByID(id: string): Product;
    findBasketProductByID(id: string): BasketProduct;
    loadBasket(): void;
    saveBasket(): void;
    performCheckout(): void;
    private addOne;
    private removeOne;
    private updateTotals;
    private updatePriceAndQuantity;
    readonly productInfoDownloader: ProductInformationDownloader;
    private updateView;
}
/** This is a (kindof) Singleton class. The purpose of this is to handle AJAX requests */
declare module utils {
    interface AJAXConfig {
        url: string;
        params?: any;
        method: string;
        onComplete: (response: string) => any;
        onFail?: (status: number, statusText: string) => any;
        async?: boolean;
    }
    class AJAX {
        static BASE_URL: string;
        static METHOD_GET: string;
        static METHOD_POST: string;
        static load: (config: AJAXConfig) => void;
        private static defaultOnFail;
        private static encodeParams;
        private static encodeJSONParams;
    }
}
declare class Main {
    static instance: Main;
    static getInstance(): Main;
    private _basket;
    private _scene;
    static SHOP_ID: number;
    constructor();
    readonly scene: Scene;
    readonly basket: Basket;
}
