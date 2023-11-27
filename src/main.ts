import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { json as expressJson, urlencoded as expressUrlEncoded } from 'express';
import * as admin from 'firebase-admin';

import { AppModule } from './app.module';
import configuration from './common/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const adminConfig = require('../serviceAccountKey.json');
  // if (adminConfig && adminConfig.project_id) {
  //   // Initialize the firebase admin app
  //   admin.initializeApp({
  //     credential: admin.credential.cert(adminConfig),
  //   });
  // } else {
  //   console.log('Cannot find firebase serviceAccountKey file');
  // }

  app.setGlobalPrefix('api/v1');

  const whitelist = configuration().whitelistOrigins;
  whitelist.push(null);
  app.use(expressJson({ limit: '50mb' }));
  app.use(expressUrlEncoded({ limit: '50mb', extended: true }));
  app.enableCors({
    // origin: function (origin, callback) {
    //   if (whitelist.indexOf(origin || null) !== -1) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error('Not allowed by CORS'));
    //   }
    // },
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('IELTS API')
    .setDescription(
      'The IELTS API documents. Account: admin@nextlevelvn.com/123456',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configuration().port);
}
bootstrap();
