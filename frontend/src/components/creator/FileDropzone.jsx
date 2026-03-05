import React, { useCallback, useState } from 'react';

const FileDropzone = ({ accept, onFileSelected, label, formatText }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    }, [isDragging]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];

            // Basic validation
            if (accept) {
                const acceptTypes = accept.split(',').map(type => type.trim());
                const isAccepted = acceptTypes.some(type => {
                    if (type.endsWith('/*')) {
                        return file.type.startsWith(type.replace('/*', ''));
                    }
                    return type === file.type;
                });

                if (!isAccepted) {
                    alert(`Invalid file type. Please upload ${accept}`);
                    return;
                }
            }

            onFileSelected(file);
        }
    }, [accept, onFileSelected]);

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelected(e.target.files[0]);
        }
    };

    return (
        <label
            className={`flex-1 relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
                ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'theme-border hover:border-purple-400 theme-bg-secondary hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept={accept}
                onChange={handleFileInput}
                className="hidden"
                required
            />

            <svg className={`w-10 h-10 mb-3 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>

            <p className={`font-medium text-center ${isDragging ? 'text-purple-500' : 'theme-text-primary'}`}>
                {label}
            </p>
            <p className="text-xs theme-text-tertiary mt-2 text-center">
                Drag and drop or click to browse
            </p>
            {formatText && (
                <p className="text-[10px] theme-text-tertiary mt-1 opacity-75 text-center">
                    {formatText}
                </p>
            )}
        </label>
    );
};

export default FileDropzone;
