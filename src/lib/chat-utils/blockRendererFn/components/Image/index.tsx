import * as React from 'react';
import type { FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import { AtomicBlockProps } from '../Atomic';
import type { ChatStore } from '@/lib/chat-utils/types';

interface ImageProps {
  data: {
    src: string;
    name: string;
    width: number;
    height: number;
  };
  offsetKey: string;
  blockProps: AtomicBlockProps;
}

export const ImageBlockType = 'image';

const Image: FC<ImageProps> = ({ data, offsetKey, blockProps }) => {
  const { src, name, width, height } = data;

  const wrapperRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const computeSize = () => {
      const wrapper = wrapperRef.current;
      const maxWidth = blockProps.store.getWrapperWidth?.();
      if (!wrapper || !maxWidth) return;
      let _width = maxWidth ? (width > maxWidth ? maxWidth : width) : width;
      let _height = height * (_width / width);
      if (_height > 300) {
        // max height
        _width *= 300 / _height;
        _height = 300;
      }
      const before = {
        width: wrapper.style.width,
        height: wrapper.style.height
      };

      wrapper.style.width = `${_width}px`;
      wrapper.style.height = `${_height}px`;

      if (before.width !== wrapper.style.width || before.height !== wrapper.style.height) {
        blockProps.store.onResize?.();
      }
    };
    computeSize();
    window.addEventListener('resize', computeSize);
    return () => {
      window.removeEventListener('resize', computeSize);
    };
  });

  const [isError, setIsError] = useState(false);
  const onError = () => {
    setIsError(true);
  };

  const viewerImage: ChatStore['onViewerImage'] = data => {
    blockProps.store?.onViewerImage?.(data);
  };

  const timer = useRef(0);
  const ing = useRef(false);
  const handleTouchEnd = () => {
    // 简易实现移动端双击事件
    const clear = () => {
      ing.current = false;
      clearTimeout(timer.current);
    };
    if (ing.current) {
      clear();
      viewerImage({ src, name });
      return;
    }
    clear();
    ing.current = true;
    timer.current = window.setTimeout(clear, 300);
  };

  return (
    <div ref={wrapperRef}>
      {isError ? (
        <div >图片加载失败</div>
      ) : (
        <img
          onDoubleClick={() => viewerImage({ src, name })}
          onTouchEnd={handleTouchEnd}
          data-offset-key={offsetKey}
          onError={onError}
          title={name}
          src={src}
          alt={name}
        />
      )}
    </div>
  );
};

export default Image;
