'use client';
import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, Button, Menu, MenuItem, Divider, Stack, Typography,
    Box,
    Tooltip
} from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import FeatureIcon from '@/public/features-svgrepo-com.svg';
import unFeatureIcon from '@/public/features-svgrepo-com 1.svg';
import Image from 'next/image';
interface ProductionSystem {
    id: string;
    name: string;
    createdAt: string;
    isFeatured: boolean;
}

type Order = 'asc' | 'desc';
interface HeadCell { id: keyof ProductionSystem; label: string; }

const headCells: HeadCell[] = [
    { id: 'name', label: 'Name' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'id', label: 'Actions' },
];

export default function ProductionSystemTable() {
    const [data, setData] = useState<ProductionSystem[]>([]);
    console.log('datadatadatadatadata', data);
    const router = useRouter();
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof ProductionSystem>('name');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const token = getCookie('auth-token');
    const fetchData = async () => {
        const res = await fetch('/api/production-system', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        setData(await res.json());
    };

    useEffect(() => { fetchData(); }, []);

    const handleRequestSort = (property: keyof ProductionSystem) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        const sorted = [...data].sort((a, b) => {
            const orderType = isAsc ? 1 : -1;
            return a[property] < b[property] ? -1 * orderType : a[property] > b[property] ? 1 * orderType : 0;
        });
        setData(sorted);
    };

    const handleMenu = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        setAnchorEl(e.currentTarget);
        setSelectedId(id);
    };
    const handleClose = () => { setAnchorEl(null); setSelectedId(null); };

    const handleDelete = async () => {
        if (!selectedId) return;
        const res = await fetch(`/api/production-systems/${selectedId}`, { method: 'DELETE' });
        const result = await res.json();
        if (res.ok) {
            toast.success(result.message);
            fetchData();
        } else toast.error(result.error);
        handleClose();
    };

    const handleEdit = () => {
        if (!selectedId) return;
        router.push(`/dashboard/growthModel/species-production-system/editProductionSystem/${selectedId}`);
    };
    const handleToggleFeatured = async () => {
        if (!selectedId) return;
        try {
            const res = await fetch(`/api/production-system/${selectedId}/feature`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const result = await res.json();
            if (res.ok) {
                toast.success(result.message);
                fetchData();
            } else {
                toast.error(result.error);
            }
        } catch (err) {
            toast.error("Error toggling feature");
        }
        handleClose();
    };


    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '14px', boxShadow: '0px 0px 16px 5px #0000001A', mt: 4 }}>
            <TableContainer sx={{ maxHeight: '72.5vh' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell, idx) => (
                                <TableCell
                                    key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : false}
                                    sx={{
                                        borderBottom: 0,
                                        color: '#67737F',
                                        background: '#F5F6F8',
                                        fontSize: { md: 16, xs: 14 },
                                        fontWeight: 600,
                                        paddingLeft: idx === 0 ? { lg: 10, md: 7, xs: 4 } : 0,
                                    }}
                                >
                                    {headCell.id !== 'id' ? (
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(headCell.id)}
                                        >
                                            {headCell.label}
                                        </TableSortLabel>
                                    ) : headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length ? data.map((item, i) => (
                            <TableRow key={i}>
                                <TableCell sx={{ borderBottomColor: '#F5F6F8', borderBottomWidth: 2, color: '#555555', fontWeight: 500, paddingLeft: { lg: 10, md: 7, xs: 4 } }}>
                                    <Stack display={"flex"} alignItems={"center"} gap={1} direction="row">
                                        {item.isFeatured && (
                                            <Tooltip title="Featured">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                                    <g fill="none">
                                                        <g clip-path="url(#SVGwDJxaeOQ)">
                                                            <path fill="#06A19B" d="M21.95 10.605a1.75 1.75 0 0 1-.5.86l-3.3 3.22a.4.4 0 0 0-.08.12a.3.3 0 0 0 0 .14l.78 4.56c.065.336.03.684-.1 1a1.65 1.65 0 0 1-.61.77a1.83 1.83 0 0 1-.92.35h-.13a1.8 1.8 0 0 1-.84-.21l-4.1-2.14a.28.28 0 0 0-.28 0l-4.1 2.15a1.9 1.9 0 0 1-1 .21a1.83 1.83 0 0 1-.93-.35a1.75 1.75 0 0 1-.61-.78a1.8 1.8 0 0 1-.1-1l.78-4.55a.23.23 0 0 0 0-.14a.4.4 0 0 0-.07-.12l-3.3-3.24a1.8 1.8 0 0 1-.49-.85a1.75 1.75 0 0 1 0-1a1.81 1.81 0 0 1 1.49-1.21l4.5-.66a.18.18 0 0 0 .12-.05a.3.3 0 0 0 .09-.11l2.1-4.18c.143-.3.369-.553.65-.73a1.79 1.79 0 0 1 2.57.74l2.08 4.16a.4.4 0 0 0 .1.12a.2.2 0 0 0 .13.05l4.57.66c.332.05.644.192.9.41c.251.217.441.496.55.81c.106.32.124.662.05.99" stroke-width="0.5" stroke="#06A19B" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="SVGwDJxaeOQ">
                                                                <path fill="#fff" d="M2 2.395h20v19.21H2z" />
                                                            </clipPath>
                                                        </defs>
                                                    </g>
                                                </svg>
                                            </Tooltip>
                                        )}
                                        {item.name}
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ borderBottomColor: '#F5F6F8', borderBottomWidth: 2, color: '#555555', fontWeight: 500, pl: 0 }}>
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell sx={{ borderBottomColor: '#F5F6F8', borderBottomWidth: 2 }}>
                                    <Button onClick={(e) => handleMenu(e, item.id)} sx={{ background: 'transparent', color: '#555555', boxShadow: 'none' }}>
                                        ⋮
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} sx={{ textAlign: 'center' }}>No Data Found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        minWidth: 140,
                        paddingY: 1,
                        overflow: 'hidden',
                    },
                }}
            >
                <MenuItem
                    sx={{
                        px: 2,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#F0F4FF',
                            svg: { color: '#1E40AF' },
                            '.edit-text': { color: '#1E40AF' },
                        },
                    }}
                    onClick={handleEdit} >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            component="svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            sx={{ color: '#060606ff' }}
                        >
                            <path d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" />
                        </Box>
                        <Typography sx={{ fontSize: '14px', color: '#080808ff' }}>
                            Edit
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    sx={{
                        px: 2,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#F0F4FF',
                            svg: { color: '#1E40AF' },
                            '.feature-text': { color: '#1E40AF' },
                        },
                    }}
                    onClick={handleToggleFeatured}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {data.find(s => s.id === selectedId)?.isFeatured ? (
                            <Image
                                src={FeatureIcon}
                                alt="Feature Icon"
                                width={16}
                                height={16}
                                className="feature-icon"
                                style={{ color: '#060606ff' }}
                            />
                        ) : (
                            <Image
                                src={unFeatureIcon}
                                alt="Feature Icon"
                                width={16}
                                height={16}
                                className="feature-icon"
                                style={{ color: '#060606ff' }}
                            />
                        )}
                        <Typography className="feature-text" sx={{ fontSize: '14px', color: '#080808ff' }}>
                            {data.find(s => s.id === selectedId)?.isFeatured ? "Unfeature" : "Feature"}
                        </Typography>
                    </Stack>
                </MenuItem>
                {/* <Divider />
                <MenuItem
                    sx={{
                        px: 2,
                        py: 1,
                        '&:hover': {
                            backgroundColor: '#FFF1F1',
                            svg: { color: '#D32F2F' },
                            '.delete-text': { color: '#D32F2F' },
                        },
                    }}
                    onClick={handleDelete}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            component="svg"
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            sx={{ color: '#ff0000', fontWeight: 600 }}
                        >
                            <path d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5q0-.425.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.587 1.413T17 21zM7 6v13h10V6z" />
                        </Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#ff0000' }}>
                            Delete
                        </Typography>
                    </Stack>
                </MenuItem> */}

            </Menu>
        </Paper>
    );
}
