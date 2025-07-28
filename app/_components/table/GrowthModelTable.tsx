'use client';
import { breadcrumsAction } from '@/lib/features/breadcrum/breadcrumSlice';
import { useAppDispatch } from '@/lib/hooks';
import {
    Box,
    Button,
    Divider,
    Menu,
    MenuItem,
    Stack,
    TableSortLabel,
    Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { selectRole } from '@/lib/features/user/userSlice';
import { useAppSelector } from '@/lib/hooks';
import { getLocalItem } from '@/app/_lib/utils';
import Loader from '../Loader';

interface GrowthModel {
    id: number;
    organisationId: number;
    modelId: number;
    createdAt: string;
    updatedAt: string;
    models: {
        id: number;
        name: string;
        specie: string;
        productionSystem: string;
        adcCp: number;
        adcCf: number;
        adcNfe: number;
        geCp: number;
        geCf: number;
        geNfe: number;
        wasteFactor: number;
        temperatureCoefficient: string;
        tgcA: number;
        tgcB: number;
        tgcC: number;
        tgcD?: number;
        tgcE?: number;
        tFCRModel: string;
        tFCRa: number;
        tFCRb: number;
        tFCRc: number;
        createdAt: string;
        updatedAt: string;
    };
    organisation?: {
        name: string;
    };
}

interface Props {
    tableData: {
        id: string;
        numeric: boolean;
        disablePadding: boolean;
        label: string;
    }[];
    growthModels?: GrowthModel[];
    permisions: boolean;
}

export default function GrowthModelTable({
    tableData,
    growthModels,
    permisions,
}: Props) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null,
    );
    const pathName = usePathname();
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [selectedGrowthModel, setSelectedGrowthModel] = useState<GrowthModel>();
    const role = useAppSelector(selectRole);
    const [sortedGrowthModels, setSortedGrowthModels] = useState<GrowthModel[]>();
    const [sortDataFromLocal, setSortDataFromLocal] = React.useState<any>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (pathName) {
            setSortDataFromLocal(getLocalItem(pathName));
        }
    }, [pathName]);

    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement>,
        model: GrowthModel,
    ) => {
        setAnchorEl(event.currentTarget);
        setSelectedGrowthModel(model);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        if (selectedGrowthModel) {
            router.push(`/dashboard/growthModel/${selectedGrowthModel.models.id}`);
        }
        handleClose();
    };

    const handleDelete = async () => {
        if (selectedGrowthModel) {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/growth-model?id=${selectedGrowthModel.models.id}`,
                    {
                        method: 'DELETE',
                    },
                );

                if (response.ok) {
                    router.refresh();
                } else {
                    console.error('Failed to delete growth model');
                }
            } catch (error) {
                console.error('Error deleting growth model:', error);
            } finally {
                setLoading(false);
            }
        }
        handleClose();
    };

    function EnhancedTableHead(data: any) {
        const createSortHandler =
            (property: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
                handleRequestSort(event, property);
            };

        return (
            <TableHead>
                <TableRow>
                    {tableData.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : undefined}
                            sx={{
                                backgroundColor: '#F5F6F8',
                                color: '#555555',
                                fontWeight: 600,
                                fontSize: '14px',
                                borderBottomColor: '#F5F6F8',
                                borderBottomWidth: 2,
                                textWrap: 'nowrap',
                                paddingLeft: {
                                    lg: 10,
                                    md: 7,
                                    xs: 4,
                                },
                            }}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                                sx={{
                                    '&.MuiTableSortLabel-active': {
                                        color: '#555555',
                                    },
                                    '& .MuiTableSortLabel-icon': {
                                        color: '#555555',
                                    },
                                }}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

    const handleRequestSort = (
        _: React.MouseEvent<HTMLButtonElement> | null,
        property: string,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        if (growthModels) {
            const sortedData = [...growthModels].sort(
                (model1: GrowthModel, model2: GrowthModel) => {
                    const orderType = order === 'asc' ? 1 : -1;
                    if (property === 'name') {
                        if (model1.models.name < model2.models.name) return -1 * orderType;
                        if (model1.models.name > model2.models.name) return 1 * orderType;
                        return 0;
                    } else if (property === 'specie') {
                        if (model1.models.specie < model2.models.specie) return -1 * orderType;
                        if (model1.models.specie > model2.models.specie) return 1 * orderType;
                        return 0;
                    } else if (property === 'productionSystem') {
                        if (model1.models.productionSystem < model2.models.productionSystem) return -1 * orderType;
                        if (model1.models.productionSystem > model2.models.productionSystem) return 1 * orderType;
                        return 0;
                    } else if (property === 'createdAt') {
                        if (model1.createdAt < model2.createdAt) return -1 * orderType;
                        if (model1.createdAt > model2.createdAt) return 1 * orderType;
                        return 0;
                    }
                    return 0;
                },
            );
            setSortedGrowthModels(sortedData);
        }
    };

    const open = Boolean(anchorEl);

    useEffect(() => {
        if (sortDataFromLocal) {
            const data = sortDataFromLocal;
            setOrder(data.direction);
            setOrderBy(data.column);
            if (growthModels) {
                const sortedData = [...growthModels].sort(
                    (model1: GrowthModel, model2: GrowthModel) => {
                        const orderType = data.direction === 'asc' ? -1 : 1;
                        if (data.column === 'name') {
                            if (model1.models.name < model2.models.name) return -1 * orderType;
                            if (model1.models.name > model2.models.name) return 1 * orderType;
                            return 0;
                        } else if (data.column === 'specie') {
                            if (model1.models.specie < model2.models.specie) return -1 * orderType;
                            if (model1.models.specie > model2.models.specie) return 1 * orderType;
                            return 0;
                        } else if (data.column === 'productionSystem') {
                            if (model1.models.productionSystem < model2.models.productionSystem) return -1 * orderType;
                            if (model1.models.productionSystem > model2.models.productionSystem) return 1 * orderType;
                            return 0;
                        } else if (data.column === 'createdAt') {
                            if (model1.createdAt < model2.createdAt) return -1 * orderType;
                            if (model1.createdAt > model2.createdAt) return 1 * orderType;
                            return 0;
                        }
                        return 0;
                    },
                );
                setSortedGrowthModels(sortedData);
            }
        }
    }, [sortDataFromLocal]);

    useEffect(() => {
        if (growthModels && !sortDataFromLocal) {
            setSortedGrowthModels(growthModels);
        }
    }, [growthModels]);

    useEffect(() => {
        router.refresh();
    }, [router]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Paper
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: '14px',
                        boxShadow: '0px 0px 16px 5px #0000001A',
                        mt: 4,
                    }}
                >
                    <TableContainer
                        sx={{
                            maxHeight: '72.5vh',
                            overflow: 'auto',
                        }}
                    >
                        <Table stickyHeader aria-label="sticky table">
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                            />
                            <TableBody>
                                {sortedGrowthModels && sortedGrowthModels.length > 0 ? (
                                    sortedGrowthModels.map((model: GrowthModel, i: number) => {
                                        return (
                                            <TableRow
                                                key={i}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        borderBottomColor: '#F5F6F8',
                                                        borderBottomWidth: 2,
                                                        color: '#555555',
                                                        fontWeight: 500,
                                                        textWrap: 'nowrap',
                                                        paddingLeft: {
                                                            lg: 10,
                                                            md: 7,
                                                            xs: 4,
                                                          },
                                                    }}
                                                >
                                                    {model.models.name}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottomColor: '#F5F6F8',
                                                        borderBottomWidth: 2,
                                                        color: '#555555',
                                                        fontWeight: 500,
                                                        textWrap: 'nowrap',
                                                          paddingLeft: {
                                                            lg: 10,
                                                            md: 7,
                                                            xs: 4,
                                                          },
                                                    }}
                                                >
                                                    {model.models.specie}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottomColor: '#F5F6F8',
                                                        borderBottomWidth: 2,
                                                        color: '#555555',
                                                        fontWeight: 500,
                                                        textWrap: 'nowrap',
                                                        paddingLeft: {
                                                            lg: 10,
                                                            md: 7,
                                                            xs: 4,
                                                          },
                                                    }}
                                                >
                                                    {model.models.productionSystem}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        borderBottomColor: '#F5F6F8',
                                                        borderBottomWidth: 2,
                                                        color: '#555555',
                                                        fontWeight: 500,
                                                        textWrap: 'nowrap',
                                                        paddingLeft: {
                                                            lg: 10,
                                                            md: 7,
                                                            xs: 4,
                                                          },
                                                    }}
                                                >
                                                    {new Date(model.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                {(role === 'SUPERADMIN' || permisions) && (
                                                    <TableCell
                                                        sx={{
                                                            borderBottomColor: '#F5F6F8',
                                                            borderBottomWidth: 2,
                                                            color: '#555555',
                                                            fontWeight: 500,
                                                            textWrap: 'nowrap',
                                                            paddingLeft: {
                                                                lg: 10,
                                                                md: 7,
                                                                xs: 4,
                                                              },
                                                        }}
                                                    >
                                                        <Button
                                                            onClick={(event) => handleClick(event, model)}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                p: 1,
                                                                borderRadius: '8px',
                                                                backgroundColor: '#F5F6F8',
                                                                color: '#555555',
                                                                '&:hover': {
                                                                    backgroundColor: '#E8E9EB',
                                                                },
                                                            }}
                                                        >
                                                            <Box
                                                                component="svg"
                                                                width={20}
                                                                height={20}
                                                                viewBox="0 0 24 24"
                                                                fill="currentColor"
                                                            >
                                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                            </Box>
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={tableData.length}
                                            sx={{
                                                textAlign: 'center',
                                                color: '#555555',
                                                fontWeight: 500,
                                                py: 4,
                                            }}
                                        >
                                            No Data Found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                                minWidth: 120,
                            },
                        }}
                    >
                        <MenuItem onClick={handleEdit}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                    component="svg"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    sx={{ color: '#555555' }}
                                >
                                    <path d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" />
                                </Box>
                                <Typography sx={{ fontSize: '14px', color: '#555555' }}>
                                    Edit
                                </Typography>
                            </Stack>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleDelete}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box
                                    component="svg"
                                    width={16}
                                    height={16}
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    sx={{ color: '#FF6B6B' }}
                                >
                                    <path d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5q0-.425.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.587 1.413T17 21zM7 6v13h10V6z" />
                                </Box>
                                <Typography sx={{ fontSize: '14px', color: '#FF6B6B' }}>
                                    Delete
                                </Typography>
                            </Stack>
                        </MenuItem>
                    </Menu>
                </Paper>
            )}
        </>
    );
} 