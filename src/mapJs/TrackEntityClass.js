/**
 * 动态轨迹类
 */
export default class TrackEntityClass {
    constructor(id,jd,wd,timeIndex,height,dataSource,color) {
        this.id = id;
        this.jd = jd;
        this.wd = wd;
        this.timeIndex=timeIndex;
        this.height = height
        this.dataSource = dataSource
        this.property = new Cesium.SampledPositionProperty()
        this.entityPoint =null
        this.color =color
        this.init()
    }

    init(){
        this.createProperty();
        let self = this
        this.entityPoint =this.dataSource.entities.add({
            availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start: Cesium.JulianDate.fromDate(new Date()),
                stop: Cesium.JulianDate.fromDate(new Date(new Date().getTime()+100000000000))
            })]),
            id:self.id,
            position: self.property, // 点集
            name:'camera_gd',
            model: {
                uri: '../gldb/CesiumDrone.glb',
                minimumPixelSize: 64,
                maximumScale: 128,
            },
            path: {
                leadTime: 0,
                resolution: 1,
                material: new Cesium.PolylineGlowMaterialProperty({
                    color: self.color
                }),
                width: 5
            }
        });
    }

    createProperty() {
        let time = new Date(new Date().getTime() + this.timeIndex);
        let position = Cesium.Cartesian3.fromDegrees(this.jd,this.wd,this.height)
        this.property.addSample(Cesium.JulianDate.fromDate(time), position);
    }

    updateProperty(jd,wd,height){
        let time = new Date(new Date().getTime() +this.timeIndex)
        this.property.addSample(Cesium.JulianDate.fromDate(time), Cesium.Cartesian3.fromDegrees(jd,wd,height));
    }



}

