const schedule = require('node-schedule');
import { testService } from '../services/testService';

const finishTest = async function (testId, exam, dateStart, duration) {
    var dateStartGet = new Date(dateStart);
    const dateStartGet2 = new Date(dateStart);
    var durationGet = duration;
    var dateExamEnd = new Date(exam.endTime);
    const specificTime = dateStart;
    specificTime.setHours(specificTime.getHours() - 7);
    dateStartGet.setMinutes(dateStart.getMinutes() + durationGet);
    if (dateStartGet > exam.endTime) {
        durationGet = (dateExamEnd - dateStartGet2) / (60000);
    }
    console.log("Duration: " + durationGet);

    const timeAfter40Minutes = new Date(specificTime.getTime() + durationGet * 60000);

    const job = schedule.scheduleJob(timeAfter40Minutes, async function () {
        try {
            const test = await testService.getTestById(testId);
            const date = new Date();
            date.setHours(date.getHours() + 7);

            test.endTime = date;
            test.status = "FINISHED";
            test.total = 0;
            test.correct = 0;
            test.point = 0;
            for (var i = 0; i < test.answers.length; i++) {
                if (test.answers[i].typeQ === "CHOICE") {
                    test.total += 1;
                    if (test.answers[i].result[0].correct) {
                        test.point += test.answers[i].result[0].point;
                        test.correct += 1;
                    }
                } else {
                    for (var j = 0; j < exam.questions[i].answers.length; j++) {
                        test.total += 1;
                        if (test.answers[i].result[j].correct) {
                            test.point += test.answers[i].result[j].point;
                            test.correct += 1;
                        }
                    }
                }
            }
            const testFinish = await testService.finishTestTimeout(test);
            console.log("Finish test: " + testFinish);
            return testFinish;
        }
        catch (err) {
            console.log(err);
        }

    });
}

export const constFunction = {
    finishTest
}