<template>
  <div id="search">
    <el-form>
      <el-row>
        <p class="title_for_input">根据任务名模糊查询：</p>
        <el-input type="text" v-model="searchText" placeholder="请输入想要查询的字段名" clearable style="width: 510px"/>
      </el-row>
      <p class="title_for_input" style="margin-top: 10px">根据特定时间点查询：</p>
      <el-row>
        <el-date-picker
          v-model="searchTimePoint"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          value-format="timestamp">
        </el-date-picker>
        <el-tooltip class="item" effect="light" content="查找所有包含已选择时间点的任务" placement="right-start">
          <i class="el-icon-question" style="color:#bdc3c7;"/>
        </el-tooltip>
      </el-row>
      <br/>
      <p class="title_for_input">根据开始或结束时间查询：</p>
      <el-row>
        <el-date-picker
          v-model="searchBeginTime"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd"
        style="width: 300px">
        </el-date-picker>
        <el-date-picker
          v-model="searchAfterTime"
          type="date"
          placeholder="选择结束日期"
          value-format="yyyy-MM-dd"
          style="width: 300px;margin-left: 100px">
        </el-date-picker>
      </el-row>

      <p class="title_for_input" style="margin-top: 10px">根据完成进度查询：</p>
      <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" style="width: 710px"></el-progress>
      <div style="text-align: center;width: 710px" >
      <el-button-group style="margin-top: 10px;text-align: center;position:relative;">
        <el-button icon="el-icon-minus" @click="decrease"></el-button>
        <el-button icon="el-icon-plus" @click="increase"></el-button>
      </el-button-group>

      </div>
      <p class="title_for_input" style="margin-top: 10px">是否为重要任务：</p>
      <el-radio v-model="isImport" label="import">是</el-radio>
      <el-radio v-model="isImport" label="normal">否</el-radio>
      <br/>
    </el-form>
    <h4 class="h4 text-info" style="margin-top: 10px">查询结果</h4>
    <table class="table table-bordered table-hover" style="margin-top: 20px">
      <tr style="color: #30336b">
        <th class="text-center">序号</th>
        <th class="text-center">任务标题</th>
        <th class="text-center">创建人</th>
        <th class="text-center">任务描述</th>
        <th class="text-center">完成进度</th>
        <th class="text-center">开始日期</th>
        <th class="text-center">截止日期</th>
        <th class="text-center">完成情况</th>
      </tr>
      <tr id="doingtr" class="text-center" v-for="(item,index) in filterTask" :key="index" :itemId="index">
        <td>{{index+1}}<span v-show="item.taskLevel=='import'" style="color: red">*</span></td>
        <td>{{item.title}}</td>
        <td>{{item.createMan}}</td>
        <td v-if="item.taskDescribe.length<=5">{{item.taskDescribe}}</td>
        <el-button v-else type="text" @click="open"><span
          @click="clickItem=item.taskDescribe">详情</span></el-button>
        <td>{{item.percentage}}</td>
        <td>{{item.beginTime}}</td>
        <td v-bind:class="bindTimeStyle(index)">{{item.deadLine}}</td>
        <td v-if="item.taskCompleteDescribe===undefined">未完成</td>
        <td v-else-if="item.taskCompleteDescribe.length<=5" :key="1">{{item.taskCompleteDescribe}}</td>
        <el-button v-else type="text" @click="open1" :key="2"><span
          @click="clickItem1=item.taskCompleteDescribe">详情</span>
        </el-button>
      </tr>
      <tr v-show="filterTask.length==0">
        <td colspan="8" class="text-center text-muted">
          <p>暂无数据....</p>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import storageUtil from "../util/storageUtil";

  export default {
    name: "search",
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        searchText: "",
        searchTimePoint: "",
        searchBeginTime: "",
        searchAfterTime: "",
        isImport: 'import',
        percentage: 0,
        allList: storageUtil.restoreData("doingList").concat(storageUtil.restoreData("completeList"))
      }
    },
    methods: {
      decrease() {
        if (this.percentage > 0)
          this.percentage -= 10
        else
          this.percentage = 0
      },
      increase() {

        if (this.percentage < 100)
          this.percentage += 10
        else
          this.percentage = 100
      },
      bindTimeStyle(index) {
        const doing = this.allList[index]
        var begintime = doing.beginTime;
        var deadline = doing.deadLine;
        begintime = new Date(begintime)
        deadline = new Date(deadline)
        var now = new Date();
        const totalTime = deadline - begintime
        const remainTime = deadline - now
        var percent = remainTime / totalTime;
        if (percent > 0.75 && percent <= 1) {
          return "enough"
        } else if (percent <= 0.75 && percent > 0.1) {
          return "warning"
        } else if (percent <= 0.1) {
          return "unenough"
        } else {
          return "unbegin"
        }
      },
      open1() {
        this.$alert(this.clickItem1, '任务完成描述详情', {
          confirmButtonText: '确定',
        });
      }
    },
    computed: {
      filterTask() {
        const {searchText, searchTimePoint, searchBeginTime, searchAfterTime, isImport, percentage, allList} = this
        let fTask;
        fTask = allList.filter(p => p.title.indexOf(searchText) !== -1)
        fTask = fTask.filter(p => p.taskLevel === isImport)
        if (searchBeginTime !== "") {
          fTask = allList.filter(p => p.title.indexOf(searchText) !== -1)
          fTask = fTask.filter(p => searchBeginTime === p.beginTime)
        }
        if (searchAfterTime !== "") {
          fTask = allList.filter(p => p.title.indexOf(searchText) !== -1)
          fTask = fTask.filter(p => searchAfterTime === p.deadLine)
        }
        if (percentage !== 0) {
          fTask = allList.filter(p => p.title.indexOf(searchText) !== -1)
          fTask = fTask.filter(p => percentage === p.percentage)
        }

        if (searchTimePoint !== "") {
          fTask = allList.filter(p => p.title.indexOf(searchText) !== -1)
          fTask = fTask.filter(p => ((new Date(p.deadLine).getTime()) >= searchTimePoint && (new Date(p.beginTime).getTime()) <= searchTimePoint))
        }


        return fTask;
      }
    }
  }
</script>

<style scoped>
  .unbegin {
    color: blue;
  }

  .enough {
    color: green;
  }

  .warning {
    color: orange;
  }

  .unenough {
    color: red;
  }
</style>
