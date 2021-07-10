import axios from "axios";
import {QUESTION_TEST_MODULE} from "./_prefix";


/**
 * 加入一个题目到测试中 POST question_test/add
 * @param {*} payload
 * @returns
 */
export const addQuestionToTest = payload => {
  const {
    questionId,
    testId
  } = payload;
  return axios
    .post(`${QUESTION_TEST_MODULE}/add`, {
      questionId,
      testId
    })
    .then(res => {
      return res.data;
    });
};