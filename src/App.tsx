import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


function App() {
  type Coordinates = [number, number];

  const isMobile = window.innerWidth <= 600;
  const rows = isMobile ? 25 : 20;
  const cols = isMobile ? 20 : 30;
  const cellSize = isMobile ? 16 : 20;
  const width = `${cols * cellSize}px`;
  const height = `${rows * cellSize}px`;

  const startGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
  const startSnake: Coordinates[] = [[3, 1], [3, 2], [3, 3]];

  const [snake, setSnake] = useState(startSnake);
  const [grid, setGrid] = useState(startGrid);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const arrowRef = useRef('right');
  const [prevMove, setPrevMove] = useState('right');
  const [prize, setPrize] = useState(false);
  const [score, setScore] = useState(0);
  const [increase, setIncrease] = useState(false);

  const drawSnake = (snake: Coordinates[]) => {
    setGrid(prev => {
      const newGrid = prev.map(i => [...i]);
      for (let x = 0; x < startSnake.length; x++) { newGrid[snake[x][0]][snake[x][1]] = 1; }
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
          setPrize(false); setScore(score + 1); setIncrease(true);
        }
        newGrid[prev[0][0]][prev[0][1]] = 0;
        newGrid[head[0] + r][head[1] + c] = 1;
        return newGrid;
      });
      if (!increase) newSnake.shift();
      setIncrease(false);
      newSnake.push([head[0] + r, head[1] + c]); //r -row move, c -column move
      return newSnake
    })
  }
  const setMax = () => {
    const value = Number(localStorage.getItem('max'));
    if (value) { localStorage.setItem('max', score > value ? score.toString() : value.toString()); }
    else { localStorage.setItem('max', score.toString()); }
    console.log(localStorage.getItem('max'));
  }

  const reset = () => {
    setMax();
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
    if (isMobile) window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
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
  //for mobile phones: 
  const mobileArrowHandler = (direction: string) => {
    const head = snake[snake.length - 1];
    if (
      direction === 'right' && head[1] + 1 === cols ||
      direction === 'left' && head[1] - 1 === -1 ||
      direction === 'down' && head[0] + 1 === rows ||
      direction === 'up' && head[0] - 1 === -1
    ) {
      fail();
    }
    else {
      if (direction === 'right' && grid[head[0]][head[1] + 1] !== 1) { arrowRef.current = 'right'; }
      if (direction === 'left' && grid[head[0]][head[1] - 1] !== 1) { arrowRef.current = 'left'; }
      if (direction === 'down' && grid[head[0] + 1][head[1]] !== 1) { arrowRef.current = 'down'; }
      if (direction === 'up' && grid[head[0] - 1][head[1]] !== 1) { arrowRef.current = 'up'; }
    }
  }

  useEffect(() => {
    if (start) {
      const moveSnake = setInterval(() => {
        const head = snake[snake.length - 1];
        if (arrowRef.current === 'right' && head[1] < cols) {
          if (prevMove === 'right' && head[1] === cols - 1) fail();
          if (prevMove === 'right' && grid[head[0]][head[1] + 1] === 1) fail();
          else redrawSnake(0, 1);
        }
        if (arrowRef.current === 'left' && head[1] >= -1) {
          if (prevMove === 'left' && head[1] === 0) fail();
          if (prevMove === 'left' && grid[head[0]][head[1] - 1] === 1) fail();
          else redrawSnake(0, -1);
        }
        if (arrowRef.current === 'down' && head[0] <= rows) {
          if (prevMove === 'down' && head[0] === rows - 1) fail();
          if (prevMove === 'down' && grid[head[0] + 1][head[1]] === 1) fail();
          else redrawSnake(1, 0);
        }
        if (arrowRef.current === 'up' && head[0] >= -1) {
          if (prevMove === 'up' && head[0] === 0) fail();
          if (prevMove === 'up' && grid[head[0] - 1][head[1]] === 1) fail();
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

  const max = localStorage.getItem('max');

  return (
    <Box position='relative'>
      <Typography variant='h3' color='limegreen'>SnaKe GamE</Typography>
      {isMobile ? <Typography variant='h6' color='limegreen'>SCORE: {score}{(max !== null && Number(max) !== 0) && `  / MAX:  ${max} `}</Typography> :
        <>
          <Stack position='absolute' top={0} left={0} p={1} width={84} sx={{ backgroundColor: '#E6E6E6', borderRadius: 5 }}>
            <Typography variant='h6' color='limegreen'>MAX</Typography>
            <Typography variant='h6' color='limegreen'>
              {(max !== null && Number(max) !== 0) && max}
            </Typography>
          </Stack>
          <Stack position='absolute' top={0} right={0} p={1} width={84} sx={{ backgroundColor: '#E6E6E6', borderRadius: 5 }}>
            <Typography variant='h6' color='limegreen'>SCORE</Typography>
            <Typography variant='h6' color='limegreen'>
              {score}
            </Typography>
          </Stack>
        </>}
      <Stack width={width} alignItems='center'><Box className="wavy-line" /></Stack >
      {isMobile &&
        <Stack direction='row' pt={3} justifyContent='center' spacing={2}>
          <Button variant='contained' onClick={onStartClick}>{start ? 'Restart' : 'Start'}</Button>
          <Button disabled={!start} variant='contained' onClick={finish}>Finish</Button>
        </Stack >}

      <Stack marginY={2} border='3px solid' borderColor='primary.main' width={width} height={height} justifyContent='center'>
        {start && <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          }}
        >
          {grid.flat().map((cell, index) => (
            <Box
              key={index}
              sx={{
                width: cellSize,
                height: cellSize,
                // border: '1px solid gray',
                backgroundColor: cell === 2 ? 'limegreen' : cell === 1 ? 'primary.main' : 'white'
              }}
            />
          ))}
        </Box>}
        {end && <Typography variant='h2' color='red'>TRY AGAIN</Typography>}
      </Stack >
      {isMobile && <>
        <Button onClick={() => mobileArrowHandler('up')}
          sx={{ width: 130, mt: 1 }} variant='outlined'><ArrowUpwardIcon /></Button>
        <Stack direction='row' justifyContent='space-between'>
          <Button onClick={() => mobileArrowHandler('left')}
            sx={{ width: 130 }} variant='outlined'><ArrowBackIcon /></Button>
          <Button onClick={() => mobileArrowHandler('right')}
            sx={{ width: 130 }} variant='outlined'><ArrowForwardIcon /></Button>
        </Stack>
        <Button onClick={() => mobileArrowHandler('down')}
          sx={{ width: 130, mb: 5 }} variant='outlined'><ArrowDownwardIcon /></Button>
      </>}
      {!isMobile &&
        <Stack direction='row' justifyContent='center' spacing={2}>
          <Button variant='contained' onClick={onStartClick}>{start ? 'Restart' : 'Start'}</Button>
          <Button disabled={!start} variant='contained' onClick={finish}>Finish</Button>
        </Stack >}
    </Box>

  )
}

export default App
