import axios from "axios";
import {TEST_MODULE} from "./_prefix";


/**
 * 创建一个测试 POST test/create
 * @param {*} payload
 * @returns
 */
export const createTest = payload => {
  const {
    courseId,
    teacherId,
    startTime,
    endTime,
    testName,
    courseName,
    length
  } = payload;
  return axios
    .post(`${TEST_MODULE}/create`, {
      courseId,
      teacherId,
      startTime,
      endTime,
      testName,
      courseName,
      length
    })
    .then(res => {
      return res.data;
    });
};

/**
 * 按教师用户id GET test/get/{cid}
 * @param {*} uid
 * @returns
 */
export const getTestByTeacher = uid => {
  return axios.get(`${TEST_MODULE}/get_teacher/${uid}`).then(res => {
      return res.data;
    });
};

/**
 * 按课程id GET test/get_course/{cid}
 * @param {*} uid
 * @returns
 */
export const getTestByCourse = cid => {
  return axios.get(`${TEST_MODULE}/get_course/${cid}`).then(res => {
      return res.data;
    });
};

/**
 * 按测试id获取test GET test/{tid}
 * @param {*} tid
 * @returns
 */
export const getTestById = tid => {
  return axios.get(`${TEST_MODULE}/get/${tid}`).then(res => {
      return res.data;
    });
};

