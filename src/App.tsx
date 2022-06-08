import React, { useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  var circleArray: Circle[] = [];
  type mouseInterface = {
    x: number | undefined,
    y: number | undefined,
  }
  var mouse: mouseInterface = {
    x: undefined,
    y: undefined
  }
  var maxRadius: number = 30;
  var minRadius: number = 5;
  var init = (c: CanvasRenderingContext2D | null | undefined) => {
    for (let i = 0; i < 800; i++) {
      var radius: number = Math.floor(Math.random() * 3 + 1);
      var x: number = Math.random() * (window.innerWidth - radius * 2) + radius;
      var y: number = Math.random() * (window.innerHeight - radius * 2) + radius;
      var randx: number = (Math.random() - 0.5) * 2;
      var randy: number = (Math.random() - 0.5) * 2;
      var dx: number = randx > 0 ? randx + 1 : randx - 1;
      var dy: number = randy > 0 ? randy + 1 : randy - 1;
      let r = Math.random() * 255;
      let g = Math.random() * 255;
      let b = Math.random() * 255;
      let randColor = `rgb(${r},${g},${b})`;
      circleArray.push(new Circle(c, x, y, radius, dx, dy, randColor));
    }
  }
  class Circle {
    constructor(public c: CanvasRenderingContext2D | null | undefined, public x: number, public y: number, public radius: number, public dx: number, public dy: number, public randColor: string) {
      this.c = c;
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.randColor = randColor;
    }

    draw() {
      this.c?.beginPath();
      this.c?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      this.c!.fillStyle = `${this.randColor}`;
      this.c?.fill();
    }

    update() {
      if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
        this.dx = -this.dx
      }
      if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
        this.dy = -this.dy
      }
      this.x += this.dx;
      this.y += this.dy;

      if (mouse.x && mouse.y) {
        if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
          if (this.radius < maxRadius) {
            this.radius += 1;
          }
        } else if (this.radius > minRadius) {
          this.radius -= 1;
          // console.log('HERE')
        }
      }
      this.draw();
    }
  }

  function animate(c: CanvasRenderingContext2D | null | undefined) {
    requestAnimationFrame(() => animate(c));
    c?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = 0; i < circleArray.length; i++) {
      circleArray[i].update();
    }
  }
  useEffect(() => {
    if (canvas !== null) {
      const c = canvas.current?.getContext('2d');
      window.addEventListener('resize', (e) => {
        canvas.current!.height = window.innerHeight
        canvas.current!.width = window.innerWidth;
        circleArray = [];
        init(c);
      })
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
      })
      canvas.current!.height = window.innerHeight
      canvas.current!.width = window.innerWidth
      init(c);
      animate(c);
    }
    return () => {
      window.removeEventListener('resize', () => { });
    }
  }, []);


  return (
    <canvas ref={canvas}>

    </canvas>
  );
}

export default App;
