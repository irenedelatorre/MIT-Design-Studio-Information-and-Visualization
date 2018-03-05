// pie chart by palomagr 2018

    var values = [30,70, 80, 120, 50,72]; // all you need to do is add the values here
    var sum = values.reduce(getSum);
    var a;



    function setup() {
    var canvas = createCanvas(720, 400); 
    canvas.parent('sketch-holder');  
    background(100)
    a = getAngles();
        noStroke();
        noLoop();
    }

    function draw(item) {
        angleMode(DEGREES);
        fill(255)
        for(var i = 0;i<a.length ; i++){
        text(nfc(a[i],1), 30,60+i*20);
        }
        pieChart(300, a);
    }

        function getAngles(){
            var n = [];
        for (var i = 0;i<values.length ; i++){
           var mapped = map(values[i], 0,sum,0,360,360 ); 
                append(n, mapped);
        }
            return n;
    }

    function getSum(total, num) {
        return total + num;
    }

    function pieChart(diameter, data) {
      var lastAngle = 0;

     for (var i = 0; i < data.length; i++) {
        var shade = color( 255,50 *i, 0);
        fill(shade);
        arc(width/2, height/2, diameter, diameter,
                    (-a[i]-lastAngle),(-lastAngle));
        lastAngle  = lastAngle + (a[i]);
      }
    }