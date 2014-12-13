// later replace hardcoded images with image files input of some kind
// separately: randomize ranks, can be done sooner
A = {filepath: "pics/mal.jpg", id: "hedwig", rank: 0, correct: false};
B = {filepath: "pics/30rock.jpg", id: "mal", rank: 1, correct: false};
C = {filepath: "pics/arrested.png", id: "fiona", rank: 2, correct: false};
D = {filepath: "pics/louie1.jpg", id:"giraffe", rank: 3, correct: false};
E = {filepath: "pics/fiona.jpg", id:"snow_leopard", rank: 4, correct: false};
picture_array = [A, B, C, D, E];
combination_array = Array();
trial_objects = Array();
trial_result = Array();
for(i=0;i<5;i++){
  for(j=0;j<5;j++){
    if(i != j){
      combination_array.push([picture_array[i], picture_array[j]]);
    }
  }
}


// put images in document body
newTrial()

// runs through a single trial, picking a pair of images
function newTrial(){
  if(combination_array.length == 0){
    console.log("finished!")
    return
  }
  // pulls a random combination from the array of combinations
  var this_combination = Math.floor(Math.random()*combination_array.length);
  var current_pair = combination_array[this_combination]
  trial_objects.push(current_pair);
  combination_array.splice(this_combination, 1);
  var index1 = Math.floor(Math.random()*2);
  var index2;
  if(index1 == 1){
    index2 = 0;
  }
  else{
    index2 = 1;
  }
  console.log(combination_array)

  var stimulus_one = createStimulus(current_pair[index1]);
  var stimulus_two = createStimulus(current_pair[index2]);

  // create ranking
  if(current_pair[index1].rank < current_pair[index2].rank){
    current_pair[index1].correct = true;
  }
  else{
    current_pair[index2].correct = true;
    }
}


// creates the stimulus
function createStimulus(image_object){
  var stimulus = document.createElement('img');
    stimulus.id = image_object.id;
    stimulus.src = image_object.filepath + new Date().getTime();;
    stimulus.width = 250;
    stimulus.height = 250;
    stimulus.class = "temporary";
    document.body.appendChild(stimulus);
    // once image is clicked, experiment result is recorded and next trial starts
    stimulus.addEventListener('click', function(){
        giveResult(image_object);
    });
    //stimulus.addEventListener('touchstart', function(){
    // giveResult(image_object);
    //})
    return stimulus;
}

// records experiment, instigates new trial
function giveResult(image){
  var stimulus = document.getElementById(image.id);
  // if participant selects correct image
  if(image.correct){
    trial_result.push("true");
    console.log(trial_result);
    resetVars(false);
    presentInterTrial();
  }
  // incorrect image
  else{
    trial_result.push("false");
    console.log(trial_result);
    resetVars(false);
    presentInterTrial();
  }
}

// clears html document of image objects
function resetVars(newTrialBool){
  var selection = document.getElementsByTagName('img');
  for(i=0;i <= selection.length;i++){
    selection[0].parentNode.removeChild(selection[0]);
  }
  for(i=0;i<5;i++){
    picture_array[i].correct = false;
  }
  if(newTrialBool){
    // wait a second for next trial
    setTimeout(newTrial, 1000);
  }
}

// present image to re-orientate participant
function presentInterTrial(){
  var interImg = document.createElement('img');
  interImg.width = 500;
  interImg.height = 250;

  //document.getElementById("body").style.left = 1;
  if(trial_result[trial_result.length - 1] === "true"){
    interImg.src = "pics/green.png" + new Date().getTime();
  }
  else{
    interImg.src = "pics/solidRed.jpg" + new Date().getTime();
  }
  document.body.appendChild(interImg);
  interImg.addEventListener('click', function(){
      resetVars(true);
  });

  }