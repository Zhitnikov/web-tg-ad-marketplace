import React, { useRef } from 'react';
import './FileUpload.scss';

interface FileUploadProps {
  onFileSelect: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = 'image/*,video/*',
  multiple = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        className="file-upload-input"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      <button
        type="button"
        className="file-upload-button"
        onClick={handleClick}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="file-upload-icon"
        >
          <path
            d="M3 10L3 13C3 13.5523 3.44772 14 4 14L12 14C12.5523 14 13 13.5523 13 13L13 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 2L8 10M8 2L5 5M8 2L11 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Загрузить
      </button>
    </div>
  );
};

