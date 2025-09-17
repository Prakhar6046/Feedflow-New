'use client';
import React, { useMemo, useRef } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface PrintPreviewDialogProps {
    open: boolean;
    title?: string;
    html: string | null;
    onClose: () => void;
}

export default function PrintPreviewDialog({ open, title = 'Print Preview', html, onClose }: PrintPreviewDialogProps) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const srcDoc = useMemo(() => {
        if (!html) return '';
        return `<!DOCTYPE html><html><head><meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        body{ margin:0; font-family: Arial, sans-serif; color:#222; }
        .page{ padding:24px; }
        table{ width:100%; border-collapse:collapse; }
        th, td{ border:1px solid #ccc; padding:8px 12px; text-align:left; }
        th{ background:#efefef; }
        @media print {
          .no-print{ display:none !important; }
        }
      </style>
    </head><body><div class="page">${html}</div></body></html>`;
    }, [html]);

    const handlePrint = () => {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentWindow) return;
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers sx={{ height: '70vh' }}>
                <Box sx={{ height: '100%', border: '1px solid #eee' }}>
                    <iframe ref={iframeRef} title="print-preview" style={{ width: '100%', height: '100%', border: '0' }} srcDoc={srcDoc} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">Close</Button>
                <Button onClick={handlePrint} variant="contained" sx={{
                    background: '#fff',
                    color: '#06A19B',
                    fontWeight: 600,
                    padding: '6px 16px',
                    width: 'fit-content',
                    textTransform: 'capitalize',
                    borderRadius: '8px',
                    border: '1px solid #06A19B',
                }}
                >Print</Button>
            </DialogActions>
        </Dialog>
    );
}


