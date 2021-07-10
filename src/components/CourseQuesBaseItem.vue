<template>
  <v-card :color="courseColor" dark width="380" height="200" class="ma-4 pa-2">
    <v-card-title class="headline">
      {{ courseName }}
    </v-card-title>
    <v-card-text class="text">
      题目数量：{{baseSize}}
    </v-card-text>
    <v-card-actions>
      <router-link :to="`/teacher/createQuestion`">
        <v-btn text >创建题目</v-btn>
      </router-link>
    </v-card-actions>
  </v-card>

</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "CourseQuesBaseItem",
  props:{
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