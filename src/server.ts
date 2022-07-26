import './util/module-alias';

import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import { ForecastController } from './controllers/Forecast';
import { Application } from 'express';

export class SetupServer extends Server {
  constructor(private port = 3333) {
    super();
  }

  init(): void {
    this.setupExpress();

    this.setupControllers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();

    this.addControllers([forecastController]);
  }

  getApp(): Application {
    return this.app;
  }
}
