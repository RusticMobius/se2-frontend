<template>
  <v-card dark width="380" height="260" class="ma-4 pa-2" :color="testColor">
    <v-card-title class="title">
      <v-chip

          dark :color="stateColor" small
              class=" mr-4 " >{{stateLabel}}
      </v-chip> {{testName}}  (共 {{testLength}} 题)</v-card-title>
    <v-card-text class="ml-4 pa-2 " >
      课程：《{{courseName}}》
    </v-card-text>
    <v-card-text class="ml-4 pa-2">
      起始时间：{{formatStartTime}}
    </v-card-text>
    <v-card-text class="ml-4 pa-2">
      结束时间：{{formatEndTime}}
    </v-card-text>
    <v-card-actions v-if="showTestAction">
      <router-link :to="{path:`/student/testing/${testId}`,query:{state:testState}}">
        <v-btn text >{{testState? "进入考试":"查看结果"}}</v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  //测试学生视窗
  name: "TestItem",
  props:{
    courseName: {
      type:String,
      default:null,
    },
    testName:{
      type:String,
      default:null,
    },
    startTime:{
      type:Number,
      default:null,
    },
    endTime:{
      type:Number,
      default:null,
    },
    testId:{
      type:Number,
      default:1,
    },
    testLength:{
      type:Number,
      default:0,
    }
  },
  data(){
    return{
      testState:true,
      stateColor:null,
      testColor:null,
      formatStartTime:null,
      formatEndTime:null,
      stateLabel:null,
      showTestAction:true,
    }
  },
  mounted() {
    //时间检测，判断测试状态，设置子组件
    var date=(new Date()).getTime();
    if(date>this.endTime){
      this.testState=false;
      this.stateLabel="已结束"
      this.showTestAction=true;
    }
    else if(date<this.startTime){
      this.testState=false;
      this.stateLabel="未开放"
      this.showTestAction=false;
    }else{
      this.testState=true;
      this.stateLabel="进行"
      this.showTestAction=true;
    }
    if(this.stateLabel==="已结束"){
      this.stateColor="orange";
      this.testColor="#9FA8DA";
    }else if(this.stateLabel==="未开放"){
      this.stateColor="#00BCD4 ";
      this.testColor="#CE93D8";
    }else{
      this.stateColor="indigo";
      this.testColor="light-blue lighten-1";
    }

    this.formatStartTime=this.stampConvertToDate(this.startTime);
    this.formatEndTime=this.stampConvertToDate(this.endTime);
  },
  methods:{
    stampConvertToDate(stamp){
      //时间戳转格式化时间
      let time=new Date(stamp);
      var year = time.getFullYear();
      var month =time.getMonth()+1;
      let m = month<10? ('0'+month):month;
      var date =time.getDate();
      let d = date<10? ('0'+date):date;
      var hour =time.getHours();
      let h= hour<10? ('0'+hour):hour;
      var minute = time.getMinutes();
      let mm = minute < 10 ? ("0" + minute) : minute;
      var second=time.getSeconds();
      let s = second < 10 ? ("0" + second) : second;
      var str =year + "-" + m + "-" + d+" "+h+":"+mm+":"+s;
      //console.log(str);
      return str;
    },
    dateConvertToStamp(date){
      //格式化时间转时间戳
      date= date.replace(new RegExp("-","gm"),"/");
      var stamp = (new Date(date)).getTime(); //得到毫秒数
      console.log(stamp);
      return stamp;
    }
  }
})
</script>

<style scoped>

</style>