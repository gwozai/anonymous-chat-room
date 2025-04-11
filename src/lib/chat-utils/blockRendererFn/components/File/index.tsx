import * as React from 'react';
import * as styles from './style.module.scss';
import type { FC } from 'react';

interface FileProps {
  data: {
    src: string;
    name: string;
  };
}

export const FileBlockType = 'file';

const File: FC<FileProps> = ({ data }) => {
  return (
    <div>
      <span >文件：</span>
      <span>{data.name}</span>
      <a target="_blank" rel="noopener noreferrer"  href={data.src}>
        点击查看
      </a>
    </div>
  );
};

export default File;
