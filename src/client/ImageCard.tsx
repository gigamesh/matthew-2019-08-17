import * as React from 'react';

interface ImageCardProps {
  file: FileType;
  handleDelete: (filename: string) => void;
}

export default function ImageCard(props: ImageCardProps) {
  const { file, handleDelete } = props;
  return (
    <div className="fileCard">
      <img className="thumbnail" src={file.thumbnail} alt={file.name} />
      <div className="fileCardRow">
        <span className="fileName">{file.name}</span>
      </div>
      <div className="fileCardRow">
        <span className="fileSize">{file.size}</span>
        <button className="deleteBtn" type="button" onClick={() => handleDelete(file.name)}>
          Delete
        </button>
      </div>
    </div>
  );
}
