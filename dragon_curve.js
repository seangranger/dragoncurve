canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 400;
canvas.height = 400;
var ctx = canvas.getContext('2d');
ctx.fillRect(0, 0, 400, 400);

var input = document.createElement('input');
input.type = 'text';
input.value = 'Enter # iterations <13';
document.body.appendChild(input);

var button = document.createElement('button');
button.innerText = 'Run';
document.body.appendChild(button);

var img = new Image(); 
img.addEventListener('load',function(){
  ctx.drawImage(img, 0, 0); 
},false);

img.src = './cardboard-paper-background-half.jpg'; 
img.width = 400;
img.height = 400;


button.addEventListener('click', function() {
  var img = new Image();   
  img.addEventListener('load',function(){
    ctx.drawImage(img, 0, 0); 
  },false);

  img.src = './cardboard-paper-background-half.jpg'; 
  img.width = 400;
  img.height = 400;

  var seq = ['end','vee','end'];
  //jump rate is how many forloop cycles are to be completed in drawCurve before requesting newframe
  var jumprate;
  //killcount keeps track of # of jumprates completed
  var killcount = 1; 
  //stepvsize is how many pixels long the lines will be based on the # of iterations chosen 
  var stepvsize = [50,50,50,35,30,20,17,11,9,5,4,2,2];
  //numstep is how many iterations are chosen
  var numstep;
  //colorcount will keep count of how many total curves have been completed.
  var colorcount = 0;
  var counter = 0;
  //seq.length - killswitch is the limit for killcount before it errors.(I'm pretty sure)
  var killswitch = (seq.length % jumprate);
  var colorarr = ['red', 'green', 'blue', 'yellow']

    var colorstate = {
      red: {
        current : [200,200],
        initdir: 'end',
        lastdir: 'end',
        newdir: '',
        color: 'red',
        counter: 1
      },
      yellow: {
        current: [200,200],
        initdir: 'up',
        lastdir: 'up',
        newdir: '',
        color: 'yellow',
        counter: 1
      },
      blue: {
        current: [200,200],
        initdir: 'right',
        lastdir: 'right',
        newdir: '',
        color: 'blue',
        counter:1
      },
      green: {
        current: [200,200],
        initdir: 'down',
        lastdir: 'down',
        newdir: '',
        color: 'green',
        counter: 1
      }
    };

  var vecchange = {
    //fold type
    'vee':
      // newdir based on lastdir
    {'end':'down','up':'left','down':'right','left':'down','right':'up'},
    //fold type
    'teepee':
      // newdir based on lastdir
    {'up':'right','down':'left','left':'up','right':'down'}
  };
  var drawCurve = function(state){
    for (var i = 0; i < jumprate; i ++) {
      if(colorcount === 4) {
        colorcount += 1;
        return;
      }
      ctx.beginPath();
      ctx.moveTo(state.current[0],state.current[1]);
      state.newdir = vecchange[seq[state.counter]][state.lastdir];
      if (state.newdir === 'up') {
        state.current[1] += (-1 * linesize);
      }else if (state.newdir === 'down') {
        state.current[1] += linesize;
      }else if (state.newdir === 'left') {
        state.current[0] += (-1 * linesize);
      }else if (state.newdir === 'right') {
        state.current[0] += linesize;
      }
      ctx.lineTo(state.current[0],state.current[1]);
      ctx.strokeStyle = state.color;
      ctx.stroke(); 
      state.lastdir = state.newdir;
      state.counter += 1;
    }
  };

  var nextFrame = function(){
    if(killcount > seq.length - ((seq.length % jumprate)+ jumprate)){
      return;
    }
    if(colorcount < 4) {
      if(numstep < 10 &&  colorstate[colorarr[colorcount]].counter >= seq.length - ((seq.length % jumprate)+jumprate)){
        return;
      }
      if(colorstate[colorarr[colorcount]].counter < seq.length - ((seq.length % jumprate)+jumprate)){
        drawCurve(colorstate[colorarr[colorcount]]);
      }else{
        colorstate[colorarr[colorcount]].counter = 1;
        colorstate[colorarr[colorcount]].current =[200, 200];
        colorcount += 1;
      }
    }else if(colorcount === 4){
      for(var curves in colorstate){
        colorstate[curves].newdir = ''
          colorstate[curves].lastdir = colorstate[curves].initdir;
      }
      ctx.fillRect(0, 0, 400, 400);
      img = new Image();   // Create new img element
      img.src = './cardboard-paper-background-half.jpg'; 
      img.width = 400;
      img.height = 400;
      ctx.drawImage(img, 0, 0); 
      colorcount += 1;
    }else {
      for (var color in colorstate) {
        drawCurve(colorstate[color]);
      }
      killcount += jumprate;
    }
    requestAnimationFrame(nextFrame);
  };
  if ((!(Number.isInteger(Number(input.value)))) || input.value < 0 || input.value > 13){
    console.log('sorry please enter a number between 1 and 13');
    return;
  }
  numstep = input.value - 1;
  for (var i = 0; i < numstep; i++) {
    for ( var j = 1; j < seq.length; j += 2) {
      if ((j + 1) % 4 === 0) {
        seq.splice(j,0,'teepee');
      }else if((j + 1) % 2 ===0 ) {
        seq.splice(j,0,'vee');
      }
    }
  }
  linesize = stepvsize[Number(numstep)];
  if(numstep < 8){
    jumprate = 1;
  }else if(numstep < 11){
    jumprate = 5;
  }else if(numstep < 12){
    jumprate = 12
  }else{
    jumprate = 24}
  requestAnimationFrame(nextFrame);
});
