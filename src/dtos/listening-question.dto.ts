export interface ListeningQuestionOption {
  _id: string;
  
  key: string;

  text: string;
}

export interface TestListeningQuestion {
  _id: string;

  questionText: string;

  blankNumber: number;

  options: ListeningQuestionOption[];
}

export interface TestListeningQuestionAnswer {
  questionId: string;

  studentAnswer: string;

  question: TestListeningQuestion;
}

export interface TestListeningQuestionGroup {
  _id: string;

  answerList: string;

  directionText: string;

  image: string;

  questionBox: string;

  questionType: string;

  groupNumber: number;

  questions: TestListeningQuestionAnswer[];
}

export interface TestListeningQuestionPart {
  _id: string;

  partNumber: number;

  partAudio: string;

  groups: TestListeningQuestionGroup[];
}

export interface ListeningQuestion extends TestListeningQuestion {
  answer: string;
  
  explanationText: string;

  options: ListeningQuestionOption[];
}

export interface ListeningQuestionGroup extends Omit<TestListeningQuestionGroup, 'questions'> {
  questionTypeTips: string;

  script: string;

  questions: ListeningQuestion[];
}

export interface ListeningQuestionPart extends Omit<TestListeningQuestionPart, 'groups'> {
  partTitle: string;

  groups: ListeningQuestionGroup[];
}