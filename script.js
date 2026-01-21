/**
 * Real-Time Drawing Canvas Simulation
 * -----------------------------------
 * This script handles the drawing logic, user switching, and undo/redo functionality.
 */

// 1. SELECTING ELEMENTS FROM THE PAGE
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const btnUserA = document.getElementById('btnUserA');
const btnUserB = document.getElementById('btnUserB');
const btnUndo = document.getElementById('btnUndo');
const btnRedo = document.getElementById('btnRedo');
const btnClear = document.getElementById('btnClear');
const activeUserName = document.getElementById('activeUserName');

// 2. SETTING UP INITIAL VARIABLES
let isDrawing = false;
let currentUser = 'A'; // Start as User A
const userColors = {
    'A': '#1a73e8', // Blue
    'B': '#d93025'  // Red
};

// This array stores ALL the drawings (strokes)
let strokes = []; 
// This array stores strokes that were removed by "Undo" so we can "Redo" them
let redoStack = [];
// This stores points for the stroke currently being drawn
let currentStroke = null;

// Adjust canvas size to fill the screen space
function resizeCanvas() {
    // We make the canvas size match its visual size on the screen
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    // Redraw everything whenever the window is resized
    redrawCanvas();
}

// 3. CORE DRAWING FUNCTIONS

// This function clears the canvas and draws everything from the 'strokes' array
function redrawCanvas() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through every stroke in our history
    for (let i = 0; i < strokes.length; i++) {
        const stroke = strokes[i];
        
        // Start a new line
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Move to the first point of the stroke
        if (stroke.points.length > 0) {
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            
            // Draw a line to every other point in this stroke
            for (let j = 1; j < stroke.points.length; j++) {
                ctx.lineTo(stroke.points[j].x, stroke.points[j].y);
            }
        }
        ctx.stroke();
    }
}

// 4. MOUSE EVENT LISTENERS

// When mouse is pressed down
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    
    // Create a new stroke object
    currentStroke = {
        user: currentUser,
        color: userColors[currentUser],
        points: []
    };
    
    // Record the first point
    currentStroke.points.push({ x: e.offsetX, y: e.offsetY });
    
    // Add this new stroke to our main 'strokes' history
    strokes.push(currentStroke);
    
    // Since we started a new drawing, the "Redo" history should be cleared
    redoStack = []; 
});

// When mouse moves on the canvas
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    // Record the mouse position
    currentStroke.points.push({ x: e.offsetX, y: e.offsetY });
    
    // Redraw the canvas to show the line as we move
    redrawCanvas();
});

// When mouse is released
window.addEventListener('mouseup', () => {
    isDrawing = false;
});

// 5. BUTTON CONTROLS

// Switch to User A
btnUserA.addEventListener('click', () => {
    currentUser = 'A';
    activeUserName.innerText = 'User A';
    
    // Update button styling
    btnUserA.classList.add('active');
    btnUserB.classList.remove('active');
});

// Switch to User B
btnUserB.addEventListener('click', () => {
    currentUser = 'B';
    activeUserName.innerText = 'User B';
    
    // Update button styling
    btnUserB.classList.add('active');
    btnUserA.classList.remove('active');
});

// Undo Logic
btnUndo.addEventListener('click', () => {
    if (strokes.length > 0) {
        // Remove the last stroke and save it in the redo stack
        const lastStroke = strokes.pop();
        redoStack.push(lastStroke);
        
        // Redraw everything
        redrawCanvas();
    }
});

// Redo Logic
btnRedo.addEventListener('click', () => {
    if (redoStack.length > 0) {
        // Take the last thing from redo stack and put it back in strokes
        const restoredStroke = redoStack.pop();
        strokes.push(restoredStroke);
        
        // Redraw everything
        redrawCanvas();
    }
});

// Clear Logic
btnClear.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear EVERYTHING?')) {
        strokes = [];
        redoStack = [];
        redrawCanvas();
    }
});

// Initialization
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
