# archappenv &middot; [![CircleCI](https://circleci.com/gh/architecode/archappenv.svg?style=svg)](https://circleci.com/gh/architecode/archappenv) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/archappenv.svg?style=flat)](https://www.npmjs.com/package/archappenv) [![Build Status](https://travis-ci.org/architecode/archappenv.svg?branch=master)](https://travis-ci.org/architecode/archappenv) [![Coverage Status](https://coveralls.io/repos/github/architecode/archappenv/badge.svg)](https://coveralls.io/github/architecode/archappenv)
Provides Application Environment Variables from ***.appenv.js** / **.env** and Utilities

### Installation

```js
npm i archappenv
```

## Overview

### Structure

The **archappenv** provides three modules: **AppEnv**, **Services**, and **Utilities**.

To access all modules:

```js
// load it as an entry point of the whole module:
const { AppEnv } = require('archappenv');
const Services = AppEnv.Services;
const Utilities = AppEnv.Util;
```

To access each module:

```js
// load it as separated module:
const AppEnv = require('archappenv/appenv');
const Services = require('archappenv/services');
const Utilities = require('archappenv/util');
```

### Modules

<ul>
  <li type="square"><a href="#appenv">AppEnv</a></li>
  <ul>
    <li type="disc"><a href="#appenvloadoptions">load(options) - loads <b>Application Environment Variables</b></a></li>
    <li type="disc"><a href="#appenvbind">bind() - binds <b>Application Environment Variables</b> to process.env</a></li>
  </ul>

  <li type="square"><a href="#services">Services</a></li>
  <ul>
    <li type="disc"><a href="#hostname">hostname()</a></li>
  </ul>

  <li type="square"><a href="#utilities">Utilities</a></li>
</ul>

## AppEnv

The **AppEnv** module provides services to Application Environment Variables: [load()](#appenvloadoptions) and [bind()](#appenvbind).

#### AppEnv.load(options)

It loads **Application Environment Variables** using **Options** or **Configuration**.

**<u>Options</u>:**

**Options** is an object that allows to customize how **AppEnv** is loaded.

\- **dir**: defines the **directory** contained _*.appenv.js_ files and _appenv.config.json_ file. It can be _absolute_ or _relative_ path. If _omitted_, it'll use **[application]/appenv/** as default directory.

\- **type**: defined the **[type].appenv.js** file in _dir_ directory. If _omitted_, it'll resolve a value from **appenv.config.json** file in _dir_ directory.

**appenv.config.json**

It defines **type** depended to **the name of server** where it's located. If the name **<u>cannot</u>** be resolved, it'll use **default.appenv.js**.

```ts
module.exports = {
  prod: [
    "hostname.01",
    "hostname.02",
    "hostname.03",
  ],
  dev: [
    "hostname.04",
    "hostname.05",
    "hostname.06",
  ],
};
```

If the server name, either **hostname.01**, **hostname.02**, or **hostname.03**, , it'll resolve **prod** as _type_, and expect **prod.appenv.js** file to be resolved.

However, if the server name, either **hostname.04**, **hostname.05**, or **hostname.06**, it'll resolve **dev** as _type_, and expect **dev.appenv.js** file to be resolved.

**<u>Example</u>:**

```
Files:
In [application]/configs:
  - appenv.config.json (as above)
  - prod.appenv.js
  - dev.appenv.js
  - custom.appenv.js
```

<u>Note</u>: If these _four files were located_ in **[application]/appenv** directory, the **options.dir** could be **<u>omitted</u>**. However, they are, in this case, located in **[application]/configs** directory, the **options.dir** need to be defined.

**Usage**

```js
// loads [application]/configs/prod.appenv.js
const prod = AppEnv.load({ type:'prod', dir: './configs' });

// loads [application]/configs/dev.appenv.js
const dev = AppEnv.load({ type:'dev', dir: './configs' });

// loads [application]/configs/custom.appenv.js
const custom = AppEnv.load({ type:'custom', dir: './configs' });

// loads [application]/configs/prod.appenv.js in "hostname.01" server
const prod = AppEnv.load({ dir: './configs' });

// loads [application]/appenv/prod.appenv.js in "hostname.01" server
const prod = AppEnv.load();

// loads [application]/appenv/dev.appenv.js in "hostname.04" server
const dev = AppEnv.load();

// loads [application]/appenv/default.appenv.js in "not.in.list.hostname" server
const default = AppEnv.load();
```

#### AppEnv.bind()

It binds the resolved **Application Environment Variables** to **process.env**.

```js
// in resolved appenv.js file:
module.exports = {
  APP_TITLE: "Application Title",
  APP_USERS: [
    "user.01",
    "user.02",
    "user.03",
  ],
};
```

**Usage**
```js
AppEnv.bind();

const title = process.env.APP_TITLE;
// title: "Application Title"

const users = process.env.APP_USERS;
// users: ["user.01", "user.02", "user.03"]
```

[back to top](#modules)

## Services

## Utilities
