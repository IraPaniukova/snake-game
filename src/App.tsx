import { useEffect, useRef, useState } from 'react';
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
  const arrowRef = useRef('right');  //the snake set horizontally at the left, starting from 'right'
  const [prevMove, setPrevMove] = useState('right');

  const drawSnake = (snake: Coordinates[]) => {
    setGrid(prev => {
      const newGrid = prev.map(i => [...i]);
      for (let x = 0; x < startSnake.length; x++) { newGrid[snake[x][0]][snake[x][1]] = 1; }  //use length here later
      return newGrid;
    });
  }
  const arrowHandler = (e: KeyboardEvent) => {
    const head = snake[snake.length - 1];
    if (
      e.key === 'ArrowRight' && head[1] + 1 === cols ||
      e.key === 'ArrowLeft' && head[1] - 1 === -1 ||
      e.key === 'ArrowDown' && head[0] + 1 === rows ||
      e.key === 'ArrowUp' && head[0] - 1 === -1
    ) {
      reset();
    }
    else {
      if (e.key === 'ArrowRight' && grid[head[0]][head[1] + 1] !== 1) { arrowRef.current = 'right'; }
      if (e.key === 'ArrowLeft' && grid[head[0]][head[1] - 1] !== 1) { arrowRef.current = 'left'; }
      if (e.key === 'ArrowDown' && grid[head[0] + 1][head[1]] !== 1) { arrowRef.current = 'down'; }
      if (e.key === 'ArrowUp' && grid[head[0] - 1][head[1]] !== 1) { arrowRef.current = 'up'; }
      //the 2nd condition checks if it is not going to turn against itself
    }
  }
  const redrawSnake = (startGrid: number[][], r: number, c: number) => {
    setPrevMove(arrowRef.current);
    setSnake(prev => {
      const newSnake: Coordinates[] = [...prev];
      newSnake.shift();
      const head: Coordinates = prev[prev.length - 1];
      newSnake.push([head[0] + r, head[1] + c]); //r -row move, c -column move
      setGrid(startGrid);
      drawSnake(newSnake);
      return newSnake
    })
  }
  const reset = () => {
    setStart(false); setEnd(true);
    setGrid(startGrid); setSnake(startSnake);
  }

  const onStartClick = () => {
    setStart(!start); setEnd(false);
    drawSnake(snake);
    arrowRef.current = 'right';
  }

  useEffect(() => {
    window.addEventListener('keydown', arrowHandler);
    return () => window.removeEventListener('keydown', arrowHandler);
  }, [snake, grid]);
  useEffect(() => {
    if (start === true) {
      const moveSnake = setInterval(() => {
        const head = snake[snake.length - 1];
        if (arrowRef.current === 'right' && head[1] < cols) {
          if (prevMove === 'right' && head[1] === cols - 1) reset();
          else redrawSnake(startGrid, 0, 1);
        }
        if (arrowRef.current === 'left' && head[1] >= -1) {
          if (prevMove === 'left' && head[1] === 0) reset();
          else redrawSnake(startGrid, 0, -1);
        }
        if (arrowRef.current === 'down' && head[0] <= rows) {
          if (prevMove === 'down' && head[0] === rows - 1) reset();
          else redrawSnake(startGrid, 1, 0);
        }
        if (arrowRef.current === 'up' && head[0] >= -1) {
          if (prevMove === 'up' && head[0] === 0) reset();
          else redrawSnake(startGrid, -1, 0);
        }
      }, 200);
      return () => clearInterval(moveSnake);
    }
  }, [start, grid]);

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
