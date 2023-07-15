<template>
  <div class='map-container2' id='con_lf_top_div'>
    <div class='iframe-container' :style="{'height':height,'width':width}">
      <commandMap class='commandMap' id='iframe' ref='commandMap' @mouseChange='mouseChange' />
      <EventsLabel v-if='loadingEv' ref='EventsLabel' @addEvents='addEvents' />
      <div style='position: absolute;top: 100px;left: 30px;'>
        <topC @changestaus='changestaus'></topC>
      </div>
      <el-button type='primary' @click='goback' style='position: absolute;top: 100px;right: 140px;'>退出场景</el-button>
      <el-button type='primary' @click='sendWebsocket' style='position: absolute;top: 100px;right: 250px;'>更新场景
      </el-button>
      <div class='exbottom'>
        <div class='exbottom-div' @click='changemap(1)'>
          <img src='@/assets/slt.png' alt='' style='width: 100%;height: 70px;'>
          <div class='choicebutton' :class='{activeImg:activeImgId==1}'>矢量图</div>
        </div>
        <div class='exbottom-div' @click='changemap(2)'>
          <img :class='qxsy? "qxsy":""' src='@/assets/qxsy.jpg' alt='' style='width: 100%;height: 70px;'>
          <div class='choicebutton' :class='{activeImg:activeImgId==2}'>倾斜摄影</div>
        </div>
        <div class='exbottom-div' @click='changemap(4)'>
          <img src='@/assets/yx.png' alt='' style='width: 100%;height: 70px;'>
          <div class='choicebutton' :class='{activeImg:activeImgId==3}'>影像</div>
        </div>
      </div>
    </div>
    <el-dialog :append-to-body='true' :title='peoplename' :visible.sync='personalshow' width='293px'
               :close-on-click-modal='false'>
      <div
        style='width: 100%;padding-top: 18px;padding-right: 30px;height: auto;padding-bottom: 10px;text-align: right;'>
        <el-button @click='delpcs'>删除</el-button>
      </div>
    </el-dialog>
    <!-- 人工检测断面 -->
    <el-dialog :append-to-body='true' :title='sectiontitle' :visible.sync='section' width='40%'
               :close-on-click-modal='false'>
      <el-form :model='sectiondata' :rules='sectionrules' ref='sectionForm' label-width='25%' class='fc-container'>
        <el-form-item label='人工检测断面名称:' prop='sectionName'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='sectiondata.sectionName'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='巡测断面编码	:' prop='sectionCode'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='sectiondata.sectionCode' />
          </div>
        </el-form-item>
        <el-form-item label='经度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='sectiondata.longitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')" />
          </div>
        </el-form-item>
        <el-form-item label='纬度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='sectiondata.latitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')" />
          </div>
        </el-form-item>

        <el-form-item label='高度:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='sectiondata.height' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')" />
          </div>
        </el-form-item>
        <el-form-item>
          <div class='fc-container-bottom'>
            <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
            <el-button v-else @click='closeall();section=false'>取消</el-button>
            <el-button @click='addsection' type='primary'>
              <span v-if='isright'>编辑</span>
              <span v-else>保存</span>
            </el-button>
          </div>
        </el-form-item>

      </el-form>
    </el-dialog>
    <!-- 临时指挥部 -->
    <el-dialog :append-to-body='true' class='zhihuibu' :title='headquarterstitle' :visible.sync='headquarters'
               width='40%' :close-on-click-modal='false' @close='closeall'>
      <el-form :model='headquartersdata' :rules='headquartersrules' ref='headquartersForm' label-width='25%'
               class='fc-container' style='height:750px;overflow: scroll '>
        <el-form-item label='指挥部名称:' prop='headName'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='headquartersdata.headName'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='指挥部备注:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='headquartersdata.headContent'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='经度:' prop='longitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='headquartersdata.longitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='纬度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='headquartersdata.latitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='高度:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='headquartersdata.height' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='指挥长:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <div style='height: 200px;overflow-y: auto;'>
              <el-radio-group v-model='zhz'>
                <el-radio v-for='(item,index) in persondata' :key='index' :label='item.key'>{{ item.label }}</el-radio>
              </el-radio-group>
            </div>

          </div>
        </el-form-item>
        <el-form-item label='组员:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <div style='height: 200px;overflow-y: auto;'>
              <el-checkbox-group v-model='zy'>
                <el-checkbox v-for='(item,index) in persondata' :label='item.key'>{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <div class='fc-container-bottom'>
            <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
            <el-button v-else @click='closeall();headquarters=false'>取消</el-button>
            <el-button @click='addheadquarters' type='primary'>
              <span v-if='isright'>编辑</span>
              <span v-else>保存</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 零时视频点 -->
    <el-dialog :append-to-body='true' :title='camera_lsTitle' :visible.sync='camera_ls' width='40%'
               :close-on-click-modal='false' @close='closeall'>
      <el-form :model='camera_lsdata' :rules='camera_lsdatarules' ref='camera_lsdataForm' label-width='25%'
               class='fc-container'>
        <el-form-item label='视频名称:' prop='cameraName'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='camera_lsdata.cameraName'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='视频ID:' prop='cameraCode'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='camera_lsdata.cameraCode'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='经度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='camera_lsdata.longitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='纬度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='camera_lsdata.latitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='高度:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='camera_lsdata.height' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item>
          <div class='fc-container-bottom'>
            <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
            <el-button v-else @click='closeall();camera_ls=false'>取消</el-button>
            <el-button @click='addcamera_ls' type='primary'>
              <span v-if='isright'>编辑</span>
              <span v-else>保存</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 标注 -->
    <el-dialog :append-to-body='true' :title='markTitle' :visible.sync='mark' width='40%' :close-on-click-modal='false'
               @close='closeall'>
      <el-form :model='markdata' :rules='markrules' ref='markForm' label-width='25%' class='fc-container'>
        <el-form-item label='标注名称:' prop='markDescribe'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='markdata.markDescribe'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='经度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='markdata.longitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='纬度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='markdata.latitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='类型:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-select v-model='markdata.markId' placeholder='请选择'>
              <el-option label='学校' :value='1'></el-option>
              <el-option label='农田' :value='2'></el-option>
              <el-option label='文字' :value='3'></el-option>
              <el-option label='人员' :value='4'></el-option>
            </el-select>
          </div>
        </el-form-item>


        <el-form-item>
          <div class='fc-container-bottom'>
            <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
            <el-button v-else @click='closeall'>取消</el-button>
            <el-button @click='addmark' type='primary'>
              <span v-if='isright'>编辑</span>
              <span v-else>保存</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 定位点 -->
    <el-dialog :append-to-body='true' :title='locationsTitle' :visible.sync='locations' width='40%'
               :close-on-click-modal='false' :destroy-on-close='true' @close='closeall'>
      <el-form :model='locatdata' :rules='rules' ref='locationForm' label-width='25%' class='fc-container'>
        <el-form-item label='点位名称:' prop='pointName'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='locatdata.pointName' />
          </div>
        </el-form-item>
        <el-form-item label='经度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='locatdata.latitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')" />
          </div>
        </el-form-item>
        <el-form-item label='纬度:' prop='longitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='locatdata.longitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')" />
          </div>
        </el-form-item>
        <el-form-item label='高度:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='locatdata.height' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')" />
          </div>
        </el-form-item>
        <el-form-item>
          <div class='fc-container-bottom'>
            <el-button v-if='isright' @click='delMapEvents()'>删除</el-button>
            <el-button v-else @click='closeall'>取消</el-button>
            <el-button @click='addlocations' type='primary'>
              <span v-if='isright'>编辑</span>
              <span v-else>保存</span>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加事件标注点 -->
    <el-dialog :append-to-body='true' class='shijian' :title='evenTaggingTitle' :visible.sync='evenTagging' width='40%'
               :close-on-click-modal='false' @close='closeall' :destroy-on-close='true'>
      <el-form :model='evenTaggingdata' :rules='evenTaggingrules' ref='evenTaggingForm' label-width='25%'
               class='fc-container' style='height: 750px;overflow: scroll'>
        <el-form-item label='事件名称:' prop='infoName'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input placeholder='请输入' v-model='evenTaggingdata.infoName'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='事件类型:' prop='eventType'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input placeholder='请输入' v-model='evenTaggingdata.eventType'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='事件等级:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-select style='width: 100%;' v-model='evenTaggingdata.eventLevel' placeholder='请选择'>
              <el-option label='等级一' :value='1'></el-option>
              <el-option label='等级二' :value='2'></el-option>
              <el-option label='等级三' :value='3'></el-option>
              <el-option label='等级四' :value='4'></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label='经度:' prop='longitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='evenTaggingdata.longitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='纬度:' prop='latitude'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='evenTaggingdata.latitude' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='高度:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input v-model='evenTaggingdata.height' placeholder='只可输入数字'
                      oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </div>
        </el-form-item>
        <el-form-item label='发生时间:' prop='infoTime'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-date-picker
              style='width: 100%;'
              v-model='evenTaggingdata.infoTime'
              type='datetime'
              placeholder='选择日期'
              value-format='yyyy-MM-dd HH:mm:ss'
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label='事件描述:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-input type='textarea' v-model='evenTaggingdata.infoContent'></el-input>
          </div>
        </el-form-item>
        <el-form-item label='现场情况:'>
          <div class='fc-container-list-input' style='width: 85%;'>
            <el-upload
              class='upload-demo'
              drag
              :file-list='evenTaggingdataUploadList'
              action='https://jsonplaceholder.typicode.com/posts/'
              :http-request='upLoadOnSelf'
              :on-exceed='handleExceed'
              :limit='1'
              multiple>
              <i class='el-icon-upload'></i>
              <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
              <div class='el-upload__tip' slot='tip'>只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <div class='fc-container-bottom'>
            <el-button v-if='isright' @click='delMapEvents()'>删除</el-button>
            <el-button v-else @click='closeall();evenTagging=false'>取消</el-button>
            <el-button @click='evenTaggingquery();' type='primary'>
              <span v-if='isright'>编辑</span>
              <span v-else>保存</span>
            </el-button>
          </div>
        </el-form-item>

      </el-form>
    </el-dialog>
    <!-- 查看事件标注点 -->
    <div v-if='seeEvent' class='seemore'>
      <div class='seemore-title'>
        <span>{{ eventTitle }}</span>
        <div class='el-icon-close'></div>
      </div>
      <div class='seemore-list'>
        <div class='seemore-list-title'>事件类型：</div>
        <div class='seemore-list-content'>污染事件</div>
        <div class='clearfloat'></div>
      </div>
      <div class='seemore-list'>
        <div class='seemore-list-title'>事件等级：</div>
        <div class='seemore-list-content'>中级</div>
        <div class='clearfloat'></div>
      </div>
      <div class='seemore-list'>
        <div class='seemore-list-title'>发生时间：</div>
        <div class='seemore-list-content'>2020-08-18</div>
        <div class='clearfloat'></div>
      </div>
      <div class='seemore-list'>
        <div class='seemore-list-title'>事件描述：</div>
        <div class='seemore-list-content'>我是具体的描述，我是具体的描述，我是具体的描述，我是具体的描述，我是具体的描述。</div>
        <div class='clearfloat'></div>
      </div>
      <div class='seemore-list'>
        <div class='seemore-list-title'>现场照片：</div>
        <div class='seemore-list-content'>
          <div>
            <img
              src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa0.att.hudong.com%2F30%2F29%2F01300000201438121627296084016.jpg&refer=http%3A%2F%2Fa0.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618538198&t=a371a1b041c0ffc5369a76cb6430f78a'
              alt=''>
          </div>
          <div>
            <img
              src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fa0.att.hudong.com%2F30%2F29%2F01300000201438121627296084016.jpg&refer=http%3A%2F%2Fa0.att.hudong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618538198&t=a371a1b041c0ffc5369a76cb6430f78a'
              alt=''>
          </div>
        </div>
        <div class='clearfloat'></div>
      </div>

      <div class='seemore-botton'>
        <el-button @click='seeEvent=false'>取消</el-button>
        <el-button @click='seeEvent=false' type='primary'>确定</el-button>
      </div>
    </div>
    <!-- 标注 -->
    <!-- 信息采集点 -->
    <el-dialog :append-to-body='true' title='自动监测站' :visible.sync='icPoint' width='40%' :close-on-click-modal='false'>
      <div class='fc-container'>
        <div style='margin: auto;width: 96%;padding-top: 20px;padding-bottom: 20px;margin-left: 5%;'>
          <el-transfer
            :titles="['自动监测站', '已选']"
            v-model='icPointchoice' :data='pointdata'
            :props="{ key: 'STCD', label: 'STNM' }"
          />
        </div>
        <div class='fc-container-bottom'>
          <el-button v-if='isright' @click='delMapEvents'>删除</el-button>
          <el-button v-else @click='closeall;icPoint=false'>取消</el-button>
          <el-button @click='icPointquery' type='primary'>
            <span v-if='isright'>编辑</span>
            <span v-else>保存</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 查看采集点 -->
    <el-dialog :append-to-body='true' :title='collectTitle' :visible.sync='collect' width='40%'
               :close-on-click-modal='false'>

      <div class='seemore-collect'>
        <div class='seemore-collect-taps'>
          <div @click='choicetaps=0;dt({pointTagId:typeid})' :class='{collectactive:choicetaps==0}'>水文</div>
          <div @click='choicetaps=1;jt(typeid)' :class='{collectactive:choicetaps==1}'>水质</div>
        </div>
        <div class='seemore-collect-content'>
          <el-table
            ref='multipleTable'
            :data='collectdata'
            border
            tooltip-effect='dark'
            style='width: 100%'
            max-height='240px'
            :header-cell-style="{background:'#f4f4f5',color:'#1F2E4DFF'}"
          >
            <el-table-column v-if='choicetaps==1' prop='name' label='标签名称' min-width='15%'>
              <template slot-scope='scope'>
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column v-else prop='name' label='标签名称' min-width='15%'>
              <template slot-scope='scope'>
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>


            <el-table-column v-if='choicetaps==1' prop='danwei' label='标签单位' min-width='15%'>
              <template slot-scope='scope'>
                <span>{{ scope.row.danwei }}</span>
              </template>
            </el-table-column>
            <el-table-column v-else prop='tagUnit' label='标签单位' min-width='15%'>
              <template slot-scope='scope'>
                <span>{{ scope.row.danwei }}</span>
              </template>
            </el-table-column>

            <!-- <el-table-column v-if="choicetaps==1" prop="markCode" label="上次数值" min-width="15%"/> -->
            <el-table-column prop='tagValue' label='数值' min-width='10%'>
              <template slot-scope='scope'>
                <span>{{ scope.row.shuzhi }}</span>
              </template>
            </el-table-column>
          </el-table>

          <div style='width: 100%;text-align: right;padding-left: 15px;padding-top: 10px;'>
            <el-button @click='deljcc'>删除</el-button>
          </div>
        </div>

      </div>

    </el-dialog>
    <!-- 动态采集点配置 -->
    <el-dialog :append-to-body='true' title='动态标签配置' :visible.sync='dtcoll' width='600px' :close-on-click-modal='false'>
      <div class='fc-container'>
        <div style='margin: auto;width: 96%;padding-top: 20px;padding-bottom: 20px;'>
          <el-transfer :titles="['选择动态标签', '已选']" v-model='dtchoice' :data='dtdata'></el-transfer>
        </div>
        <div class='seemore-botton'>
          <el-button @click='dtcoll=false;collect=true'>取消</el-button>
          <el-button @click='dtcollQuery' type='primary'>确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 静态采集点配置 -->
    <el-dialog :append-to-body='true' title='静态标签配置' :visible.sync='jtcoll' width='350px' :close-on-click-modal='false'>
      <div class='seemore-list'>
        <div class='seemore-list-title' style='line-height: 38px;'>标签名称：</div>
        <div class='seemore-list-content'>
          <el-input placeholder='请输入' v-model='jtdata.tagName'></el-input>
        </div>
        <div class='clearfloat'></div>
      </div>
      <div class='seemore-list'>
        <div class='seemore-list-title' style='line-height: 38px;'>标签单位：</div>
        <div class='seemore-list-content'>
          <el-select v-model='jtdata.tagUnit' placeholder='请选择'>
            <el-option v-for='(item,index) in cData' :label='item.label' :value='item.key'></el-option>
          </el-select>
        </div>
        <div class='clearfloat'></div>
      </div>
      <div class='seemore-botton' style='margin-bottom: 20px;'>
        <el-button @click='jtcoll=false;collect=true'>取消</el-button>
        <el-button @click='addjt' type='primary'>确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加船只 -->
    <el-dialog :append-to-body='true' title='添加/编辑船只' :visible.sync='ship' width='800px' :close-on-click-modal='false'>
      <div class='fc-container' style='max-height: 600px;overflow-y: auto;'>
        <div class='fc-container-right' style='min-height: 100px;width: 180px;'>
          <div
            style='text-align: right;height: 36px;background-color: #E4EAF1;color: #1F2E4D;font-size: 16px;font-weight: 500px;padding-right: 16px;line-height: 36px;'>
            船舶
          </div>
          <div class='fc-container-right-content'>
            <el-checkbox-group @change='changeship' v-model='checkship'>
              <el-checkbox v-for='(item,index) in shipdata' :label='item.key' :key='item.key'>{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class='fc-container-right' style='width: 566px;'>
          <el-tabs v-model='activeName' @tab-click='handleClick'>
            <el-tab-pane :label='item.title' :name='item.title' v-for='(item,index) in personInShip'>
              <div class='fc-container-right-container'>
                <div class='taps-title'>
                  <div style='width: 120px;height: 36px;line-height: 36px;color: #00000080;float: left;'>绑定设备ID</div>
                  <el-select v-model='item.eqchoice' placeholder='请选择' style='float: left;'>
                    <el-option
                      v-for='(item2,index2) in item.eqlist'
                      v-if="item2.equipmentType=='ship'"
                      :label='item2.equipmentName'
                      :value='item2.jcsjPositionEquipmentId'>
                    </el-option>
                  </el-select>
                  <div class='clearfloat'></div>
                </div>
                <div class='taps-people'>
                  <el-checkbox-group v-model='item.choiceperson'>
                    <el-checkbox v-for='(item3,index3) in item.personlist' :label='item3.key'
                                 :key='`${index3}-${index}-${item3.key}`'>{{ item3.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>


        <div class='clearfloat'></div>
        <div class='fc-container-bottom'>
          <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
          <el-button v-else @click='ship=false'>取消</el-button>
          <el-button @click='shipquery' type='primary'>
            <span v-if='isright'>编辑</span>
            <span v-else>保存</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 添加车辆 -->
    <el-dialog :append-to-body='true' title='添加/编辑车辆' :visible.sync='car' width='800px' :close-on-click-modal='false'>
      <div class='fc-container' style='max-height: 600px;overflow-y: auto;'>
        <div class='fc-container-right' style='min-height: 100px;width: 180px;'>
          <div
            style='text-align: right;height: 36px;background-color: #E4EAF1;color: #1F2E4D;font-size: 16px;font-weight: 500px;padding-right: 16px;line-height: 36px;'>
            车辆
          </div>
          <div class='fc-container-right-content'>
            <el-checkbox-group @change='changecar' v-model='checkcar'>
              <el-checkbox v-for='(item,index) in cardata' :label='item.key' :key='item.key'>{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div class='fc-container-right' style='width: 566px;'>
          <el-tabs v-model='activeName' @tab-click='handleClick'>
            <el-tab-pane :label='item.title' :name='item.title' v-for='(item,index) in personInCar'>
              <div class='fc-container-right-container'>
                <div class='taps-title'>
                  <div style='width: 120px;height: 36px;line-height: 36px;color: #00000080;float: left;'>绑定设备ID</div>
                  <el-select v-model='item.eqchoice' placeholder='请选择' style='float: left;'>
                    <el-option
                      v-for='(item2,index2) in item.eqlist'
                      v-if="item2.equipmentType=='car'"
                      :label='item2.equipmentName'
                      :value='item2.jcsjPositionEquipmentId'>
                    </el-option>
                  </el-select>
                  <div class='clearfloat'></div>
                </div>
                <div class='taps-people'>
                  <el-checkbox-group v-model='item.choiceperson'>
                    <el-checkbox v-for='(item3,index3) in item.personlist' :label='item3.key'
                                 :key='`${index3}-${index}-${item3.key}`'>{{ item3.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class='clearfloat'></div>
        <div class='fc-container-bottom'>
          <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
          <el-button v-else @click='car=false'>取消</el-button>
          <el-button @click='carquery' type='primary'>
            <span v-if='isright'>编辑</span>
            <span v-else>保存</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 添加固定视频 -->
    <el-dialog :append-to-body='true' title='添加固定视频' :visible.sync='camera_gd' width='480px'
               :close-on-click-modal='false'>
      <div class='fc-container'>
        <div class='fc-container-right'>
          <div class='fc-container-right-content'>
            <el-checkbox-group v-model='checkcamera_gd'>
              <el-checkbox v-for='(item,index) in camera_gddata' :label='item.key' :key='item.key'>{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class='clearfloat'></div>
        <div class='fc-container-bottom'>
          <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
          <el-button v-else @click='camera_gd=false'>取消</el-button>
          <el-button @click='camera_gdquery' type='primary'>
            <span v-if='isright'>编辑</span>
            <span v-else>保存</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog :append-to-body='true' title='添加无人机' :visible.sync='uav' width='480px' :close-on-click-modal='false'>
      <div class='fc-container'>
        <div class='fc-container-right'>
          <div class='fc-container-right-content'>
            <el-checkbox-group v-model='checkuav'>
              <el-checkbox v-for='(item,index) in uavdata' :label='item.jcsjUavId' :key='item.jcsjUavId'>
                {{ item.uavName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class='clearfloat'></div>
        <div class='fc-container-bottom'>
          <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
          <el-button v-else @click='uav=false'>取消</el-button>
          <el-button @click='uavquery' type='primary'>
            <span v-if='isright'>编辑</span>
            <span v-else>保存</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 添加单兵人员 -->
    <el-dialog :append-to-body='true' title='添加单兵人员' :visible.sync='Individual' width='900px'
               :close-on-click-modal='false'>
      <div class='fc-container' style='max-height: 600px;overflow-y: auto;'>
        <div class='fc-container-right' style='min-height: 100px;width: 210px;'>
          <div
            style='text-align: right;height: 36px;background-color: #E4EAF1;color: #1F2E4D;font-size: 16px;font-weight: 500px;padding-right: 16px;line-height: 36px;'>
            人员
          </div>
          <div class='fc-container-right-content' style='height: 333px;'>
            <el-checkbox-group @change='changeEq' v-model='checkList'>
              <el-checkbox v-if="item.equipmentType=='person'" v-for='(item,index) in equidata'
                           :label='item.jcsjPositionEquipmentId' :key='item.jcsjPositionEquipmentId'>
                {{ item.equipmentName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div class='fc-container-right' style='width: 566px;'>
          <el-tabs v-model='activeName' @tab-click='handleClick'>
            <el-tab-pane :label='item.title' :name='item.title' v-for='(item,index) in personvale'>
              <div class='fc-container-right-container'>
                <div class='taps-people'>
                  <el-radio-group v-model='item.choiceperson'>
                    <el-radio v-for='(item3,index3) in item.personlist' :label='item3.key'
                              :key='`${index3}-${index}-${item3.key}`'>{{ item3.label }}
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class='clearfloat'></div>
        <div class='fc-container-bottom'>
          <el-button v-if='isright' @click='delMapEvents();'>删除</el-button>
          <el-button v-else @click='Individual=false'>取消</el-button>
          <el-button @click='Individualquery' type='primary'>
            <span v-if='isright'>编辑</span>
            <span v-else>保存</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 视频预览 -->
    <el-dialog :append-to-body='true' :title='videName' :visible.sync='video' width='40%' :close-on-click-modal='false'>
      <div id='playWnd' style='width: 100%;text-align: center;'>
        <videoPlayer :monitorDeviceNo='videoCode' :show='false'></videoPlayer>
      </div>
      <div style='width: 100%;padding-bottom: 20px;padding-right: 20px;text-align: right;'>
        <el-button @click='delVideo'>删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import videoPlayer from '@/components/video/index'
import commandMap from '@/views/commandMap'
import { deepClone } from '@/utils'
import {
  uavlist,
  markDestail,
  sceneSectionForId,
  collectionPointDes,
  updataponit,
  missionShip,
  missionCar,
  fileupload,
  scenePcsShipAdd,
  scenePcsadd,
  dictlist,
  swszyDataAuto,
  editperson,
  positionEquipmentList,
  headquartersByid,
  sceneCameraLsByid,
  missionInfoByid,
  anchorPointByid,
  taglist,
  tagStaticadd,
  tagStaticedit,
  cameralist,
  carlist,
  shiplist,
  relist,
  tagStaticdel,
  tagStaticAdd,
  pointList,
  personList,
  collectionTagMapKey,
  getzidongzhan,
  zdzselectList
} from '@/api/baseInfo'
import { addmissionDoc, addscenePcs } from '@/api/exercise'
import EventsLabel from './events.vue'
import Label from '../../command/module/label.vue'
import topC from './topC.vue'
import BottomView from '../../command/module/bottom.vue'
import { EventBus } from '@/mapJs/EventBus'

export default {
  components: { EventsLabel, topC, BottomView, Label, videoPlayer, commandMap },
  data() {
    return {
      uavdata: [],
      uav: false,
      checkuav: [],
      activeImgId: 2,
      markTitle: '添加标注点',
      evenTaggingTitle: '添加事件',
      locationsTitle: '添加点位',
      camera_lsTitle: '添加临时视频',
      headquarterstitle: '添加/修改临时指挥部',
      sectiontitle: '人工检测断面',
      video: false,
      peoplename: '张萌萌',
      personalshow: false,
      dictdata: [],
      activeName: 'first',
      formatDateTime: '',
      postnum: 1,
      zy: [],
      zhz: '',
      equiPeson: [],
      eqchoicepeople: '',
      markrules: {
        markDescribe: [
          { required: true, message: '标注名', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ]
      },
      sectionrules: {
        sectionCode: [
          { required: true, message: '巡测断面编码', trigger: 'blur' }
        ],
        sectionName: [
          { required: true, message: '请输入巡测断面名称', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ]
      },
      headquartersrules: {
        headName: [
          { required: true, message: '请输入临时指挥部名称', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ]

      },
      camera_lsdatarules: {
        cameraName: [
          { required: true, message: '请输入视频名称', trigger: 'blur' }
        ],
        cameraCode: [
          { required: true, message: '请输入视频ID', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ]
      },
      evenTaggingrules: {
        eventLevel: [
          { type: 'string', required: true, message: '请选择等级', trigger: 'change' }
        ],
        infoName: [
          { required: true, message: '请输入事件名称', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ],
        eventType: [
          { required: true, message: '请输入事件类型', trigger: 'blur' }
        ],
        infoTime: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        infoContent: [
          { required: true, message: '请输入事件描述', trigger: 'blur' }
        ]
      },
      rules: {
        pointName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '请输入纬度', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请输入经度', trigger: 'blur' }
        ]
      },
      mark: false,
      markdata: {
        markId: 3
      },
      isright: true,
      personInCar: [],
      personInShip: [],
      section: false,
      sectiondata: {},
      headquarters: false,
      headquartersdata: {
        zy: [],
        headContent: ''
      },
      camera_ls: false,
      camera_lsdata: {},
      camera_gd: false,
      checkcamera_gd: [],
      camera_gddata: [],
      car: false,
      checkcar: [],
      cardata: [],
      checkship: [],
      shipdata: [],
      ship: false,
      oldpointdata: [],
      newpointdata: [],
      jtdata: {},
      jtcoll: false,
      dtcoll: false,
      dtdata: [],
      dtchoice: [],
      collect: false,
      collectdata: [],
      choicetaps: 1,
      collectTitle: '采集点',
      eventTitle: '石油泄漏我是一个事件名称',
      seeEvent: false,
      persondata: [],
      checkList: [],
      personselect: '',
      Individual: false,
      icPointchoice: [],
      editNum: 1,//1.添加 2.编辑
      pointdata: [
        { key: 0, label: '第一' },
        { key: 1, label: '第2' },
        { key: 2, label: '第3' },
        { key: 3, label: '第4' },
        { key: 4, label: '第5' }
      ],
      typeid: '',
      icPoint: false,
      evenTaggingdata: {
        eventLevel: 1
        // infoTime:
      },
      videName: '视频预览',
      locatdata: {},
      evenTagging: false,
      showadd: false,
      locations: false,
      loadingEv: true,
      bottom: '80px',
      height: '',
      width: '',
      showLabel: true,
      id: 0,
      rightType: '',
      isfullnum: 0,
      labelData: [],
      cData: [],
      shuizhidata: {},
      rwid: 0,
      rightid: 0,
      equidata: [],
      oldshiplength: 0,
      oldCarLength: 0,
      oldeqlength: 0,
      personvale: [],
      videoCode: '',
      qxsy: true,
      evenTaggingdataUploadList: []
    }
  },
  created() {
    this.initWebSocket()
    // uavdata
    uavlist(1, 10000, {}).then(res => {
      if (res.code == 200) {
        this.uavdata = res.data.rows
      }
    })
    personList(1, 10000, {}).then(res => {
      if (res.code == 200) {
        for (let i = 0; i < res.data.rows.length; i++) {
          let json = { key: res.data.rows[i].jcsjPersonId, label: res.data.rows[i].userName }
          this.persondata.push(json)
        }
      }
    })
    dictlist({}).then(res => {
      if (res.code == 200) {
        for (let i = 0; i < res.data.rows.length; i++) {
          let json = {
            label: res.data.rows[i].dictKey,
            id: res.data.rows[i].sysDictId,
            vaule: res.data.rows[i].dictValue,
            children: []
          }
          this.dictdata.push(json)
        }

      }
    })
    // 自动水质
    this.rwid = this.$route.query.id
    this.initcaiji()
    let date = new Date()
    var y = date.getFullYear()
    var m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    var d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    var h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    var minute = date.getMinutes()
    minute = minute < 10 ? ('0' + minute) : minute
    var second = date.getSeconds()
    second = second < 10 ? ('0' + second) : second
    this.formatDateTime = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  },
  destroyed() {
    this.websock.close() //离开路由之后断开websocket连接
  },
  mounted() {
    this.emList()
    let _self = this
    this.init()
    let height = document.documentElement.clientHeight
    let width = document.documentElement.clientWidth
    this.height = height + 'px'
    this.width = width + 'px'

  },
  methods: {
    addmark() {
      this.$refs.markForm.validate((valid) => {
        if (valid) {
          this.mark = false
          if (this.isright) {
            // 编辑
            this.updataEvents(this.markdata)
          } else {
            const _self = this
            this.sendenvent(this.markdata)
          }
        } else {
          return false
        }
      })
    },
    delVideo() {
      this.delMapEvents()
    },
    sendWebsocket() {
      this.initWebSocket()
      updataponit({ missionId: this.rwid }).then(res => {
        this.websock.close()
      })
    },
    initWebSocket() { //初始化weosocket
      const wsuri = process.env.VUE_APP_WSS2 + `${this.rwid}`
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { //连接建立之后执行send方法发送数据
      let actions = { 'missionId': this.rwid }
      this.websocketsend(JSON.stringify(actions))
    },
    websocketonerror() {//连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) { //数据接收
      // const redata = JSON.parse(e.data);
    },
    websocketsend(Data) {//数据发送
      this.websock.send(Data)
    },
    websocketclose(e) {  //关闭
    },
    changestaus(data) {
      this.$refs.commandMap.events(data)
    },
    deljcc() {
      // let id = this.rightid
      this.delMapEvents()
    },
    delpcs() {
      let id = this.rightid
      if (this.rightType == 'person') {

      } else if (this.rightType == 'car') {

      } else if (this.rightType == 'ship') {

      }
    },

    handleClick(tab, event) {
    },
    changeEq(e) {
      if (this.oldeqlength > e.length) {
        let arr = []
        for (let i = 0; i < this.personvale.length; i++) {
          arr.push(this.personvale[i].id)
        }
        let del = this.getArrDifference(e, arr)
        for (let i = 0; i < this.personvale.length; i++) {
          if (del == this.personvale[i].id) {
            this.personvale.splice(i, 1)
          }
        }
        this.oldeqlength = e.length
      } else {
        this.oldeqlength = e.length
        if (e.length == 1) {
          for (let z = 0; z < this.equidata.length; z++) {
            if (e[0] == this.equidata[z].jcsjPositionEquipmentId) {
              this.personvale.push({
                title: this.equidata[z].equipmentName,
                id: e[0],
                personlist: this.persondata,
                choiceperson: ''
              })
              this.activeName = this.equidata[z].equipmentName
            }
          }
        } else if (e.length > 1) {
          for (let i = 0; i < e.length; i++) {
            if (i == e.length - 1) {
              for (let z = 0; z < this.equidata.length; z++) {
                if (e[i] == this.equidata[z].jcsjPositionEquipmentId) {
                  this.personvale.push({
                    title: this.equidata[z].equipmentName,
                    id: e[i],
                    personlist: this.persondata,
                    choiceperson: ''
                  })
                  this.activeName = this.equidata[z].equipmentName
                  return
                }
              }
            }
          }
        } else {
          this.personvale = []
        }
      }
    },
    // 获取绑定设备
    emList() {
      positionEquipmentList({}).then(res => {
        if (res.code == 200) {
          this.equidata = res.data.rows
        }
      })
    },


    updataEvents(data) {
      console.log(data)
      data.type = this.rightType
      console.log(data)
      this.$refs.commandMap.editEntity(data)
    },
    init() {
      this.$refs.commandMap.initSceneGetData2(this.rwid)
    },
    // 删除地图点
    delMapEvents() {

      let data = {
        id: this.rightid,
        type: this.rightType
      }
      this.locations = false
      this.evenTagging = false
      this.headquarters = false
      this.section = false
      this.camera_ls = false
      this.collect = false
      this.video = false
      this.mark = false
      let str = JSON.stringify(data)
      this.$refs.commandMap.deleteEntityById(str)
    },
    clicksend(data) {
      this.$refs.commandMap.bindingEntityByTaskIdAndType(data)
    },
    changecar(e) {
      if (this.oldCarLength > e.length) {
        let arr = []
        for (let i = 0; i < this.personInCar.length; i++) {
          arr.push(this.personInCar[i].id)
        }
        let del = this.getArrDifference(e, arr)
        for (let i = 0; i < this.personInCar.length; i++) {
          if (del == this.personInCar[i].id) {
            this.personInCar.splice(i, 1)
          }
        }
        this.oldCarLength = e.length
      } else {
        this.oldCarLength = e.length
        if (e.length == 1) {
          for (let z = 0; z < this.cardata.length; z++) {
            if (e[0] == this.cardata[z].key) {
              this.personInCar.push({
                eqchoice: '',
                title: this.cardata[z].label,
                id: e[0],
                personlist: this.persondata,
                eqlist: this.equidata,
                choiceperson: []
              })
              this.activeName = this.cardata[z].label
            }
          }
        } else if (e.length > 1) {
          for (let i = 0; i < e.length; i++) {
            if (i == e.length - 1) {
              for (let z = 0; z < this.cardata.length; z++) {
                if (e[i] == this.cardata[z].key) {
                  this.personInCar.push({
                    eqchoice: '',
                    title: this.cardata[z].label,
                    id: e[i],
                    personlist: this.persondata,
                    eqlist: this.equidata,
                    choiceperson: []
                  })
                  this.activeName = this.cardata[z].label
                  return
                }
              }
            }
          }
        } else {
          this.personInCar = []
        }
      }
      // this.personInCar=[]
      // this.persondata=[]
      // for(let i=0;i<e.length;i++){
      //   for(let j=0;j<this.cardata.length;j++){
      //     if(e[i]==this.cardata[j].key){
      //       let data ={id:e[i],title:this.cardata[j].label,personvale:this.persondata,choiceperson:[],choiceEq:"",equidata:this.equidata}
      //       this.personInCar.push(data)
      //     }
      //   }
      // }
    },
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },
    changeship(e) {
      if (this.oldshiplength > e.length) {
        let arr = []
        for (let i = 0; i < this.personInShip.length; i++) {
          arr.push(this.personInShip[i].id)
        }
        let del = this.getArrDifference(e, arr)
        for (let i = 0; i < this.personInShip.length; i++) {
          if (del == this.personInShip[i].id) {
            this.personInShip.splice(i, 1)
          }
        }
        this.oldshiplength = e.length
      } else {
        this.oldshiplength = e.length
        if (e.length > 1) {
          for (let i = 0; i < e.length; i++) {
            if (i == e.length - 1) {
              for (let z = 0; z < this.shipdata.length; z++) {
                if (e[i] == this.shipdata[z].key) {
                  this.personInShip.push({
                    eqchoice: '',
                    title: this.shipdata[z].label,
                    id: e[i],
                    personlist: this.persondata,
                    eqlist: this.equidata,
                    choiceperson: []
                  })
                  this.activeName = this.shipdata[z].label
                  return
                }
              }
            }
          }
        } else if (e.length == 1) {
          for (let z = 0; z < this.shipdata.length; z++) {
            if (e[0] == this.shipdata[z].key) {
              this.personInShip.push({
                eqchoice: '',
                title: this.shipdata[z].label,
                id: e[0],
                personlist: this.persondata,
                eqlist: this.equidata,
                choiceperson: []
              })
              this.activeName = this.shipdata[z].label
            }
          }
        } else {
          this.personInShip = []
        }
      }

    },
    ishaving(data, data2) {
      for (let j = 0; j < data2.length; j++) {
        if (data == data2[j].id) {
          return false
        }
      }
    },
    // 添加断面
    addsection() {
      this.$refs.sectionForm.validate((valid) => {
        if (valid) {
          this.section = false
          if (this.isright) {
            this.updataEvents(this.sectiondata)
          } else {
            this.sendenvent(this.sectiondata)
          }
        } else {
          return false
        }
      })

    },
    // 添加指挥部
    addheadquarters() {
      const wz = this.$refs.commandMap.windowToWGS84(window.event.clientX, window.event.clientY)
      this.headquartersdata.commander = this.zhz
      this.headquartersdata.teamPerson = this.zy
      this.$refs.headquartersForm.validate((valid) => {
        if (valid) {
          this.headquarters = false
          if (this.isright) {
            console.log(this.headquartersdata)
            this.headquartersdata.id = this.typeid
            this.updataEvents(this.headquartersdata)
          } else {
            this.sendenvent(this.headquartersdata)
          }
        } else {
          return false
        }
      })
    },
    closeall() {
      this.locations = false
      this.mark = false
      this.loadingEv = false
      let _self = this
      this.evenTaggingdataUploadList = []
      this.zy = []
      this.zhz = ''
      setTimeout(function() {
        _self.loadingEv = true
      }, 100)
    },
    // 添加动态菜单
    dtcollQuery() {
      for (let i = 0; i < this.dtchoice.length; i++) {
        let data = {
          'pointTagId': parseInt(this.typeid),
          'pointId': parseInt(this.dtchoice[i])
        }
        tagStaticadd(data).then(res => {
        })
      }

    },
    editjtquery(item) {
      let data = {
        id: item.yjylTagStaticId,
        tagName: item.tagName,
        tagUnit: item.tagUnit,
        tagValue: item.tagValue
      }
      tagStaticedit(data).then(res => {
        if (res.code == 200) {
          this.$message.success('修改成功')
          this.jt({ pointTagId: this.typeid })
        }
      })
    },
    editjt(item) {
      for (let i = 0; i < this.collectdata.length; i++) {
        if (item.yjylTagStaticId == this.collectdata[i].yjylTagStaticId) {
          // this.collectdata[i].show = false
          this.$set(this.collectdata[i], 'show', false)
          let num = this.collectdata[i].tagValue
          this.collectdata[i].tagValue = -111
          this.collectdata[i].tagValue = num
        }
      }
    },


    mouseChange(params) {
      let data = JSON.parse(params)
      console.log(params)
      this.rightid = data.id
      this.rightType = data.name
      if (params.cameraCode) {
        this.videoCode = params.cameraCode
      }
      if (params.name) {
        this.videName = params.name
      }
      let mousetype = data.type
      let type = data.name
      if (mousetype == 'left') {
        // 编辑
      } else if (mousetype == 'right') {
        this.editNum = 2
        this.isright = true
        this.EditEvents(type, data.id)

      } else if (mousetype == 'move') {
        // 拖拽微调
      }
    },
    goback() {
      this.$router.push({ path: '/monitor/monitorExercise' })
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多只能上传4个文件')
    },
    // 添加固定视频点位
    addcamera_ls() {
      this.$refs.camera_lsdataForm.validate((valid) => {
        if (valid) {
          this.camera_lsdata.sceneId = this.rwid
          this.camera_ls = false
          if (this.isright) {
            this.updataEvents(this.camera_lsdata)
          } else {
            this.sendenvent(this.camera_lsdata)
          }
        } else {
          return false
        }
      })

    },
    // 切换点位
    changepoint(data) {
      let params = {
        id: data.yjylAnchorPointId,
        jd: data.longitude,
        wd: data.latitude
      }
      this.$refs.commandMap.flyToLocation(params)
    },
    // 添加固定视频
    camera_gdquery() {
      // 3cb79c
      let data = {
        type: 'camera_gd',
        id: this.checkcamera_gd,
        missionId: this.rwid
      }
      this.camera_gd = false
      this.clicksend(data)
    },
    uavquery() {
      // 3cb79c
      let data = {
        type: 'uav',
        id: this.checkuav,
        missionId: this.rwid
      }
      let options = {
        jcsjPcsId: this.checkuav[0],
        pcsType: 3,
        sceneId: this.rwid
      }
      this.uav = false
      addscenePcs(options).then(res => {
        this.clicksend(data)
      })
    },
    // 添加车辆
    carquery() {
      let data = []
      for (let i = 0; i < this.personInCar.length; i++) {
        let json = {
          'equipmentId': this.personInCar[i].eqchoice,
          'jcsjPcsId': this.personInCar[i].id,
          'missionId': this.rwid,
          'personIds': this.personInCar[i].choiceperson
        }
        data.push(json)
      }
      scenePcsadd(data).then(res => {
        if (res.code == 200) {
          this.car = false
          this.$message.success('添加成功')
        }
      })

      this.clicksend({ type: 'car', missionId: this.rwid, id: this.checkcar })


    },
    // 添加船只
    shipquery() {
      let data = []
      for (let i = 0; i < this.personInShip.length; i++) {
        let json = {
          'equipmentId': this.personInShip[i].eqchoice,
          'jcsjPcsId': this.personInShip[i].id,
          'missionId': this.rwid,
          'personIds': this.personInShip[i].choiceperson
        }
        data.push(json)
      }
      // /api/yjyl/scenePcs/addShip
      scenePcsShipAdd(data).then(res => {
        if (res.code == 200) {
          this.ship = false
          this.$message.success('添加成功')
        }
      })
      this.clicksend({ type: 'ship', missionId: this.rwid, id: this.checkship })
    },
    // 添加人员
    Individualquery() {
      this.Individual = false
      for (let i = 0; i < this.personvale.length; i++) {
        let params = {
          id: this.personvale[i].choiceperson,
          equipmentId: this.personvale[i].id
        }
        editperson(params).then(res => {
        })
        let data = { pcsType: 0, jcsjPcsId: this.personvale[i].choiceperson, sceneId: this.rwid }
        this.clicksend({ type: 'person', missionId: this.rwid, id: this.personvale[i].choiceperson })
        this.addpsc(data)
        this.Individual = false
      }
    },
    icPointquery() {
      let data = {
        type: 'monitor',
        id: this.icPointchoice,
        missionId: this.rwid
      }
      this.icPoint = false
      this.clicksend(data)
    },
    evenTaggingquery() {
      this.$refs.evenTaggingForm.validate((valid) => {
        if (valid) {
          this.evenTagging = false
          if (this.isright) {
            // 编辑
            this.updataEvents(this.evenTaggingdata)
          } else {
            const evenTaggingdata = _.cloneDeep(this.evenTaggingdata)
            evenTaggingdata.missionId = this.$route.query.id
            this.sendenvent(evenTaggingdata)
          }
        } else {
          return false
        }
      })
    },
    // 添加人船车
    addpsc(data) {
      addscenePcs(data).then(res => {
        this.$message.success('添加成功')
      })
    },
    upLoadOnSelf(fileParam) {
      const fileObj = fileParam.file
      const form = new FormData()
      // form.append("type", this.$props.typenum);
      form.append('file', fileObj)
      fileupload(form).then(res => {
        if (res.code == 200) {
          this.$message.success('操作成功')
          this.evenTaggingdata.eventPic = []
          this.evenTaggingdata.eventPic.push(res.data)
        }
      })
    },
    // 添加定位
    addlocations() {
      this.$refs.locationForm.validate((valid) => {
        if (valid) {
          this.locations = false
          console.log(this.isright)
          if (this.isright) {
            // 编辑
            console.log(this.locatdata)
            this.updataEvents(this.locatdata)
          } else {
            const _self = this
            setTimeout(function() {
              _self.$refs.btview.init(1, 4, { missionId: _self.$route.query.id })
            }, 300)
            this.sendenvent(this.locatdata)
          }
        } else {
          return false
        }
      })
    },
    sendenvent(data) {
      this.loadingEv = false
      let _self = this
      setTimeout(function() {
        _self.loadingEv = true
      }, 100)
      data.missionId = this.rwid
      this.$refs.commandMap.addEntityToMap(data)
    },
    changemap(val) {
      if (val === 2) {
        if (this.qxsy) {
          this.qxsy = false
          console.log(3)
          EventBus.$emit('baseMap', 3)
        } else {
          this.qxsy = true
          console.log(2)
          EventBus.$emit('baseMap', val)
        }
      } else {
        EventBus.$emit('baseMap', val)
      }
    },
    // 地图点击事件
    getMesOnChildren(data) {
    },
    // 删除静态标签
    deljt(id) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tagStaticdel(id).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message)
            this.jt({ pointTagId: this.typeid })
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加静态标签
    addjt() {
      tagStaticAdd(this.jtdata).then(res => {
        if (res.code == 200) {
          this.$message.success('添加成功')
          this.jtcoll = false
          this.collect = true
          this.jt({ pointTagId: this.typeid })
        }
      })
    },
    openco() {
      if (this.choicetaps == 0) {
        this.dtcoll = true
        // this.collect=false
        this.dtdata = []
        this.cData = []
        this.initcaiji()
      } else {
        this.jtcoll = true
        // this.collect=false
        this.cData = []
        this.dtdata = []
        this.initcaiji()
      }
    },
    initcaiji() {
      taglist(1, 100000, {}).then(res => {
        // this.dtdata = res.
        if (res.code == 200) {
          for (let i = 0; i < res.data.rows.length; i++) {
            let json = {
              key: res.data.rows[i].jcsjCollectionTagId,
              label: res.data.rows[i].tagName,
              unit: res.data.rows[i].tagUnit
            }
            this.dtdata.push(json)
            this.cData.push(json)
          }
        }
      })
    },

    // 动态标签
    dt(params) {
      this.collectdata = []
      let id = params.pointTagId
      if (this.rightType == 'section') {
        sceneSectionForId(id).then(res => {
          let data = {
            'apiName': 'thwb.rtflow.info.getWxList',
            // "bizContent":JSON.stringify({"stcds":res.data.sectionCode})93201200
            'bizContent': JSON.stringify({
              'stcd': res.data.sectionCode,
              'startTime': '2021-04-20',
              'endTime': '2021-04-20'
            })
            // "bizContent":JSON.stringify({"stcd":'93201200','startTime':"2021-04-07",'endTime':"2021-04-07"})
          }
          collectionTagMapKey.then(res => {
            console.log(res.data)
            swszyDataAuto(data).then(res => {
              if (res.thwb_rtflow_info_getWxList_response.code == '10000' && res.thwb_rtflow_info_getWxList_response.data.records.length > 0) {
                let datatext = res.thwb_rtflow_info_getWxList_response.data.records[0]
                let arry = []
                Object.keys(datatext).forEach(key => {
                  let name = ''
                  if (key != 'stnm' && key != 'tjdate' && key != 'tjid' && key != 'stcd' && key != 'liuxiang' && key != 'renwu') {
                    if (key == 'dmll') {
                      name = 'dmll'
                    } else if (key == 'pjss') {
                      name = 'pjss'
                    } else if (key == 'scsj_s') {
                      name = 'scsj_s'
                    } else if (key == 'shuiwei') {
                      name = '水位'
                    }
                    let json = {
                      name: name, danwei: key, shuzhi: datatext[key]
                    }
                    arry.push(json)
                  }

                })
                this.collectdata = []
                this.collectdata = arry
              }
            })
          })
        })

      } else {
      }
    },
    jt(id) {
      this.collectdata = []
      if (this.rightType == 'section') {
        sceneSectionForId(id).then(res => {
          let data = {
            'apiName': 'thwb.rtwq.swnorm.getNewestData',
            // "bizContent":JSON.stringify({"stcds":res.data.sectionCode})
            'bizContent': JSON.stringify({
              'stcds': res.data.sectionCode,
              'taskName': '',
              'pageNumber': '1',
              'pageSize': '10'
            })
          }
          swszyDataAuto(data).then(res => {
            let arry = []
            if (res.thwb_rtwq_swnorm_getNewestData_response.code == '10000' && res.thwb_rtwq_swnorm_getNewestData_response.data.records.length > 0) {
              let data = res.thwb_rtwq_swnorm_getNewestData_response.data.records[0]
              Object.keys(data).forEach(key => {
                let name = ''
                if (key != 'SPT' && key != 'STNM' && key != 'STCD') {
                  if (key == 'VLPH') {
                    name = ''
                  } else if (key == 'NH3N') {
                    name = ''
                  } else if (key == 'CODCR') {
                    name = '化学需氧量'
                  } else if (key == 'XNTBM') {
                    name = ''
                  } else if (key == 'PYRCD') {
                    name = ''
                  } else if (key == 'CYNCD') {
                    name = '蓝藻数量'
                  } else if (key == 'PHYD') {
                    name = ''
                  } else if (key == 'DOX') {
                    name = '溶解氧'
                  } else if (key == 'CODMN') {
                    name = '高锰酸盐指数'
                  } else if (key == 'OIL') {
                    name = ''
                  } else if (key == 'LIUXIANG') {
                    name = '流向'
                  } else if (key == 'PHYDS') {
                    name = ''
                  } else if (key == 'CYNBM') {
                    name = ''
                  } else if (key == 'COND') {
                    name = '电导率'
                  } else if (key == 'CHLBM') {
                    name = ''
                  } else if (key == 'DTP') {
                    name = ''
                  } else if (key == 'CRYBM') {
                    name = ''
                  } else if (key == 'CHRBM') {
                    name = ''
                  } else if (key == 'EUGCD') {
                    name = ''
                  } else {
                    name = key
                  }
                  let ajson = {
                    name: name, danwei: key, shuzhi: data[key]
                  }
                  arry.push(ajson)
                }
              })
              this.collectdata = arry
            }
          })
        })
        return
      }
      collectionPointDes(id).then(res => {
        this.pointCode = res.data.pointCode
        let data = {
          'apiName': 'thwb.rtwq.awqmd.getNewestData',
          'bizContent': JSON.stringify({ 'stcds': res.data.pointCode })
        }
        swszyDataAuto(data).then(res => {
          this.collectTitle = res.thwb_rtwq_awqmd_getNewestData_response.data[0].STNM
          if (res.thwb_rtwq_awqmd_getNewestData_response.code == '10000') {
            let json = res.thwb_rtwq_awqmd_getNewestData_response.data[0]
            const _self = this
            let arry = []
            Object.keys(json).forEach(key => {
              let name = ''
              if (key != 'STNM' && key != 'STCD') {
                if (key == 'WT') {
                  name = '水温'
                } else if (key == 'PH') {
                  name = 'PH'
                } else if (key == 'COND') {
                  name = '电导率'
                } else if (key == 'DOX') {
                  name = '溶解氧'
                } else if (key == 'TURB') {
                  name = '浊度'
                } else if (key == 'REDOX') {
                  name = '氧化还原电位'
                } else if (key == 'CODMN') {
                  name = '高锰酸盐指数'
                } else if (key == 'TN') {
                  name = '总氮'
                } else if (key == 'NH3N') {
                  name = '氨氮'
                } else if (key == 'TP') {
                  name = '总磷'
                }
                let ajson = {
                  name: name, danwei: key, shuzhi: json[key]
                }
                arry.push(ajson)
              }
              console.info(key + ':', json[key])
            })
            this.collectdata = arry
          }
        })
      })
    },


    // 编辑
    EditEvents(type, id) {
      this.typeid = id
      if (type == 'mark') {
        this.mark = true
        markDestail(id).then(res => {
          this.markdata = res.data
          this.markdata.markId = res.data.markId
        })
      } else if (type == 'anchor') {
        // 定位点编辑
        this.locations = true
        anchorPointByid(id).then(res => {
          if (res.code == 200) {
            this.locatdata = res.data
            this.locationsTitle = res.data.pointName
            // this.locatdata.name = res.data.pointName
          }
        })
      } else if (type == 'event') {
        // 事件标注点
        missionInfoByid(id).then(res => {
          this.evenTaggingdata = res.data
          this.evenTaggingTitle = res.data.infoName
          const fileList = JSON.parse(res.data.eventPic)
          this.evenTaggingdataUploadList = [{
            name: fileList[0].substring(fileList[0].lastIndexOf('/') + 1),
            url: fileList[0]
          }]
        })
        this.evenTagging = true
      } else if (type == 'camera_ls') {
        sceneCameraLsByid(id).then(res => {
          this.camera_lsdata = res.data
          this.camera_lsTitle = res.data.cameraName
        })
        this.camera_ls = true
      } else if (type == 'monitor' || type == 'section') {
        this.collect = true
        if (type == 'monitor') {
          this.choicetaps = 1
          this.showadd = false
          collectionPointDes(id).then(res => {
            this.pointCode = res.data.pointCode
            let data = {
              'apiName': 'thwb.rtwq.awqmd.getNewestData',
              'bizContent': JSON.stringify({ 'stcds': res.data.pointCode })
            }
            swszyDataAuto(data).then(res => {
              this.collectTitle = res.thwb_rtwq_awqmd_getNewestData_response.data[0].STNM
              if (res.thwb_rtwq_awqmd_getNewestData_response.code == '10000') {
                let json = res.thwb_rtwq_awqmd_getNewestData_response.data[0]
                const _self = this
                let arry = []
                Object.keys(json).forEach(key => {
                  let name = ''
                  if (key != 'STNM' && key != 'STCD') {
                    if (key == 'WT') {
                      name = '水温'
                    } else if (key == 'PH') {
                      name = 'PH'
                    } else if (key == 'COND') {
                      name = '电导率'
                    } else if (key == 'DOX') {
                      name = '溶解氧'
                    } else if (key == 'TURB') {
                      name = '浊度'
                    } else if (key == 'REDOX') {
                      name = '氧化还原电位'
                    } else if (key == 'CODMN') {
                      name = '高锰酸盐指数'
                    } else if (key == 'TN') {
                      name = '总氮'
                    } else if (key == 'NH3N') {
                      name = '氨氮'
                    } else if (key == 'TP') {
                      name = '总磷'
                    }
                    let ajson = {
                      name: name, danwei: key, shuzhi: json[key]
                    }
                    arry.push(ajson)
                  }
                  console.info(key + ':', json[key])
                })
                this.collectdata = arry

              }
            })
          })
        } else {
          sceneSectionForId(id).then(res => {
            let data = {
              'apiName': 'thwb.rtwq.swnorm.getNewestData',
              // "bizContent":JSON.stringify({"stcds":res.data.sectionCode})
              'bizContent': JSON.stringify({
                'stcds': res.data.sectionCode,
                'taskName': '',
                'pageNumber': '1',
                'pageSize': '10'
              })
              // "bizContent":JSON.stringify({"stcds":'63204221','taskName':'','pageNumber':'1','pageSize':'10'})
            }
            swszyDataAuto(data).then(res => {
              let arry = []
              if (res.thwb_rtwq_swnorm_getNewestData_response.code == '10000' && res.thwb_rtwq_swnorm_getNewestData_response.data.records.length > 0) {
                let data = res.thwb_rtwq_swnorm_getNewestData_response.data.records[0]
                Object.keys(data).forEach(key => {
                  let name = ''
                  if (key != 'SPT' && key != 'STNM' && key != 'STCD') {
                    if (key == 'VLPH') {
                      name = '挥发性酚'
                    } else if (key == 'NH3N') {
                      name = '氨氮'
                    } else if (key == 'CODCR') {
                      name = '化学需氧量'
                    } else if (key == 'XNTBM') {
                      name = '黄藻生物量'
                    } else if (key == 'PYRCD') {
                      name = '甲藻数量'
                    } else if (key == 'CYNCD') {
                      name = '蓝藻密度'
                    } else if (key == 'PHYD') {
                      name = '浮游植物数量'
                    } else if (key == 'DOX') {
                      name = '溶解氧'
                    } else if (key == 'CODMN') {
                      name = '高锰酸盐指数'
                    } else if (key == 'OIL') {
                      name = '石油类'
                    } else if (key == 'LIUXIANG') {
                      name = '流向'
                    } else if (key == 'PHYDS') {
                      name = '浮游植物优势种'
                    } else if (key == 'CYNBM') {
                      name = '蓝藻生物量'
                    } else if (key == 'COND') {
                      name = '电导率'
                    } else if (key == 'CHLBM') {

                      name = '绿藻生物量'
                    } else if (key == 'DTP') {
                      name = '溶解性总磷'
                    } else if (key == 'CRYBM') {
                      name = '隐藻生物量'
                    } else if (key == 'CHRBM') {
                      name = '金藻生物量'
                    } else if (key == 'EUGCD') {
                      name = '裸藻数量'
                    } else {
                      name = key
                    }
                    let ajson = {
                      name: name, danwei: key, shuzhi: data[key]
                    }
                    arry.push(ajson)
                  }
                })
                this.collectdata = arry
              }
            })
          })
          this.choicetaps = 1
          this.collectTitle = '巡测断面'
          this.showadd = true
          this.jt(id)
        }
      } else if (type == 'headquarters') {
        this.headquarters = true
        headquartersByid(id).then(res => {
          this.headquartersdata = res.data
          // this.zy = res.data.team
          let list = res.data.team
          list = list.slice(1, list.length)
          list = list.substring(0, list.length - 1)
          list = list.split(',')
          console.log(list)
          list.forEach(item => {
            this.zy.push(item.trim())
          })
          this.zhz = res.data.leader
          this.headquarterstitle = '添加/修改临时指挥部'
        })

      } else if (type == 'person' || type == 'car' || type == 'ship') {
        // this.personalshow = true
      } else if (type == 'video') {
        this.video = true
      }
    },

    // 拖拽
    addEvents(data) {
      const wz = this.$refs.commandMap.windowToWGS84(window.event.clientX, window.event.clientY)
      this.isright = false
      this.editNum = 1
      if (data.type == 'mark') {
        data.markId = 3
        this.mark = true
        this.markdata = {
          ...data,
          longitude: wz.jd,
          latitude: wz.wd
        }
        // this.markdata.markId = 3
      } else if (data.type == 'anchor') {
        this.locations = true
        this.locatdata = {
          ...data,
          longitude: wz.wd,
          latitude: wz.jd
        }
      } else if (data.type == 'event') {
        this.evenTagging = true
        data.infoTime = this.formatDateTime
        data.eventLevel = 1
        this.evenTaggingdata = {
          ...data,
          longitude: wz.jd,
          latitude: wz.wd
        }
      } else if (data.type == 'monitor') {
        this.pointdata = []
        this.pointdata.type = 'monitor'
        getzidongzhan().then(res => {
          // let pointdata = res.data
          zdzselectList({ missionId: this.$route.query.id }).then(ress => {
            res.data.forEach((item, index) => {
              ress.data.forEach(i => {
                if (item.STCD == i.pointId) {
                  this.icPointchoice.push(item.STCD)
                }
              })
            })
            this.pointdata = res.data
            this.icPoint = true
          })
        })

      } else if (data.type == 'person') {
        this.Individual = true
        this.persondata = []

        personList(1, 10000, {}).then(res => {
          if (res.code == 200) {
            for (let i = 0; i < res.data.rows.length; i++) {
              let json = { key: res.data.rows[i].jcsjPersonId, label: res.data.rows[i].userName }
              this.persondata.push(json)
            }
          }
        })
      } else if (data.type == 'ship') {
        this.ship = true
        this.shipdata = []
        this.personInShip = []
        shiplist(1, 10000, {}).then(res => {
          if (res.code == 200) {
            for (let i = 0; i < res.data.rows.length; i++) {
              let json = { key: res.data.rows[i].jcsjShipId, label: res.data.rows[i].shipName }
              this.shipdata.push(json)
            }

            missionShip(this.rwid).then(res => {
              if (res.code == 200 && res.data.length > 0) {
                for (let i = 0; i < res.data.length; i++) {
                  // 回显
                  let title = ''
                  for (let j = 0; j < this.shipdata.length; j++) {
                    if (res.data[i].shipId == this.shipdata[j].key) {
                      title = this.shipdata[j].label
                      this.activeName = title
                    }
                  }
                  let json = {
                    title: title,
                    eqchoice: res.data[i].equipmentId,
                    personlist: this.persondata,
                    eqlist: this.equidata,
                    id: res.data[i].shipId,
                    choiceperson: res.data[i].personIds
                  }

                  this.checkship.push(res.data[i].shipId)
                  this.oldshiplength = this.checkship.length
                  this.personInShip.push(json)
                }
              }
            })


          }
        })
      } else if (data.type == 'car') {
        this.car = true
        this.cardata = []
        this.personInCar = []
        carlist({}).then(res => {
          if (res.code == 200) {
            for (let i = 0; i < res.data.rows.length; i++) {
              let json = { key: res.data.rows[i].jcsjCarId, label: res.data.rows[i].carNo }
              this.cardata.push(json)
            }
            missionCar(this.rwid).then(res => {
              if (res.code == 200 && res.data.length > 0) {
                for (let i = 0; i < res.data.length; i++) {
                  let title = ''
                  for (let j = 0; j < this.cardata.length; j++) {
                    if (res.data[i].carId == this.cardata[j].key) {
                      title = this.cardata[j].label
                      this.activeName = title
                    }
                  }
                  let json = {
                    title: title,
                    eqchoice: res.data[i].equipmentId,
                    id: res.data[i].carId,
                    personlist: this.persondata,
                    eqlist: this.equidata,
                    choiceperson: res.data[i].personIds
                  }
                  this.checkcar.push(res.data[i].carId)
                  this.oldCarLength = this.checkcar.length
                  this.personInCar.push(json)
                }
              }
            })


          }
        })
      } else if (data.type == 'camera_gd') {
        this.camera_gd = true
        this.camera_gddata = []
        cameralist({}).then(res => {
          if (res.code == 200) {
            for (let i = 0; i < res.data.rows.length; i++) {
              let json = { key: res.data.rows[i].jcsjCameraId, label: res.data.rows[i].cameraName }
              this.camera_gddata.push(json)
            }
          }
        })
      } else if (data.type == 'camera_ls') {
        this.camera_ls = true
        this.camera_lsdata = {
          ...data,
          longitude: wz.jd,
          latitude: wz.wd
        }
      } else if (data.type == 'headquarters') {
        this.headquarters = true
        this.headquartersdata = {
          ...data,
          longitude: wz.jd,
          latitude: wz.wd
        }
      } else if (data.type == 'section') {
        this.section = true
        console.log(data)
        this.sectiondata = {
          ...data,
          longitude: wz.jd,
          latitude: wz.wd
        }
      } else if (data.type == 'uav') {
        this.uav = true
      }
    }
  }
}
</script>

<style lang='less' scoped>
.activeImg {
  background: #3cb79c !important;
}

.taps-people {
  width: 100%;
  height: 250px;
  overflow-y: auto;

  ::v-deep .el-checkbox {
    width: 100px;
    height: 30px;
  }

  padding-top: 15px;
}

* {
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

::v-deep .el-radio {
  width: 100px;
  height: 30px;
}

.tableActive {
  .el-input.is-disabled .el-input__inner {
    border: 0px !important;
    background-color: white !important;;
    color: black !important;;
  }
}

.choicebutton {
  cursor: pointer;
  width: auto;
  padding: 10px;
  color: #FFFFFF;
  background: #257DD0;
  border: 1px solid #167CFA;
  border-radius: 4px;
  position: absolute;
  bottom: 33px;
  right: 5px;
}

.exbottom {
  position: absolute;
  bottom: -7px;
  left: 20px;

  &-div {
    float: left;
    width: 128px;
    height: 98px;
    margin-right: 20px;
    position: relative;

  }
}

.showLabel {
  width: 108px;
  height: 40px;
  background-color: rgba(3, 23, 41, 0.8);
  border: 1px solid #8B97B8;
  border-radius: 20px;
  margin-bottom: 10px;

  &-left {
    float: left;
    margin-top: 8px;
    text-align: center;
    margin-left: 21px;
  }

  &-right {

    float: left;
    margin-top: 8px;
    margin-left: 19px;
    font-size: 24px;
  }
}

.collectactive {
  color: #1890FFFF;
  border-bottom: 2px solid #1890FF;
}

.seemore {
  &-collect {
    &-content {
      margin-top: 6px;
    }

    &-taps {
      width: 100%;
      height: 46px;
      margin-top: 10px;

      div {
        cursor: pointer;
        font-weight: 500;
        float: left;
        width: 88px;
        height: 46px;
        line-height: 46px;
        text-align: center;
      }
    }

    padding: 10px 30px;
    font-size: 14px;
    color: #1F2E4D;
    height: auto;
  }

  &-botton {
    margin-top: 30px;
    width: 100%;
    height: auto;
    text-align: right;
    padding-right: 30px;
  }

  &-list {
    width: 100%;
    height: auto;
    font-size: 14px;
    line-height: 21px;
    margin-top: 20px;

    &-title {
      width: 100px;
      text-align: right;
      color: #62697A;
      float: left;
    }

    &-content {
      width: 224px;
      color: #1F2E4D;
      float: left;

      div {
        float: left;
        margin-right: 10px;

        img {
          width: 60px;
          height: 60px;
          border-radius: 4px;
        }
      }
    }

    div {
    }
  }

  width: 355px;
  height: auto;
  padding-bottom: 20px;
  background: #FFFFFF;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  position: absolute;
  top: 500px;
  left: 300px;

  &-title {
    width: 100%;
    height: 50px;
    background: #E4EAF1;
    border-radius: 4px 4px 0px 0px;
    line-height: 50px;
    padding-left: 20px;
    font-weight: 500;

    div {
      float: right;
      line-height: 50px;
      width: 50px;
      text-align: center;
    }
  }
}


.seemore .fc-container ::v-deep .el-transfer-panel {
  width: 43%;
  height: 390px;
}

.fc-container {
  ::v-deep .el-transfer-panel {
    width: 41%;
  }

  ::v-deep .el-transfer-panel__body {
    height: 328px;
  }

  ::v-deep .el-transfer-panel__list {
    height: 100%;
  }

  ::v-deep .el-button--primary.is-disabled, .el-button--primary.is-disabled:active, .el-button--primary.is-disabled:focus, .el-button--primary.is-disabled:hover {
    margin: 10px;
    display: block;
  }

  ::v-deep .el-transfer__button:first-child {
    margin: 10px;
    display: block;
  }

  ::v-deep .el-button + .el-button {
    margin: 10px;
    margin-top: 0px;
  }

  ::v-deep .el-transfer__buttons {
    padding: 0px;
  }

  &-right {
    &-container {
      width: 100%;
      padding: 0px 17px;
      height: 313px;
    }

    ::v-deep .el-tabs__nav-scroll {
      background-color: #E4EAF1;
      padding: 0px 15px;
    }

    ::v-deep .el-tabs__item {
      // background-color: rgba(0,0,0,0);
      font-size: 16px;
    }

    &-content {
      padding-left: 10px;
      height: 354px;
      width: calc(100% - 10px);
      overflow-y: auto;

      .fc-tree {
        ::v-deep .el-checkbox {
          width: 15px;
          height: auto;
        }
      }

      ::v-deep .el-checkbox {
        width: 100px;
        height: 30px;
      }
    }

    &-add {
      float: right;
      font-size: 14px;
      color: #3D4966;

      ::v-deep .el-input--suffix .el-input__inner {
        height: 30px;
        width: 130px;
      }

      ::v-deep .el-input__icon {
        line-height: 30px;
      }
    }

    width: 453px;
    float: left;
    height: 390px;
    border: 1px solid #DBDBDB;
    border-radius: 4px;
    margin-left: 16px;
    margin-bottom: 20px;
  }

  &-left {
    float: left;
    margin-left: 30px;
    width: 220px;
    height: 390px;
    border: 1px solid #DBDBDB;
    border-radius: 4px;

    &-title {
      padding-right: 20px;
      font-size: 16px;
      background-color: #E4EAF1FF;
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
      width: 100%;
      height: 36px;
      line-height: 36px;
      color: #1F2E4DFF;
      padding-left: 20px;
    }
  }

  width: 100%;
  height: auto;

  &-bottom {
    width: 100%;
    height: 72px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    // background-color: #F5F5F5;
    text-align: right;
    line-height: 72px;
  }

  &-list {
    width: 100%;
    padding: 0px 10px;
    margin-bottom: 10px;
    height: auto;

    &-title {
      width: 100px;
      text-align: right;
      float: left;
      line-height: 40px;
    }

    &-input {
      width: 250px;
      float: left;

      .el-checkbox {
        width: 100px;
      }
    }
  }
}

.showLabel {
  width: 108px;
  height: 40px;
  background-color: rgba(3, 23, 41, 0.8);
  border: 1px solid #8B97B8;
  border-radius: 20px;
  margin-bottom: 10px;

  &-left {
    float: left;
    margin-top: 8px;
    text-align: center;
    margin-left: 21px;
  }

  &-right {
    float: left;
    margin-top: 8px;
    margin-left: 19px;
    font-size: 24px;
  }
}

.map-container2 {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-comm {
  position: absolute;
  top: 0px;
  left: 0px;
}

.iframe-container {
  //position: absolute;
  top: 0px;
  left: 0rem;

  iframe {
    border: 0rem;
  }
}

.activeheight {
  height: 100%;
}

.qxsy {
  border: 2px solid #00FFFF;
}

::v-deep .el-dialog__header {
  background: #E4EAF1;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

::v-deep .el-dialog {
  border-radius: 5px;
}

::v-deep .el-dialog__body {
  padding: 0px;
  overflow: hidden;
}

::v-deep .el-form-item__label {
  font-weight: 700;
}

.zhihuibu,
.shijian {
  ::v-deep .el-dialog {
    margin: 90px auto 0 !important;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    width: 6px;
    background: rgba(#101F1C, 0.1);
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(#101F1C, 0.5);
    background-clip: padding-box;
    min-height: 28px;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(#101F1C, 1);
  }
}

.commandMap {
  position: absolute;
  width: 100%;
  height: 100vh;
  top: 0px;
  left: 0px;
}
</style>
