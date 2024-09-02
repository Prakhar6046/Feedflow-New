"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Popover, Stack, Typography } from '@mui/material';

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <TableContainer component={Paper} sx={{
            borderRadius: "14px",
            boxShadow: "0px 0px 16px 5px #0000001A",
        }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{
                        background: "#F5F6F8",
                    }}>
                        <TableCell sx={{
                            borderBottom: 0,
                            color: "#67737F",
                            fontSize: {
                                md: 16,
                                xs: 14
                            },
                            fontWeight: 600,
                            paddingLeft: {
                                lg: 10,
                                md: 7,
                                xs: 4
                            }
                        }}>Organizations</TableCell>
                        <TableCell sx={{
                            borderBottom: 0,
                            color: "#67737F",
                            fontSize: {
                                md: 16,
                                xs: 14
                            },
                            fontWeight: 600,
                        }}>Address</TableCell>
                        <TableCell sx={{
                            borderBottom: 0,
                            color: "#67737F",
                            fontSize: {
                                md: 16,
                                xs: 14
                            },
                            fontWeight: 600,
                        }}>Users</TableCell>
                        <TableCell sx={{
                            borderBottom: 0,
                            color: "#67737F",
                            fontSize: {
                                md: 16,
                                xs: 14
                            },
                            fontWeight: 600,
                        }}>Product</TableCell>
                        <TableCell sx={{
                            borderBottom: 0,
                            color: "#67737F",
                            fontSize: {
                                md: 16,
                                xs: 14
                            },
                            fontWeight: 600,
                        }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell sx={{
                                borderBottomColor: "#F5F6F8",
                                borderBottomWidth: 2,
                                color: '#555555',
                                fontWeight: 500,
                                paddingLeft: {
                                    lg: 10,
                                    md: 7,
                                    xs: 4
                                }
                            }} component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell sx={{
                                borderBottomColor: "#F5F6F8",
                                borderBottomWidth: 2,
                                color: '#555555',
                                fontWeight: 500
                            }}>{row.calories}</TableCell>
                            <TableCell sx={{
                                borderBottomColor: "#F5F6F8",
                                borderBottomWidth: 2,
                                color: '#555555',
                                fontWeight: 500
                            }}>{row.fat}</TableCell>
                            <TableCell sx={{
                                borderBottomColor: "#F5F6F8",
                                borderBottomWidth: 2,
                                color: '#555555',
                                fontWeight: 500
                            }}>{row.carbs}</TableCell>
                            <TableCell align='center' sx={{
                                borderBottomColor: "#F5F6F8",
                                borderBottomWidth: 2,
                                color: '#555555',
                                fontWeight: 500,
                            }}>

                                <Button aria-describedby={id} variant="contained" onClick={handleClick}
                                    className='edit-option'
                                    sx={{
                                        background: 'transparent',
                                        color: '#555555',
                                        boxShadow: 'none',
                                    }}>

                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
                                        <path fill="currentColor" d="M9.5 13a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0" />
                                    </svg>

                                </Button>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    className='edit-popover'
                                >
                                    <Stack display="flex" gap={1.2} alignItems='center' direction='row' className='edit-popover-content'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" />
                                        </svg>

                                        <Typography variant='subtitle2'>Edit</Typography>
                                    </Stack>
                                </Popover>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
