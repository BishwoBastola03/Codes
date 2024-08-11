// Chat Assistant Logic 
const openChatButton = document.getElementById("openChat");
const chatBox = document.getElementById("chatBox");
const chatCloseButton = document.getElementById("chatCloseButton");
const conversationDisplay = document.getElementById('conversation');
const userInput = document.getElementById('userInput');
const sendMessageButton = document.getElementById('sendMessage');

openChatButton.addEventListener("click", () => {
  chatBox.style.display = "block";
});

chatCloseButton.addEventListener("click", () => {
  chatBox.style.display = "none";
});

sendMessageButton.addEventListener('click', () => {
  const userMessage = getUserInput();
  displayMessage('You:', userMessage);
  const assistantResponse = generateResponse(userMessage);
  displayMessage('Assistant:', assistantResponse);
});

function getUserInput() {
  return userInput.value.trim();
}

function displayMessage(sender, message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = `${sender}: ${message}`;
  conversationDisplay.appendChild(messageElement);
  userInput.value = ''; // Clear the input field
}

function generateResponse(message) {
  // Basic response for now, you'll need more advanced logic
  // to make a smarter assistant.
  return "Hello! I'm still under development. What can I help you with?";
}

// Transparent Box Logic
const openBoxButton = document.getElementById("openBox");
const floatingBox = document.getElementById("floatingBox");
const textContent = document.getElementById("text-content");
const closeButton = document.getElementById("closeButton");

openBoxButton.addEventListener("click", () => {
  floatingBox.style.display = "block";
  openBoxButton.style.display = "none";

  fetch('data.json')
    .then(response => response.json())
    .then(codeData => {
      // Create code entries dynamically
      codeData.forEach(code => {
        const codeEntry = document.createElement("div");
        codeEntry.innerHTML = `
          <strong>Code Name:</strong> ${code.codeName}<br>
          <strong>Link:</strong> <a href="${code.codeLink}" id="code-link">${code.codeLink}</a><br> 
          <strong>Description:</strong> ${code.codeDescription}<br><br>
        `;
        textContent.appendChild(codeEntry);
      });
    });
});

closeButton.addEventListener("click", () => {
  floatingBox.style.display = "none";
  openBoxButton.style.display = "block"; // Show the button again
  textContent.innerHTML = ''; // Clear the textContent div
});


// Sierpinski Triangle Animation Logic 
(async function () {
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let halfWidth = window.innerWidth / 2;
  let halfHeight = window.innerHeight / 2;

  const app = new PIXI.Application();
  await app.init({ antialias: true, resizeTo: window });
  document.getElementById("canvas").appendChild(app.canvas);

  let cont = new PIXI.Container();
  cont.x = halfWidth;
  cont.y = halfHeight;
  app.stage.addChild(cont);

  window.addEventListener("resize", resizeHandler);
  function resizeHandler() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    halfWidth = window.innerWidth / 2;
    halfHeight = window.innerHeight / 2;
    cont.x = halfWidth;
    cont.y = halfHeight;
  }

  class Triangle extends PIXI.Graphics {
    constructor(index = 0) {
      super();
      this.index = index;
      this.ratio = 0;
      this.hasNewPoints = false;
      this.makeLinesArrayProperty();
    }
    makeLinesArrayProperty() {
      let line1 = new PIXI.Graphics();
      let line2 = new PIXI.Graphics();
      let line3 = new PIXI.Graphics();
      this.addChild(line1);
      this.addChild(line2);
      this.addChild(line3);
      this.lines = [line1, line2, line3];
    }
  }

  class SierpinkskiAnimation {
    expandQ = 1.1;
    expandIncrease = 1.006;
    ratioIncrease = 0.01;
    maxRadius = 2000000;
    constructor() {
      this.init();
    }
    init() {
      cont.removeChildren();
      this.startRadius = window.innerHeight / 4;
      this.newPointsArray = [];
      let { point1, point2, point3 } = this.trianglePoints(this.startRadius, {
        x: 0,
        y: 0
      });
      this.newGraphic(point1, point2, point3);
    }
    drawTriangle() {
      this.startRadius *= this.expandIncrease;

      if (this.startRadius > this.maxRadius) {
        this.init();
      }
      let points;
      this.newPointsArray.forEach((item, index) => {
        if (index === 0) {
          const { point1, point2, point3 } = this.trianglePoints(this.startRadius, {
            x: 0,
            y: 0
          });
          points = [point1, point2, point3];
        }
        let temp = this.newPoints(...points, item.graphic);
        points = temp;
      });
    }
    drawLine(x1, y1, x2, y2, ratio, lines, index) {
      lines.clear();
      lines.moveTo(x1, y1);
      x2 = x1 + ratio * (x2 - x1);
      y2 = y1 + ratio * (y2 - y1);
      lines.lineTo(x2, y2);
      lines.stroke({ width: 1, color: 0xffd900 });
    }
    draw = (point1, point2, point3, graphic) => {
      this.drawLine(
        point1.x,
        point1.y,
        point2.x,
        point2.y,
        graphic.ratio,
        graphic.lines[0],
        graphic.index
      );
      this.drawLine(
        point2.x,
        point2.y,
        point3.x,
        point3.y,
        graphic.ratio,
        graphic.lines[1],
        graphic.index
      );
      this.drawLine(
        point3.x,
        point3.y,
        point1.x,
        point1.y,
        graphic.ratio,
        graphic.lines[2],
        graphic.index
      );
      if (graphic.ratio < 1) {
        graphic.ratio += this.ratioIncrease;
      } else if (!graphic.hasNewPoints) {
        console.log("make new graphic");
        graphic.hasNewPoints = true;
        this.newGraphic(point1, point2, point3);
      }
    };
    newGraphic(point1, point2, point3) {
      let temp = new Triangle(this.newPointsArray.length);
      this.newPointsArray.push({
        graphic: temp,
        origPoints: [point1, point2, point3]
      });
      cont.addChild(temp);
    }
    newPoints(point1, point2, point3, graphic) {
      let newPoint1 = {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2
      };
      let newPoint2 = {
        x: (point2.x + point3.x) / 2,
        y: (point2.y + point3.y) / 2
      };
      let newPoint3 = {
        x: (point1.x + point3.x) / 2,
        y: (point1.y + point3.y) / 2
      };
      graphic.clear();
      graphic.circle(newPoint1.x, newPoint1.y, 2);
      graphic.circle(newPoint2.x, newPoint2.y, 2);
      graphic.circle(newPoint3.x, newPoint3.y, 2);
      graphic.fill(0xffffff, 1);
      this.draw(newPoint1, newPoint2, newPoint3, graphic);
      return [newPoint1, newPoint2, newPoint3];
    }
    trianglePoints(radius, centerPoint) {
      let point1 = {
        x: radius * Math.cos(0) + centerPoint.x,
        y: radius * Math.sin(0) + centerPoint.y
      };
      let point2 = {
        x: radius * Math.cos((1 / 3) * (2 * Math.PI)) + centerPoint.x,
        y: radius * Math.sin((1 / 3) * (2 * Math.PI)) + centerPoint.y
      };
      let point3 = {
        x: radius * Math.cos((2 / 3) * (2 * Math.PI)) + centerPoint.x,
        y: radius * Math.sin((2 / 3) * (2 * Math.PI)) + centerPoint.y
      };
      return { point1, point2, point3 };
    }
  }

  let t = new SierpinkskiAnimation();

  app.ticker.add((time) => {
    cont.rotation += 0.01;
    t.drawTriangle();
  });
})();