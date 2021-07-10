<template>
  <v-card color="indigo lighten-5 " light width="1000" class="ma-4 pa-2 ">
    <v-card-text class="headline mb-0"  >
      <v-chip dark class="ma-4" color="indigo">{{type}}</v-chip>
      {{quesBody}}
    </v-card-text>
    <div v-if="isSelect" style="margin-top: 0">
      <form v-for="btn in btnGroup" :key="btn.option" class="mt-2 mb-2 ml-6 pa-2">
        <v-btn
            class="mx-2"
            fab
            dark
            x-small
            :key="btn.option"
            v-bind:color="btn.color"
     >{{btn.option}}

        </v-btn>
        <span style="margin-left: 15px">{{btn.content}}</span>
      </form>
    </div>
    <v-form v-if="isBlank" class="ml-10 mr-10 mt-0 pa-0">
      <v-text-field
          :background-color="userAnswer.length===0? null:(userAnswer===showAnswer? 'blue lighten-4':'red lighten-4')"
          v-model="userAnswer"
          :label="userAnswer.length===0? showAnswer :''"
          disabled>
      </v-text-field>
    </v-form>
    <v-divider v-if="showAnalysis&&!isBlank"  ></v-divider>
    <v-card-text v-if="showAnalysis">
      <v-chip dark class="ma-4" color="teal lighten-3">解析</v-chip>
      {{answer}} : {{analysis}}
    </v-card-text>

  </v-card>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  //习题展示卡，可以展示用户作答信息和标准答案的比对，也可以只展示习题信息
  name: "QuestionItem",
  props:{
    quesId:{
      type:Number,
      default:0,
    },
    teacherId:{
      type:Number,
      default: 0,
    },
    courseId:{
      type:Number,
      default:0,
    },
    type:{
      type:String,
      default:"单选",
    },
    content:{
      type:String,
      default:"",
    },
    answer: {
      type:String,
      default:""
    },
    analysis:{
      type:String,
      default:""
    },
    showAnalysis:{
      type:Boolean,
      default:false,
    },
    userAnswer:{
      type:String,
      default:""
    }

  },
  data(){
    return{

      isCorrect:false,
      answerList:[],
      quesBody:"",
      isSelect:false,
      isBlank:false,
      nonSelectedBtnColor:"indigo", //选中选项按钮颜色
      selectedBtnColor:"orange",  //未选中颜色
      btnColor:"indigo",
      btnGroup:[],
      showAnswer:"",
    }
  },
  mounted() {
    if(this.type!="填空"){
      let correcntAnswerList=this.answer.split("")
      this.isSelect=true;
      this.answerList=this.content.split("#~#").slice(1);//选项列表
      this.quesBody=this.content.split("#~#")[0];//题干
     // 为每一道选择类题目设置选项答案展示
      for(let i=0;i<this.answerList.length;i++){
        let option=this.answerList[i].split(".",1)  //选项标志
        let content=this.answerList[i].replace(option+".","")   //选项内容
      //  console.log(correcntAnswerList.indexOf(option[0])>=0)
        if(correcntAnswerList.indexOf(option[0])>=0){
          //如果正确答案里有这个选项标记为选出
          this.btnGroup.push({"option":option[0],"color":this.selectedBtnColor,"content":content,"type":this.type})
        }else{
          //没有该选项标记为未选中状态
          this.btnGroup.push({"option":option[0],"color":this.nonSelectedBtnColor,"content":content,"type":this.type})
        }

      }
   // console.log(this.btnGroup)

    } else{
      this.showAnswer=this.answer;
      this.isBlank=true;
      this.quesBody=this.content;
    }
    if(this.userAnswer.length>0 && this.type!="填空"){
      //选择题如果传入了用户选项记录则设置答案对比
      var userList=this.userAnswer.split('')//用户答案列表
      for(let i=0;i<this.btnGroup.length;i++){
        for(let j=0;j<userList.length;j++){
          if(this.btnGroup[i].option===userList[j]){
            if(this.btnGroup[i].color===this.selectedBtnColor){
              //答案相同标记正确
              this.btnGroup[i].color="blue lighten-1";
              break;
            }else{

              this.btnGroup[i].color="red lighten-1";
            }
          }
        }
      }
    }

  },
  methods:{
  }
})
</script>

<style scoped>

</style>