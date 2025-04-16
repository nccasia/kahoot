import { EQuestionErrorTypes } from "@/constants/QuestionErrorTypes";
import { EQuestionTypes } from "@/constants/QuestionTypes";
import { IQuestion } from "@/interfaces/questionTypes";
import PizZip from "pizzip";
import { DOMParser } from "xmldom";
function str2xml(str: string) {
  if (str.charCodeAt(0) === 65279) {
    // BOM sequence
    str = str.substr(1);
  }
  return new DOMParser().parseFromString(str, "text/xml");
}
function getParagraphs(content: string | ArrayBuffer) {
  try {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];
    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          if (textsXml.length > 1) {
            fullText = textXml.childNodes[0]?.nodeValue + "\n";
            paragraphs.push(fullText);
            continue;
          }
          fullText += textXml.childNodes[0]?.nodeValue + "\n";
        }
      }
      if (textsXml.length > 1) continue;
      paragraphs.push(fullText);
    }
    return paragraphs;
  } catch (e) {
    console.log(e);
    throw new Error("File không đúng định dạng");
  }
}

function mergeAsterisks(arr: string[]) {
  const result = [];
  let i = 0;

  while (i < arr.length) {
    const item = arr[i].trim().replace(/\n/g, ""); // Xóa ký tự xuống dòng

    if (item === "*") {
      // Nếu là "*", nối với phần tử phía sau
      if (i + 1 < arr.length) {
        result.push("*" + arr[i + 1].trim().replace(/\n/g, ""));
        i += 2; // Bỏ qua phần tử tiếp theo vì đã nối
        continue;
      }
    } else if (item === "**") {
      // Nếu là "**", nối với phần tử trước và sau
      if (result.length > 0 && i + 1 < arr.length) {
        result[result.length - 1] += "**" + arr[i + 1].trim().replace(/\n/g, "");
        i += 2; // Bỏ qua phần tử tiếp theo vì đã nối
        continue;
      }
    } else {
      result.push(item);
    }
    i++;
  }

  return result;
}

// Load the docx file as binary content
const questionRegex = /^(\d*\.|Câu \d+). */; // This regex is used to detect the question e.g. 1. or Câu 1.
const answerRegex = /^(\*[A-Z]|[A-Z]\.). */; // This regex is used to detect the answer e.g. A. or B.
const correctAnswerRegex = /^\*[A-Z].*/; // This regex is used to detect the correct answer e.g. *A. or *B.
let mode = "";
let isCheckMode = false;
let answerText = "";
let isEndAnswerText = false;
function convertArrayToJSON(inputArray: string[]) {
  const newInputArray = mergeAsterisks(inputArray);
  console.log("newInputArray", newInputArray);
  const resultArray = [];
  let currentQuestion: IQuestion | null = null;
  let currentId = 1;
  for (let i = 0; i < newInputArray.length; i++) {
    const currentItem = newInputArray[i].trim();
    if (questionRegex.test(currentItem)) {
      // This is a new question
      if (currentQuestion !== null) {
        resultArray.push(currentQuestion);
        currentId++;
      }
      currentQuestion = {
        id: currentId.toString(),
        mode: "single_choice", // Default mode is single
        time: 30, // Default time is 30 seconds
        answerOptions: {
          options: [],
          correctIndex: null,
          correctIndexes: [],
        }, // This field is not used in the current version of the app
        questionStatus: EQuestionErrorTypes.NO_ERROR,
        answerText: "",
        title: currentItem.replace(questionRegex, "").trim(), // Remove the question number e.g. 1. or Câu 1.
      };
      mode = ""; // Reset mode for each question
      answerText = ""; // Reset answer text for each question
      isEndAnswerText = false; // Reset end answer text for each question
      isCheckMode = false; // Reset check mode for each question
    }

    // console.log("currentItem", currentItem);
    if (answerRegex.test(currentItem) || (correctAnswerRegex.test(currentItem) && currentQuestion !== null)) {
      currentQuestion?.answerOptions?.options?.push(currentItem.replace(answerRegex, "").trim());
      if (correctAnswerRegex.test(currentItem) && currentQuestion !== null) {
        currentQuestion.answerOptions.correctIndex = currentQuestion.answerOptions.options.length - 1;
        currentQuestion.answerOptions.correctIndexes?.push(currentQuestion.answerOptions.options.length - 1);
      }
    }

    if ((currentItem.includes("*answer**") || currentItem.includes("*answer*")) && currentQuestion && !isEndAnswerText) {
      isEndAnswerText = true;
    }
    if (isEndAnswerText && currentQuestion) {
      answerText += currentItem.trim();
    }
    if (
      (currentItem.includes("**answer*") ||
        (currentItem.includes("*answer*") && newInputArray[i - 1].endsWith("*")) ||
        (currentItem.includes("answer*") && newInputArray[i - 1].endsWith("**"))) &&
      isEndAnswerText &&
      currentQuestion
    ) {
      isEndAnswerText = false;
      answerText = answerText
        .replace(/\*answer\*\*/, "")
        .replace(/\*\*answer\*/, "")
        .trim();
      currentQuestion.answerText = answerText;
      answerText = ""; // Reset answer text for each question
    }

    if (currentItem.includes("*mode-") && currentQuestion !== null) {
      isCheckMode = true;
    }
    if (isCheckMode) {
      mode = mode + currentItem.trim();
    }
    if (currentItem.includes("-mode*") && isCheckMode && currentQuestion !== null) {
      const modeMatch = mode
        .replace(/\*mode-/, "")
        .replace(/-mode\*/, "")
        .trim()
        .toUpperCase();
      switch (modeMatch.trim()) {
        case "SQ":
          currentQuestion.mode = EQuestionTypes.SINGLE_CHOICE;
          break;
        case "MQ":
          currentQuestion.mode = EQuestionTypes.MULTIPLE_CHOICE;
          break;
        case "TQ":
          currentQuestion.mode = EQuestionTypes.TEXT;
          break;
        default:
          currentQuestion.mode = EQuestionTypes.SINGLE_CHOICE; // Default mode is single
          break;
      }
      mode = ""; // Reset mode for each question
      isCheckMode = false;
    }
  }
  // Push the last question
  resultArray.push(currentQuestion);
  return resultArray;
}
const importQuestion = (content: string | ArrayBuffer) => {
  // const content = fs.readFileSync(filepath, "binary");
  try {
    const inputArray = getParagraphs(content);
    const jsonArray = convertArrayToJSON(inputArray);
    return {
      isSuccess: true,
      data: jsonArray,
      message: "Import question successfully",
    };
  } catch (e) {
    console.log("Error", e);
    return {
      isSuccess: false,
      data: null,
      message: e,
    };
  }
};
export default importQuestion;
