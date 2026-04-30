import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUploadCSV } from '@/hooks/useApi';

interface FileUploadProps {
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const uploadMutation = useUploadCSV();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    multiple: false,
    noClick: false // Allow file selection but prevent during upload
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadMutation.mutateAsync({ 
        file: uploadedFile,
        userId: 'user'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        onUploadSuccess?.(result.data);
        setTimeout(() => {
          setUploadedFile(null);
          setUploadProgress(0);
          setIsUploading(false);
        }, 2000);
      } else {
        onUploadError?.(result.error || 'Upload failed');
        setUploadProgress(0);
        setIsUploading(false);
      }
    } catch (error: any) {
      onUploadError?.(error.message || 'Upload failed');
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    uploadMutation.reset();
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          
          {!uploadedFile ? (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your CSV file here' : 'Upload your financial data'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports CSV files up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-medium">{uploadedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
              
              {uploadProgress === 100 && uploadMutation.data?.success && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Upload successful!</span>
                </div>
              )}
              
              {uploadMutation.error && (
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {uploadMutation.error instanceof Error 
                      ? uploadMutation.error.message 
                      : 'Upload failed'
                    }
                  </span>
                </div>
              )}
              
              {!isUploading && uploadProgress !== 100 && (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }} 
                  className="mt-4"
                >
                  Upload File
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p className="font-medium mb-1">Expected CSV format:</p>
          <p>date, description, amount, category (optional)</p>
          <p>Example: 2024-01-15, Client Payment, 5000, Sales</p>
        </div>
      </CardContent>
    </Card>
  );
}
