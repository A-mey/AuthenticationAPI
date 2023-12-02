import express from 'express';
import { CommonRoutesConfig } from '../../../common.routes.config';
import NotFoundController from "../controllers/404.error.controllers"


export class NotFoundRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'NotFoundErrorRoutes');
    }

    configureRoutes() {
        this.app.route('/*')
            .all(
                NotFoundController.notFoundResponse
            )
        
        return this.app;
    }
}