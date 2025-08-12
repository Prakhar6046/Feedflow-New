'use client';
import React, { useEffect, useState } from 'react';
import {
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableSortLabel, Button, Menu, MenuItem, Divider, Stack, Typography, Box
} from '@mui/material';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Species {
    id: string;
    name: string;
    createdAt: string;
}

type Order = 'asc' | 'desc';
interface HeadCell { id: keyof Species; label: string; }

const headCells: HeadCell[] = [
    { id: 'name', label: 'Name' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'id', label: 'Actions' },
];

export default function SpeciesTable() {
    const [data, setData] = useState<Species[]>([]);
    const [order, setOrder] = useState<Order>('asc');
    const router = useRouter();
    const [orderBy, setOrderBy] = useState<keyof Species>('name');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const fetchData = async () => {
        const res = await fetch('/api/species');
        setData(await res.json());
    };

    useEffect(() => { fetchData(); }, []);

    const handleRequestSort = (property: keyof Species) => {
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

    // const handleDelete = async () => {
    //     if (!selectedId) return;
    //     const res = await fetch(`/api/species/${selectedId}`, { method: 'DELETE' });
    //     const result = await res.json();
    //     if (res.ok) {
    //         toast.success(result.message);
    //         fetchData();
    //     } else toast.error(result.error);
    //     handleClose();
    // };

    const handleEdit = () => {
        if (!selectedId) return;
        router.push(`/dashboard/growthModel/species-production-system/editSpecies/${selectedId}`);
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
                                    {item.name}
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
                {/* <Divider /> */}
                {/* <MenuItem onClick={handleDelete}>
                    <Stack direction="row" alignItems="center" gap={1.2}>
                        🗑 <Typography variant="subtitle2" color="#ff0000">Delete</Typography>
                    </Stack>
                </MenuItem> */}
            </Menu>
        </Paper>
    );
}
