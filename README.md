# aurelia-blur-plugin

[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/bigopon/aurelia-blur-attribute.svg?branch=master)](https://travis-ci.org/bigopon/aurelia-blur-attribute)

## [Introduction](aurelia-doc://section/1/version/1.0.0)

This article covers the blur plugin for Aurelia. This plugin is created for managing focus in your application. The plugin supports the use of dynamic elements matching, via either element references or CSS selectors. [Online Demo](http://aurelia-blur.bigopon.surge.sh/)


## [Installing The Plugin](aurelia-doc://section/2/version/1.0.0)

1. In your **JSPM**-based project install the plugin via `jspm` with following command

```shell
jspm install aurelia-blur-plugin
```

If you use **Webpack**, install the plugin with the following command

```shell
npm install aurelia-blur-plugin --save
```

If you use the **Aurelia CLI**, install the plugin with the following command

```shell
npm install aurelia-blur-plugin --save
```

2. Make sure you use [manual bootstrapping](http://aurelia.io/docs#startup-and-configuration). In order to do so open your `index.html` and locate the element with the attribute aurelia-app. Change it to look like this:

```html
  <body aurelia-app="main">...</body>
```

3. Create (if you haven't already) a file `main.js` in your `src` folder with following content:

```js
  export function configure(aurelia) {

    /**
     * We will cover reasons behind these options in later sections
     */
    let listeningModeOptions = {
      pointer: false, // listen for pointer event interaction
      touch: false, // listen for touch event interaction
      mouse: false, // listen for mouse event interaction
      focus: false, // listen for foucs event
      windowBlur: false // listen for window blur event (navigating away from window)
    }

    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      .plugin('aurelia-blur-plugin', listeningModeOptions);

    aurelia.start().then(a => a.setRoot());
  }
```

## [Using The Plugin](aurelia-doc://section/3/version/1.0.0)

There are a few scenarios you can take advantage of the Aurelia blur plugin.

1. You can use the dialog service to control when a form should be hidden.
This is a common case, consider the following dom structure

![](http://i.imgur.com/oBF5Ryv.png)

It's clear that our intent is only trigger the blur, when we interact with any elements outside the form element. One may implement it like following:

```html
  <div>
    <button click.delegate="formIsBlur = false">Show Form</button>
    <form if.bind="formIsBlur">
      <input blur.trigger="formIsBlur = true" />
      <select blur.trigger="formIsBlur = true"></select>
      <input blur.trigger="formIsBlur = true" />
    </form>

    <!-- Or more optimized version -->
    <form if.bind="formIsBlur" blur.capture="formIsBlur = true">
      <input />
      <select></select>
      <input />
    </form>
  </div>
```

This is often insufficient, as what we do want is to react when either (pointer/ touch/ mouse) down, or focus on elements outside of the form, but what we will get is any focus navigation between inputs. The plugin solves this for you, by listening to some critical events to determine if focus is still inside an element.

```html
  <div>
    <button click.delegate="formIsBlur = false">Show Form</button>
    <form if.bind="formIsBlur" blur.bind="formIsBlur">
      <input />
      <select ></select>
      <input />
    </form>
```

Notice the attribute differences: `blur.capture` / `blur.trigger` vs `blur.bind`. When using `blur.bind`, we are using the plugin, instead event listener.

## Usage Examples / Scenarios

TODO

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
4. To build the code, you can now run:

  ```shell
  npm run build
  ```

5. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

6. See `gulpfile.js` for other tasks related to generating the docs and linting.

## Running The Tests

```shell
npm run test
```

## Acknowledgement
Thanks goes to Dwayne Charrington for his Aurelia-TypeScript starter package https://github.com/Vheissu/aurelia-typescript-plugin
