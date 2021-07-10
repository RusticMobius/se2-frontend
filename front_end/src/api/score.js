import axios from "axios";
import {SCORE_MODULE} from "./_prefix";


/**
 * 创建一个作答信息 POST score/create
 * @param {*} payload
 * @returns
 */
export const createScore = payload => {
  const {
    questionId,
    studentId,
    testId,
    score,
    info
  } = payload;
  return axios
    .post(`${SCORE_MODULE}/create`, {
      questionId,
      studentId,
      testId,
      score,
      info
    })
    .then(res => {
      return res.data;
    });
};
/**
 * 获取题目作答信息 GET score/get/{sid}
 * @param {*} payload
 * @returns
 */
export const getScore = payload => {
  const { sid, questionId, testId } = payload;
    return axios
      .get(`${SCORE_MODULE}/get/${sid}?testId=${testId}&questionId=${questionId}`)
      .then(res => {
        return res.data;
      });
};