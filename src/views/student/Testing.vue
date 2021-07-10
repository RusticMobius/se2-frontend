<template>
  <div>
    <v-alert
      class="alert"
      outlined
      type="success"
      text
      v-show="showSuccessDialog"
      transition="scroll-y-transition"
  >
    测试提交成功！
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
  <v-container>

    <v-toolbar color="indigo lighten-1" dark class="mt-10 mb-10">
      <v-toolbar-title>{{testName}}</v-toolbar-title>
    </v-toolbar>

    <v-row
        v-for="(ques,index) in questionList"
        :key="ques.index">

      <v-chip  outlined dark class="ma-6" color="indigo">
        {{index+1}}
      </v-chip>
      <qusetion-item-student @getAnswer="processAnswer"
          v-if="isTesting&&!hasSubmitted"
          :in-test-duration=true
          :teacher-id="ques.teacherId"
          :course-id="ques.courseId"
          :content="ques.content"
          :analysis="ques.analysis"
          :answer="ques.answer"
          :ques-id="ques.id"
          :type="ques.type"
      >
      </qusetion-item-student>
      <question-item
          v-if="hasSubmitted"
          :key="ques.id"
          :teacher-id="ques.teacherId"
          :course-id="ques.courseId"
          :content="ques.content"
          :analysis="ques.analysis"
          :answer="ques.answer"
          :ques-id="ques.id"
          :type="ques.type"
          :show-analysis="true"
          :user-answer="correctScoreList[index].info===undefined?'':correctScoreList[index].info"
      >
      </question-item>
      <question-item
          v-if="!isTesting&&!hasSubmitted"
          :key="ques.id"
          :teacher-id="ques.teacherId"
          :course-id="ques.courseId"
          :content="ques.content"
          :analysis="ques.analysis"
          :answer="ques.answer"
          :ques-id="ques.id"
          :type="ques.type"
          :show-analysis="true"
      >

      </question-item>

      <v-chip v-if="hasSubmitted"
              dark
              large
              class="ma-6"
              :color="correctScoreList[index].score===10?'blue lighten-1':(correctScoreList[index].score===5?'orange':'red lighten-1')"
      ><v-avatar left>
        <v-icon v-if="correctScoreList[index].score===10">mdi-checkbox-marked-circle</v-icon>
        <v-icon v-if="correctScoreList[index].score!==10">mdi-close-circle </v-icon>
      </v-avatar>
        你的答案 : {{correctScoreList[index].info}}
      </v-chip>

      </v-row>

    <v-toolbar v-if="isTesting&&!hasSubmitted" color="indigo lighten-1" dark class="mt-10 mb-10">
      <v-toolbar-title >本次测试共{{questionList.length}}道题目，您已作答{{answerNum}}道，提交后不可更改</v-toolbar-title>
      <v-btn class="ml-16" @click="checkEnd" color="orange" rounded outlined dark v-if="!hasSubmitted">
        确认提交
      </v-btn>
    </v-toolbar>
    <v-toolbar v-if="hasSubmitted" color="indigo lighten-1" dark class="mt-10 mb-10">
      <v-toolbar-title>本次测试共{{testLength}}道题目，您共答对了{{correctCount+halfCorrectCount}}道题目，{{halfCorrectCount>0?"其中"+halfCorrectCount+"道没有选出所有的正确答案":""}}，总得分为{{totalScore}}</v-toolbar-title>
    </v-toolbar>
    <v-toolbar v-if="!hasSubmitted&&!isTesting" color="indigo lighten-1" dark class="mt-10 mb-10">
      <v-toolbar-title>您未参与本次测试</v-toolbar-title>
    </v-toolbar>

  </v-container>
  </div>

</template>

<script>
import QusetionItemStudent from "@/components/QusetionItemStudent";
import {getQuestionByTestId} from "@/api/question";
import {createScore} from "@/api/score";
import {getScore} from "@/api/score";
import {getTestById} from "@/api/test";
import QuestionItem from "@/components/QuestionItem";

export default {
  name: "Testing",
  components:{
    QusetionItemStudent,
    QuestionItem
  },
  data(){
    return{
      scoreList:[],
      questionList:[],
      isTesting:null,   //是否在测试进行的日期内
      hasSubmitted:false,   //是否已经提交测试
      testName:"",
      testLength:null,
      userAnswerList:[],  //用户作答信息
      answerNum:0,
      dialog: false,
      showSuccessDialog: false,
      showFailDialog: false,
      msg: "",
      correctCount:0,   //全对题目计数
      halfCorrectCount:0, //半对计数
      totalScore:0, //总分
      endTime:null,
      correctScoreList:[]//校准分数列表
    }
  },
  mounted() {
    const tid=this.$route.params.testId;
    //检查是否处于测试时间内
    this.isTesting=(this.$route.query.state==="false"? false:true);
    console.log(this.isTesting)
    console.log(this.userAnswerList)
    getTestById(tid).then(res=>{
      this.testName=res.testName;
      this.testLength=res.length;
      this.endTime=res.endTime;
      console.log(this.testLength)
    })
    getQuestionByTestId(tid).then(res=>{
      //获取测试下设置的所有问题
      console.log(res);
      this.questionList=res||[];
      for(let i=0;i< this.questionList.length;i++){
        this.userAnswerList.push({"questionId":this.questionList[i].id,
          "info":"",
          "score":0})
      }
      this.processScore();//测试得分处理，如果有得分记录则测试已经提交，没有则未提交

    })


  },
  watch:{
    "scoreList":{//监视得分情况变化，有得分纪录则已经提交测试，限制二次提交
      handler:function (val){
        //console.log(val)

        if(val.length===this.questionList.length){
          this.hasSubmitted=true;

          //console.log("calaulating")
          for(let i=0;i<this.questionList.length;i++){
            //异步导致需要校准
            for(let j=0;j<this.scoreList.length;j++){
              //console.log(this.questionList[i].id,this.scoreList[j].questionId)
              if(this.questionList[i].id===this.scoreList[j].questionId){
                //console.log("equal")
                this.correctScoreList.push(this.scoreList[j]);
                break;
              }
            }
          }
          console.log(this.correctScoreList)
          for(let i=0;i<val.length;i++){
            if(this.scoreList[i].score===10){
              this.correctCount+=1;
              this.totalScore+=10;
            }else if(this.scoreList[i].score===5){
              this.halfCorrectCount+=1;
              this.totalScore+=5;
            }
          }

        console.log(this.totalScore)
          console.log(this.scoreList.length)
        console.log(10/this.scoreList.length)
         let temp=(100/parseInt(this.testLength))*parseInt(this.totalScore)/10;
          this.totalScore=temp;
          console.log(temp)
        }
      }
    }
  },
  methods:{


    processScore(){
      //处理得分纪录
      console.log("process score")
      const uid=window.localStorage.getItem("userId");
      const tid=this.$route.params.testId;
      console.log(this.questionList)
      for(let i=0;i<this.questionList.length;i++){
        console.log(uid)
        var sid=uid;
        var questionId=this.questionList[i].id;
        var testId=tid;
        getScore({questionId,sid,testId}).then(res=>{

          console.log(res)
          this.scoreList.push({"questionId":res.questionId,
        "testId":res.testId,"studentId":res.studentId,"info":res.info,
          "score":res.score});

        })

      }
    },
    processAnswer(questionId,answer,score){
      //处理用户答案，计算得分和作答数目
      console.log(this.scoreList.length,this.questionList.length)
      this.answerNum=0;
      console.log(answer,questionId,score);
      for(let i=0;i<this.userAnswerList.length;i++){
        //console.log(this.userAnswerList[i].questionId)
        //console.log(questionId)
        if(this.userAnswerList[i].questionId===questionId){
          this.userAnswerList[i].info=answer;
          this.userAnswerList[i].score=score;

        }
        if(this.userAnswerList[i].info!==""){
          this.answerNum+=1;
        }
        //console.log(this.answerNum)
      }
     // console.log(this.answerNum)
    },
    checkEnd(){
      var currentTime = new Date().getTime();
      console.log(currentTime,this.endTime)
      if(currentTime>=this.endTime) {//检查提交时间是否在截止时间之前
        this.showFailDialog = true;
        this.msg = "提交逾期，考试已截止";
        setTimeout(() => {
          this.showFailDialog = false;
          this.isTesting = false;
          this.$router.go(0)
        }, 1000);
      }  //刷新页面
      else{
        this.submit()
      }
    },
    submit(){
      console.log("I'm submiting")
      console.log(this.userAnswerList)
      //检查是否答完所有题目
      for(let i=0;i<this.userAnswerList.length;i++){
        if(this.userAnswerList[i].userAnswer===""){
          this.showFailDialog = true;
          this.msg = "未答完所有题目";
          setTimeout(() => {
            this.showFailDialog = false;
          }, 1000);
          break;
        }
      }
      console.log(this.userAnswerList)
      const uid=window.localStorage.getItem("userId");
      const tid=this.$route.params.testId;
      //为每一个问题提交分数记录
      for(let i=0;i<this.userAnswerList.length;i++){
        const payload={
          ...this.userAnswerList[i],
          studentId:uid,
          testId:tid,
        }
        console.log(payload)
        createScore(payload).then(res=>{
          console.log(res)
        })
      }
      console.log(this.hasSubmitted)
      this.hasSubmitted=true;
      this.processScore();
      this.$router.go(0)
      //刷新页面
    }
  }
}
</script>

<style scoped>
.alert {
  position: fixed;
  left: 50%;
  top: 200px;
  z-index: 999;
}
</style>