export interface ReadingQuestionOption {
  _id: string;
  
  key: string;

  text: string;
}

export interface TestReadingQuestion {
  _id: string;
  
  questionText: string;

  blankNumber: number;

  options: ReadingQuestionOption[];
}

export interface TestReadingQuestionAnswer {
  questionId: string;

  studentAnswer: string;

  question: TestReadingQuestion;
}

export interface TestReadingQuestionGroup {
  _id: string;

  answerList: string;

  directionText: string;

  image: string;

  questionBox: string;

  questionType: string;

  groupNumber: number;

  questions: TestReadingQuestionAnswer[];
}

export interface TestReadingQuestionPart {
  _id: string;

  partNumber: number;

  passageText: string;

  groups: TestReadingQuestionGroup[];
}

export interface ReadingQuestion extends TestReadingQuestion {
  answer: string;
  
  explanationText: string;
}

export interface ReadingQuestionGroup extends Omit<TestReadingQuestionGroup, 'questions'> {
  questionTypeTips: string;

  questions: ReadingQuestion[];
}

export interface ReadingQuestionPart extends Omit<TestReadingQuestionPart, 'groups'> {
  passageTitle: string;

  groups: ReadingQuestionGroup[];
}