<template>
  <v-card :color="courseColor" dark width="380" height="200" class="ma-4 pa-2">
    <v-card-title class="headline">
      {{ courseName }}
    </v-card-title>
    <v-card-actions>
      <router-link :to="{path:`/teacher/createQuestion`,query:{courseName:courseName}}">
        <v-btn text >创建题目</v-btn>
      </router-link>
      <router-link :to="{path:`/teacher/showCourseBase/${courseId}`,query:{courseName:courseName}}">
        <v-btn text >查看题目</v-btn>
      </router-link>
    </v-card-actions>
  </v-card>

</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "CourseQuesBaseItem",
  props:{
    courseId:{
      type:Number,
      default:null
    },
    courseName:{
      type:String,
      default:null,
    },
    courseColor:{
      type:String,
      default: null
    }
  },
  data(){
    return{
      baseSize:null,
    }
  },
  mounted() {
    this.baseSize=0;
  }

})
</script>

<style scoped>

</style>