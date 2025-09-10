import { useEffect, useState } from 'react';
import './App.css';
import { Box, Button, Stack, Typography } from '@mui/material';


function App() {
  type Coordinates = [number, number];

  const rows = 20; const cols = 30;
  const startGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
  const startSnake: Coordinates[] = [[3, 1], [3, 2], [3, 3]];

  // const [length, setLength] = useState(startSnake.length);
  const [snake, setSnake] = useState(startSnake);
  const [grid, setGrid] = useState(startGrid);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [arrow, setArrow] = useState('right');//the snake set horizontally at the left, starting from 'right'
  const [move, setMove] = useState('right');

  const drawSnake = (snake: Coordinates[]) => {
    setGrid(prev => {
      const newGrid = prev.map(i => [...i]);
      for (let x = 0; x < startSnake.length; x++) { newGrid[snake[x][0]][snake[x][1]] = 1; }
      return newGrid;
    });
  }
  const arrowHandler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') { setArrow('up'); }
    if (e.key === 'ArrowDown') { setArrow('down'); }
    if (e.key === 'ArrowLeft') { setArrow('left'); }
    if (e.key === 'ArrowRight') { setArrow('right'); }
  }
  const redrawSnake = (snake: Coordinates[], startGrid: number[][], r: number, c: number) => {
    setSnake(prev => {
      const newSnake: Coordinates[] = [...prev];
      newSnake.shift();
      const head: Coordinates = prev[prev.length - 1];
      newSnake.push([head[0] + r, head[1] + c]); //r -row move, c -column move
      return newSnake
    })
    setGrid(startGrid);
    drawSnake(snake);
  }
  const reset = () => {
    setStart(false); setEnd(true);
    setGrid(startGrid); setSnake(startSnake);
  }

  const onStartClick = () => {
    setStart(!start); setEnd(false);
    drawSnake(snake);
    setArrow('right'); setMove('right');
  }

  useEffect(() => {
    window.addEventListener('keydown', arrowHandler);
    return () => window.removeEventListener('keydown', arrowHandler);
  }, [arrow, snake, grid]);

  useEffect(() => {
    const head = snake[snake.length - 1];
    if (arrow === 'right' && head[1] < cols && grid[head[0]][head[1] + 1] !== 1) { setMove('right'); }
    if (arrow === 'left' && head[1] >= 0 && grid[head[0]][head[1] - 1] !== 1) { setMove('left'); }
    if (arrow === 'down' && head[0] < rows && grid[head[0] + 1][head[1]] !== 1) { setMove('down'); }
    if (arrow === 'up' && head[0] >= 0 && grid[head[0] - 1][head[1]] !== 1) { setMove('up'); }
    //the 2nd condition checks if it is not going to turn against itself
  }, [arrow]);

  // const validBoundaries = (head: Coordinates) => {
  //   if (head[0] === -1 || head[1] === -1 || head[0] === rows || head[1] === cols) return false;
  //   else return true;
  // }

  useEffect(() => {
    if (start === true) {
      const moveSnake = setInterval(() => {
        const head = snake[snake.length - 1];
        if (move === 'right' && head[1] <= cols) {
          if (head[1] < cols) redrawSnake(snake, startGrid, 0, 1);
          else reset();
        }
        if (move === 'left' && head[1] >= -1) {
          if (head[1] >= 0) redrawSnake(snake, startGrid, 0, -1);
          else reset();
        }
        if (move === 'down' && head[0] <= rows) {
          if (head[0] < rows) redrawSnake(snake, startGrid, 1, 0);
          else reset();
        }
        if (move === 'up' && head[0] >= -1) {
          if (head[0] >= 0) redrawSnake(snake, startGrid, -1, 0);
          else reset();
        }
      }, 100);
      return () => clearInterval(moveSnake);
    }
  }, [start, grid]);

  useEffect(() => {
    console.table(snake[snake.length - 1]);
  }, [snake]);
  return (
    <>
      <Stack mb={2} border='2px solid blue' width='604px' height='404px' justifyContent='center'>
        {start && <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 20px)`,
            gridTemplateRows: `repeat(${rows}, 20px)`,
          }}
        >
          {grid.flat().map((cell, index) => (
            <Box
              key={index}
              sx={{
                width: 20,
                height: 20,
                // border: '1px solid gray',
                backgroundColor: cell === 1 ? 'darkblue' : 'white'
              }}
            />
          ))}
        </Box>}
        {end && <Typography variant='h2' color='red'>TRY AGAIN</Typography>}
      </Stack>
      <Button disabled={start} variant='contained' onClick={onStartClick}>Start</Button>
    </>
  )
}

export default App
