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
        console.log(textXml.childNodes);
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
// Load the docx file as binary content
const questionRegex = /^(\d*\.|Câu \d+). */; // This regex is used to detect the question e.g. 1. or Câu 1.
const answerRegex = /^(\*[A-Z]|[A-Z]\.). */; // This regex is used to detect the answer e.g. A. or B.
const correctAnswerRegex = /^\*[A-Z].*/; // This regex is used to detect the correct answer e.g. *A. or *B.
function convertArrayToJSON(inputArray: string[]) {
  const resultArray = [];
  let currentQuestion: IQuestion | null = null;
  let currentId = 1;
  for (let i = 0; i < inputArray.length; i++) {
    const currentItem = inputArray[i].trim();
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
          correctIndexes: null,
        }, // This field is not used in the current version of the app
        isError: false,
        title: currentItem.replace(questionRegex, "").trim(), // Remove the question number e.g. 1. or Câu 1.
      };
    }

    if (answerRegex.test(currentItem) || (correctAnswerRegex.test(currentItem) && currentQuestion !== null)) {
      currentQuestion?.answerOptions?.options?.push(currentItem.replace(answerRegex, "").trim());
      if (correctAnswerRegex.test(currentItem) && currentQuestion !== null) {
        currentQuestion.answerOptions.correctIndex = currentQuestion.answerOptions.options.length - 1;
      }
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
