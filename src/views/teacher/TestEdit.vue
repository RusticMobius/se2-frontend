<template>
  <v-container class="pl-16 pr-16">
    <v-toolbar color="deep-purple lighten-2" dark class="mt-10">
      <v-toolbar-title>测试信息</v-toolbar-title>
    </v-toolbar>
    <form class="pa-12 grey lighten-5 mt-8">

      <v-text-field
          v-model="testInfo.courseName"
          label="课程名称"
      ></v-text-field>
      <v-text-field
          v-model="testInfo.testName"
          label="测试名称"
      ></v-text-field>
      <v-text-field
          v-model="testInfo.startTime"
          label="起始时间"
      ></v-text-field>
      <v-text-field
          v-model="testInfo.endTime"
          label="结束时间"
      ></v-text-field>
      <v-select
          :items="formatLengthList"
          v-model="testInfo.length"
          label="题目数量"
      ></v-select>
      <v-text-field
          disabled label="题目列表"
          :value="questionIdList"
      ></v-text-field>

      <v-btn class="ml-0 mt-8 "  color="indigo" dark disabled>
        确认
      </v-btn>
    </form>
    <v-toolbar color="deep-purple lighten-2" dark class="mt-10 mb-10">
      <v-toolbar-title>题目</v-toolbar-title>
    </v-toolbar>
    <v-row v-for="ques in questionList" :key="ques.id">
      <question-item
          :key="ques.id"
          :teacher-id="ques.teacherId"
          :course-id="ques.courseId"
          :content="ques.content"
          :analysis="ques.analysis"
          :answer="ques.answer"
          :ques-id="ques.id"
          :type="ques.type"
          :show-analysis="showAnalysis"
      ></question-item>
    </v-row>
  </v-container>
</template>

<script >
import Vue from "vue";
import QuestionItem from "../../components/QuestionItem.vue";
import {getQuestionByTestId} from "@/api/question";
import {getTestById} from "@/api/test";

export default Vue.extend( {
  name: "TestEdit",
  components:{
    QuestionItem
  },
  data(){
    return{
      testInfo:{},
      courseList:[],
      questionList:[],
      showAnalysis: true,
      questionIdList:[],
      formatLengthList:[5,10,20,25]
    }

  },
  mounted() {
    //已创建的测试教师视窗
    const tid=this.$route.params.testId;
    console.log(this.$route.params.testId)

    getTestById(tid).then(res=>{
      console.log(res);
      this.testInfo=res;
      this.testInfo.startTime=this.stampConvertToDate(this.testInfo.startTime);
      this.testInfo.endTime=this.stampConvertToDate(this.testInfo.endTime);
    });
    getQuestionByTestId(tid).then(res=>{
      for(let i=0;i<res.length;i++){
        this.questionList.push(res[i])
        console.log(res[i])
      }
    });

    console.log(this.questionList);
    for(let i=0;i<this.questionList.length;i++){
      this.questionIdList.push(this.questionList[i].id)
    }

  },
  methods:{

      stampConvertToDate(stamp){
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

    }
  }
})
</script>

<style scoped>

</style>