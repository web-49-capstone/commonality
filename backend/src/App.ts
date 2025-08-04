import express, {type Application } from 'express'
import morgan from 'morgan'
// Routes
import session from 'express-session'
import type {  RedisClientType } from 'redis'
import {RedisStore} from 'connect-redis'
import {indexRoute} from "./apis/index.route.ts";
import {signUpRoute} from "./apis/sign-up/sign-up.route.ts";
import {signInRoute} from "./apis/sign-in/sign-in.route.ts";
import {userRoute} from "./apis/users/user.route.ts";
import {interestRoute} from "./apis/interests/interest.route.ts";
import {matchingRoute} from "./apis/matching/matching.route.ts";
import {messageRoute} from "./apis/message/message.route.ts";
import {groupRoute} from "./apis/groups/group.route.ts";
import {groupInterestRoute} from "./apis/group-interests/group-interest.route.ts";
import {groupMatchingRoute} from "./apis/group-matching/group-matching.route.ts";
import helmet from "helmet";

export class App {
    app: Application
    redisStore : RedisStore

    constructor (  redisClient: RedisClientType
    ) {
        this.redisStore = new RedisStore({client: redisClient})
        this.app = express()
        this.settings()
        this.middlewares()
        this.routes()
    }
    // private method that sets the port for the sever, to one from index.route.ts, and external .env file or defaults to 3000
    public settings (): void {}

    // private method to setting up the middleware to handle json responses, one for dev and one for prod
    private middlewares (): void {

        this.app.use(morgan('dev'))
        this.app.use(express.json())
        this.app.use(helmet())
        this.app.use(session( {
            store: this.redisStore,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET as string,
            resave: false
        }))
    }
    // private method for setting up routes in their basic sense (ie. any route that performs an action on profiles starts with /profiles)
    private routes (): void {
        this.app.use(indexRoute.basePath, indexRoute.router)
        this.app.use(signUpRoute.basePath, signUpRoute.router)
        this.app.use(signInRoute.basePath, signInRoute.router)
        this.app.use(userRoute.basePath, userRoute.router)
        this.app.use(interestRoute.basePath, interestRoute.router)
        this.app.use(messageRoute.basePath, messageRoute.router)
        this.app.use(matchingRoute.basePath, matchingRoute.router)
        this.app.use(groupRoute.basePath, groupRoute.router)
        this.app.use(groupInterestRoute.basePath, groupInterestRoute.router)
        this.app.use(groupMatchingRoute.basePath, groupMatchingRoute.router)

    }

    // starts the server and tells the terminal to post a message that the server is running and on what port
    public  listen (): void {
        this.app.listen(4200)
        console.log('Express application built successfully')
    }
}