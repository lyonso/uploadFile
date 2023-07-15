<template>
  <div class="upimg-container">
    <div class="upimg-top">
      <div class="upimg-editandtips">
        <!-- 上传图片 -->
        <div style="width: 148px;height: 148px;overflow: hidden;float: left;">
          <div class="imgprev" v-if="isshowimgs">
            <img :src="imgurl"  style="height: 148px;width: 148px;position: absolute;top: 0px;left: 0px;border:2px dashed #D8D8D8;;" alt="">
            <div class="imgprev-fc">
              <!-- <el-button type="text" @click="editimg"  style="color: white;"  class="el-icon-edit-outline delbutton"></el-button> -->
              <el-button type="text" @click="delimg"  style="color: white;margin-left:0px"  class="el-icon-delete delbutton"></el-button>
            </div>
          </div>
          <el-upload
            ref='upload'
            class="upload-demo"
            style="position: relative;"
            list-type="picture-card"
            action="*"
            :before-upload="bbbb"
            :http-request="upLoadOnSelf"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div style="clear:both"></div>
        <!-- <div style=";margin-top: 10px;margin-left: 105px;font-size: 12px;color: rgba(0,0,0,0.43);">{{tips}}</div> -->
      </div>
      <div class="clearfloat"></div>
    </div>
  </div>
</template>

<script>
  import { uploadfile } from'@/api/baseInfo'
  export default{
    props:{
      imgurl:{
        type:String,
        default:""
      },
      tips:{
        type:String,
        default:"(建议尺寸：支持png,jpg格式，图片大小<2M) "
      },
      biaoshi:{
        type:String,
        default:"logo"
      },
      qubie:{
        type:String,
        default:"上传logo"
      },
      typenum:{
        type:Number,
        default:1
      },
      imgtype:{
        type:Array,
        default:()=>["image/jpeg","image/png"]
      },
      sizetips:{
        type:String,
        default:"图片大小限制为200px x 200px!"
      },
      imgtips:{
        type:String,
        default:"仅支持上传图片，且格式为JPG或PNG！"
      },
      width:{
        type:Number,
        default:0
      },
      height:{
        type:Number,
        default:0
      },
      configSource:{
        type:Number,
        default:1
      },
      isshowimgs:{
        type:Boolean,
        default:false
      }

    },
    created() {
      if(this.$props.imgurl){
        this.$props.isshowimgs = true
      }
    },
    data(){
      return{
        loading:true,
        uploadurl:"",
        imgname:"xxx.png",
        file:{},
        imgurls:[{
            url: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
            srcList: [
              'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
            ]
        }],
        isshowplus:true,
      }
    },
    methods:{
      editimg(){
        console.log(this.$refs.upload.$children)
        this.$refs.upload.$children[1].$refs.input.click();
      },
      // 删除图片
      delimg(){
        this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('change-del',{id:0})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //
      upLoadOnSelf(fileParam){
        const fileObj =fileParam.file;
        const form = new FormData();
        // form.append("type", this.$props.typenum);
        form.append("file", fileObj);
        uploadfile(form).then(res=>{
          console.log(res)
          if(res.code==200){
            this.$message.success("操作成功")
            this.imgurls=[{url:res.data,srcList:[res.data]}]
            this.$emit("child-event",res.data)
            this.$props.isshowimgs = false
          }
        })
      },


      handlePictureCardPreview(event,file){
        console.log(file)
        var URL = null;
        if (window.createObjectURL != undefined) {
          // basic
          URL = window.createObjectURL(event.raw);
        } else if (window.URL != undefined) {
          // mozilla(firefox)
          URL = window.URL.createObjectURL(event.raw);
        } else if (window.webkitURL != undefined) {
          // webkit or chrome
          URL = window.webkitURL.createObjectURL(event.raw);
        }
        this.imgurls=[{url:URL,srcList:[URL]}]
        // this.$emit("child-event",URL)
      },

      bbbb(file){
        let newtype = this.$props.imgtype
        console.log(this.$props.imgtype)
        let isPG=false
        if(newtype.length>0){
          for(let i =0;i<newtype.length;i++){
            if(file.type===newtype[i]){
              console.log(file.type)
              isPG=true
            }
          }
        }
        const isLt2M = file.size / 1024 / 1024 < 2;     //限制图片小于1M
        let width = this.$props.width
        let height = this.$props.height
        let _URL = window.URL || window.webkitURL
        const isSize = new Promise(function(resolve,reject) {
            let img = new Image()
            img.onload = function() {
                let valid
                if(width==0&&!height==0){
                  valid = img.height == height
                }else if(height==0&&!width==0){
                  valid = img.width == width
                }else if(width==0&&height==0){
                  valid=true
                }
                else{
                  valid = img.width == width && img.height == height
                }
                console.log(width)
                console.log(img.width)
                console.log(height)
                valid ? resolve() : reject();
            }
            img.src = _URL.createObjectURL(file)
        }).then(() => {
            return file;
        },()=>{
            this.$message.error(this.$props.sizetips);
            return promise.reject();
        })
        if (!isPG) {
            this.$message.error(this.$props.imgtips);
        }
        // if (!isLt2M) {
        //     this.$message.error('上传的图片大小不能超过 1MB!');
        // }
          return isPG && isLt2M && isSize
      },
      initcom(){
      }
    },
    mounted() {

      // this.initcom()

    }
  }
</script>

<style scoped>
.upload-demo{float: left;}
.imgprev{width: 148px;height: 148px;position: relative;background-color: #F4F5F6;}
.imgprev img{width: 148px;height: 148px;border-radius: 5px;}
.imgprev-fc{position: absolute;top:0px;left: 0px;background-color: rgba(0,0,0,0.5);width: 100%;color: white;height: 100%;font-size: 30px;text-align: center;line-height: 92px;opacity: 0;transition: opacity 0.2s;display: flex;flex-direction: column;justify-content: center;align-items: center;}
.imgprev-fc:hover{opacity: 1;}
.upimg-container{width: 500px;height: auto;margin-bottom: 20px;}
.upimg-editandtips{margin-left: 0px;padding-top: 20px;}
.upimg-img{width: 205px;height: 205px;border: 1px solid black;float: left;text-align: center;}
.clearfloat{clear: both;}
.upimg-title{width: 205px;margin-top: 10px;text-align: center;}
.upimg-icon{font-size: 40px;}
/deep/.el-upload--picture-card{background: #F4F5F6;border:2px dashed #D8D8D8;width: 148px;height: 148px;line-height: 148px;border-radius: 0px;}
/deep/.el-upload-list--picture-card .el-upload-list__item{height: 148px;width: 148px;}
</style>
