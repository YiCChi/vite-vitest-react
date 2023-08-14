import styled from '@emotion/styled';
import { useState, type UIEvent } from 'react';

const Container = styled.div<{ height: number; width: number }>`
  background-color: white;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  overflow: auto;
  position: relative;
`;

const Item = styled.div<{ left: number; top: number; height: number; width: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  display: 'inline-block';
  border: 1px solid black;
`;

interface ListItem {
  content: string;
  colIdx: number;
}

interface GridSchema {
  header: ListItem[];
  rows: { items: ListItem[]; rowIdx: number }[];
}

interface GridProps {
  data: GridSchema;
  height: number;
  rowHeight?: (rowIdx: number) => number;
  estimateRowHeight?: number;
  width: number;
  columnWidth?: (colIdx: number) => number;
  estimateColumnWidth?: number;
  overScanCount?: number;
}

export function Gird({
  data,
  height,
  rowHeight = () => 30,
  width,
  columnWidth = () => 100,
  overScanCount = 3,
}: GridProps) {
  const rowCount = data.rows.length;
  const columnCount = data.header.length;

  let colEnd = 0;
  let calculatedEstimatedWidth = 0;

  for (; colEnd < columnCount; colEnd++) {
    calculatedEstimatedWidth += columnWidth(colEnd);

    if (calculatedEstimatedWidth >= width) break;
  }

  let rowEnd = 0;
  let calculatedEstimatedHeight = 0;

  for (; rowEnd < rowCount; rowEnd++) {
    calculatedEstimatedHeight += rowHeight(rowEnd);

    if (calculatedEstimatedHeight >= height) break;
  }

  const [horizontalPosition, setHorizontalPosition] = useState({
    start: 0,
    end: colEnd + overScanCount + 2,
  });
  const [verticalPosition, setVerticalPosition] = useState({
    start: 0,
    end: rowEnd + overScanCount + 2,
  });

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, scrollTop } = e.currentTarget;

    let leftCountOffset = 0;
    let widthSum = 0;

    for (; leftCountOffset < columnCount; leftCountOffset++) {
      widthSum += columnWidth(leftCountOffset);

      if (widthSum >= scrollLeft) break;
    }

    let topCountOffset = 0;
    let heightSum = 0;

    for (; topCountOffset < rowCount; topCountOffset++) {
      heightSum += rowHeight(topCountOffset);

      if (heightSum >= scrollTop) break;
    }

    if (leftCountOffset - overScanCount !== horizontalPosition.start) {
      setHorizontalPosition({
        start: Math.max(0, leftCountOffset - overScanCount),
        end: leftCountOffset + colEnd + 2,
      });
    }
    if (topCountOffset - overScanCount !== verticalPosition.start) {
      setVerticalPosition({
        start: Math.max(0, topCountOffset - overScanCount),
        end: topCountOffset + rowEnd + 2,
      });
    }
  };

  return (
    <Container onScroll={onScroll} width={width} height={height}>
      <div
        style={{
          width: `${Array(columnCount)
            .fill(0)
            .map((_, idx) => idx)
            .reduce((pre, curr) => pre + columnWidth(curr), 0)}px`,
          height: `${Array(rowCount)
            .fill(0)
            .map((_, idx) => idx)
            .reduce((pre, curr) => pre + rowHeight(curr), 0)}px`,
        }}
      >
        {data.rows.slice(verticalPosition.start, verticalPosition.end).map((row) => {
          return row.items.slice(horizontalPosition.start, horizontalPosition.end).map((item) => (
            <Item
              key={`${row.rowIdx}-${item.colIdx}`}
              height={rowHeight(row.rowIdx)}
              width={columnWidth(item.colIdx)}
              top={Array(row.rowIdx)
                .fill(0)
                .map((_, idx) => idx)
                .reduce((pre, curr) => pre + rowHeight(curr), 0)}
              left={Array(item.colIdx)
                .fill(0)
                .map((_, idx) => idx)
                .reduce((pre, curr) => pre + columnWidth(curr), 0)}
              data-row={row.rowIdx}
              data-col={item.colIdx}
            >
              &nbsp;{item.content}
            </Item>
          ));
        })}
      </div>
    </Container>
  );
}
