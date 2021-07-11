<template>
  <div>
    <v-alert
        class="alert"
        type="success"
        text
        v-show="showSuccessDialog"
        transition="scroll-y-transition"
    >
      测试创建成功！
    </v-alert>
    <!-- alert -->
    <v-alert
        class="alert"
        type="warning"
        text
        v-show="showFailDialog"
        transition="scroll-y-transition"
    >
      {{ msg }}
    </v-alert>
    <v-container class="pl-16 pr-16">
      <v-toolbar color="deep-purple lighten-2" dark class="mt-10">
        <v-toolbar-title>测试信息</v-toolbar-title>
      </v-toolbar>
      <form class="pa-12 grey lighten-5 mt-8">

        <v-select
            :items="courseNameList"
            v-model="testInfo.courseName"
            label="所属课程"
            @change="setCourseId"
        ></v-select>
        <v-text-field
            v-model="testInfo.testName"
            label="标题"
        ></v-text-field>
        <v-text-field
            v-model="formatStartTime"
            label="起始时间"
            placeholder="格式如 2020-06-18 20：00：00"
        ></v-text-field>
        <v-text-field
            v-model="formatEndTime"
            label="截止时间"
            placeholder="格式如 2020-06-18 20：00：00"
        ></v-text-field>
        <v-select
            :items="testFormatLength"
            v-model="testLength"
            label="题目数量"
        ></v-select>
        <v-text-field
            disabled label="题目列表"
            :value="selectedQuesId"
            v-model="selectedQuesId"
        ></v-text-field>

        <v-btn class="ml-0 mt-8 " @click="submit" color="indigo" dark>
          确认
        </v-btn>
      </form>
      <v-toolbar color="deep-purple lighten-2" dark class="mt-10 mb-10">
        <v-toolbar-title>选择题目 ( {{ selectedQuesId.length }} / {{testLength}} ) 已选{{selectedQuesId.length}}</v-toolbar-title>
      </v-toolbar>
      <v-row v-for="(ques,index) in questionList" :key="index+1">
        <v-checkbox :label="(index+1)+''" :value="ques.id" class="ml-10 mt-4" color="indigo" v-model="selectedQuesId" @change="checkLength"></v-checkbox>
        <question-item
            :key="ques.id"
            :teacher-id="ques.teacherId"
            :course-id="ques.courseId"
            :content="ques.content"
            :analysis="ques.analysis"
            :answer="ques.answer"
            :ques-id="ques.id"
            :type="ques.type"
            :show-analysis=true

        ></question-item>
      </v-row>
    </v-container>

    <!-- 提示对话框 -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> </v-card-title>

        <v-card-text>
          专题创建成功。
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>


<script >
import {createTest} from "@/api/test";
import {getTeacherCourses} from "@/api/course";
import QuestionItem from "../../components/QuestionItem.vue";
import Vue from "vue";
import {addQuestionToTest} from "@/api/question_test";
import {getQuestionByCourseId} from "@/api/question";

export default Vue.extend( {
  name: "TestCreate",//创建测试
  components:{
  QuestionItem,
  },
  data() {
    return {
      testInfo: {
        testName:null,
        teacherId:null,
        courseId: null,
        startTime:null,
        endTime:null,
        length:null,
        courseName:null,
      },
      selectedQuesId:[],
      testFormatLength:[5,10,20,25],
      testLength:0,
      time:null,
      types: ["单选", "多选"],
      courseList:[],
      courseNameList:[],
      formatStartTime:null,
      formatEndTime:null,
      tests:[],
      testLists:[1,2,3],
      dialog: false,
      showSuccessDialog: false,
      showFailDialog: false,
      msg: "",
      questionList:[]
    };
  },
  mounted() {
    const uid = window.localStorage.getItem("userId");
    if (uid) {
      getTeacherCourses(uid).then(res => {
        //获取教师所有课程
        for(var i=0;i<res.length;i++){
          //console.log(res[i])
          this.courseNameList.push(res[i].name);
          this.courseList.push({"name":res[i].name,"id":res[i].id})
        }
      });

    }

  },
  methods: {
    checkDateFormat(){
      //检查日期格式，保证写入数据的正确性
      var reDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
      var isStartTime = reDateTime.test(this.formatStartTime);
      var isEndTime=reDateTime.test(this.formatEndTime);
      if(isStartTime===false) {
        this.msg="起始日期格式有误"
        return true;
      }
      if(isEndTime===false){
        this.msg="截止日期格式有误"
        return true;
      }

      return false;

    },
    setCourseId() {
      this.selectedQuesId=[];
      //设置课程id用于创建测试
      this.questionList=[];
      for (let i = 0; i < this.courseList.length; i++) {
        if (this.testInfo.courseName === this.courseList[i].name) {
          this.testInfo.courseId = this.courseList[i].id;
          console.log(this.testInfo.courseId)
        }
      }
      getQuestionByCourseId(this.testInfo.courseId).then(res=>{
        //获取所选课程的问题库，在其中进行选择
          for(let i=0;i<res.length;i++){
        this.questionList.push(res[i]);
        }
      });

    },
    submit() {
      console.log("I'm submiting")
      if( this.checkDateFormat()) {
        this.showFailDialog=true;
        setTimeout(() => {
          this.showFailDialog = false;
        }, 1000);
      }else{
        //转换时间格式
        this.testInfo.startTime = this.dateConvertToStamp(this.formatStartTime);
        this.testInfo.endTime = this.dateConvertToStamp(this.formatEndTime);
        var currentTime = new Date().getTime();
        if (this.selectedQuesId.length > this.testLength) {
          this.showFailDialog = true;
          this.msg = "所选题目数量超过设置的题目数量";
          setTimeout(() => {
            this.showFailDialog = false;
          }, 1000);
        } else if (this.selectedQuesId.length < this.testLength) {
          this.showFailDialog = true;
          this.msg = "所选题目数量不足";
          setTimeout(() => {  //检查题目数量
            this.showFailDialog = false;
          }, 1000);
        } else if (this.testInfo.endTime === "" || this.testInfo.endTime === null ||
            this.testInfo.startTime === "" || this.testInfo.startTime === null ||
            this.testInfo.courseId === "" || this.testInfo.courseId === null ||
            this.testInfo.name === "" || this.testInfo.name === null) {
          this.showFailDialog = true;
          this.msg = "必填信息不能为空";  //检查测试相关信息完全
          setTimeout(() => {
            this.showFailDialog = false;
          }, 1000);
        } else if (this.testInfo.endTime<=currentTime){
          this.showFailDialog = true;
          this.msg="不能创建已经截止的考试"
          setTimeout(() => {
            this.showFailDialog = false;
          }, 1000);

        } else if (this.testInfo.startTime >= this.testInfo.endTime) {
          this.showFailDialog = true;
          this.msg = "起止时间非法";    //起始时间不能晚于或等于截止时间
          setTimeout(() => {
            this.showFailDialog = false;
          }, 1000);
        } else {

          const uid = window.localStorage.getItem("userId");
          this.testInfo.teacherId = uid;
          console.log(this.testLength);
          this.testInfo.length = this.testLength;
          const payload = {
            ...this.testInfo
          };
          if (uid) {
            console.log(payload);
            createTest(payload).then(res => {
              console.log(res);
              if (res.code === 1) { //创建测试信息
                const tid = res.data.id;
                console.log(tid)
                for(let index=0;index<this.selectedQuesId.length;index++){
                  var record={
                    "questionId":this.selectedQuesId[index],
                    "testId":tid
                  }
                  addQuestionToTest(record).then(res=>{
                    console.log(res)  //为测试中的所有问题添加记录
                  })
                }
                this.showSuccessDialog = true;
                setTimeout(() => {
                  this.showSuccessDialog = false;
                }, 1000);
              } else {
                this.showFailDialog = true;
                this.msg = res.msg;
                setTimeout(() => {
                  this.showFailDialog = false;
                }, 1000);
              }
            });
          }

        }

      }
    },
    dateConvertToStamp(date) {//日期转换为时间戳
      date = date.replace(new RegExp("-", "gm"), "/");
      var stamp = (new Date(date)).getTime(); //得到毫秒数
      console.log(stamp);
      return stamp;
    },
    checkLength() {//检查题目数量是否等于设置的题目数，两者必须相等
      // console.log("checking")
      if (this.testLength === 0) {
        this.showFailDialog = true;
        this.msg = "未设置题目数量";
        setTimeout(() => {
          this.showFailDialog = false;
        }, 1000);
      } else if (this.selectedQuesId.length > this.testLength) {

        this.showFailDialog = true;
        this.msg = "所选题目数量超过设置的题目数量";
        setTimeout(() => {
          this.showFailDialog = false;
        }, 1000);
      }
    },
  }

})

</script>

<style scoped>
.alert {
  position: fixed;
  left: 50%;
  top: 200px;
  z-index: 999;
}
</style>