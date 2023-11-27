import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

import { UserType } from './user/enums/user-type.enum';
import { UserService } from './user/user.service';
import { QuestionService } from './question/question.service';
import { QuestionSkill } from './question-part/enums/question-skill.enum';
import { QuestionLevel } from './question-part/enums/question-level.enum';
import { QuestionGroupService } from './question-group/question-group.service';
import { QuestionOptionService } from './question-option/question-option.service';
import { QuestionPartService } from './question-part/question-part.service';

// import readingData from './reading';
// import * as listeningRawData from './listening';
// import * as speakingRawData from './speaking';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly questionOptionService: QuestionOptionService,
    private readonly questionGroupService: QuestionGroupService,
    private readonly questionPartService: QuestionPartService,
  ) {}

  async onApplicationBootstrap() {
    // Seeding admin user
    try {
      const adminUser = {
        username: 'admin',
        email: 'admin@efl.neu.edu.vn',
        password: '123456',
        fullname: 'Super Administrator',
        userType: UserType.SUPER_ADMIN,
        verified: true,
      };
      const user = await this.userService.findOne({
        username: adminUser.username,
      });

      if (!user || !user._id) {
        await this.userService.create(adminUser);
      }
    } catch (error) {
      console.log(error);
    }

    // Seeding managetesttakers user
    try {
      const managetesttakers = {
        username: 'managetesttakers',
        email: 'managetesttakers@efl.neu.edu.vn',
        password: '123456',
        fullname: 'MANAGETESTTAKERS',
        userType: UserType.MANAGETESTTAKERS,
        verified: true,
      };
      const user = await this.userService.findOne({
        username: managetesttakers.username,
      });

      if (!user || !user._id) {
        await this.userService.create(managetesttakers);
      }
    } catch (error) {
      console.log(error);
    }

    // Seeding poetcreator user
    try {
      const poetcreator = {
        username: 'poetcreator',
        email: 'poetcreator@efl.neu.edu.vn',
        password: '123456',
        fullname: 'POETCREATOR',
        userType: UserType.POETCREATOR,
        verified: true,
      };
      const user = await this.userService.findOne({
        username: poetcreator.username,
      });

      if (!user || !user._id) {
        await this.userService.create(poetcreator);
      }
    } catch (error) {
      console.log(error);
    }

    // Seeding pointmanager user
    try {
      const pointmanager = {
        username: 'pointmanager',
        email: 'pointmanager@efl.neu.edu.vn',
        password: '123456',
        fullname: 'POINTMANAGER',
        userType: UserType.POINTMANAGER,
        verified: true,
      };
      const user = await this.userService.findOne({
        username: pointmanager.username,
      });

      if (!user || !user._id) {
        await this.userService.create(pointmanager);
      }
    } catch (error) {
      console.log(error);
    }

    // Seeding exammanagement user
    try {
      const exammanagement = {
        username: 'exammanagement',
        email: 'exammanagement@efl.neu.edu.vn',
        password: '123456',
        fullname: 'EXAMMANAGEMENT',
        userType: UserType.EXAMMANAGEMENT,
        verified: true,
      };
      const user = await this.userService.findOne({
        username: exammanagement.username,
      });

      if (!user || !user._id) {
        await this.userService.create(exammanagement);
      }
    } catch (error) {
      console.log(error);
    }

    // Seeding reading and writing data
    try {
      // const writingRawDatas = [
      //   {
      //     id: 48166,
      //     studentAnswerText: '',
      //     question: {
      //       id: 5,
      //       questionNumber: 1,
      //       analysisType: 'trend',
      //       image:
      //         'https://toeflbank-rest-api-production.s3.amazonaws.com/content/ielts/writing_question/image/WR-T1-02_outlined_1bfe5e8f6fbc4843985015926a03c3c2.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAWIENLWIIQIIMZBKE%2F20220804%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220804T070703Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEEIaDmFwLW5vcnRoZWFzdC0yIkcwRQIgMrFkMQmM3iTonIgOK5WA5kd6%2F%2FfgmbmUvugc0r1hFg8CIQDj6D%2FOoEw7bABxvyBipBbNKANjZFDHTVtUROeM6IYiECqRBAib%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDQyOTc5MzE5NDUxMyIMfs8CiNQahilBsyuTKuUDoXrkKdHCSCoviPw9nXpCB7s1W%2BmjkI9iXF5y%2Fe2QNRruHQvB0z2dsqL%2BnxAgz%2BDEZ8bTg0T%2F15I5RDTpinw5Woukal33U1K1G53JH27aLQjlEilXXBEkd7Qa9C5WHUk2jbhXkcVMJLXfojm4dBWmB53O%2BUvLjltzPgPSfhGLZRIYwUFVOqzc07tfX0xpwWoAVPmVv5ZHB3G948Hdef3wuZP8P6%2BTdsi3V%2F%2FvW9zsI7oP9HHVKgxMx7%2BC7Xys%2FBjRmDF63MPuaSrz42sjAFDc%2FXvKryqtPaJjMW5pl55nfEVQCzmoZ09EkJG2NVLTUCmJVA1P%2F4L5e5FqO%2FtwgvbH8X0ZGpkRT5nIkG52HEtdMdWlO45F0fuwJn1Sqipza%2BcHaaPlKs%2F0F3yngeLKwfHzxtKVKWsmzxlQ%2BbiUe714hK%2B0OMX%2F%2FCAKywehMGM%2FwQuWSfqiI9jD80GYLxQhofUVltfNmb1F91HKpRQ7V2w4CrRZ%2Bi2MYhbGTDWOJ2Exbrhn0TgBl02iNxln2urEiUCzuPDnb%2B2h0np%2B8qqpl4FBCEwOHo7N1vk6OgiJlE%2FTWpcZYQgNL9MRYGo2GSbkGbOseu0RSlBgeq2hhIUoayFbFN4VfkEwIicFiJ8JAjG45rmGRJuJAMMw0MKslwY6pQEx%2B2WQv%2Bw7KEREEf9%2FkNPSZFL65PCOlgyxNYGRjAO2eShBv%2B5vxji3b8UUz6%2B%2B9JFkZ3Fn810vyLFPgKl6utEGOBxNh%2BPrma91NGK9ayhRF2GCapTGcbhPWP%2BoJdhnBiUdSZCl28cFHO2vpB8HMb04gKnNGhYoRFz%2FPTkfDZN7eK58zazajWowSSmgNC7XT4ySKGza3ArwInYiDWH15EMiZh3nFPI%3D&X-Amz-Signature=632c4e3b8a0993a1114ac9b7e1639e7ac65aaef069e642b07bd23fe511ce6eab',
      //       title: 'Average height of women by year of birth',
      //       text: 'The line graph below shows the average height of women born between 1946 and 1996 in European countries. ',
      //       questionType: 'line_graph',
      //       explanation: {
      //         tips: '<ul><li><span style="color:#000000;">Try to write around 170 - 200 words for this task. You will not get a higher score for a longer essay.&nbsp;</span></li><li><span style="color:#000000;">Remember to include a summary of the general trends in the graph. This overview paragraph is very important in Task 1.</span></li><li><span style="color:#000000;">Try not to simply list information and instead make comparisons.</span></li><li><span style="color:#000000;">Use transition words or connecting phrases such as \'overall\' and \'however\' to cohesively link the information.</span></li><li><span style="color:#000000;">You do not have to include a conclusion for this task.</span></li></ul>',
      //         usefulGrammarNVocab:
      //           '<p><span style="color:#000000;"><strong>Useful Grammar&nbsp;</strong></span></p><p><span style="color:#000000;">The following grammar structures can be useful for Trend questions:</span></p><ul><li><span style="color:#000000;">Past tense: The average height <i>increased</i>.&nbsp;</span></li><li><span style="color:#000000;">Comparison (high): Latvian women were <i>taller than </i>French women.</span></li><li><span style="color:#000000;">Comparison (low): Women were <i>shorter</i> in 1946 <i>than</i> in 1996.</span></li><li><span style="color:#000000;">Superlatives: The numbers increased <i>the most</i> in 1956.&nbsp;</span></li><li><span style="color:#000000;">Prepositions of time: <i>in, during, at, for, throughout</i></span></li></ul><p><span style="color:#000000;"><strong>Useful Vocabulary</strong></span></p><p><span style="color:#000000;">The following words and phrases can be useful for Trend questions:</span></p><ul><li><span style="color:#000000;">grow (verb) / shrink (verb)</span></li><li><span style="color:#000000;">rise (verb) / fall (verb)</span></li><li><span style="color:#000000;">level off (verb phrase)</span></li><li><span style="color:#000000;">dramatically (adverb)</span></li><li><span style="color:#000000;">steadily (adverb)</span></li></ul>',
      //         ideaSuggestion: null,
      //         organization:
      //           '<ol style="list-style-type:upper-roman;"><li><span style="color:#000000;"><strong>Introduction: </strong>First, include an introductory sentence or paragraph explaining what the line graph shows. Paraphrase the description of the graph provided in the question.</span></li><li><span style="color:#000000;"><strong>Overview: </strong>Next, write a short overview of the general trend or trends shown in the graph. Do not go into details or cite numbers from the graph in this paragraph. Mention the overall increasing and/or decreasing trends and the highest and lowest points.</span></li><li><span style="color:#000000;"><strong>Body paragraphs:</strong> Consider writing two or three body paragraphs about any of the following:</span><ul style="list-style-type:circle;"><li><span style="color:#000000;">countries with shorter heights and countries with taller heights</span></li><li><span style="color:rgb(0,0,0);">general trends and specific details</span></li><li><span style="color:rgb(0,0,0);">heights which continued to grow and heights which leveled off</span></li></ul></li></ol>',
      //         modelAnswer:
      //           '<p><span style="color:#000000;">The line graph presents the average height data of women by year of birth in four countries in Europe between the years 1946 and 1996.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;">Overall, women\'s average height grew steadily from 1946 to around 1970, after which point the growth trend either slowed down or was reversed.</span></p><p>&nbsp;</p><p><span style="color:#000000;">To begin with, France had the shortest average heights throughout the time period. The average height of French women in 1946 was just 161 centimeters. French women steadily grew in height from 1946 to around 1970. However, from this point onward France\'s average height began to level off at approximately 165 centimeters.</span></p><p>&nbsp;</p><p><span style="color:#000000;">While average heights in France experienced very slow growth after around 1970, heights in the Netherlands and Sweden began to shrink. While the heights of Dutch women decreased only slightly between roughly 1970 and 1996, Swedish women became shorter. Average heights of women in Sweden fell from around 167 centimeters in 1970 to under 166 centimeters in 1996.</span></p><p>&nbsp;</p><p><span style="color:#000000;">Latvia was the only country in which average heights continuously rose throughout the 50 year period. Despite the fact that women from this nation born in 1946 were only 164 centimeters tall on average, Latvian women had become the tallest group by 1996 with an average height of nearly 170 centimeters.</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>[Word Count: 209]</strong></span></p><p><span style="color:#000000;"><strong>Estimated Band 8 or above</strong></span></p>',
      //       },
      //       isAutograded: true,
      //       autogradeId: 3,
      //     },
      //   },
      //   {
      //     id: 48167,
      //     studentAnswerText: null,
      //     question: {
      //       id: 6,
      //       questionNumber: 2,
      //       analysisType: 'none',
      //       image: null,
      //       title: 'Societies produce more waste as they become more developed',
      //       text: 'Societies produce more waste as they become more developed.\nWhy is this the case? What can be done about this problem?',
      //       questionType: 'causes_solutions',
      //       explanation: {
      //         tips: '<ul><li><span style="color:#000000;">Remember to address both the cause and the solution to the problem.</span></li><li><span style="color:#000000;">Make sure you link the cause and the solution in a meaningful way.</span></li><li><span style="color:#000000;">Give specific examples to support your ideas. Do not use overly general examples.&nbsp;</span></li><li><span style="color:#000000;">Try using structures with modal verbs such as <i>should</i>, <i>need to</i> or <i>must</i> when presenting your ideas, or conditional forms to express what <i>would</i> happen <i>if </i>certain policies <i>were implemented</i>.</span></li><li><span style="color:#000000;">Include a conclusion paragraph summarizing the argument(s) in your essay. You will receive a lower band score if you fail to include a conclusion.</span></li></ul>',
      //         usefulGrammarNVocab: null,
      //         ideaSuggestion:
      //           '<p><span style="color:#000000;"><strong>Possible Causes:</strong></span></p><ul><li><span style="color:#000000;">Recycling methods are not effective enough to keep up with the rate of consumption in developed countries.</span></li><li><span style="color:#000000;">People in developed societies are too reliant on single-use items like plastic utensils, straws, cups and bags.</span></li><li><span style="color:#000000;">Materials that items are made of, like types of plastic, take many years to decompose.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Possible Solutions:</strong></span></p><ul><li><span style="color:#000000;">Private companies should develop more ways to reuse discarded items.</span></li><li><span style="color:#000000;">Governments should regulate the amount of waste that private companies dispose of.</span></li><li><span style="color:#000000;">Scientists should focus on developing new biodegradable materials for use in manufacturing.</span></li></ul>',
      //         organization:
      //           '<p><span style="color:#000000;">This is a two-part question, which means that you must respond to both questions included in the prompt. You can organize your essay into the following sections:&nbsp;</span></p><ol style="list-style-type:upper-roman;"><li><span style="color:#000000;"><strong>Introduction:</strong> First, write an introduction paragraph. You should include two pieces of information, or statements, in this paragraph. Start by paraphrasing the given question to provide context for your essay. Then, describe in one or two sentences what you will talk about in your essay. In this part, you can include what you think the main cause of the problem is and suggest one solution to the problem. Since the question does not mention \'causes\' and \'solutions\' in plural, you can just write about one cause and one solution.</span></li><li><span style="color:#000000;"><strong>Body paragraphs:</strong> Write one body paragraph about what you think is the main cause of the increasing waste problem and a second body paragraph about how to solve this problem. Alternatively, you can write one body paragraph about a cause and its corresponding solution, and a second body paragraph about another cause and solution.</span></li><li><span style="color:#000000;"><strong>Conclusion:</strong> Lastly, write a conclusion paragraph. You should write one to two sentences summarizing the main points raised in your body paragraphs.&nbsp;</span></li></ol>',
      //         modelAnswer:
      //           '<p><span style="color:#000000;">When countries go through modernization, they begin to produce more and more waste, such as trash and uneaten food. These days, leaders in both public and private sectors are asking what can be done about this problem. However, we must first examine the causes in order to form effective solutions.</span></p><p>&nbsp;</p><p><span style="color:#000000;">The main cause of excess waste in developed countries is increased consumption. When a nation goes through the process of development, its citizens\' quality of life improves, but this also means that these citizens obtain greater financial autonomy and begin to buy more things. My home country of South Korea went through rapid economic growth in the 1970s. Although Koreans in the past lived more humble lives, now we are constantly encouraged to spend more on things like clothing, devices and food. As we buy more products, we throw away old ones, and mountains of trash and discarded items grow in landfills and in the streets.</span></p><p>&nbsp;</p><p><span style="color:#000000;">While the reasons why societies produce too much waste are relatively clear, the solutions are often debated. I believe that the most crucial step we must take to reduce the amount of trash is to reduce overconsumption. In other words, we need to live more minimalist lives. Despite the fact that most of us constantly buy new things, we rarely question whether or not we need these goods. For example, the fast-fashion industry produces enormous amounts of waste. People buy new clothing every season, and thus they periodically dispose of clothing that is still wearable. The fact is, however, that shoppers do not need to change their wardrobes so frequently. Instead, they could buy used or more durable clothing, which would result in less waste. Governments should also enforce better rules requiring private companies to be more responsible for the amount of waste that they produce.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;">To sum up, the main cause of the waste problem in developed countries is the increased spending and consumption that results from modernization. Because of this, the main solution to this problem is to reduce overconsumption.</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>[Word Count: 338]</strong></span></p><p><span style="color:#000000;"><strong>Estimated Band 8</strong></span></p>',
      //       },
      //       isAutograded: true,
      //       autogradeId: 4,
      //     },
      //   },
      // ];
      // const writingQuestionCount = await this.questionService.countDocuments({
      //   skill: QuestionSkill.WRITING,
      // });
      // if (writingQuestionCount == 0) {
      //   for (let i = 0; i < writingRawDatas.length; i++) {
      //     const writingRawData = writingRawDatas[i];
      //     this.questionService.create({
      //       level: QuestionLevel.A1,
      //       analysisType: writingRawData.question.analysisType.toUpperCase(),
      //       skill: QuestionSkill.WRITING,
      //       questionType: writingRawData.question.questionType.toUpperCase(),
      //       image: writingRawData.question.image,
      //       questionText: writingRawData.question.text,
      //       title: writingRawData.question.title,
      //       tips: writingRawData.question.explanation.tips,
      //       usefulGrammarNVocab: writingRawData.question.explanation.usefulGrammarNVocab,
      //       ideaSuggestion: writingRawData.question.explanation.ideaSuggestion,
      //       organization: writingRawData.question.explanation.organization,
      //       modelAnswer: writingRawData.question.explanation.modelAnswer,
      //     })
      //   }
      // }
    } catch (error) {}

    try {
      // const readingPassages = [
      //   {
      //     id: 1,
      //     passageTitle: 'The first commercial film screening',
      //     passageNumber: 1,
      //     originalPassage: '',
      //     groups: [
      //       {
      //         id: 1,
      //         groupNumber: 1,
      //         questionType: 'identifying_information',
      //         directionText:
      //           '<p><span style="color:#000000;">Choose <strong>TRUE</strong> if the statement agrees with the information given in the text, choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;The first commercial film screening&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;On December 28 1895, the first commercial film was screened to a public audience at the Grand Cafe in Paris. Using a newly invented camera and projector, the film showed workers leaving a factory. Before this landmark event, films could only be viewed by a single person through a peephole on a large and loud machine.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Films, or moving pictures as they were called at the time, had existed since the 1880s when French inventor Louis le Prince created the first motion-picture camera, and films had been viewed since 1888 when Thomas Edison and William Dickson invented the first camera with viewing capabilities, the Kinetoscope. But commercial film screening was the biggest technological advancement yet&#x2014;and it caused a sensation. The notion that audience members could share a film experience together was enthralling, and it completely changed the landscape of the entertainment industry.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The idea behind commercial screening came from French photographers and inventors Louis and Auguste Lumiere. The Lumiere brothers were the sons of Antoine Lumiere, the owner of a photography business in Lyon, France, and in 1881 the brothers became involved in the family business. When word spread about Edison and Dickson&#x27;s Kinetoscope, the Lumiere brothers started to work on a device that could project film onto a screen.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Making the projecting device required the brothers to improve upon the Kinetoscope in many ways. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2460;The Kinetoscope was a bulky machine that weighed 453 kilograms and was impossible to transport to theatres, so the Lumiere brothers needed to create a lighter device.&#x3C;/mark&#x3E; Their solution to this problem was the Cinematographe, a new motion-picture camera and projector that weighed just nine kilograms and could be transported with ease. However, the Cinematographe also needed to be quieter than the noisy Kinetoscope. They developed a new process which passed 35mm-wide film through a shutter at a slower rate of 16 frames per second, rather than the Kinetoscope&#x27;s 46 frames per second. These specifications created a quieter machine and became the industry standard for motion-picture cameras and projectors for decades.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2461;The endeavours of the Lumiere brothers culminated in their first successful film screening in December of 1895. The audience at the Grand Cafe enjoyed what would be considered meagre entertainment today.&#x3C;/mark&#x3E; The brothers&#x27; directorial debut was a 50 second film called &#x3C;i&#x3E;Workers leaving the Lumiere factory,&#x3C;/i&#x3E; which showed just that&#x2014;workers leaving the factory. Despite its simplicity, the clarity of the picture and its black-and-white realism dazzled the audience. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2462;A member of the audience at this screening, theatre director and future film-maker Georges Melies recounted: &#x3C;/mark&#x3E;&#x3C;i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;We stared flabbergasted at this sight, stupefied and surprised beyond all expression. At the end of the show, there was complete chaos. Everyone wondered how such a result was obtained.&#x3C;/mark&#x3E; &#x3C;/i&#x3E;Audiences were in awe of projected moving-pictures throughout 1896 and 1897, a period characterised as the &#x27;novelty period&#x27;. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2463;The early productions of the Lumiere brothers, however, shared more in common with animated photographs than with feature films.&#x3C;/mark&#x3E; Shot on location rather than inside a studio, the films consisted of single unedited shots featuring ordinary subjects like people and trains. These films, called &#x27;actualities&#x27;, lacked narrative plots and simply showcased lifelike movement. By the late 1890s, audiences began to long for more as the novelty of such films began to wear off.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;At the turn of the century, film editing was limited, and film projectionists had to add live narration, music, and sound effects to productions. However, more sophisticated editing techniques were put to use when film production companies were established. Animatograph Works, Ltd. was formed in 1899 by British scientific&#x26;nbsp; instrument manufacturer Robert W. Paul. The largest film producer in England, Paul&#x27;s company was producing an average of 50 films per year by 1905. The funding and support of large companies allowed room for experimentation. Photographers George Albert Smith and James Williamson began to make use of superimposed images in 1897 and close-ups and parallel editing in 1900. Williamson broke new ground with the first chase films, &#x3C;i&#x3E;Stop Thief!&#x3C;/i&#x3E; in 1901 and &#x3C;i&#x3E;Fire!&#x3C;/i&#x3E; in 1902. But the films of Williamson and Smith still lacked coherence and continuity in their simplistic stories.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The transformation of films from mere animated photographs to fully-formed narratives was brought about by Georges Melies. Melies&#x27; Star Film company initially produced one-shot films, but the film-maker began to experiment with multiscene productions with linear storytelling. In 1902, he released the ambitious film &#x3C;i&#x3E;A Trip to the Moon,&#x3C;/i&#x3E; which included a staggering 30 scenes and a fantastical plot. The film was distributed and screened internationally to enourmous commercial success, and it established the Star Film company as one of the world&#x27;s foremost producers of motion-pictures. Melies&#x27; fiction films effectively displaced the actualities of the Lumiere brothers and laid the groundwork for the burgeoning cinema industry.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The new form of entertainment had a great impact on culture in the early 20th century. While tickets to stage productions were quite expensive, audiences from all walks of life could afford tickets to the cinema. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2464;Films were popularised as mainstream entertainment and brought people of both upper and lower classes together.&#x3C;/mark&#x3E; In a time when overseas travel was difficult, films also brought the wider world to audiences. For example, a movie-goer in the US could witness the arrival of a train at a station in France without travelling.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The trial-and-error and ups-and-downs that characterised the development of film technology from the 1880s to the early 1900s enamoured the public. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2465;Audiences were eager to consume the latest form of moving pictures and developed a long-lasting interest in cinema.&#x3C;/mark&#x3E; Films were&#x2014;and still are&#x2014;topics of conversation and subjects of newspaper articles around the world.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Identifying Information</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ detailed reading</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">Scan the text for key terms or details from the statement to locate the relevant section(s). Then, read in detail to determine if the statement is true, false, or not given.&nbsp;</span></li><li><span style="color:#000000;">Key terms or details from the statements may be located in two or more sections of the text. If this is the case, skim each section to find the relevant part of the text.&nbsp;</span></li><li><span style="color:#000000;">Scanning for key terms or details helps to locate where the relevant information can be found in the text. However, simply finding information from a statement in the text does not necessarily mean it is true. After scanning to find where the relevant details are located, read that section in detail to confirm whether the information in the statement is true, false, or not given.&nbsp;</span></li><li><span style="color:#000000;">Do NOT stop at key terms in the text. Continue reading to determine whether the statement is factual (\'true\'), not factual (\'false\'), or whether the validity cannot be determined (\'not given\').&nbsp;</span></li><li><span style="color:#000000;">Focus on the facts in the text. Do NOT rely on information that you already know about the subject.&nbsp;</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">\'Not given\' means that the information cannot be determined as either true or false based on the text. This does NOT mean that certain details from the statement cannot be found in the text. You might see some of the same words in the text but this alone does not eliminate the \'not given\' option.</span></td></tr><tr><td><span style="color:#000000;">A false statement is one that you can prove to be incorrect based on the text. This means you should be able to find details in the text that contradict the false statement. If the information is simply not referenced in the text, the statement may be not given.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '1',
      //             id: 1,
      //             groupId: 1,
      //           },
      //           {
      //             displayNumber: '2',
      //             id: 2,
      //             groupId: 1,
      //           },
      //           {
      //             displayNumber: '3',
      //             id: 3,
      //             groupId: 1,
      //           },
      //           {
      //             displayNumber: '4',
      //             id: 4,
      //             groupId: 1,
      //           },
      //           {
      //             displayNumber: '5',
      //             id: 5,
      //             groupId: 1,
      //           },
      //           {
      //             displayNumber: '6',
      //             id: 6,
      //             groupId: 1,
      //           },
      //         ],
      //       },
      //       {
      //         id: 2,
      //         groupNumber: 2,
      //         questionType: 'note_completion',
      //         directionText:
      //           '<p><span style="color:#000000;">Complete the notes. Write <strong>ONE WORD ONLY</strong> from the text in each box.&nbsp;</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox:
      //           '<p style="text-align:center;"><span style="color:#000000;"><strong>The history of early on-screen films</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>The first film technologies:</strong></span></p><ul><li><span style="color:#000000;">the first motion-picture camera was invented by Louis le Prince in the 1880s</span></li><li><span style="color:#000000;">Edison and Dickson invented Kinetoscope in 1888 which had <strong>7 </strong>{{blank 7}} capabilities</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Accomplishments of the Lumiere brothers:</strong></span></p><ul><li><span style="color:#000000;">the Lumiere brothers became involved in their father\'s photography business in 1881</span></li><li><span style="color:#000000;">the brothers worked to enable the projection of film onto a <strong>8</strong> {{blank 8}}&nbsp;</span></li><li><span style="color:#000000;">they developed the Cinematographe, which was lighter and <strong>9 </strong>{{blank 9}} than the Kinetoscope</span></li><li><span style="color:#000000;">the first film was screened by Cinematographe in 1895 in Paris</span></li><li><span style="color:#000000;">films called \'actualities\' featured everyday subjects</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>A new era of cinema:</strong></span></p><ul><li><span style="color:#000000;">the establishment of film production companies allowed for the development of new <strong>10</strong> {{blank 10}} techniques</span></li><li><span style="color:#000000;">George Albert Smith and James Williamson produced new types of films, including the first <strong>11</strong> {{blank 11}} films</span></li><li><span style="color:#000000;">Georges Melies started making films which included multiple scenes and <strong>12</strong> {{blank 12}} storytelling, and released the film <i>A Trip to the Moon</i> in 1902</span></li><li><span style="color:#000000;">cinema became popular because of inexpensive tickets&nbsp;</span></li><li><span style="color:#000000;">films brought the <strong>13</strong> {{blank 13}} to audiences during a time when travel was difficult</span></li></ul>',
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;The first commercial film screening&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;On December 28 1895, the first commercial film was screened to a public audience at the Grand Cafe in Paris. Using a newly invented camera and projector, the film showed workers leaving a factory. Before this landmark event, films could only be viewed by a single person through a peephole on a large and loud machine.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Films, or moving pictures as they were called at the time, had existed since the 1880s when French inventor Louis le Prince created the first motion-picture camera, and films had been viewed since 1888 when Thomas Edison and William Dickson invented the first camera with &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2466;viewing&#x3C;/mark&#x3E; capabilities, the Kinetoscope. But commercial film screening was the biggest technological advancement yet&#x2014;and it caused a sensation. The notion that audience members could share a film experience together was enthralling, and it completely changed the landscape of the entertainment industry.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The idea behind commercial screening came from French photographers and inventors Louis and Auguste Lumiere. The Lumiere brothers were the sons of Antoine Lumiere, the owner of a photography business in Lyon, France, and in 1881 the brothers became involved in the family business. When word spread about Edison and Dickson&#x27;s Kinetoscope, the Lumiere brothers started to work on a device that could project film onto a &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2467;screen&#x3C;/mark&#x3E;.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Making the projecting device required the brothers to improve upon the Kinetoscope in many ways. The Kinetoscope was a bulky machine that weighed 453 kilograms and was impossible to transport to theatres, so the Lumiere brothers needed to create a lighter device. Their solution to this problem was the Cinematographe, a new motion-picture camera and projector that weighed just nine kilograms and could be transported with ease. However, the Cinematographe also needed to be quieter than the noisy Kinetoscope. They developed a new process which passed 35mm-wide film through a shutter at a slower rate of 16 frames per second, rather than the Kinetoscope&#x27;s 46 frames per second. These specifications created a &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2468;quieter&#x3C;/mark&#x3E; machine and became the industry standard for motion-picture cameras and projectors for decades.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The endeavours of the Lumiere brothers culminated in their first successful film screening in December of 1895. The audience at the Grand Cafe enjoyed what would be considered meagre entertainment today. The brothers&#x27; directorial debut was a 50 second film called &#x3C;i&#x3E;Workers leaving the Lumiere factory,&#x3C;/i&#x3E; which showed just that&#x2014;workers leaving the factory. Despite its simplicity, the clarity of the picture and its black-and-white realism dazzled the audience. A member of the audience at this screening, theatre director and future film-maker Georges Melies recounted: &#x3C;i&#x3E;We stared flabbergasted at this sight, stupefied and surprised beyond all expression. At the end of the show, there was complete chaos. Everyone wondered how such a result was obtained. &#x3C;/i&#x3E;Audiences were in awe of projected moving-pictures throughout 1896 and 1897, a period characterised as the &#x27;novelty period&#x27;. The early productions of the Lumiere brothers, however, shared more in common with animated photographs than with feature films. Shot on location rather than inside a studio, the films consisted of single unedited shots featuring ordinary subjects like people and trains. These films, called &#x27;actualities&#x27;, lacked narrative plots and simply showcased lifelike movement. By the late 1890s, audiences began to long for more as the novelty of such films began to wear off.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;At the turn of the century, film editing was limited, and film projectionists had to add live narration, music, and sound effects to productions. However, more sophisticated &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2469;editing&#x3C;/mark&#x3E; techniques were put to use when film production companies were established. Animatograph Works, Ltd. was formed in 1899 by British scientific&#x26;nbsp; instrument manufacturer Robert W. Paul. The largest film producer in England, Paul&#x27;s company was producing an average of 50 films per year by 1905. The funding and support of large companies allowed room for experimentation. Photographers George Albert Smith and James Williamson began to make use of superimposed images in 1897 and close-ups and parallel editing in 1900. Williamson broke new ground with the first &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246A;chase&#x3C;/mark&#x3E; films, &#x3C;i&#x3E;Stop Thief!&#x3C;/i&#x3E; in 1901 and &#x3C;i&#x3E;Fire!&#x3C;/i&#x3E; in 1902. But the films of Williamson and Smith still lacked coherence and continuity in their simplistic stories.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The transformation of films from mere animated photographs to fully-formed narratives was brought about by Georges Melies. Melies&#x27; Star Film company initially produced one-shot films, but the film-maker began to experiment with multiscene productions with &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246B;linear&#x3C;/mark&#x3E; storytelling. In 1902, he released the ambitious film &#x3C;i&#x3E;A Trip to the Moon,&#x3C;/i&#x3E; which included a staggering 30 scenes and a fantastical plot. The film was distributed and screened internationally to enourmous commercial success, and it established the Star Film company as one of the world&#x27;s foremost producers of motion-pictures. Melies&#x27; fiction films effectively displaced the actualities of the Lumiere brothers and laid the groundwork for the burgeoning cinema industry.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The new form of entertainment had a great impact on culture in the early 20th century. While tickets to stage productions were quite expensive, audiences from all walks of life could afford tickets to the cinema. Films were popularised as mainstream entertainment and brought people of both upper and lower classes together. In a time when overseas travel was difficult, films also brought the wider &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246C;world&#x3C;/mark&#x3E; to audiences. For example, a movie-goer in the US could witness the arrival of a train at a station in France without travelling.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The trial-and-error and ups-and-downs that characterised the development of film technology from the 1880s to the early 1900s enamoured the public. Audiences were eager to consume the latest form of moving pictures and developed a long-lasting interest in cinema. Films were&#x2014;and still are&#x2014;topics of conversation and subjects of newspaper articles around the world.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Note Completion</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ detailed reading to understand specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ selecting words from the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the notes to get a general understanding of the content.&nbsp;</span></li><li><span style="color:#000000;">Check how many words and/or numbers you may use. Do NOT exceed this limit.</span></li><li><span style="color:#000000;">Pay attention to grammar. The question may require a verb, a noun, or an adjective.</span></li><li><span style="color:#000000;">Use the headings of each section of Note Completion tasks to locate the relevant section or sections in the text.</span></li><li><span style="color:#000000;">Scan the text for key terms or details such as names or dates from the questions. Then, read in detail to identify the answers.&nbsp;</span></li><li><span style="color:#000000;">Remember to copy the word(s) from the text exactly as they appear. You do NOT need to change them in any way, and you will not receive points for misspelt words.</span></li><li><span style="color:#000000;">Pay attention to whether a word is singular or plural.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Note Completion questions use paraphrasing or synonyms of words in the text, so it is important to recognize these in order to locate the answers in the text.</span></td></tr><tr><td><span style="color:#000000;">If you are taking the paper-based test, you may write using uppercase or lowercase letters, but make sure that your answer is clear.</span></td></tr><tr><td><span style="color:#000000;">Hyphenated words (<i>\'self-esteem\'</i>) count as one word.</span></td></tr><tr><td><span style="color:#000000;">You may write numbers using numbers (<i>\'23\'</i>) or words (<i>\'twenty-three\'</i>).</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '7',
      //             id: 7,
      //             groupId: 2,
      //           },
      //           {
      //             displayNumber: '8',
      //             id: 8,
      //             groupId: 2,
      //           },
      //           {
      //             displayNumber: '9',
      //             id: 9,
      //             groupId: 2,
      //           },
      //           {
      //             displayNumber: '10',
      //             id: 10,
      //             groupId: 2,
      //           },
      //           {
      //             displayNumber: '11',
      //             id: 11,
      //             groupId: 2,
      //           },
      //           {
      //             displayNumber: '12',
      //             id: 12,
      //             groupId: 2,
      //           },
      //           {
      //             displayNumber: '13',
      //             id: 13,
      //             groupId: 2,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     id: 2,
      //     passageTitle: 'Computer vision for diabetes monitoring',
      //     passageNumber: 2,
      //     originalPassage: '',
      //     groups: [
      //       {
      //         id: 3,
      //         groupNumber: 1,
      //         questionType: 'matching_headings',
      //         directionText:
      //           '<p><span style="color:#000000;">The text has six sections, <strong>A - F</strong>. Choose the correct heading for each section from the list of headings below. Write the correct number, <strong>i - ix</strong>, in boxes 14 - 19.&nbsp;</span></p>',
      //         image: null,
      //         answerList:
      //           '<p><span style="color:#000000;"><strong>List of Headings</strong></span></p><p><span style="color:#000000;"><strong>i </strong>How poor eyesight increases the risk of developing diabetes</span></p><p><span style="color:#000000;"><strong>ii </strong>Uses for computer vision in the medical field</span></p><p><span style="color:#000000;"><strong>iii </strong>Teaching a program to read and understand images</span></p><p><span style="color:#000000;"><strong>iv </strong>The result of research into using computer vision for diabetes</span></p><p><span style="color:#000000;">monitoring</span></p><p><span style="color:#000000;"><strong>v </strong>A problem with meters currently used by people with diabetes</span></p><p><span style="color:#000000;"><strong>vi </strong>Providing new glucose meters to diabetics with poor eyesight</span></p><p><span style="color:#000000;"><strong>vii </strong>The way that a new technology can be helpful to the visually impaired</span></p><p><span style="color:#000000;"><strong>viii</strong> Analysing the images produced by computers</span></p><p><span style="color:#000000;"><strong>ix </strong>The way that computer vision differs from human sight</span></p>',
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;Computer vision for diabetes monitoring&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;A&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Checking blood sugar levels using a glucose meter is a task that people living with diabetes&#x2014;a disease which affects how the body turns food into energy&#x2014;must carry out at least once per day, though some need to test their blood sugar levels up to seven times per day. Upwards of 4 million people in the UK live with either type one or type two diabetes, and glucose meters are vital for maintaining a healthy lifestyle with diabetes. Despite their usefulness, &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246D;it can be frustrating for those who use glucose meters to manually transfer health data into mobile phone apps which monitor glucose levels and tell users how much insulin they need.&#x3C;/mark&#x3E; But what if mobile phones could read glucose meters and input values automatically? Dr James Charles from University of Cambridge&#x27;s Department of Engineering has developed a mobile phone app which allows a phone&#x27;s camera to do just that. He believes the GlucoseRx app, which reads and identifies data from glucose meters, will make the process of monitoring blood sugar levels smoother for the millions who live with diabetes in the UK. &#x27;As someone with diabetes, this app makes the whole process easier. I&#x27;ve now forgotten what it was like to enter the values manually, but I do know I wouldn&#x2019;t want to go back to it,&#x27; he said.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;B&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The app uses the power of computer vision&#x2014;the technology of real-time screen reading and response to visual information. Computer vision functions in much the same way as human vision, but computers are at a disadvantage because &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246E;humans spend years learning how to distinguish between faces, trees, numbers and letters.&#x3C;/mark&#x3E; While these visual features appear distinct to us, until recently computers could only identify basic information in images, such as &#x3C;i&#x3E;&#x3C;strong&#x3E;straight lines&#x3C;/strong&#x3E;&#x3C;/i&#x3E;. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246E;But how do computers learn to tell various objects and symbols apart and categorise them correctly? The answer lies not in optic nerves and retinas, but in algorithms, cameras and data.&#x3C;/mark&#x3E;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;C&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246F;Like humans, the computer needs to &#x27;learn&#x27; how to differentiate visual information, and it does this by looking at vast numbers of images. In the case of the GlucoseRx app, Dr James Charles trained his program by showing it one image of a glucose meter and then introducing random backgrounds so that the program could become familiar with extraneous imagery and easily separate glucose readings from the rest of an image.&#x3C;/mark&#x3E; Once the program could &#x27;see&#x27; images properly, the next step was teaching it to understand what it was seeing. Charles and the team of researchers developed a neural network which allows the app to recognise and read numerical digits. &#x27;Since the font on these meters is digital, it&#x27;s easy to train the neural network to recognise lots of different inputs and synthesise the data,&#x27; said Charles.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;D&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2470;The result of Charles and his fellow researchers&#x27; work is an app that can read glucose meters as well, if not better than, the human eye.&#x3C;/mark&#x3E; Users simply take a photo of their glucose meter, and the values are automatically entered into the app to determine how much insulin the user needs in order to maintain normal blood sugar levels. &#x27;The system is accurate across a range of different types of meters, with reading accuracies close to 100 percent,&#x27; said Professor Roberto Cipolla, a Fellow of Jesus College who also worked on the GlucoseRx app. Cipolla added, &#x27;It doesn&#x27;t matter which orientation the meter is in&#x2014;we tested it in all orientations, viewpoints and light levels.&#x27; Most digital glucose meters are not equipped with wireless connectivity, so the app does not require it. &#x27;These meters work perfectly well, so we don&#x27;t want them sent to landfill just because they don&#x27;t have wireless connectivity,&#x27; said Dr James Charles. &#x27;We wanted to find a way to retrofit them in an inexpensive and environmentally-friendly way using a mobile phone app.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;E&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2471;Diabetes is a disease which often adversely affects eyesight, and the risk for diabetes increases with age. These factors make the app, which can effectively see on behalf of those with weakened eyesight, all the more beneficial.&#x3C;/mark&#x3E; Aside from the glucose meters which diabetics use, many other types of digital meters are used in medical and industrial fields. Thus, Charles and Cipolla tested their computer vision program on different types of digital meters, including blood pressure meters and bathroom scales. In the near future, computer vision could very well aid the visually impaired with a number of tasks.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;F&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Computer vision&#x27;s potential in the field of healthcare, however, extends beyond reading digital meters. The technology is becoming a game-changing tool for medical diagnosis and treatment. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2472;Researchers are developing computer vision programs which can read X-rays, CT and MRI scans, and these programs can detect patterns which are invisible to the human eye.&#x3C;/mark&#x3E; Such technology could help doctors identify clogged blood vessels, internal bleeding, tumours and even cancer cells. Early detection of these types of life-threatening health problems using computer vision technology could vastly improve outcomes for patients.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:hsl(0,0%,60%);&#x22;&#x3E;&#x3C;strong&#x3E;Reference:&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:hsl(0,0%,60%);&#x22;&#x3E;James Charles, Stefano Bucciarelli and Roberto Cipolla. &#x27;Real-time screen reading: reducing domain shift for one-shot learning.&#x27; Paper presented at the British Machine Vision Conference 2020&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Matching Headings</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ skimming for general understanding</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ locating information in the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ identifying main ideas</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding general information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the text quickly. Skimming the text before looking at the list of headings can help you get a sense of how the text is organised and where information is located. This will help you avoid looking for information in the wrong section and wasting valuable time.</span></li><li><span style="color:#000000;">Next, skim the list of headings to identify where you will need to look for information in the text and get a general understanding of their content.</span></li><li><span style="color:#000000;">Starting with the first paragraph, identify headings that you know are incorrect based on what you learned by skimming the paragraph to create a short list of possible headings. Then, read the paragraph in detail to determine the correct heading. Read the heading carefully to check that it is indeed correct. Repeat these steps until you have completed the task.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Remember that a heading should describe the main idea or overarching theme of a paragraph.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Answer choices may be incorrect because they are simply minor details from the text. Understanding the difference between main ideas and minor details is an important skill for Matching Headings tasks.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Answer choices may also be incorrect because, although they express a main idea, that idea is incorrect according to the text or absent from the text.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '14',
      //             id: 14,
      //             groupId: 3,
      //           },
      //           {
      //             displayNumber: '15',
      //             id: 15,
      //             groupId: 3,
      //           },
      //           {
      //             displayNumber: '16',
      //             id: 16,
      //             groupId: 3,
      //           },
      //           {
      //             displayNumber: '17',
      //             id: 17,
      //             groupId: 3,
      //           },
      //           {
      //             displayNumber: '18',
      //             id: 18,
      //             groupId: 3,
      //           },
      //           {
      //             displayNumber: '19',
      //             id: 19,
      //             groupId: 3,
      //           },
      //         ],
      //       },
      //       {
      //         id: 4,
      //         groupNumber: 2,
      //         questionType: 'summary_completion',
      //         directionText:
      //           '<p><span style="color:#000000;">Complete the summary below. Write <strong>NO MORE THAN TWO WORDS</strong> from the text in each box.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox:
      //           '<p style="text-align:center;"><span style="color:#000000;"><strong>Simplifying the process of glucose monitoring</strong></span></p><p style="text-align:center;">&nbsp;</p><p><span style="color:#000000;">Presently, many people living with diabetes find the process of transferring information from glucose meters to tracking apps difficult. This is because the process requires manual entry. Dr James Charles and his team have developed a solution. Although computers are at a <strong>20</strong> {{blank 20}} compared to humans, Charles has found a way to train a program to see and understand images. He and his fellow researchers have created a program with a <strong>21 </strong>{{blank 21}} that allows it to recognise and read values on glucose meters. They have developed an app that can automatically input information and tell users how much insulin is required to maintain normal <strong>22 </strong>{{blank 22}} levels. To avoid discarding functioning digital meters, the app does not require <strong>23 </strong>{{blank 23}} connectivity.</span></p>',
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;Computer vision for diabetes monitoring&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Checking blood sugar levels using a glucose meter is a task that people living with diabetes&#x2014;a disease which affects how the body turns food into energy&#x2014;must carry out at least once per day, though some need to test their blood sugar levels up to seven times per day. Upwards of 4 million people in the UK live with either type one or type two diabetes, and glucose meters are vital for maintaining a healthy lifestyle with diabetes. Despite their usefulness, it can be frustrating for those who use glucose meters to manually transfer health data into mobile phone apps which monitor glucose levels and tell users how much insulin they need. But what if mobile phones could read glucose meters and input values automatically? Dr James Charles from University of Cambridge&#x27;s Department of Engineering has developed a mobile phone app which allows a phone&#x27;s camera to do just that. He believes the GlucoseRx app, which reads and identifies data from glucose meters, will make the process of monitoring blood sugar levels smoother for the millions who live with diabetes in the UK. &#x27;As someone with diabetes, this app makes the whole process easier. I&#x27;ve now forgotten what it was like to enter the values manually, but I do know I wouldn&#x2019;t want to go back to it,&#x27; he said.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The app uses the power of computer vision&#x2014;the technology of real-time screen reading and response to visual information. Computer vision functions in much the same way as human vision, but computers are at a &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2473;disadvantage&#x3C;/mark&#x3E; because humans spend years learning how to distinguish between faces, trees, numbers and letters. While these visual features appear distinct to us, until recently computers could only identify basic information in images, such as &#x3C;i&#x3E;&#x3C;strong&#x3E;straight lines&#x3C;/strong&#x3E;&#x3C;/i&#x3E;. But how do computers learn to tell various objects and symbols apart and categorise them correctly? The answer lies not in optic nerves and retinas, but in algorithms, cameras and data.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Like humans, the computer needs to &#x27;learn&#x27; how to differentiate visual information, and it does this by looking at vast numbers of images. In the case of the GlucoseRx app, Dr James Charles trained his program by showing it one image of a glucose meter and then introducing random backgrounds so that the program could become familiar with extraneous imagery and easily separate glucose readings from the rest of an image. Once the program could &#x27;see&#x27; images properly, the next step was teaching it to understand what it was seeing. Charles and the team of researchers developed a &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3251;neural network&#x3C;/mark&#x3E; which allows the app to recognise and read numerical digits. &#x27;Since the font on these meters is digital, it&#x27;s easy to train the neural network to recognise lots of different inputs and synthesise the data,&#x27; said Charles.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The result of Charles and his fellow researchers&#x27; work is an app that can read glucose meters as well, if not better than, the human eye. Users simply take a photo of their glucose meter, and the values are automatically entered into the app to determine how much insulin the user needs in order to maintain normal &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3252;blood sugar&#x3C;/mark&#x3E; levels. &#x27;The system is accurate across a range of different types of meters, with reading accuracies close to 100 percent,&#x27; said Professor Roberto Cipolla, a Fellow of Jesus College who also worked on the GlucoseRx app. Cipolla added, &#x27;It doesn&#x27;t matter which orientation the meter is in&#x2014;we tested it in all orientations, viewpoints and light levels.&#x27; Most digital glucose meters are not equipped with &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3253;wireless&#x3C;/mark&#x3E; connectivity, so the app does not require it. &#x27;These meters work perfectly well, so we don&#x27;t want them sent to landfill just because they don&#x27;t have wireless connectivity,&#x27; said Dr James Charles. &#x27;We wanted to find a way to retrofit them in an inexpensive and environmentally-friendly way using a mobile phone app.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Diabetes is a disease which often adversely affects eyesight, and the risk for diabetes increases with age. These factors make the app, which can effectively see on behalf of those with weakened eyesight, all the more beneficial. Aside from the glucose meters which diabetics use, many other types of digital meters are used in medical and industrial fields. Thus, Charles and Cipolla tested their computer vision program on different types of digital meters, including blood pressure meters and bathroom scales. In the near future, computer vision could very well aid the visually impaired with a number of tasks.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Computer vision&#x27;s potential in the field of healthcare, however, extends beyond reading digital meters. The technology is becoming a game-changing tool for medical diagnosis and treatment. Researchers are developing computer vision programs which can read X-rays, CT and MRI scans, and these programs can detect patterns which are invisible to the human eye. Such technology could help doctors identify clogged blood vessels, internal bleeding, tumours and even cancer cells. Early detection of these types of life-threatening health problems using computer vision technology could vastly improve outcomes for patients.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:hsl(0,0%,60%);&#x22;&#x3E;&#x3C;strong&#x3E;Reference:&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:hsl(0,0%,60%);&#x22;&#x3E;James Charles, Stefano Bucciarelli and Roberto Cipolla. &#x27;Real-time screen reading: reducing domain shift for one-shot learning.&#x27; Paper presented at the British Machine Vision Conference 2020&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Summary Completion</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ detailed reading to understand specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ selecting words from the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the summary to get a general understanding of its content.&nbsp;</span></li><li><span style="color:#000000;">Pay attention to grammar. The question may require a verb, a noun, or an adjective.</span></li><li><span style="color:#000000;">Check how many words and/or numbers you may use. Do NOT exceed this limit.</span></li><li><span style="color:#000000;">Summary Completion questions include key terms or details that you may use to help you locate the answers. Scan the text for these details to find the relevant section(s). Then, read in detail to identify the answer.&nbsp;</span></li><li><span style="color:#000000;">Remember to copy the word(s) from the text exactly as they appear. You do NOT need to change them in any way, and you will not receive points for misspelt words.</span></li><li><span style="color:#000000;">Pay attention to whether a word is singular or plural.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Summary Completion questions use paraphrasing or synonyms of words in the text, so it is important to recognize these in order to locate the answers in the text.</span></td></tr><tr><td><span style="color:#000000;">If you are taking the paper-based test, you may write using uppercase or lowercase letters, but make sure that your answer is clear.</span></td></tr><tr><td><span style="color:#000000;">Hyphenated words (<i>\'self-esteem\'</i>) count as one word.</span></td></tr><tr><td><span style="color:#000000;">You may write numbers using numbers (<i>\'23\'</i>) or words (<i>\'twenty-three\'</i>).</span></td></tr><tr><td><span style="color:#000000;">Summary Completion tasks sometimes provide a list of words from which you can select your answers. If this is the case, the words may not necessarily be included in the text. However, you must still check that your answer is correct by reading the appropriate section of the text.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '20',
      //             id: 20,
      //             groupId: 4,
      //           },
      //           {
      //             displayNumber: '21',
      //             id: 21,
      //             groupId: 4,
      //           },
      //           {
      //             displayNumber: '22',
      //             id: 22,
      //             groupId: 4,
      //           },
      //           {
      //             displayNumber: '23',
      //             id: 23,
      //             groupId: 4,
      //           },
      //         ],
      //       },
      //       {
      //         id: 5,
      //         groupNumber: 3,
      //         questionType: 'multiple_choice_1_answer',
      //         directionText:
      //           '<p><span style="color:#000000;">Choose the correct answer.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;Computer vision for diabetes monitoring&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Checking blood sugar levels using a glucose meter is a task that people living with diabetes&#x2014;a disease which affects how the body turns food into energy&#x2014;must carry out at least once per day, though some need to test their blood sugar levels up to seven times per day. Upwards of 4 million people in the UK live with either type one or type two diabetes, and glucose meters are vital for maintaining a healthy lifestyle with diabetes. Despite their usefulness, it can be frustrating for those who use glucose meters to manually transfer health data into mobile phone apps which monitor glucose levels and tell users how much insulin they need. But what if mobile phones could read glucose meters and input values automatically? Dr James Charles from University of Cambridge&#x27;s Department of Engineering has developed a mobile phone app which allows a phone&#x27;s camera to do just that. He believes the GlucoseRx app, which reads and identifies data from glucose meters, will make the process of monitoring blood sugar levels smoother for the millions who live with diabetes in the UK. &#x27;As someone with diabetes, this app makes the whole process easier. I&#x27;ve now forgotten what it was like to enter the values manually, but I do know I wouldn&#x2019;t want to go back to it,&#x27; he said.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The app uses the power of computer vision&#x2014;the technology of real-time screen reading and response to visual information. Computer vision functions in much the same way as human vision, but computers are at a disadvantage because &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3254;humans spend years learning how to distinguish between faces, trees, numbers and letters. While these visual features appear distinct to us, until recently computers could only identify basic information in images, such as &#x3C;/mark&#x3E;&#x3C;i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3C;strong&#x3E;straight lines&#x3C;/strong&#x3E;&#x3C;/mark&#x3E;&#x3C;/i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;.&#x3C;/mark&#x3E; But how do computers learn to tell various objects and symbols apart and categorise them correctly? The answer lies not in optic nerves and retinas, but in algorithms, cameras and data.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Like humans, the computer needs to &#x27;learn&#x27; how to differentiate visual information, and it does this by looking at vast numbers of images. In the case of the GlucoseRx app, Dr James Charles trained his program by showing it one image of a glucose meter and then introducing random backgrounds so that the program could become familiar with extraneous imagery and easily separate glucose readings from the rest of an image. Once the program could &#x27;see&#x27; images properly, the next step was teaching it to understand what it was seeing. Charles and the team of researchers developed a neural network which allows the app to recognise and read numerical digits. &#x27;Since the font on these meters is digital, it&#x27;s easy to train the neural network to recognise lots of different inputs and synthesise the data,&#x27; said Charles.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The result of Charles and his fellow researchers&#x27; work is an app that can read glucose meters as well, if not better than, the human eye. Users simply take a photo of their glucose meter, and the values are automatically entered into the app to determine how much insulin the user needs in order to maintain normal blood sugar levels. &#x27;The system is accurate across a range of different types of meters, with reading accuracies close to 100 percent,&#x27; said Professor Roberto Cipolla, a Fellow of Jesus College who also worked on the GlucoseRx app. Cipolla added, &#x27;It doesn&#x27;t matter which orientation the meter is in&#x2014;we tested it in all orientations, viewpoints and light levels.&#x27; Most digital glucose meters are not equipped with wireless connectivity, so the app does not require it. &#x27;These meters work perfectly well, so we don&#x27;t want them sent to landfill just because they don&#x27;t have wireless connectivity,&#x27; said Dr James Charles. &#x27;We wanted to find a way to retrofit them in an inexpensive and environmentally-friendly way using a mobile phone app.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Diabetes is a disease which often adversely affects eyesight, and the risk for diabetes increases with age. These factors make the app, which can effectively see on behalf of those with weakened eyesight, all the more beneficial. Aside from the glucose meters which diabetics use, many other types of digital meters are used in medical and industrial fields. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3255;Thus, Charles and Cipolla tested their computer vision program on different types of digital meters, including blood pressure meters and bathroom scales.&#x3C;/mark&#x3E; In the near future, computer vision could very well aid the visually impaired with a number of tasks.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Computer vision&#x27;s potential in the field of healthcare, however, extends beyond reading digital meters. The technology is becoming a game-changing tool for medical diagnosis and treatment. Researchers are developing computer vision programs which can read X-rays, CT and MRI scans, and these programs can detect patterns which are invisible to the human eye. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3256;Such technology could help doctors identify clogged blood vessels, internal bleeding, tumours and even cancer cells.&#x3C;/mark&#x3E; Early detection of these types of life-threatening health problems using computer vision technology could vastly improve outcomes for patients.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:hsl(0,0%,60%);&#x22;&#x3E;&#x3C;strong&#x3E;Reference:&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:hsl(0,0%,60%);&#x22;&#x3E;James Charles, Stefano Bucciarelli and Roberto Cipolla. &#x27;Real-time screen reading: reducing domain shift for one-shot learning.&#x27; Paper presented at the British Machine Vision Conference 2020&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Multiple Choice</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ detailed reading</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding general and/or specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the text to get a broad understanding of its content and where information is located. This step can help you avoid looking for information in the wrong location and wasting valuable time.</span></li><li><span style="color:#000000;">Next, skim the Multiple Choice question and its answer choices.</span></li><li><span style="color:#000000;">Multiple Choice questions can contain key terms, synonyms of these terms, or details from the text. Scan the text for these terms or details to locate the relevant section(s). Then, read in detail to determine the correct answer choice.</span></li><li><span style="color:#000000;">Do NOT rely on information that you already know about the subject.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Scanning for key details helps to locate where the solution can be found in the text, but simply finding the details of an answer choice in the text does NOT necessarily mean that this option is correct. Read the section in detail to confirm whether or not the information in the answer option is validated by or contradicts the text.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Correct answer choices often paraphrase the text by using synonyms of key terms, so recognizing these can help you identify the correct option.</span></td></tr><tr><td><span style="color:#000000;">Multiple Choice tasks may ask you to identify various types of information from the text, including facts, connections between ideas, and the writer\'s intention.</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '24',
      //             id: 24,
      //             groupId: 5,
      //           },
      //           {
      //             displayNumber: '25',
      //             id: 25,
      //             groupId: 5,
      //           },
      //           {
      //             displayNumber: '26',
      //             id: 26,
      //             groupId: 5,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     id: 3,
      //     passageTitle: 'World Without Oil',
      //     passageNumber: 3,
      //     originalPassage: '',
      //     groups: [
      //       {
      //         id: 6,
      //         groupNumber: 1,
      //         questionType: 'identifying_information',
      //         directionText:
      //           '<p><span style="color:#000000;">Choose <strong>TRUE</strong> if the statement agrees with the information given in the text, choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;World Without Oil&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;1&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;How much longer will people be able to utilise petroleum and natural gas products? Realistically, humanity will never drain every last drop of oil from the ground. That isn&#x27;t for lack of trying&#x2014;it is simply impossible to access all of it. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3257;People have been using petroleum products for thousands of years, but the large-scale exploitation of petroleum began in the 1850s, and the oil industry has grown exponentially over the last 170 years.&#x3C;/mark&#x3E; However, the most accessible and highest quality oil is rapidly running out, and it will soon cease to be economically viable to obtain the rest.&#x26;nbsp;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;2&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;It should surprise no one that existing reserves are finite. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3258;Oil and natural gas formed from the remains of algae and other sea creatures&#x2014;not dinosaurs as so many believe&#x2014;that perished hundreds of millions of years ago.&#x3C;/mark&#x3E; They were buried in layers of sedimentary rock, and time and pressure transformed them into the viscous hydrocarbons that we rely upon. Thus, most of the reserves that remain untapped are too deep for us to reach.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;3&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Yet, this has not prevented oil companies from pumping oil like there is an eternal supply. It seems like every week I read a news article about a study saying that there is no shortage of oil. The Earth is so huge, we could never run out of oil. Many people believe these reports, but while the former is true, the latter sadly is not. No points will be given for guessing who commissioned those studies and articles.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;4&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;People appear to be in a state of denial. Petroleum products are easy to use, so they are understandably appealing. If you really want to comprehend how important conserving petroleum is&#x2014;just look around you.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;5&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Countless vehicles, trains, ships and aircraft use petrol, diesel and aviation fuel to travel on roads, rails, waves and through the air. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3259;While electric versions of many forms of transportation exist, &#x3C;/mark&#x3E;&#x3C;i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3C;strong&#x3E;they&#x3C;/strong&#x3E; &#x3C;/mark&#x3E;&#x3C;/i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;cannot be depended on for long distances, especially not for international travel and trade. Even electronic vehicles need to recharge their batteries, and the electricity that they use is provided by power plants that burn fossil fuels.&#x3C;/mark&#x3E; While the majority of those plants are coal-burning, many also use natural gas and other petroleum fuels to power their turbines. Electricity generation is by far the largest consumer of petroleum products.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;6&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;And then there is the question of plastics and the petrochemical industry. Four percent of the global oil and gas output is used to produce plastic every year. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325A;Polymer plastics&#x2014;plastics made from petroleum&#x2014;were invented in 1907 but saw limited use. After World War I, advances in the field of chemistry allowed for an explosion of new forms of plastic, and mass production of plastic took off in the late &#x27;40s and early &#x27;50s.&#x3C;/mark&#x3E; Today, it is easier to think about what items do NOT contain plastics than to list all of those that do. Like energy generation, many of these products are vital to our daily lives. Just a century ago all of our clothing, tools, vehicles and buildings were made from leather, natural fibres, wood, stone, metal and glass. Plastic has become incorporated into all of the items we use on a daily basis to varying degrees&#x2014;plastic is not necessarily better than the traditional materials, but it is cheaper and less labour intensive to use. What about newer technologies? Many modern conveniences like computers and smartphones would be impossible without plastic components.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;7&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;If that seems incredible, contemplate the amount of disposable plastic that has been produced. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325B;The majority of plastics do not decompose, and scientists estimate that 8.3 billion tonnes have been produced since the 1950s. As much as 6.3 billion tonnes of that has been discarded as waste, and a meagre nine percent has been recycled.&#x3C;/mark&#x3E; And those plastic bottles, fishing nets, bags, et cetera also required electricity to make, so they consumed oil and gas in the manufacturing process and distribution as well.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;8&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;We face obvious problems caused by oil consumption like pollution and climate change, but there is an even more serious one fast approaching. In the early 1960s, scientists had already predicted that the peak for new oil discoveries was coming soon, and in retrospect we can see that it actually arrived in 1962. In 2005, the world passed the peak for conventional oil production. Today, the production rate of most major oil fields is already declining, the quality of the oil that they can produce is rapidly becoming worse. Many conservationists have been calling for oil production to cease completely, but that may no longer be a choice for our governments to make. By 2050, we could be living in a world without oil.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;9&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The fact of the matter is that we have nearly depleted the world of accessible oil, and we are wholly unprepared to survive without it. There are alternatives, however, to petroleum products. Some of the earliest plastics were made from cellulose (the main component of wood), and other natural materials are also suitable. Plants and food waste can be used to produce biofuels. Energy can be derived from &#x3C;i&#x3E;&#x3C;strong&#x3E;renewable resources&#x3C;/strong&#x3E;&#x3C;/i&#x3E;. After all, solar, wind and hydroelectric power have been used for centuries longer than fossil fuels. But these resources are not sufficient to satisfy our needs at present.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;10&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;There is no reason to believe that humanity will not survive the end of oil. &#x3C;i&#x3E;Homo sapiens&#x3C;/i&#x3E;&#x2014;modern humans&#x2014;have existed for 200,000 years, and we have endured many natural disasters ranging from volcanic mega eruptions to ice ages. We can survive this, too, but we need to face reality. We are addicted to oil, but the supply will soon be depleted. We have the technology that we need to end that dependence, but we need to use it. A world without oil is inevitable, but it will not&#x2014;cannot&#x2014;come tomorrow. If world governments and the scientific community can force the oil industry to admit defeat, we can all work together to wean humanity off of oil and ensure a more comfortable future. Surely, that is worth more than fleeting profits for oil companies.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Identifying Information</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ detailed reading</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">Scan the text for key terms or details from the statement to locate the relevant section(s). Then, read in detail to determine if the statement is true, false, or not given.&nbsp;</span></li><li><span style="color:#000000;">Key terms or details from the statements may be located in two or more sections of the text. If this is the case, skim each section to find the relevant part of the text.&nbsp;</span></li><li><span style="color:#000000;">Scanning for key terms or details helps to locate where the relevant information can be found in the text. However, simply finding information from a statement in the text does not necessarily mean it is true. After scanning to find where the relevant details are located, read that section in detail to confirm whether the information in the statement is true, false, or not given.&nbsp;</span></li><li><span style="color:#000000;">Do NOT stop at key terms in the text. Continue reading to determine whether the statement is factual (\'true\'), not factual (\'false\'), or whether the validity cannot be determined (\'not given\').&nbsp;</span></li><li><span style="color:#000000;">Focus on the facts in the text. Do NOT rely on information that you already know about the subject.&nbsp;</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">\'Not given\' means that the information cannot be determined as either true or false based on the text. This does NOT mean that certain details from the statement cannot be found in the text. A statement that is not given cannot be proved based on the text.</span></td></tr><tr><td><span style="color:#000000;">A false statement is one that you can prove is incorrect based on the text. This means you should be able to find details in the text that contradict the false statement. If the information is simply not referenced in the text, the statement may be not given.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '27',
      //             id: 27,
      //             groupId: 6,
      //           },
      //           {
      //             displayNumber: '28',
      //             id: 28,
      //             groupId: 6,
      //           },
      //           {
      //             displayNumber: '29',
      //             id: 29,
      //             groupId: 6,
      //           },
      //           {
      //             displayNumber: '30',
      //             id: 30,
      //             groupId: 6,
      //           },
      //           {
      //             displayNumber: '31',
      //             id: 31,
      //             groupId: 6,
      //           },
      //         ],
      //       },
      //       {
      //         id: 7,
      //         groupNumber: 2,
      //         questionType: 'matching_sentence_endings',
      //         directionText:
      //           '<p><span style="color:#000000;">Complete each sentence with the correct ending, <strong>A - F</strong>, below. Write the correct letter, <strong>A - F</strong>, in boxes 32 - 36.</span></p>',
      //         image: null,
      //         answerList:
      //           '<p><span style="color:#000000;"><strong>A</strong> developed in rock layers hundreds of millions of years old.</span></p><p><span style="color:#000000;"><strong>B</strong> in nearly every manufacturing process.</span></p><p><span style="color:#000000;"><strong>C</strong> will be used up in a few decades.</span></p><p><span style="color:#000000;"><strong>D</strong> since it is stronger and more durable.</span></p><p><span style="color:#000000;"><strong>E</strong> because people cannot access all of it.</span></p><p><span style="color:#000000;"><strong>F</strong> are used to generate electricity.</span></p>',
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;World Without Oil&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;1&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;How much longer will people be able to utilise petroleum and natural gas products? &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325C;Realistically, humanity will never drain every last drop of oil from the ground. That isn&#x27;t for lack of trying&#x2014;it is simply impossible to access all of it.&#x3C;/mark&#x3E; People have been using petroleum products for thousands of years, but the large-scale exploitation of petroleum began in the 1850s, and the oil industry has grown exponentially over the last 170 years. However, the most accessible and highest quality oil is rapidly running out, and it will soon cease to be economically viable to obtain the rest.&#x26;nbsp;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;2&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325D;It should surprise no one that existing reserves are finite. Oil and natural gas formed from the remains of algae and other sea creatures&#x2014;not dinosaurs as so many believe&#x2014;that perished hundreds of millions of years ago. They were buried in layers of sedimentary rock, and time and pressure transformed them into the viscous hydrocarbons that we rely upon. Thus, most of the reserves that remain untapped are too deep for us to reach.&#x3C;/mark&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;3&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Yet, this has not prevented oil companies from pumping oil like there is an eternal supply. It seems like every week I read a news article about a study saying that there is no shortage of oil. The Earth is so huge, we could never run out of oil. Many people believe these reports, but while the former is true, the latter sadly is not. No points will be given for guessing who commissioned those studies and articles.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;4&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;People appear to be in a state of denial. Petroleum products are easy to use, so they are understandably appealing. If you really want to comprehend how important conserving petroleum is&#x2014;just look around you.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;5&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Countless vehicles, trains, ships and aircraft use petrol, diesel and aviation fuel to travel on roads, rails, waves and through the air. While electric versions of many forms of transportation exist, &#x3C;i&#x3E;&#x3C;strong&#x3E;they&#x3C;/strong&#x3E; &#x3C;/i&#x3E;cannot be depended on for long distances, especially not for international travel and trade. Even electronic vehicles need to recharge their batteries, and the electricity that they use is provided by power plants that burn fossil fuels. While the majority of those plants are coal-burning, many also use natural gas and other petroleum fuels to power their turbines. Electricity generation &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325E;is by far the largest consumer of petroleum products.&#x3C;/mark&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;6&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;And then there is the question of plastics and the petrochemical industry. Four percent of the global oil and gas output is used to produce plastic every year. Polymer plastics&#x2014;plastics made from petroleum&#x2014;were invented in 1907 but saw limited use. After World War I, advances in the field of chemistry allowed for an explosion of new forms of plastic, and mass production of plastic took off in the late &#x27;40s and early &#x27;50s. Today, it is easier to think about what items do NOT contain plastics than to list all of those that do. Like energy generation, many of these products are vital to our daily lives. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325F;Just a century ago all of our clothing, tools, vehicles and buildings were made from leather, natural fibres, wood, stone, metal and glass. Plastic has become incorporated into all of the items we use on a daily basis to varying degrees&#x3C;/mark&#x3E;&#x2014;plastic is not necessarily better than the traditional materials, but it is cheaper and less labour intensive to use. What about newer technologies? Many modern conveniences like computers and smartphones would be impossible without plastic components.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;7&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;If that seems incredible, contemplate the amount of disposable plastic that has been produced. The majority of plastics do not decompose, and scientists estimate that 8.3 billion tonnes have been produced since the 1950s. As much as 6.3 billion tonnes of that has been discarded as waste, and a meagre nine percent has been recycled. And those plastic bottles, fishing nets, bags, et cetera also required electricity to make, so they consumed oil and gas in the manufacturing process and distribution as well.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;8&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;We face obvious problems caused by oil consumption like pollution and climate change, but there is an even more serious one fast approaching. In the early 1960s, scientists had already predicted that the peak for new oil discoveries was coming soon, and in retrospect we can see that it actually arrived in 1962. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B1;In 2005, the world passed the peak for conventional oil production. Today, the production rate of most major oil fields is already declining, the quality of the oil that they can produce is rapidly becoming worse. Many conservationists have been calling for oil production to cease completely, but that may no longer be a choice for our governments to make. By 2050, we could be living in a world without oil.&#x3C;/mark&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;9&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The fact of the matter is that we have nearly depleted the world of accessible oil, and we are wholly unprepared to survive without it. There are alternatives, however, to petroleum products. Some of the earliest plastics were made from cellulose (the main component of wood), and other natural materials are also suitable. Plants and food waste can be used to produce biofuels. Energy can be derived from &#x3C;i&#x3E;&#x3C;strong&#x3E;renewable resources&#x3C;/strong&#x3E;&#x3C;/i&#x3E;. After all, solar, wind and hydroelectric power have been used for centuries longer than fossil fuels. But these resources are not sufficient to satisfy our needs at present.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;10&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;There is no reason to believe that humanity will not survive the end of oil. &#x3C;i&#x3E;Homo sapiens&#x3C;/i&#x3E;&#x2014;modern humans&#x2014;have existed for 200,000 years, and we have endured many natural disasters ranging from volcanic mega eruptions to ice ages. We can survive this, too, but we need to face reality. We are addicted to oil, but the supply will soon be depleted. We have the technology that we need to end that dependence, but we need to use it. A world without oil is inevitable, but it will not&#x2014;cannot&#x2014;come tomorrow. If world governments and the scientific community can force the oil industry to admit defeat, we can all work together to wean humanity off of oil and ensure a more comfortable future. Surely, that is worth more than fleeting profits for oil companies.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Matching Sentence Endings</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ skimming for general understanding</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ identifying connections between ideas</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding general and/or specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the text quickly. Skimming the text before looking at the list of features can help you get a sense of how the text is organised and where information is located. This will help you avoid looking for information in the wrong section and wasting valuable time.</span></li><li><span style="color:#000000;">Next, skim the first sentence beginning to determine which section(s) of the text you will need to read in detail.&nbsp;</span></li><li><span style="color:#000000;">The sentence beginnings can contain key terms, synonyms of these terms, or important details that can help you locate the relevant section(s) in the text.&nbsp;</span></li><li><span style="color:#000000;">After locating the proper section of the text, read carefully to identify the correct option. Then, read your chosen option closely to check that it is indeed correct. Repeat these steps until you have matched all of the sentence endings to their correct beginnings.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Matching Sentence Endings tasks require you to understand how ideas are connected in the text.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">It is NOT possible to match sentence endings by looking only at the questions and using your knowledge of grammar. You must read the relevant section(s) of the text and choose the ending that completes the idea.</span></td></tr><tr><td><span style="color:#000000;">The sentence beginnings appear in the same order as the information in the text.</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '32',
      //             id: 32,
      //             groupId: 7,
      //           },
      //           {
      //             displayNumber: '33',
      //             id: 33,
      //             groupId: 7,
      //           },
      //           {
      //             displayNumber: '34',
      //             id: 34,
      //             groupId: 7,
      //           },
      //           {
      //             displayNumber: '35',
      //             id: 35,
      //             groupId: 7,
      //           },
      //           {
      //             displayNumber: '36',
      //             id: 36,
      //             groupId: 7,
      //           },
      //         ],
      //       },
      //       {
      //         id: 8,
      //         groupNumber: 3,
      //         questionType: 'multiple_choice_1_answer',
      //         directionText:
      //           '<p><span style="color:#000000;">Choose the correct answer.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;World Without Oil&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;1&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;How much longer will people be able to utilise petroleum and natural gas products? Realistically, humanity will never drain every last drop of oil from the ground. That isn&#x27;t for lack of trying&#x2014;it is simply impossible to access all of it. People have been using petroleum products for thousands of years, but the large-scale exploitation of petroleum began in the 1850s, and the oil industry has grown exponentially over the last 170 years. However, &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B5;the most accessible and highest quality oil is rapidly running out&#x3C;/mark&#x3E;, and it will soon cease to be economically viable to obtain the rest.&#x26;nbsp;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;2&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;It should surprise no one that &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B5;existing reserves are finite&#x3C;/mark&#x3E;. Oil and natural gas formed from the remains of algae and other sea creatures&#x2014;not dinosaurs as so many believe&#x2014;that perished hundreds of millions of years ago. They were buried in layers of sedimentary rock, and time and pressure transformed them into the viscous hydrocarbons that we rely upon. Thus, most of the reserves that remain untapped are too deep for us to reach.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;3&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Yet, this has not prevented oil companies from pumping oil like there is an eternal supply. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B2;It seems like every week I read a news article about a study saying that there is no shortage of oil. The Earth is so huge, we could never run out of oil. Many people believe these reports, but while the former is true, the latter sadly is not.&#x3C;/mark&#x3E; No points will be given for guessing who commissioned those studies and articles.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;4&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;People appear to be in a state of denial. Petroleum products are easy to use, so they are understandably appealing. &#x3C;mark class=&#x22;highlight-red&#x22;&#x3E;&#x32B5;If you really want to comprehend how important conserving petroleum is&#x2014;just look around you.&#x3C;/mark&#x3E;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;5&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Countless vehicles, trains, ships and aircraft use petrol, diesel and aviation fuel to travel on roads, rails, waves and through the air. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B3;While electric versions of many forms of transportation exist, &#x3C;/mark&#x3E;&#x3C;i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3C;strong&#x3E;they&#x3C;/strong&#x3E; &#x3C;/mark&#x3E;&#x3C;/i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;cannot be depended on for long distances, especially not for international travel and trade.&#x3C;/mark&#x3E; Even electronic vehicles need to recharge their batteries, and the electricity that they use is provided by &#x3C;mark class=&#x22;highlight-red&#x22;&#x3E;&#x32B3;power plants that burn fossil fuels.&#x3C;/mark&#x3E; While the majority of those plants are coal-burning, many also use natural gas and other petroleum fuels to power their turbines. Electricity generation is by far the largest consumer of petroleum products.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;6&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;And then there is the question of plastics and the petrochemical industry. Four percent of the global oil and gas output is used to produce plastic every year. Polymer plastics&#x2014;plastics made from petroleum&#x2014;were invented in 1907 but saw limited use. After World War I, advances in the field of chemistry allowed for an explosion of new forms of plastic, and mass production of plastic took off in the late &#x27;40s and early &#x27;50s. &#x3C;mark class=&#x22;highlight-red&#x22;&#x3E;&#x32B5;Today, it is easier to think about what items do NOT contain plastics than to list all of those that do. Like energy generation, many of these products are vital to our daily lives.&#x3C;/mark&#x3E; Just a century ago all of our clothing, tools, vehicles and buildings were made from leather, natural fibres, wood, stone, metal and glass. Plastic has become incorporated into all of the items we use on a daily basis to varying degrees&#x2014;plastic is not necessarily better than the traditional materials, but it is cheaper and less labour intensive to use. What about newer technologies? Many modern conveniences like computers and smartphones would be impossible without plastic components.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;7&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;If that seems incredible, contemplate the amount of disposable plastic that has been produced. The majority of plastics do not decompose, and scientists estimate that 8.3 billion tonnes have been produced since the 1950s. As much as 6.3 billion tonnes of that has been discarded as waste, and a meagre nine percent has been recycled. And those plastic bottles, fishing nets, bags, et cetera also required electricity to make, so they consumed oil and gas in the manufacturing process and distribution as well.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;8&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;We face obvious problems caused by oil consumption like pollution and climate change, but there is an even more serious one fast approaching. In the early 1960s, scientists had already predicted that the peak for new oil discoveries was coming soon, and in retrospect we can see that it actually arrived in 1962. In 2005, the world passed the peak for conventional oil production. Today, the production rate of most major oil fields is already declining, the quality of the oil that they can produce is rapidly becoming worse. Many conservationists have been calling for oil production to cease completely, but that may no longer be a choice for our governments to make. By 2050, we could be living in a world without oil.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;9&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The fact of the matter is that we have nearly depleted the world of accessible oil, and we are wholly unprepared to survive without it. There are alternatives, however, to petroleum products. Some of the earliest plastics were made from cellulose (the main component of wood), and other natural materials are also suitable. Plants and food waste can be used to produce biofuels. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B4;Energy can be derived from &#x3C;/mark&#x3E;&#x3C;i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3C;strong&#x3E;renewable resources&#x3C;/strong&#x3E;&#x3C;/mark&#x3E;&#x3C;/i&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;. After all, solar, wind and hydroelectric power have been used for centuries longer than fossil fuels.&#x3C;/mark&#x3E; &#x3C;mark class=&#x22;highlight-red&#x22;&#x3E;&#x32B4;But these resources are not sufficient to satisfy our needs at present.&#x3C;/mark&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;10&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;There is no reason to believe that humanity will not survive the end of oil. &#x3C;i&#x3E;Homo sapiens&#x3C;/i&#x3E;&#x2014;modern humans&#x2014;have existed for 200,000 years, and we have endured many natural disasters ranging from volcanic mega eruptions to ice ages. We can survive this, too, but we need to face reality. &#x3C;mark class=&#x22;highlight-red&#x22;&#x3E;&#x32B2;&#x3C;/mark&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B5;&#x3C;/mark&#x3E;&#x3C;mark class=&#x22;highlight-grey&#x22;&#x3E;We are addicted to oil, but the supply will soon be depleted.&#x3C;/mark&#x3E;&#x3C;mark class=&#x22;highlight-red&#x22;&#x3E; We have the technology that we need to end that dependence, but we need to use it.&#x3C;/mark&#x3E; A world without oil is inevitable, but it will not&#x2014;cannot&#x2014;come tomorrow. If world governments and the scientific community can force the oil industry to admit defeat, we can all work together to wean humanity off of oil and ensure a more comfortable future. Surely, that is worth more than fleeting profits for oil companies.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Multiple Choice</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ detailed reading</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding general and/or specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the text to get a broad understanding of its content and where information is located. This step can help you avoid looking for information in the wrong location and wasting valuable time.</span></li><li><span style="color:#000000;">Next, skim the Multiple Choice question and its accompanying answer choices.</span></li><li><span style="color:#000000;">Multiple Choice questions can contain key terms, synonyms of these terms, or details from the text. Scan the text for these terms or details to locate the relevant section(s). Then, read in detail to determine the correct answer choice.</span></li><li><span style="color:#000000;">Do NOT rely on information that you already know about the subject.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Scanning for key details helps to locate where the solution can be found in the text, but simply finding the details of an answer choice in the text does NOT necessarily mean that this option is correct. Read the section in detail to confirm whether or not the information in the answer option is validated by or contradicts the text.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Correct answer choices often paraphrase the text by using synonyms of key terms, so recognizing these can help you identify the correct option.</span></td></tr><tr><td><span style="color:#000000;">Multiple Choice tasks may ask you to identify various types of information from the text, including facts, connections between ideas, and the writer\'s intention.</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '37',
      //             id: 37,
      //             groupId: 8,
      //           },
      //           {
      //             displayNumber: '38',
      //             id: 38,
      //             groupId: 8,
      //           },
      //           {
      //             displayNumber: '39',
      //             id: 39,
      //             groupId: 8,
      //           },
      //           {
      //             displayNumber: '40',
      //             id: 40,
      //             groupId: 8,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     id: 7,
      //     passageTitle: 'The wisdom of the herd',
      //     passageNumber: 1,
      //     originalPassage: '&#x3C;p&#x3E;The wisdom of the herd&#x3C;/p&#x3E;',
      //     groups: [
      //       {
      //         id: 14,
      //         groupNumber: 1,
      //         questionType: 'identifying_information',
      //         directionText:
      //           '<p><span style="color:#000000;">Choose <strong>TRUE</strong> if the statement agrees with the information given in the text, choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;The wisdom of the herd&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Animals that flock together in groups tend to get little respect for their intellect from humans. Fish are known for their short memories, and &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2460;the term &#x27;sheep&#x27; is used for people who are incapable of thinking for themselves&#x3C;/mark&#x3E;. &#x27;Herd mentality&#x27; similarly has a negative connotation, and evokes images of stampedes of people mindlessly rushing to exits during a fire and trampling others in the process. However, new research suggests that there is much to be learned from herds.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Fish that live in herd-like groups called &#x27;schools&#x27; are not usually thought of as complex creatures, and people have long believed that most fish do not even feel pain. But recent studies are beginning to reveal that working together in schools helps both individual fish and schools reduce the risk of harm to themselves. The way that schools of fish minimise risk raises the question of whether people behave similarly to achieve their goals.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Guppies, small freshwater fish that live in schools, are not skilled strategists alone, but research shows that they find safety in numbers. Consider protection from predators, for example. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2461;Alone a guppy is highly vulnerable to predators, but together these small fish can outsmart them.&#x3C;/mark&#x3E; &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2462;The behaviour of guppies exemplifies what is known as &#x27;selfish herd theory&#x27;.&#x3C;/mark&#x3E; According to this theory, animals move closer to other members of the herd and closer to the centre of the herd to minimise their own vulnerability to predators. In doing so, however, herd animals tighten their ranks and make it harder for the predator to attack the herd as a whole. Guppies exhibit selfish herd theory in much the same way; they swim to the centre of the school to avoid predators while also making it difficult for predators to attack. But schools of guppies take this strategy to the next level. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2463;Researchers have uncovered several complex patterns of synchronised movement that guppies use to keep predators guessing. By alternating between unique movement patterns, guppies prevent predators from predicting their next move.&#x3C;/mark&#x3E;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;But is it possible that selfish herd theory applies to human behaviour? Theorists have compared the decisions made by schools of guppies and those made by investors who buy and sell stocks. Like guppies, investors often follow a herd when choosing what stocks to buy because they assume that, if others are investing in a stock, it must be a fairly safe investment. Generally, if investors follow the herd in this way, they are likely to increase the value of the stock and lower the risk of loss for themselves and other investors, thereby strengthening the herd. While the benefits of the selfish herd strategy certainly have limits, it can be an effective financial strategy.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;According to recent studies, birds also flock together in groups, and pigeons in particular display effective decision-making and leadership. Pigeons sometimes travel great distances, but no single pigeon makes all the decisions when navigating. Anyone who has ever tried to decide as a group knows that not all members have the same level of knowledge or experience. That is also true of pigeons, which is why they have perfected the art of compromising. When two pigeons have a disagreement about which direction to fly in, they compromise by averaging the trajectories together to create a new path. If a compromise cannot be reached, one of the birds becomes the leader. This process works on a broader scale in a flock of pigeons, and research has shown that it leads to precise navigational accuracy.&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Humans, too, can achieve optimal results through consensus and effective leadership. An excellent example of this strategy in action is in a company&#x27;s boardroom. Although CEOs get much of the attention in the media, company decisions are usually made through consensus among other executive officers and a board of directors who represent the company&#x27;s shareholders. Businesses must make important decisions regularly that could affect employees, consumers, profits and stock prices, and one wrong decision could have a devastating impact. As a result, company leadership uses the collective knowledge of executives and board members to reach a consensus through discussion or voting. Like flocks of pigeons, companies can chart the best course forward through compromise.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Another herd animal that provides a model for success is the cow. Cows may seem like simple creatures, but they have a remarkable ability to learn from each other. When finding water, cows use their collective knowledge. An individual cow would struggle to find water, but &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2464;the herd can find it by aggregating all of the cows&#x27; guesses as to where water might be.&#x3C;/mark&#x3E; &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2465;In one study, a herd of cows performed better than a computer at this task.&#x3C;/mark&#x3E; This system is known as &#x27;the wisdom of the crowd&#x27;, and humans also exhibit it. The most common example of humans using this approach is guessing the weight of livestock. Most people will naturally guess incorrectly, but by collecting the guesses of a group of people and determining the average guessed weight, they can arrive at the animal&#x27;s weight with startling accuracy. The wisdom that groups of people have to offer through their collective knowledge was called &#x3C;i&#x3E;vox populi&#x3C;/i&#x3E; in ancient Rome, and it is just one of the many ways that humans are stronger in groups.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;&#x3C;strong&#x3E;References:&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;Biro, D., Sumpter, D. J., Meade, J., &#x26;amp; Guilford, T. (2006). From Compromise to Leadership in Pigeon Homing. Current Biology, 16(21), 2123&#x2013;2128.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;Price, M. E. (2013, June 25). Human Herding: How People are Like Guppies. Psychology Today.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Identifying Information</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ detailed reading</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">Scan the text for key terms or details from the statement to locate the relevant section(s). Then, read in detail to determine if the statement is true, false, or not given.&nbsp;</span></li><li><span style="color:#000000;">Key terms or details from the statements may be located in two or more sections of the text. If this is the case, skim each section to find the relevant part of the text.&nbsp;</span></li><li><span style="color:#000000;">Scanning for key terms or details helps to locate where the relevant information can be found in the text. However, simply finding information from a statement in the text does not necessarily mean it is true. After scanning to find where the relevant details are located, read that section in detail to confirm whether the information in the statement is true, false, or not given.&nbsp;</span></li><li><span style="color:#000000;">Do NOT stop at key terms in the text. Continue reading to determine whether the statement is factual (\'true\'), not factual (\'false\'), or whether the validity cannot be determined (\'not given\').&nbsp;</span></li><li><span style="color:#000000;">Focus on the facts in the text. Do NOT rely on information that you already know about the subject.&nbsp;</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">\'Not given\' means that the information cannot be determined as either true or false based on the text. This does NOT mean that certain details from the statement cannot be found in the text. A statement that is not given cannot be proved based on the text.</span></td></tr><tr><td><span style="color:#000000;">A false statement is one that you can prove is incorrect based on the text. This means you should be able to find details in the text that contradict the false statement. If the information is simply not referenced in the text, the statement may be not given.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '1',
      //             id: 56,
      //             groupId: 14,
      //           },
      //           {
      //             displayNumber: '2',
      //             id: 57,
      //             groupId: 14,
      //           },
      //           {
      //             displayNumber: '3',
      //             id: 58,
      //             groupId: 14,
      //           },
      //           {
      //             displayNumber: '4',
      //             id: 59,
      //             groupId: 14,
      //           },
      //           {
      //             displayNumber: '5',
      //             id: 60,
      //             groupId: 14,
      //           },
      //           {
      //             displayNumber: '6',
      //             id: 61,
      //             groupId: 14,
      //           },
      //         ],
      //       },
      //       {
      //         id: 15,
      //         groupNumber: 2,
      //         questionType: 'matching_sentence_endings',
      //         directionText:
      //           '<p><span style="color:#000000;">Complete each sentence with the correct ending, <strong>A - F</strong>, below. Write the correct letter, <strong>A - F</strong>, in boxes 7 - 9.</span></p>',
      //         image: null,
      //         answerList:
      //           '<p><span style="color:#000000;"><strong>A</strong> make compromises by discussing with each other or by voting.</span></p><p><span style="color:#000000;"><strong>B</strong> use complicated systems of communication to succeed.</span></p><p><span style="color:#000000;"><strong>C</strong> follow the decisions of others to reduce their own risk.</span></p><p><span style="color:#000000;"><strong>D</strong> vote to choose a leader who will make decisions for the group.</span></p><p><span style="color:#000000;"><strong>E</strong> can use their collective knowledge to reach the correct answer.</span></p><p><span style="color:#000000;"><strong>F</strong> solve problems using their individual critical thinking abilities.</span></p>',
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;The wisdom of the herd&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Animals that flock together in groups tend to get little respect for their intellect from humans. Fish are known for their short memories, and the term &#x27;sheep&#x27; is used for people who are incapable of thinking for themselves. &#x27;Herd mentality&#x27; similarly has a negative connotation, and evokes images of stampedes of people mindlessly rushing to exits during a fire and trampling others in the process. However, new research suggests that there is much to be learned from herds.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Fish that live in herd-like groups called &#x27;schools&#x27; are not usually thought of as complex creatures, and people have long believed that most fish do not even feel pain. But recent studies are beginning to reveal that working together in schools helps both individual fish and schools reduce the risk of harm to themselves. The way that schools of fish minimise risk raises the question of whether people behave similarly to achieve their goals.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Guppies, small freshwater fish that live in schools, are not skilled strategists alone, but research shows that they find safety in numbers. Consider protection from predators, for example. Alone a guppy is highly vulnerable to predators, but together these small fish can outsmart them. The behaviour of guppies exemplifies what is known as &#x27;selfish herd theory&#x27;. According to this theory, animals move closer to other members of the herd and closer to the centre of the herd to minimise their own vulnerability to predators. In doing so, however, herd animals tighten their ranks and make it harder for the predator to attack the herd as a whole. Guppies exhibit selfish herd theory in much the same way; they swim to the centre of the school to avoid predators while also making it difficult for predators to attack. But schools of guppies take this strategy to the next level. Researchers have uncovered several complex patterns of synchronised movement that guppies use to keep predators guessing. By alternating between unique movement patterns, guppies prevent predators from predicting their next move.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;But is it possible that selfish herd theory applies to human behaviour? Theorists have compared the decisions made by schools of guppies and those made by investors who buy and sell stocks. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2466;Like guppies, investors often follow a herd when choosing what stocks to buy because they assume that, if others are investing in a stock, it must be a fairly safe investment. Generally, if investors follow the herd in this way, they are likely to increase the value of the stock and lower the risk of loss for themselves and other investors, thereby strengthening the herd.&#x3C;/mark&#x3E; While the benefits of the selfish herd strategy certainly have limits, it can be an effective financial strategy.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;According to recent studies, birds also flock together in groups, and pigeons in particular display effective decision-making and leadership. Pigeons sometimes travel great distances, but no single pigeon makes all the decisions when navigating. Anyone who has ever tried to decide as a group knows that not all members have the same level of knowledge or experience. That is also true of pigeons, which is why they have perfected the art of compromising. When two pigeons have a disagreement about which direction to fly in, they compromise by averaging the trajectories together to create a new path. If a compromise cannot be reached, one of the birds becomes the leader. This process works on a broader scale in a flock of pigeons, and research has shown that it leads to precise navigational accuracy.&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Humans, too, can achieve optimal results through consensus and effective leadership. An excellent example of this strategy in action is in a company&#x27;s boardroom. Although CEOs get much of the attention in the media, company decisions are usually made through consensus among other executive officers and a board of directors who represent the company&#x27;s shareholders. Businesses must make important decisions regularly that could affect employees, consumers, profits and stock prices, and one wrong decision could have a devastating impact. As a result, &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2467;company leadership uses the collective knowledge of executives and board members to reach a consensus through discussion or voting.&#x3C;/mark&#x3E; Like flocks of pigeons, companies can chart the best course forward through compromise.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Another herd animal that provides a model for success is the cow. Cows may seem like simple creatures, but they have a remarkable ability to learn from each other. When finding water, cows use their collective knowledge. An individual cow would struggle to find water, but the herd can find it by aggregating all of the cows&#x27; guesses as to where water might be. In one study, a herd of cows performed better than a computer at this task. This system is known as &#x27;the wisdom of the crowd&#x27;, and humans also exhibit it. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2468;The most common example of humans using this approach is guessing the weight of livestock. Most people will naturally guess incorrectly, but by collecting the guesses of a group of people and determining the average guessed weight, they can arrive at the animal&#x27;s weight with startling accuracy.&#x3C;/mark&#x3E; The wisdom that groups of people have to offer through their collective knowledge was called &#x3C;i&#x3E;vox populi&#x3C;/i&#x3E; in ancient Rome, and it is just one of the many ways that humans are stronger in groups.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;&#x3C;strong&#x3E;References:&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;Biro, D., Sumpter, D. J., Meade, J., &#x26;amp; Guilford, T. (2006). From Compromise to Leadership in Pigeon Homing. Current Biology, 16(21), 2123&#x2013;2128.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;Price, M. E. (2013, June 25). Human Herding: How People are Like Guppies. Psychology Today.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Matching Sentence Endings</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ skimming for general understanding</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ identifying connections between ideas</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ understanding general and/or specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅ recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the text quickly. Skimming the text before looking at the list of features can help you get a sense of how the text is organised and where information is located. This will help you avoid looking for information in the wrong section and wasting valuable time.</span></li><li><span style="color:#000000;">Next, skim the first sentence beginning to determine which section(s) of the text you will need to read in detail.&nbsp;</span></li><li><span style="color:#000000;">The sentence beginnings can contain key terms, synonyms of these terms, or important details that can help you locate the relevant section(s) in the text.&nbsp;</span></li><li><span style="color:#000000;">After locating the proper section of the text, read carefully to identify the correct option. Then, read your chosen option closely to check that it is indeed correct. Repeat these steps until you have matched all of the sentence endings to their correct beginnings.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Matching Sentence Endings tasks require you to understand how ideas are connected in the text.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">It is NOT possible to match sentence endings by looking only at the questions and using your knowledge of grammar. You must read the relevant section(s) of the text and choose the ending that completes the idea.</span></td></tr><tr><td><span style="color:#000000;">The sentence beginnings appear in the same order as the information in the text.</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '7',
      //             id: 62,
      //             groupId: 15,
      //           },
      //           {
      //             displayNumber: '8',
      //             id: 63,
      //             groupId: 15,
      //           },
      //           {
      //             displayNumber: '9',
      //             id: 64,
      //             groupId: 15,
      //           },
      //         ],
      //       },
      //       {
      //         id: 16,
      //         groupNumber: 3,
      //         questionType: 'flow_chart_completion',
      //         directionText:
      //           '<p><span style="color:#000000;">Complete the flow-chart. Write <strong>ONE WORD ONLY</strong> from the text for each answer. Write your answers in boxes 10 - 13 below.</span></p>',
      //         image:
      //           'https://toeflbank-rest-api-production.s3.amazonaws.com/content/ielts/reading_group/image/Release%203%20Image%20_RC%20SET%208%20P1%20%5BHow%20Pigeons%20Navigate%5D_5751274be18345a187c9edd774568484.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAWIENLWIIYBH46SHI%2F20220808%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220808T005611Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAOcLaEyDnPYYhlHDe2I05IQpvjOLRGfgmC990JbMtBxoAiBkbuxSLdGOAxPOE22xZDH4szD7ptPXEv6NKGtedzolPyqRBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDQyOTc5MzE5NDUxMyIMqvnS%2FDGT5d94xBCJKuUD4KBXnVVRqPVoNTMY6yG3eb0FnU4u0azTzORKwMwkIO8Np5iNMJM5xLhR8aZNo0vDpJJ%2BK9d1KMwW5eu7a6McbVqYUp7j5GN1fz8jEgc2q3f8PxYhLbOai2DwJ6Xl%2FCFH7mSYfTTZOIFu6aZ0w4U9uwkWD7idISwSFnceV8XGHy6zrfESg66%2BO248HT%2BOWSRk2ooyT1UjKoY6XHeRci9jMN%2Ffy4Ht5Rt4IxS0VWWHG5UCM4yLIpPOAmcRLyopTl6PS2%2BqeJw%2BektXMEezrHeHxSEv%2FbzB3wje6DTkjLyRhMUuRGDsIfw2ekYqcbLChLHdsJ4dhAs9YJStK2zbsWx6q4Apcz73pEM59h3QV%2FDVAYuSED%2BSQ5woWPGIoeOhKMgnBpI%2BCSF8jeWNZMbNn06OptNocSL0gCnhfPQ35yB5tuSo0l7sLYdmY4j4uMc7vYmnOQoJO0%2BAxtJ5ay8pPlHcgr4CJJ1GSsgnwpTzdA8TfcKk2Yjhj3KFtwIweDE6fgkg1UI5s5J6jKAn%2BXY23qpyJaI4vg7dPVtFjcUXsU7QXi3X6jaw05aBeg6ll379CWZ64Ij%2B%2F6OF6e2tPP4lOfeW5%2BbQw7UEuUAC7MhtgrQFzX7kz2Jf9NYKVA6aCwX437JAPN52xxswsKDAlwY6pQGPXzzj3NwBH5T4bxQi3E6SGj3djWqGXbkPA%2FUkk%2FASBloxiggQ1JjZMBWUJjfeH7uuf4Y9nkohyD7tsqsvryE4A1wsjKMTkaoaLkmHY9O9P3y5h7G2xtx1GhVJX79XLj4922qetF%2FD22EnxiTR%2FwFwsROekWuwrsbdivinlHA9%2BMNw%2BDo06g3fNgELrYUXArMxOv%2BsJhcHIeWP3SEvdX6pS7EARY0%3D&X-Amz-Signature=53b7812cb98e069a8f4039bca86c695041e9e495201fbb8331fb12fc281d16f5',
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;The wisdom of the herd&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Animals that flock together in groups tend to get little respect for their intellect from humans. Fish are known for their short memories, and the term &#x27;sheep&#x27; is used for people who are incapable of thinking for themselves. &#x27;Herd mentality&#x27; similarly has a negative connotation, and evokes images of stampedes of people mindlessly rushing to exits during a fire and trampling others in the process. However, new research suggests that there is much to be learned from herds.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Fish that live in herd-like groups called &#x27;schools&#x27; are not usually thought of as complex creatures, and people have long believed that most fish do not even feel pain. But recent studies are beginning to reveal that working together in schools helps both individual fish and schools reduce the risk of harm to themselves. The way that schools of fish minimise risk raises the question of whether people behave similarly to achieve their goals.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Guppies, small freshwater fish that live in schools, are not skilled strategists alone, but research shows that they find safety in numbers. Consider protection from predators, for example. Alone a guppy is highly vulnerable to predators, but together these small fish can outsmart them. The behaviour of guppies exemplifies what is known as &#x27;selfish herd theory&#x27;. According to this theory, animals move closer to other members of the herd and closer to the centre of the herd to minimise their own vulnerability to predators. In doing so, however, herd animals tighten their ranks and make it harder for the predator to attack the herd as a whole. Guppies exhibit selfish herd theory in much the same way; they swim to the centre of the school to avoid predators while also making it difficult for predators to attack. But schools of guppies take this strategy to the next level. Researchers have uncovered several complex patterns of synchronised movement that guppies use to keep predators guessing. By alternating between unique movement patterns, guppies prevent predators from predicting their next move.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;But is it possible that selfish herd theory applies to human behaviour? Theorists have compared the decisions made by schools of guppies and those made by investors who buy and sell stocks. Like guppies, investors often follow a herd when choosing what stocks to buy because they assume that, if others are investing in a stock, it must be a fairly safe investment. Generally, if investors follow the herd in this way, they are likely to increase the value of the stock and lower the risk of loss for themselves and other investors, thereby strengthening the herd. While the benefits of the selfish herd strategy certainly have limits, it can be an effective financial strategy.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;According to recent studies, birds also flock together in groups, and pigeons in particular display effective decision-making and leadership. Pigeons sometimes travel great distances, but no single pigeon makes all the decisions when navigating. Anyone who has ever tried to decide as a group knows that not all members have the same level of knowledge or experience. That is also true of pigeons, which is why they have perfected the art of compromising. When two pigeons have a &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2469;disagreement&#x3C;/mark&#x3E; about which direction to fly in, they compromise by &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246A;averaging&#x3C;/mark&#x3E; the trajectories together to create a new path. If a compromise cannot be reached, one of the birds becomes the &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246B;leader&#x3C;/mark&#x3E;. This process works on a broader scale in a flock of pigeons, and research has shown that it leads to precise navigational &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246C;accuracy&#x3C;/mark&#x3E;.&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Humans, too, can achieve optimal results through consensus and effective leadership. An excellent example of this strategy in action is in a company&#x27;s boardroom. Although CEOs get much of the attention in the media, company decisions are usually made through consensus among other executive officers and a board of directors who represent the company&#x27;s shareholders. Businesses must make important decisions regularly that could affect employees, consumers, profits and stock prices, and one wrong decision could have a devastating impact. As a result, company leadership uses the collective knowledge of executives and board members to reach a consensus through discussion or voting. Like flocks of pigeons, companies can chart the best course forward through compromise.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Another herd animal that provides a model for success is the cow. Cows may seem like simple creatures, but they have a remarkable ability to learn from each other. When finding water, cows use their collective knowledge. An individual cow would struggle to find water, but the herd can find it by aggregating all of the cows&#x27; guesses as to where water might be. In one study, a herd of cows performed better than a computer at this task. This system is known as &#x27;the wisdom of the crowd&#x27;, and humans also exhibit it. The most common example of humans using this approach is guessing the weight of livestock. Most people will naturally guess incorrectly, but by collecting the guesses of a group of people and determining the average guessed weight, they can arrive at the animal&#x27;s weight with startling accuracy. The wisdom that groups of people have to offer through their collective knowledge was called &#x3C;i&#x3E;vox populi&#x3C;/i&#x3E; in ancient Rome, and it is just one of the many ways that humans are stronger in groups.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;&#x3C;strong&#x3E;References:&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;Biro, D., Sumpter, D. J., Meade, J., &#x26;amp; Guilford, T. (2006). From Compromise to Leadership in Pigeon Homing. Current Biology, 16(21), 2123&#x2013;2128.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#999999;&#x22;&#x3E;Price, M. E. (2013, June 25). Human Herding: How People are Like Guppies. Psychology Today.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Flow-chart Completion</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅detailed reading to understand a series of events or processes</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅selecting words from the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the flow-chart to get a general understanding of its content.&nbsp;</span></li><li><span style="color:#000000;">Check how many words and/or numbers you may use. Do not exceed this limit.</span></li><li><span style="color:#000000;">Pay attention to grammar. The question may require a verb, a noun, or an adjective.</span></li><li><span style="color:#000000;">Flow-chart Completion tasks usually describe a sequence of events or a series of concepts, so scan for dates or key terms from the flow-chart in the text to locate the relevant section(s). Then, read in detail to identify the answers.&nbsp;</span></li><li><span style="color:#000000;">Remember to copy the word(s) from the text exactly as they appear. You do NOT need to change them in any way, and you will not receive points for misspelt words.</span></li><li><span style="color:#000000;">Pay attention to whether a word is singular or plural.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Flow-chart Completion questions use paraphrasing or synonyms of words in the text, so it is important to recognize these in order to locate the answer in the text.</span></td></tr><tr><td><span style="color:#000000;">If you are taking the paper-based test, you may write using uppercase or lowercase letters, but make sure that your answer is clear.</span></td></tr><tr><td><span style="color:#000000;">Hyphenated words (<i>\'self-esteem\'</i>) count as one word.</span></td></tr><tr><td><span style="color:#000000;">You may write numbers using numbers (<i>\'23\'</i>) or words (<i>\'twenty-three\'</i>).</span></td></tr><tr><td><span style="color:#000000;">Flow-chart Completion questions do not always appear in the same order as the information in the text.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '10',
      //             id: 65,
      //             groupId: 16,
      //           },
      //           {
      //             displayNumber: '11',
      //             id: 66,
      //             groupId: 16,
      //           },
      //           {
      //             displayNumber: '12',
      //             id: 67,
      //             groupId: 16,
      //           },
      //           {
      //             displayNumber: '13',
      //             id: 68,
      //             groupId: 16,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     id: 8,
      //     passageTitle: 'Onwards and Upwards',
      //     passageNumber: 2,
      //     originalPassage: '&#x3C;p&#x3E;Onwards and Upwards&#x3C;/p&#x3E;',
      //     groups: [
      //       {
      //         id: 17,
      //         groupNumber: 1,
      //         questionType: 'matching_headings',
      //         directionText:
      //           '<p><span style="color:#000000;">The text has five sections, <strong>A - E</strong>. Choose the correct heading for each section from the list of headings below. Write the correct number, <strong>i - viii</strong>, in boxes 14 - 18.&nbsp;</span></p>',
      //         image: null,
      //         answerList:
      //           '<p><span style="color:#000000;"><strong>List of Headings</strong></span></p><p><span style="color:#000000;"><strong>i </strong>A fateful merger</span></p><p><span style="color:#000000;"><strong>ii </strong>Early years</span></p><p><span style="color:#000000;"><strong>iii </strong>Significance of achievements</span></p><p><span style="color:#000000;"><strong>iv </strong>A new breed of rocket</span></p><p><span style="color:#000000;"><strong>v </strong>Hurdles to overcome</span></p><p><span style="color:#000000;"><strong>vi </strong>Finding a dream</span></p><p><span style="color:#000000;"><strong>vii </strong>Competing companies</span></p><p><span style="color:#000000;"><strong>viii</strong> From California to space</span></p>',
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;Onwards and Upwards&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;i&#x3E;A South African-Canadian has his sights set on the stars, and his company is revolutionising the burgeoning space transportation industry.&#x3C;/i&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;A&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Elon Musk founded Space Exploration Technologies Corp., better known as SpaceX, in 2002 with two main goals: to reduce space transportation costs and enable the colonisation of Mars. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246D;The company aired a live broadcast of the launch of a specially modified reusable rocket known as Falcon 9 Flight 20 on December 21, 2015.&#x3C;/mark&#x3E; The rocket launched and left the atmosphere without mishap, and then the second stage of the rocket separated, deployed its payload of satellites and fell to burn up on re-entry into the atmosphere. Meanwhile, the first stage descended using its rocket engines to make a controlled vertical landing on an autonomous spaceport drone ship (ASDS) in the ocean. When the rocket successfully touched down, a SpaceX engineer announced that &#x27;the Falcon has landed,&#x27; referencing the first landing on the Moon of NASA&#x27;s Apollo program. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246D;This was the first time that a rocket was able to return to Earth and land under its own power, which could potentially revolutionise space transportation.&#x3C;/mark&#x3E; Most rockets are left to orbit the planet, burn up in the atmosphere or descend into the ocean by parachute. Robinson Meyer, technology editor for &#x3C;i&#x3E;The Atlantic&#x3C;/i&#x3E;, summarised the scripted broadcast as &#x27;a way of treating a rocket launch not like a dry engineering procedure, but like some combination of the Macy&#x27;s Thanksgiving Day Parade and the Super Bowl.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;B&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246E;SpaceX is headquartered in Hawthorne, California, and it manufactures rocket engines, launch vehicles, cargo and crew spacecraft and communications satellites.&#x3C;/mark&#x3E; Since its inception, SpaceX has achieved many firsts for a private company. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246E;It launched the first privately funded liquid-fuelled rocket to reach Earth&#x27;s orbit. It was also the first private company to send a spacecraft to the International Space Station (ISS), and it created the first orbital rocket that can take off and land vertically and be reused.&#x3C;/mark&#x3E; SpaceX&#x27;s fleet of rockets includes the reusable Falcon 9, Falcon Heavy and Dragon, and it will soon debut the Starship super heavy-lift launch system. The Starship will have the largest capacity of any orbital rocket ever built at 100 tonnes and be completely reusable, making its operating costs very low. SpaceX has launched 143 Falcon 9 rockets with only one total loss and one partial failure. SpaceX is also attempting to build a controversial internet satellite constellation of over 4,000 satellites called Starlink to provide wireless internet access worldwide. The profits from that venture will be used to finance the establishment of a colony on Mars. While SpaceX&#x27;s rocket programs enjoy broad support, many astronomers have criticised Starlink because of the visual and electromagnetic interference that the satellites will create.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;C&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Through SpaceX and his other business ventures, Elon Musk is currently the wealthiest person globally and is worth an estimated $243 billion. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x246F;He was born in Pretoria, South Africa, in 1971, and he showed an aptitude for computing and programming in his youth.&#x3C;/mark&#x3E; When he was 17, he left South Africa for Canada to avoid military service. Musk began his university education at Queen&#x27;s University in Kingston, Ontario, but he completed his undergraduate studies at the University of Pennsylvania with a double major in economics and physics. He completed two internships in Silicon Valley at an energy storage start-up and a game company. He began a doctorate program at Stanford University in 1995, but he soon dropped out to launch his own start-up with his brother Kimbal and Greg Kouri. They created Zip2, an Internet-based company that provided online city guide software to newspapers. At first, Musk said, &#x27;The website was up during the day and I was coding it at night, seven days a week, all the time.&#x27; But they obtained contracts, and Compaq later acquired the company for $307 million, with Musk receiving $7 million for his share.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;D&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;After his first taste of success, Musk co-founded X.com, which provided online financial services and facilitated email payments. The board of directors thought he was too inexperienced, so they replaced him as CEO. The company then merged with Cofinity, which had its own payment system called PayPal that was more popular. Musk regained control of the company, and it was eventually sold to eBay in 2002 for $1.5 billion in stock, of which Musk received $100 million. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2470;Around the same time, Musk became involved with a non-profit called the Mars Society, and he found his mission in life: colonising Mars.&#x3C;/mark&#x3E; After trying to purchase rockets from Russia and being rebuffed on multiple occasions, Musk decided to build his own rockets and founded SpaceX. Since then, every company and business venture he has been involved with has been motivated by their potential to fund his space transportation aspirations. The first rocket SpaceX produced was the Falcon 1, which launched for the first time in 2006. Although the initial launches were failures, they brought positive attention from NASA, and the first successful launch took place in 2008.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;E&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Around the world, private companies are being established to explore and exploit the resources and benefits of space travel. But rockets and other spacecraft used to be prohibitively expensive because parts or most of the vehicles were lost in the launching process. For Musk and SpaceX, the answer was obvious&#x2014;hey needed to produce recoverable rockets that could land and be reused in part, like the Falcon 9, or in their entirety, like the upcoming Starship. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2471;SpaceX&#x27;s milestones are vital to it as a private company, and the whole world.&#x3C;/mark&#x3E; Musk has already received contracts from NASA to launch its payloads into orbit, and SpaceX is competing to return astronauts to the Moon. Space tourism, mining and colonisation are the future of humanity and Musk wants to lead the way in those industries. In 2021, Musk was chosen as Time&#x27;s &#x27;Person of the Year&#x27;, and the magazine&#x27;s editor-in-chief Edward Felsenthal stated that &#x27;&#x22;Person of the Year&#x22; is a marker of influence, and few individuals have had more influence than Musk on life on Earth, and potentially life off Earth too.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Matching Headings</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅skimming for general understanding</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅locating information in the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅identifying main ideas</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅understanding general information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the text quickly. Skimming the text before looking at the list of headings can help you get a sense of how the text is organised and where information is located. This will help you avoid looking for information in the wrong section and wasting valuable time.</span></li><li><span style="color:#000000;">Next, skim the list of headings to identify where you will need to look for information in the text and get a general understanding of their content.</span></li><li><span style="color:#000000;">Starting with the first paragraph, identify headings that you know are incorrect based on what you learned by skimming the paragraph. This will help you create a short list of possible headings. Then, read the paragraph in detail to determine the correct heading. Read the heading carefully to check that it is indeed correct. Repeat these steps until you have completed the task.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Remember that a heading should describe the main idea or overarching theme of a paragraph.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Answer choices may be incorrect because they are simply minor details from the text. Understanding the difference between main ideas and minor details is an important skill for Matching Headings tasks.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">Answer choices may also be incorrect because, although they express a main idea, that idea is incorrect according to the text or absent from the text.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '14',
      //             id: 69,
      //             groupId: 17,
      //           },
      //           {
      //             displayNumber: '15',
      //             id: 70,
      //             groupId: 17,
      //           },
      //           {
      //             displayNumber: '16',
      //             id: 71,
      //             groupId: 17,
      //           },
      //           {
      //             displayNumber: '17',
      //             id: 72,
      //             groupId: 17,
      //           },
      //           {
      //             displayNumber: '18',
      //             id: 73,
      //             groupId: 17,
      //           },
      //         ],
      //       },
      //       {
      //         id: 18,
      //         groupNumber: 2,
      //         questionType: 'labelling_a_diagram',
      //         directionText:
      //           '<p><span style="color:#000000;">Label the diagram. Write <strong>NO MORE THAN ONE WORD </strong>from the text for each answer. Write your answer in boxes 19 - 22 below.&nbsp;</span></p>',
      //         image:
      //           'https://toeflbank-rest-api-production.s3.amazonaws.com/content/ielts/reading_group/image/Release%203%20Image%20_RC%20SET%208%20P2%20%5BOnwards%20and%20Upwards%5Dsvg_0fb7fca886ef4033b625fca35a182bb7.svg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAWIENLWIIYBH46SHI%2F20220808%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220808T005611Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAOcLaEyDnPYYhlHDe2I05IQpvjOLRGfgmC990JbMtBxoAiBkbuxSLdGOAxPOE22xZDH4szD7ptPXEv6NKGtedzolPyqRBAj0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDQyOTc5MzE5NDUxMyIMqvnS%2FDGT5d94xBCJKuUD4KBXnVVRqPVoNTMY6yG3eb0FnU4u0azTzORKwMwkIO8Np5iNMJM5xLhR8aZNo0vDpJJ%2BK9d1KMwW5eu7a6McbVqYUp7j5GN1fz8jEgc2q3f8PxYhLbOai2DwJ6Xl%2FCFH7mSYfTTZOIFu6aZ0w4U9uwkWD7idISwSFnceV8XGHy6zrfESg66%2BO248HT%2BOWSRk2ooyT1UjKoY6XHeRci9jMN%2Ffy4Ht5Rt4IxS0VWWHG5UCM4yLIpPOAmcRLyopTl6PS2%2BqeJw%2BektXMEezrHeHxSEv%2FbzB3wje6DTkjLyRhMUuRGDsIfw2ekYqcbLChLHdsJ4dhAs9YJStK2zbsWx6q4Apcz73pEM59h3QV%2FDVAYuSED%2BSQ5woWPGIoeOhKMgnBpI%2BCSF8jeWNZMbNn06OptNocSL0gCnhfPQ35yB5tuSo0l7sLYdmY4j4uMc7vYmnOQoJO0%2BAxtJ5ay8pPlHcgr4CJJ1GSsgnwpTzdA8TfcKk2Yjhj3KFtwIweDE6fgkg1UI5s5J6jKAn%2BXY23qpyJaI4vg7dPVtFjcUXsU7QXi3X6jaw05aBeg6ll379CWZ64Ij%2B%2F6OF6e2tPP4lOfeW5%2BbQw7UEuUAC7MhtgrQFzX7kz2Jf9NYKVA6aCwX437JAPN52xxswsKDAlwY6pQGPXzzj3NwBH5T4bxQi3E6SGj3djWqGXbkPA%2FUkk%2FASBloxiggQ1JjZMBWUJjfeH7uuf4Y9nkohyD7tsqsvryE4A1wsjKMTkaoaLkmHY9O9P3y5h7G2xtx1GhVJX79XLj4922qetF%2FD22EnxiTR%2FwFwsROekWuwrsbdivinlHA9%2BMNw%2BDo06g3fNgELrYUXArMxOv%2BsJhcHIeWP3SEvdX6pS7EARY0%3D&X-Amz-Signature=65e3ad00fb306399fb230b9a00f672f9be4803d4758f3a2f671bdbbe9b6373e4',
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;Onwards and Upwards&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;i&#x3E;A South African-Canadian has his sights set on the stars, and his company is revolutionising the burgeoning space transportation industry.&#x3C;/i&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Elon Musk founded Space Exploration Technologies Corp., better known as SpaceX, in 2002 with two main goals: to reduce space transportation costs and enable the colonisation of Mars. The company aired a live broadcast of the launch of a specially modified reusable rocket known as Falcon 9 Flight 20 on December 21, 2015. The rocket launched and left the &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2472;atmosphere&#x3C;/mark&#x3E; without mishap, and then the second stage of the rocket &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x2473;separated&#x3C;/mark&#x3E;, deployed its payload of satellites and fell to burn up on re-entry into the atmosphere. Meanwhile, the first stage descended using its rocket &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3251;engines&#x3C;/mark&#x3E; to make a controlled &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3252;vertical&#x3C;/mark&#x3E; landing on an autonomous spaceport drone ship (ASDS) in the ocean. When the rocket successfully touched down, a SpaceX engineer announced that &#x27;the Falcon has landed,&#x27; referencing the first landing on the Moon of NASA&#x27;s Apollo program. This was the first time that a rocket was able to return to Earth and land under its own power, which could potentially revolutionise space transportation. Most rockets are left to orbit the planet, burn up in the atmosphere or descend into the ocean by parachute. Robinson Meyer, technology editor for &#x3C;i&#x3E;The Atlantic&#x3C;/i&#x3E;, summarised the scripted broadcast as &#x27;a way of treating a rocket launch not like a dry engineering procedure, but like some combination of the Macy&#x27;s Thanksgiving Day Parade and the Super Bowl.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;SpaceX is headquartered in Hawthorne, California, and it manufactures rocket engines, launch vehicles, cargo and crew spacecraft and communications satellites. Since its inception, SpaceX has achieved many firsts for a private company. It launched the first privately funded liquid-fuelled rocket to reach Earth&#x27;s orbit. It was also the first private company to send a spacecraft to the International Space Station (ISS), and it created the first orbital rocket that can take off and land vertically and be reused. SpaceX&#x27;s fleet of rockets includes the reusable Falcon 9, Falcon Heavy and Dragon, and it will soon debut the Starship super heavy-lift launch system. The Starship will have the largest capacity of any orbital rocket ever built at 100 tonnes and be completely reusable, making its operating costs very low. SpaceX has launched 143 Falcon 9 rockets with only one total loss and one partial failure. SpaceX is also attempting to build a controversial internet satellite constellation of over 4,000 satellites called Starlink to provide wireless internet access worldwide. The profits from that venture will be used to finance the establishment of a colony on Mars. While SpaceX&#x27;s rocket programs enjoy broad support, many astronomers have criticised Starlink because of the visual and electromagnetic interference that the satellites will create.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Through SpaceX and his other business ventures, Elon Musk is currently the wealthiest person globally and is worth an estimated $243 billion. He was born in Pretoria, South Africa, in 1971, and he showed an aptitude for computing and programming in his youth. When he was 17, he left South Africa for Canada to avoid military service. Musk began his university education at Queen&#x27;s University in Kingston, Ontario, but he completed his undergraduate studies at the University of Pennsylvania with a double major in economics and physics. He completed two internships in Silicon Valley at an energy storage start-up and a game company. He began a doctorate program at Stanford University in 1995, but he soon dropped out to launch his own start-up with his brother Kimbal and Greg Kouri. They created Zip2, an Internet-based company that provided online city guide software to newspapers. At first, Musk said, &#x27;The website was up during the day and I was coding it at night, seven days a week, all the time.&#x27; But they obtained contracts, and Compaq later acquired the company for $307 million, with Musk receiving $7 million for his share.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;After his first taste of success, Musk co-founded X.com, which provided online financial services and facilitated email payments. The board of directors thought he was too inexperienced, so they replaced him as CEO. The company then merged with Cofinity, which had its own payment system called PayPal that was more popular. Musk regained control of the company, and it was eventually sold to eBay in 2002 for $1.5 billion in stock, of which Musk received $100 million. Around the same time, Musk became involved with a non-profit called the Mars Society, and he found his mission in life: colonising Mars. After trying to purchase rockets from Russia and being rebuffed on multiple occasions, Musk decided to build his own rockets and founded SpaceX. Since then, every company and business venture he has been involved with has been motivated by their potential to fund his space transportation aspirations. The first rocket SpaceX produced was the Falcon 1, which launched for the first time in 2006. Although the initial launches were failures, they brought positive attention from NASA, and the first successful launch took place in 2008.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Around the world, private companies are being established to explore and exploit the resources and benefits of space travel. But rockets and other spacecraft used to be prohibitively expensive because parts or most of the vehicles were lost in the launching process. For Musk and SpaceX, the answer was obvious&#x2014;hey needed to produce recoverable rockets that could land and be reused in part, like the Falcon 9, or in their entirety, like the upcoming Starship. SpaceX&#x27;s milestones are vital to it as a private company, and the whole world. Musk has already received contracts from NASA to launch its payloads into orbit, and SpaceX is competing to return astronauts to the Moon. Space tourism, mining and colonisation are the future of humanity and Musk wants to lead the way in those industries. In 2021, Musk was chosen as Time&#x27;s &#x27;Person of the Year&#x27;, and the magazine&#x27;s editor-in-chief Edward Felsenthal stated that &#x27;&#x22;Person of the Year&#x22; is a marker of influence, and few individuals have had more influence than Musk on life on Earth, and potentially life off Earth too.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Labelling a Diagram</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅detailed reading to understand a process or feature</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅selecting words from the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the text in the diagram to get a general understanding of the content.&nbsp;</span></li><li><span style="color:#000000;">Check how many words and/or numbers you may use. Do NOT exceed this limit.</span></li><li><span style="color:#000000;">Pay attention to grammar. The question may require a verb, a noun, or an adjective.</span></li><li><span style="color:#000000;">Scan the text for key words from the diagram to locate the relevant section(s). Then, carefully read the section of the text that describes the process or feature from the diagram to select the appropriate word(s). Read the question in detail to check that you have indeed selected the correct word(s).</span></li><li><span style="color:#000000;">Labelling a Diagram tasks may include an image of a natural process, a technical illustration of a piece of machinery, or an architectural design or plan. If the diagram shows a process, pay particular attention to sequencing terms (<i>\'first\', \'next\'</i>) in the text to identify the order in which steps occur. If the diagram shows machinery, read carefully to understand the function of each of the machine\'s parts.</span></li><li><span style="color:#000000;">Remember to copy the word(s) from the text exactly as they appear. You do not need to change them in any way, and you will not receive points for misspelt words.</span></li><li><span style="color:#000000;">Pay attention to whether a word is singular or plural.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Labelling a Diagram tasks may include technical terminology, but you do not necessarily need to know the meaning of this terminology. These kinds of words can be helpful when locating the answers in the text.&nbsp;</span></td></tr><tr><td><span style="color:#000000;">You may write using uppercase or lowercase letters, but make sure that your answer is clear.</span></td></tr><tr><td><span style="color:#000000;">Hyphenated words (<i>\'self-esteem\'</i>) count as one word.</span></td></tr><tr><td><span style="color:#000000;">You may write numbers using numbers (<i>\'23\'</i>) or words (<i>\'twenty-three\'</i>).</span></td></tr><tr><td><span style="color:#000000;">Labelling a Diagram questions do not always appear in the same order as the information in the text.</span></td></tr><tr><td><span style="color:#000000;">Labelling a Diagram tasks sometimes provide a list of words from which you can select your answers. However, you must still read the appropriate section(s) of the text to identify the correct answer.&nbsp;</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '19',
      //             id: 74,
      //             groupId: 18,
      //           },
      //           {
      //             displayNumber: '20',
      //             id: 75,
      //             groupId: 18,
      //           },
      //           {
      //             displayNumber: '21',
      //             id: 76,
      //             groupId: 18,
      //           },
      //           {
      //             displayNumber: '22',
      //             id: 77,
      //             groupId: 18,
      //           },
      //         ],
      //       },
      //       {
      //         id: 19,
      //         groupNumber: 3,
      //         questionType: 'sentence_completion',
      //         directionText:
      //           '<p><span style="color:#000000;">Complete the sentences. Write <strong>NO MORE THAN TWO WORDS</strong> from the text in each box.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;Onwards and Upwards&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;i&#x3E;A South African-Canadian has his sights set on the stars, and his company is revolutionising the burgeoning space transportation industry.&#x3C;/i&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Elon Musk founded Space Exploration Technologies Corp., better known as SpaceX, in 2002 with two main goals: to reduce space transportation costs and enable the colonisation of Mars. The company aired a live broadcast of the launch of a specially modified reusable rocket known as Falcon 9 Flight 20 on December 21, 2015. The rocket launched and left the atmosphere without mishap, and then the second stage of the rocket separated, deployed its payload of satellites and fell to burn up on re-entry into the atmosphere. Meanwhile, the first stage descended using its rocket engines to make a controlled vertical landing on an autonomous spaceport drone ship (ASDS) in the ocean. When the rocket successfully touched down, a SpaceX engineer announced that &#x27;the Falcon has landed,&#x27; referencing the first landing on the Moon of NASA&#x27;s Apollo program. This was the first time that a rocket was able to return to Earth and land under its own power, which could potentially revolutionise space transportation. Most rockets are left to orbit the planet, burn up in the atmosphere or descend into the ocean by parachute. Robinson Meyer, technology editor for &#x3C;i&#x3E;The Atlantic&#x3C;/i&#x3E;, summarised the &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3253;scripted broadcast&#x3C;/mark&#x3E; as &#x27;a way of treating a rocket launch not like a dry engineering procedure, but like some combination of the Macy&#x27;s Thanksgiving Day Parade and the Super Bowl.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;SpaceX is headquartered in Hawthorne, California, and it manufactures rocket engines, launch vehicles, cargo and crew spacecraft and communications satellites. Since its inception, SpaceX has achieved many firsts for a private company. It launched the first privately funded liquid-fuelled rocket to reach Earth&#x27;s orbit. It was also the first private company to send a spacecraft to the International Space Station (ISS), and it created the first orbital rocket that can take off and land vertically and be reused. SpaceX&#x27;s fleet of rockets includes the reusable Falcon 9, Falcon Heavy and Dragon, and it will soon debut the Starship super heavy-lift launch system. The Starship will have the largest capacity of any orbital rocket ever built at 100 tonnes and be completely reusable, making its operating costs very low. SpaceX has launched 143 Falcon 9 rockets with only one total loss and one partial failure. SpaceX is also attempting to build a controversial internet satellite constellation of over 4,000 satellites called Starlink to provide wireless internet access worldwide. The profits from that venture will be used to finance the establishment of a colony on Mars. While SpaceX&#x27;s rocket programs enjoy broad support, many astronomers have criticised Starlink because of the visual and electromagnetic interference that the satellites will create.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Through SpaceX and his other business ventures, Elon Musk is currently the wealthiest person globally and is worth an estimated $243 billion. He was born in Pretoria, South Africa, in 1971, and he showed an aptitude for computing and programming in his youth. When he was 17, he left South Africa for Canada to avoid military service. Musk began his university education at Queen&#x27;s University in Kingston, Ontario, but he completed his undergraduate studies at the University of Pennsylvania with a double major in economics and physics. He completed two internships in Silicon Valley at an energy storage start-up and a game company. He began a doctorate program at Stanford University in 1995, but he soon dropped out to launch his own start-up with his brother Kimbal and Greg Kouri. They created Zip2, an Internet-based company that provided online &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3254;city guide&#x3C;/mark&#x3E; software to newspapers. At first, Musk said, &#x27;The website was up during the day and I was coding it at night, seven days a week, all the time.&#x27; But they obtained contracts, and Compaq later acquired the company for $307 million, with Musk receiving $7 million for his share.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;After his first taste of success, Musk co-founded X.com, which provided online financial services and facilitated email payments. The board of directors thought he was too inexperienced, so they replaced him as CEO. The company then merged with Cofinity, which had its own payment system called PayPal that was more popular. Musk regained control of the company, and it was eventually sold to eBay in 2002 for $1.5 billion in stock, of which Musk received $100 million. Around the same time, Musk became involved with a non-profit called the Mars Society, and he found his mission in life: colonising Mars. After trying to &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3255;purchase rockets&#x3C;/mark&#x3E; from Russia and being rebuffed on multiple occasions, Musk decided to build his own rockets and founded SpaceX. Since then, every company and business venture he has been involved with has been motivated by their potential to fund his space transportation aspirations. The first rocket SpaceX produced was the Falcon 1, which launched for the first time in 2006. Although the initial launches were failures, they brought positive attention from NASA, and the first successful launch took place in 2008.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Around the world, private companies are being established to explore and exploit the resources and benefits of space travel. But rockets and other spacecraft used to be prohibitively expensive because parts or most of the vehicles were lost in the launching process. For Musk and SpaceX, the answer was obvious&#x2014;hey needed to produce recoverable rockets that could land and be reused in part, like the Falcon 9, or in their entirety, like the upcoming Starship. SpaceX&#x27;s milestones are vital to it as a private company, and the whole world. Musk has already received contracts from NASA to launch its payloads into orbit, and SpaceX is competing to return astronauts to the &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3256;Moon&#x3C;/mark&#x3E;. Space tourism, mining and colonisation are the future of humanity and Musk wants to lead the way in those industries. In 2021, Musk was chosen as Time&#x27;s &#x27;Person of the Year&#x27;, and the magazine&#x27;s editor-in-chief Edward Felsenthal stated that &#x27;&#x22;Person of the Year&#x22; is a marker of influence, and few individuals have had more influence than Musk on life on Earth, and potentially life off Earth too.&#x27;&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Task Type: Sentence Completion</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅detailed reading</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅selecting words from the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the incomplete sentence to get a general understanding of its content.&nbsp;</span></li><li><span style="color:#000000;">Check how many words and/or numbers you may use. Do NOT exceed this limit.</span></li><li><span style="color:#000000;">Pay attention to grammar. The question may require a verb, a noun, or an adjective.</span></li><li><span style="color:#000000;">Sentence Completion questions contain key terms from the text, synonyms of these terms, or important details. Scan the text for these words to locate the relevant section(s). Then, read in detail to identify the answer.&nbsp;</span></li><li><span style="color:#000000;">Remember to copy the word or words from the text exactly as they appear. You do not need to change them in any way, and you will not receive points for misspelt words.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Sentence Completion questions use paraphrasing or synonyms of words in the text, so it is important to recognize these in order to locate the answer in the text.</span></td></tr><tr><td><span style="color:#000000;">You may write using uppercase or lowercase letters, but make sure that your answer is clear.</span></td></tr><tr><td><span style="color:#000000;">Hyphenated words (<i>\'self-esteem\'</i>) count as one word.</span></td></tr><tr><td><span style="color:#000000;">You may write numbers using numbers (<i>\'23\'</i>) or words (<i>\'twenty-three\'</i>).</span></td></tr><tr><td><span style="color:#000000;">Sentence Completion questions appear in the same order as the information in the text.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '23',
      //             id: 78,
      //             groupId: 19,
      //           },
      //           {
      //             displayNumber: '24',
      //             id: 79,
      //             groupId: 19,
      //           },
      //           {
      //             displayNumber: '25',
      //             id: 80,
      //             groupId: 19,
      //           },
      //           {
      //             displayNumber: '26',
      //             id: 81,
      //             groupId: 19,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     id: 9,
      //     passageTitle: 'When tears fall',
      //     passageNumber: 3,
      //     originalPassage: '&#x3C;p&#x3E;When tears fall&#x3C;/p&#x3E;',
      //     groups: [
      //       {
      //         id: 20,
      //         groupNumber: 1,
      //         questionType: 'identifying_views_claims',
      //         directionText:
      //           '<p><span style="color:#000000;">Choose <strong>YES</strong> if the statement agrees with the claims of the writer, choose <strong>NO</strong> if the statement contradicts the claims of the writer, or choose <strong>NOT GIVEN</strong> if it is impossible to say what the writer thinks about this.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox: null,
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;When tears fall&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;We all experience intense emotional episodes ranging from the traumatic to the joyful, and such events often cause us to cry and shed tears. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3257;But why do we cry when we experience intense emotions while no other species, not even our closest genetic cousins, display this kind of physical response?&#x3C;/mark&#x3E; To answer this question, we will first look at the origins of this behaviour, and then we will explain how crying affects the behaviour of others.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Human crying evolved from vocalisations that mammalian offspring make when separated from their mothers or in distress from danger or hunger. However, this behaviour is limited to young animals, it is only vocal and it mostly ceases as they mature. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x3258;All land mammals can generate different kinds of tears with different chemical compositions from glands in their eyes through a process called lacrimation. &#x3259;Basal tears are constantly produced to lubricate the eyes, and reflex tears are released to remove irritants from the eye.&#x3C;/mark&#x3E; Tears are also a response to physical pain, and they contain antibiotic compounds that increase during illness to aid the immune system. However, research indicates that only humans produce tears as an emotional response, which are called psychic tears. While the utterance and importance of vocalisations in human crying decreases with age, the significance of tears increases.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;One of the purposes of tears is to communicate an individual&#x27;s internal state to other members of its social group. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325A;Scientists have observed that many social mammals, including primates, whales, elephants and meerkats, can recognize need and respond by providing protection or food to younger or weaker individuals.&#x3C;/mark&#x3E; Humans are considered &#x27;hypersocial&#x27; and often aid injured or ill people to whom they are unrelated.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;While the experience of pain is very subjective and varies from person to person, it often involves crying, and humans often exhibit a more robust response to pain than other animals, particularly when they are ill or giving birth. Most animals suffer through these experiences in near silence because they are more vulnerable to predators in such states. They also endure such pain for shorter periods and recover more quickly than humans. A mother&#x27;s labour pains can last many hours, and illnesses can keep people bed-ridden long after their bodies have defeated the infection.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The more extreme and prolonged experience of pain and emotional tears that humans experience must provide a biological advantage for them to have evolved, which appears to be convincing others to help us in our times of need. The need for help and the compulsion to offer it that humans feel is unique in its intensity, but how does one recognise cries for help? Unless there is visible physical damage to a person&#x27;s body, an individual must communicate its suffering in other ways. That is particularly true in the case of emotional distress, which may have few if any physical symptoms. Our distant ancestors could not produce the complex language that modern humans utilise to express our feelings, so they developed several adaptations to facilitate that communication. Our facial muscles are unusually mobile and can contort our faces into starkly different expressions. Studies have shown a direct neural connection between the eyes&#x27; tear glands and the areas of the brain involved in emotion.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Another aspect of humans that facilitates crying is our large brains. Humans have the mental capacity to anticipate trauma, increasing their psychological and physical suffering and causing them to cry before being hurt. This can easily be observed in children before they are given an injection. They may scream and cry and try to run away because they believe the needle will hurt. Once they receive the shot, they often stop crying because their minds have amplified the pain in anticipation, which turned out to be minor. People&#x27;s brains also allow them to recognise the behaviour and feelings of others and sympathise with them to the degree that they also may begin to cry. Research has shown that tears act as an emotional intensifier. In one study, participants were shown photographs of faces that they described as sad. When they were shown the same faces again with tears added, they thought that the people in them looked even sadder.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Because humans are hardwired to help others in need, behaviours like crying evolved to elicit that response. People can exaggerate their emotional or physical state in words, but tears act as a form of honest signal. They convey a person&#x27;s true condition by putting them in a vulnerable position. Tears blur one&#x27;s vision and are often accompanied by ragged or erratic breathing and muscle tremors. &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325B;Some people can force themselves to cry to gain an advantage, but for most it is involuntary, and even false tears can cause a sympathetic response.&#x3C;/mark&#x3E; &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325C;People cry in sympathy when they watch actors on stage and screen, even though they know that the people are not actually suffering. The tears on the actors&#x27; faces may be false, but they still elicit the same response from the audience as genuine ones.&#x3C;/mark&#x3E; However, not all tears fall out of pain or sorrow, as other intense emotions like anger, relief and even happiness can cause people to cry.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Identifying Claims/Views</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅scanning for key terms&nbsp;</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅detailed reading</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅understanding the writer\'s opinion</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅recognizing paraphrasing and synonyms&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">Scan the text for key terms or details from the statement to locate the relevant section(s). Then, read in detail to determine if the statement is true, false, or not given.&nbsp;</span></li><li><span style="color:#000000;">Key terms or details from the statements may be located in two or more sections of the text. If this is the case, skim each section to find the relevant part of the text.&nbsp;</span></li><li><span style="color:#000000;">Do NOT stop at key terms in the text. Continue reading to determine whether the view or claim is supported (\'yes\') or not supported (\'no\') by the text, or whether this cannot be determined (\'not given\').&nbsp;</span></li><li><span style="color:#000000;">Pay close attention to the writer\'s tone in the text. A statement that is not supported (\'no\') by the writer can be corrected based on the information in the text.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">The difference between Identifying Information and Identifying Views/Claims tasks is that the former appear with descriptive texts and the latter appear with discursive or argumentative texts.</span></td></tr><tr><td><span style="color:#000000;">\'Not given\' means that whether the view or claim agrees (\'yes\') or disagrees (\'no\') with the information in the text cannot be determined. This does NOT mean that certain details from the view or claim cannot be found in the text. A view or claim that is not given cannot be proved based on the text.</span></td></tr><tr><td><span style="color:#000000;">Scanning for key details helps to locate where the solution can be found in the text, but simply finding the details does NOT mean that a claim or view is supported (\'yes\').</span></td></tr><tr><td><span style="color:#000000;">Texts use referencing words like \'the\' or \'this\' to signal that an idea is still being described because these words mean that the idea has already been introduced in a previous sentence or clause. Recognizing these words can help you follow an idea to its conclusion and identify when the writer has begun to describe a new idea.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '27',
      //             id: 82,
      //             groupId: 20,
      //           },
      //           {
      //             displayNumber: '28',
      //             id: 83,
      //             groupId: 20,
      //           },
      //           {
      //             displayNumber: '29',
      //             id: 84,
      //             groupId: 20,
      //           },
      //           {
      //             displayNumber: '30',
      //             id: 85,
      //             groupId: 20,
      //           },
      //           {
      //             displayNumber: '31',
      //             id: 86,
      //             groupId: 20,
      //           },
      //           {
      //             displayNumber: '32',
      //             id: 87,
      //             groupId: 20,
      //           },
      //         ],
      //       },
      //       {
      //         id: 21,
      //         groupNumber: 2,
      //         questionType: 'summary_completion',
      //         directionText:
      //           '<p><span style="color:#000000;">Complete the summary below. Write <strong>NO MORE THAN TWO WORDS</strong> from the text in each box.</span></p>',
      //         image: null,
      //         answerList: null,
      //         questionBox:
      //           '<p style="text-align:center;"><span style="color:#000000;"><strong>Human Crying</strong></span></p><p style="text-align:center;">&nbsp;</p><p><span style="color:#000000;">Although many <strong>33</strong> {{blank 33}} species\' young cry when they are distressed, this behaviour disappears as they grow up. All land mammals generate tears to <strong>34</strong> {{blank 34}} their eyes, remove irritating objects or chemicals and in response to pain. Humans, however, continue to cry into adulthood, and only they shed <strong>35</strong> {{blank 35}} tears as an emotional response.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;">Although animals produce tears when in pain from illness, injury or <strong>36</strong> {{blank 36}}, they suffer in <strong>37</strong> {{blank 37}}. Humans appear to experience more intense pain for longer periods. Such pain and emotional tears would not be universal human characteristics if they did not provide some kind of <strong>38 </strong>{{blank 38}}.</span></p><p>&nbsp;</p><p><span style="color:#000000;">Human tears function as a type of <strong>39 </strong>{{blank 39}} that communicates their actual emotional or physical state to others. Tears put a person in a <strong>40</strong> {{blank 40}} position because they blur vision and are accompanied by other physical symptoms like erratic breathing and muscle tremors. Although some people can generate false tears, they are generally involuntary, and they elicit sympathy and convince others to provide aid.</span></p>',
      //         passageText:
      //           '&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;&#x3C;strong&#x3E;When tears fall&#x3C;/strong&#x3E;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p style=&#x22;text-align:center;&#x22;&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;We all experience intense emotional episodes ranging from the traumatic to the joyful, and such events often cause us to cry and shed tears. But why do we cry when we experience intense emotions while no other species, not even our closest genetic cousins, display this kind of physical response? To answer this question, we will first look at the origins of this behaviour, and then we will explain how crying affects the behaviour of others.&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Human crying evolved from vocalisations that &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325D;mammalian&#x3C;/mark&#x3E; offspring make when separated from their mothers or in distress from danger or hunger. However, this behaviour is limited to young animals, it is only vocal and it mostly ceases as they mature. All land mammals can generate different kinds of tears with different chemical compositions from glands in their eyes through a process called lacrimation. Basal tears are constantly produced to &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325E;lubricate&#x3C;/mark&#x3E; the eyes, and reflex tears are released to remove irritants from the eye. Tears are also a response to physical pain, and they contain antibiotic compounds that increase during illness to aid the immune system. However, research indicates that only humans produce tears as an emotional response, which are called &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x325F;psychic&#x3C;/mark&#x3E; tears. While the utterance and importance of vocalisations in human crying decreases with age, the significance of tears increases.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;One of the purposes of tears is to communicate an individual&#x27;s internal state to other members of its social group. Scientists have observed that many social mammals, including primates, whales, elephants and meerkats, can recognize need and respond by providing protection or food to younger or weaker individuals. Humans are considered &#x27;hypersocial&#x27; and often aid injured or ill people to whom they are unrelated.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;While the experience of pain is very subjective and varies from person to person, it often involves crying, and humans often exhibit a more robust response to pain than other animals, particularly when they are ill or &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B1;giving birth&#x3C;/mark&#x3E;. Most animals suffer through these experiences in &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B2;near silence&#x3C;/mark&#x3E; because they are more vulnerable to predators in such states. They also endure such pain for shorter periods and recover more quickly than humans. A mother&#x27;s labour pains can last many hours, and illnesses can keep people bed-ridden long after their bodies have defeated the infection.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;The more extreme and prolonged experience of pain and emotional tears that humans experience must provide a &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B3;biological advantage&#x3C;/mark&#x3E; for them to have evolved, which appears to be convincing others to help us in our times of need. The need for help and the compulsion to offer it that humans feel is unique in its intensity, but how does one recognise cries for help? Unless there is visible physical damage to a person&#x27;s body, an individual must communicate its suffering in other ways. That is particularly true in the case of emotional distress, which may have few if any physical symptoms. Our distant ancestors could not produce the complex language that modern humans utilise to express our feelings, so they developed several adaptations to facilitate that communication. Our facial muscles are unusually mobile and can contort our faces into starkly different expressions. Studies have shown a direct neural connection between the eyes&#x27; tear glands and the areas of the brain involved in emotion.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Another aspect of humans that facilitates crying is our large brains. Humans have the mental capacity to anticipate trauma, increasing their psychological and physical suffering and causing them to cry before being hurt. This can easily be observed in children before they are given an injection. They may scream and cry and try to run away because they believe the needle will hurt. Once they receive the shot, they often stop crying because their minds have amplified the pain in anticipation, which turned out to be minor. People&#x27;s brains also allow them to recognise the behaviour and feelings of others and sympathise with them to the degree that they also may begin to cry. Research has shown that tears act as an emotional intensifier. In one study, participants were shown photographs of faces that they described as sad. When they were shown the same faces again with tears added, they thought that the people in them looked even sadder.&#x26;nbsp;&#x3C;/span&#x3E;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x26;nbsp;&#x3C;/p&#x3E;&#x3C;p&#x3E;&#x3C;span style=&#x22;color:#000000;&#x22;&#x3E;Because humans are hardwired to help others in need, behaviours like crying evolved to elicit that response. People can exaggerate their emotional or physical state in words, but tears act as a form of &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B4;honest signal&#x3C;/mark&#x3E;. They convey a person&#x27;s true condition by putting them in a &#x3C;mark class=&#x22;highlight-green&#x22;&#x3E;&#x32B5;vulnerable&#x3C;/mark&#x3E; position. Tears blur one&#x27;s vision and are often accompanied by ragged or erratic breathing and muscle tremors. Some people can force themselves to cry to gain an advantage, but for most it is involuntary, and even false tears can cause a sympathetic response. People cry in sympathy when they watch actors on stage and screen, even though they know that the people are not actually suffering. The tears on the actors&#x27; faces may be false, but they still elicit the same response from the audience as genuine ones. However, not all tears fall out of pain or sorrow, as other intense emotions like anger, relief and even happiness can cause people to cry.&#x3C;/span&#x3E;&#x3C;/p&#x3E;',
      //         explanation: {
      //           questionTypeTips:
      //             '<p><span style="color:#000000;"><strong>Question Type: Summary Completion</strong></span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Useful Skills:</strong></span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅scanning for key terms</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅detailed reading to understand specific information</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅selecting words from the text</span></p><p style="margin-left:36pt;"><span style="color:#000000;">✅recognizing paraphrasing and synonyms</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>Tips:</strong></span></p><ul><li><span style="color:#000000;">First, skim the summary to get a general understanding of its content.&nbsp;</span></li><li><span style="color:#000000;">Pay attention to grammar. The question may require a verb, a noun, or an adjective.</span></li><li><span style="color:#000000;">Check how many words and/or numbers you may use. Do NOT exceed this limit.</span></li><li><span style="color:#000000;">Summary Completion questions include key terms or details that you may use to help you locate the answers. Scan the text for these details to find the relevant section(s). Then, read in detail to identify the answer.&nbsp;</span></li><li><span style="color:#000000;">Remember to copy the word(s) from the text exactly as they appear. You do NOT need to change them in any way, and you will not receive points for misspelt words.</span></li><li><span style="color:#000000;">Pay attention to whether a word is singular or plural.</span></li></ul><p>&nbsp;</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;"><strong>Important Information</strong></span></p></td></tr><tr><td><span style="color:#000000;">Summary Completion questions use paraphrasing or synonyms of words in the text, so it is important to recognize these in order to locate the answers in the text.</span></td></tr><tr><td><span style="color:#000000;">You may write using uppercase or lowercase letters, but make sure that your answer is clear.</span></td></tr><tr><td><span style="color:#000000;">Hyphenated words (<i>\'self-esteem\'</i>) count as one word.</span></td></tr><tr><td><span style="color:#000000;">You may write numbers using numbers (<i>\'23\'</i>) or words (<i>\'twenty-three\'</i>).</span></td></tr><tr><td><span style="color:#000000;">Summary Completion tasks sometimes provide a list of words from which you can select your answers. If this is the case, the words may not necessarily be included in the text. However, you must still check that your answer is correct by reading the appropriate section of the text.</span></td></tr></tbody></table></figure>',
      //         },
      //         questions: [
      //           {
      //             displayNumber: '33',
      //             id: 88,
      //             groupId: 21,
      //           },
      //           {
      //             displayNumber: '34',
      //             id: 89,
      //             groupId: 21,
      //           },
      //           {
      //             displayNumber: '35',
      //             id: 90,
      //             groupId: 21,
      //           },
      //           {
      //             displayNumber: '36',
      //             id: 91,
      //             groupId: 21,
      //           },
      //           {
      //             displayNumber: '37',
      //             id: 92,
      //             groupId: 21,
      //           },
      //           {
      //             displayNumber: '38',
      //             id: 93,
      //             groupId: 21,
      //           },
      //           {
      //             displayNumber: '39',
      //             id: 94,
      //             groupId: 21,
      //           },
      //           {
      //             displayNumber: '40',
      //             id: 95,
      //             groupId: 21,
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ];
      // const readingResponses = [
      //   {
      //     id: 382816,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 2,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '2',
      //       questionText:
      //         '<p><span style="color:#000000;">In 1895, the Lumiere brothers premiered their first film to a public audience at a cafe in Paris.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 1,
      //       id: 2,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>2</strong> <strong>True</strong></span></p><ul><li><span style=\"color:#000000;\">'The endeavours of the Lumiere brothers culminated in their first successful <u>film screening</u> in December of <u>1895</u>. The <u>audience at the Grand Cafe</u> enjoyed what would be considered meagre entertainment today.'</span></li><li><span style=\"color:#000000;\">This statement is true because, according to the text, the Lumiere brothers premiered their first film to a public audience at the Grand Cafe in Paris in 1895. Note that this statement paraphrases the text by using the phrase 'premiered their first film' instead of the phrase 'first successful film screening.' The verb 'premier' means to screen or show a film to an audience.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382821,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 7,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '7',
      //       questionText: null,
      //       answer: 'viewing',
      //       groupId: 2,
      //       id: 7,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>7</strong> <strong>viewing</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'... films had been viewed since 1888 when Thomas Edison and William Dickson invented the first camera with <u>viewing</u> capabilities, the Kinetoscope.'</span></li><li><span style=\"color:#000000;\">The word 'viewing' is the correct word from the text because this section of the notes requires an adjective. The word 'viewing' functions here as an adjective describing the noun 'capabilities,' which immediately follows the blank.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382822,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 8,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '8',
      //       questionText: null,
      //       answer: 'screen',
      //       groupId: 2,
      //       id: 8,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>8</strong> <strong>screen</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'When word spread about Edison and Dickson's Kinetoscope, the Lumiere brothers started to work on a device that could project film onto a <u>screen</u>.'</span></li><li><span style=\"color:#000000;\">The word 'screen' is the correct word from the text because this section of the notes requires a singular noun. The blank follows the article '<u>a</u>,' which comes before singular, countable nouns. Note that this section of the notes paraphrases the text by using the phrase 'enable projection,' which has a similar meaning to the phrase 'could project' in the text.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382823,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 9,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '9',
      //       questionText: null,
      //       answer: 'quieter',
      //       groupId: 2,
      //       id: 9,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>9</strong> <strong>quieter</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'Their solution to this problem was the Cinematographe, a new motion-picture camera and projector that weighed just nine kilograms and could be transported with ease … The Cinematographe also needed to be quieter than the noisy Kinetoscope. They developed a new process which … These specifications created a <u>quieter</u> machine …'</span></li><li><span style=\"color:#000000;\">The word 'quieter' is the correct word from the text because this section of the notes requires a comparative (-er) adjective. This is because the blank follows the words '<u>lighter and</u>' and is followed by the word '<u>than</u>.' These words indicate that an additional adjective in <i>-er</i> form should follow the words 'lighter and.' Note that this section of the notes paraphrases the text by using the word 'lighter,' which has a similar meaning to the phrase 'weighed just nine kilograms' in the text.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382824,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 10,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '10',
      //       questionText: null,
      //       answer: 'editing',
      //       groupId: 2,
      //       id: 10,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>10</strong> <strong>editing</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'... more sophisticated <u>editing</u> techniques were put to use when film production companies were established.'</span></li><li><span style=\"color:#000000;\">The word 'editing' is the correct word from the text because this section of the notes requires an adjective to describe the plural noun 'techniques,' which follows the blank. The word 'editing' functions here as an adjective. Note that this section of the notes paraphrases the text by using the word 'new,' which has a similar meaning to the phrase 'more sophisticated' in the text.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382825,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 11,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '11',
      //       questionText: null,
      //       answer: 'chase',
      //       groupId: 2,
      //       id: 11,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>11</strong> <strong>chase</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'Photographers George Albert Smith and James Williamson began to make use of superimposed images in 1897 and close-ups and parallel editing in 1900. Williamson broke new ground with the first <u>chase</u> films …'</span></li><li><span style=\"color:#000000;\">The word 'chase' is the correct word from the text because this section of the notes requires an adjective to describe the plural noun 'films,' which follows the blank. The word 'chase' functions here as an adjective and completes the phrase 'chase films,' which are films that include scenes where characters chase, or pursue, other characters.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382826,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 12,
      //     question: {
      //       options: [],
      //       questionNumber: 6,
      //       displayNumber: '12',
      //       questionText: null,
      //       answer: 'linear',
      //       groupId: 2,
      //       id: 12,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>12</strong> <strong>linear</strong></span></p><ul><li><span style=\"color:#000000;\">'Melies' Star Film company initially produced one-shot films, but the film-maker began to experiment with multiscene productions with <u>linear</u> storytelling. In 1902, he released the ambitious film <i>A Trip to the Moon</i> …'</span></li><li><span style=\"color:#000000;\">The word 'linear' is the correct word from the text because this section of the notes requires an adjective to describe the noun 'storytelling,' which follows the blank. This word completes the phrase 'linear storytelling,' which refers to a type of story that unfolds as a series of events in chronological order. Note that this section of the notes paraphrases the text by using the word 'films,' which has a similar meaning to the word 'productions' in the text. Also, this section of the notes uses the phrase 'started working on making' instead of the phrase 'began to experiment with,' as well as the phrase 'multiple scenes' instead of the word 'multiscene.'</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382827,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 13,
      //     question: {
      //       options: [],
      //       questionNumber: 7,
      //       displayNumber: '13',
      //       questionText: null,
      //       answer: 'world',
      //       groupId: 2,
      //       id: 13,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>13</strong> <strong>world</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'In a time when overseas travel was difficult, films also brought the wider <u>world</u> to audiences.'</span></li><li><span style=\"color:#000000;\">The word 'world' is the correct word from the text because this section of the notes requires a noun. This is because the blank follows the verb '<u>brought</u>,' which must come before a direct object in the form of a noun. The word 'world' functions as a direct object. Also, the blank follows the word '<u>the</u>,' which should be followed by a noun.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382828,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 14,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '14',
      //       questionText:
      //         '<p><span style="color:#000000;">Section A</span></p>',
      //       answer: 'v',
      //       groupId: 3,
      //       id: 14,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>14 Section A - v</strong></span></p><ul><li><span style="color:#000000;">\'... it can be <u>frustrating</u> for those who use glucose meters <u>to manually transfer health data</u> into mobile phone apps which monitor glucose levels and tell users how much insulin they need.\'</span></li><li><span style="color:#000000;">Heading \'v\' is correct because one of the main ideas in Section A is the frustration of manually transferring health data, which is a problem with the meters that people with diabetes currently use.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is not an appropriate heading for any of the sections in the text. Although the text explains that diabetics can develop poor eyesight, it does not state that poor eyesight can increase the risk of developing diabetes.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vi - Heading \'vi\' is not an appropriate heading for any of the sections in the text. Although the text explains that glucose monitors are used by diabetics, who can become visually impaired, it does not mention providing new monitors to these diabetics. In fact, the text mainly concerns an app which works in parallel with diabetes meters. No new glucose meters are mentioned in the text.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌ </strong>viii - Heading \'viii\' is not an appropriate heading for any of the sections in the text. The text mainly concerns the ways in which computers can analyse images, not analyses of images that they themselves produce.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382829,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 15,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '15',
      //       questionText:
      //         '<p><span style="color:#000000;">Section B</span></p>',
      //       answer: 'ix',
      //       groupId: 3,
      //       id: 15,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>15 Section B - ix</strong></span></p><ul><li><span style="color:#000000;">\'... <u>humans</u> spend years learning how to distinguish between faces, trees, numbers and letters … But how do <u>computers</u> learn to tell various objects and symbols apart and categorise them correctly? The answer lies not in optic nerves and retinas, but in <u>algorithms</u>, <u>cameras</u> and <u>data</u>.\'</span></li><li><span style="color:#000000;">Heading \'ix\' is correct because one of the main ideas in Section B is the way in which human and computer vision differ. The writer explains in this section that while humans spend years learning how to interpret visual information, computers learn to do this by using algorithms, cameras, and data.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is not an appropriate heading for any of the sections in the text. Although the text explains that diabetics can develop poor eyesight, it does not state that poor eyesight can increase the risk of developing diabetes.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vi - Heading \'vi\' is not an appropriate heading for any of the sections in the text. Although the text explains that glucose monitors are used by diabetics, who can become visually impaired, it does not mention providing new monitors to these diabetics. In fact, the text mainly concerns an app which works in parallel with diabetes meters. No new glucose meters are mentioned in the text.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌ </strong>viii - Heading \'viii\' is not an appropriate heading for any of the sections in the text. The text mainly concerns the ways in which computers can analyse images, not analyses of images that they themselves produce.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382830,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 16,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '16',
      //       questionText:
      //         '<p><span style="color:#000000;">Section C</span></p>',
      //       answer: 'iii',
      //       groupId: 3,
      //       id: 16,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>16</strong> <strong>Section C - iii</strong></span></p><ul><li><span style=\"color:#000000;\">'Like humans, the computer needs to 'learn' how to <u>differentiate visual information</u>, and it does this by looking at vast numbers of images … Dr James Charles <u>trained his program</u> by showing it one image of a glucose meter and then introducing random backgrounds so that the program could become familiar with extraneous imagery and easily separate glucose readings from the rest of an image.'</span></li><li><span style=\"color:#000000;\">Heading 'iii' is correct because one of the main ideas in Section C is how the GlucoseRX program is taught to read and understand images. Note that this heading paraphrases the text by using the phrase 'read and understand images' instead of the phrase 'differentiate visual information,' which has a similar meaning. The text also uses the verb 'teach,' which is a synonym of the verb 'train' from the text.&nbsp;&nbsp;</span></li></ul><p>&nbsp;</p><p><span style=\"color:#000000;\"><strong>Incorrect Headings:</strong></span></p><p><span style=\"color:#000000;\"><strong>❌</strong> i - Heading 'i' is not an appropriate heading for any of the sections in the text. Although the text explains that diabetics can develop poor eyesight, it does not state that poor eyesight can increase the risk of developing diabetes.&nbsp;</span></p><p><span style=\"color:#000000;\"><strong>❌</strong> vi - Heading 'vi' is not an appropriate heading for any of the sections in the text. Although the text explains that glucose monitors are used by diabetics, who can become visually impaired, it does not mention providing new monitors to these diabetics. In fact, the text mainly concerns an app which works in parallel with diabetes meters. No new glucose meters are mentioned in the text.&nbsp;</span></p><p><span style=\"color:#000000;\"><strong>❌ </strong>viii - Heading 'viii' is not an appropriate heading for any of the sections in the text. The text mainly concerns the ways in which computers can analyse images, not analyses of images that they themselves produce.</span></p>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382831,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 17,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '17',
      //       questionText:
      //         '<p><span style="color:#000000;">Section D</span></p>',
      //       answer: 'iv',
      //       groupId: 3,
      //       id: 17,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>17</strong> <strong>Section D -</strong> <strong>iv</strong></span></p><ul><li><span style="color:#000000;">\'The <u>result</u> of Charles and his fellow researchers\' work is an app that can read glucose meters as well, if not better than, the human eye.\'</span></li><li><span style="color:#000000;">Heading \'iv\' is correct because one of the main ideas in Section D is the result of research, led by Charles and the researchers, into the using computer vision for diabetes monitoring.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is not an appropriate heading for any of the sections in the text. Although the text explains that diabetics can develop poor eyesight, it does not state that poor eyesight can increase the risk of developing diabetes.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vi - Heading \'vi\' is not an appropriate heading for any of the sections in the text. Although the text explains that glucose monitors are used by diabetics, who can become visually impaired, it does not mention providing new monitors to these diabetics. In fact, the text mainly concerns an app which works in parallel with diabetes meters. No new glucose meters are mentioned in the text.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌ </strong>viii - Heading \'viii\' is not an appropriate heading for any of the sections in the text. The text mainly concerns the ways in which computers can analyse images, not analyses of images that they themselves produce.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382832,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 18,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '18',
      //       questionText:
      //         '<p><span style="color:#000000;">Section E</span></p>',
      //       answer: 'vii',
      //       groupId: 3,
      //       id: 18,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>18</strong> <strong>Section E - vii</strong></span></p><ul><li><span style=\"color:#000000;\">'Diabetes is a disease which often adversely affects eyesight, and the risk for diabetes increases with age. These factors make the <u>app</u>, which can effectively see on behalf of <u>those with weakened eyesight</u>, all the more <u>beneficial</u>.'</span></li><li><span style=\"color:#000000;\">Heading 'vii' is correct because one of the main ideas in Section E is the way in which the GlucoseRX app can be helpful to people with weakened eyesight. Note that this heading paraphrases the text by using synonyms and similar phrases, such as 'a new technology' instead of 'the app,' 'the visually impaired' instead of 'those with weakened eyesight,' and 'helpful' instead of 'beneficial.'&nbsp;</span></li></ul><p>&nbsp;</p><p><span style=\"color:#000000;\"><strong>Incorrect Headings:</strong></span></p><p><span style=\"color:#000000;\"><strong>❌</strong> i - Heading 'i' is not an appropriate heading for any of the sections in the text. Although the text explains that diabetics can develop poor eyesight, it does not state that poor eyesight can increase the risk of developing diabetes.&nbsp;</span></p><p><span style=\"color:#000000;\"><strong>❌</strong> vi - Heading 'vi' is not an appropriate heading for any of the sections in the text. Although the text explains that glucose monitors are used by diabetics, who can become visually impaired, it does not mention providing new monitors to these diabetics. In fact, the text mainly concerns an app which works in parallel with diabetes meters. No new glucose meters are mentioned in the text.&nbsp;</span></p><p><span style=\"color:#000000;\"><strong>❌ </strong>viii - Heading 'viii' is not an appropriate heading for any of the sections in the text. The text mainly concerns the ways in which computers can analyse images, not analyses of images that they themselves produce.</span></p>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382833,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 19,
      //     question: {
      //       options: [],
      //       questionNumber: 6,
      //       displayNumber: '19',
      //       questionText:
      //         '<p><span style="color:#000000;">Section F</span></p>',
      //       answer: 'ii',
      //       groupId: 3,
      //       id: 19,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>19</strong> <strong>Section F -</strong> <strong>ii</strong></span></p><ul><li><span style="color:#000000;">\'Researchers are developing computer vision programs which can <u>read X-rays, CT and MRI scans</u>, and these programs can <u>detect patterns</u> which are invisible to the human eye.\'</span></li><li><span style="color:#000000;">Heading \'ii\' is correct because one of the main ideas in Section F is additional uses for computer vision in the medical field, which include reading and interpreting X-rays, CT scans, and MRI scans.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is not an appropriate heading for any of the sections in the text. Although the text explains that diabetics can develop poor eyesight, it does not state that poor eyesight can increase the risk of developing diabetes.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vi - Heading \'vi\' is not an appropriate heading for any of the sections in the text. Although the text explains that glucose monitors are used by diabetics, who can become visually impaired, it does not mention providing new monitors to these diabetics. In fact, the text mainly concerns an app which works in parallel with diabetes meters. No new glucose meters are mentioned in the text.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌ </strong>viii - Heading \'viii\' is not an appropriate heading for any of the sections in the text. The text mainly concerns the ways in which computers can analyse images, not analyses of images that they themselves produce.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382834,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 20,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '20',
      //       questionText: null,
      //       answer: 'disadvantage',
      //       groupId: 4,
      //       id: 20,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>20</strong> <strong>disadvantage</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'Computer vision functions in much the same way as human vision, but computers are at a <u>disadvantage</u> because humans spend years learning how to distinguish between faces, trees, numbers and letters.'</span></li><li><span style=\"color:#000000;\">The word 'disadvantage' is the correct word from the text because this sentence from the summary requires a noun. This is because the blank follows the article '<u>a</u>,' which must be followed by a singular noun. The sentence compares humans' and computers' vision, and it refers to the citation above explaining that computers are at a disadvantage when learning to differentiate visual information compared to humans.&nbsp;&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382835,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 21,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '21',
      //       questionText: null,
      //       answer: 'neural network',
      //       groupId: 4,
      //       id: 21,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>21</strong> <strong>neural network&nbsp;</strong></span></p><ul><li><span style=\"color:#000000;\">'Charles and the team of researchers developed a <u>neural network</u> which allows the app to recognise and read numerical digits.'</span></li><li><span style=\"color:#000000;\">The words 'neural network' are the correct words from the text because this sentence from the summary requires a noun or noun phrase. This is because the blank follows the article '<u>a</u>,' which must be followed by a singular noun. Note that this sentence paraphrases the text by using the phrase 'read values on glucose meters' instead of the phrase 'read numerical digits,' which has a similar meaning. Remember to include both words in the phrase 'neural network' in your response.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382836,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 22,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '22',
      //       questionText: null,
      //       answer: 'blood sugar',
      //       groupId: 4,
      //       id: 22,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>22</strong> <strong>blood sugar&nbsp;</strong></span></p><ul><li><span style=\"color:#000000;\">'Users simply take a photo of their glucose meter, and the values are automatically entered into the app to determine how much insulin the user needs in order to maintain normal <u>blood sugar</u> levels.'</span></li><li><span style=\"color:#000000;\">The words 'blood sugar' are the correct words from the text because this sentence in the summary requires an adjective or adjective phrase to describe the noun 'levels.' The words 'blood sugar' function here as an adjective phrase, and these words complete the phrase 'blood sugar levels,' which refers to the amount of sugar in one's bloodstream. Remember to include both words in the phrase 'blood sugar' in your response.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382837,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 23,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '23',
      //       questionText: null,
      //       answer: 'wireless',
      //       groupId: 4,
      //       id: 23,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>23</strong> <strong>wireless</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'Most digital glucose meters are not equipped with <u>wireless</u> connectivity, so the app does not require it. \"These meters work perfectly well, so we don't want them sent to landfill just because they don't have wireless connectivity,' said Dr James Charles.\"'</span></li><li><span style=\"color:#000000;\">The word 'wireless' is the correct word from the text because this sentence in the summary requires an adjective to describe the noun 'connectivity,' which follows the blank. This word completes the phrase 'wireless connectivity,' which refers to being connected to the internet or a wireless network. The writer explains that the app does not require wireless connectivity because this allows people to avoid getting rid of functioning meters. Note that this sentence paraphrases the words of Dr James Charles by using the word 'functioning' instead of the phrase 'work perfectly well.'&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382838,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 24,
      //     question: {
      //       options: [
      //         {
      //           key: 'a',
      //           text: 'computer image processing was limited until recently.',
      //         },
      //         {
      //           key: 'b',
      //           text: 'some visual information is difficult for computers to recognise.',
      //         },
      //         {
      //           key: 'c',
      //           text: 'when images contain complex shapes, they cannot be read by computers.',
      //         },
      //         {
      //           key: 'd',
      //           text: 'researchers must adapt images in order for computers to understand them.',
      //         },
      //       ],
      //       questionNumber: 1,
      //       displayNumber: '24',
      //       questionText:
      //         '<p><span style="color:#000000;">The writer refers to \'straight lines\' in section B to illustrate that</span></p>',
      //       answer: 'a',
      //       groupId: 5,
      //       id: 24,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>24</strong> <strong>A</strong></span></p><ul><li><span style="color:#000000;">\'... humans spend years learning how to distinguish between faces, trees, numbers and letters. While these visual features appear distinct to us, until recently computers could only identify basic information in images, such as <u>straight lines</u>.\'</span></li><li><span style="color:#000000;">Option A is correct because the writer refers to \'straight lines\' in order to illustrate that, until recently, computer image processing was limited to basic information, including straight lines.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> B - Option B is incorrect because, although some visual information could be difficult for computers to recognize, this option is not the reason why the writer refers to \'straight lines\' in the text. In fact, computers do not have difficulty recognizing straight lines according to the text.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> C - Option C is incorrect because, although the text explains that computers in the past could only identify basic visual information, it does not explicitly state that complex shapes make images impossible for computers to read. In addition, text indicates that, <u>until recently</u>, computers could only interpret simple visual information like straight lines. There is no indication in the text that this is still the case currently. Therefore, this option is not related to the reason why the writer refers to \'straight lines.\'&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> D - Option D is incorrect because the writer does not mention that images must be adapted in order for computers to understand them. Instead, the writer explains in Section C that computers learn to understand visual information by looking at large quantities of images. Also, this option is not related to the reason why the writer refers to \'straight lines.\'&nbsp;</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382839,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 25,
      //     question: {
      //       options: [
      //         {
      //           key: 'a',
      //           text: 'recognise information in poor-quality images.',
      //         },
      //         {
      //           key: 'b',
      //           text: 'read other types of digital meters.',
      //         },
      //         {
      //           key: 'c',
      //           text: 'allow users to track other health issues.',
      //         },
      //         {
      //           key: 'd',
      //           text: 'eliminate the need to use old scales and meters.',
      //         },
      //       ],
      //       questionNumber: 2,
      //       displayNumber: '25',
      //       questionText:
      //         '<p><span style="color:#000000;">Charles\' team tested their computer vision program to determine whether it could</span></p>',
      //       answer: 'b',
      //       groupId: 5,
      //       id: 25,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>25</strong> <strong>B</strong></span></p><ul><li><span style="color:#000000;">\'Thus, Charles and Cipolla tested their computer vision program on <u>different types of digital meters</u>, including blood pressure meters and bathroom scales.\'</span></li><li><span style="color:#000000;">Option B is correct because Charles\' team tested their computer vision program to determine whether it could read other types of digital meters, including the blood pressure meters and bathroom scales referenced in the above citation.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> A - Option A is incorrect because the text does not state that Charles\' team tested their computer vision program to determine whether it could recognize information in poor-quality images.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> C - Option C is incorrect because, although the text explains that Charles\' computer vision program was tested on blood pressure meters and bathroom scales, it does not explicitly state that Charles\' team tested their program to determine whether it could allow users to track health issues other than diabetes.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> D - Option D is incorrect because the writer does not state that Charles\' team tested their computer vision program to determine whether it could eliminate the need to use old scales and meters. In fact, the writer explains that this program is used for an app which can be used with existing glucose meters.&nbsp;</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382840,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 26,
      //     question: {
      //       options: [
      //         {
      //           key: 'a',
      //           text: 'are currently treated using computer vision programs.',
      //         },
      //         {
      //           key: 'b',
      //           text: 'could be detected using computer vision technology.',
      //         },
      //         {
      //           key: 'c',
      //           text: 'are complications caused by diabetes.',
      //         },
      //         {
      //           key: 'd',
      //           text: 'doctors find difficult to diagnose.',
      //         },
      //       ],
      //       questionNumber: 3,
      //       displayNumber: '26',
      //       questionText:
      //         '<p><span style="color:#000000;">In section F, clogged blood vessels, internal bleeding, tumours and cancer cells are examples of health issues that</span></p>',
      //       answer: 'b',
      //       groupId: 5,
      //       id: 26,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>26 B</strong></span></p><ul><li><span style="color:#000000;">\'Such technology could help doctors <u>identify</u> clogged blood vessels, internal bleeding, tumours and even cancer cells.\'</span></li><li><span style="color:#000000;">Option B is correct because, in Section F, the writer states that computer vision technology could be used to identify health issues such as clogged blood vessels, internal bleeding, tumours, and cancer cells. Note that this answer choice paraphrases the above citation from the text by using \'detect,\' which is a synonym of the word \'identify.\'&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> A - Option A is incorrect because the writer does not state that clogged blood vessels, internal bleeding, tumours, and cancer cells are examples of health issues that are currently treated using computer vision programs. Instead, the writer explains that researchers are developing programs to read various meters and that computer vision technology could be used to identify such health issues.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> C - Option C is incorrect because the writer does not state that health issues such as vessels, internal bleeding, tumours, and cancer cells are complications of diabetes.</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> D - Option D is incorrect because the writer does not state that doctors find clogged blood vessels, internal bleeding, tumours, or cancer cells difficult to diagnose. Although some of these health issues may be difficult to diagnose, this information cannot be verified based on the text.&nbsp;</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382841,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 27,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '27',
      //       questionText:
      //         '<p><span style="color:#000000;">Humans started using petroleum products in the mid nineteenth century.</span></p>',
      //       answer: 'FALSE',
      //       groupId: 6,
      //       id: 27,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>27</strong> <strong>False</strong></span></p><ul><li><span style="color:#000000;">\'People have been using petroleum products <u>for thousands of years</u>, but the large-scale exploitation of petroleum began in the 1850s, and the oil industry has grown exponentially over the last 170 years.\'</span></li><li><span style="color:#000000;">This statement is false because, although the text indicates that the use of petroleum was expanded and began to grow in the mid nineteenth century, it does not state that humans started using petroleum products during this period. Instead, the writer explains that they have been using these products for thousands of years.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382842,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 28,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '28',
      //       questionText:
      //         '<p><span style="color:#000000;">Many people are under the misconception that petroleum formed from the remains of dinosaurs.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 6,
      //       id: 28,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>28</strong> <strong>True</strong></span></p><ul><li><span style="color:#000000;">\'Oil and natural gas formed from the remains of algae and other sea creatures—<u>not dinosaurs as so many believe</u>—that perished hundreds of millions of years ago\'</span></li><li><span style="color:#000000;">This statement is true because the writer states that many people believe that petroleum formed from the remains of dinosaurs. This is a misconception because, in reality, it formed from the remains of algae and sea creatures.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382843,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 29,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '29',
      //       questionText:
      //         '<p><span style="color:#000000;">Electric vehicles cannot be used for international shipping because they are unable to recharge their batteries.</span></p>',
      //       answer: 'NOT GIVEN',
      //       groupId: 6,
      //       id: 29,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>29</strong> <strong>Not Given</strong></span></p><ul><li><span style="color:#000000;">\'While electric versions of many forms of transportation exist, they cannot be depended on for long distances, especially not for international travel and trade. Even electronic vehicles need to recharge their batteries, and the electricity that they use is provided by power plants that burn fossil fuels.\'</span></li><li><span style="color:#000000;">This statement is not given because, although the text states that electric vehicles cannot be used for international trade, it does not state the reason for this is that they have to recharge their batteries. Instead, the writer refers to the batteries of electric vehicles in order to explain that they rely on fossil fuels.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382844,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 30,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '30',
      //       questionText:
      //         '<p><span style="color:#000000;">Polymer plastics proliferated into many forms soon after their invention.</span></p>',
      //       answer: 'FALSE',
      //       groupId: 6,
      //       id: 30,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>30</strong> <strong>False</strong></span></p><ul><li><span style="color:#000000;">\'Polymer plastics—plastics made from petroleum—<u>were invented in 1907 but saw limited use</u>. After World War I, advances in the field of chemistry allowed for an explosion of new forms of plastic, and mass production of plastic took off in <u>the late \'40s and early \'50s</u>.\'</span></li><li><span style="color:#000000;">This statement is false because, according to the text, polymer plastics did not proliferate into many forms soon after their invention in 1907. Instead, new forms of plastic began to be produced in the late 1940s and early 1950s.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382845,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 31,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '31',
      //       questionText:
      //         '<p><span style="color:#000000;">More than half of the plastic products ever produced have become waste.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 6,
      //       id: 31,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>31</strong> <strong>True</strong></span></p><ul><li><span style="color:#000000;">\'The majority of plastics do not decompose, and scientists estimate that 8.3 billion tonnes have been produced since the 1950s. As much as 6.3 billion tonnes of that has been discarded as <u>waste</u>, and a meagre nine percent has been recycled.\'</span></li><li><span style="color:#000000;">This statement is true because, according to the text, roughly 6.3 billion tonnes of the total amount of plastic ever produced, 8.3 billion tonnes, have become waste. 6.3 billion tonnes is more than half of the total amount. The reason why this much plastic has become waste is because the majority of plastics do not decompose, or break down. Note that this statement paraphrases the text by using the phrase \'more than half\' instead of citing the exact figures.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382846,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 32,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '32',
      //       questionText:
      //         '<p><span style="color:#000000;">The planet\'s supply of oil will never be completely depleted</span></p>',
      //       answer: 'E',
      //       groupId: 7,
      //       id: 32,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>32</strong> <strong>E</strong></span></p><ul><li><span style="color:#000000;">\'Realistically, humanity <u>will never drain every last drop of oil</u> from the ground. That isn\'t for lack of trying—it is simply <u>impossible to access</u> all of it.\'</span></li><li><span style="color:#000000;">Sentence ending E best matches the beginning of the sentence because the ending correctly paraphrases the reason why the planet\'s supply of oil will never be completely depleted, which is because it is inaccessible to people. Note that the sentence beginning in question 32 cannot be matched grammatically with sentence endings A, C, or F.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Ending:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because it cannot correctly complete any of the given sentence beginnings. Although the grammar and syntax of this sentence ending could allow for it to match with the sentence beginning in question 35, the text does not state that plastic has replaced many traditional materials since it is stronger and more durable.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382847,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 33,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '33',
      //       questionText:
      //         '<p><span style="color:#000000;">Earth\'s supply of petroleum is limited because it</span></p>',
      //       answer: 'A',
      //       groupId: 7,
      //       id: 33,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>33</strong> <strong>A</strong></span></p><ul><li><span style="color:#000000;">\'It should surprise no one that existing reserves are <u>finite</u>. Oil and natural gas formed from the remains of algae and other sea creatures … that perished <u>hundreds of millions of years ago</u>. They were <u>buried in layers of sedimentary rock</u> … Thus, most of the reserves that remain untapped are too deep for us to reach.\'</span></li><li><span style="color:#000000;">Sentence ending A best matches the beginning of the sentence because the ending correctly paraphrases the reason why the Earth\'s supply of oil is limited. This reason is because the oil was formed in layers of rock hundreds of millions of years ago. Note that the sentence paraphrases the text by using synonyms of key terms, such as the word \'limited\' in place of \'finite.\' Also, note that the sentence beginning in question 33 cannot be matched grammatically with sentence endings B, D, E, or F.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Ending:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because it cannot correctly complete any of the given sentence beginnings. Although the grammar and syntax of this sentence ending could allow for it to match with the sentence beginning in question 35, the text does not state that plastic has replaced many traditional materials since it is stronger and more durable.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382848,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 34,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '34',
      //       questionText:
      //         '<p><span style="color:#000000;">The vast majority of petroleum products</span></p>',
      //       answer: 'F',
      //       groupId: 7,
      //       id: 34,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>34</strong> <strong>F</strong></span></p><ul><li><span style="color:#000000;">\'<u>Energy production</u> is by far <u>the largest consumer</u> of petroleum products.\'</span></li><li><span style="color:#000000;">Sentence ending F best matches the beginning of the sentence because energy production, or electricity generation, uses the majority of petroleum products. Note that the sentence paraphrases the text by using synonyms of key terms, such as the phrase \'the vast majority of\' in place of \'the largest consumer of\' and \'to generate electricity\' in place of \'energy production.\' Also, note that the sentence beginning in question 34 can only be matched grammatically with sentence endings A, C, or F.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Ending:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because it cannot correctly complete any of the given sentence beginnings. Although the grammar and syntax of this sentence ending could allow for it to match with the sentence beginning in question 35, the text does not state that plastic has replaced many traditional materials since it is stronger and more durable.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382849,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 35,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '35',
      //       questionText:
      //         '<p><span style="color:#000000;">Plastic has replaced many traditional materials</span></p>',
      //       answer: 'B',
      //       groupId: 7,
      //       id: 35,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>35</strong> <strong>B</strong></span></p><ul><li><span style="color:#000000;">\'Just a century ago all of our clothing, tools, vehicles and buildings <u>were made</u> from leather, natural fibres, wood, stone, metal and glass. Plastic has become <u>incorporated into all of the items</u> we use on a daily basis to varying degrees\'</span></li><li><span style="color:#000000;">Sentence ending B best matches the beginning of the sentence because the sentence correctly explains that, although traditional materials such as leather and wood were used to manufacture things like clothing and tools in the past, these materials have been replaced by plastic. Note that the sentence beginning references \'traditional materials,\' while the text explicitly names these materials. Also, note that the sentence beginning in question 35 cannot be matched grammatically with sentence endings C, or F.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Ending:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because it cannot correctly complete any of the given sentence beginnings. Although the grammar and syntax of this sentence ending could allow for it to match with the sentence beginning in question 35, the text does not state that plastic has replaced many traditional materials since it is stronger and more durable.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382850,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 36,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '36',
      //       questionText:
      //         '<p><span style="color:#000000;">It is estimated that petroleum reserves</span></p>',
      //       answer: 'C',
      //       groupId: 7,
      //       id: 36,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>36</strong> <strong>C</strong></span></p><ul><li><span style="color:#000000;">\'In 2005, the world passed the peak for conventional oil production … Many conservationists have been calling for oil production to cease completely, but that may no longer be a choice for our governments to make. By 2050, we could be living in a world without oil.\'</span></li><li><span style="color:#000000;">Sentence ending C best matches the beginning of the sentence because, according to the text, scientists have predicted that petroleum reserves will be depleted by 2050, which is in a few decades. Also, note that the sentence beginning in question 36 can only be matched grammatically with sentence endings A, C, or F.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Ending:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because it cannot correctly complete any of the given sentence beginnings. Although the grammar and syntax of this sentence ending could allow for it to match with the sentence beginning in question 35, the text does not state that plastic has replaced many traditional materials since it is stronger and more durable.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382851,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 37,
      //     question: {
      //       options: [
      //         {
      //           key: 'a',
      //           text: 'the reason why many people overestimate the quantity of petroleum on Earth.',
      //         },
      //         {
      //           key: 'b',
      //           text: 'studies that prove the supply of oil will never be completely depleted.',
      //         },
      //         {
      //           key: 'c',
      //           text: 'a common misunderstanding about the future of the oil industry.',
      //         },
      //         {
      //           key: 'd',
      //           text: 'why people have come to rely so heavily upon petroleum products.',
      //         },
      //       ],
      //       questionNumber: 1,
      //       displayNumber: '37',
      //       questionText:
      //         '<p><span style="color:#000000;">In the third paragraph, the writer refers to news articles to emphasise</span></p>',
      //       answer: 'a',
      //       groupId: 8,
      //       id: 37,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>37</strong> <strong>A</strong></span></p><ul><li><span style="color:#000000;">\'It seems like every week I read a <u>news article</u> about a study saying that there is <u>no shortage of oil</u>. The Earth is so huge, we could never run out of oil. <u>Many people believe these reports</u>, but while the former is true, the latter sadly is not.\'</span></li><li><span style="color:#000000;">Option A is correct because the writer refers to news articles in order to point out that they are the reason that many people overestimate the quantity of petroleum on Earth. Note that this option paraphrases the text by using the phrase \'overestimate the quantity of petroleum.\' This phrase is similar in meaning to the text, which explains that people believe there \'is no shortage of oil.\'&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> B - Option B is incorrect because the news articles state that there is an unlimited supply of oil, but they do not <u>prove</u> that this supply <u>will never be depleted</u>. In fact, the writer explains that, while reports and articles argue that there is plenty of oil, this is not true.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> C - Option C is incorrect because the writer mentions news articles to emphasise a misunderstanding that many people have about the <u>current</u> situation concerning the oil industry, which is that there <u>is</u> no shortage of oil. The writer does not refer to the future of the oil industry in the third paragraph.</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> D - \'We are addicted to oil, but the supply will soon be depleted. We have the technology that we need to end that dependence, but we need to use it.\' Option D is incorrect because, although the writer points out that <u>people rely heavily on petroleum</u> products in the text, this is not the reason why the writer refers to news articles. In fact, the writer does <u>not</u> explain <u>why</u> people rely heavily on petroleum products whatsoever in the third paragraph.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382852,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 38,
      //     question: {
      //       options: [
      //         {
      //           key: 'a',
      //           text: 'types of fuel utilised by different forms of transportation',
      //         },
      //         {
      //           key: 'b',
      //           text: 'power plants that consume the majority of fossil fuels',
      //         },
      //         {
      //           key: 'c',
      //           text: 'types of vehicles that run on alternative energy sources',
      //         },
      //         {
      //           key: 'd',
      //           text: 'companies that import and export goods over long distances',
      //         },
      //       ],
      //       questionNumber: 2,
      //       displayNumber: '38',
      //       questionText:
      //         '<p><span style="color:#000000;">What does \'<i><strong>they</strong></i>\' in the fifth paragraph refer to?</span></p>',
      //       answer: 'c',
      //       groupId: 8,
      //       id: 38,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>38</strong> <strong>C</strong></span></p><ul><li><span style=\"color:#000000;\">'While <u>electric versions of many forms of transportation</u> exist, <u>they</u> cannot be depended on for long distances, especially not for international travel and trade.'</span></li><li><span style=\"color:#000000;\">Option C is correct because 'they' refers to <u>electric</u> versions of forms of transportation, or types of vehicles that run on <u>alternative energy sources</u>, in the text. This option correctly paraphrases the above citation from the text because electricity is a type of alternative energy source.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style=\"color:#000000;\"><strong>❌</strong> A - Option A is incorrect because, although a different form of transportation is mentioned in the fifth paragraph, <u>types of fuel</u> utilised by different forms of transportation are <u>not</u> referenced in the clause that come before the pronoun 'they.' Therefore, 'they' cannot refer to types of fuel.&nbsp;</span></p><p>&nbsp;</p><p><span style=\"color:#000000;\"><strong>❌</strong> B - '... <u>power plants</u> that burn fossil fuels.' Option B is incorrect because, although the fifth paragraph refers to power plants, which consume fossil fuels, power plants are mentioned in the paragraph <u>after</u> the pronoun 'they.'&nbsp; Therefore, 'they' cannot refer to power plants.&nbsp;</span></p><p>&nbsp;</p><p><span style=\"color:#000000;\"><strong>❌</strong> D - Option D is incorrect because, although the fifth paragraph references the importing and exporting of goods internationally, or over long distances, it does not mention any companies. Therefore, 'they' cannot refer to these companies.&nbsp;</span></p>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382853,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 39,
      //     question: {
      //       options: [
      //         {
      //           key: 'a',
      //           text: 'They will not be able to satisfy our energy needs in the future.',
      //         },
      //         {
      //           key: 'b',
      //           text: 'They were utilised well before people discovered fossil fuels.',
      //         },
      //         {
      //           key: 'c',
      //           text: 'They are not reliable because they depend on the weather.',
      //         },
      //         {
      //           key: 'd',
      //           text: 'They cause much less pollution than burning fossil fuels.',
      //         },
      //       ],
      //       questionNumber: 3,
      //       displayNumber: '39',
      //       questionText:
      //         '<p><span style="color:#000000;">What does the writer imply about \'<i><strong>renewable resources</strong></i>\' in the ninth paragraph?</span></p>',
      //       answer: 'b',
      //       groupId: 8,
      //       id: 39,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>39</strong> <strong>B</strong></span></p><ul><li><span style="color:#000000;">\'Energy can be derived from renewable resources. After all, solar, wind and hydroelectric power <u>have been used for centuries longer than fossil fuels</u>.\'</span></li><li><span style="color:#000000;">Option B is correct because, by explaining that renewable resources such as solar and wind power have been used for centuries longer than fossil fuels, the writer implies that these resources were used well before people discovered fossil fuels. Note that this question asks what the writer <u>implies</u>, and thus requires you to correctly interpret the information in the ninth paragraph, rather than simply locating it.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> A - \'But these resources are not sufficient to satisfy our needs at present.\' Option A is incorrect because the writer does not imply in the ninth paragraph that renewable resources will not be able to satisfy our energy needs in the future. Although the writer explains that these resources are not sufficient to satisfy our current energy needs, the writer does not speculate as to whether or not renewable resources could satisfy these needs in the future.&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> C - Option C is incorrect because the writer does not imply in the ninth paragraph that renewable resources are not reliable because they depend on the weather. Although the writer refers to renewable resources including solar and wind power, which may in fact depend on the weather, the writer does not mention anything about the weather or reliability of these resources.&nbsp;&nbsp;</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> D - Option D is incorrect because the writer does not imply in the ninth paragraph that renewable resources cause much less pollution than burning fossil fuels. In fact, the writer does not mention anything about pollution in this paragraph. Although it is general knowledge that renewable resources cause much less pollution than burning fossil fuels, this is not the problem that the writer describes in the ninth paragraph. Instead, the writer describes the problem of the limited supply of oil.&nbsp;</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382854,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 40,
      //     question: {
      //       options: [
      //         {
      //           key: 'a',
      //           text: 'Some petroleum products are more important than others.',
      //         },
      //         {
      //           key: 'b',
      //           text: 'Petroleum products have become integral to everyday life.',
      //         },
      //         {
      //           key: 'c',
      //           text: 'People need to conserve petroleum while it is replaced.',
      //         },
      //         {
      //           key: 'd',
      //           text: 'We are dependent on a resource that has always been limited.',
      //         },
      //       ],
      //       questionNumber: 4,
      //       displayNumber: '40',
      //       questionText:
      //         '<p><span style="color:#000000;">What point does the writer make overall about petroleum?</span></p>',
      //       answer: 'd',
      //       groupId: 8,
      //       id: 40,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>40</strong> <strong>D</strong></span></p><ul><li><span style="color:#000000;">\'... the most accessible and highest quality oil is rapidly running out … existing reserves are <u>finite</u> … We are <u>addicted</u> to oil, but the supply will soon be depleted.\'</span></li><li><span style="color:#000000;">Option D is correct because the point that the writer makes overall about petroleum is that it is a limited resource that we are dependent on. In the beginning of the text, the writer explains that the amount of petroleum in the world is finite and that much of it is inaccessible. Throughout the rest of the text, the writer describes the many uses of petroleum that people rely on.&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> A - Option A is incorrect because, although the writer describes several types of petroleum products in the text, such as fossil fuels and plastics, the writer does not indicate that some of these products are <u>more important</u> than others.</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> B - \'Today, it is easier to think about what items do NOT contain plastics than to list all of those that do. Like energy generation, many of these products are vital to our daily lives.\' Option B is incorrect because, although the writer explains that several types of petroleum products have become integral to everyday life, this is not the writer\'s <u>overall</u> point about petroleum. This is because the writer also goes into detail about the fact that petroleum is a limited resource that will inevitably be depleted.</span></p><p>&nbsp;</p><p><span style="color:#000000;"><strong>❌</strong> C - \'If you really want to comprehend how important conserving petroleum is—just look around you.\' Option C is incorrect because, although the writer advocates for the conservation of oil, which could be replaced by renewable resources, this is not the writer\'s <u>overall</u> point about petroleum. In addition, the writer indicates that it is still uncertain whether or not renewable resources, or any other resource, will be able to replace petroleum.&nbsp;</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382815,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 1,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '1',
      //       questionText:
      //         '<p><span style="color:#000000;">The Kinetoscope could not be transported because it was too heavy.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 1,
      //       id: 1,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>1</strong> <strong>True</strong></span></p><ul><li><span style=\"color:#000000;\">'The Kinetoscope was a <u>bulky</u> machine that <u>weighed 453 kilograms</u> and was <u>impossible to transport</u> to theatres …'</span></li><li><span style=\"color:#000000;\">This statement is true because, according to the text, the Kinetoscope could not be transported because it was too heavy, weighing 453 kilograms. Note that this statement paraphrases the text by using the phrase 'could not be transported' instead of the phrase 'was impossible to transport.' The negative verb 'could not' is a synonym of 'impossible.'&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382817,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 3,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '3',
      //       questionText:
      //         '<p><span style="color:#000000;">The audience member cited in the text disagreed with the public opinion of the 1895 film.</span></p>',
      //       answer: 'FALSE',
      //       groupId: 1,
      //       id: 3,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>3</strong> <strong>False</strong></span></p><ul><li><span style="color:#000000;">\'A member of the audience at this screening, theatre director and future film-maker Georges Melies recounted: <i><u>We</u> stared flabbergasted at this sight, stupefied and surprised beyond all expression. At the end of the show, there was complete chaos. <u>Everyone</u> wondered how such a result was obtained</i>.\'</span></li><li><span style="color:#000000;">This statement is false because the audience member cited in the text, Georges Melies, did <u>not disagree</u> with the public opinion of the 1895 film according to the text. When discussing the opinion of the audience, Georges Melies uses the pronouns \'we\' and \'everyone,\' which <u>include</u> himself. Thus, Melies <u>shared the opinion</u> of others concerning the 1895 film.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382819,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 5,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '5',
      //       questionText:
      //         '<p><span style="color:#000000;">In the early 20th century, cinema gained popularity among people of all social classes.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 1,
      //       id: 5,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>5</strong> <strong>True</strong></span></p><ul><li><span style="color:#000000;">Films were popularised as mainstream entertainment and <u>brought people of both upper and lower classes together</u>.\'</span></li><li><span style="color:#000000;">This statement is true because, according to the text, cinema gained popularity among people of all social classes, both low and high. Note that this statement paraphrases the text by using the phrase \'all social classes\' instead of the phrase \'both upper and lower classes,\' which has a similar meaning.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382820,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 6,
      //     question: {
      //       options: [],
      //       questionNumber: 6,
      //       displayNumber: '6',
      //       questionText:
      //         '<p><span style="color:#000000;">Between the 1880s and the early 1900s, movie-goers were keen to watch new types of films.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 1,
      //       id: 6,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>6</strong> <strong>True</strong></span></p><ul><li><span style=\"color:#000000;\">'Audiences were <u>eager to consume the latest form of moving pictures</u> and developed a long-lasting interest in cinema.'</span></li><li><span style=\"color:#000000;\">This statement is true because, according to the text, movie-goers were keen to watch new types of films. Note that this statement paraphrases the text by using the word 'movie-goers,' which is a synonym of the word 'audiences' in the text. Also, the statement uses the adjective 'eager' instead of the word 'keen,' as well as the phrase 'new types of films' instead of the phrase 'the latest form of moving pictures.'&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382818,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 4,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '4',
      //       questionText:
      //         '<p><span style="color:#000000;">Early films of the Lumiere brothers were more similar to moving photographs than films because they lacked sound.</span></p>',
      //       answer: 'NOT GIVEN',
      //       groupId: 1,
      //       id: 4,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>4 Not Given</strong></span></p><ul><li><span style="color:#000000;">\'The early productions of the Lumiere brothers, however, shared more in common with animated photographs than with feature films.\'</span></li><li><span style="color:#000000;">This statement is not given because there is no information on this in the text. Although the writer explains that early films of the Lumiere brothers were more similar to moving photographs than films, the text does <u>not</u> state that the <u>reason</u> for this was <u>because they lacked sound</u>.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382855,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 56,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '1',
      //       questionText:
      //         '<p><span style="color:#000000;">Being labelled a \'sheep\' is usually considered a compliment.</span></p>',
      //       answer: 'FALSE',
      //       groupId: 14,
      //       id: 56,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>1</strong> <strong>False</strong></span></p><ul><li><span style="color:#000000;">\'... the term "sheep" is used for people who are <u>incapable of thinking for themselves</u>.\'</span></li><li><span style="color:#000000;">This statement is false because the writer explains that being labelled a \'sheep\' is considered an insult, not a compliment. This is because the term means that someone is incapable of thinking for themselves.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382856,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 57,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '2',
      //       questionText:
      //         '<p><span style="color:#000000;">A school of guppies has a high risk of being attacked by predators.&nbsp;</span></p>',
      //       answer: 'FALSE',
      //       groupId: 14,
      //       id: 57,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>2</strong> <strong>False</strong></span></p><ul><li><span style="color:#000000;">\'<u>Alone</u> a guppy is highly vulnerable to predators, but <u>together these small fish can outsmart them</u>.\'</span></li><li><span style="color:#000000;">This statement is false because, although the writer states that a lone guppy has a high risk of being attacked by predators, a school, or group, of guppies is not necessarily vulnerable to this. This is because, when working together, guppies can outsmart predators.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382857,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 58,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '3',
      //       questionText:
      //         '<p><span style="color:#000000;">The \'selfish herd theory\' explains the behaviour of most fish.</span></p>',
      //       answer: 'NOT GIVEN',
      //       groupId: 14,
      //       id: 58,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>3</strong> <strong>Not Given</strong></span></p><ul><li><span style="color:#000000;">\'The behaviour of <u>guppies</u> exemplifies what is known as "selfish herd theory."\'</span></li><li><span style="color:#000000;">This statement is not given because, although the writer explains that the \'selfish herd theory\' explains the behaviour of guppies, the text does <u>not</u> state that this theory explains the behaviour of <u>most fish</u>.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382858,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 59,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '4',
      //       questionText:
      //         '<p><span style="color:#000000;">Guppies swim together in ways that make predicting their movements difficult.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 14,
      //       id: 59,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>4</strong> <strong>True</strong></span></p><ul><li><span style="color:#000000;">\'Researchers have uncovered several complex <u>patterns of synchronised movement</u> that guppies use to keep predators guessing. By alternating between unique patterns of movement, guppies <u>prevent predators from predicting their next move</u>.\'</span></li><li><span style="color:#000000;">This statement is true because guppies swim together, or swim using synchronised movements, to make it difficult for predators to predict these movements.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382859,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 60,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '5',
      //       questionText:
      //         '<p><span style="color:#000000;">Cows use the knowledge of the entire herd to track down sources of water.</span></p>',
      //       answer: 'TRUE',
      //       groupId: 14,
      //       id: 60,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>5</strong> <strong>True</strong></span></p><ul><li><span style="color:#000000;">\'... the herd can find it by aggregating <u>all of the cows\' guesses</u> as to where water might be.\'</span></li><li><span style="color:#000000;">This statement is true because cows aggregate, or combine, the knowledge of all of the members of the herd in order to track down water according to the text.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382860,
      //     studentAnswer: '',
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 61,
      //     question: {
      //       options: [],
      //       questionNumber: 6,
      //       displayNumber: '6',
      //       questionText:
      //         '<p><span style="color:#000000;">Computers can replicate cows\' methods of locating water.</span></p>',
      //       answer: 'NOT GIVEN',
      //       groupId: 14,
      //       id: 61,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>6</strong> <strong>Not Given</strong></span></p><ul><li><span style="color:#000000;">\'In one study, a herd of cows even performed better than a computer at this task.\'</span></li><li><span style="color:#000000;">This statement is not given because, although the writer explains that a computer performed the task of locating water in one instance, the text does <u>not</u> indicate whether or not the computer <u>replicated cows\' methods</u> of doing so. In fact, the writer does not reference which methods the computer used at all.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382861,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 62,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '7',
      //       questionText:
      //         '<p><span style="color:#000000;">Stock market investors&nbsp;</span></p>',
      //       answer: 'C',
      //       groupId: 15,
      //       id: 62,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>7</strong> <strong>C</strong></span></p><ul><li><span style="color:#000000;">\'Like guppies, <u>investors often follow a herd</u> when choosing what stocks to buy because they assume that, if others are investing in a stock, it must be a fairly safe investment. Generally, if investors follow the herd in this way, they are likely to increase the value of the stock and <u>lower the risk of loss for themselves</u> and other investors, thereby strengthening the herd.\'</span></li><li><span style="color:#000000;">Sentence ending C is correct because, according to the text, stock market investors follow a herd to minimise their own financial risk.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Endings:&nbsp;</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> B - Sentence ending B is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal use <u>complicated systems</u> of communication.</span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal vote to choose a leader. Although the text states that company leadership vote to reach a consensus, it does not state that they vote to <u>choose a leader</u> who will make decisions.</span></p><p><span style="color:#000000;"><strong>❌</strong> F - Sentence ending F is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal use their <u>individual</u> critical thinking skills to solve problems. Instead, the text states that these three groups use collective knowledge or compromise to solve problems.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382862,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 63,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '8',
      //       questionText:
      //         '<p><span style="color:#000000;">Company executives and board members</span></p>',
      //       answer: 'A',
      //       groupId: 15,
      //       id: 63,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>8</strong> <strong>A</strong></span></p><ul><li><span style="color:#000000;">\'... company leadership uses the collective knowledge of executives and board members to <u>reach a consensus through discussion or voting</u>.\'</span></li><li><span style="color:#000000;">Sentence ending A is correct because, according to the text, company executives and board members make compromises, or reach a consensus, by discussing with each other or by voting.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Endings:&nbsp;</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> B - Sentence ending B is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal use <u>complicated systems</u> of communication.</span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal vote to choose a leader. Although the text states that company leadership vote to reach a consensus, it does not state that they vote to <u>choose a leader</u> who will make decisions.</span></p><p><span style="color:#000000;"><strong>❌</strong> F - Sentence ending F is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal use their <u>individual</u> critical thinking skills to solve problems. Instead, the text states that these three groups use collective knowledge or compromise to solve problems.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382863,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 64,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '9',
      //       questionText:
      //         '<p><span style="color:#000000;">People guessing the weight of an animal</span></p>',
      //       answer: 'E',
      //       groupId: 15,
      //       id: 64,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>9</strong> <strong>E</strong></span></p><ul><li><span style="color:#000000;">\'The most common example of humans using this approach is guessing the weight of livestock. Most people will naturally guess incorrectly, but <u>by collecting the guesses of a group of people</u> and determining the average guessed weight, <u>they can arrive at the animal\'s weight</u> with startling accuracy.\'</span></li><li><span style="color:#000000;">Sentence ending E is correct because, according to the text, people guessing the weight of an animal can reach the correct answer regarding its weight by using their collective knowledge.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Sentence Endings:&nbsp;</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> B - Sentence ending B is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal use <u>complicated systems</u> of communication.</span></p><p><span style="color:#000000;"><strong>❌</strong> D - Sentence ending D is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal vote to choose a leader. Although the text states that company leadership vote to reach a consensus, it does not state that they vote to <u>choose a leader</u> who will make decisions.</span></p><p><span style="color:#000000;"><strong>❌</strong> F - Sentence ending F is incorrect because the writer does not indicate that stock market investors, company executives and board members, or people guessing the weight of an animal use their <u>individual</u> critical thinking skills to solve problems. Instead, the text states that these three groups use collective knowledge or compromise to solve problems.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382864,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 65,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '10',
      //       questionText: null,
      //       answer: 'disagreement',
      //       groupId: 16,
      //       id: 65,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>10</strong> <strong>disagreement</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'When two pigeons have a <u>disagreement</u> about which direction to fly in, they compromise by averaging the trajectories together to create a new path.'</span></li><li><span style=\"color:#000000;\">Note that this sentence paraphrases the text by using the phrase 'flight path,' which is synonymous with 'direction to fly in.' Also, this sentence requires a noun because the blank follows the words 'have a.'</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382865,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 66,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '11',
      //       questionText: null,
      //       answer: 'averaging',
      //       groupId: 16,
      //       id: 66,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>11</strong> <strong>averaging</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'When two pigeons have a disagreement about which direction to fly in, they compromise by <u>averaging</u> the trajectories together to create a new path.'</span></li><li><span style=\"color:#000000;\">Note that this sentence requires a gerund, a verb in '-ing' form, because the blank follows the phrase 'compromise by' and is followed by the direct object 'the trajectories.'</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382866,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 67,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '12',
      //       questionText: null,
      //       answer: 'leader',
      //       groupId: 16,
      //       id: 67,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>12</strong> <strong>leader</strong>&nbsp;</span></p><ul><li><span style="color:#000000;">\'If a compromise cannot be reached, one of the birds becomes the <u>leader</u>.\'</span></li><li><span style="color:#000000;">Note that the sentence requires a singular noun because the blank is followed by the phrase \'is chosen.\'</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382867,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 68,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '13',
      //       questionText: null,
      //       answer: 'accuracy',
      //       groupId: 16,
      //       id: 68,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>13</strong> <strong>accuracy</strong>&nbsp;</span></p><ul><li><span style="color:#000000;">\'This process works on a broader scale in a flock of pigeons, and research has shown that it leads to precise navigational <u>accuracy</u>.\'</span></li><li><span style="color:#000000;">Note that this sentence paraphrases the text by using the phrase \'navigate with high levels of accuracy\' in place of the phrase \'precise navigational accuracy\' from the text.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382868,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 69,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '14',
      //       questionText:
      //         '<p><span style="color:#000000;">Section A</span></p>',
      //       answer: 'iv',
      //       groupId: 17,
      //       id: 69,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>14 Section A - iv</strong></span></p><ul><li><span style="color:#000000;">\'The company aired a live broadcast of the launch of <u>a specially modified reusable rocket</u> known as Falcon 9 Flight 20 on December 21, 2015 … This was the first time that a rocket was able to return to Earth and land under its own power, which could potentially revolutionise space transportation.\'</span></li><li><span style="color:#000000;">Heading \'iv\' is the correct choice because Section A introduces a new breed of rocket, the Falcon 9 Flight 20, and describes its first launch and its innovative functions.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer references a merger between X.com and Cofinity, this is a <u>minor detail</u> in the text, not a main idea.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> v - Heading \'v\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer explains in Section D that the initial launches of the Falcon 1 were failures, and these failures could be considered hurdles to overcome, these hurdles are not the main idea in Section D. These failures are instead a <u>minor detail</u> in Section D.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vii - Heading \'vii\' is <u>not</u> an appropriate heading for any of the sections in the text. The main subject in the text is the space exploration company SpaceX, but the writer does not reference any major competing companies. Therefore, competing companies are <u>not</u> a <u>main idea</u> in the text.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382869,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 70,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '15',
      //       questionText:
      //         '<p><span style="color:#000000;">Section B</span></p>',
      //       answer: 'viii',
      //       groupId: 17,
      //       id: 70,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>15</strong> <strong>Section B - viii</strong></span></p><ul><li><span style="color:#000000;">\'SpaceX is <u>headquartered in Hawthorne, California</u>, and it manufactures rocket engines, launch vehicles, cargo and crew spacecraft and communications satellites … It launched the first privately funded liquid-fuelled rocket to <u>reach Earth\'s orbit</u>. It was also the first private company to <u>send a spacecraft to the International Space Station</u> (ISS), and it created the first orbital rocket that can take off and land vertically and be reused.\'</span></li><li><span style="color:#000000;">Heading \'viii\' is the correct choice because Section B explains that the company SpaceX, which was founded in California, has sent various types of spacecraft and rockets to space.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer references a merger between X.com and Cofinity, this is a <u>minor detail</u> in the text, not a main idea.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> v - Heading \'v\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer explains in Section D that the initial launches of the Falcon 1 were failures, and these failures could be considered hurdles to overcome, these hurdles are not the main idea in Section D. These failures are instead a <u>minor detail</u> in Section D.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vii - Heading \'vii\' is <u>not</u> an appropriate heading for any of the sections in the text. The main subject in the text is the space exploration company SpaceX, but the writer does not reference any major competing companies. Therefore, competing companies are <u>not</u> a <u>main idea</u> in the text.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382870,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 71,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '16',
      //       questionText:
      //         '<p><span style="color:#000000;">Section C</span></p>',
      //       answer: 'ii',
      //       groupId: 17,
      //       id: 71,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>16</strong> <strong>Section C - ii</strong></span></p><ul><li><span style="color:#000000;">\'He was <u>born</u> in Pretoria, South Africa, in 1971, and he showed an aptitude for computing and programming <u>in his youth</u>.\'</span></li><li><span style="color:#000000;">Heading \'ii\' is the correct choice because Section C describes SpaceX CEO Elon Musk\'s early years, including his upbringing in South Africa, education, and early career.</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer references a merger between X.com and Cofinity, this is a <u>minor detail</u> in the text, not a main idea.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> v - Heading \'v\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer explains in Section D that the initial launches of the Falcon 1 were failures, and these failures could be considered hurdles to overcome, these hurdles are not the main idea in Section D. These failures are instead a <u>minor detail</u> in Section D.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vii - Heading \'vii\' is <u>not</u> an appropriate heading for any of the sections in the text. The main subject in the text is the space exploration company SpaceX, but the writer does not reference any major competing companies. Therefore, competing companies are <u>not</u> a <u>main idea</u> in the text.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382871,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 72,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '17',
      //       questionText:
      //         '<p><span style="color:#000000;">Section D</span></p>',
      //       answer: 'vi',
      //       groupId: 17,
      //       id: 72,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>17 Section D - vi</strong></span></p><ul><li><span style="color:#000000;">\'Around the same time, Musk became involved with a non-profit called the Mars Society, and <u>he found his mission in life: colonising Mars</u>.\'</span></li><li><span style="color:#000000;">Heading \'vi\' is the correct choice because Section D describes how SpaceX CEO Elon Musk found a new dream, which was to colonise Mars. Note that this heading paraphrases the text by using the word \'dream,\' which is synonymous with \'mission in life.\'&nbsp;</span></li></ul><p>&nbsp;</p><p><span style="color:#000000;"><strong>Incorrect Headings:</strong></span></p><p><span style="color:#000000;"><strong>❌</strong> i - Heading \'i\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer references a merger between X.com and Cofinity, this is a <u>minor detail</u> in the text, not a main idea.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> v - Heading \'v\' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer explains in Section D that the initial launches of the Falcon 1 were failures, and these failures could be considered hurdles to overcome, these hurdles are not the main idea in Section D. These failures are instead a <u>minor detail</u> in Section D.&nbsp;</span></p><p><span style="color:#000000;"><strong>❌</strong> vii - Heading \'vii\' is <u>not</u> an appropriate heading for any of the sections in the text. The main subject in the text is the space exploration company SpaceX, but the writer does not reference any major competing companies. Therefore, competing companies are <u>not</u> a <u>main idea</u> in the text.</span></p>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382872,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 73,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '18',
      //       questionText:
      //         '<p><span style="color:#000000;">Section E</span></p>',
      //       answer: 'iii',
      //       groupId: 17,
      //       id: 73,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>18 Section E - iii</strong></span></p><ul><li><span style=\"color:#000000;\">'SpaceX's <u>milestones</u> are <u>vital</u> to it as a private company, and <u>the whole world</u>.'</span></li><li><span style=\"color:#000000;\">Heading 'iii' is the correct choice because Section E points out how significant the achievements of SpaceX are to the company and the world. Note that this heading paraphrases the text by using the word 'achievements' instead of 'milestones.'</span></li></ul><p>&nbsp;</p><p><span style=\"color:#000000;\"><strong>Incorrect Headings:</strong></span></p><p><span style=\"color:#000000;\"><strong>❌</strong> i - Heading 'i' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer references a merger between X.com and Cofinity, this is a <u>minor detail</u> in the text, not a main idea.&nbsp;</span></p><p><span style=\"color:#000000;\"><strong>❌</strong> v - Heading 'v' is <u>not</u> an appropriate heading for any of the sections in the text. Although the writer explains in Section D that the initial launches of the Falcon 1 were failures, and these failures could be considered hurdles to overcome, these hurdles are not the main idea in Section D. These failures are instead a <u>minor detail</u> in Section D.&nbsp;</span></p><p><span style=\"color:#000000;\"><strong>❌</strong> vii - Heading 'vii' is <u>not</u> an appropriate heading for any of the sections in the text. The main subject in the text is the space exploration company SpaceX, but the writer does not reference any major competing companies. Therefore, competing companies are <u>not</u> a <u>main idea</u> in the text.</span></p>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382873,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 74,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '19',
      //       questionText: null,
      //       answer: 'atmosphere',
      //       groupId: 18,
      //       id: 74,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>19</strong> <strong>atmosphere</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'The rocket launched and left the <u>atmosphere</u> without mishap, and then the second stage of the rocket separated, deployed its payload of satellites and fell to burn up on re-entry into the atmosphere.'</span></li><li><span style=\"color:#000000;\">The word 'atmosphere' is the correct word from the text because this question requires a noun. This is because the blank follows the word 'Earth<u>'s</u>,' which includes the possessive marker '-s' and must be followed by a noun.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382874,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 75,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '20',
      //       questionText: null,
      //       answer: 'separated',
      //       groupId: 18,
      //       id: 75,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>20</strong> <strong>separated</strong>&nbsp;</span></p><ul><li><span style="color:#000000;">\'The rocket launched and left the atmosphere without mishap, and then the second stage of the rocket <u>separated</u>, deployed its payload of satellites and fell to burn up on re-entry into the atmosphere.\'</span></li><li><span style="color:#000000;">The word \'separated\' is the correct word from the text because the second half of the sentence uses the past-tense verb \'deployed.\' This is an indication that the first half of the sentence should also contain a past-tense verb.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382875,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 76,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '21',
      //       questionText: null,
      //       answer: 'vertical',
      //       groupId: 18,
      //       id: 76,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>21</strong> <strong>vertical</strong>&nbsp;</span></p><ul><li><span style="color:#000000;">\'Meanwhile, the first stage descended using its rocket engines to make a controlled <u>vertical</u> landing on an autonomous spaceport drone ship (ASDS) in the ocean.\'</span></li><li><span style="color:#000000;">The word \'vertical\' is the correct word from the text because this question requires an adjective to describe the word \'landing,\' which follows the blank.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382876,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 77,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '22',
      //       questionText: null,
      //       answer: 'engines',
      //       groupId: 18,
      //       id: 77,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>22</strong> <strong>engines</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'Meanwhile, the first stage descended using its rocket <u>engines</u> to make a controlled vertical landing on an autonomous spaceport drone ship (ASDS) in the ocean.'</span></li><li><span style=\"color:#000000;\">The word 'engines' is the correct word from the text because this question requires a noun. This is because the blank follows the word '<u>its</u>,' meaning the first stage<u>'s</u>, which indicates possession and must be followed by a noun. Remember to include the plural '-s' in the word 'engines' from the text.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382877,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 78,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '23',
      //       questionText:
      //         '<p><span style="color:#000000;">Meyer described the {{blank 23}} as a combination of a parade and a sporting event.</span></p>',
      //       answer: 'scripted broadcast, broadcast',
      //       groupId: 19,
      //       id: 78,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>23</strong> <strong>scripted broadcast, broadcast</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'Robinson Meyer, technology editor for <i>The Atlantic</i>, summarised the <u>scripted broadcast</u> as \"a way of treating a rocket launch not like a dry engineering procedure, but like some combination of the Macy's Thanksgiving Day Parade and the Super Bowl.\"'</span></li><li><span style=\"color:#000000;\">Note that this sentence requires a noun or noun phrase because the blank follows the words 'described the.' For this question, you may respond with either 'scripted broadcast' or 'broadcast,' which also grammatically completes the sentence.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382878,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 79,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '24',
      //       questionText:
      //         '<p><span style="color:#000000;">The first company that Musk founded made online {{blank 24}} software.</span></p>',
      //       answer: 'city guide',
      //       groupId: 19,
      //       id: 79,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>24</strong> <strong>city guide</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'... he soon dropped out to launch his own startup with his brother Kimbal and Greg Kouri. They created Zip2, an Internet-based company that provided online <u>city guide</u> software to newspapers.'</span></li><li><span style=\"color:#000000;\">Note that this sentence paraphrases the text by using the verb 'found' instead of the verbs 'launch' and 'create,' which are used in the text.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382879,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 80,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '25',
      //       questionText:
      //         '<p><span style="color:#000000;">In the early 2000s, after attempting to buy {{blank 25}} from Russia, Musk decided to build his own.</span></p>',
      //       answer: 'rockets',
      //       groupId: 19,
      //       id: 80,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>25</strong> <strong>rockets</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'After trying to purchase <u>rockets</u> from Russia, and being rebuffed on multiple occasions, Musk decided to build his own rockets and founded SpaceX.'</span></li><li><span style=\"color:#000000;\">Note that this sentence requires a noun because the blank follows the verb 'buy,' which must be followed by an object. Also, remember to include the plural 's' in the word 'rockets.'&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382880,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 81,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '26',
      //       questionText:
      //         '<p><span style="color:#000000;">SpaceX has NASA contracts and is competing to send astronauts back to the {{blank 26}}.</span></p>',
      //       answer: 'Moon',
      //       groupId: 19,
      //       id: 81,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>26</strong> <strong>Moon</strong>&nbsp;</span></p><ul><li><span style="color:#000000;">\'Musk has already received contracts from NASA to launch its payloads into orbit, and SpaceX is competing to return astronauts to the <u>Moon</u>.\'</span></li><li><span style="color:#000000;">Note that this sentence can be best completed by inserting a location because it refers to sending astronauts somewhere. Also, note that this sentence paraphrases the text by using the verb phrase \'send back,\' which is a synonym of the verb \'return\' from the text.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382881,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 82,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '27',
      //       questionText:
      //         '<p><span style="color:#000000;">Only humans shed tears due to intense emotions.</span></p>',
      //       answer: 'YES',
      //       groupId: 20,
      //       id: 82,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>27</strong> <strong>Yes</strong></span></p><ul><li><span style="color:#000000;">\'But why do we cry when we experience intense emotions while <u>no other species</u>, not even our closest genetic cousins, display this kind of physical response?\'&nbsp;</span></li><li><span style="color:#000000;">This statement agrees with the claims of the writer because, according to the text, it is true that only humans shed tears due to intense emotions. In fact, the writer explains that not even our closest genetic cousins display this kind of response to emotion.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382882,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 83,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '28',
      //       questionText:
      //         '<p><span style="color:#000000;">Land mammals produce tears for many practical purposes.</span></p>',
      //       answer: 'YES',
      //       groupId: 20,
      //       id: 83,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>28</strong> <strong>Yes</strong></span></p><ul><li><span style="color:#000000;">\'All land mammals can generate <u>different kinds of tears</u> with different chemical compositions from glands in their eyes through a process called lacrimation. Basal tears are constantly produced to <u>lubricate the eyes</u>, and reflex tears are released to <u>remove irritants</u> from the eye.\'</span></li><li><span style="color:#000000;">This statement agrees with the claims of the writer because, according to the text, land mammals can generate different kinds of tears for a variety of purposes, including lubricating and removing irritants from the eye.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382883,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 84,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '29',
      //       questionText:
      //         '<p><span style="color:#000000;">Basal tears are generated to eliminate foreign substances in the eye.</span></p>',
      //       answer: 'NO',
      //       groupId: 20,
      //       id: 84,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>29</strong> <strong>No</strong></span></p><ul><li><span style="color:#000000;">\'<u>Basal tears</u> are constantly produced <u>to lubricate</u> the eyes, and <u>reflex tears</u> are released <u>to remove irritants</u> from the eye.\'</span></li><li><span style="color:#000000;">This statement does not agree with the claims of the writer because, according to the text, basal tears are <u>not</u> generated to eliminate foreign substances in the eye. Instead, these tears lubricate the eye, while reflex tears eliminate foreign substances.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382884,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 85,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '30',
      //       questionText:
      //         '<p><span style="color:#000000;">Many mammals are capable of recognizing signs of distress and will help unrelated individuals.</span></p>',
      //       answer: 'NOT GIVEN',
      //       groupId: 20,
      //       id: 85,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>30</strong> <strong>Not Given</strong></span></p><ul><li><span style="color:#000000;">\'Scientists have observed that many social mammals can recognize need and will respond by providing protection or food to younger or weaker individuals including primates, whales, elephants and meerkats.\'</span></li><li><span style="color:#000000;">It is impossible to say what the writer thinks about this statement because, although the writer explains that many <u>social mammals</u> are capable of recognizing distress and will help weaker or younger individuals, the text does <u>not</u> state that many mammals will <u>help unrelated individuals</u>. Instead, the writer explains that <u>humans</u>, not many mammals in general, help people they are not related to.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382885,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 86,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '31',
      //       questionText:
      //         '<p><span style="color:#000000;">People who can cry on demand are less likely to be trusted.</span></p>',
      //       answer: 'NOT GIVEN',
      //       groupId: 20,
      //       id: 86,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>31</strong> <strong>Not Given</strong></span></p><ul><li><span style="color:#000000;">\'Some people can force themselves to cry to gain an advantage, but for most it is involuntary, and even false tears can cause a sympathetic response.\'</span></li><li><span style="color:#000000;">It is impossible to say what the writer thinks about this statement because, although the text describes people who can cry on demand to gain an advantage, the writer does <u>not</u> indicate that these types of people are <u>less likely to be trusted</u>.</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382886,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 87,
      //     question: {
      //       options: [],
      //       questionNumber: 6,
      //       displayNumber: '32',
      //       questionText:
      //         '<p><span style="color:#000000;">False tears rarely elicit the same response as genuine tears.</span></p>',
      //       answer: 'NO',
      //       groupId: 20,
      //       id: 87,
      //       explanation: {
      //         explanationText:
      //           '<p><span style="color:#000000;"><strong>32</strong> <strong>No</strong></span></p><ul><li><span style="color:#000000;">\'People cry in sympathy when they watch actors on stage and screen, even though they know that the people are not actually suffering. The tears on the actors\' faces may be false, but they still <u>elicit the same response</u> from the audience as genuine ones.\'</span></li><li><span style="color:#000000;">This statement does not agree with the claims of the writer because, according to the text, the false tears of actors on stage and screen elicit the same sympathetic response as genuine tears.&nbsp;</span></li></ul>',
      //       },
      //     },
      //   },
      //   {
      //     id: 382887,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 88,
      //     question: {
      //       options: [],
      //       questionNumber: 1,
      //       displayNumber: '33',
      //       questionText: null,
      //       answer: 'mammalian',
      //       groupId: 21,
      //       id: 88,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>33 mammalian</strong>&nbsp;</span></p><ul><li><span style=\"color:#000000;\">'Human crying evolved from vocalisations that <u>mammalian</u> offspring make when they are separated from their mothers or in distress from danger or hunger. However, this behaviour is limited to young animals, it is only vocal and it mostly ceases as they mature.'</span></li><li><span style=\"color:#000000;\">The word 'mammalian' is the correct word from the text because this sentence requires an adjective to describe the noun phrase 'species' young,' which follows the blank. Also, note that the sentence paraphrases the text by using the noun 'young,' which is a synonym of the word 'offspring' from the text. The sentence also uses the phrase, 'this behaviour disappears as they grow up,' which has a similar meaning to the phrase, 'it mostly ceases as they mature,' from the text.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382888,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 89,
      //     question: {
      //       options: [],
      //       questionNumber: 2,
      //       displayNumber: '34',
      //       questionText: null,
      //       answer: 'lubricate',
      //       groupId: 21,
      //       id: 89,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>34</strong> <strong>lubricate</strong></span></p><ul><li><span style=\"color:#000000;\">'Basal tears are constantly produced to <u>lubricate</u> the eyes, and reflex tears are released to remove irritants from the eye.'</span></li><li><span style=\"color:#000000;\">The word 'lubricate' is the correct word from the text because this sentence requires a verb. This is because the blank is followed by the noun phrase 'their eyes,' which here serves as a direct object for the verb 'lubricate.'&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382889,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 90,
      //     question: {
      //       options: [],
      //       questionNumber: 3,
      //       displayNumber: '35',
      //       questionText: null,
      //       answer: 'psychic',
      //       groupId: 21,
      //       id: 90,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>35</strong> <strong>psychic</strong></span></p><ul><li><span style=\"color:#000000;\">'However, research indicates that only humans produce tears as an emotional response, which are called <u>psychic</u> tears.'</span></li><li><span style=\"color:#000000;\">The word 'psychic' is the correct word from the text because this sentence requires an adjective to describe the noun 'tears.' The word 'psychic' completes the phrase 'psychic tears,' which are tears that function as an emotional response according to the text. Also, note that this sentence paraphrases the text by using the phrase 'shed tears' instead of the phrase 'produce tears.'&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382890,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 91,
      //     question: {
      //       options: [],
      //       questionNumber: 4,
      //       displayNumber: '36',
      //       questionText: null,
      //       answer: 'giving birth',
      //       groupId: 21,
      //       id: 91,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>36</strong> <strong>giving birth</strong></span></p><ul><li><span style=\"color:#000000;\">'While the experience of pain is very subjective and varies from person to person, it often involves crying, and humans often exhibit a more robust response to pain than other animals, particularly when they are ill or <u>giving birth</u>.'</span></li><li><span style=\"color:#000000;\">The words 'giving birth' are the correct words from the text because this sentence can be completed by inserting either a noun or a gerund (a verb in '-ing' form). Also, remember to include both words. The word 'birth' alone would not be acceptable here because this could indicate either the act of giving birth or being born. However, the writer in the text describes 'giving birth,' <u>not</u> being born.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382891,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 92,
      //     question: {
      //       options: [],
      //       questionNumber: 5,
      //       displayNumber: '37',
      //       questionText: null,
      //       answer: 'near silence',
      //       groupId: 21,
      //       id: 92,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>37</strong> <strong>near silence</strong></span></p><ul><li><span style=\"color:#000000;\">'Most animals suffer through these experiences in <u>near silence</u> because they are more vulnerable to predators in such states.'</span></li><li><span style=\"color:#000000;\">The words 'near silence' are the correct words from the text because they complete the phrase 'suffer in near silence,' which means to endure pain without making loud noises. For this question, you must include both words in the phrase 'near silence' because this means animals make very little noise, but the word 'silence' alone would mean that they make no noise whatsoever.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382892,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 93,
      //     question: {
      //       options: [],
      //       questionNumber: 6,
      //       displayNumber: '38',
      //       questionText: null,
      //       answer: 'biological advantage, advantage',
      //       groupId: 21,
      //       id: 93,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>38</strong> <strong>biological advantage, advantage</strong></span></p><ul><li><span style=\"color:#000000;\">'The more extreme and prolonged experience of pain and emotional tears that humans experience must provide a <u>biological advantage</u> for them to have evolved, and that appears to be convincing others to help us in our times of need.'</span></li><li><span style=\"color:#000000;\">The words 'biological advantage' are the correct words from the text because this sentence requires a noun or noun phrase. This is because the blank follows the phrase 'provide some kind of.' The verb 'provide' must be followed by a direct object in the form of a noun. For this question, the words 'biological advantage' or the word 'advantage' would be an acceptable response.</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382893,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 94,
      //     question: {
      //       options: [],
      //       questionNumber: 7,
      //       displayNumber: '39',
      //       questionText: null,
      //       answer: 'honest signal, signal',
      //       groupId: 21,
      //       id: 94,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>39</strong> <strong>honest signal</strong></span></p><ul><li><span style=\"color:#000000;\">'People can exaggerate their emotional or physical state in words, but tears act as a form of <u>honest signal</u>.'</span></li><li><span style=\"color:#000000;\">The words 'honest signal' are the correct words from the text because this sentence requires a singular noun or noun phrase. This is because the blank follows the phrase '<u>a</u> type of.' For this question, the words 'honest signal' or the word 'signal' would be an acceptable response.&nbsp;</span></li></ul>",
      //       },
      //     },
      //   },
      //   {
      //     id: 382894,
      //     studentAnswer: null,
      //     correctStatus: 'incorrect',
      //     rawScore: 0,
      //     questionId: 95,
      //     question: {
      //       options: [],
      //       questionNumber: 8,
      //       displayNumber: '40',
      //       questionText: null,
      //       answer: 'vulnerable',
      //       groupId: 21,
      //       id: 95,
      //       explanation: {
      //         explanationText:
      //           "<p><span style=\"color:#000000;\"><strong>40</strong> <strong>vulnerable</strong></span></p><ul><li><span style=\"color:#000000;\">'They convey a person's true condition by putting them in a <u>vulnerable</u> position.'</span></li><li><span style=\"color:#000000;\">The word 'vulnerable' is the correct word from the text because this sentence requires an adjective to describe the noun 'position.' The phrase 'in a vulnerable position' means to be in a position of heightened danger.</span></li></ul>",
      //       },
      //     },
      //   },
      // ];
      // const readingData = readingPassages.map(item => ({
      //   ...item,
      //   passageText: item.groups[0].passageText,
      //   groups: item.groups.map(group => ({
      //     ...group,
      //     questions: readingResponses.filter(question => group.questions.map(_question => _question.id).includes(question.question.id)).map(question => question.question),
      //   }))
      // }));
      // fs.writeFileSync('./reading.json', JSON.stringify(readingData));
      // const readingQuestionPartCount =
      //   await this.questionPartService.countDocuments({
      //     skill: QuestionSkill.READING,
      //   });
      // console.log(readingQuestionPartCount);
      // if (readingQuestionPartCount == 0) {
      //   for (let i = 0; i < readingData.length; i++) {
      //     const readingRawData = readingData[i];
      //     const newQuestionPart = await this.questionPartService.create({
      //       skill: QuestionSkill.READING,
      //       level: QuestionLevel.A1,
      //       passageTitle: readingRawData.passageTitle,
      //       passageText: readingRawData.passageText,
      //     });
      //     if (newQuestionPart && newQuestionPart._id) {
      //       for (let j = 0; j < readingRawData.groups.length; j++) {
      //         const readingRawDataGroup = readingRawData.groups[j];
      //         const newQuestionGroup = await this.questionGroupService.create({
      //           skill: QuestionSkill.READING,
      //           level: QuestionLevel.A1,
      //           questionType: readingRawDataGroup.questionType.toUpperCase(),
      //           directionText: readingRawDataGroup.directionText,
      //           questionTypeTips:
      //             readingRawDataGroup.explanation.questionTypeTips,
      //           image: readingRawDataGroup.image,
      //           answerList: readingRawDataGroup.answerList,
      //           questionBox: readingRawDataGroup.questionBox,
      //           partId: newQuestionPart._id.toString(),
      //         });
      //         if (newQuestionGroup && newQuestionGroup._id) {
      //           for (let k = 0; k < readingRawDataGroup.questions.length; k++) {
      //             const readingRawDataGroupQuestion =
      //               readingRawDataGroup.questions[k];
      //             const newQuestion = await this.questionService.create({
      //               skill: QuestionSkill.READING,
      //               level: QuestionLevel.A1,
      //               explanationText:
      //                 readingRawDataGroupQuestion.explanation
      //                   .explanationText,
      //               answer: readingRawDataGroupQuestion.answer,
      //               questionText:
      //                 readingRawDataGroupQuestion.questionText,
      //               groupId: newQuestionGroup._id.toString(),
      //             });
      //             if (newQuestion && newQuestion._id) {
      //               for (
      //                 let l = 0;
      //                 l < readingRawDataGroupQuestion.options.length;
      //                 l++
      //               ) {
      //                 const readingRawDataGroupQuestionOption =
      //                   readingRawDataGroupQuestion.options[l];
      //                 const newQuestionOption =
      //                   await this.questionOptionService.create({
      //                     text: readingRawDataGroupQuestionOption.text,
      //                     key: readingRawDataGroupQuestionOption.key,
      //                     questionId: newQuestion._id.toString(),
      //                   });
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      // const listeningData = listeningRawData.parts.map((part) => ({
      //   partNumber: part.partNumber,
      //   partTitle: part.scriptTitle,
      //   partAudio: part.partAudio,
      //   groups: part.groups.map((group) => ({
      //     groupPartNumber: group.groupNumber,
      //     script: group.script,
      //     answerList: group.answerList,
      //     directionText: group.directionText,
      //     image: group.image,
      //     questionTypeTips: group.explanation.questionTypeTips,
      //     questionBox: group.questionBox,
      //     questionType: group.questionType,
      //     questions: group.questions.map((question) => {
      //       return {
      //         questionPartNumber: question.questionNumber,
      //         questionText: question.questionText,
      //         explanationText: question.explanation.explanationText,
      //         answer: question.answer,
      //         options: (question.options || []).map((option) => ({
      //           key: option.key,
      //           text: option.text,
      //         })),
      //       };
      //     }),
      //   })),
      // }));
      // fs.writeFileSync('./listening.json', JSON.stringify(listeningData));
      // const listeningQuestionPartCount =
      //   await this.questionPartService.countDocuments({
      //     skill: QuestionSkill.LISTENING,
      //   });
      // console.log(listeningQuestionPartCount);
      // if (listeningQuestionPartCount == 0) {
      //   for (let i = 0; i < listeningData.length; i++) {
      //     const listeningDataItem = listeningData[i];
      //     const newQuestionPart = await this.questionPartService.create({
      //       skill: QuestionSkill.LISTENING,
      //       level: QuestionLevel.A1,
      //       partNumber: listeningDataItem.partNumber,
      //       partTitle: listeningDataItem.partTitle,
      //       partAudio: listeningDataItem.partAudio,
      //     });
      //     if (newQuestionPart && newQuestionPart._id) {
      //       for (let j = 0; j < listeningDataItem.groups.length; j++) {
      //         const listeningDataItemGroup = listeningDataItem.groups[j];
      //         const newQuestionGroup = await this.questionGroupService.create({
      //           skill: QuestionSkill.LISTENING,
      //           level: QuestionLevel.A1,
      //           groupPartNumber: listeningDataItemGroup.groupPartNumber,
      //           script: listeningDataItemGroup.script,
      //           answerList: listeningDataItemGroup.answerList,
      //           directionText: listeningDataItemGroup.directionText,
      //           image: listeningDataItemGroup.image,
      //           questionTypeTips: listeningDataItemGroup.questionTypeTips,
      //           questionBox: listeningDataItemGroup.questionBox,
      //           questionType: listeningDataItemGroup.questionType,
      //           partId: newQuestionPart._id.toString(),
      //         });
      //         if (newQuestionGroup && newQuestionGroup._id) {
      //           for (
      //             let k = 0;
      //             k < listeningDataItemGroup.questions.length;
      //             k++
      //           ) {
      //             const listeningDataItemGroupQuestion =
      //               listeningDataItemGroup.questions[k];
      //             const newQuestion = await this.questionService.create({
      //               skill: QuestionSkill.LISTENING,
      //               level: QuestionLevel.A1,
      //               questionPartNumber:
      //                 listeningDataItemGroupQuestion.questionNumber,
      //               questionText: listeningDataItemGroupQuestion.questionText,
      //               explanationText:
      //               listeningDataItemGroupQuestion.explanation && listeningDataItemGroupQuestion.explanation
      //                   .explanationText || null,
      //               answer: listeningDataItemGroupQuestion.answer,
      //               groupId: newQuestionGroup._id.toString(),
      //             });
      //             if (newQuestion && newQuestion._id) {
      //               for (
      //                 let l = 0;
      //                 l < listeningDataItemGroupQuestion.options.length;
      //                 l++
      //               ) {
      //                 const listeningDataItemGroupQuestionOption =
      //                   listeningDataItemGroupQuestion.options[l];
      //                 const newQuestionOption =
      //                   await this.questionOptionService.create({
      //                     text: listeningDataItemGroupQuestionOption.text,
      //                     key: listeningDataItemGroupQuestionOption.key,
      //                     questionId: newQuestion._id.toString(),
      //                   });
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
      // const speakingData = speakingRawData.testMeta.map((part) => ({
      //   partNumber: part.partNumber,
      //   directionAudio: part.directionAudio,
      //   // groups: part.groups.map((group) => ({
      //   //   title: group.title,
      //   //   explanationText:
      //   //     (group.explanation && group.explanation.explanationText) || null,
      //   //   usefulGrammarNVocab:
      //   //     (group.explanation && group.explanation.usefulGrammarNVocab) ||
      //   //     null,
      //   //   ideaSuggestion:
      //   //     (group.explanation && group.explanation.ideaSuggestion) || null,
      //   //   questions: group.questions.map((question) => {
      //   //     const _question = speakingRawData.speakingResponses.filter(
      //   //       (item) => item.questionId == question.id,
      //   //     )[0];
      //   //     return {
      //   //       questionAudio: question.questionAudio,
      //   //       questionText: question.text,
      //   //       modelAnswerAudio:
      //   //         _question &&
      //   //         _question.question &&
      //   //         _question.question.explanation &&
      //   //         _question.question.explanation.modelAnswerAudio,
      //   //       modelAnswer:
      //   //         _question &&
      //   //         _question.question &&
      //   //         _question.question.explanation &&
      //   //         _question.question.explanation.modelAnswer,
      //   //     };
      //   //   }),
      //   // })),
      // }));
      // fs.writeFileSync('./speaking.json', JSON.stringify(speakingData));
      // const speakingQuestionPartCount =
      //   await this.questionPartService.countDocuments({
      //     skill: QuestionSkill.SPEAKING,
      //   });
      // console.log(speakingQuestionPartCount);
      // if (speakingQuestionPartCount == 0) {
      //   for (let i = 0; i < speakingData.length; i++) {
      //     const speakingDataItem = speakingData[i];
      //     const newQuestionPart = await this.questionPartService.create({
      //       skill: QuestionSkill.SPEAKING,
      //       level: QuestionLevel.A1,
      //       partNumber: speakingDataItem.partNumber,
      //       directionAudio: speakingDataItem.directionAudio,
      //     });
      //     // if (newQuestionPart && newQuestionPart._id) {
      //     //   for (let j = 0; j < speakingDataItem.groups.length; j++) {
      //     //     const speakingDataItemGroup = speakingDataItem.groups[j];
      //     //     const newQuestionGroup = await this.questionGroupService.create({
      //     //       skill: QuestionSkill.SPEAKING,
      //     //       level: QuestionLevel.A1,
      //     //       title: speakingDataItemGroup.title,
      //     //       explanationText: speakingDataItemGroup.explanationText,
      //     //       usefulGrammarNVocab: speakingDataItemGroup.usefulGrammarNVocab,
      //     //       ideaSuggestion: speakingDataItemGroup.ideaSuggestion,
      //     //       partId: newQuestionPart._id.toString(),
      //     //     });
      //     //     if (newQuestionGroup && newQuestionGroup._id) {
      //     //       for (
      //     //         let k = 0;
      //     //         k < speakingDataItemGroup.questions.length;
      //     //         k++
      //     //       ) {
      //     //         const speakingDataItemGroupQuestion =
      //     //           speakingDataItemGroup.questions[k];
      //     //         const newQuestion = await this.questionService.create({
      //     //           skill: QuestionSkill.SPEAKING,
      //     //           level: QuestionLevel.A1,
      //     //           questionAudio: speakingDataItemGroupQuestion.questionAudio,
      //     //           questionText: speakingDataItemGroupQuestion.questionText,
      //     //           modelAnswerAudio:
      //     //             speakingDataItemGroupQuestion.modelAnswerAudio,
      //     //           modelAnswer: speakingDataItemGroupQuestion.modelAnswer,
      //     //           groupId: newQuestionGroup._id.toString(),
      //     //         });
      //     //       }
      //     //     }
      //     //   }
      //     // }
      //   }
      // }
    } catch (error) {
      console.log(error);
    }
  }
}
