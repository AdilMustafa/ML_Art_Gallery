/*
ML Final Project
*/

let mgr, font;

//used to change letters for the decipher game
let _1,_2,_3,_4,_5,_6,_7,_8,_9,_10_11,_12,_13,_14,_15,_16,_17,_18,_19,_20,_21,_22,_23,_24,_25,_26;
let _a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k,_l,_m,_n,_o,_p,_q,_r,_s,_t,_u,_v,_w,_x2,_y2,_z;

//game variables
let sceneNum, //scene number 
  positionX, //pointer X position
  positionY, //pointer Y position 
  speed, //speed of the pointer
  inspectNum, //used to inspect different paintings 
  pointerCol, //changes the pointer colour
  temp, //normaises mouseX and links it to temp
  applyTemp, //applies temp
  start_pause, //starts / pauses
  modelNum, //selects a random model 
  decipherSlider, //allows user to select the quantity of letters they will need to dechipher
  decipherNum, //number used for the decipher slider
  originalText, //the original generated text 
  encryptedText, //the text that is encrypted
  answerReveal, //reveals the answer
  alphabetString = "", //used to store the alphabet 
  moveLeft = false, // moves the pointer to the left 
  moveRight = false, //moves pointer to the right 
  moveUp = false, //moves the screen up
  moveDown = false, //moves the screen down
  answer = false, //reveals the answer
  s4_pt2 = false, //scene 4 part 2
  play = false; //when true the user can play the game

//charRNN variables
let charRNN,
  generating = false,
  generated_text = "",
  input,
  input2,
  input2_2,
  inputValue,
  inputValue2,
  inputValue2_2, 
  cantUnderstand = false;

//stores the name of the models
let modelName = [
  "Bolano",
  "MyEssays",
  "Darwin",
  "Dubois",
  "Shakespeare",
  "MyIntroductions"
],
  //an array that changes the text of the generated text    
  dechipherArray = [
  "|", "!", "||", "#", "~", "$", "`", "¬",
  "%", "^", "1", "&", "4", "*", "2", "(",
  "7", "5", ")", "-", "_", "+", "=", "@", 
  "<", ">"   
],
  //an array that stores the alphabet
  alphabet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", 
  "j", "k", "l", "m", "n", "o", "p", "q", "r",
  "s", "t", "u", "v", "w", "x", "y", "z"
],    
  originalTextArray = [], //stores the original text
  originalTextArraySplit = []; //splits the original text into individual letters




//sound classification variables for the decipher mini-game
let classifier_Decipher,
    label_Decipher = 'listening...',
    
    //v1
    //soundModel_Decipher = 'https://teachablemachine.withgoogle.com/models/Mh7D4h4MU/',
    
    //v2
    //soundModel_Decipher = 'https://teachablemachine.withgoogle.com/models/ONXeGukLv/',
    
    //v3
    soundModel_Decipher = 'https://teachablemachine.withgoogle.com/models/7F9nu3XTL/',
    options = { probabilityThreshold: 0.6 };

let xpos, 
    ypos,
    increment;

//ml hangman variables
let speech, //used to what the user is saying
    video, //used to store the users webcam 
    poseNet, //poseNet related variable
    pose, //poseNet related variable
    skeleton, //poseNet related variable
    brain, //poseNet related variable
    poseLabel,//poseNet related variable
    testKey, //used for testing purposes
    selectedLetter, //stores selected letter
    health, //players health
    label_hangman = 'listening...', //sound classification variable
    classifier_hangman,//sound classification variable
    soundModel_hangman = 'https://teachablemachine.withgoogle.com/models/XyuZLfoEW/', //sound classification variable
    hints = false, //enables hints
    gameOver = false, //game over screen 
    description = false, //text to speech reads out the word's description
  //stores the words
  words = [
    "EUCHROMATIN",
    "ANDROECIUM",
    "FULMINATED",
    "LUNCHTIME",
    "MERCIFUL",
    "MULCHED",
    "PENTACHORD",
    "RHEUMATOID",
    "RUDIMENTAL",
    "CLAP",
  ],
    
  
  //stores the definitions
  definitions = [
    "chromosome material which does not stain strongly except during cell division. It represents the major genes and is involved in transcription",
    "the stamens of a flower collectively",
    "explode violently or flash like lightning",
    "name of a time of day when people eat",
    "showing or exercising mercy",
    "treat or cover with mulch",
    "a musical instrument with five strings",
    "relating to, affected by, or resembling rheumatism",
    "involving or limited to basic principles",
    "strike the palms of (one's hands) together repeatedly, typically in order to applaud someone or something",
  ];

//ML criminal case variables
let faceapi, //faceapi variable
  detections, //stores detections
  suspectNum, //selects a suspect 
  suspectChosen, //stores the suspect the user has chosen 
  suspectInfo, //allows user to view the suspects information 
  suspectScan, //allows user to scan the suspect 
  beginScanNum, //scan number
  scanUses, //stores the amount of times the user has scanned 
  
  //stores the coordinates the user has saved
  savedCoordinates = 
    [
        ["",""],
        ["",""],
        ["",""]      
    ],
  savedCoordinatesNum, //stores the amount of times the user has saved the coodinates
  beginScan = false, //when true detections will be drawn on screen 
  choiceNum, //stores users choice
  person_selected; //stores which person is used for the detector

// these are our options for detecting faces, provided by ml5.js
const detection_options = {
  withLandmarks: true,
  withDescriptors: false,
};


function preload() {
  font = loadFont("assets/font/PressStart2P-Regular.ttf"); 
  backgroundImg = loadImage("assets/images/gallery/background2.png");
  arrowL = loadImage("assets/images/gallery/arrowL.png");
  arrowL2 = loadImage("assets/images/gallery/arrowL2.png");  
  arrowR = loadImage("assets/images/gallery/arrowR.png"); 
  arrowR2 = loadImage("assets/images/gallery/arrowR2.png");
  _floor = loadImage("assets/images/gallery/floor.png");
  light1 = loadImage("assets/images/gallery/light1.png");
  light2 = loadImage("assets/images/gallery/light2.png");
  light3 = loadImage("assets/images/gallery/light3.png");
  painting = loadImage("assets/images/gallery/painting.png");
  inspectPainting = loadImage("assets/images/gallery/inspectPainting.png");
  topP = loadImage("assets/images/gallery/top.png");    
  bottomP = loadImage("assets/images/gallery/bottom.png");    
  
  a_ = loadImage("assets/images/ml_hangman/a.jpg");
  c_ = loadImage("assets/images/ml_hangman/c.jpg");
  d_ = loadImage("assets/images/ml_hangman/d.jpg");
  e_ = loadImage("assets/images/ml_hangman/e.jpg");
  f_ = loadImage("assets/images/ml_hangman/f.jpg");
  h_ = loadImage("assets/images/ml_hangman/h.jpg");
  i_ = loadImage("assets/images/ml_hangman/i.jpg");
  l_ = loadImage("assets/images/ml_hangman/l.jpg");
  m_ = loadImage("assets/images/ml_hangman/m.jpg");
  n_ = loadImage("assets/images/ml_hangman/n.jpg");
  o_ = loadImage("assets/images/ml_hangman/o.jpg");
  p_ = loadImage("assets/images/ml_hangman/p.jpg");
  r_ = loadImage("assets/images/ml_hangman/r.jpg");
  t_ = loadImage("assets/images/ml_hangman/t.jpg");
  u_ = loadImage("assets/images/ml_hangman/u.jpg");
    
  p1 = loadImage("assets/images/ml_murdercase/1.png");    
  p2 = loadImage("assets/images/ml_murdercase/2.png");    
  p3 = loadImage("assets/images/ml_murdercase/3.png");    
  p4 = loadImage("assets/images/ml_murdercase/4.png");    
  p5 = loadImage("assets/images/ml_murdercase/5.png");    
  p6 = loadImage("assets/images/ml_murdercase/6.png");    
  p7 = loadImage("assets/images/ml_murdercase/7.png");    
  p8 = loadImage("assets/images/ml_murdercase/8.png");    
  p9 = loadImage("assets/images/ml_murdercase/9.png");    
  p10 = loadImage("assets/images/ml_murdercase/10.png");    
    
  ml_cc_map = loadImage("assets/images/ml_murdercase/map.png"); 
    
  // Load the model
  classifier_Decipher = ml5.soundClassifier(soundModel_Decipher + 'model.json', options);  
  classifier_hangman = ml5.soundClassifier(soundModel_hangman + 'model.json');

}

function setup() {
  textFont(font); //applies font to text
  mgr = new SceneManager();
  mgr.addScene(SceneOne);
  mgr.addScene(SceneTwo);
  mgr.addScene(SceneThree);
  mgr.addScene(SceneFour);
  mgr.addScene(SceneFour2);
  mgr.addScene(SceneFour3);
  mgr.addScene(SceneFive);
  mgr.addScene(SceneSix);
  mgr.addScene(SceneSix2);
  mgr.addScene(SceneSix3);
  mgr.showNextScene();
}

function draw() {
  mgr.draw();
}

//start screen
function SceneOne() {
  this.setup = function () {
    cc = createCanvas(500, 500);
    sceneNum = 1;
  };

  this.draw = function () {
    background(0);
    push()
    
    //UI  
    fill(255);
    textAlign(CENTER);
    textSize(30);
    text("ML Final Projet", width/2, 50);
    rect(50, height - 100, width - 100, 85);
    fill(0);
    text("Begin", width / 2, height - 40);
    fill(255);  
    textSize(16);
    text("May take some time to load", width/2, 90);
    pop()
    
    //checks if the mouse is over the start button
    let x = 50,
      y = height - 100,
      btn_Width = width - 100,
      btnHeight = 85;
    if (
      mouseX >= x &&
      mouseX <= x + btn_Width &&
      mouseY >= y &&
      mouseY <= y + btnHeight
    ) {
      push(); 
      
      //draws a red border around the button
      stroke(255, 0, 0);
      strokeWeight(5);
      fill(255, 0);
      rect(x, y, btn_Width, btnHeight);
      cursor(HAND);
      pop();
      play = true;
    } else {
      cursor(ARROW);
      play = false;
    }
  };
}

//art gallery
function SceneTwo() {
  this.setup = function () {
    createCanvas(800, 594);
    pointer = width/2;
    lightNum = 0;
    positionX = 0;
    speed = 10;
    inspectNum = 0;
    pointerCol = 0;
  };

  this.draw = function () {
    background(0);
    cursor(ARROW);
    sceneNum = 2;
    
    //provides the background
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    image(_floor,0,height - 66);
    image(_floor,width/2 + 20,height - 66);
    
    //onscreen pointer
    fill(pointerCol);  
    triangle(pointer - 30, 528, pointer, 498, pointer + 30, 528);
    
    onscreenText(positionX);
    arrows();
    
    //allows the user to move left/right 
    translate(positionX,0);
    if(moveLeft) positionX += speed;  
    else if(moveRight) positionX -= speed;  
    
    //makes sure the user doesnt go far away from the content
    if(positionX > 1600) positionX = 1600;
    else if(positionX < -1600) positionX = -1600;
    
    //places the light assets  
    lightAsset(0);
    lightAsset(width-95);
      
    //places the paintings  
    paintingAsset(width/2);
      
    lightAsset(-300);
    lightAsset(-980);
    paintingAsset(-610);
    
    lightAsset(width + 300);
    lightAsset(width + 980);
    paintingAsset(width + 680);
    
    //text onfront of the paintings
    text("ML Text Decipher",width/2 - 90,height/2);
    text("ML Hang-Man",-675,height/2);
    text("ML Crime Case",width + 610,height/2);
  };
}

//controls
function SceneThree() {
    this.setup = function () {
        createCanvas(800, 594);
    }
    
    this.draw = function () {
        background(0);
        sceneNum = 3;
    
        push()
        image(backgroundImg,0,0);
        image(backgroundImg,500,0);
        
        //onscreen text explaining the controls
        fill(255);
        stroke(0);
        strokeWeight(3)
        rect(50,50, width - 100, height - 100);
        noStroke();
        fill(0);
        textAlign(CENTER);
        textSize(32);
        text("CONTROLS", width/2, 100);
        textAlign(LEFT);
        textSize(12);
        text("Press A or LEFT ARROW to move left", 70, 170);
        text("Press D or RIGHT ARROW to move right", 70, 200);
        text("Press ENTER to inspect a painting", 70, 230);
        text("Press ESC to exit a painting / controls screen", 70, 260);       
        pop();
    } 
}

//inspect painting 1
function SceneFour() {
  this.setup = function () {
    createCanvas(800, 594);
    positionY = 0;
    input = createInput();
    modelNum = int(random(0, 6));
    decipherSlider = createSlider(1,26,13);
    decipherSlider.position(470, 135);   
  };

  this.draw = function () {
    background(0);
    sceneNum = 4;
    
    //input box and slider
    input.position(450,162);
    inputValue = input.value();
    input.show();
    decipherSlider.show();
    push();
    imageMode(CORNER);
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    
    imageMode(CENTER);
    image(inspectPainting,width/2,height/2, 875,800);
    
    //links decipherNum to the slider value
    decipherNum = decipherSlider.value(); 
      
    push();
    
    //onscreen text   
    fill(0);
    rect(125,100,width - 250, height - 200);
    fill(255);
    text("Model:" + modelName[modelNum], 130, 120);
    text("Amount of encrypted letters:", 130, 150, 500);
    text(decipherNum, 610, 150, 500);
    text("Input a theme or sentance:", 130, 180);
    text("User Input: " + inputValue, 130, 210, 500);
    
    //button variables  
    let x = width/2 - 75,
    y = height - 160,
    btn_Width = 150,
    btnHeight = 40;
    rect(x, y, btn_Width, btnHeight);
    fill(0);
    text("Begin", x + 45, y + 27);
    
    //checks if the mouse is over the start button
    if (
      mouseX >= x &&
      mouseX <= x + btn_Width &&
      mouseY >= y &&
      mouseY <= y + btnHeight
    ) {
      push(); 
      //draws a red border around the button
      stroke(255, 0, 0);
      strokeWeight(5);
      fill(255, 0);
      rect(x, y, btn_Width, btnHeight);
      cursor(HAND);
      pop();
      s4_pt2 = true;
    } else {
      cursor(ARROW);
      s4_pt2 = false;
    }
    
    //makes sure the content doesnt overlap the painting
    pop();
    image(topP, width/2,0,875);
    image(bottomP, width/2+.8,height-1,875);
    pop();
  };
}

//inspect painting 1
function SceneFour2() {
  this.setup = function () {
    createCanvas(800, 594);
    cursor(ARROW);
      
    if (modelNum == 0) charRNN = ml5.charRNN("./models/generative_text/bolano/", modelReady); //uses bolano
    else if (modelNum == 1) charRNN = ml5.charRNN("./models/generative_text/MyEssays/", modelReady); //uses charlotte bronte
    else if (modelNum == 2) charRNN = ml5.charRNN("./models/generative_text/darwin/", modelReady); //uses darwin
    else if (modelNum == 3) charRNN = ml5.charRNN("./models/generative_text/dubois/", modelReady); //uses dubois
    else if (modelNum == 4) charRNN = ml5.charRNN("./models/generative_text/shakespeare/", modelReady); //uses shakespeare
    else if (modelNum == 5) charRNN = ml5.charRNN("./models/generative_text/MyIntroductions/", modelReady); //uses woolf
    
    applyTemp = 0.5; //default value for the applied temperature
    start_pause = -1; //begins when the user clicks the start button
   
  };

  this.draw = function () {
    background(0);
    sceneNum = 4.1;
    input.hide();
    decipherSlider.hide();
    if (start_pause == 0) generate();
    if (start_pause == 1) generating = false;
      
    push();
    imageMode(CORNER);
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    
    imageMode(CENTER);
    image(inspectPainting,width/2,height/2, 875,800);
    start_pause = start_pause % 2; //switched between start and pause
    temp = norm(mouseX, 0, width); //normalises mouseX
    if (temp > 1) temp = 1; //temp = 1 when mouse is over the right of the canvas
    if (temp < 0) temp = 0; //temp = 0 when mouse is over the left of the canvas
    
    push();
    fill(0);
    rect(125,100,width - 250, height - 200);
    fill(255);
    textSize(10);
    
    //onscreen text   
    text("Seed Text: " + inputValue, 130, 110, width, height);
    text("Temperature: " + temp, 130, 140, width, height);
    text("Temperature Selected: " + applyTemp, 370, 140, width, height);  
    text("Press T to apply Temperature", 130, 180, 500)
    text("Press R to restart the generated text", 130, 210, 500)
    text("Press S to generate a single character", 130, 240, 500)
    if (start_pause == -1) text("Press SPACE to generate text",130, 270, 500)
    else if(start_pause == 0) text("Generating Text (press SPACE to stop)...", 130, 270, 500)
    else if(start_pause == 1) text("Press 1 to continue...", 130, 270, 500)
    text("Model:" + modelName[modelNum], 130, 300) 
    
    //makes sure the content doesnt overlap the painting
    pop();
    image(topP, width/2,0,875);
    image(bottomP, width/2+.8,height-1,875);
    pop();
  };
}


//inspect painting 1
function SceneFour3() {
  this.setup = function () {
    createCanvas(800, 594);
    input2 = createInput();
    input2_2 = createInput();
    positionY = 0;
    cursor(ARROW);
    originalTextArraySplit = split(originalTextArray[0],"");
    xpos = 130; 
    ypos = 420;
    increment = 60; 
    increment2 = 30; 
    increment3 = 90;
      
    //shffles the array so its randomised every time  
    shuffle(dechipherArray,true);
      
       //this loop converts each letter from the original text into one from the decipherArray
       for(let i=0; i < originalTextArraySplit.length; i++) {
        if(originalTextArraySplit[i] == "a" && decipherNum >=1) { 
            originalTextArraySplit[i] = dechipherArray[0];
            _a = dechipherArray[0];
        }
        
        else if(originalTextArraySplit[i] == "b" && decipherNum >=2) { 
            originalTextArraySplit[i] = dechipherArray[1];
            _b = dechipherArray[1];
        }
        else if(originalTextArraySplit[i] == "c" && decipherNum >=3) { 
            originalTextArraySplit[i] = dechipherArray[2];
            _c = dechipherArray[2];
        }
        else if(originalTextArraySplit[i] == "d" && decipherNum >=4) { 
            originalTextArraySplit[i] = dechipherArray[3];
            _d = dechipherArray[3];
        }
        else if(originalTextArraySplit[i] == "e" && decipherNum >=5) { 
            originalTextArraySplit[i] = dechipherArray[4];
            _e = dechipherArray[4];
        }
        else if(originalTextArraySplit[i] == "f" && decipherNum >=6) { 
            originalTextArraySplit[i] = dechipherArray[5];
            _f = dechipherArray[5];
        }
        else if(originalTextArraySplit[i] == "g" && decipherNum >=7) { 
            originalTextArraySplit[i] = dechipherArray[6];
            _g = dechipherArray[6];
        }
        else if(originalTextArraySplit[i] == "h" && decipherNum >=8) { 
            originalTextArraySplit[i] = dechipherArray[7];
            _h = dechipherArray[7];
        }
        else if(originalTextArraySplit[i] == "i" && decipherNum >=9) { 
            originalTextArraySplit[i] = dechipherArray[8];
            _i = dechipherArray[8];
        }
        else if(originalTextArraySplit[i] == "j" && decipherNum >=10) { 
            originalTextArraySplit[i] = dechipherArray[9];
            _j = dechipherArray[9];
        }
        else if(originalTextArraySplit[i] == "k" && decipherNum >=11) { 
            originalTextArraySplit[i] = dechipherArray[10];
            _k = dechipherArray[10];
        }
        else if(originalTextArraySplit[i] == "l" && decipherNum >=12) { 
            originalTextArraySplit[i] = dechipherArray[11];
            _l = dechipherArray[11];
        }
        else if(originalTextArraySplit[i] == "m" && decipherNum >=13) { 
            originalTextArraySplit[i] = dechipherArray[12];
            _m = dechipherArray[12];
        }
        else if(originalTextArraySplit[i] == "n" && decipherNum >=14) { 
            originalTextArraySplit[i] = dechipherArray[13];
            _n = dechipherArray[13];
        }
        else if(originalTextArraySplit[i] == "o" && decipherNum >=15) { 
            originalTextArraySplit[i] = dechipherArray[14];
            _o = dechipherArray[14];
        }
        else if(originalTextArraySplit[i] == "p" && decipherNum >=16) { 
            originalTextArraySplit[i] = dechipherArray[15];
            _p = dechipherArray[15];
        }
        else if(originalTextArraySplit[i] == "q" && decipherNum >=17) { 
            originalTextArraySplit[i] = dechipherArray[16];
            _q = dechipherArray[16];
        }
        else if(originalTextArraySplit[i] == "r" && decipherNum >=18) { 
            originalTextArraySplit[i] = dechipherArray[17];
            _r = dechipherArray[17];
        }
        else if(originalTextArraySplit[i] == "s" && decipherNum >=19) { 
            originalTextArraySplit[i] = dechipherArray[18];
            _s = dechipherArray[18];
        }
        else if(originalTextArraySplit[i] == "t" && decipherNum >=20) { 
            originalTextArraySplit[i] = dechipherArray[19];
            _t = dechipherArray[19];
        }
        else if(originalTextArraySplit[i] == "u" && decipherNum >=21) { 
            originalTextArraySplit[i] = dechipherArray[20];
            _u = dechipherArray[20];
        }
        else if(originalTextArraySplit[i] == "v" && decipherNum >=22) { 
            originalTextArraySplit[i] = dechipherArray[21];
            _v = dechipherArray[21];
        }
        else if(originalTextArraySplit[i] == "w" && decipherNum >=23) { 
            originalTextArraySplit[i] = dechipherArray[22];
            _w = dechipherArray[22];
        }
        else if(originalTextArraySplit[i] == "x" && decipherNum >=24) { 
            originalTextArraySplit[i] = dechipherArray[23];
            _x2 = dechipherArray[23];
        }
        else if(originalTextArraySplit[i] == "y" && decipherNum >=25) { 
            originalTextArraySplit[i] = dechipherArray[24];
            _y2 = dechipherArray[24];
        }
        else if(originalTextArraySplit[i] == "z" && decipherNum >=26) { 
            originalTextArraySplit[i] = dechipherArray[25];
            _z = dechipherArray[25];
        }
    }
    
    //used to display what letters are going to be changed
    for(let i=0; i < decipherNum; i++) {
      alphabetString = alphabetString + alphabet[i];  
    }
    
    //used to store what the user inputs for each letter  
    _1 = "_", _2 = "_", _3 = "_", _4 = "_", _5 = "_", _6 = "_", _7 = "_", _8 = "_";
    _9 = "_", _10 = "_", _11 = "_", _12 = "_", _13 = "_", _14 = "_", _15 = "_", _16 = "_";
    _17 = "_", _18 = "_", _19 = "_", _20 = "_", _21 = "_", _22 = "_", _23 = "_", _24 = "_";
    _25 = "_", _26 = "_";
  
    // Start classifying
    // The sound model will continuously listen to the microphone
    classifier_Decipher.classify(gotResultD);    
  };

  this.draw = function () {
    background(0);
    sceneNum = 4.2;
    input.hide();
    decipherSlider.hide();
    
    push();
    imageMode(CORNER);
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    
    imageMode(CENTER);
    image(inspectPainting,width/2,height/2, 875,800);
    
    
      
    //onscreen text when the user hasnt submited their answer
    if(!answer) {  
        input2.position(300,105);
        input2.size(30);
        inputValue2 = input2.value();
        input2.show();
        
        input2_2.position(435,135);
        input2_2.size(30);
        inputValue2_2 = input2_2.value();
        fill(0);
        rect(125,100,width - 250, height - 280);
        fill(255);
        textSize(10);
        text("Character Num:" + inputValue2, 130,120);
        if(!cantUnderstand)
        {
            input2_2.hide();
            text("Selected Letter (Press SHIFT to submit):" + label_Decipher, 130,150);
            text("If the sound model doesnt understand what your saying Press the + key", 130,180, 550);
            text("Press ENTER to submit answers", 130, 222, 500);
            text(originalTextArraySplit, 130, 252, 500);
        }
        
        if(cantUnderstand)
        {
            input2_2.show();
            text("type your selected letter here", 130,150, 550);
            text("Press shift to submit your letter", 130,180, 550);
            text("Press ENTER to submit answers", 130, 210, 500);
            text(originalTextArraySplit, 130, 240, 500);
        }
        
         fill(10);
        rect(125,400,width - 250, 100);
    }
    
    //onscreen text when the user has submited their answer  
    if(answer) {
          
        input2_2.hide();   
        fill(0);
        rect(125,100,width - 250, height - 200);
        fill(255);
        textSize(10);
        text("Character Num:" + inputValue2, 130,120);
        text("Press 1 to view the original text", 130,150);
        text("Press 2 to view the encrypted text", 130,180);
        text("Press 3 to view the answer", 130,210);
        
        //if they press 1 this will display 
        if(answerReveal == 1) {
            fill(0);
            rect(130,230,510, height - 400);
            fill(255);
            text(originalTextArray, 130, 240, 500);
        }
        
        //if they press 2 this will display 
        if(answerReveal == 2) {
            fill(0);
            rect(130,230,510, height - 400);
            fill(255);
            text(originalTextArraySplit, 130, 240, 500);
        }

        //if they press 3 this will display 
        if(answerReveal == 3){
            fill(255);           
            //loops through the alphabet and places them onscreen 
            for(let i = 0; i < decipherNum; i++) {
              if(i <= 7) text(alphabet[i] + "= " + dechipherArray[i], 130 + (i * 60), 240);
              if(i > 7 && i <=14) text(alphabet[i] + "= " + dechipherArray[i], -351 + (i * 60), 270);
              if(i > 14 && i <=21) text(alphabet[i] + "= " + dechipherArray[i], -770 + (i * 60), 300);
              if(i > 21 && i <=26) text(alphabet[i] + "= " + dechipherArray[i], -1191 + (i * 60), 330);
            }
        }
        
        userAns();
    }  
      
     
   
    fill(255);
      
    //the statments are used to display the on screen text that stores the users input for each letter  
    if(decipherNum >=1) {
        text(dechipherArray[0]+ "=",xpos, ypos);
        if(inputValue2 == "1") text(_1,xpos + increment2, ypos);
    }
      
    if(decipherNum >=2) { 
        text(dechipherArray[1]+ "=",xpos + increment, ypos);
        if(inputValue2 == "2") text(_2,xpos + increment3, ypos);
    }
      
    if(decipherNum >=3) { 
        text(dechipherArray[2]+ "=",xpos + increment * 2, ypos);
        if(inputValue2 == "3") text(_3, xpos + increment * 2 + increment2, ypos);
    }
    if(decipherNum >=4) {
        text(dechipherArray[3]+ "=",xpos + increment * 3, ypos);
        if(inputValue2 == "4") text(_4,xpos + increment * 3 + increment2, ypos);
    }
    if(decipherNum >=5) {
        text(dechipherArray[4]+ "=",xpos + increment * 4, ypos);
        if(inputValue2 == "5") text(_5,xpos + increment * 4 + increment2, ypos);
    }
    if(decipherNum >=6) {
        text(dechipherArray[5]+ "=",xpos + increment * 5, ypos); 
        if(inputValue2 == "6") text(_6,xpos + increment * 5 + increment2, ypos);
    }
    if(decipherNum >=7) {
        text(dechipherArray[6]+ "=",xpos + increment * 6, ypos); 
        if(inputValue2 == "7") text(_7,xpos + increment * 6 + increment2, ypos); 
    }
    if(decipherNum >=8) {
        text(dechipherArray[7]+ "=",xpos + increment * 7, ypos); 
        if(inputValue2 == "8") text(_8,xpos + increment * 7 + increment2, ypos); 
    }
    if(decipherNum >=9) {
        text(dechipherArray[8]+ "=",xpos + increment * 8, ypos); 
        if(inputValue2 == "9") text(_9,xpos + increment * 8 + increment2, ypos);
    }
    if(decipherNum >=10) {
        text(dechipherArray[9]+ "=",xpos, ypos + increment2); 
        if(inputValue2 == "10") text(_10,xpos + increment2, ypos + increment2);
    }
    if(decipherNum >=11) {
        text(dechipherArray[10]+ "=",xpos + increment, ypos + increment2); 
        if(inputValue2 == "11") text(_11,xpos + increment3, ypos + increment2);
    }
    if(decipherNum >=12) {
        text(dechipherArray[11]+ "=",xpos + increment * 2, ypos + increment2); 
        if(inputValue2 == "12") text(_12,xpos + increment * 2 + increment2, ypos + increment2);
    }
    if(decipherNum >=13) {
        text(dechipherArray[12]+ "=",xpos + increment * 3, ypos + increment2); 
        if(inputValue2 == "13") text(_13,xpos + increment * 3 + increment2, ypos + increment2);
    }
    if(decipherNum >=14) {
        text(dechipherArray[13]+ "=",xpos + increment * 4, ypos + increment2); 
        if(inputValue2 == "14") text(_14,xpos + increment * 4 + increment2, ypos + increment2);
    }
    if(decipherNum >=15) {
        text(dechipherArray[14]+ "=",xpos + increment * 5, ypos + increment2);
        if(inputValue2 == "15") text(_15,xpos + increment * 5 + increment2, ypos + increment2)
    }
    if(decipherNum >=16) { 
        text(dechipherArray[15]+ "=",xpos + increment * 6, ypos + increment2); 
        if(inputValue2 == "16") text(_16,xpos + increment * 6 + increment2, ypos + increment2);
    }
    if(decipherNum >=17) {
        text(dechipherArray[16]+ "=",xpos + increment * 7, ypos + increment2); 
        if(inputValue2 == "17") text(_17,xpos + increment * 7 + increment2, ypos + increment2);
    }
    if(decipherNum >=18) {
        text(dechipherArray[17]+ "=",xpos + increment * 8, ypos + increment2); 
        if(inputValue2 == "18") text(_18,xpos + increment * 8 + increment2, ypos + increment2);
    }
    if(decipherNum >=19) {
        text(dechipherArray[18]+ "=",xpos, ypos + increment); 
        if(inputValue2 == "19") text(_19,xpos + increment2, ypos + increment);
    }
    if(decipherNum >=20) {
        text(dechipherArray[19]+ "=",xpos + increment, ypos + increment); 
        if(inputValue2 == "20") text(_20,xpos + increment3, ypos + increment); 
    }
    if(decipherNum >=21) {
        text(dechipherArray[20]+ "=",xpos + increment * 2, ypos + increment); 
        if(inputValue2 == "21") text(_21,xpos + increment * 2 + increment2, ypos + increment);
    }
    if(decipherNum >=22) {
        text(dechipherArray[21]+ "=",xpos + increment * 3, ypos + increment); 
        if(inputValue2 == "22") text(_22,xpos + increment * 3 + increment2, ypos + increment);
    }
    if(decipherNum >=23) {
        text(dechipherArray[22]+ "=",xpos + increment * 4, ypos + increment); 
        if(inputValue2 == "23") text(_23,xpos + increment * 4 + increment2, ypos + increment); 
    }
    if(decipherNum >=24) {
        text(dechipherArray[23]+ "=",xpos + increment * 5, ypos + increment); 
        if(inputValue2 == "24") text(_24,xpos + increment * 5 + increment2, ypos + increment); 
    }
    if(decipherNum >=25) { 
        text(dechipherArray[24]+ "=",xpos + increment * 6, ypos + increment);
        if(inputValue2 == "25") text(_25,xpos + increment * 6 + increment2, ypos + increment);
    }
    if(decipherNum >=26) { 
        text(dechipherArray[25]+ "=",xpos + increment * 7, ypos + increment); 
        if(inputValue2 == "26") text(_26,xpos + increment * 7 + increment2, ypos + increment);
    }
      
    //makes sure the content doesnt overlap the painting frame
    fill(0);
    image(topP, width/2,0,875);
    image(bottomP, width/2+.8,height-1,875);
    pop();
  };
}



//inspect painting 2
function SceneFive() {
  this.setup = function () {
    createCanvas(800, 594);
    positionY = 0;
    
      //enables text to speech
//    is commented out because it occasionally causes errors
//    speech = new p5.Speech();
//    speech.started();
//    speech.setVoice("SpeechSynthesisVoice");

    video = createCapture(VIDEO, cameraLoaded);
    video.size(640, 480);
    video.hide(); // hide DOM element

    //makes sure the number is less than 10 and more than or equal to 0
    randomNum = int(random(0, 10));
    hiddenWordNum = words[randomNum].length;
    hiddenWord = [];
    selectedWord = words[randomNum].split("");
    
    //pushes _ into the hidden word to display the amount of characters it has
    for(let i = 0; i < hiddenWordNum; i++) {
        hiddenWord.push("_")
    }
       
    classifier_hangman.classify(gotResultH);
    classifier_Decipher.classify(gotResultD);
    health = 300;
    descriptionNum = 0;
  };

  this.draw = function () {
    background(0);
    sceneNum = 5;
    testKey = key;
    push();
    imageMode(CORNER);
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    imageMode(CENTER);
    image(inspectPainting,width/2,height/2, 875,800);
    
    //if the user says insert  or clap the selectedletter will equal the poseLabel
    if(label_hangman == "Insert" || label_hangman == "Clap" ) selectedLetter = poseLabel;  
    
    push();
    translate(0,positionY);
    if(moveUp) positionY += 10;
    else if (moveDown) positionY -=10;
    
    if (positionY > 0) positionY = 0;
    if (positionY < -1400) positionY = -1400;
    fill(255);
    rect(125,100,width - 250, height*3);
    
    //onscreen text   
    textSize(32);  
    fill(0);
    textAlign(CENTER)  
    text("ML Hang-Man", width/2, 150);
    text("___________", width/2, 165);
    textSize(16) 
    text("(Scroll Down)", width/2, 200);
    textSize(32)  
    text("_______________", width/2, 400);  
    text("_______________", width/2, 990);  
    text("Instructions", width/2, 465);
    textAlign(LEFT);   
    textSize(11); 
    text("You will have to spell a random word ", 150, 520, 550);
    text("Your health will constantly drop ", 150, 545, 550);
    text("You will use your body pose to spell out the words ", 150, 570, 550);
    text("To insert a letter you can Clap or say Insert ", 150, 610, 550);
//    text("To hear the definition of the word simply CLAP", 150, 750, 550);
    text("To enable hints press H ", 150, 640, 550);
    text("If hints are enabled say the letter you want to know the body pose of", 150, 665, 550);
    text("Press 2 to disable hints", 150, 705, 550);
    
    //onscreen text when hints are enabled
    if(hints) {
        push();
        translate(0,1500);
        requesting();
        pop();
        text("Press 2 to disable hints", 150, 1200, 550);
        text("Say the letter you need a hint for:" + label_Decipher, 150, 1230, 550);
    }   
    
    //onscreen text when hints are disabled
    if(!hints) text("Press 1 to enable hints", 150, 1200, 550);
    text("figure out the word:" + hiddenWord, 150, 1050, 550);
    text("input:" + label_hangman, 150, 1080, 550);
    text("body pose letter:" + poseLabel, 150, 1110, 550);
    text("selected letter:" + selectedLetter, 150, 1140, 550);
    text("health:", 150, 1170, 550);
    textSize(32) 
    text(poseLabel, width/2, 1300, 550);
    textSize(11) 
    rect(240,1155, health, 12);
      
    
      
    for(let i = 0; i < hiddenWordNum; i++){
        //if the user inputs a correct letter it will be displayed onscreen in its correct position
        if(selectedLetter == selectedWord[i]) {
            hiddenWord[i] = selectedLetter;
        }
        
        //the health drops overtime
        if(selectedLetter != selectedWord[i]) {
            health-= 0.0025;
        }
    }
    
    //if the health is less than 0 the game over screen will be displayed  
    if(health < 0) gameOver = true;
    
    //this is the game over screen
    if(gameOver) {
        fill(0);
        rect(125,100,width - 250, height*3);
        positionY = 0;
        textAlign(CENTER);
        textSize(32);
        fill(255);
        text("GAME OVER", width/2, 180);
        textSize(12);
        text("Your Input: " + hiddenWord, width/2, 250);
        text("Word: " + words[randomNum], width/2, 280);
    }
    
    //if the user claps description = true 
    if(label_hangman == "Clap")  description = true;
    
    //if description = true descriptionNum will increase  
    if(description) descriptionNum += 1;
      
      //text to speech will say the word's description once 
//    is commented out as it occasionally causes errors      
//    if(descriptionNum == 1) {
//      speech.speak(definitions[randomNum]);
//    }
    
    //this draws the users body pose skeleton on the screen  
    push();
     translate(0,1000);
      if (pose) {
        for (let bone of skeleton) {
          let a = bone[0];
          let b = bone[1];
          strokeWeight(2);
          stroke(0);

          line(a.position.x, a.position.y, b.position.x, b.position.y);
        }

        for (let keypoint of pose.keypoints) {
          let x = keypoint.position.x;
          let y = keypoint.position.y;
          fill(0);
          stroke(255);
          ellipse(x, y, 16, 16);
        }
      }
    pop();
        
    pop(); 
    
    //prevents the content from overlapping the painting  
    fill(0);
    rect(0,0,width,90);
    rect(0,height-92,width,118);
    image(topP, width/2,0,875);
    image(bottomP, width/2+.8,height-1,875); 
    pop();
      
  };
}

//inspect painting 3
function SceneSix() {
  this.setup = function () {
    createCanvas(800, 594);
    positionY = 0;
      
    // load the faceapi model - with modelReady() callback
    faceapi = ml5.faceApi(detection_options, modelReadyM);
  
    //picks a number between and the number chosen is the person selected
    person_selected = int(random(0, 10));
    choiceNum = 0;  
    console.log("person selected:" + person_selected)  
    
    //stores the suspect descriptions  
    suspectDescriptions = [
        //suspect 1 details
        [
         "Unknown",
         "Unknown",
         "Male",
         "Unknown",
         "Murdered their 'friend'"
        ],
        
        //suspect 2 details
        [
         "Sam",
         "Unknown",
         "Unknown",
         "Unknown",
         "Stole a Car"
        ],
        
        //suspect 3 details
        [
         "Unknown",
         "Unknown",
         "Female",
         "Unknown",
         "Kidnapped 'friend's' child"
        ],
        
        //suspect 4 details
        [
         "Unknown",
         "20 - 35",
         "unknown",
         "Unknown",
         "Stabbed a teenager"
        ],
        
        //suspect 5 details
        [
         "Unknown",
         "Middle-aged",
         "Unknown",
         "Unknown",
         "Drug Kingpin"
        ],
        
        //suspect 6 details
        [
         "Unknown",
         "Unknown",
         "Female",
         "Unknown",
         "Poisoned Customers"
        ],
        
        //suspect 7 details
        [
         "Ash",
         "Unknown",
         "Unknown",
         "Unknown",
         "Set animals on fire"
        ],
        
        //suspect 8 details
        [
         "Unknown",
         "Unknown",
         "Unknown",
         "White",
         "Robbed a shop"
        ],
        
        //suspect 9 details
        [
         "Unknown",
         "Unknown",
         "Unknown",
         "Unknown",
         "Potential Serial Killer"
        ],
        
        //suspect 10 details
        [
         "Unknown",
         "27 - 39",
         "Unknown",
         "Unknown",
         "Throwing acid on strangers"
        ]
    ]  
  };

  this.draw = function () {
    background(0);
    sceneNum = 6;
    push();
    imageMode(CORNER)
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    imageMode(CENTER)
    image(inspectPainting,width/2,height/2, 875,800);
    
      
    push();
    translate(0,positionY)
    if(moveUp && detections) positionY += 10;
    else if (moveDown && detections) positionY -=10;
    fill(255)
    rect(125,100,width - 250, height*2)
    if (positionY > 0) positionY = 0;
    if (positionY < -800) positionY = -800;
    
    //onscreen text 
    textSize(32);
    fill(0);
    textAlign(CENTER)  
    text("ML Crime Case", width/2, 150);
    text("______________", width/2, 165);
    text("_______________", width/2, 400);
    text("_______________", width/2, 930);
    text("Suspect Details", width/2, 460);
    text("Instructions", width/2, 990);
    textSize(16)  
    if(detections) text("(Scroll Down)", width/2, 200);
    textSize(12) 
    if(!detections) text("Loading Model... (Cant Scroll until Done)", width/2, 200);
    textSize(16) 
    if(!beginScan) text("Press ENTER to scan",width/2, 750);
    
    //will appear when the player begins the scan
    if(beginScan) {
        text("Name:" + suspectDescriptions[person_selected][0], width/2, 750);
        text("Age:" + suspectDescriptions[person_selected][1], width/2, 780);
        text("Gender:" + suspectDescriptions[person_selected][2], width/2, 810);
        text("Ethnicity:" + suspectDescriptions[person_selected][3], width/2, 840);
        text("Crime:" + suspectDescriptions[person_selected][4], width/2, 870);
    }
    
    //controls  
    textAlign(LEFT);
    textSize(10);
    text("You will have to find the criminal", 150, 1050, 500);
    text("10 suspects will be randomly located on a map", 150, 1080, 500);
    text("Use the ARROW keys to navigate through the map", 150, 1110, 500);
    text("Press F to flag a location (can only do it 3 times)", 150, 1140, 530);
    text("Press D to inspect a suspect", 150, 1170, 530);
    text("Press SPACE on the suspect you think is gulity", 150, 1200, 500);
    text("Press 1 to begin", 150, 1230, 500);

    //scanner for suspects face
    push();
    translate(width/2 - 100, 500);
    imageMode(CORNER);
    selector(1);
    stroke(0);
    strokeWeight(3);
    fill(255,255,255,243);
    rect(0,0,200,200);
    fill(0);  
    if (beginScan) {
      // if we have detections, draw them on the image
      if (detections) drawLandmarks(detections);   
    }
    pop();  

    
    pop(); 
    
    //makes sure content doesnt overlap the painting  
    fill(0);
    rect(0,0,width,90);
    rect(0,height-92,width,118);
    image(topP, width/2,0,875);
    image(bottomP, width/2+.8,height-1,875);  
    pop();
  };
}

//inspect painting 3
function SceneSix2() {
  this.setup = function () {
    createCanvas(800, 594);
    positionY = 0;
    positionX = 0;
    
    //suspect 1 location  
    rX = random(600, 850);
    rY = random(50, 200);
    
    //suspect 2 location
    rX2 = random(450, 650);
    rY2 = random(150, 550);
    
    //suspect 3 location
    rX3 = random(950, 1150);
    rY3 = random(100, 300);

    //suspect 4 location
    rX4 = random(200, 400);
    rY4 = random(600, 700);
    
    //suspect 5 location
    rX5 = random(800, 1150);
    rY5 = random(600, 660);
      
    //suspect 6 location
    rX6 = random(100, 300);
    rY6 = random(50, 200);

    //suspect 7 location
    rX7 = random(350, 400);
    rY7 = random(400, 550);

    //suspect 8 location
    rX8 = random(200, 600);
    rY8 = random(50, 100);

    //suspect 9 location
    rX9 = random(700, 800);
    rY9 = random(300, 350);

    //suspect 10 location
    rX10 = random(750, 850);
    rY10 = random(500, 550);
    
    suspectNum= 0;
    suspectChosen = 0;
    suspectInfo= 0;
    size = 50;
    sizeX = 0;
    sizeY = 0;
    scanUses = 0;
    savedCoordinatesNum = 0;
    
    //loads faceApi
    faceapi = ml5.faceApi(detection_options, modelReadyM);
    
  };

  this.draw = function () {
    background(0);
    sceneNum = 6.1;
    push();
    imageMode(CORNER);
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    imageMode(CENTER);
    image(inspectPainting,width/2,height/2, 875,800);
      
    push();
    translate(positionX,positionY);
      
    //controls
    if(moveUp) positionY += 10;
    else if (moveDown) positionY -=10;
    else if (moveLeft) positionX +=10;
    else if (moveRight) positionX -=10;
    
    //limits scrolling up/down
    if (positionY > 100) positionY = 100;
    else if (positionY < -250) positionY = -250;
    
    //limits side scrolling
    if (positionX > 100) positionX = 100;
    else if (positionX < -500) positionX = -500;
    
    push();
    imageMode(CORNER);  
    blendMode(BLEND);
    fill(255, 150);
    ellipse(int(mouseX) - positionX, int(mouseY) - positionY, 100, 100);
    noFill();
      
    //provides spotlight effect  
    blendMode(DARKEST);
    image(ml_cc_map,0,0,1200,720);
    fill(100,150,255);
    stroke(100,100,255);
    
    //places suspect  
    rect(rX,rY,size);
    rect(rX2,rY2,size);
    rect(rX3,rY3,size);
    rect(rX4,rY4,size);
    rect(rX5,rY5,size);
    rect(rX6,rY6,size);
    rect(rX7,rY7,size);
    rect(rX8,rY8,size);
    rect(rX9,rY9,size);
    rect(rX10,rY10,size);
    pop();
    
    //allows user to select or inspect suspect 1   
    if(mouseX >= rX + positionX && mouseX < rX + positionX + size &&
       mouseY >= rY + positionY && mouseY < rY + positionY  + size) {
       suspectNum = 1;    
    } 
      
    //allows user to select or inspect suspect 2  
    else if(mouseX >= rX2 + positionX && mouseX < rX2 + positionX + size &&
       mouseY >= rY2 + positionY  && mouseY < rY2 + positionY  + size) {
       suspectNum = 2;    
    }
    
    //allows user to select or inspect suspect 3
    else if(mouseX >= rX3 + positionX && mouseX < rX3 + positionX + size &&
       mouseY >= rY3 + positionY  && mouseY < rY3 + positionY  + size) {
       suspectNum = 3;    
    }
      
    //allows user to select or inspect suspect 4
    else if(mouseX >= rX4 + positionX && mouseX < rX4 + positionX + size &&
       mouseY >= rY4 + positionY  && mouseY < rY4 + positionY  + size) {
       suspectNum = 4;    
    }
    
    //allows user to select or inspect suspect 5
    else if(mouseX >= rX5 + positionX && mouseX < rX5 + positionX + size &&
       mouseY >= rY5 + positionY  && mouseY < rY5 + positionY  + size) {
       suspectNum = 5;    
    }
    
    //allows user to select or inspect suspect 6
    else if(mouseX >= rX6 + positionX && mouseX < rX6 + positionX + size &&
       mouseY >= rY6 + positionY  && mouseY < rY6 + positionY  + size) {
       suspectNum = 6;    
    }
    
    //allows user to select or inspect suspect 7
    else if(mouseX >= rX7 + positionX && mouseX < rX7 + positionX + size &&
       mouseY >= rY7 + positionY  && mouseY < rY7 + positionY  + size) {
       suspectNum = 7;    
    }
      
    //allows user to select or inspect suspect 8
    else if(mouseX >= rX8 + positionX && mouseX < rX8 + positionX + size &&
       mouseY >= rY8 + positionY  && mouseY < rY8 + positionY  + size) {
       suspectNum = 8;    
    }
     
    //allows user to select or inspect suspect 9
    else if(mouseX >= rX9 + positionX && mouseX < rX9 + positionX + size &&
       mouseY >= rY9 + positionY  && mouseY < rY9 + positionY  + size) {
       suspectNum = 9;    
    }
    
    //allows user to select or inspect suspect 10
    else if(mouseX >= rX10 + positionX && mouseX < rX10 + positionX + size &&
       mouseY >= rY10 + positionY  && mouseY < rY10 + positionY  + size) {
       suspectNum = 10;    
    }
    
    else { suspectNum = 0; }
      
    pop();
    mlcc_mouseEffects();

   
    push();  
    translate(width/2 - 100,height/2 - 150); 
    if (beginScan) {
        // if we have detections, draw them on the image
        if (detections) drawLandmarks(detections);   
    }
    pop();
      
    fill(0);
    rect(0,0,width,90);
    rect(0,height-92,width,118);
    rect(0,0,32,height);
    rect(width,0,-32,height);
    image(topP, width/2,0,875);
    image(bottomP, width/2+.8,height-1,875);
    fill(255);
    text(mouseX,30,30);
    text(mouseY,30,60);  
    text("suspect num:" + suspectNum,30,90); 
    text("suspect Scan:" + suspectScan,30,120);  
    text("Scan uses:" + scanUses,30,150);
    pop();
    
    //saves the first coordinates   
    if(savedCoordinatesNum == 1) {
        savedCoordinates[0][0] = ("X:" + (mouseX - positionX));
        savedCoordinates[0][1] = ("Y:" + (mouseY - positionY));
    }
    
    //saves the second coordinates 
    if(savedCoordinatesNum == 3) {
        savedCoordinates[1][0] = ("X:" + (mouseX - positionX));
        savedCoordinates[1][1] = ("Y:" + (mouseY - positionY));
    }  
    
    //saves the third coordinates 
    if(savedCoordinatesNum == 5) {
        savedCoordinates[2][0] = ("X:" + (mouseX - positionX));
        savedCoordinates[2][1] = ("Y:" + (mouseY - positionY));
    }
    
    //switches to result scene when user selects a suspect
    if(suspectChosen > 0) mgr.showScene(SceneSix3);
  };
}

//paitning 3 results scene
function SceneSix3() {
  this.setup = function () {
    createCanvas(800, 594);
    positionY = 0;
  };

  this.draw = function () {
    background(0);
    sceneNum = 6.2;
    push();
    imageMode(CORNER);
    image(backgroundImg,0,0);
    image(backgroundImg,500,0);
    imageMode(CENTER);
    image(inspectPainting,width/2,height/2, 875,800);
    
      
    push();
      
    //allows user to scroll up and down   
    translate(0,positionY);
    if(moveUp && detections) positionY += 10;
    else if (moveDown && detections) positionY -=10;
    
    if (positionY > 0) positionY = 0;
    else if (positionY < -400) positionY = -400;
      
    fill(255);
    rect(125,100,width - 250, height*2);
    
    fill(0);
    textSize(24);
    textAlign(CENTER);
    
    //onscreen text  
    if(suspectChosen == person_selected + 1)text("MISSION ACCOMPLISHED", width/2, 150);  
    if(suspectChosen != person_selected + 1)text("MISSION FAILED", width/2, 150);
    textSize(32);  
    text("______________", width/2, 165);
    textSize(12)  
    text("(Scroll Down)", width/2, 190);
      
    //displays the criminal  
    push();
    translate(0,60);
    push();
      translate(width/2 - 100, 500);
      imageMode(CORNER);
      selector(1);
      stroke(0);
      strokeWeight(3);
      fill(255,255,255,243);
      rect(0,0,200,200);
      fill(0);
      if(key == "Enter")  selector(1);
      if (detections) drawLandmarks(detections);   
    pop();
      
    textSize(12)
    text("Press ENTER to reveal the criminal", width/2, 730);
    text("The Criminal", width/2, 490);
    
    //displays the user's answer
    push();
      translate(width/2 - 100,200);
      imageMode(CORNER);
      selector(3);
      stroke(0);
      strokeWeight(3);
      fill(255,0);
      rect(0,0,200,200); 
    pop();
    text("Your Answer", width/2, 190);
    pop();
      
    pop(); 

     
      
    fill(0);
    rect(0,0,width,90);
    rect(0,height-92,width,118);
    image(topP, width/2,0,875);
    image(bottomP, width/2+.8,height-1,875);  
    pop();
  };
}

function mousePressed() {
  if (sceneNum == 1 && play) mgr.showScene(SceneTwo); //begins the game
  else if (sceneNum == 4 && s4_pt2) mgr.showScene(SceneFour2);  //loads scene 2 of the text decipher game
}

//draws an animated light
function lightAsset(x) {
    push();
    translate(x,0);
    lightMod = 240; //modulo number
    lightNum = lightNum % lightMod;
    lightNum ++;
    
    //draws the light asset at different times to create the animation effect
    if(lightNum < lightMod / 3) light = light1;
    else if(lightNum > lightMod / 3 && lightNum < ( (lightMod / 3) * 2 )) light = light2;
    else if(lightNum > ( (lightMod / 3) * 2 ) && lightNum < lightMod) light = light3;
    image(light,0,height - 360, 85,300);
    pop();
}

//painting frame
function paintingAsset(x) {
    push();
    imageMode(CENTER);
    image(painting,x,height/2);
    pop();
}

//onscreen text for the art gallery scene
function onscreenText(pos) {
    push()
    fill(255);
    rect(5,5,350,20)
    fill(0);
    text("Press C to view the controls", 10,20);
    text("X:" + -positionX, 10,50)  ;
    
    if(pos < 190 && pos > -190){ 
        inspectNum = 1; 
        pointerCol = 255;
    } else if(pos < 1200 && pos > 820) {
        inspectNum = 2; 
        pointerCol = 255;
    } else if(pos < -890 && pos > -1280) {
        inspectNum = 3; 
        pointerCol = 255;
    } else { 
        inspectNum = 0; 
        pointerCol = 0;
    };
    
    textAlign(CENTER);
    fill(255);
    if(inspectNum >= 1 && inspectNum <= 3) text("Press ENTER to inspect painting", width/2, height - 28);
    textAlign(LEFT);
    pop()
}

//the on screen arrows that switches colour when the user presses left or right
function arrows() {
    
    if(sceneNum == 2){
        push();
        imageMode(CENTER);
        if(!moveLeft) image(arrowL, 50, height - 33);
        else if(moveLeft) image(arrowL2, 50, height - 33);

        if(!moveRight) image(arrowR, width - 50, height - 33);
        if(moveRight) image(arrowR2, width - 50, height - 33);
        pop();
    }
    
    if(sceneNum == 4)
    {
        push();
        imageMode(CENTER);
        if(!moveLeft) image(arrowL, 50, height - 33);
        else if(moveLeft) image(arrowL2, 50, height - 33);

        if(!moveRight) image(arrowR, width - 50, height - 33);
        if(moveRight) image(arrowR2, width - 50, height - 33);
        pop();
    }
}

function keyPressed() {
    
  //art gallery scene controls    
  if (sceneNum == 2) {
    if(key == "a" || keyCode == 37) moveLeft = true; //moves left
    else if(key == "d" || keyCode == 39) moveRight = true; //moves right
    else if(keyCode == 13 && inspectNum == 1) mgr.showScene(SceneFour); //loads text decipher scene
    else if(keyCode == 13 && inspectNum == 2) mgr.showScene(SceneFive); //loads hangman scene 
    else if(keyCode == 13 && inspectNum == 3) mgr.showScene(SceneSix); //loads crime case scene 
  }
    
  //controls for the mini games
  if(sceneNum >= 3 && sceneNum < 7){ 
    if(keyCode == 27) mgr.showScene(SceneTwo); //loads art gallery scene 
    else if(keyCode == 38) moveUp = true; //moves up
    else if(keyCode == 40) moveDown = true; //moves down
  }
    
  //controls for text deciper scene 2    
  if(sceneNum == 4.1) {
      if(key == "t") applyTemp = temp; //applies temperature
      if(key == " ") start_pause += 1; //starts/pauses generation
      if(key == "r") resetModel(); //resets text
      if(key == "s") predict(); //single character
      if(key == "1") { 
          mgr.showScene(SceneFour3); //loads next scene
          originalTextArray.push(generated_text); //pushes generated text into array
      }
  }
    
  if(keyCode == 13 && sceneNum == 4.2) answer = true; //reveals answer 
    
  if(sceneNum == 4.2 && keyCode == 16){ 
   //sets the input value when using sound classification      
   if(!cantUnderstand) {
       if (inputValue2 == "1") _1 = label_Decipher
       if (inputValue2 == "2") _2 = label_Decipher
       if (inputValue2 == "3") _3 = label_Decipher
       if (inputValue2 == "4") _4 = label_Decipher
       if (inputValue2 == "5") _5 = label_Decipher
       if (inputValue2 == "6") _6 = label_Decipher
       if (inputValue2 == "7") _7 = label_Decipher
       if (inputValue2 == "8") _8 = label_Decipher
       if (inputValue2 == "9") _9 = label_Decipher
       if (inputValue2 == "10") _10 = label_Decipher
       if (inputValue2 == "11") _11 = label_Decipher
       if (inputValue2 == "12") _12 = label_Decipher
       if (inputValue2 == "13") _13 = label_Decipher
       if (inputValue2 == "14") _14 = label_Decipher
       if (inputValue2 == "15") _15 = label_Decipher
       if (inputValue2 == "16") _16 = label_Decipher
       if (inputValue2 == "17") _17 = label_Decipher
       if (inputValue2 == "18") _18 = label_Decipher
       if (inputValue2 == "19") _19 = label_Decipher
       if (inputValue2 == "20") _20 = label_Decipher
       if (inputValue2 == "21") _21 = label_Decipher
       if (inputValue2 == "22") _22 = label_Decipher
       if (inputValue2 == "23") _23 = label_Decipher
       if (inputValue2 == "24") _24 = label_Decipher
       if (inputValue2 == "25") _25 = label_Decipher
       if (inputValue2 == "26") _26 = label_Decipher
    }
    
    //sets the input if sound classification is disabled
    if(cantUnderstand) {
       if (inputValue2 == "1") _1 = inputValue2_2
       if (inputValue2 == "2") _2 = inputValue2_2
       if (inputValue2 == "3") _3 = inputValue2_2
       if (inputValue2 == "4") _4 = inputValue2_2
       if (inputValue2 == "5") _5 = inputValue2_2
       if (inputValue2 == "6") _6 = inputValue2_2
       if (inputValue2 == "7") _7 = inputValue2_2
       if (inputValue2 == "8") _8 = inputValue2_2
       if (inputValue2 == "9") _9 = inputValue2_2
       if (inputValue2 == "10") _10 = inputValue2_2
       if (inputValue2 == "11") _11 = inputValue2_2
       if (inputValue2 == "12") _12 = inputValue2_2
       if (inputValue2 == "13") _13 = inputValue2_2
       if (inputValue2 == "14") _14 = inputValue2_2
       if (inputValue2 == "15") _15 = inputValue2_2
       if (inputValue2 == "16") _16 = inputValue2_2
       if (inputValue2 == "17") _17 = inputValue2_2
       if (inputValue2 == "18") _18 = inputValue2_2
       if (inputValue2 == "19") _19 = inputValue2_2
       if (inputValue2 == "20") _20 = inputValue2_2
       if (inputValue2 == "21") _21 = inputValue2_2
       if (inputValue2 == "22") _22 = inputValue2_2
       if (inputValue2 == "23") _23 = inputValue2_2
       if (inputValue2 == "24") _24 = inputValue2_2
       if (inputValue2 == "25") _25 = inputValue2_2
       if (inputValue2 == "26") _26 = inputValue2_2
    }
  }

  //text decipher scene 3 controls
  if(sceneNum == 4.2) {
    if(key == "1") answerReveal = 1; //reveals original text
    else if(key == "2")answerReveal = 2; //reveals encrypted text
    else if(key == "3")answerReveal = 3; //reveals answers
    else if(key == "4")answerReveal = 4;
    else if(key == "=") cantUnderstand = true; //disables sound classification
  }
    
  //hangman scene controls
  if(sceneNum == 5) {
      if(key == "1") hints = true; //enables hints
      else if(key == "2") hints = false;  //disable hints
  }
      
  //crime case scene 1 controls
  if(sceneNum == 6) {
      if(keyCode == 13 && !beginScan) {
        beginScan = true; //begins the facial scanner
    }
      
    if(key == "1") mgr.showScene(SceneSix2); //changes to scene 2
  }
  
    //crime case scene 2 controls
  if(sceneNum == 6.1) {
    if(keyCode == 37) moveLeft = true; //moves left
    else if(keyCode == 39) moveRight = true; //moves right
  }
    
  //launches the controls when the user presses C excluding the text decipher scene    
  if(key == 'c'){
      if(sceneNum != 4 && sceneNum != 4.1 && sceneNum != 4.2) mgr.showScene(SceneThree);
    }
}

function keyReleased() {
    
    //art gallery scene controls
  if (sceneNum == 2) {
      if(key == "a" || keyCode == 37) moveLeft = false; //stops moving left
      else if(key == "d" || keyCode == 39) moveRight = false; //stops moving right
  }
    //mini game scene
  if(sceneNum >= 3 && sceneNum < 7){ 
    if(keyCode == 38) moveUp = false; //stops moving up
    else if(keyCode == 40) moveDown = false; //stops moving down
  }
    
    //crime case scene 2 controls
  if(sceneNum == 6.1) {
    if(keyCode == 37) moveLeft = false; //stops moving left
    else if(keyCode == 39) moveRight = false; //stops moving right
    else if (key == "d") suspectInfo = suspectNum; //inspects suspect
    
    else if (key == "f" && savedCoordinatesNum != 6) savedCoordinatesNum ++;//saves coordinates
    
    else if (key == "x") {suspectInfo = 0; suspectScan = 0;}  //close inspection
    else if (key == "s" && scanUses != 3) { //scans user and limits it to 3
        suspectScan = suspectInfo;
        scanUses++;
    }
    
    else if(key == " "){suspectChosen = suspectNum} //frame suspect
    
  }
}



//alphabet sound model gotResult function
function gotResultD(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label_Decipher = results[0].label;
  if(label_Decipher == "Background Noise") label_Decipher = "Say a Letter" //instead of displaying background noise it says Say a Letter
}


//text generation model ready function (from week 7)
async function modelReady() {
  resetModel();
}

//text generation resetModel function 
function resetModel() {
  charRNN.reset();
  const seed = inputValue;
  charRNN.feed(seed);
  generated_text = seed; //makes generated_text = seed
}

//text generation generate function 
function generate() {
    //pauses the generation
  if (!generating && start_pause == 1) {
    generating = false;

    //starts generation
  } else if (!generating && start_pause == 0) {
    generating = true;
    loopRNN();
  }
}

//text generation loopRNN function (from week 7)
async function loopRNN() {
  while (generating) {
    await predict();
  }
}

//text generation predict function (from week 7)
async function predict() {
  let temperature = applyTemp;
  let next = await charRNN.predict(temperature);
  await charRNN.feed(next.sample);
  generated_text += next.sample; //adds character to generated text string
}

//displays the users answers if answers == true
function userAns()
{
    text(_1,xpos + increment2, ypos); //charcter 1 answer
    text(_2,xpos + increment3, ypos); //charcter 2 answer
    text(_3, xpos + increment * 2 + increment2, ypos); //charcter 3 answer
    text(_4,xpos + increment * 3 + increment2, ypos); //charcter 4 answer
    text(_5,xpos + increment * 4 + increment2, ypos); //charcter 5 answer
    text(_6,xpos + increment * 5 + increment2, ypos); //charcter 6 answer
    text(_7,xpos + increment * 6 + increment2, ypos); //charcter 7 answer
    text(_8,xpos + increment * 7 + increment2, ypos); //charcter 8 answer
    text(_9,xpos + increment * 8 + increment2, ypos); //charcter 9 answer
    text(_10,xpos + increment2, ypos + increment2); //charcter 10 answer
    text(_11,xpos + increment3, ypos + increment2); //charcter 11 answer
    text(_12,xpos + increment * 2 + increment2, ypos + increment2); //charcter 12 answer
    text(_13,xpos + increment * 3 + increment2, ypos + increment2); //charcter 13 answer
    text(_14,xpos + increment * 4 + increment2, ypos + increment2); //charcter 14 answer
    text(_15,xpos + increment * 5 + increment2, ypos + increment2); //charcter 15 answer
    text(_16,xpos + increment * 6 + increment2, ypos + increment2); //charcter 16 answer
    text(_17,xpos + increment * 7 + increment2, ypos + increment2); //charcter 17 answer
    text(_18,xpos + increment * 8 + increment2, ypos + increment2); //charcter 18 answer
    text(_19,xpos + increment2, ypos + increment); //charcter 19 answer
    text(_20,xpos + increment3, ypos + increment); //charcter 20 answer
    text(_21,xpos + increment * 2 + increment2, ypos + increment); //charcter 21 answer
    text(_22,xpos + increment * 3 + increment2, ypos + increment); //charcter 22 answer
    text(_23,xpos + increment * 4 + increment2, ypos + increment); //charcter 23 answer
    text(_24,xpos + increment * 5 + increment2, ypos + increment); //charcter 24 answer
    text(_25,xpos + increment * 6 + increment2, ypos + increment); //charcter 25 answer
    text(_26,xpos + increment * 7 + increment2, ypos + increment); //charcter 26 answer
}




// cameraloaded function from week 5
function cameraLoaded(stream) {
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses); // our callback for poses

  let options = {
    inputs: 34,
    outputs: 4,
    task: "classification",
    debug: true,
  };

  // load our training into the neural network
  brain = ml5.neuralNetwork(options);

  const modelInfo = {
    //uses the model, metadata & weights I created
    model: "models/body_pose/myModel2/model.json",
    metadata: "models/body_pose/myModel2/model_meta.json",
    weights: "models/body_pose/myModel2/model.weights.bin",
  };

  // load it into our neural net
  brain.load(modelInfo, brainLoaded);
}

// brainLoaded function from week 5
function brainLoaded() {
  console.log("pose classification ready!");
  classifyPose();
}

// classifyPose function from week 5
function classifyPose() {
  if (pose) {
    let inputs = [];

    for (let keypoint of pose.keypoints) {
      let x = keypoint.position.x;
      let y = keypoint.position.y;

      inputs.push(x);
      inputs.push(y);
    }

    // classify the skeleton from the image
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100); // we call this function recursively every 100 milliseconds
  }
}

// gotResult function from week 5
function gotResult(error, results) {
  // this is the result from the classification
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  }

  // we call classify pose as we are now done and should keep classifying
  classifyPose();
}

// gotPoses function from week 5
function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

// modelLoaded function from week 5
function modelLoaded() {
  console.log("poseNet ready");
}


//got result for the hangman commands sound classification model 
function gotResultH(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label_hangman = results[0].label;
  if(label_hangman == "Background Noise") label_hangman = "Clap or say Insert" //says clap or insert when it detects background noise
}

//displays the hint image if sound classification detcts the user saying a letter in the alphabet
function requesting() {
  
  //displays image for the letter a    
  if (label_Decipher === "a" || label_Decipher === "A") {
    image(a_, width / 2, 0);
  }
  //displays image for the letter c     
  else if (label_Decipher === "c" || label_Decipher === "C") {
    image(c_, width / 2, 0);
  }
  //displays image for the letter d     
  else if (label_Decipher === "d" || label_Decipher === "D") {
    image(d_, width / 2, 0);
  }
  //displays image for the letter e
  else if (label_Decipher === "e" || label_Decipher === "E") {
    image(e_, width / 2, 0);
  }
  //displays image for the letter f
  else if (label_Decipher === "f" || label_Decipher === "F") {
    image(f_, width / 2, 0);
  } 
  //displays image for the letter h
  else if (label_Decipher === "h" || label_Decipher === "H") {
    image(h_, width / 2, 0);
  } 
  //displays image for the letter i
  else if (label_Decipher === "i" || label_Decipher === "I") {
    image(i_, width / 2, 0);
  } 
  //displays image for the letter l
  else if (label_Decipher === "l" || label_Decipher === "L") {
    image(l_, width / 2, 0);
  } 
  //displays image for the letter m
  else if (label_Decipher === "m" || label_Decipher === "M") {
    image(m_, width / 3, 0);
  } 
  //displays image for the letter n
  else if (label_Decipher === "n" || label_Decipher === "N") {
    image(n_, width / 2, 0);
  } 
  //displays image for the letter o
  else if (label_Decipher === "o" || label_Decipher === "O") {
    image(o_, width / 2, 0);
  } 
  //displays image for the letter p
  else if (label_Decipher === "p" || label_Decipher === "P") {
    image(p_, width / 2, 0);
  } 
  //displays image for the letter r
  else if (label_Decipher === "r" || label_Decipher === "R") {
    image(r_, width / 2, 0);
  } 
  //displays image for the letter t
  else if (label_Decipher === "t" || label_Decipher === "T") {
    image(t_, width / 3, 0);
  } 
  //displays image for the letter u
  else if (label_Decipher === "u" || label_Decipher === "U") {
    image(u_, width / 2, 0);
  }
}



//facial detction modelready function from week 3
// callback for when ml5.js has loaded the model
function modelReadyM() {
  console.log("Model is ready...");

  // ask ml5 to detect a single face in this image - gotResults() callback
  //faceapi.detectSingle(img, gotResults);
  
  //selects the image that is being detected
  selector(2);
}


//facial detction gotResults function from week 3
// ml5.js has determined if there's a face
function gotResultsM(err, result) {
  // check if ml5.js returned an error - if so print to console and stop
  if (err) {
    console.log(err);
    return;
  }

  // if it gets here we are okay, so store results in the detections variable, this is an OBJECT of detections - see the console
  console.log(result);
  detections = result;
}



//facial detction drawLandmarks function from week 3
function drawLandmarks(detections) {


  noFill();
  stroke(0);
  strokeWeight(2);

  push();
  // mouth
  beginShape();
  detections.parts.mouth.forEach((item) => {
    vertex(item._x, item._y);
  });
  endShape(CLOSE);

  // nose
  beginShape();
  detections.parts.nose.forEach((item) => {
    vertex(item._x, item._y);
  });
  endShape(CLOSE);

  // left eye
  beginShape();
  detections.parts.leftEye.forEach((item) => {
    vertex(item._x, item._y);
  });
  endShape(CLOSE);

  // right eye
  beginShape();
  detections.parts.rightEye.forEach((item) => {
    vertex(item._x, item._y);
  });
  endShape(CLOSE);

  // right eyebrow
  beginShape();
  detections.parts.rightEyeBrow.forEach((item) => {
    vertex(item._x, item._y);
  });
  endShape();

  // left eye
  beginShape();
  detections.parts.leftEyeBrow.forEach((item) => {
    vertex(item._x, item._y);
  });
  endShape();

  pop();
}

//selector function used in crime case mini game
function selector(input){
  //places the selected image at the top left and resizes it
  
  //used in scene 1 of the crime case mini game, decides who the criminal is and allows the user to scan their face  
  if (input == 1){

      //draws person 1
    if(person_selected == 0){
        p1.resize(200, 200);
        image(p1, 0, 0);
        p1.filter(GRAY);
    }
      
      //draws person 2
    if(person_selected == 1){
        p2.resize(200, 200);
        image(p2, 0, 0);
        //p2.filter(GRAY); commented out as it causes errors
    }
  
      //draws person 3
   if(person_selected == 2){
        p3.resize(200, 200);
        image(p3, 0, 0);
       p3.filter(GRAY);
    }
    
      //draws person 4
    if(person_selected == 3){
        p4.resize(200, 200);
        image(p4, 0, 0);
        p4.filter(GRAY);
    }
    
      //draws person 5
    if(person_selected == 4){
        p5.resize(200, 200);
        image(p5, 0, 0);
        p5.filter(GRAY);
    }
    
      //draws person 6
    if(person_selected == 5){
        p6.resize(200, 200);
        image(p6, 0, 0);
        p6.filter(GRAY);
    }
    
      //draws person 7
    if(person_selected == 6){
        p7.resize(200, 200);
        image(p7, 0, 0);
         p7.filter(GRAY);
    }
    
      //draws person 8
    if(person_selected == 7){
        p8.resize(200, 200);
        image(p8, 0, 0);
        p8.filter(GRAY);
    }
    
      //draws person 9
    if(person_selected == 8){
        p9.resize(200, 200);
        image(p9, 0, 0);
        //p9.filter(GRAY); commented out as it causes errors
    }
      
      //draws person 10
    if(person_selected == 9){
        p10.resize(200, 200);
        image(p10, 0, 0);
        p10.filter(GRAY);
    }  
  }
  
  //detects the suspects face and scans it
  if (input == 2)
  {
    if(person_selected == 0) faceapi.detectSingle(p1, gotResultsM); //scans person 1
    if(person_selected == 1) faceapi.detectSingle(p2, gotResultsM); //scans person 2
    if(person_selected == 2) faceapi.detectSingle(p3, gotResultsM); //scans person 3
    if(person_selected == 3) faceapi.detectSingle(p4, gotResultsM); //scans person 4
    if(person_selected == 4) faceapi.detectSingle(p5, gotResultsM); //scans person 5
    if(person_selected == 5) faceapi.detectSingle(p6, gotResultsM); //scans person 6
    if(person_selected == 6) faceapi.detectSingle(p7, gotResultsM); //scans person 7
    if(person_selected == 7) faceapi.detectSingle(p8, gotResultsM); //scans person 8
    if(person_selected == 8) faceapi.detectSingle(p9, gotResultsM); //scans person 9
    if(person_selected == 9) faceapi.detectSingle(p10, gotResultsM);  //scans person 10 
  }
   
    //used in crime case scene 2 it draws the person the user has selected
  if (input == 3) {

      //draws person 1
    if(suspectChosen == 1){
        p1.resize(200, 200);
        image(p1, 0, 0);
        p1.filter(GRAY);
    }
      //draws person 2
    if(suspectChosen == 2){
        p2.resize(200, 200);
        image(p2, 0, 0);
        //p2.filter(GRAY);
    }
      //draws person 3
   if(suspectChosen == 3){
        p3.resize(200, 200);
        image(p3, 0, 0);
       p3.filter(GRAY);
    }
       //draws person 4
    if(suspectChosen == 4){
        p4.resize(200, 200);
        image(p4, 0, 0);
        p4.filter(GRAY);
    }
       //draws person 5
    if(suspectChosen == 5){
        p5.resize(200, 200);
        image(p5, 0, 0);
        p5.filter(GRAY);
    }
       //draws person 6
    if(suspectChosen == 6){
        p6.resize(200, 200);
        image(p6, 0, 0);
        p6.filter(GRAY);
    }
       //draws person 7
    if(suspectChosen == 7){
        p7.resize(200, 200);
        image(p7, 0, 0);
         p7.filter(GRAY);
    }
       //draws person 8
    if(suspectChosen == 8){
        p8.resize(200, 200);
        image(p8, 0, 0);
        p8.filter(GRAY);
    }
       //draws person 9
    if(suspectChosen == 9){
        p9.resize(200, 200);
        image(p9, 0, 0);
        //p9.filter(GRAY);
    }
      //draws person 10
    if(suspectChosen == 10){
        p10.resize(200, 200);
        image(p10, 0, 0);
        p10.filter(GRAY);
    }  
  }
}

//this function creates the mouse effects used in crime case secne 2 
function mlcc_mouseEffects() {
    push();
    rectMode(CENTER);
    textSize(9);
    textAlign(LEFT);
    
    //effects when mouse isnt over a suspect
    if(suspectNum == 0) {
        stroke(255);
        fill(0,0);
        rect(mouseX, mouseY, 120);
        fill(255);
        noStroke();
        text("Search for the suspect!",mouseX - 60, mouseY + 75);
        text("X:" + (mouseX - positionX),mouseX - 60, mouseY - 65);
        text("Y:" + (mouseY - positionY),mouseX, mouseY - 65);
        
        text(savedCoordinates[0][0],mouseX - 60, mouseY - 85);
        text(savedCoordinates[0][1],mouseX, mouseY - 85);
        
        text(savedCoordinates[1][0],mouseX - 60, mouseY - 105);
        text(savedCoordinates[1][1],mouseX, mouseY - 105);
        
        text(savedCoordinates[2][0],mouseX - 60, mouseY - 125);
        text(savedCoordinates[2][1],mouseX, mouseY - 125);
    }
    
    //effects when mouse is over a suspect
    if(suspectNum > 0) {
        stroke(255,255,0);
        fill(0,0);
        rect(mouseX, mouseY, 120);
        fill(255,255,0);
        noStroke();
        text("Press D to view the suspect's details",mouseX - 60, mouseY + 75);
        text("Press F twice to save the coordinates",mouseX - 60, mouseY + 95);
        text("Press SPACE to frame suspect",mouseX - 60, mouseY + 115);
        text("X:" + (mouseX - positionX) ,mouseX - 60, mouseY - 65);
        text("Y:" + (mouseY - positionY) ,mouseX, mouseY - 65);
        
        text(savedCoordinates[0][0],mouseX - 60, mouseY - 85);
        text(savedCoordinates[0][1],mouseX, mouseY - 85);
        
        text(savedCoordinates[1][0],mouseX - 60, mouseY - 105);
        text(savedCoordinates[1][1],mouseX, mouseY - 105);
        
        text(savedCoordinates[2][0],mouseX - 60, mouseY - 125);
        text(savedCoordinates[2][1],mouseX, mouseY - 125);
    }
    
    //displays if the user is inspecting a suspect
    if(suspectInfo > 0 ) {
        fill(255, 250);
        rect(415,300,360,height/2);
        fill(0);
        text("Press S to compare (" +  (3 - scanUses) + "left)",270, 360);
        text("Press F twice to save coordinates",270, 380);
        text("Press SPACE to frame suspect",270, 400);
        text("Press X to exit",270, 420);
    }
    
   //inspection for person 1
    if(suspectInfo == 1) {
        p1.resize(150, 150);
        image(p1, width/2 + 15, height/2 -50);
        p1.filter(GRAY);
        if (suspectScan == 1) beginScan = true;
    } 
    //inspection for person 2
    if(suspectInfo == 2) {
        p2.resize(150, 150);
        image(p2, width/2 + 15, height/2 -50);
        if (suspectScan == 2) beginScan = true;
    }
    //inspection for person 3
    else if(suspectInfo == 3) {
        p3.resize(150, 150);
        image(p3, width/2 + 15, height/2 -50);
        p3.filter(GRAY);
        if (suspectScan == 3) beginScan = true;
    }
    //inspection for person 4
    else if(suspectInfo == 4) {
        p4.resize(150, 150);
        image(p4, width/2 + 15, height/2 -50);
        p4.filter(GRAY);
        if (suspectScan == 4) beginScan = true;
    }
    //inspection for person 5
    else if(suspectInfo == 5) {
        p5.resize(150, 150);
        image(p5, width/2 + 15, height/2 -50);
        p5.filter(GRAY);
        if (suspectScan == 5) beginScan = true;
    }
    //inspection for person 6
    else if(suspectInfo == 6) {
        p6.resize(150, 150);
        image(p6, width/2 + 15, height/2 -50);
        p6.filter(GRAY);
        if (suspectScan == 6) beginScan = true;
    }
    //inspection for person 7
    else if(suspectInfo == 7) {
        p7.resize(150, 150);
        image(p7, width/2 + 15, height/2 -50);
        p7.filter(GRAY);
        if (suspectScan == 7) beginScan = true;
    }
    //inspection for person 8
    else if(suspectInfo == 8) {
        p8.resize(150, 150);
        image(p8, width/2 + 15, height/2 -50);
        p8.filter(GRAY);
        if (suspectScan == 8) beginScan = true;
    }
    //inspection for person 9
    else if(suspectInfo == 9) {
        p9.resize(150, 150);
        image(p9, width/2 + 15, height/2 -50);
        if (suspectScan == 9) beginScan = true;
    }
    //inspection for person 10
    else if(suspectInfo == 10) {
        p10.resize(150, 150);
        image(p10, width/2 + 15, height/2 -50);
        p10.filter(GRAY);
        if (suspectScan == 10) beginScan = true;
    }
    else {beginScan = false;}
    pop();
}
