'use client';
import useFileContext from '@/components/providers/FileContextProvider';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
const UploadImage = () => {
  const {files , setFiles} = useFileContext() ;
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };
  return (
    <Dropzone
      maxFiles={1}
      maxSize={1024 * 1024 * 10}
      onDrop={handleDrop}
      onError={console.error}
      src={files}
      accept={{ 'image/*': [] }}
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};
export default UploadImage;