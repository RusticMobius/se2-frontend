<template>
  <v-container class="pl-16 pr-16">
    <v-toolbar color="deep-purple lighten-2" dark class="mt-10 mb-10">
      <router-link :to="{path:`/teacher/createQuestion`,query:{courseName:courseName}}">
        <v-btn  depressed class="ml-4 mr-4" fab dark color="orange" small >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </router-link>
      <v-toolbar-title>{{courseName}} [ {{this.questionList.length}} 题 ]</v-toolbar-title>
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

<script>
import Vue from "vue";
import QuestionItem from "@/components/QuestionItem";
import{getQuestionByCourseId} from "@/api/question";

export default Vue.extend({
  //课程习题库页面

  name: "CourseQuestionBase",
  components:{
    QuestionItem,
  },
  data(){
    return{
      questionList:[],
      showAnalysis: true,//展示解析
      courseName:"",
    }
  },
  mounted() {
    this.courseName=this.$route.query.courseName;
    const cid = this.$route.params.courseId;
    getQuestionByCourseId(cid).then(res=>{
      //按课程ID获取课程习题
      for(let i=0;i<res.length;i++){
        this.questionList.push(res[i])
        console.log(res[i])
      }
    })
  }
})
</script>

<style scoped>

</style>