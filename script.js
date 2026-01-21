const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const btnUserA = document.getElementById('btnUserA');
const btnUserB = document.getElementById('btnUserB');
const btnUndo = document.getElementById('btnUndo');
const btnRedo = document.getElementById('btnRedo');
const btnClear = document.getElementById('btnClear');
const activeUserName = document.getElementById('activeUserName');

let isDrawing = false;
let currentUser = 'A';
const userColors = {
    'A': '#1a73e8',
    'B': '#d93025'
};

let strokes = [];
let redoStack = [];
let currentStroke = null;

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < strokes.length; i++) {
        const stroke = strokes[i];

        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (stroke.points.length > 0) {
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

            for (let j = 1; j < stroke.points.length; j++) {
                ctx.lineTo(stroke.points[j].x, stroke.points[j].y);
            }
        }
        ctx.stroke();
    }
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;

    currentStroke = {
        user: currentUser,
        color: userColors[currentUser],
        points: []
    };

    currentStroke.points.push({ x: e.offsetX, y: e.offsetY });
    strokes.push(currentStroke);
    redoStack = [];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    currentStroke.points.push({ x: e.offsetX, y: e.offsetY });
    redrawCanvas();
});

window.addEventListener('mouseup', () => {
    isDrawing = false;
});

btnUserA.addEventListener('click', () => {
    currentUser = 'A';
    activeUserName.innerText = 'User A';
    btnUserA.classList.add('active');
    btnUserB.classList.remove('active');
});

btnUserB.addEventListener('click', () => {
    currentUser = 'B';
    activeUserName.innerText = 'User B';
    btnUserB.classList.add('active');
    btnUserA.classList.remove('active');
});

btnUndo.addEventListener('click', () => {
    if (strokes.length > 0) {
        const lastStroke = strokes.pop();
        redoStack.push(lastStroke);
        redrawCanvas();
    }
});

btnRedo.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const restoredStroke = redoStack.pop();
        strokes.push(restoredStroke);
        redrawCanvas();
    }
});

btnClear.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear EVERYTHING?')) {
        strokes = [];
        redoStack = [];
        redrawCanvas();
    }
});

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);