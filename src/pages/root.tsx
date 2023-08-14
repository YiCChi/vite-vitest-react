import { Gird } from './grid';

const d = {
  header: Array(100)
    .fill(0)
    .map((_, colIdx) => ({ content: `header${colIdx + 1}`, colIdx })),
  rows: Array(100)
    .fill(0)
    .map((_, rowIdx) => ({
      items: Array(100)
        .fill(0)
        .map((_, colIdx) => ({ content: `row${rowIdx + 1} col${colIdx + 1}`, colIdx })),
      rowIdx,
    })),
};

function Component() {
  return (
    <Gird
      data={d}
      height={300}
      width={1100}
      columnWidth={(colIdx) => (colIdx % 2 === 0 ? 100 : 150)}
    />
  );
}

Component.displayName = 'Root';

export { Component };
