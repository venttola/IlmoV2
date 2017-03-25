import * as express from "express";

module Route {
    export class GroupRoutes {
        constructor() {
            console.log("constructor");
        }

        public removeMember = (req: express.Request, res: express.Response) => {
            return res.status(204).send();
        }

        public addModerator = (req: express.Request, res: express.Response) => {
            return res.status(204).send();
        }

        public removeModerator = (req: express.Request, res: express.Response) => {
            return res.status(204).send();
        }

        public getMemberProducts = (req: express.Request, res: express.Response) => {
            return res.status(204).send();
        }
    }
}