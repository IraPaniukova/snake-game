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
  const [prize, setPrize] = useState(false);
  const [score, setScore] = useState(0);

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
      fail();
    }
    else {
      if (e.key === 'ArrowRight' && grid[head[0]][head[1] + 1] !== 1) { arrowRef.current = 'right'; }
      if (e.key === 'ArrowLeft' && grid[head[0]][head[1] - 1] !== 1) { arrowRef.current = 'left'; }
      if (e.key === 'ArrowDown' && grid[head[0] + 1][head[1]] !== 1) { arrowRef.current = 'down'; }
      if (e.key === 'ArrowUp' && grid[head[0] - 1][head[1]] !== 1) { arrowRef.current = 'up'; }
      //the 2nd condition checks if it is not going to turn against itself
    }
  }
  const redrawSnake = (r: number, c: number) => {
    setPrevMove(arrowRef.current);

    setSnake(prev => {
      const newSnake: Coordinates[] = [...prev];
      const head: Coordinates = prev[prev.length - 1];
      setGrid(prevG => {
        const newGrid = prevG.map(i => [...i]);
        if (newGrid[head[0] + r][head[1] + c] === 2) {
          setPrize(false); setScore(score + 1);
        }
        newGrid[prev[0][0]][prev[0][1]] = 0;
        newGrid[head[0] + r][head[1] + c] = 1;
        return newGrid;
      });
      newSnake.shift();
      newSnake.push([head[0] + r, head[1] + c]); //r -row move, c -column move
      return newSnake
    })
  }

  const reset = () => {
    setGrid(startGrid); setSnake(startSnake);
    setPrize(false);
  }
  const finish = () => {
    setStart(false);
    reset();
  }
  const fail = () => {
    setEnd(true);
    finish();
  }

  const onStartClick = () => {
    setStart(true); setEnd(false);
    reset();//the line alllows to use it as a restart too
    drawSnake(startSnake);
    arrowRef.current = 'right';
    setScore(0);
  }

  useEffect(() => {
    window.addEventListener('keydown', arrowHandler);
    return () => window.removeEventListener('keydown', arrowHandler);
  }, [snake, grid]);

  useEffect(() => {
    if (start) {
      const moveSnake = setInterval(() => {
        const head = snake[snake.length - 1];
        if (arrowRef.current === 'right' && head[1] < cols) {
          if (prevMove === 'right' && head[1] === cols - 1) fail();
          else redrawSnake(0, 1);
        }
        if (arrowRef.current === 'left' && head[1] >= -1) {
          if (prevMove === 'left' && head[1] === 0) fail();
          else redrawSnake(0, -1);
        }
        if (arrowRef.current === 'down' && head[0] <= rows) {
          if (prevMove === 'down' && head[0] === rows - 1) fail();
          else redrawSnake(1, 0);
        }
        if (arrowRef.current === 'up' && head[0] >= -1) {
          if (prevMove === 'up' && head[0] === 0) fail();
          else redrawSnake(-1, 0);
        }
      }, 200);
      return () => clearInterval(moveSnake);
    }
  }, [start, grid, prize]);

  useEffect(() => {
    if (start && !prize) {
      const generatePrize = setInterval(() => {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        setGrid(prev => {
          if (prev[r][c] !== 1) {
            const newGrid = prev.map(i => [...i]);
            newGrid[r][c] = 2;
            setPrize(true);
            return newGrid;
          }
          return prev;
        })
      }, 1000);
      return () => clearInterval(generatePrize);
    }
  }, [start, prize]);

  return (
    <Box position='relative'>
      <Typography variant='h3' color='limegreen'>SnaKe GamE</Typography>
      <Stack position='absolute' top={0} right={0} p={1} sx={{ backgroundColor: 'limegreen', borderRadius: 5 }}>
        <Typography variant='h6' color='white'>SCORE</Typography>
        <Typography variant='h6' color='white'>{score}</Typography>
      </Stack>
      <Stack width='600px' alignItems='center'><Box className="wavy-line" /></Stack >

      <Stack marginY={2} border='2px solid blue' width='600px' height='400px' justifyContent='center'>
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
                backgroundColor: cell === 2 ? 'limegreen' : cell === 1 ? 'blue' : 'white'
              }}
            />
          ))}
        </Box>}
        {end && <Typography variant='h2' color='red'>TRY AGAIN</Typography>}
      </Stack >
      <Stack direction='row' justifyContent='center' spacing={2}>
        <Button variant='contained' onClick={onStartClick}>{start ? 'Restart' : 'Start'}</Button>
        <Button disabled={!start} variant='contained' onClick={finish}>Finish</Button>
      </Stack >
    </Box>
  )
}

export default App
