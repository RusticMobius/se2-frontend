<template>
  <div>
    <v-container class="ma-8 pa-4">
      <v-row>
        <router-link :to="`/teacher/create`">
          <v-btn class="ma-4 mb-8" large rounded dark color="indigo">
            <v-icon left dark large>
              mdi-plus
            </v-icon>
            添加课程
          </v-btn>
        </router-link>
      </v-row>

      <v-row>
        <course-item-teacher
          v-for="course in courseList"
          :key="course.id"
          :courseName="course.name"
          :courseId="course.id"
          :description="course.intro"
          :type="course.type"
          :cost="course.cost"
          :bought="course.bought"
          :manageable="course.manageable"
          :course-color="colorList[course.id % colorList.length]"
        >
        </course-item-teacher>
      </v-row>

      <v-row>
        <router-link :to="`/teacher/createTest`">
          <v-btn class="ma-4 mb-8" rounded large dark color="indigo">
            <v-icon left dark large>
              mdi-plus
            </v-icon>
            添加测试
          </v-btn>
        </router-link>
      </v-row>
      <v-row>
        <test-item-teacher
            v-for="test in testList"
            :key="test.id"
            :test-name="test.testName"
            :test-id="test.id"
            :end-time="test.endTime"
            :start-time="test.startTime"
            :test-length="test.length"
            :course-name="test.courseName"
        >
        </test-item-teacher>
      </v-row>

      <v-row>
        <router-link :to="{path:`/teacher/createQuestion`,query:{courseName:''}}">
          <v-btn class="ma-4 mb-8" rounded large dark color="indigo">
            <v-icon left dark large>
              mdi-plus
            </v-icon>
            添加题目
          </v-btn>
        </router-link>
      </v-row>
      <v-row>
        <course-ques-base-item
            v-for="item in courseList"
            :key="item.id"
            :course-name="item.name"
            :course-id="item.id"
            :course-color="baseColorList[(item.id) % baseColorList.length]"
        >

        </course-ques-base-item>
      </v-row>


    </v-container>
  </div>
</template>

<script>
import CourseQuesBaseItem from "@/components/CourseQuesBaseItem";
import TestItemTeacher from "@/components/TestItemTeacher";
import CourseItemTeacher from "@/components/CourseItemTeacher.vue";


import { getTeacherCourses } from "@/api/course";
import {getTestByTeacher} from "@/api/test";

export default {
  name: "CourseList",
  components: {
    CourseQuesBaseItem,
    TestItemTeacher,
    CourseItemTeacher,


  },
  data() {
    return {
      colorList: ["#26A69A", "#00B0FF", "#5C6BC0", "#FFB300", "#E57373"],
      baseColorList:["#7986CB","#ffcc58","#4DB6AC","#ff5991"],
      courseList: null,
      testList:[
      ],
      showAnalysis:true,

    };
  },
  mounted() {
    const uid = window.localStorage.getItem("userId");
    if (uid) {
      getTeacherCourses(uid).then(res => {
        //console.log("GTC1"+res);
        this.courseList = res || [];
      });
      getTestByTeacher(uid).then(res=>{
        this.testList=res||[];
        console.log(this.testList);

      })
      console.log(this.testList)
    }
  },
  methods:{

  }
};
</script>
