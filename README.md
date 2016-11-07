# IlmoV2
New sign-up portal for Sotahuuto event

### Project structure
- app
    - bin
        - Contains the server launch script
    - dist
        - Compiled server javascript files
    - migrations
        - Database scripts
    - src
        - Server source files written in typescript
    - public
        - Application fronted, contains Angular 2 source files
- docs
    - All the project documents

#### Config files
* gulpfile.js
    * Configuration file for Gulp task runner
* package.json
    * Contains the project meta data
* tsconfig.json
    * Configuration file for typescript compiler
* tslint.json
    * Rule file for typescript linter

---

### How to run
Default node server:
```
node .\bin\start.js
```
Gulp development server:
```
gulp start
```
This one should be used for development. Gulp will lint + compile the source and restart the server when modified file is saved.

---

### Database setup
To initialize database schema for development, run:
```
$ mysql -u root < migrations\init.sql
```