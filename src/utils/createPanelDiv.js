import Vue from 'vue';
class DivLabel {
    // [lng, lat, h] 经纬度
    // label 文字标签
    constructor(viewer, [lng, lat, h]) {
        this.viewer = viewer;
        this.position = Cesium.Cartesian3.fromDegrees(lng, lat, h);
        this.divInstance = null;
        this.leftValue = null;
        this.bottomValue = null;
        this.xy = null;
        this.unRegisterAddPostRender = null;
        this.addPostRender();
    }
    createDiv(originContainer, option={}, data={}) {
        //基本参数
        let divInstance = null;
        const BASEOPTION = {
            isOnly: false, //是否只创建一个ParentComponent节点
            leftValue: 0,
            bottomValue: 0,
            xy: 0
        }; 
        // 结合传入参数
        option = Object.assign({}, BASEOPTION, option);
        this.leftValue = option['leftValue'];
        this.bottomValue = option['bottomValue'];
        this.xy = option['xy'];
        // 创建HTML或者vue组件
        if( originContainer.constructor.name === 'HTMLDivElement' ) {
            // 克隆
            // let refs = option.refs;
            // let _this = option.instanceObj;
            originContainer.style.display = 'none';
            // divInstance = originContainer.cloneNode(false);
            // let childNodes = originContainer.childNodes;
            // Array.prototype.slice.call(childNodes).forEach(element=>{
            //     element.removed = this.removed.bind(this);
            //     divInstance.appendChild(element);
            // });
            // Array.prototype.slice.call(childNodes).forEach(element=>{
            //     element.removed = this.removed.bind(this);
            //     originContainer.appendChild(element);
            // });
            // innerHTML 插入@click绑定事件将会失效
            // let innerHTML = originContainer.innerHTML;
            // divInstance.innerHTML = innerHTML;
            // 直接应用原对象，会累加addEventListener执行次数，撇弃
            // divInstance = originContainer;
        } else if( originContainer.constructor.name==='Object' && originContainer.render ) {
            // vue组件
            let divContainer = Vue.extend(originContainer);
            let instance = new divContainer().$mount();
            instance.data = data;
            instance.removed = this.removed.bind(this);
            // 实体
            divInstance = instance.$el;
        } 

        // 判断是否已经添加当前元素
        let htmlNotExist = document.getElementById(option['id']); 
        if( option['isOnly'] && !!htmlNotExist) {
            // 创建事件并移除
            let divInstanceEvent = new Event('removeChild');
            htmlNotExist.dispatchEvent(divInstanceEvent);
            // 移除已存在的组件（暂未用到），通过事件监听移除
            // this.viewer.cesiumWidget.container.removeChild(htmlNotExist);
        }
        
        //添加监听函数
        divInstance.addEventListener('removeChild', this.removed.bind(this));
        // 绑定标识
        divInstance['id'] = option['id'];

        // 加入场景
        this.viewer.cesiumWidget.container.appendChild(divInstance);
        this.divInstance = divInstance;
        return this;
    }
    removed() {
        if( !this.divInstance ) return;
        this.divInstance?.remove();
        this.unRegisterAddPostRender?.call(this);
    }
    addPostRender() {
        this.unRegisterAddPostRender = this.viewer.scene.postRender.addEventListener(this.postRender, this);
        return this;
    }
    postRender() {
        if( !this.divInstance ) return;
        // const canvasHeight = this.viewer.scene.canvas.height;
        const canvasHeight = document.getElementById('map3d').offsetHeight;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        const elWidth = this.divInstance.offsetWidth;
        const elHeight = this.divInstance.offsetHeight;
        // this.divInstance.style.bottom = canvasHeight - windowPosition.y + this.bottomValue + 'px';
        // this.divInstance.style.left = windowPosition.x + this.leftValue + 'px';
        
        this.divInstance.style.bottom = canvasHeight - windowPosition.y + (elHeight*this.bottomValue) + 'px';
        this.divInstance.style.left = windowPosition.x +(elWidth*this.xy) + 'px';

        const camerPosition = this.viewer.camera.position;
        let height = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;
        height += this.viewer.scene.globe.ellipsoid.maximumRadius;
        if((!(Cesium.Cartesian3.distance(camerPosition, this.position) > height)) && this.viewer.camera.positionCartographic.height < 50000000){
            this.divInstance.style.display = 'block';
        }else{
            this.divInstance.style.display = 'none';
        }
    }
}

export default DivLabel;