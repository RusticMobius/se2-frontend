<template>
  <v-card color="indigo lighten-5 " light width="800" class="ma-4 pa-2 ">
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
            @click="setBtnColor(btn.option)">{{btn.option}}

        </v-btn>
        <span style="margin-left: 15px">{{btn.content}}</span>
      </form>
    </div>
    <v-form v-if="isBlank&&testState" class="ml-10 mr-10 mt-0 pa-0">
      <v-text-field label="请填写答案" v-model="userAnswer" @change="submitQuesAnswer">
      </v-text-field>
    </v-form>
    <v-form v-if="isBlank&&!testState" class="ml-10 mr-10 mt-0 pa-0">
      <v-text-field  :label="showAnswer" v-model="userAnswer" disabled>
      </v-text-field>
    </v-form>
    <v-divider v-if="!testState&&!isBlank"  ></v-divider>
    <v-card-text v-if="!testState">
      <v-chip dark class="ma-4" color="teal lighten-3">解析</v-chip>
      {{analysis}}
    </v-card-text>

  </v-card>
</template>


<script>
import Vue from "vue";
export default Vue.extend({
  //习题学生视窗，具有作答和回传答案的功能
  name: "QusetionItemStudent",
  props:{
    inTestDuration:{
      type:Boolean,
      default:null,
    },
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

  },
  data(){
    return{
      userAnswer:"",
      isCorrect:false,
      answerList:[],
      quesBody:"",
      isSelect:false,
      isBlank:false,
      nonSelectedBtnColor:"indigo",
      selectedBtnColor:"orange",
      btnColor:"indigo",
      btnGroup:[],
      showAnswer:"",
      testState: this.inTestDuration,
    }
  },
  mounted() {
    console.log(this.hasNotSubmitted)
    if(this.testState){
      //处理答案用于比对
      if(this.type!="填空"){
        this.isSelect=true;
        this.answerList=this.content.split("#~#").slice(1);
        this.quesBody=this.content.split("#~#")[0];
        //console.log(this.answerList)
        for(let i=0;i<this.answerList.length;i++){
          let option=this.answerList[i].split(".",1)
          let content=this.answerList[i].replace(option+".","")
         // console.log(content)
          this.btnGroup.push({"option":option[0],"color":this.nonSelectedBtnColor,"content":content,"type":this.type})
        }
       // console.log(this.btnGroup)

      } else{
        this.isBlank=true;
        this.quesBody=this.content;
      }
    }else{//不在测试状态，这个功能最终没有用到因为参数传递异步的问题不能很好展现答案，答案统一用QusetionItem展示
      if(this.type!="填空"){
        let correcntAnswerList=this.answer.split("")
        this.isSelect=true;
        this.answerList=this.content.split("#~#").slice(1);
        this.quesBody=this.content.split("#~#")[0];
        // console.log(correcntAnswerList)
        for(let i=0;i<this.answerList.length;i++){
          let option=this.answerList[i].split(".",1)
          let content=this.answerList[i].replace(option+".","")
          //  console.log(correcntAnswerList.indexOf(option[0])>=0)
          if(correcntAnswerList.indexOf(option[0])>=0){
            this.btnGroup.push({"option":option[0],"color":this.selectedBtnColor,"content":content,"type":this.type})
          }else{
            this.btnGroup.push({"option":option[0],"color":this.nonSelectedBtnColor,"content":content,"type":this.type})
          }

        }
        // console.log(this.btnGroup)

      } else{
        this.showAnswer=this.answer;
        this.isBlank=true;
        this.quesBody=this.content;
      }}
  },
  methods:{
    setBtnColor(option){
      //作答之后设置选项颜色展示选中状态并设置用户作答信息
      if(this.testState){
        for(let i=0;i<this.btnGroup.length;i++){
          if(this.btnGroup[i].option===option){
            if(this.btnGroup[i].color===this.nonSelectedBtnColor){
              this.btnGroup[i].color=this.selectedBtnColor;
              if(this.btnGroup[i].type==="单选"){
                this.userAnswer=option;
              }else{
                this.userAnswer+=option;
              }
            }else{
              //取消选中
              this.btnGroup[i].color=this.nonSelectedBtnColor;
              if(this.btnGroup[i].type==="单选"){
                this.userAnswer=""; //单选答案置空
              }else{  //  多选删除该答案
                this.userAnswer=this.userAnswer.replaceAll(option,"");
              }
            }
          }else{
            if(this.btnGroup[i].type==="单选"){
              this.btnGroup[i].color=this.nonSelectedBtnColor;
            }
          }
        }
       // console.log(this.userAnswer)
        this.submitQuesAnswer()
      }

    },
    submitQuesAnswer:function (){

      if(this.type!=="多选"){
        if(this.userAnswer===this.answer){//不是多选答案相同直接返回满分
          this.$emit("getAnswer",this.quesId,this.userAnswer,10);
          return;
        }else{
          this.$emit("getAnswer",this.quesId,this.userAnswer,0);
          return;
        }
      }else{//多选的话逐一比对选项，不能直接比较，选项顺序可能不同
        var userAnswerList=this.userAnswer.split('');
        if((userAnswerList.length>this.answer.length)||(userAnswerList.length===0)){
          //选多不选不得分
          this.$emit("getAnswer",this.quesId,this.userAnswer,0);
          return;
        }else{
          let answerList=this.answer.split("");
       //   console.log(answerList,userAnswerList)
          for(let i=0;i<userAnswerList.length;i++){
            if(answerList.indexOf(userAnswerList[i])===-1) {
              //错选不得分
              console.log(userAnswerList[i])
              this.$emit("getAnswer", this.quesId, this.userAnswer, 0);
              return;
            }
          }
          if(userAnswerList.length<answerList.length){
            //少选得一半分
            this.$emit("getAnswer", this.quesId, this.userAnswer, 5);
            return;
          }else{
            this.$emit("getAnswer", this.quesId, this.userAnswer, 10);
            return;
          }
        }
      }
    }
  }

})
</script>

<style scoped>

</style>