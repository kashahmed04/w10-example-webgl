import './reset.css';
import './styles.css';

// code taken from https://github.com/mdn/dom-examples/blob/main/webgl-examples/tutorial/sample7/webgl-demo.js

import { initBuffers } from './init-buffers.js';
import { drawScene } from './draw-scene.js';

let cubeRotation = 0.0;
let deltaTime = 0;

main();

//
// start here
//
function main() {
  const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
  canvas.width = 800;
  canvas.height = 600;
  // Initialize the GL context
  // so instead of saying '2d' here we would say 'webgl' what is the difference though since a canvas gets created regardless**
  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  // Only continue if WebGL is available and working
  // when would webgl not be available and not working (is it only if the browser or machine does not support it)**
  if (gl === null) {
    alert(
      'Unable to initialize WebGL. Your browser or machine may not support it.',
    );
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  // we only defined this in draw scene but there was no value put into it so is it built into webgl**
  //what do these two lines do**
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader program

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec2 aTextureCoord;

  uniform mat4 uNormalMatrix;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;

    // Apply lighting effect

    highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    highp vec3 directionalLightColor = vec3(1, 1, 1);
    highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

    highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
    vLighting = ambientLight + (directionalLightColor * directional);
  }
`;

  // Fragment shader program

  const fsSource = `
  varying highp vec2 vTextureCoord;
  varying highp vec3 vLighting;

  uniform sampler2D uSampler;

  void main(void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
  }
`;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // bail if we were unable to setup the program
  // if we cant set up the program would it only be a black background (only the canavas rendered or is the canvas webgl since we said
  // 'webgl' instead of '2d' for get context)**
  if (shaderProgram === null) {
    return;
  }

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVertexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      //why do we do gl. here because if we are getting something from the shader program wouldnt it be shaderProgram.
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      //atribute and uniform are the names before these vectors and matricies are applied so we need to call this to access
      //the specific vector or matrix we need**
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix',
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  // this builds all the sides of the cube and what else**
  const buffers = initBuffers(gl);

  // Load texture
  const texture = loadTexture(gl, 'tiger.png');
  // Flip image pixels into the bottom-to-top order that WebGL expects.
  // what is pixelStorei and when we flip the pixels does it put the image upside down**
  // what does the true say here**
  // why did we only flip y here is there an option to flip x or both**
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let then = 0;

  // Draw the scene repeatedly
  function render(now: number) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;
    //so basically we get now and make then equal to now then we change now and we keep subtracting now from then because 
    //now will always be bigger than then each frame (because of request animation frame calling this per frame)** so it will
    //always be a positive (constant)** interval to draw per frame**

    drawScene(gl, programInfo, buffers, texture, cubeRotation);
    cubeRotation += deltaTime;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
// why do we need the same exact method in main and shader**
function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // bail if we were unable to create the shaders
  if (vertexShader === null || fragmentShader === null) {
    return null;
  }

  // Create the shader program
  const shaderProgram = gl.createProgram() as WebGLProgram;
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it. 
// what does this mean does it upload the image for all sides of the cube to make it spin or what does this do**
// why do we need load shader here if it was already defined in shader**
function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type) as WebGLShader;

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
// why do we need image and texture here** why not just an image why do we have to copy it into the texture**
function loadTexture(gl: WebGLRenderingContext, url: string) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  // so textures need at least one thing to load in right and since our image does not load immediately and we want to display we put a
  // pixel instead**
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE; //how does it know what number to give us**
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel,
  );

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image,
    );

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    // what does this mean** and what is mips**
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

//what does this do**
function isPowerOf2(value: number) {
  return (value & (value - 1)) === 0;
}


/**
 * NEW NOTES:
 * 
 * WebGL is a JS version of the embedded system and we will use version 2 or 3 and its close to**
 * 
 * what does it mean that its almost openGL ES 2.0 / 3.0** (slide 1)**
 * 
 * this is a language to render 2D and 3D graphics and uses the canvas element with the WebGL API (we do get context with 
 * WebGL in the quotes instead of 2D like we have been doing with canvas)**
 * 
 * so does webgl involve both the canavs API and webgl API in order to use webgl** (what other APIs are involved to use webgl)**
 * 
 * WebGL is very low level of** and we are interacting with our scene and we are**
 * 
 * at a local level WebGL it takes a lot of work to make a cube to spin around (we can add some libraries to make it easier
 * for us though like three.js and babylon.js)**
 * 
 * each of these demos are on a different branch and we need to run npm install every time we move from branch to branch otherwise
 * it will break
 * 
 * main branch:
 * 
 * uses webgl2 (which is ES 3.0 and webgl is ES 2.0)**(different versions of JS)** it says in the code we used webgl though
 * for ES 2.0**
 * 
 * uses glmatrix which**
 * its a spinning RIT cube and te code is a lot for it 
 * what should we know if we dont have to know how the code works**
 * 
 * so main makes the canvas and the shaded areas as the cube rotates as well as the texture on the cube as it rotates (more shiny)**
 * and keeps doing that per frame, init-buffer actually makes the cube (and rotates it??)**, and draw-scene draws everything on
 * the canvas??** (what is the difference between all these files because they are all similar)**
 * where do we do rotaton and how does it get used in the other files to apply the right operations based on rotation**
 * 
 * we get the webgl context and we alert if nothing was nintialzied and we clear the background
 * then it gets more complicated then we write a shader program to deal with the vectors as well as a fragment shader
 * and we initialize those things and set those up in a program and load the texture and have rendering and have request animation frame
 * to render and we make our rotation based on delta time and not by frames for render then we draw the scene 
 * 
 * the init buffers file gives us our buffers and our position are where are the vertciies in 3D space and where do we map
 * pixels for the position and normal postion is for lighting and based on where the light is how bright or dim should we 
 * color the pixel and for indicies we say what vertex are
 * 
 * we load up arrays with numbers in it to load up the different faces and we send the data to the so it knows what to do with them
 * 
 * in draw scene it happens every frame and we clear it out and we set falgs for handling depth and we clear the screen and set up
 * the camera and move and rotate things aronund and pull in things from the buffers
 * 
 * we should always npm install when we switch branches then we wont get error when we switch rbanches
 * the result is very similar but the shade gets dark dramatically for hald a second 
 * 
 * 
 * 
 * SECOND BRANCH:
 * 
 * three.js exists and the next demo follows three.js and uses the npm paackage3** and if we have @types it means we are using
 * type libraries which give us typescript for libararies that dont use it on their own (usually somewhat out of date rather than
 * the JS version of libraries)**
 * 
 * we do import * as three from three to use the three.js library which gives us access to everying in thus library with a
 * single import statement** (slide 5)**
 * and we remove the rest of the files we are working with and we dont need a buffer, draw scene, or shaders for three.js and 
 * babylon.js because its already built in for us to use the methods in those files??**
 * 
 * we get canvas from renderer and we dont have one in the HTML and it gets created in JS when we render it and we use
 * the colorspace to have depth for colors otherwise it would look washed out so we have to say what color space the original
 * image is**
 * 
 * we use the map: texture and the color as its baseline to
 * 
 * the mesh is a combination of the geometry and material so it can be rendered together and we have a point light for directional light
 * we tell the renderer to render at the scene and camera and it knows which canvas to use because we got the canvas from our JS
 * 
 * babylon.js BRANCH 3:
 * 
 * THERE IS A DEFAULT COLOR FOR THE BACKGROUND AND THE CUBE IS MORE SHINIER as we rotate by default for babylon.js**
 * we get more camera controls and we can move around to see parts of the cube with our (mouse or keys)**
 * 
 * code is similar to branch 2 in terms of**
 * 
 * when we do imports we have to know what directy looks like to use these things in babylon or we could import everything
 * from babylon and use things we need** (does it affect anything in our program if we import everything or import specific things)**
 * 
 * we set in canvas from HTML then pass it into JS then pass it into the engine and the attach control gets the mouse and camera input
 * on the camera and we set up light with hemouspheric light for babylon and we have light intensity and we load the texture for
 * the tiger face and we set the box and load the material and we give the engine a callback to do the rotation and the scene will do it per
 * frame**
 * 
 * babylon.js has examples as well as three.js and it focusses more on rendering and aspect of things compared to three.js
 * babylon.js playground and we can have rendered output and code and we can mess with code and see the output without
 * having an editor opened up**
 * 
 * babylon is more clunkier than three.js and it works differently than webGL than three.js does (works more closer with webGL)**
 * 
 * go over slide 6**
 * 
 * babylon.js and three.js are still part of webgl but they are in 3D whereas pixi.js and phaser are also in webgl but they are in 2D**
 * 
 * 
 * REDGL2:
 * 
 * no information on npm install and we just load the script form GitHub and the last commit was 7 months ago and some of the
 * files have not been changed since 2 years ago (not as maintined than other libraries)**
 * 
 * webGL is not just used for 3D rendering and there a couple 2D libraries such as pixi.js and phaser which are two 2D libraries
 * pixi.js has a lot of different features and has good documentation and has lots of examples on how to work with things 
 * 
 * phaser is a game framework and it works with games in the DOM and pixi is graphics rendering and phaser is more game specific**
 * 
 * three.js, babylon.js, and REDGL2 are 3D rendering in WebGL (phaser and pixi.js are 2D and in WebGL)**
 * 
 * what is the checklist on slide 7 used for is it used to see if its reliable to use or**
 * 
 * 
 * 
 * 
 */