var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = 400;
canvas.height = 400;
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'yellow';
ctx.fillRect(0, 0, 400, 400);

var numstep = 12;
var current = [200,200];
var seq = ['end','vee','end'];
for (var i = 0; i < numstep; i++) {
 for ( var j = 1; j < seq.length; j += 2) {
   if ((j + 1) % 4 === 0) {
     seq.splice(j,0,'teepee');
   }else if((j + 1) % 2 ===0 ) {
     seq.splice(j,0,'vee');
   }
 }
}
console.log(seq)
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
var lastdir = 'end'; 
var newdir;

for (var k = 1; k < seq.length;k ++) {
  ctx.beginPath();
  ctx.moveTo(current[0],current[1]);
  newdir = vecchange[seq[k]][lastdir];
  if (newdir === 'up') {
    current[1] += -2;
  }else if (newdir === 'down') {
    current[1] += 2;
  }else if (newdir === 'left') {
    current[0] += -2;
  }else if (newdir === 'right') {
    current[0] += 2;
  }
  //console.log(newdir);
  ctx.lineTo(current[0],current[1]);
  //console.log(current);
  ctx.stroke();
  lastdir = newdir;
}
