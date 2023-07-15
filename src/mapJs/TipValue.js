/**
 * 弹框显示类
 */
class TipValue {
  constructor(viewer,jd,wd,value,status,floor) {
    this.viewer = viewer;
    this.jd = jd;
    this.wd = wd;
    this.value = value;
    this.status = status;
  }

  addLabel(){
    let body = document.getElementsByTagName('body')[0];
    let parentDiv = document.createElement("div");
    parentDiv.setAttribute("id", "layer");
    body.appendChild(parentDiv);
    let childDiv = document.createElement("div");
    childDiv.setAttribute("id","layer_b");
    parentDiv.appendChild(childDiv);
    let p_el = document.createElement("p");
    p_el.setAttribute("id","p_value");
    p_el.innerHTML =this.value;
    childDiv.appendChild(p_el);
    let bottomDiv = document.createElement("div");
    bottomDiv.setAttribute("id","bottomBorder");
    parentDiv.appendChild(bottomDiv);
    let windowObj = this.wgs84ToWindow(this.jd,this.wd,this.viewer);
    console.log("转换前...");
    console.log(windowObj);
    let top = windowObj.y -150+'px';
    let left = windowObj.x + 50 +'px';
    parentDiv.setAttribute("style","top:"+top);
    parentDiv.setAttribute("style","left:"+left);
    const windowPosition = new Cesium.Cartesian2()
    this.viewer.scene.postRender.addEventListener(function () {
      Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene,windowObj, windowPosition);
      console.log("转换后....");
      console.log(windowPosition);
      let top = windowPosition.y -150+'px';
      let left = windowPosition.x + 50 +'px';
      parentDiv.setAttribute("style","top:"+top);
      parentDiv.setAttribute("style","left:"+left);
    })
  }

  wgs84ToWindow(jd, wd,viewer) {
    let cartesian3 =Cesium.Cartesian3.fromDegrees(jd,wd);
    const windowPosition = new Cesium.Cartesian2()
    console.log(cartesian3);
    console.log(Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene,cartesian3,windowPosition));
    return Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer,cartesian3,windowPosition);
  }

}


export default {
  TipValue
}
