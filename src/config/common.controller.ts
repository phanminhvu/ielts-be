import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '../user/enums/user-type.enum';
import { QuestionSkill } from '../question-part/enums/question-skill.enum';
import { QuestionAnalysisType } from './../question/enums/question-analysis-type.enum';
import { QuestionLevel } from './../question-part/enums/question-level.enum';
import { QuestionType } from './../question-group/enums/question-type.enum';
import { QuestionTypeListDto } from './dto/question-type-list.query';

@ApiTags('Config')
@Controller('configs')
export class CommonController {
  constructor() {}

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('question-levels')
  async getListLevel() {
    return Object.values(QuestionLevel);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('question-analysis-types')
  async getListAnalysisType() {
    return Object.values(QuestionAnalysisType);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('question-skills')
  async getListSkill() {
    return Object.values(QuestionSkill);
  }

  @ApiBearerAuth()
  @Roles(UserType.SUPER_ADMIN, UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('question-types')
  async getListType(@Query() query: QuestionTypeListDto) {
    let questionTypes = Object.values(QuestionType);

    if (query.skill && (Object.values(QuestionSkill) as string[]).includes(query.skill)) {
      if (query.skill == QuestionSkill.LISTENING) {
        questionTypes = questionTypes.filter(questionType => [
          QuestionType.MULTIPLE_CHOICE_1_ANSWER,
          QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER,
          QuestionType.SENTENCE_COMPLETION,
          QuestionType.FORM_COMPLETION,
          QuestionType.TABLE_COMPLETION,
          QuestionType.MATCHING_SENTENCE_ENDINGS,
          QuestionType.SHORT_ANSWER_QUESTION,
          QuestionType.LABELLING_A_PLAN_MAP,
          QuestionType.DIAGRAM_LABELING,
          QuestionType.FLOW_CHART_COMPLETION,
          QuestionType.NOTE_COMPLETION,
        ].includes(questionType));
      } else if (query.skill == QuestionSkill.READING) {
        questionTypes = questionTypes.filter(questionType => [
          QuestionType.MULTIPLE_CHOICE_1_ANSWER,
          QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWER,
          QuestionType.IDENTIFYING_INFORMATION,
          QuestionType.IDENTIFYING_VIEWS_CLAIMS,
          QuestionType.MATCHING_PARAGRAPH_INFORMATION,
          QuestionType.MATCHING_HEADINGS,
          QuestionType.MATCHING_FEATURES,
          QuestionType.MATCHING_SENTENCE_ENDINGS,
          QuestionType.SENTENCE_COMPLETION,
          QuestionType.SUMMARY_COMPLETION,
          QuestionType.NOTE_COMPLETION,
          QuestionType.TABLE_COMPLETION,
          QuestionType.FLOW_CHART_COMPLETION,
          QuestionType.DIAGRAM_LABELING,
          QuestionType.LIST_SELECTION,
          QuestionType.SHORT_ANSWER_QUESTION,
        ].includes(questionType));
      }
    }

    // return questionTypes;
    return questionTypes.map(value => ({
      label: `${value}`.replace(new RegExp("_", "g"), " ").toLowerCase().split(" ").map(char => char.charAt(0).toUpperCase() + char.slice(1)).join(" "),
      value: value,
      // isPickAnswer: [QuestionType.IDENTIFYING_INFORMATION,QuestionType.IDENTIFYING_INFORMATION,].includes(value),
      // isFillInAnswer: [QuestionType.NOTE_COMPLETION,QuestionType.IDENTIFYING_INFORMATION,].includes(value),
    }));
  }
}
