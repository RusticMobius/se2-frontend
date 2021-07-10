import axios from "axios";
import {QUESTION_MODULE} from "./_prefix";


/**
 * 创建一个题目 POST question/create
 * @param {*} payload
 * @returns
 */
export const createQuestion = payload => {
  const {
    teacherId,
    courseId,
    content,
    answer,
    analysis,
    type
  } = payload;
  return axios
    .post(`${QUESTION_MODULE}/create`, {
      teacherId,
      courseId,
      content,
      answer,
      analysis,
      type
    })
    .then(res => {
      return res.data;
    });
};
/**
 * 获取课程的题库 GET question/get_course/{cid}
 * @param {*} 课程id cid
 * @returns
 */
export const getQuestionByCourseId = cid => {
  return axios.get(`${QUESTION_MODULE}/get_course/${cid}`).then(res => {
      return res.data;
    });
};
/**
 * 通过测试id获取所有题目 GET question/get_test/{tid}
 * @param {*} 测试id tid
 * @returns
 */
export const getQuestionByTestId = tid => {
  return axios.get(`${QUESTION_MODULE}/get_test/${tid}`).then(res => {
      return res.data;
    });
};

/**
 * 按题目id获取题目 GET question/get/{qid}
 * @param {*} 题目id qid
 * @returns
 */
export const getQuestionById = qid => {
  return axios.get(`${QUESTION_MODULE}/get/${qid}`).then(res => {
      return res.data;
    });
};